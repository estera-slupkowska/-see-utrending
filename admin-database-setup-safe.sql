-- SeeUTrending Admin Features Database Setup (SAFE VERSION)
-- This script checks for existing objects before creating them
-- Run this script in your Supabase SQL Editor

-- Create types only if they don't exist
DO $$ BEGIN
  CREATE TYPE contest_status AS ENUM ('draft', 'active', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM ('announcement', 'contest_start', 'contest_end', 'winner', 'badge_earned');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Contests table
CREATE TABLE IF NOT EXISTS public.contests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  brand_name text,
  brand_email text,

  -- Contest rules and settings
  hashtag text NOT NULL,
  additional_rules text,
  min_followers integer DEFAULT 0,

  -- Prizes and rewards
  first_prize text,
  second_prize text,
  third_prize text,
  participation_reward integer DEFAULT 10, -- XP points

  -- Timing
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  submission_deadline timestamp with time zone,

  -- Status and metrics
  status contest_status DEFAULT 'draft',
  max_participants integer,
  total_submissions integer DEFAULT 0,
  total_views bigint DEFAULT 0,
  total_likes bigint DEFAULT 0,
  total_comments bigint DEFAULT 0,

  -- Admin fields
  created_by uuid REFERENCES auth.users(id),
  featured boolean DEFAULT false,

  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Contest submissions table
CREATE TABLE IF NOT EXISTS public.contest_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  contest_id uuid REFERENCES public.contests(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- TikTok video data
  tiktok_video_id text NOT NULL,
  tiktok_url text NOT NULL,
  video_title text,
  video_description text,

  -- Metrics (updated via TikTok API)
  views_count bigint DEFAULT 0,
  likes_count bigint DEFAULT 0,
  comments_count bigint DEFAULT 0,
  shares_count bigint DEFAULT 0,

  -- Calculated score (algorithm-based)
  engagement_score decimal DEFAULT 0,
  quality_score decimal DEFAULT 0,
  final_score decimal DEFAULT 0,

  -- Status and moderation
  status submission_status DEFAULT 'pending',
  admin_notes text,
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamp with time zone,

  -- Ranking
  rank_position integer,
  is_winner boolean DEFAULT false,
  prize_awarded text,

  -- Timestamps
  submitted_at timestamp with time zone DEFAULT now(),
  last_updated timestamp with time zone DEFAULT now(),

  UNIQUE(contest_id, user_id, tiktok_video_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  message text NOT NULL,
  type notification_type DEFAULT 'announcement',

  -- Targeting
  target_audience text[], -- ['all', 'creators', 'brands', 'spectators']
  target_users uuid[], -- specific user IDs

  -- Content
  action_url text,
  image_url text,

  -- Status
  published boolean DEFAULT false,
  published_at timestamp with time zone,
  expires_at timestamp with time zone,

  -- Metrics
  total_sent integer DEFAULT 0,
  total_read integer DEFAULT 0,

  -- Admin
  created_by uuid REFERENCES auth.users(id),

  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- User notifications (for tracking read status)
CREATE TABLE IF NOT EXISTS public.user_notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  notification_id uuid REFERENCES public.notifications(id) ON DELETE CASCADE,

  -- Status
  read_at timestamp with time zone,
  clicked_at timestamp with time zone,

  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),

  UNIQUE(user_id, notification_id)
);

-- Landing page content management
CREATE TABLE IF NOT EXISTS public.content_blocks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  section text NOT NULL, -- 'updates', 'hero', 'features'
  title text NOT NULL,
  content text NOT NULL,

  -- Display settings
  priority integer DEFAULT 0,
  visible boolean DEFAULT true,

  -- Styling
  background_color text,
  text_color text,
  icon text,

  -- Admin
  created_by uuid REFERENCES auth.users(id),

  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- TikTok integration data
CREATE TABLE IF NOT EXISTS public.tiktok_accounts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,

  -- TikTok OAuth data
  tiktok_user_id text UNIQUE NOT NULL,
  access_token_encrypted text, -- encrypted access token
  refresh_token_encrypted text, -- encrypted refresh token
  token_expires_at timestamp with time zone,

  -- Account data
  username text NOT NULL,
  display_name text,
  avatar_url text,
  follower_count integer DEFAULT 0,
  following_count integer DEFAULT 0,
  likes_count integer DEFAULT 0,
  video_count integer DEFAULT 0,

  -- Status
  is_verified boolean DEFAULT false,
  is_active boolean DEFAULT true,
  last_sync timestamp with time zone DEFAULT now(),

  -- Timestamps
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Admin activity logs
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id uuid REFERENCES auth.users(id),

  -- Action details
  action text NOT NULL, -- 'create_contest', 'approve_submission', etc.
  entity_type text, -- 'contest', 'user', 'submission'
  entity_id uuid,

  -- Changes made
  old_data jsonb,
  new_data jsonb,

  -- Metadata
  ip_address inet,
  user_agent text,

  -- Timestamp
  created_at timestamp with time zone DEFAULT now()
);

