# 🚀 Admin Panel Setup Instructions

## ⚠️ CRITICAL: Database Setup Required

The admin panel is fully built but **requires database tables to be created first**. Follow these steps carefully:

---

## Step 1: Create Database Tables in Supabase

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project: https://supabase.com/dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **"New Query"**
4. Copy the **ENTIRE contents** of `admin-database-setup-safe.sql` file
5. Paste into the SQL Editor
6. Click **"Run"** or press `Ctrl+Enter`
7. Wait for success message with ✅ emoji

**Note**: Use `admin-database-setup-safe.sql` which safely handles existing objects.

### Option B: Using Supabase CLI

```bash
npx supabase db push --file admin-database-setup-safe.sql
```

---

## Step 2: Grant Yourself Admin Role

### Find Your User ID

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Find your user account and copy the **User UID**
3. OR run this query to find your email:

```sql
SELECT id, email, role FROM profiles WHERE email = 'your-email@example.com';
```

### Grant Admin Role

Run this SQL command in Supabase SQL Editor:

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
-- OR use your user ID:
-- WHERE id = 'your-user-uuid-here';
```

### Verify Admin Access

```sql
SELECT id, email, name, role FROM profiles WHERE role = 'admin';
```

You should see your account with `role = 'admin'`.

---

## Step 3: Restart Your Application

```bash
# Stop the dev server (Ctrl+C)
# Start it again
npm run dev
```

---

## Step 4: Access Admin Panel

1. Login to your account: http://localhost:5173/auth/login
2. Navigate to: http://localhost:5173/admin
3. You should see the **Admin Dashboard** with:
   - Real-time statistics
   - Quick action buttons
   - Recent activity feed
   - Pending actions

---

## 🎯 Admin Panel Features

Once setup is complete, you'll have access to:

### Admin Dashboard (`/admin`)
- ✅ Total users statistics
- ✅ Active contests count
- ✅ Video submissions tracking
- ✅ Total engagement metrics
- ✅ Real-time updates indicator
- ✅ Recent activity feed
- ✅ Pending actions summary

### User Management (`/admin/users`)
- ✅ View all users with search & filters
- ✅ User statistics (total, new today/week/month)
- ✅ Role management (creator/brand/spectator/admin)
- ✅ XP points adjustment
- ✅ Verification status toggle
- ✅ User activity summaries

### Contest Management (`/admin/contests`)
- ✅ Create new contests
- ✅ Edit existing contests
- ✅ Manage contest status (draft/active/completed/cancelled)
- ✅ Set prizes (1st, 2nd, 3rd place)
- ✅ Configure participation rewards (XP points)
- ✅ View submission statistics

### Notifications System (`/admin/notifications`)
- ✅ Create platform-wide announcements
- ✅ Target specific user groups (creators/brands/spectators)
- ✅ Schedule notifications
- ✅ Track read/click metrics

### Content Management (`/admin/content`)
- ✅ Edit landing page content blocks
- ✅ Manage updates section
- ✅ Priority ordering
- ✅ Visibility toggles

### Team Structure (`/admin/team`)
- ✅ View organizational structure
- ✅ Role descriptions
- ✅ Team member assignments

---

## 🔍 Troubleshooting

### "Admin panel not showing"
**Problem**: Button says "Otwórz Panel Admin" but nothing happens

**Solution**:
1. Verify you ran `admin-database-setup.sql`
2. Check your role: `SELECT role FROM profiles WHERE id = auth.uid();`
3. Ensure it returns `'admin'` not `'creator'`

### "Failed to load dashboard data"
**Problem**: Admin dashboard shows error

**Solution**:
1. Check Supabase is connected (green dot in dashboard)
2. Verify tables exist: Run `SELECT * FROM contests LIMIT 1;`
3. Check RLS policies are active

### "No rows returned" error
**Problem**: SQL queries return no data

**Solution**:
- This is normal for empty tables
- Admin panel will show "0" counts until you create data
- Use "Create Contest" and "Manage Users" to populate

### "Permission denied" errors
**Problem**: Can't access admin features

**Solution**:
1. Check RLS policies were created (in admin-database-setup.sql)
2. Verify your role is 'admin' not 'creator'
3. Clear browser cache and re-login

---

## 📊 What Gets Created

### 7 New Database Tables:
1. **contests** - Contest management
2. **contest_submissions** - User video submissions
3. **notifications** - Platform announcements
4. **user_notifications** - Notification read tracking
5. **content_blocks** - Landing page content
6. **tiktok_accounts** - TikTok OAuth data
7. **admin_logs** - Admin action audit trail

### Row Level Security:
- ✅ Public can view active contests
- ✅ Admins can manage all data
- ✅ Users can manage their own data
- ✅ Automatic audit logging

### Indexes for Performance:
- ✅ Contest status & dates
- ✅ User IDs & roles
- ✅ Notification read status
- ✅ Admin action timestamps

---

## ✅ Verification Checklist

After setup, verify these work:

- [ ] Can access /admin URL
- [ ] See dashboard with statistics
- [ ] Navigate to "Manage Users" page
- [ ] Navigate to "Team Structure" page
- [ ] See your role as "admin" in dashboard
- [ ] No SQL errors in browser console
- [ ] Supabase connection is live (green indicator)

---

## 🆘 Need Help?

If you encounter issues:

1. Check Supabase Dashboard → **Logs** for errors
2. Open browser DevTools → **Console** tab
3. Look for red error messages
4. Verify `admin-database-setup.sql` ran successfully
5. Confirm your role is 'admin' with SQL query

---

## 🎉 You're All Set!

Once you see the Admin Dashboard with statistics, you're ready to:
- Manage users and assign roles
- Create engaging contests
- Send platform-wide notifications
- Monitor real-time activity
- Track platform growth

**Next Steps**: Try creating your first contest at `/admin/contests`!
