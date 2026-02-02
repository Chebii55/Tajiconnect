/**
 * LevelProgress Component
 *
 * Displays user level with circular progress ring.
 * Supports compact (header) and expanded (profile) modes.
 */

import { useState, useEffect } from 'react'
import { useGamificationStore } from '../../stores/gamificationStore'
import { getLevelTitle, formatLevel } from '../../utils/levelSystem'
import { formatXP } from '../../utils/xpCalculator'
import { Star, ChevronRight, Zap } from 'lucide-react'

interface LevelProgressProps {
  showDetails?: boolean
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export const LevelProgress = ({
  showDetails = false,
  size = 'md',
  onClick,
}: LevelProgressProps) => {
  const { level, currentXP, xpToNextLevel, totalXP, progressPercent } = useGamificationStore()
  const [isNearLevelUp, setIsNearLevelUp] = useState(false)
  const [isPulsing, setIsPulsing] = useState(false)

  // Check if near level up (within 10%)
  useEffect(() => {
    const nearLevelUp = progressPercent >= 90
    setIsNearLevelUp(nearLevelUp)

    // Pulse animation when near level up
    if (nearLevelUp) {
      setIsPulsing(true)
      const interval = setInterval(() => {
        setIsPulsing((prev) => !prev)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [progressPercent])

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'w-8 h-8',
      ring: 28,
      strokeWidth: 3,
      fontSize: 'text-xs',
      iconSize: 'w-3 h-3',
    },
    md: {
      container: 'w-10 h-10',
      ring: 36,
      strokeWidth: 3,
      fontSize: 'text-sm',
      iconSize: 'w-4 h-4',
    },
    lg: {
      container: 'w-16 h-16',
      ring: 60,
      strokeWidth: 4,
      fontSize: 'text-xl',
      iconSize: 'w-5 h-5',
    },
  }

  const config = sizeConfig[size]
  const radius = (config.ring - config.strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference

  // Compact view for header
  if (!showDetails) {
    return (
      <button
        onClick={onClick}
        className={`
          relative ${config.container} rounded-full
          bg-gradient-to-br from-primary to-primary-light
          dark:from-darkMode-surface dark:to-darkMode-surfaceHover
          flex items-center justify-center
          hover:scale-105 transition-transform duration-200
          ${isPulsing ? 'animate-pulse' : ''}
          group cursor-pointer
        `}
        title={`${formatLevel(level)} - ${progressPercent}% to next level`}
      >
        {/* Progress Ring SVG */}
        <svg
          className="absolute inset-0 -rotate-90"
          width={config.ring}
          height={config.ring}
          style={{ margin: 'auto' }}
        >
          {/* Background Ring */}
          <circle
            cx={config.ring / 2}
            cy={config.ring / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth={config.strokeWidth}
          />
          {/* Progress Ring */}
          <circle
            cx={config.ring / 2}
            cy={config.ring / 2}
            r={radius}
            fill="none"
            stroke={isNearLevelUp ? '#FFD700' : '#4CAF73'}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-500 ease-out"
          />
        </svg>

        {/* Level Number */}
        <span className={`${config.fontSize} font-bold text-white z-10`}>{level}</span>

        {/* Near level-up indicator */}
        {isNearLevelUp && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent-gold rounded-full animate-ping" />
        )}
      </button>
    )
  }

  // Expanded view for profile
  return (
    <div
      className={`
        bg-white dark:bg-darkMode-surface
        rounded-xl border border-border-light dark:border-darkMode-border
        p-4 shadow-sm hover:shadow-md transition-shadow duration-200
        ${onClick ? 'cursor-pointer' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-center gap-4">
        {/* Level Circle with Progress Ring */}
        <div className="relative flex-shrink-0">
          <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
            {/* Background Ring */}
            <circle
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke="currentColor"
              className="text-gray-200 dark:text-darkMode-border"
              strokeWidth="6"
            />
            {/* Progress Ring */}
            <circle
              cx="40"
              cy="40"
              r="35"
              fill="none"
              stroke={isNearLevelUp ? '#FFD700' : '#4CAF73'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 35}
              strokeDashoffset={2 * Math.PI * 35 * (1 - progressPercent / 100)}
              className={`transition-all duration-500 ease-out ${isPulsing ? 'filter drop-shadow-lg' : ''}`}
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Star className="w-4 h-4 text-accent-gold mb-0.5" />
            <span className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text">
              {level}
            </span>
          </div>
        </div>

        {/* Level Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-neutral-dark dark:text-darkMode-text truncate">
              {getLevelTitle(level)}
            </h3>
            {isNearLevelUp && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-accent-gold/10 text-accent-gold text-xs font-medium rounded-full">
                <Zap className="w-3 h-3" />
                Almost there!
              </span>
            )}
          </div>

          {/* XP Progress Bar */}
          <div className="mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-forest-sage dark:text-darkMode-textMuted">
                {formatXP(currentXP)} / {formatXP(currentXP + xpToNextLevel)} XP
              </span>
              <span className="text-xs font-medium text-primary dark:text-darkMode-progress">
                {progressPercent}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-darkMode-border rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  isNearLevelUp
                    ? 'bg-gradient-to-r from-accent-gold to-accent-goldLight'
                    : 'bg-gradient-to-r from-primary to-success'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Total XP */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-forest-sage dark:text-darkMode-textMuted">
              Total: {formatXP(totalXP)} XP
            </span>
            {onClick && (
              <ChevronRight className="w-4 h-4 text-forest-sage dark:text-darkMode-textMuted" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LevelProgress
