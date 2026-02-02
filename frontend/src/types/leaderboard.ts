/**
 * Leaderboard System Type Definitions
 *
 * Types for weekly leaderboards with tiered leagues (Bronze/Silver/Gold/Diamond).
 * Supports opt-out for non-competitive learners.
 */

/**
 * League tier types
 */
export type League = 'bronze' | 'silver' | 'gold' | 'diamond'

/**
 * Trend direction for rank changes
 */
export type RankTrend = 'up' | 'down' | 'same'

/**
 * Individual entry on the leaderboard
 */
export interface LeaderboardEntry {
  rank: number
  userId: string
  username: string
  avatarUrl?: string
  weeklyXP: number
  league: League
  trend: RankTrend
  trendAmount?: number
  isCurrentUser: boolean
}

/**
 * Leaderboard state with zone indicators
 */
export interface LeaderboardState {
  league: League
  entries: LeaderboardEntry[]
  userRank: number
  totalInLeague: number
  promotionZone: boolean
  demotionZone: boolean
  timeUntilReset: number
  weekStartDate: string
  weekEndDate: string
}

/**
 * User's leaderboard status and preferences
 */
export interface UserLeaderboardStatus {
  userId: string
  league: League
  isOptedIn: boolean
  weeklyXP: number
  currentRank: number
  previousRank?: number
  promotionStreak: number
  lastWeekResult?: WeeklyResult
}

/**
 * Weekly result after reset
 */
export interface WeeklyResult {
  weekId: string
  league: League
  finalRank: number
  totalParticipants: number
  weeklyXP: number
  promoted: boolean
  demoted: boolean
  newLeague?: League
}

/**
 * League configuration
 */
export interface LeagueConfig {
  name: string
  displayName: string
  primaryColor: string
  secondaryColor: string
  icon: string
  promotionThreshold: number
  demotionThreshold: number
  minParticipants: number
}

/**
 * League configuration map
 */
export const LEAGUE_CONFIG: Record<League, LeagueConfig> = {
  bronze: {
    name: 'bronze',
    displayName: 'Bronze',
    primaryColor: '#CD7F32',
    secondaryColor: '#8B4513',
    icon: 'shield',
    promotionThreshold: 50,
    demotionThreshold: 0,
    minParticipants: 10,
  },
  silver: {
    name: 'silver',
    displayName: 'Silver',
    primaryColor: '#C0C0C0',
    secondaryColor: '#A9A9A9',
    icon: 'shield',
    promotionThreshold: 25,
    demotionThreshold: 25,
    minParticipants: 10,
  },
  gold: {
    name: 'gold',
    displayName: 'Gold',
    primaryColor: '#FFD700',
    secondaryColor: '#DAA520',
    icon: 'crown',
    promotionThreshold: 10,
    demotionThreshold: 25,
    minParticipants: 10,
  },
  diamond: {
    name: 'diamond',
    displayName: 'Diamond',
    primaryColor: '#B9F2FF',
    secondaryColor: '#00CED1',
    icon: 'gem',
    promotionThreshold: 0,
    demotionThreshold: 50,
    minParticipants: 10,
  },
}

/**
 * League order for comparison
 */
export const LEAGUE_ORDER: League[] = ['bronze', 'silver', 'gold', 'diamond']

/**
 * Get next league for promotion
 */
export function getNextLeague(current: League): League | null {
  const index = LEAGUE_ORDER.indexOf(current)
  if (index < LEAGUE_ORDER.length - 1) {
    return LEAGUE_ORDER[index + 1]
  }
  return null
}

/**
 * Get previous league for demotion
 */
export function getPreviousLeague(current: League): League | null {
  const index = LEAGUE_ORDER.indexOf(current)
  if (index > 0) {
    return LEAGUE_ORDER[index - 1]
  }
  return null
}

/**
 * Check if user is in promotion zone
 */
export function isInPromotionZone(rank: number, total: number, league: League): boolean {
  if (total === 0) return false
  const config = LEAGUE_CONFIG[league]
  const percentile = (rank / total) * 100
  return percentile <= config.promotionThreshold && config.promotionThreshold > 0
}

/**
 * Check if user is in demotion zone
 */
export function isInDemotionZone(rank: number, total: number, league: League): boolean {
  if (total === 0) return false
  const config = LEAGUE_CONFIG[league]
  const percentile = ((total - rank + 1) / total) * 100
  return percentile <= config.demotionThreshold && config.demotionThreshold > 0
}

/**
 * Leaderboard API response types
 */
export interface LeaderboardResponse {
  success: boolean
  data: LeaderboardState
  message?: string
}

export interface LeaderboardHistoryResponse {
  success: boolean
  data: {
    history: WeeklyResult[]
    total: number
  }
  message?: string
}

export interface OptOutResponse {
  success: boolean
  data: {
    isOptedIn: boolean
    message: string
  }
}

/**
 * Event types for leaderboard updates
 */
export interface LeaderboardEventMap {
  'leaderboard:rank-changed': { userId: string; oldRank: number; newRank: number; league: League }
  'leaderboard:promotion': { userId: string; fromLeague: League; toLeague: League }
  'leaderboard:demotion': { userId: string; fromLeague: League; toLeague: League }
  'leaderboard:weekly-reset': { weekId: string; timestamp: string }
  'leaderboard:opt-out-changed': { userId: string; isOptedIn: boolean }
}
