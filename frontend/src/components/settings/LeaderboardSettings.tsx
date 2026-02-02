/**
 * LeaderboardSettings Component
 *
 * Settings panel for leaderboard preferences including opt-out toggle.
 * Shows confirmation dialog when opting out mid-week.
 */

import { useState, useCallback } from 'react'
import {
  Trophy,
  Shield,
  AlertTriangle,
  Users,
  Eye,
  EyeOff,
  ChevronRight,
  Info,
  X,
} from 'lucide-react'
import { useLeaderboard } from '../../hooks/useLeaderboard'
import { LeagueBadge, PersonalModeBadge } from '../gamification/LeagueBadge'
import { LEAGUE_CONFIG } from '../../types/leaderboard'

interface LeaderboardSettingsProps {
  /** User ID */
  userId: string

  /** Compact mode for embedding in larger settings page */
  compact?: boolean

  /** Additional CSS classes */
  className?: string
}

/**
 * Confirmation Modal Component
 */
function ConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText,
  cancelText,
  variant = 'warning',
}: {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'warning' | 'info'
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className="
          bg-white dark:bg-darkMode-surface rounded-xl shadow-xl
          max-w-md w-full p-6 space-y-4
          animate-in fade-in zoom-in-95 duration-200
        "
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <div
            className={`
              p-2 rounded-full
              ${variant === 'warning'
                ? 'bg-yellow-100 dark:bg-yellow-900/30'
                : 'bg-blue-100 dark:bg-blue-900/30'
              }
            `}
          >
            {variant === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            ) : (
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-neutral-dark dark:text-darkMode-text">
              {title}
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-darkMode-textMuted">
              {message}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 dark:hover:bg-darkMode-surfaceHover rounded"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="
              flex-1 px-4 py-2 rounded-lg
              border border-gray-300 dark:border-darkMode-border
              text-gray-700 dark:text-darkMode-text
              hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover
              font-medium transition-colors
            "
          >
            {cancelText || 'Cancel'}
          </button>
          <button
            onClick={onConfirm}
            className={`
              flex-1 px-4 py-2 rounded-lg font-medium
              transition-colors
              ${variant === 'warning'
                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                : 'bg-primary hover:bg-primary-dark dark:bg-darkMode-progress dark:hover:bg-darkMode-success text-white'
              }
            `}
          >
            {confirmText || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Toggle Switch Component
 */
function ToggleSwitch({
  checked,
  onChange,
  disabled = false,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full
        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${checked
          ? 'bg-primary dark:bg-darkMode-progress'
          : 'bg-gray-300 dark:bg-darkMode-border'
        }
      `}
    >
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white shadow-md
          transition-transform duration-200
          ${checked ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  )
}

/**
 * Setting Row Component
 */
function SettingRow({
  icon: Icon,
  title,
  description,
  action,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string; size?: number }>
  title: string
  description: string
  action?: React.ReactNode
  onClick?: () => void
}) {
  const Wrapper = onClick ? 'button' : 'div'

  return (
    <Wrapper
      onClick={onClick}
      className={`
        flex items-center gap-4 p-4 w-full text-left
        ${onClick ? 'hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover cursor-pointer' : ''}
        transition-colors
      `}
    >
      <div className="p-2 rounded-lg bg-gray-100 dark:bg-darkMode-surfaceHover">
        <Icon className="w-5 h-5 text-gray-600 dark:text-darkMode-textMuted" size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-neutral-dark dark:text-darkMode-text">
          {title}
        </div>
        <div className="text-sm text-gray-500 dark:text-darkMode-textMuted">
          {description}
        </div>
      </div>
      {action}
      {onClick && !action && (
        <ChevronRight className="w-5 h-5 text-gray-400" />
      )}
    </Wrapper>
  )
}

/**
 * LeaderboardSettings Component
 */
export const LeaderboardSettings = ({
  userId,
  compact = false,
  className = '',
}: LeaderboardSettingsProps) => {
  const {
    userStatus,
    isOptedIn,
    isLoading,
    toggleOptOut,
  } = useLeaderboard({ userId })

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingOptIn, setPendingOptIn] = useState<boolean | null>(null)

  // Handle toggle with confirmation for opt-out
  const handleToggle = useCallback(
    (newValue: boolean) => {
      if (!newValue && isOptedIn) {
        // Opting out - show confirmation
        setPendingOptIn(false)
        setShowConfirmModal(true)
      } else {
        // Opting in - no confirmation needed
        toggleOptOut(newValue)
      }
    },
    [isOptedIn, toggleOptOut]
  )

  // Confirm opt-out
  const handleConfirmOptOut = useCallback(() => {
    if (pendingOptIn !== null) {
      toggleOptOut(pendingOptIn)
    }
    setShowConfirmModal(false)
    setPendingOptIn(null)
  }, [pendingOptIn, toggleOptOut])

  // Cancel opt-out
  const handleCancelOptOut = useCallback(() => {
    setShowConfirmModal(false)
    setPendingOptIn(null)
  }, [])

  const leagueConfig = userStatus?.league ? LEAGUE_CONFIG[userStatus.league] : null

  // Compact view for embedding
  if (compact) {
    return (
      <div className={className}>
        <SettingRow
          icon={Trophy}
          title="Compete on Leaderboards"
          description={
            isOptedIn
              ? `Currently in ${leagueConfig?.displayName || 'Bronze'} League`
              : 'Disabled - Personal mode active'
          }
          action={
            <ToggleSwitch
              checked={isOptedIn}
              onChange={handleToggle}
              disabled={isLoading}
            />
          }
        />

        <ConfirmationModal
          isOpen={showConfirmModal}
          onConfirm={handleConfirmOptOut}
          onCancel={handleCancelOptOut}
          title="Opt out of Leaderboards?"
          message="Your weekly XP will be reset and you won't appear on leaderboards. You can rejoin anytime, starting from Bronze league."
          confirmText="Opt Out"
          cancelText="Stay Competitive"
          variant="warning"
        />
      </div>
    )
  }

  // Full settings view
  return (
    <div className={`bg-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-border-light dark:border-darkMode-border ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-border-light dark:border-darkMode-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-accent-gold" />
            <div>
              <h2 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text">
                Leaderboard Settings
              </h2>
              <p className="text-sm text-gray-500 dark:text-darkMode-textMuted">
                Manage your competitive preferences
              </p>
            </div>
          </div>
          {isOptedIn && userStatus?.league ? (
            <LeagueBadge league={userStatus.league} size="md" showLabel />
          ) : (
            <PersonalModeBadge size="md" />
          )}
        </div>
      </div>

      {/* Settings */}
      <div className="divide-y divide-border-light dark:divide-darkMode-border">
        {/* Competition Toggle */}
        <SettingRow
          icon={Users}
          title="Compete on Leaderboards"
          description={
            isOptedIn
              ? 'You appear on weekly leaderboards and compete for league promotions.'
              : 'You are in personal mode. Your progress is tracked privately.'
          }
          action={
            <ToggleSwitch
              checked={isOptedIn}
              onChange={handleToggle}
              disabled={isLoading}
            />
          }
        />

        {/* Current Status */}
        {isOptedIn && userStatus && (
          <>
            <SettingRow
              icon={Shield}
              title="Current League"
              description={`${leagueConfig?.displayName || 'Bronze'} League - Rank #${userStatus.currentRank || 'N/A'}`}
              action={
                <LeagueBadge league={userStatus.league} size="sm" />
              }
            />

            <SettingRow
              icon={Eye}
              title="Weekly XP"
              description={`${userStatus.weeklyXP?.toLocaleString() || 0} XP earned this week`}
            />
          </>
        )}

        {!isOptedIn && (
          <div className="p-6 bg-gray-50 dark:bg-darkMode-surfaceHover">
            <div className="flex items-start gap-3">
              <EyeOff className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-neutral-dark dark:text-darkMode-text">
                  Personal Mode Benefits
                </h4>
                <ul className="mt-2 space-y-1 text-sm text-gray-600 dark:text-darkMode-textMuted">
                  <li>Learn at your own pace without competition pressure</li>
                  <li>Your progress is still tracked for personal goals</li>
                  <li>Rejoin competitions anytime from Bronze league</li>
                  <li>No weekly ranking notifications</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Footer */}
      <div className="p-4 bg-gray-50 dark:bg-darkMode-surfaceHover border-t border-border-light dark:border-darkMode-border">
        <div className="flex items-start gap-2 text-xs text-gray-500 dark:text-darkMode-textMuted">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <p>
            Weekly leaderboards reset every Monday at 00:00 UTC. Top performers in each league
            are promoted, while bottom performers may be demoted. Diamond league members stay
            if they maintain top 50%.
          </p>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onConfirm={handleConfirmOptOut}
        onCancel={handleCancelOptOut}
        title="Opt out of Leaderboards?"
        message="Your weekly XP will be reset and you won't appear on leaderboards. You can rejoin anytime, but you'll start from Bronze league."
        confirmText="Opt Out"
        cancelText="Stay Competitive"
        variant="warning"
      />
    </div>
  )
}

export default LeaderboardSettings
