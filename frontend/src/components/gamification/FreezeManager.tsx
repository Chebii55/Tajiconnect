/**
 * FreezeManager Component
 *
 * UI for managing streak freezes.
 * Shows freeze count, usage, and how to earn more.
 */

import { useState } from 'react'
import {
  Snowflake,
  Shield,
  Plus,
  Info,
  CheckCircle,
  AlertCircle,
  Trophy,
  Gift,
  Sparkles,
} from 'lucide-react'
import { useGamificationStore } from '../../stores/gamificationStore'
import { STREAK_CONFIG, STREAK_MILESTONES, type MilestoneDay } from '../../lib/streakEngine'

interface FreezeManagerProps {
  freezesAvailable?: number
  streakAtRisk?: boolean
  currentStreak?: number
  onUseFreeze?: () => void
  compact?: boolean
}

export const FreezeManager = ({
  freezesAvailable: propFreezes,
  streakAtRisk: propAtRisk,
  currentStreak: propStreak,
  onUseFreeze,
  compact = false,
}: FreezeManagerProps) => {
  // Use props if provided, otherwise use store
  const storeFreezes = useGamificationStore((state) => state.streakFreezes)
  const storeAtRisk = useGamificationStore((state) => state.isStreakAtRisk)
  const storeStreak = useGamificationStore((state) => state.currentStreak)
  const useStreakFreeze = useGamificationStore((state) => state.useStreakFreeze)

  const freezes = propFreezes ?? storeFreezes
  const atRisk = propAtRisk ?? storeAtRisk
  const currentStreak = propStreak ?? storeStreak

  const [isUsing, setIsUsing] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [justUsed, setJustUsed] = useState(false)

  const canUseFreeze = freezes > 0 && atRisk && currentStreak > 0

  const handleUseFreeze = async () => {
    if (!canUseFreeze) return

    setIsUsing(true)

    if (onUseFreeze) {
      onUseFreeze()
    } else {
      const success = useStreakFreeze()
      if (success) {
        setJustUsed(true)
        setTimeout(() => setJustUsed(false), 3000)
      }
    }

    setIsUsing(false)
  }

  // Ways to earn freezes
  const freezeRewards = [
    {
      milestone: 7 as MilestoneDay,
      reward: STREAK_MILESTONES[7].freezeReward,
      label: '7-day streak',
      icon: Trophy,
    },
    {
      milestone: 30 as MilestoneDay,
      reward: STREAK_MILESTONES[30].freezeReward,
      label: '30-day streak',
      icon: Trophy,
    },
    {
      milestone: 100 as MilestoneDay,
      reward: STREAK_MILESTONES[100].freezeReward,
      label: '100-day streak',
      icon: Trophy,
    },
  ]

  // Compact view for sidebar/header
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div
          className={`
            flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
            ${freezes > 0
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }
          `}
        >
          <Snowflake className="w-4 h-4" />
          <span className="text-sm font-medium">{freezes}</span>
        </div>
        {canUseFreeze && (
          <button
            onClick={handleUseFreeze}
            disabled={isUsing}
            className="
              flex items-center gap-1 px-2.5 py-1.5
              bg-blue-500 hover:bg-blue-600 text-white
              text-sm font-medium rounded-lg
              transition-colors disabled:opacity-50
            "
          >
            <Shield className="w-4 h-4" />
            Use
          </button>
        )}
      </div>
    )
  }

  // Full view for profile/settings
  return (
    <div className="bg-white dark:bg-darkMode-surface rounded-xl border border-border-light dark:border-darkMode-border p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Snowflake className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-dark dark:text-darkMode-text">
              Streak Freezes
            </h3>
            <p className="text-xs text-forest-sage dark:text-darkMode-textMuted">
              Protect your streak when you miss a day
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 rounded-lg text-forest-sage dark:text-darkMode-textMuted hover:bg-gray-100 dark:hover:bg-darkMode-surfaceHover transition-colors"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* Freeze Count */}
      <div className="flex items-center justify-center gap-2 mb-4 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg">
        {[...Array(STREAK_CONFIG.MAX_FREEZES)].map((_, i) => (
          <div
            key={i}
            className={`
              w-10 h-10 rounded-lg flex items-center justify-center
              transition-all duration-300
              ${i < freezes
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
              }
            `}
          >
            <Snowflake className="w-5 h-5" />
          </div>
        ))}
      </div>

      {/* Success Message */}
      {justUsed && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-sm font-medium text-green-700 dark:text-green-400">
            Freeze activated! Your streak is protected for today.
          </span>
        </div>
      )}

      {/* Use Freeze Button */}
      {canUseFreeze && !justUsed && (
        <button
          onClick={handleUseFreeze}
          disabled={isUsing}
          className="
            w-full flex items-center justify-center gap-2 py-3
            bg-gradient-to-r from-blue-500 to-cyan-500
            hover:from-blue-600 hover:to-cyan-600
            text-white font-semibold rounded-lg
            transition-all duration-200
            hover:shadow-lg hover:shadow-blue-500/30
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <Shield className="w-5 h-5" />
          <span>Use Freeze to Protect Streak</span>
        </button>
      )}

      {/* Status Messages */}
      {!canUseFreeze && !justUsed && (
        <div className="text-center py-3">
          {freezes === 0 ? (
            <div className="flex items-center justify-center gap-2 text-forest-sage dark:text-darkMode-textMuted">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">No freezes available</span>
            </div>
          ) : !atRisk ? (
            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Streak is safe! Keep learning.</span>
            </div>
          ) : currentStreak === 0 ? (
            <div className="flex items-center justify-center gap-2 text-forest-sage dark:text-darkMode-textMuted">
              <Info className="w-4 h-4" />
              <span className="text-sm">Start a streak to use freezes</span>
            </div>
          ) : null}
        </div>
      )}

      {/* Info Panel */}
      {showInfo && (
        <div className="mt-4 p-4 bg-gray-50 dark:bg-darkMode-bg rounded-lg border border-border-light dark:border-darkMode-border">
          <h4 className="font-medium text-neutral-dark dark:text-darkMode-text mb-3 flex items-center gap-2">
            <Gift className="w-4 h-4 text-blue-500" />
            How to Earn Freezes
          </h4>
          <div className="space-y-2">
            {freezeRewards.map(({ milestone, reward, label, icon: Icon }) => {
              const earned = currentStreak >= milestone
              return (
                <div
                  key={milestone}
                  className={`
                    flex items-center justify-between p-2 rounded-lg
                    ${earned
                      ? 'bg-green-50 dark:bg-green-900/20'
                      : 'bg-white dark:bg-darkMode-surface'
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <Icon
                      className={`w-4 h-4 ${
                        earned ? 'text-green-500' : 'text-forest-sage dark:text-darkMode-textMuted'
                      }`}
                    />
                    <span
                      className={`text-sm ${
                        earned
                          ? 'text-green-700 dark:text-green-400'
                          : 'text-neutral-dark dark:text-darkMode-text'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span
                      className={`text-sm font-medium ${
                        earned ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'
                      }`}
                    >
                      +{reward}
                    </span>
                    <Snowflake
                      className={`w-4 h-4 ${
                        earned ? 'text-green-500' : 'text-blue-500'
                      }`}
                    />
                    {earned && <CheckCircle className="w-4 h-4 text-green-500 ml-1" />}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Max Freezes Note */}
          <p className="mt-3 text-xs text-forest-sage dark:text-darkMode-textMuted">
            <Sparkles className="w-3.5 h-3.5 inline mr-1" />
            You can store up to {STREAK_CONFIG.MAX_FREEZES} freezes at a time.
          </p>
        </div>
      )}
    </div>
  )
}

export default FreezeManager
