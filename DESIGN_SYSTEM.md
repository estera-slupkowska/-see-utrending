# SeeUTrending Design System

## Design Philosophy

**"Gamified Polish Minimalism"** - A design system that combines the clean functionality of modern minimalism with the cultural preferences of the Polish market and the engaging elements of gamification platforms.

### Core Principles
1. **Cultural Authenticity**: Respects Polish design preferences and language requirements
2. **Gamified Engagement**: Motivates through visual rewards and clear progression
3. **Multi-Audience Clarity**: Serves creators, brands, and spectators distinctly
4. **Mobile-First Excellence**: Touch-friendly, responsive across all devices
5. **Performance Focused**: Fast loading, smooth animations, optimal UX

## Color System

### Primary Palette
Based on current foundation with Polish cultural adaptation:

```scss
// Primary Brand Colors
--color-primary: #8B5CF6;        // Violet (current)
--color-primary-light: #A78BFA;  // Light violet
--color-primary-dark: #7C3AED;   // Dark violet

// Secondary Accent Colors  
--color-electric-cyan: #06B6D4;   // Energy & innovation
--color-success-green: #10B981;   // Achievements & success
--color-warning-amber: #F59E0B;   // Attention & urgency
--color-error-red: #EF4444;       // Errors & alerts

// Polish Cultural Adaptation
--color-polish-red: #DC143C;      // Traditional Polish red
--color-trust-blue: #1E40AF;      // Professional trust (bank-inspired)
```

### Neutral Palette
```scss
// Dark Theme Foundation
--color-background: #0A0A0A;      // Deep black
--color-surface: #1A1A1A;         // Dark gray surface
--color-surface-light: #2A2A2A;   // Lighter surface
--color-border: #374151;          // Border gray

// Text Colors
--color-text-primary: #F9FAFB;    // High contrast white
--color-text-secondary: #D1D5DB;  // Medium contrast
--color-text-muted: #9CA3AF;      // Low contrast
--color-text-inverse: #111827;    // Dark on light
```

### Semantic Colors
```scss
// Gamification Colors
--color-xp-gold: #FCD34D;         // Experience points
--color-streak-orange: #FB923C;   // Streak indicators
--color-level-purple: #8B5CF6;    // Level progression
--color-badge-blue: #3B82F6;      // Achievement badges

// Contest Status Colors
--color-live-green: #10B981;      // Live contests
--color-ending-amber: #F59E0B;    // Ending soon
--color-draft-gray: #6B7280;      // Draft status
--color-winner-gold: #FCD34D;     // Winner highlights
```

## Typography System

### Font Stack
```scss
// Primary Font (Polish diacritic support essential)
--font-primary: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;

// Display Font (Headings)
--font-display: 'Inter', 'Segoe UI', system-ui, sans-serif;

// Monospace (Code/Data)
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Type Scale
```scss
// Display Sizes
--text-display-2xl: 4.5rem;   // 72px - Hero headings
--text-display-xl: 3.75rem;   // 60px - Page headings
--text-display-lg: 3rem;      // 48px - Section headings

// Heading Sizes
--text-h1: 2.25rem;          // 36px - H1
--text-h2: 1.875rem;         // 30px - H2
--text-h3: 1.5rem;           // 24px - H3
--text-h4: 1.25rem;          // 20px - H4

