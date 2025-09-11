// Core application types
export interface User {
  id: string
  tiktokId?: string
  username?: string
  displayName?: string
  avatarUrl?: string
  userType: 'creator' | 'brand' | 'spectator'
  email?: string
  createdAt: string
  updatedAt: string
}

export interface CreatorProfile {
  userId: string
  level: number
  totalPoints: number
  totalViews: number
  totalSubmissions: number
  badges: Badge[]
  bio?: string
  country: string
  createdAt: string
  updatedAt: string
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: string
  earnedAt?: string
}

export interface Achievement {
  id: string
  namePl: string
  nameEn: string
  descriptionPl: string
  descriptionEn: string
  icon: string
  pointsValue: number
  category: string
}

export interface Contest {
  id: string
  brandId: string
  slug: string
  title: {
    pl: string
    en: string
  }
  description: {
    pl: string
    en: string
  }
  hashtags: string[]
  startDate: string
  endDate: string
  prizePool: {
    currency: string
    amounts: Array<{
      place: number
      amount: number
      description: string
    }>
  }
  requirements: {
    minFollowers?: number
    ageRestriction?: number
    regionRestriction?: string[]
    hashtags: string[]
  }
  status: 'draft' | 'active' | 'ended'
  featured: boolean
  region: string
  createdAt: string
  updatedAt: string
}

export interface Submission {
  id: string
  contestId: string
  creatorId: string
  tiktokVideoId: string
  videoUrl: string
  thumbnailUrl?: string
  caption?: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
}

export interface VideoStats {
  submissionId: string
  views: number
  likes: number
  comments: number
  shares: number
  engagementRate: number
  lastSynced: string
}

export interface LeaderboardEntry {
  id: string
  contestId: string
  creatorId: string
  submissionId: string
  rank: number
  score: number
  trend: 'up' | 'down' | 'stable'
  previousRank?: number
  updatedAt: string
  // Populated fields
  creator?: User
  submission?: Submission
  stats?: VideoStats
}

export interface TikTokTokens {
  userId: string
  accessToken: string
  refreshToken: string
  expiresAt: string
  scope: string[]
}

// TikTok API response types
export interface TikTokUser {
  open_id: string
  union_id: string
  avatar_url: string
  display_name: string
  bio_description: string
  profile_deep_link: string
  is_verified: boolean
  follower_count: number
  following_count: number
  likes_count: number
  video_count: number
}

export interface TikTokVideo {
  id: string
  create_time: number
  cover_image_url: string
  share_url: string
  video_description: string
  duration: number
  height: number
  width: number
  title: string
  embed_html: string
  embed_link: string
  like_count: number
  comment_count: number
  share_count: number
  view_count: number
}

// Authentication types
export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface TikTokAuthResponse {
  access_token: string
  expires_in: number
  open_id: string
  refresh_expires_in: number
  refresh_token: string
  scope: string
  token_type: string
}

// UI/Component types
export interface LoadingState {
  isLoading: boolean
  error?: string | null
}

export interface PaginationState {
  page: number
  limit: number
  total: number
  hasMore: boolean
}

// Language/i18n types
export type Language = 'pl' | 'en'
export type LocalizedText = Record<Language, string>