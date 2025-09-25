-- Add missing TikTok-related columns to profiles table
-- Run this in your Supabase SQL Editor

-- Add tiktok_username column
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS tiktok_username text;

-- Add tiktok_metrics column (JSONB for storing metrics data)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS tiktok_metrics jsonb default '{}';

-- Add index for TikTok username for better performance
CREATE INDEX IF NOT EXISTS profiles_tiktok_username_idx ON public.profiles(tiktok_username);

-- Verify the columns were added
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND table_schema = 'public'
  AND column_name LIKE '%tiktok%'
ORDER BY column_name;

-- Check the current structure
\d public.profiles;