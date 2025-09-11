import { create } from 'zustand'

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary'
export type BadgeCategory = 'achievement' | 'streak' | 'social' | 'contest' | 'special'
export type UserLevel = 'rookie' | 'rising_star' | 'trendsetter' | 'viral_sensation' | 'icon'

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  rarity: BadgeRarity
  category: BadgeCategory
  points_required?: number
  condition_type: 'views' | 'contests' | 'streak' | 'followers' | 'engagement' | 'special'
  condition_value: number
  unlocked: boolean
  unlocked_at?: string
  progress: number
  max_progress: number
}

export interface UserStats {
  total_xp: number
  level: UserLevel
  level_progress: number
  next_level_xp: number
  current_level_xp: number
  total_contests: number
  total_wins: number
  total_views: number
  total_likes: number
  total_followers: number
  streak_days: number
  max_streak: number
  badges_count: number
  rank_position?: number
}

export interface XPTransaction {
  id: string
  amount: number
  reason: string
  type: 'earned' | 'bonus' | 'penalty'
  created_at: string
  contest_id?: string
  badge_id?: string
}

export type XPTransactionType = 'earned' | 'bonus' | 'penalty'

interface GamificationState {
  userStats: UserStats | null
  userBadges: Badge[]
  xpTransactions: XPTransaction[]
  isLoading: boolean
  
  // Actions
  addXP: (userId: string, amount: number, reason: string, type?: XPTransactionType) => Promise<any>
  unlockBadge: (userId: string, badgeId: string) => Promise<void>
  updateStreak: (userId: string) => Promise<void>
  fetchUserStats: (userId: string) => Promise<void>
  fetchUserBadges: (userId: string) => Promise<void>
  fetchXPTransactions: (userId: string) => Promise<void>
  resetStore: () => void
}

export const useGamificationStore = create<GamificationState>((set, get) => ({
  userStats: null,
  userBadges: [],
  xpTransactions: [],
  isLoading: false,

  // Simplified actions for deployment
  addXP: async (userId: string, amount: number, reason: string, type: XPTransactionType = 'earned') => {
    console.log('XP system temporarily disabled for deployment')
    return { newXP: 0, newLevel: { level: 'rookie' as UserLevel, progress: 0 } }
  },

  unlockBadge: async (userId: string, badgeId: string) => {
    console.log('Badge system temporarily disabled for deployment')
  },

  updateStreak: async (userId: string) => {
    console.log('Streak system temporarily disabled for deployment')
  },

  fetchUserStats: async (userId: string) => {
    set({ isLoading: true })
    // Mock data for deployment
    set({ 
      userStats: {
        total_xp: 0,
        level: 'rookie',
        level_progress: 0,
        next_level_xp: 500,
        current_level_xp: 0,
        total_contests: 0,
        total_wins: 0,
        total_views: 0,
        total_likes: 0,
        total_followers: 0,
        streak_days: 0,
        max_streak: 0,
        badges_count: 0
      },
      isLoading: false 
    })
  },

  fetchUserBadges: async (userId: string) => {
    set({ userBadges: [] })
  },

  fetchXPTransactions: async (userId: string) => {
    set({ xpTransactions: [] })
  },

  resetStore: () => {
    set({
      userStats: null,
      userBadges: [],
      xpTransactions: [],
      isLoading: false
    })
  }
}))

// Level configurations
export const LEVEL_CONFIGS = {
  rookie: { name: 'Rookie', xp_required: 0, color: '#6B7280', perks: [] },
  rising_star: { name: 'Rising Star', xp_required: 500, color: '#3B82F6', perks: [] },
  trendsetter: { name: 'Trendsetter', xp_required: 2000, color: '#8B5CF6', perks: [] },
  viral_sensation: { name: 'Viral Sensation', xp_required: 5000, color: '#EC4899', perks: [] },
  icon: { name: 'Icon', xp_required: 10000, color: '#F59E0B', perks: [] }
}

export function calculateLevel(xp: number): { level: UserLevel; progress: number } {
  if (xp >= 10000) return { level: 'icon', progress: 100 }
  if (xp >= 5000) return { level: 'viral_sensation', progress: Math.floor(((xp - 5000) / 5000) * 100) }
  if (xp >= 2000) return { level: 'trendsetter', progress: Math.floor(((xp - 2000) / 3000) * 100) }
  if (xp >= 500) return { level: 'rising_star', progress: Math.floor(((xp - 500) / 1500) * 100) }
  return { level: 'rookie', progress: Math.floor((xp / 500) * 100) }
}