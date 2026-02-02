/**
 * Gamification Store
 *
 * Zustand store managing XP, levels, streaks, and badges.
 * Integrates with event bus for cross-feature communication.
 * Includes badge engine for unlock detection and progress tracking.
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { eventBus } from '../lib/eventBus'
import { calculateLevel, wouldLevelUp, getLevelsGained } from '../utils/levelSystem'
import { calculateXP, applyStreakBonus, STREAK_CONFIG } from '../utils/xpCalculator'
import {
  StreakEngine,
  createStreakEngine,
  isMilestoneDay,
  getMilestoneInfo,
  getStreakMultiplier,
  isToday as isTodayCheck,
  isYesterday as isYesterdayCheck,
  getTodayDateString,
  type MilestoneDay,
  type StreakUpdate,
} from '../lib/streakEngine'
import {
  BadgeEngine,
  initializeBadgeEngine,
  getBadgeEngine,
  type UserMetrics,
  type BadgeUnlockResult,
} from '../lib/badgeEngine'
import { getBadgeById, type BadgeDefinition } from '../data/badges'
import type {
  Badge,
  BadgeRarity,
  XPSource,
  XPEarnedEvent,
  LevelInfo,
  StreakData,
  GamificationSnapshot,
  DEFAULT_STREAK_DATA,
} from '../types/gamification'
import type { League } from '../types/leaderboard'

interface GamificationState {
  // XP & Levels
  currentXP: number
  totalXP: number
  level: number
  xpToNextLevel: number
  progressPercent: number

  // Streaks
  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null
  streakFreezes: number
  isStreakAtRisk: boolean
  freezeUsedToday: boolean
  freezeActiveDate: string | null

  // Streak Milestones
  pendingMilestone: MilestoneDay | null
  showMilestoneModal: boolean

  // Leaderboard
  weeklyXP: number
  league: League
  isLeaderboardOptedIn: boolean
  leaderboardRank: number | null

  // Badges
  unlockedBadges: string[]
  recentBadge: Badge | null
  pendingBadgeUnlock: BadgeDefinition | null
  showBadgeUnlockModal: boolean

  // Badge Metrics (for badge engine)
  badgeMetrics: Partial<UserMetrics>

  // History
  xpHistory: XPEarnedEvent[]

  // Loading state
  isLoading: boolean
  isSyncing: boolean

  // Actions
  addXP: (amount: number, source: XPSource, metadata?: { lessonId?: string; courseId?: string }) => void
  checkStreak: () => void
  useStreakFreeze: () => boolean
  unlockBadge: (badge: Badge) => void
  recordDailyLogin: () => void
  recordActivity: () => StreakUpdate | null
  awardFreezes: (count: number, reason: string) => number
  closeMilestoneModal: () => void

  // Badge Actions
  updateBadgeMetrics: (updates: Partial<UserMetrics>) => void
  checkBadgeUnlocks: (eventType?: 'lesson' | 'quiz' | 'course' | 'streak' | 'level' | 'login') => BadgeUnlockResult[]
  closeBadgeUnlockModal: () => void
  getBadgeEngine: () => BadgeEngine

  // Leaderboard Actions
  addWeeklyXP: (amount: number) => void
  setLeague: (league: League) => void
  setLeaderboardOptIn: (optedIn: boolean) => void
  resetWeeklyXP: () => void

  // Computed getters
  getLevelInfo: () => LevelInfo
  getStreakData: () => StreakData
  getStreakMultiplier: () => number

  // Sync
  loadFromServer: () => Promise<void>
  persistToServer: () => Promise<void>
  reset: () => void
}

const initialState = {
  currentXP: 0,
  totalXP: 0,
  level: 1,
  xpToNextLevel: 100,
  progressPercent: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: null,
  streakFreezes: 0,
  isStreakAtRisk: false,
  freezeUsedToday: false,
  freezeActiveDate: null,
  pendingMilestone: null,
  showMilestoneModal: false,
  weeklyXP: 0,
  league: 'bronze' as League,
  isLeaderboardOptedIn: true,
  leaderboardRank: null,
  unlockedBadges: [],
  recentBadge: null,
  pendingBadgeUnlock: null,
  showBadgeUnlockModal: false,
  badgeMetrics: {
    lessons_completed: 0,
    courses_completed: 0,
    skill_tracks_started: 0,
    perfect_quizzes: 0,
    flawless_courses: 0,
    fastest_lesson_time: Infinity,
    night_lessons: 0,
    early_logins: 0,
  },
  xpHistory: [],
  isLoading: false,
  isSyncing: false,
}

/**
 * Get today's date string in ISO format (local alias)
 */
