/**
 * Streak Engine
 *
 * Core logic for daily learning streak tracking with freeze protection.
 * Handles streak calculation, freeze management, and milestone detection.
 */

import { eventBus } from './eventBus'
import type { StreakData } from '../types/gamification'

/**
 * Streak milestone configuration
 */
export const STREAK_MILESTONES = {
  7: {
    title: 'Week Warrior!',
    description: 'You maintained a 7-day learning streak!',
    freezeReward: 1,
    badgeId: 'week-warrior',
    confettiType: 'blue' as const,
  },
  30: {
    title: 'Month Master!',
    description: 'You maintained a 30-day learning streak!',
    freezeReward: 2,
    badgeId: 'month-master',
    confettiType: 'gold' as const,
  },
  100: {
    title: 'Century Club!',
    description: 'You maintained a 100-day learning streak!',
    freezeReward: 5,
    badgeId: 'centurion',
    confettiType: 'rainbow' as const,
  },
} as const

export type MilestoneDay = keyof typeof STREAK_MILESTONES

/**
 * XP Streak bonus tiers
 * Based on streak length, users earn bonus XP on activities
 */
export const STREAK_XP_BONUS_TIERS = [
  { minDays: 100, bonusPercent: 100 },
  { minDays: 30, bonusPercent: 50 },
  { minDays: 14, bonusPercent: 25 },
  { minDays: 7, bonusPercent: 10 },
  { minDays: 1, bonusPercent: 0 },
] as const

/**
 * Streak configuration
 */
export const STREAK_CONFIG = {
  MAX_FREEZES: 5,
  WARNING_HOUR: 20, // 8 PM local time
  FREEZE_RECOVERY_HOURS: 24,
  INITIAL_FREEZES: 0,
} as const

/**
 * Streak state interface
 */
export interface StreakState {
  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null // ISO date YYYY-MM-DD
  streakFreezes: number
  freezeUsedToday: boolean
  streakAtRisk: boolean
  freezeActiveDate: string | null // Date when freeze was used
}

/**
 * Streak update result
 */
export interface StreakUpdate {
  newStreak: number
  previousStreak: number
  isNewRecord: boolean
  milestone: MilestoneDay | null
  xpMultiplier: number
  freezesAwarded: number
  badgeAwarded: string | null
}

/**
 * Streak status result
 */
export interface StreakStatus {
  isAtRisk: boolean
  hoursUntilReset: number
  hasActivityToday: boolean
  canUseFreeze: boolean
  freezesAvailable: number
  currentStreak: number
}

/**
 * Get today's date string in YYYY-MM-DD format
 */
export function getTodayDateString(): string {
  const now = new Date()
  return now.toISOString().split('T')[0]
}

/**
 * Get yesterday's date string in YYYY-MM-DD format
 */
export function getYesterdayDateString(): string {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return yesterday.toISOString().split('T')[0]
}

/**
 * Check if a date string is today
 */
export function isToday(dateString: string | null): boolean {
  if (!dateString) return false
  return dateString === getTodayDateString()
}

/**
 * Check if a date string is yesterday
 */
export function isYesterday(dateString: string | null): boolean {
  if (!dateString) return false
  return dateString === getYesterdayDateString()
}

/**
 * Calculate hours until midnight (local time)
 */
export function getHoursUntilMidnight(): number {
  const now = new Date()
  const midnight = new Date()
  midnight.setDate(midnight.getDate() + 1)
  midnight.setHours(0, 0, 0, 0)

  const msUntilMidnight = midnight.getTime() - now.getTime()
  return Math.floor(msUntilMidnight / (1000 * 60 * 60))
}

/**
 * Check if current time is after warning hour (default 8 PM)
 */
export function isAfterWarningHour(): boolean {
  const now = new Date()
  return now.getHours() >= STREAK_CONFIG.WARNING_HOUR
}

/**
 * Get XP bonus percentage for a given streak length
 */
