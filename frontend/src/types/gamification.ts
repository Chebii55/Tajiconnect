// Gamification System Type Definitions

/**
 * Badge definition with rarity and requirements
 */
export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  category: BadgeCategory
  rarity: BadgeRarity
  xpReward: number
  unlockedAt?: string
}

export type BadgeCategory =
  | 'achievement'
  | 'streak'
  | 'mastery'
  | 'social'
  | 'special'

export type BadgeRarity =
  | 'common'
  | 'rare'
  | 'epic'
  | 'legendary'

/**
 * XP earning event with source tracking
 */
export interface XPEarnedEvent {
  amount: number
  source: XPSource
  lessonId?: string
  courseId?: string
  timestamp: string
}

export type XPSource =
  | 'lesson'
  | 'quiz'
  | 'daily_login'
  | 'streak_bonus'
  | 'badge'
  | 'achievement'
  | 'challenge'

/**
 * Level progression data
 */
export interface LevelInfo {
  level: number
  currentXP: number
  xpToNextLevel: number
  totalXP: number
  progressPercent: number
}

/**
 * Streak tracking data
 */
export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null
  streakFreezes: number
  isAtRisk: boolean
}

/**
 * Learner profile from psychometric assessment
 */
export interface LearnerProfile {
  userId: string
  archetype: LearnerArchetype
  learningPreferences: LearningPreferences
  motivationScore: MotivationScore
  assessedAt: string
}

export type LearnerArchetype =
  | 'achiever'
  | 'explorer'
  | 'socializer'
  | 'competitor'
  | 'self-improver'

export interface LearningPreferences {
  preferredSessionLength: 'short' | 'medium' | 'long'
  bestTimeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
  contentTypePreference: ContentTypePreference[]
  pacePreference: 'slow' | 'moderate' | 'fast'
}

export type ContentTypePreference =
  | 'video'
  | 'text'
  | 'interactive'
  | 'audio'
  | 'quiz'

export interface MotivationScore {
  intrinsicMotivation: number
  extrinsicMotivation: number
  engagementPrediction: number
  persistenceScore: number
}

/**
 * User preferences for app behavior
 */
export interface UserPreferences {
  notifications: NotificationPreferences
  display: DisplayPreferences
  goals: GoalPreferences
}

export interface NotificationPreferences {
  dailyReminders: boolean
  streakAlerts: boolean
  achievementAlerts: boolean
  weeklyDigest: boolean
  reminderTime: string // HH:MM format
}

export interface DisplayPreferences {
  showXPAnimations: boolean
  showLeaderboard: boolean
  compactMode: boolean
}

export interface GoalPreferences {
  dailyXPGoal: number
  dailyLessonsGoal: number
  weeklyHoursGoal: number
}

/**
 * Event bus event map for cross-feature communication
 */
export interface EventMap {
  'xp:earned': { amount: number; source: XPSource; lessonId?: string; courseId?: string }
  'level:up': { newLevel: number; previousLevel: number; totalXP: number }
  'badge:unlocked': { badgeId: string; badgeName: string; rarity: BadgeRarity }
  'streak:updated': { currentStreak: number; isNewRecord: boolean; streakFreezes: number }
  'streak:broken': { previousStreak: number; longestStreak: number }
  'lesson:completed': { lessonId: string; courseId: string; score: number; timeSpent: number }
  'quiz:completed': { quizId: string; courseId: string; score: number; passed: boolean }
  'daily:login': { date: string; consecutiveDays: number }
  'goal:achieved': { goalType: 'daily_xp' | 'daily_lessons' | 'weekly_hours'; value: number }
  'profile:updated': { userId: string; changes: string[] }
}

/**
 * Gamification state snapshot for persistence
 */
export interface GamificationSnapshot {
  currentXP: number
  totalXP: number
  level: number
  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null
  streakFreezes: number
  unlockedBadges: string[]
  xpHistory: XPEarnedEvent[]
  updatedAt: string
}

/**
 * Default values for user preferences
 */
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  notifications: {
    dailyReminders: true,
    streakAlerts: true,
    achievementAlerts: true,
    weeklyDigest: true,
    reminderTime: '09:00',
  },
  display: {
    showXPAnimations: true,
    showLeaderboard: true,
    compactMode: false,
  },
  goals: {
    dailyXPGoal: 50,
    dailyLessonsGoal: 3,
    weeklyHoursGoal: 5,
  },
}

/**
 * Default values for streak data
 */
export const DEFAULT_STREAK_DATA: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: null,
  streakFreezes: 0,
  isAtRisk: false,
}
