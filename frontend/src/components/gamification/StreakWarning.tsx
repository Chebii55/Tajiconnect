/**
 * StreakWarning Component
 *
 * Warning banner displayed when user's streak is at risk.
 * Shows after 8pm local time if no activity recorded today.
 */

import { useState, useEffect } from 'react'
import { AlertTriangle, Flame, X, Clock, ArrowRight, Snowflake, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useGamificationStore } from '../../stores/gamificationStore'
import { getHoursUntilMidnight } from '../../lib/streakEngine'

interface StreakWarningProps {
  streak?: number
  freezesAvailable?: number
  onProtect?: () => void
  onUseFreeze?: () => void
  onDismiss?: () => void
}

export const StreakWarning = ({
  streak: propStreak,
  freezesAvailable: propFreezes,
  onProtect,
  onUseFreeze,
  onDismiss,
}: StreakWarningProps) => {
  const navigate = useNavigate()

  // Use props if provided, otherwise use store
  const storeStreak = useGamificationStore((state) => state.currentStreak)
  const storeFreezes = useGamificationStore((state) => state.streakFreezes)
  const isStreakAtRisk = useGamificationStore((state) => state.isStreakAtRisk)
  const useStreakFreeze = useGamificationStore((state) => state.useStreakFreeze)

  const streak = propStreak ?? storeStreak
  const freezes = propFreezes ?? storeFreezes

  const [isDismissed, setIsDismissed] = useState(false)
  const [hoursRemaining, setHoursRemaining] = useState(getHoursUntilMidnight())
  const [isUsingFreeze, setIsUsingFreeze] = useState(false)

  // Update hours remaining every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setHoursRemaining(getHoursUntilMidnight())
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  // Don't render if streak is not at risk or dismissed
  if (!isStreakAtRisk || isDismissed || streak <= 0) {
    return null
  }

  const handleProtect = () => {
    if (onProtect) {
      onProtect()
    } else {
      // Default: navigate to courses
      navigate('/learning/courses')
    }
  }

  const handleUseFreeze = () => {
    setIsUsingFreeze(true)

    if (onUseFreeze) {
      onUseFreeze()
    } else {
      // Use store method
      const success = useStreakFreeze()
      if (success) {
        setIsDismissed(true)
      }
    }

    setIsUsingFreeze(false)
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    if (onDismiss) {
      onDismiss()
    }
  }

  return (
    <div
      className="
        relative bg-gradient-to-r from-orange-500 via-red-500 to-orange-500
        text-white px-4 py-3
        shadow-lg animate-pulse
      "
      style={{ animationDuration: '3s' }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative container mx-auto flex items-center justify-between gap-4 flex-wrap">
        {/* Warning Content */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Warning Icon */}
          <div className="flex-shrink-0 relative">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Flame className="w-6 h-6 text-white animate-bounce" style={{ animationDuration: '2s' }} />
            </div>
            <AlertTriangle
              className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300"
              fill="currentColor"
            />
          </div>

          {/* Message */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm sm:text-base">
              Your {streak}-day streak is at risk!
            </h3>
            <p className="text-white/90 text-xs sm:text-sm">
              <Clock className="w-3.5 h-3.5 inline mr-1" />
              {hoursRemaining > 0
                ? `${hoursRemaining} hour${hoursRemaining !== 1 ? 's' : ''} left to complete a lesson`
                : 'Less than an hour left!'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Use Freeze Button */}
          {freezes > 0 && (
            <button
              onClick={handleUseFreeze}
              disabled={isUsingFreeze}
              className="
                flex items-center gap-1.5 px-3 py-2
                bg-blue-500/90 hover:bg-blue-600
                text-white text-sm font-medium
                rounded-lg transition-all duration-200
                hover:scale-105 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              <Shield className="w-4 h-4" />
              <Snowflake className="w-4 h-4" />
              <span className="hidden sm:inline">Use Freeze</span>
              <span className="text-xs opacity-75">({freezes})</span>
            </button>
          )}

          {/* Protect Button */}
          <button
            onClick={handleProtect}
            className="
              flex items-center gap-1.5 px-4 py-2
              bg-white text-orange-600
              text-sm font-semibold
              rounded-lg transition-all duration-200
              hover:bg-orange-50 hover:scale-105 active:scale-95
              shadow-md
            "
          >
            <span>Protect Streak</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="
              p-2 rounded-full
              text-white/70 hover:text-white
              hover:bg-white/10
              transition-colors
            "
            aria-label="Dismiss warning"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Compact inline streak warning for use in other components
 */
export const StreakWarningInline = ({
  streak,
  onProtect,
}: {
  streak: number
  onProtect?: () => void
}) => {
  const navigate = useNavigate()
  const hoursRemaining = getHoursUntilMidnight()

  const handleProtect = () => {
    if (onProtect) {
      onProtect()
    } else {
      navigate('/learning/courses')
    }
  }

  return (
    <div
      className="
        flex items-center justify-between gap-3 p-3
        bg-gradient-to-r from-orange-100 to-red-100
        dark:from-orange-900/30 dark:to-red-900/30
        border border-orange-200 dark:border-orange-800
        rounded-lg
      "
    >
      <div className="flex items-center gap-2">
        <div className="relative">
          <Flame className="w-5 h-5 text-orange-500" />
          <AlertTriangle
            className="absolute -top-1 -right-1 w-3 h-3 text-red-500"
            fill="currentColor"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
            {streak}-day streak at risk
          </p>
          <p className="text-xs text-orange-600 dark:text-orange-400">
            {hoursRemaining}h remaining
          </p>
        </div>
      </div>
      <button
        onClick={handleProtect}
        className="
          px-3 py-1.5 bg-orange-500 hover:bg-orange-600
          text-white text-xs font-semibold rounded-lg
          transition-colors
        "
      >
        Learn Now
      </button>
    </div>
  )
}

export default StreakWarning
