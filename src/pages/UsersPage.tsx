import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Users,
  Trophy,
  Star,
  Zap,
  Medal,
  Eye,
  Crown,
  Target,
  Flame,
  ArrowLeft
} from 'lucide-react'
import { Button, Badge } from '../components/ui'
import { ProfileService } from '../lib/supabase/profiles'
import type { UserProfile } from '../types/profiles'

interface UserDisplayData {
  id: string
  name: string
  email: string
  handle: string
  avatar?: string
  xp: number
  monthlyXp: number
  level: number
  rank: number
  badges: string[]
  contestsParticipated: number
  totalViews: number
  totalLikes: number
  role: 'creator' | 'brand' | 'spectator'
  bio?: string
  interests?: string[]
  location?: string
  tiktokFollowers?: number
  joinedDate?: string
}

// Convert Supabase profile to display format
const profileToDisplayData = (profile: UserProfile, rank: number): UserDisplayData => {
  // Generate mock data for fields not yet in database
  const mockBadges = ['early-adopter']
  if (profile.xp_points > 1000) mockBadges.push('hot-start')
  if (profile.level >= 5) mockBadges.push('viral-starter')
  if (profile.monthly_xp > 500) mockBadges.push('streak-14')

  return {
    id: profile.id,
    name: profile.name || 'Anonim',
    email: profile.email,
    handle: profile.tiktok_handle || `@${profile.name?.toLowerCase().replace(' ', '_')}` || '@user',
    avatar: profile.avatar_url,
    xp: profile.xp_points,
    monthlyXp: profile.monthly_xp || 0,
    level: profile.level,
    rank,
    badges: mockBadges,
    contestsParticipated: Math.floor(profile.xp_points / 100), // Mock calculation
    totalViews: profile.xp_points * 10, // Mock calculation
    totalLikes: Math.floor(profile.xp_points * 0.8), // Mock calculation
    role: profile.role,
    bio: profile.bio,
    interests: profile.interests || [],
    location: profile.location,
    tiktokFollowers: profile.tiktok_metrics?.followers || profile.total_followers,
    joinedDate: profile.created_at
  }
}

