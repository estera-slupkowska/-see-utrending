export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          tiktok_id: string | null
          username: string | null
          display_name: string | null
          avatar_url: string | null
          user_type: 'creator' | 'brand' | 'spectator'
          email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tiktok_id?: string | null
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          user_type?: 'creator' | 'brand' | 'spectator'
          email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tiktok_id?: string | null
          username?: string | null
          display_name?: string | null
          avatar_url?: string | null
          user_type?: 'creator' | 'brand' | 'spectator'
          email?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      creator_profiles: {
        Row: {
          user_id: string
          level: number
          total_points: number
          total_views: number
          total_submissions: number
          badges: Json
          bio: string | null
          country: string
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          level?: number
          total_points?: number
          total_views?: number
          total_submissions?: number
          badges?: Json
          bio?: string | null
          country?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          level?: number
          total_points?: number
          total_views?: number
          total_submissions?: number
          badges?: Json
          bio?: string | null
          country?: string
          created_at?: string
          updated_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          name_pl: string
          name_en: string
          description_pl: string
          description_en: string
          icon: string
          points_value: number
          category: string
          created_at: string
        }
        Insert: {
          id?: string
          name_pl: string
          name_en: string
          description_pl: string
          description_en: string
          icon: string
          points_value: number
          category: string
          created_at?: string
        }
        Update: {
          id?: string
          name_pl?: string
          name_en?: string
          description_pl?: string
          description_en?: string
          icon?: string
          points_value?: number
          category?: string
          created_at?: string
        }
      }
      user_achievements: {
        Row: {
          user_id: string
          achievement_id: string
          earned_at: string
        }
        Insert: {
          user_id: string
          achievement_id: string
          earned_at?: string
        }
        Update: {
          user_id?: string
          achievement_id?: string
          earned_at?: string
        }
      }
      contests: {
        Row: {
          id: string
          brand_id: string
          slug: string
          title: Json
          description: Json
          hashtags: string[]
          start_date: string
          end_date: string
          prize_pool: Json
          requirements: Json
          status: 'draft' | 'active' | 'ended'
          featured: boolean
          region: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brand_id: string
          slug: string
          title: Json
          description: Json
          hashtags?: string[]
          start_date: string
          end_date: string
          prize_pool: Json
          requirements?: Json
          status?: 'draft' | 'active' | 'ended'
          featured?: boolean
          region?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          brand_id?: string
          slug?: string
          title?: Json
          description?: Json
          hashtags?: string[]
          start_date?: string
          end_date?: string
          prize_pool?: Json
          requirements?: Json
          status?: 'draft' | 'active' | 'ended'
          featured?: boolean
          region?: string
          created_at?: string
          updated_at?: string
        }
      }
      submissions: {
        Row: {
          id: string
          contest_id: string
          creator_id: string
          tiktok_video_id: string
          video_url: string
          thumbnail_url: string | null
          caption: string | null
          submitted_at: string
          status: 'pending' | 'approved' | 'rejected'
        }
        Insert: {
          id?: string
          contest_id: string
          creator_id: string
          tiktok_video_id: string
          video_url: string
          thumbnail_url?: string | null
          caption?: string | null
          submitted_at?: string
          status?: 'pending' | 'approved' | 'rejected'
        }
        Update: {
          id?: string
          contest_id?: string
          creator_id?: string
          tiktok_video_id?: string
          video_url?: string
          thumbnail_url?: string | null
          caption?: string | null
          submitted_at?: string
          status?: 'pending' | 'approved' | 'rejected'
        }
      }
      video_stats: {
        Row: {
          submission_id: string
          views: number
          likes: number
          comments: number
          shares: number
          engagement_rate: number
          last_synced: string
        }
        Insert: {
          submission_id: string
          views?: number
          likes?: number
          comments?: number
          shares?: number
          engagement_rate?: number
          last_synced?: string
        }
        Update: {
          submission_id?: string
          views?: number
          likes?: number
          comments?: number
          shares?: number
          engagement_rate?: number
          last_synced?: string
        }
      }
      leaderboard_entries: {
        Row: {
          id: string
          contest_id: string
          creator_id: string
          submission_id: string
          rank: number
          score: number
          trend: 'up' | 'down' | 'stable'
          previous_rank: number | null
          updated_at: string
        }
        Insert: {
          id?: string
          contest_id: string
          creator_id: string
          submission_id: string
          rank: number
          score: number
          trend?: 'up' | 'down' | 'stable'
          previous_rank?: number | null
          updated_at?: string
        }
        Update: {
          id?: string
          contest_id?: string
          creator_id?: string
          submission_id?: string
          rank?: number
          score?: number
          trend?: 'up' | 'down' | 'stable'
          previous_rank?: number | null
          updated_at?: string
        }
      }
      tiktok_tokens: {
        Row: {
          user_id: string
          access_token: string
          refresh_token: string
          expires_at: string
          scope: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          access_token: string
          refresh_token: string
          expires_at: string
          scope: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          access_token?: string
          refresh_token?: string
          expires_at?: string
          scope?: string[]
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_type: 'creator' | 'brand' | 'spectator'
      contest_status: 'draft' | 'active' | 'ended'
      submission_status: 'pending' | 'approved' | 'rejected'
      trend_direction: 'up' | 'down' | 'stable'
    }
  }
}