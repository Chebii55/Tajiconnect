/**
 * Level Progression System
 *
 * Uses exponential growth with diminishing returns for balanced progression.
 * Formula: XP = 100 * level^1.5
 */

import type { LevelInfo } from '../types/gamification'

/**
 * Level system configuration
 */
export const LEVEL_CONFIG = {
  BASE_XP: 100, // XP needed for level 1
  EXPONENT: 1.5, // Growth rate (higher = steeper curve)
  MAX_LEVEL: 100, // Maximum achievable level
} as const

/**
 * Level titles for milestone levels
 */
export const LEVEL_TITLES: Record<number, string> = {
  1: 'Newcomer',
  5: 'Apprentice',
  10: 'Learner',
  15: 'Student',
  20: 'Scholar',
  25: 'Practitioner',
  30: 'Specialist',
  40: 'Expert',
  50: 'Master',
  60: 'Grandmaster',
  75: 'Sage',
  90: 'Luminary',
  100: 'Legend',
}

/**
 * Calculate XP required for a specific level
 * Uses formula: XP = 100 * level^1.5
 */
export function xpForLevel(level: number): number {
  if (level <= 0) return 0
  if (level > LEVEL_CONFIG.MAX_LEVEL) return xpForLevel(LEVEL_CONFIG.MAX_LEVEL)

  return Math.floor(LEVEL_CONFIG.BASE_XP * Math.pow(level, LEVEL_CONFIG.EXPONENT))
}

/**
 * Calculate cumulative XP required to reach a level
 */
export function cumulativeXPForLevel(level: number): number {
  if (level <= 1) return 0

  let total = 0
  for (let i = 1; i < level; i++) {
    total += xpForLevel(i)
  }
  return total
}

/**
 * Calculate level from total XP
 * Returns level info including progress to next level
 */
export function calculateLevel(totalXP: number): LevelInfo {
  if (totalXP <= 0) {
    return {
      level: 1,
      currentXP: 0,
      xpToNextLevel: xpForLevel(1),
      totalXP: 0,
      progressPercent: 0,
    }
  }

  let level = 1
  let xpRemaining = totalXP
  let xpNeeded = xpForLevel(level)

  // Find current level by consuming XP
  while (xpRemaining >= xpNeeded && level < LEVEL_CONFIG.MAX_LEVEL) {
    xpRemaining -= xpNeeded
    level++
    xpNeeded = xpForLevel(level)
  }

  // Cap at max level
  if (level >= LEVEL_CONFIG.MAX_LEVEL) {
    return {
      level: LEVEL_CONFIG.MAX_LEVEL,
      currentXP: xpRemaining,
      xpToNextLevel: 0, // Max level reached
      totalXP,
      progressPercent: 100,
    }
  }

  const progressPercent = Math.floor((xpRemaining / xpNeeded) * 100)

  return {
    level,
    currentXP: xpRemaining,
    xpToNextLevel: xpNeeded - xpRemaining,
    totalXP,
    progressPercent,
  }
}

/**
 * Check if adding XP would cause a level up
 */
export function wouldLevelUp(currentTotalXP: number, xpToAdd: number): boolean {
  const currentLevel = calculateLevel(currentTotalXP).level
  const newLevel = calculateLevel(currentTotalXP + xpToAdd).level
  return newLevel > currentLevel
}

/**
 * Get the number of levels gained from XP addition
 */
export function getLevelsGained(currentTotalXP: number, xpToAdd: number): number {
  const currentLevel = calculateLevel(currentTotalXP).level
  const newLevel = calculateLevel(currentTotalXP + xpToAdd).level
  return Math.max(0, newLevel - currentLevel)
}

/**
 * Get title for a specific level
 */
export function getLevelTitle(level: number): string {
  // Find the highest milestone at or below current level
  const milestones = Object.keys(LEVEL_TITLES)
    .map(Number)
    .sort((a, b) => b - a)

  for (const milestone of milestones) {
    if (level >= milestone) {
      return LEVEL_TITLES[milestone]
    }
  }

  return 'Newcomer'
}

/**
 * Get XP breakdown for a level range
 */
export function getLevelXPBreakdown(
  startLevel: number,
  endLevel: number
): Array<{ level: number; xpRequired: number; cumulativeXP: number }> {
  const breakdown: Array<{ level: number; xpRequired: number; cumulativeXP: number }> = []
  let cumulative = cumulativeXPForLevel(startLevel)

  for (let level = startLevel; level <= endLevel; level++) {
    const xpRequired = xpForLevel(level)
    breakdown.push({
      level,
      xpRequired,
      cumulativeXP: cumulative,
    })
    cumulative += xpRequired
  }

  return breakdown
}

/**
 * Calculate estimated time to reach target level
 * Based on average daily XP
 */
export function estimateTimeToLevel(
  currentTotalXP: number,
  targetLevel: number,
  averageDailyXP: number
): { days: number; weeks: number } {
  if (averageDailyXP <= 0) {
    return { days: Infinity, weeks: Infinity }
  }

  const currentLevel = calculateLevel(currentTotalXP).level
  if (currentLevel >= targetLevel) {
    return { days: 0, weeks: 0 }
  }

  const targetXP = cumulativeXPForLevel(targetLevel)
  const xpNeeded = targetXP - currentTotalXP
  const days = Math.ceil(xpNeeded / averageDailyXP)

  return {
    days,
    weeks: Math.ceil(days / 7),
  }
}

/**
 * Format level for display with title
 */
export function formatLevel(level: number): string {
  const title = getLevelTitle(level)
  return `Level ${level} - ${title}`
}

/**
 * Get progress bar segments for level display
 */
export function getLevelProgressSegments(
  levelInfo: LevelInfo,
  segments: number = 10
): boolean[] {
  const filledSegments = Math.floor((levelInfo.progressPercent / 100) * segments)
  return Array.from({ length: segments }, (_, i) => i < filledSegments)
}

/**
 * Check if level is a milestone level
 */
export function isMilestoneLevel(level: number): boolean {
  return level in LEVEL_TITLES
}

/**
 * Get next milestone level
 */
export function getNextMilestone(currentLevel: number): number {
  const milestones = Object.keys(LEVEL_TITLES).map(Number).sort((a, b) => a - b)

  for (const milestone of milestones) {
    if (milestone > currentLevel) {
      return milestone
    }
  }

  return LEVEL_CONFIG.MAX_LEVEL
}
