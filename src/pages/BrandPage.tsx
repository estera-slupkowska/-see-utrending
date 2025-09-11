import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Users, TrendingUp, Target, BarChart3, Shield, Zap } from 'lucide-react'

export function BrandPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <div className="page-cyan-theme py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="relative max-w-4xl mx-auto z-20">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('brands.back_home')}</span>
        </button>

        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-display font-bold mb-6 title-vibrant-cyan drop-shadow-lg animate-pulse-glow">
            {t('brands.title')}
          </h1>
          <p className="text-xl sm:text-2xl text-white/95 mb-4 drop-shadow-sm">
            {t('brands.subtitle')}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-300 via-white to-cyan-300 mx-auto rounded-full animate-pulse"></div>
        </div>

        <div className="mb-16 text-center">
          <h2 className="text-3xl font-display font-bold mb-6 title-vibrant-cyan drop-shadow-lg">
            {t('brands.why_choose')}
          </h2>
          <p className="text-lg text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
            {t('brands.description')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <div className="card-clean">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 border-2 border-cyan-200 flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-cyan-700" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('brands.features.performance.title')}</h3>
            <p className="text-gray-700">
              {t('brands.features.performance.description')}
            </p>
          </div>

          <div className="card-clean">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-200 flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-blue-700" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('brands.features.engagement.title')}</h3>
            <p className="text-gray-700">
              {t('brands.features.engagement.description')}
            </p>
          </div>

          <div className="card-clean">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 border-2 border-cyan-200 flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-cyan-700" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('brands.features.gamification.title')}</h3>
            <p className="text-gray-700">
              {t('brands.features.gamification.description')}
            </p>
          </div>

          <div className="card-clean">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-200 flex items-center justify-center mb-4">
              <BarChart3 className="w-8 h-8 text-blue-700" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('brands.features.analytics.title')}</h3>
            <p className="text-gray-700">
              {t('brands.features.analytics.description')}
            </p>
          </div>

          <div className="card-clean">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 border-2 border-cyan-200 flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-cyan-700" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('brands.features.safety.title')}</h3>
            <p className="text-gray-700">
              {t('brands.features.safety.description')}
            </p>
          </div>

          <div className="card-clean">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-200 flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-blue-700" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">{t('brands.features.tailored.title')}</h3>
            <p className="text-gray-700">
              {t('brands.features.tailored.description')}
            </p>
          </div>
        </div>

        <div className="card-clean rounded-2xl p-8 mb-16">
          <div className="text-center">
            <h3 className="text-2xl font-display font-bold mb-4 text-gray-900">
              {t('brands.enterprise.title')}
            </h3>
            <p className="text-gray-700 mb-6">
              {t('brands.enterprise.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-cyan-700 mb-1">{t('brands.enterprise.custom_pricing')}</div>
                <div className="text-sm text-gray-600">Pricing</div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-blue-700 mb-1">24/7</div>
                <div className="text-sm text-gray-600">{t('brands.enterprise.support')}</div>
              </div>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-cyan-600 mb-1">99.9%</div>
                <div className="text-sm text-gray-600">{t('brands.enterprise.uptime')}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-3xl font-display font-bold mb-6 title-vibrant-cyan">
            {t('brands.cta.title')}
          </h3>
          <p className="text-lg text-white/95 mb-8 max-w-2xl mx-auto">
            {t('brands.cta.description')}
          </p>
          
          <div className="bg-gradient-to-br from-indigo-950/50 to-purple-950/30 border border-indigo-500/30 rounded-2xl p-8 max-w-md mx-auto backdrop-blur-sm">
            <div className="mb-6">
              <h4 className="text-xl font-semibold text-indigo-300 mb-4">{t('brands.cta.contact_title')}</h4>
              <p className="text-gray-300 mb-4">
                {t('brands.cta.contact_description')}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-3 p-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg border border-indigo-400/20">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
                <a 
                  href="mailto:brands@seeutrending.com" 
                  className="text-indigo-300 font-medium hover:text-indigo-200 transition-colors"
                >
                  {t('brands.cta.email')}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-400/20 rounded-lg px-6 py-3">
            <p className="text-indigo-300 font-medium">
              {t('brands.coming_soon')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}