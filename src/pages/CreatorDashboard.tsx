import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, 
  Star, 
  TrendingUp, 
  Users, 
  Bell, 
  Settings, 
  Plus,
  Eye,
  Filter,
  Calendar,
  Award,
  Zap
} from 'lucide-react'
import { useAuth } from '../lib/auth/context'
import { useGamificationStore } from '../stores/gamification.store'
import { XPDisplay, XPAnimation, LevelUpAnimation } from '../components/gamification/XPDisplay'
import { BadgeGrid, BadgeUnlockAnimation } from '../components/gamification/BadgeDisplay'
import { LiveLeaderboard } from '../components/leaderboard/LiveLeaderboard'
import { TikTokConnect } from '../components/auth/TikTokConnect'
import { NotificationCenter, useNotifications } from '../components/notifications/NotificationCenter'
import { SubmissionForm } from '../components/contest/SubmissionForm'
import { supabase } from '../lib/supabase/client'

interface ActiveContest {
  id: string
  title: string
  description: string
  hashtag: string
  start_date: string
  end_date: string
  first_prize?: string
  second_prize?: string
  third_prize?: string
  participation_reward: number
  total_submissions: number
  max_participants?: number
}

interface UserSubmission {
  id: string
  contest_id: string
  tiktok_url: string
  video_title?: string
  views_count: number
  likes_count: number
  comments_count: number
  engagement_score: number
  final_score: number
  rank_position?: number
  status: 'pending' | 'approved' | 'rejected'
  is_winner: boolean
  submitted_at: string
  contest: {
    title: string
    hashtag: string
    end_date: string
  }
}

