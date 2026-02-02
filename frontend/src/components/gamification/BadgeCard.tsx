/**
 * BadgeCard Component
 *
 * Individual badge display card with rarity styling,
 * progress indicator, and unlock status.
 */

import { useMemo } from 'react'
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
  Sparkles,
  Zap,
  Moon,
  Sunrise,
  Star,
  Award,
  Gem,
  Lock,
  HelpCircle,
} from 'lucide-react'
import { RARITY_CONFIG, type BadgeDefinition } from '../../data/badges'
import type { BadgeProgress } from '../../lib/badgeEngine'

interface BadgeCardProps {
  badge: BadgeDefinition & { isUnlocked: boolean; unlockedAt?: string }
  progress?: BadgeProgress
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  showProgress?: boolean
  compact?: boolean
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

/**
 * Get icon component for badge
 */
function getIconComponent(
  iconName: string
): React.ComponentType<{ className?: string }> {
  return ICON_MAP[iconName] || Star
}

/**
 * Size configurations
 */
const SIZE_CONFIG = {
  sm: {
    container: 'w-16 h-16',
    icon: 'w-6 h-6',
    ring: 'w-14 h-14',
    text: 'text-xs',
  },
  md: {
    container: 'w-20 h-20',
    icon: 'w-8 h-8',
    ring: 'w-18 h-18',
    text: 'text-sm',
  },
  lg: {
    container: 'w-24 h-24',
    icon: 'w-10 h-10',
    ring: 'w-22 h-22',
    text: 'text-base',
  },
}

export function BadgeCard({
  badge,
  progress,
  onClick,
  size = 'md',
  showProgress = true,
  compact = false,
}: BadgeCardProps) {
  const rarityConfig = RARITY_CONFIG[badge.rarity]
  const sizeConfig = SIZE_CONFIG[size]
  const IconComponent = getIconComponent(badge.icon)

  const isHiddenAndLocked = badge.hidden && !badge.isUnlocked

  const progressPercent = useMemo(() => {
    if (badge.isUnlocked) return 100
    return progress?.progressPercent ?? 0
  }, [badge.isUnlocked, progress])

  // Calculate stroke dash for circular progress
  const circumference = 2 * Math.PI * 45 // radius = 45
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference

  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`
          relative flex items-center justify-center
          ${sizeConfig.container}
          rounded-full border-2 transition-all duration-300
          ${badge.isUnlocked
            ? `${rarityConfig.borderColor} ${rarityConfig.bgColor} ${rarityConfig.glowClass}`
            : 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800'
          }
          ${onClick ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}
        `}
        disabled={!onClick}
        title={isHiddenAndLocked ? 'Hidden Badge' : badge.name}
      >
        {isHiddenAndLocked ? (
          <HelpCircle className={`${sizeConfig.icon} text-gray-400 dark:text-gray-500`} />
        ) : badge.isUnlocked ? (
          <IconComponent
            className={`${sizeConfig.icon} ${rarityConfig.textColor}`}
          />
        ) : (
          <div className="relative">
            <IconComponent
              className={`${sizeConfig.icon} text-gray-400 dark:text-gray-500 opacity-50`}
            />
            <Lock className="absolute -bottom-1 -right-1 w-3 h-3 text-gray-500" />
          </div>
        )}
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className={`
        relative flex flex-col items-center p-4 rounded-xl
        border-2 transition-all duration-300
        ${badge.isUnlocked
          ? `${rarityConfig.borderColor} ${rarityConfig.bgColor} ${rarityConfig.glowClass}`
          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50'
        }
        ${onClick ? 'cursor-pointer hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]' : ''}
      `}
      disabled={!onClick}
    >
      {/* Badge Icon with Progress Ring */}
      <div className="relative mb-3">
        {/* Progress Ring (SVG) */}
        {showProgress && !badge.isUnlocked && (
          <svg
            className="absolute inset-0 -rotate-90"
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
          >
            {/* Background ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              className="text-gray-200 dark:text-gray-700"
            />
            {/* Progress ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={rarityConfig.color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500"
            />
          </svg>
        )}

        {/* Icon Container */}
        <div
          className={`
            relative flex items-center justify-center
            ${sizeConfig.container}
            rounded-full
            ${badge.isUnlocked
              ? `bg-white dark:bg-gray-900 shadow-inner`
              : 'bg-gray-100 dark:bg-gray-800'
            }
          `}
        >
          {isHiddenAndLocked ? (
            <HelpCircle className={`${sizeConfig.icon} text-gray-400 dark:text-gray-500`} />
          ) : badge.isUnlocked ? (
            <IconComponent
              className={`${sizeConfig.icon} ${rarityConfig.textColor}`}
            />
          ) : (
            <div className="relative">
              <IconComponent
                className={`${sizeConfig.icon} text-gray-400 dark:text-gray-500 opacity-50`}
              />
            </div>
          )}
        </div>

        {/* Lock indicator for locked badges */}
        {!badge.isUnlocked && !isHiddenAndLocked && (
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <Lock className="w-3 h-3 text-gray-500 dark:text-gray-400" />
          </div>
        )}

        {/* Checkmark for unlocked badges */}
        {badge.isUnlocked && (
          <div
            className={`
              absolute -bottom-1 -right-1 w-5 h-5 rounded-full
              flex items-center justify-center
              ${rarityConfig.bgColor} border ${rarityConfig.borderColor}
            `}
          >
            <CheckCircle className={`w-3 h-3 ${rarityConfig.textColor}`} />
          </div>
        )}
      </div>

      {/* Badge Name */}
      <h3
        className={`
          font-semibold text-center mb-1
          ${sizeConfig.text}
          ${badge.isUnlocked
            ? 'text-gray-900 dark:text-white'
            : 'text-gray-500 dark:text-gray-400'
          }
        `}
      >
        {isHiddenAndLocked ? '???' : badge.name}
      </h3>

      {/* Rarity Badge */}
      <span
        className={`
          px-2 py-0.5 rounded-full text-xs font-medium
          ${rarityConfig.bgColor} ${rarityConfig.textColor}
        `}
      >
        {rarityConfig.label}
      </span>

      {/* Progress Text */}
      {showProgress && !badge.isUnlocked && !isHiddenAndLocked && progress && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          {progress.currentValue}/{progress.targetValue}
        </p>
      )}

      {/* Unlock Date */}
      {badge.isUnlocked && badge.unlockedAt && (
        <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
          {new Date(badge.unlockedAt).toLocaleDateString()}
        </p>
      )}
    </button>
  )
}

export default BadgeCard
