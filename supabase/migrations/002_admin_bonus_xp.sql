-- Add admin bonus XP tracking columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS admin_bonus_xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS admin_bonus_history JSONB DEFAULT '[]'::jsonb;

-- Update the user_role enum to remove brand and spectator
-- Step 1: Convert existing brand and spectator users to creator
UPDATE public.profiles SET role = 'creator' WHERE role IN ('brand', 'spectator');

-- Step 2: Drop policies that depend on the role column
DROP POLICY IF EXISTS "Brands can create contests" ON public.contests;
DROP POLICY IF EXISTS "Creators can submit to contests" ON public.contest_submissions;

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

-- Step 8: Recreate the policies with updated role values (only 'creator' and 'admin' now)
-- Note: Since we removed 'brand' role, we need to update the contest creation policy
-- Admins can now create contests instead of brands
CREATE POLICY "Admins can create contests" ON public.contests
  FOR INSERT WITH CHECK (
    auth.uid() = brand_id AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Creators can submit to contests" ON public.contest_submissions
  FOR INSERT WITH CHECK (
    auth.uid() = creator_id AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'creator') AND
    EXISTS (SELECT 1 FROM public.contests WHERE id = contest_id AND status = 'live')
  );

-- Add comment to explain admin_bonus_history structure
COMMENT ON COLUMN public.profiles.admin_bonus_history IS
'Array of objects: [{ amount: number, admin_id: uuid, admin_name: string, reason: string, granted_at: timestamp }]';
