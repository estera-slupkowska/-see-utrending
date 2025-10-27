-- Add admin bonus XP tracking columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS admin_bonus_xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS admin_bonus_history JSONB DEFAULT '[]'::jsonb;

-- Update the user_role enum to remove brand and spectator
-- Step 1: Convert existing brand and spectator users to creator
UPDATE public.profiles SET role = 'creator' WHERE role IN ('brand', 'spectator');

-- Step 2: Drop ALL policies that depend on the role column
-- Contests policies
DROP POLICY IF EXISTS "Brands can create contests" ON public.contests;
DROP POLICY IF EXISTS "Admins can manage all contests" ON public.contests;

-- Contest submissions policies
DROP POLICY IF EXISTS "Creators can submit to contests" ON public.contest_submissions;
DROP POLICY IF EXISTS "Admins can manage all submissions" ON public.contest_submissions;

-- Notifications policies
DROP POLICY IF EXISTS "Admins can manage all notifications" ON public.notifications;

-- Content blocks policies
DROP POLICY IF EXISTS "Admins can manage all content blocks" ON public.content_blocks;

-- TikTok accounts policies
DROP POLICY IF EXISTS "Admins can view all TikTok accounts" ON public.tiktok_accounts;

-- Admin logs policies
DROP POLICY IF EXISTS "Admins can view admin logs" ON public.admin_logs;

-- Step 3: Create new enum with only creator and admin
CREATE TYPE user_role_new AS ENUM ('creator', 'admin');

-- Step 4: Remove the default value temporarily
ALTER TABLE public.profiles ALTER COLUMN role DROP DEFAULT;

-- Step 5: Update the column to use new enum
ALTER TABLE public.profiles
  ALTER COLUMN role TYPE user_role_new
  USING role::text::user_role_new;

-- Step 6: Set the new default value
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'creator'::user_role_new;

-- Step 7: Drop old enum and rename new one
DROP TYPE user_role;
ALTER TYPE user_role_new RENAME TO user_role;

-- Step 8: Recreate ALL policies with updated role values (only 'creator' and 'admin' now)

-- Contests policies
CREATE POLICY "Admins can manage all contests" ON public.contests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Contest submissions policies
CREATE POLICY "Creators can submit to contests" ON public.contest_submissions
  FOR INSERT WITH CHECK (
    auth.uid() = creator_id AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'creator') AND
    EXISTS (SELECT 1 FROM public.contests WHERE id = contest_id AND status = 'live')
  );

CREATE POLICY "Admins can manage all submissions" ON public.contest_submissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Notifications policies
CREATE POLICY "Admins can manage all notifications" ON public.notifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Content blocks policies
CREATE POLICY "Admins can manage all content blocks" ON public.content_blocks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- TikTok accounts policies
CREATE POLICY "Admins can view all TikTok accounts" ON public.tiktok_accounts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admin logs policies
CREATE POLICY "Admins can view admin logs" ON public.admin_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add comment to explain admin_bonus_history structure
COMMENT ON COLUMN public.profiles.admin_bonus_history IS
'Array of objects: [{ amount: number, admin_id: uuid, admin_name: string, reason: string, granted_at: timestamp }]';