export function CreatorDashboard() {
  const { user } = useAuth()
  const { 
    userStats, 
    badges, 
    showXPAnimation, 
    xpAnimationAmount, 
    showBadgeUnlock, 
    showLevelUp,
    loadUserStats, 
    loadUserBadges,
    clearAnimations 
  } = useGamificationStore()
  const { unreadCount } = useNotifications()

  const [activeContests, setActiveContests] = useState<ActiveContest[]>([])
  const [userSubmissions, setUserSubmissions] = useState<UserSubmission[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSubmissionForm, setShowSubmissionForm] = useState<ActiveContest | null>(null)
  const [selectedTab, setSelectedTab] = useState<'overview' | 'contests' | 'submissions' | 'badges'>('overview')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
      loadUserStats(user.id)
      loadUserBadges(user.id)
    }
  }, [user])

  const loadDashboardData = async () => {
    if (!user) return

    setLoading(true)
    try {
      // Load active contests
      const { data: contests } = await supabase
        .from('contests')
        .select('*')
        .eq('status', 'active')
        .lte('start_date', new Date().toISOString())
        .gte('end_date', new Date().toISOString())
        .order('start_date', { ascending: true })

      if (contests) {
        setActiveContests(contests)
      }

      // Load user submissions
      const { data: submissions } = await supabase
        .from('contest_submissions')
        .select(`
          *,
          contests!inner(title, hashtag, end_date)
        `)
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false })
        .limit(10)

      if (submissions) {
        setUserSubmissions(submissions as UserSubmission[])
      }

    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmissionSuccess = () => {
    setShowSubmissionForm(null)
    loadDashboardData()
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'contests', label: 'Contests', icon: Trophy },
    { id: 'submissions', label: 'My Submissions', icon: Eye },
    { id: 'badges', label: 'Badges', icon: Star }
  ]

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
            <h1 className="text-3xl font-bold text-white mb-2">Creator Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user?.user_metadata?.name || 'Creator'}!</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            
            <button className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-800/30 rounded-lg p-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all
                  ${selectedTab === tab.id
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

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {selectedTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* XP & Stats */}
                <div className="lg:col-span-2 space-y-6">
                  {userStats && <XPDisplay userStats={userStats} showDetails={true} size="large" />}
                  
                  {/* TikTok Integration */}
                  <TikTokConnect showStats={true} />
                </div>

                {/* Quick Stats */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Active Contests</span>
                        <span className="text-white font-bold">{activeContests.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">My Submissions</span>
                        <span className="text-white font-bold">{userSubmissions.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Badges Earned</span>
                        <span className="text-white font-bold">{badges.filter(b => b.unlocked).length}</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Badges */}
                  <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
                    <h3 className="text-lg font-bold text-white mb-4">Recent Badges</h3>
                    <BadgeGrid 
                      badges={badges.filter(b => b.unlocked).slice(0, 6)} 
                      columns={3} 
                      showProgress={false}
                    />
                  </div>
                </div>
              </div>

              {/* Live Leaderboard */}
              <LiveLeaderboard limit={10} showFilters={false} />
            </motion.div>
          )}

          {selectedTab === 'contests' && (
            <motion.div
              key="contests"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Active Contests</h2>
                <div className="text-gray-400 text-sm">
                  {activeContests.length} active contest{activeContests.length !== 1 ? 's' : ''}
                </div>
              </div>

              {activeContests.length === 0 ? (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Active Contests</h3>
                  <p className="text-gray-400">Check back soon for new contests to participate in!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeContests.map((contest) => (
                    <motion.div
                      key={contest.id}
                      className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">{contest.title}</h3>
                          <p className="text-primary font-medium">{contest.hashtag}</p>
                        </div>
                        <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-medium">
                          ACTIVE
                        </div>
                      </div>

                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                        {contest.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-400">Submissions:</span>
                          <div className="text-white font-medium">{contest.total_submissions}</div>
                        </div>
                        <div>
                          <span className="text-gray-400">XP Reward:</span>
                          <div className="text-primary font-medium">+{contest.participation_reward}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-400">
                          Ends: {new Date(contest.end_date).toLocaleDateString()}
                        </div>
                        <button
                          onClick={() => setShowSubmissionForm(contest)}
                          className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Submit Video
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {selectedTab === 'submissions' && (
            <motion.div
              key="submissions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <h2 className="text-2xl font-bold text-white">My Submissions</h2>

              {userSubmissions.length === 0 ? (
                <div className="text-center py-12">
                  <Eye className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Submissions Yet</h3>
                  <p className="text-gray-400 mb-4">Start by submitting a video to an active contest!</p>
                  {activeContests.length > 0 && (
                    <button
                      onClick={() => setSelectedTab('contests')}
                      className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-lg font-medium"
                    >
                      View Active Contests
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {userSubmissions.map((submission) => (
                    <motion.div
                      key={submission.id}
                      className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">
                            {submission.contest.title}
                          </h3>
                          <p className="text-primary text-sm">{submission.contest.hashtag}</p>
                          {submission.video_title && (
                            <p className="text-gray-400 text-sm mt-1">{submission.video_title}</p>
                          )}
                        </div>
                        <div className="text-right">
                          {submission.rank_position && (
                            <div className={`text-lg font-bold mb-1 ${
                              submission.rank_position <= 3 ? 'text-yellow-400' : 'text-white'
                            }`}>
                              #{submission.rank_position}
                            </div>
                          )}
                          <div className={`text-xs px-2 py-1 rounded ${
                            submission.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                            submission.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {submission.status}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-blue-400 font-bold">{submission.views_count.toLocaleString()}</div>
                          <div className="text-gray-400 text-xs">Views</div>
                        </div>
                        <div className="text-center">
                          <div className="text-red-400 font-bold">{submission.likes_count.toLocaleString()}</div>
                          <div className="text-gray-400 text-xs">Likes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-green-400 font-bold">{submission.engagement_score}%</div>
                          <div className="text-gray-400 text-xs">Engagement</div>
                        </div>
                        <div className="text-center">
                          <div className="text-primary font-bold">{submission.final_score}</div>
                          <div className="text-gray-400 text-xs">Score</div>
                        </div>
                      </div>

                      {submission.is_winner && (
                        <div className="mt-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3 flex items-center space-x-2">
                          <Award className="w-5 h-5 text-yellow-400" />
                          <span className="text-yellow-400 font-medium">Contest Winner!</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {selectedTab === 'badges' && (
            <motion.div
              key="badges"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Badge Collection</h2>
                <div className="text-gray-400 text-sm">
                  {badges.filter(b => b.unlocked).length} of {badges.length} unlocked
                </div>
              </div>

              <BadgeGrid badges={badges} showProgress={true} columns={5} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modals */}
        <NotificationCenter
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
        />

        <AnimatePresence>
          {showSubmissionForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowSubmissionForm(null)}
            >
              <div onClick={(e) => e.stopPropagation()}>
                <SubmissionForm
                  contest={showSubmissionForm}
                  onSubmissionSuccess={handleSubmissionSuccess}
                  onClose={() => setShowSubmissionForm(null)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animations */}
        <XPAnimation
          amount={xpAnimationAmount}
          visible={showXPAnimation}
          onComplete={clearAnimations}
        />

        <LevelUpAnimation
          visible={showLevelUp}
          level={userStats?.level || 'rookie'}
          onComplete={clearAnimations}
        />

        <BadgeUnlockAnimation
          badge={showBadgeUnlock}
          onClose={clearAnimations}
        />
      </div>
    </div>
  )
}