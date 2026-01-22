import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import type { SkillGap } from './types';

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

  // Analyze user skills with AI
  analyzeSkills: async (userId: string) => {
    return apiClient.post(API_ENDPOINTS.SKILLS.ANALYZE(userId));
  },

  // Get skill gaps
  getSkillGaps: async (userId: string): Promise<SkillGap[]> => {
    return apiClient.get(API_ENDPOINTS.SKILLS.GET_GAPS(userId));
  },

  // Get skill recommendations
  getRecommendations: async (userId: string) => {
    return apiClient.post(API_ENDPOINTS.SKILLS.GET_RECOMMENDATIONS(userId));
  },
};
