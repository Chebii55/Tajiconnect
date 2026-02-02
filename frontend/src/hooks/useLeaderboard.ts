/**
 * useLeaderboard Hook
 *
 * Manages leaderboard data fetching, caching, and real-time updates.
 * Supports weekly leaderboards with tiered leagues.
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { eventBus } from '../lib/eventBus'
import type {
  League,
  LeaderboardState,
  LeaderboardEntry,
  UserLeaderboardStatus,
  WeeklyResult,
} from '../types/leaderboard'

/**
 * API base URL - would come from environment in production
 */
const API_BASE = '/api/v1'

/**
 * Polling interval when leaderboard is visible (5 minutes)
 */
const POLL_INTERVAL = 5 * 60 * 1000

interface UseLeaderboardOptions {
  /**
   * User ID to fetch leaderboard data for
   */
  userId: string

  /**
   * Whether to auto-fetch on mount
   */
  autoFetch?: boolean

  /**
   * Whether to enable polling for updates
   */
  enablePolling?: boolean

  /**
   * Polling interval in milliseconds
   */
  pollInterval?: number
}

interface UseLeaderboardReturn {
  /** Current leaderboard state */
  leaderboard: LeaderboardState | null

  /** User's leaderboard status */
  userStatus: UserLeaderboardStatus | null

  /** Loading state */
  isLoading: boolean

  /** Error state */
  error: string | null

  /** Whether user is opted in to leaderboards */
  isOptedIn: boolean

  /** Fetch leaderboard data */
  fetchLeaderboard: (league?: League) => Promise<void>

  /** Fetch user status */
  fetchUserStatus: () => Promise<void>

  /** Toggle opt-out status */
  toggleOptOut: (optIn: boolean) => Promise<void>

  /** Fetch leaderboard history */
  fetchHistory: (limit?: number) => Promise<WeeklyResult[]>

  /** Refresh all data */
  refresh: () => Promise<void>

  /** Get entries around current user */
  getUserContext: (range?: number) => LeaderboardEntry[]

  /** Format time until reset */
  formatTimeUntilReset: () => string
}

/**
 * Format seconds into human-readable time
 */
