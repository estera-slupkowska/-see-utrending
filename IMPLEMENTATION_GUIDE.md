# SeeUTrending Implementation Guide

## Project Overview
This guide provides step-by-step implementation instructions for SeeUTrending's exceptional UI design system, based on comprehensive competitive research and Polish market analysis.

## Development Roadmap

### Phase 1: Foundation Setup (✅ COMPLETED)

Successfully completed project foundation including React 19.1, TypeScript, Vite 7.1, and Tailwind CSS configuration.

### Phase 2: Core UI Components (✅ COMPLETED) 

Successfully implemented landing page, navigation, internationalization, and core UI components.

### Phase 3: Authentication System (✅ COMPLETED)

Successfully implemented complete Supabase authentication system with working database schema, user registration, login, and protected routes.

### Phase 4: Authentication Implementation Details

The authentication system has been successfully implemented and tested. Below are the key components and implementation details:

#### 4.1 Supabase Database Schema (✅ IMPLEMENTED)

**Working Database Schema:**
```sql
-- User roles enum
CREATE TYPE user_role AS ENUM ('creator', 'spectator');

-- Profiles table with gamification fields
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

-- Automatic profile creation trigger (WORKING)
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

#### 4.2 Authentication Context (✅ IMPLEMENTED)

**File: `src/lib/auth/context.tsx`**
```tsx
interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updateProfile: (updates: Record<string, any>) => Promise<{ error: AuthError | null }>
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Session management with automatic token refresh
  // Real-time auth state changes
  // Error handling and loading states
}
```

#### 4.3 Authentication Hooks (✅ IMPLEMENTED)

**File: `src/lib/auth/hooks.ts`**
```tsx
// Form handling with error translation
export function useAuthForm(): UseAuthFormResult {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const signIn = async (email: string, password: string): Promise<boolean> => {
    // Error handling with Polish/English translations
  }
  
  const signUp = async (email: string, password: string, metadata?: Record<string, any>): Promise<boolean> => {
    // Creator registration with metadata
  }
}

// Role-based permissions
export function usePermissions() {
  const isCreator = (): boolean => hasRole('creator')
  const isSpectator = (): boolean => hasRole('spectator')
}

