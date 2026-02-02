/**
 * Badge Definitions
 *
 * 18 meaningful badges across 4 categories with clear unlock criteria.
 * Badges are designed to recognize genuine milestones, not trivial actions.
 */

import type { BadgeRarity } from '../types/gamification'

export type BadgeCategory = 'learning' | 'consistency' | 'performance' | 'engagement'

export type CriteriaType = 'count' | 'streak' | 'level' | 'time' | 'composite'

export interface BadgeCriteria {
  type: CriteriaType
  metric: string
  threshold: number
  conditions?: BadgeCriteria[]
  timeConstraint?: {
    startHour?: number
    endHour?: number
  }
}

export interface BadgeDefinition {
  id: string
  name: string
  description: string
  icon: string
  rarity: BadgeRarity
  category: BadgeCategory
  hidden: boolean
  criteria: BadgeCriteria
  xpReward: number
  hint?: string
}

/**
 * Rarity visual configuration
 */
export const RARITY_CONFIG = {
  common: {
    color: '#9CA3AF',
    bgColor: 'bg-gray-50 dark:bg-gray-800',
    borderColor: 'border-gray-300 dark:border-gray-600',
    textColor: 'text-gray-600 dark:text-gray-400',
    glowClass: '',
    label: 'Common',
  },
  rare: {
    color: '#3B82F6',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    borderColor: 'border-blue-300 dark:border-blue-600',
    textColor: 'text-blue-600 dark:text-blue-400',
    glowClass: 'shadow-[0_0_10px_rgba(59,130,246,0.3)]',
    label: 'Rare',
  },
  epic: {
    color: '#8B5CF6',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    borderColor: 'border-purple-300 dark:border-purple-600',
    textColor: 'text-purple-600 dark:text-purple-400',
    glowClass: 'shadow-[0_0_15px_rgba(139,92,246,0.4)]',
    label: 'Epic',
  },
  legendary: {
    color: '#F59E0B',
    bgColor: 'bg-amber-50 dark:bg-amber-900/20',
    borderColor: 'border-amber-300 dark:border-amber-600',
    textColor: 'text-amber-600 dark:text-amber-400',
    glowClass: 'shadow-[0_0_20px_rgba(245,158,11,0.5)]',
    label: 'Legendary',
  },
} as const

/**
 * Badge XP rewards by rarity
 */
export const BADGE_XP_REWARDS: Record<BadgeRarity, number> = {
  common: 25,
  rare: 75,
  epic: 150,
  legendary: 300,
}

/**
 * All badge definitions (18 total)
 */
