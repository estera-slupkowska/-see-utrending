# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SeeUTrending** - A gamified platform for branded UGC contests where creators compete in real-time national leaderboards. 

**Tagline**: "A show that YOU can be part of"

**Three-Audience Platform**:
- **Brands**: Launch contests with clear ROI and authentic Gen Z engagement
- **Creators**: Compete nationally, earn badges, build profiles, access monetization
- **Spectators**: Watch, learn, participate, and discover viral content

## Tech Stack

### Core Frontend
- **React 19.1** with TypeScript 5.8
- **Vite 7.1** for build tooling
- **Zustand 5.0** for state management
- **React Router v7** for routing
- **TanStack Query v5** for server state (planned)
- **React Hook Form + Zod** for forms

### UI & Design
- **Tailwind CSS v3.4** with custom design tokens
- **Framer Motion v12** for animations
- **Lucide React** for icons
- Custom component library with purple/black/white design system

### Backend & Services
- **Supabase** for database, auth, realtime (fully implemented)
- **Supabase Authentication** - email/password with confirmation (✅ COMPLETED)
- **Custom TikTok OAuth** implementation (planned)
- **react-i18next** for Polish/English i18n

## Common Commands

```bash
# Development
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Database (when configured)
npx supabase start   # Start local Supabase
npx supabase reset   # Reset local database
npx supabase db push # Push schema changes

# Production Deployment
npm run build        # Production build with optimized animations
npm run preview      # Test production build locally
# Note: All animations are production-ready with performance optimization
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components (✅ LoginForm, RegisterForm)
│   ├── landing/        # Landing page components (Hero, Features) - Enhanced animations
│   ├── layout/         # Layout components (Navbar, LanguageSwitcher)
│   ├── leaderboard/    # Leaderboard components (LockedLeaderboard)
│   ├── ui/             # Base UI components (Button, Card, Badge) - Tesla-level animations
│   ├── contest/        # Contest-related components (planned)
│   ├── gamification/   # Gamification components (planned)
│   └── animations/     # Advanced animation systems and particle effects
├── lib/                # Utilities and configuration
│   ├── auth/          # Authentication context and hooks (✅ COMPLETED)
│   │   ├── context.tsx # AuthProvider with useAuth hook
│   │   └── hooks.ts   # useAuthForm, usePermissions, useProfile
│   ├── supabase/      # Supabase client configuration (✅ COMPLETED)
│   └── i18n/          # Internationalization config
├── pages/             # Page components (✅ COMPLETED)
│   ├── LandingPage.tsx # Landing page - Enhanced with floating elements and particles
│   ├── AuthPage.tsx   # Authentication modal/page
│   ├── DashboardPage.tsx # Protected dashboard
│   ├── ContestsPage.tsx # Contests page with anticipation building animations
│   ├── BrandsPage.tsx  # Brands page with updated Polish content
│   └── EducationPage.tsx # Education hub with updated content and CTAs
├── stores/            # Zustand state stores (planned)
├── hooks/             # Custom React hooks (planned)
├── features/          # Feature-specific code (planned)
├── types/             # TypeScript definitions (planned)
└── App.tsx            # Main application component
```

## Current Implementation Status

### Phase 1 - Foundation (✅ COMPLETED)
- Project setup with React 19 + TypeScript + Vite
- Tailwind CSS configuration with custom purple/black/white design system
- Basic project structure established

### Phase 2 - Core UI Components (✅ COMPLETED)
- **Navigation Bar**: Logo, Polish navigation links, PL/EN language switcher, auth buttons
- **Hero Section**: Large gradient title, Polish subtitle and description, CTA buttons
- **Features Section**: Three cards for Brands/Creators/Spectators with icons
- **Locked Leaderboard**: Padlock icon, "No active contests" message, mock preview

