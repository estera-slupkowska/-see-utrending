import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Lock, Trophy, Star, Award, Sparkles, Zap, Flame, Crown, PartyPopper } from 'lucide-react'
import { Button, Badge } from '../ui'
import { useUserCount } from '../../hooks/useUserCount'
import { useState, useEffect } from 'react'

export function HeroSection() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { userCount, loading: userCountLoading, error: userCountError } = useUserCount()
  const [animationState, setAnimationState] = useState(1)
  const [showParticles, setShowParticles] = useState(false)

  // Cycle through different animation states for more engagement
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationState(prev => (prev % 4) + 1)
    }, 5000) // Slower animation state changes
    
    // Trigger particle effect periodically
    const particleTimer = setInterval(() => {
      setShowParticles(true)
      setTimeout(() => setShowParticles(false), 3000) // Longer particle duration
    }, 12000) // Less frequent particle effects

    return () => {
      clearInterval(timer)
      clearInterval(particleTimer)
    }
  }, [])

  const handleJoinClick = () => {
    navigate('/auth/register')
  }

  const handleBrandClick = () => {
    navigate('/brands')
  }

  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Enhanced Background with Dynamic Elements */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-30"></div>
      
      {/* Floating Interactive Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dynamic floating icons */}
        <div className={`absolute top-20 left-10 transition-all duration-1500 ease-in-out ${
          animationState === 1 ? 'transform rotate-6 scale-105' : 
          animationState === 2 ? 'transform -rotate-3 scale-100' : 
          animationState === 3 ? 'transform rotate-3 scale-102' : 'transform -rotate-6 scale-98'
        }`}>
          <Trophy className="w-8 h-8 text-yellow-400 animate-bounce opacity-60" />
        </div>
        
        <div className={`absolute top-32 right-16 transition-all duration-1800 ease-in-out ${
          animationState === 2 ? 'transform rotate-12 scale-108' : 
          animationState === 3 ? 'transform -rotate-8 scale-96' : 
          animationState === 4 ? 'transform rotate-4 scale-104' : 'transform -rotate-12 scale-100'
        }`}>
          <Star className="w-6 h-6 text-pink-400 animate-pulse opacity-70" />
        </div>
        
        <div className={`absolute bottom-32 left-20 transition-all duration-2000 ease-in-out ${
          animationState === 3 ? 'transform rotate-15 scale-110' : 
          animationState === 4 ? 'transform -rotate-10 scale-98' : 
          animationState === 1 ? 'transform rotate-8 scale-103' : 'transform -rotate-15 scale-105'
        }`}>
          <Sparkles className="w-7 h-7 text-cyan-400 animate-twinkle opacity-50" />
        </div>
        
        <div className={`absolute bottom-20 right-12 transition-all duration-1800 ease-in-out ${
          animationState === 4 ? 'transform rotate-20 scale-112' : 
          animationState === 1 ? 'transform -rotate-12 scale-96' : 
          animationState === 2 ? 'transform rotate-10 scale-106' : 'transform -rotate-20 scale-100'
        }`}>
          <Crown className="w-6 h-6 text-purple-400 animate-bounce opacity-65" />
        </div>

        {/* Particle Burst Effect */}
        {showParticles && (
          <div className="absolute inset-0 flex items-center justify-center">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full animate-ping`}
                style={{
                  left: `${40 + Math.random() * 20}%`,
                  top: `${35 + Math.random() * 30}%`,
                  animationDelay: `${i * 100}ms`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="relative max-w-4xl mx-auto text-center z-10">
        {/* Enhanced Main Title with Dynamic Effects */}
        <div className="relative mb-6">
          <h1 className={`text-6xl sm:text-7xl lg:text-8xl font-display font-bold transition-all duration-1000 ease-in-out ${
            animationState === 1 ? 'animate-pulse-glow' :
            animationState === 2 ? 'excitement-bounce' :
            animationState === 3 ? 'viral-shimmer' :
            'neural-pulse'
          }`}>
            <span className="gradient-text relative">
              {t('hero.title')}
              
              {/* Dynamic accent elements around title */}
              <div className="absolute -top-4 -right-2">
                <Flame className={`w-8 h-8 text-orange-400 transition-all duration-800 ease-in-out ${
                  animationState === 1 ? 'animate-bounce opacity-80' : 'opacity-0'
                }`} />
              </div>
              
              <div className="absolute -bottom-2 -left-4">
                <Zap className={`w-6 h-6 text-cyan-400 transition-all duration-800 ease-in-out ${
                  animationState === 2 ? 'animate-pulse opacity-80' : 'opacity-0'
                }`} />
              </div>
              
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8">
                <PartyPopper className={`w-7 h-7 text-pink-400 transition-all duration-800 ease-in-out ${
                  animationState === 3 ? 'animate-bounce opacity-80' : 'opacity-0'
                }`} />
              </div>
            </span>
          </h1>
        </div>
        
        {/* Subtitle */}
        <p className="text-2xl sm:text-3xl text-text-secondary mb-4">
          {t('hero.subtitle')}
        </p>
        
        {/* Decorative line */}
        <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-8 rounded-full"></div>
        
        {/* Description */}
        <p className="text-lg sm:text-xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed">
          {t('hero.description')}
        </p>
        
        {/* Enhanced CTA Buttons with Engagement Features */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <div className="relative group">
            <Button 
              variant="gaming"
              size="xl"
              className="w-full sm:w-auto min-w-[280px] shadow-2xl relative overflow-hidden"
              onClick={handleJoinClick}
              onMouseEnter={(e) => {
                // Create excitement burst effect
                const particles = Array.from({ length: 15 }, (_, i) => {
                  const particle = document.createElement('div')
                  particle.className = 'absolute w-1 h-1 bg-white rounded-full animate-ping pointer-events-none'
                  particle.style.left = `${20 + Math.random() * 60}%`
                  particle.style.top = `${20 + Math.random() * 60}%`
                  particle.style.animationDelay = `${i * 80}ms`
                  e.currentTarget.appendChild(particle)
                  setTimeout(() => particle.remove(), 2000)
                })
              }}
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span className="text-2xl">🚀</span>
                <span>{t('hero.cta.primary')}</span>
                <Sparkles className="w-5 h-5 group-hover:animate-spin" />
              </span>
              
              {/* Enhanced shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Button>
            
            {/* Orbiting success indicators */}
            <div className="absolute -inset-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s' }}>
                <Trophy className="absolute top-0 left-1/2 w-4 h-4 text-yellow-400 transform -translate-x-1/2 -translate-y-2" />
              </div>
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
                <Crown className="absolute bottom-0 left-1/2 w-4 h-4 text-purple-400 transform -translate-x-1/2 translate-y-2" />
              </div>
            </div>
          </div>
          
          <Button 
            variant="secondary" 
            size="lg"
            className="w-full sm:w-auto min-w-[200px] group magnetic-hover"
            onClick={handleBrandClick}
          >
            <span className="flex items-center space-x-2">
              <span className="text-xl">💼</span>
              <span>{t('hero.cta.secondary')}</span>
              <Star className="w-4 h-4 group-hover:animate-bounce" />
            </span>
          </Button>
        </div>
        
        {/* Single Metric - User Count */}
        <div className="mb-16">
          <div className="text-center">
            <div className="text-4xl sm:text-5xl font-bold gradient-text mb-2">
              {userCountLoading ? (
                <div className="inline-flex items-center">
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span className="text-text-muted">...</span>
                </div>
              ) : userCountError ? (
                <div className="inline-flex items-center text-text-muted">
                  <span>--</span>
                </div>
              ) : (
                userCount.toLocaleString()
              )}
            </div>
            <div className="text-lg text-text-secondary font-medium">{t('hero.stats.users')}</div>
          </div>
        </div>

      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-4 h-4 bg-primary rounded-full opacity-60 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-3 h-3 bg-accent rounded-full opacity-60 animate-pulse delay-75"></div>
      <div className="absolute bottom-20 left-20 w-2 h-2 bg-primary rounded-full opacity-60 animate-pulse delay-150"></div>
    </section>
  )
}