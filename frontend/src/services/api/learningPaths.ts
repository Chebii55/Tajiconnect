/**
 * Learning Paths API Service
 * Handles learning path generation and management
 */

import { apiClient } from './client';
import { LEARNING_PATHS, AI } from './endpoints';
import type { LearningPath } from './types';

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
  generatePath: async (userId: string, preferences?: GeneratePathPreferences): Promise<LearningPath> => {
    return apiClient.post<LearningPath>(LEARNING_PATHS.GENERATE(userId), {
      preferences,
      constraints: preferences,
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
  ): Promise<LearningPath> => {
    return apiClient.post<LearningPath>(AI.LEARNING_PATH_GENERATE, {
      user_id: userId,
      goal,
      ...options,
    });
  },

  /**
   * Get all learning paths for a user
   */
  getUserPaths: async (userId: string): Promise<LearningPath[]> => {
    return apiClient.get<LearningPath[]>(LEARNING_PATHS.GET_USER_PATHS(userId));
  },

  /**
   * Get a specific learning path by ID
   */
  getPath: async (id: string): Promise<LearningPath> => {
    return apiClient.get<LearningPath>(LEARNING_PATHS.GET(id));
  },

  /**
   * Update a learning path
   */
  updatePath: async (id: string, data: Partial<LearningPath>): Promise<LearningPath> => {
    return apiClient.put<LearningPath>(LEARNING_PATHS.UPDATE(id), data);
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
