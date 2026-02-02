/**
 * XP Calculation Logic
 *
 * Handles all XP reward calculations including base values,
 * streak bonuses, and performance multipliers.
 */

import type { XPSource } from '../types/gamification'

/**
 * Base XP values for different activities
 */
export const XP_VALUES = {
  LESSON_COMPLETE: 10,
  QUIZ_PASS: 25,
  QUIZ_PERFECT: 50,
  DAILY_LOGIN: 5,
  STREAK_MILESTONE_5: 25,
  STREAK_MILESTONE_10: 50,
  STREAK_MILESTONE_30: 150,
  STREAK_MILESTONE_100: 500,
  BADGE_COMMON: 10,
  BADGE_RARE: 25,
  BADGE_EPIC: 50,
  BADGE_LEGENDARY: 100,
} as const

/**
 * Streak bonus configuration
 * New tiered bonus system:
 * - 1-6 days: 0% bonus
 * - 7-13 days: 10% bonus
 * - 14-29 days: 25% bonus
 * - 30-99 days: 50% bonus
 * - 100+ days: 100% bonus
 */
export const STREAK_CONFIG = {
  BONUS_MULTIPLIER_PER_DAY: 0.1, // Legacy - kept for backward compatibility
  MAX_BONUS_MULTIPLIER: 1.0, // Max 100% bonus
  FREEZE_COST: 50, // XP cost to purchase streak freeze
  MAX_FREEZES: 5, // Maximum stored streak freezes (increased from 3)
} as const

/**
 * New tiered streak bonus system
 */
export const STREAK_BONUS_TIERS = [
  { minDays: 100, bonusPercent: 100 },
  { minDays: 30, bonusPercent: 50 },
  { minDays: 14, bonusPercent: 25 },
  { minDays: 7, bonusPercent: 10 },
  { minDays: 1, bonusPercent: 0 },
] as const

/**
 * Score thresholds for bonus XP
 */
export const SCORE_THRESHOLDS = {
  PERFECT: 100,
  EXCELLENT: 90,
  GOOD: 70,
  PASS: 50,
} as const

/**
 * Calculate XP earned for completing a lesson
 */
export function calculateLessonXP(score: number, streakDays: number = 0): number {
  const baseValue = XP_VALUES.LESSON_COMPLETE
  let baseXP = baseValue as number

  // Performance bonus based on score
  if (score >= SCORE_THRESHOLDS.PERFECT) {
    baseXP = Math.floor(baseXP * 2)
  } else if (score >= SCORE_THRESHOLDS.EXCELLENT) {
    baseXP = Math.floor(baseXP * 1.5)
  } else if (score >= SCORE_THRESHOLDS.GOOD) {
    baseXP = Math.floor(baseXP * 1.2)
  }

  return applyStreakBonus(baseXP, streakDays)
}

/**
 * Calculate XP earned for completing a quiz
 */
export function calculateQuizXP(score: number, streakDays: number = 0): number {
  // No XP for failing quiz
  if (score < SCORE_THRESHOLDS.PASS) {
    return 0
  }

  let baseXP: number

  if (score >= SCORE_THRESHOLDS.PERFECT) {
    baseXP = XP_VALUES.QUIZ_PERFECT
  } else {
    baseXP = XP_VALUES.QUIZ_PASS
    // Scale between PASS and PERFECT thresholds
    const bonusRange = XP_VALUES.QUIZ_PERFECT - XP_VALUES.QUIZ_PASS
    const scoreRange = SCORE_THRESHOLDS.PERFECT - SCORE_THRESHOLDS.PASS
    const normalizedScore = (score - SCORE_THRESHOLDS.PASS) / scoreRange
    baseXP = Math.floor(XP_VALUES.QUIZ_PASS + bonusRange * normalizedScore)
  }

  return applyStreakBonus(baseXP, streakDays)
}

/**
 * Calculate daily login XP
 */
export function calculateDailyLoginXP(consecutiveDays: number): number {
  let baseXP = XP_VALUES.DAILY_LOGIN

  // Bonus for streak milestones
  if (consecutiveDays === 5) {
    baseXP += XP_VALUES.STREAK_MILESTONE_5
  } else if (consecutiveDays === 10) {
    baseXP += XP_VALUES.STREAK_MILESTONE_10
  } else if (consecutiveDays === 30) {
    baseXP += XP_VALUES.STREAK_MILESTONE_30
  } else if (consecutiveDays === 100) {
    baseXP += XP_VALUES.STREAK_MILESTONE_100
  } else if (consecutiveDays > 0 && consecutiveDays % 7 === 0) {
    // Weekly bonus
    baseXP += 15
  }

  return baseXP
}

/**
 * Get tiered streak bonus percentage
 * Uses new tiered system instead of linear scaling
 */
export function getTieredStreakBonusPercent(streakDays: number): number {
  if (streakDays <= 0) return 0

  for (const tier of STREAK_BONUS_TIERS) {
    if (streakDays >= tier.minDays) {
      return tier.bonusPercent
    }
  }

  return 0
}

/**
 * Apply streak bonus to base XP
 * Uses new tiered bonus system
 */
export function applyStreakBonus(baseXP: number, streakDays: number): number {
  if (streakDays <= 0) return baseXP

  const bonusPercent = getTieredStreakBonusPercent(streakDays)
  const bonusMultiplier = bonusPercent / 100

  return Math.floor(baseXP * (1 + bonusMultiplier))
}

/**
 * Get the bonus percentage for a given streak
 * Alias for getTieredStreakBonusPercent for backward compatibility
 */
export function getStreakBonusPercent(streakDays: number): number {
  return getTieredStreakBonusPercent(streakDays)
}

/**
 * Calculate XP based on source type
 */
export function calculateXP(
  source: XPSource,
  params: {
    score?: number
    streakDays?: number
    consecutiveDays?: number
    rarity?: 'common' | 'rare' | 'epic' | 'legendary'
  } = {}
): number {
  const { score = 100, streakDays = 0, consecutiveDays = 0, rarity } = params

  switch (source) {
    case 'lesson':
      return calculateLessonXP(score, streakDays)
    case 'quiz':
      return calculateQuizXP(score, streakDays)
    case 'daily_login':
      return calculateDailyLoginXP(consecutiveDays)
    case 'streak_bonus':
      return applyStreakBonus(10, streakDays) - 10 // Just the bonus amount
    case 'badge':
      switch (rarity) {
        case 'legendary':
          return XP_VALUES.BADGE_LEGENDARY
        case 'epic':
          return XP_VALUES.BADGE_EPIC
        case 'rare':
          return XP_VALUES.BADGE_RARE
        default:
          return XP_VALUES.BADGE_COMMON
      }
    case 'achievement':
    case 'challenge':
      return applyStreakBonus(25, streakDays)
    default:
      return 0
  }
}

/**
 * Format XP value for display
 */
export function formatXP(xp: number): string {
  if (xp >= 1000000) {
    return `${(xp / 1000000).toFixed(1)}M`
  }
  if (xp >= 1000) {
    return `${(xp / 1000).toFixed(1)}K`
  }
  return xp.toString()
}

/**
 * Get XP description for activity
 */
export function getXPDescription(source: XPSource, amount: number): string {
  const descriptions: Record<XPSource, string> = {
    lesson: 'Lesson Completed',
    quiz: 'Quiz Completed',
    daily_login: 'Daily Login',
    streak_bonus: 'Streak Bonus',
    badge: 'Badge Earned',
    achievement: 'Achievement Unlocked',
    challenge: 'Challenge Completed',
  }

  return `+${formatXP(amount)} XP - ${descriptions[source]}`
}
