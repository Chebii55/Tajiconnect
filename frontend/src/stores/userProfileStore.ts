/**
 * User Profile Store
 *
 * Zustand store managing learner profile and user preferences.
 * Includes psychometric profile data from onboarding assessment.
 */

import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { eventBus } from '../lib/eventBus'
import type {
  LearnerProfile,
  UserPreferences,
  DEFAULT_USER_PREFERENCES,
} from '../types/gamification'

interface UserProfileState {
  // Profile
  profile: LearnerProfile | null
  preferences: UserPreferences

  // Loading state
  isLoading: boolean
  isSyncing: boolean
  lastSyncedAt: string | null

  // Actions
  setProfile: (profile: LearnerProfile) => void
  updateProfile: (updates: Partial<LearnerProfile>) => void
  updatePreferences: (updates: Partial<UserPreferences>) => void
  updateNotificationPreferences: (updates: Partial<UserPreferences['notifications']>) => void
  updateDisplayPreferences: (updates: Partial<UserPreferences['display']>) => void
  updateGoalPreferences: (updates: Partial<UserPreferences['goals']>) => void

  // Computed getters
  hasCompletedOnboarding: () => boolean
  getArchetype: () => string | null
  getDailyGoals: () => UserPreferences['goals']

  // Sync
  loadFromServer: () => Promise<void>
  persistToServer: () => Promise<void>
  reset: () => void
}

/**
 * Default user preferences
 */
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

export const useUserProfileStore = create<UserProfileState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        /**
         * Set complete learner profile (typically from onboarding)
         */
        setProfile: (profile) => {
          set({
            profile,
            lastSyncedAt: new Date().toISOString(),
          })

          // Emit profile updated event
          eventBus.emit('profile:updated', {
            userId: profile.userId,
            changes: ['archetype', 'learningPreferences', 'motivationScore'],
          })
        },

        /**
         * Update specific profile fields
         */
        updateProfile: (updates) => {
          const state = get()
          if (!state.profile) return

          const updatedProfile = {
            ...state.profile,
            ...updates,
          }

          set({
            profile: updatedProfile,
            lastSyncedAt: new Date().toISOString(),
          })

          // Emit profile updated event
          eventBus.emit('profile:updated', {
            userId: updatedProfile.userId,
            changes: Object.keys(updates),
          })
        },

        /**
         * Update all preferences
         */
        updatePreferences: (updates) => {
          const state = get()
          set({
            preferences: {
              ...state.preferences,
              ...updates,
            },
          })
        },

        /**
         * Update notification preferences
         */
        updateNotificationPreferences: (updates) => {
          const state = get()
          set({
            preferences: {
              ...state.preferences,
              notifications: {
                ...state.preferences.notifications,
                ...updates,
              },
            },
          })
        },

        /**
         * Update display preferences
         */
        updateDisplayPreferences: (updates) => {
          const state = get()
          set({
            preferences: {
              ...state.preferences,
              display: {
                ...state.preferences.display,
                ...updates,
              },
            },
          })
        },

        /**
         * Update goal preferences
         */
        updateGoalPreferences: (updates) => {
          const state = get()
          set({
            preferences: {
              ...state.preferences,
              goals: {
                ...state.preferences.goals,
                ...updates,
              },
            },
          })
        },

        /**
         * Check if user has completed onboarding
         */
        hasCompletedOnboarding: () => {
          const state = get()
          return state.profile !== null && state.profile.archetype !== undefined
        },

        /**
         * Get user's learner archetype
         */
        getArchetype: () => {
          const state = get()
          return state.profile?.archetype ?? null
        },

        /**
         * Get daily goals configuration
         */
        getDailyGoals: () => {
          const state = get()
          return state.preferences.goals
        },

        /**
         * Load profile from server
         */
        loadFromServer: async () => {
          set({ isLoading: true })
          try {
            // TODO: Implement API call to fetch user profile
            // const response = await userService.getProfile()
            // set({ profile: response.profile, preferences: response.preferences, isLoading: false })

            set({ isLoading: false })
          } catch (error) {
            console.error('[UserProfile] Failed to load from server:', error)
            set({ isLoading: false })
          }
        },

        /**
         * Persist profile to server
         */
        persistToServer: async () => {
          const state = get()
          set({ isSyncing: true })
          try {
            const payload = {
              profile: state.profile,
              preferences: state.preferences,
              updatedAt: new Date().toISOString(),
            }

            // TODO: Implement API call to persist user profile
            // await userService.saveProfile(payload)

            console.log('[UserProfile] Profile persisted:', payload)
            set({
              isSyncing: false,
              lastSyncedAt: new Date().toISOString(),
            })
          } catch (error) {
            console.error('[UserProfile] Failed to persist to server:', error)
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
        name: 'tajiconnect-user-profile',
        partialize: (state) => ({
          profile: state.profile,
          preferences: state.preferences,
          lastSyncedAt: state.lastSyncedAt,
        }),
      }
    ),
    { name: 'UserProfileStore' }
  )
)

/**
 * Hook to get archetype-specific recommendations
 */
export function getArchetypeRecommendations(archetype: string | null): {
  preferredContent: string[]
  motivators: string[]
  challenges: string[]
} {
  if (!archetype) {
    return {
      preferredContent: [],
      motivators: [],
      challenges: [],
    }
  }

  const recommendations: Record<string, {
    preferredContent: string[]
    motivators: string[]
    challenges: string[]
  }> = {
    achiever: {
      preferredContent: ['Certification paths', 'Skill assessments', 'Progress trackers'],
      motivators: ['Badges', 'Certificates', 'Completion metrics'],
      challenges: ['May rush through content', 'Focus on completion over learning'],
    },
    explorer: {
      preferredContent: ['Diverse topics', 'Recommended courses', 'Learning paths'],
      motivators: ['New content', 'Variety', 'Discovery features'],
      challenges: ['May not complete courses', 'Scattered focus'],
    },
    socializer: {
      preferredContent: ['Group learning', 'Discussion forums', 'Peer reviews'],
      motivators: ['Leaderboards', 'Team challenges', 'Social recognition'],
      challenges: ['May depend on others', 'Distracted by social features'],
    },
    competitor: {
      preferredContent: ['Leaderboards', 'Challenges', 'Timed quizzes'],
      motivators: ['Rankings', 'Competition', 'Public achievements'],
      challenges: ['May prioritize winning over learning', 'Frustration when losing'],
    },
    'self-improver': {
      preferredContent: ['Personal progress', 'Skill tracking', 'Reflection tools'],
      motivators: ['Personal bests', 'Growth metrics', 'Self-paced learning'],
      challenges: ['May avoid challenges', 'Slow progression'],
    },
  }

  return recommendations[archetype] ?? {
    preferredContent: [],
    motivators: [],
    challenges: [],
  }
}

export default useUserProfileStore
