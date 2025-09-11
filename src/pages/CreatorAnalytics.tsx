import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Users,
  Trophy,
  Star,
  Calendar,
  Download,
  Filter,
  BarChart3,
  Target
} from 'lucide-react'
import { supabase } from '../lib/supabase/client'
import { useAuth } from '../lib/auth/context'
import { XPDisplay, StatsCard } from '../components/gamification/XPDisplay'
import { BadgeGrid } from '../components/gamification/BadgeDisplay'
import { useGamificationStore } from '../stores/gamification.store'

interface AnalyticsData {
  totalViews: number
  totalLikes: number
  totalComments: number
  totalShares: number
  averageEngagement: number
  contestsParticipated: number
  contestsWon: number
  bestPerformingVideo: {
    url: string
    title: string
    views: number
    likes: number
    engagementRate: number
  } | null
  monthlyStats: Array<{
    month: string
    views: number
    likes: number
    comments: number
    engagement: number
  }>
  contestHistory: Array<{
    id: string
    title: string
    rank: number
    totalParticipants: number
    score: number
    date: string
    prize?: string
  }>
  performanceByCategory: Array<{
    category: string
    count: number
    avgScore: number
    color: string
  }>
}

type TimeRange = '7d' | '30d' | '90d' | 'all'

const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5A2B']

