/**
 * User Profile Store Unit Tests
 *
 * Comprehensive tests for the user profile store including profile management,
 * preferences, authentication state, and computed getters.
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useUserProfileStore, getArchetypeRecommendations } from './userProfileStore'
import { eventBus } from '../lib/eventBus'
import type { LearnerProfile, UserPreferences } from '../types/gamification'

// Mock the eventBus
vi.mock('../lib/eventBus', () => ({
  eventBus: {
    emit: vi.fn(),
    on: vi.fn(() => vi.fn()),
    off: vi.fn(),
    removeAllListeners: vi.fn(),
  },
}))

describe('userProfileStore', () => {
  const defaultPreferences: UserPreferences = {
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

  const initialState = {
    profile: null,
    preferences: defaultPreferences,
    isLoading: false,
    isSyncing: false,
    lastSyncedAt: null,
  }

  const mockProfile: LearnerProfile = {
    userId: 'user-123',
    archetype: 'achiever',
    learningPreferences: {
      preferredSessionLength: 'medium',
      bestTimeOfDay: 'morning',
      contentTypePreference: ['video', 'interactive'],
      pacePreference: 'moderate',
    },
    motivationScore: {
      intrinsicMotivation: 0.8,
      extrinsicMotivation: 0.6,
      engagementPrediction: 0.75,
      persistenceScore: 0.85,
    },
    assessedAt: '2026-02-01T10:00:00Z',
  }

  beforeEach(() => {
    // Reset store to initial state
    useUserProfileStore.setState(initialState)
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should have null profile initially', () => {
      const state = useUserProfileStore.getState()
      expect(state.profile).toBeNull()
    })

    it('should have default preferences', () => {
      const state = useUserProfileStore.getState()
      expect(state.preferences).toEqual(defaultPreferences)
    })

    it('should have default notification preferences', () => {
      const state = useUserProfileStore.getState()
      expect(state.preferences.notifications.dailyReminders).toBe(true)
      expect(state.preferences.notifications.streakAlerts).toBe(true)
      expect(state.preferences.notifications.achievementAlerts).toBe(true)
      expect(state.preferences.notifications.weeklyDigest).toBe(true)
      expect(state.preferences.notifications.reminderTime).toBe('09:00')
    })

    it('should have default display preferences', () => {
      const state = useUserProfileStore.getState()
      expect(state.preferences.display.showXPAnimations).toBe(true)
      expect(state.preferences.display.showLeaderboard).toBe(true)
      expect(state.preferences.display.compactMode).toBe(false)
    })

    it('should have default goal preferences', () => {
      const state = useUserProfileStore.getState()
      expect(state.preferences.goals.dailyXPGoal).toBe(50)
      expect(state.preferences.goals.dailyLessonsGoal).toBe(3)
      expect(state.preferences.goals.weeklyHoursGoal).toBe(5)
    })

    it('should not be loading or syncing', () => {
      const state = useUserProfileStore.getState()
      expect(state.isLoading).toBe(false)
      expect(state.isSyncing).toBe(false)
    })

    it('should have null lastSyncedAt', () => {
      const state = useUserProfileStore.getState()
      expect(state.lastSyncedAt).toBeNull()
    })
  })

  describe('setProfile', () => {
    it('should set the complete learner profile', () => {
      const { setProfile } = useUserProfileStore.getState()
      setProfile(mockProfile)

      const state = useUserProfileStore.getState()
      expect(state.profile).toEqual(mockProfile)
    })

    it('should update lastSyncedAt timestamp', () => {
      const { setProfile } = useUserProfileStore.getState()
      setProfile(mockProfile)

      const state = useUserProfileStore.getState()
      expect(state.lastSyncedAt).not.toBeNull()
      // Should be a valid ISO date string
      expect(() => new Date(state.lastSyncedAt!)).not.toThrow()
    })

    it('should emit profile:updated event', () => {
      const { setProfile } = useUserProfileStore.getState()
      setProfile(mockProfile)

      expect(eventBus.emit).toHaveBeenCalledWith('profile:updated', expect.objectContaining({
        userId: 'user-123',
        changes: expect.arrayContaining(['archetype', 'learningPreferences', 'motivationScore']),
      }))
    })

    it('should overwrite existing profile', () => {
      useUserProfileStore.setState({
        ...initialState,
        profile: {
          ...mockProfile,
          archetype: 'explorer',
        },
      })

      const newProfile: LearnerProfile = {
        ...mockProfile,
        archetype: 'competitor',
      }

      const { setProfile } = useUserProfileStore.getState()
      setProfile(newProfile)

      const state = useUserProfileStore.getState()
      expect(state.profile?.archetype).toBe('competitor')
    })
  })

  describe('updateProfile', () => {
    it('should update specific profile fields', () => {
      useUserProfileStore.setState({
        ...initialState,
        profile: mockProfile,
      })

      const { updateProfile } = useUserProfileStore.getState()
      updateProfile({ archetype: 'socializer' })

      const state = useUserProfileStore.getState()
      expect(state.profile?.archetype).toBe('socializer')
      // Other fields should be preserved
      expect(state.profile?.userId).toBe('user-123')
    })

    it('should not update if profile is null', () => {
      const { updateProfile } = useUserProfileStore.getState()
      updateProfile({ archetype: 'explorer' })

      const state = useUserProfileStore.getState()
      expect(state.profile).toBeNull()
    })

    it('should update lastSyncedAt timestamp', () => {
      useUserProfileStore.setState({
        ...initialState,
        profile: mockProfile,
        lastSyncedAt: '2026-01-01T00:00:00Z',
      })

      const { updateProfile } = useUserProfileStore.getState()
      updateProfile({ archetype: 'achiever' })

      const state = useUserProfileStore.getState()
      expect(state.lastSyncedAt).not.toBe('2026-01-01T00:00:00Z')
    })

    it('should emit profile:updated event with changed fields', () => {
      useUserProfileStore.setState({
        ...initialState,
        profile: mockProfile,
      })

      const { updateProfile } = useUserProfileStore.getState()
      updateProfile({ archetype: 'explorer' })

      expect(eventBus.emit).toHaveBeenCalledWith('profile:updated', expect.objectContaining({
        userId: 'user-123',
        changes: ['archetype'],
      }))
    })

    it('should handle updating multiple fields', () => {
      useUserProfileStore.setState({
        ...initialState,
        profile: mockProfile,
      })

      const { updateProfile } = useUserProfileStore.getState()
      updateProfile({
        archetype: 'competitor',
        learningPreferences: {
          ...mockProfile.learningPreferences,
          pacePreference: 'fast',
        },
      })

      const state = useUserProfileStore.getState()
      expect(state.profile?.archetype).toBe('competitor')
      expect(state.profile?.learningPreferences.pacePreference).toBe('fast')
    })
  })

  describe('updatePreferences', () => {
    it('should update all preferences', () => {
      const { updatePreferences } = useUserProfileStore.getState()
      updatePreferences({
        notifications: {
          ...defaultPreferences.notifications,
          dailyReminders: false,
        },
      })

      const state = useUserProfileStore.getState()
      expect(state.preferences.notifications.dailyReminders).toBe(false)
    })

    it('should merge with existing preferences', () => {
      const { updatePreferences } = useUserProfileStore.getState()
      updatePreferences({
        display: {
          ...defaultPreferences.display,
          compactMode: true,
        },
      })

      const state = useUserProfileStore.getState()
      expect(state.preferences.display.compactMode).toBe(true)
      // Other preferences should be preserved
      expect(state.preferences.notifications.dailyReminders).toBe(true)
    })
  })

  describe('updateNotificationPreferences', () => {
    it('should update specific notification preferences', () => {
      const { updateNotificationPreferences } = useUserProfileStore.getState()
      updateNotificationPreferences({ dailyReminders: false })

      const state = useUserProfileStore.getState()
      expect(state.preferences.notifications.dailyReminders).toBe(false)
      // Other notification settings should be preserved
      expect(state.preferences.notifications.streakAlerts).toBe(true)
    })

    it('should update reminder time', () => {
      const { updateNotificationPreferences } = useUserProfileStore.getState()
      updateNotificationPreferences({ reminderTime: '18:30' })

      const state = useUserProfileStore.getState()
      expect(state.preferences.notifications.reminderTime).toBe('18:30')
    })

    it('should handle multiple notification updates', () => {
      const { updateNotificationPreferences } = useUserProfileStore.getState()
      updateNotificationPreferences({
        dailyReminders: false,
        weeklyDigest: false,
        reminderTime: '07:00',
      })

      const state = useUserProfileStore.getState()
      expect(state.preferences.notifications.dailyReminders).toBe(false)
      expect(state.preferences.notifications.weeklyDigest).toBe(false)
      expect(state.preferences.notifications.reminderTime).toBe('07:00')
    })
  })

  describe('updateDisplayPreferences', () => {
    it('should update specific display preferences', () => {
      const { updateDisplayPreferences } = useUserProfileStore.getState()
      updateDisplayPreferences({ showXPAnimations: false })

      const state = useUserProfileStore.getState()
      expect(state.preferences.display.showXPAnimations).toBe(false)
      // Other display settings should be preserved
      expect(state.preferences.display.showLeaderboard).toBe(true)
    })

    it('should toggle compact mode', () => {
      const { updateDisplayPreferences } = useUserProfileStore.getState()
      updateDisplayPreferences({ compactMode: true })

      const state = useUserProfileStore.getState()
      expect(state.preferences.display.compactMode).toBe(true)
    })

    it('should hide leaderboard', () => {
      const { updateDisplayPreferences } = useUserProfileStore.getState()
      updateDisplayPreferences({ showLeaderboard: false })

      const state = useUserProfileStore.getState()
      expect(state.preferences.display.showLeaderboard).toBe(false)
    })
  })

  describe('updateGoalPreferences', () => {
    it('should update daily XP goal', () => {
      const { updateGoalPreferences } = useUserProfileStore.getState()
      updateGoalPreferences({ dailyXPGoal: 100 })

      const state = useUserProfileStore.getState()
      expect(state.preferences.goals.dailyXPGoal).toBe(100)
    })

    it('should update daily lessons goal', () => {
      const { updateGoalPreferences } = useUserProfileStore.getState()
      updateGoalPreferences({ dailyLessonsGoal: 5 })

      const state = useUserProfileStore.getState()
      expect(state.preferences.goals.dailyLessonsGoal).toBe(5)
    })

    it('should update weekly hours goal', () => {
      const { updateGoalPreferences } = useUserProfileStore.getState()
      updateGoalPreferences({ weeklyHoursGoal: 10 })

      const state = useUserProfileStore.getState()
      expect(state.preferences.goals.weeklyHoursGoal).toBe(10)
    })

    it('should preserve other goal preferences', () => {
      const { updateGoalPreferences } = useUserProfileStore.getState()
      updateGoalPreferences({ dailyXPGoal: 75 })

      const state = useUserProfileStore.getState()
      expect(state.preferences.goals.dailyXPGoal).toBe(75)
      expect(state.preferences.goals.dailyLessonsGoal).toBe(3) // Preserved
      expect(state.preferences.goals.weeklyHoursGoal).toBe(5) // Preserved
    })
  })

  describe('hasCompletedOnboarding', () => {
    it('should return false when profile is null', () => {
      const { hasCompletedOnboarding } = useUserProfileStore.getState()
      expect(hasCompletedOnboarding()).toBe(false)
    })

    it('should return true when profile has archetype', () => {
      useUserProfileStore.setState({
        ...initialState,
        profile: mockProfile,
      })

      const { hasCompletedOnboarding } = useUserProfileStore.getState()
      expect(hasCompletedOnboarding()).toBe(true)
    })

    it('should return false when profile exists but archetype is undefined', () => {
      useUserProfileStore.setState({
        ...initialState,
        profile: {
          ...mockProfile,
          archetype: undefined as unknown as LearnerProfile['archetype'],
        },
      })

      const { hasCompletedOnboarding } = useUserProfileStore.getState()
      expect(hasCompletedOnboarding()).toBe(false)
    })
  })

  describe('getArchetype', () => {
    it('should return null when profile is null', () => {
      const { getArchetype } = useUserProfileStore.getState()
      expect(getArchetype()).toBeNull()
    })

    it('should return archetype when profile exists', () => {
      useUserProfileStore.setState({
        ...initialState,
        profile: mockProfile,
      })

      const { getArchetype } = useUserProfileStore.getState()
      expect(getArchetype()).toBe('achiever')
    })

    it('should return different archetypes correctly', () => {
      const archetypes: LearnerProfile['archetype'][] = [
        'achiever',
        'explorer',
        'socializer',
        'competitor',
        'self-improver',
      ]

      archetypes.forEach(archetype => {
        useUserProfileStore.setState({
          ...initialState,
          profile: {
            ...mockProfile,
            archetype,
          },
        })

        const { getArchetype } = useUserProfileStore.getState()
        expect(getArchetype()).toBe(archetype)
      })
    })
  })

  describe('getDailyGoals', () => {
    it('should return default daily goals', () => {
      const { getDailyGoals } = useUserProfileStore.getState()
      const goals = getDailyGoals()

      expect(goals.dailyXPGoal).toBe(50)
      expect(goals.dailyLessonsGoal).toBe(3)
      expect(goals.weeklyHoursGoal).toBe(5)
    })

    it('should return updated goals', () => {
      const { updateGoalPreferences, getDailyGoals } = useUserProfileStore.getState()
      updateGoalPreferences({
        dailyXPGoal: 200,
        dailyLessonsGoal: 10,
        weeklyHoursGoal: 15,
      })

      const goals = getDailyGoals()
      expect(goals.dailyXPGoal).toBe(200)
      expect(goals.dailyLessonsGoal).toBe(10)
      expect(goals.weeklyHoursGoal).toBe(15)
    })
  })

  describe('reset', () => {
    it('should reset store to initial state', () => {
      useUserProfileStore.setState({
        profile: mockProfile,
        preferences: {
          ...defaultPreferences,
          notifications: {
            ...defaultPreferences.notifications,
            dailyReminders: false,
          },
        },
        isLoading: true,
        isSyncing: true,
        lastSyncedAt: '2026-02-02T10:00:00Z',
      })

      const { reset } = useUserProfileStore.getState()
      reset()

      const state = useUserProfileStore.getState()
      expect(state.profile).toBeNull()
      expect(state.preferences).toEqual(defaultPreferences)
      expect(state.isLoading).toBe(false)
      expect(state.isSyncing).toBe(false)
      expect(state.lastSyncedAt).toBeNull()
    })
  })

  describe('getArchetypeRecommendations helper', () => {
    it('should return empty recommendations for null archetype', () => {
      const recommendations = getArchetypeRecommendations(null)

      expect(recommendations.preferredContent).toEqual([])
      expect(recommendations.motivators).toEqual([])
      expect(recommendations.challenges).toEqual([])
    })

    it('should return achiever recommendations', () => {
      const recommendations = getArchetypeRecommendations('achiever')

      expect(recommendations.preferredContent).toContain('Certification paths')
      expect(recommendations.motivators).toContain('Badges')
      expect(recommendations.challenges.length).toBeGreaterThan(0)
    })

    it('should return explorer recommendations', () => {
      const recommendations = getArchetypeRecommendations('explorer')

      expect(recommendations.preferredContent).toContain('Diverse topics')
      expect(recommendations.motivators).toContain('New content')
    })

    it('should return socializer recommendations', () => {
      const recommendations = getArchetypeRecommendations('socializer')

      expect(recommendations.preferredContent).toContain('Group learning')
      expect(recommendations.motivators).toContain('Leaderboards')
    })

    it('should return competitor recommendations', () => {
      const recommendations = getArchetypeRecommendations('competitor')

      expect(recommendations.preferredContent).toContain('Leaderboards')
      expect(recommendations.motivators).toContain('Rankings')
    })

    it('should return self-improver recommendations', () => {
      const recommendations = getArchetypeRecommendations('self-improver')

      expect(recommendations.preferredContent).toContain('Personal progress')
      expect(recommendations.motivators).toContain('Personal bests')
    })

    it('should return empty recommendations for unknown archetype', () => {
      const recommendations = getArchetypeRecommendations('unknown-type')

      expect(recommendations.preferredContent).toEqual([])
      expect(recommendations.motivators).toEqual([])
      expect(recommendations.challenges).toEqual([])
    })
  })

  describe('edge cases', () => {
    it('should handle empty string for reminder time', () => {
      const { updateNotificationPreferences } = useUserProfileStore.getState()
      updateNotificationPreferences({ reminderTime: '' })

      const state = useUserProfileStore.getState()
      expect(state.preferences.notifications.reminderTime).toBe('')
    })

    it('should handle zero values for goals', () => {
      const { updateGoalPreferences } = useUserProfileStore.getState()
      updateGoalPreferences({
        dailyXPGoal: 0,
        dailyLessonsGoal: 0,
        weeklyHoursGoal: 0,
      })

      const state = useUserProfileStore.getState()
      expect(state.preferences.goals.dailyXPGoal).toBe(0)
      expect(state.preferences.goals.dailyLessonsGoal).toBe(0)
      expect(state.preferences.goals.weeklyHoursGoal).toBe(0)
    })

    it('should handle very large goal values', () => {
      const { updateGoalPreferences } = useUserProfileStore.getState()
      updateGoalPreferences({
        dailyXPGoal: 10000,
        dailyLessonsGoal: 100,
        weeklyHoursGoal: 168, // Maximum hours in a week
      })

      const state = useUserProfileStore.getState()
      expect(state.preferences.goals.dailyXPGoal).toBe(10000)
      expect(state.preferences.goals.dailyLessonsGoal).toBe(100)
      expect(state.preferences.goals.weeklyHoursGoal).toBe(168)
    })

    it('should handle profile with all motivation scores at 0', () => {
      const zeroMotivationProfile: LearnerProfile = {
        ...mockProfile,
        motivationScore: {
          intrinsicMotivation: 0,
          extrinsicMotivation: 0,
          engagementPrediction: 0,
          persistenceScore: 0,
        },
      }

      const { setProfile } = useUserProfileStore.getState()
      setProfile(zeroMotivationProfile)

      const state = useUserProfileStore.getState()
      expect(state.profile?.motivationScore.intrinsicMotivation).toBe(0)
    })

    it('should handle profile with all motivation scores at 1', () => {
      const maxMotivationProfile: LearnerProfile = {
        ...mockProfile,
        motivationScore: {
          intrinsicMotivation: 1,
          extrinsicMotivation: 1,
          engagementPrediction: 1,
          persistenceScore: 1,
        },
      }

      const { setProfile } = useUserProfileStore.getState()
      setProfile(maxMotivationProfile)

      const state = useUserProfileStore.getState()
      expect(state.profile?.motivationScore.intrinsicMotivation).toBe(1)
    })

    it('should handle empty content type preferences', () => {
      const profileWithEmptyPrefs: LearnerProfile = {
        ...mockProfile,
        learningPreferences: {
          ...mockProfile.learningPreferences,
          contentTypePreference: [],
        },
      }

      const { setProfile } = useUserProfileStore.getState()
      setProfile(profileWithEmptyPrefs)

      const state = useUserProfileStore.getState()
      expect(state.profile?.learningPreferences.contentTypePreference).toEqual([])
    })
  })
})
