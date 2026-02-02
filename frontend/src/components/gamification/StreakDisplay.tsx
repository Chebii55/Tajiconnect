/**
 * StreakDisplay Component
 *
 * Displays user's current streak with flame icon.
 * Supports compact (header) and full (profile) view modes.
 */

import { useState, useEffect } from 'react'
import { Flame, Snowflake, AlertTriangle, Trophy, TrendingUp } from 'lucide-react'
import { useGamificationStore } from '../../stores/gamificationStore'
import {
  getStreakBonusPercent,
  getNextMilestone,
  getDaysUntilNextMilestone,
  STREAK_CONFIG,
} from '../../lib/streakEngine'

interface StreakDisplayProps {
  streak?: number
  longestStreak?: number
  freezesAvailable?: number
  atRisk?: boolean
  compact?: boolean
  freezeActive?: boolean
  onClick?: () => void
}

export const StreakDisplay = ({
  streak: propStreak,
  longestStreak: propLongestStreak,
  freezesAvailable: propFreezes,
  atRisk: propAtRisk,
  compact = true,
  freezeActive = false,
  onClick,
}: StreakDisplayProps) => {
  // Use props if provided, otherwise use store
  const storeStreak = useGamificationStore((state) => state.currentStreak)
  const storeLongestStreak = useGamificationStore((state) => state.longestStreak)
  const storeFreezes = useGamificationStore((state) => state.streakFreezes)
  const storeAtRisk = useGamificationStore((state) => state.isStreakAtRisk)

  const streak = propStreak ?? storeStreak
  const longestStreak = propLongestStreak ?? storeLongestStreak
  const freezes = propFreezes ?? storeFreezes
  const atRisk = propAtRisk ?? storeAtRisk

  const [isPulsing, setIsPulsing] = useState(false)

  // Pulse animation when at risk
  useEffect(() => {
    if (atRisk) {
      const interval = setInterval(() => {
        setIsPulsing((prev) => !prev)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setIsPulsing(false)
    }
  }, [atRisk])

  // Get bonus info
  const bonusPercent = getStreakBonusPercent(streak)
  const nextMilestone = getNextMilestone(streak)
  const daysUntilMilestone = getDaysUntilNextMilestone(streak)

  // Determine flame color based on streak length
  const getFlameColor = () => {
    if (freezeActive) return 'text-blue-400'
    if (streak >= 100) return 'text-purple-500'
    if (streak >= 30) return 'text-red-500'
    if (streak >= 7) return 'text-orange-500'
    return 'text-orange-400'
  }

  const getFlameGradient = () => {
    if (freezeActive)
      return 'from-blue-400 to-cyan-300'
    if (streak >= 100)
      return 'from-purple-500 via-pink-500 to-red-500'
    if (streak >= 30)
      return 'from-red-500 via-orange-500 to-yellow-400'
    if (streak >= 7)
      return 'from-orange-500 to-yellow-400'
    return 'from-orange-400 to-yellow-300'
  }

  // Compact view for header
  if (compact) {
    return (
      <button
        onClick={onClick}
        className={`
          relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
          ${freezeActive
            ? 'bg-blue-50 dark:bg-blue-900/20'
            : 'bg-orange-50 dark:bg-orange-900/20'
          }
          ${atRisk ? 'ring-2 ring-orange-400 animate-pulse' : ''}
          hover:scale-105 transition-all duration-200 cursor-pointer
          group
        `}
        title={`${streak} day streak${atRisk ? ' - At Risk!' : ''}`}
      >
        {/* Flame or Snowflake Icon */}
        <div className="relative">
          {freezeActive ? (
            <Snowflake className="w-5 h-5 text-blue-400" />
          ) : (
            <Flame
              className={`w-5 h-5 ${getFlameColor()} ${
                streak > 0 ? 'drop-shadow-sm' : ''
              }`}
            />
          )}

          {/* At-risk warning indicator */}
          {atRisk && !freezeActive && (
            <AlertTriangle
              className="absolute -top-1 -right-1 w-3 h-3 text-red-500"
              fill="currentColor"
            />
          )}
        </div>

        {/* Streak Number */}
        <span
          className={`
            text-sm font-bold
            ${freezeActive
              ? 'text-blue-600 dark:text-blue-400'
              : streak > 0
                ? 'text-orange-600 dark:text-orange-400'
                : 'text-gray-500 dark:text-gray-400'
            }
          `}
        >
          {streak}
        </span>

        {/* Bonus indicator */}
        {bonusPercent > 0 && !freezeActive && (
          <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-1 rounded">
            +{bonusPercent}%
          </span>
        )}

        {/* Freeze count (if any) */}
        {freezes > 0 && (
          <div className="flex items-center gap-0.5 ml-1">
            <Snowflake className="w-3 h-3 text-blue-400" />
            <span className="text-xs text-blue-600 dark:text-blue-400">{freezes}</span>
          </div>
        )}
      </button>
    )
  }

  // Full view for profile/details
  return (
    <div
      className={`
        bg-white dark:bg-darkMode-surface
        rounded-xl border border-border-light dark:border-darkMode-border
        p-4 shadow-sm hover:shadow-md transition-all duration-200
        ${atRisk && !freezeActive ? 'ring-2 ring-orange-400' : ''}
        ${onClick ? 'cursor-pointer' : ''}
      `}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        {/* Streak Badge */}
        <div
          className={`
            relative w-16 h-16 rounded-xl flex items-center justify-center
            bg-gradient-to-br ${getFlameGradient()}
            ${isPulsing ? 'animate-pulse' : ''}
          `}
        >
          {freezeActive ? (
            <Snowflake className="w-8 h-8 text-white" />
          ) : (
            <Flame className="w-8 h-8 text-white drop-shadow-md" />
          )}

          {/* At-risk overlay */}
          {atRisk && !freezeActive && (
            <div className="absolute inset-0 rounded-xl bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          )}
        </div>

        {/* Streak Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-neutral-dark dark:text-darkMode-text">
              {streak} Day Streak
            </h3>
            {atRisk && !freezeActive && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-medium rounded-full">
                <AlertTriangle className="w-3 h-3" />
                At Risk
              </span>
            )}
            {freezeActive && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium rounded-full">
                <Snowflake className="w-3 h-3" />
                Freeze Active
              </span>
            )}
          </div>

          {/* Longest streak */}
          <p className="text-sm text-forest-sage dark:text-darkMode-textMuted mb-2">
            <Trophy className="w-3.5 h-3.5 inline mr-1 text-accent-gold" />
            Longest: {longestStreak} days
          </p>

          {/* XP Bonus */}
          {bonusPercent > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                +{bonusPercent}% XP Bonus Active
              </span>
            </div>
          )}

          {/* Progress to next milestone */}
          {nextMilestone && daysUntilMilestone !== null && (
            <div className="mt-2">
              <div className="flex justify-between items-center text-xs text-forest-sage dark:text-darkMode-textMuted mb-1">
                <span>Next milestone: {nextMilestone} days</span>
                <span>{daysUntilMilestone} days to go</span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-darkMode-border rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${getFlameGradient()} transition-all duration-300`}
                  style={{
                    width: `${Math.min(
                      ((streak % (nextMilestone - (getNextMilestone(streak - nextMilestone) ?? 0))) /
                        (nextMilestone - (getNextMilestone(streak - 1) ?? streak))) *
                        100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Freezes available */}
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border-light dark:border-darkMode-border">
            <div className="flex items-center gap-1">
              <Snowflake className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">
                {freezes}
              </span>
              <span className="text-xs text-forest-sage dark:text-darkMode-textMuted">
                / {STREAK_CONFIG.MAX_FREEZES} freezes
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StreakDisplay
