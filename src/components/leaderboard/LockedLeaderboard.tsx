import { useTranslation } from 'react-i18next'
import { Lock, Trophy, Star, Award } from 'lucide-react'
import { Button, Badge } from '../ui'

export function LockedLeaderboard() {
  const { t } = useTranslation()

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Section title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold mb-4">
            <span className="gradient-text">{t('leaderboard.title')}</span>
          </h2>
        </div>

        {/* Locked leaderboard */}
        <div className="locked-content max-w-2xl mx-auto">
          {/* Lock icon */}
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-surface rounded-full border-2 border-border">
              <Lock className="w-8 h-8 text-text-muted" />
            </div>
          </div>

          {/* Content */}
          <h3 className="text-2xl font-display font-semibold text-text-primary mb-4">
            {t('leaderboard.locked.title')}
          </h3>
          
          <p className="text-text-secondary mb-8 text-lg">
            {t('leaderboard.locked.description')}
          </p>

          {/* Mock leaderboard preview */}
          <div className="mb-8 space-y-3 opacity-50">
            <div className="leaderboard-card rank-1">
              <div className="flex items-center space-x-3">
                <Trophy className="w-6 h-6" />
                <div className="w-8 h-8 bg-surface rounded-full"></div>
                <div className="w-24 h-4 bg-surface/50 rounded"></div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="xp" size="sm">1,250 XP</Badge>
                <div className="w-12 h-4 bg-surface/50 rounded"></div>
              </div>
            </div>
            
            <div className="leaderboard-card rank-2">
              <div className="flex items-center space-x-3">
                <Star className="w-6 h-6" />
                <div className="w-8 h-8 bg-surface rounded-full"></div>
                <div className="w-20 h-4 bg-surface/50 rounded"></div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="streak" size="sm">890 XP</Badge>
                <div className="w-10 h-4 bg-surface/50 rounded"></div>
              </div>
            </div>
            
            <div className="leaderboard-card rank-3">
              <div className="flex items-center space-x-3">
                <Award className="w-6 h-6" />
                <div className="w-8 h-8 bg-surface rounded-full"></div>
                <div className="w-28 h-4 bg-surface/50 rounded"></div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success" size="sm">650 XP</Badge>
                <div className="w-14 h-4 bg-surface/50 rounded"></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}