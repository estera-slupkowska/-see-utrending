import { useState, useEffect } from 'react'
import { Badge } from '../ui'
import { Star, Zap, Crown, Trophy, Target, Flame } from 'lucide-react'

interface XPProgressBarProps {
  currentXP?: number
  currentLevel?: number
  maxXP?: number
}

export function XPProgressBar({ currentXP = 0, currentLevel = 1, maxXP }: XPProgressBarProps) {
  const [displayXP, setDisplayXP] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Level configuration
  const levels = [
    { level: 1, name: 'Rookie', minXP: 0, maxXP: 100, color: 'text-gray-400', bgColor: 'bg-gray-400' },
    { level: 2, name: 'Rising Star', minXP: 100, maxXP: 250, color: 'text-blue-400', bgColor: 'bg-blue-400' },
    { level: 3, name: 'Trendsetter', minXP: 250, maxXP: 500, color: 'text-purple-400', bgColor: 'bg-purple-400' },
    { level: 4, name: 'Viral Creator', minXP: 500, maxXP: 1000, color: 'text-pink-400', bgColor: 'bg-pink-400' },
    { level: 5, name: 'Icon', minXP: 1000, maxXP: 2500, color: 'text-xp-gold', bgColor: 'bg-xp-gold' },
    { level: 6, name: 'Legend', minXP: 2500, maxXP: 10000, color: 'text-xp-gold', bgColor: 'bg-xp-gold' }
  ]

  const currentLevelData = levels.find(l => l.level === currentLevel) || levels[0]
  const nextLevelData = levels.find(l => l.level === currentLevel + 1)
  
  const levelMaxXP = maxXP || currentLevelData.maxXP
  const progressPercentage = Math.min((currentXP / levelMaxXP) * 100, 100)
  const xpToNextLevel = nextLevelData ? nextLevelData.minXP - currentXP : 0

  // Animation effect for XP changes
  useEffect(() => {
    if (currentXP > displayXP) {
      setIsAnimating(true)
      const timer = setInterval(() => {
        setDisplayXP(prev => {
          if (prev >= currentXP) {
            setIsAnimating(false)
            clearInterval(timer)
            return currentXP
          }
          return prev + Math.ceil((currentXP - prev) / 10)
        })
      }, 50)
      return () => clearInterval(timer)
    } else {
      setDisplayXP(currentXP)
    }
  }, [currentXP, displayXP])

  const getLevelIcon = (level: number) => {
    switch (level) {
      case 1: return <Target className="w-4 h-4" />
      case 2: return <Star className="w-4 h-4" />
      case 3: return <Zap className="w-4 h-4" />
      case 4: return <Flame className="w-4 h-4" />
      case 5: return <Crown className="w-4 h-4" />
      case 6: return <Trophy className="w-4 h-4" />
      default: return <Star className="w-4 h-4" />
    }
  }

  return (
    <div className="card-clean">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 ${currentLevelData.bgColor}/10 rounded-lg`}>
            <div className={currentLevelData.color}>
              {getLevelIcon(currentLevel)}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-text-primary">
              Level {currentLevel} - {currentLevelData.name}
            </h3>
            <p className="text-sm text-text-secondary">
              {displayXP.toLocaleString('pl-PL')} / {levelMaxXP.toLocaleString('pl-PL')} XP
            </p>
          </div>
        </div>
        
        {nextLevelData && (
          <div className="text-right">
            <Badge variant="secondary" size="sm">
              {xpToNextLevel > 0 ? `${xpToNextLevel.toLocaleString('pl-PL')} XP do następnego poziomu` : 'Maksymalny poziom!'}
            </Badge>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full bg-surface rounded-full h-3 overflow-hidden">
          <div
            className={`h-full ${currentLevelData.bgColor} transition-all duration-1000 ease-out relative overflow-hidden`}
            style={{ width: `${progressPercentage}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>
        
        {/* XP gain animation */}
        {isAnimating && (
          <div className="absolute -top-8 right-4 text-xs font-bold text-success-green animate-bounce">
            +{Math.abs(currentXP - (displayXP - (currentXP - displayXP)))} XP
          </div>
        )}
      </div>

      {/* Level progression preview */}
      {nextLevelData && (
        <div className="mt-3 p-2 bg-surface/50 rounded-lg">
          <div className="flex items-center justify-between text-xs text-text-muted">
            <span>Następny poziom:</span>
            <div className="flex items-center gap-1">
              <div className={nextLevelData.color}>
                {getLevelIcon(nextLevelData.level)}
              </div>
              <span className={nextLevelData.color}>{nextLevelData.name}</span>
            </div>
          </div>
        </div>
      )}

      {/* XP Sources Info */}
      <div className="mt-4 pt-3 border-t border-border">
        <h4 className="text-sm font-semibold text-text-primary mb-2">Sposoby zdobywania XP:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-text-secondary">
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-success-green rounded-full" />
            Udział w konkursie: 10 XP
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-primary rounded-full" />
            1000 wyświetleń: 1 XP
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-xp-gold rounded-full" />
            Wygrana (1. miejsce): 5000 XP
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1 h-1 bg-purple-400 rounded-full" />
            Seria 7 dni: 50 XP bonus
          </div>
        </div>
      </div>
    </div>
  )
}