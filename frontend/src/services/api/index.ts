/**
 * API Services Index
 * Central export for all API services and types
 */

// API Client
export { apiClient } from './client';

// Endpoints
export { API_ENDPOINTS } from './endpoints';
export {
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
} from './endpoints';

// Auth Service
export { authService } from './auth';
export type {
  User,
  UserRole,
  UserStatus,
  SubscriptionTier,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  VerifyEmailResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  MessageResponse,
} from './auth';

// User Service
export { userService } from './user';
export type {
  UserProfile as UserProfileData,
  AccessibilityPreferences,
  NotificationPreferences,
  UpdateUserRequest,
  UpdateProfileRequest,
  PaginatedResponse,
  AdminStats,
  UserSearchParams,
} from './user';

// Onboarding Service
export { onboardingService } from './onboarding';
export type {
  OnboardingStep,
  OnboardingFlow,
  OnboardingStatus,
  ProfileSetupData,
  LearningGoalsData,
  PreferencesData,
  CompleteStepResponse,
  SkipStepResponse,
  NextStepsResponse,
} from './onboarding';

// Course Service
export { courseService } from './courses';
export type {
  Course,
  CourseStatus,
  CreateCourseRequest,
  UpdateCourseRequest,
  Grade,
  Subject,
  CreateGradeRequest,
  CreateSubjectRequest,
  Content,
  ContentType as CourseContentType,
  ContentStatus,
  CreateContentRequest,
  UpdateContentRequest,
  ContentListParams,
} from './courses';

// AI Service
export { aiService } from './ai';
export type {
  CourseRecommendation,
  RecommendationRequest,
  BehaviorTrackRequest,
  TrendingRequest,
  AILearningPath,
  GenerateLearningPathRequest,
  QuizQuestion,
  GenerateQuizRequest,
  AssessmentResult,
  ChatMessage,
  ChatRequest,
  ChatResponse,
  PsychometricAnswer,
  PsychometricRequest,
  PsychometricResult,
  SkillProgress,
  ProgressAnalytics,
  ActivityItem,
} from './ai';

// Gamification Service
export { gamificationService } from './gamification';

// Types
export type {
  LearnerArchetype,
  LearningStyle,
  DifficultyLevel,
  ContentType,
  RecommendationType,
  UserProfile,
  SkillGap,
  LearningPath,
  LearningPathModule,
  GeneratedLearningPath,
  GeneratedLearningPathCourse,
  ContentRecommendation,
  PerformanceMetrics,
  AdaptationNeed,
  PsychometricResponse,
  ApiError,
} from './types';
