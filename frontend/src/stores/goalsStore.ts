/**
 * Goals Store
 *
 * Zustand store managing daily learning goals, progress tracking,
 * and goal streaks. Integrates with event bus for real-time updates.
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { eventBus } from '../lib/eventBus'

/**
 * Daily goal progress tracking
 */
export interface DailyGoalProgress {
  date: string // ISO date string (YYYY-MM-DD)
  goal: number
  completed: number
  lessonsCompleted: string[] // Lesson IDs
  goalMet: boolean
  exceededBy: number // Lessons beyond goal
}

/**
 * Goal streak information
 */
export interface GoalStreak {
  current: number
  longest: number
  lastGoalMetDate: string | null
  streakStartDate: string | null
}

/**
 * Goals state interface
 */
interface GoalsState {
  // Goal configuration
  dailyLessonsGoal: number
  timeCommitment: 'short' | 'medium' | 'flexible'

  // Today's progress
  todayProgress: DailyGoalProgress | null

  // Goal streak
  goalStreak: GoalStreak

  // History
  goalHistory: DailyGoalProgress[]

  // UI State
  showGoalCompletedModal: boolean
  lastCompletionCelebrated: string | null

  // Loading state
  isLoading: boolean
  isSyncing: boolean

  // Actions
  setDailyGoal: (goal: number) => void
  setTimeCommitment: (commitment: 'short' | 'medium' | 'flexible') => void
  recordLessonCompletion: (lessonId: string) => void
  checkDailyProgress: () => void
  dismissGoalCompletedModal: () => void

  // Computed getters
  getTodayProgress: () => DailyGoalProgress
  getProgressPercentage: () => number
  getRemainingLessons: () => number
  isGoalMet: () => boolean
  isGoalExceeded: () => boolean

  // Sync
  loadFromServer: () => Promise<void>
  persistToServer: () => Promise<void>
  reset: () => void
}

/**
 * Get today's date string in ISO format
 */
