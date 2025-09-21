import { supabase } from './client'
import type { UserProfile, UpdateProfileData } from '../../types/profiles'

export class ProfileService {
  /**
   * Get user profile by ID
   */
  static async getProfile(userId: string): Promise<{ data: UserProfile | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      return { data, error }
    } catch (error) {
      console.error('Error fetching profile:', error)
      return { data: null, error }
    }
  }

  /**
   * Get all profiles for Users page
   */
  static async getAllProfiles(): Promise<{ data: UserProfile[] | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('xp_points', { ascending: false })

      return { data, error }
    } catch (error) {
      console.error('Error fetching all profiles:', error)
      return { data: null, error }
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, updates: UpdateProfileData): Promise<{ data: UserProfile | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { data: null, error }
    }
  }

  /**
   * Update TikTok connection status
   */
  static async updateTikTokConnection(userId: string, tiktokData: {
    tiktok_username?: string
    tiktok_user_id?: string
    tiktok_handle?: string
    tiktok_metrics?: any
  }): Promise<{ data: UserProfile | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...tiktokData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Error updating TikTok connection:', error)
      return { data: null, error }
    }
  }

  /**
   * Get profiles sorted by monthly XP
   */
  static async getProfilesByMonthlyXP(): Promise<{ data: UserProfile[] | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('monthly_xp', { ascending: false })

      return { data, error }
    } catch (error) {
      console.error('Error fetching profiles by monthly XP:', error)
      return { data: null, error }
    }
  }

  /**
   * Search profiles by name or location
   */
  static async searchProfiles(query: string): Promise<{ data: UserProfile[] | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`name.ilike.%${query}%,location.ilike.%${query}%`)
        .order('xp_points', { ascending: false })

      return { data, error }
    } catch (error) {
      console.error('Error searching profiles:', error)
      return { data: null, error }
    }
  }
}