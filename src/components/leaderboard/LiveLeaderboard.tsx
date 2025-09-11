import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Crown, Trophy, Medal, TrendingUp, Users, Eye, Heart, MessageCircle, Share2, Filter, Clock } from 'lucide-react'
import { supabase } from '../../lib/supabase/client'

interface LeaderboardEntry {
  id: string
  rank_position: number
  user: {
    id: string
    name: string
    tiktok_handle: string
    avatar_url?: string
    level: string
  }
  submission: {
    id: string
    tiktok_url: string
    video_title?: string
    views_count: number
    likes_count: number
    comments_count: number
    shares_count: number
    engagement_score: number
    final_score: number
  }
  contest: {
    id: string
    title: string
    hashtag: string
  }
  previous_rank?: number
}

interface LiveLeaderboardProps {
  contestId?: string
  limit?: number
  showFilters?: boolean
  autoRefresh?: boolean
  refreshInterval?: number
}

type SortBy = 'final_score' | 'views_count' | 'likes_count' | 'engagement_score'
type TimeFilter = 'all' | '24h' | '7d' | '30d'

const rankIcons = {
  1: { icon: Crown, color: 'text-yellow-400', bg: 'from-yellow-500/20 to-yellow-600/20' },
  2: { icon: Trophy, color: 'text-gray-400', bg: 'from-gray-500/20 to-gray-600/20' },
  3: { icon: Medal, color: 'text-amber-600', bg: 'from-amber-500/20 to-amber-600/20' },
  default: { icon: Users, color: 'text-gray-500', bg: 'from-gray-500/10 to-gray-600/10' }
}