function getTodayString(): string {
  return new Date().toISOString().split('T')[0]
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
 * Create empty progress for a day
 */
function createEmptyProgress(date: string, goal: number): DailyGoalProgress {
  return {
    date,
    goal,
    completed: 0,
    lessonsCompleted: [],
    goalMet: false,
    exceededBy: 0,
  }
}

/**
 * Default streak data
 */
const defaultStreak: GoalStreak = {
  current: 0,
  longest: 0,
  lastGoalMetDate: null,
  streakStartDate: null,
}

/**
 * Initial state
 */
const initialState = {
  dailyLessonsGoal: 3,
  timeCommitment: 'flexible' as const,
  todayProgress: null,
  goalStreak: defaultStreak,
  goalHistory: [],
  showGoalCompletedModal: false,
  lastCompletionCelebrated: null,
  isLoading: false,
  isSyncing: false,
}

export const useGoalsStore = create<GoalsState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        /**
         * Set daily lessons goal
         */
        setDailyGoal: (goal: number) => {
          const clampedGoal = Math.max(1, Math.min(10, goal))
          set({ dailyLessonsGoal: clampedGoal })

          // Update today's progress goal if exists
          const state = get()
          if (state.todayProgress) {
            const updatedProgress = {
              ...state.todayProgress,
              goal: clampedGoal,
              goalMet: state.todayProgress.completed >= clampedGoal,
              exceededBy: Math.max(0, state.todayProgress.completed - clampedGoal),
            }
            set({ todayProgress: updatedProgress })
          }
        },

        /**
         * Set time commitment preference
         */
        setTimeCommitment: (commitment) => {
          set({ timeCommitment: commitment })
        },

        /**
         * Record a lesson completion
         */
        recordLessonCompletion: (lessonId: string) => {
          const state = get()
          const today = getTodayString()

          // Get or create today's progress
          let todayProgress = state.todayProgress
          if (!todayProgress || todayProgress.date !== today) {
            todayProgress = createEmptyProgress(today, state.dailyLessonsGoal)
          }

          // Check if lesson already counted today
          if (todayProgress.lessonsCompleted.includes(lessonId)) {
            return
          }

          // Update progress
          const newCompleted = todayProgress.completed + 1
          const wasGoalMet = todayProgress.goalMet
          const isNowGoalMet = newCompleted >= todayProgress.goal

          const updatedProgress: DailyGoalProgress = {
            ...todayProgress,
            completed: newCompleted,
            lessonsCompleted: [...todayProgress.lessonsCompleted, lessonId],
            goalMet: isNowGoalMet,
            exceededBy: Math.max(0, newCompleted - todayProgress.goal),
          }

          // Check if goal was just met (not previously met)
          let showModal = false
          let updatedStreak = state.goalStreak

          if (isNowGoalMet && !wasGoalMet) {
            showModal = state.lastCompletionCelebrated !== today

            // Update goal streak
            const lastGoalMet = state.goalStreak.lastGoalMetDate

            if (isYesterday(lastGoalMet)) {
              // Continue streak
              updatedStreak = {
                ...state.goalStreak,
                current: state.goalStreak.current + 1,
                longest: Math.max(state.goalStreak.longest, state.goalStreak.current + 1),
                lastGoalMetDate: today,
              }
            } else if (lastGoalMet === today) {
              // Already counted today, no change
            } else {
              // Start new streak
              updatedStreak = {
                current: 1,
                longest: Math.max(state.goalStreak.longest, 1),
                lastGoalMetDate: today,
                streakStartDate: today,
              }
            }

            // Emit goal achieved event
            eventBus.emit('goal:achieved', {
              goalType: 'daily_lessons',
              value: newCompleted,
            })
          }

          // Update history
          const historyIndex = state.goalHistory.findIndex((h) => h.date === today)
          let updatedHistory = [...state.goalHistory]

          if (historyIndex >= 0) {
            updatedHistory[historyIndex] = updatedProgress
          } else {
            updatedHistory = [updatedProgress, ...updatedHistory].slice(0, 30) // Keep last 30 days
          }

          set({
            todayProgress: updatedProgress,
            goalStreak: updatedStreak,
            goalHistory: updatedHistory,
            showGoalCompletedModal: showModal,
            lastCompletionCelebrated: showModal ? today : state.lastCompletionCelebrated,
          })
        },

        /**
         * Check and initialize daily progress
         */
        checkDailyProgress: () => {
          const state = get()
          const today = getTodayString()

          // Check if we need to reset for a new day
          if (!state.todayProgress || state.todayProgress.date !== today) {
            // Check if streak should be broken
            const lastGoalMet = state.goalStreak.lastGoalMetDate

            let updatedStreak = state.goalStreak

            // If yesterday's goal wasn't met and it wasn't yesterday, break streak
            if (lastGoalMet && !isYesterday(lastGoalMet) && lastGoalMet !== today) {
              updatedStreak = {
                ...state.goalStreak,
                current: 0,
                streakStartDate: null,
              }
            }

            set({
              todayProgress: createEmptyProgress(today, state.dailyLessonsGoal),
              goalStreak: updatedStreak,
            })
          }
        },

        /**
         * Dismiss goal completed modal
         */
        dismissGoalCompletedModal: () => {
          set({ showGoalCompletedModal: false })
        },

        /**
         * Get today's progress (with fallback)
         */
        getTodayProgress: () => {
          const state = get()
          const today = getTodayString()

          if (state.todayProgress && state.todayProgress.date === today) {
            return state.todayProgress
          }

          return createEmptyProgress(today, state.dailyLessonsGoal)
        },

        /**
         * Get progress as percentage
         */
        getProgressPercentage: () => {
          const state = get()
          const progress = state.getTodayProgress()
          if (progress.goal === 0) return 0
          return Math.min(100, Math.round((progress.completed / progress.goal) * 100))
        },

        /**
         * Get remaining lessons to meet goal
         */
        getRemainingLessons: () => {
          const state = get()
          const progress = state.getTodayProgress()
          return Math.max(0, progress.goal - progress.completed)
        },

        /**
         * Check if daily goal is met
         */
        isGoalMet: () => {
          const state = get()
          return state.getTodayProgress().goalMet
        },

        /**
         * Check if daily goal is exceeded
         */
        isGoalExceeded: () => {
          const state = get()
          return state.getTodayProgress().exceededBy > 0
        },

        /**
         * Load state from server
         */
        loadFromServer: async () => {
          set({ isLoading: true })
          try {
            // TODO: Implement API call to fetch goals state
            // const response = await goalsService.getState()
            // set({ ...response, isLoading: false })

            // For now, just check daily progress
            get().checkDailyProgress()
            set({ isLoading: false })
          } catch (error) {
            console.error('[Goals] Failed to load from server:', error)
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
            const payload = {
              dailyLessonsGoal: state.dailyLessonsGoal,
              timeCommitment: state.timeCommitment,
              goalStreak: state.goalStreak,
              todayProgress: state.todayProgress,
              updatedAt: new Date().toISOString(),
            }

            // TODO: Implement API call to persist goals state
            // await goalsService.saveState(payload)

            console.log('[Goals] State persisted:', payload)
            set({ isSyncing: false })
          } catch (error) {
            console.error('[Goals] Failed to persist to server:', error)
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
        name: 'tajiconnect-goals',
        partialize: (state) => ({
          dailyLessonsGoal: state.dailyLessonsGoal,
          timeCommitment: state.timeCommitment,
          goalStreak: state.goalStreak,
          goalHistory: state.goalHistory,
          todayProgress: state.todayProgress,
          lastCompletionCelebrated: state.lastCompletionCelebrated,
        }),
      }
    ),
    { name: 'GoalsStore' }
  )
)

/**
 * Initialize goals store event listeners
 */
export function initializeGoalsListeners(): () => void {
  const unsubscribers: Array<() => void> = []

  // Listen for lesson completion events
  unsubscribers.push(
    eventBus.on('lesson:completed', ({ lessonId }) => {
      useGoalsStore.getState().recordLessonCompletion(lessonId)
    })
  )

  // Check daily progress on daily login
  unsubscribers.push(
    eventBus.on('daily:login', () => {
      useGoalsStore.getState().checkDailyProgress()
    })
  )

  // Return cleanup function
  return () => {
    unsubscribers.forEach((unsub) => unsub())
  }
}

export default useGoalsStore
