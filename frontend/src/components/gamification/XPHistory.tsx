/**
 * XPHistory Component
 *
 * Displays a list of XP earnings with filtering by date and source.
 * Shows running total and activity breakdown.
 */

import { useState, useMemo } from 'react'
import { useGamificationStore } from '../../stores/gamificationStore'
import { formatXP, getXPDescription } from '../../utils/xpCalculator'
import type { XPSource, XPEarnedEvent } from '../../types/gamification'
import {
  BookOpen,
  CheckCircle,
  Calendar,
  Award,
  Target,
  Flame,
  TrendingUp,
  Filter,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

type DateFilter = 'all' | 'today' | 'week' | 'month'
type SourceFilter = 'all' | XPSource

interface XPHistoryProps {
  maxItems?: number
  showFilters?: boolean
  showSummary?: boolean
  compact?: boolean
}

const SOURCE_ICONS: Record<XPSource, React.ComponentType<{ className?: string }>> = {
  lesson: BookOpen,
  quiz: CheckCircle,
  daily_login: Calendar,
  streak_bonus: Flame,
  badge: Award,
  achievement: Target,
  challenge: TrendingUp,
}

const SOURCE_COLORS: Record<XPSource, string> = {
  lesson: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  quiz: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  daily_login: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  streak_bonus: 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400',
  badge: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
  achievement: 'bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400',
  challenge: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400',
}

const SOURCE_LABELS: Record<XPSource, string> = {
  lesson: 'Lessons',
  quiz: 'Quizzes',
  daily_login: 'Daily Login',
  streak_bonus: 'Streak Bonus',
  badge: 'Badges',
  achievement: 'Achievements',
  challenge: 'Challenges',
}

export const XPHistory = ({
  maxItems = 50,
  showFilters = true,
  showSummary = true,
  compact = false,
}: XPHistoryProps) => {
  // Use individual selectors to prevent infinite re-renders with persist middleware
  const xpHistory = useGamificationStore((state) => state.xpHistory)
  const totalXP = useGamificationStore((state) => state.totalXP)
  const [dateFilter, setDateFilter] = useState<DateFilter>('all')
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>('all')
  const [isExpanded, setIsExpanded] = useState(!compact)

  // Filter history based on date and source
  const filteredHistory = useMemo(() => {
    let filtered = [...xpHistory]

    // Apply date filter
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    switch (dateFilter) {
      case 'today':
        filtered = filtered.filter((e) => new Date(e.timestamp) >= today)
        break
      case 'week':
        filtered = filtered.filter((e) => new Date(e.timestamp) >= weekAgo)
        break
      case 'month':
        filtered = filtered.filter((e) => new Date(e.timestamp) >= monthAgo)
        break
    }

    // Apply source filter
    if (sourceFilter !== 'all') {
      filtered = filtered.filter((e) => e.source === sourceFilter)
    }

    return filtered.slice(0, maxItems)
  }, [xpHistory, dateFilter, sourceFilter, maxItems])

  // Calculate summary statistics
  const summary = useMemo(() => {
    const stats: Record<XPSource, number> = {
      lesson: 0,
      quiz: 0,
      daily_login: 0,
      streak_bonus: 0,
      badge: 0,
      achievement: 0,
      challenge: 0,
    }

    filteredHistory.forEach((event) => {
      stats[event.source] += event.amount
    })

    const filteredTotal = filteredHistory.reduce((sum, e) => sum + e.amount, 0)

    return { stats, total: filteredTotal }
  }, [filteredHistory])

  // Format relative time
  const formatRelativeTime = (timestamp: string): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="bg-white dark:bg-darkMode-surface rounded-xl border border-border-light dark:border-darkMode-border overflow-hidden">
      {/* Header */}
      <div
        className={`
          flex items-center justify-between p-4 border-b border-border-light dark:border-darkMode-border
          ${compact ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover' : ''}
        `}
        onClick={compact ? () => setIsExpanded(!isExpanded) : undefined}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-gold/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-accent-gold" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-dark dark:text-darkMode-text">
              XP History
            </h3>
            <p className="text-sm text-forest-sage dark:text-darkMode-textMuted">
              {formatXP(totalXP)} Total XP
            </p>
          </div>
        </div>
        {compact && (
          <button className="p-1 text-forest-sage dark:text-darkMode-textMuted">
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        )}
      </div>

      {isExpanded && (
        <>
          {/* Filters */}
          {showFilters && (
            <div className="p-4 border-b border-border-light dark:border-darkMode-border bg-gray-50 dark:bg-darkMode-bg">
              <div className="flex flex-wrap gap-3">
                {/* Date Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-forest-sage dark:text-darkMode-textMuted" />
                  <select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value as DateFilter)}
                    className="text-sm bg-white dark:bg-darkMode-surface border border-border-light dark:border-darkMode-border rounded-lg px-3 py-1.5 text-neutral-dark dark:text-darkMode-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>

                {/* Source Filter */}
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value as SourceFilter)}
                  className="text-sm bg-white dark:bg-darkMode-surface border border-border-light dark:border-darkMode-border rounded-lg px-3 py-1.5 text-neutral-dark dark:text-darkMode-text focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="all">All Sources</option>
                  {(Object.keys(SOURCE_LABELS) as XPSource[]).map((source) => (
                    <option key={source} value={source}>
                      {SOURCE_LABELS[source]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Summary */}
          {showSummary && (
            <div className="p-4 border-b border-border-light dark:border-darkMode-border">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(Object.keys(summary.stats) as XPSource[])
                  .filter((source) => summary.stats[source] > 0)
                  .slice(0, 4)
                  .map((source) => {
                    const Icon = SOURCE_ICONS[source]
                    return (
                      <div
                        key={source}
                        className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-darkMode-bg"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${SOURCE_COLORS[source]}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-forest-sage dark:text-darkMode-textMuted truncate">
                            {SOURCE_LABELS[source]}
                          </p>
                          <p className="text-sm font-semibold text-neutral-dark dark:text-darkMode-text">
                            +{formatXP(summary.stats[source])}
                          </p>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          )}

          {/* History List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredHistory.length === 0 ? (
              <div className="p-8 text-center text-forest-sage dark:text-darkMode-textMuted">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No XP history found</p>
                <p className="text-sm mt-1">Start learning to earn XP!</p>
              </div>
            ) : (
              <ul className="divide-y divide-border-light dark:divide-darkMode-border">
                {filteredHistory.map((event, index) => {
                  const Icon = SOURCE_ICONS[event.source]
                  return (
                    <li
                      key={`${event.timestamp}-${index}`}
                      className="flex items-center gap-3 p-4 hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${SOURCE_COLORS[event.source]}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-dark dark:text-darkMode-text truncate">
                          {getXPDescription(event.source, event.amount)}
                        </p>
                        <p className="text-xs text-forest-sage dark:text-darkMode-textMuted">
                          {formatRelativeTime(event.timestamp)}
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-sm font-bold text-accent-gold">
                          +{formatXP(event.amount)}
                        </span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Footer */}
          {filteredHistory.length > 0 && (
            <div className="p-4 border-t border-border-light dark:border-darkMode-border bg-gray-50 dark:bg-darkMode-bg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-forest-sage dark:text-darkMode-textMuted">
                  Showing {filteredHistory.length} entries
                </span>
                <span className="text-sm font-semibold text-primary dark:text-darkMode-progress">
                  Period Total: +{formatXP(summary.total)} XP
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default XPHistory
