import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase/client'

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

export interface LevelConfig {
  level: UserLevel
  name: string
  xp_required: number
  color: string
  icon: string
  perks: string[]
}

interface GamificationState {
  // User stats
  userStats: UserStats | null
  badges: Badge[]
  recentTransactions: XPTransaction[]
  
  // UI state
  isLoading: boolean
  showXPAnimation: boolean
  xpAnimationAmount: number
  showBadgeUnlock: Badge | null
  showLevelUp: boolean
  
  // Actions
  loadUserStats: (userId: string) => Promise<void>
  loadUserBadges: (userId: string) => Promise<void>
  awardXP: (userId: string, amount: number, reason: string, type?: 'earned' | 'bonus' | 'penalty') => Promise<void>
  unlockBadge: (userId: string, badgeId: string) => Promise<void>
  updateStreak: (userId: string) => Promise<void>
  checkLevelUp: (userId: string, oldXP: number, newXP: number) => Promise<boolean>
  
  // UI actions
  triggerXPAnimation: (amount: number) => void
  triggerBadgeUnlock: (badge: Badge) => void
  triggerLevelUp: () => void
  clearAnimations: () => void
}

const LEVEL_CONFIGS: LevelConfig[] = [
  {
    level: 'rookie',
    name: 'Rookie Creator',
    xp_required: 0,
    color: '#6B7280',
    icon: '🌱',
    perks: ['Profile creation', 'Contest participation']
  },
  {
    level: 'rising_star',
    name: 'Rising Star',
    xp_required: 500,
    color: '#3B82F6',
    icon: '⭐',
    perks: ['Custom profile theme', 'Early contest access']
  },
  {
    level: 'trendsetter',
    name: 'Trendsetter',
    xp_required: 2000,
    color: '#8B5CF6',
    icon: '🔥',
    perks: ['Badge showcase', 'Exclusive contests', 'Profile verification']
  },
  {
    level: 'viral_sensation',
    name: 'Viral Sensation',
    xp_required: 5000,
    color: '#F59E0B',
    icon: '🚀',
    perks: ['Priority support', 'Brand collaborations', 'VIP events']
  },
  {
    level: 'icon',
    name: 'Icon',
    xp_required: 10000,
    color: '#FFD700',
    icon: '👑',
    perks: ['All features', 'Icon status', 'Exclusive rewards', 'Platform partnership']
  }
]

