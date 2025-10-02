import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft, BookOpen, Target, TrendingUp, Video, Lightbulb,
  Award, Users, Zap, Eye, Heart, MessageCircle, Share2,
  Sparkles, Star, Trophy, Crown, PlayCircle, CheckCircle
} from 'lucide-react'
import { CosmicBackground } from '../components/ui'

export function EducationHubPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [hoveredModule, setHoveredModule] = useState<number | null>(null)

  const learningModules = [
    {
      icon: Target,
      title: 'Content Strategy Basics',
      description: 'Learn how to plan viral content that resonates with Gen Z',
      gradient: 'from-red-500 to-orange-500',
      emoji: '🎯',
      lessons: 5,
      duration: '45 min'
    },
    {
      icon: TrendingUp,
      title: 'Viral Patterns',
      description: 'Understand what makes content go viral on TikTok',
      gradient: 'from-green-500 to-emerald-500',
      emoji: '📈',
      lessons: 8,
      duration: '60 min'
    },
    {
      icon: Video,
      title: 'Video Production',
      description: 'Professional filming and editing techniques for creators',
      gradient: 'from-purple-500 to-pink-500',
      emoji: '🎬',
      lessons: 6,
      duration: '50 min'
    },
    {
      icon: Lightbulb,
      title: 'Creative Ideation',
      description: 'Generate endless content ideas that engage your audience',
      gradient: 'from-yellow-500 to-orange-500',
      emoji: '💡',
      lessons: 4,
      duration: '30 min'
    },
    {
      icon: Eye,
      title: 'Engagement Optimization',
      description: 'Boost views, likes, and comments with proven tactics',
      gradient: 'from-blue-500 to-cyan-500',
      emoji: '👁️',
      lessons: 7,
      duration: '55 min'
    },
    {
      icon: Users,
      title: 'Building Your Community',
      description: 'Grow and nurture a loyal follower base',
      gradient: 'from-indigo-500 to-purple-500',
      emoji: '👥',
      lessons: 6,
      duration: '45 min'
    },
    {
      icon: Heart,
      title: 'Brand Collaborations',
      description: 'Work with brands and monetize your content effectively',
      gradient: 'from-pink-500 to-red-500',
      emoji: '💝',
      lessons: 5,
      duration: '40 min'
    },
    {
      icon: Trophy,
      title: 'Contest Mastery',
      description: 'Win contests and competitions with strategic submissions',
      gradient: 'from-yellow-400 to-orange-500',
      emoji: '🏆',
      lessons: 4,
      duration: '35 min'
    }
  ]

  const successStories = [
    { stat: '500K+', label: 'Views Generated', icon: Eye },
    { stat: '10K+', label: 'Creators Trained', icon: Users },
    { stat: '95%', label: 'Success Rate', icon: Trophy }
  ]

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden">
      <CosmicBackground />

      {/* Hero gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 via-transparent to-blue-900/20 pointer-events-none" />

      <div className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            className="group inline-flex items-center space-x-2 text-white/70 hover:text-white transition-all duration-300 mb-12 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">{t('common.back')}</span>
          </button>

          {/* Hero Section */}
          <div className="text-center mb-20 relative">
            {/* Floating decorations */}
            <div className="absolute -top-10 left-10 w-20 h-20 bg-cyan-500/20 rounded-full blur-xl animate-float-slow" />
            <div className="absolute -top-5 right-20 w-16 h-16 bg-blue-500/20 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}} />
            <div className="absolute top-40 left-1/4 w-12 h-12 bg-green-500/20 rounded-full blur-xl animate-pulse-slow" />

            <div className="relative">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 rounded-full border border-cyan-500/30 mb-8 animate-pulse-glow">
                <BookOpen className="w-4 h-4 text-cyan-400 animate-bounce" />
                <span className="text-cyan-400 font-bold text-sm uppercase tracking-wider">Education Hub</span>
              </div>

              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-display font-bold mb-6 animate-pulse-glow">
                <span className="gradient-text drop-shadow-2xl">
                  {t('education.title')}
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-8 leading-relaxed">
                {t('education.subtitle')}
              </p>

              {/* Success Stats */}
              <div className="flex flex-wrap justify-center gap-8 mb-12">
                {successStories.map((story, index) => {
                  const Icon = story.icon
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-3 bg-white/5 backdrop-blur-sm rounded-2xl px-6 py-3 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 hover:scale-105"
                    >
                      <Icon className="w-6 h-6 text-cyan-400" />
                      <div>
                        <div className="text-2xl font-bold text-white">{story.stat}</div>
                        <div className="text-xs text-white/60">{story.label}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Learning Modules Grid */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display font-bold text-white mb-4">
                <span className="gradient-text">Learning Modules</span>
              </h2>
              <p className="text-white/70 text-lg">
                Master the art of viral content creation with our comprehensive courses
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {learningModules.map((module, index) => {
                const Icon = module.icon
                return (
                  <div
                    key={index}
                    onMouseEnter={() => setHoveredModule(index)}
                    onMouseLeave={() => setHoveredModule(null)}
                    className="group relative"
                  >
                    {/* Glow effect */}
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${module.gradient} rounded-3xl blur opacity-30 group-hover:opacity-75 transition-opacity duration-500`} />

                    {/* Card content */}
                    <div className="relative bg-slate-900 rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105 hover:-translate-y-2 h-full">
                      {/* Icon */}
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${module.gradient} p-4 mb-4 shadow-lg transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                        <Icon className="w-full h-full text-white" />
                      </div>

                      {/* Emoji badge */}
                      <div className="absolute top-4 right-4 text-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-300 group-hover:animate-bounce">
                        {module.emoji}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-400 transition-all duration-300">
                        {module.title}
                      </h3>

                      {/* Description */}
                      <p className="text-white/60 text-sm mb-4 leading-relaxed">
                        {module.description}
                      </p>

                      {/* Meta info */}
                      <div className="flex items-center justify-between text-xs text-white/40 mb-4">
                        <div className="flex items-center space-x-1">
                          <PlayCircle className="w-3 h-3" />
                          <span>{module.lessons} lessons</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Zap className="w-3 h-3" />
                          <span>{module.duration}</span>
                        </div>
                      </div>

                      {/* Coming Soon badge */}
                      <div className="flex items-center justify-center space-x-2 py-2 px-4 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-xl border border-cyan-500/30">
                        <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
                        <span className="text-cyan-400 font-semibold text-sm">Coming Soon</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* CTA Section */}
          <div className="relative">
            {/* Glow background */}
            <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl" />

            <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-sm rounded-3xl p-12 border border-white/10 text-center">
              <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-6 animate-bounce" />

              <h2 className="text-4xl font-display font-bold text-white mb-4">
                Be the First to Learn
              </h2>

              <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
                {t('education.notify.description')}
              </p>

              <button
                onClick={() => navigate('/auth/register')}
                className="group relative inline-flex items-center space-x-3 px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl font-bold text-xl text-white shadow-xl hover:shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-110 overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-3">
                  <Trophy className="w-6 h-6 animate-pulse" />
                  <span>🚀 {t('education.notify.cta')}</span>
                  <Star className="w-6 h-6 group-hover:animate-spin" />
                </span>

                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>

              {/* Trust indicators */}
              <div className="flex items-center justify-center space-x-8 mt-8 text-sm text-white/50">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Free Forever</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Expert Instructors</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Lifetime Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
