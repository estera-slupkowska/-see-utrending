import { useState } from 'react'
import { useAuth } from '../lib/auth/context'
import { usePermissions } from '../lib/auth/hooks'
import { useTranslation } from 'react-i18next'
import { Button, Badge } from '../components/ui'
import { TikTokConnectionStatus } from '../components/dashboard/TikTokConnectionStatus'
import { XPProgressBar } from '../components/gamification/XPProgressBar'
import { BadgeCollection } from '../components/gamification/BadgeCollection'
import { UserProfileEdit } from '../components/profile/UserProfileEdit'
import { User, Trophy, Star, Target, Edit3, Settings, BarChart3, Zap, Award } from 'lucide-react'

export function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { isCreator, isBrand, isSpectator, isAdmin } = usePermissions()
  const [showProfileEdit, setShowProfileEdit] = useState(false)


  const getUserRole = () => {
    if (isCreator()) return 'creator'
    if (isBrand()) return 'brand'
    if (isSpectator()) return 'spectator'
    return 'user'
  }

  const userRole = getUserRole()
  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Testowy Użytkownik'
  
  // Mock user stats for sandbox - including earned XP from unlocked badges
  const userStats = {
    xp: 570, // Base XP (400) + early-adopter (100) + hot-start (20) + streak-7 (50) = 570
    level: 4, // Increased level due to higher XP
    contestsParticipated: 2,
    totalViews: 25340,
    totalLikes: 1890,
    engagementRate: 7.5,
    ranking: 127,
    earnedXPFromBadges: 170 // XP from unlocked badges: early-adopter (100) + hot-start (20) + streak-7 (50)
  }

  return (
    <div className="min-h-screen bg-background main-content-area">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Profile Edit Modal */}
        {showProfileEdit && (
          <UserProfileEdit 
            onClose={() => setShowProfileEdit(false)}
            onSave={(profileData) => {
              console.log('Profile saved:', profileData)
              setShowProfileEdit(false)
            }}
          />
        )}
        {/* Welcome Section with Animation */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-display font-bold gradient-text animate-pulse-glow">
                Witaj, {userName}! 
                <span className="inline-block animate-bounce ml-2">👋</span>
              </h1>
              <p className="text-text-secondary">
                {t(`auth.roles.${userRole}.description`)}
              </p>
              <div className="flex items-center gap-2 text-sm text-text-muted">
                <Zap className="w-4 h-4 text-xp-gold animate-pulse" />
                <span>Poziom {userStats.level} • {userStats.xp.toLocaleString('pl-PL')} XP</span>
                <span className="w-1 h-1 bg-text-muted rounded-full"></span>
                <span>#{userStats.ranking} w rankingu</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge 
                variant={userRole === 'creator' ? 'primary' : userRole === 'brand' ? 'success' : 'default'}
                className="capitalize animate-pulse"
              >
                {t(`auth.roles.${userRole}.title`)}
              </Badge>
              <button
                onClick={() => setShowProfileEdit(true)}
                className="p-2 hover:bg-surface-light rounded-lg transition-all duration-300 hover:scale-110 group"
                title="Edytuj profil"
              >
                <Edit3 className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card-clean">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm font-medium">Konkursy</p>
                <p className="text-2xl font-bold text-text-primary">{userStats.contestsParticipated}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Target className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="card-clean">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm font-medium">Łączne wyświetlenia</p>
                <p className="text-2xl font-bold text-text-primary">{userStats.totalViews.toLocaleString('pl-PL')}</p>
              </div>
              <div className="p-3 bg-success-green/10 rounded-lg">
                <svg className="h-6 w-6 text-success-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="card-clean">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm font-medium">Pozycja w rankingu</p>
                <p className="text-2xl font-bold text-text-primary">#{userStats.ranking}</p>
              </div>
              <div className="p-3 bg-xp-gold/10 rounded-lg">
                <Trophy className="h-6 w-6 text-xp-gold" />
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
              <Button variant="primary" onClick={() => window.location.href = '/contests'}>
                Przeglądaj konkursy
              </Button>
              <Button variant="secondary" onClick={() => setShowProfileEdit(true)}>
                Zarządzaj profilem
              </Button>
            </div>
          </div>
        )}

        {/* Admin Access - Only for Admin Users */}
        {user && isAdmin() && (
          <div className="card-clean mb-6 border-2 border-yellow-400/30 bg-yellow-400/5">
            <h2 className="text-2xl font-display font-bold text-yellow-400 mb-4">
              🚀 Panel Administracyjny
            </h2>
            <p className="text-text-secondary mb-6">
              Dostęp do panelu administracyjnego z nową strukturą zespołu.
            </p>
            <div className="flex gap-4">
              <Button 
                variant="gaming" 
                onClick={() => window.location.href = '/admin'}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
              >
                Otwórz Panel Admin
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => window.location.href = '/admin/team'}
                className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/10"
              >
                Struktura Zespołu
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

        {/* Fallback for users without specific roles or not logged in */}
        {!isCreator() && !isBrand() && !isSpectator() && (
          <div className="card-clean mb-6">
            <h2 className="text-2xl font-display font-bold text-text-primary mb-4">
              Panel Użytkownika
            </h2>
            <p className="text-text-secondary mb-6">
              Witaj w SeeUTrending! Zaloguj się, aby uzyskać pełen dostęp do wszystkich funkcji platformy.
            </p>
            <div className="flex gap-4">
              <Button variant="primary" onClick={() => window.location.href = '/auth/login'}>
                Zaloguj się
              </Button>
              <Button variant="secondary" onClick={() => window.location.href = '/auth/register'}>
                Zarejestruj się
              </Button>
            </div>
          </div>
        )}

        {/* TikTok Integration */}
        <TikTokConnectionStatus />

        {/* XP Progress */}
        <XPProgressBar 
          currentXP={userStats.xp} 
          currentLevel={userStats.level}
        />

        {/* Badge Collection */}
        <div data-section="badges">
          <BadgeCollection />
        </div>

        {/* Quick Actions with Functionality */}
        <div className="card-clean animate-slide-in-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-semibold text-text-primary">
              Szybkie działania
            </h3>
            <div className="flex items-center gap-1 text-xs text-text-muted">
              <div className="w-2 h-2 bg-success-green rounded-full animate-pulse"></div>
              <span>Wszystkie funkcje aktywne</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={() => setShowProfileEdit(true)}
              className="group p-4 text-left hover:bg-surface-light rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-primary/20 active:scale-95"
            >
              <User className="h-6 w-6 text-primary mb-2 group-hover:animate-pulse" />
              <p className="font-medium text-text-primary group-hover:text-primary transition-colors">Edytuj profil</p>
              <p className="text-sm text-text-muted">Zaktualizuj swoje informacje</p>
              <div className="mt-2 flex items-center text-xs text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit3 className="w-3 h-3 mr-1" />
                <span>Kliknij aby edytować</span>
              </div>
            </button>
            
            <button 
              onClick={() => window.location.href = '/demo-contest#leaderboard'}
              className="group p-4 text-left hover:bg-surface-light rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-xp-gold/20 active:scale-95"
            >
              <Trophy className="h-6 w-6 text-xp-gold mb-2 group-hover:animate-bounce" />
              <p className="font-medium text-text-primary group-hover:text-xp-gold transition-colors">Ranking</p>
              <p className="text-sm text-text-muted">Zobacz swoją pozycję</p>
              <div className="mt-2 flex items-center text-xs text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                <BarChart3 className="w-3 h-3 mr-1" />
                <span>Pozycja #{userStats.ranking}</span>
              </div>
            </button>
            
            <button 
              onClick={() => {
                // Scroll to badge collection section
                const badgeSection = document.querySelector('[data-section="badges"]')
                if (badgeSection) {
                  badgeSection.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="group p-4 text-left hover:bg-surface-light rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-success-green/20 active:scale-95"
            >
              <Star className="h-6 w-6 text-success-green mb-2 group-hover:animate-spin" />
              <p className="font-medium text-text-primary group-hover:text-success-green transition-colors">Osiągnięcia</p>
              <p className="text-sm text-text-muted">Twoje odznaki i nagrody</p>
              <div className="mt-2 flex items-center text-xs text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                <Award className="w-3 h-3 mr-1" />
                <span>3 odblokowane</span>
              </div>
            </button>
            
            <button 
              onClick={() => window.location.href = '/contests'}
              className="group p-4 text-left hover:bg-surface-light rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg border-2 border-transparent hover:border-purple-400/20 active:scale-95"
            >
              <Target className="h-6 w-6 text-primary mb-2 group-hover:animate-pulse" />
              <p className="font-medium text-text-primary group-hover:text-purple-400 transition-colors">Konkursy</p>
              <p className="text-sm text-text-muted">Zobacz dostępne konkursy</p>
              <div className="mt-2 flex items-center text-xs text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">
                <Zap className="w-3 h-3 mr-1" />
                <span>Przeglądaj wszystkie</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}