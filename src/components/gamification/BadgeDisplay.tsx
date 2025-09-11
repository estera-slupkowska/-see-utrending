import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Trophy, Calendar, Users, Zap, Crown } from 'lucide-react'
import { type Badge, type BadgeRarity } from '../../stores/gamification.store'

interface BadgeDisplayProps {
  badge: Badge
  size?: 'small' | 'medium' | 'large'
  showProgress?: boolean
  showTooltip?: boolean
  animated?: boolean
  onClick?: () => void
}

const rarityConfig = {
  common: {
    bg: 'from-gray-500/20 to-gray-600/20',
    border: 'border-gray-500/30',
    glow: 'shadow-gray-500/20',
    text: 'text-gray-300',
    icon: 'text-gray-400'
  },
  rare: {
    bg: 'from-blue-500/20 to-blue-600/20',
    border: 'border-blue-500/30',
    glow: 'shadow-blue-500/20',
    text: 'text-blue-300',
    icon: 'text-blue-400'
  },
  epic: {
    bg: 'from-purple-500/20 to-purple-600/20',
    border: 'border-purple-500/30',
    glow: 'shadow-purple-500/20',
    text: 'text-purple-300',
    icon: 'text-purple-400'
  },
  legendary: {
    bg: 'from-yellow-500/20 to-yellow-600/20',
    border: 'border-yellow-500/30',
    glow: 'shadow-yellow-500/20 shadow-lg',
    text: 'text-yellow-300',
    icon: 'text-yellow-400'
  }
}

const sizeConfig = {
  small: {
    container: 'w-12 h-12',
    icon: 'text-lg',
    text: 'text-xs',
    progress: 'h-1'
  },
  medium: {
    container: 'w-16 h-16',
    icon: 'text-xl',
    text: 'text-sm',
    progress: 'h-1.5'
  },
  large: {
    container: 'w-24 h-24',
    icon: 'text-3xl',
    text: 'text-base',
    progress: 'h-2'
  }
}

const getCategoryIcon = (category: Badge['category']) => {
  switch (category) {
    case 'achievement': return Star
    case 'contest': return Trophy
    case 'streak': return Calendar
    case 'social': return Users
    case 'special': return Crown
    default: return Star
  }
}

