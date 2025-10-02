import { supabase } from './client'
import type { UserProfile } from '../../types/profiles'

export interface UserBadge {
  id: string
  name: string
  earnedAt: string
  xp: number
}

export class BadgeService {
  /**
   * Award the "Złote Tysiąc" badge to a user
   */
  static async awardGoldenThousandBadge(userId: string): Promise<{ data: UserProfile | null, error: any }> {
    try {
      const badge: UserBadge = {
        id: 'early-adopter',
        name: 'Złote Tysiąc',
        earnedAt: new Date().toISOString(),
        xp: 100
      }

      // Get current profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('badges, xp_points')
        .eq('id', userId)
        .single()

      const currentBadges = profile?.badges || []
      const hasGoldenThousand = currentBadges.some((b: UserBadge) => b.id === 'early-adopter')

      if (hasGoldenThousand) {
        // User already has the badge
        return { data: profile, error: null }
      }

      // Add badge and update XP
      const updatedBadges = [...currentBadges, badge]
      const newXP = (profile?.xp_points || 0) + 100

      const { data, error } = await supabase
        .from('profiles')
        .update({
          badges: updatedBadges,
          xp_points: newXP,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Error awarding Golden Thousand badge:', error)
      return { data: null, error }
    }
  }

  /**
   * Award Golden Thousand badge to all existing users
   */
  static async awardGoldenThousandToAllUsers(): Promise<{ success: boolean, count: number, error?: any }> {
    try {
      // Get all users
      const { data: profiles, error: fetchError } = await supabase
        .from('profiles')
        .select('id, badges, xp_points')

      if (fetchError) {
        return { success: false, count: 0, error: fetchError }
      }

      let updatedCount = 0

      for (const profile of profiles || []) {
        const currentBadges = profile.badges || []
        const hasGoldenThousand = currentBadges.some((b: UserBadge) => b.id === 'early-adopter')

        if (!hasGoldenThousand) {
          const badge: UserBadge = {
            id: 'early-adopter',
            name: 'Złote Tysiąc',
            earnedAt: new Date().toISOString(),
            xp: 100
          }

          const updatedBadges = [...currentBadges, badge]

          await supabase
            .from('profiles')
            .update({
              badges: updatedBadges,
              xp_points: 100, // Set XP to exactly 100 from the badge
              monthly_xp: 0, // Reset monthly XP
              updated_at: new Date().toISOString()
            })
            .eq('id', profile.id)

          updatedCount++
        }
      }

      return { success: true, count: updatedCount }
    } catch (error) {
      console.error('Error awarding badges to all users:', error)
      return { success: false, count: 0, error }
    }
  }

  /**
   * Get user badges
   */
  static async getUserBadges(userId: string): Promise<{ data: UserBadge[] | null, error: any }> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('badges')
        .eq('id', userId)
        .single()

      if (error) {
        return { data: null, error }
      }

      return { data: profile?.badges || [], error: null }
    } catch (error) {
      console.error('Error fetching user badges:', error)
      return { data: null, error }
    }
  }
}