-- Debug script: Run this in Supabase SQL Editor to check your admin setup

-- 1. Check your current user role
SELECT 
  id,
  email,
  role,
  created_at
FROM profiles 
WHERE email = 'esti.marketing.agency@gmail.com';

-- 2. Make sure you're definitely admin (run this if role is not 'admin')
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'esti.marketing.agency@gmail.com';

-- 3. Verify the update worked
SELECT 
  email,
  role 
FROM profiles 
WHERE email = 'esti.marketing.agency@gmail.com';

-- 4. Check if enum values are correct
SELECT 
  enumlabel 
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role');