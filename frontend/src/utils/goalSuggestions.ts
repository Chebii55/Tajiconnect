/**
 * Goal Suggestions Utilities
 *
 * Provides smart goal recommendations based on learner profile,
 * time commitment, and historical learning patterns.
 */

import type { LearnerProfile, LearningPreferences } from '../types/gamification'

/**
 * Time commitment mapping to daily lesson goals
 */
export interface TimeCommitmentConfig {
  minLessons: number
  maxLessons: number
  suggestedLessons: number
  dailyMinutes: string
}

/**
 * Goal suggestion result
 */
export interface GoalSuggestion {
  dailyLessonsGoal: number
  estimatedMinutes: number
  timeCommitment: 'short' | 'medium' | 'flexible'
  reason: string
  adjustmentApplied: boolean
}

/**
 * Lesson history entry for analysis
 */
export interface LessonHistoryEntry {
  completedAt: string
  duration: number // minutes
  lessonId: string
}

/**
 * Time commitment configurations
 */
const TIME_COMMITMENTS: Record<string, TimeCommitmentConfig> = {
  short: {
    minLessons: 1,
    maxLessons: 2,
    suggestedLessons: 1,
    dailyMinutes: '5-10',
  },
  medium: {
    minLessons: 3,
    maxLessons: 4,
    suggestedLessons: 3,
    dailyMinutes: '15-30',
  },
  long: {
    minLessons: 4,
    maxLessons: 6,
    suggestedLessons: 5,
    dailyMinutes: '30-60',
  },
  flexible: {
    minLessons: 2,
    maxLessons: 3,
    suggestedLessons: 2,
    dailyMinutes: '10-20',
  },
}

/**
 * Average lesson duration in minutes for estimation
 */
const AVERAGE_LESSON_DURATION = 7

/**
 * Adjustment thresholds
 */
const ADJUSTMENT_CONFIG = {
  increaseThreshold: 1.5, // If average > goal * 1.5, suggest increase
  decreaseThreshold: 0.5, // If average < goal * 0.5, suggest decrease
  maxGoal: 10,
  minGoal: 1,
  historyDays: 14, // Days of history to analyze
}

/**
 * Map session length preference to time commitment
 */
function mapSessionLengthToCommitment(
  sessionLength: LearningPreferences['preferredSessionLength']
): 'short' | 'medium' | 'flexible' {
  switch (sessionLength) {
    case 'short':
      return 'short'
    case 'medium':
      return 'medium'
    case 'long':
      return 'medium' // Map long to medium for goal purposes
    default:
      return 'flexible'
  }
}

/**
 * Calculate average daily lessons from history
 */
function calculateRecentAverage(
  history: LessonHistoryEntry[],
  days: number = ADJUSTMENT_CONFIG.historyDays
): number {
  if (!history || history.length === 0) return 0

  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  // Group lessons by day
  const dailyCounts = new Map<string, number>()

  for (const entry of history) {
    const entryDate = new Date(entry.completedAt)
    if (entryDate < cutoffDate) continue

    const dateKey = entryDate.toISOString().split('T')[0]
    dailyCounts.set(dateKey, (dailyCounts.get(dateKey) || 0) + 1)
  }

  if (dailyCounts.size === 0) return 0

  // Calculate average over days with activity
  const totalLessons = Array.from(dailyCounts.values()).reduce((sum, count) => sum + count, 0)
  return totalLessons / dailyCounts.size
}

/**
 * Get days with learning activity from history
 */
function getActiveDays(
  history: LessonHistoryEntry[],
  days: number = ADJUSTMENT_CONFIG.historyDays
): number {
  if (!history || history.length === 0) return 0

  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  const activeDates = new Set<string>()

  for (const entry of history) {
    const entryDate = new Date(entry.completedAt)
    if (entryDate < cutoffDate) continue

    const dateKey = entryDate.toISOString().split('T')[0]
    activeDates.add(dateKey)
  }

  return activeDates.size
}

/**
 * Suggest daily goal based on profile and history
 */
