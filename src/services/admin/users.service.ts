import { supabase } from '../../lib/supabase/client'

export interface UserProfile {
  id: string
  email: string
  name?: string
  role: 'creator' | 'admin'
  avatar_url?: string
  bio?: string
  tiktok_handle?: string
  tiktok_user_id?: string
  total_followers: number
  verified: boolean
  xp_points: number
  level: number
  streak_days: number
  last_activity_date?: string
  created_at: string
  updated_at: string
}

export interface UserStats {
  totalUsers: number
  newUsersToday: number
  newUsersThisWeek: number
  newUsersThisMonth: number
  activeUsers: number
  byRole: {
    creators: number
    admins: number
  }
  averageXP: number
  topUsers: Array<{
    id: string
    name: string
    email: string
    xp_points: number
    level: number
  }>
}

export interface ContestParticipation {
  contest_id: string
  contest_title: string
  contest_status: 'draft' | 'active' | 'completed' | 'cancelled'
  submission_id: string
  submitted_at: string
  video_url?: string
  engagement_score?: number
  views_count?: number
  likes_count?: number
  comments_count?: number
  shares_count?: number
}

export class UsersService {
  // Get all users with optional filtering
  static async getUsers(options?: {
    role?: string
    search?: string
    limit?: number
    offset?: number
    orderBy?: 'created_at' | 'xp_points' | 'name'
    ascending?: boolean
  }) {
    let query = supabase
      .from('profiles')
      .select('*')

    if (options?.role && options.role !== 'all') {
      query = query.eq('role', options.role)
    }

    if (options?.search) {
      query = query.or(
        `name.ilike.%${options.search}%,email.ilike.%${options.search}%,tiktok_handle.ilike.%${options.search}%`
      )
    }

    const orderBy = options?.orderBy || 'created_at'
    const ascending = options?.ascending !== undefined ? options.ascending : false
    query = query.order(orderBy, { ascending })

    if (options?.limit) {
      const start = options.offset || 0
      const end = start + options.limit - 1
      query = query.range(start, end)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`)
    }

    return data as UserProfile[]
  }

  // Get user by ID
  static async getUserById(id: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Failed to fetch user: ${error.message}`)
    }

    return data as UserProfile
  }

  // Update user role
  static async updateUserRole(userId: string, role: UserProfile['role']) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update user role: ${error.message}`)
    }

    return data as UserProfile
  }

  // Update user XP points
  static async updateUserXP(userId: string, xpPoints: number) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ xp_points: xpPoints })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update user XP: ${error.message}`)
    }

    return data as UserProfile
  }

  // Verify/unverify user
  static async updateUserVerification(userId: string, verified: boolean) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ verified })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update user verification: ${error.message}`)
    }

    return data as UserProfile
  }

  // Get comprehensive user statistics
  static async getUserStats(): Promise<UserStats> {
    // Get all users
    const { data: allUsers, error } = await supabase
      .from('profiles')
      .select('*')

    if (error) {
      throw new Error(`Failed to fetch user stats: ${error.message}`)
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Calculate stats
    const totalUsers = allUsers.length

    const newUsersToday = allUsers.filter(user => 
      new Date(user.created_at) >= today
    ).length

    const newUsersThisWeek = allUsers.filter(user => 
      new Date(user.created_at) >= weekAgo
    ).length

    const newUsersThisMonth = allUsers.filter(user => 
      new Date(user.created_at) >= monthAgo
    ).length

    // Active users (users with activity in last 7 days)
    const activeUsers = allUsers.filter(user => 
      user.last_activity_date && 
      new Date(user.last_activity_date) >= weekAgo
    ).length

    // Users by role
    const byRole = {
      creators: allUsers.filter(u => u.role === 'creator').length,
      admins: allUsers.filter(u => u.role === 'admin').length
    }

    // Average XP
    const totalXP = allUsers.reduce((sum, user) => sum + user.xp_points, 0)
    const averageXP = totalUsers > 0 ? Math.round(totalXP / totalUsers) : 0

    // Top users by XP
    const topUsers = allUsers
      .sort((a, b) => b.xp_points - a.xp_points)
      .slice(0, 10)
      .map(user => ({
        id: user.id,
        name: user.name || user.email.split('@')[0],
        email: user.email,
        xp_points: user.xp_points,
        level: user.level
      }))

    return {
      totalUsers,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth,
      activeUsers,
      byRole,
      averageXP,
      topUsers
    }
  }

  // Get recent user activity
  static async getRecentUsers(limit = 10) {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, email, role, xp_points, level, created_at')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`Failed to fetch recent users: ${error.message}`)
    }

    return data
  }

  // Search users
  static async searchUsers(searchTerm: string, limit = 20) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .or(
        `name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,tiktok_handle.ilike.%${searchTerm}%`
      )
      .limit(limit)

    if (error) {
      throw new Error(`Failed to search users: ${error.message}`)
    }

    return data as UserProfile[]
  }

  // Get user activity summary
  static async getUserActivitySummary(userId: string) {
    // This would integrate with contest submissions, badges, etc.
    // For now, return basic profile info
    const profile = await this.getUserById(userId)
    
    // TODO: Add queries for:
    // - Contest submissions
    // - Badges earned
    // - Recent activity
    // - Engagement stats

    return {
      profile,
      submissions: [], // TODO: Implement
      badges: [],      // TODO: Implement
      activity: []     // TODO: Implement
    }
  }

  // Export users to CSV
  static async exportUsers(filters?: { role?: string; dateRange?: string }) {
    let query = supabase
      .from('profiles')
      .select('email, name, role, xp_points, level, verified, created_at')

    if (filters?.role && filters.role !== 'all') {
      query = query.eq('role', filters.role)
    }

    if (filters?.dateRange) {
      const days = parseInt(filters.dateRange)
      const dateFrom = new Date()
      dateFrom.setDate(dateFrom.getDate() - days)
      query = query.gte('created_at', dateFrom.toISOString())
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to export users: ${error.message}`)
    }

    return data
  }

  // Get user's contest participations
  static async getUserContestParticipations(userId: string): Promise<ContestParticipation[]> {
    const { data, error } = await supabase
      .from('contest_submissions')
      .select(`
        id,
        submitted_at,
        video_url,
        engagement_score,
        views_count,
        likes_count,
        comments_count,
        shares_count,
        contests:contest_id (
          id,
          title,
          status
        )
      `)
      .eq('creator_id', userId)
      .order('submitted_at', { ascending: false })

    if (error) {
      console.error('Error fetching user contest participations:', error)
      // Return empty array if table doesn't exist yet
      return []
    }

    if (!data || data.length === 0) {
      return []
    }

    // Transform the data to match ContestParticipation interface
    return data.map(submission => ({
      contest_id: submission.contests?.id || '',
      contest_title: submission.contests?.title || 'Unknown Contest',
      contest_status: submission.contests?.status || 'draft',
      submission_id: submission.id,
      submitted_at: submission.submitted_at,
      video_url: submission.video_url,
      engagement_score: submission.engagement_score,
      views_count: submission.views_count,
      likes_count: submission.likes_count,
      comments_count: submission.comments_count,
      shares_count: submission.shares_count
    }))
  }
}