### Phase 3 - Authentication System (✅ COMPLETED)
- **Supabase Authentication**: Email/password with confirmation
- **User Registration**: Creator accounts with email validation
- **User Login**: Secure session management with error handling
- **Brand Contact**: Brands redirected to email contact (brands@seeutrending.com)
- **Protected Routes**: Dashboard accessible only when authenticated
- **Database Schema**: Working profiles table with automatic user creation
- **Role-Based Access**: Creator and Spectator roles implemented
- **UI Components**: LoginForm, RegisterForm with close buttons and Polish/English validation
- **User Management**: Profile hooks, permissions system, logout functionality

### Phase 4 - Advanced UI/UX Enhancements (✅ COMPLETED)
- **Tesla-Level Animations**: Million-dollar quality animations with GPU acceleration
- **Psychological Engagement**: Dopamine-driven micro-interactions and particle effects
- **Landing Page Evolution**: Dynamic floating elements, particle systems, interactive animations
- **Content Authenticity**: Removed all fake statistics for authentic user experience
- **Enhanced Polish Content**: Updated education hub text ("Wzorce Wirusowości" → "Schematy Virali")
- **Improved CTAs**: Changed education hub button ("Powiadom mnie" → "Dołącz teraz") with registration redirect
- **Multi-layered Animation System**: Background particles, orbiting elements, layered depth
- **Performance Optimization**: Reduced-motion support, GPU-accelerated transforms
- **Gaming Psychology Integration**: Achievement systems, engagement loops, FOMO triggers
- **Cross-platform Consistency**: Responsive animations scaling across all devices
- **Brand Messaging Updates**: More accurate Polish content for brands page

### Phase 5 - Gamification System (🔄 PLANNED)
- Points: Participation (10), Engagement (1/1000 views), Winner (500-5000)
- Levels: Rookie → Rising Star → Trendsetter → Viral Sensation → Icon
- Badges: Streaks, milestones, category champions, rankings

### Phase 6 - Real-time Features (🔄 PLANNED)
- Supabase Realtime for live leaderboard updates
- TikTok API polling every 5 minutes for stats
- Animated rank changes with Framer Motion

### Internationalization (✅ IMPLEMENTED)
- Polish as primary language (default)
- English as secondary option
- Complete translations for navigation, hero, features, and leaderboard sections
- Language switcher in navigation bar
- localStorage persistence for language preference
- Proper Polish pluralization support ready for implementation

## Development Guidelines

1. **State Management**: Use Zustand for client state, TanStack Query for server state
2. **Components**: Custom component library with consistent purple/black/white theme
3. **Styling**: Tailwind CSS v3.4 with custom design tokens, mobile-first approach
4. **TypeScript**: Strict mode enabled, proper type definitions
5. **Internationalization**: Use react-i18next with Polish as default, English as fallback
6. **Animations**: Tesla-level animation system with psychological engagement triggers
   - Multi-layered particle systems with GPU acceleration
   - Dopamine-driven micro-interactions and hover effects
   - Gaming psychology integration (achievement loops, FOMO triggers)
   - Performance-optimized with reduced-motion support
   - Cross-platform responsive animations
7. **Performance**: Code splitting, lazy loading, optimistic updates (planned)
8. **User Experience**: Authentic content only (no fake statistics)
9. **Content Strategy**: Culturally-adapted Polish content for maximum engagement

## Environment Variables

### Production Ready (✅ CONFIGURED)
```bash
VITE_SUPABASE_URL=https://sxmjwvrjxgylqtbfqykr.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:5173/api
```

### Future Implementation
```bash
VITE_TIKTOK_CLIENT_KEY=your_tiktok_client_key
VITE_TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
VITE_TIKTOK_REDIRECT_URI=http://localhost:5173/auth/tiktok/callback
VITE_REDIS_URL=your_redis_url
```

## Brand Colors & Design Tokens

