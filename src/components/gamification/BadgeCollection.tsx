import { useState } from 'react'
import { Badge } from '../ui'
import { 
  Trophy, 
  Star, 
  Crown, 
  Flame, 
  Zap, 
  Target, 
  Heart, 
  Users, 
  Calendar,
  Award,
  Shield,
  Sparkles,
  Lock,
  TrendingUp,
  Rocket,
  Gem,
  PartyPopper
} from 'lucide-react'

interface UserBadge {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  category: 'achievement' | 'milestone' | 'special' | 'competition'
  unlocked: boolean
  unlockedAt?: string
  xp: number
  requirement?: string
  color?: string
  progress?: {
    current: number
    total: number
  }
}

interface BadgeCollectionProps {
  userBadges?: UserBadge[]
}

export function BadgeCollection({ userBadges, dashboardMode = false }: BadgeCollectionProps & { dashboardMode?: boolean }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedBadge, setSelectedBadge] = useState<UserBadge | null>(null)

  // Badges from rewards page integrated with XP system
  const mockBadges: UserBadge[] = [
    {
      id: 'early-adopter',
      name: 'Pionier Platformy',
      description: 'Jeden z pierwszych twórców na SeeUTrending!',
      icon: Crown,
      rarity: 'legendary',
      category: 'special',
      unlocked: true,
      unlockedAt: '2024-09-10T09:15:00Z',
      xp: 100,
      requirement: 'Pierwsze 1000 kont na platformie',
      color: 'from-purple-600 to-pink-600'
    },
    {
      id: 'hot-start',
      name: 'Gorący Start',
      description: 'Osiągnij 1K wyświetleń w swoim pierwszym filmie',
      icon: Flame,
      rarity: 'common',
      category: 'achievement',
      unlocked: true,
      unlockedAt: '2024-09-14T10:00:00Z',
      xp: 20,
      requirement: '1K wyświetleń',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'viral-starter',
      name: 'Viral Starter',
      description: 'Osiągnij 10K wyświetleń w jednym filmie',
      icon: Rocket,
      rarity: 'rare',
      category: 'milestone',
      unlocked: false,
      xp: 100,
      requirement: '10K wyświetleń',
      color: 'from-purple-500 to-pink-500',
      progress: { current: 8430, total: 10000 }
    },
    {
      id: 'viral-king',
      name: 'Król Virali',
      description: 'Wygraj konkurs - 1. miejsce',
      icon: Crown,
      rarity: 'legendary',
      category: 'competition',
      unlocked: false,
      xp: 10000,
      requirement: '1. miejsce w konkursie',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'silver-warrior',
      name: 'Srebrny Wojownik',
      description: 'Zajmij 2. miejsce w konkursie',
      icon: Award,
      rarity: 'legendary',
      category: 'competition',
      unlocked: false,
      xp: 8000,
      requirement: '2. miejsce w konkursie',
      color: 'from-gray-400 to-gray-600'
    },
    {
      id: 'bronze-warrior',
      name: 'Brązowy Wojownik',
      description: 'Zajmij 3. miejsce w konkursie',
      icon: Target,
      rarity: 'legendary',
      category: 'competition',
      unlocked: false,
      xp: 6000,
      requirement: '3. miejsce w konkursie',
      color: 'from-orange-600 to-yellow-600'
    },
    {
      id: 'community-favorite',
      name: 'Ulubieniec Społeczności',
      description: 'Zdobądź najwięcej polubień w konkursie',
      icon: Heart,
      rarity: 'rare',
      category: 'milestone',
      unlocked: false,
      xp: 5000,
      requirement: 'Najwięcej polubień',
      color: 'from-pink-500 to-rose-500',
      progress: { current: 347, total: 1000 }
    },
    {
      id: 'fourth-place',
      name: '4. Miejsce',
      description: 'Zajmij 4. miejsce w konkursie',
      icon: Star,
      rarity: 'epic',
      category: 'competition',
      unlocked: false,
      xp: 5000,
      requirement: '4. miejsce w konkursie',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'fifth-place',
      name: '5. Miejsce',
      description: 'Zajmij 5. miejsce w konkursie',
      icon: TrendingUp,
      rarity: 'epic',
      category: 'competition',
      unlocked: false,
      xp: 5000,
      requirement: '5. miejsce w konkursie',
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'most-comments',
      name: 'Mistrz Komentarzy',
      description: 'Zdobądź najwięcej komentarzy w konkursie',
      icon: Sparkles,
      rarity: 'rare',
      category: 'milestone',
      unlocked: false,
      xp: 4000,
      requirement: 'Najwięcej komentarzy',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      id: 'streak-7',
      name: 'Seria 7 dni',
      description: 'Bądź aktywny przez 7 dni z rzędu',
      icon: Calendar,
      rarity: 'common',
      category: 'achievement',
      unlocked: true,
      unlockedAt: '2024-09-12T18:30:00Z',
      xp: 50,
      requirement: '7 dni aktywności',
      color: 'from-green-400 to-blue-500'
    },
    {
      id: 'engagement-master',
      name: 'Mistrz Zaangażowania',
      description: 'Osiągnij 15% engagement rate',
      icon: Zap,
      rarity: 'rare',
      category: 'milestone',
      unlocked: false,
      xp: 3000,
      requirement: '15% engagement rate',
      color: 'from-yellow-400 to-orange-500',
      progress: { current: 8.5, total: 15 }
    }
  ]

  const badges = userBadges || mockBadges

  // Add count data for earned badges (simulated)
  const earnedBadgesWithCounts = [
    { ...badges.find(b => b.id === 'early-adopter')!, count: 1, earnedAt: '2024-09-10' },
    { ...badges.find(b => b.id === 'hot-start')!, count: 3, earnedAt: '2024-09-14' },
    { ...badges.find(b => b.id === 'streak-7')!, count: 2, earnedAt: '2024-09-18' }
  ].filter(Boolean)

  // For dashboard mode, show only earned badges
  if (dashboardMode) {
    return (
      <div className="bg-gradient-to-br from-indigo-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-8 shadow-xl shadow-indigo-500/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl">
              <Star className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Twoje Odznaki
            </h2>
          </div>
          <Badge className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1">
            {earnedBadgesWithCounts.length} zdobyte
          </Badge>
        </div>

        {/* Earned Badges Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {earnedBadgesWithCounts.map((badge) => {
            const IconComponent = badge.icon as React.ComponentType<any>
            return (
              <div
                key={badge.id}
                className="group bg-gradient-to-br from-white/5 to-white/10 border border-white/20 rounded-xl p-4 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`relative w-16 h-16 rounded-xl bg-gradient-to-br ${badge.color} p-4 shadow-lg group-hover:rotate-6 transition-all duration-300`}>
                    <IconComponent className="w-full h-full text-white" />
                    {badge.count > 1 && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg animate-pulse">
                        {badge.count}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm group-hover:text-purple-200 transition-colors">
                      {badge.name}
                    </h3>
                    <p className="text-gray-400 text-xs mt-1">
                      +{badge.xp} XP {badge.count > 1 ? `(x${badge.count})` : ''}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Discover More Badges Button */}
        <div className="text-center">
          <button
            onClick={() => window.location.href = '/rewards#badges'}
            className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="relative flex items-center gap-3">
              <Sparkles className="w-5 h-5 animate-spin" style={{animationDuration: '3s'}} />
              <span>Odkryj odznaki, które możesz zdobyć</span>
              <Award className="w-5 h-5 group-hover:animate-bounce" />
            </div>
          </button>
        </div>
      </div>
    )
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 border-gray-400/30 bg-gray-400/10'
      case 'rare': return 'text-blue-400 border-blue-400/30 bg-blue-400/10'
      case 'epic': return 'text-purple-400 border-purple-400/30 bg-purple-400/10'
      case 'legendary': return 'text-xp-gold border-xp-gold/30 bg-xp-gold/10'
      default: return 'text-gray-400 border-gray-400/30 bg-gray-400/10'
    }
  }

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'Zwykła'
      case 'rare': return 'Rzadka'
      case 'epic': return 'Epicka'
      case 'legendary': return 'Legendarna'
      default: return 'Nieznana'
    }
  }

  const categories = [
    { id: 'all', name: 'Wszystkie', count: badges.length },
    { id: 'achievement', name: 'Osiągnięcia', count: badges.filter(b => b.category === 'achievement').length },
    { id: 'milestone', name: 'Kamienie milowe', count: badges.filter(b => b.category === 'milestone').length },
    { id: 'competition', name: 'Konkursy', count: badges.filter(b => b.category === 'competition').length },
    { id: 'special', name: 'Specjalne', count: badges.filter(b => b.category === 'special').length }
  ]

  const filteredBadges = selectedCategory === 'all' 
    ? badges 
    : badges.filter(badge => badge.category === selectedCategory)

  const unlockedCount = badges.filter(badge => badge.unlocked).length
  const totalBadges = badges.length

  return (
    <div className="card-clean">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-semibold text-text-primary">
            Kolekcja odznak
          </h3>
          <p className="text-sm text-text-secondary">
            {unlockedCount} z {totalBadges} odznak odblokowanych ({Math.round((unlockedCount/totalBadges) * 100)}%)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <Badge variant="primary">
            {unlockedCount}/{totalBadges}
          </Badge>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-surface rounded-full h-2">
          <div
            className="h-full bg-gradient-to-r from-primary to-purple-400 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${(unlockedCount/totalBadges) * 100}%` }}
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-3 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
              selectedCategory === category.id
                ? 'bg-primary text-white'
                : 'bg-surface text-text-secondary hover:bg-surface-light hover:text-text-primary'
            }`}
          >
            <span>{category.name}</span>
            <Badge variant="secondary" size="sm">
              {category.count}
            </Badge>
          </button>
        ))}
      </div>

      {/* Badges Grid - Icon-based Design */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6">
        {filteredBadges.map(badge => (
          <div
            key={badge.id}
            className="relative group"
          >
            {/* Badge Icon Container */}
            <div className="relative">
              <div
                className={`relative w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center transition-all duration-500 cursor-pointer ${
                  badge.unlocked
                    ? `${getRarityColor(badge.rarity)} hover:scale-110 hover:rotate-6`
                    : 'bg-surface border-2 border-border opacity-40 hover:opacity-60'
                }`}
                onClick={() => setSelectedBadge(badge)}
              >
                {/* Glow Effect for Unlocked Badges */}
                {badge.unlocked && (
                  <>
                    <div className={`absolute inset-0 rounded-full blur-xl opacity-30 ${getRarityColor(badge.rarity)}`}></div>
                    {badge.rarity === 'legendary' && (
                      <div className="absolute inset-0 rounded-full bg-yellow-400/30 blur-lg animate-pulse"></div>
                    )}
                    {badge.rarity === 'epic' && (
                      <div className="absolute inset-0 rounded-full bg-purple-400/30 blur-lg animate-pulse"></div>
                    )}
                  </>
                )}
                
                {/* Icon */}
                <div className="relative z-10">
                  {badge.unlocked ? (
                    <badge.icon className="w-8 h-8 text-white drop-shadow-lg" />
                  ) : (
                    <Lock className="w-8 h-8 text-text-muted" />
                  )}
                </div>

                {/* Count Badge for Multiple Wins */}
                {badge.unlocked && badge.count && badge.count > 1 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-success-green rounded-full border-2 border-background flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{badge.count}</span>
                  </div>
                )}
              </div>

              {/* Badge Name */}
              <div className="text-center">
                <h4 className={`text-sm font-semibold mb-1 transition-colors ${
                  badge.unlocked ? 'text-text-primary' : 'text-text-muted'
                }`}>
                  {badge.name}
                </h4>
                
                {/* XP Value */}
                <div className="flex items-center justify-center gap-1 mb-2">
                  <Zap className="w-3 h-3 text-xp-gold" />
                  <span className="text-xs font-semibold text-xp-gold">
                    +{badge.xp.toLocaleString('pl-PL')}
                  </span>
                </div>

                {/* Details Button */}
                <button
                  onClick={() => setSelectedBadge(badge)}
                  className="text-xs text-primary hover:text-primary/80 transition-colors underline"
                >
                  Szczegóły
                </button>
              </div>

              {/* Progress Bar for Locked Badges */}
              {!badge.unlocked && badge.progress && (
                <div className="mt-2">
                  <div className="w-full bg-surface rounded-full h-1">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((badge.progress.current / badge.progress.total) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-center text-text-muted mt-1">
                    {Math.round((badge.progress.current / badge.progress.total) * 100)}%
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredBadges.length === 0 && (
        <div className="text-center py-8">
          <Shield className="w-12 h-12 text-text-muted mx-auto mb-4" />
          <h4 className="font-semibold text-text-primary mb-2">Brak odznak w tej kategorii</h4>
          <p className="text-text-secondary">
            Zacznij brać udział w konkursach, aby zdobyć swoje pierwsze odznaki!
          </p>
        </div>
      )}

      {/* Achievement Tips */}
      <div className="mt-6 pt-4 border-t border-border">
        <h4 className="text-sm font-semibold text-text-primary mb-2">
          💡 Wskazówki do zdobywania odznak:
        </h4>
        <div className="text-xs text-text-secondary space-y-1">
          <p>• Bierz regularnie udział w konkursach, aby odblokować odznaki za osiągnięcia</p>
          <p>• Twórz angażujące treści, aby zdobyć odznaki za kamienie milowe</p>
          <p>• Bądź aktywny codziennie, aby utrzymać serie i zdobyć specjalne bonusy</p>
          <p>• Niektóre odznaki są czasowo ograniczone - nie przegap okazji!</p>
        </div>
      </div>

      {/* Badge Details Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    selectedBadge.unlocked 
                      ? getRarityColor(selectedBadge.rarity)
                      : 'bg-surface border-2 border-border opacity-40'
                  }`}>
                    {selectedBadge.unlocked ? (
                      <div className="text-white text-2xl">
                        {selectedBadge.icon}
                      </div>
                    ) : (
                      <Lock className="w-8 h-8 text-text-muted" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-text-primary">{selectedBadge.name}</h2>
                    <p className="text-sm text-text-secondary">{getRarityLabel(selectedBadge.rarity)}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="p-2 hover:bg-surface-light rounded-lg transition-colors text-text-muted hover:text-text-primary"
                >
                  ✕
                </button>
              </div>

              {/* Badge Description */}
              <div className="mb-6">
                <p className="text-text-secondary mb-4">{selectedBadge.description}</p>
                
                {/* XP Value */}
                <div className="flex items-center justify-between mb-4 p-3 bg-surface-light rounded-lg">
                  <span className="text-text-secondary">Wartość XP:</span>
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-xp-gold" />
                    <span className="font-semibold text-xp-gold">+{selectedBadge.xp.toLocaleString('pl-PL')}</span>
                  </div>
                </div>

                {/* Requirement */}
                {selectedBadge.requirement && (
                  <div className="flex items-center justify-between mb-4 p-3 bg-surface-light rounded-lg">
                    <span className="text-text-secondary">Wymaganie:</span>
                    <span className="text-text-primary font-medium">{selectedBadge.requirement}</span>
                  </div>
                )}

                {/* Unlock Status */}
                {selectedBadge.unlocked ? (
                  <div className="p-3 bg-success-green/10 border border-success-green/30 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-success-green rounded-full"></div>
                      <span className="text-success-green font-semibold">Odznaka odblokowana!</span>
                    </div>
                    {selectedBadge.unlockedAt && (
                      <p className="text-xs text-text-muted">
                        Zdobyta: {new Date(selectedBadge.unlockedAt).toLocaleDateString('pl-PL', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-3 bg-surface-light border border-border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="w-4 h-4 text-text-muted" />
                      <span className="text-text-muted font-semibold">Odznaka zablokowana</span>
                    </div>
                    {selectedBadge.progress && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-text-muted mb-1">
                          <span>Postęp</span>
                          <span>{Math.round((selectedBadge.progress.current / selectedBadge.progress.total) * 100)}%</span>
                        </div>
                        <div className="w-full bg-surface rounded-full h-2">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((selectedBadge.progress.current / selectedBadge.progress.total) * 100, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-text-muted mt-1">
                          {selectedBadge.progress.current.toLocaleString('pl-PL')} / {selectedBadge.progress.total.toLocaleString('pl-PL')}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Close Button */}
              <div className="pt-4 border-t border-border">
                <button
                  onClick={() => setSelectedBadge(null)}
                  className="w-full py-3 px-4 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors font-medium"
                >
                  Zamknij
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}