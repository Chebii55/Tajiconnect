/**
 * Leaderboard Component
 *
 * Full leaderboard view with league selector, rankings, and user position.
 * Supports promotion/demotion zone highlighting and pull-to-refresh.
 */

import { useState, useCallback, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  RefreshCw,
  Medal,
  ChevronLeft,
  Settings,
  Info,
  Crown,
  User,
} from 'lucide-react'
import { useLeaderboard } from '../../hooks/useLeaderboard'
import { LeagueBadge, LeagueBadgeInline, PersonalModeBadge } from './LeagueBadge'
import { LEAGUE_CONFIG, LEAGUE_ORDER } from '../../types/leaderboard'
import type { League, LeaderboardEntry } from '../../types/leaderboard'

interface LeaderboardProps {
  /** User ID */
  userId: string

  /** Show back button */
  showBackButton?: boolean

  /** Custom back navigation handler */
  onBack?: () => void
}

/**
 * League selector tabs
 */
function LeagueSelector({
  currentLeague,
  selectedLeague,
  onSelect,
}: {
  currentLeague: League
  selectedLeague: League
  onSelect: (league: League) => void
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
      {LEAGUE_ORDER.map((league) => {
        const config = LEAGUE_CONFIG[league]
        const isSelected = league === selectedLeague
        const isCurrent = league === currentLeague
        const isLocked = LEAGUE_ORDER.indexOf(league) > LEAGUE_ORDER.indexOf(currentLeague)

        return (
          <button
            key={league}
            onClick={() => onSelect(league)}
            disabled={isLocked}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg
              transition-all duration-200 whitespace-nowrap
              ${isSelected
                ? 'bg-white dark:bg-darkMode-surface shadow-md'
                : 'bg-gray-100 dark:bg-darkMode-surfaceHover'
              }
              ${isLocked
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:shadow-sm cursor-pointer'
              }
              ${isCurrent && !isSelected
                ? 'ring-2 ring-primary/30 dark:ring-darkMode-accent/30'
                : ''
              }
            `}
            style={{
              borderLeft: isSelected ? `3px solid ${config.primaryColor}` : undefined,
            }}
          >
            <LeagueBadge league={league} size="xs" />
            <span
              className={`
                text-sm font-medium
                ${isSelected
                  ? 'text-neutral-dark dark:text-darkMode-text'
                  : 'text-gray-500 dark:text-darkMode-textMuted'
                }
              `}
            >
              {config.displayName}
            </span>
            {isCurrent && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-primary/10 dark:bg-darkMode-accent/20 text-primary dark:text-darkMode-accent rounded">
                You
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Trend indicator
 */
function TrendIndicator({ trend, amount }: { trend: string; amount?: number }) {
  if (trend === 'up') {
    return (
      <div className="flex items-center gap-0.5 text-green-500">
        <TrendingUp size={14} />
        {amount && amount > 0 && (
          <span className="text-xs font-medium">{amount}</span>
        )}
      </div>
    )
  }
  if (trend === 'down') {
    return (
      <div className="flex items-center gap-0.5 text-red-500">
        <TrendingDown size={14} />
        {amount && amount > 0 && (
          <span className="text-xs font-medium">{amount}</span>
        )}
      </div>
    )
  }
  return <Minus size={14} className="text-gray-300 dark:text-darkMode-border" />
}

/**
 * Medal icon for top 3
 */
function RankMedal({ rank }: { rank: number }) {
  const colors = {
    1: { bg: 'bg-yellow-100', text: 'text-yellow-600', icon: '1st' },
    2: { bg: 'bg-gray-100', text: 'text-gray-500', icon: '2nd' },
    3: { bg: 'bg-orange-100', text: 'text-orange-600', icon: '3rd' },
  }

  const style = colors[rank as keyof typeof colors]
  if (!style) return null

  return (
    <div
      className={`
        w-8 h-8 rounded-full ${style.bg}
        flex items-center justify-center
      `}
    >
      <Medal className={`w-4 h-4 ${style.text}`} />
    </div>
  )
}

/**
 * Leaderboard entry row
 */
function LeaderboardRow({
  entry,
  inPromotionZone,
  inDemotionZone,
  promotionThreshold,
  demotionThreshold,
  totalEntries,
}: {
  entry: LeaderboardEntry
  inPromotionZone: boolean
  inDemotionZone: boolean
  promotionThreshold: number
  demotionThreshold: number
  totalEntries: number
}) {
  const isTop3 = entry.rank <= 3

  // Calculate if this row is in promotion/demotion zone
  const percentile = (entry.rank / totalEntries) * 100
  const bottomPercentile = ((totalEntries - entry.rank + 1) / totalEntries) * 100
  const rowInPromotion = promotionThreshold > 0 && percentile <= promotionThreshold
  const rowInDemotion = demotionThreshold > 0 && bottomPercentile <= demotionThreshold

  return (
    <div
      className={`
        flex items-center gap-3 p-3 rounded-lg
        transition-all duration-200
        ${entry.isCurrentUser
          ? 'bg-primary/10 dark:bg-darkMode-accent/20 border-2 border-primary/30 dark:border-darkMode-accent/30 shadow-sm'
          : rowInPromotion
            ? 'bg-green-50 dark:bg-green-900/20'
            : rowInDemotion
              ? 'bg-red-50 dark:bg-red-900/20'
              : 'bg-gray-50 dark:bg-darkMode-surfaceHover hover:bg-gray-100 dark:hover:bg-darkMode-border'
        }
      `}
    >
      {/* Rank */}
      <div className="w-12 flex justify-center">
        {isTop3 ? (
          <RankMedal rank={entry.rank} />
        ) : (
          <span
            className={`
              text-lg font-bold
              ${entry.isCurrentUser
                ? 'text-primary dark:text-darkMode-accent'
                : 'text-gray-400 dark:text-darkMode-textMuted'
              }
            `}
          >
            {entry.rank}
          </span>
        )}
      </div>

      {/* Avatar & Name */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className={`
            w-10 h-10 rounded-full
            flex items-center justify-center
            ${entry.avatarUrl
              ? ''
              : 'bg-gray-200 dark:bg-darkMode-border'
            }
          `}
        >
          {entry.avatarUrl ? (
            <img
              src={entry.avatarUrl}
              alt={entry.username}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-gray-400 dark:text-darkMode-textMuted" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className={`
              font-medium truncate
              ${entry.isCurrentUser
                ? 'text-primary dark:text-darkMode-accent'
                : 'text-neutral-dark dark:text-darkMode-text'
              }
            `}
          >
            {entry.isCurrentUser ? 'You' : entry.username}
          </div>
          {entry.isCurrentUser && (
            <div className="text-xs text-gray-500 dark:text-darkMode-textMuted">
              Your position
            </div>
          )}
        </div>
      </div>

      {/* XP */}
      <div className="text-right">
        <div
          className={`
            font-semibold
            ${entry.isCurrentUser
              ? 'text-primary dark:text-darkMode-accent'
              : 'text-neutral-dark dark:text-darkMode-text'
            }
          `}
        >
          {entry.weeklyXP.toLocaleString()}
        </div>
        <div className="text-xs text-gray-500 dark:text-darkMode-textMuted">XP</div>
      </div>

      {/* Trend */}
      <div className="w-10 flex justify-center">
        <TrendIndicator trend={entry.trend} amount={entry.trendAmount} />
      </div>
    </div>
  )
}

/**
 * Zone legend component
 */
function ZoneLegend({ league }: { league: League }) {
  const config = LEAGUE_CONFIG[league]

  return (
    <div className="flex flex-wrap gap-3 text-xs">
      {config.promotionThreshold > 0 && (
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700" />
          <span className="text-gray-600 dark:text-darkMode-textMuted">
            Promotion Zone (Top {config.promotionThreshold}%)
          </span>
        </div>
      )}
      {config.demotionThreshold > 0 && (
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700" />
          <span className="text-gray-600 dark:text-darkMode-textMuted">
            Demotion Zone (Bottom {config.demotionThreshold}%)
          </span>
        </div>
      )}
    </div>
  )
}

/**
 * Main Leaderboard Component
 */
export const Leaderboard = ({
  userId,
  showBackButton = true,
  onBack,
}: LeaderboardProps) => {
  const {
    leaderboard,
    userStatus,
    isLoading,
    error,
    isOptedIn,
    fetchLeaderboard,
    refresh,
    formatTimeUntilReset,
  } = useLeaderboard({ userId, enablePolling: true })

  const [selectedLeague, setSelectedLeague] = useState<League>('bronze')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Update selected league when user status loads
  useEffect(() => {
    if (userStatus?.league) {
      setSelectedLeague(userStatus.league)
    }
  }, [userStatus?.league])

  // Handle league change
  const handleLeagueSelect = useCallback(
    (league: League) => {
      setSelectedLeague(league)
      fetchLeaderboard(league)
    },
    [fetchLeaderboard]
  )

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    await refresh()
    setIsRefreshing(false)
  }, [refresh])

  // Get current league config
  const currentConfig = useMemo(
    () => LEAGUE_CONFIG[selectedLeague],
    [selectedLeague]
  )

  // Opted out view
  if (!isOptedIn) {
    return (
      <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg">
        {/* Header */}
        <div className="bg-white dark:bg-darkMode-surface shadow dark:shadow-dark">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              {showBackButton && (
                <button
                  onClick={onBack || (() => window.history.back())}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-darkMode-surfaceHover rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-darkMode-textMuted" />
                </button>
              )}
              <h1 className="text-xl font-bold text-neutral-dark dark:text-darkMode-text">
                Leaderboard
              </h1>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="text-center">
            <PersonalModeBadge size="lg" />
            <h2 className="mt-6 text-xl font-semibold text-neutral-dark dark:text-darkMode-text">
              Personal Mode Active
            </h2>
            <p className="mt-2 text-gray-500 dark:text-darkMode-textMuted max-w-md mx-auto">
              You're not competing on leaderboards. Your learning progress is tracked privately.
              Enable competitive mode in settings to join weekly competitions.
            </p>
            <Link
              to="/student/settings"
              className="
                inline-flex items-center gap-2 mt-6 px-6 py-3
                bg-primary hover:bg-primary-dark
                dark:bg-darkMode-progress dark:hover:bg-darkMode-success
                text-white rounded-lg font-medium
                transition-colors duration-200
              "
            >
              <Settings size={18} />
              Update Preferences
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg">
      {/* Header */}
      <div className="bg-white dark:bg-darkMode-surface shadow dark:shadow-dark sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {showBackButton && (
                <button
                  onClick={onBack || (() => window.history.back())}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-darkMode-surfaceHover rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-darkMode-textMuted" />
                </button>
              )}
              <div>
                <h1 className="text-xl font-bold text-neutral-dark dark:text-darkMode-text flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-accent-gold" />
                  Weekly Leaderboard
                </h1>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-darkMode-textMuted mt-0.5">
                  <Clock size={12} />
                  Resets in {formatTimeUntilReset()}
                </div>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-gray-100 dark:hover:bg-darkMode-surfaceHover rounded-lg transition-colors"
            >
              <RefreshCw
                className={`w-5 h-5 text-gray-600 dark:text-darkMode-textMuted ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* League Selector */}
      <div className="bg-gray-50 dark:bg-darkMode-surfaceHover border-b border-border-light dark:border-darkMode-border">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <LeagueSelector
            currentLeague={userStatus?.league || 'bronze'}
            selectedLeague={selectedLeague}
            onSelect={handleLeagueSelect}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Loading State */}
        {isLoading && !leaderboard && (
          <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="h-16 bg-gray-200 dark:bg-darkMode-surfaceHover rounded-lg animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <Info className="w-12 h-12 mx-auto text-gray-400 dark:text-darkMode-border" />
            <p className="mt-4 text-gray-500 dark:text-darkMode-textMuted">{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-4 text-primary dark:text-darkMode-link hover:underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Leaderboard */}
        {leaderboard && (
          <div className="space-y-6">
            {/* Info Banner */}
            <div className="bg-white dark:bg-darkMode-surface rounded-xl p-4 shadow-sm border border-border-light dark:border-darkMode-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <LeagueBadge league={selectedLeague} size="md" />
                  <div>
                    <h2 className="font-semibold text-neutral-dark dark:text-darkMode-text">
                      {currentConfig.displayName} League
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-darkMode-textMuted">
                      {leaderboard.totalInLeague} competitors
                    </p>
                  </div>
                </div>
                {userStatus?.league === selectedLeague && (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary dark:text-darkMode-accent">
                      #{leaderboard.userRank}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-darkMode-textMuted">
                      Your Rank
                    </div>
                  </div>
                )}
              </div>

              {/* Zone Legend */}
              <div className="mt-4 pt-4 border-t border-border-light dark:border-darkMode-border">
                <ZoneLegend league={selectedLeague} />
              </div>
            </div>

            {/* Entries */}
            <div className="space-y-2">
              {leaderboard.entries.map((entry) => (
                <LeaderboardRow
                  key={entry.userId}
                  entry={entry}
                  inPromotionZone={leaderboard.promotionZone}
                  inDemotionZone={leaderboard.demotionZone}
                  promotionThreshold={currentConfig.promotionThreshold}
                  demotionThreshold={currentConfig.demotionThreshold}
                  totalEntries={leaderboard.totalInLeague}
                />
              ))}
            </div>

            {/* Empty State */}
            {leaderboard.entries.length === 0 && (
              <div className="text-center py-12">
                <Crown className="w-12 h-12 mx-auto text-gray-300 dark:text-darkMode-border" />
                <p className="mt-4 text-gray-500 dark:text-darkMode-textMuted">
                  No competitors in this league yet.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Leaderboard
