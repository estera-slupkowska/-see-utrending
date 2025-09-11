import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Lock, BookOpen, Target, TrendingUp } from 'lucide-react'
import { Button } from '../components/ui'

export function EducationHubPage() {
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
          <span>{t('common.back')}</span>
        </button>

        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-display font-bold mb-6 title-vibrant-cyan drop-shadow-lg animate-pulse-glow">
            {t('education.title')}
          </h1>
          <p className="text-xl sm:text-2xl text-white/95 mb-4 drop-shadow-sm">
            {t('education.subtitle')}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-300 via-white to-cyan-300 mx-auto rounded-full animate-pulse"></div>
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300 rounded-full mb-6 relative">
              <Lock className="w-16 h-16 text-gray-600 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-2 border-gray-400/40 animate-ping"></div>
            </div>
          </div>

          <div className="card-clean rounded-2xl p-8 mb-8">
            <h2 className="text-3xl font-display font-bold mb-4 text-gray-900">
              {t('education.coming_soon.title')}
            </h2>
            
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              {t('education.coming_soon.description')}
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-blue-100 border-2 border-cyan-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="w-8 h-8 text-cyan-700" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{t('education.features.strategy.title')}</h3>
                <p className="text-sm text-gray-600">{t('education.features.strategy.description')}</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 border-2 border-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-8 h-8 text-blue-700" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{t('education.features.viral.title')}</h3>
                <p className="text-sm text-gray-600">{t('education.features.viral.description')}</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-blue-100 border-2 border-cyan-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-8 h-8 text-cyan-700" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{t('education.features.guides.title')}</h3>
                <p className="text-sm text-gray-600">{t('education.features.guides.description')}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl p-6 border border-cyan-200">
            <h3 className="text-xl font-semibold mb-3 text-cyan-800">
              {t('education.notify.title')}
            </h3>
            <p className="text-gray-700 mb-4">
              {t('education.notify.description')}
            </p>
            <button 
              className="px-8 py-4 btn-vibrant-cyan min-w-[200px]"
              onClick={() => navigate('/auth/register')}
            >
              🚀 {t('education.notify.cta')}
            </button>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 text-white/80">
            <div className="w-2 h-2 bg-white/90 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse delay-75"></div>
            <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse delay-150"></div>
            <span className="ml-4 text-sm drop-shadow-sm">{t('education.progress')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}