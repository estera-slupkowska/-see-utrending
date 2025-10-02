-- Add badges column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS badges jsonb DEFAULT '[]'::jsonb;

-- Update all existing users to have the "Złote Tysiąc" badge with 100 XP
UPDATE public.profiles
SET
  badges = '[{
    "id": "early-adopter",
    "name": "Złote Tysiąc",
    "earnedAt": "' || now()::text || '",
    "xp": 100
  }]'::jsonb,
  xp_points = 100,
  monthly_xp = 0,
  updated_at = now()
WHERE badges IS NULL OR badges = '[]'::jsonb;

-- Create index for badge queries
CREATE INDEX IF NOT EXISTS idx_profiles_badges ON public.profiles USING gin (badges);