```scss
// Current Implementation - Tesla-Level Professional Purple Theme
Primary: #8B5CF6 (Purple) with full scale (50-950)
Secondary: #6B7280 (Neutral Gray) with full scale
Accent: #A855F7 (Light Purple Accent)
Background: #000000 (Pure Black)
Background Light: #0F0F0F (Very Dark Gray)
Surface: #1A1A1A (Dark Gray)
Surface Light: #2D2D2D (Medium Gray)
Text Primary: #FFFFFF (Pure White)
Text Secondary: #A3A3A3 (Light Gray)
Text Muted: #6B7280 (Muted Gray)
Border: #404040 (Border Gray)

// Gamification & Achievement Colors
Legendary: #FFD700 (Gold) - Premium rewards and achievements
Epic: #A855F7 (Purple) - High-tier items and status
Rare: #3B82F6 (Blue) - Special features and bonuses
Common: #6B7280 (Gray) - Standard elements

// Animation & Interactive States
Particle: #8B5CF6 (Purple) with opacity variations
Glow: #A855F7 (Light Purple) with blur effects
Success: #10B981 (Green) - Achievement celebrations
Warning: #F59E0B (Amber) - Urgency and scarcity
Danger: #EF4444 (Red) - Critical actions
```

## Advanced Animation System (✅ IMPLEMENTED)

### Tesla-Level UI/UX Design Philosophy
The platform implements industry-leading animation patterns inspired by premium brands like Tesla, Apple, and high-end gaming interfaces. Every interaction is crafted to create memorable experiences that drive engagement and retention.

### Psychological Engagement Triggers
1. **Dopamine Hit Mechanics**:
   - Micro-interactions with immediate visual feedback
   - Particle effects on button hovers and interactions
   - Achievement celebrations with rotating and scaling elements
   - XP burst animations for reward feedback

2. **Anticipation Building**:
   - Live countdown timers creating urgency
   - Dynamic visual states that rotate every 3 seconds
   - Orbiting elements (stars, sparkles) around locked content
   - Pulsing rings and expanding circles
   - Social proof with "2,481 creators waiting" live indicators

3. **FOMO & Urgency Triggers**:
   - Limited time elements and scarcity indicators
   - Live activity counters with pulsing dots
   - Exclusive access with crown animations
   - Risk/reward clarity with clear prize visualization

### Multi-Layered Animation Architecture
- **Background Particles**: Floating elements responding to user interaction
- **Orbiting Systems**: Circular motion around key components
- **Layered Depth**: Multiple animation planes for visual richness
- **Context-Aware Animations**: Animations change based on user state
- **Performance Optimization**: GPU-accelerated with reduced-motion support

### Gaming Psychology Integration
- **Achievement Systems**: Clear progression paths with immediate feedback
- **Engagement Loops**: Trigger → Action → Reward → Investment → Return
- **Rarity-Based Visual Language**: Legendary (gold), Epic (purple), Rare (blue)
- **Collection Mechanics**: Badge systems with completion incentives
- **Status Building**: Level and rank visualization

### Cross-Platform Optimization
- **Responsive Animations**: Scale appropriately across all screen sizes
- **Device-Specific Optimizations**: Different animation sets for mobile/desktop
- **Performance Monitoring**: Animations adapt to device capabilities
- **Touch Optimization**: Special behaviors for touch vs mouse interactions
- **Battery-Aware**: Lighter animations on mobile devices

## Polish Language Notes

- Use proper Polish pluralization: zero, one, few (2-4), many (5+), other
- Cultural considerations: Professional, clean design preferred
- GDPR compliance required for Polish/EU market
- Authentication forms fully translated Polish/English
- Email templates support Polish language
- **Content Updates**: "Wzorce Wirusowości" → "Schematy Virali" for cultural authenticity
- **CTA Optimization**: "Powiadom mnie" → "Dołącz teraz" for higher conversion

## Authentication System Details (✅ COMPLETED)

### Database Schema (Working)
The following database schema has been successfully implemented and tested:

```sql
-- Profiles table with working trigger
CREATE TABLE public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  name text,
  role user_role not null default 'creator',
  avatar_url text,
  bio text,
  tiktok_handle text unique,
  tiktok_user_id text unique,
  total_followers integer default 0,
  verified boolean default false,
  xp_points integer default 0,
  level integer default 1,
  streak_days integer default 0,
  last_activity_date date default current_date,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Working trigger function for automatic profile creation
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

-- Trigger for automatic profile creation on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Authentication Flow
1. **Registration Process**: 
   - Creators register with email/password + name
   - Email confirmation required before first login
   - Automatic profile creation via database trigger
   - Brands are redirected to contact form instead of registration

2. **Login Process**:
   - Email/password authentication via Supabase
   - Session management with automatic token refresh
   - Protected route redirection to dashboard
   - Error handling with Polish/English translations

3. **User Roles**:
   - **Creator**: Full registration, dashboard access, contest participation (ready)
   - **Spectator**: Database ready, default role for new users
   - **Brand**: Contact-only approach, no direct registration

### Development Setup Instructions
1. **Environment Configuration**: Copy .env.local with working Supabase credentials
2. **Database Setup**: Schema already deployed to hosted Supabase instance
3. **Development Server**: Run `npm run dev` on http://localhost:5173
4. **Testing Authentication**: Click "Zarejestruj się" to test registration flow

### Troubleshooting Authentication Issues

#### Database Trigger Problems
If registration fails with profile creation errors:
- Verify `handle_new_user()` function exists in Supabase SQL Editor
- Check `on_auth_user_created` trigger is active
- Ensure `user_role` enum includes 'creator' and 'spectator'
- Verify Row Level Security policies are properly configured

#### Email Confirmation Issues
- Users must confirm email before first login attempt
- Check spam/junk folders for Supabase confirmation emails
- Test with valid, accessible email addresses only
- Supabase handles email templates and delivery automatically

#### Development Environment Issues
- Ensure development server runs on http://localhost:5173
- Verify .env.local has correct Supabase URL and anon key
- Check browser network tab for authentication API errors
- Clear browser localStorage if auth state becomes corrupted

### Implementation Files
- **Authentication Context**: `src/lib/auth/context.tsx` - AuthProvider with useAuth hook
- **Authentication Hooks**: `src/lib/auth/hooks.ts` - useAuthForm, usePermissions, useProfile
- **Login Component**: `src/components/auth/LoginForm.tsx` - Full login form with validation
- **Registration Component**: `src/components/auth/RegisterForm.tsx` - Creator registration form
- **Protected Routes**: `src/components/auth/ProtectedRoute.tsx` - Route protection wrapper
- **Dashboard**: `src/pages/DashboardPage.tsx` - Role-based dashboard content
- **Supabase Client**: `src/lib/supabase/client.ts` - Supabase configuration

## Animation & Design Implementation Files

### Core Animation Components
- **Landing Page**: `src/pages/LandingPage.tsx` - Enhanced with floating elements and particle systems
- **Hero Section**: `src/components/landing/Hero.tsx` - Dynamic animations with psychological triggers
- **UI Components**: `src/components/ui/` - Tesla-level micro-interactions and hover effects
- **Contest Page**: `src/pages/ContestsPage.tsx` - Anticipation building with live countdown and orbiting elements
- **Education Hub**: `src/pages/EducationPage.tsx` - Updated content and improved CTAs
- **Brands Page**: `src/pages/BrandsPage.tsx` - Culturally-adapted Polish messaging

### Animation System Architecture
- **Tailwind Config**: `tailwind.config.js` - Custom animations, keyframes, and design tokens
- **CSS Animations**: Advanced keyframe definitions for float, glow, particle, and orbital motions
- **Performance Layer**: GPU-accelerated transforms with reduced-motion accessibility
- **Responsive System**: Multi-breakpoint animation scaling
- **Interaction Layer**: Context-aware animations based on user behavior

### Content Authenticity Standards
- **No Fake Statistics**: All metrics removed until real data is available
- **Authentic Messaging**: Polish content culturally adapted for target audience
- **Trust Building**: Professional presentation without misleading information
- **Transparency**: Clear communication about platform status and availability