const DEFAULT_BADGES: Omit<Badge, 'id' | 'unlocked' | 'unlocked_at' | 'progress'>[] = [
  // Achievement badges
  {
    name: 'First Steps',
    description: 'Submit your first video to a contest',
    icon: '👶',
    rarity: 'common',
    category: 'achievement',
    condition_type: 'contests',
    condition_value: 1,
    max_progress: 1
  },
  {
    name: 'Going Viral',
    description: 'Reach 100k views on a single video',
    icon: '🌟',
    rarity: 'rare',
    category: 'achievement',
    condition_type: 'views',
    condition_value: 100000,
    max_progress: 100000
  },
  {
    name: 'Engagement King',
    description: 'Get 10k likes on a single video',
    icon: '❤️',
    rarity: 'rare',
    category: 'achievement',
    condition_type: 'engagement',
    condition_value: 10000,
    max_progress: 10000
  },
  
  // Contest badges
  {
    name: 'Winner',
    description: 'Win first place in a contest',
    icon: '🏆',
    rarity: 'epic',
    category: 'contest',
    condition_type: 'contests',
    condition_value: 1,
    max_progress: 1
  },
  {
    name: 'Champion',
    description: 'Win 5 contests',
    icon: '🎯',
    rarity: 'legendary',
    category: 'contest',
    condition_type: 'contests',
    condition_value: 5,
    max_progress: 5
  },
  
  // Streak badges
  {
    name: 'Consistent',
    description: 'Maintain a 7-day login streak',
    icon: '📅',
    rarity: 'common',
    category: 'streak',
    condition_type: 'streak',
    condition_value: 7,
    max_progress: 7
  },
  {
    name: 'Dedicated',
    description: 'Maintain a 30-day login streak',
    icon: '🔥',
    rarity: 'rare',
    category: 'streak',
    condition_type: 'streak',
    condition_value: 30,
    max_progress: 30
  },
  {
    name: 'Unstoppable',
    description: 'Maintain a 100-day login streak',
    icon: '💎',
    rarity: 'legendary',
    category: 'streak',
    condition_type: 'streak',
    condition_value: 100,
    max_progress: 100
  },
  
  // Social badges
  {
    name: 'Influencer',
    description: 'Reach 10k followers',
    icon: '📈',
    rarity: 'epic',
    category: 'social',
    condition_type: 'followers',
    condition_value: 10000,
    max_progress: 10000
  },
  {
    name: 'Mega Star',
    description: 'Reach 100k followers',
    icon: '⚡',
    rarity: 'legendary',
    category: 'social',
    condition_type: 'followers',
    condition_value: 100000,
    max_progress: 100000
  }
]

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      // Initial state
      userStats: null,
      badges: [],
      recentTransactions: [],
      isLoading: false,
      showXPAnimation: false,
      xpAnimationAmount: 0,
      showBadgeUnlock: null,
      showLevelUp: false,

      // Load user stats from database
      loadUserStats: async (userId: string) => {
        set({ isLoading: true })
        
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()

          if (profile) {
            const currentLevel = getCurrentLevel(profile.xp_points || 0)
            const nextLevel = getNextLevel(currentLevel)
            
            const userStats: UserStats = {
              total_xp: profile.xp_points || 0,
              level: currentLevel.level,
              level_progress: ((profile.xp_points || 0) - currentLevel.xp_required) / 
                               (nextLevel ? nextLevel.xp_required - currentLevel.xp_required : 1) * 100,
              next_level_xp: nextLevel?.xp_required || currentLevel.xp_required,
              current_level_xp: currentLevel.xp_required,
              total_contests: 0, // Will be calculated
              total_wins: 0,
              total_views: 0,
              total_likes: 0,
              total_followers: profile.total_followers || 0,
              streak_days: profile.streak_days || 0,
              max_streak: profile.streak_days || 0,
              badges_count: 0, // Will be calculated
            }

            // Get contest stats
            const { data: contestStats } = await supabase
              .from('contest_submissions')
              .select('views_count, likes_count, is_winner')
              .eq('user_id', userId)

            if (contestStats) {
              userStats.total_contests = contestStats.length
              userStats.total_wins = contestStats.filter(s => s.is_winner).length
              userStats.total_views = contestStats.reduce((sum, s) => sum + (s.views_count || 0), 0)
              userStats.total_likes = contestStats.reduce((sum, s) => sum + (s.likes_count || 0), 0)
            }

            set({ userStats })
          }
        } catch (error) {
          console.error('Failed to load user stats:', error)
        } finally {
          set({ isLoading: false })
        }
      },

      // Load user badges
      loadUserBadges: async (userId: string) => {
        try {
          // Initialize badges if not exists
          await initializeUserBadges(userId)
          
          // Load badges with progress
          const badges = await calculateBadgeProgress(userId)
          const badgesCount = badges.filter(b => b.unlocked).length
          
          set({ badges })
          
          // Update badges count in userStats
          const { userStats } = get()
          if (userStats) {
            set({ userStats: { ...userStats, badges_count: badgesCount } })
          }
        } catch (error) {
          console.error('Failed to load badges:', error)
        }
      },

      // Award XP to user
      awardXP: async (userId: string, amount: number, reason: string, type = 'earned') => {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('xp_points')
            .eq('id', userId)
            .single()

          if (profile) {
            const oldXP = profile.xp_points || 0
            const newXP = oldXP + amount

            // Update profile
            await supabase
              .from('profiles')
              .update({ 
                xp_points: newXP,
                updated_at: new Date().toISOString()
              })
              .eq('id', userId)

            // Create transaction record
            await supabase
              .from('xp_transactions')
              .insert({
                user_id: userId,
                amount,
                reason,
                type,
                created_at: new Date().toISOString()
              })

            // Check for level up
            const leveledUp = await get().checkLevelUp(userId, oldXP, newXP)

            // Trigger animations
            get().triggerXPAnimation(amount)
            if (leveledUp) {
              get().triggerLevelUp()
            }

            // Reload stats
            await get().loadUserStats(userId)
          }
        } catch (error) {
          console.error('Failed to award XP:', error)
        }
      },

      // Unlock badge for user
      unlockBadge: async (userId: string, badgeId: string) => {
        try {
          await supabase
            .from('user_badges')
            .update({
              unlocked: true,
              unlocked_at: new Date().toISOString()
            })
            .eq('user_id', userId)
            .eq('badge_id', badgeId)

          // Find the badge and trigger animation
          const { badges } = get()
          const badge = badges.find(b => b.id === badgeId)
          if (badge) {
            get().triggerBadgeUnlock({ ...badge, unlocked: true })
          }

          // Reload badges
          await get().loadUserBadges(userId)
        } catch (error) {
          console.error('Failed to unlock badge:', error)
        }
      },

      // Update user streak
      updateStreak: async (userId: string) => {
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('streak_days, last_activity_date')
            .eq('id', userId)
            .single()

          if (profile) {
            const today = new Date().toISOString().split('T')[0]
            const lastActivity = profile.last_activity_date
            const currentStreak = profile.streak_days || 0

            let newStreak = currentStreak

            if (lastActivity !== today) {
              const lastDate = new Date(lastActivity)
              const todayDate = new Date(today)
              const daysDiff = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

              if (daysDiff === 1) {
                // Consecutive day
                newStreak = currentStreak + 1
                await get().awardXP(userId, 5, 'Daily login streak', 'bonus')
              } else if (daysDiff > 1) {
                // Streak broken
                newStreak = 1
              }

              await supabase
                .from('profiles')
                .update({
                  streak_days: newStreak,
                  last_activity_date: today,
                  updated_at: new Date().toISOString()
                })
                .eq('id', userId)

              // Check for streak badges
              await checkStreakBadges(userId, newStreak)
            }
          }
        } catch (error) {
          console.error('Failed to update streak:', error)
        }
      },

      // Check if user leveled up
      checkLevelUp: async (userId: string, oldXP: number, newXP: number) => {
        const oldLevel = getCurrentLevel(oldXP)
        const newLevel = getCurrentLevel(newXP)
        
        if (newLevel.level !== oldLevel.level) {
          // Award level up bonus
          const bonus = newLevel.xp_required * 0.1
          await supabase
            .from('xp_transactions')
            .insert({
              user_id: userId,
              amount: bonus,
              reason: `Level up to ${newLevel.name}`,
              type: 'bonus',
              created_at: new Date().toISOString()
            })

          return true
        }
        
        return false
      },

      // UI Actions
      triggerXPAnimation: (amount: number) => {
        set({ showXPAnimation: true, xpAnimationAmount: amount })
        setTimeout(() => set({ showXPAnimation: false }), 2000)
      },

      triggerBadgeUnlock: (badge: Badge) => {
        set({ showBadgeUnlock: badge })
        setTimeout(() => set({ showBadgeUnlock: null }), 4000)
      },

      triggerLevelUp: () => {
        set({ showLevelUp: true })
        setTimeout(() => set({ showLevelUp: false }), 4000)
      },

      clearAnimations: () => {
        set({
          showXPAnimation: false,
          showBadgeUnlock: null,
          showLevelUp: false,
        })
      },
    }),
    {
      name: 'gamification-store',
      partialize: (state) => ({
        userStats: state.userStats,
        badges: state.badges,
      }),
    }
  )
)

