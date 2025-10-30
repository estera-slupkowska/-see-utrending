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
  Eye,
  Circle
} from 'lucide-react'
import { Button, Badge, CosmicBackground } from '../components/ui'

export function RewardsPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  // Legendary Badges (tylko organiczne wyświetlenia)
  const legendaryBadges = [
    {
      id: 'diamond-creator-contest',
      name: 'Diamentowy Twórca',
      nameEn: 'Diamond Creator',
      description: 'Jeśli łącznie Twoje filmiki w danym konkursie zdobędą więcej niż 1 milion wyświetleń',
      descriptionEn: 'If your videos in a given contest gain more than 1 million views in total',
      icon: Crown,
      color: 'from-yellow-400 via-yellow-500 to-orange-500',
      requirement: '1M+ views in contest',
      rarity: 'legendary',
      category: 'legendary',
      xp: 10000
    },
    {
      id: 'golden-viral',
      name: 'Złoty Viral',
      nameEn: 'Golden Viral',
      description: 'Dodatkowe punkty jeśli Twój filmik ma najwięcej wyświetleń w konkursie!',
      descriptionEn: 'Bonus points if your video has the most views in the contest!',
      icon: TrendingUp,
      color: 'from-yellow-500 to-yellow-600',
      requirement: 'Most views in contest',
      rarity: 'legendary',
      category: 'legendary',
      xp: 4000
    },
    {
      id: 'favorite-viral',
      name: 'Ulubiony Viral',
      nameEn: 'Favorite Viral',
      description: 'Dodatkowe punkty jeśli Twój filmik ma najwięcej like-ów w konkursie!',
      descriptionEn: 'Bonus points if your video has the most likes in the contest!',
      icon: Heart,
      color: 'from-pink-500 to-rose-600',
      requirement: 'Most likes in contest',
      rarity: 'legendary',
      category: 'legendary',
      xp: 4000
    },
    {
      id: 'silver-viral',
      name: 'Srebrny Viral',
      nameEn: 'Silver Viral',
      description: 'Dodatkowe punkty jeśli Twój filmik ma jako drugi najwięcej wyświetleń lub like-ów w konkursie!',
      descriptionEn: 'Bonus points if your video is the second most views or likes in the contest!',
      icon: Award,
      color: 'from-gray-300 to-gray-500',
      requirement: '2nd place (views/likes)',
      rarity: 'legendary',
      category: 'legendary',
      xp: 3000
    },
    {
      id: 'bronze-viral',
      name: 'Brązowy Viral',
      nameEn: 'Bronze Viral',
      description: 'Dodatkowe punkty jeśli Twój filmik jako trzeci ma najwięcej wyświetleń lub like-ów w konkursie!',
      descriptionEn: 'Bonus points if your video is the third most views or likes in the contest!',
      icon: Target,
      color: 'from-orange-600 to-amber-700',
      requirement: '3rd place (views/likes)',
      rarity: 'legendary',
      category: 'legendary',
      xp: 2000
    }
  ]

  // Epic Badges (tylko organiczne wyświetlenia)
  const epicBadges = [
    {
      id: 'diamond-creator-platform',
      name: 'Diamentowy Twórca',
      nameEn: 'Diamond Creator',
      description: 'Jeśli łącznie zdobędziesz dla platformy 5 milionów wyświetleń',
      descriptionEn: 'If you reach 5 million views for the platform',
      icon: Sparkles,
      color: 'from-cyan-400 via-blue-500 to-purple-600',
      requirement: '5M+ platform views',
      rarity: 'epic',
      category: 'epic',
      xp: 10000
    },
    {
      id: 'red-arrow',
      name: 'Czerwona Strzała',
      nameEn: 'Red Arrow',
      description: 'Dodatkowe punkty jeśli Twój filmik zdobędzie 100K like-ów',
      descriptionEn: 'Bonus points if your video reaches 100,000 likes',
      icon: Zap,
      color: 'from-red-500 to-red-700',
      requirement: '100K likes',
      rarity: 'epic',
      category: 'epic',
      xp: 2000
    }
  ]

  // Rare Badges (tylko organiczne wyświetlenia)
  const rareBadges = [
    {
      id: 'red-ring',
      name: 'Czerwony Pierścień',
      nameEn: 'Red Ring',
      description: 'Dodatkowe punkty jeśli Twój filmik zdobędzie 10K like-ów',
      descriptionEn: 'Bonus points if your video reaches 10,000 likes',
      icon: Circle,
      color: 'from-red-400 to-pink-500',
      requirement: '10K likes',
      rarity: 'rare',
      category: 'rare',
      xp: 400
    },
    {
      id: 'golden-thousand',
      name: 'Złoty Tysiąc',
      nameEn: 'Golden Thousand',
      description: 'Dodatkowe punkty jeśli założysz konto jako jedna z pierwszych 1000 osób',
      descriptionEn: 'Bonus points if you are one of the first 1,000 people to create an account',
      icon: Star,
      color: 'from-yellow-400 to-orange-500',
      requirement: 'First 1000 users',
      rarity: 'rare',
      category: 'rare',
      xp: 30
    }
  ]

  // Combine all badges for rendering
  const badges = [...legendaryBadges, ...epicBadges, ...rareBadges]

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

            {/* Special XP Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Views XP Card */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-surface/40 backdrop-blur-md rounded-3xl p-8 border-2 border-emerald-500/30">
                  <div className="space-y-6">
                    <div className="flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 p-5 shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                        <Eye className="w-full h-full text-white" />
                      </div>
                    </div>
                    <div className="text-center space-y-3">
                      <h3 className="text-2xl font-bold text-white">+10 XP za każde 1000 wyświetleń</h3>
                      <p className="text-lg text-text-secondary">Zbieraj XP automatycznie za wyświetlenia Twoich filmów!</p>
                    </div>
                    <div className="flex items-center justify-center space-x-4 text-lg">
                      <div className="flex items-center space-x-2 p-3 bg-emerald-500/20 rounded-xl">
                        <Eye className="w-5 h-5 text-emerald-400" />
                        <span className="font-bold text-white">1000 views</span>
                      </div>
                      <span className="text-2xl text-emerald-400">=</span>
                      <div className="flex items-center space-x-2 p-3 bg-xp-gold/20 rounded-xl">
                        <Zap className="w-5 h-5 text-xp-gold" />
                        <span className="font-bold text-xp-gold">+10 XP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Likes Bonus Card */}
              <div className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-surface/40 backdrop-blur-md rounded-3xl p-8 border-2 border-pink-500/30">
                  <div className="space-y-6">
                    <div className="flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-red-500 p-5 shadow-xl transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                        <Heart className="w-full h-full text-white" />
                      </div>
                    </div>
                    <div className="text-center space-y-3">
                      <div className="flex items-center justify-center space-x-2">
                        <h3 className="text-2xl font-bold text-white">+10 XP za każde 100 polubień</h3>
                        <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
                      </div>
                      <p className="text-lg text-text-secondary">Dodatkowe XP za zaangażowanie społeczności!</p>
                    </div>
                    <div className="flex items-center justify-center space-x-4 text-lg">
                      <div className="flex items-center space-x-2 p-3 bg-pink-500/20 rounded-xl">
                        <Heart className="w-5 h-5 text-pink-400" />
                        <span className="font-bold text-white">100 likes</span>
                      </div>
                      <span className="text-2xl text-pink-400">=</span>
                      <div className="flex items-center space-x-2 p-3 bg-xp-gold/20 rounded-xl">
                        <Zap className="w-5 h-5 text-xp-gold" />
                        <span className="font-bold text-xp-gold">+10 XP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
                            {i18n.language === 'en' ? badge.nameEn : badge.name}
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
                          {i18n.language === 'en' ? badge.descriptionEn : badge.description}
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