/**
 * API Endpoints Configuration
 * Maps all backend microservice routes for the TajiConnect frontend
 */

const API_VERSION = '/api/v1';

export const API_ENDPOINTS = {
  // ============================================
  // AUTHENTICATION (User Service via Gateway)
  // ============================================
  AUTH: {
    LOGIN: `${API_VERSION}/auth/login`,
    REGISTER: `${API_VERSION}/auth/register`,
    REFRESH: `${API_VERSION}/auth/refresh`,
    LOGOUT: `${API_VERSION}/auth/logout`,
    VERIFY_EMAIL: `${API_VERSION}/auth/verify-email`,
    FORGOT_PASSWORD: `${API_VERSION}/auth/forgot-password`,
    RESET_PASSWORD: `${API_VERSION}/auth/reset-password`,
    CHANGE_PASSWORD: `${API_VERSION}/auth/change-password`,
    GOOGLE_LOGIN: `${API_VERSION}/auth/google/login`,
    GOOGLE_CALLBACK: `${API_VERSION}/auth/google/callback`,
  },

  // ============================================
  // USER MANAGEMENT (User Service)
  // ============================================
  USERS: {
    ME: `${API_VERSION}/users/me`,
    PROFILE: `${API_VERSION}/users/me/profile`,
    ME_ACHIEVEMENTS: `${API_VERSION}/users/me/achievements`,
    BY_ID: (userId: string) => `${API_VERSION}/users/${userId}`,
    USER_PROFILE: (userId: string) => `${API_VERSION}/users/${userId}/profile`,
    LIST: `${API_VERSION}/users`,
    COURSES: (userId: string) => `${API_VERSION}/users/${userId}/courses`,
    COURSE: (userId: string, courseId: string) => `${API_VERSION}/users/${userId}/courses/${courseId}`,
    GOALS: (userId: string) => `${API_VERSION}/users/${userId}/goals`,
    GOAL: (userId: string, goalId: string) => `${API_VERSION}/users/${userId}/goals/${goalId}`,
    ACHIEVEMENTS: (userId: string) => `${API_VERSION}/users/${userId}/achievements`,
    ACHIEVEMENT: (userId: string, achievementId: string) =>
      `${API_VERSION}/users/${userId}/achievements/${achievementId}`,
  },

  // ============================================
  // ACHIEVEMENTS (Catalog)
  // ============================================
  ACHIEVEMENTS: {
    LIST: `${API_VERSION}/achievements`,
    BY_ID: (achievementId: string) => `${API_VERSION}/achievements/${achievementId}`,
  },

  // ============================================
  // ONBOARDING (User Service)
  // ============================================
  ONBOARDING: {
    FLOW: `${API_VERSION}/onboarding/flow`,
    STATUS: `${API_VERSION}/onboarding/status`,
    COMPLETE_STEP: `${API_VERSION}/onboarding/step/complete`,
    PROFILE_SETUP: `${API_VERSION}/onboarding/profile-setup`,
    LEARNING_GOALS: `${API_VERSION}/onboarding/learning-goals`,
    PREFERENCES: `${API_VERSION}/onboarding/preferences`,
    NEXT_STEPS: `${API_VERSION}/onboarding/next-steps`,
    SKIP_STEP: `${API_VERSION}/onboarding/skip-step`,
  },

  // ============================================
  // ADMIN (User Service)
  // ============================================
  ADMIN: {
    STATS: `${API_VERSION}/admin/stats`,
    CHANGE_ROLE: (userId: string) => `${API_VERSION}/admin/${userId}/role`,
    CHANGE_STATUS: (userId: string) => `${API_VERSION}/admin/${userId}/status`,
    UPDATE_SUBSCRIPTION: (userId: string) => `${API_VERSION}/admin/${userId}/subscription`,
    RECENT_REGISTRATIONS: `${API_VERSION}/admin/recent-registrations`,
    SEARCH: `${API_VERSION}/admin/search`,
  },

  // ============================================
  // COURSES (Course Service)
  // ============================================
  COURSES: {
    LIST: `${API_VERSION}/courses`,
    BY_ID: (courseId: string) => `${API_VERSION}/courses/${courseId}`,
    CREATE: `${API_VERSION}/courses`,
    UPDATE: (courseId: string) => `${API_VERSION}/courses/${courseId}`,
    DELETE: (courseId: string) => `${API_VERSION}/courses/${courseId}`,
  },

  // ============================================
  // GRADES (Course Service)
  // ============================================
  GRADES: {
    LIST: `${API_VERSION}/grades`,
    BY_ID: (gradeId: string) => `${API_VERSION}/grades/${gradeId}`,
    CREATE: `${API_VERSION}/grades`,
    UPDATE: (gradeId: string) => `${API_VERSION}/grades/${gradeId}`,
    DELETE: (gradeId: string) => `${API_VERSION}/grades/${gradeId}`,
    ADD_SUBJECT: (gradeId: string) => `${API_VERSION}/grades/${gradeId}/subjects`,
    GET_SUBJECTS: (gradeId: string) => `${API_VERSION}/grades/${gradeId}/subjects`,
    REMOVE_SUBJECT: (gradeId: string, subjectId: string) =>
      `${API_VERSION}/grades/${gradeId}/subjects/${subjectId}`,
  },

  // ============================================
  // SUBJECTS (Course Service)
  // ============================================
  SUBJECTS: {
    LIST: `${API_VERSION}/subjects`,
    BY_ID: (subjectId: string) => `${API_VERSION}/subjects/${subjectId}`,
    CREATE: `${API_VERSION}/subjects`,
    UPDATE: (subjectId: string) => `${API_VERSION}/subjects/${subjectId}`,
    DELETE: (subjectId: string) => `${API_VERSION}/subjects/${subjectId}`,
  },

  // ============================================
  // CONTENT (Content Service)
  // ============================================
  CONTENT: {
    LIST: `${API_VERSION}/content`,
    BY_ID: (contentId: string) => `${API_VERSION}/content/${contentId}`,
    CREATE: `${API_VERSION}/content`,
    UPLOAD: `${API_VERSION}/content/upload`,
    UPDATE: (contentId: string) => `${API_VERSION}/content/${contentId}`,
    DELETE: (contentId: string) => `${API_VERSION}/content/${contentId}`,
    STREAM: (contentId: string) => `${API_VERSION}/content/${contentId}/stream`,
  },

  // ============================================
  // NOTIFICATIONS (Notification Service)
  // ============================================
  NOTIFICATIONS: {
    LIST: `${API_VERSION}/notifications`,
    SEND: `${API_VERSION}/notifications/send`,
    MARK_READ: `${API_VERSION}/notifications/mark-read`,
    MARK_ALL_READ: `${API_VERSION}/notifications/mark-all-read`,
    DELETE: (notificationId: string) => `${API_VERSION}/notifications/${notificationId}`,
    SEND_EMAIL: `${API_VERSION}/notifications/email`,
    SEND_SMS: `${API_VERSION}/notifications/sms`,
    PREFERENCES: `${API_VERSION}/notifications/preferences`,
    HEALTH: `${API_VERSION}/notifications/health`,
  },

  // ============================================
  // PAYMENTS (Payment Service)
  // ============================================
  PAYMENTS: {
    CREATE: `${API_VERSION}/payments/create`,
    BY_ID: (paymentId: string) => `${API_VERSION}/payments/${paymentId}`,
    LIST: `${API_VERSION}/payments`,
    CONFIRM: (paymentId: string) => `${API_VERSION}/payments/${paymentId}/confirm`,
    // M-Pesa specific
    MPESA_B2C: `${API_VERSION}/payments/mpesa/b2c`,
    MPESA_B2C_STATUS: (transferId: string) => `${API_VERSION}/payments/mpesa/b2c/${transferId}`,
    MPESA_CALLBACK: `${API_VERSION}/payments/mpesa/callback`,
    // Webhooks
    PAYPAL_WEBHOOK: `${API_VERSION}/webhooks/paypal`,
  },

  // ============================================
  // SUBSCRIPTIONS (Payment Service)
  // ============================================
  SUBSCRIPTIONS: {
    CREATE: `${API_VERSION}/subscriptions`,
    LIST: `${API_VERSION}/subscriptions`,
    BY_ID: (subscriptionId: string) => `${API_VERSION}/subscriptions/${subscriptionId}`,
  },

  // ============================================
  // AI SERVICES (AI Service)
  // ============================================
  AI: {
    // Recommendations
    RECOMMENDATIONS: {
      COURSES: `${API_VERSION}/ai/recommendations/courses`,
      BEHAVIOR: `${API_VERSION}/ai/recommendations/behavior`,
      TRENDING: `${API_VERSION}/ai/recommendations/trending`,
      SIMILAR: (courseId: string) => `${API_VERSION}/ai/recommendations/similar/${courseId}`,
    },
    // Content Analysis
    ANALYZE_CONTENT: `${API_VERSION}/ai/analyze-content`,
    PLAGIARISM_CHECK: `${API_VERSION}/ai/analyze-content/plagiarism`,
    // Tutoring & Chat
    CHAT: `${API_VERSION}/ai/chat`,
    CHAT_MESSAGE: `${API_VERSION}/ai/chat/message`,
    CHAT_HISTORY: (conversationId: string) => `${API_VERSION}/ai/chat/history/${conversationId}`,
    LEARNING_PATH_GENERATE: `${API_VERSION}/ai/tutoring/learning-path`,
    // Assessments
    GENERATE_QUIZ: `${API_VERSION}/ai/generate-quiz`,
    GENERATE_ASSESSMENT: `${API_VERSION}/ai/assessment/generate`,
    // Psychometric
    PSYCHOMETRIC_ASSESSMENT: `${API_VERSION}/ai/psychometric/assessments`,
    // Learning Paths
    LEARNING_PATHS: `${API_VERSION}/ai/learning-paths`,
    // Skills
    SKILLS_TRACK: (userId: string, skillId: string) =>
      `${API_VERSION}/ai/skills/users/${userId}/skills/${skillId}/upsert`,
    // Analytics
    ANALYTICS_PROGRESS: `${API_VERSION}/ai/analytics/progress`,
  },

  // ============================================
  // PSYCHOMETRIC (AI Service)
  // ============================================
  PSYCHOMETRIC: {
    CREATE_ASSESSMENT: `${API_VERSION}/ai/psychometric/assessments`,
    GET_ASSESSMENT: (id: string) => `${API_VERSION}/ai/psychometric/assessments/${id}`,
    GET_USER_ASSESSMENTS: (userId: string) => `${API_VERSION}/ai/psychometric/users/${userId}/assessments`,
    GET_LATEST: (userId: string) => `${API_VERSION}/ai/psychometric/users/${userId}/assessments/latest`,
    UPDATE_ASSESSMENT: (id: string) => `${API_VERSION}/ai/psychometric/assessments/${id}`,
  },

  // ============================================
  // LEARNING PATHS (AI Service)
  // ============================================
  LEARNING_PATHS: {
    CREATE: `${API_VERSION}/ai/learning-paths`,
    GET: (id: string) => `${API_VERSION}/ai/learning-paths/${id}`,
    UPDATE: (id: string) => `${API_VERSION}/ai/learning-paths/${id}`,
    GET_USER_PATHS: (userId: string) => `${API_VERSION}/ai/learning-paths/users/${userId}/paths`,
    GET_ACTIVE_PATH: (userId: string) => `${API_VERSION}/ai/learning-paths/users/${userId}/active`,
    GET_MODULES: (pathId: string) => `${API_VERSION}/ai/learning-paths/${pathId}/modules`,
    GET_CURRENT_MODULE: (pathId: string) => `${API_VERSION}/ai/learning-paths/${pathId}/modules/current`,
    UPDATE_MODULE: (moduleId: string) => `${API_VERSION}/ai/learning-paths/modules/${moduleId}`,
    CREATE_ADAPTATION: (id: string) => `${API_VERSION}/ai/learning-paths/${id}/adaptations`,
  },

  // ============================================
  // SKILLS ASSESSMENT (AI Service)
  // ============================================
  SKILLS: {
    TAXONOMY: `${API_VERSION}/ai/skills/taxonomy`,
    CREATE_ASSESSMENT: `${API_VERSION}/ai/skills/assessments`,
    GET_ASSESSMENT: (id: string) => `${API_VERSION}/ai/skills/assessments/${id}`,
    GET_USER_ASSESSMENTS: (userId: string) => `${API_VERSION}/ai/skills/users/${userId}/assessments`,
    UPSERT_ASSESSMENT: (userId: string, skillId: string) =>
      `${API_VERSION}/ai/skills/users/${userId}/skills/${skillId}/upsert`,
  },

  // ============================================
  // ANALYTICS (Analytics Service)
  // ============================================
  ANALYTICS: {
    EVENTS: `${API_VERSION}/analytics/events`,
    DASHBOARD: `${API_VERSION}/analytics/dashboard`,
    USERS: `${API_VERSION}/analytics/users`,
    COURSES: `${API_VERSION}/analytics/courses`,
    REPORTS: (reportType: string) => `${API_VERSION}/analytics/reports/${reportType}`,
    USER_PROGRESS_SUMMARY: (userId: string) => `${API_VERSION}/analytics/users/${userId}/progress-summary`,
    USER_TIME_SERIES: (userId: string) => `${API_VERSION}/analytics/users/${userId}/time-series`,
    // Legacy endpoints for frontend compatibility
    LOG_INTERACTION: `${API_VERSION}/analytics/interactions`,
    GET_PREDICTIONS: (userId: string) => `${API_VERSION}/analytics/predictions/${userId}`,
    GET_RECOMMENDATIONS: `${API_VERSION}/analytics/recommendations`,
    GET_PERFORMANCE: (userId: string) => `${API_VERSION}/analytics/performance/${userId}`,
    SUBMIT_FEEDBACK: `${API_VERSION}/analytics/feedback`,
  },

  // ============================================
  // GATEWAY
  // ============================================
  GATEWAY: {
    SERVICES: `${API_VERSION}/gateway/services`,
    HEALTH: `${API_VERSION}/gateway/health`,
  },
} as const;

// Export individual endpoint groups for convenience
export const {
  AUTH,
  USERS,
  ONBOARDING,
  ADMIN,
  COURSES,
  GRADES,
  SUBJECTS,
  CONTENT,
  NOTIFICATIONS,
  PAYMENTS,
  SUBSCRIPTIONS,
  AI,
  PSYCHOMETRIC,
  LEARNING_PATHS,
  SKILLS,
  ANALYTICS,
  GATEWAY,
} = API_ENDPOINTS;

export default API_ENDPOINTS;
