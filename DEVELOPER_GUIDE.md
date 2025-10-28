# SeeUTrending Developer Guide

**Quick Start Guide for New Developers**

This guide will help you get up and running with the SeeUTrending platform in under 10 minutes.

## Table of Contents
1. [Quick Setup (5 Minutes)](#quick-setup-5-minutes)
2. [Project Architecture](#project-architecture)
3. [Key Features & Components](#key-features--components)
4. [Database Schema](#database-schema)
5. [Common Development Tasks](#common-development-tasks)
6. [Admin Panel Guide](#admin-panel-guide)
7. [Testing Strategy](#testing-strategy)
8. [Deployment Process](#deployment-process)
9. [Troubleshooting](#troubleshooting)

## Quick Setup (5 Minutes)

### Prerequisites
- **Node.js 18+** (check with `node --version`)
- **npm 9+** (check with `npm --version`)
- **Git** for version control

### Installation Steps

```bash
# 1. Clone the repository
git clone <repository-url>
cd see_utrending

# 2. Install dependencies
npm install

# 3. Environment setup
# Copy .env.local file (should already exist)
# Verify these variables exist:
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - VITE_APP_URL

# 4. Start development server
npm run dev

# 5. Open browser
# Navigate to http://localhost:5173
```

### Verify Setup
- Landing page loads with purple gradient and animations
- Language switcher (PL/EN) works in navbar
- "Zaloguj się" button opens login modal
- No console errors

### Test Admin Access
```
Email: esti.marketing.agency@gmail.com
Password: Test123!
```

After login, you should be redirected to `/admin` dashboard.

---

## Project Architecture

### Tech Stack Overview

**Frontend:**
- **React 19.1** - Latest React with TypeScript
- **Vite 7.1** - Lightning-fast build tool
- **React Router v7** - Nested routing with Outlet pattern
- **Tailwind CSS 3.4** - Utility-first styling
- **Framer Motion 12** - Advanced animations
- **Zustand 5.0** - Lightweight state management

**Backend:**
- **Supabase** - PostgreSQL database + Authentication + Realtime
- **Resend** (optional) - Email delivery (falls back to console.log in dev)

**Languages:**
- **TypeScript 5.8** - Strict type checking
- **i18next** - Polish/English internationalization

### Project Structure

```
see_utrending/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── admin/          # Admin-specific components
│   │   ├── auth/           # Authentication forms
│   │   ├── landing/        # Landing page sections
│   │   ├── layout/         # Navbar, Footer, etc.
│   │   └── ui/             # Base components (Button, Card, Badge)
│   │
│   ├── pages/              # Page-level components
│   │   ├── admin/          # Admin panel pages
│   │   ├── LandingPage.tsx
│   │   ├── AuthPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ContestsPage.tsx
│   │   └── RewardsPage.tsx
│   │
│   ├── lib/                # Core utilities
│   │   ├── auth/          # Authentication context & hooks
│   │   ├── supabase/      # Supabase client
│   │   └── i18n/          # Language configuration
│   │
│   ├── services/           # Business logic layer
│   │   └── admin/         # Admin services
│   │       ├── analytics.service.ts
│   │       ├── users.service.ts
│   │       ├── content.service.ts
│   │       └── email.service.ts
│   │
│   ├── hooks/              # Custom React hooks
│   │   └── useRealtimeUpdates.ts
│   │
│   ├── types/              # TypeScript type definitions
│   │
│   └── App.tsx            # Root component with routing
│
├── supabase/               # Database migrations & types
│   └── migrations/        # SQL migration files
│
├── public/                # Static assets
│
├── .env.local             # Environment variables
├── CLAUDE.md              # AI assistant instructions
├── DEVELOPER_GUIDE.md     # This file
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Key Features & Components

### 1. Authentication System

**Files:**
- `src/lib/auth/context.tsx` - Auth provider with useAuth hook
- `src/lib/auth/hooks.ts` - useAuthForm, usePermissions, useProfile
- `src/components/auth/LoginForm.tsx` - Login modal
- `src/components/auth/RegisterForm.tsx` - Registration modal

**How It Works:**
```typescript
// In any component
import { useAuth } from '../../lib/auth/context'

function MyComponent() {
  const { user, session, signOut } = useAuth()

  if (!user) return <div>Please login</div>

  return <div>Welcome {user.email}</div>
}
```

**User Roles:**
- `creator` - Default role, can participate in contests
- `admin` - Full access to admin panel
- `spectator` - Can view but not participate

### 2. Admin Panel

**Entry Point:** `/admin` (requires admin role)

**Key Files:**
- `src/components/admin/AdminLayout.tsx` - Sidebar & layout
- `src/components/admin/AdminRoute.tsx` - Role-based protection
- `src/pages/admin/AdminDashboard.tsx` - Overview dashboard
- `src/pages/admin/AdminUsers.tsx` - User management
- `src/pages/admin/ContestManagement.tsx` - Contest CRUD
- `src/pages/admin/ContentManagement.tsx` - Content & notifications
- `src/pages/admin/EmailsPage.tsx` - Email campaigns

**Navigation Fix (Important!):**
The admin navigation uses a key-based remounting strategy:
```typescript
// src/components/admin/AdminLayout.tsx
<Outlet key={location.pathname} />
```
This ensures clean state when switching between admin pages.

### 3. Real-time Updates

**Files:**
- `src/hooks/useRealtimeUpdates.ts`

**Usage:**
```typescript
// Subscribe to real-time updates
const contestUpdates = useContestUpdates(() => {
  console.log('Contest updated!')
  refetchData()
})

// Check connection status
if (contestUpdates.isConnected) {
  // Show green indicator
}
```

**Known Issue:** Currently has an infinite loop bug (see Troubleshooting).

### 4. Internationalization

**Files:**
- `src/lib/i18n/config.ts` - i18next setup
- `locales/` - Translation files

**Usage:**
```typescript
import { useTranslation } from 'react-i18next'

function MyComponent() {
  const { t, i18n } = useTranslation()

  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <button onClick={() => i18n.changeLanguage('pl')}>
        Polski
      </button>
    </div>
  )
}
```

### 5. Service Layer Pattern

**Why:** Separates business logic from UI components

**Example:**
```typescript
// src/services/admin/users.service.ts
export class UsersService {
  static async getUsers(filters) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', filters.role)

    if (error) throw new Error(error.message)
    return data
  }
}

// Usage in component
import { UsersService } from '../../services/admin/users.service'

const users = await UsersService.getUsers({ role: 'creator' })
```

---

## Database Schema

### Core Tables

#### `profiles` - User profiles
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  role user_role NOT NULL DEFAULT 'creator',
  avatar_url TEXT,
  bio TEXT,
  tiktok_handle TEXT UNIQUE,
  tiktok_user_id TEXT UNIQUE,
  total_followers INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  xp_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak_days INTEGER DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

#### `contests` - Contest definitions
```sql
CREATE TABLE contests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  brand_name TEXT,
  brand_logo TEXT,
  status contest_status NOT NULL DEFAULT 'draft',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  prize_pool INTEGER,
  rules TEXT,
  hashtags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
)
```

#### `contest_submissions` - User submissions
```sql
CREATE TABLE contest_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contest_id UUID REFERENCES contests,
  creator_id UUID REFERENCES profiles,
  video_url TEXT NOT NULL,
  tiktok_video_id TEXT UNIQUE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  engagement_score INTEGER DEFAULT 0
)
```

#### `content_notifications` - Platform announcements
```sql
CREATE TABLE content_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_pl TEXT NOT NULL,
  title_en TEXT NOT NULL,
  message_pl TEXT NOT NULL,
  message_en TEXT NOT NULL,
  type notification_type DEFAULT 'info',
  dismissible BOOLEAN DEFAULT TRUE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

#### `youtube_trailers` - Brand awareness content
```sql
CREATE TABLE youtube_trailers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  youtube_url TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
)
```

### Automatic Profile Creation

When a user registers via Supabase Auth, a trigger automatically creates their profile:

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE((new.raw_user_meta_data->>'role')::user_role, 'creator'::user_role)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Row Level Security (RLS)

All tables use RLS policies:
- Users can read their own profile
- Admins can read/write all data
- Public can read active contests
- Authenticated users can submit to contests

---

## Common Development Tasks

### Task 1: Add a New Admin Page

```typescript
// 1. Create page file
// src/pages/admin/MyNewPage.tsx
export function MyNewPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">
        My New Feature
      </h1>
      {/* Your content */}
    </div>
  )
}

// 2. Add route to App.tsx
import { MyNewPage } from './pages/admin/MyNewPage'

<Route path="/admin/*" element={<AdminRoute><AdminLayout /></AdminRoute>}>
  {/* ... existing routes ... */}
  <Route path="my-feature" element={<MyNewPage />} />
</Route>

// 3. Add to sidebar navigation
// src/components/admin/AdminLayout.tsx
const navItems = [
  // ... existing items ...
  {
    path: '/admin/my-feature',
    icon: YourIcon,
    label: 'My Feature'
  }
]
```

### Task 2: Create a New Service

```typescript
// src/services/admin/myfeature.service.ts
import { supabase } from '../../lib/supabase/client'

export interface MyFeatureData {
  id: string
  name: string
  // ... other fields
}

export class MyFeatureService {
  static async getAll(): Promise<MyFeatureData[]> {
    const { data, error } = await supabase
      .from('my_feature_table')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch data: ${error.message}`)
    }

    return data
  }

  static async create(data: Partial<MyFeatureData>) {
    const { data: result, error } = await supabase
      .from('my_feature_table')
      .insert(data)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create: ${error.message}`)
    }

    return result
  }

  static async update(id: string, updates: Partial<MyFeatureData>) {
    const { data, error } = await supabase
      .from('my_feature_table')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update: ${error.message}`)
    }

    return data
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('my_feature_table')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete: ${error.message}`)
    }
  }
}
```

### Task 3: Add a New Translation

```typescript
// locales/pl/translation.json
{
  "myFeature": {
    "title": "Moja Funkcja",
    "description": "Opis mojej funkcji"
  }
}

// locales/en/translation.json
{
  "myFeature": {
    "title": "My Feature",
    "description": "My feature description"
  }
}

// Usage in component
const { t } = useTranslation()
<h1>{t('myFeature.title')}</h1>
```

### Task 4: Create a Database Migration

```bash
# Generate new migration file
npx supabase migration new add_my_feature_table

# Edit the generated file in supabase/migrations/
# Example: 20250128_add_my_feature_table.sql
```

```sql
-- Create enum if needed
CREATE TYPE my_feature_status AS ENUM ('active', 'inactive');

-- Create table
CREATE TABLE my_feature_table (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  status my_feature_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE my_feature_table ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins can do everything"
  ON my_feature_table
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create indexes
CREATE INDEX idx_my_feature_status ON my_feature_table(status);
CREATE INDEX idx_my_feature_created_at ON my_feature_table(created_at DESC);
```

### Task 5: Add a New UI Component

```typescript
// src/components/ui/MyComponent.tsx
import { ReactNode } from 'react'

interface MyComponentProps {
  title: string
  children: ReactNode
  variant?: 'primary' | 'secondary'
  onClick?: () => void
}

export function MyComponent({
  title,
  children,
  variant = 'primary',
  onClick
}: MyComponentProps) {
  const baseStyles = "px-4 py-2 rounded-lg transition-all duration-200"
  const variantStyles = {
    primary: "bg-primary text-white hover:bg-primary-dark",
    secondary: "bg-surface text-white hover:bg-surface-light"
  }

  return (
    <div className={`${baseStyles} ${variantStyles[variant]}`}>
      <h3 className="font-bold mb-2">{title}</h3>
      <div onClick={onClick}>{children}</div>
    </div>
  )
}

// Usage
import { MyComponent } from '../../components/ui/MyComponent'

<MyComponent title="Hello" variant="primary" onClick={handleClick}>
  <p>Content here</p>
</MyComponent>
```

---

## Admin Panel Guide

### Dashboard Overview

The admin dashboard shows:
1. **Key Metrics**: Total users, active contests, submissions, engagement
2. **Real-time Status**: WebSocket connection indicator
3. **Quick Actions**: Shortcuts to common tasks
4. **Recent Activity**: Live feed of platform events
5. **Pending Actions**: Tasks requiring attention

### User Management

**View All Users:**
- Filter by role (creator/admin)
- Search by name, email, TikTok handle
- Sort by creation date, XP, name

**User Details Modal:**
- Profile information
- XP and level
- Contest participation history
- Verification status

**User Actions:**
- Change role (creator ↔ admin)
- Update XP points
- Verify/unverify user
- View contest submissions

**Export Users:**
```typescript
// Export filtered users to CSV
const csvData = await UsersService.exportUsers({
  role: 'creator',
  dateRange: '30' // last 30 days
})

// Convert to CSV and download
const csv = convertToCSV(csvData)
downloadFile(csv, 'users.csv')
```

### Contest Management

**Contest States:**
- `draft` - Being created, not visible to users
- `active` - Live, accepting submissions
- `completed` - Ended, winners announced
- `cancelled` - Cancelled by admin

**Creating a Contest:**
1. Fill in basic info (title, description, brand)
2. Set dates (start/end)
3. Define prize pool
4. Add rules and hashtags
5. Save as draft or publish immediately

**Managing Submissions:**
- View all submissions for a contest
- Check engagement metrics
- Select winners manually
- Award prizes

### Content Management

**YouTube Trailers:**
- Add promotional videos for the platform
- Videos appear on landing page
- Activate/deactivate trailers

**Content Notifications:**
- Create announcements for all users
- Polish/English bilingual
- Types: info, success, warning, error
- Dismissible or persistent
- Schedule for future display

### Email Campaigns

**Development Mode:**
When `RESEND_API_KEY` is not set, emails are logged to console instead of sent.

**Creating a Campaign:**
```typescript
// 1. Choose template
const template = 'contest_announcement'

// 2. Fill in content
const subject_pl = "Nowy konkurs!"
const subject_en = "New Contest!"
const content_pl = "..."
const content_en = "..."

// 3. Select recipients
const audience = 'all' // or 'creators', 'admins'

// 4. Send
await EmailService.sendCampaign({
  template,
  subject_pl,
  subject_en,
  content_pl,
  content_en,
  audience
})
```

**Available Templates:**
- `welcome` - New user welcome email
- `contest_announcement` - New contest notification
- `winner_notification` - Contest winner announcement
- `general_update` - Platform updates

---

## Testing Strategy

### Manual Testing

**Authentication Flow:**
```bash
# Start dev server
npm run dev

# Test registration
1. Click "Zarejestruj się"
2. Fill form with valid data
3. Submit and check email for confirmation
4. Confirm email via link
5. Login with credentials

# Test protected routes
1. Try accessing /dashboard without login (should redirect)
2. Login and access /dashboard (should work)
3. Try accessing /admin without admin role (should block)
```

### Playwright Testing (MCP)

The project supports automated testing with Playwright:

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run tests via Playwright MCP
# (Available through Claude Code with Playwright MCP server)
```

**Test Scenarios to Cover:**
1. Login flow
2. Admin navigation between pages
3. User creation and management
4. Contest CRUD operations
5. Content notification creation
6. Email campaign creation

### Unit Testing (Not Yet Implemented)

**Recommended Setup:**
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

**Example Test:**
```typescript
// src/services/admin/users.service.test.ts
import { describe, it, expect, vi } from 'vitest'
import { UsersService } from './users.service'

describe('UsersService', () => {
  it('should fetch users with filters', async () => {
    const users = await UsersService.getUsers({ role: 'creator' })
    expect(users).toBeInstanceOf(Array)
  })
})
```

---

## Deployment Process

### Development Environment

```bash
# Run locally
npm run dev

# Access at http://localhost:5173
# Hot reload enabled
```

### Production Build

```bash
# Create production build
npm run build

# Test production build locally
npm run preview
```

### Vercel Deployment

**Automatic Deployment:**
```bash
# Push to main branch
git add .
git commit -m "Your changes"
git push origin main

# Vercel automatically deploys
```

**Manual Deployment:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

**Environment Variables on Vercel:**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add required variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_APP_URL` (your production URL)
   - `RESEND_API_KEY` (optional, for emails)

### Post-Deployment Checklist

- [ ] Landing page loads correctly
- [ ] Authentication works (login/register)
- [ ] Admin panel accessible with admin credentials
- [ ] Database connections working
- [ ] No console errors
- [ ] Animations running smoothly
- [ ] Language switcher working
- [ ] Email system operational (or logging in dev mode)

---

## Troubleshooting

### Common Issues

#### 1. "Maximum update depth exceeded" Error

**Problem:** Infinite loop in real-time subscription hooks

**Symptoms:**
- Console flooded with subscription cleanup messages
- Admin dashboard becomes sluggish
- React error about update depth

**Status:** Known bug, high priority

**Temporary Workaround:**
- Dashboard still functional despite error
- Performance slightly degraded
- Does not affect user-facing pages

**Investigation Needed:**
Files to check:
- `src/hooks/useRealtimeUpdates.ts`
- `src/pages/admin/AdminDashboard.tsx` (lines 29-31)

#### 2. Navigation Not Working in Admin Panel

**Problem:** Clicking sidebar links doesn't navigate

**Solution:** Already fixed with key-based remounting:
```typescript
// src/components/admin/AdminLayout.tsx:151
<Outlet key={location.pathname} />
```

If still not working:
- Clear browser cache
- Check console for errors
- Verify React Router version is v7
- Ensure `replace: false` in navigate() calls

#### 3. Authentication Errors

**Problem:** "Profile creation failed" during registration

**Check:**
```sql
-- Verify trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- Verify function exists
SELECT * FROM pg_proc WHERE proname = 'handle_new_user';

-- Check if user_role enum has correct values
SELECT unnest(enum_range(NULL::user_role));
```

**Fix:**
Re-run migration files in `supabase/migrations/`

#### 4. Email System Not Working

**Problem:** Emails not sending

**Check Development Mode:**
```bash
# Verify RESEND_API_KEY is NOT set for dev
echo $RESEND_API_KEY
# Should be empty

# Check console for email logs
# Emails should appear in console output
```

**Production Setup:**
1. Get Resend API key from https://resend.com
2. Add to Vercel environment variables
3. Redeploy

#### 5. Real-time Updates Not Working

**Problem:** Dashboard stats don't update live

**Check Supabase:**
1. Go to Supabase Dashboard → Database → Replication
2. Verify realtime is enabled for:
   - `profiles`
   - `contests`
   - `contest_submissions`

**Check Connection:**
```typescript
// In browser console on admin dashboard
console.log(useContestUpdates.isConnected)
// Should be true
```

#### 6. TypeScript Errors

**Problem:** Type errors during development

**Common Fixes:**
```bash
# Regenerate Supabase types
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/supabase.ts

# Check TypeScript config
cat tsconfig.json

# Restart TypeScript server in VSCode
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

#### 7. Build Failures

**Problem:** `npm run build` fails

**Check:**
```bash
# Run type checking
npm run type-check

# Run linter
npm run lint

# Check for missing dependencies
npm install
```

**Common Build Errors:**
- Missing import statements
- Type mismatches
- Unused variables (set to error in eslint)
- Missing environment variables

---

## Best Practices

### Code Style

1. **TypeScript First**: Always define types/interfaces
2. **Component Structure**:
   ```typescript
   // 1. Imports
   // 2. Interfaces/Types
   // 3. Component definition
   // 4. Exports
   ```
3. **Naming Conventions**:
   - Components: PascalCase (`MyComponent.tsx`)
   - Hooks: camelCase with 'use' prefix (`useMyHook.ts`)
   - Services: PascalCase with 'Service' suffix (`MyService.ts`)
   - Utilities: camelCase (`formatDate.ts`)

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-new-feature

# Make changes, commit often
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/my-new-feature
```

**Commit Message Format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

### Performance Tips

1. **Lazy Loading**: Use React.lazy for heavy components
2. **Memoization**: Use useMemo/useCallback for expensive operations
3. **Code Splitting**: Split routes and admin panel
4. **Image Optimization**: Use WebP format, lazy loading
5. **Bundle Analysis**: Run `npm run build -- --analyze`

### Security Checklist

- [ ] Never commit `.env.local` or API keys
- [ ] Always use Supabase RLS policies
- [ ] Validate user input on both client and server
- [ ] Use prepared statements (Supabase handles this)
- [ ] Implement rate limiting for API calls
- [ ] Sanitize user-generated content
- [ ] Use HTTPS in production (Vercel handles this)

---

## Useful Resources

### Documentation Links

- **React 19**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Vite**: https://vitejs.dev/guide/
- **Supabase**: https://supabase.com/docs
- **React Router v7**: https://reactrouter.com/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Framer Motion**: https://www.framer.com/motion/
- **i18next**: https://www.i18next.com/

### Supabase Dashboard

- **Project URL**: https://supabase.com/dashboard/project/sxmjwvrjxgylqtbfqykr
- **Database**: Table editor, SQL editor
- **Authentication**: User management, email templates
- **Storage**: File uploads (not yet used)
- **Realtime**: Subscription management

### Design System

**Colors:**
- Primary: `#8B5CF6` (Purple)
- Accent: `#A855F7` (Light Purple)
- Background: `#000000` (Black)
- Surface: `#1A1A1A` (Dark Gray)
- Text: `#FFFFFF` (White)

**Tailwind Classes:**
```css
.btn-primary: bg-primary hover:bg-primary-dark text-white
.card: bg-surface border border-border rounded-2xl p-6
.input: bg-background border border-border rounded-lg px-4 py-2
```

---

## Contact & Support

**For Questions:**
- Check CLAUDE.md for AI assistant guidance
- Review existing code for patterns
- Check Supabase documentation
- Ask team members

**For Bugs:**
1. Check "Known Issues & TODOs" in CLAUDE.md
2. Search existing GitHub issues
3. Create new issue with reproduction steps

**Admin Test Account:**
```
Email: esti.marketing.agency@gmail.com
Password: Test123!
```

---

## Next Steps

After completing this guide, you should:

1. [ ] Successfully run the project locally
2. [ ] Navigate the admin panel
3. [ ] Understand the project structure
4. [ ] Know how to create new features
5. [ ] Be familiar with common tasks

**Recommended First Tasks:**
1. Fix the real-time subscription infinite loop bug
2. Implement TikTok OAuth integration
3. Build the Analytics dashboard
4. Add unit tests with Vitest
5. Improve error handling and user feedback

Good luck! 🚀
