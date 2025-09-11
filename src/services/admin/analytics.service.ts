import { supabase } from '../../lib/supabase/client'

export interface DashboardStats {
  users: {
    total: number
    newToday: number
    newThisWeek: number
    growth: string
  }
  contests: {
    total: number
    active: number
    draft: number
    completed: number
    growth: string
  }
  submissions: {
    total: number
    pending: number
    approved: number
    growth: string
  }
  engagement: {
    totalViews: number
    totalLikes: number
    totalComments: number
    avgEngagementRate: number
    growth: string
  }
}

export interface ActivityItem {
  id: string
  type: 'user_registered' | 'contest_created' | 'contest_published' | 'submission_received' | 'contest_completed'
  title: string
  description: string
  timestamp: string
  metadata?: any
}

export interface AnalyticsData {
  period: string
  userRegistrations: Array<{ date: string; count: number }>
  contestCreations: Array<{ date: string; count: number }>
  submissions: Array<{ date: string; count: number }>
  engagement: Array<{ date: string; views: number; likes: number; comments: number }>
}

export class AnalyticsService {
  // Get main dashboard statistics
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Get user stats
      const { data: allUsers } = await supabase
        .from('profiles')
        .select('created_at')

      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
      const prevWeekStart = new Date(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000)

      const totalUsers = allUsers?.length || 0
      const newToday = allUsers?.filter(u => new Date(u.created_at) >= today).length || 0
      const newThisWeek = allUsers?.filter(u => new Date(u.created_at) >= weekAgo).length || 0
      const newPrevWeek = allUsers?.filter(u => 
        new Date(u.created_at) >= prevWeekStart && new Date(u.created_at) < weekAgo
      ).length || 0

      const userGrowth = newPrevWeek > 0 
        ? `${Math.round(((newThisWeek - newPrevWeek) / newPrevWeek) * 100)}%`
        : newThisWeek > 0 ? '+100%' : '0%'

      // Get contest stats
      const { data: allContests } = await supabase
        .from('contests')
        .select('status, created_at')

      const totalContests = allContests?.length || 0
      const activeContests = allContests?.filter(c => c.status === 'active').length || 0
      const draftContests = allContests?.filter(c => c.status === 'draft').length || 0
      const completedContests = allContests?.filter(c => c.status === 'completed').length || 0
      
      const contestsThisWeek = allContests?.filter(c => new Date(c.created_at) >= weekAgo).length || 0
      const contestsPrevWeek = allContests?.filter(c => 
        new Date(c.created_at) >= prevWeekStart && new Date(c.created_at) < weekAgo
      ).length || 0

      const contestGrowth = contestsPrevWeek > 0
        ? `${Math.round(((contestsThisWeek - contestsPrevWeek) / contestsPrevWeek) * 100)}%`
        : contestsThisWeek > 0 ? '+100%' : '0%'

      // Get submission stats (if table exists)
      let totalSubmissions = 0
      let pendingSubmissions = 0
      let approvedSubmissions = 0
      let submissionGrowth = '0%'

      try {
        const { data: allSubmissions } = await supabase
          .from('contest_submissions')
          .select('status, submitted_at')

        totalSubmissions = allSubmissions?.length || 0
        pendingSubmissions = allSubmissions?.filter(s => s.status === 'pending').length || 0
        approvedSubmissions = allSubmissions?.filter(s => s.status === 'approved').length || 0

        const submissionsThisWeek = allSubmissions?.filter(s => 
          new Date(s.submitted_at) >= weekAgo
        ).length || 0
        const submissionsPrevWeek = allSubmissions?.filter(s => 
          new Date(s.submitted_at) >= prevWeekStart && new Date(s.submitted_at) < weekAgo
        ).length || 0

        submissionGrowth = submissionsPrevWeek > 0
          ? `${Math.round(((submissionsThisWeek - submissionsPrevWeek) / submissionsPrevWeek) * 100)}%`
          : submissionsThisWeek > 0 ? '+100%' : '0%'
      } catch (e) {
        // Submissions table might not exist yet
        console.log('Submissions table not available:', e)
      }

      // Get engagement stats
      let totalViews = 0
      let totalLikes = 0
      let totalComments = 0
      let avgEngagementRate = 0
      let engagementGrowth = '0%'

      try {
        const { data: submissionStats } = await supabase
          .from('contest_submissions')
          .select('views_count, likes_count, comments_count')

        if (submissionStats && submissionStats.length > 0) {
          totalViews = submissionStats.reduce((sum, s) => sum + (s.views_count || 0), 0)
          totalLikes = submissionStats.reduce((sum, s) => sum + (s.likes_count || 0), 0)
          totalComments = submissionStats.reduce((sum, s) => sum + (s.comments_count || 0), 0)
          
          if (totalViews > 0) {
            avgEngagementRate = Math.round(((totalLikes + totalComments) / totalViews) * 100)
          }
        }
      } catch (e) {
        console.log('Engagement stats not available:', e)
      }

      return {
        users: {
          total: totalUsers,
          newToday,
          newThisWeek,
          growth: userGrowth
        },
        contests: {
          total: totalContests,
          active: activeContests,
          draft: draftContests,
          completed: completedContests,
          growth: contestGrowth
        },
        submissions: {
          total: totalSubmissions,
          pending: pendingSubmissions,
          approved: approvedSubmissions,
          growth: submissionGrowth
        },
        engagement: {
          totalViews,
          totalLikes,
          totalComments,
          avgEngagementRate,
          growth: engagementGrowth
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw new Error('Failed to fetch dashboard statistics')
    }
  }

