/**
 * Gamification Store Unit Tests
 *
 * Comprehensive tests for the gamification store including XP, levels,
 * streaks, badges, and leaderboard functionality.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useGamificationStore } from './gamificationStore'
import { eventBus } from '../lib/eventBus'
import * as levelSystem from '../utils/levelSystem'
import * as xpCalculator from '../utils/xpCalculator'

// Mock the eventBus
vi.mock('../lib/eventBus', () => ({
  eventBus: {
    emit: vi.fn(),
    on: vi.fn(() => vi.fn()),
    off: vi.fn(),
    removeAllListeners: vi.fn(),
  },
}))

// Mock the badgeEngine
vi.mock('../lib/badgeEngine', () => ({
  initializeBadgeEngine: vi.fn(() => ({
    checkAllUnlocks: vi.fn(() => []),
    checkUnlocksForEvent: vi.fn(() => []),
    updateMetrics: vi.fn(),
  })),
  getBadgeEngine: vi.fn(() => ({
    checkAllUnlocks: vi.fn(() => []),
    checkUnlocksForEvent: vi.fn(() => []),
    updateMetrics: vi.fn(),
  })),
}))

// Mock streak engine helpers
vi.mock('../lib/streakEngine', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../lib/streakEngine')>()
  return {
    ...actual,
    getTodayDateString: vi.fn(() => '2026-02-02'),
    isToday: vi.fn((date: string | null) => date === '2026-02-02'),
    isYesterday: vi.fn((date: string | null) => date === '2026-02-01'),
    getStreakMultiplier: actual.getStreakMultiplier,
    isMilestoneDay: actual.isMilestoneDay,
    getMilestoneInfo: actual.getMilestoneInfo,
  }
})

describe('gamificationStore', () => {
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
    league: 'bronze' as const,
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

  beforeEach(() => {
    // Reset store to initial state
    useGamificationStore.setState(initialState)
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should have correct initial XP values', () => {
      const state = useGamificationStore.getState()
      expect(state.currentXP).toBe(0)
      expect(state.totalXP).toBe(0)
    })

    it('should start at level 1', () => {
      const state = useGamificationStore.getState()
      expect(state.level).toBe(1)
    })

    it('should have correct initial streak values', () => {
      const state = useGamificationStore.getState()
      expect(state.currentStreak).toBe(0)
      expect(state.longestStreak).toBe(0)
      expect(state.lastActivityDate).toBeNull()
      expect(state.streakFreezes).toBe(0)
    })

    it('should have empty badges', () => {
      const state = useGamificationStore.getState()
      expect(state.unlockedBadges).toEqual([])
      expect(state.recentBadge).toBeNull()
    })

    it('should have leaderboard enabled by default', () => {
      const state = useGamificationStore.getState()
      expect(state.isLeaderboardOptedIn).toBe(true)
      expect(state.weeklyXP).toBe(0)
      expect(state.league).toBe('bronze')
    })

    it('should have empty XP history', () => {
      const state = useGamificationStore.getState()
      expect(state.xpHistory).toEqual([])
    })

    it('should not be loading or syncing', () => {
      const state = useGamificationStore.getState()
      expect(state.isLoading).toBe(false)
      expect(state.isSyncing).toBe(false)
    })
  })

  describe('addXP', () => {
    it('should add XP to current total', () => {
      const { addXP } = useGamificationStore.getState()

      addXP(50, 'lesson')

      const state = useGamificationStore.getState()
      expect(state.totalXP).toBeGreaterThanOrEqual(50)
    })

    it('should apply streak bonus when user has an active streak', () => {
      // Set up a streak first
      useGamificationStore.setState({
        ...initialState,
        currentStreak: 7, // 10% bonus tier
      })

      const { addXP } = useGamificationStore.getState()
      addXP(100, 'lesson')

      const state = useGamificationStore.getState()
      // With 7-day streak, should get 10% bonus: 100 * 1.10 = 110
      expect(state.totalXP).toBe(110)
    })

    it('should not apply streak bonus for streak_bonus source', () => {
      useGamificationStore.setState({
        ...initialState,
        currentStreak: 7,
      })

      const { addXP } = useGamificationStore.getState()
      addXP(10, 'streak_bonus')

      const state = useGamificationStore.getState()
      // No streak bonus applied for streak_bonus source
      expect(state.totalXP).toBe(10)
    })

    it('should update XP history', () => {
      const { addXP } = useGamificationStore.getState()
      addXP(25, 'quiz')

      const state = useGamificationStore.getState()
      expect(state.xpHistory.length).toBe(1)
      expect(state.xpHistory[0].source).toBe('quiz')
    })

    it('should limit XP history to 100 entries', () => {
      const { addXP } = useGamificationStore.getState()

      // Add 105 XP events
      for (let i = 0; i < 105; i++) {
        addXP(10, 'lesson')
      }

      const state = useGamificationStore.getState()
      expect(state.xpHistory.length).toBe(100)
    })

    it('should emit xp:earned event', () => {
      const { addXP } = useGamificationStore.getState()
      addXP(50, 'lesson', { lessonId: 'lesson-1', courseId: 'course-1' })

      expect(eventBus.emit).toHaveBeenCalledWith('xp:earned', expect.objectContaining({
        source: 'lesson',
        lessonId: 'lesson-1',
        courseId: 'course-1',
      }))
    })

    it('should update weeklyXP when leaderboard is opted in', () => {
      const { addXP } = useGamificationStore.getState()
      addXP(50, 'lesson')

      const state = useGamificationStore.getState()
      expect(state.weeklyXP).toBeGreaterThan(0)
    })

    it('should not update weeklyXP when leaderboard is opted out', () => {
      useGamificationStore.setState({
        ...initialState,
        isLeaderboardOptedIn: false,
      })

      const { addXP } = useGamificationStore.getState()
      addXP(50, 'lesson')

      const state = useGamificationStore.getState()
      expect(state.weeklyXP).toBe(0)
    })
  })

  describe('level up logic', () => {
    it('should level up when XP crosses threshold', () => {
      // Set up state just below level 2
      const xpForLevel1 = levelSystem.xpForLevel(1) // 100
      useGamificationStore.setState({
        ...initialState,
        totalXP: xpForLevel1 - 10,
        currentXP: xpForLevel1 - 10,
      })

      const { addXP } = useGamificationStore.getState()
      addXP(20, 'lesson') // Should push over level threshold

      const state = useGamificationStore.getState()
      expect(state.level).toBe(2)
    })

    it('should emit level:up event on level up', () => {
      const xpForLevel1 = levelSystem.xpForLevel(1)
      useGamificationStore.setState({
        ...initialState,
        totalXP: xpForLevel1 - 10,
        level: 1,
      })

      const { addXP } = useGamificationStore.getState()
      addXP(20, 'lesson')

      expect(eventBus.emit).toHaveBeenCalledWith('level:up', expect.objectContaining({
        newLevel: 2,
        previousLevel: 1,
      }))
    })

    it('should handle multiple level ups at once', () => {
      useGamificationStore.setState({
        ...initialState,
        totalXP: 0,
        level: 1,
      })

      const { addXP } = useGamificationStore.getState()
      // Add enough XP to level up multiple times
      addXP(500, 'achievement')

      const state = useGamificationStore.getState()
      expect(state.level).toBeGreaterThan(1)
    })

    it('should calculate progress percent correctly', () => {
      const { addXP } = useGamificationStore.getState()
      addXP(50, 'lesson') // Half of level 1 requirement

      const state = useGamificationStore.getState()
      expect(state.progressPercent).toBeGreaterThan(0)
      expect(state.progressPercent).toBeLessThanOrEqual(100)
    })
  })

  describe('recordActivity', () => {
    it('should start a new streak on first activity', () => {
      const { recordActivity } = useGamificationStore.getState()
      const result = recordActivity()

      expect(result).not.toBeNull()
      expect(result?.newStreak).toBe(1)

      const state = useGamificationStore.getState()
      expect(state.currentStreak).toBe(1)
    })

    it('should continue streak when activity is day after last', () => {
      useGamificationStore.setState({
        ...initialState,
        currentStreak: 5,
        lastActivityDate: '2026-02-01', // yesterday
      })

      const { recordActivity } = useGamificationStore.getState()
      const result = recordActivity()

      expect(result?.newStreak).toBe(6)
      expect(result?.previousStreak).toBe(5)
    })

    it('should return null if already active today', () => {
      useGamificationStore.setState({
        ...initialState,
        currentStreak: 5,
        lastActivityDate: '2026-02-02', // today
      })

      const { recordActivity } = useGamificationStore.getState()
      const result = recordActivity()

      expect(result).toBeNull()
    })

    it('should update longest streak when new record is set', () => {
      useGamificationStore.setState({
        ...initialState,
        currentStreak: 5,
        longestStreak: 5,
        lastActivityDate: '2026-02-01',
      })

      const { recordActivity } = useGamificationStore.getState()
      const result = recordActivity()

      expect(result?.isNewRecord).toBe(true)

      const state = useGamificationStore.getState()
      expect(state.longestStreak).toBe(6)
    })
  })

  describe('recordDailyLogin', () => {
    it('should record login and update streak', () => {
      const { recordDailyLogin } = useGamificationStore.getState()
      recordDailyLogin()

      const state = useGamificationStore.getState()
      expect(state.currentStreak).toBe(1)
      expect(state.lastActivityDate).toBe('2026-02-02')
    })

    it('should continue streak from yesterday', () => {
      useGamificationStore.setState({
        ...initialState,
        currentStreak: 3,
        lastActivityDate: '2026-02-01',
      })

      const { recordDailyLogin } = useGamificationStore.getState()
      recordDailyLogin()

      const state = useGamificationStore.getState()
      expect(state.currentStreak).toBe(4)
    })

    it('should not record if already logged in today', () => {
      useGamificationStore.setState({
        ...initialState,
        currentStreak: 3,
        lastActivityDate: '2026-02-02',
      })

      const { recordDailyLogin } = useGamificationStore.getState()
      recordDailyLogin()

      const state = useGamificationStore.getState()
      expect(state.currentStreak).toBe(3) // Unchanged
    })

    it('should emit daily:login event', () => {
      const { recordDailyLogin } = useGamificationStore.getState()
      recordDailyLogin()

      expect(eventBus.emit).toHaveBeenCalledWith('daily:login', expect.objectContaining({
        date: '2026-02-02',
        consecutiveDays: 1,
      }))
    })

    it('should award XP for daily login', () => {
      const { recordDailyLogin } = useGamificationStore.getState()
      recordDailyLogin()

      const state = useGamificationStore.getState()
      expect(state.totalXP).toBeGreaterThan(0)
    })
  })

  describe('useStreakFreeze', () => {
    it('should use freeze when available', () => {
      useGamificationStore.setState({
        ...initialState,
        streakFreezes: 2,
      })

      const { useStreakFreeze } = useGamificationStore.getState()
      const result = useStreakFreeze()

      expect(result).toBe(true)

      const state = useGamificationStore.getState()
      expect(state.streakFreezes).toBe(1)
    })

    it('should return false when no freezes available', () => {
      useGamificationStore.setState({
        ...initialState,
        streakFreezes: 0,
      })

      const { useStreakFreeze } = useGamificationStore.getState()
      const result = useStreakFreeze()

      expect(result).toBe(false)
    })
  })

  describe('awardFreezes', () => {
    it('should award freezes correctly', () => {
      const { awardFreezes } = useGamificationStore.getState()
      const awarded = awardFreezes(2, 'milestone')

      expect(awarded).toBe(2)

      const state = useGamificationStore.getState()
      expect(state.streakFreezes).toBe(2)
    })

    it('should cap freezes at maximum (5)', () => {
      useGamificationStore.setState({
        ...initialState,
        streakFreezes: 4,
      })

      const { awardFreezes } = useGamificationStore.getState()
      const awarded = awardFreezes(3, 'bonus')

      expect(awarded).toBe(1) // Only 1 more can be added

      const state = useGamificationStore.getState()
      expect(state.streakFreezes).toBe(5)
    })

    it('should return 0 if already at max freezes', () => {
      useGamificationStore.setState({
        ...initialState,
        streakFreezes: 5,
      })

      const { awardFreezes } = useGamificationStore.getState()
      const awarded = awardFreezes(2, 'extra')

      expect(awarded).toBe(0)
    })
  })

  describe('unlockBadge', () => {
    it('should add badge to unlocked badges', () => {
      const testBadge = {
        id: 'test-badge',
        name: 'Test Badge',
        description: 'A test badge',
        icon: 'star',
        category: 'achievement' as const,
        rarity: 'common' as const,
        xpReward: 10,
      }

      const { unlockBadge } = useGamificationStore.getState()
      unlockBadge(testBadge)

      const state = useGamificationStore.getState()
      expect(state.unlockedBadges).toContain('test-badge')
    })

    it('should set recentBadge', () => {
      const testBadge = {
        id: 'test-badge',
        name: 'Test Badge',
        description: 'A test badge',
        icon: 'star',
        category: 'achievement' as const,
        rarity: 'rare' as const,
        xpReward: 25,
      }

      const { unlockBadge } = useGamificationStore.getState()
      unlockBadge(testBadge)

      const state = useGamificationStore.getState()
      expect(state.recentBadge).not.toBeNull()
      expect(state.recentBadge?.id).toBe('test-badge')
      expect(state.recentBadge?.unlockedAt).toBeDefined()
    })

    it('should not unlock same badge twice', () => {
      const testBadge = {
        id: 'test-badge',
        name: 'Test Badge',
        description: 'A test badge',
        icon: 'star',
        category: 'achievement' as const,
        rarity: 'common' as const,
        xpReward: 10,
      }

      useGamificationStore.setState({
        ...initialState,
        unlockedBadges: ['test-badge'],
      })

      const initialXP = useGamificationStore.getState().totalXP

      const { unlockBadge } = useGamificationStore.getState()
      unlockBadge(testBadge)

      const state = useGamificationStore.getState()
      // Should still only have one instance
      expect(state.unlockedBadges.filter(id => id === 'test-badge').length).toBe(1)
      // Should not have gained additional XP
      expect(state.totalXP).toBe(initialXP)
    })

    it('should emit badge:unlocked event', () => {
      const testBadge = {
        id: 'new-badge',
        name: 'New Badge',
        description: 'A new badge',
        icon: 'trophy',
        category: 'achievement' as const,
        rarity: 'epic' as const,
        xpReward: 50,
      }

      const { unlockBadge } = useGamificationStore.getState()
      unlockBadge(testBadge)

      expect(eventBus.emit).toHaveBeenCalledWith('badge:unlocked', expect.objectContaining({
        badgeId: 'new-badge',
        badgeName: 'New Badge',
        rarity: 'epic',
      }))
    })

    it('should award XP based on badge rarity', () => {
      const testBadge = {
        id: 'legendary-badge',
        name: 'Legendary Badge',
        description: 'A legendary badge',
        icon: 'crown',
        category: 'special' as const,
        rarity: 'legendary' as const,
        xpReward: 100,
      }

      const { unlockBadge } = useGamificationStore.getState()
      unlockBadge(testBadge)

      const state = useGamificationStore.getState()
      // Should have XP from badge reward (legendary = 100 XP based on xpCalculator)
      expect(state.totalXP).toBeGreaterThan(0)
    })
  })

  describe('updateBadgeMetrics', () => {
    it('should update badge metrics', () => {
      const { updateBadgeMetrics } = useGamificationStore.getState()
      updateBadgeMetrics({
        lessons_completed: 5,
        perfect_quizzes: 2,
      })

      const state = useGamificationStore.getState()
      expect(state.badgeMetrics.lessons_completed).toBe(5)
      expect(state.badgeMetrics.perfect_quizzes).toBe(2)
    })

    it('should merge with existing metrics', () => {
      useGamificationStore.setState({
        ...initialState,
        badgeMetrics: {
          ...initialState.badgeMetrics,
          lessons_completed: 3,
          night_lessons: 1,
        },
      })

      const { updateBadgeMetrics } = useGamificationStore.getState()
      updateBadgeMetrics({
        lessons_completed: 5,
      })

      const state = useGamificationStore.getState()
      expect(state.badgeMetrics.lessons_completed).toBe(5)
      expect(state.badgeMetrics.night_lessons).toBe(1) // Preserved
    })
  })

  describe('leaderboard actions', () => {
    describe('addWeeklyXP', () => {
      it('should add to weekly XP when opted in', () => {
        const { addWeeklyXP } = useGamificationStore.getState()
        addWeeklyXP(100)

        const state = useGamificationStore.getState()
        expect(state.weeklyXP).toBe(100)
      })

      it('should not add weekly XP when opted out', () => {
        useGamificationStore.setState({
          ...initialState,
          isLeaderboardOptedIn: false,
        })

        const { addWeeklyXP } = useGamificationStore.getState()
        addWeeklyXP(100)

        const state = useGamificationStore.getState()
        expect(state.weeklyXP).toBe(0)
      })
    })

    describe('setLeague', () => {
      it('should update league', () => {
        const { setLeague } = useGamificationStore.getState()
        setLeague('gold')

        const state = useGamificationStore.getState()
        expect(state.league).toBe('gold')
      })
    })

    describe('setLeaderboardOptIn', () => {
      it('should opt in to leaderboard', () => {
        useGamificationStore.setState({
          ...initialState,
          isLeaderboardOptedIn: false,
        })

        const { setLeaderboardOptIn } = useGamificationStore.getState()
        setLeaderboardOptIn(true)

        const state = useGamificationStore.getState()
        expect(state.isLeaderboardOptedIn).toBe(true)
      })

      it('should reset weekly XP and rank when opting out', () => {
        useGamificationStore.setState({
          ...initialState,
          isLeaderboardOptedIn: true,
          weeklyXP: 500,
          leaderboardRank: 10,
        })

        const { setLeaderboardOptIn } = useGamificationStore.getState()
        setLeaderboardOptIn(false)

        const state = useGamificationStore.getState()
        expect(state.isLeaderboardOptedIn).toBe(false)
        expect(state.weeklyXP).toBe(0)
        expect(state.leaderboardRank).toBeNull()
      })
    })

    describe('resetWeeklyXP', () => {
      it('should reset weekly XP to 0', () => {
        useGamificationStore.setState({
          ...initialState,
          weeklyXP: 500,
        })

        const { resetWeeklyXP } = useGamificationStore.getState()
        resetWeeklyXP()

        const state = useGamificationStore.getState()
        expect(state.weeklyXP).toBe(0)
      })
    })
  })

  describe('modal actions', () => {
    describe('closeMilestoneModal', () => {
      it('should close milestone modal and clear pending milestone', () => {
        useGamificationStore.setState({
          ...initialState,
          showMilestoneModal: true,
          pendingMilestone: 7,
        })

        const { closeMilestoneModal } = useGamificationStore.getState()
        closeMilestoneModal()

        const state = useGamificationStore.getState()
        expect(state.showMilestoneModal).toBe(false)
        expect(state.pendingMilestone).toBeNull()
      })
    })

    describe('closeBadgeUnlockModal', () => {
      it('should close badge unlock modal', () => {
        useGamificationStore.setState({
          ...initialState,
          showBadgeUnlockModal: true,
          pendingBadgeUnlock: {
            id: 'test',
            name: 'Test',
            description: 'Test',
            icon: 'star',
            category: 'learning' as const,
            rarity: 'common' as const,
            xpReward: 10,
            hidden: false,
            criteria: { type: 'count' as const, metric: 'lessons_completed', threshold: 1 },
          },
        })

        const { closeBadgeUnlockModal } = useGamificationStore.getState()
        closeBadgeUnlockModal()

        const state = useGamificationStore.getState()
        expect(state.showBadgeUnlockModal).toBe(false)
        expect(state.pendingBadgeUnlock).toBeNull()
      })
    })
  })

  describe('computed getters', () => {
    describe('getLevelInfo', () => {
      it('should return correct level info', () => {
        useGamificationStore.setState({
          ...initialState,
          totalXP: 150,
        })

        const { getLevelInfo } = useGamificationStore.getState()
        const levelInfo = getLevelInfo()

        expect(levelInfo.level).toBeGreaterThanOrEqual(1)
        expect(levelInfo.totalXP).toBe(150)
        expect(levelInfo.progressPercent).toBeGreaterThanOrEqual(0)
        expect(levelInfo.progressPercent).toBeLessThanOrEqual(100)
      })
    })

    describe('getStreakData', () => {
      it('should return correct streak data', () => {
        useGamificationStore.setState({
          ...initialState,
          currentStreak: 5,
          longestStreak: 10,
          lastActivityDate: '2026-02-02',
          streakFreezes: 2,
          isStreakAtRisk: false,
        })

        const { getStreakData } = useGamificationStore.getState()
        const streakData = getStreakData()

        expect(streakData.currentStreak).toBe(5)
        expect(streakData.longestStreak).toBe(10)
        expect(streakData.lastActivityDate).toBe('2026-02-02')
        expect(streakData.streakFreezes).toBe(2)
        expect(streakData.isAtRisk).toBe(false)
      })
    })

    describe('getStreakMultiplier', () => {
      it('should return correct multiplier for streak days', () => {
        useGamificationStore.setState({
          ...initialState,
          currentStreak: 7,
        })

        const { getStreakMultiplier } = useGamificationStore.getState()
        const multiplier = getStreakMultiplier()

        // 7-day streak = 10% bonus = 1.10 multiplier
        expect(multiplier).toBe(1.1)
      })

      it('should return 1.0 for no streak', () => {
        useGamificationStore.setState({
          ...initialState,
          currentStreak: 0,
        })

        const { getStreakMultiplier } = useGamificationStore.getState()
        const multiplier = getStreakMultiplier()

        expect(multiplier).toBe(1.0)
      })
    })
  })

  describe('reset', () => {
    it('should reset store to initial state', () => {
      useGamificationStore.setState({
        ...initialState,
        totalXP: 500,
        level: 5,
        currentStreak: 10,
        unlockedBadges: ['badge-1', 'badge-2'],
        weeklyXP: 200,
      })

      const { reset } = useGamificationStore.getState()
      reset()

      const state = useGamificationStore.getState()
      expect(state.totalXP).toBe(0)
      expect(state.level).toBe(1)
      expect(state.currentStreak).toBe(0)
      expect(state.unlockedBadges).toEqual([])
      expect(state.weeklyXP).toBe(0)
    })
  })

  describe('edge cases', () => {
    it('should handle zero XP addition', () => {
      const { addXP } = useGamificationStore.getState()
      addXP(0, 'lesson')

      const state = useGamificationStore.getState()
      expect(state.totalXP).toBe(0)
    })

    it('should handle negative streak days gracefully', () => {
      useGamificationStore.setState({
        ...initialState,
        currentStreak: -1, // Edge case
      })

      const { getStreakMultiplier } = useGamificationStore.getState()
      const multiplier = getStreakMultiplier()

      expect(multiplier).toBe(1.0) // Should default to no bonus
    })

    it('should handle very large XP values', () => {
      const { addXP } = useGamificationStore.getState()
      addXP(1000000, 'achievement')

      const state = useGamificationStore.getState()
      expect(state.totalXP).toBe(1000000)
      expect(state.level).toBeGreaterThan(1)
    })
  })
})
