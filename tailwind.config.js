/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        primary: {
          DEFAULT: '#8B5CF6',
          light: '#A78BFA',
          dark: '#7C3AED',
          50: '#F3F1FF',
          500: '#8B5CF6',
          600: '#7C3AED',
          900: '#4C1D95',
        },
        
        // Secondary Accent Colors
        'electric-cyan': '#06B6D4',
        'success-green': '#10B981',
        'warning-amber': '#F59E0B',
        'error-red': '#EF4444',
        
        // Polish Cultural Adaptation
        'polish-red': '#DC143C',
        'trust-blue': '#1E40AF',
        
        // Neutral Palette - Dark Theme Foundation
        background: '#0A0A0A',      // Deep black
        surface: '#1A1A1A',         // Dark gray surface
        'surface-light': '#2A2A2A', // Lighter surface
        border: '#374151',          // Border gray
        
        // Text Colors
        'text-primary': '#F9FAFB',   // High contrast white
        'text-secondary': '#D1D5DB', // Medium contrast
        'text-muted': '#9CA3AF',     // Low contrast
        'text-inverse': '#111827',   // Dark on light
        
        // Semantic Colors
        'xp-gold': '#FCD34D',        // Experience points
        'streak-orange': '#FB923C',  // Streak indicators
        'level-purple': '#8B5CF6',   // Level progression
        'badge-blue': '#3B82F6',     // Achievement badges
        
        // Contest Status Colors
        'live-green': '#10B981',     // Live contests
        'ending-amber': '#F59E0B',   // Ending soon
        'draft-gray': '#6B7280',     // Draft status
        'winner-gold': '#FCD34D',    // Winner highlights
      },
      fontFamily: {
        'primary': ['Inter', 'Segoe UI', 'system-ui', '-apple-system', 'sans-serif'],
        'display': ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        // Existing animations
        'bounce-subtle': 'bounce 2s infinite',
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'shine': 'shine 2s linear infinite',
        'badge-unlock': 'badgeUnlock 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'shimmer': 'shimmer 2s infinite',
        'slide-in-up': 'slideInUp 0.3s ease-out',
        'rank-change': 'rankChange 0.5s ease-in-out',
        
        // Enhanced performance-optimized animations (softened)
        'twinkle': 'twinkle 4s ease-in-out infinite',
        'twinkle-slow': 'twinkle-slow 6s ease-in-out infinite',
        'float-slow': 'float-slow 12s ease-in-out infinite',
        'engagement-pulse': 'engagement-pulse 4s ease-in-out infinite',
        'anticipation-glow': 'anticipation-glow 5s ease-in-out infinite alternate',
        'excitement-bounce': 'excitement-bounce 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'neural-pulse': 'neural-pulse 3s ease-in-out infinite',
        'reward-celebrate': 'reward-celebrate 1.2s ease-out',
        'fomo-urgency': 'fomo-urgency 2s ease-in-out infinite alternate',
        'achievement-unlock': 'achievement-unlock 1.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'social-proof-pulse': 'social-proof-pulse 4s ease-in-out infinite',
        'gamification-level-up': 'gamification-level-up 1.5s ease-out',
        'viral-shimmer': 'viral-shimmer 3s infinite',
        
        // GPU-accelerated versions for performance
        'gpu-float': 'gpu-float 6s ease-in-out infinite',
        'gpu-pulse': 'gpu-pulse 2s ease-in-out infinite',
        'gpu-bounce': 'gpu-bounce 1s ease-in-out infinite',
        'gpu-rotate': 'gpu-rotate 20s linear infinite',

        // Cosmic background animations
        'orbit-slow': 'orbit-slow 30s linear infinite',
        'orbit-reverse': 'orbit-reverse 25s linear infinite reverse',
        'shooting-star': 'shooting-star 2s linear infinite',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        'pulse-ultra-slow': 'pulse-ultra-slow 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)',
          },
          '50%': {
            transform: 'translateY(-20px)',
          },
        },
        glow: {
          'from': {
            'box-shadow': '0 0 20px #8B5CF6, 0 0 30px #8B5CF6, 0 0 40px #8B5CF6',
          },
          'to': {
            'box-shadow': '0 0 30px #8B5CF6, 0 0 40px #8B5CF6, 0 0 50px #8B5CF6',
          },
        },
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '25%': {
            'background-size': '400% 400%',
            'background-position': 'left top'
          },
          '50%': {
            'background-size': '400% 400%',
            'background-position': 'right top'
          },
          '75%': {
            'background-size': '400% 400%',
            'background-position': 'right center'
          }
        },
        shine: {
          'from': {
            'background-position': '0 0'
          },
          'to': {
            'background-position': '-200% 0'
          }
        },
        // New Design System Animations
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        badgeUnlock: {
          '0%': { transform: 'scale(0) rotate(-180deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(0deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' }
        },
        slideInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        rankChange: {
          '0%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-10px)' },
          '75%': { transform: 'translateX(10px)' },
          '100%': { transform: 'translateX(0)' }
        },
        // Enhanced keyframes for new animations (softened)
        twinkle: {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.95)' },
          '50%': { opacity: '0.5', transform: 'scale(1.05)' }
        },
        'twinkle-slow': {
          '0%, 100%': { opacity: '0.15', transform: 'scale(0.98)' },
          '50%': { opacity: '0.4', transform: 'scale(1.02)' }
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-15px) scale(1.02)' }
        },
        'engagement-pulse': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.01)' }
        },
        'anticipation-glow': {
          '0%': { 'box-shadow': '0 0 5px rgba(139, 92, 246, 0.3)' },
          '100%': { 'box-shadow': '0 0 25px rgba(139, 92, 246, 0.7), 0 0 50px rgba(139, 92, 246, 0.4)' }
        },
        'excitement-bounce': {
          '0%': { transform: 'scale(1) rotate(0deg)' },
          '25%': { transform: 'scale(1.1) rotate(-5deg)' },
          '50%': { transform: 'scale(1.2) rotate(5deg)' },
          '75%': { transform: 'scale(1.1) rotate(-2deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)' }
        },
        'neural-pulse': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(0.95)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' }
        },
        'reward-celebrate': {
          '0%': { transform: 'scale(0.8) rotate(-10deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(5deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' }
        },
        'fomo-urgency': {
          '0%': { 
            'border-color': 'rgba(239, 68, 68, 0.5)', 
            'box-shadow': '0 0 0 0 rgba(239, 68, 68, 0.4)' 
          },
          '100%': { 
            'border-color': 'rgba(239, 68, 68, 0.8)', 
            'box-shadow': '0 0 0 4px rgba(239, 68, 68, 0.1)' 
          }
        },
        'achievement-unlock': {
          '0%': { transform: 'scale(0.1) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1.3) rotate(180deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(360deg)', opacity: '1' }
        },
        'social-proof-pulse': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
          '50%': { transform: 'scale(1.05)', opacity: '1' }
        },
        'gamification-level-up': {
          '0%': { transform: 'translateY(20px) scale(0.8)', opacity: '0' },
          '50%': { transform: 'translateY(-10px) scale(1.1)', opacity: '1' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' }
        },
        'viral-shimmer': {
          '0%': { left: '-100%' },
          '100%': { left: '100%' }
        },
        // GPU-accelerated keyframes
        'gpu-float': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -20px, 0)' }
        },
        'gpu-pulse': {
          '0%, 100%': { transform: 'scale3d(1, 1, 1)', opacity: '1' },
          '50%': { transform: 'scale3d(1.05, 1.05, 1)', opacity: '0.8' }
        },
        'gpu-bounce': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -25px, 0)' }
        },
        'gpu-rotate': {
          '0%': { transform: 'rotate3d(0, 0, 1, 0deg)' },
          '100%': { transform: 'rotate3d(0, 0, 1, 360deg)' }
        },
        // Cosmic background keyframes
        'orbit-slow': {
          '0%': { transform: 'rotate(0deg) translateX(20px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(20px) rotate(-360deg)' }
        },
        'orbit-reverse': {
          '0%': { transform: 'rotate(0deg) translateX(15px) rotate(0deg)' },
          '100%': { transform: 'rotate(-360deg) translateX(15px) rotate(360deg)' }
        },
        'shooting-star': {
          '0%': { opacity: '0', transform: 'translateY(-100px) translateX(-100px)' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateY(100px) translateX(100px)' }
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.95)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' }
        },
        'pulse-ultra-slow': {
          '0%, 100%': { opacity: '0.2', transform: 'scale(0.98)' },
          '50%': { opacity: '0.5', transform: 'scale(1.02)' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mesh': 'radial-gradient(at 40% 20%, rgba(139, 92, 246, 0.1) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(168, 85, 247, 0.05) 0px, transparent 50%)',
        'shine-gradient': 'linear-gradient(110deg, transparent 25%, rgba(255, 255, 255, 0.5) 50%, transparent 75%)',
        
        // Badge-Inspired Page Backgrounds
        'bg-rising-star': 'radial-gradient(ellipse at 20% 10%, rgba(99, 102, 241, 0.08) 0%, transparent 40%), radial-gradient(ellipse at 80% 90%, rgba(168, 85, 247, 0.05) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.03) 0%, transparent 60%), #0A0A0A',
        
        'bg-komentarz-master': 'radial-gradient(ellipse at 80% 10%, rgba(6, 182, 212, 0.08) 0%, transparent 35%), radial-gradient(ellipse at 20% 90%, rgba(59, 130, 246, 0.05) 0%, transparent 45%), radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.03) 0%, transparent 55%), #0A0A0A',
        
        'bg-golden-viral': 'radial-gradient(ellipse at 50% 10%, rgba(252, 211, 77, 0.1) 0%, transparent 30%), radial-gradient(ellipse at 10% 90%, rgba(245, 158, 11, 0.06) 0%, transparent 40%), radial-gradient(ellipse at 90% 50%, rgba(251, 146, 60, 0.04) 0%, transparent 50%), #0A0A0A',
        
        // Enhanced Gaming Patterns
        'bg-bronze-foundation': 'radial-gradient(ellipse at 30% 20%, rgba(194, 124, 68, 0.06) 0%, transparent 40%), radial-gradient(ellipse at 70% 80%, rgba(180, 83, 9, 0.04) 0%, transparent 50%), #0A0A0A',
        
        'bg-copper-transition': 'radial-gradient(ellipse at 60% 30%, rgba(196, 125, 84, 0.07) 0%, transparent 35%), radial-gradient(ellipse at 20% 70%, rgba(154, 52, 18, 0.05) 0%, transparent 45%), #0A0A0A'
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow-sm': '0 0 10px rgb(139 92 246 / 0.5)',
        'glow': '0 0 20px rgb(139 92 246 / 0.5)',
        'glow-lg': '0 0 30px rgb(139 92 246 / 0.5)',
        'glow-purple': '0 0 20px rgb(139 92 246 / 0.6)',
        'glow-green': '0 0 20px rgb(6 255 165 / 0.5)',
        'glow-pink': '0 0 20px rgb(255 61 113 / 0.5)',
        'glass': '0 8px 32px 0 rgba(21, 22, 33, 0.4)',
        'glass-lg': '0 25px 50px -12px rgba(21, 22, 33, 0.6)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}