  // Get recent activity for dashboard
  static async getRecentActivity(limit = 10): Promise<ActivityItem[]> {
    const activities: ActivityItem[] = []

    try {
      // Recent user registrations
      const { data: recentUsers } = await supabase
        .from('profiles')
        .select('id, name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      if (recentUsers) {
        recentUsers.forEach(user => {
          activities.push({
            id: `user-${user.id}`,
            type: 'user_registered',
            title: 'New user registered',
            description: `${user.name || user.email.split('@')[0]} joined the platform`,
            timestamp: user.created_at,
            metadata: { userId: user.id, email: user.email }
          })
        })
      }

      // Recent contest activity
      const { data: recentContests } = await supabase
        .from('contests')
        .select('id, title, status, created_at, updated_at')
        .order('updated_at', { ascending: false })
        .limit(5)

      if (recentContests) {
        recentContests.forEach(contest => {
          const isNew = new Date(contest.created_at) === new Date(contest.updated_at)
          activities.push({
            id: `contest-${contest.id}`,
            type: isNew ? 'contest_created' : 'contest_published',
            title: isNew ? 'Contest created' : `Contest ${contest.status}`,
            description: `"${contest.title}" ${isNew ? 'was created' : `status changed to ${contest.status}`}`,
            timestamp: contest.updated_at,
            metadata: { contestId: contest.id, status: contest.status }
          })
        })
      }

      // Sort all activities by timestamp
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      return activities.slice(0, limit)
    } catch (error) {
      console.error('Error fetching recent activity:', error)
      return []
    }
  }

  // Get analytics data for charts
  static async getAnalyticsData(period: '7d' | '30d' | '90d' = '30d'): Promise<AnalyticsData> {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    try {
      // User registrations over time
      const { data: users } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', startDate.toISOString())

      const userRegistrations = this.groupByDate(users || [], 'created_at', days)

      // Contest creations over time
      const { data: contests } = await supabase
        .from('contests')
        .select('created_at')
        .gte('created_at', startDate.toISOString())

      const contestCreations = this.groupByDate(contests || [], 'created_at', days)

      // Submissions over time (if available)
      let submissions: Array<{ date: string; count: number }> = []
      try {
        const { data: submissionData } = await supabase
          .from('contest_submissions')
          .select('submitted_at')
          .gte('submitted_at', startDate.toISOString())

        submissions = this.groupByDate(submissionData || [], 'submitted_at', days)
      } catch (e) {
        console.log('Submissions data not available')
      }

      // Engagement over time (placeholder)
      const engagement = Array.from({ length: days }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - (days - i - 1))
        return {
          date: date.toISOString().split('T')[0],
          views: Math.floor(Math.random() * 1000), // Replace with real data
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 50)
        }
      })

      return {
        period,
        userRegistrations,
        contestCreations,
        submissions,
        engagement
      }
    } catch (error) {
      console.error('Error fetching analytics data:', error)
      throw new Error('Failed to fetch analytics data')
    }
  }

  // Helper method to group data by date
  private static groupByDate(data: any[], dateField: string, days: number): Array<{ date: string; count: number }> {
    // Create array of all dates in range
    const dateArray = Array.from({ length: days }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (days - i - 1))
      return date.toISOString().split('T')[0]
    })

    // Count items by date
    const dateCounts = data.reduce((acc, item) => {
      const date = new Date(item[dateField]).toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Return array with counts for each date
    return dateArray.map(date => ({
      date,
      count: dateCounts[date] || 0
    }))
  }

  // Get platform health metrics
  static async getPlatformHealth() {
    try {
      const stats = await this.getDashboardStats()
      
      // Calculate health score based on various metrics
      let healthScore = 100
      let issues = []

      // Check if there are active contests
      if (stats.contests.active === 0) {
        healthScore -= 20
        issues.push('No active contests')
      }

      // Check user growth
      const growthRate = parseInt(stats.users.growth.replace(/[+%]/g, ''))
      if (growthRate < 0) {
        healthScore -= 15
        issues.push('Declining user growth')
      }

      // Check engagement
      if (stats.engagement.avgEngagementRate < 5) {
        healthScore -= 10
        issues.push('Low engagement rate')
      }

      return {
        healthScore: Math.max(0, healthScore),
        status: healthScore >= 80 ? 'excellent' : healthScore >= 60 ? 'good' : healthScore >= 40 ? 'fair' : 'poor',
        issues,
        recommendations: this.getHealthRecommendations(issues)
      }
    } catch (error) {
      return {
        healthScore: 50,
        status: 'unknown',
        issues: ['Unable to fetch metrics'],
        recommendations: ['Check database connection']
      }
    }
  }

  private static getHealthRecommendations(issues: string[]): string[] {
    const recommendations = []

    if (issues.includes('No active contests')) {
      recommendations.push('Create and activate a contest to engage users')
    }
    if (issues.includes('Declining user growth')) {
      recommendations.push('Review marketing strategy and user acquisition channels')
    }
    if (issues.includes('Low engagement rate')) {
      recommendations.push('Improve contest prizes and promote user participation')
    }

    return recommendations
  }
}