# SeeUTrending Admin Panel Setup Instructions

## Database Setup Required

The connection error you're seeing is because the admin database tables haven't been created yet. Here's how to fix it:

### Step 1: Go to Your Supabase Dashboard
1. Visit https://supabase.com/dashboard
2. Select your SeeUTrending project
3. Go to **SQL Editor** in the left sidebar

### Step 2: Create the Database Tables
1. Click **"New query"** 
2. Copy and paste the **entire contents** of the file `admin-database-setup.sql` (located in your project root)
3. Click **"Run"** to execute the SQL script

This will create the following tables:
- `contests` - For contest management
- `contest_submissions` - For user submissions
- `notifications` - For platform notifications
- `content_blocks` - For managing landing page content
- `tiktok_accounts` - For TikTok integration
- `admin_logs` - For tracking admin actions

### Step 3: Set Your Account as Admin
After running the SQL script, you need to give yourself admin access:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

Replace `'your-email@example.com'` with the email you used to register.

### Step 4: Restart the Development Server
```bash
npm run dev
```

### Step 5: Access the Admin Panel
Once the database is set up and your account has admin role:
- **Main App**: http://localhost:5173
- **Admin Panel**: http://localhost:5173/admin

## What Each Admin Section Does

### Dashboard (`/admin`)
- Live statistics from your database
- Recent activity feed
- Platform health metrics
- Real-time updates indicator

### Contest Management (`/admin/contests`)
- Create new contests with prizes and rules
- Edit existing contests
- Change contest status (draft → active → completed)
- Delete contests
- Search and filter contests

### User Management (`/admin/users`)
- View all registered users
- Change user roles (creator, brand, spectator, admin)
- Verify users
- Update XP points and levels
- Export user data to CSV

### Content Management (`/admin/content`)
- Update landing page content
- Create notifications
- Manage feature announcements
- Reorder content priority
- Show/hide content blocks

## If You Still See Errors

1. **Make sure the SQL script ran completely** - check for any red error messages in Supabase
2. **Verify your role is 'admin'** - check the profiles table in Supabase
3. **Restart your development server** - stop and run `npm run dev` again
4. **Check browser console** - look for any JavaScript errors

## Need Help?

If you encounter any issues:
1. Check the Supabase SQL Editor for error messages
2. Verify all tables were created in the "Table Editor" section
3. Confirm your user role in the profiles table
4. Make sure your environment variables are correct in `.env.local`

The admin panel will be fully functional once the database schema is applied!