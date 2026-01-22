import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import type { UserProfile, PsychometricResponse } from './types';

export const psychometricApi = {
  // Create psychometric assessment
  createAssessment: async (data: { user_id: string; assessment_type?: string }) => {
    return apiClient.post(API_ENDPOINTS.PSYCHOMETRIC.CREATE_ASSESSMENT, data);
  },

  // Get assessment by ID
  getAssessment: async (id: string) => {
    return apiClient.get(API_ENDPOINTS.PSYCHOMETRIC.GET_ASSESSMENT(id));
  },

  // Submit psychometric responses
  submitResponses: async (data: { 
    assessment_id: string; 
    responses: PsychometricResponse[] 
  }) => {
    return apiClient.post(API_ENDPOINTS.PSYCHOMETRIC.SUBMIT_RESPONSES, data);
  },

  // Get user results
  getResults: async (userId: string) => {
    return apiClient.get(API_ENDPOINTS.PSYCHOMETRIC.GET_RESULTS(userId));
  },

  // Trigger AI analysis
  analyzeUser: async (userId: string): Promise<UserProfile> => {
    return apiClient.post(API_ENDPOINTS.PSYCHOMETRIC.ANALYZE(userId));
  },
};
