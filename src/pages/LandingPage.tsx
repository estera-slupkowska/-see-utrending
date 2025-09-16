import { HeroSection } from '../components/landing/HeroSection'
import { LockedLeaderboard } from '../components/leaderboard/LockedLeaderboard'
import { UpdatesSection } from '../components/landing/UpdatesSection'
import { HowItWorksSection } from '../components/landing/HowItWorksSection'
import { CosmicBackground } from '../components/ui'
import { useAuth } from '../lib/auth/context'
import { useNavigate } from 'react-router-dom'
import { Trophy, Users, BookOpen, Gift, User, Target, Zap, Star } from 'lucide-react'

export function LandingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  // Navigation cards for logged-in users
  const navigationCards = [
    {
      title: 'Konkursy',
      description: 'Przeglądaj aktywne konkursy i weź udział w najnowszych wyzwaniach',
      icon: Trophy,
      color: 'from-yellow-500 to-orange-500',
      path: '/contests',
      delay: 'delay-0'
    },
    {
      title: 'Education Hub',
      description: 'Naucz się tworzyć wirusowe treści i rozwijaj swoje umiejętności',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      path: '/education-hub',
      delay: 'delay-100'
    },
    {
      title: 'Użytkownicy',
      description: 'Poznaj innych twórców i sprawdź rankingi platformy',
      icon: Users,
      color: 'from-green-500 to-emerald-500',
      path: '/users',
      delay: 'delay-200'
    },
    {
      title: 'Nagrody',
      description: 'Sprawdź system punktów XP, odznaki i dostępne nagrody',
      icon: Gift,
      color: 'from-purple-500 to-pink-500',
      path: '/rewards',
      delay: 'delay-300'
    },
    {
      title: 'Panel użytkownika',
      description: 'Zarządzaj swoim profilem, postępami i osiągnięciami',
      icon: User,
      color: 'from-indigo-500 to-purple-500',
      path: '/dashboard',
      delay: 'delay-400'
    }
  ]

  if (user) {
    // Logged-in user view - Panel główny
    return (
      <div className="cosmic-background min-h-screen relative overflow-hidden">
        {/* Cosmic Background with Stars and Planets */}
        <CosmicBackground />
        
        {/* Enhanced background gradient overlay */}
        <div className="absolute inset-0 gradient-overlay-rising opacity-25 z-10"></div>
        
        <div className="relative z-20 py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold gradient-text animate-pulse-glow mb-6">
                Panel główny
              </h1>
              <p className="text-xl sm:text-2xl text-text-secondary mb-4">
                Twój centralny hub dla wszystkich funkcji SeeUTrending
              </p>
              <div className="w-32 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full"></div>
            </div>

            {/* Navigation Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {navigationCards.map((card, index) => {
                const IconComponent = card.icon
                return (
                  <div
                    key={card.title}
                    onClick={() => navigate(card.path)}
                    className={`group cursor-pointer card-clean hover:scale-105 transition-all duration-500 hover:shadow-2xl animate-slide-in-up ${card.delay}`}
                  >
                    <div className="relative overflow-hidden">
                      {/* Icon with gradient background */}
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-10 h-10 text-white drop-shadow-lg" />
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-display font-bold text-text-primary mb-4 group-hover:text-primary transition-colors">
                        {card.title}
                      </h3>

                      {/* Description */}
                      <p className="text-text-secondary mb-6 leading-relaxed">
                        {card.description}
                      </p>

                      {/* Action indicator */}
                      <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center gap-2 text-primary font-semibold">
                          <span>Przejdź</span>
                          <Target className="w-4 h-4 group-hover:animate-bounce" />
                        </div>
                      </div>

                      {/* Hover glow effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl`}></div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
              <div className="text-center p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-border hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-text-primary mb-2">Twój poziom</h4>
                <p className="text-text-secondary">Sprawdź swój postęp w panelu użytkownika</p>
              </div>

              <div className="text-center p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-border hover:border-success-green/30 transition-colors">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-success-green/20 rounded-full flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-success-green" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-text-primary mb-2">Aktywne konkursy</h4>
                <p className="text-text-secondary">Znajdź nowe wyzwania do podjęcia</p>
              </div>

              <div className="text-center p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-border hover:border-accent/30 transition-colors">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-text-primary mb-2">Społeczność</h4>
                <p className="text-text-secondary">Poznaj innych twórców i ranking</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Non-logged-in user view - Original landing page
  return (
    <div className="cosmic-background min-h-screen relative overflow-hidden">
      {/* Cosmic Background with Stars and Planets */}
      <CosmicBackground />
      
      {/* Enhanced background gradient overlay */}
      <div className="absolute inset-0 gradient-overlay-rising opacity-25 z-10"></div>
      
      <div className="relative z-20">
        <HeroSection />
        <LockedLeaderboard />
        <UpdatesSection />
        <HowItWorksSection />
      </div>
    </div>
  )
}