-- Run this in Supabase SQL Editor to see all users and their roles
SELECT 
  id,
  email,
  name,
  role,
  created_at
FROM profiles 
ORDER BY created_at DESC;

-- Then run this to set YOUR specific user as admin
-- (Replace 'your-email@example.com' with your actual email)
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Check if it worked
SELECT 
  email,
  role 
FROM profiles 
WHERE email = 'your-email@example.com';