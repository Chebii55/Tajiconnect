export const API_ENDPOINTS = {
  // Psychometric Assessment
  PSYCHOMETRIC: {
    CREATE_ASSESSMENT: '/api/v1/psychometric/assessments/',
    GET_ASSESSMENT: (id: string) => `/api/v1/psychometric/assessments/${id}`,
    SUBMIT_RESPONSES: '/api/v1/psychometric/responses/',
    GET_RESULTS: (userId: string) => `/api/v1/psychometric/results/${userId}`,
    ANALYZE: (userId: string) => `/api/v1/psychometric/analyze/${userId}`,
  },

  // Learning Paths
  LEARNING_PATHS: {
    CREATE: '/api/v1/learning-paths/',
    GET: (id: string) => `/api/v1/learning-paths/${id}`,
    UPDATE: (id: string) => `/api/v1/learning-paths/${id}`,
    GENERATE: (userId: string) => `/api/v1/learning-paths/generate/${userId}`,
    GET_USER_PATHS: (userId: string) => `/api/v1/learning-paths/user/${userId}`,
    CREATE_ADAPTATION: (id: string) => `/api/v1/learning-paths/${id}/adaptations`,
  },

  // Skills Assessment
  SKILLS: {
    CREATE_ASSESSMENT: '/api/v1/skills/assessments/',
    GET_ASSESSMENT: (id: string) => `/api/v1/skills/assessments/${id}`,
    ANALYZE: (userId: string) => `/api/v1/skills/analyze/${userId}`,
    GET_GAPS: (userId: string) => `/api/v1/skills/gaps/${userId}`,
    GET_RECOMMENDATIONS: (userId: string) => `/api/v1/skills/recommendations/${userId}`,
  },

  // Analytics & AI Tracking
  ANALYTICS: {
    LOG_INTERACTION: '/api/v1/analytics/interactions/',
    GET_PREDICTIONS: (userId: string) => `/api/v1/analytics/predictions/${userId}`,
    GET_RECOMMENDATIONS: '/api/v1/analytics/recommendations/',
    GET_PERFORMANCE: (userId: string) => `/api/v1/analytics/performance/${userId}`,
    SUBMIT_FEEDBACK: '/api/v1/analytics/feedback/',
  },
} as const;
