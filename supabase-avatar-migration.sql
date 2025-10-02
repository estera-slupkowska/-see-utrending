-- Avatar Upload Migration for SeeUTrending
-- Apply this via: npx supabase db push
-- Or copy/paste into Supabase Dashboard > SQL Editor

-- Step 1: Ensure profiles table has avatar_url column
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Step 2: Create storage policies for avatars bucket
-- (Bucket should be created via Dashboard UI first)

-- Allow users to upload to their own folder
CREATE POLICY IF NOT EXISTS "Users can upload own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own avatars
CREATE POLICY IF NOT EXISTS "Users can update own avatar" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own avatars
CREATE POLICY IF NOT EXISTS "Users can delete own avatar" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public viewing of all avatars
CREATE POLICY IF NOT EXISTS "Avatars are publicly viewable" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Step 3: Update profiles RLS policy to allow avatar_url updates
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Step 4: Add performance index
CREATE INDEX IF NOT EXISTS idx_profiles_avatar_url ON public.profiles(avatar_url);

-- Step 5: Add updated_at trigger if not exists
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER IF NOT EXISTS handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Verification queries
-- Run these to check if setup is correct:

-- Check if avatar_url column exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'avatar_url';

-- Check storage policies
SELECT policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'objects' AND schemaname = 'storage';

-- Check if avatars bucket exists (run this in app, not SQL)
-- SELECT * FROM storage.buckets WHERE name = 'avatars';