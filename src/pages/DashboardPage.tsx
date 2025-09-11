import { useAuth } from '../lib/auth/context'
import { usePermissions } from '../lib/auth/hooks'
import { useTranslation } from 'react-i18next'
import { Button, Badge } from '../components/ui'
import { User, Trophy, Star, Target } from 'lucide-react'

export function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { isCreator, isBrand, isSpectator } = usePermissions()

  const getUserRole = () => {
    if (isCreator()) return 'creator'
    if (isBrand()) return 'brand'
    if (isSpectator()) return 'spectator'
    return 'user'
  }

  const userRole = getUserRole()
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Użytkownik'

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-display font-bold gradient-text">
                Witaj, {userName}!
              </h1>
              <p className="text-text-secondary mt-2">
                {t(`auth.roles.${userRole}.description`)}
              </p>
            </div>
            <Badge 
              variant={userRole === 'creator' ? 'primary' : userRole === 'brand' ? 'success' : 'default'}
              className="capitalize"
            >
              {t(`auth.roles.${userRole}.title`)}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-clean">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm font-medium">Aktywne konkursy</p>
                <p className="text-2xl font-bold text-text-primary">0</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Target className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="card-clean">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm font-medium">Punkty XP</p>
                <p className="text-2xl font-bold text-text-primary">0</p>
              </div>
              <div className="p-3 bg-xp-gold/10 rounded-lg">
                <Star className="h-6 w-6 text-xp-gold" />
              </div>
            </div>
          </div>

          <div className="card-clean">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm font-medium">Pozycja w rankingu</p>
                <p className="text-2xl font-bold text-text-primary">-</p>
              </div>
              <div className="p-3 bg-success-green/10 rounded-lg">
                <Trophy className="h-6 w-6 text-success-green" />
              </div>
            </div>
          </div>
        </div>

        {/* Role-specific Content */}
        {isCreator() && (
          <div className="card-clean mb-6">
            <h2 className="text-2xl font-display font-bold text-text-primary mb-4">
              Panel Twórcy
            </h2>
            <p className="text-text-secondary mb-6">
              Rozpocznij swoją podróż jako twórca treści. Bierz udział w konkursach, zdobywaj punkty i buduj swoją pozycję w rankingu.
            </p>
            <div className="flex gap-4">
              <Button variant="primary">
                Przeglądaj konkursy
              </Button>
              <Button variant="secondary">
                Zarządzaj profilem
              </Button>
            </div>
          </div>
        )}

        {isBrand() && (
          <div className="card-clean mb-6">
            <h2 className="text-2xl font-display font-bold text-text-primary mb-4">
              Panel Marki
            </h2>
            <p className="text-text-secondary mb-6">
              Twórz angażujące konkursy, współpracuj z najlepszymi twórcami i buduj autentyczne połączenia z Twoją społecznością.
            </p>
            <div className="flex gap-4">
              <Button variant="gaming">
                Utwórz konkurs
              </Button>
              <Button variant="secondary">
                Zarządzaj kampaniami
              </Button>
            </div>
          </div>
        )}

        {isSpectator() && (
          <div className="card-clean mb-6">
            <h2 className="text-2xl font-display font-bold text-text-primary mb-4">
              Panel Widza
            </h2>
            <p className="text-text-secondary mb-6">
              Odkrywaj najlepsze treści, śledź ulubione konkursy i bądź częścią dynamicznej społeczności SeeUTrending.
            </p>
            <div className="flex gap-4">
              <Button variant="primary">
                Odkrywaj treści
              </Button>
              <Button variant="secondary">
                Moje ulubione
              </Button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="card-clean">
          <h3 className="text-lg font-display font-semibold text-text-primary mb-4">
            Szybkie działania
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 text-left hover:bg-surface-light rounded-lg transition-colors">
              <User className="h-6 w-6 text-primary mb-2" />
              <p className="font-medium text-text-primary">Edytuj profil</p>
              <p className="text-sm text-text-muted">Zaktualizuj swoje informacje</p>
            </button>
            
            <button className="p-4 text-left hover:bg-surface-light rounded-lg transition-colors">
              <Trophy className="h-6 w-6 text-xp-gold mb-2" />
              <p className="font-medium text-text-primary">Ranking</p>
              <p className="text-sm text-text-muted">Zobacz swoją pozycję</p>
            </button>
            
            <button className="p-4 text-left hover:bg-surface-light rounded-lg transition-colors">
              <Star className="h-6 w-6 text-success-green mb-2" />
              <p className="font-medium text-text-primary">Osiągnięcia</p>
              <p className="text-sm text-text-muted">Twoje odznaki i nagrody</p>
            </button>
            
            <button className="p-4 text-left hover:bg-surface-light rounded-lg transition-colors">
              <Target className="h-6 w-6 text-primary mb-2" />
              <p className="font-medium text-text-primary">Konkursy</p>
              <p className="text-sm text-text-muted">Aktywne wyzwania</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}