/**
 * Badge Service
 * Manages badge definitions, awards, and user badge tracking
 */

import { supabase } from '../../lib/supabase/client'

// ============================================
// Types & Interfaces
// ============================================

export type BadgeCategory = 'legendary' | 'epic' | 'rare'

export type BadgeConditionType =
  | 'contest_views'           // Total views in a contest
  | 'contest_rank_views'      // Rank by views in contest
  | 'contest_rank_likes'      // Rank by likes in contest
  | 'contest_rank_both'       // Rank by views OR likes in contest
  | 'platform_views'          // Total views across platform
  | 'video_likes'             // Likes on a single video
  | 'early_adopter'           // First N users

export interface BadgeDefinition {
  id: string
  name_pl: string
  name_en: string
  description_pl: string
  description_en: string
  category: BadgeCategory
  xp_reward: number
  icon: string
  color_gradient: string
  condition_type: BadgeConditionType
  condition_value: number
  created_at?: string
  updated_at?: string
}

export interface UserBadge {
  id: string
  earned_at: string
}

export interface BadgeStats {
  total_badges: number
  legendary_count: number
  epic_count: number
  rare_count: number
  total_xp_from_badges: number
  most_common_badge: string | null
  rarest_badge: string | null
}

// ============================================
// Badge Service Class
// ============================================

export class BadgesService {
  /**
   * Get all badge definitions
   */
  static async getBadgeDefinitions(): Promise<BadgeDefinition[]> {
    const { data, error } = await supabase
      .from('badge_definitions')
      .select('*')
      .order('xp_reward', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch badge definitions: ${error.message}`)
    }

    return data
  }

  /**
   * Get badge definitions by category
   */
  static async getBadgesByCategory(category: BadgeCategory): Promise<BadgeDefinition[]> {
    const { data, error } = await supabase
      .from('badge_definitions')
      .select('*')
      .eq('category', category)
      .order('xp_reward', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch ${category} badges: ${error.message}`)
    }

