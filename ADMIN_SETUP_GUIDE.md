# Admin Panel Setup Guide

This guide will help you set up the admin panel for your SeeUTrending platform.

## Step 1: Run the Database Setup Script

### Method 1: Using Supabase Dashboard (Recommended)

1. **Access Your Supabase Project**
   - Go to [https://app.supabase.com](https://app.supabase.com)
   - Select your SeeUTrending project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Admin Database Script**
   - Open the file `admin-database-setup.sql` in your project
   - Copy the entire contents (it's a large script with many tables)
   - Paste it into the SQL Editor
   - Click "Run" or press Ctrl+Enter

4. **Verify Tables Were Created**
   - Go to "Table Editor" in the sidebar
   - You should see new tables:
     - `contests`
     - `contest_submissions` 
     - `notifications`
     - `user_notifications`
     - `content_blocks`
     - `tiktok_accounts`
     - `admin_logs`

### Method 2: Using Supabase CLI (Advanced)

```bash
# If you have Supabase CLI installed
supabase db push
# Then run the migration file
```

## Step 2: Set Your Account as Admin

### Option 1: Update Profiles Table (Easy)

1. **Go to Table Editor** in your Supabase dashboard
2. **Find the `profiles` table**
3. **Locate your user record** (find by email)
4. **Edit the `role` field** and change it from 'creator' to 'admin'
5. **Save the changes**

### Option 2: Using SQL Query

```sql
-- Replace 'your-email@example.com' with your actual email
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## Step 3: Access the Admin Panel

1. **Refresh your application** (http://localhost:5173)
2. **Sign out and sign in again** (this refreshes your session)
3. **Click on your profile** in the navbar
4. **Look for "Admin Panel"** option in the dropdown
5. **Click "Admin Panel"** to access `/admin`

## Troubleshooting

### Issue: Admin Panel link doesn't appear

**Solution 1: Clear browser cache and refresh**
- Press Ctrl+F5 to hard refresh
- Or clear browser cache completely

**Solution 2: Check the browser console**
- Press F12 to open developer tools
- Look for any error messages in the console
- Check if the role fetch is working

**Solution 3: Verify database connection**
- Make sure your `.env.local` file has the correct Supabase credentials
- Test that other parts of the app work (login, registration)

### Issue: "Permission denied" when accessing admin

**Check RLS policies:**
```sql
-- Verify admin role in profiles table
SELECT id, email, role FROM profiles WHERE email = 'your-email@example.com';

-- Check if RLS policies are correctly set
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

## Admin Panel Features

Once you have access, you can:

### 🏆 **Contest Management** (`/admin/contests`)
- Create new TikTok contests
- Set prizes, rules, and hashtags
- Manage contest status (draft, active, completed)
- View submission statistics

### 📝 **Content Management** (`/admin/content`)
- Edit landing page notifications
- Add/remove "Najnowsze Informacje" items
- Preview changes in real-time
- Control content visibility

### 👥 **User Management** (`/admin/users`)
- View all registered users
- Check TikTok connections
- Manage user roles and permissions
- View user activity

### 📊 **Analytics** (`/admin/analytics`)
- Platform usage statistics
- Contest performance metrics
- User engagement data
- Brand reporting

### 🔔 **Notifications** (`/admin/notifications`)
- Send platform-wide announcements
- Target specific user groups
- Track notification delivery and read rates

## Security Notes

⚠️ **Important Security Considerations:**

1. **Admin Role Protection**: Only grant admin role to trusted users
2. **Environment Variables**: Never commit your Supabase service role key to version control
3. **RLS Policies**: The database has Row Level Security enabled to protect data
4. **Audit Logging**: All admin actions are logged in the `admin_logs` table

## Next Steps: TikTok API Integration

Once the admin panel is working, you can proceed with:
1. TikTok Developer account setup
2. OAuth flow implementation
3. Video metrics collection
4. Real-time leaderboard updates

## Need Help?

If you encounter issues:
1. Check the browser developer console for errors
2. Verify your Supabase connection
3. Ensure the database script ran successfully
4. Check that your user role is set to 'admin' in the profiles table

---

**Your SeeUTrending admin panel is now ready for launch! 🚀**