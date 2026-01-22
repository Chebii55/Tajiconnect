import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import type { LearningPath } from './types';

export const learningPathsApi = {
  // Generate AI learning path
  generatePath: async (userId: string, preferences?: {
    focus_areas?: string[];
    max_duration_weeks?: number;
  }): Promise<LearningPath> => {
    return apiClient.post(API_ENDPOINTS.LEARNING_PATHS.GENERATE(userId), {
      preferences,
      constraints: preferences
    });
  },

  // Get user's learning paths
  getUserPaths: async (userId: string): Promise<LearningPath[]> => {
    return apiClient.get(API_ENDPOINTS.LEARNING_PATHS.GET_USER_PATHS(userId));
  },

  // Get specific learning path
  getPath: async (id: string): Promise<LearningPath> => {
    return apiClient.get(API_ENDPOINTS.LEARNING_PATHS.GET(id));
  },

  // Update learning path
  updatePath: async (id: string, data: Partial<LearningPath>) => {
    return apiClient.put(API_ENDPOINTS.LEARNING_PATHS.UPDATE(id), data);
  },

  // Create adaptation
  createAdaptation: async (pathId: string, data: {
    trigger_type: string;
    adaptation_data: Record<string, any>;
  }) => {
    return apiClient.post(API_ENDPOINTS.LEARNING_PATHS.CREATE_ADAPTATION(pathId), data);
  },
};
