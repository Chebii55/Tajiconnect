/**
 * Gamification Store
 *
 * Zustand store managing XP, levels, streaks, and badges.
 * Integrates with event bus for cross-feature communication.
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { eventBus } from '../lib/eventBus'
import { calculateLevel, wouldLevelUp, getLevelsGained } from '../utils/levelSystem'
import { calculateXP, applyStreakBonus, STREAK_CONFIG } from '../utils/xpCalculator'
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

  // Badges
  unlockedBadges: string[]
  recentBadge: Badge | null

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

  // Computed getters
  getLevelInfo: () => LevelInfo
  getStreakData: () => StreakData

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
  unlockedBadges: [],
  recentBadge: null,
  xpHistory: [],
  isLoading: false,
  isSyncing: false,
}

/**
 * Check if a date is today
 */
function isToday(dateString: string | null): boolean {
  if (!dateString) return false
  const date = new Date(dateString)
  const today = new Date()
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

/**
 * Check if a date is yesterday
 */
function isYesterday(dateString: string | null): boolean {
  if (!dateString) return false
  const date = new Date(dateString)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return (
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate()
  )
}

/**
 * Get today's date string in ISO format
 */
function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
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

          set({
            currentXP: levelInfo.currentXP,
            totalXP: newTotalXP,
            level: levelInfo.level,
            xpToNextLevel: levelInfo.xpToNextLevel,
            progressPercent: levelInfo.progressPercent,
            xpHistory: [xpEvent, ...state.xpHistory].slice(0, 100), // Keep last 100
            lastActivityDate: getTodayString(),
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
          const today = getTodayString()

          if (isToday(state.lastActivityDate)) {
            // Already active today, no change needed
            set({ isStreakAtRisk: false })
            return
          }

          if (isYesterday(state.lastActivityDate)) {
            // Continue streak
            set({ isStreakAtRisk: false })
            return
          }

          // Streak might be broken - check if we should use freeze
          if (state.lastActivityDate && !isToday(state.lastActivityDate) && !isYesterday(state.lastActivityDate)) {
            if (state.streakFreezes > 0 && state.currentStreak > 0) {
              // Auto-use streak freeze
              set({
                streakFreezes: state.streakFreezes - 1,
                isStreakAtRisk: true,
              })
              console.log('[Gamification] Streak freeze used automatically')
            } else if (state.currentStreak > 0) {
              // Streak is broken
              const previousStreak = state.currentStreak
              set({
                currentStreak: 0,
                isStreakAtRisk: false,
              })
              eventBus.emit('streak:broken', {
                previousStreak,
                longestStreak: state.longestStreak,
              })
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
          if (isToday(state.lastActivityDate)) return

          let newStreak = 1
          let isNewRecord = false

          if (isYesterday(state.lastActivityDate)) {
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
        }),
      }
    ),
    { name: 'GamificationStore' }
  )
)

/**
 * Initialize event listeners for cross-feature communication
 */
export function initializeGamificationListeners(): () => void {
  const unsubscribers: Array<() => void> = []

  // Listen for lesson completion
  unsubscribers.push(
    eventBus.on('lesson:completed', ({ lessonId, courseId, score }) => {
      const xp = calculateXP('lesson', { score, streakDays: useGamificationStore.getState().currentStreak })
      useGamificationStore.getState().addXP(xp, 'lesson', { lessonId, courseId })
    })
  )

  // Listen for quiz completion
  unsubscribers.push(
    eventBus.on('quiz:completed', ({ quizId, courseId, score, passed }) => {
      if (passed) {
        const xp = calculateXP('quiz', { score, streakDays: useGamificationStore.getState().currentStreak })
        useGamificationStore.getState().addXP(xp, 'quiz', { courseId })
      }
    })
  )

  // Return cleanup function
  return () => {
    unsubscribers.forEach((unsub) => unsub())
  }
}

export default useGamificationStore
