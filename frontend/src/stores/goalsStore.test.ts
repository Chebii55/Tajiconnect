/**
 * Goals Store Unit Tests
 *
 * Comprehensive tests for the goals store including daily goals,
 * lesson tracking, goal streaks, and day rollover logic.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useGoalsStore } from './goalsStore'
import { eventBus } from '../lib/eventBus'

// Mock the eventBus
vi.mock('../lib/eventBus', () => ({
  eventBus: {
    emit: vi.fn(),
    on: vi.fn(() => vi.fn()),
    off: vi.fn(),
    removeAllListeners: vi.fn(),
  },
}))

// Mock Date for consistent testing
const MOCK_TODAY = '2026-02-02'
const MOCK_YESTERDAY = '2026-02-01'
const MOCK_OLD_DATE = '2026-01-30'

describe('goalsStore', () => {
  const initialState = {
    dailyLessonsGoal: 3,
    timeCommitment: 'flexible' as const,
    todayProgress: null,
    goalStreak: {
      current: 0,
      longest: 0,
      lastGoalMetDate: null,
      streakStartDate: null,
    },
    goalHistory: [],
    showGoalCompletedModal: false,
    lastCompletionCelebrated: null,
    isLoading: false,
    isSyncing: false,
  }

  beforeEach(() => {
    // Mock Date to return consistent date
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-02-02T12:00:00Z'))

    // Reset store to initial state
    useGoalsStore.setState(initialState)
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should have default daily lessons goal of 3', () => {
      const state = useGoalsStore.getState()
      expect(state.dailyLessonsGoal).toBe(3)
    })

    it('should have flexible time commitment by default', () => {
      const state = useGoalsStore.getState()
      expect(state.timeCommitment).toBe('flexible')
    })

    it('should have null today progress initially', () => {
      const state = useGoalsStore.getState()
      expect(state.todayProgress).toBeNull()
    })

    it('should have zero goal streak initially', () => {
      const state = useGoalsStore.getState()
      expect(state.goalStreak.current).toBe(0)
      expect(state.goalStreak.longest).toBe(0)
      expect(state.goalStreak.lastGoalMetDate).toBeNull()
    })

    it('should have empty goal history', () => {
      const state = useGoalsStore.getState()
      expect(state.goalHistory).toEqual([])
    })

    it('should not show goal completed modal', () => {
      const state = useGoalsStore.getState()
      expect(state.showGoalCompletedModal).toBe(false)
    })

    it('should not be loading or syncing', () => {
      const state = useGoalsStore.getState()
      expect(state.isLoading).toBe(false)
      expect(state.isSyncing).toBe(false)
    })
  })

  describe('setDailyGoal', () => {
    it('should set daily goal', () => {
      const { setDailyGoal } = useGoalsStore.getState()
      setDailyGoal(5)

      const state = useGoalsStore.getState()
      expect(state.dailyLessonsGoal).toBe(5)
    })

    it('should clamp goal to minimum of 1', () => {
      const { setDailyGoal } = useGoalsStore.getState()
      setDailyGoal(0)

      const state = useGoalsStore.getState()
      expect(state.dailyLessonsGoal).toBe(1)
    })

    it('should clamp goal to maximum of 10', () => {
      const { setDailyGoal } = useGoalsStore.getState()
      setDailyGoal(15)

      const state = useGoalsStore.getState()
      expect(state.dailyLessonsGoal).toBe(10)
    })

    it('should update todayProgress goal when it exists', () => {
      useGoalsStore.setState({
        ...initialState,
        todayProgress: {
          date: MOCK_TODAY,
          goal: 3,
          completed: 2,
          lessonsCompleted: ['lesson-1', 'lesson-2'],
          goalMet: false,
          exceededBy: 0,
        },
      })

      const { setDailyGoal } = useGoalsStore.getState()
      setDailyGoal(2) // Lower goal should mark as met

      const state = useGoalsStore.getState()
      expect(state.todayProgress?.goal).toBe(2)
      expect(state.todayProgress?.goalMet).toBe(true)
      expect(state.todayProgress?.exceededBy).toBe(0)
    })

    it('should recalculate goalMet when goal changes', () => {
      useGoalsStore.setState({
        ...initialState,
        todayProgress: {
          date: MOCK_TODAY,
          goal: 3,
          completed: 3,
          lessonsCompleted: ['lesson-1', 'lesson-2', 'lesson-3'],
          goalMet: true,
          exceededBy: 0,
        },
      })

      const { setDailyGoal } = useGoalsStore.getState()
      setDailyGoal(5) // Higher goal should mark as not met

      const state = useGoalsStore.getState()
      expect(state.todayProgress?.goalMet).toBe(false)
    })
  })

  describe('setTimeCommitment', () => {
    it('should set time commitment to short', () => {
      const { setTimeCommitment } = useGoalsStore.getState()
      setTimeCommitment('short')

      const state = useGoalsStore.getState()
      expect(state.timeCommitment).toBe('short')
    })

    it('should set time commitment to medium', () => {
      const { setTimeCommitment } = useGoalsStore.getState()
      setTimeCommitment('medium')

      const state = useGoalsStore.getState()
      expect(state.timeCommitment).toBe('medium')
    })

    it('should set time commitment to flexible', () => {
      const { setTimeCommitment } = useGoalsStore.getState()
      setTimeCommitment('flexible')

      const state = useGoalsStore.getState()
      expect(state.timeCommitment).toBe('flexible')
    })
  })

  describe('recordLessonCompletion', () => {
    it('should create today progress if not exists', () => {
      const { recordLessonCompletion } = useGoalsStore.getState()
      recordLessonCompletion('lesson-1')

      const state = useGoalsStore.getState()
      expect(state.todayProgress).not.toBeNull()
      expect(state.todayProgress?.date).toBe(MOCK_TODAY)
      expect(state.todayProgress?.completed).toBe(1)
    })

    it('should increment completed count', () => {
      useGoalsStore.setState({
        ...initialState,
        todayProgress: {
          date: MOCK_TODAY,
          goal: 3,
          completed: 1,
          lessonsCompleted: ['lesson-1'],
          goalMet: false,
          exceededBy: 0,
        },
      })

      const { recordLessonCompletion } = useGoalsStore.getState()
      recordLessonCompletion('lesson-2')

      const state = useGoalsStore.getState()
      expect(state.todayProgress?.completed).toBe(2)
    })

    it('should track lesson IDs', () => {
      const { recordLessonCompletion } = useGoalsStore.getState()

      recordLessonCompletion('lesson-1')
      recordLessonCompletion('lesson-2')

      const state = useGoalsStore.getState()
      expect(state.todayProgress?.lessonsCompleted).toContain('lesson-1')
      expect(state.todayProgress?.lessonsCompleted).toContain('lesson-2')
    })

    it('should not count same lesson twice', () => {
      const { recordLessonCompletion } = useGoalsStore.getState()

      recordLessonCompletion('lesson-1')
      recordLessonCompletion('lesson-1') // Same lesson again

      const state = useGoalsStore.getState()
      expect(state.todayProgress?.completed).toBe(1)
      expect(state.todayProgress?.lessonsCompleted).toHaveLength(1)
    })

    it('should mark goal as met when threshold reached', () => {
      const { recordLessonCompletion, setDailyGoal } = useGoalsStore.getState()
      setDailyGoal(2)

      recordLessonCompletion('lesson-1')
      recordLessonCompletion('lesson-2')

      const state = useGoalsStore.getState()
      expect(state.todayProgress?.goalMet).toBe(true)
    })

    it('should calculate exceededBy correctly', () => {
      useGoalsStore.setState({
        ...initialState,
        dailyLessonsGoal: 2,
        todayProgress: {
          date: MOCK_TODAY,
          goal: 2,
          completed: 2,
          lessonsCompleted: ['lesson-1', 'lesson-2'],
          goalMet: true,
          exceededBy: 0,
        },
      })

      const { recordLessonCompletion } = useGoalsStore.getState()
      recordLessonCompletion('lesson-3')

      const state = useGoalsStore.getState()
      expect(state.todayProgress?.exceededBy).toBe(1)
    })

    it('should emit goal:achieved event when goal is met', () => {
      useGoalsStore.setState({
        ...initialState,
        dailyLessonsGoal: 2,
        todayProgress: {
          date: MOCK_TODAY,
          goal: 2,
          completed: 1,
          lessonsCompleted: ['lesson-1'],
          goalMet: false,
          exceededBy: 0,
        },
      })

      const { recordLessonCompletion } = useGoalsStore.getState()
      recordLessonCompletion('lesson-2')

      expect(eventBus.emit).toHaveBeenCalledWith('goal:achieved', expect.objectContaining({
        goalType: 'daily_lessons',
        value: 2,
      }))
    })

    it('should update goal history', () => {
      const { recordLessonCompletion } = useGoalsStore.getState()
      recordLessonCompletion('lesson-1')

      const state = useGoalsStore.getState()
      expect(state.goalHistory.length).toBeGreaterThan(0)
    })

    it('should limit goal history to 30 days', () => {
      // Fill up history with 30 entries
      const historyEntries = Array.from({ length: 30 }, (_, i) => ({
        date: `2026-01-${String(i + 1).padStart(2, '0')}`,
        goal: 3,
        completed: 3,
        lessonsCompleted: [],
        goalMet: true,
        exceededBy: 0,
      }))

      useGoalsStore.setState({
        ...initialState,
        goalHistory: historyEntries,
      })

      const { recordLessonCompletion } = useGoalsStore.getState()
      recordLessonCompletion('lesson-1')

      const state = useGoalsStore.getState()
      expect(state.goalHistory.length).toBeLessThanOrEqual(30)
    })

    it('should start new streak when goal met and no previous streak', () => {
      useGoalsStore.setState({
        ...initialState,
        dailyLessonsGoal: 1,
      })

      const { recordLessonCompletion } = useGoalsStore.getState()
      recordLessonCompletion('lesson-1')

      const state = useGoalsStore.getState()
      expect(state.goalStreak.current).toBe(1)
      expect(state.goalStreak.streakStartDate).toBe(MOCK_TODAY)
    })

    it('should continue streak when goal met on consecutive day', () => {
      useGoalsStore.setState({
        ...initialState,
        dailyLessonsGoal: 1,
        goalStreak: {
          current: 3,
          longest: 5,
          lastGoalMetDate: MOCK_YESTERDAY,
          streakStartDate: '2026-01-30',
        },
      })

      const { recordLessonCompletion } = useGoalsStore.getState()
      recordLessonCompletion('lesson-1')

      const state = useGoalsStore.getState()
      expect(state.goalStreak.current).toBe(4)
    })

    it('should update longest streak when new record', () => {
      useGoalsStore.setState({
        ...initialState,
        dailyLessonsGoal: 1,
        goalStreak: {
          current: 5,
          longest: 5,
          lastGoalMetDate: MOCK_YESTERDAY,
          streakStartDate: '2026-01-28',
        },
      })

      const { recordLessonCompletion } = useGoalsStore.getState()
      recordLessonCompletion('lesson-1')

      const state = useGoalsStore.getState()
      expect(state.goalStreak.current).toBe(6)
      expect(state.goalStreak.longest).toBe(6)
    })

    it('should show goal completed modal when goal met for first time today', () => {
      useGoalsStore.setState({
        ...initialState,
        dailyLessonsGoal: 1,
        lastCompletionCelebrated: MOCK_YESTERDAY, // Celebrated yesterday
      })

      const { recordLessonCompletion } = useGoalsStore.getState()
      recordLessonCompletion('lesson-1')

      const state = useGoalsStore.getState()
      expect(state.showGoalCompletedModal).toBe(true)
    })

    it('should not show modal again if already celebrated today', () => {
      useGoalsStore.setState({
        ...initialState,
        dailyLessonsGoal: 2,
        lastCompletionCelebrated: MOCK_TODAY,
        todayProgress: {
          date: MOCK_TODAY,
          goal: 2,
          completed: 1,
          lessonsCompleted: ['lesson-1'],
          goalMet: false,
          exceededBy: 0,
        },
      })

      const { recordLessonCompletion } = useGoalsStore.getState()
      recordLessonCompletion('lesson-2')

      const state = useGoalsStore.getState()
      expect(state.showGoalCompletedModal).toBe(false)
    })
  })

  describe('checkDailyProgress', () => {
    it('should create today progress if not exists', () => {
      const { checkDailyProgress } = useGoalsStore.getState()
      checkDailyProgress()

      const state = useGoalsStore.getState()
      expect(state.todayProgress).not.toBeNull()
      expect(state.todayProgress?.date).toBe(MOCK_TODAY)
    })

    it('should reset for new day', () => {
      useGoalsStore.setState({
        ...initialState,
        todayProgress: {
          date: MOCK_YESTERDAY,
          goal: 3,
          completed: 3,
          lessonsCompleted: ['lesson-1', 'lesson-2', 'lesson-3'],
          goalMet: true,
          exceededBy: 0,
        },
      })

      const { checkDailyProgress } = useGoalsStore.getState()
      checkDailyProgress()

      const state = useGoalsStore.getState()
      expect(state.todayProgress?.date).toBe(MOCK_TODAY)
      expect(state.todayProgress?.completed).toBe(0)
    })

    it('should break streak if goal not met yesterday', () => {
      useGoalsStore.setState({
        ...initialState,
        goalStreak: {
          current: 5,
          longest: 10,
          lastGoalMetDate: MOCK_OLD_DATE, // Not yesterday
          streakStartDate: '2026-01-25',
        },
      })

      const { checkDailyProgress } = useGoalsStore.getState()
      checkDailyProgress()

      const state = useGoalsStore.getState()
      expect(state.goalStreak.current).toBe(0)
      expect(state.goalStreak.streakStartDate).toBeNull()
      // Longest should be preserved
      expect(state.goalStreak.longest).toBe(10)
    })

    it('should preserve streak if yesterday goal was met', () => {
      useGoalsStore.setState({
        ...initialState,
        goalStreak: {
          current: 5,
          longest: 10,
          lastGoalMetDate: MOCK_YESTERDAY,
          streakStartDate: '2026-01-28',
        },
      })

      const { checkDailyProgress } = useGoalsStore.getState()
      checkDailyProgress()

      const state = useGoalsStore.getState()
      expect(state.goalStreak.current).toBe(5) // Preserved
    })

    it('should not break streak if today goal already met', () => {
      useGoalsStore.setState({
        ...initialState,
        goalStreak: {
          current: 5,
          longest: 10,
          lastGoalMetDate: MOCK_TODAY,
          streakStartDate: '2026-01-28',
        },
        todayProgress: {
          date: MOCK_TODAY,
          goal: 3,
          completed: 3,
          lessonsCompleted: ['l1', 'l2', 'l3'],
          goalMet: true,
          exceededBy: 0,
        },
      })

      const { checkDailyProgress } = useGoalsStore.getState()
      checkDailyProgress()

      const state = useGoalsStore.getState()
      expect(state.goalStreak.current).toBe(5) // Preserved
    })
  })

  describe('dismissGoalCompletedModal', () => {
    it('should close the modal', () => {
      useGoalsStore.setState({
        ...initialState,
        showGoalCompletedModal: true,
      })

      const { dismissGoalCompletedModal } = useGoalsStore.getState()
      dismissGoalCompletedModal()

      const state = useGoalsStore.getState()
      expect(state.showGoalCompletedModal).toBe(false)
    })
  })

  describe('getTodayProgress', () => {
    it('should return today progress when it exists', () => {
      const existingProgress = {
        date: MOCK_TODAY,
        goal: 3,
        completed: 2,
        lessonsCompleted: ['lesson-1', 'lesson-2'],
        goalMet: false,
        exceededBy: 0,
      }

      useGoalsStore.setState({
        ...initialState,
        todayProgress: existingProgress,
      })

      const { getTodayProgress } = useGoalsStore.getState()
      const progress = getTodayProgress()

      expect(progress).toEqual(existingProgress)
    })

    it('should return empty progress when none exists', () => {
      const { getTodayProgress } = useGoalsStore.getState()
      const progress = getTodayProgress()

      expect(progress.date).toBe(MOCK_TODAY)
      expect(progress.completed).toBe(0)
      expect(progress.lessonsCompleted).toEqual([])
    })

    it('should return empty progress when existing is for different day', () => {
      useGoalsStore.setState({
        ...initialState,
        todayProgress: {
          date: MOCK_YESTERDAY,
          goal: 3,
          completed: 3,
          lessonsCompleted: ['lesson-1', 'lesson-2', 'lesson-3'],
          goalMet: true,
          exceededBy: 0,
        },
      })

      const { getTodayProgress } = useGoalsStore.getState()
      const progress = getTodayProgress()

      expect(progress.date).toBe(MOCK_TODAY)
      expect(progress.completed).toBe(0)
    })
  })

  describe('getProgressPercentage', () => {
    it('should return 0 when no lessons completed', () => {
      const { getProgressPercentage } = useGoalsStore.getState()
      const percentage = getProgressPercentage()

      expect(percentage).toBe(0)
    })

    it('should return correct percentage', () => {
      useGoalsStore.setState({
        ...initialState,
        dailyLessonsGoal: 4,
        todayProgress: {
          date: MOCK_TODAY,
          goal: 4,
          completed: 2,
          lessonsCompleted: ['lesson-1', 'lesson-2'],
          goalMet: false,
          exceededBy: 0,
        },
      })

      const { getProgressPercentage } = useGoalsStore.getState()
      const percentage = getProgressPercentage()

      expect(percentage).toBe(50)
    })

    it('should cap at 100 when goal exceeded', () => {
      useGoalsStore.setState({
        ...initialState,
        dailyLessonsGoal: 2,
        todayProgress: {
          date: MOCK_TODAY,
          goal: 2,
          completed: 5,
          lessonsCompleted: ['l1', 'l2', 'l3', 'l4', 'l5'],
          goalMet: true,
          exceededBy: 3,
        },
      })

      const { getProgressPercentage } = useGoalsStore.getState()
      const percentage = getProgressPercentage()

      expect(percentage).toBe(100)
    })

    it('should handle zero goal gracefully', () => {
      // Edge case: if somehow goal is 0
      useGoalsStore.setState({
        ...initialState,
        dailyLessonsGoal: 1, // Store default
        todayProgress: {
          date: MOCK_TODAY,
          goal: 0, // Edge case
          completed: 0,
          lessonsCompleted: [],
          goalMet: false,
          exceededBy: 0,
        },
      })

      const { getProgressPercentage } = useGoalsStore.getState()
      const percentage = getProgressPercentage()

      expect(percentage).toBe(0) // Should not throw
    })
  })

  describe('getRemainingLessons', () => {
    it('should return full goal when no lessons completed', () => {
      useGoalsStore.setState({
        ...initialState,
        dailyLessonsGoal: 5,
      })

      const { getRemainingLessons } = useGoalsStore.getState()
      const remaining = getRemainingLessons()

      expect(remaining).toBe(5)
    })

    it('should return correct remaining count', () => {
      useGoalsStore.setState({
        ...initialState,
        dailyLessonsGoal: 5,
        todayProgress: {
          date: MOCK_TODAY,
          goal: 5,
          completed: 2,
          lessonsCompleted: ['lesson-1', 'lesson-2'],
          goalMet: false,
          exceededBy: 0,
        },
      })

      const { getRemainingLessons } = useGoalsStore.getState()
      const remaining = getRemainingLessons()

      expect(remaining).toBe(3)
    })

    it('should return 0 when goal met', () => {
      useGoalsStore.setState({
        ...initialState,
        dailyLessonsGoal: 3,
        todayProgress: {
          date: MOCK_TODAY,
          goal: 3,
          completed: 3,
          lessonsCompleted: ['l1', 'l2', 'l3'],
          goalMet: true,
          exceededBy: 0,
        },
      })

      const { getRemainingLessons } = useGoalsStore.getState()
      const remaining = getRemainingLessons()

      expect(remaining).toBe(0)
    })

    it('should return 0 when goal exceeded', () => {
      useGoalsStore.setState({
        ...initialState,
        dailyLessonsGoal: 3,
        todayProgress: {
          date: MOCK_TODAY,
          goal: 3,
          completed: 5,
          lessonsCompleted: ['l1', 'l2', 'l3', 'l4', 'l5'],
          goalMet: true,
          exceededBy: 2,
        },
      })

      const { getRemainingLessons } = useGoalsStore.getState()
      const remaining = getRemainingLessons()

      expect(remaining).toBe(0)
    })
  })

  describe('isGoalMet', () => {
    it('should return false when goal not met', () => {
      useGoalsStore.setState({
        ...initialState,
        todayProgress: {
          date: MOCK_TODAY,
          goal: 3,
          completed: 2,
          lessonsCompleted: ['l1', 'l2'],
          goalMet: false,
          exceededBy: 0,
        },
      })

      const { isGoalMet } = useGoalsStore.getState()
      expect(isGoalMet()).toBe(false)
    })

    it('should return true when goal met', () => {
      useGoalsStore.setState({
        ...initialState,
        todayProgress: {
          date: MOCK_TODAY,
          goal: 3,
          completed: 3,
          lessonsCompleted: ['l1', 'l2', 'l3'],
          goalMet: true,
          exceededBy: 0,
        },
      })

      const { isGoalMet } = useGoalsStore.getState()
      expect(isGoalMet()).toBe(true)
    })

    it('should return false when no progress exists', () => {
      const { isGoalMet } = useGoalsStore.getState()
      expect(isGoalMet()).toBe(false)
    })
  })

  describe('isGoalExceeded', () => {
    it('should return false when goal not exceeded', () => {
      useGoalsStore.setState({
        ...initialState,
        todayProgress: {
          date: MOCK_TODAY,
          goal: 3,
          completed: 3,
          lessonsCompleted: ['l1', 'l2', 'l3'],
          goalMet: true,
          exceededBy: 0,
        },
      })

      const { isGoalExceeded } = useGoalsStore.getState()
      expect(isGoalExceeded()).toBe(false)
    })

    it('should return true when goal exceeded', () => {
      useGoalsStore.setState({
        ...initialState,
        todayProgress: {
          date: MOCK_TODAY,
          goal: 3,
          completed: 5,
          lessonsCompleted: ['l1', 'l2', 'l3', 'l4', 'l5'],
          goalMet: true,
          exceededBy: 2,
        },
      })

      const { isGoalExceeded } = useGoalsStore.getState()
      expect(isGoalExceeded()).toBe(true)
    })
  })

  describe('reset', () => {
    it('should reset store to initial state', () => {
      useGoalsStore.setState({
        ...initialState,
        dailyLessonsGoal: 7,
        timeCommitment: 'short',
        todayProgress: {
          date: MOCK_TODAY,
          goal: 7,
          completed: 5,
          lessonsCompleted: ['l1', 'l2', 'l3', 'l4', 'l5'],
          goalMet: false,
          exceededBy: 0,
        },
        goalStreak: {
          current: 10,
          longest: 20,
          lastGoalMetDate: MOCK_YESTERDAY,
          streakStartDate: '2026-01-20',
        },
        goalHistory: [{ date: MOCK_YESTERDAY, goal: 3, completed: 3, lessonsCompleted: [], goalMet: true, exceededBy: 0 }],
        showGoalCompletedModal: true,
      })

      const { reset } = useGoalsStore.getState()
      reset()

      const state = useGoalsStore.getState()
      expect(state.dailyLessonsGoal).toBe(3)
      expect(state.timeCommitment).toBe('flexible')
      expect(state.todayProgress).toBeNull()
      expect(state.goalStreak.current).toBe(0)
      expect(state.goalHistory).toEqual([])
      expect(state.showGoalCompletedModal).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should handle goal of 1 lesson', () => {
      useGoalsStore.setState({
        ...initialState,
        dailyLessonsGoal: 1,
      })

      const { recordLessonCompletion } = useGoalsStore.getState()
      recordLessonCompletion('single-lesson')

      const state = useGoalsStore.getState()
      expect(state.todayProgress?.goalMet).toBe(true)
    })

    it('should handle maximum goal of 10 lessons', () => {
      const { setDailyGoal } = useGoalsStore.getState()
      setDailyGoal(10)

      const { recordLessonCompletion } = useGoalsStore.getState()

      // Complete 10 lessons
      for (let i = 1; i <= 10; i++) {
        recordLessonCompletion(`lesson-${i}`)
      }

      const state = useGoalsStore.getState()
      expect(state.todayProgress?.goalMet).toBe(true)
      expect(state.todayProgress?.completed).toBe(10)
    })

    it('should handle rapid lesson completions', () => {
      const { setDailyGoal, recordLessonCompletion } = useGoalsStore.getState()
      setDailyGoal(5)

      // Simulate rapid completions
      for (let i = 1; i <= 10; i++) {
        recordLessonCompletion(`lesson-${i}`)
      }

      const state = useGoalsStore.getState()
      expect(state.todayProgress?.completed).toBe(10)
      expect(state.todayProgress?.exceededBy).toBe(5)
    })

    it('should handle very long streak', () => {
      useGoalsStore.setState({
        ...initialState,
        dailyLessonsGoal: 1,
        goalStreak: {
          current: 365, // One year streak
          longest: 365,
          lastGoalMetDate: MOCK_YESTERDAY,
          streakStartDate: '2025-02-02',
        },
      })

      const { recordLessonCompletion } = useGoalsStore.getState()
      recordLessonCompletion('lesson-1')

      const state = useGoalsStore.getState()
      expect(state.goalStreak.current).toBe(366)
      expect(state.goalStreak.longest).toBe(366)
    })
  })
})
