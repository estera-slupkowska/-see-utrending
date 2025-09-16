import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Users, 
  Trophy, 
  BarChart3, 
  Settings, 
  Bell, 
  Eye,
  TrendingUp,
  Calendar,
  Award,
  MessageSquare,
  Building2
} from 'lucide-react'
import { AnalyticsService, DashboardStats, ActivityItem } from '../../services/admin/analytics.service'
import { useContestUpdates, useUserUpdates, useSubmissionUpdates } from '../../hooks/useRealtimeUpdates'

export function AdminDashboard() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Real-time updates
  const contestUpdates = useContestUpdates(() => loadDashboardData())
  const userUpdates = useUserUpdates(() => loadDashboardData())
  const submissionUpdates = useSubmissionUpdates(() => loadDashboardData())

  const loadDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [stats, activity] = await Promise.all([
          AnalyticsService.getDashboardStats(),
          AnalyticsService.getRecentActivity(10)
        ])
        
        setDashboardStats(stats)
        setRecentActivity(activity)
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const stats = dashboardStats ? [
    {
      title: 'Total Users',
      value: dashboardStats.users.total.toLocaleString(),
      change: dashboardStats.users.growth,
      icon: Users,
      color: 'text-blue-400'
    },
    {
      title: 'Active Contests',
      value: dashboardStats.contests.active.toString(),
      change: dashboardStats.contests.growth,
      icon: Trophy,
      color: 'text-purple-400'
    },
    {
      title: 'Video Submissions',
      value: dashboardStats.submissions.total.toLocaleString(),
      change: dashboardStats.submissions.growth,
      icon: Eye,
      color: 'text-green-400'
    },
    {
      title: 'Total Engagement',
      value: dashboardStats.engagement.totalViews.toLocaleString(),
      change: dashboardStats.engagement.growth,
      icon: TrendingUp,
      color: 'text-yellow-400'
    }
  ] : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-display font-bold text-white">
              Admin Dashboard
            </h1>
            <p className="text-text-muted mt-1">
              Welcome to SeeUTrending administration panel
            </p>
          </div>
          
          {/* Real-time Status */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-2 bg-surface/50 border border-border rounded-lg">
              <div className={`w-2 h-2 rounded-full ${
                contestUpdates.isConnected && userUpdates.isConnected && submissionUpdates.isConnected
                  ? 'bg-green-400 animate-pulse'
                  : 'bg-red-400'
              }`}></div>
              <span className="text-sm text-text-muted">
                {contestUpdates.isConnected && userUpdates.isConnected && submissionUpdates.isConnected
                  ? 'Live Updates Active'
                  : 'Live Updates Disconnected'
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 bg-background/50 rounded-lg"></div>
                <div className="w-12 h-4 bg-background/50 rounded"></div>
              </div>
              <div>
                <div className="w-16 h-8 bg-background/50 rounded mb-1"></div>
                <div className="w-20 h-4 bg-background/50 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
          <p className="text-red-400">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const IconComponent = stat.icon
            const isPositive = stat.change.startsWith('+')
            const isNegative = stat.change.startsWith('-')
            
            return (
              <div
                key={stat.title}
                className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:bg-surface/70 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-background/50 ${stat.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className={`text-sm font-medium ${
                    isPositive ? 'text-green-400' : 
                    isNegative ? 'text-red-400' : 
                    'text-text-muted'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-text-muted text-sm">{stat.title}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-lg transition-colors">
            <Trophy className="w-5 h-5 text-purple-400" />
            <span className="text-white font-medium">Create Contest</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-blue-400" />
            <span className="text-white font-medium">Send Notification</span>
          </button>
          <button className="flex items-center space-x-3 p-4 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-lg transition-colors">
            <Users className="w-5 h-5 text-green-400" />
            <span className="text-white font-medium">Manage Users</span>
          </button>
          <button 
            onClick={() => navigate('/admin/team')}
            className="flex items-center space-x-3 p-4 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg group"
          >
            <Building2 className="w-5 h-5 text-yellow-400 group-hover:animate-pulse" />
            <span className="text-white font-medium">Team Structure</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center space-x-3 p-3 bg-background/20 rounded-lg animate-pulse">
                  <div className="w-8 h-8 bg-background/50 rounded-full"></div>
                  <div className="flex-1">
                    <div className="w-32 h-4 bg-background/50 rounded mb-2"></div>
                    <div className="w-24 h-3 bg-background/50 rounded"></div>
                  </div>
                  <div className="w-16 h-3 bg-background/50 rounded"></div>
                </div>
              ))}
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-50" />
              <p className="text-text-muted">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity) => {
                const getActivityIcon = (type: ActivityItem['type']) => {
                  switch (type) {
                    case 'user_registered': return Users
                    case 'contest_created': return Trophy
                    case 'contest_published': return Eye
                    case 'submission_received': return Award
                    case 'contest_completed': return Calendar
                    default: return MessageSquare
                  }
                }
                
                const IconComponent = getActivityIcon(activity.type)
                
                return (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 bg-background/20 rounded-lg hover:bg-background/30 transition-colors">
                    <div className="p-1.5 rounded-full bg-purple-500/20">
                      <IconComponent className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{activity.title}</p>
                      <p className="text-text-muted text-xs">{activity.description}</p>
                    </div>
                    <span className="text-text-muted text-xs">
                      {new Date(activity.timestamp).toLocaleDateString('pl-PL', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Pending Actions</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-background/20 rounded-lg animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-background/50 rounded"></div>
                    <div className="w-32 h-4 bg-background/50 rounded"></div>
                  </div>
                  <div className="w-16 h-3 bg-background/50 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span className="text-white text-sm">Review contest submissions</span>
                </div>
                <span className="text-yellow-400 text-xs">
                  {dashboardStats?.submissions.pending || 0} pending
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Trophy className="w-4 h-4 text-blue-400" />
                  <span className="text-white text-sm">Draft contests</span>
                </div>
                <span className="text-blue-400 text-xs">
                  {dashboardStats?.contests.draft || 0} drafts
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm">New users today</span>
                </div>
                <span className="text-green-400 text-xs">
                  {dashboardStats?.users.newToday || 0} new
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}