-- Enable Row Level Security (only if not already enabled)
ALTER TABLE public.contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tiktok_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Public contests are viewable by everyone" ON public.contests;
DROP POLICY IF EXISTS "Admins can manage all contests" ON public.contests;
DROP POLICY IF EXISTS "Users can view approved submissions" ON public.contest_submissions;
DROP POLICY IF EXISTS "Users can insert their own submissions" ON public.contest_submissions;
DROP POLICY IF EXISTS "Users can update their own submissions" ON public.contest_submissions;
DROP POLICY IF EXISTS "Admins can manage all submissions" ON public.contest_submissions;
DROP POLICY IF EXISTS "Published notifications are viewable by everyone" ON public.notifications;
DROP POLICY IF EXISTS "Admins can manage all notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can manage their own notification status" ON public.user_notifications;
DROP POLICY IF EXISTS "Visible content blocks are viewable by everyone" ON public.content_blocks;
DROP POLICY IF EXISTS "Admins can manage all content blocks" ON public.content_blocks;
DROP POLICY IF EXISTS "Users can manage their own TikTok account" ON public.tiktok_accounts;
DROP POLICY IF EXISTS "Admins can view all TikTok accounts" ON public.tiktok_accounts;
DROP POLICY IF EXISTS "Admins can view admin logs" ON public.admin_logs;

-- RLS Policies for Contests
CREATE POLICY "Public contests are viewable by everyone" ON public.contests
  FOR SELECT USING (status = 'active' OR status = 'completed');

CREATE POLICY "Admins can manage all contests" ON public.contests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for Contest Submissions
CREATE POLICY "Users can view approved submissions" ON public.contest_submissions
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Users can insert their own submissions" ON public.contest_submissions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions" ON public.contest_submissions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all submissions" ON public.contest_submissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for Notifications
CREATE POLICY "Published notifications are viewable by everyone" ON public.notifications
  FOR SELECT USING (published = true);

CREATE POLICY "Admins can manage all notifications" ON public.notifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for User Notifications
CREATE POLICY "Users can manage their own notification status" ON public.user_notifications
  FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for Content Blocks
CREATE POLICY "Visible content blocks are viewable by everyone" ON public.content_blocks
  FOR SELECT USING (visible = true);

CREATE POLICY "Admins can manage all content blocks" ON public.content_blocks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for TikTok Accounts
CREATE POLICY "Users can manage their own TikTok account" ON public.tiktok_accounts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all TikTok accounts" ON public.tiktok_accounts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for Admin Logs
CREATE POLICY "Admins can view admin logs" ON public.admin_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_contests_updated_at ON public.contests;
DROP TRIGGER IF EXISTS update_contest_submissions_updated_at ON public.contest_submissions;
DROP TRIGGER IF EXISTS update_notifications_updated_at ON public.notifications;
DROP TRIGGER IF EXISTS update_content_blocks_updated_at ON public.content_blocks;
DROP TRIGGER IF EXISTS update_tiktok_accounts_updated_at ON public.tiktok_accounts;

-- Create triggers
CREATE TRIGGER update_contests_updated_at BEFORE UPDATE ON public.contests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contest_submissions_updated_at BEFORE UPDATE ON public.contest_submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON public.notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_blocks_updated_at BEFORE UPDATE ON public.content_blocks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tiktok_accounts_updated_at BEFORE UPDATE ON public.tiktok_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for performance (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_contests_status ON public.contests(status);
CREATE INDEX IF NOT EXISTS idx_contests_start_date ON public.contests(start_date);
CREATE INDEX IF NOT EXISTS idx_contests_end_date ON public.contests(end_date);
CREATE INDEX IF NOT EXISTS idx_contest_submissions_contest_id ON public.contest_submissions(contest_id);
CREATE INDEX IF NOT EXISTS idx_contest_submissions_user_id ON public.contest_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_contest_submissions_status ON public.contest_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contest_submissions_final_score ON public.contest_submissions(final_score DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_published ON public.notifications(published);
CREATE INDEX IF NOT EXISTS idx_user_notifications_user_id ON public.user_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_tiktok_accounts_user_id ON public.tiktok_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON public.admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON public.admin_logs(created_at DESC);

-- Insert initial content blocks (only if table is empty)
INSERT INTO public.content_blocks (section, title, content, priority, visible)
SELECT
  'updates',
  '1000 pierwszych użytkowników otrzyma bonusowe punkty XP',
  'Pierwsze 1000 użytkowników, którzy założą konto na SeeUTrending otrzyma bonusowe punkty które zwiększają szansę na zdobycie niektórych odznak i nagród, takich jak wejścia na imprezy.',
  1,
  true
WHERE NOT EXISTS (SELECT 1 FROM public.content_blocks WHERE section = 'updates' LIMIT 1);

INSERT INTO public.content_blocks (section, title, content, priority, visible)
SELECT
  'updates',
  'Pierwszy konkurs na żywo już wkrótce!',
  'Przygotowujemy pierwszy konkurs z prawdziwymi nagrodami i możliwością zdobycia prestiżowych odznak. Szykuj swoją kreatywność!',
  2,
  true
WHERE NOT EXISTS (SELECT 1 FROM public.content_blocks WHERE section = 'updates' AND priority = 2);

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Admin database setup completed successfully!';
  RAISE NOTICE '📋 Next step: Grant yourself admin role';
  RAISE NOTICE '   UPDATE profiles SET role = ''admin'' WHERE email = ''your-email@example.com'';';
END $$;
