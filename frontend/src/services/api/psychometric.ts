import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import type { UserProfile } from './types';

export const psychometricApi = {
  createAssessment: async (data: {
    user_id: string;
    assessment_type?: string;
    raw_responses: Record<string, unknown>;
  }) => {
    return apiClient.post(API_ENDPOINTS.PSYCHOMETRIC.CREATE_ASSESSMENT, data);
  },

  getAssessment: async (id: string) => {
    return apiClient.get(API_ENDPOINTS.PSYCHOMETRIC.GET_ASSESSMENT(id));
  },

  getUserAssessments: async (userId: string) => {
    return apiClient.get(API_ENDPOINTS.PSYCHOMETRIC.GET_USER_ASSESSMENTS(userId));
  },

  getLatestAssessment: async (userId: string): Promise<UserProfile> => {
    return apiClient.get(API_ENDPOINTS.PSYCHOMETRIC.GET_LATEST(userId));
  },

  updateAssessment: async (id: string, data: Record<string, unknown>) => {
    return apiClient.put(API_ENDPOINTS.PSYCHOMETRIC.UPDATE_ASSESSMENT(id), data);
  },
};
