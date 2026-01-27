import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';

export const skillsApi = {
  // Get skills taxonomy (with optional query params)
  getTaxonomy: async (params?: Record<string, string | number | boolean>) => {
    return apiClient.get(API_ENDPOINTS.SKILLS.TAXONOMY, { params });
  },

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

  // Upsert a user skill assessment
  upsertAssessment: async (
    userId: string,
    skillId: string,
    data: {
      user_id: string;
      skill_id: string;
      proficiency_level: number;
      confidence_level: number;
      assessment_method: string;
      assessment_source?: string;
      evidence_data?: Record<string, unknown>;
    }
  ) => {
    return apiClient.post(API_ENDPOINTS.SKILLS.UPSERT_ASSESSMENT(userId, skillId), data);
  },
};
