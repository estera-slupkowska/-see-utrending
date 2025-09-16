import { useState, useEffect } from 'react'
import { Badge, Button } from '../ui'
import { Trophy, TrendingUp, Eye, Heart, MessageCircle, Share, Crown, Star, Filter, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

interface LeaderboardEntry {
  id: string
  rank: number
  username: string
  displayName: string
  avatarUrl: string
  isVerified: boolean
  videoTitle: string
  videoUrl: string
  metrics: {
    views: number
    likes: number
    comments: number
    shares: number
    engagementRate: number
  }
  scores: {
    engagement: number
    quality: number
    virality: number
    final: number
  }
  rankChange: 'up' | 'down' | 'same' | 'new'
  isWinner: boolean
  prizeLevel?: 1 | 2 | 3
}

type SortOption = 'algorithm' | 'views' | 'likes' | 'comments' | 'shares'

interface LiveLeaderboardProps {
  contestId: string
  contestTitle: string
  isLive?: boolean
  maxEntries?: number
}

export function LiveLeaderboard({ contestId, contestTitle, isLive = true, maxEntries = 10 }: LiveLeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>('algorithm')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Generate mock leaderboard data for sandbox
  const generateMockData = (): LeaderboardEntry[] => {
    const creators = [
      { username: '@anna_tiktok', displayName: 'Anna K.', verified: true },
      { username: '@jakub_viral', displayName: 'Jakub M.', verified: false },
      { username: '@maria_creator', displayName: 'Maria S.', verified: true },
      { username: '@piotr_trends', displayName: 'Piotr W.', verified: false },
      { username: '@kasia_dance', displayName: 'Kasia L.', verified: false },
      { username: '@tomek_funny', displayName: 'Tomek R.', verified: true },
      { username: '@ola_beauty', displayName: 'Ola N.', verified: false },
      { username: '@michal_tech', displayName: 'Michał K.', verified: false },
      { username: '@sara_lifestyle', displayName: 'Sara P.', verified: true },
      { username: '@adam_sports', displayName: 'Adam J.', verified: false },
    ]

    return creators.slice(0, maxEntries).map((creator, index) => {
      const baseViews = Math.floor(Math.random() * 500000) + 10000
      const engagementRate = 0.02 + Math.random() * 0.08
      const likes = Math.floor(baseViews * engagementRate)
      const comments = Math.floor(likes * (0.05 + Math.random() * 0.15))
      const shares = Math.floor(likes * (0.02 + Math.random() * 0.08))
      
      // Simple winning algorithm: views * 0.4 + likes * 0.4 + shares * 0.1 + comments * 0.1
      const finalScore = Math.round(
        baseViews * 0.4 + 
        likes * 0.4 + 
        shares * 0.1 + 
        comments * 0.1
      )

      return {
        id: `entry-${index + 1}`,
        rank: index + 1,
        username: creator.username,
        displayName: creator.displayName,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.username}`,
        isVerified: creator.verified,
        videoTitle: `Demo Video ${index + 1}`,
        videoUrl: `https://tiktok.com/demo-${index + 1}`,
        metrics: {
          views: baseViews,
          likes,
          comments,
          shares,
          engagementRate: Math.round(engagementRate * 1000) / 10
        },
        scores: {
          engagement: Math.round(engagementScore),
          quality: Math.round(qualityScore),
          virality: Math.round(viralityScore),
          final: finalScore
        },
        rankChange: index === 0 ? 'new' : ['up', 'down', 'same'][Math.floor(Math.random() * 3)] as any,
        isWinner: index < 3,
        prizeLevel: index < 3 ? (index + 1 as 1 | 2 | 3) : undefined
      }
    }).sort((a, b) => b.scores.final - a.scores.final)
      .map((entry, index) => ({ ...entry, rank: index + 1 }))
  }

  // Simulate live updates
  useEffect(() => {
    const loadData = () => {
      setIsLoading(true)
      // Simulate API delay
      setTimeout(() => {
        const mockData = generateMockData()
        const sortedData = sortEntries(mockData, sortBy, sortDirection)
        setEntries(sortedData)
        setLastUpdate(new Date())
        setIsLoading(false)
      }, 1000)
    }

    loadData()

    // Simulate live updates every 30 seconds if live
    let interval: NodeJS.Timeout
    if (isLive) {
      interval = setInterval(() => {
        // Small random changes to simulate live updates
        setEntries(prev => prev.map(entry => ({
          ...entry,
          metrics: {
            ...entry.metrics,
            views: entry.metrics.views + Math.floor(Math.random() * 100),
            likes: entry.metrics.likes + Math.floor(Math.random() * 10),
            comments: entry.metrics.comments + Math.floor(Math.random() * 3),
            shares: entry.metrics.shares + Math.floor(Math.random() * 2),
          }
        })))
        setLastUpdate(new Date())
      }, 30000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isLive, maxEntries, sortBy, sortDirection])

  // Re-sort entries when sort options change
  useEffect(() => {
    if (entries.length > 0) {
      const sortedData = sortEntries(entries, sortBy, sortDirection)
      setEntries(sortedData)
    }
  }, [sortBy, sortDirection])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-xp-gold" />
      case 2: return <Trophy className="w-5 h-5 text-gray-400" />
      case 3: return <Trophy className="w-5 h-5 text-amber-600" />
      default: return <span className="text-sm font-bold text-text-muted">#{rank}</span>
    }
  }

  const getRankChangeIcon = (change: string) => {
    switch (change) {
      case 'up': return <TrendingUp className="w-3 h-3 text-success-green" />
      case 'down': return <TrendingUp className="w-3 h-3 text-error-red transform rotate-180" />
      case 'new': return <Star className="w-3 h-3 text-primary" />
      default: return null
    }
  }

  // Sorting functions
  const sortEntries = (entries: LeaderboardEntry[], sortBy: SortOption, direction: 'asc' | 'desc') => {
    const sorted = [...entries].sort((a, b) => {
      let aValue: number
      let bValue: number

      switch (sortBy) {
        case 'views':
          aValue = a.metrics.views
          bValue = b.metrics.views
          break
        case 'likes':
          aValue = a.metrics.likes
          bValue = b.metrics.likes
          break
        case 'comments':
          aValue = a.metrics.comments
          bValue = b.metrics.comments
          break
        case 'shares':
          aValue = a.metrics.shares
          bValue = b.metrics.shares
          break
        case 'algorithm':
        default:
          aValue = a.scores.final
          bValue = b.scores.final
          break
      }

      return direction === 'desc' ? bValue - aValue : aValue - bValue
    })

    // Update ranks based on current sorting
    return sorted.map((entry, index) => ({
      ...entry,
      rank: index + 1,
      isWinner: index < 3 // Top 3 in current sort are winners
    }))
  }

  const handleSort = (newSortBy: SortOption) => {
    if (sortBy === newSortBy) {
      // Toggle direction if same sort option
      setSortDirection(prev => prev === 'desc' ? 'asc' : 'desc')
    } else {
      // New sort option, default to desc
      setSortBy(newSortBy)
      setSortDirection('desc')
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  if (isLoading) {
    return (
      <div className="card-clean">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-display font-semibold text-text-primary">
            Ranking na żywo
          </h3>
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <div className="w-2 h-2 bg-success-green rounded-full animate-pulse" />
            Ładowanie...
          </div>
        </div>
        
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3 bg-surface/50 rounded-lg animate-pulse">
              <div className="w-8 h-8 bg-text-muted/20 rounded-lg" />
              <div className="w-10 h-10 bg-text-muted/20 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-text-muted/20 rounded w-1/3 mb-2" />
                <div className="h-3 bg-text-muted/20 rounded w-1/2" />
              </div>
              <div className="w-20 h-8 bg-text-muted/20 rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card-clean">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-display font-semibold text-text-primary">
            Ranking na żywo
          </h3>
          <p className="text-sm text-text-secondary">{contestTitle}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Sorting Controls */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-text-muted" />
            <span className="text-sm text-text-muted">Sortuj:</span>
            <div className="flex gap-1">
              {[
                { key: 'algorithm', label: 'Algorytm', icon: Crown },
                { key: 'views', label: 'Wyświetlenia', icon: Eye },
                { key: 'likes', label: 'Polubienia', icon: Heart },
                { key: 'comments', label: 'Komentarze', icon: MessageCircle },
                { key: 'shares', label: 'Udostępnienia', icon: Share }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => handleSort(key as SortOption)}
                  className={`flex items-center gap-1 px-2 py-1 text-xs rounded transition-all duration-200 ${
                    sortBy === key
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-surface border border-border text-text-secondary hover:border-primary hover:text-primary hover:scale-105'
                  }`}
                  title={`Sortuj według: ${label}`}
                >
                  <Icon className="w-3 h-3" />
                  <span className="hidden sm:inline">{label}</span>
                  {sortBy === key && (
                    sortDirection === 'desc' ? 
                      <ArrowDown className="w-3 h-3" /> : 
                      <ArrowUp className="w-3 h-3" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="text-right">
            {isLive && (
              <div className="flex items-center gap-2 text-sm text-success-green mb-1">
                <div className="w-2 h-2 bg-success-green rounded-full animate-pulse" />
                Na żywo
              </div>
            )}
            <p className="text-xs text-text-muted">
              Aktualizacja: {lastUpdate.toLocaleTimeString('pl-PL')}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {entries.map((entry, index) => (
          <div
            key={entry.id}
            className={`relative flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 ${
              entry.rank <= 3 
                ? 'bg-gradient-to-r from-xp-gold/5 to-primary/5 border-xp-gold/20' 
                : 'bg-surface hover:bg-surface-light border-border'
            }`}
          >
            {/* Rank */}
            <div className="flex flex-col items-center min-w-[40px]">
              {getRankIcon(entry.rank)}
              {getRankChangeIcon(entry.rankChange)}
            </div>

            {/* Avatar */}
            <div className="relative">
              <img
                src={entry.avatarUrl}
                alt={entry.displayName}
                className="w-12 h-12 rounded-full border-2 border-primary/20"
              />
              {entry.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success-green rounded-full flex items-center justify-center">
                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>

            {/* Creator Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-text-primary truncate">
                  {entry.displayName}
                </h4>
                <span className="text-sm text-text-muted">
                  {entry.username}
                </span>
                {entry.prizeLevel && (
                  <Badge variant="gaming" size="sm">
                    {entry.prizeLevel === 1 ? '🥇' : entry.prizeLevel === 2 ? '🥈' : '🥉'} 
                    {entry.prizeLevel === 1 ? 'Pierwsza' : entry.prizeLevel === 2 ? 'Druga' : 'Trzecia'} nagroda
                  </Badge>
                )}
              </div>
              <p className="text-sm text-text-secondary truncate mb-2">
                {entry.videoTitle}
              </p>
              
              {/* Metrics */}
              <div className="flex items-center gap-4 text-xs text-text-muted">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {formatNumber(entry.metrics.views)}
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {formatNumber(entry.metrics.likes)}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {formatNumber(entry.metrics.comments)}
                </span>
                <span className="flex items-center gap-1">
                  <Share className="w-3 h-3" />
                  {formatNumber(entry.metrics.shares)}
                </span>
                <span className="text-primary font-medium">
                  {entry.metrics.engagementRate}% eng.
                </span>
              </div>
            </div>

            {/* Score */}
            <div className="text-right">
              <div className={`text-2xl font-bold ${
                entry.rank === 1 ? 'text-xp-gold' : 
                entry.rank === 2 ? 'text-gray-400' : 
                entry.rank === 3 ? 'text-amber-600' : 
                'text-text-primary'
              }`}>
                {entry.scores.final}
              </div>
              <div className="text-xs text-text-muted">
                E:{entry.scores.engagement} Q:{entry.scores.quality} V:{entry.scores.virality}
              </div>
            </div>

            {/* Winner indicator */}
            {entry.isWinner && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-xp-gold rounded-full flex items-center justify-center">
                <Crown className="w-3 h-3 text-black" />
              </div>
            )}
          </div>
        ))}
      </div>

      {entries.length === 0 && (
        <div className="text-center py-8">
          <Trophy className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h4 className="font-semibold text-text-primary mb-2">Brak zgłoszeń</h4>
          <p className="text-text-secondary">
            Konkurs rozpocznie się wkrótce. Bądź pierwszą osobą, która prześlije swój film!
          </p>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-text-muted">
          <div>
            {sortBy === 'algorithm' ? (
              <div className="space-y-1">
                <span className="font-medium">🏆 Algorytm zwycięzcy (wieloczynnikowy):</span>
                <div className="space-y-0.5 text-xs">
                  <div>• Zaangażowanie (35%) - polubienia, komentarze x2, udostępnienia x3</div>
                  <div>• Viralność (25%) - liczba wyświetleń przeskalowana</div>
                  <div>• Jakość treści (15%) - długość, opis, aktualność</div>
                  <div>• Bonus za aktualność (10%) - najnowsze filmy otrzymują bonus</div>
                  <div>• Konsystencja twórcy (10%) - historia występów</div>
                  <div>• Interakcja społeczna (5%) - stosunek komentarzy do polubień</div>
                </div>
              </div>
            ) : (
              <span>Sortowanie według: <span className="font-medium">{
                sortBy === 'views' ? 'Wyświetleń' :
                sortBy === 'likes' ? 'Polubień' :
                sortBy === 'comments' ? 'Komentarzy' :
                sortBy === 'shares' ? 'Udostępnień' :
                'Algorytmu'
              }</span> ({sortDirection === 'desc' ? 'malejąco' : 'rosnąco'})</span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {isLive && <span>⚡ Aktualizacje co 30 sekund</span>}
            <span>👥 {entries.length} uczestników</span>
          </div>
        </div>
      </div>
    </div>
  )
}