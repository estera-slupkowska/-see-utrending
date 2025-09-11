# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**SeeUTrending** - A gamified platform for branded UGC contests where creators compete in real-time national leaderboards.

**Tagline**: "A show that YOU can be part of"

**Three-Audience Platform**:
- **Brands**: Launch contests with clear ROI and authentic Gen Z engagement
- **Creators**: Compete nationally, earn badges, build profiles, access monetization  
- **Spectators**: Watch, learn, participate, and discover viral content

**Current Status**: Phase 2 Complete - Landing page with navigation, hero, features, and locked leaderboard

## Tech Stack

### Core Frontend (Exact Versions from package.json)
- **React 19.1.1** with TypeScript 5.8.3
- **Vite 7.1.2** for build tooling and development server
- **Zustand 5.0.8** for client state management
- **TanStack Query 5.86.0** for server state (planned)
- **React Router DOM 7.8.2** for routing (planned)

### UI & Styling (Current Implementation)
- **Tailwind CSS 3.4.17** with custom design tokens
- **Framer Motion 12.0.0-alpha.2** for animations (React 19 compatible)
- **Lucide React 0.542.0** for icons
- **Class Variance Authority 0.7.1** for component variants
- **Tailwind Merge 3.3.1** for conditional classes

### Forms & Validation (Ready to Use)
- **React Hook Form 7.62.0** with **Zod 4.1.5** for validation
- **@hookform/resolvers 5.2.1** for Zod integration

### Internationalization (Active Implementation)
- **react-i18next 15.7.3** with **Polish as default language**
- **i18next 25.5.1** core library
- **i18next-browser-languagedetector 8.2.0** for language detection

### Backend & Services (Configured, Not Connected)
- **Supabase JS 2.57.0** for database, auth, realtime
- Custom TikTok OAuth implementation (planned)
- Upstash Redis for caching (planned)

## Common Commands

### Development (Verified Working)
```bash
# Start development server
npm run dev          # Runs on http://localhost:5173 (auto-increments if port busy)

# Build and preview
npm run build        # TypeScript compile + Vite production build
npm run preview      # Preview production build locally

# Code quality
npm run lint         # Run ESLint on all files
```

### Missing Commands (Add These)
```bash
# Add these to package.json scripts
"type-check": "tsc --noEmit",           # Type checking without build
"format": "prettier --write .",         # Format all files
"format:check": "prettier --check .",   # Check formatting
```

### Database Operations (When Supabase Connected)
```bash
# Requires Docker for local development
npx supabase start   # Start local Supabase stack
npx supabase db push # Push schema changes to database
npx supabase reset   # Reset local database with fresh data
npx supabase status  # Check running services
```

### Future Deployment
```bash
# Requires Vercel account and project setup
vercel deploy        # Deploy to Vercel
vercel --prod        # Deploy to production
```

## Project Structure (Current Implementation)

```
seeutrending/
├── src/
│   ├── components/
│   │   ├── ui/                    # ✅ Base components (Button, Card)
│   │   │   ├── button.tsx         # CVA-based button with variants
│   │   │   ├── card.tsx           # Modular card components
│   │   │   └── index.ts           # Clean exports
│   │   ├── layout/                # ✅ Layout components
│   │   │   ├── Navbar.tsx         # Navigation with i18n
│   │   │   └── LanguageSwitcher.tsx # PL/EN toggle
│   │   ├── landing/               # ✅ Landing page sections
│   │   │   ├── HeroSection.tsx    # Main hero with CTAs
│   │   │   └── FeaturesSection.tsx # Three-column features
│   │   ├── leaderboard/           # ✅ Leaderboard components
│   │   │   └── LockedLeaderboard.tsx # Mock leaderboard with lock
│   │   └── [future folders]       # contest/, gamification/, auth/
│   ├── lib/
│   │   ├── i18n/                  # ✅ Internationalization
│   │   │   └── config.ts          # Complete PL/EN translations
│   │   ├── supabase/              # ✅ Database config
│   │   │   ├── client.ts          # Browser client
│   │   │   └── admin.ts           # Server client (unused)
│   │   └── utils.ts               # ✅ Utility functions
│   ├── types/
│   │   ├── supabase.ts            # ✅ Database type definitions
│   │   └── index.ts               # ✅ Application types
│   └── App.tsx                    # ✅ Main app component
├── public/                        # Static assets
├── .env.example                   # ✅ Environment template
├── tailwind.config.js             # ✅ Custom design tokens
├── postcss.config.js              # ✅ PostCSS configuration
├── package.json                   # ✅ Dependencies (name needs update)
└── CLAUDE.md                      # ✅ This file
```

