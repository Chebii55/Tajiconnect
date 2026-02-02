/**
 * Badge Engine
 *
 * Core logic for badge unlock detection, progress tracking,
 * and user metrics evaluation.
 */

import {
  BADGE_DEFINITIONS,
  getBadgeById,
  type BadgeDefinition,
  type BadgeCriteria,
  type BadgeCategory,
} from '../data/badges'
import type { Badge, BadgeRarity } from '../types/gamification'

/**
 * User metrics for badge evaluation
 */
export interface UserMetrics {
  // Learning metrics
  lessons_completed: number
  courses_completed: number
  skill_tracks_started: number

  // Streak metrics
  current_streak: number
  longest_streak: number

  // Performance metrics
  perfect_quizzes: number
  flawless_courses: number
  fastest_lesson_time: number // in seconds
  night_lessons: number
  early_logins: number

  // Engagement metrics
  current_level: number
  total_xp: number

  // Time-based tracking
  lessons_completed_times: string[] // ISO timestamps
  login_times: string[] // ISO timestamps
}

/**
 * Default user metrics for new users
 */
export const DEFAULT_USER_METRICS: UserMetrics = {
  lessons_completed: 0,
  courses_completed: 0,
  skill_tracks_started: 0,
  current_streak: 0,
  longest_streak: 0,
  perfect_quizzes: 0,
  flawless_courses: 0,
  fastest_lesson_time: Infinity,
  night_lessons: 0,
  early_logins: 0,
  current_level: 1,
  total_xp: 0,
  lessons_completed_times: [],
  login_times: [],
}

/**
 * Badge progress information
 */
export interface BadgeProgress {
  badgeId: string
  currentValue: number
  targetValue: number
  progressPercent: number
  isUnlocked: boolean
  unlockedAt?: string
}

/**
 * Badge unlock result
 */
export interface BadgeUnlockResult {
  badge: BadgeDefinition
  unlockedAt: string
  xpReward: number
  isFirstUnlock: boolean
}

/**
 * Badge Engine class
 *
 * Handles all badge-related logic including:
 * - Checking unlock conditions
 * - Tracking progress
 * - Managing unlocked badges
 */
export class BadgeEngine {
  private unlockedBadges: Map<string, string> = new Map() // badgeId -> unlockedAt
  private userMetrics: UserMetrics = { ...DEFAULT_USER_METRICS }

  constructor(
    unlockedBadgeIds: string[] = [],
    initialMetrics: Partial<UserMetrics> = {}
  ) {
    // Initialize unlocked badges
    unlockedBadgeIds.forEach((id) => {
      this.unlockedBadges.set(id, new Date().toISOString())
    })

    // Initialize metrics
    this.userMetrics = { ...DEFAULT_USER_METRICS, ...initialMetrics }
  }

  /**
   * Update user metrics
   */
  updateMetrics(updates: Partial<UserMetrics>): void {
    this.userMetrics = { ...this.userMetrics, ...updates }
  }

  /**
   * Get current user metrics
   */
  getMetrics(): UserMetrics {
    return { ...this.userMetrics }
  }

  /**
   * Set unlocked badges from storage
   */
  setUnlockedBadges(badges: Array<{ id: string; unlockedAt: string }>): void {
    this.unlockedBadges.clear()
    badges.forEach(({ id, unlockedAt }) => {
      this.unlockedBadges.set(id, unlockedAt)
    })
  }

  /**
   * Check if a specific badge is unlocked
   */
  isBadgeUnlocked(badgeId: string): boolean {
    return this.unlockedBadges.has(badgeId)
  }

  /**
   * Get when a badge was unlocked
   */
  getBadgeUnlockDate(badgeId: string): string | undefined {
    return this.unlockedBadges.get(badgeId)
  }

  /**
   * Check all badges for potential unlocks based on current metrics
   * Returns array of newly unlocked badges
   */
  checkAllUnlocks(): BadgeUnlockResult[] {
    const newUnlocks: BadgeUnlockResult[] = []

    for (const badge of BADGE_DEFINITIONS) {
      // Skip if already unlocked
      if (this.unlockedBadges.has(badge.id)) {
        continue
      }

      // Check if criteria is met
      if (this.evaluateCriteria(badge.criteria)) {
        const unlockResult = this.unlockBadge(badge)
        if (unlockResult) {
          newUnlocks.push(unlockResult)
        }
      }
    }

    return newUnlocks
  }

  /**
   * Check for unlocks related to a specific event type
   */
  checkUnlocksForEvent(
    eventType: 'lesson' | 'quiz' | 'course' | 'streak' | 'level' | 'login'
  ): BadgeUnlockResult[] {
    const relevantBadges = this.getBadgesForEventType(eventType)
    const newUnlocks: BadgeUnlockResult[] = []

    for (const badge of relevantBadges) {
      if (this.unlockedBadges.has(badge.id)) {
        continue
      }

      if (this.evaluateCriteria(badge.criteria)) {
        const unlockResult = this.unlockBadge(badge)
        if (unlockResult) {
          newUnlocks.push(unlockResult)
        }
      }
    }

    return newUnlocks
  }

