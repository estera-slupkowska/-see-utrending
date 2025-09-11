import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Star, Trophy, TrendingUp } from 'lucide-react'
import { type UserStats, type UserLevel, LEVEL_CONFIGS } from '../../stores/gamification.store'

interface XPDisplayProps {
  userStats: UserStats
  showDetails?: boolean
  size?: 'small' | 'medium' | 'large'
  animated?: boolean
}

const levelIcons = {
  rookie: '🌱',
  rising_star: '⭐',
  trendsetter: '🔥',
  viral_sensation: '🚀',
  icon: '👑'
}

export function XPDisplay({ userStats, showDetails = false, size = 'medium', animated = true }: XPDisplayProps) {
  const currentLevelConfig = LEVEL_CONFIGS.find(l => l.level === userStats.level) || LEVEL_CONFIGS[0]
  const nextLevelConfig = LEVEL_CONFIGS.find(l => l.xp_required > userStats.total_xp)
  
  const progressPercent = userStats.level_progress
  const xpToNext = nextLevelConfig ? nextLevelConfig.xp_required - userStats.total_xp : 0

  const sizeStyles = {
    small: {
      container: 'p-3',
      xp: 'text-lg',
      level: 'text-sm',
      progress: 'h-2',
      icon: 'text-lg'
    },
    medium: {
      container: 'p-4',
      xp: 'text-xl',
      level: 'text-base',
      progress: 'h-3',
      icon: 'text-2xl'
    },
    large: {
      container: 'p-6',
      xp: 'text-3xl',
      level: 'text-xl',
      progress: 'h-4',
      icon: 'text-4xl'
    }
  }

  const styles = sizeStyles[size]

  return (
    <div className={`bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 ${styles.container}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`${styles.icon}`}>
            {levelIcons[userStats.level]}
          </div>
          <div>
            <div className={`font-bold text-white ${styles.level}`}>
              {currentLevelConfig.name}
            </div>
            <div className="text-gray-400 text-xs">
              Level {LEVEL_CONFIGS.findIndex(l => l.level === userStats.level) + 1}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className={`font-bold text-primary ${styles.xp}`}>
            {userStats.total_xp.toLocaleString()}
          </div>
          <div className="text-gray-400 text-xs flex items-center">
            <Zap className="w-3 h-3 mr-1" />
            XP
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-2">
        <div className={`bg-gray-700 rounded-full ${styles.progress} overflow-hidden`}>
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent relative overflow-hidden"
            initial={animated ? { width: 0 } : { width: `${progressPercent}%` }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Animated shine effect */}
            {animated && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
            )}
          </motion.div>
        </div>
        
        {nextLevelConfig && (
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{userStats.current_level_xp.toLocaleString()} XP</span>
            <span>{xpToNext.toLocaleString()} to next level</span>
            <span>{nextLevelConfig.xp_required.toLocaleString()} XP</span>
          </div>
        )}
      </div>

      {showDetails && (
        <motion.div
          className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-700"
          initial={animated ? { opacity: 0, y: 10 } : undefined}
          animate={animated ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center">
            <div className="text-primary font-bold text-sm">
              {userStats.badges_count}
            </div>
            <div className="text-gray-400 text-xs">Badges</div>
          </div>
          <div className="text-center">
            <div className="text-green-400 font-bold text-sm">
              {userStats.streak_days}
            </div>
            <div className="text-gray-400 text-xs">Day Streak</div>
          </div>
          <div className="text-center">
            <div className="text-blue-400 font-bold text-sm">
              {userStats.total_contests}
            </div>
            <div className="text-gray-400 text-xs">Contests</div>
          </div>
          <div className="text-center">
            <div className="text-yellow-400 font-bold text-sm">
              {userStats.total_wins}
            </div>
            <div className="text-gray-400 text-xs">Wins</div>
          </div>
        </motion.div>
      )}

      {/* Level Perks */}
      {showDetails && currentLevelConfig.perks.length > 0 && (
        <motion.div
          className="mt-3 pt-3 border-t border-gray-700"
          initial={animated ? { opacity: 0, y: 10 } : undefined}
          animate={animated ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: 0.5 }}
        >
          <div className="text-xs text-gray-400 mb-2">Level Perks:</div>
          <div className="space-y-1">
            {currentLevelConfig.perks.map((perk, index) => (
              <div key={index} className="flex items-center text-xs text-gray-300">
                <Star className="w-3 h-3 text-primary mr-2 flex-shrink-0" />
                {perk}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

interface XPAnimationProps {
  amount: number
  visible: boolean
  onComplete?: () => void
}

export function XPAnimation({ amount, visible, onComplete }: XPAnimationProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none"
          initial={{ scale: 0, opacity: 0, y: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            opacity: [0, 1, 1, 0],
            y: [0, -20, -40, -60]
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 2, times: [0, 0.2, 0.8, 1] }}
        >
          <div className="bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-full shadow-lg border border-primary/30">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span className="font-bold text-lg">
                +{amount} XP
              </span>
            </div>
          </div>
          
          {/* Particle effects */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-2 h-2 bg-primary rounded-full"
              initial={{ scale: 0, opacity: 1 }}
              animate={{
                scale: 1,
                opacity: 0,
                x: Math.cos(i * 45 * Math.PI / 180) * 50,
                y: Math.sin(i * 45 * Math.PI / 180) * 50,
              }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface LevelUpAnimationProps {
  visible: boolean
  level: UserLevel
  onComplete?: () => void
}

export function LevelUpAnimation({ visible, level, onComplete }: LevelUpAnimationProps) {
  const levelConfig = LEVEL_CONFIGS.find(l => l.level === level) || LEVEL_CONFIGS[0]

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {/* Firework effects */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(30)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{
                    scale: 1,
                    opacity: 0,
                    x: (Math.random() - 0.5) * 600,
                    y: (Math.random() - 0.5) * 600,
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.05,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-center border-2 border-primary relative overflow-hidden">
              {/* Background glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20"
                animate={{
                  opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <motion.div
                className="relative z-10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div
                  className="text-6xl mb-4"
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {levelIcons[level]}
                </motion.div>

                <h2 className="text-4xl font-bold text-white mb-2">
                  Level Up!
                </h2>

                <p className="text-xl text-primary font-semibold mb-4">
                  {levelConfig.name}
                </p>

                <div className="text-gray-300 mb-6">
                  <p>Congratulations! You've reached a new level.</p>
                  <p>New perks have been unlocked!</p>
                </div>

                <div className="space-y-2 mb-6">
                  {levelConfig.perks.map((perk, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-center text-sm text-gray-300"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <Star className="w-4 h-4 text-primary mr-2" />
                      {perk}
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  className="px-8 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-bold hover:shadow-lg transition-all"
                  onClick={onComplete}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                >
                  Continue
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface StatsCardProps {
  userStats: UserStats
  animated?: boolean
}

export function StatsCard({ userStats, animated = true }: StatsCardProps) {
  const stats = [
    {
      icon: TrendingUp,
      label: 'Total Views',
      value: userStats.total_views.toLocaleString(),
      color: 'text-blue-400'
    },
    {
      icon: Trophy,
      label: 'Contest Wins',
      value: userStats.total_wins.toString(),
      color: 'text-yellow-400'
    },
    {
      icon: Star,
      label: 'Followers',
      value: userStats.total_followers.toLocaleString(),
      color: 'text-green-400'
    },
    {
      icon: Zap,
      label: 'Total XP',
      value: userStats.total_xp.toLocaleString(),
      color: 'text-primary'
    }
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const IconComponent = stat.icon
        return (
          <motion.div
            key={stat.label}
            className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4 text-center"
            initial={animated ? { y: 20, opacity: 0 } : undefined}
            animate={animated ? { y: 0, opacity: 1 } : undefined}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <IconComponent className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
            <div className={`text-lg font-bold ${stat.color} mb-1`}>
              {stat.value}
            </div>
            <div className="text-xs text-gray-400">
              {stat.label}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}