export function suggestDailyGoal(
  profile: LearnerProfile | null,
  history: LessonHistoryEntry[] = []
): GoalSuggestion {
  // Determine time commitment
  let timeCommitment: 'short' | 'medium' | 'flexible' = 'flexible'

  if (profile?.learningPreferences?.preferredSessionLength) {
    timeCommitment = mapSessionLengthToCommitment(profile.learningPreferences.preferredSessionLength)
  }

  const config = TIME_COMMITMENTS[timeCommitment]
  let baseGoal = config.suggestedLessons
  let adjustmentApplied = false
  let reason = `Based on your ${timeCommitment} time commitment (${config.dailyMinutes} min/day)`

  // Adjust based on historical performance
  if (history.length > 0) {
    const recentAverage = calculateRecentAverage(history)
    const activeDays = getActiveDays(history)

    if (activeDays >= 5) {
      // Enough data to make adjustments
      if (recentAverage > baseGoal * ADJUSTMENT_CONFIG.increaseThreshold) {
        const newGoal = Math.min(baseGoal + 1, ADJUSTMENT_CONFIG.maxGoal)
        if (newGoal !== baseGoal) {
          baseGoal = newGoal
          adjustmentApplied = true
          reason = `Increased based on your recent performance (avg ${recentAverage.toFixed(1)} lessons/day)`
        }
      } else if (recentAverage < baseGoal * ADJUSTMENT_CONFIG.decreaseThreshold && recentAverage > 0) {
        const newGoal = Math.max(baseGoal - 1, ADJUSTMENT_CONFIG.minGoal)
        if (newGoal !== baseGoal) {
          baseGoal = newGoal
          adjustmentApplied = true
          reason = `Adjusted for a more achievable pace (avg ${recentAverage.toFixed(1)} lessons/day)`
        }
      }
    }
  }

  // Ensure within bounds
  baseGoal = Math.min(Math.max(baseGoal, ADJUSTMENT_CONFIG.minGoal), ADJUSTMENT_CONFIG.maxGoal)

  return {
    dailyLessonsGoal: baseGoal,
    estimatedMinutes: baseGoal * AVERAGE_LESSON_DURATION,
    timeCommitment,
    reason,
    adjustmentApplied,
  }
}

/**
 * Get all available time commitment options
 */
export function getTimeCommitmentOptions(): Array<{
  value: 'short' | 'medium' | 'flexible'
  label: string
  description: string
  config: TimeCommitmentConfig
}> {
  return [
    {
      value: 'short',
      label: 'Quick (5-10 min)',
      description: '1-2 lessons per day',
      config: TIME_COMMITMENTS.short,
    },
    {
      value: 'medium',
      label: 'Standard (15-30 min)',
      description: '3-4 lessons per day',
      config: TIME_COMMITMENTS.medium,
    },
    {
      value: 'flexible',
      label: 'Flexible (10-20 min)',
      description: '2-3 lessons per day',
      config: TIME_COMMITMENTS.flexible,
    },
  ]
}

/**
 * Calculate estimated daily time for a given goal
 */
export function estimateDailyTime(lessonsGoal: number): {
  minMinutes: number
  maxMinutes: number
  formatted: string
} {
  const minMinutes = lessonsGoal * 5 // Minimum 5 min per lesson
  const maxMinutes = lessonsGoal * 10 // Maximum 10 min per lesson

  let formatted: string
  if (maxMinutes < 60) {
    formatted = `${minMinutes}-${maxMinutes} min`
  } else if (minMinutes >= 60) {
    const minHours = Math.floor(minMinutes / 60)
    const maxHours = Math.floor(maxMinutes / 60)
    formatted = `${minHours}-${maxHours}h`
  } else {
    formatted = `${minMinutes} min - ${Math.floor(maxMinutes / 60)}h`
  }

  return {
    minMinutes,
    maxMinutes,
    formatted,
  }
}

/**
 * Get goal achievement likelihood based on history
 */
export function predictGoalSuccess(
  goal: number,
  history: LessonHistoryEntry[]
): {
  likelihood: 'high' | 'medium' | 'low'
  percentage: number
  message: string
} {
  if (history.length === 0) {
    return {
      likelihood: 'medium',
      percentage: 50,
      message: 'Start learning to see predictions',
    }
  }

  const recentAverage = calculateRecentAverage(history)
  const ratio = recentAverage / goal

  if (ratio >= 1.0) {
    return {
      likelihood: 'high',
      percentage: Math.min(95, Math.round(ratio * 80)),
      message: 'You typically exceed this goal',
    }
  } else if (ratio >= 0.7) {
    return {
      likelihood: 'medium',
      percentage: Math.round(ratio * 80),
      message: 'This goal is achievable with focus',
    }
  } else {
    return {
      likelihood: 'low',
      percentage: Math.max(20, Math.round(ratio * 60)),
      message: 'Consider a smaller goal to build momentum',
    }
  }
}

export default {
  suggestDailyGoal,
  getTimeCommitmentOptions,
  estimateDailyTime,
  predictGoalSuccess,
  calculateRecentAverage,
}
