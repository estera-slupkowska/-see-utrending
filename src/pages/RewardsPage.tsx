import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Trophy, 
  Zap, 
  Star, 
  Flame as Fire, 
  Crown, 
  TrendingUp,
  Sparkles,
  Target,
  Award,
  Gem,
  Rocket,
  Heart,
  ShoppingBag,
  PartyPopper,
  Camera,
  Eye
} from 'lucide-react'
import { Button, Badge, CosmicBackground } from '../components/ui'

export function RewardsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const badges = [
    {
      id: 'hot-start',
      name: t('rewards.badges.hotStart.name'),
      description: t('rewards.badges.hotStart.description'),
      icon: Fire,
      color: 'from-orange-500 to-red-500',
      requirement: '1K views',
      rarity: 'common',
      xp: 20
    },
    {
      id: 'viral-starter',
      name: t('rewards.badges.viralStarter.name'),
      description: t('rewards.badges.viralStarter.description'),
      icon: Rocket,
      color: 'from-purple-500 to-pink-500',
      requirement: '10K views',
      rarity: 'rare',
      xp: 100
    },
    {
      id: 'viral-king',
      name: t('rewards.badges.viralKing.name'),
      description: t('rewards.badges.viralKing.description'),
      icon: Crown,
      color: 'from-yellow-500 to-orange-500',
      requirement: '1st place',
      rarity: 'legendary',
      xp: 10000
    },
    {
      id: 'silver-warrior',
      name: t('rewards.badges.silverWarrior.name'),
      description: t('rewards.badges.silverWarrior.description'),
      icon: Award,
      color: 'from-gray-400 to-gray-600',
      requirement: '2nd place',
      rarity: 'legendary',
      xp: 8000
    },
    {
      id: 'bronze-warrior',
      name: t('rewards.badges.bronzeWarrior.name'),
      description: t('rewards.badges.bronzeWarrior.description'),
      icon: Target,
      color: 'from-orange-600 to-yellow-600',
      requirement: '3rd place',
      rarity: 'legendary',
      xp: 6000
    },
    {
      id: 'community-favorite',
      name: t('rewards.badges.communityFavorite.name'),
      description: t('rewards.badges.communityFavorite.description'),
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      requirement: 'Most liked',
      rarity: 'rare',
      xp: 5000
    },
    {
      id: 'fourth-place',
      name: t('rewards.badges.fourthPlace.name'),
      description: t('rewards.badges.fourthPlace.description'),
      icon: Star,
      color: 'from-indigo-500 to-purple-500',
      requirement: '4th place',
      rarity: 'epic',
      xp: 5000
    },
    {
      id: 'fifth-place',
      name: t('rewards.badges.fifthPlace.name'),
      description: t('rewards.badges.fifthPlace.description'),
      icon: TrendingUp,
      color: 'from-green-500 to-teal-500',
      requirement: '5th place',
      rarity: 'epic',
      xp: 5000
    },
    {
      id: 'most-comments',
      name: t('rewards.badges.mostComments.name'),
      description: t('rewards.badges.mostComments.description'),
      icon: Sparkles,
      color: 'from-cyan-500 to-blue-500',
      requirement: 'Most comments',
      rarity: 'rare',
      xp: 4000
    },
    {
      id: 'early-adopter',
      name: t('rewards.badges.earlyAdopter.name'),
      description: t('rewards.badges.earlyAdopter.description'),
      icon: Crown,
      color: 'from-purple-600 to-pink-600',
      requirement: 'First 1000 users',
      rarity: 'legendary',
      xp: 100
    }
  ]

  const rewardTypes = [
    {
      id: 'money',
      title: t('rewards.types.money.title'),
      description: t('rewards.types.money.description'),
      icon: Trophy,
      gradient: 'from-yellow-400 to-orange-500',
      examples: ['500-5000 PLN', 'Contest prizes', 'Performance bonuses']
    },
    {
      id: 'experiences',
      title: t('rewards.types.experiences.title'),
      description: t('rewards.types.experiences.description'),
      icon: PartyPopper,
      gradient: 'from-pink-500 to-purple-500',
      examples: ['Exclusive parties', 'Brand events', 'Creator meetups']
    },
    {
      id: 'products',
      title: t('rewards.types.products.title'),
      description: t('rewards.types.products.description'),
      icon: ShoppingBag,
      gradient: 'from-blue-500 to-cyan-500',
      examples: ['Latest gadgets', 'Fashion items', 'Brand merchandise']
    },
    {
      id: 'recognition',
      title: t('rewards.types.recognition.title'),
      description: t('rewards.types.recognition.description'),
      icon: Gem,
      gradient: 'from-purple-500 to-pink-500',
      examples: ['Profile badges', 'Leaderboard fame', 'Social recognition']
    }
  ]

  return (
    <div className="page-purple-theme py-20 px-4 sm:px-6 lg:px-8">
      {/* Bright purple gradient background - no additional background needed */}
      
      <div className="relative max-w-6xl mx-auto z-20">
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('common.back')}</span>
        </button>

        <div className="space-y-20">
          {/* Hero Section */}
          <section className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 title-vibrant-purple drop-shadow-lg animate-pulse-glow">
                {t('rewards.hero.title')}
              </h1>
              <p className="text-xl md:text-2xl text-white/95 max-w-4xl mx-auto drop-shadow-sm">
                {t('rewards.hero.subtitle')}
              </p>
            </div>
            
            {/* Enhanced XP System Information - More Visible and Animated */}
            <div className="relative p-10 rounded-3xl bg-gradient-to-br from-xp-gold/30 via-orange-500/20 to-primary/30 border-2 border-xp-gold/50 mb-12 overflow-hidden group hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-xp-gold/20">

              {/* Animated Background Particles */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-6 left-6 w-3 h-3 bg-xp-gold rounded-full animate-pulse" />
                <div className="absolute top-12 right-8 w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-8 left-12 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-6 right-6 w-2.5 h-2.5 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
              </div>

              {/* Enhanced Header with Multiple Animations */}
              <div className="flex items-center justify-center space-x-4 mb-8 relative z-10">
                <div className="relative">
                  <Zap className="h-12 w-12 text-xp-gold animate-pulse drop-shadow-lg" />
                  <div className="absolute inset-0 h-12 w-12 border-2 border-xp-gold rounded-full animate-ping opacity-30" />
                </div>
                <span className="text-4xl font-bold text-xp-gold drop-shadow-lg animate-pulse-glow">
                  System XP
                </span>
                <div className="relative">
                  <Eye className="h-10 w-10 text-primary animate-bounce drop-shadow-lg" />
                  <div className="absolute inset-0 h-10 w-10 border-2 border-primary rounded-full animate-ping opacity-20" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>

              {/* Main XP Message with Enhanced Typography */}
              <div className="text-center space-y-6 relative z-10">
                <div className="relative">
                  <p className="text-2xl md:text-3xl text-white font-bold drop-shadow-lg">
                    🎯 Zdobywaj <span className="text-xp-gold font-black text-3xl md:text-4xl animate-pulse-glow">10 XP</span> za każde <span className="text-primary font-black text-3xl md:text-4xl animate-pulse-glow">100 wyświetleń</span>!
                  </p>

                  {/* Floating Achievement Burst */}
                  <div className="absolute -top-4 -right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-bounce">
                    <div className="bg-gradient-to-r from-xp-gold to-orange-500 text-black text-sm font-bold px-3 py-1 rounded-full shadow-lg">
                      +10 XP!
                    </div>
                  </div>
                </div>

                {/* Enhanced Visual Formula */}
                <div className="flex items-center justify-center space-x-8 text-lg text-white/90 p-6 bg-black/20 rounded-2xl border border-xp-gold/20">
                  <div className="flex items-center space-x-3 p-3 bg-primary/20 rounded-xl hover:bg-primary/30 transition-colors duration-300 group/item">
                    <Eye className="w-6 h-6 text-primary group-hover/item:animate-bounce" />
                    <span className="font-bold group-hover/item:text-white transition-colors duration-300">100 wyświetleń</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-3xl text-xp-gold font-bold animate-pulse">=</span>
                    <div className="w-8 h-0.5 bg-gradient-to-r from-xp-gold to-orange-500 animate-pulse" />
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-xp-gold/20 rounded-xl hover:bg-xp-gold/30 transition-colors duration-300 group/item">
                    <Zap className="w-6 h-6 text-xp-gold group-hover/item:animate-bounce" />
                    <span className="text-xp-gold font-black text-xl group-hover/item:text-yellow-200 transition-colors duration-300">10 XP</span>
                  </div>
                </div>

                {/* Enhanced Motivational Message */}
                <div className="relative p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-400/30">
                  <p className="text-lg text-white/90 font-semibold flex items-center justify-center space-x-2">
                    <Rocket className="w-5 h-5 text-orange-400 animate-bounce" />
                    <span>Im więcej wyświetleń, tym więcej XP i wyższy poziom!</span>
                    <Rocket className="w-5 h-5 text-orange-400 animate-bounce" style={{ animationDelay: '0.5s' }} />
                  </p>

                  {/* Progress Bar Simulation */}
                  <div className="mt-4 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-xp-gold to-orange-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-2000 ease-out" />
                  </div>
                  <div className="flex justify-between text-xs text-white/60 mt-2">
                    <span>0 XP</span>
                    <span className="text-xp-gold font-bold">∞ XP</span>
                  </div>
                </div>
              </div>

              {/* Bottom Glow Effect */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-xp-gold via-orange-500 to-yellow-400 opacity-0 group-hover:opacity-60 transition-opacity duration-500 rounded-b-3xl" />
            </div>

            <div className="relative p-8 rounded-2xl bg-surface/50 border border-border/50">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Camera className="h-8 w-8 text-primary" />
                <span className="text-2xl font-semibold">TikTok</span>
                <Zap className="h-6 w-6 text-accent" />
                <span className="text-2xl font-semibold">{t('rewards.hero.realLife')}</span>
                <Trophy className="h-8 w-8 text-xp-gold" />
              </div>
              <p className="text-lg text-text-secondary">
                {t('rewards.hero.mainMessage')}
              </p>
            </div>
          </section>

          {/* Reward Types Section */}
          <section className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
                {t('rewards.types.title')}
              </h2>
              <p className="text-xl text-gray-800 max-w-2xl mx-auto">
                {t('rewards.types.description')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {rewardTypes.map((reward, index) => (
                <div key={reward.id} className="group relative">
                  {/* Enhanced Reward Type Card */}
                  <div className="h-full p-8 bg-surface/50 rounded-3xl border-2 border-border/50 hover:border-primary/50 transition-all duration-500 hover:-translate-y-3 hover:scale-105 hover:shadow-2xl magnetic-hover">
                    
                    {/* Floating Background Effect */}
                    <div className={`
                      absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500
                      bg-gradient-to-br ${reward.gradient}
                    `} />
                    
                    <div className="relative z-10 space-y-6">
                      {/* Enhanced Icon with Multiple Effects */}
                      <div className="relative mx-auto w-20 h-20">
                        <div className={`
                          w-full h-full rounded-3xl bg-gradient-to-br ${reward.gradient} p-5 shadow-xl
                          group-hover:scale-125 group-hover:rotate-12 group-hover:shadow-2xl
                          transition-all duration-500 viral-shimmer
                        `}>
                          <reward.icon className="w-full h-full text-white drop-shadow-lg" />
                        </div>
                        
                        {/* Pulsing Ring */}
                        <div className="absolute inset-0 rounded-3xl border-2 border-current opacity-0 group-hover:opacity-30 animate-ping transition-opacity duration-300" 
                             style={{ color: reward.id === 'money' ? '#F59E0B' : reward.id === 'experiences' ? '#EC4899' : reward.id === 'products' ? '#06B6D4' : '#A855F7' }} />
                        
                        {/* Orbiting Elements */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
                            <div className="absolute top-0 left-1/2 w-2 h-2 bg-yellow-400 rounded-full transform -translate-x-1/2 -translate-y-2" />
                          </div>
                          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '6s', animationDirection: 'reverse' }}>
                            <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-pink-400 rounded-full transform -translate-x-1/2 translate-y-2" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Content */}
                      <div className="text-center space-y-4">
                        <h3 className="text-xl font-bold text-white group-hover:text-yellow-100 transition-colors duration-300">
                          {reward.title}
                        </h3>
                        <p className="text-text-secondary text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                          {reward.description}
                        </p>
                      </div>
                      
                      {/* Enhanced Examples Section */}
                      <div className="space-y-3">
                        <p className="text-xs font-bold text-primary uppercase tracking-wider text-center group-hover:text-yellow-300 transition-colors duration-300">
                          {t('rewards.types.examples')}
                        </p>
                        <ul className="space-y-2">
                          {reward.examples.map((example, idx) => (
                            <li 
                              key={idx} 
                              className="flex items-center space-x-3 p-2 rounded-lg bg-black/20 group-hover:bg-black/30 transition-all duration-300 transform group-hover:translate-x-1"
                              style={{ animationDelay: `${idx * 100}ms` }}
                            >
                              <div className={`
                                w-2 h-2 rounded-full transition-all duration-300
                                bg-gradient-to-r ${reward.gradient} group-hover:animate-pulse
                              `} />
                              <span className="text-xs text-text-muted group-hover:text-white transition-colors duration-300 font-medium">
                                {example}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    {/* Bottom Glow Line */}
                    <div className={`
                      absolute bottom-0 left-0 right-0 h-1 rounded-b-3xl opacity-0 group-hover:opacity-100 
                      bg-gradient-to-r ${reward.gradient} transition-opacity duration-500
                    `} />
                  </div>
                  
                  {/* Floating Achievement Indicator */}
                  <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                    <div className={`
                      w-8 h-8 rounded-full bg-gradient-to-r ${reward.gradient} 
                      flex items-center justify-center shadow-lg animate-bounce
                    `}>
                      <Star className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Badge System Section */}
          <section className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
                {t('rewards.badges.title')}
              </h2>
              <p className="text-xl text-gray-800 max-w-2xl mx-auto">
                {t('rewards.badges.description')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {badges.map((badge, index) => (
                <div key={badge.id} className="group relative">
                  {/* Badge Card with Enhanced Interactions */}
                  <div className={`
                    relative p-6 bg-surface/50 rounded-3xl border-2 transition-all duration-500 cursor-pointer
                    hover:border-primary/50 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl
                    ${badge.rarity === 'legendary' ? 'hover:shadow-yellow-500/20 hover:border-yellow-400/30' : ''}
                    ${badge.rarity === 'epic' ? 'hover:shadow-purple-500/20 hover:border-purple-400/30' : ''}
                    ${badge.rarity === 'rare' ? 'hover:shadow-blue-500/20 hover:border-blue-400/30' : ''}
                    dopamine-hit
                  `}>
                    
                    {/* Rarity Glow Effect */}
                    <div className={`
                      absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500
                      ${badge.rarity === 'legendary' ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : ''}
                      ${badge.rarity === 'epic' ? 'bg-gradient-to-br from-purple-500 to-pink-500' : ''}
                      ${badge.rarity === 'rare' ? 'bg-gradient-to-br from-blue-500 to-cyan-500' : ''}
                      ${badge.rarity === 'common' ? 'bg-gradient-to-br from-gray-400 to-gray-600' : ''}
                    `} />
                    
                    {/* Floating Particles for Legendary */}
                    {badge.rarity === 'legendary' && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <Sparkles className="w-4 h-4 text-yellow-400 animate-twinkle" />
                        <Star className="absolute -top-1 -right-1 w-3 h-3 text-orange-400 animate-bounce" />
                      </div>
                    )}
                    
                    {/* Epic Particles */}
                    {badge.rarity === 'epic' && (
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <Zap className="w-4 h-4 text-purple-400 animate-pulse" />
                      </div>
                    )}
                    
                    <div className="relative z-10 flex items-start space-x-5">
                      {/* Enhanced Badge Icon */}
                      <div className="relative">
                        <div className={`
                          w-20 h-20 rounded-3xl p-4 shadow-xl transition-all duration-500 group-hover:rotate-6
                          bg-gradient-to-br ${badge.color} 
                          group-hover:scale-125 group-hover:shadow-2xl
                          ${badge.rarity === 'legendary' ? 'group-hover:animate-bounce' : ''}
                        `}>
                          <badge.icon className="w-full h-full text-white drop-shadow-lg" />
                        </div>
                        
                        {/* Pulsing Ring for High Rarity */}
                        {badge.rarity === 'legendary' && (
                          <div className="absolute inset-0 rounded-3xl border-2 border-yellow-400 animate-ping opacity-0 group-hover:opacity-75 transition-opacity duration-300" />
                        )}
                        
                        {/* XP Burst Animation */}
                        <div className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-bounce">
                            +{badge.xp.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 space-y-4 min-h-[120px]">
                        {/* Enhanced Header */}
                        <div className="flex items-start justify-between">
                          <h3 className="text-lg font-bold text-white group-hover:text-yellow-100 transition-colors duration-300">
                            {badge.name}
                          </h3>
                          
                          {/* Animated Rarity Badge */}
                          <div className="relative">
                            <Badge 
                              variant={badge.rarity === 'legendary' ? 'primary' : 'secondary'}
                              size="sm"
                              className={`
                                transition-all duration-300 transform group-hover:scale-110 font-bold
                                ${badge.rarity === 'legendary' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black animate-shimmer' : ''}
                                ${badge.rarity === 'epic' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : ''}
                                ${badge.rarity === 'rare' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' : ''}
                                ${badge.rarity === 'common' ? 'bg-gradient-to-r from-gray-400 to-gray-600 text-white' : ''}
                              `}
                            >
                              <span className="relative z-10">
                                {t(`rewards.badges.rarity.${badge.rarity}`)}
                              </span>
                            </Badge>
                            
                            {/* Crown for Legendary */}
                            {badge.rarity === 'legendary' && (
                              <Crown className="absolute -top-1 -right-1 w-3 h-3 text-yellow-400 animate-bounce opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            )}
                          </div>
                        </div>
                        
                        {/* Enhanced Description */}
                        <p className="text-sm text-text-secondary leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                          {badge.description}
                        </p>
                        
                        {/* Enhanced Requirements Section */}
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3 p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
                            <Target className="h-5 w-5 text-primary group-hover:animate-pulse" />
                            <span className="text-sm font-bold text-primary group-hover:text-white transition-colors duration-300">
                              {badge.requirement}
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-3 p-2 rounded-lg bg-yellow-500/10 group-hover:bg-yellow-500/20 transition-colors duration-300">
                            <Zap className="h-5 w-5 text-yellow-500 group-hover:animate-bounce" />
                            <span className="text-sm font-bold text-yellow-500 group-hover:text-yellow-300 transition-colors duration-300">
                              +{badge.xp.toLocaleString()} XP
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar Simulation for Engagement */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700 rounded-b-3xl overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className={`
                        h-full bg-gradient-to-r ${badge.color} transform -translate-x-full group-hover:translate-x-0 
                        transition-transform duration-1000 ease-out
                      `} />
                    </div>
                  </div>
                  
                  {/* Achievement Unlock Animation Trigger */}
                  <div 
                    className="absolute -inset-4 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {badge.rarity === 'legendary' && (
                      <>
                        <div className="absolute top-0 left-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-ping" />
                        <div className="absolute bottom-0 right-1/2 w-1 h-1 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                        <div className="absolute left-0 top-1/2 w-1 h-1 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
                        <div className="absolute right-0 bottom-1/2 w-1 h-1 bg-orange-300 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center p-6 rounded-2xl bg-surface/50 border border-primary/20">
              <Sparkles className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">{t('rewards.badges.repeatableBadges.title')}</h3>
              <p className="text-text-secondary">
                {t('rewards.badges.repeatableBadges.description')}
              </p>
            </div>
          </section>

          {/* Call-to-Action Section */}
          <section className="text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-display font-bold title-vibrant-purple">
                {t('rewards.cta.title')}
              </h2>
              <p className="text-xl text-white/95 max-w-2xl mx-auto">
                {t('rewards.cta.description')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                variant="gaming"
                size="xl"
                className="min-w-[250px] shadow-2xl"
                onClick={() => navigate('/auth/register')}
              >
                <Trophy className="mr-2 h-5 w-5" />
                {t('rewards.cta.primary')}
              </Button>
              <Button 
                variant="secondary" 
                size="lg"
                className="min-w-[200px]"
                onClick={() => navigate('/contests')}
              >
                <Eye className="mr-2 h-5 w-5" />
                {t('rewards.cta.secondary')}
              </Button>
            </div>
          </section>

          {/* Statistics Section */}
          <section>
            <div className="p-8 bg-surface/50 rounded-2xl border border-border/50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-500 p-4 mx-auto">
                    <Trophy className="w-full h-full text-white" />
                  </div>
                  <p className="text-lg font-semibold text-primary">Rewards</p>
                </div>
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 p-4 mx-auto">
                    <PartyPopper className="w-full h-full text-white" />
                  </div>
                  <p className="text-lg font-semibold text-accent">Parties</p>
                </div>
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-green-500 to-teal-500 p-4 mx-auto">
                    <Heart className="w-full h-full text-white" />
                  </div>
                  <p className="text-lg font-semibold text-success-green">Community</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}