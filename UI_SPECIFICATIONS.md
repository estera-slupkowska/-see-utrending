# SeeUTrending UI Specifications & Mockup Guidelines

## Overview
Detailed UI specifications for SeeUTrending's key pages and components, based on competitive research and the developed design system.

## Page-Specific UI Specifications

### 1. Landing Page / Hero Section

#### Layout Structure
```
┌─────────────────────────────────────────┐
│ Navigation Bar                          │
├─────────────────────────────────────────┤
│ Hero Section                            │
│   ┌─────────────┐  ┌─────────────────┐ │
│   │ Visual      │  │ Headline        │ │
│   │ Competition │  │ Subheading      │ │
│   │ Showcase    │  │ CTA Buttons     │ │
│   └─────────────┘  └─────────────────┘ │
├─────────────────────────────────────────┤
│ Live Contests Preview Grid              │
├─────────────────────────────────────────┤
│ Leaderboard Teaser                      │
├─────────────────────────────────────────┤
│ Three-Audience Benefits                 │
└─────────────────────────────────────────┘
```

#### Hero Section Specifications
- **Background**: Dark gradient with animated particle effects
- **Headline**: "Show, że każdy może w nim uczestniczyć" (Polish primary)
- **Subheadline**: "A show that YOU can be part of" (English secondary)
- **Primary CTA**: Gaming-style button "Rozpocznij Konkurowanie" (Start Competing)
- **Secondary CTA**: Outline button "Zobacz Konkursy" (View Contests)
- **Visual Element**: Animated TikTok-style phone mockup showing live leaderboard

#### Navigation Bar
```css
.main-navigation {
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(139, 92, 246, 0.2);
  position: fixed;
  top: 0;
  z-index: 1000;
  
  .nav-logo {
    font-weight: 700;
    font-size: 1.5rem;
    background: linear-gradient(135deg, #8B5CF6, #06B6D4);
    -webkit-background-clip: text;
    color: transparent;
  }
  
  .nav-items {
    display: flex;
    gap: 2rem;
    
    .nav-link {
      color: var(--color-text-secondary);
      transition: color 0.2s ease;
      
      &:hover, &.active {
        color: var(--color-primary);
      }
    }
  }
  
  .language-switcher {
    display: flex;
    background: var(--color-surface);
    border-radius: 0.5rem;
    padding: 0.25rem;
    
    button {
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      transition: all 0.2s ease;
      
      &.active {
        background: var(--color-primary);
        color: white;
      }
    }
  }
}
```

### 2. Contest Browse Page

#### Layout Structure
```
┌─────────────────────────────────────────┐
│ Filters & Search Bar                    │
├─────────────────────────────────────────┤
│ Contest Grid (Responsive)               │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│ │Contest 1│ │Contest 2│ │Contest 3│    │
│ │Card     │ │Card     │ │Card     │    │
│ └─────────┘ └─────────┘ └─────────┘    │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│ │Contest 4│ │Contest 5│ │Contest 6│    │
│ └─────────┘ └─────────┘ └─────────┘    │
├─────────────────────────────────────────┤
│ Pagination                              │
└─────────────────────────────────────────┘
```

#### Contest Card Specifications
```css
.contest-card {
  width: 100%;
  max-width: 400px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-4px);
    border-color: var(--color-primary);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
  
  .contest-header {
    position: relative;
    height: 200px;
    background: linear-gradient(135deg, var(--color-primary), var(--color-electric-cyan));
    display: flex;
    align-items: center;
    justify-content: center;
    
    .brand-logo {
      width: 80px;
      height: 80px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .contest-status {
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.5rem 1rem;
      border-radius: 2rem;
      font-size: 0.875rem;
      font-weight: 600;
      
      &.live {
        background: var(--color-live-green);
        color: white;
        animation: pulse 2s infinite;
      }
      
      &.ending-soon {
        background: var(--color-warning-amber);
        color: white;
      }
    }
  }
  
  .contest-body {
    padding: 1.5rem;
    
    .contest-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--color-text-primary);
    }
    
    .contest-description {
      color: var(--color-text-secondary);
      font-size: 0.875rem;
      line-height: 1.5;
      margin-bottom: 1rem;
    }
    
    .contest-stats {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      
      .stat-item {
        text-align: center;
        
        .stat-number {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--color-primary);
        }
        
        .stat-label {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }
      }
    }
    
    .prize-info {
      background: var(--color-surface-light);
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1rem;
      
      .prize-amount {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-xp-gold);
      }
    }
  }
  
  .contest-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--color-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .time-remaining {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
    }
    
    .join-button {
      padding: 0.5rem 1.5rem;
      background: var(--color-primary);
      color: white;
      border-radius: 0.5rem;
      font-weight: 600;
      transition: all 0.2s ease;
      
      &:hover {
        background: var(--color-primary-dark);
        transform: translateY(-1px);
      }
    }
  }
}
```

