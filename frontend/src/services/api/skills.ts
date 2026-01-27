import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

export const skillsApi = {
  // Create skill assessment
  createAssessment: async (data: {
    user_id: string;
    skill_code: string;
    assessment_data: Record<string, any>;
  }) => {
    return apiClient.post(API_ENDPOINTS.SKILLS.CREATE_ASSESSMENT, data);
  },

  // Get skill assessment
  getAssessment: async (id: string) => {
    return apiClient.get(API_ENDPOINTS.SKILLS.GET_ASSESSMENT(id));
  },

  // Get assessments for a user
  getUserAssessments: async (userId: string) => {
    return apiClient.get(API_ENDPOINTS.SKILLS.GET_USER_ASSESSMENTS(userId));
  },
};