    return data
  }

  /**
   * Get a single badge definition by ID
   */
  static async getBadgeById(badgeId: string): Promise<BadgeDefinition | null> {
    const { data, error } = await supabase
      .from('badge_definitions')
      .select('*')
      .eq('id', badgeId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Badge not found
      }
      throw new Error(`Failed to fetch badge: ${error.message}`)
    }

    return data
  }

  /**
   * Get user's earned badges
   */
  static async getUserBadges(userId: string): Promise<UserBadge[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('badges')
      .eq('id', userId)
      .single()

    if (error) {
      throw new Error(`Failed to fetch user badges: ${error.message}`)
    }

    return (data.badges as UserBadge[]) || []
  }

  /**
   * Get user's badges with full definition details
   */
  static async getUserBadgesWithDetails(userId: string): Promise<{
    badge: BadgeDefinition
    earned_at: string
  }[]> {
    // Get user badges
    const userBadges = await this.getUserBadges(userId)

    if (userBadges.length === 0) {
      return []
    }

    // Get badge definitions
    const badgeIds = userBadges.map(b => b.id)
    const { data: definitions, error } = await supabase
      .from('badge_definitions')
      .select('*')
      .in('id', badgeIds)

    if (error) {
      throw new Error(`Failed to fetch badge details: ${error.message}`)
    }

    // Combine badge data with earned dates
    return userBadges.map(userBadge => {
      const badge = definitions.find(d => d.id === userBadge.id)
      return {
        badge: badge!,
        earned_at: userBadge.earned_at
      }
    }).filter(item => item.badge) // Filter out any badges without definitions
  }

  /**
   * Get user's badges by category
   */
  static async getUserBadgesByCategory(userId: string, category: BadgeCategory): Promise<{
    badge: BadgeDefinition
    earned_at: string
  }[]> {
    const allBadges = await this.getUserBadgesWithDetails(userId)
    return allBadges.filter(item => item.badge.category === category)
  }

  /**
   * Check if user has a specific badge
   */
  static async userHasBadge(userId: string, badgeId: string): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('user_has_badge', {
        user_id: userId,
        badge_id: badgeId
      })

    if (error) {
      throw new Error(`Failed to check badge: ${error.message}`)
    }

    return data
  }

  /**
   * Award a badge to a user
   * Returns true if badge was awarded, false if user already had it
   */
  static async awardBadge(userId: string, badgeId: string): Promise<boolean> {
    const { data, error } = await supabase
      .rpc('award_badge', {
        user_id: userId,
        badge_id: badgeId
      })

    if (error) {
      throw new Error(`Failed to award badge: ${error.message}`)
    }

    return data
  }

  /**
   * Award multiple badges to a user
   * Returns array of successfully awarded badge IDs
   */
  static async awardBadges(userId: string, badgeIds: string[]): Promise<string[]> {
    const awarded: string[] = []

    for (const badgeId of badgeIds) {
      try {
        const success = await this.awardBadge(userId, badgeId)
        if (success) {
          awarded.push(badgeId)
        }
      } catch (error) {
        console.error(`Failed to award badge ${badgeId}:`, error)
        // Continue with other badges
      }
    }

    return awarded
  }

  /**
   * Get badge statistics for a user
   */
  static async getUserBadgeStats(userId: string): Promise<BadgeStats> {
    const badges = await this.getUserBadgesWithDetails(userId)

    const stats: BadgeStats = {
      total_badges: badges.length,
      legendary_count: 0,
      epic_count: 0,
      rare_count: 0,
      total_xp_from_badges: 0,
      most_common_badge: null,
      rarest_badge: null
    }

    // Count by category and calculate XP
    badges.forEach(({ badge }) => {
      switch (badge.category) {
        case 'legendary':
          stats.legendary_count++
          break
        case 'epic':
          stats.epic_count++
          break
        case 'rare':
          stats.rare_count++
          break
      }
      stats.total_xp_from_badges += badge.xp_reward
    })

    // Find most common and rarest badges (by category)
    if (stats.legendary_count > 0) {
      stats.rarest_badge = 'legendary'
    }
    if (stats.rare_count > stats.epic_count && stats.rare_count > stats.legendary_count) {
      stats.most_common_badge = 'rare'
    } else if (stats.epic_count > 0) {
      stats.most_common_badge = 'epic'
    }

    return stats
  }

  /**
   * Get platform-wide badge statistics
   */
  static async getPlatformBadgeStats(): Promise<{
    badge_id: string
    badge_name_pl: string
    badge_category: BadgeCategory
    times_awarded: number
  }[]> {
    // This is a simplified version - in production you'd want a more efficient query
    const { data: allProfiles, error } = await supabase
      .from('profiles')
      .select('badges')
      .not('badges', 'is', null)

    if (error) {
      throw new Error(`Failed to fetch badge stats: ${error.message}`)
    }

    // Count badge occurrences
    const badgeCounts: Record<string, number> = {}

    allProfiles.forEach(profile => {
      const badges = profile.badges as UserBadge[]
      badges.forEach(badge => {
        badgeCounts[badge.id] = (badgeCounts[badge.id] || 0) + 1
      })
    })

    // Get badge definitions
    const badgeIds = Object.keys(badgeCounts)
    if (badgeIds.length === 0) {
      return []
    }

    const { data: definitions, error: defError } = await supabase
      .from('badge_definitions')
      .select('id, name_pl, category')
      .in('id', badgeIds)

    if (defError) {
      throw new Error(`Failed to fetch badge definitions: ${defError.message}`)
    }

    return definitions.map(def => ({
      badge_id: def.id,
      badge_name_pl: def.name_pl,
      badge_category: def.category,
      times_awarded: badgeCounts[def.id]
    })).sort((a, b) => b.times_awarded - a.times_awarded)
  }

  /**
   * Get users who have a specific badge
   */
  static async getUsersWithBadge(badgeId: string, limit: number = 100): Promise<{
    id: string
    name: string
    email: string
    earned_at: string
  }[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, badges')
      .not('badges', 'is', null)
      .limit(limit)

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`)
    }

    // Filter users who have the badge
    const usersWithBadge = data
      .filter(profile => {
        const badges = profile.badges as UserBadge[]
        return badges.some(b => b.id === badgeId)
      })
      .map(profile => {
        const badges = profile.badges as UserBadge[]
        const badge = badges.find(b => b.id === badgeId)!
        return {
          id: profile.id,
          name: profile.name || 'Unknown',
          email: profile.email,
          earned_at: badge.earned_at
        }
      })

    return usersWithBadge
  }

  /**
   * Check badge eligibility for a user in a contest
   * This is a simplified version - you'd implement more complex logic based on contest data
   */
  static async checkContestBadgeEligibility(
    userId: string,
    contestId: string
  ): Promise<string[]> {
    const eligibleBadges: string[] = []

    // TODO: Implement logic to check:
    // - Contest total views for diamond-creator-contest
    // - Contest ranking for golden-viral, favorite-viral, silver-viral, bronze-viral
    // This would require contest submission data and rankings

    console.log('Contest badge eligibility check not yet implemented')
    console.log({ userId, contestId })

    return eligibleBadges
  }

  /**
   * Check platform badge eligibility for a user
   * This is a simplified version - you'd implement based on real platform stats
   */
  static async checkPlatformBadgeEligibility(userId: string): Promise<string[]> {
    const eligibleBadges: string[] = []

    // TODO: Implement logic to check:
    // - Total platform views for diamond-creator-platform
    // - Video likes for red-arrow, red-ring
    // - Early adopter status for golden-thousand
    // This would require aggregating all user submissions and stats

    console.log('Platform badge eligibility check not yet implemented')
    console.log({ userId })

    return eligibleBadges
  }
}
