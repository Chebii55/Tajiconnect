/**
 * LeaderboardPreview Component
 *
 * Dashboard widget showing user's current rank in their league.
 * Displays XP to next rank, promotion zone status, and link to full leaderboard.
 */

import { memo, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, TrendingDown, Minus, Clock, ChevronRight, Trophy, Users } from 'lucide-react'
import { useLeaderboard } from '../../hooks/useLeaderboard'
import { LeagueBadge, PersonalModeBadge } from './LeagueBadge'
import { LEAGUE_CONFIG } from '../../types/leaderboard'
import type { League, LeaderboardEntry } from '../../types/leaderboard'

interface LeaderboardPreviewProps {
  /** User ID */
  userId: string

  /** Compact mode for smaller spaces */
  compact?: boolean

  /** Optional click handler instead of link */
  onViewFull?: () => void

  /** Additional CSS classes */
  className?: string
}

/**
 * Trend icon component
 */
function TrendIcon({ trend, amount }: { trend: string; amount?: number }) {
  if (trend === 'up') {
    return (
      <span className="flex items-center gap-0.5 text-green-500">
        <TrendingUp size={14} />
        {amount && <span className="text-xs">{amount}</span>}
      </span>
    )
  }
  if (trend === 'down') {
    return (
      <span className="flex items-center gap-0.5 text-red-500">
        <TrendingDown size={14} />
        {amount && <span className="text-xs">{amount}</span>}
      </span>
    )
  }
  return <Minus size={14} className="text-gray-400" />
}

/**
 * Rank display component
 */
function RankDisplay({ rank, total, league }: { rank: number; total: number; league: League }) {
  const config = LEAGUE_CONFIG[league]

  return (
    <div className="flex items-center gap-3">
      <div
        className="text-3xl font-bold"
        style={{ color: config.primaryColor }}
      >
        #{rank}
      </div>
      <div className="text-sm text-gray-500 dark:text-darkMode-textMuted">
        of {total} in {config.displayName}
      </div>
    </div>
  )
}

/**
 * Mini leaderboard showing nearby competitors
 */
function NearbyCompetitors({ entries }: { entries: LeaderboardEntry[] }) {
  if (!entries.length) return null

  return (
    <div className="space-y-1.5">
      {entries.map((entry) => (
        <div
          key={entry.userId}
          className={`
            flex items-center justify-between px-3 py-1.5 rounded-lg text-sm
            ${entry.isCurrentUser
              ? 'bg-primary/10 dark:bg-darkMode-accent/20 border border-primary/30 dark:border-darkMode-accent/30'
              : 'bg-gray-50 dark:bg-darkMode-surfaceHover'
            }
          `}
        >
          <div className="flex items-center gap-2">
            <span
              className={`
                w-6 text-center font-semibold
                ${entry.rank <= 3 ? 'text-accent-gold' : 'text-gray-600 dark:text-darkMode-textMuted'}
              `}
            >
              {entry.rank}
            </span>
            <span
              className={`
                truncate max-w-[100px]
                ${entry.isCurrentUser ? 'font-semibold text-primary dark:text-darkMode-accent' : 'text-gray-700 dark:text-darkMode-text'}
              `}
            >
              {entry.isCurrentUser ? 'You' : entry.username}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 dark:text-darkMode-textMuted">
              {entry.weeklyXP.toLocaleString()} XP
            </span>
            <TrendIcon trend={entry.trend} amount={entry.trendAmount} />
          </div>
        </div>
      ))}
    </div>
  )
}

/**
 * Zone indicator for promotion/demotion status
 */
function ZoneIndicator({ inPromotion, inDemotion }: { inPromotion: boolean; inDemotion: boolean }) {
  if (inPromotion) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
        <TrendingUp size={12} />
        Promotion Zone
      </div>
    )
  }
  if (inDemotion) {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-medium">
        <TrendingDown size={12} />
        Demotion Zone
      </div>
    )
  }
  return null
}

/**
 * LeaderboardPreview Component
 */