export function UsersPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserDisplayData | null>(null)
  const [rankingPeriod, setRankingPeriod] = useState<'all-time' | 'monthly'>('all-time')
  const [users, setUsers] = useState<UserDisplayData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load users from Supabase
  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true)
      setError(null)

      try {
        const { data: profiles, error } = rankingPeriod === 'monthly'
          ? await ProfileService.getProfilesByMonthlyXP()
          : await ProfileService.getAllProfiles()

        if (error) {
          console.error('Error loading profiles:', error)
          setError('Nie udało się załadować użytkowników')
          return
        }

        if (profiles) {
          // Convert profiles to display format with ranks
          const displayUsers = profiles.map((profile, index) =>
            profileToDisplayData(profile, index + 1)
          )
          setUsers(displayUsers)
        }
      } catch (err) {
        console.error('Error loading users:', err)
        setError('Wystąpił błąd podczas ładowania danych')
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [rankingPeriod])

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.location && user.location.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Users are already sorted by the database query
  const rankedUsers = filteredUsers

  const getBadgeIcon = (badgeId: string) => {
    switch (badgeId) {
      case 'early-adopter': return Crown
      case 'hot-start': return Flame
      case 'viral-starter': case 'viral-king': return Trophy
      case 'community-favorite': return Star
      case 'streak-7': case 'streak-14': case 'streak-21': case 'streak-30': return Target
      case 'engagement-master': return Zap
      case 'fourth-place': return Medal
      default: return Star
    }
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-400'
    if (rank <= 3) return 'text-gray-400'
    if (rank <= 10) return 'text-orange-400'
    return 'text-text-secondary'
  }

  return (
    <div className="min-h-screen bg-background py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:translate-x-[-2px] transition-transform" />
          <span className="font-medium">Wróć</span>
        </button>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text animate-pulse-glow mb-4">
            Społeczność SeeUTrending
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Poznaj innych twórców, sprawdź rankingi i odkryj najlepsze talenty na platformie
          </p>
        </div>

        {/* Search Bar and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Wyszukaj użytkowników..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary placeholder-text-muted"
            />
          </div>

          {/* Ranking Period Filter */}
          <div className="flex justify-center">
            <div className="flex bg-surface border border-border rounded-lg p-1">
              <button
                onClick={() => setRankingPeriod('all-time')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  rankingPeriod === 'all-time'
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-light'
                }`}
              >
                Cały czas
              </button>
              <button
                onClick={() => setRankingPeriod('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  rankingPeriod === 'monthly'
                    ? 'bg-primary text-white shadow-lg scale-105'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-light'
                }`}
              >
                Ten miesiąc
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center space-x-3">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-text-secondary">Ładowanie użytkowników...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-red-400 font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-3 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
              >
                Spróbuj ponownie
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Ranking Leaderboard */}
            <div className="lg:col-span-1">
              <div className="card-clean">
                <div className="flex items-center space-x-3 mb-6">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                  <h2 className="text-2xl font-display font-bold text-text-primary">
                    {rankingPeriod === 'monthly' ? 'Ranking XP - Ten miesiąc' : 'Ranking XP - Cały czas'}
                  </h2>
                </div>

                <div className="space-y-3">
                  {rankedUsers.slice(0, 10).map((user, index) => (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-surface-light transition-colors cursor-pointer group"
                    >
                      <div className={`text-lg font-bold ${getRankColor(index + 1)} min-w-[2rem]`}>
                        #{index + 1}
                      </div>
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text-primary truncate group-hover:text-primary transition-colors">
                          {user.name}
                        </p>
                        <p className="text-sm text-text-muted">{user.handle}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-xp-gold">
                          {rankingPeriod === 'monthly'
                            ? `+${user.monthlyXp.toLocaleString()} XP`
                            : `${user.xp.toLocaleString()} XP`
                          }
                        </p>
                        <p className="text-xs text-text-muted">
                          {rankingPeriod === 'monthly' ? 'W tym miesiącu' : `Poziom ${user.level}`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* User Grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rankedUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className="card-clean cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-lg group"
                  >
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">
                          {user.name}
                        </h3>
                        <p className="text-text-muted">{user.handle}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" size="sm">
                            #{user.rank}
                          </Badge>
                          <Badge variant="primary" size="sm">
                            Poziom {user.level}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary">
                          {rankingPeriod === 'monthly' ? 'XP (miesiąc):' : 'XP:'}
                        </span>
                        <span className="font-semibold text-xp-gold animate-pulse-glow">
                          {rankingPeriod === 'monthly'
                            ? `+${user.monthlyXp.toLocaleString()}`
                            : user.xp.toLocaleString()
                          }
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary">Konkursy:</span>
                        <span className="font-semibold text-text-primary">{user.contestsParticipated}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-text-secondary">Wyświetlenia:</span>
                        <span className="font-semibold text-text-primary">{user.totalViews.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">Odznaki:</span>
                        <div className="flex items-center space-x-1">
                          {user.badges.slice(0, 3).map((badgeId, index) => {
                            const IconComponent = getBadgeIcon(badgeId)
                            return (
                              <IconComponent
                                key={index}
                                className="w-4 h-4 text-primary"
                              />
                            )
                          })}
                          {user.badges.length > 3 && (
                            <span className="text-xs text-text-muted">+{user.badges.length - 3}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {rankedUsers.length === 0 && (
                <div className="text-center py-12 lg:col-span-2">
                  <Users className="w-16 h-16 text-text-muted mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    Brak użytkowników
                  </h3>
                  <p className="text-text-secondary">
                    {searchQuery
                      ? 'Nie znaleziono użytkowników pasujących do wyszukiwania.'
                      : 'Nie ma jeszcze żadnych użytkowników na platformie.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* User Profile Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-surface border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center animate-pulse-glow">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold gradient-text">{selectedUser.name}</h2>
                      <p className="text-lg text-text-secondary">{selectedUser.handle}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary">
                          #{selectedUser.rank} w rankingu
                        </Badge>
                        <Badge variant="primary">
                          Poziom {selectedUser.level}
                        </Badge>
                      </div>
                      {selectedUser.location && (
                        <p className="text-sm text-text-muted mt-1">📍 {selectedUser.location}</p>
                      )}
                      {selectedUser.joinedDate && (
                        <p className="text-xs text-text-muted">
                          Dołączył: {new Date(selectedUser.joinedDate).toLocaleDateString('pl-PL')}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-2 hover:bg-surface-light rounded-lg transition-all duration-300 text-text-muted hover:text-white hover:scale-110"
                  >
                    ✕
                  </button>
                </div>

                {/* Bio Section */}
                {selectedUser.bio && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-purple-600/5 border border-primary/20 rounded-lg">
                    <h3 className="text-lg font-semibold text-primary mb-2">O mnie</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{selectedUser.bio}</p>
                  </div>
                )}

                {/* TikTok Info */}
                {selectedUser.tiktokFollowers && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-pink-500/10 to-purple-600/10 border border-pink-500/20 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <svg className="w-6 h-6 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                      <h3 className="text-lg font-semibold text-pink-500">TikTok</h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-secondary">Obserwujący:</span>
                      <span className="text-2xl font-bold text-pink-500 animate-pulse-glow">
                        {selectedUser.tiktokFollowers.toLocaleString('pl-PL')}
                      </span>
                    </div>
                  </div>
                )}

                {/* Interests */}
                {selectedUser.interests && selectedUser.interests.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-primary mb-3">Zainteresowania</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedUser.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium hover:bg-primary/30 transition-all duration-300 hover:scale-105"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 rounded-lg hover:scale-105 transition-transform duration-300">
                    <div className="text-2xl font-bold text-xp-gold animate-pulse-glow">{selectedUser.xp.toLocaleString()}</div>
                    <div className="text-sm text-text-secondary">Punkty XP</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg hover:scale-105 transition-transform duration-300">
                    <div className="text-2xl font-bold text-blue-400">{selectedUser.contestsParticipated}</div>
                    <div className="text-sm text-text-secondary">Konkursy</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg hover:scale-105 transition-transform duration-300">
                    <div className="text-2xl font-bold text-green-400">{selectedUser.totalViews.toLocaleString()}</div>
                    <div className="text-sm text-text-secondary">Wyświetlenia</div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-lg hover:scale-105 transition-transform duration-300 md:col-span-3">
                    <div className="text-2xl font-bold text-pink-400">{selectedUser.totalLikes.toLocaleString()}</div>
                    <div className="text-sm text-text-secondary">Polubienia</div>
                  </div>
                </div>

                {/* Badges */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Zdobyte odznaki:</h3>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {selectedUser.badges.map((badgeId, index) => {
                      const IconComponent = getBadgeIcon(badgeId)
                      return (
                        <div
                          key={index}
                          className="flex flex-col items-center p-3 bg-surface-light rounded-lg"
                        >
                          <IconComponent className="w-8 h-8 text-primary mb-2" />
                          <span className="text-xs text-text-secondary text-center capitalize">
                            {badgeId.replace('-', ' ')}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Close Button */}
                <div className="pt-4 border-t border-border">
                  <Button
                    onClick={() => setSelectedUser(null)}
                    variant="primary"
                    className="w-full"
                  >
                    Zamknij profil
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}