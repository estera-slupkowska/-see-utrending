import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
  Flame
} from 'lucide-react'
import { Button, Badge } from '../components/ui'

interface User {
  id: string
  name: string
  email: string
  handle: string
  avatar?: string
  xp: number
  level: number
  rank: number
  badges: string[]
  contestsParticipated: number
  totalViews: number
  totalLikes: number
  role: 'creator' | 'brand' | 'spectator'
}

// Mock user data for sandbox
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Estera Słupkowska',
    email: 'estera@seeutrending.com',
    handle: '@estera_ceo',
    xp: 2500,
    level: 8,
    rank: 1,
    badges: ['early-adopter', 'viral-king', 'streak-30'],
    contestsParticipated: 12,
    totalViews: 150000,
    totalLikes: 12500,
    role: 'creator'
  },
  {
    id: '2',
    name: 'Testowy Użytkownik',
    email: 'test@example.com',
    handle: '@test_user',
    xp: 570,
    level: 4,
    rank: 127,
    badges: ['early-adopter', 'hot-start', 'streak-7'],
    contestsParticipated: 2,
    totalViews: 25340,
    totalLikes: 1890,
    role: 'creator'
  },
  {
    id: '3',
    name: 'Anna Kowalska',
    email: 'anna.k@gmail.com',
    handle: '@anna_creative',
    xp: 1850,
    level: 6,
    rank: 15,
    badges: ['viral-starter', 'community-favorite', 'streak-14'],
    contestsParticipated: 8,
    totalViews: 89000,
    totalLikes: 7200,
    role: 'creator'
  },
  {
    id: '4',
    name: 'Michał Nowak',
    email: 'michal.n@outlook.com',
    handle: '@michal_trending',
    xp: 980,
    level: 5,
    rank: 45,
    badges: ['hot-start', 'engagement-master'],
    contestsParticipated: 5,
    totalViews: 42000,
    totalLikes: 3100,
    role: 'creator'
  },
  {
    id: '5',
    name: 'Karolina Wójcik',
    email: 'karolina.w@gmail.com',
    handle: '@karo_viral',
    xp: 2100,
    level: 7,
    rank: 8,
    badges: ['viral-starter', 'streak-21', 'fourth-place'],
    contestsParticipated: 10,
    totalViews: 95000,
    totalLikes: 8900,
    role: 'creator'
  }
]

export function UsersPage() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Filter users based on search query
  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Sort users by XP for ranking
  const rankedUsers = [...filteredUsers].sort((a, b) => b.xp - a.xp)

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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text animate-pulse-glow mb-4">
            Społeczność SeeUTrending
          </h1>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Poznaj innych twórców, sprawdź rankingi i odkryj najlepsze talenty na platformie
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ranking Leaderboard */}
          <div className="lg:col-span-1">
            <div className="card-clean">
              <div className="flex items-center space-x-3 mb-6">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-display font-bold text-text-primary">
                  Ranking XP
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
                      <p className="text-sm font-semibold text-xp-gold">{user.xp.toLocaleString()} XP</p>
                      <p className="text-xs text-text-muted">Poziom {user.level}</p>
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
                      <span className="text-text-secondary">XP:</span>
                      <span className="font-semibold text-xp-gold">{user.xp.toLocaleString()}</span>
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
          </div>
        </div>

        {/* User Profile Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-surface border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                      <Users className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedUser.name}</h2>
                      <p className="text-lg text-text-secondary">{selectedUser.handle}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="secondary">
                          #{selectedUser.rank} w rankingu
                        </Badge>
                        <Badge variant="primary">
                          Poziom {selectedUser.level}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-2 hover:bg-surface-light rounded-lg transition-colors text-text-muted hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-surface-light rounded-lg">
                    <div className="text-2xl font-bold text-xp-gold">{selectedUser.xp.toLocaleString()}</div>
                    <div className="text-sm text-text-secondary">Punkty XP</div>
                  </div>
                  <div className="text-center p-4 bg-surface-light rounded-lg">
                    <div className="text-2xl font-bold text-text-primary">{selectedUser.contestsParticipated}</div>
                    <div className="text-sm text-text-secondary">Konkursy</div>
                  </div>
                  <div className="text-center p-4 bg-surface-light rounded-lg">
                    <div className="text-2xl font-bold text-text-primary">{selectedUser.totalViews.toLocaleString()}</div>
                    <div className="text-sm text-text-secondary">Wyświetlenia</div>
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