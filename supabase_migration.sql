-- Add new fields to profiles table for enhanced user functionality
-- Run this in Supabase SQL Editor

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS bio text,
ADD COLUMN IF NOT EXISTS interests text[], -- Array of interest strings
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS monthly_xp integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS tiktok_username text,
ADD COLUMN IF NOT EXISTS tiktok_metrics jsonb DEFAULT '{}'; -- Store TikTok metrics as JSON

-- Create index for performance on frequently queried fields
CREATE INDEX IF NOT EXISTS idx_profiles_monthly_xp ON public.profiles(monthly_xp DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_location ON public.profiles(location);
CREATE INDEX IF NOT EXISTS idx_profiles_tiktok_username ON public.profiles(tiktok_username);

-- Update the profiles table to set some sample data for testing
-- This will help with real data integration
UPDATE public.profiles
SET
  bio = CASE
    WHEN bio IS NULL THEN 'Creative TikTok content creator passionate about viral trends and engaging with the community.'
    ELSE bio
  END,
  interests = CASE
    WHEN interests IS NULL THEN ARRAY['TikTok', 'Content Creation', 'Viral Trends']
    ELSE interests
  END,
  location = CASE
    WHEN location IS NULL THEN 'Poland'
    ELSE location
  END,
  monthly_xp = CASE
    WHEN monthly_xp = 0 THEN FLOOR(RANDOM() * 1000) + 100
    ELSE monthly_xp
  END
WHERE id IS NOT NULL;

-- Add RLS policies for the new fields
-- Users can read all profiles but only update their own
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (ignore errors if they don't exist)
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Policy for reading profiles (allow all authenticated users)
CREATE POLICY "Profiles are viewable by authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Policy for updating profiles (users can only update their own)
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy for inserting profiles (handled by trigger, but allow authenticated users)
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);