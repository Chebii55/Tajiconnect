/**
 * Learning Paths API Service
 * Handles learning path generation and management
 */

import { apiClient } from './client';
import { LEARNING_PATHS, AI } from './endpoints';
import type { GeneratedLearningPath, LearningPath, LearningPathModule } from './types';

export interface GeneratePathPreferences {
  focus_areas?: string[];
  max_duration_weeks?: number;
  skill_level?: 'beginner' | 'intermediate' | 'advanced';
  available_hours_per_week?: number;
}

export interface AdaptationData {
  trigger_type: string;
  adaptation_data: Record<string, unknown>;
}

export const learningPathsApi = {
  /**
   * Generate AI learning path for a user
   */
  generatePath: async (
    userId: string,
    preferences?: GeneratePathPreferences
  ): Promise<GeneratedLearningPath> => {
    const goal =
      preferences?.focus_areas && preferences.focus_areas.length > 0
        ? `Focus on ${preferences.focus_areas.join(', ')}`
        : 'Personalized learning path';

    return apiClient.post<GeneratedLearningPath>(AI.LEARNING_PATH_GENERATE, {
      user_id: userId,
      goal,
      current_skill_level: preferences?.skill_level,
      available_time_hours_per_week: preferences?.available_hours_per_week,
      target_completion_weeks: preferences?.max_duration_weeks,
      preferred_topics: preferences?.focus_areas,
    });
  },

  /**
   * Generate learning path via AI service (alternative)
   */
  generateWithAI: async (
    userId: string,
    goal: string,
    options?: {
      skill_level?: 'beginner' | 'intermediate' | 'advanced';
      available_hours_per_week?: number;
    }
  ): Promise<GeneratedLearningPath> => {
    return apiClient.post<GeneratedLearningPath>(AI.LEARNING_PATH_GENERATE, {
      user_id: userId,
      goal,
      current_skill_level: options?.skill_level,
      available_time_hours_per_week: options?.available_hours_per_week,
    });
  },

  /**
   * Get all learning paths for a user
   */
  getUserPaths: async (userId: string): Promise<LearningPath[]> => {
    return apiClient.get<LearningPath[]>(LEARNING_PATHS.GET_USER_PATHS(userId));
  },

  /**
   * Get the active learning path for a user
   */
  getActivePath: async (userId: string): Promise<LearningPath> => {
    return apiClient.get<LearningPath>(LEARNING_PATHS.GET_ACTIVE_PATH(userId));
  },

  /**
   * Get a specific learning path by ID
   */
  getPath: async (id: string): Promise<LearningPath> => {
    return apiClient.get<LearningPath>(LEARNING_PATHS.GET(id));
  },

  /**
   * Get modules for a learning path
   */
  getPathModules: async (pathId: string): Promise<LearningPathModule[]> => {
    return apiClient.get<LearningPathModule[]>(LEARNING_PATHS.GET_MODULES(pathId));
  },

  /**
   * Update a learning path
   */
  updatePath: async (id: string, data: Partial<LearningPath>): Promise<LearningPath> => {
    return apiClient.put<LearningPath>(LEARNING_PATHS.UPDATE(id), data);
  },

  /**
   * Update a learning path module
   */
  updateModule: async (moduleId: string, data: Partial<LearningPathModule>): Promise<LearningPathModule> => {
    return apiClient.put<LearningPathModule>(LEARNING_PATHS.UPDATE_MODULE(moduleId), data);
  },

  /**
   * Create an adaptation for a learning path
   */
  createAdaptation: async (pathId: string, data: AdaptationData): Promise<void> => {
    await apiClient.post(LEARNING_PATHS.CREATE_ADAPTATION(pathId), data);
  },

  /**
   * Create a new learning path
   */
  createPath: async (data: Partial<LearningPath>): Promise<LearningPath> => {
    return apiClient.post<LearningPath>(LEARNING_PATHS.CREATE, data);
  },
};

export default learningPathsApi;
