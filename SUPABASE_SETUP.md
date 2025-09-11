# Supabase Authentication Setup Guide

## Status: ✅ WORKING CONFIGURATION

This guide documents the **successfully implemented** Supabase authentication system for SeeUTrending. The database schema, triggers, and authentication flow have been tested and are working correctly.

## Step 1: Database Schema Setup (✅ COMPLETED)

The following SQL schema has been deployed and is working:

1. Go to your Supabase dashboard: https://sxmjwvrjxgylqtbfqykr.supabase.co
2. Click on **"SQL Editor"** in the left sidebar
3. Click **"New query"**
4. Copy and paste this **tested and working** SQL code:

```sql
-- Create custom user role type
CREATE TYPE user_role AS ENUM ('creator', 'spectator');

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  name text,
  role user_role not null default 'creator',
  avatar_url text,
  bio text,
  
  -- Creator-specific fields
  tiktok_handle text unique,
  tiktok_user_id text unique,
  total_followers integer default 0,
  verified boolean default false,
  
  -- Gamification fields
  xp_points integer default 0,
  level integer default 1,
  streak_days integer default 0,
  last_activity_date date default current_date,
  
  -- Timestamps
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create security policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- CRITICAL: Function to automatically create profile when user signs up
-- This function has been tested and works correctly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'creator'::user_role)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- CRITICAL: Trigger to automatically create profile
-- This trigger has been tested and works correctly
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update timestamps
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create performance indexes
CREATE INDEX profiles_role_idx ON public.profiles(role);
CREATE INDEX profiles_xp_points_idx ON public.profiles(xp_points DESC);
```

5. Click **"Run"** to execute the SQL
6. You should see "Success. No rows returned" message

## Step 2: Test Your Authentication ✅ WORKING

1. Go to http://localhost:5173
2. Click "Zarejestruj się" (Sign up)
3. Create a new account with a valid email address
4. Check your email for confirmation link
5. After confirming, login with your credentials
6. Access the protected dashboard

## What This Creates:

- ✅ `profiles` table for user data
- ✅ `user_role` enum with 'creator' and 'spectator' options
- ✅ Automatic profile creation when users register (TESTED & WORKING)
- ✅ Security policies for data protection
- ✅ XP points and gamification fields ready for future features
- ✅ Working trigger function that creates profiles automatically
- ✅ Performance indexes for optimized queries

## Authentication Flow Verification

### Registration Process (✅ WORKING)
1. User submits registration form
2. Supabase creates auth.users record
3. `on_auth_user_created` trigger fires automatically
4. `handle_new_user()` function creates profile record
5. Email confirmation sent to user
6. User confirms email and can login

### Login Process (✅ WORKING)
1. User submits login credentials
2. Supabase validates credentials
3. Session established with JWT token
4. AuthProvider context updates user state
5. Protected routes become accessible
6. Dashboard displays role-based content

## Troubleshooting Guide

### If Registration Fails with Profile Errors:

#### Check Database Schema
1. Go to Supabase Dashboard → Database → Tables
2. Verify `profiles` table exists with correct columns
3. Check that `user_role` type includes 'creator' and 'spectator'

#### Check Trigger Function
1. Go to Supabase Dashboard → SQL Editor
2. Run: `SELECT * FROM pg_proc WHERE proname = 'handle_new_user';`
3. Should return the function definition
4. If empty, re-run the function creation SQL

#### Check Trigger
1. In SQL Editor, run: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
2. Should return trigger configuration
3. If empty, re-run the trigger creation SQL

#### Check RLS Policies
1. Go to Supabase Dashboard → Authentication → Policies
2. Verify policies exist for profiles table:
   - "Public profiles are viewable by everyone"
   - "Users can insert their own profile"
   - "Users can update their own profile"

### If Email Confirmation Issues:

#### SMTP Configuration
- Supabase handles email sending automatically
- Check spam/junk folders for confirmation emails
- Use valid, accessible email addresses for testing
- Email confirmation is required before first login

### If Development Server Issues:

#### Environment Variables
1. Verify `.env.local` has correct Supabase URL and keys
2. Check that VITE_SUPABASE_URL matches your project
3. Ensure VITE_SUPABASE_ANON_KEY is correctly copied
4. Development server must run on http://localhost:5173

#### Browser Issues
1. Clear localStorage: `localStorage.clear()`
2. Clear cookies for localhost:5173
3. Check browser network tab for API errors
4. Try incognito/private mode

### If Authentication State Issues:

#### Reset Auth State
1. Logout from the application
2. Clear browser localStorage
3. Close and reopen browser
4. Try login again

#### Check Supabase Logs
1. Go to Supabase Dashboard → Logs
2. Check for authentication errors
3. Look for database trigger execution logs
4. Verify profile creation events

## Database Schema Verification

### Verify Tables Exist
```sql
-- Check if profiles table exists
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'profiles';

-- Check profiles table structure
\d public.profiles;

-- Check user_role enum
SELECT enumlabel FROM pg_enum WHERE enumtypid = 
  (SELECT oid FROM pg_type WHERE typname = 'user_role');
```

### Test Profile Creation Manually
```sql
-- Check existing profiles
SELECT id, email, name, role FROM public.profiles;

-- Check auth users
SELECT id, email FROM auth.users;
```

## Success Indicators

### ✅ Working System Shows:
1. Users can register with creator accounts
2. Email confirmation emails are received
3. Users can login after confirmation
4. Dashboard is accessible post-login
5. User dropdown shows profile information
6. Logout functionality works correctly
7. Protected routes redirect properly
8. Database trigger creates profiles automatically

### 🔧 System Status Dashboard
- **Database Schema**: ✅ Deployed and Working
- **Trigger Function**: ✅ Tested and Working
- **Authentication Flow**: ✅ End-to-end Tested
- **Email Confirmation**: ✅ Working with Supabase SMTP
- **Protected Routes**: ✅ Working with React Router
- **Role-based Dashboard**: ✅ Creator and Spectator roles
- **Form Validation**: ✅ Polish/English error messages
- **UI Components**: ✅ LoginForm and RegisterForm complete