  /**
   * Get badges relevant to a specific event type
   */
  private getBadgesForEventType(
    eventType: 'lesson' | 'quiz' | 'course' | 'streak' | 'level' | 'login'
  ): BadgeDefinition[] {
    const metricMap: Record<string, string[]> = {
      lesson: ['lessons_completed', 'lesson_completion_time', 'night_lessons'],
      quiz: ['perfect_quizzes'],
      course: ['courses_completed', 'skill_tracks_started', 'flawless_course'],
      streak: ['current_streak'],
      level: ['current_level'],
      login: ['early_logins'],
    }

    const relevantMetrics = metricMap[eventType] || []

    return BADGE_DEFINITIONS.filter((badge) => {
      const metric = badge.criteria.metric
      return relevantMetrics.some(
        (m) => metric.includes(m) || badge.criteria.metric === m
      )
    })
  }

  /**
   * Unlock a badge and return the result
   */
  private unlockBadge(badge: BadgeDefinition): BadgeUnlockResult | null {
    if (this.unlockedBadges.has(badge.id)) {
      return null
    }

    const unlockedAt = new Date().toISOString()
    this.unlockedBadges.set(badge.id, unlockedAt)

    return {
      badge,
      unlockedAt,
      xpReward: badge.xpReward,
      isFirstUnlock: true,
    }
  }

  /**
   * Evaluate if criteria is met
   */
  private evaluateCriteria(criteria: BadgeCriteria): boolean {
    switch (criteria.type) {
      case 'count':
        return this.evaluateCountCriteria(criteria)
      case 'streak':
        return this.evaluateStreakCriteria(criteria)
      case 'level':
        return this.evaluateLevelCriteria(criteria)
      case 'time':
        return this.evaluateTimeCriteria(criteria)
      case 'composite':
        return this.evaluateCompositeCriteria(criteria)
      default:
        return false
    }
  }

  /**
   * Evaluate count-based criteria
   */
  private evaluateCountCriteria(criteria: BadgeCriteria): boolean {
    const value = this.getMetricValue(criteria.metric)
    return value >= criteria.threshold
  }

  /**
   * Evaluate streak-based criteria
   */
  private evaluateStreakCriteria(criteria: BadgeCriteria): boolean {
    const currentStreak = this.userMetrics.current_streak
    return currentStreak >= criteria.threshold
  }

  /**
   * Evaluate level-based criteria
   */
  private evaluateLevelCriteria(criteria: BadgeCriteria): boolean {
    const currentLevel = this.userMetrics.current_level
    return currentLevel >= criteria.threshold
  }

  /**
   * Evaluate time-based criteria (for speed achievements)
   */
  private evaluateTimeCriteria(criteria: BadgeCriteria): boolean {
    if (criteria.metric === 'lesson_completion_time') {
      return this.userMetrics.fastest_lesson_time <= criteria.threshold
    }
    return false
  }

  /**
   * Evaluate composite criteria (all conditions must be met)
   */
  private evaluateCompositeCriteria(criteria: BadgeCriteria): boolean {
    if (!criteria.conditions || criteria.conditions.length === 0) {
      return false
    }

    return criteria.conditions.every((condition) =>
      this.evaluateCriteria(condition)
    )
  }

  /**
   * Get the current value for a metric
   */
  private getMetricValue(metric: string): number {
    const metricKey = metric as keyof UserMetrics
    const value = this.userMetrics[metricKey]

    if (typeof value === 'number') {
      return value
    }

    if (Array.isArray(value)) {
      return value.length
    }

    return 0
  }

  /**
   * Get progress for a specific badge
   */
  getProgress(badgeId: string): BadgeProgress {
    const badge = getBadgeById(badgeId)

    if (!badge) {
      return {
        badgeId,
        currentValue: 0,
        targetValue: 0,
        progressPercent: 0,
        isUnlocked: false,
      }
    }

    const isUnlocked = this.unlockedBadges.has(badgeId)
    const unlockedAt = this.unlockedBadges.get(badgeId)

    if (isUnlocked) {
      return {
        badgeId,
        currentValue: badge.criteria.threshold,
        targetValue: badge.criteria.threshold,
        progressPercent: 100,
        isUnlocked: true,
        unlockedAt,
      }
    }

    const currentValue = this.getCurrentValueForCriteria(badge.criteria)
    const targetValue = badge.criteria.threshold
    const progressPercent = Math.min(
      100,
      Math.round((currentValue / targetValue) * 100)
    )

    return {
      badgeId,
      currentValue,
      targetValue,
      progressPercent,
      isUnlocked: false,
    }
  }

  /**
   * Get current value for criteria progress
   */
  private getCurrentValueForCriteria(criteria: BadgeCriteria): number {
    switch (criteria.type) {
      case 'count':
      case 'streak':
      case 'level':
        return this.getMetricValue(criteria.metric)
      case 'time':
        if (criteria.metric === 'lesson_completion_time') {
          const fastestTime = this.userMetrics.fastest_lesson_time
          if (fastestTime === Infinity) return 0
          // Invert for progress (lower time = higher progress)
          return Math.max(0, criteria.threshold - fastestTime + criteria.threshold)
        }
        return 0
      case 'composite':
        if (!criteria.conditions) return 0
        const metConditions = criteria.conditions.filter((c) =>
          this.evaluateCriteria(c)
        ).length
        return metConditions
      default:
        return 0
    }
  }

