-- Migration: Add full contest schema for creation form
-- Adds missing columns for brand info, dates, prizes, and contest types

-- Create contest_type enum
CREATE TYPE contest_type AS ENUM ('open', 'invite_only');

-- Add missing columns to contests table
ALTER TABLE public.contests
  ADD COLUMN IF NOT EXISTS contest_type contest_type DEFAULT 'open',
  ADD COLUMN IF NOT EXISTS brand_name TEXT,
  ADD COLUMN IF NOT EXISTS brand_email TEXT,
  ADD COLUMN IF NOT EXISTS hashtag TEXT,
  ADD COLUMN IF NOT EXISTS first_prize TEXT,
  ADD COLUMN IF NOT EXISTS second_prize TEXT,
  ADD COLUMN IF NOT EXISTS third_prize TEXT,
  ADD COLUMN IF NOT EXISTS participation_reward INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS start_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS end_date TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS min_followers INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS additional_rules TEXT,
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS application_questions JSONB DEFAULT '[]'::jsonb;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contests_contest_type ON public.contests(contest_type);
CREATE INDEX IF NOT EXISTS idx_contests_start_date ON public.contests(start_date);
CREATE INDEX IF NOT EXISTS idx_contests_end_date ON public.contests(end_date);
CREATE INDEX IF NOT EXISTS idx_contests_featured ON public.contests(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_contests_status_start_date ON public.contests(status, start_date);

-- Add validation constraints
ALTER TABLE public.contests
  ADD CONSTRAINT check_dates_valid CHECK (
    (start_date IS NULL AND end_date IS NULL) OR
    (start_date IS NOT NULL AND end_date IS NOT NULL AND end_date > start_date)
  ),
  ADD CONSTRAINT check_min_followers_positive CHECK (min_followers >= 0),
  ADD CONSTRAINT check_participation_reward_positive CHECK (participation_reward >= 0);

-- Update RLS policies for contest creation
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can insert contests" ON public.contests;
DROP POLICY IF EXISTS "Admins can update contests" ON public.contests;
DROP POLICY IF EXISTS "Admins can delete contests" ON public.contests;
DROP POLICY IF EXISTS "Anyone can view active contests" ON public.contests;

-- Create comprehensive RLS policies
CREATE POLICY "Anyone can view active contests"
  ON public.contests
  FOR SELECT
  USING (status = 'active' OR status = 'completed');

CREATE POLICY "Admins can view all contests"
  ON public.contests
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can insert contests"
  ON public.contests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update contests"
  ON public.contests
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete contests"
  ON public.contests
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Helper function to get contest statistics
CREATE OR REPLACE FUNCTION get_contest_stats(contest_id_param UUID)
RETURNS TABLE (
  total_submissions INTEGER,
  total_participants INTEGER,
  total_views BIGINT,
  total_likes BIGINT,
  avg_engagement NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT cs.id)::INTEGER as total_submissions,
    COUNT(DISTINCT cs.creator_id)::INTEGER as total_participants,
    COALESCE(SUM(cs.views_count), 0) as total_views,
    COALESCE(SUM(cs.likes_count), 0) as total_likes,
    COALESCE(AVG(cs.engagement_score), 0) as avg_engagement
  FROM contest_submissions cs
  WHERE cs.contest_id = contest_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if contest is active
CREATE OR REPLACE FUNCTION is_contest_active(contest_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  contest_status contest_status;
  contest_start TIMESTAMPTZ;
  contest_end TIMESTAMPTZ;
BEGIN
  SELECT status, start_date, end_date
  INTO contest_status, contest_start, contest_end
  FROM contests
  WHERE id = contest_id_param;

  RETURN (
    contest_status = 'active' AND
    (contest_start IS NULL OR contest_start <= NOW()) AND
    (contest_end IS NULL OR contest_end >= NOW())
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to auto-update contest status based on dates
CREATE OR REPLACE FUNCTION auto_update_contest_status()
RETURNS TRIGGER AS $$
BEGIN
  -- If start_date has passed and status is draft, make it active
  IF NEW.start_date IS NOT NULL AND NEW.start_date <= NOW() AND NEW.status = 'draft' THEN
    NEW.status := 'active';
  END IF;

  -- If end_date has passed and status is active, mark as completed
  IF NEW.end_date IS NOT NULL AND NEW.end_date <= NOW() AND NEW.status = 'active' THEN
    NEW.status := 'completed';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating contest status
DROP TRIGGER IF EXISTS trigger_auto_update_contest_status ON public.contests;
CREATE TRIGGER trigger_auto_update_contest_status
  BEFORE INSERT OR UPDATE ON public.contests
  FOR EACH ROW
  EXECUTE FUNCTION auto_update_contest_status();

-- Add comment to table
COMMENT ON TABLE public.contests IS 'Stores contest information including brand details, prizes, rules, and participation requirements';
COMMENT ON COLUMN public.contests.contest_type IS 'Type of contest: open (anyone can join) or invite_only (requires approval)';
COMMENT ON COLUMN public.contests.application_questions IS 'JSONB array of custom questions for invite-only contests';
COMMENT ON COLUMN public.contests.participation_reward IS 'XP points awarded just for participating';
COMMENT ON COLUMN public.contests.featured IS 'Whether this contest is featured on the homepage';
