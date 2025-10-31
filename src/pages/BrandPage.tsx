import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft, Users, TrendingUp, Target, BarChart3, Shield,
  Sparkles, Star, Trophy, Rocket, Heart, Eye, Crown, Mail,
  CheckCircle, DollarSign, Settings, Globe
} from 'lucide-react'
import { CosmicBackground } from '../components/ui'

export function BrandPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [scrollY, setScrollY] = useState(0)
  const statsRef = useRef<HTMLDivElement>(null)
  const whyRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
    <div className="relative min-h-screen bg-black overflow-hidden">
      <CosmicBackground />

      {/* Cinematic gradient overlays with parallax */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-transparent pointer-events-none"
        style={{ transform: `translateY(${scrollY * 0.3}px)` }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-cyan-900/10 via-transparent to-transparent pointer-events-none"
        style={{ transform: `translateY(${-scrollY * 0.2}px)` }}
      />

      <div className="relative z-10 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Minimal back button */}
          <button
            onClick={() => navigate('/')}
            className="group inline-flex items-center space-x-2 text-white/50 hover:text-white transition-all duration-500 mb-16"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform duration-500" />
            <span className="text-sm font-light tracking-wide">{t('brands.back_home')}</span>
          </button>

          {/* Cinematic Hero Section - Flowing Typography */}
          <div className="mb-32 relative">
            {/* Floating ambient light */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
              style={{ transform: `translate(-50%, ${scrollY * 0.1}px)` }}
            />

            <div className="relative text-center space-y-8">
              {/* Subtle badge */}
              <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-purple-500/20 backdrop-blur-sm mb-6">
                <Crown className="w-3.5 h-3.5 text-yellow-400/80" />
                <span className="text-yellow-400/80 text-xs font-light tracking-widest uppercase">For Brands</span>
              </div>

              {/* Large flowing title */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-tight">
                <span className="block text-white/95 mb-3">{t('brands.title')}</span>
                <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent font-normal">
                  {t('brands.subtitle')}
                </span>
              </h1>

              {/* Minimal decorative element */}
              <div className="flex items-center justify-center pt-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </div>
          </div>

          {/* TikTok Statistics - Flowing Asymmetric Layout */}
          <div ref={statsRef} className="mb-40 relative">
            {/* Section label */}
            <div className="flex items-center space-x-3 mb-12">
              <TrendingUp className="w-4 h-4 text-purple-400/60" />
              <p className="text-xs font-light tracking-widest uppercase text-white/40">
                {t('brands.stats.title')}
              </p>
            </div>

            {/* Flowing statistics without boxes */}
            <div className="space-y-20">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={`
                    flex items-center gap-12 group
                    ${index % 2 === 1 ? 'flex-row-reverse' : ''}
                  `}
                  style={{
                    opacity: 0,
                    animation: `slideInUp 0.8s ease-out ${index * 0.2}s forwards`
                  }}
                >
                  {/* Icon with subtle glow */}
                  <div className="flex-shrink-0">
                    <div className={`
                      relative w-16 h-16 sm:w-20 sm:h-20
                      bg-gradient-to-br ${stat.gradient} rounded-2xl p-4
                      opacity-80 group-hover:opacity-100
                      transition-all duration-700
                      group-hover:scale-110 group-hover:rotate-3
                    `}>
                      <stat.icon className="w-full h-full text-white" />
                      <div className={`
                        absolute inset-0 bg-gradient-to-br ${stat.gradient} rounded-2xl blur-xl opacity-0
                        group-hover:opacity-50 transition-opacity duration-700
                      `} />
                    </div>
                  </div>

                  {/* Content with flowing typography */}
                  <div className="flex-1 space-y-3">
                    <div className={`
                      text-4xl sm:text-5xl font-light tracking-tight
                      bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent
                      group-hover:scale-105 transition-transform duration-700 origin-left
                      ${index % 2 === 1 ? 'origin-right' : 'origin-left'}
                    `}>
                      {stat.value}
                    </div>
                    <p className="text-base sm:text-lg font-light text-white/70 leading-relaxed max-w-md group-hover:text-white/90 transition-colors duration-700">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtle divider */}
            <div className="mt-32 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Why SeeUTrending - Vertical Flowing Layout */}
          <div ref={whyRef} className="mb-40 relative">
            {/* Section header */}
            <div className="mb-20 text-center">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <CheckCircle className="w-4 h-4 text-green-400/60" />
                <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white/95">
                  {t('brands.whyUs.title')}
                </h2>
              </div>
              <div className="h-px w-20 mx-auto bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            {/* Flowing vertical list without boxes */}
            <div className="max-w-4xl mx-auto space-y-16">
              {whyPoints.map((point, index) => (
                <div
                  key={index}
                  className="group flex items-start gap-8 hover:translate-x-2 transition-transform duration-700"
                  style={{
                    opacity: 0,
                    animation: `slideInUp 0.8s ease-out ${index * 0.15 + 0.5}s forwards`
                  }}
                >
                  {/* Icon - minimal design */}
                  <div className="flex-shrink-0 pt-1">
                    <div className={`
                      relative w-14 h-14 rounded-xl
                      bg-gradient-to-br ${point.gradient} p-3.5
                      opacity-70 group-hover:opacity-100
                      transition-all duration-700
                      group-hover:scale-110 group-hover:rotate-6
                    `}>
                      <point.icon className="w-full h-full text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1 space-y-2">
                    <h3 className="text-2xl font-light text-white/95 group-hover:text-white transition-colors duration-700">
                      {point.title}
                    </h3>
                    <p className="text-base font-light text-white/60 leading-relaxed group-hover:text-white/80 transition-colors duration-700">
                      {point.description}
                    </p>
                  </div>

                  {/* Subtle number indicator */}
                  <div className="flex-shrink-0 pt-1">
                    <div className="text-6xl font-light text-white/5 group-hover:text-white/10 transition-colors duration-700">
                      {(index + 1).toString().padStart(2, '0')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtle divider */}
            <div className="mt-32 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* Key Values - Horizontal Flowing Showcase */}
          <div ref={valuesRef} className="mb-40 relative">
            {/* Section header */}
            <div className="mb-20 text-center">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Trophy className="w-4 h-4 text-yellow-400/60" />
                <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-white/95">
                  {t('brands.values.title')}
                </h2>
              </div>
              <div className="h-px w-20 mx-auto bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>

            {/* Flowing horizontal cards - minimal design */}
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-16 max-w-5xl mx-auto">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="group space-y-4"
                  style={{
                    opacity: 0,
                    animation: `slideInUp 0.8s ease-out ${index * 0.15 + 1}s forwards`
                  }}
                >
                  {/* Icon and title row */}
                  <div className="flex items-center gap-4">
                    <div className={`
                      w-12 h-12 rounded-xl bg-gradient-to-br ${value.gradient} p-3
                      opacity-70 group-hover:opacity-100
                      transition-all duration-700
                      group-hover:scale-110 group-hover:rotate-6
                    `}>
                      <value.icon className="w-full h-full text-white" />
                    </div>
                    <h3 className="text-xl font-light text-white/95 group-hover:text-white transition-colors duration-700">
                      {value.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-sm font-light text-white/60 leading-relaxed pl-16 group-hover:text-white/80 transition-colors duration-700">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Subtle divider */}
            <div className="mt-32 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {/* CTA Section - Elegant and Minimal */}
          <div className="text-center relative py-20">
            {/* Subtle ambient light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl" />

            <div className="relative space-y-12">
              {/* Section header */}
              <div className="space-y-6">
                <div className="flex items-center justify-center space-x-3">
                  <Mail className="w-5 h-5 text-purple-400/60" />
                  <h2 className="text-4xl sm:text-5xl font-light tracking-tight text-white/95">
                    {t('brands.cta.title')}
                  </h2>
                </div>
                <p className="text-lg font-light text-white/60 max-w-2xl mx-auto leading-relaxed">
                  {t('brands.cta.description')}
                </p>
              </div>

              {/* Clean email link */}
              <div className="pt-8">
                <a
                  href="mailto:brands@seeutrending.com"
                  className="group inline-flex items-center gap-4 px-12 py-5 rounded-full
                    bg-gradient-to-r from-purple-600/90 to-pink-600/90
                    hover:from-purple-600 hover:to-pink-600
                    border border-white/10
                    transition-all duration-700
                    hover:scale-105 hover:border-white/20
                    backdrop-blur-sm"
                >
                  <Mail className="w-5 h-5 text-white group-hover:rotate-12 transition-transform duration-700" />
                  <span className="text-lg font-light text-white tracking-wide">
                    {t('brands.cta.email')}
                  </span>
                  <Sparkles className="w-5 h-5 text-white/80 group-hover:text-white group-hover:rotate-180 transition-all duration-700" />
                </a>
              </div>

              {/* Minimal decorative element */}
              <div className="pt-12">
                <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
