import { HeroSection } from '../components/landing/HeroSection'
import { LiveLeaderboard } from '../components/leaderboard/LiveLeaderboard'
import { UpdatesSection } from '../components/landing/UpdatesSection'
import { HowItWorksSection } from '../components/landing/HowItWorksSection'
import { ExplanatoryTrailer } from '../components/trailer/ExplanatoryTrailer'
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
    // Logged-in user view - Panel główny with hero section
    return (
      <div className="cosmic-background min-h-screen relative overflow-hidden">
        {/* Cosmic Background with Stars and Planets */}
        <CosmicBackground />

        <div className="relative z-10">
          {/* Keep the beautiful hero section but replace CTA buttons */}
          <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            {/* Floating Interactive Elements */}
            <div className="absolute inset-0 pointer-events-none">
              {/* Dynamic floating icons */}
              <div className="absolute top-20 left-10 transform rotate-6 scale-105 transition-all duration-1500 ease-in-out">
                <Trophy className="w-8 h-8 text-yellow-400 animate-float-slow opacity-30" />
              </div>

              <div className="absolute top-32 right-16 transform rotate-12 scale-108 transition-all duration-1800 ease-in-out">
                <Star className="w-6 h-6 text-pink-400 animate-twinkle-slow opacity-25" />
              </div>

              <div className="absolute bottom-32 left-20 transform rotate-15 scale-110 transition-all duration-2000 ease-in-out">
                <Zap className="w-7 h-7 text-cyan-400 animate-twinkle opacity-20" />
              </div>

              <div className="absolute bottom-20 right-12 transform rotate-20 scale-112 transition-all duration-1800 ease-in-out">
                <Gift className="w-6 h-6 text-purple-400 animate-float-slow opacity-30" />
              </div>
            </div>
            
            <div className="relative max-w-4xl mx-auto text-center z-10">
              {/* Enhanced Main Title with Dynamic Effects */}
              <div className="relative mb-6">
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-display font-bold animate-pulse-glow">
                  <span className="gradient-text relative">
                    SeeUTrending
                  </span>
                </h1>
              </div>
              
              {/* Subtitle */}
              <p className="text-2xl sm:text-3xl text-text-secondary mb-4">
                Panel główny
              </p>
              
              {/* Decorative line */}
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-8 rounded-full"></div>
              
              {/* Description */}
              <p className="text-lg sm:text-xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed">
                Twój centralny hub dla wszystkich funkcji platformy
              </p>
              
              {/* Enhanced CTA Buttons - Small with descriptions */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 justify-center items-center mb-16 max-w-4xl mx-auto">
                {navigationCards.map((card, index) => {
                  const IconComponent = card.icon
                  return (
                    <div key={card.title} className="relative group">
                      <button
                        onClick={() => navigate(card.path)}
                        className={`w-full p-4 bg-gradient-to-br ${card.color} rounded-xl shadow-xl hover:scale-105 transition-all duration-300 hover:shadow-2xl group`}
                      >
                        <IconComponent className="w-6 h-6 text-white mx-auto mb-2" />
                        <div className="text-white text-sm font-semibold">{card.title}</div>
                        <div className="text-white/80 text-xs mt-1">
                          {card.title === 'Konkursy' && 'Weź udział'}
                          {card.title === 'Education Hub' && 'Naucz się'}
                          {card.title === 'Użytkownicy' && 'Ranking'}
                          {card.title === 'Nagrody' && 'XP i odznaki'}
                          {card.title === 'Panel użytkownika' && 'Twój profil'}
                        </div>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute top-20 left-10 w-4 h-4 bg-primary rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute top-40 right-20 w-3 h-3 bg-accent rounded-full opacity-60 animate-pulse delay-75"></div>
            <div className="absolute bottom-20 left-20 w-2 h-2 bg-primary rounded-full opacity-60 animate-pulse delay-150"></div>
          </section>

          {/* Explanatory Trailer Section */}
          <ExplanatoryTrailer className="relative z-20" />

          {/* Live Ranking Section for logged-in users */}
          <LiveLeaderboard limit={10} showFilters={false} autoRefresh={true} />

          {/* Team Updates Section for logged-in users */}
          <UpdatesSection isLoggedIn={true} />
        </div>
      </div>
    )
  }

  // Non-logged-in user view - Original landing page
  return (
    <div className="cosmic-background min-h-screen relative overflow-hidden">
      {/* Cosmic Background with Stars and Planets */}
      <CosmicBackground />

      <div className="relative z-10">
        <HeroSection />
        <ExplanatoryTrailer />
        <LiveLeaderboard limit={10} showFilters={false} autoRefresh={true} />
        <UpdatesSection isLoggedIn={false} />
        <HowItWorksSection />
      </div>
    </div>
  )
}