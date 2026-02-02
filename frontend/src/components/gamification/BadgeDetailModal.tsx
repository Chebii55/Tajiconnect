/**
 * BadgeDetailModal Component
 *
 * Detailed view of a badge showing full information,
 * progress tracking, and unlock criteria.
 */

import { useEffect, useState } from 'react'
import { X, Lock, Calendar, Info, Target, Sparkles } from 'lucide-react'
import {
  BookOpen,
  GraduationCap,
  Languages,
  Library,
  Crown,
  Flame,
  CalendarCheck,
  CalendarDays,
  Trophy,
  CheckCircle,
  Brain,
  Zap,
  Moon,
  Sunrise,
  Star,
  Award,
  Gem,
} from 'lucide-react'
import {
  RARITY_CONFIG,
  BADGE_CATEGORY_LABELS,
  type BadgeDefinition,
} from '../../data/badges'
import type { BadgeProgress } from '../../lib/badgeEngine'

interface BadgeDetailModalProps {
  badge: BadgeDefinition & { isUnlocked: boolean; unlockedAt?: string }
  progress?: BadgeProgress
  onClose: () => void
}

/**
 * Map icon names to Lucide components
 */
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'book-open': BookOpen,
  'graduation-cap': GraduationCap,
  languages: Languages,
  library: Library,
  crown: Crown,
  flame: Flame,
  'calendar-check': CalendarCheck,
  'calendar-days': CalendarDays,
  trophy: Trophy,
  'check-circle': CheckCircle,
  brain: Brain,
  sparkles: Sparkles,
  zap: Zap,
  moon: Moon,
  sunrise: Sunrise,
  star: Star,
  award: Award,
  gem: Gem,
}

