-- Add admin bonus XP tracking columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS admin_bonus_xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS admin_bonus_history JSONB DEFAULT '[]'::jsonb;

-- Update the user_role enum to remove brand and spectator
-- Step 1: Create new enum with only creator and admin
CREATE TYPE user_role_new AS ENUM ('creator', 'admin');

-- Step 2: Convert existing brand and spectator users to creator
UPDATE public.profiles SET role = 'creator' WHERE role IN ('brand', 'spectator');

-- Step 3: Update the column to use new enum
ALTER TABLE public.profiles
  ALTER COLUMN role TYPE user_role_new
  USING role::text::user_role_new;

-- Step 4: Drop old enum and rename new one
DROP TYPE user_role;
ALTER TYPE user_role_new RENAME TO user_role;

-- Add comment to explain admin_bonus_history structure
COMMENT ON COLUMN public.profiles.admin_bonus_history IS
'Array of objects: [{ amount: number, admin_id: uuid, admin_name: string, reason: string, granted_at: timestamp }]';
