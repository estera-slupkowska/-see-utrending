# Database Migration Instructions

## Migration 002: Admin Bonus XP & Role Cleanup

This migration adds admin bonus XP tracking and removes the Brand and Spectator roles, keeping only Creator and Admin roles.

### What This Migration Does:

1. **Adds New Columns to `profiles` table:**
   - `admin_bonus_xp` (INTEGER, default 0) - Tracks bonus XP given by admins
   - `admin_bonus_history` (JSONB, default []) - Stores history of admin-given bonuses

2. **Updates User Roles:**
   - Removes `brand` and `spectator` from the `user_role` enum
   - Converts all existing Brand and Spectator users to Creator role
   - Only Creator and Admin roles remain

### How to Run This Migration:

#### Option 1: Via Supabase Dashboard (Recommended)
1. Go to https://supabase.com/dashboard
2. Select your project: `sxmjwvrjxgylqtbfqykr`
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `supabase/migrations/002_admin_bonus_xp.sql`
6. Paste into the query editor
7. Click **Run** button
8. Verify success message

#### Option 2: Via Supabase CLI (If Installed)
```bash
# Make sure you're in the project directory
cd /c/Users/micha/Desktop/see_utrending

# Run the migration
npx supabase db push
```

### Verification Steps:

After running the migration, verify it worked:

1. **Check New Columns:**
```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('admin_bonus_xp', 'admin_bonus_history');
```

2. **Check User Roles:**
```sql
SELECT role, COUNT(*) as count
FROM profiles
GROUP BY role;
```
You should only see `creator` and `admin` roles.

3. **Check Enum Values:**
```sql
SELECT unnest(enum_range(NULL::user_role))::text;
```
Should return only: `creator` and `admin`

### Rollback (If Needed):

If something goes wrong, you can rollback:

```sql
-- Add columns back
ALTER TABLE public.profiles
DROP COLUMN IF EXISTS admin_bonus_xp,
DROP COLUMN IF EXISTS admin_bonus_history;

-- Recreate old enum (this will require recreating the type manually)
-- Note: You'll lose the role conversions!
```

**⚠️ Warning:** Rolling back will remove all admin bonus XP data!

### Next Steps After Migration:

1. Test the admin panel at `/admin/users`
2. Try adding bonus XP to a user
3. Verify the bonus appears in the XP breakdown
4. Check that only Creator and Admin roles appear in filters

---

**Migration created:** 2025-10-27
**Author:** Claude Code
**Status:** Ready to deploy