export function BadgeDetailModal({
  badge,
  progress,
  onClose,
}: BadgeDetailModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showContent, setShowContent] = useState(false)

  const rarityConfig = RARITY_CONFIG[badge.rarity]
  const IconComponent = ICON_MAP[badge.icon] || Star
  const categoryLabel = BADGE_CATEGORY_LABELS[badge.category]

  const isHiddenAndLocked = badge.hidden && !badge.isUnlocked
  const progressPercent = progress?.progressPercent ?? 0

  // Entry animation
  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 50)
    const contentTimer = setTimeout(() => setShowContent(true), 200)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(contentTimer)
    }
  }, [])

  // Handle close with exit animation
  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 200)
  }

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  return (
    <div
      className={`
        fixed inset-0 z-[300] flex items-center justify-center p-4
        transition-opacity duration-200
        ${isVisible ? 'opacity-100' : 'opacity-0'}
      `}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Modal Content */}
      <div
        className={`
          relative bg-white dark:bg-darkMode-surface
          rounded-2xl shadow-2xl max-w-md w-full overflow-hidden
          transform transition-all duration-300 ease-out
          ${isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full z-10
            text-gray-400 hover:text-gray-600 dark:hover:text-gray-200
            hover:bg-gray-100 dark:hover:bg-darkMode-surfaceHover
            transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Gradient */}
        <div
          className={`
            relative py-8 px-6
            ${badge.isUnlocked
              ? `bg-gradient-to-br ${rarityConfig.bgColor}`
              : 'bg-gray-100 dark:bg-gray-800'
            }
          `}
        >
          {/* Decorative glow */}
          {badge.isUnlocked && (
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-3xl opacity-30"
              style={{ backgroundColor: rarityConfig.color }}
            />
          )}

          {/* Badge Icon */}
          <div
            className={`
              relative flex items-center justify-center mx-auto
              w-24 h-24 rounded-full
              ${badge.isUnlocked
                ? `bg-white dark:bg-gray-900 border-4 ${rarityConfig.borderColor} ${rarityConfig.glowClass}`
                : 'bg-gray-200 dark:bg-gray-700 border-4 border-gray-300 dark:border-gray-600'
              }
              transition-all duration-300
              ${showContent ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}
            `}
          >
            {isHiddenAndLocked ? (
              <Lock className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            ) : badge.isUnlocked ? (
              <IconComponent className={`w-12 h-12 ${rarityConfig.textColor}`} />
            ) : (
              <div className="relative">
                <IconComponent className="w-12 h-12 text-gray-400 dark:text-gray-500 opacity-50" />
                <Lock className="absolute -bottom-1 -right-1 w-5 h-5 text-gray-500" />
              </div>
            )}
          </div>

          {/* Sparkles for unlocked badges */}
          {badge.isUnlocked && (
            <>
              <Sparkles
                className={`absolute top-6 right-16 w-5 h-5 ${rarityConfig.textColor} animate-pulse`}
              />
              <Sparkles
                className={`absolute bottom-6 left-16 w-4 h-4 ${rarityConfig.textColor} animate-pulse`}
                style={{ animationDelay: '300ms' }}
              />
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Badge Name */}
          <h2
            className={`
              text-2xl font-bold text-center mb-2
              text-gray-900 dark:text-white
              transition-all duration-300 delay-100
              ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
          >
            {isHiddenAndLocked ? '???' : badge.name}
          </h2>

          {/* Rarity & Category */}
          <div
            className={`
              flex items-center justify-center gap-2 mb-4
              transition-all duration-300 delay-150
              ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
          >
            <span
              className={`
                px-3 py-1 rounded-full text-sm font-semibold
                ${rarityConfig.bgColor} ${rarityConfig.textColor}
              `}
            >
              {rarityConfig.label}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
              {categoryLabel}
            </span>
          </div>

          {/* Description */}
          <p
            className={`
              text-center text-gray-600 dark:text-gray-400 mb-6
              transition-all duration-300 delay-200
              ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
          >
            {isHiddenAndLocked
              ? 'This badge is hidden. Complete special achievements to discover it!'
              : badge.description}
          </p>

          {/* Progress Section (for locked badges) */}
          {!badge.isUnlocked && !isHiddenAndLocked && (
            <div
              className={`
                mb-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800
                transition-all duration-300 delay-250
                ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Progress
                </span>
                <span className="text-sm font-bold" style={{ color: rarityConfig.color }}>
                  {progress?.currentValue ?? 0}/{progress?.targetValue ?? badge.criteria.threshold}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="h-3 rounded-full transition-all duration-500"
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: rarityConfig.color,
                  }}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                {Math.round(progressPercent)}% complete
              </p>
            </div>
          )}

          {/* Unlock Date (for unlocked badges) */}
          {badge.isUnlocked && badge.unlockedAt && (
            <div
              className={`
                flex items-center justify-center gap-2 mb-6 text-gray-500 dark:text-gray-400
                transition-all duration-300 delay-250
                ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm">
                Unlocked on {new Date(badge.unlockedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}

          {/* How to Unlock (for locked, visible badges) */}
          {!badge.isUnlocked && !isHiddenAndLocked && badge.hint && (
            <div
              className={`
                mb-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20
                border border-blue-200 dark:border-blue-800
                transition-all duration-300 delay-300
                ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
              `}
            >
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1">
                    How to Unlock
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    {badge.hint}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* XP Reward Info */}
          <div
            className={`
              flex items-center justify-center gap-2 p-3 rounded-xl
              bg-accent-goldLight/20 dark:bg-accent-gold/10
              transition-all duration-300 delay-350
              ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
          >
            <Info className="w-4 h-4 text-accent-gold" />
            <span className="text-sm text-amber-700 dark:text-amber-400">
              {badge.isUnlocked
                ? `Earned ${badge.xpReward} XP from this badge`
                : `Unlocking this badge rewards ${badge.xpReward} XP`}
            </span>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className={`
              w-full mt-6 py-3 px-6 rounded-xl font-semibold
              bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
              hover:bg-gray-200 dark:hover:bg-gray-700
              transition-all duration-200
              ${showContent ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}
            style={{ transitionDelay: '400ms' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default BadgeDetailModal