function getTodayString(): string {
  return getTodayDateString()
}

export const useGamificationStore = create<GamificationState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        /**
         * Add XP and handle level ups
         */
        addXP: (amount, source, metadata = {}) => {
          const state = get()
          const streakBonus = source !== 'streak_bonus' ? state.currentStreak : 0
          const finalAmount = applyStreakBonus(amount, streakBonus)

          const previousLevel = state.level
          const newTotalXP = state.totalXP + finalAmount
          const levelInfo = calculateLevel(newTotalXP)

          const xpEvent: XPEarnedEvent = {
            amount: finalAmount,
            source,
            lessonId: metadata.lessonId,
            courseId: metadata.courseId,
            timestamp: new Date().toISOString(),
          }

          // Update weekly XP for leaderboard if opted in
          const newWeeklyXP = state.isLeaderboardOptedIn ? state.weeklyXP + finalAmount : state.weeklyXP

          set({
            currentXP: levelInfo.currentXP,
            totalXP: newTotalXP,
            level: levelInfo.level,
            xpToNextLevel: levelInfo.xpToNextLevel,
            progressPercent: levelInfo.progressPercent,
            xpHistory: [xpEvent, ...state.xpHistory].slice(0, 100), // Keep last 100
            lastActivityDate: getTodayString(),
            weeklyXP: newWeeklyXP,
          })

          // Emit XP earned event
          eventBus.emit('xp:earned', {
            amount: finalAmount,
            source,
            lessonId: metadata.lessonId,
            courseId: metadata.courseId,
          })

          // Check for level up
          if (levelInfo.level > previousLevel) {
            eventBus.emit('level:up', {
              newLevel: levelInfo.level,
              previousLevel,
              totalXP: newTotalXP,
            })
          }
        },

        /**
         * Check and update streak status
         */
        checkStreak: () => {
          const state = get()
          const today = getTodayDateString()

          // Reset freeze used today flag if it's a new day
          if (!isTodayCheck(state.freezeActiveDate)) {
            set({ freezeUsedToday: false })
          }

          if (isTodayCheck(state.lastActivityDate)) {
            // Already active today, no change needed
            set({ isStreakAtRisk: false })
            return
          }

          if (isYesterdayCheck(state.lastActivityDate)) {
            // Check if after warning hour (8pm)
            const currentHour = new Date().getHours()
            const isAtRisk = currentHour >= 20 && state.currentStreak > 0
            set({ isStreakAtRisk: isAtRisk })
            return
          }

          // Check if freeze was used yesterday (streak protected)
          if (isYesterdayCheck(state.freezeActiveDate)) {
            const currentHour = new Date().getHours()
            const isAtRisk = currentHour >= 20 && state.currentStreak > 0
            set({ isStreakAtRisk: isAtRisk })
            return
          }

          // Streak might be broken
          if (state.lastActivityDate && !isTodayCheck(state.lastActivityDate) && !isYesterdayCheck(state.lastActivityDate)) {
            if (state.currentStreak > 0) {
              // Streak is broken
              const previousStreak = state.currentStreak
              set({
                currentStreak: 0,
                isStreakAtRisk: false,
                freezeActiveDate: null,
              })
              eventBus.emit('streak:broken', {
                previousStreak,
                longestStreak: state.longestStreak,
              })
              console.log('[Gamification] Streak broken:', previousStreak)
            }
          }
        },

        /**
         * Manually use a streak freeze
         */
        useStreakFreeze: () => {
          const state = get()
          if (state.streakFreezes <= 0) return false

          set({
            streakFreezes: state.streakFreezes - 1,
          })
          return true
        },

        /**
         * Unlock a new badge
         */
        unlockBadge: (badge) => {
          const state = get()

          // Check if already unlocked
          if (state.unlockedBadges.includes(badge.id)) return

          set({
            unlockedBadges: [...state.unlockedBadges, badge.id],
            recentBadge: { ...badge, unlockedAt: new Date().toISOString() },
          })

          // Award badge XP
          const badgeXP = calculateXP('badge', { rarity: badge.rarity })
          get().addXP(badgeXP, 'badge')

          // Emit badge unlocked event
          eventBus.emit('badge:unlocked', {
            badgeId: badge.id,
            badgeName: badge.name,
            rarity: badge.rarity,
          })
        },

        /**
         * Record daily login and update streak
         */
        recordDailyLogin: () => {
          const state = get()
          const today = getTodayString()

          // Already logged in today
          if (isTodayCheck(state.lastActivityDate)) return

          let newStreak = 1
          let isNewRecord = false

          if (isYesterdayCheck(state.lastActivityDate)) {
            // Continue streak
            newStreak = state.currentStreak + 1
          }

          // Check for new record
          if (newStreak > state.longestStreak) {
            isNewRecord = true
          }

          const longestStreak = Math.max(state.longestStreak, newStreak)

          set({
            currentStreak: newStreak,
            longestStreak,
            lastActivityDate: today,
            isStreakAtRisk: false,
          })

          // Calculate login XP
          const loginXP = calculateXP('daily_login', { consecutiveDays: newStreak })
          get().addXP(loginXP, 'daily_login')

          // Emit events
          eventBus.emit('daily:login', {
            date: today,
            consecutiveDays: newStreak,
          })

          eventBus.emit('streak:updated', {
            currentStreak: newStreak,
            isNewRecord,
            streakFreezes: state.streakFreezes,
          })
        },

        /**
         * Record activity and update streak
         */
        recordActivity: (): StreakUpdate | null => {
          const state = get()
          const today = getTodayString()

          // Already active today
          if (isTodayCheck(state.lastActivityDate)) {
            return null
          }

          let newStreak = 1
          let freezesAwarded = 0
          let badgeAwarded: string | null = null

          if (isYesterdayCheck(state.lastActivityDate)) {
            // Continue streak
            newStreak = state.currentStreak + 1
          } else if (state.freezeActiveDate && isYesterdayCheck(state.freezeActiveDate)) {
            // Freeze protected yesterday
            newStreak = state.currentStreak + 1
          }

          const isNewRecord = newStreak > state.longestStreak
          const longestStreak = Math.max(state.longestStreak, newStreak)

          // Check for milestone
          let milestone: MilestoneDay | null = null
          if (isMilestoneDay(newStreak)) {
            milestone = newStreak
            const milestoneInfo = getMilestoneInfo(newStreak)
            if (milestoneInfo) {
              freezesAwarded = milestoneInfo.freezeReward
              badgeAwarded = milestoneInfo.badgeId
            }
          }

          set({
            currentStreak: newStreak,
            longestStreak,
            lastActivityDate: today,
            isStreakAtRisk: false,
            pendingMilestone: milestone,
            showMilestoneModal: milestone !== null,
            streakFreezes: Math.min(state.streakFreezes + freezesAwarded, 5),
          })

          const update: StreakUpdate = {
            previousStreak: state.currentStreak,
            newStreak,
            isNewRecord,
            milestone,
            xpMultiplier: getStreakMultiplier(newStreak),
            freezesAwarded,
            badgeAwarded,
          }

          return update
        },

        /**
         * Award streak freezes to user
         */
        awardFreezes: (count, reason) => {
          const state = get()
          const newTotal = Math.min(
            state.streakFreezes + count,
            STREAK_CONFIG.MAX_FREEZES
          )
          const awarded = newTotal - state.streakFreezes

          if (awarded > 0) {
            set({ streakFreezes: newTotal })
            console.log(`[Gamification] Awarded ${awarded} freeze(s): ${reason}`)
          }

          return awarded
        },

        /**
         * Close milestone celebration modal
         */
        closeMilestoneModal: () => {
          set({
            showMilestoneModal: false,
            pendingMilestone: null,
          })
        },

        /**
         * Add XP to weekly leaderboard total
         */
        addWeeklyXP: (amount) => {
          const state = get()
          if (!state.isLeaderboardOptedIn) return

          set({ weeklyXP: state.weeklyXP + amount })
        },

        /**
         * Set user's league tier
         */
        setLeague: (league) => {
          set({ league })
        },

        /**
         * Set leaderboard opt-in status
         */
        setLeaderboardOptIn: (optedIn) => {
          set({ isLeaderboardOptedIn: optedIn })
          if (!optedIn) {
            // Reset weekly XP when opting out
            set({ weeklyXP: 0, leaderboardRank: null })
          }
        },

        /**
         * Reset weekly XP (called on weekly reset)
         */
        resetWeeklyXP: () => {
          set({ weeklyXP: 0 })
        },

        /**
         * Update badge metrics for tracking progress
         */
        updateBadgeMetrics: (updates) => {
          const state = get()
          const newMetrics = { ...state.badgeMetrics, ...updates }
          set({ badgeMetrics: newMetrics })

          // Also update the badge engine
          const engine = getBadgeEngine()
          engine.updateMetrics(newMetrics)
        },

        /**
         * Check for badge unlocks based on current state
         */
        checkBadgeUnlocks: (eventType) => {
          const state = get()

          // Initialize badge engine with current state
          const engine = initializeBadgeEngine(state.unlockedBadges, {
            ...state.badgeMetrics,
            current_streak: state.currentStreak,
            longest_streak: state.longestStreak,
            current_level: state.level,
            total_xp: state.totalXP,
          })

          // Check for unlocks
          const unlocks = eventType
            ? engine.checkUnlocksForEvent(eventType)
            : engine.checkAllUnlocks()

          // Process unlocks
          if (unlocks.length > 0) {
            // Add newly unlocked badges
            const newUnlockedIds = unlocks.map((u) => u.badge.id)
            const allUnlocked = [...new Set([...state.unlockedBadges, ...newUnlockedIds])]

            // Show modal for first unlock
            const firstUnlock = unlocks[0]

            set({
              unlockedBadges: allUnlocked,
              pendingBadgeUnlock: firstUnlock.badge,
              showBadgeUnlockModal: true,
              recentBadge: {
                id: firstUnlock.badge.id,
                name: firstUnlock.badge.name,
                description: firstUnlock.badge.description,
                icon: firstUnlock.badge.icon,
                category: firstUnlock.badge.category as Badge['category'],
                rarity: firstUnlock.badge.rarity,
                xpReward: firstUnlock.badge.xpReward,
                unlockedAt: firstUnlock.unlockedAt,
              },
            })

            // Award XP for each unlock (except through badge source to avoid double counting)
            unlocks.forEach((unlock) => {
              // Emit badge unlocked event
              eventBus.emit('badge:unlocked', {
                badgeId: unlock.badge.id,
                badgeName: unlock.badge.name,
                rarity: unlock.badge.rarity,
              })
            })
          }

          return unlocks
        },

        /**
         * Close badge unlock modal
         */
        closeBadgeUnlockModal: () => {
          set({
            showBadgeUnlockModal: false,
            pendingBadgeUnlock: null,
          })
        },

        /**
         * Get the badge engine instance
         */
        getBadgeEngine: () => {
          const state = get()
          return initializeBadgeEngine(state.unlockedBadges, {
            ...state.badgeMetrics,
            current_streak: state.currentStreak,
            longest_streak: state.longestStreak,
            current_level: state.level,
            total_xp: state.totalXP,
          })
        },

        /**
         * Get computed level info
         */
        getLevelInfo: () => {
          const state = get()
          return calculateLevel(state.totalXP)
        },

        /**
         * Get computed streak data
         */
        getStreakData: () => {
          const state = get()
          return {
            currentStreak: state.currentStreak,
            longestStreak: state.longestStreak,
            lastActivityDate: state.lastActivityDate,
            streakFreezes: state.streakFreezes,
            isAtRisk: state.isStreakAtRisk,
          }
        },

        /**
         * Get current streak multiplier
         */
        getStreakMultiplier: () => {
          const state = get()
          return getStreakMultiplier(state.currentStreak)
        },

        /**
         * Load state from server
         */
        loadFromServer: async () => {
          set({ isLoading: true })
          try {
            // TODO: Implement API call to fetch gamification state
            // const response = await gamificationService.getState()
            // set({ ...response, isLoading: false })

            // For now, just check streak
            get().checkStreak()
            set({ isLoading: false })
          } catch (error) {
            console.error('[Gamification] Failed to load from server:', error)
            set({ isLoading: false })
          }
        },

        /**
         * Persist state to server
         */
        persistToServer: async () => {
          const state = get()
          set({ isSyncing: true })
          try {
            const snapshot: GamificationSnapshot = {
              currentXP: state.currentXP,
              totalXP: state.totalXP,
              level: state.level,
              currentStreak: state.currentStreak,
              longestStreak: state.longestStreak,
              lastActivityDate: state.lastActivityDate,
              streakFreezes: state.streakFreezes,
              unlockedBadges: state.unlockedBadges,
              xpHistory: state.xpHistory,
              updatedAt: new Date().toISOString(),
            }

            // TODO: Implement API call to persist gamification state
            // await gamificationService.saveState(snapshot)

            console.log('[Gamification] State persisted:', snapshot)
            set({ isSyncing: false })
          } catch (error) {
            console.error('[Gamification] Failed to persist to server:', error)
            set({ isSyncing: false })
          }
        },

        /**
         * Reset store to initial state
         */
        reset: () => {
          set(initialState)
        },
      }),
      {
        name: 'tajiconnect-gamification',
        partialize: (state) => ({
          totalXP: state.totalXP,
          currentStreak: state.currentStreak,
          longestStreak: state.longestStreak,
          lastActivityDate: state.lastActivityDate,
          streakFreezes: state.streakFreezes,
          unlockedBadges: state.unlockedBadges,
          xpHistory: state.xpHistory,
          // Badge metrics
          badgeMetrics: state.badgeMetrics,
          // Leaderboard state
          weeklyXP: state.weeklyXP,
          league: state.league,
          isLeaderboardOptedIn: state.isLeaderboardOptedIn,
        }),
      }
    ),
    { name: 'GamificationStore' }
  )
)