export function getStreakBonusPercent(streakDays: number): number {
  for (const tier of STREAK_XP_BONUS_TIERS) {
    if (streakDays >= tier.minDays) {
      return tier.bonusPercent
    }
  }
  return 0
}

/**
 * Get XP multiplier for a given streak length
 * Returns value like 1.0, 1.1, 1.25, 1.5, 2.0
 */
export function getStreakMultiplier(streakDays: number): number {
  const bonusPercent = getStreakBonusPercent(streakDays)
  return 1 + (bonusPercent / 100)
}

/**
 * Check if streak day is a milestone
 */
export function isMilestoneDay(streakDays: number): streakDays is MilestoneDay {
  return streakDays in STREAK_MILESTONES
}

/**
 * Get milestone info for a streak day
 */
export function getMilestoneInfo(streakDays: number) {
  if (isMilestoneDay(streakDays)) {
    return STREAK_MILESTONES[streakDays]
  }
  return null
}

/**
 * Get next milestone for a given streak
 */
export function getNextMilestone(currentStreak: number): MilestoneDay | null {
  const milestones = Object.keys(STREAK_MILESTONES)
    .map(Number)
    .sort((a, b) => a - b) as MilestoneDay[]

  for (const milestone of milestones) {
    if (milestone > currentStreak) {
      return milestone
    }
  }

  return null
}

/**
 * Calculate days until next milestone
 */
export function getDaysUntilNextMilestone(currentStreak: number): number | null {
  const nextMilestone = getNextMilestone(currentStreak)
  if (nextMilestone === null) return null
  return nextMilestone - currentStreak
}

/**
 * StreakEngine class
 * Handles all streak-related calculations and state management
 */
export class StreakEngine {
  private state: StreakState

  constructor(initialState?: Partial<StreakState>) {
    this.state = {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      streakFreezes: STREAK_CONFIG.INITIAL_FREEZES,
      freezeUsedToday: false,
      streakAtRisk: false,
      freezeActiveDate: null,
      ...initialState,
    }
  }

  /**
   * Get current state
   */
  getState(): StreakState {
    return { ...this.state }
  }

  /**
   * Update state
   */
  setState(newState: Partial<StreakState>): void {
    this.state = { ...this.state, ...newState }
  }

  /**
   * Record activity and update streak
   */
  recordActivity(): StreakUpdate {
    const today = getTodayDateString()
    const previousStreak = this.state.currentStreak
    let newStreak = 1
    let freezesAwarded = 0
    let badgeAwarded: string | null = null

    // Check if already active today
    if (isToday(this.state.lastActivityDate)) {
      // Already recorded today, no streak change
      return {
        newStreak: this.state.currentStreak,
        previousStreak,
        isNewRecord: false,
        milestone: null,
        xpMultiplier: getStreakMultiplier(this.state.currentStreak),
        freezesAwarded: 0,
        badgeAwarded: null,
      }
    }

    // Check if continuing streak from yesterday
    if (isYesterday(this.state.lastActivityDate)) {
      newStreak = this.state.currentStreak + 1
    } else if (this.state.freezeActiveDate && isYesterday(this.state.freezeActiveDate)) {
      // Freeze was used yesterday, continue streak
      newStreak = this.state.currentStreak + 1
    }

    // Update longest streak
    const isNewRecord = newStreak > this.state.longestStreak

    // Check for milestone
    const milestone = isMilestoneDay(newStreak) ? newStreak : null
    if (milestone) {
      const milestoneInfo = getMilestoneInfo(milestone)
      if (milestoneInfo) {
        freezesAwarded = milestoneInfo.freezeReward
        badgeAwarded = milestoneInfo.badgeId

        // Emit milestone event
        eventBus.emit('streak:updated', {
          currentStreak: newStreak,
          isNewRecord,
          streakFreezes: this.state.streakFreezes + freezesAwarded,
        })
      }
    }

    // Update state
    this.state = {
      ...this.state,
      currentStreak: newStreak,
      longestStreak: Math.max(this.state.longestStreak, newStreak),
      lastActivityDate: today,
      streakFreezes: Math.min(
        this.state.streakFreezes + freezesAwarded,
        STREAK_CONFIG.MAX_FREEZES
      ),
      streakAtRisk: false,
      freezeUsedToday: false,
      freezeActiveDate: null,
    }

    return {
      newStreak,
      previousStreak,
      isNewRecord,
      milestone,
      xpMultiplier: getStreakMultiplier(newStreak),
      freezesAwarded,
      badgeAwarded,
    }
  }