export function BadgeDisplay({
  badge,
  size = 'medium',
  showProgress = false,
  showTooltip = true,
  animated = true,
  onClick
}: BadgeDisplayProps) {
  const rarity = rarityConfig[badge.rarity]
  const sizeStyle = sizeConfig[size]
  const CategoryIcon = getCategoryIcon(badge.category)
  
  const progressPercent = Math.min((badge.progress / badge.max_progress) * 100, 100)
  const isUnlocked = badge.unlocked

  return (
    <div className="relative group">
      <motion.div
        className={`
          ${sizeStyle.container} relative rounded-xl border ${rarity.border}
          bg-gradient-to-br ${rarity.bg} backdrop-blur-sm
          ${rarity.glow} flex items-center justify-center
          ${onClick ? 'cursor-pointer hover:scale-105' : ''}
          ${isUnlocked ? '' : 'grayscale opacity-50'}
          transition-all duration-300
        `}
        onClick={onClick}
        whileHover={animated ? { scale: 1.05 } : undefined}
        whileTap={animated ? { scale: 0.95 } : undefined}
        initial={animated ? { scale: 0, opacity: 0 } : undefined}
        animate={animated ? { scale: 1, opacity: 1 } : undefined}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {/* Badge Icon/Emoji */}
        <div className={`${sizeStyle.icon} ${rarity.text} font-bold`}>
          {badge.icon}
        </div>

        {/* Unlock Animation Overlay */}
        <AnimatePresence>
          {isUnlocked && animated && (
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: '100%', opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>

        {/* Category Icon (Corner) */}
        <div className={`absolute top-1 right-1 ${rarity.icon} opacity-60`}>
          <CategoryIcon className="w-3 h-3" />
        </div>

        {/* Legendary Glow Effect */}
        {badge.rarity === 'legendary' && isUnlocked && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/20 to-yellow-600/20"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>

      {/* Progress Bar */}
      {showProgress && !isUnlocked && (
        <div className={`mt-2 bg-gray-700 rounded-full ${sizeStyle.progress} overflow-hidden`}>
          <motion.div
            className={`h-full bg-gradient-to-r ${rarity.bg} ${rarity.glow}`}
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
          <div className="bg-gray-900 text-white text-sm rounded-lg p-3 shadow-lg max-w-xs">
            <div className="flex items-center space-x-2 mb-1">
              <span className={`${rarity.text} font-bold`}>{badge.name}</span>
              <span className={`text-xs px-2 py-1 rounded-full bg-gray-800 ${rarity.text}`}>
                {badge.rarity}
              </span>
            </div>
            <p className="text-gray-300 text-xs mb-2">{badge.description}</p>
            
            {!isUnlocked && (
              <div className="text-xs text-gray-400">
                Progress: {badge.progress.toLocaleString()} / {badge.max_progress.toLocaleString()}
                <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                  <div
                    className={`h-1 bg-gradient-to-r ${rarity.bg} rounded-full`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
            
            {isUnlocked && badge.unlocked_at && (
              <div className="text-xs text-green-400">
                Unlocked: {new Date(badge.unlocked_at).toLocaleDateString()}
              </div>
            )}
          </div>
          
          {/* Tooltip Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  )
}

interface BadgeGridProps {
  badges: Badge[]
  columns?: number
  showProgress?: boolean
  filter?: {
    category?: Badge['category']
    rarity?: BadgeRarity
    unlocked?: boolean
  }
  onBadgeClick?: (badge: Badge) => void
}

export function BadgeGrid({
  badges,
  columns = 4,
  showProgress = true,
  filter,
  onBadgeClick
}: BadgeGridProps) {
  let filteredBadges = badges

  if (filter) {
    filteredBadges = badges.filter(badge => {
      if (filter.category && badge.category !== filter.category) return false
      if (filter.rarity && badge.rarity !== filter.rarity) return false
      if (filter.unlocked !== undefined && badge.unlocked !== filter.unlocked) return false
      return true
    })
  }

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  }

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols]} gap-4`}>
      <AnimatePresence>
        {filteredBadges.map((badge, index) => (
          <motion.div
            key={badge.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <BadgeDisplay
              badge={badge}
              showProgress={showProgress}
              onClick={onBadgeClick ? () => onBadgeClick(badge) : undefined}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

interface BadgeUnlockAnimationProps {
  badge: Badge | null
  onClose: () => void
}

export function BadgeUnlockAnimation({ badge, onClose }: BadgeUnlockAnimationProps) {
  if (!badge) return null

  const rarity = rarityConfig[badge.rarity]

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {/* Confetti Effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-2 h-2 ${rarity.bg} rounded-full`}
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 1,
                  scale: 0
                }}
                animate={{
                  x: (Math.random() - 0.5) * 400,
                  y: (Math.random() - 0.5) * 400,
                  opacity: 0,
                  scale: 1
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>

          <div className="bg-gray-900 rounded-2xl p-8 text-center border border-gray-700 relative overflow-hidden">
            {/* Background Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br ${rarity.bg} opacity-20`} />
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
            >
              <BadgeDisplay
                badge={badge}
                size="large"
                showProgress={false}
                showTooltip={false}
                animated={false}
              />
            </motion.div>

            <motion.h2
              className={`text-2xl font-bold ${rarity.text} mt-4 mb-2`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Badge Unlocked!
            </motion.h2>

            <motion.p
              className="text-white text-lg font-semibold mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {badge.name}
            </motion.p>

            <motion.p
              className="text-gray-300 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              {badge.description}
            </motion.p>

            <motion.div
              className={`inline-block px-4 py-2 rounded-full ${rarity.bg} ${rarity.border} border`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <span className={`text-sm font-medium ${rarity.text}`}>
                {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)} Badge
              </span>
            </motion.div>

            <motion.button
              className="mt-6 px-6 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg font-medium transition-colors"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Awesome!
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}