export function LiveLeaderboard({
  contestId,
  limit = 50,
  showFilters = true,
  autoRefresh = true,
  refreshInterval = 30000
}: LiveLeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortBy>('final_score')
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const previousEntriesRef = useRef<LeaderboardEntry[]>([])

  useEffect(() => {
    loadLeaderboard()
    
    if (autoRefresh) {
      const interval = setInterval(loadLeaderboard, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [contestId, sortBy, timeFilter, autoRefresh, refreshInterval])

  useEffect(() => {
    if (!contestId) return

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`leaderboard-${contestId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contest_submissions',
          filter: `contest_id=eq.${contestId}`,
        },
        () => {
          loadLeaderboard()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [contestId])

  const loadLeaderboard = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('contest_submissions')
        .select(`
          id,
          rank_position,
          tiktok_url,
          video_title,
          views_count,
          likes_count,
          comments_count,
          shares_count,
          engagement_score,
          final_score,
          submitted_at,
          profiles!inner(
            id,
            name,
            tiktok_handle,
            avatar_url,
            level
          ),
          contests!inner(
            id,
            title,
            hashtag
          )
        `)
        .eq('status', 'approved')
        .order(sortBy, { ascending: false })
        .limit(limit)

      if (contestId) {
        query = query.eq('contest_id', contestId)
      }

      // Apply time filter
      if (timeFilter !== 'all') {
        const now = new Date()
        let since: Date
        
        switch (timeFilter) {
          case '24h':
            since = new Date(now.getTime() - 24 * 60 * 60 * 1000)
            break
          case '7d':
            since = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            break
          case '30d':
            since = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            break
          default:
            since = new Date(0)
        }
        
        query = query.gte('submitted_at', since.toISOString())
      }

      const { data, error } = await query

      if (error) throw error

      // Transform data and calculate rank changes
      const transformedEntries = data?.map((item, index) => ({
        id: item.id,
        rank_position: index + 1,
        user: {
          id: item.profiles.id,
          name: item.profiles.name,
          tiktok_handle: item.profiles.tiktok_handle,
          avatar_url: item.profiles.avatar_url,
          level: item.profiles.level
        },
        submission: {
          id: item.id,
          tiktok_url: item.tiktok_url,
          video_title: item.video_title,
          views_count: item.views_count,
          likes_count: item.likes_count,
          comments_count: item.comments_count,
          shares_count: item.shares_count,
          engagement_score: item.engagement_score,
          final_score: item.final_score
        },
        contest: {
          id: item.contests.id,
          title: item.contests.title,
          hashtag: item.contests.hashtag
        }
      })) || []

      // Calculate rank changes
      const entriesWithChanges = transformedEntries.map(entry => {
        const previousEntry = previousEntriesRef.current.find(prev => prev.id === entry.id)
        return {
          ...entry,
          previous_rank: previousEntry?.rank_position
        }
      })

      previousEntriesRef.current = entries
      setEntries(entriesWithChanges)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to load leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankChange = (entry: LeaderboardEntry): 'up' | 'down' | 'same' | 'new' => {
    if (!entry.previous_rank) return 'new'
    if (entry.rank_position < entry.previous_rank) return 'up'
    if (entry.rank_position > entry.previous_rank) return 'down'
    return 'same'
  }

  const getRankIcon = (position: number) => {
    if (position <= 3) {
      return rankIcons[position as keyof typeof rankIcons] || rankIcons.default
    }
    return rankIcons.default
  }

  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Live Leaderboard</h2>
              <p className="text-gray-400 text-sm">
                {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : 'Loading...'}
              </p>
            </div>
          </div>

          {/* Live indicator */}
          <div className="flex items-center space-x-2 text-green-400">
            <motion.div
              className="w-2 h-2 bg-green-400 rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm font-medium">LIVE</span>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white"
              >
                <option value="final_score">Final Score</option>
                <option value="views_count">Views</option>
                <option value="likes_count">Likes</option>
                <option value="engagement_score">Engagement</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">Time:</span>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
                className="bg-gray-800 border border-gray-600 rounded px-2 py-1 text-sm text-white"
              >
                <option value="all">All Time</option>
                <option value="24h">Last 24h</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className="p-6">
        {loading && entries.length === 0 ? (
          <div className="text-center py-8">
            <motion.div
              className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-gray-400">Loading leaderboard...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No submissions yet</p>
            <p className="text-gray-500 text-sm">Be the first to participate!</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {entries.map((entry, index) => {
                const rankIcon = getRankIcon(entry.rank_position)
                const RankIcon = rankIcon.icon
                const rankChange = getRankChange(entry)
                
                return (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ 
                      layout: { duration: 0.5 },
                      opacity: { duration: 0.3 }
                    }}
                    className={`
                      relative p-4 rounded-lg border transition-all duration-300
                      ${entry.rank_position <= 3 
                        ? `bg-gradient-to-r ${rankIcon.bg} border-${rankIcon.color.split('-')[1]}-500/30` 
                        : 'bg-gray-800/30 border-gray-700 hover:border-gray-600'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Rank */}
                      <div className="flex items-center space-x-2 min-w-[60px]">
                        <div className={`text-2xl font-bold ${rankIcon.color}`}>
                          {entry.rank_position}
                        </div>
                        <RankIcon className={`w-5 h-5 ${rankIcon.color}`} />
                      </div>

                      {/* User Info */}
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="relative">
                          {entry.user.avatar_url ? (
                            <img
                              src={entry.user.avatar_url}
                              alt={entry.user.name}
                              className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {entry.user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          
                          {/* Level badge */}
                          <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full px-1 py-0.5 border border-gray-600">
                            <span className="text-xs text-gray-300">
                              {entry.user.level.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white truncate">
                            {entry.user.name}
                          </div>
                          <div className="text-sm text-gray-400 truncate">
                            @{entry.user.tiktok_handle}
                          </div>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-1 text-gray-300">
                          <Eye className="w-4 h-4" />
                          <span>{(entry.submission.views_count || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-red-400">
                          <Heart className="w-4 h-4" />
                          <span>{(entry.submission.likes_count || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-blue-400">
                          <MessageCircle className="w-4 h-4" />
                          <span>{(entry.submission.comments_count || 0).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right min-w-[80px]">
                        <div className={`text-lg font-bold ${rankIcon.color}`}>
                          {entry.submission.final_score}
                        </div>
                        <div className="text-xs text-gray-400">Score</div>
                      </div>

                      {/* Rank Change Indicator */}
                      {rankChange !== 'same' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2"
                        >
                          {rankChange === 'up' && (
                            <div className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                              ↑ {entry.previous_rank ? entry.previous_rank - entry.rank_position : ''}
                            </div>
                          )}
                          {rankChange === 'down' && (
                            <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              ↓ {entry.previous_rank ? entry.rank_position - entry.previous_rank : ''}
                            </div>
                          )}
                          {rankChange === 'new' && (
                            <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                              NEW
                            </div>
                          )}
                        </motion.div>
                      )}
                    </div>

                    {/* Video Title (if available) */}
                    {entry.submission.video_title && (
                      <div className="mt-2 text-sm text-gray-400 truncate">
                        {entry.submission.video_title}
                      </div>
                    )}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}