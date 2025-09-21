export interface UserProfile {
  id: string
  email: string
  name?: string
  role: 'creator' | 'spectator' | 'brand'
  avatar_url?: string
  bio?: string
  interests?: string[]
  location?: string
  tiktok_handle?: string
  tiktok_user_id?: string
  tiktok_username?: string
  tiktok_metrics?: {
    followers?: number
    following?: number
    likes?: number
    videos?: number
    verified?: boolean
    last_updated?: string
  }
  total_followers: number
  verified: boolean
  xp_points: number
  level: number
  monthly_xp: number
  streak_days: number
  last_activity_date: string
  created_at: string
  updated_at: string
}

export interface TikTokAccount {
  username: string
  display_name: string
  avatar_url: string
  follower_count: number
  is_verified: boolean
  is_active: boolean
  last_sync: string
}

export interface UpdateProfileData {
  name?: string
  bio?: string
  interests?: string[]
  location?: string
  avatar_url?: string
  tiktok_handle?: string
}