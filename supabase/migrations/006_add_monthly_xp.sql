-- Migration: Add Monthly XP Tracking
-- Description: Add monthly_xp column to profiles table for tracking XP earned per month
-- Date: 2025-10-28

-- ============================================
-- 1. Add Monthly XP Column
-- ============================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS monthly_xp INTEGER DEFAULT 0;

COMMENT ON COLUMN profiles.monthly_xp IS 'XP earned by user in the current month, resets at beginning of each month';

-- ============================================
-- 2. Create Index for Performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_monthly_xp ON profiles(monthly_xp DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_monthly_xp_created ON profiles(monthly_xp DESC, created_at DESC);

COMMENT ON INDEX idx_profiles_monthly_xp IS 'Index for monthly XP leaderboard queries';
COMMENT ON INDEX idx_profiles_monthly_xp_created IS 'Composite index for monthly XP with account age';

-- ============================================
-- 3. Create Function to Reset Monthly XP
-- ============================================

CREATE OR REPLACE FUNCTION reset_monthly_xp()
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  affected_rows INTEGER;
BEGIN
  -- Reset monthly_xp to 0 for all users
  UPDATE profiles
  SET
    monthly_xp = 0,
    updated_at = NOW()
  WHERE monthly_xp > 0;

  GET DIAGNOSTICS affected_rows = ROW_COUNT;

  RETURN affected_rows;
END;
$$;

COMMENT ON FUNCTION reset_monthly_xp IS 'Resets monthly_xp to 0 for all users. Should be called at the start of each month. Returns number of affected rows.';

-- ============================================
-- 4. Create Function to Get Monthly Leaderboard
-- ============================================

CREATE OR REPLACE FUNCTION get_monthly_xp_leaderboard(
  limit_count INTEGER DEFAULT 100,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  user_id UUID,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  monthly_xp INTEGER,
  total_xp INTEGER,
  level INTEGER,
  rank BIGINT
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    id AS user_id,
    name,
    email,
    avatar_url,
    monthly_xp,
    xp_points AS total_xp,
    level,
    ROW_NUMBER() OVER (ORDER BY monthly_xp DESC, xp_points DESC, created_at ASC) AS rank
  FROM profiles
  WHERE monthly_xp > 0
  ORDER BY monthly_xp DESC, xp_points DESC, created_at ASC
  LIMIT limit_count
  OFFSET offset_count;
$$;

COMMENT ON FUNCTION get_monthly_xp_leaderboard IS 'Returns monthly XP leaderboard with user details and ranking. Sorted by monthly_xp DESC, then total xp_points, then account age (older accounts ranked higher)';

-- ============================================
-- 5. Create Function to Get User Monthly Rank
-- ============================================

CREATE OR REPLACE FUNCTION get_user_monthly_rank(user_id UUID)
RETURNS TABLE (
  rank BIGINT,
  monthly_xp INTEGER,
  total_users_with_xp BIGINT
)
LANGUAGE sql
STABLE
AS $$
  WITH ranked_users AS (
    SELECT
      id,
      monthly_xp,
      ROW_NUMBER() OVER (ORDER BY monthly_xp DESC, xp_points DESC, created_at ASC) AS rank
    FROM profiles
    WHERE monthly_xp > 0
  ),
  user_count AS (
    SELECT COUNT(*) AS total FROM profiles WHERE monthly_xp > 0
  )
  SELECT
    ru.rank,
    ru.monthly_xp,
    uc.total AS total_users_with_xp
  FROM ranked_users ru
  CROSS JOIN user_count uc
  WHERE ru.id = user_id;
$$;

COMMENT ON FUNCTION get_user_monthly_rank IS 'Returns the monthly XP rank for a specific user';

-- ============================================
-- 6. Create Trigger to Update Monthly XP
-- ============================================

CREATE OR REPLACE FUNCTION update_monthly_xp_on_xp_change()
RETURNS TRIGGER AS $$
DECLARE
  xp_gained INTEGER;
BEGIN
  -- Calculate XP gained (difference between new and old)
  xp_gained := NEW.xp_points - OLD.xp_points;

  -- Only update monthly_xp if XP increased
  IF xp_gained > 0 THEN
    NEW.monthly_xp := OLD.monthly_xp + xp_gained;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_monthly_xp
  BEFORE UPDATE OF xp_points ON profiles
  FOR EACH ROW
  WHEN (NEW.xp_points <> OLD.xp_points)
  EXECUTE FUNCTION update_monthly_xp_on_xp_change();

COMMENT ON TRIGGER update_monthly_xp ON profiles IS 'Automatically updates monthly_xp when xp_points changes';

-- ============================================
-- 7. Create Function to Add XP (with Monthly Tracking)
-- ============================================

CREATE OR REPLACE FUNCTION add_xp_to_user(
  user_id UUID,
  xp_amount INTEGER,
  reason TEXT DEFAULT 'XP earned'
)
RETURNS TABLE (
  new_total_xp INTEGER,
  new_monthly_xp INTEGER,
  new_level INTEGER
)
LANGUAGE plpgsql
AS $$
DECLARE
  result_total_xp INTEGER;
  result_monthly_xp INTEGER;
  result_level INTEGER;
BEGIN
  -- Update user XP (trigger will automatically update monthly_xp)
  UPDATE profiles
  SET
    xp_points = xp_points + xp_amount,
    updated_at = NOW()
  WHERE id = user_id
  RETURNING xp_points, monthly_xp, level
  INTO result_total_xp, result_monthly_xp, result_level;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User % not found', user_id;
  END IF;

  RETURN QUERY SELECT result_total_xp, result_monthly_xp, result_level;
END;
$$;

COMMENT ON FUNCTION add_xp_to_user IS 'Safely adds XP to a user and returns updated XP totals and level';

-- ============================================
-- 8. Migration Data Update
-- ============================================

-- Set monthly_xp to 0 for all existing users (clean slate for monthly tracking)
UPDATE profiles SET monthly_xp = 0 WHERE monthly_xp IS NULL;

-- ============================================
-- Migration Complete
-- ============================================

COMMENT ON MIGRATION '006_add_monthly_xp' IS 'Adds monthly_xp tracking to profiles with automatic update trigger and leaderboard functions';