export function CreatorAnalytics() {
  const { user } = useAuth()
  const { userStats, badges, loadUserStats, loadUserBadges } = useGamificationStore()
  
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')
  const [activeTab, setActiveTab] = useState<'overview' | 'performance' | 'contests' | 'badges'>('overview')

  useEffect(() => {
    if (user) {
      loadAnalytics()
      loadUserStats(user.id)
      loadUserBadges(user.id)
    }
  }, [user, timeRange])

  const loadAnalytics = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Get user's contest submissions
      const { data: submissions } = await supabase
        .from('contest_submissions')
        .select(`
          *,
          contests(title, start_date, end_date, hashtag)
        `)
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false })

      if (submissions) {
        // Calculate analytics
        const totalViews = submissions.reduce((sum, s) => sum + (s.views_count || 0), 0)
        const totalLikes = submissions.reduce((sum, s) => sum + (s.likes_count || 0), 0)
        const totalComments = submissions.reduce((sum, s) => sum + (s.comments_count || 0), 0)
        const totalShares = submissions.reduce((sum, s) => sum + (s.shares_count || 0), 0)
        
        const averageEngagement = submissions.length > 0 
          ? submissions.reduce((sum, s) => sum + (s.engagement_score || 0), 0) / submissions.length
          : 0

        const contestsWon = submissions.filter(s => s.is_winner).length

        // Find best performing video
        const bestVideo = submissions.reduce((best, current) => {
          const currentScore = current.final_score || 0
          const bestScore = best?.final_score || 0
          return currentScore > bestScore ? current : best
        }, null as any)

        // Generate monthly stats (last 12 months)
        const monthlyStats = generateMonthlyStats(submissions)

        // Generate contest history
        const contestHistory = submissions
          .filter(s => s.rank_position)
          .map(s => ({
            id: s.contest_id,
            title: s.contests?.title || 'Unknown Contest',
            rank: s.rank_position,
            totalParticipants: Math.floor(Math.random() * 500) + 50, // Mock data
            score: s.final_score || 0,
            date: s.submitted_at,
            prize: s.is_winner ? (s.rank_position === 1 ? '1st Place' : s.rank_position === 2 ? '2nd Place' : '3rd Place') : undefined
          }))

        // Performance by category (mock data for now)
        const performanceByCategory = [
          { category: 'Dance', count: 15, avgScore: 85, color: COLORS[0] },
          { category: 'Comedy', count: 12, avgScore: 78, color: COLORS[1] },
          { category: 'Fashion', count: 8, avgScore: 92, color: COLORS[2] },
          { category: 'Food', count: 5, avgScore: 88, color: COLORS[3] },
          { category: 'Lifestyle', count: 10, avgScore: 82, color: COLORS[4] }
        ]

        setAnalytics({
          totalViews,
          totalLikes,
          totalComments,
          totalShares,
          averageEngagement,
          contestsParticipated: submissions.length,
          contestsWon,
          bestPerformingVideo: bestVideo ? {
            url: bestVideo.tiktok_url,
            title: bestVideo.video_title || 'Untitled Video',
            views: bestVideo.views_count || 0,
            likes: bestVideo.likes_count || 0,
            engagementRate: bestVideo.engagement_score || 0
          } : null,
          monthlyStats,
          contestHistory,
          performanceByCategory
        })
      }
    } catch (error) {
      console.error('Failed to load analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateMonthlyStats = (submissions: any[]) => {
    const months = []
    const now = new Date()
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthKey = date.toISOString().slice(0, 7)
      
      const monthSubmissions = submissions.filter(s => 
        s.submitted_at.startsWith(monthKey)
      )
      
      const views = monthSubmissions.reduce((sum, s) => sum + (s.views_count || 0), 0)
      const likes = monthSubmissions.reduce((sum, s) => sum + (s.likes_count || 0), 0)
      const comments = monthSubmissions.reduce((sum, s) => sum + (s.comments_count || 0), 0)
      const engagement = monthSubmissions.length > 0 
        ? monthSubmissions.reduce((sum, s) => sum + (s.engagement_score || 0), 0) / monthSubmissions.length
        : 0

      months.push({
        month: date.toLocaleDateString('en', { month: 'short' }),
        views,
        likes,
        comments,
        engagement: Math.round(engagement)
      })
    }
    
    return months
  }

  const exportData = () => {
    if (!analytics) return
    
    const data = {
      summary: {
        totalViews: analytics.totalViews,
        totalLikes: analytics.totalLikes,
        totalComments: analytics.totalComments,
        averageEngagement: analytics.averageEngagement,
        contestsParticipated: analytics.contestsParticipated,
        contestsWon: analytics.contestsWon
      },
      monthlyStats: analytics.monthlyStats,
      contestHistory: analytics.contestHistory,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `creator-analytics-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center">
        <motion.div
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Creator Analytics</h1>
            <p className="text-gray-400">Track your performance and growth</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 text-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
            
            <button
              onClick={exportData}
              className="flex items-center space-x-2 bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-800/30 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'performance', label: 'Performance', icon: TrendingUp },
            { id: 'contests', label: 'Contests', icon: Trophy },
            { id: 'badges', label: 'Badges', icon: Star }
          ].map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all
                  ${activeTab === tab.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }
                `}
              >
                <IconComponent className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* XP Display */}
            {userStats && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <XPDisplay userStats={userStats} showDetails={true} size="large" />
                </div>
                <div>
                  <StatsCard userStats={userStats} />
                </div>
              </div>
            )}

            {/* Key Metrics */}
            {analytics && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <MetricCard
                  icon={Eye}
                  label="Total Views"
                  value={analytics.totalViews.toLocaleString()}
                  change={'+12%'}
                  color="text-blue-400"
                />
                <MetricCard
                  icon={Heart}
                  label="Total Likes"
                  value={analytics.totalLikes.toLocaleString()}
                  change={'+8%'}
                  color="text-red-400"
                />
                <MetricCard
                  icon={MessageCircle}
                  label="Total Comments"
                  value={analytics.totalComments.toLocaleString()}
                  change={'+15%'}
                  color="text-green-400"
                />
                <MetricCard
                  icon={Target}
                  label="Avg. Engagement"
                  value={`${Math.round(analytics.averageEngagement)}%`}
                  change={'+5%'}
                  color="text-purple-400"
                />
              </div>
            )}

            {/* Performance Chart */}
            {analytics && (
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-white mb-6">Performance Trends</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.monthlyStats}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="views"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        name="Views"
                      />
                      <Line
                        type="monotone"
                        dataKey="likes"
                        stroke="#EF4444"
                        strokeWidth={2}
                        name="Likes"
                      />
                      <Line
                        type="monotone"
                        dataKey="engagement"
                        stroke="#8B5CF6"
                        strokeWidth={2}
                        name="Engagement %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && analytics && (
          <div className="space-y-8">
            {/* Best Performing Video */}
            {analytics.bestPerformingVideo && (
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-white mb-4">Best Performing Video</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-white mb-1">
                      {analytics.bestPerformingVideo.title}
                    </p>
                    <div className="flex items-center space-x-6 text-sm">
                      <span className="flex items-center space-x-1 text-blue-400">
                        <Eye className="w-4 h-4" />
                        <span>{analytics.bestPerformingVideo.views.toLocaleString()}</span>
                      </span>
                      <span className="flex items-center space-x-1 text-red-400">
                        <Heart className="w-4 h-4" />
                        <span>{analytics.bestPerformingVideo.likes.toLocaleString()}</span>
                      </span>
                      <span className="text-green-400">
                        {analytics.bestPerformingVideo.engagementRate.toFixed(1)}% engagement
                      </span>
                    </div>
                  </div>
                  <a
                    href={analytics.bestPerformingVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    View Video
                  </a>
                </div>
              </div>
            )}

            {/* Category Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-white mb-6">Performance by Category</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.performanceByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="count"
                      >
                        {analytics.performanceByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {analytics.performanceByCategory.map((category) => (
                    <div key={category.category} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <span className="text-gray-300">{category.category}</span>
                      </div>
                      <span className="text-white">{category.count} videos</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                <h3 className="text-xl font-bold text-white mb-6">Average Scores by Category</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.performanceByCategory} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis type="number" domain={[0, 100]} stroke="#9CA3AF" />
                      <YAxis type="category" dataKey="category" stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="avgScore" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contests Tab */}
        {activeTab === 'contests' && analytics && (
          <div className="space-y-8">
            {/* Contest Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <MetricCard
                icon={Trophy}
                label="Contests Won"
                value={analytics.contestsWon.toString()}
                color="text-yellow-400"
              />
              <MetricCard
                icon={Target}
                label="Contests Participated"
                value={analytics.contestsParticipated.toString()}
                color="text-blue-400"
              />
              <MetricCard
                icon={TrendingUp}
                label="Win Rate"
                value={`${analytics.contestsParticipated > 0 ? Math.round((analytics.contestsWon / analytics.contestsParticipated) * 100) : 0}%`}
                color="text-green-400"
              />
            </div>

            {/* Contest History */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-bold text-white mb-6">Contest History</h3>
              <div className="space-y-4">
                {analytics.contestHistory.map((contest) => (
                  <div
                    key={contest.id}
                    className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-600"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{contest.title}</h4>
                      <p className="text-gray-400 text-sm">
                        {new Date(contest.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${contest.rank <= 3 ? 'text-yellow-400' : 'text-gray-300'}`}>
                        #{contest.rank}
                      </div>
                      <div className="text-xs text-gray-400">
                        of {contest.totalParticipants}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">
                        {contest.score}
                      </div>
                      <div className="text-xs text-gray-400">Score</div>
                    </div>
                    {contest.prize && (
                      <div className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
                        {contest.prize}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Badge Collection</h3>
                <div className="text-sm text-gray-400">
                  {badges.filter(b => b.unlocked).length} / {badges.length} unlocked
                </div>
              </div>
              <BadgeGrid badges={badges} showProgress={true} columns={6} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface MetricCardProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  change?: string
  color: string
}

function MetricCard({ icon: Icon, label, value, change, color }: MetricCardProps) {
  return (
    <motion.div
      className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6"
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center space-x-3 mb-4">
        <div className={`p-2 rounded-lg bg-gray-800 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-gray-400 text-sm">{label}</span>
      </div>
      
      <div className="flex items-end justify-between">
        <div className={`text-2xl font-bold ${color}`}>
          {value}
        </div>
        {change && (
          <div className="text-green-400 text-sm font-medium">
            {change}
          </div>
        )}
      </div>
    </motion.div>
  )
}