  /**
   * Check streak status
   */
  checkStreakStatus(): StreakStatus {
    const hasActivityToday = isToday(this.state.lastActivityDate)
    const isAtRisk = !hasActivityToday && isAfterWarningHour() && this.state.currentStreak > 0
    const canUseFreeze = !hasActivityToday && this.state.streakFreezes > 0 && this.state.currentStreak > 0

    // Update at-risk state
    this.state.streakAtRisk = isAtRisk

    return {
      isAtRisk,
      hoursUntilReset: getHoursUntilMidnight(),
      hasActivityToday,
      canUseFreeze,
      freezesAvailable: this.state.streakFreezes,
      currentStreak: this.state.currentStreak,
    }
  }

  /**
   * Use a streak freeze to protect the streak
   */
  useFreeze(): boolean {
    // Can't use freeze if:
    // - No freezes available
    // - Already used freeze today
    // - Already have activity today
    // - No streak to protect
    if (
      this.state.streakFreezes <= 0 ||
      this.state.freezeUsedToday ||
      isToday(this.state.lastActivityDate) ||
      this.state.currentStreak <= 0
    ) {
      return false
    }

    const today = getTodayDateString()

    this.state = {
      ...this.state,
      streakFreezes: this.state.streakFreezes - 1,
      freezeUsedToday: true,
      freezeActiveDate: today,
      streakAtRisk: false,
    }

    return true
  }

  /**
   * Award freezes (for milestones or purchases)
   */
  awardFreezes(count: number, reason: string): number {
    const previousFreezes = this.state.streakFreezes
    const newFreezes = Math.min(
      this.state.streakFreezes + count,
      STREAK_CONFIG.MAX_FREEZES
    )
    const awarded = newFreezes - previousFreezes

    this.state.streakFreezes = newFreezes

    console.log(`[StreakEngine] Awarded ${awarded} freezes for: ${reason}`)

    return awarded
  }

  /**
   * Check if streak should be broken (called on app load)
   */
  checkAndBreakStreak(): { broken: boolean; previousStreak: number } {
    const today = getTodayDateString()
    const yesterday = getYesterdayDateString()

    // If no activity and no freeze used
    if (
      this.state.lastActivityDate !== today &&
      this.state.lastActivityDate !== yesterday &&
      this.state.freezeActiveDate !== yesterday &&
      this.state.currentStreak > 0
    ) {
      const previousStreak = this.state.currentStreak

      // Emit streak broken event
      eventBus.emit('streak:broken', {
        previousStreak,
        longestStreak: this.state.longestStreak,
      })

      // Reset streak
      this.state = {
        ...this.state,
        currentStreak: 0,
        streakAtRisk: false,
        freezeUsedToday: false,
        freezeActiveDate: null,
      }

      return { broken: true, previousStreak }
    }

    return { broken: false, previousStreak: this.state.currentStreak }
  }

  /**
   * Get streak data for display
   */
  getStreakData(): StreakData {
    return {
      currentStreak: this.state.currentStreak,
      longestStreak: this.state.longestStreak,
      lastActivityDate: this.state.lastActivityDate,
      streakFreezes: this.state.streakFreezes,
      isAtRisk: this.state.streakAtRisk,
    }
  }
}

/**
 * Create a new StreakEngine instance
 */
export function createStreakEngine(initialState?: Partial<StreakState>): StreakEngine {
  return new StreakEngine(initialState)
}

export default StreakEngine