/**
 * Initialize event listeners for cross-feature communication
 * Includes badge unlock checks on relevant events
 */
export function initializeGamificationListeners(): () => void {
  const unsubscribers: Array<() => void> = []

  // Listen for lesson completion
  unsubscribers.push(
    eventBus.on('lesson:completed', ({ lessonId, courseId, score, timeSpent }) => {
      const state = useGamificationStore.getState()
      const xp = calculateXP('lesson', { score, streakDays: state.currentStreak })
      state.addXP(xp, 'lesson', { lessonId, courseId })

      // Update badge metrics for lesson completion
      const currentMetrics = state.badgeMetrics
      const newLessonsCompleted = (currentMetrics.lessons_completed || 0) + 1

      // Check for night owl badge (lessons after 10pm)
      const currentHour = new Date().getHours()
      const isNightLesson = currentHour >= 22 || currentHour < 5
      const newNightLessons = isNightLesson
        ? (currentMetrics.night_lessons || 0) + 1
        : (currentMetrics.night_lessons || 0)

      // Track fastest lesson time
      const fastestTime = timeSpent && timeSpent < (currentMetrics.fastest_lesson_time || Infinity)
        ? timeSpent
        : (currentMetrics.fastest_lesson_time || Infinity)

      state.updateBadgeMetrics({
        lessons_completed: newLessonsCompleted,
        night_lessons: newNightLessons,
        fastest_lesson_time: fastestTime,
      })

      // Check for badge unlocks
      state.checkBadgeUnlocks('lesson')
    })
  )

  // Listen for quiz completion
  unsubscribers.push(
    eventBus.on('quiz:completed', ({ quizId, courseId, score, passed }) => {
      const state = useGamificationStore.getState()

      if (passed) {
        const xp = calculateXP('quiz', { score, streakDays: state.currentStreak })
        state.addXP(xp, 'quiz', { courseId })
      }

      // Update badge metrics for perfect quizzes
      if (score === 100) {
        const currentMetrics = state.badgeMetrics
        state.updateBadgeMetrics({
          perfect_quizzes: (currentMetrics.perfect_quizzes || 0) + 1,
        })

        // Check for badge unlocks
        state.checkBadgeUnlocks('quiz')
      }
    })
  )

  // Listen for course completion
  unsubscribers.push(
    eventBus.on('course:completed', ({ courseId, allPerfect }) => {
      const state = useGamificationStore.getState()
      const currentMetrics = state.badgeMetrics

      const updates: Partial<UserMetrics> = {
        courses_completed: (currentMetrics.courses_completed || 0) + 1,
      }

      // Track flawless courses (all quizzes perfect)
      if (allPerfect) {
        updates.flawless_courses = (currentMetrics.flawless_courses || 0) + 1
      }

      state.updateBadgeMetrics(updates)
      state.checkBadgeUnlocks('course')
    })
  )

  // Listen for streak updates
  unsubscribers.push(
    eventBus.on('streak:updated', ({ currentStreak }) => {
      const state = useGamificationStore.getState()

      // Badge engine will use currentStreak from gamification state
      // No need to update metrics separately

      // Check for streak badges
      state.checkBadgeUnlocks('streak')
    })
  )

  // Listen for level ups
  unsubscribers.push(
    eventBus.on('level:up', ({ newLevel }) => {
      const state = useGamificationStore.getState()

      // Check for level-based badges
      state.checkBadgeUnlocks('level')
    })
  )

  // Listen for daily login
  unsubscribers.push(
    eventBus.on('daily:login', ({ date }) => {
      const state = useGamificationStore.getState()

      // Check for early bird badge (login before 6am)
      const currentHour = new Date().getHours()
      if (currentHour >= 4 && currentHour < 6) {
        const currentMetrics = state.badgeMetrics
        state.updateBadgeMetrics({
          early_logins: (currentMetrics.early_logins || 0) + 1,
        })
      }

      // Check for login-related badges
      state.checkBadgeUnlocks('login')
    })
  )

  // Return cleanup function
  return () => {
    unsubscribers.forEach((unsub) => unsub())
  }
}

export default useGamificationStore