// Profile management
export function useProfile() {
  const updateUserProfile = async (updates: Record<string, any>): Promise<boolean> => {
    // Profile updates with error handling
  }
}
```

#### 4.4 Authentication Forms (✅ IMPLEMENTED)

**Login Form: `src/components/auth/LoginForm.tsx`**
- Email/password validation with Zod schema
- Polish/English error messages
- Password visibility toggle
- Loading states and error handling
- Close button (X) functionality
- Forgot password link

**Registration Form: `src/components/auth/RegisterForm.tsx`**  
- Creator account registration
- Name, email, password, confirm password fields
- Terms and conditions acceptance
- Brand contact redirection
- Password complexity validation
- Close button (X) functionality

#### 4.5 Protected Routes (✅ IMPLEMENTED)

**File: `src/components/auth/ProtectedRoute.tsx`**
```tsx
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  
  if (loading) return <LoadingSpinner />
  if (!user) return <Navigate to="/" replace />
  
  return <>{children}</>
}
```

#### 4.6 Dashboard Implementation (✅ IMPLEMENTED)

**File: `src/pages/DashboardPage.tsx`**
- Role-based content display
- User profile information
- Statistics cards (contests, XP, ranking)
- Quick actions menu
- Creator/Brand/Spectator specific sections

#### 4.7 Navigation Integration (✅ IMPLEMENTED)

**File: `src/components/layout/Navbar.tsx`**
- Authentication buttons for logged-out users
- User dropdown menu for logged-in users
- Role badges display
- Logout functionality
- Language switcher integration

### Phase 4.8: Authentication Testing Guide (✅ COMPLETED)

#### Complete Authentication Flow Testing

**1. Environment Setup**
```bash
# Ensure proper environment configuration
VITE_SUPABASE_URL=https://sxmjwvrjxgylqtbfqykr.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_URL=http://localhost:5173
```

**2. Registration Testing**
- Visit http://localhost:5173
- Click "Zarejestruj się" (Sign up)
- Fill creator registration form
- Submit and verify email confirmation sent
- Confirm email via link in inbox
- Verify profile created in database

**3. Login Testing**
- Return to application after email confirmation
- Click "Zaloguj się" (Login)
- Enter confirmed credentials
- Verify successful login and dashboard access
- Test logout functionality

**4. Protected Route Testing**
- Access /dashboard while logged out (should redirect)
- Access /dashboard while logged in (should work)
- Test navigation between protected and public routes

**5. Error Handling Testing**
- Test invalid login credentials
- Test registration with existing email
- Test weak password validation
- Test network error scenarios
- Verify Polish/English error translations

#### Authentication System Status Summary

**✅ WORKING COMPONENTS:**
- Database schema with automatic profile creation
- User registration (Creator accounts)
- Email confirmation flow
- User login with session management
- Protected routes with React Router
- Role-based dashboard content
- User dropdown with profile info
- Logout functionality
- Form validation with Zod
- Polish/English error messages
- Close buttons on auth forms
- Password visibility toggles
- Brand contact redirection

**🔧 INTEGRATION POINTS:**
- AuthProvider wraps entire application
- useAuth hook available throughout app
- useAuthForm for authentication operations
- usePermissions for role-based access
- useProfile for user data management

**📊 PERFORMANCE OPTIMIZATIONS:**
- Authentication state persistence
- Automatic token refresh
- Optimistic UI updates
- Loading states for UX
- Error boundary integration

### Phase 5: Future Implementation (🔄 PLANNED)

#### 5.1 Contest System Development
- Contest creation and management
- Real-time leaderboards with Supabase Realtime
- TikTok API integration for content tracking
- Automated scoring and ranking systems

#### 5.2 Gamification Features
- XP point calculation and distribution
- Level progression system
- Badge and achievement system
- Streak tracking and rewards

#### 5.3 TikTok OAuth Integration
- Custom OAuth flow (Supabase doesn't support TikTok)
- Token management and refresh
- TikTok profile data synchronization
- Content permission handling

### Phase 5 Development Guide (Future)

#### 1.1 Design System Integration

**File: tailwind.config.js**
```javascript
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F3F1FF',
          100: '#E9E5FF',
          200: '#D6CFFF',
          300: '#B8A9FF',
          400: '#9576FF',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        'electric-cyan': {
          50: '#ECFEFF',
          500: '#06B6D4',
          900: '#164E63',
        },
        'xp-gold': {
          50: '#FFFBEB',
          500: '#FCD34D',
          900: '#92400E',
        },
        'streak-orange': {
          500: '#FB923C',
        },
        'polish-red': {
          500: '#DC143C',
        },
        'trust-blue': {
          500: '#1E40AF',
        },
        surface: {
          DEFAULT: '#1A1A1A',
          light: '#2A2A2A',
        },
        background: '#0A0A0A',
      },
      fontFamily: {
        primary: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      animation: {
        'badge-unlock': 'badgeUnlock 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'shimmer': 'shimmer 2s infinite',
        'slide-in-up': 'slideInUp 0.3s ease-out',
        'rank-change': 'rankChange 0.5s ease-in-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        badgeUnlock: {
          '0%': { transform: 'scale(0) rotate(-180deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(0deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        rankChange: {
          '0%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-10px)' },
          '75%': { transform: 'translateX(10px)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

#### 1.2 Component Library Setup

**Create: src/components/ui/Button.tsx**
```tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gaming' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-background';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-500/25',
    secondary: 'bg-transparent text-primary-500 border-2 border-primary-500 hover:bg-primary-500 hover:text-white',
    gaming: 'bg-gradient-to-r from-xp-gold-500 to-streak-orange-500 text-gray-900 hover:shadow-lg hover:shadow-xp-gold-500/25 uppercase tracking-wider font-bold relative overflow-hidden',
    ghost: 'bg-transparent text-gray-300 hover:bg-surface-light hover:text-white',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  return (
    <button
      className={cn(baseClasses, variants[variant], sizes[size], className)}
      {...props}
    >
      {variant === 'gaming' && (
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-500 hover:translate-x-full"></span>
      )}
      {children}
    </button>
  );
};
```

**Create: src/components/ui/Card.tsx**
```tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ className, children, hover = true }) => {
  return (
    <div className={cn(
      'bg-surface border border-gray-700 rounded-xl p-6 transition-all duration-300',
      hover && 'hover:-translate-y-1 hover:border-primary-500 hover:shadow-xl hover:shadow-black/20',
      className
    )}>
      {children}
    </div>
  );
};
```

### Phase 2: Core Components (Week 3-4)

#### 2.1 Contest Card Component

**Create: src/components/contests/ContestCard.tsx**
```tsx
import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Clock, Users, Trophy } from 'lucide-react';
import { Contest } from '@/types';

interface ContestCardProps {
  contest: Contest;
  onJoin?: (contestId: string) => void;
}

export const ContestCard: React.FC<ContestCardProps> = ({ contest, onJoin }) => {
  const getStatusColor = (status: Contest['status']) => {
    switch (status) {
      case 'live':
        return 'bg-green-500 text-white animate-pulse';
      case 'ending_soon':
        return 'bg-amber-500 text-white';
      case 'upcoming':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Card className="max-w-sm overflow-hidden p-0">
      {/* Contest Header */}
      <div className="relative h-48 bg-gradient-to-br from-primary-500 to-electric-cyan-500 flex items-center justify-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
          <img src={contest.brand.logo} alt={contest.brand.name} className="w-12 h-12 object-contain" />
        </div>
        <Badge className={cn('absolute top-4 right-4', getStatusColor(contest.status))}>
          {contest.status.replace('_', ' ')}
        </Badge>
      </div>

      {/* Contest Body */}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2">{contest.title}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{contest.description}</p>

        {/* Stats */}
        <div className="flex justify-between mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Users className="w-4 h-4 text-primary-500" />
            </div>
            <div className="text-lg font-semibold text-primary-500">{contest.participants}</div>
            <div className="text-xs text-gray-500">Participants</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Trophy className="w-4 h-4 text-xp-gold-500" />
            </div>
            <div className="text-lg font-semibold text-xp-gold-500">{contest.prize}</div>
            <div className="text-xs text-gray-500">Prize</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-lg font-semibold text-gray-300">{contest.timeRemaining}</div>
            <div className="text-xs text-gray-500">Left</div>
          </div>
        </div>

        {/* Prize Pool */}
        <div className="bg-surface-light p-3 rounded-lg mb-4">
          <div className="text-2xl font-bold text-xp-gold-500">{contest.prizePool}</div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 pb-6 flex justify-between items-center">
        <div className="text-sm text-gray-400">
          <Clock className="w-4 h-4 inline mr-1" />
          {contest.endDate}
        </div>
        <Button 
          variant="primary" 
          size="sm"
          onClick={() => onJoin?.(contest.id)}
        >
          Join Contest
        </Button>
      </div>
    </Card>
  );
};
```

#### 2.2 Leaderboard Component

**Create: src/components/leaderboard/Leaderboard.tsx**
```tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, TrendingUp, TrendingDown } from 'lucide-react';
import { LeaderboardEntry } from '@/types';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  showPodium?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ entries, showPodium = true }) => {
  const top3 = entries.slice(0, 3);
  const remaining = entries.slice(3);

  return (
    <div className="space-y-8">
      {/* Podium */}
      {showPodium && (
        <div className="flex justify-center items-end gap-8 py-12">
          {[top3[1], top3[0], top3[2]].map((entry, index) => {
            if (!entry) return null;
            const position = [2, 1, 3][index];
            const heights = ['h-32', 'h-40', 'h-24'];
            const colors = [
              'from-gray-400 to-gray-500',
              'from-xp-gold-500 to-yellow-600',
              'from-amber-600 to-amber-700'
            ];

            return (
              <motion.div
                key={entry.id}
                initial={{ scale: 0, y: 100 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ delay: index * 0.2, type: 'spring', stiffness: 200 }}
                className="text-center cursor-pointer group"
              >
                <div className="relative mb-4">
                  <img
                    src={entry.creator.avatar}
                    alt={entry.creator.name}
                    className={cn(
                      'w-20 h-20 rounded-full border-4 mx-auto transition-transform group-hover:scale-110',
                      position === 1 && 'border-xp-gold-500 w-24 h-24',
                      position === 2 && 'border-gray-400',
                      position === 3 && 'border-amber-600'
                    )}
                  />
                  <div className={cn(
                    'absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm',
                    `bg-gradient-to-br ${colors[index]}`
                  )}>
                    {position}
                  </div>
                </div>
                <h3 className="font-semibold text-white mb-1">{entry.creator.name}</h3>
                <p className="text-2xl font-bold text-primary-500">{entry.score.toLocaleString()}</p>
                <div className={cn('w-16 mx-auto mt-2 rounded-t-lg', heights[index], `bg-gradient-to-t ${colors[index]}`)} />
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Remaining Entries */}
      <div className="space-y-3">
        <AnimatePresence>
          {remaining.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center bg-surface border border-gray-700 rounded-xl p-4 hover:border-primary-500 hover:translate-x-1 transition-all duration-200"
            >
              <div className="text-xl font-bold text-primary-500 min-w-[3rem] text-center">
                {index + 4}
              </div>
              
              <div className="flex items-center gap-4 flex-1">
                <img
                  src={entry.creator.avatar}
                  alt={entry.creator.name}
                  className="w-12 h-12 rounded-full border-2 border-gray-600"
                />
                <div>
                  <h4 className="font-semibold text-white">{entry.creator.name}</h4>
                  <p className="text-sm text-gray-400">@{entry.creator.handle}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-bold text-primary-500">
                  {entry.score.toLocaleString()}
                </div>
                {entry.change && (
                  <div className={cn(
                    'text-sm flex items-center justify-end gap-1',
                    entry.change > 0 ? 'text-green-500' : 'text-red-500'
                  )}>
                    {entry.change > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {Math.abs(entry.change)}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
```

### Phase 3: Advanced Features (Week 5-6)

#### 3.1 Real-time Updates with Supabase

**Create: src/hooks/useRealtimeLeaderboard.ts**
```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { LeaderboardEntry } from '@/types';

export const useRealtimeLeaderboard = (contestId: string) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    fetchLeaderboard();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`leaderboard:${contestId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leaderboard_entries',
          filter: `contest_id=eq.${contestId}`,
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [contestId]);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('leaderboard_entries')
        .select(`
          *,
          creator:creators(*)
        `)
        .eq('contest_id', contestId)
        .order('score', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return { entries, loading, refresh: fetchLeaderboard };
};
```

#### 3.2 Polish Language Integration

**Create: src/i18n/pl.json**
```json
{
  "common": {
    "loading": "Ładowanie...",
    "error": "Błąd",
    "success": "Sukces",
    "cancel": "Anuluj",
    "confirm": "Potwierdź",
    "save": "Zapisz",
    "delete": "Usuń",
    "edit": "Edytuj"
  },
  "navigation": {
    "home": "Główna",
    "contests": "Konkursy",
    "leaderboard": "Ranking",
    "profile": "Profil",
    "dashboard": "Panel"
  },
  "hero": {
    "headline": "Show, że każdy może w nim uczestniczyć",
    "subheadline": "Gamifikowana platforma dla konkursów branded UGC, gdzie twórcy rywalizują w rankingach narodowych w czasie rzeczywistym",
    "cta_primary": "Rozpocznij Konkurowanie",
    "cta_secondary": "Zobacz Konkursy"
  },
  "contests": {
    "live": "Na żywo",
    "ending_soon": "Kończy się niedługo",
    "upcoming": "Nadchodzące",
    "participants": "Uczestników",
    "prize": "Nagroda",
    "time_left": "Pozostało",
    "join_contest": "Dołącz do konkursu"
  },
  "leaderboard": {
    "rank": "Pozycja",
    "creator": "Twórca",
    "score": "Punkty",
    "change": "Zmiana"
  }
}
```

### Phase 4: Mobile Optimization (Week 7)

#### 4.1 Mobile Navigation

**Create: src/components/navigation/MobileNavigation.tsx**
```tsx
import React from 'react';
import { Home, Trophy, User, Search, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Główna' },
    { id: 'contests', icon: Search, label: 'Konkursy' },
    { id: 'create', icon: Plus, label: 'Utwórz' },
    { id: 'leaderboard', icon: Trophy, label: 'Ranking' },
    { id: 'profile', icon: User, label: 'Profil' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-lg border-t border-gray-700 z-50 md:hidden">
      <div className="flex justify-around py-2">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={cn(
              'flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200',
              activeTab === id
                ? 'text-primary-500 bg-primary-500/10'
                : 'text-gray-400 hover:text-gray-300'
            )}
          >
            <Icon className={cn('w-6 h-6 mb-1', id === 'create' && 'w-8 h-8')} />
            <span className="text-xs font-medium">{label}</span>
            {activeTab === id && (
              <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};
```

#### 4.2 Responsive Contest Grid

**Update: src/components/contests/ContestGrid.tsx**
```tsx
import React from 'react';
import { ContestCard } from './ContestCard';
import { Contest } from '@/types';

interface ContestGridProps {
  contests: Contest[];
  loading?: boolean;
}

export const ContestGrid: React.FC<ContestGridProps> = ({ contests, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-surface border border-gray-700 rounded-xl p-6 animate-pulse">
            <div className="h-48 bg-gray-700 rounded-lg mb-4" />
            <div className="h-4 bg-gray-700 rounded mb-2" />
            <div className="h-3 bg-gray-700 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {contests.map((contest) => (
        <ContestCard key={contest.id} contest={contest} />
      ))}
    </div>
  );
};
```

## Performance Optimization Checklist

### Images & Assets
- [ ] Implement lazy loading for contest images
- [ ] Use WebP format with fallbacks
- [ ] Optimize logo and avatar loading
- [ ] Implement progressive image enhancement

### Code Splitting
- [ ] Route-based code splitting
- [ ] Component-based lazy loading
- [ ] Third-party library splitting

### Caching Strategy
- [ ] Implement Redis caching for leaderboards
- [ ] Browser caching for static assets
- [ ] Service worker for offline functionality

## Testing Implementation

### Unit Tests
```bash
npm install -D @testing-library/react @testing-library/jest-dom vitest
```

**Create: src/components/__tests__/Button.test.tsx**
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../ui/Button';

describe('Button Component', () => {
  it('renders correctly with primary variant', () => {
    render(<Button variant="primary">Test Button</Button>);
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Deployment Configuration

### Environment Variables
```bash
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_TIKTOK_CLIENT_KEY=your_tiktok_client_key
VITE_TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
VITE_REDIS_URL=your_redis_url
```

### Vercel Configuration
**Create: vercel.json**
```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET, POST, PUT, DELETE, OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" }
      ]
    }
  ]
}
```

## Success Metrics & Monitoring

### Key Performance Indicators
- **Core Web Vitals**: LCP < 2.5s, FID < 100ms, CLS < 0.1
- **Time to Interactive**: < 3s on 3G
- **Bundle Size**: < 500KB initial load
- **Polish Language Accuracy**: 100% proper diacritic rendering

### Analytics Implementation
```typescript
// src/lib/analytics.ts
import { Analytics } from '@vercel/analytics';

export const trackEvent = (event: string, properties?: Record<string, any>) => {
  Analytics.track(event, properties);
};

// Usage examples:
trackEvent('contest_joined', { contest_id: 'abc123', user_type: 'creator' });
trackEvent('leaderboard_viewed', { contest_id: 'abc123', rank_position: 5 });
```

This implementation guide provides a comprehensive roadmap for developing SeeUTrending's exceptional UI, ensuring cultural authenticity, technical excellence, and user engagement optimization.