// Helper functions
function getCurrentLevel(xp: number): LevelConfig {
  for (let i = LEVEL_CONFIGS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_CONFIGS[i].xp_required) {
      return LEVEL_CONFIGS[i]
    }
  }
  return LEVEL_CONFIGS[0]
}

function getNextLevel(currentLevel: LevelConfig): LevelConfig | null {
  const currentIndex = LEVEL_CONFIGS.findIndex(l => l.level === currentLevel.level)
  return currentIndex < LEVEL_CONFIGS.length - 1 ? LEVEL_CONFIGS[currentIndex + 1] : null
}

async function initializeUserBadges(userId: string) {
  const { data: existingBadges } = await supabase
    .from('user_badges')
    .select('badge_id')
    .eq('user_id', userId)

  const existingBadgeIds = new Set(existingBadges?.map(b => b.badge_id) || [])

  for (const badge of DEFAULT_BADGES) {
    const badgeId = `${badge.category}_${badge.name.toLowerCase().replace(/\s+/g, '_')}`
    
    if (!existingBadgeIds.has(badgeId)) {
      await supabase
        .from('user_badges')
        .insert({
          user_id: userId,
          badge_id: badgeId,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          rarity: badge.rarity,
          category: badge.category,
          condition_type: badge.condition_type,
          condition_value: badge.condition_value,
          unlocked: false,
          progress: 0,
          max_progress: badge.max_progress
        })
    }
  }
}

async function calculateBadgeProgress(userId: string): Promise<Badge[]> {
  const { data: userBadges } = await supabase
    .from('user_badges')
    .select('*')
    .eq('user_id', userId)

  if (!userBadges) return []

  // Get user stats for progress calculation
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  const { data: contestStats } = await supabase
    .from('contest_submissions')
    .select('*')
    .eq('user_id', userId)

  for (const badge of userBadges) {
    if (badge.unlocked) continue

    let progress = 0

    switch (badge.condition_type) {
      case 'contests':
        progress = contestStats?.length || 0
        break
      case 'views':
        progress = contestStats?.reduce((sum: number, s: any) => sum + (s.views_count || 0), 0) || 0
        break
      case 'engagement':
        progress = contestStats?.reduce((sum: number, s: any) => sum + (s.likes_count || 0), 0) || 0
        break
      case 'followers':
        progress = profile?.total_followers || 0
        break
      case 'streak':
        progress = profile?.streak_days || 0
        break
    }

    // Update progress in database
    await supabase
      .from('user_badges')
      .update({ progress })
      .eq('user_id', userId)
      .eq('id', badge.id)

    badge.progress = progress

    // Check if badge should be unlocked
    if (progress >= badge.condition_value && !badge.unlocked) {
      await supabase
        .from('user_badges')
        .update({
          unlocked: true,
          unlocked_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('id', badge.id)

      badge.unlocked = true
      badge.unlocked_at = new Date().toISOString()
    }
  }

  return userBadges
}

async function checkStreakBadges(userId: string, streakDays: number) {
  const streakMilestones = [7, 30, 100]
  
  for (const milestone of streakMilestones) {
    if (streakDays >= milestone) {
      const { data: badge } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', userId)
        .eq('condition_type', 'streak')
        .eq('condition_value', milestone)
        .single()

      if (badge && !badge.unlocked) {
        await useGamificationStore.getState().unlockBadge(userId, badge.id)
      }
    }
  }
}

export { LEVEL_CONFIGS }