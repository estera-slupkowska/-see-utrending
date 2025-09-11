import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { 
  Users, 
  Trophy, 
  BarChart3, 
  Bell, 
  Eye,
  TrendingUp,
  Calendar,
  Award,
  MessageSquare
} from 'lucide-react'
import { supabase } from '../../lib/supabase/client'

export function AdminDashboard() {
  const { t } = useTranslation()
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeContests: 0,
    totalSubmissions: 0,
    totalViews: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState('connecting')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get user count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
      
      // Get contests count
      const { count: contestCount } = await supabase
        .from('contests')
        .select('*', { count: 'exact', head: true })
      
      // Get submissions count
      const { count: submissionCount } = await supabase
        .from('contest_submissions')
        .select('*', { count: 'exact', head: true })
      
      // Get content blocks count
      const { count: contentCount } = await supabase
        .from('content_blocks')
        .select('*', { count: 'exact', head: true })
      
      setStats({
        totalUsers: userCount || 0,
        activeContests: contestCount || 0,
        totalSubmissions: submissionCount || 0,
        totalViews: contentCount || 0
      })
      
      setConnectionStatus('connected')
    } catch (err) {
      console.error('Failed to load dashboard data:', err)
      setError('Failed to load dashboard data')
      setConnectionStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const dashboardCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      change: '+0%',
      icon: Users,
      color: 'text-blue-400'
    },
    {
      title: 'Active Contests',
      value: stats.activeContests.toString(),
      change: '+0%',
      icon: Trophy,
      color: 'text-purple-400'
    },
    {
      title: 'Submissions',
      value: stats.totalSubmissions.toLocaleString(),
      change: '+0%',
      icon: Eye,
      color: 'text-green-400'
    },
    {
      title: 'Content Blocks',
      value: stats.totalViews.toLocaleString(),
      change: '+0%',
      icon: BarChart3,
      color: 'text-yellow-400'
    }
  ]

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
                connectionStatus === 'connected'
                  ? 'bg-green-400 animate-pulse'
                  : connectionStatus === 'error'
                  ? 'bg-red-400'
                  : 'bg-yellow-400'
              }`}></div>
              <span className="text-sm text-text-muted">
                {connectionStatus === 'connected' && 'Database Connected'}
                {connectionStatus === 'error' && 'Database Error'}
                {connectionStatus === 'connecting' && 'Connecting...'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="text-red-300 hover:text-red-200 text-sm mt-2 underline"
          >
            Retry
          </button>
        </div>
      )}

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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardCards.map((card) => {
            const IconComponent = card.icon
            
            return (
              <div
                key={card.title}
                className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6 hover:bg-surface/70 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-background/50 ${card.color}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <span className="text-text-muted text-sm font-medium">
                    {card.change}
                  </span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white mb-1">{card.value}</p>
                  <p className="text-text-muted text-sm">{card.title}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-50" />
            <p className="text-text-muted">No recent activity</p>
            <p className="text-text-muted text-sm mt-1">Activity will appear here when users interact with your platform</p>
          </div>
        </div>

        <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center space-x-3 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg hover:bg-purple-500/20 transition-colors">
              <Trophy className="w-5 h-5 text-purple-400" />
              <span className="text-white">Create Contest</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-white">Manage Users</span>
            </button>
            <button className="w-full flex items-center space-x-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg hover:bg-green-500/20 transition-colors">
              <Bell className="w-5 h-5 text-green-400" />
              <span className="text-white">Send Notification</span>
            </button>
          </div>
        </div>

        <div className="bg-surface/50 backdrop-blur-sm border border-border rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Platform Health</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Database</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-green-400 text-sm">Healthy</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">Users Online</span>
              <span className="text-white font-semibold">0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-text-muted">System Load</span>
              <span className="text-green-400 font-semibold">Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}