### 3. Live Leaderboard Page

#### Layout Structure
```
┌─────────────────────────────────────────┐
│ Contest Header & Live Indicator         │
├─────────────────────────────────────────┤
│ Top 3 Podium (Special Design)           │
│   🥇        🥈        🥉               │
│  Rank 1    Rank 2    Rank 3            │
├─────────────────────────────────────────┤
│ Leaderboard List (4th place onwards)    │
│ ┌─────────────────────────────────────┐ │
│ │ 4. Creator Name    | Score | Change │ │
│ │ 5. Creator Name    | Score | Change │ │
│ │ 6. Creator Name    | Score | Change │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Real-time Activity Feed                 │
└─────────────────────────────────────────┘
```

#### Podium Design
```css
.leaderboard-podium {
  display: flex;
  justify-content: center;
  align-items: end;
  gap: 2rem;
  padding: 3rem 0;
  background: radial-gradient(circle at center, rgba(139, 92, 246, 0.1), transparent);
  
  .podium-position {
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;
    
    &:hover {
      transform: scale(1.05);
    }
    
    .rank-indicator {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 auto 1rem;
      
      &.first {
        background: linear-gradient(135deg, var(--color-xp-gold), #FCD34D);
        color: var(--color-text-inverse);
        transform: scale(1.2);
        box-shadow: 0 8px 25px rgba(252, 211, 77, 0.4);
      }
      
      &.second {
        background: linear-gradient(135deg, #C0C0C0, #E5E5E5);
        color: var(--color-text-inverse);
      }
      
      &.third {
        background: linear-gradient(135deg, #CD7F32, #E6A85C);
        color: white;
      }
    }
    
    .creator-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin: 0 auto 1rem;
      border: 4px solid transparent;
      
      &.first {
        border-color: var(--color-xp-gold);
        transform: scale(1.1);
      }
      
      &.second {
        border-color: #C0C0C0;
      }
      
      &.third {
        border-color: #CD7F32;
      }
    }
    
    .creator-name {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--color-text-primary);
    }
    
    .score-display {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--color-primary);
    }
  }
}
```

#### Leaderboard List Item
```css
.leaderboard-item {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  margin-bottom: 0.75rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: var(--color-primary);
    transform: translateX(4px);
  }
  
  &.rank-change-up {
    animation: slideInUp 0.5s ease-out;
  }
  
  &.rank-change-down {
    animation: slideInDown 0.5s ease-out;
  }
  
  .rank-number {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-primary);
    min-width: 3rem;
    text-align: center;
  }
  
  .creator-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
    
    .avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 2px solid var(--color-border);
    }
    
    .details {
      .name {
        font-weight: 600;
        color: var(--color-text-primary);
        margin-bottom: 0.25rem;
      }
      
      .handle {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
      }
    }
  }
  
  .score-info {
    text-align: right;
    
    .score {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-primary);
    }
    
    .change {
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.25rem;
      
      &.positive {
        color: var(--color-success-green);
      }
      
      &.negative {
        color: var(--color-error-red);
      }
    }
  }
}
```

### 4. Creator Profile/Dashboard

#### Layout Structure
```
┌─────────────────────────────────────────┐
│ Profile Header & Stats                  │
│ ┌─────────┐ ┌─────────────────────────┐ │
│ │ Avatar  │ │ Name, Level, XP         │ │
│ │ & Level │ │ Achievement Badges      │ │
│ └─────────┘ └─────────────────────────┘ │
├─────────────────────────────────────────┤
│ Quick Stats Dashboard                   │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│ │Active   │ │Total    │ │Streak   │    │
│ │Contests │ │Points   │ │Days     │    │
│ └─────────┘ └─────────┘ └─────────┘    │
├─────────────────────────────────────────┤
│ Recent Activity Feed                    │
├─────────────────────────────────────────┤
│ Achievement Gallery                     │
└─────────────────────────────────────────┘
```