// Body Sizes
--text-lg: 1.125rem;         // 18px - Large body
--text-base: 1rem;           // 16px - Base body
--text-sm: 0.875rem;         // 14px - Small text
--text-xs: 0.75rem;          // 12px - Micro text
```

### Font Weights
```scss
--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
--font-weight-black: 900;
```

## Spacing System

### Space Scale
```scss
--space-1: 0.25rem;    // 4px
--space-2: 0.5rem;     // 8px
--space-3: 0.75rem;    // 12px
--space-4: 1rem;       // 16px
--space-5: 1.25rem;    // 20px
--space-6: 1.5rem;     // 24px
--space-8: 2rem;       // 32px
--space-10: 2.5rem;    // 40px
--space-12: 3rem;      // 48px
--space-16: 4rem;      // 64px
--space-20: 5rem;      // 80px
--space-24: 6rem;      // 96px
--space-32: 8rem;      // 128px
```

### Component Spacing
```scss
--space-button-padding-x: var(--space-6);  // 24px
--space-button-padding-y: var(--space-3);  // 12px
--space-card-padding: var(--space-6);       // 24px
--space-section-gap: var(--space-16);       // 64px
```

## Component Design Specifications

### Buttons

#### Primary Button
```css
.btn-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: var(--color-text-primary);
  padding: var(--space-3) var(--space-6);
  border-radius: 0.5rem;
  font-weight: var(--font-weight-semibold);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 25px rgba(139, 92, 246, 0.25);
  }
}
```

#### Secondary Button
```css
.btn-secondary {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
  padding: var(--space-3) var(--space-6);
  border-radius: 0.5rem;
  font-weight: var(--font-weight-semibold);
  transition: all 0.2s ease;
  
  &:hover {
    background: var(--color-primary);
    color: var(--color-text-primary);
  }
}
```

#### Gaming CTA Button (Special)
```css
.btn-gaming {
  background: linear-gradient(135deg, var(--color-xp-gold) 0%, var(--color-streak-orange) 100%);
  color: var(--color-text-inverse);
  padding: var(--space-4) var(--space-8);
  border-radius: 0.75rem;
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
}
```

### Cards

#### Contest Card
```css
.contest-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: var(--space-6);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    border-color: var(--color-primary);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
  
  &.live::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--color-live-green), var(--color-electric-cyan));
    animation: pulse 2s infinite;
  }
}
```

#### Leaderboard Card
```css
.leaderboard-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-4);
  transition: all 0.2s ease;
  
  &.rank-1 {
    background: linear-gradient(135deg, var(--color-xp-gold) 0%, #FCD34D 100%);
    color: var(--color-text-inverse);
    border-color: var(--color-xp-gold);
  }
  
  &.rank-2 {
    background: linear-gradient(135deg, #C0C0C0 0%, #E5E5E5 100%);
    color: var(--color-text-inverse);
  }
  
  &.rank-3 {
    background: linear-gradient(135deg, #CD7F32 0%, #E6A85C 100%);
    color: var(--color-text-primary);
  }
}
```

### Progress & Gamification Elements

#### Progress Bar
```css
.progress-bar {
  width: 100%;
  height: 8px;
  background: var(--color-surface-light);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--color-primary), var(--color-electric-cyan));
    border-radius: 4px;
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
      animation: shimmer 2s infinite;
    }
  }
}
```

#### Badge Component
```css
.achievement-badge {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-badge-blue), var(--color-primary));
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
  }
  
  &.unlocked {
    animation: badgeUnlock 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }
}
```

## Responsive Breakpoints

```scss
// Mobile First Approach
--breakpoint-sm: 640px;    // Small devices
--breakpoint-md: 768px;    // Medium devices
--breakpoint-lg: 1024px;   // Large devices
--breakpoint-xl: 1280px;   // Extra large devices
--breakpoint-2xl: 1536px;  // 2X large devices
```

## Animation System

### Easing Functions
```scss
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-sharp: cubic-bezier(0.4, 0, 1, 1);
--ease-soft: cubic-bezier(0, 0, 0.2, 1);
```

### Animation Durations
```scss
--duration-fast: 0.15s;
--duration-normal: 0.3s;
--duration-slow: 0.5s;
--duration-extra-slow: 1s;
```

### Key Animations
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes badgeUnlock {
  0% { transform: scale(0) rotate(-180deg); opacity: 0; }
  50% { transform: scale(1.2) rotate(0deg); }
  100% { transform: scale(1) rotate(0deg); opacity: 1; }
}

@keyframes slideInUp {
  0% { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
}

@keyframes rankChange {
  0% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
  100% { transform: translateX(0); }
}
```

## Iconography

### Icon Style Guide
- **Style**: Outline icons with 2px stroke weight
- **Size Scale**: 16px, 20px, 24px, 32px, 48px
- **Library**: Lucide React (already in project)
- **Color**: Inherit from parent or semantic color
- **Animation**: Subtle hover effects and state changes

### Gaming Icons
- Trophy: `Trophy` component for winners
- Star: `Star` component for ratings/favorites  
- Zap: `Zap` component for streaks/energy
- Target: `Target` component for goals/contests
- Award: `Award` component for achievements
- TrendingUp: `TrendingUp` component for leaderboards

## Implementation Guidelines

### Tailwind CSS Configuration
Extend the existing `tailwind.config.js` with these design tokens:

```javascript
// Add to tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F3F1FF',
          500: '#8B5CF6',
          600: '#7C3AED',
          900: '#4C1D95',
        },
        'electric-cyan': '#06B6D4',
        'xp-gold': '#FCD34D',
        'streak-orange': '#FB923C',
        'polish-red': '#DC143C',
        'trust-blue': '#1E40AF',
      },
      fontFamily: {
        'primary': ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        'display': ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      animation: {
        'badge-unlock': 'badgeUnlock 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'shimmer': 'shimmer 2s infinite',
        'slide-in-up': 'slideInUp 0.3s ease-out',
        'rank-change': 'rankChange 0.5s ease-in-out',
      },
    },
  },
};
```

This design system provides the foundation for creating an exceptional, culturally-appropriate, and gamification-rich interface for SeeUTrending.