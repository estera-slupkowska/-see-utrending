-- Migration: Reorganize Badge System with Categories
-- Description: Add badge category enum, create badge_definitions table, and reorganize badges into Legendary/Epic/Rare categories
-- Date: 2025-10-28

-- ============================================
-- 1. Create Badge Category Enum
-- ============================================

DO $$ BEGIN
  CREATE TYPE badge_category AS ENUM ('legendary', 'epic', 'rare');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

COMMENT ON TYPE badge_category IS 'Badge rarity categories: legendary (highest), epic (medium), rare (lowest)';

-- ============================================
-- 2. Create Badge Definitions Table
-- ============================================

CREATE TABLE IF NOT EXISTS badge_definitions (
  id TEXT PRIMARY KEY,
  name_pl TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_pl TEXT NOT NULL,
  description_en TEXT NOT NULL,
  category badge_category NOT NULL,
  xp_reward INTEGER NOT NULL CHECK (xp_reward >= 0),
  icon TEXT,
  color_gradient TEXT,
  condition_type TEXT NOT NULL,
  condition_value INTEGER NOT NULL CHECK (condition_value > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE badge_definitions IS 'Defines all available badges with their requirements and rewards';
COMMENT ON COLUMN badge_definitions.condition_type IS 'Type of condition: contest_views, contest_rank_views, contest_rank_likes, contest_rank_both, platform_views, video_likes, early_adopter';
COMMENT ON COLUMN badge_definitions.condition_value IS 'Threshold value for earning the badge';

-- ============================================
-- 3. Insert New Badge Definitions
-- ============================================

-- Legendary Badges (tylko organiczne wyświetlenia / only organic views)
INSERT INTO badge_definitions (id, name_pl, name_en, description_pl, description_en, category, xp_reward, icon, color_gradient, condition_type, condition_value)
VALUES
  (
    'diamond-creator-contest',
    'Diamentowy Twórca',
    'Diamond Creator',
    'Jeśli łącznie Twoje filmiki w danym konkursie zdobędą więcej niż 1 milion wyświetleń',
    'If your videos in a given contest gain more than 1 million views in total',
    'legendary',
    10000,
    'Crown',
    'from-yellow-400 via-yellow-500 to-orange-500',
    'contest_views',
    1000000
  ),
  (
    'golden-viral',
    'Złoty Viral',
    'Golden Viral',
    'Dodatkowe punkty jeśli Twój filmik ma najwięcej wyświetleń w konkursie!',
    'Bonus points if your video has the most views in the contest!',
    'legendary',
    4000,
    'TrendingUp',
    'from-yellow-500 to-yellow-600',
    'contest_rank_views',
    1
  ),
  (
    'favorite-viral',
    'Ulubiony Viral',
    'Favorite Viral',
    'Dodatkowe punkty jeśli Twój filmik ma najwięcej like-ów w konkursie!',
    'Bonus points if your video has the most likes in the contest!',
    'legendary',
    4000,
    'Heart',
    'from-pink-500 to-rose-600',
    'contest_rank_likes',
    1
  ),
  (
    'silver-viral',
    'Srebrny Viral',
    'Silver Viral',
    'Dodatkowe punkty jeśli Twój filmik ma jako drugi najwięcej wyświetleń lub like-ów w konkursie!',
    'Bonus points if your video is the second most views or likes in the contest!',
    'legendary',
    3000,
    'Award',
    'from-gray-300 to-gray-500',
    'contest_rank_both',
    2
  ),
  (
    'bronze-viral',
    'Brązowy Viral',
    'Bronze Viral',
    'Dodatkowe punkty jeśli Twój filmik jako trzeci ma najwięcej wyświetleń lub like-ów w konkursie!',
    'Bonus points if your video is the third most views or likes in the contest!',
    'legendary',
    2000,
    'Target',
    'from-orange-600 to-amber-700',
    'contest_rank_both',
    3
  );

-- Epic Badges (tylko organiczne wyświetlenia / only organic views)
INSERT INTO badge_definitions (id, name_pl, name_en, description_pl, description_en, category, xp_reward, icon, color_gradient, condition_type, condition_value)
VALUES
  (
    'diamond-creator-platform',
    'Diamentowy Twórca',
    'Diamond Creator',
    'Jeśli łącznie zdobędziesz dla platformy 5 milionów wyświetleń',
    'If you reach 5 million views for the platform',
    'epic',
    10000,
    'Sparkles',
    'from-cyan-400 via-blue-500 to-purple-600',
    'platform_views',
    5000000
  ),
  (
    'red-arrow',
    'Czerwona Strzała',
    'Red Arrow',
    'Dodatkowe punkty jeśli Twój filmik zdobędzie 100K like-ów',
    'Bonus points if your video reaches 100,000 likes',
    'epic',
    2000,
    'Zap',
    'from-red-500 to-red-700',
    'video_likes',
    100000
  );

-- Rare Badges (tylko organiczne wyświetlenia / only organic views)
INSERT INTO badge_definitions (id, name_pl, name_en, description_pl, description_en, category, xp_reward, icon, color_gradient, condition_type, condition_value)
VALUES
  (
    'red-ring',
    'Czerwony Pierścień',
    'Red Ring',
    'Dodatkowe punkty jeśli Twój filmik zdobędzie 10K like-ów',
    'Bonus points if your video reaches 10,000 likes',
    'rare',
    400,
    'Circle',
    'from-red-400 to-pink-500',
    'video_likes',
    10000
  ),
  (
    'golden-thousand',
    'Złoty Tysiąc',
    'Golden Thousand',
    'Dodatkowe punkty jeśli założysz konto jako jedna z pierwszych 1000 osób',
    'Bonus points if you are one of the first 1,000 people to create an account',
    'rare',
    30,
    'Star',
    'from-yellow-400 to-orange-500',
    'early_adopter',
    1000
  );

-- ============================================
-- 4. Create Indexes for Performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_badge_definitions_category ON badge_definitions(category);
CREATE INDEX IF NOT EXISTS idx_badge_definitions_xp_reward ON badge_definitions(xp_reward DESC);
CREATE INDEX IF NOT EXISTS idx_badge_definitions_condition_type ON badge_definitions(condition_type);

-- Create GIN index on profiles.badges if not exists
CREATE INDEX IF NOT EXISTS idx_profiles_badges_gin ON profiles USING gin(badges);

-- ============================================
-- 5. Create Helper Functions
-- ============================================

-- Function to get badge definitions by category
CREATE OR REPLACE FUNCTION get_badges_by_category(cat badge_category)
RETURNS TABLE (
  id TEXT,
  name_pl TEXT,
  name_en TEXT,
  description_pl TEXT,
  description_en TEXT,
  category badge_category,
  xp_reward INTEGER,
  icon TEXT,
  color_gradient TEXT,
  condition_type TEXT,
  condition_value INTEGER
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    id, name_pl, name_en, description_pl, description_en,
    category, xp_reward, icon, color_gradient, condition_type, condition_value
  FROM badge_definitions
  WHERE category = cat
  ORDER BY xp_reward DESC;
$$;

COMMENT ON FUNCTION get_badges_by_category IS 'Returns all badge definitions for a given category (legendary/epic/rare)';

-- Function to get user badges by category
CREATE OR REPLACE FUNCTION get_user_badges_by_category(user_id UUID, cat badge_category)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
  user_badges JSONB;
  badge_def RECORD;
  filtered_badges JSONB := '[]'::jsonb;
BEGIN
  -- Get user's badges from profile
  SELECT badges INTO user_badges
  FROM profiles
  WHERE id = user_id;

  IF user_badges IS NULL THEN
    RETURN '[]'::jsonb;
  END IF;

  -- Filter badges by category
  FOR badge_def IN
    SELECT bd.id
    FROM badge_definitions bd
    WHERE bd.category = cat
  LOOP
    -- Check if user has this badge
    IF user_badges @> jsonb_build_array(jsonb_build_object('id', badge_def.id)) THEN
      filtered_badges := filtered_badges || jsonb_build_array(jsonb_build_object('id', badge_def.id));
    END IF;
  END LOOP;

  RETURN filtered_badges;
END;
$$;

COMMENT ON FUNCTION get_user_badges_by_category IS 'Returns user badges filtered by category';

-- Function to check if user has badge
CREATE OR REPLACE FUNCTION user_has_badge(user_id UUID, badge_id TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT CASE
    WHEN badges IS NULL THEN FALSE
    WHEN jsonb_typeof(badges) != 'array' THEN FALSE
    ELSE badges @> jsonb_build_array(jsonb_build_object('id', badge_id))
  END
  FROM profiles
  WHERE id = user_id;
$$;

COMMENT ON FUNCTION user_has_badge IS 'Checks if user has earned a specific badge';

-- Function to award badge to user
CREATE OR REPLACE FUNCTION award_badge(user_id UUID, badge_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
DECLARE
  badge_exists BOOLEAN;
  already_has_badge BOOLEAN;
  badge_xp INTEGER;
BEGIN
  -- Check if badge definition exists
  SELECT EXISTS(SELECT 1 FROM badge_definitions WHERE id = badge_id) INTO badge_exists;
  IF NOT badge_exists THEN
    RAISE EXCEPTION 'Badge definition % does not exist', badge_id;
  END IF;

  -- Check if user already has the badge
  SELECT user_has_badge(user_id, badge_id) INTO already_has_badge;
  IF already_has_badge THEN
    RETURN FALSE; -- Badge already awarded
  END IF;

  -- Get badge XP reward
  SELECT xp_reward INTO badge_xp FROM badge_definitions WHERE id = badge_id;

  -- Add badge to user profile and update XP
  UPDATE profiles
  SET
    badges = COALESCE(badges, '[]'::jsonb) || jsonb_build_array(
      jsonb_build_object(
        'id', badge_id,
        'earned_at', NOW()
      )
    ),
    xp_points = xp_points + badge_xp,
    updated_at = NOW()
  WHERE id = user_id;

  RETURN TRUE;
END;
$$;

COMMENT ON FUNCTION award_badge IS 'Awards a badge to a user and adds XP reward. Returns TRUE if successful, FALSE if badge already awarded';

-- ============================================
-- 6. Enable Row Level Security
-- ============================================

ALTER TABLE badge_definitions ENABLE ROW LEVEL SECURITY;

-- Everyone can read badge definitions
CREATE POLICY "Badge definitions are viewable by everyone"
  ON badge_definitions
  FOR SELECT
  USING (true);

-- Only admins can modify badge definitions
CREATE POLICY "Only admins can modify badge definitions"
  ON badge_definitions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- 7. Create Trigger for Updated_At
-- ============================================

CREATE OR REPLACE FUNCTION update_badge_definitions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER badge_definitions_updated_at
  BEFORE UPDATE ON badge_definitions
  FOR EACH ROW
  EXECUTE FUNCTION update_badge_definitions_updated_at();

-- ============================================
-- 8. Grant Permissions
-- ============================================

GRANT SELECT ON badge_definitions TO authenticated;
GRANT SELECT ON badge_definitions TO anon;

-- ============================================
-- Migration Complete
-- ============================================

COMMENT ON MIGRATION '005_reorganize_badges' IS 'Reorganizes badge system with categories (Legendary/Epic/Rare) and creates badge_definitions table with helper functions';