export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // ============================================
  // LEARNING MILESTONES (5 badges)
  // ============================================
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: 'book-open',
    rarity: 'common',
    category: 'learning',
    hidden: false,
    criteria: {
      type: 'count',
      metric: 'lessons_completed',
      threshold: 1,
    },
    xpReward: BADGE_XP_REWARDS.common,
    hint: 'Complete any lesson to earn this badge',
  },
  {
    id: 'course-conqueror',
    name: 'Course Conqueror',
    description: 'Complete your first course',
    icon: 'graduation-cap',
    rarity: 'rare',
    category: 'learning',
    hidden: false,
    criteria: {
      type: 'count',
      metric: 'courses_completed',
      threshold: 1,
    },
    xpReward: BADGE_XP_REWARDS.rare,
    hint: 'Finish all lessons in a course',
  },
  {
    id: 'polyglot-path',
    name: 'Polyglot Path',
    description: 'Start learning a second language or skill track',
    icon: 'languages',
    rarity: 'rare',
    category: 'learning',
    hidden: false,
    criteria: {
      type: 'count',
      metric: 'skill_tracks_started',
      threshold: 2,
    },
    xpReward: BADGE_XP_REWARDS.rare,
    hint: 'Explore multiple learning paths',
  },
  {
    id: 'knowledge-seeker',
    name: 'Knowledge Seeker',
    description: 'Complete 10 courses',
    icon: 'library',
    rarity: 'epic',
    category: 'learning',
    hidden: false,
    criteria: {
      type: 'count',
      metric: 'courses_completed',
      threshold: 10,
    },
    xpReward: BADGE_XP_REWARDS.epic,
    hint: 'Keep completing courses to earn this badge',
  },
  {
    id: 'master-scholar',
    name: 'Master Scholar',
    description: 'Complete 25 courses',
    icon: 'crown',
    rarity: 'legendary',
    category: 'learning',
    hidden: false,
    criteria: {
      type: 'count',
      metric: 'courses_completed',
      threshold: 25,
    },
    xpReward: BADGE_XP_REWARDS.legendary,
    hint: 'A true master of learning',
  },

  // ============================================
  // CONSISTENCY (4 badges)
  // ============================================
  {
    id: 'getting-started',
    name: 'Getting Started',
    description: 'Maintain a 3-day learning streak',
    icon: 'flame',
    rarity: 'common',
    category: 'consistency',
    hidden: false,
    criteria: {
      type: 'streak',
      metric: 'current_streak',
      threshold: 3,
    },
    xpReward: BADGE_XP_REWARDS.common,
    hint: 'Learn for 3 consecutive days',
  },
  {
    id: 'week-warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day learning streak',
    icon: 'calendar-check',
    rarity: 'rare',
    category: 'consistency',
    hidden: false,
    criteria: {
      type: 'streak',
      metric: 'current_streak',
      threshold: 7,
    },
    xpReward: BADGE_XP_REWARDS.rare,
    hint: 'A full week of consistent learning',
  },
  {
    id: 'month-master',
    name: 'Month Master',
    description: 'Maintain a 30-day learning streak',
    icon: 'calendar-days',
    rarity: 'epic',
    category: 'consistency',
    hidden: false,
    criteria: {
      type: 'streak',
      metric: 'current_streak',
      threshold: 30,
    },
    xpReward: BADGE_XP_REWARDS.epic,
    hint: 'One month of dedication',
  },
  {
    id: 'century-club',
    name: 'Century Club',
    description: 'Maintain a 100-day learning streak',
    icon: 'trophy',
    rarity: 'legendary',
    category: 'consistency',
    hidden: false,
    criteria: {
      type: 'streak',
      metric: 'current_streak',
      threshold: 100,
    },
    xpReward: BADGE_XP_REWARDS.legendary,
    hint: 'Join the elite 100-day club',
  },

  // ============================================
  // PERFORMANCE (5 badges)
  // ============================================
  {
    id: 'quick-learner',
    name: 'Quick Learner',
    description: 'Score 100% on 3 quizzes',
    icon: 'check-circle',
    rarity: 'common',
    category: 'performance',
    hidden: false,
    criteria: {
      type: 'count',
      metric: 'perfect_quizzes',
      threshold: 3,
    },
    xpReward: BADGE_XP_REWARDS.common,
    hint: 'Ace a few quizzes',
  },
  {
    id: 'sharp-mind',
    name: 'Sharp Mind',
    description: 'Score 100% on 10 quizzes',
    icon: 'brain',
    rarity: 'rare',
    category: 'performance',
    hidden: false,
    criteria: {
      type: 'count',
      metric: 'perfect_quizzes',
      threshold: 10,
    },
    xpReward: BADGE_XP_REWARDS.rare,
    hint: 'Perfect scores add up',
  },
  {
    id: 'flawless',
    name: 'Flawless',
    description: 'Complete a course with 100% on all quizzes',
    icon: 'sparkles',
    rarity: 'epic',
    category: 'performance',
    hidden: false,
    criteria: {
      type: 'composite',
      metric: 'flawless_course',
      threshold: 1,
      conditions: [
        { type: 'count', metric: 'course_completed', threshold: 1 },
        { type: 'count', metric: 'course_all_perfect', threshold: 1 },
      ],
    },
    xpReward: BADGE_XP_REWARDS.epic,
    hint: 'Perfection in an entire course',
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete a lesson in under 3 minutes',
    icon: 'zap',
    rarity: 'rare',
    category: 'performance',
    hidden: false,
    criteria: {
      type: 'time',
      metric: 'lesson_completion_time',
      threshold: 180, // 3 minutes in seconds
    },
    xpReward: BADGE_XP_REWARDS.rare,
    hint: 'Speed through a lesson',
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Complete 10 lessons after 10pm',
    icon: 'moon',
    rarity: 'common',
    category: 'performance',
    hidden: true,
    criteria: {
      type: 'count',
      metric: 'night_lessons',
      threshold: 10,
      timeConstraint: {
        startHour: 22,
        endHour: 5,
      },
    },
    xpReward: BADGE_XP_REWARDS.common,
    hint: '???',
  },

  // ============================================
  // ENGAGEMENT (4 badges)
  // ============================================
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Login before 6am, 5 times',
    icon: 'sunrise',
    rarity: 'common',
    category: 'engagement',
    hidden: true,
    criteria: {
      type: 'count',
      metric: 'early_logins',
      threshold: 5,
      timeConstraint: {
        startHour: 4,
        endHour: 6,
      },
    },
    xpReward: BADGE_XP_REWARDS.common,
    hint: '???',
  },
  {
    id: 'level-10',
    name: 'Rising Star',
    description: 'Reach level 10',
    icon: 'star',
    rarity: 'rare',
    category: 'engagement',
    hidden: false,
    criteria: {
      type: 'level',
      metric: 'current_level',
      threshold: 10,
    },
    xpReward: BADGE_XP_REWARDS.rare,
    hint: 'Keep earning XP to level up',
  },
  {
    id: 'level-25',
    name: 'Veteran Learner',
    description: 'Reach level 25',
    icon: 'award',
    rarity: 'epic',
    category: 'engagement',
    hidden: false,
    criteria: {
      type: 'level',
      metric: 'current_level',
      threshold: 25,
    },
    xpReward: BADGE_XP_REWARDS.epic,
    hint: 'Halfway to mastery',
  },
  {
    id: 'level-40',
    name: 'Learning Legend',
    description: 'Reach level 40',
    icon: 'gem',
    rarity: 'legendary',
    category: 'engagement',
    hidden: false,
    criteria: {
      type: 'level',
      metric: 'current_level',
      threshold: 40,
    },
    xpReward: BADGE_XP_REWARDS.legendary,
    hint: 'Legendary status awaits',
  },
]

