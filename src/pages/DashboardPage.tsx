import { useState } from 'react'
import { useAuth } from '../lib/auth/context'
import { usePermissions } from '../lib/auth/hooks'
import { useTranslation } from 'react-i18next'
import { Button, Badge } from '../components/ui'
import { TikTokConnectionStatus } from '../components/dashboard/TikTokConnectionStatus'
import { XPProgressBar } from '../components/gamification/XPProgressBar'
import { BadgeCollection } from '../components/gamification/BadgeCollection'
// import { UserProfileEdit } from '../components/profile/UserProfileEdit'
import { User, Trophy, Star, Target, Edit3, Settings, BarChart3, Zap, Award, Bell, Clock, Users, Megaphone, Eye } from 'lucide-react'

export function DashboardPage() {
  console.log('DashboardPage: Starting to render')

  const { t } = useTranslation()
  const { user } = useAuth()
  const { isCreator, isBrand, isSpectator, isAdmin } = usePermissions()
  const [showProfileEdit, setShowProfileEdit] = useState(false)

  console.log('DashboardPage: Hooks initialized', { user: !!user, isCreator: isCreator(), isBrand: isBrand(), isSpectator: isSpectator() })


  const getUserRole = () => {
    if (isCreator()) return 'creator'
    if (isBrand()) return 'brand'
    if (isSpectator()) return 'spectator'
    return 'spectator'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 main-content-area relative overflow-hidden">
      {/* Enhanced background with floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-2 h-2 bg-purple-400 rounded-full animate-twinkle"></div>
        <div className="absolute top-20 right-20 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-2 h-2 bg-pink-400 rounded-full animate-twinkle" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
        <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Profile Edit Modal */}
        {showProfileEdit && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-surface border border-border rounded-2xl p-6 max-w-lg w-full mx-4">
              <h3 className="text-xl font-bold text-text-primary mb-4">Edycja profilu</h3>
              <p className="text-text-secondary mb-4">Funkcja edycji profilu jest tymczasowo niedostępna.</p>
              <button
                onClick={() => setShowProfileEdit(false)}
                className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90"
              >
                Zamknij
              </button>
            </div>
          </div>
        )}
        {/* Enhanced Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <div className="bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-600/10 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 shadow-xl shadow-purple-500/10">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-3">
                <h1 className="text-5xl font-display font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-pulse-glow">
                  Witaj, {userName}!
                  <span className="inline-block animate-bounce ml-3 text-4xl">👋</span>
                </h1>
                <p className="text-gray-300 text-lg">
                  {t(`auth.roles.${userRole}.description`)}
                </p>
                <div className="flex items-center gap-4 text-base">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full border border-yellow-400/30">
                    <Zap className="w-5 h-5 text-yellow-400 animate-pulse" />
                    <span className="text-yellow-300 font-bold">Poziom {userStats.level}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full border border-purple-400/30">
                    <Star className="w-5 h-5 text-purple-400 animate-spin" style={{animationDuration: '3s'}} />
                    <span className="text-purple-300 font-bold">{userStats.xp.toLocaleString('pl-PL')} XP</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full border border-cyan-400/30">
                    <Trophy className="w-5 h-5 text-cyan-400 animate-bounce" />
                    <span className="text-cyan-300 font-bold">#{userStats.ranking}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  variant={userRole === 'creator' ? 'primary' : userRole === 'brand' ? 'success' : 'default'}
                  className="capitalize px-4 py-2 text-base bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none animate-pulse-glow"
                >
                  {t(`auth.roles.${userRole}.title`)}
                </Badge>
                <button
                  onClick={() => setShowProfileEdit(true)}
                  className="p-3 hover:bg-purple-500/20 rounded-xl transition-all duration-300 hover:scale-110 group border border-purple-400/30 hover:border-purple-400/60"
                  title="Edytuj profil"
                >
                  <Edit3 className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="group bg-gradient-to-br from-orange-500/10 to-red-500/10 backdrop-blur-sm border border-orange-400/30 rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/20 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-300 text-sm font-medium mb-2">Konkursy</p>
                <p className="text-3xl font-bold text-white group-hover:text-orange-200 transition-colors">{userStats.contestsParticipated}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-orange-500/30">
                <Target className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="mt-4 w-full bg-orange-900/30 rounded-full h-2">
              <div className="bg-gradient-to-r from-orange-400 to-red-400 h-2 rounded-full group-hover:animate-pulse" style={{width: '40%'}}></div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 backdrop-blur-sm border border-emerald-400/30 rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/20 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-300 text-sm font-medium mb-2">Łączne wyświetlenia</p>
                <p className="text-3xl font-bold text-white group-hover:text-emerald-200 transition-colors">{userStats.totalViews.toLocaleString('pl-PL')}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-emerald-500/30">
                <Eye className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="mt-4 w-full bg-emerald-900/30 rounded-full h-2">
              <div className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-2 rounded-full group-hover:animate-pulse" style={{width: '75%'}}></div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-sm border border-yellow-400/30 rounded-2xl p-6 hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/20 cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-300 text-sm font-medium mb-2">Pozycja w rankingu</p>
                <p className="text-3xl font-bold text-white group-hover:text-yellow-200 transition-colors">#{userStats.ranking}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl group-hover:rotate-12 transition-all duration-300 shadow-lg shadow-yellow-500/30">
                <Trophy className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="mt-4 w-full bg-yellow-900/30 rounded-full h-2">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full group-hover:animate-pulse" style={{width: '30%'}}></div>
            </div>
          </div>
        </div>

        {/* Team Updates Section */}
        <div className="bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 mb-8 shadow-xl shadow-blue-500/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl">
              <Bell className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-display font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Aktualizacje Zespołu
            </h2>
            <div className="ml-auto">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium animate-pulse">
                2 nowe
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Update 1 */}
            <div className="group p-4 bg-gradient-to-r from-green-500/5 to-emerald-500/5 border border-green-500/20 rounded-xl hover:scale-[1.02] transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Megaphone className="w-5 h-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-green-400">Nowa funkcja TikTok API!</h3>
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded-full text-xs font-medium">NOWE</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Integracja z TikTok API jest już dostępna! Połącz swoje konto i automatycznie śledź metryki swoich filmów w konkursach.
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>2 godziny temu</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Team Development
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Update 2 */}
            <div className="group p-4 bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-500/20 rounded-xl hover:scale-[1.02] transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Trophy className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-purple-400">System odznak został ulepszony</h3>
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium">UPDATE</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Dodaliśmy nowe odznaki i ulepszony system progresji. Sprawdź swoje osiągnięcia i odkryj nowe wyzwania!
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>1 dzień temu</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Team Gamification
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Update 3 */}
            <div className="group p-4 bg-gradient-to-r from-orange-500/5 to-yellow-500/5 border border-orange-500/20 rounded-xl hover:scale-[1.02] transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10 cursor-pointer">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-500/20 rounded-lg">
                  <Star className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-orange-400">Ranking miesięczny już dostępny</h3>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Sprawdź nowy ranking miesięczny na stronie użytkowników. Zobacz kto zdobył najwięcej XP w tym miesiącu!
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-xs text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>3 dni temu</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      Team Features
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-blue-500/20">
            <button
              onClick={() => window.location.href = '/updates'}
              className="group flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-all duration-300 hover:scale-105 font-medium"
            >
              <span>Zobacz wszystkie aktualizacje</span>
              <div className="group-hover:translate-x-1 transition-transform duration-300">→</div>
            </button>
          </div>
        </div>

        {/* Enhanced Role-specific Content */}
        {isCreator() && (
          <div className="bg-gradient-to-br from-purple-600/10 via-pink-600/10 to-indigo-600/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-8 mb-6 shadow-xl shadow-purple-500/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                <User className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-display font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Panel Twórcy
              </h2>
            </div>
            <p className="text-gray-300 mb-8 text-lg leading-relaxed">
              Rozpocznij swoją podróż jako twórca treści. Bierz udział w konkursach, zdobywaj punkty i buduj swoją pozycję w rankingu.
            </p>
            <div className="flex gap-4">
              <Button
                variant="primary"
                onClick={() => window.location.href = '/contests'}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 text-lg font-semibold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105"
              >
                <Trophy className="w-5 h-5 mr-2" />
                Przeglądaj konkursy
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowProfileEdit(true)}
                className="border-purple-400 text-purple-400 hover:bg-purple-500/20 px-6 py-3 text-lg font-semibold hover:scale-105 transition-all duration-300"
              >
                <Settings className="w-5 h-5 mr-2" />
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

        {/* Simplified Badge Collection for Dashboard */}
        <div data-section="badges">
          <BadgeCollection dashboardMode={true} />
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