## Implementation Status

### ✅ Completed Features (Phase 1-2)
1. **Navigation System**
   - Logo with gradient text effect
   - Polish navigation items (Strona główna, Konkursy, Ranking, Twórcy, Marki)
   - PL/EN language switcher with localStorage persistence
   - Login/Register buttons (UI only)

2. **Landing Page Sections**
   - **Hero**: Large gradient title, Polish tagline, description, dual CTAs
   - **Features**: Three icon cards for Brands/Creators/Spectators
   - **Locked Leaderboard**: Padlock icon, "Brak aktywnych konkursów", mock rankings

3. **Design System**
   - Purple (#8B5CF6) primary with black/white foundation
   - Custom Tailwind utilities (.card-clean, .gradient-text, .glow-button)
   - Responsive layout with mobile navigation

4. **Internationalization**
   - Complete Polish translations (default)
   - English translations with toggle
   - Proper namespace organization (nav, hero, features, leaderboard)

5. **Developer Experience**
   - TypeScript with strict mode
   - Tailwind with IntelliSense
   - Hot module replacement working
   - Component organization by feature

### 🚧 Phase 3: Authentication & Routing (Next Priority)
```bash
# Commands you'll need to run for Phase 3
npm install @supabase/auth-helpers-react
# Set up TikTok OAuth (custom implementation required)
# Create auth pages and flows
```

### 📋 Phase 4-5: Advanced Features (Planned)
- Contest creation and management
- Real-time leaderboard updates
- Badge and gamification system
- Creator profiles and statistics
- TikTok video submission flow

## Development Patterns

### Component Architecture (Follow This Pattern)
```typescript
// src/components/[feature]/ComponentName.tsx
import { useTranslation } from 'react-i18next'
import { Button } from '../ui'

interface ComponentNameProps {
  // Define props with TypeScript
}

export function ComponentName({ ...props }: ComponentNameProps) {
  const { t } = useTranslation()
  
  return (
    <div className="card-clean">  {/* Use design system classes */}
      <h2 className="gradient-text">{t('namespace.key')}</h2>
      <Button variant="primary">{t('common.action')}</Button>
    </div>
  )
}
```

### Internationalization Pattern
```typescript
// Add translations to src/lib/i18n/config.ts
const resources = {
  pl: { 
    translation: { 
      "nav.home": "Strona główna",
      "hero.title": "SeeUTrending"
    } 
  },
  en: { 
    translation: { 
      "nav.home": "Home",
      "hero.title": "SeeUTrending" 
    } 
  }
}

// Use in components
const { t } = useTranslation()
<h1>{t('hero.title')}</h1>
```

### Design System Classes (Defined in src/index.css)
```css
.card-clean        /* bg-surface border border-border rounded-xl p-6 */
.gradient-text     /* bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent */
.glow-button      /* Purple gradient with glow effect */
.locked-content   /* Dashed border for placeholder content */
.purple-accent    /* text-primary for purple highlights */
```

## Environment Setup

### Required Environment Variables
```bash
# Copy .env.example to .env.local and fill these values:

# Supabase Configuration (Required for Phase 3+)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key  
VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# TikTok OAuth (Required for creator authentication)
VITE_TIKTOK_CLIENT_KEY=your_tiktok_client_key
VITE_TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
VITE_TIKTOK_REDIRECT_URI=http://localhost:5173/auth/tiktok/callback

# Optional Services
VITE_REDIS_URL=your_redis_url                 # For caching
VITE_APP_URL=http://localhost:5173            # App base URL
VITE_API_BASE_URL=http://localhost:5173/api   # API base URL
```

### Setup Steps for New Developers
```bash
# 1. Clone and install
git clone [repository-url] seeutrending
cd seeutrending
npm install

# 2. Environment setup
cp .env.example .env.local
# Edit .env.local with actual values

# 3. Start development
npm run dev
# Open http://localhost:5173

# 4. Verify everything works
# - Navigation should show Polish text
# - Language switcher should toggle PL/EN
# - All buttons should have hover effects
# - Locked leaderboard should show padlock icon
```

## Color Scheme & Design Tokens

```scss
// Tailwind custom colors (tailwind.config.js)
Primary:           #8B5CF6  /* Main purple - buttons, links, accents */
Primary Scale:     50-950   /* Full Tailwind scale available */
Accent:            #A855F7  /* Light purple - highlights, secondary actions */
Background:        #000000  /* Pure black - body background */
Background Light:  #0F0F0F  /* Very dark gray - sections */
Surface:           #1A1A1A  /* Dark gray - cards, modals */
Surface Light:     #2D2D2D  /* Medium gray - active states */
Text Primary:      #FFFFFF  /* Pure white - headings, important text */
Text Secondary:    #A3A3A3  /* Light gray - body text, descriptions */
Text Muted:        #6B7280  /* Muted gray - placeholders, disabled */
Border:            #404040  /* Gray - dividers, card borders */
```

## Polish Language Implementation

### Pluralization Rules (Implemented in i18next)
```javascript
// Polish has complex plural forms
zero:  "0 items"              // 0 
one:   "1 item"               // 1
few:   "2-4 items"            // 2, 3, 4
many:  "5+ items"             // 5, 6, 7, ..., 10, 11, ..., 20, 21, ...
other: "other items"          // Decimals, complex numbers
```

### Cultural Considerations
- **Design Preference**: Clean, professional layouts (current design aligns)
- **Language**: Formal language in business contexts (use formal Polish forms)
- **Privacy**: GDPR compliance required (implement in auth flow)
- **Payment**: Consider Przelewy24 integration for Polish market (future)

## Troubleshooting

### Development Issues
```bash
# Port already in use
npm run dev  # Vite auto-increments port (5173 -> 5174 -> 5175)

# TypeScript errors
npm run build  # Shows all TS errors, must fix before build succeeds

# Tailwind classes not working
# 1. Check postcss.config.js exists
# 2. Restart dev server
# 3. Verify @tailwind directives in src/index.css

# i18n translations not loading
# 1. Check src/lib/i18n/config.ts has the key
# 2. Verify translation namespace matches usage
# 3. Check browser localStorage for language setting
```

### Dependency Issues
```bash
# Framer Motion compatibility
# Using v12.0.0-alpha.2 for React 19 compatibility
# If issues, try: npm install motion@latest

# Tailwind IntelliSense not working
# Install "Tailwind CSS IntelliSense" VS Code extension
# Ensure tailwind.config.js is at project root
```

### Build Issues
```bash
# Type errors during build
npm run type-check  # (Add to package.json if missing)

# Bundle analysis
npm run build && npm run preview
# Check Network tab in DevTools for bundle sizes
```

## Development Workflow (Anthropic Best Practices)

### Explore-Plan-Code-Commit Pattern
1. **Explore**: Read relevant files before coding
2. **Plan**: Use "think" mode for complex features  
3. **Code**: Implement with TypeScript safety
4. **Commit**: Verify solution works as expected

### When Adding New Features
1. **Check translations**: Add i18n keys for Polish/English
2. **Follow naming**: PascalCase components, kebab-case utilities
3. **Use design system**: Leverage .card-clean, .gradient-text, etc.
4. **Test responsiveness**: Check mobile and desktop layouts
5. **Update this file**: Document new patterns and commands

### Code Quality Standards
- All user-facing text must use `useTranslation()` hook
- Components must be responsive (mobile-first)
- Use TypeScript interfaces for all props
- Follow the established folder structure
- Maintain the purple/black/white color scheme

This documentation reflects the actual implementation as verified against package.json and source code on [current date].