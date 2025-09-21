import { useTranslation } from 'react-i18next'
import { CalendarDays, Users, Trophy, Sparkles, Zap, Star, Flame } from 'lucide-react'
import { useState, useEffect } from 'react'

interface UpdatesSectionProps {
  isLoggedIn?: boolean
}

export function UpdatesSection({ isLoggedIn = false }: UpdatesSectionProps) {
  const { t } = useTranslation()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [animationTrigger, setAnimationTrigger] = useState(0)

  // Trigger subtle animation every 8 seconds for attention
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationTrigger(prev => prev + 1)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const updates = [
    {
      id: 'early-adopters',
      icon: Users,
      title: t('updates.earlyAdopters.title'),
      description: t('updates.earlyAdopters.description'),
      date: t('updates.earlyAdopters.date'),
      type: 'announcement',
      priority: 'high',
      color: 'from-purple-500 via-pink-500 to-red-500',
      glowColor: 'shadow-purple-500/25'
    },
    {
      id: 'first-contest',
      icon: Trophy,
      title: t('updates.firstContest.title'),
      description: t('updates.firstContest.description'),
      date: t('updates.firstContest.date'),
      type: 'upcoming',
      priority: 'high',
      color: 'from-yellow-400 via-orange-500 to-red-500',
      glowColor: 'shadow-yellow-500/25'
    }
  ]

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 ${isLoggedIn ? 'relative' : 'bg-gradient-to-br from-surface/95 to-background/90 backdrop-blur-md'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary/20 to-accent/15 px-4 py-2 rounded-full border-2 border-primary/30 mb-6 shadow-lg shadow-primary/10">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-primary font-bold text-sm">{t('updates.badge')}</span>
          </div>

          {/* Title Card for Visibility with Cosmic Background */}
          <div className={`${isLoggedIn ? 'bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-cyan-600/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 mb-6 shadow-xl shadow-purple-500/20' : ''}`}>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-white drop-shadow-lg">
              {isLoggedIn ? 'Najnowsze Informacje' : t('updates.title')}
            </h2>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              {isLoggedIn ? 'Bądź na bieżąco z najważniejszymi aktualizacjami od zespołu SeeUTrending' : t('updates.subtitle')}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {updates.map((update, index) => (
            <div 
              key={update.id} 
              className={`
                group relative overflow-hidden rounded-3xl border-2 transition-all duration-1000 ease-in-out
                ${hoveredCard === update.id 
                  ? 'border-transparent shadow-2xl transform -translate-y-1 scale-[1.01]' 
                  : 'border-border/40 hover:border-border/60'
                }
                ${animationTrigger > 0 && index === 0 ? 'animate-pulse-glow' : ''}
              `}
              onMouseEnter={() => setHoveredCard(update.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Animated Background Gradient */}
              <div className={`
                absolute inset-0 bg-gradient-to-br ${update.color} opacity-0 transition-opacity duration-1000 ease-in-out
                ${hoveredCard === update.id ? 'opacity-10' : ''}
              `} />
              
              {/* Main Content Background */}
              <div className="relative bg-gradient-to-br from-background/95 to-surface/90 backdrop-blur-md p-8">
                
                {/* Floating Sparkles for High Priority */}
                {update.priority === 'high' && hoveredCard === update.id && (
                  <>
                    <Sparkles className="absolute top-4 right-4 w-4 h-4 text-yellow-400 animate-twinkle" />
                    <Star className="absolute top-8 right-12 w-3 h-3 text-pink-400 animate-twinkle-slow" />
                    <Zap className="absolute top-6 right-20 w-3 h-3 text-cyan-400 animate-pulse" />
                  </>
                )}

                <div className="flex flex-col md:flex-row md:items-start space-y-6 md:space-y-0 md:space-x-8">
                  {/* Enhanced Icon Section */}
                  <div className="flex items-center space-x-4 md:flex-col md:space-x-0 md:space-y-4">
                    <div className={`
                      relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 
                      ${hoveredCard === update.id 
                        ? `bg-gradient-to-br ${update.color} transform rotate-3 scale-110 ${update.glowColor} shadow-xl` 
                        : 'bg-gradient-to-r from-primary to-accent'
                      }
                    `}>
                      <update.icon className={`
                        w-8 h-8 text-white transition-all duration-300 
                        ${hoveredCard === update.id ? 'animate-bounce-subtle' : ''}
                      `} />
                      
                      {/* Pulsing Ring Effect */}
                      {update.priority === 'high' && (
                        <div className={`
                          absolute inset-0 rounded-2xl border-2 border-white/30 animate-ping 
                          ${hoveredCard === update.id ? 'opacity-75' : 'opacity-0'}
                        `} />
                      )}
                    </div>
                    
                    {update.priority === 'high' && (
                      <div className={`
                        relative px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
                        transition-all duration-300 transform
                        ${hoveredCard === update.id 
                          ? `bg-gradient-to-r ${update.color} text-white scale-105` 
                          : 'bg-primary/20 text-primary'
                        }
                      `}>
                        <span className="relative z-10">
                          {t('updates.priority.high')}
                        </span>
                        {hoveredCard === update.id && (
                          <Flame className="absolute -top-1 -right-1 w-3 h-3 text-orange-400 animate-bounce" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Enhanced Content */}
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-3 sm:space-y-0">
                      <h3 className={`
                        text-2xl font-bold transition-all duration-300 
                        ${hoveredCard === update.id 
                          ? 'text-white drop-shadow-lg' 
                          : 'text-text-primary'
                        }
                      `}>
                        {update.title}
                      </h3>
                      
                      <div className="flex items-center space-x-3 text-sm">
                        <div className={`
                          flex items-center space-x-2 px-3 py-1.5 rounded-full transition-all duration-300
                          ${hoveredCard === update.id 
                            ? 'bg-white/20 text-white backdrop-blur-sm' 
                            : 'text-text-muted'
                          }
                        `}>
                          <CalendarDays className="w-4 h-4" />
                          <span className="font-medium">{update.date}</span>
                        </div>
                        
                        <div className={`
                          px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300
                          ${update.type === 'announcement' 
                            ? hoveredCard === update.id 
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                              : 'bg-accent/20 text-accent' 
                            : hoveredCard === update.id
                              ? 'bg-green-500/20 text-green-300 border border-green-400/30'
                              : 'bg-success/20 text-success'
                          }
                        `}>
                          {t(`updates.type.${update.type}`)}
                        </div>
                      </div>
                    </div>
                    
                    <p className={`
                      text-lg leading-relaxed transition-all duration-300
                      ${hoveredCard === update.id 
                        ? 'text-white/90' 
                        : 'text-text-secondary'
                      }
                    `}>
                      {update.description}
                    </p>

                    {/* Engagement Metrics Preview */}
                    {hoveredCard === update.id && (
                      <div className="flex items-center space-x-6 pt-4 text-sm text-white/80 animate-slide-in-up">
                        <div className="flex items-center space-x-2">
                          <Sparkles className="w-4 h-4 text-yellow-400" />
                          <span>High demand</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Zap className="w-4 h-4 text-purple-400" />
                          <span>Limited spots</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Bottom Glow Effect */}
                <div className={`
                  absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${update.color} 
                  transition-opacity duration-500
                  ${hoveredCard === update.id ? 'opacity-80' : 'opacity-0'}
                `} />
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Call to Action - Only for non-logged users */}
        {!isLoggedIn && (
          <div className="mt-16 text-center">
            <div className="group relative overflow-hidden bg-gradient-to-br from-primary/20 to-accent/15 border-2 border-primary/30 rounded-3xl p-10 backdrop-blur-md shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-700">

              {/* Floating Elements */}
              <div className="absolute top-6 left-6 w-2 h-2 bg-yellow-400 rounded-full animate-twinkle" />
              <div className="absolute top-8 right-10 w-1.5 h-1.5 bg-pink-400 rounded-full animate-twinkle-slow" />
              <div className="absolute bottom-8 left-12 w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
              <div className="absolute bottom-6 right-6 w-2 h-2 bg-purple-400 rounded-full animate-bounce" />

              {/* Main Content */}
              <div className="relative z-10 space-y-6">
                <h3 className="text-3xl font-bold text-white drop-shadow-lg animate-pulse-glow">
                  {t('updates.cta.title')}
                </h3>
                <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                  {t('updates.cta.description')}
                </p>

                {/* Enhanced Button with Particle Effect */}
                <div className="relative inline-block">
                  <button
                    className="group/button relative btn-vibrant-purple px-10 py-4 text-lg font-bold overflow-hidden"
                    onClick={() => window.location.href = '/auth/register'}
                    onMouseEnter={(e) => {
                      // Create particle burst effect
                      const particles = Array.from({ length: 8 }, (_, i) => {
                        const particle = document.createElement('div');
                        particle.className = 'absolute w-1 h-1 bg-white rounded-full animate-ping pointer-events-none';
                        particle.style.left = `${Math.random() * 100}%`;
                        particle.style.top = `${Math.random() * 100}%`;
                        particle.style.animationDelay = `${i * 100}ms`;
                        e.currentTarget.appendChild(particle);
                        setTimeout(() => particle.remove(), 1000);
                      });
                    }}
                  >
                    <span className="relative z-10 flex items-center space-x-2">
                      <Sparkles className="w-5 h-5 animate-spin" />
                      <span>{t('updates.cta.button')}</span>
                      <Zap className="w-5 h-5 group-hover/button:animate-bounce" />
                    </span>

                    {/* Button Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover/button:translate-x-full transition-transform duration-1000" />
                  </button>

                  {/* Orbiting Elements */}
                  <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                    <div className="absolute top-0 left-1/2 w-1 h-1 bg-yellow-400 rounded-full transform -translate-x-1/2 -translate-y-2" />
                  </div>
                  <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                    <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-pink-400 rounded-full transform -translate-x-1/2 translate-y-2" />
                  </div>
                </div>
              </div>

              {/* Animated Background Mesh */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-purple-500 to-transparent rounded-full blur-xl animate-float-slow" />
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500 to-transparent rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-pink-500 to-transparent rounded-full blur-xl animate-pulse-glow" />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}