import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft, Users, TrendingUp, Target, BarChart3, Shield, Zap,
  Sparkles, Star, Trophy, Rocket, Heart, Eye, Crown, Gift, Mail,
  CheckCircle, DollarSign, Settings, Globe
} from 'lucide-react'
import { CosmicBackground } from '../components/ui'

export function BrandPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [hoveredStat, setHoveredStat] = useState<number | null>(null)
  const [hoveredWhy, setHoveredWhy] = useState<number | null>(null)
  const [hoveredValue, setHoveredValue] = useState<number | null>(null)

  // TikTok Statistics for Poland
  const stats = [
    {
      value: t('brands.stats.stat1.value'),
      label: t('brands.stats.stat1.label'),
      icon: Users,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      value: t('brands.stats.stat2.value'),
      label: t('brands.stats.stat2.label'),
      icon: TrendingUp,
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      value: t('brands.stats.stat3.value'),
      label: t('brands.stats.stat3.label'),
      icon: Target,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      value: t('brands.stats.stat4.value'),
      label: t('brands.stats.stat4.label'),
      icon: Rocket,
      gradient: 'from-yellow-500 to-orange-500'
    }
  ]

  // Why SeeUTrending - 5 points
  const whyPoints = [
    {
      icon: BarChart3,
      title: t('brands.whyUs.transparent.title'),
      description: t('brands.whyUs.transparent.description'),
      gradient: 'from-blue-500 to-cyan-500',
      emoji: '📊'
    },
    {
      icon: Heart,
      title: t('brands.whyUs.community.title'),
      description: t('brands.whyUs.community.description'),
      gradient: 'from-pink-500 to-red-500',
      emoji: '❤️'
    },
    {
      icon: Settings,
      title: t('brands.whyUs.tailored.title'),
      description: t('brands.whyUs.tailored.description'),
      gradient: 'from-purple-500 to-indigo-500',
      emoji: '⚙️'
    },
    {
      icon: Shield,
      title: t('brands.whyUs.safety.title'),
      description: t('brands.whyUs.safety.description'),
      gradient: 'from-green-500 to-emerald-500',
      emoji: '🛡️'
    },
    {
      icon: DollarSign,
      title: t('brands.whyUs.pricing.title'),
      description: t('brands.whyUs.pricing.description'),
      gradient: 'from-yellow-500 to-orange-500',
      emoji: '💰'
    }
  ]

  // 4 Key Values
  const values = [
    {
      icon: Target,
      title: t('brands.values.customization.title'),
      description: t('brands.values.customization.description'),
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: Eye,
      title: t('brands.values.transparency.title'),
      description: t('brands.values.transparency.description'),
      gradient: 'from-cyan-500 to-blue-500'
    },
    {
      icon: Globe,
      title: t('brands.values.accessibility.title'),
      description: t('brands.values.accessibility.description'),
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Trophy,
      title: t('brands.values.bestPrice.title'),
      description: t('brands.values.bestPrice.description'),
      gradient: 'from-yellow-500 to-orange-500'
    }
  ]

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden">
      <CosmicBackground />

      {/* Hero gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-cyan-900/20 pointer-events-none" />

      <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            className="group inline-flex items-center space-x-2 text-white/70 hover:text-white transition-all duration-300 mb-12 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">{t('brands.back_home')}</span>
          </button>

          {/* Hero Section */}
          <div className="text-center mb-20 relative">
            {/* Floating decorations */}
            <div className="absolute -top-10 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-float-slow" />
            <div className="absolute -top-5 right-20 w-16 h-16 bg-cyan-500/20 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}} />
            <div className="absolute top-40 left-1/4 w-12 h-12 bg-pink-500/20 rounded-full blur-xl animate-pulse-slow" />

            <div className="relative">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 px-4 py-2 rounded-full border border-purple-500/30 mb-8 animate-pulse-glow">
                <Crown className="w-4 h-4 text-yellow-400 animate-bounce" />
                <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">For Brands</span>
              </div>

              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-display font-bold mb-6 animate-pulse-glow">
                <span className="gradient-text drop-shadow-2xl">
                  {t('brands.title')}
                </span>
              </h1>

              <p className="text-2xl sm:text-3xl text-white/90 mb-8 max-w-3xl mx-auto drop-shadow-lg">
                {t('brands.subtitle')}
              </p>

              {/* Decorative line */}
              <div className="flex items-center justify-center space-x-4 mb-12">
                <div className="h-0.5 w-20 bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                <Sparkles className="w-6 h-6 text-yellow-400 animate-spin" style={{animationDuration: '3s'}} />
                <div className="h-0.5 w-20 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
              </div>
            </div>
          </div>

          {/* TikTok Statistics Section */}
          <div className="mb-24">
            <h2 className="text-4xl font-display font-bold text-center mb-4">
              <span className="gradient-text">{t('brands.stats.title')}</span>
            </h2>
            <div className="flex items-center justify-center space-x-3 mb-16">
              <TrendingUp className="w-5 h-5 text-primary animate-pulse" />
              <p className="text-lg text-text-secondary">Polish TikTok Market Insights</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group relative"
                  onMouseEnter={() => setHoveredStat(index)}
                  onMouseLeave={() => setHoveredStat(null)}
                >
                  <div className={`
                    relative bg-surface/50 backdrop-blur-sm rounded-2xl p-8 border-2 transition-all duration-500
                    ${hoveredStat === index
                      ? 'border-transparent shadow-2xl transform -translate-y-2 scale-105'
                      : 'border-border/40'
                    }
                  `}>
                    {/* Gradient overlay */}
                    <div className={`
                      absolute inset-0 rounded-2xl bg-gradient-to-br ${stat.gradient} opacity-0 transition-opacity duration-500
                      ${hoveredStat === index ? 'opacity-10' : ''}
                    `} />

                    <div className="relative z-10 text-center space-y-4">
                      <div className={`
                        w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${stat.gradient} p-4 shadow-lg
                        transition-all duration-500
                        ${hoveredStat === index ? 'scale-110 rotate-6 animate-neural-pulse' : ''}
                      `}>
                        <stat.icon className="w-full h-full text-white" />
                      </div>

                      <div className={`
                        text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent
                        ${hoveredStat === index ? 'animate-excitement-bounce' : ''}
                      `}>
                        {stat.value}
                      </div>

                      <p className={`
                        text-sm leading-relaxed transition-colors duration-300
                        ${hoveredStat === index ? 'text-white' : 'text-text-secondary'}
                      `}>
                        {stat.label}
                      </p>
                    </div>

                    {/* Bottom glow */}
                    <div className={`
                      absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r ${stat.gradient}
                      transition-opacity duration-500
                      ${hoveredStat === index ? 'opacity-100 animate-shimmer' : 'opacity-0'}
                    `} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why SeeUTrending Section - 5 Points */}
          <div className="mb-24">
            <h2 className="text-4xl font-display font-bold text-center mb-4">
              <span className="gradient-text">{t('brands.whyUs.title')}</span>
            </h2>
            <div className="flex items-center justify-center space-x-3 mb-16">
              <CheckCircle className="w-5 h-5 text-green-400 animate-pulse" />
              <p className="text-lg text-text-secondary">Your competitive advantages</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {whyPoints.map((point, index) => (
                <div
                  key={index}
                  className={`group relative ${index === 4 ? 'md:col-span-2 lg:col-span-1 lg:col-start-2' : ''}`}
                  onMouseEnter={() => setHoveredWhy(index)}
                  onMouseLeave={() => setHoveredWhy(null)}
                >
                  <div className={`
                    relative h-full p-8 bg-surface/50 backdrop-blur-sm rounded-3xl border-2 transition-all duration-500
                    ${hoveredWhy === index
                      ? 'border-transparent shadow-2xl transform -translate-y-3 scale-105'
                      : 'border-border/40'
                    }
                  `}>
                    {/* Gradient overlay */}
                    <div className={`
                      absolute inset-0 rounded-3xl bg-gradient-to-br ${point.gradient} opacity-0 transition-opacity duration-500
                      ${hoveredWhy === index ? 'opacity-10 animate-anticipation-glow' : ''}
                    `} />

                    <div className="relative z-10 space-y-6">
                      {/* Icon */}
                      <div className="relative">
                        <div className={`
                          w-20 h-20 rounded-2xl bg-gradient-to-br ${point.gradient} p-5 shadow-xl
                          transition-all duration-500
                          ${hoveredWhy === index ? 'scale-125 rotate-6 animate-gamification-level-up' : ''}
                        `}>
                          <point.icon className="w-full h-full text-white" />
                        </div>

                        {/* Emoji decoration */}
                        <div className={`
                          absolute -top-2 -right-2 text-3xl transition-all duration-500
                          ${hoveredWhy === index ? 'scale-125 rotate-12 animate-bounce' : 'scale-0'}
                        `}>
                          {point.emoji}
                        </div>

                        {/* Orbiting particles */}
                        {hoveredWhy === index && (
                          <>
                            <div className="absolute inset-0 animate-orbit-slow">
                              <div className="absolute top-0 left-1/2 w-2 h-2 bg-yellow-400 rounded-full -translate-x-1/2 -translate-y-4" />
                            </div>
                            <div className="absolute inset-0 animate-orbit-reverse">
                              <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-pink-400 rounded-full -translate-x-1/2 translate-y-4" />
                            </div>
                          </>
                        )}
                      </div>

                      {/* Content */}
                      <div>
                        <h3 className={`
                          text-2xl font-bold mb-3 transition-colors duration-300
                          ${hoveredWhy === index ? 'text-white' : 'text-text-primary'}
                        `}>
                          {point.title}
                        </h3>
                        <p className={`
                          text-base leading-relaxed transition-colors duration-300
                          ${hoveredWhy === index ? 'text-white/90' : 'text-text-secondary'}
                        `}>
                          {point.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom glow */}
                    <div className={`
                      absolute bottom-0 left-0 right-0 h-1 rounded-b-3xl bg-gradient-to-r ${point.gradient}
                      transition-opacity duration-500
                      ${hoveredWhy === index ? 'opacity-100 animate-viral-shimmer' : 'opacity-0'}
                    `} />
                  </div>

                  {/* Floating star badge */}
                  {hoveredWhy === index && (
                    <div className="absolute -top-4 -right-4 animate-achievement-unlock">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${point.gradient} flex items-center justify-center shadow-xl`}>
                        <Star className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 4 Key Values Section */}
          <div className="mb-24">
            <div className="relative bg-gradient-to-br from-purple-900/30 via-slate-900/50 to-cyan-900/30 backdrop-blur-md rounded-3xl p-12 border border-purple-500/20 overflow-hidden">
              {/* Background decorations */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '1s'}} />

              <div className="relative z-10">
                <div className="text-center mb-12">
                  <div className="inline-flex items-center space-x-2 mb-4">
                    <Trophy className="w-6 h-6 text-yellow-400 animate-bounce" />
                    <h2 className="text-4xl font-display font-bold gradient-text">
                      {t('brands.values.title')}
                    </h2>
                    <Trophy className="w-6 h-6 text-yellow-400 animate-bounce" style={{animationDelay: '0.2s'}} />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {values.map((value, index) => (
                    <div
                      key={index}
                      className="group relative"
                      onMouseEnter={() => setHoveredValue(index)}
                      onMouseLeave={() => setHoveredValue(null)}
                    >
                      <div className={`
                        relative bg-slate-950/50 backdrop-blur-sm rounded-2xl p-8 border-2 transition-all duration-500
                        ${hoveredValue === index
                          ? 'border-transparent shadow-2xl -translate-y-2 scale-105'
                          : 'border-border/40'
                        }
                      `}>
                        {/* Hover gradient */}
                        <div className={`
                          absolute inset-0 rounded-2xl bg-gradient-to-br ${value.gradient} opacity-0 transition-opacity duration-500
                          ${hoveredValue === index ? 'opacity-10 animate-social-proof-pulse' : ''}
                        `} />

                        <div className="relative z-10 text-center space-y-4">
                          <div className={`
                            w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${value.gradient} p-4 shadow-lg
                            transition-all duration-500
                            ${hoveredValue === index ? 'scale-110 rotate-6 animate-reward-celebrate' : ''}
                          `}>
                            <value.icon className="w-full h-full text-white" />
                          </div>

                          <div className={`
                            text-2xl font-bold transition-colors duration-300
                            ${hoveredValue === index ? 'text-white animate-neural-pulse' : 'text-text-primary'}
                          `}>
                            {value.title}
                          </div>

                          <p className={`
                            text-sm leading-relaxed transition-colors duration-300
                            ${hoveredValue === index ? 'text-white/90' : 'text-text-secondary'}
                          `}>
                            {value.description}
                          </p>
                        </div>

                        {/* Orbiting decoration on hover */}
                        {hoveredValue === index && (
                          <div className="absolute inset-0 animate-spin" style={{animationDuration: '4s'}}>
                            <div className="absolute top-0 left-1/2 w-2 h-2 bg-yellow-400 rounded-full -translate-x-1/2 -translate-y-2" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center relative">
            {/* Background particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full animate-float-slow"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${20 + Math.random() * 40}px`,
                    height: `${20 + Math.random() * 40}px`,
                    background: i % 2 === 0
                      ? 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)'
                      : 'radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)',
                    animationDelay: `${i * 0.5}s`,
                    animationDuration: `${6 + Math.random() * 4}s`
                  }}
                />
              ))}
            </div>

            <div className="relative">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Mail className="w-8 h-8 text-primary animate-pulse" />
                <h2 className="text-5xl font-display font-bold gradient-text">
                  {t('brands.cta.title')}
                </h2>
                <Mail className="w-8 h-8 text-accent animate-pulse" style={{animationDelay: '0.3s'}} />
              </div>

              <p className="text-2xl text-white/80 mb-12 max-w-2xl mx-auto">
                {t('brands.cta.description')}
              </p>

              {/* Contact Card */}
              <div className="max-w-md mx-auto">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-glow" />

                  <div className="relative bg-slate-950 rounded-3xl p-10 border-2 border-purple-500/30">
                    <div className="space-y-8">
                      <div className="flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-5 shadow-xl animate-bounce group-hover:animate-reward-celebrate">
                          <Mail className="w-full h-full text-white" />
                        </div>
                      </div>

                      <a
                        href="mailto:brands@seeutrending.com"
                        className="group/button relative block overflow-hidden"
                      >
                        <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-5 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                          <div className="flex items-center justify-center space-x-3">
                            <Sparkles className="w-6 h-6 text-white group-hover/button:animate-spin" />
                            <span className="text-xl font-bold text-white">
                              {t('brands.cta.email')}
                            </span>
                            <Sparkles className="w-6 h-6 text-white group-hover/button:animate-spin" style={{animationDelay: '0.2s'}} />
                          </div>

                          {/* Shimmer effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover/button:translate-x-full transition-transform duration-1000" />
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