#### Profile Header
```css
.profile-header {
  background: linear-gradient(135deg, var(--color-primary), var(--color-electric-cyan));
  padding: 3rem 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg>...</svg>') repeat;
    opacity: 0.1;
  }
  
  .profile-content {
    display: flex;
    align-items: center;
    gap: 2rem;
    position: relative;
    z-index: 1;
    
    .avatar-section {
      .main-avatar {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        border: 6px solid white;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
      }
      
      .level-badge {
        position: absolute;
        bottom: -10px;
        right: -10px;
        background: var(--color-xp-gold);
        color: var(--color-text-inverse);
        border-radius: 50%;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 700;
        border: 4px solid white;
      }
    }
    
    .info-section {
      .creator-name {
        font-size: 2.5rem;
        font-weight: 700;
        color: white;
        margin-bottom: 0.5rem;
      }
      
      .creator-handle {
        font-size: 1.25rem;
        color: rgba(255, 255, 255, 0.8);
        margin-bottom: 1rem;
      }
      
      .level-info {
        background: rgba(255, 255, 255, 0.2);
        padding: 1rem;
        border-radius: 0.75rem;
        backdrop-filter: blur(10px);
        
        .level-title {
          color: white;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        
        .xp-progress {
          .progress-bar {
            background: rgba(255, 255, 255, 0.2);
            
            .progress-fill {
              background: white;
            }
          }
          
          .xp-text {
            color: rgba(255, 255, 255, 0.9);
            font-size: 0.875rem;
            margin-top: 0.5rem;
          }
        }
      }
    }
  }
}
```

### 5. Brand Dashboard

#### Layout Structure
```
┌─────────────────────────────────────────┐
│ Brand Overview Header                   │
├─────────────────────────────────────────┤
│ Quick Actions                           │
│ ┌─────────────┐ ┌─────────────────────┐ │
│ │ Create New  │ │ Manage Active       │ │
│ │ Contest     │ │ Contests           │ │
│ └─────────────┘ └─────────────────────┘ │
├─────────────────────────────────────────┤
│ Active Contests Management Grid         │
├─────────────────────────────────────────┤
│ Analytics Dashboard                     │
└─────────────────────────────────────────┘
```

#### Brand Contest Management Card
```css
.brand-contest-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  .contest-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 1rem;
    
    .contest-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-text-primary);
    }
    
    .status-dropdown {
      background: var(--color-surface-light);
      border: 1px solid var(--color-border);
      border-radius: 0.5rem;
      padding: 0.5rem 1rem;
      color: var(--color-text-secondary);
    }
  }
  
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
    
    .metric-item {
      text-align: center;
      padding: 1rem;
      background: var(--color-surface-light);
      border-radius: 0.5rem;
      
      .metric-number {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-primary);
      }
      
      .metric-label {
        font-size: 0.875rem;
        color: var(--color-text-muted);
      }
    }
  }
  
  .action-buttons {
    display: flex;
    gap: 1rem;
    
    .btn-view {
      flex: 1;
      background: transparent;
      color: var(--color-primary);
      border: 1px solid var(--color-primary);
    }
    
    .btn-edit {
      flex: 1;
      background: var(--color-primary);
      color: white;
    }
  }
}
```

## Mobile-Specific Considerations

### Navigation Pattern
- **Bottom Tab Bar**: Primary navigation for mobile
- **Hamburger Menu**: Secondary navigation and settings
- **Swipe Gestures**: Between leaderboard positions, contest cards

### Touch Targets
- Minimum 44px touch targets
- Adequate spacing between interactive elements
- Thumb-friendly positioning of primary actions

### Performance Optimizations
- Lazy loading for contest images
- Infinite scroll for leaderboards
- Progressive enhancement for animations

## Polish Language Integration

### Typography Considerations
```css
.polish-text {
  /* Enhanced line-height for Polish diacritics */
  line-height: 1.6;
  
  /* Proper font stack with Polish support */
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
  
  /* Better spacing for special characters */
  letter-spacing: 0.01em;
}

/* Polish-specific text sizes */
.text-polish-base {
  font-size: 1.0625rem; /* Slightly larger for readability */
}
```

### Language-Specific UI Elements
- **Date Formats**: DD.MM.YYYY (Polish standard)
- **Number Formats**: Space as thousands separator (1 000 instead of 1,000)
- **Currency**: PLN with proper placement
- **Time**: 24-hour format preferred

## Implementation Priority

### Phase 1: Core Pages
1. Landing page with hero section
2. Contest browse grid
3. Basic leaderboard display

### Phase 2: User Interfaces  
1. Creator profile/dashboard
2. Brand dashboard basics
3. Contest detail pages

### Phase 3: Advanced Features
1. Real-time leaderboard updates
2. Advanced animations
3. Mobile optimizations

This specification provides the detailed foundation for implementing SeeUTrending's exceptional user interface.