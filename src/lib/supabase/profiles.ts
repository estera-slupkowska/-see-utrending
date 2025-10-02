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

  /**
   * Delete user account and all associated data
   */
  static async deleteAccount(userId: string): Promise<{ success: boolean, error?: any }> {
    try {
      // First, delete the user's profile data
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)

      if (profileError) {
        console.error('Error deleting profile:', profileError)
        return { success: false, error: 'Nie udało się usunąć danych profilu' }
      }

      // Delete user's avatar from storage if it exists
      const { data: avatarFiles } = await supabase.storage
        .from('avatars')
        .list(userId)

      if (avatarFiles && avatarFiles.length > 0) {
        const filePaths = avatarFiles.map(file => `${userId}/${file.name}`)
        await supabase.storage
          .from('avatars')
          .remove(filePaths)
      }

      // Finally, delete the user from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(userId)

      if (authError) {
        console.error('Error deleting auth user:', authError)
        return { success: false, error: 'Nie udało się usunąć konta użytkownika' }
      }

      return { success: true }
    } catch (error) {
      console.error('Error deleting account:', error)
      return { success: false, error: 'Wystąpił błąd podczas usuwania konta' }
    }
  }

  /**
   * Export user data for GDPR compliance
   */
  static async exportUserData(userId: string): Promise<{ data: any | null, error?: any }> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        return { data: null, error: 'Nie udało się pobrać danych użytkownika' }
      }

      // Format the data for export
      const exportData = {
        personal_info: {
          name: profile.name,
          email: profile.email,
          bio: profile.bio,
          location: profile.location,
          interests: profile.interests,
          created_at: profile.created_at
        },
        statistics: {
          xp_points: profile.xp_points,
          level: profile.level,
          streak_days: profile.streak_days,
          total_followers: profile.total_followers
        },
        social_connections: {
          tiktok_handle: profile.tiktok_handle,
          tiktok_user_id: profile.tiktok_user_id,
          verified: profile.verified
        },
        export_timestamp: new Date().toISOString()
      }

      return { data: exportData }
    } catch (error) {
      console.error('Error exporting user data:', error)
      return { data: null, error: 'Wystąpił błąd podczas eksportowania danych' }
    }
  }
}