  /**
   * Get all unlocked badges with their definitions
   */
  getUnlockedBadges(): Array<BadgeDefinition & { unlockedAt: string }> {
    const unlocked: Array<BadgeDefinition & { unlockedAt: string }> = []

    this.unlockedBadges.forEach((unlockedAt, badgeId) => {
      const badge = getBadgeById(badgeId)
      if (badge) {
        unlocked.push({ ...badge, unlockedAt })
      }
    })

    // Sort by unlock date (most recent first)
    return unlocked.sort(
      (a, b) =>
        new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime()
    )
  }

  /**
   * Get all badges with unlock status
   */
  getAllBadges(
    showHidden = false
  ): Array<BadgeDefinition & { isUnlocked: boolean; unlockedAt?: string }> {
    return BADGE_DEFINITIONS.filter((badge) => showHidden || !badge.hidden).map(
      (badge) => ({
        ...badge,
        isUnlocked: this.unlockedBadges.has(badge.id),
        unlockedAt: this.unlockedBadges.get(badge.id),
      })
    )
  }

  /**
   * Get badges by category with unlock status
   */
  getBadgesByCategory(
    category: BadgeCategory,
    showHidden = false
  ): Array<BadgeDefinition & { isUnlocked: boolean; unlockedAt?: string }> {
    return this.getAllBadges(showHidden).filter(
      (badge) => badge.category === category
    )
  }

  /**
   * Get badge statistics
   */
  getStats(): {
    total: number
    unlocked: number
    locked: number
    progressPercent: number
    byRarity: Record<BadgeRarity, { total: number; unlocked: number }>
    byCategory: Record<BadgeCategory, { total: number; unlocked: number }>
  } {
    const visibleBadges = BADGE_DEFINITIONS.filter((b) => !b.hidden)
    const total = visibleBadges.length
    const unlocked = visibleBadges.filter((b) =>
      this.unlockedBadges.has(b.id)
    ).length
    const locked = total - unlocked
    const progressPercent = Math.round((unlocked / total) * 100)

    const byRarity: Record<BadgeRarity, { total: number; unlocked: number }> = {
      common: { total: 0, unlocked: 0 },
      rare: { total: 0, unlocked: 0 },
      epic: { total: 0, unlocked: 0 },
      legendary: { total: 0, unlocked: 0 },
    }

    const byCategory: Record<
      BadgeCategory,
      { total: number; unlocked: number }
    > = {
      learning: { total: 0, unlocked: 0 },
      consistency: { total: 0, unlocked: 0 },
      performance: { total: 0, unlocked: 0 },
      engagement: { total: 0, unlocked: 0 },
    }

    visibleBadges.forEach((badge) => {
      byRarity[badge.rarity].total++
      byCategory[badge.category].total++

      if (this.unlockedBadges.has(badge.id)) {
        byRarity[badge.rarity].unlocked++
        byCategory[badge.category].unlocked++
      }
    })

    return {
      total,
      unlocked,
      locked,
      progressPercent,
      byRarity,
      byCategory,
    }
  }

  /**
   * Check if user has any hidden badges unlocked
   */
  hasHiddenBadges(): boolean {
    const hiddenBadges = BADGE_DEFINITIONS.filter((b) => b.hidden)
    return hiddenBadges.some((b) => this.unlockedBadges.has(b.id))
  }

  /**
   * Get recently unlocked badges (last 7 days)
   */
  getRecentUnlocks(
    days = 7
  ): Array<BadgeDefinition & { unlockedAt: string }> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    return this.getUnlockedBadges().filter(
      (badge) => new Date(badge.unlockedAt) >= cutoffDate
    )
  }

  /**
   * Export unlocked badges for persistence
   */
  exportUnlockedBadges(): Array<{ id: string; unlockedAt: string }> {
    const exported: Array<{ id: string; unlockedAt: string }> = []
    this.unlockedBadges.forEach((unlockedAt, id) => {
      exported.push({ id, unlockedAt })
    })
    return exported
  }
}

/**
 * Create a singleton badge engine instance
 */
let badgeEngineInstance: BadgeEngine | null = null

export function getBadgeEngine(): BadgeEngine {
  if (!badgeEngineInstance) {
    badgeEngineInstance = new BadgeEngine()
  }
  return badgeEngineInstance
}

export function initializeBadgeEngine(
  unlockedBadgeIds: string[] = [],
  initialMetrics: Partial<UserMetrics> = {}
): BadgeEngine {
  badgeEngineInstance = new BadgeEngine(unlockedBadgeIds, initialMetrics)
  return badgeEngineInstance
}

export function resetBadgeEngine(): void {
  badgeEngineInstance = null
}

export default BadgeEngine