export const LeaderboardPreview = memo(function LeaderboardPreview({
  userId,
  compact = false,
  onViewFull,
  className = '',
}: LeaderboardPreviewProps) {
  const {
    leaderboard,
    userStatus,
    isLoading,
    isOptedIn,
    getUserContext,
    formatTimeUntilReset,
  } = useLeaderboard({ userId })

  // Get nearby competitors
  const nearbyEntries = useMemo(() => getUserContext(2), [getUserContext])

  // Calculate XP needed for next rank
  const xpToNextRank = useMemo(() => {
    if (!leaderboard || leaderboard.userRank <= 1) return null

    const currentEntry = leaderboard.entries.find((e) => e.isCurrentUser)
    const nextEntry = leaderboard.entries.find((e) => e.rank === leaderboard.userRank - 1)

    if (!currentEntry || !nextEntry) return null

    return nextEntry.weeklyXP - currentEntry.weeklyXP + 1
  }, [leaderboard])

  // Personal mode view (opted out)
  if (!isOptedIn) {
    return (
      <div
        className={`
          bg-white dark:bg-darkMode-surface rounded-xl
          border border-border-light dark:border-darkMode-border
          p-4 ${className}
        `}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-neutral-dark dark:text-darkMode-text">
            Leaderboard
          </h3>
          <PersonalModeBadge size="sm" />
        </div>

        <div className="text-center py-6">
          <Users className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-darkMode-border" />
          <p className="text-gray-500 dark:text-darkMode-textMuted text-sm mb-2">
            Personal Mode Active
          </p>
          <p className="text-gray-400 dark:text-darkMode-textMuted text-xs">
            You're not competing on leaderboards.<br />
            Enable in settings to join the competition.
          </p>
        </div>

        <Link
          to="/student/settings"
          className="block text-center text-sm text-primary dark:text-darkMode-link hover:underline mt-2"
        >
          Update Preferences
        </Link>
      </div>
    )
  }

  // Loading state
  if (isLoading && !leaderboard) {
    return (
      <div
        className={`
          bg-white dark:bg-darkMode-surface rounded-xl
          border border-border-light dark:border-darkMode-border
          p-4 ${className}
        `}
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-darkMode-surfaceHover rounded w-1/3" />
          <div className="h-20 bg-gray-200 dark:bg-darkMode-surfaceHover rounded" />
          <div className="h-4 bg-gray-200 dark:bg-darkMode-surfaceHover rounded w-2/3" />
        </div>
      </div>
    )
  }

  if (!leaderboard) {
    return null
  }

  // Compact view
  if (compact) {
    return (
      <Link
        to="/student/leaderboard"
        onClick={(e) => {
          if (onViewFull) {
            e.preventDefault()
            onViewFull()
          }
        }}
        className={`
          block bg-white dark:bg-darkMode-surface rounded-xl
          border border-border-light dark:border-darkMode-border
          p-4 hover:shadow-md transition-shadow duration-200
          ${className}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LeagueBadge league={leaderboard.league} size="sm" />
            <div>
              <div className="font-semibold text-neutral-dark dark:text-darkMode-text">
                #{leaderboard.userRank}
              </div>
              <div className="text-xs text-gray-500 dark:text-darkMode-textMuted">
                of {leaderboard.totalInLeague}
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </Link>
    )
  }

  // Full preview
  return (
    <div
      className={`
        bg-white dark:bg-darkMode-surface rounded-xl
        border border-border-light dark:border-darkMode-border
        shadow-sm overflow-hidden ${className}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border-light dark:border-darkMode-border">
        <div className="flex items-center gap-3">
          <Trophy className="w-5 h-5 text-accent-gold" />
          <h3 className="font-semibold text-neutral-dark dark:text-darkMode-text">
            Weekly Leaderboard
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-darkMode-textMuted">
          <Clock size={12} />
          <span>Resets in {formatTimeUntilReset()}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* User's Position */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LeagueBadge league={leaderboard.league} size="lg" showLabel />
            <div>
              <RankDisplay
                rank={leaderboard.userRank}
                total={leaderboard.totalInLeague}
                league={leaderboard.league}
              />
              {userStatus && (
                <div className="text-sm text-gray-500 dark:text-darkMode-textMuted mt-1">
                  {userStatus.weeklyXP.toLocaleString()} XP this week
                </div>
              )}
            </div>
          </div>
          <ZoneIndicator
            inPromotion={leaderboard.promotionZone}
            inDemotion={leaderboard.demotionZone}
          />
        </div>

        {/* XP to next rank */}
        {xpToNextRank && xpToNextRank > 0 && (
          <div className="bg-gray-50 dark:bg-darkMode-surfaceHover rounded-lg p-3">
            <div className="text-sm text-gray-600 dark:text-darkMode-textMuted">
              <span className="font-semibold text-primary dark:text-darkMode-accent">
                {xpToNextRank.toLocaleString()} XP
              </span>
              {' '}to overtake #{leaderboard.userRank - 1}
            </div>
          </div>
        )}

        {/* Nearby Competitors */}
        <div>
          <div className="text-xs font-medium text-gray-500 dark:text-darkMode-textMuted uppercase tracking-wide mb-2">
            Nearby Competitors
          </div>
          <NearbyCompetitors entries={nearbyEntries} />
        </div>
      </div>

      {/* Footer */}
      <Link
        to="/student/leaderboard"
        onClick={(e) => {
          if (onViewFull) {
            e.preventDefault()
            onViewFull()
          }
        }}
        className="
          flex items-center justify-center gap-2 p-3
          border-t border-border-light dark:border-darkMode-border
          text-sm font-medium text-primary dark:text-darkMode-link
          hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover
          transition-colors duration-200
        "
      >
        View Full Leaderboard
        <ChevronRight size={16} />
      </Link>
    </div>
  )
})

export default LeaderboardPreview
