import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, Calendar, Trophy, Sparkles, Clock, Users, Zap, Star, Flame, Crown, Gift, PartyPopper, Play } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '../components/ui'

export function ContestsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(0)
  const [anticipationLevel, setAnticipationLevel] = useState(1)

  // Fake countdown timer for anticipation
  useEffect(() => {
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 7) // 7 days from now
    
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now
      setCountdown(distance)
    }, 1000)

    // Increase anticipation level every 6 seconds for smoother transitions
    const anticipationTimer = setInterval(() => {
      setAnticipationLevel(prev => (prev % 3) + 1)
    }, 6000)

    return () => {
      clearInterval(timer)
      clearInterval(anticipationTimer)
    }
  }, [])

  const formatTime = (time: number) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24))
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60))
    return { days, hours, minutes }
  }

  const { days, hours, minutes } = countdown > 0 ? formatTime(countdown) : { days: 0, hours: 0, minutes: 0 }

  return (
    <div className="page-purple-theme py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="relative max-w-4xl mx-auto z-20">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('common.back')}</span>
        </button>

        <div className="text-center space-y-12">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-display font-bold title-vibrant-purple drop-shadow-lg animate-pulse-glow">
              {t('contests.title')}
            </h1>
            <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto drop-shadow-sm">
              {t('contests.subtitle')}
            </p>
          </div>

          {/* Enhanced Coming Soon Experience */}
          <div className="relative">
            {/* Anticipation Build-up Card */}
            <div className={`
              card-clean p-12 rounded-3xl relative overflow-hidden transition-all duration-1000 ease-out
              ${anticipationLevel === 1 ? 'anticipation-glow' : ''}
              ${anticipationLevel === 2 ? 'engagement-pulse' : ''}
              ${anticipationLevel === 3 ? 'neural-pulse' : ''}
            `}>
              
              {/* Floating Background Elements */}
              <div className="absolute top-4 left-4 w-3 h-3 bg-yellow-400 rounded-full animate-twinkle opacity-60" />
              <div className="absolute top-8 right-8 w-2 h-2 bg-pink-400 rounded-full animate-pulse opacity-40" />
              <div className="absolute bottom-6 left-8 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-50" />
              <div className="absolute bottom-4 right-12 w-1.5 h-1.5 bg-purple-400 rounded-full animate-twinkle-slow opacity-70" />
              
              <div className="relative z-10 space-y-10">
                {/* Enhanced Lock Icon with Pulsing Animation */}
                <div className="relative mx-auto">
                  <div className={`
                    w-40 h-40 rounded-full flex items-center justify-center mx-auto relative
                    bg-gradient-to-br from-purple-100 via-white to-purple-50
                    border-4 transition-all duration-1000 ease-in-out
                    ${anticipationLevel === 1 ? 'border-purple-300 shadow-lg' : ''}
                    ${anticipationLevel === 2 ? 'border-purple-400 shadow-xl' : ''}
                    ${anticipationLevel === 3 ? 'border-purple-500 shadow-2xl' : ''}
                  `}>
                    <Lock className={`
                      w-20 h-20 text-gray-600 transition-all duration-800 ease-in-out
                      ${anticipationLevel === 3 ? 'animate-pulse' : ''}
                    `} />
                    
                    {/* Orbiting Stars */}
                    <div className="absolute inset-0 animate-spin" style={{ animationDuration: '10s' }}>
                      <Star className="absolute top-2 left-1/2 w-4 h-4 text-yellow-400 transform -translate-x-1/2" />
                    </div>
                    <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
                      <Sparkles className="absolute bottom-2 left-1/2 w-4 h-4 text-pink-400 transform -translate-x-1/2" />
                    </div>
                  </div>
                  
                  {/* Pulsing Rings */}
                  {anticipationLevel >= 2 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-44 h-44 border-2 border-purple-300 rounded-full animate-ping opacity-20" />
                    </div>
                  )}
                  {anticipationLevel >= 3 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-purple-400 rounded-full animate-ping opacity-15" style={{ animationDelay: '0.5s' }} />
                    </div>
                  )}
                </div>

                {/* Dynamic Countdown Timer */}
                <div className="text-center space-y-6">
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 excitement-bounce">
                    {t('contests.noActive.title')}
                  </h2>
                  
                  {/* Live Countdown Display */}
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white mx-auto max-w-md">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <Clock className="w-5 h-5 animate-pulse" />
                      <span className="font-bold uppercase tracking-wider text-sm">First Contest Starts In</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                        <div className="text-2xl font-bold">{days}</div>
                        <div className="text-xs uppercase tracking-wider opacity-80">Days</div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                        <div className="text-2xl font-bold">{hours}</div>
                        <div className="text-xs uppercase tracking-wider opacity-80">Hours</div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                        <div className="text-2xl font-bold">{minutes}</div>
                        <div className="text-xs uppercase tracking-wider opacity-80">Minutes</div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                    {t('contests.noActive.description')}
                  </p>
                </div>

                {/* Enhanced Preview Features */}
                <div className="space-y-8">
                  <div className="text-center">
                    <p className="text-lg text-gray-700 leading-relaxed mb-8">
                      {t('contests.coming.mainMessage')}
                    </p>
                    
                    {/* Interactive Feature Preview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                      <div className="group bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200 hover:border-yellow-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dopamine-hit">
                        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Trophy className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">{t('contests.coming.rewards')}</h3>
                        <p className="text-sm text-gray-600">Prawdziwe nagrody i ekskluzywne doświadczenia</p>
                        <div className="mt-3 flex items-center justify-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <Star className="w-4 h-4 text-yellow-500" />
                          <Star className="w-4 h-4 text-yellow-500" />
                        </div>
                      </div>
                      
                      <div className="group bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dopamine-hit">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Zap className="w-8 h-8 text-white group-hover:animate-bounce" />
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">{t('contests.coming.points')}</h3>
                        <p className="text-sm text-gray-600">Earn XP, unlock badges, level up your profile</p>
                        <div className="mt-3 flex items-center justify-center space-x-1">
                          <Sparkles className="w-4 h-4 text-purple-500 animate-twinkle" />
                          <Flame className="w-4 h-4 text-pink-500" />
                          <Crown className="w-4 h-4 text-yellow-500" />
                        </div>
                      </div>
                      
                      <div className="group bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border-2 border-cyan-200 hover:border-cyan-400 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 dopamine-hit">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <PartyPopper className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-bold text-gray-800 mb-2">{t('contests.coming.parties')}</h3>
                        <p className="text-sm text-gray-600">Exclusive events, brand collaborations, creator meetups</p>
                        <div className="mt-3 flex items-center justify-center space-x-1">
                          <Users className="w-4 h-4 text-cyan-500" />
                          <Gift className="w-4 h-4 text-blue-500" />
                          <Calendar className="w-4 h-4 text-purple-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Early Access Banner */}
                  <div className="relative bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 rounded-2xl p-8 text-white text-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <Crown className="w-6 h-6 text-yellow-300 animate-pulse" />
                        <span className="font-bold uppercase tracking-wider text-lg">VIP Early Access</span>
                        <Crown className="w-6 h-6 text-yellow-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
                      </div>
                      <p className="text-xl font-semibold mb-2">
                        {t('contests.coming.topUsers')}
                      </p>
                      <p className="text-purple-100 text-sm">
                        Join now and get exclusive perks when contests launch!
                      </p>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Contest Section */}
          <div className="space-y-8 text-center mb-16">
            <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-8 border border-yellow-400/30 max-w-4xl mx-auto">
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Play className="w-8 h-8 text-yellow-400 animate-pulse" />
                <h3 className="text-3xl font-display font-bold text-white">
                  🧪 Demo Contest - Wypróbuj już teraz!
                </h3>
                <Sparkles className="w-8 h-8 text-pink-400 animate-pulse" />
              </div>
              
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Nie możesz się doczekać prawdziwych konkursów? Wypróbuj nasz interaktywny demo z pełną funkcjonalnością!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-white mb-1">Live Ranking</h4>
                  <p className="text-sm text-white/70">Zobacz rankingi na żywo</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <Zap className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-white mb-1">Video Submission</h4>
                  <p className="text-sm text-white/70">Prześlij swój film TikTok</p>
                </div>
                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <Crown className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h4 className="font-semibold text-white mb-1">Real Metrics</h4>
                  <p className="text-sm text-white/70">Prawdziwe metryki zaangażowania</p>
                </div>
              </div>
              
              <Button
                variant="gaming"
                size="lg"
                onClick={() => navigate('/demo-contest')}
                className="text-xl px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 transform hover:scale-110 transition-all duration-300 shadow-2xl shadow-yellow-500/25"
              >
                <Play className="w-6 h-6 mr-2" />
                Sprawdź Demo Contest
                <Sparkles className="w-6 h-6 ml-2 animate-pulse" />
              </Button>
              
              <p className="text-sm text-white/60 mt-4">
                * Demo korzysta z symulowanych danych, ale pokazuje pełną funkcjonalność platformy
              </p>
            </div>
          </div>

          {/* Enhanced CTA Section */}
          <div className="space-y-8 text-center">
            <div className="relative">
              <h3 className="text-3xl md:text-4xl font-display font-bold title-vibrant-purple drop-shadow-lg animate-pulse-glow">
                {t('contests.cta.title')}
              </h3>
              {/* Floating Elements Around Title */}
              <Sparkles className="absolute -top-2 -left-4 w-6 h-6 text-yellow-300 animate-twinkle opacity-80" />
              <Star className="absolute -top-3 -right-2 w-5 h-5 text-pink-300 animate-pulse opacity-70" />
              <Zap className="absolute -bottom-1 left-8 w-4 h-4 text-cyan-300 animate-pulse opacity-60" />
            </div>
            
            <p className="text-xl text-white/95 max-w-3xl mx-auto drop-shadow-sm leading-relaxed">
              {t('contests.cta.description')}
            </p>
            
            {/* Enhanced Button Section */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {/* Primary CTA with Enhanced Effects */}
              <div className="relative group">
                <button
                  onClick={() => navigate('/auth/register')}
                  className="relative px-10 py-5 btn-vibrant-purple text-xl font-bold overflow-hidden"
                  onMouseEnter={(e) => {
                    // Create burst effect
                    const particles = Array.from({ length: 12 }, (_, i) => {
                      const particle = document.createElement('div');
                      particle.className = 'absolute w-1 h-1 bg-white rounded-full animate-ping pointer-events-none';
                      particle.style.left = `${20 + Math.random() * 60}%`;
                      particle.style.top = `${20 + Math.random() * 60}%`;
                      particle.style.animationDelay = `${i * 50}ms`;
                      e.currentTarget.appendChild(particle);
                      setTimeout(() => particle.remove(), 1500);
                    });
                  }}
                >
                  <span className="relative z-10 flex items-center space-x-3">
                    <Crown className="w-6 h-6 animate-pulse" />
                    <span>{t('contests.cta.register')}</span>
                    <Flame className="w-6 h-6 group-hover:animate-pulse" />
                  </span>
                  
                  {/* Enhanced Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
                
                {/* Orbiting Success Indicators */}
                <div className="absolute -inset-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
                    <Trophy className="absolute top-0 left-1/2 w-4 h-4 text-yellow-400 transform -translate-x-1/2 -translate-y-2" />
                  </div>
                  <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
                    <Star className="absolute bottom-0 left-1/2 w-4 h-4 text-pink-400 transform -translate-x-1/2 translate-y-2" />
                  </div>
                </div>
              </div>
              
              {/* Secondary CTA with Magnetic Effect */}
              <button
                onClick={() => navigate('/brands')}
                className="group relative px-8 py-4 bg-white/20 border-2 border-white/40 text-white font-bold rounded-2xl hover:bg-white/30 hover:border-white/60 backdrop-blur-sm transition-all duration-500 transform hover:scale-110 hover:rotate-1 hover:shadow-2xl hover:shadow-white/20 magnetic-hover"
              >
                <span className="flex items-center space-x-2">
                  <Users className="w-5 h-5 group-hover:animate-pulse" />
                  <span>{t('contests.cta.brands')}</span>
                  <PartyPopper className="w-5 h-5 group-hover:animate-spin" />
                </span>
                
                {/* Background Pulse */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
              </button>
            </div>
            
            {/* Urgency Elements */}
            <div className="flex items-center justify-center text-white/80">
              <div className="flex items-center space-x-2 fomo-urgency">
                <Clock className="w-5 h-5 text-orange-300" />
                <span className="font-medium">Early bird bonuses ending soon</span>
                <Flame className="w-4 h-4 text-red-300 animate-pulse" />
              </div>
            </div>
            
            {/* Trust Signals */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto border border-white/20">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-pink-300">24/7</div>
                  <div className="text-sm text-white/70">Live Support</div>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-cyan-300">100%</div>
                  <div className="text-sm text-white/70">Fair & Transparent</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}