function formatTime(seconds: number): string {
  if (seconds <= 0) return 'Resetting soon...'

  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (days > 0) {
    return `${days}d ${hours}h`
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

export function useLeaderboard(options: UseLeaderboardOptions): UseLeaderboardReturn {
  const { userId, autoFetch = true, enablePolling = false, pollInterval = POLL_INTERVAL } = options

  const [leaderboard, setLeaderboard] = useState<LeaderboardState | null>(null)
  const [userStatus, setUserStatus] = useState<UserLeaderboardStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pollTimerRef = useRef<NodeJS.Timeout | null>(null)

  /**
   * Fetch leaderboard data from API
   */
  const fetchLeaderboard = useCallback(
    async (league?: League) => {
      if (!userId) return

      setIsLoading(true)
      setError(null)

      try {
        const url = league
          ? `${API_BASE}/leaderboard/${league}?userId=${userId}`
          : `${API_BASE}/leaderboard?userId=${userId}`

        const response = await fetch(url)
        const data = await response.json()

        if (data.success) {
          setLeaderboard(data.data)
        } else {
          setError(data.message || 'Failed to fetch leaderboard')
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err)
        setError('Failed to connect to server')

        // Provide fallback data for demo
        setLeaderboard({
          league: 'bronze',
          entries: generateMockEntries(userId),
          userRank: 5,
          totalInLeague: 25,
          promotionZone: true,
          demotionZone: false,
          timeUntilReset: 259200,
          weekStartDate: new Date().toISOString(),
          weekEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        })
      } finally {
        setIsLoading(false)
      }
    },
    [userId]
  )

  /**
   * Fetch user status from API
   */
  const fetchUserStatus = useCallback(async () => {
    if (!userId) return

    try {
      const response = await fetch(`${API_BASE}/leaderboard/user/status?userId=${userId}`)
      const data = await response.json()

      if (data.success) {
        setUserStatus(data.data)
      }
    } catch (err) {
      console.error('Error fetching user status:', err)

      // Provide fallback data for demo
      setUserStatus({
        userId,
        league: 'bronze',
        isOptedIn: true,
        weeklyXP: 450,
        currentRank: 5,
        promotionStreak: 0,
      })
    }
  }, [userId])

  /**
   * Toggle opt-out status
   */
  const toggleOptOut = useCallback(
    async (optIn: boolean) => {
      if (!userId) return

      setIsLoading(true)

      try {
        const response = await fetch(`${API_BASE}/leaderboard/opt-out`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, optIn }),
        })
        const data = await response.json()

        if (data.success) {
          setUserStatus((prev) => (prev ? { ...prev, isOptedIn: optIn } : null))

          // Emit event for other components
          eventBus.emit('leaderboard:opt-out-changed' as any, { userId, isOptedIn: optIn })

          // Refresh leaderboard if opting back in
          if (optIn) {
            await fetchLeaderboard()
          }
        }
      } catch (err) {
        console.error('Error toggling opt-out:', err)
        setError('Failed to update preference')
      } finally {
        setIsLoading(false)
      }
    },
    [userId, fetchLeaderboard]
  )

  /**
   * Fetch leaderboard history
   */
  const fetchHistory = useCallback(
    async (limit = 10): Promise<WeeklyResult[]> => {
      if (!userId) return []

      try {
        const response = await fetch(`${API_BASE}/leaderboard/user/history?userId=${userId}&limit=${limit}`)
        const data = await response.json()

        if (data.success) {
          return data.data.history
        }
      } catch (err) {
        console.error('Error fetching history:', err)
      }

      return []
    },
    [userId]
  )

  /**
   * Refresh all leaderboard data
   */
  const refresh = useCallback(async () => {
    await Promise.all([fetchLeaderboard(), fetchUserStatus()])
  }, [fetchLeaderboard, fetchUserStatus])

  /**
   * Get entries around current user for context
   */
  const getUserContext = useCallback(
    (range = 2): LeaderboardEntry[] => {
      if (!leaderboard || !leaderboard.entries.length) return []

      const userIndex = leaderboard.entries.findIndex((e) => e.isCurrentUser)
      if (userIndex === -1) return leaderboard.entries.slice(0, 5)

      const start = Math.max(0, userIndex - range)
      const end = Math.min(leaderboard.entries.length, userIndex + range + 1)

      return leaderboard.entries.slice(start, end)
    },
    [leaderboard]
  )

  /**
   * Format time until reset
   */
  const formatTimeUntilReset = useCallback((): string => {
    if (!leaderboard) return '...'
    return formatTime(leaderboard.timeUntilReset)
  }, [leaderboard])

  /**
   * Auto-fetch on mount
   */
  useEffect(() => {
    if (autoFetch && userId) {
      refresh()
    }
  }, [autoFetch, userId, refresh])

  /**
   * Set up polling
   */
  useEffect(() => {
    if (enablePolling && userId) {
      pollTimerRef.current = setInterval(() => {
        fetchLeaderboard()
      }, pollInterval)

      return () => {
        if (pollTimerRef.current) {
          clearInterval(pollTimerRef.current)
        }
      }
    }
  }, [enablePolling, userId, pollInterval, fetchLeaderboard])

  /**
   * Listen for XP earned events to update weekly XP
   */
  useEffect(() => {
    const unsubscribe = eventBus.on('xp:earned', ({ amount }) => {
      if (userStatus?.isOptedIn) {
        setUserStatus((prev) => (prev ? { ...prev, weeklyXP: prev.weeklyXP + amount } : null))
      }
    })

    return unsubscribe
  }, [userStatus?.isOptedIn])

  return {
    leaderboard,
    userStatus,
    isLoading,
    error,
    isOptedIn: userStatus?.isOptedIn ?? true,
    fetchLeaderboard,
    fetchUserStatus,
    toggleOptOut,
    fetchHistory,
    refresh,
    getUserContext,
    formatTimeUntilReset,
  }
}

/**
 * Generate mock entries for demo/fallback
 */
function generateMockEntries(currentUserId: string): LeaderboardEntry[] {
  const mockNames = [
    'Alex K.',
    'Maria S.',
    'James L.',
    'Sarah M.',
    'You',
    'David R.',
    'Emma T.',
    'Michael B.',
    'Lisa W.',
    'Chris P.',
  ]

  return mockNames.map((name, index) => ({
    rank: index + 1,
    userId: index === 4 ? currentUserId : `user-${index}`,
    username: name,
    weeklyXP: 1000 - index * 50 + Math.floor(Math.random() * 30),
    league: 'bronze' as League,
    trend: index % 3 === 0 ? 'up' : index % 3 === 1 ? 'down' : 'same',
    trendAmount: index % 3 !== 2 ? Math.floor(Math.random() * 3) + 1 : 0,
    isCurrentUser: index === 4,
  }))
}

export default useLeaderboard