/**
 * Get badge definition by ID
 */
export function getBadgeById(badgeId: string): BadgeDefinition | undefined {
  return BADGE_DEFINITIONS.find((badge) => badge.id === badgeId)
}

/**
 * Get all badges by category
 */
export function getBadgesByCategory(category: BadgeCategory): BadgeDefinition[] {
  return BADGE_DEFINITIONS.filter((badge) => badge.category === category)
}

/**
 * Get all badges by rarity
 */
export function getBadgesByRarity(rarity: BadgeRarity): BadgeDefinition[] {
  return BADGE_DEFINITIONS.filter((badge) => badge.rarity === rarity)
}

/**
 * Get all visible badges (non-hidden)
 */
export function getVisibleBadges(): BadgeDefinition[] {
  return BADGE_DEFINITIONS.filter((badge) => !badge.hidden)
}

/**
 * Get all hidden badges
 */
export function getHiddenBadges(): BadgeDefinition[] {
  return BADGE_DEFINITIONS.filter((badge) => badge.hidden)
}

/**
 * Badge category labels
 */
export const BADGE_CATEGORY_LABELS: Record<BadgeCategory, string> = {
  learning: 'Learning Milestones',
  consistency: 'Consistency',
  performance: 'Performance',
  engagement: 'Engagement',
}

/**
 * Badge category icons
 */
export const BADGE_CATEGORY_ICONS: Record<BadgeCategory, string> = {
  learning: 'book-open',
  consistency: 'flame',
  performance: 'zap',
  engagement: 'trophy',
}

export default BADGE_DEFINITIONS
