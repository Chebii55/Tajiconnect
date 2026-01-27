/**
 * AI Service
 * Handles all AI-related API calls including recommendations,
 * learning paths, assessments, chat, and psychometric analysis
 */

import { apiClient } from './client';
import { AI, ANALYTICS } from './endpoints';

// ============================================
// TYPE DEFINITIONS - RECOMMENDATIONS
// ============================================

export interface CourseRecommendation {
  course_id: string;
  score: number;
  rank: number;
  explanation?: string;
  algorithm?: string;
  metadata?: Record<string, unknown>;
}

export interface RecommendationRequest {
  user_id: string;
  limit?: number;
  exclude_enrolled?: boolean;
  categories?: string[];
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  algorithm?: 'collaborative' | 'content-based' | 'hybrid';
}

export interface BehaviorTrackRequest {
  user_id: string;
  course_id: string;
  action_type: 'view' | 'enroll' | 'complete' | 'rate' | 'bookmark' | 'share';
  action_value?: number;
  metadata?: Record<string, unknown>;
}

export interface TrendingRequest {
  limit?: number;
  time_window_days?: number;
}

export interface TrendingCourse {
  course_id: string;
  trend_score: number;
  view_count: number;
  enrollment_count: number;
  completion_count: number;
  rating_avg?: number | null;
  growth_rate: number;
}

export interface TrendingCoursesResponse {
  trending_courses: TrendingCourse[];
  time_window_days: number;
  total_count: number;
  generated_at?: string;
}

// ============================================
// TYPE DEFINITIONS - LEARNING PATHS
// ============================================

export interface AILearningPath {
  id: string;
  user_id: string;
  title: string;
  goal: string;
  skill_level: 'beginner' | 'intermediate' | 'advanced';
  courses: CourseRecommendation[];
  estimated_duration_hours: number;
  created_at: string;
  updated_at?: string;
}

export interface GenerateLearningPathRequest {
  user_id: string;
  goal: string;
  skill_level?: 'beginner' | 'intermediate' | 'advanced';
  available_hours_per_week?: number;
  target_completion_date?: string;
  interests?: string[];
  exclude_courses?: string[];
}

// ============================================
// TYPE DEFINITIONS - ASSESSMENTS
// ============================================

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation?: string;
  topic?: string;
}

export interface GenerateQuizRequest {
  topic: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'mixed';
  count?: number;
  course_id?: string;
}

export interface AssessmentResult {
  score: number;
  total_questions: number;
  correct_answers: number;
  time_taken_seconds: number;
  feedback: string;
  recommendations?: string[];
}

// ============================================
// TYPE DEFINITIONS - CHAT/TUTORING
// ============================================

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
  context?: {
    course_id?: string;
    topic?: string;
    user_level?: string;
  };
}

export interface ChatResponse {
  response: string;
  conversation_id: string;
  suggestions?: string[];
  related_content?: CourseRecommendation[];
}

// ============================================
// TYPE DEFINITIONS - PSYCHOMETRIC
// ============================================

export interface PsychometricAnswer {
  question_id: string | number;
  answer_value: number;
  response_time_ms?: number;
}

export interface PsychometricRequest {
  user_id: string;
  answers: PsychometricAnswer[];
  assessment_type?: string;
}

export interface PsychometricResult {
  id: string;
  user_id: string;
  learning_style: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  learner_archetype: 'structured_learner' | 'cultural_explorer' | 'casual_learner' | 'conversational_learner';
  aptitude: string;
  score: number;
  personality_traits?: Record<string, number>;
  strengths?: string[];
  areas_for_improvement?: string[];
  recommended_learning_approach?: string;
  results: Record<string, unknown>;
  created_at: string;
}

// ============================================
// TYPE DEFINITIONS - SKILLS & ANALYTICS
// ============================================

export interface SkillProgress {
  skill_id: string;
  skill_name: string;
  current_level: number;
  target_level: number;
  progress_percentage: number;
}

export interface ProgressAnalytics {
  user_id: string;
  overall_progress: number;
  courses_in_progress: number;
  courses_completed: number;
  total_hours_learned: number;
  current_streak: number;
  skills: SkillProgress[];
  recent_activity: ActivityItem[];
  performance_trend: 'improving' | 'stable' | 'declining';
}

export interface ActivityItem {
  type: string;
  title: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// ============================================
// AI SERVICE CLASS
// ============================================

class AIService {
  // ============================================
  // RECOMMENDATIONS
  // ============================================

  /**
   * Get personalized course recommendations
   */
  async getCourseRecommendations(request: RecommendationRequest): Promise<CourseRecommendation[]> {
    const response = await apiClient.post<{
      recommendations: CourseRecommendation[];
    }>(AI.RECOMMENDATIONS.COURSES, request);
    return response.recommendations || [];
  }

  /**
   * Track user behavior for better recommendations
   */
  async trackBehavior(request: BehaviorTrackRequest): Promise<{ success: boolean }> {
    await apiClient.post(AI.RECOMMENDATIONS.BEHAVIOR, request);
    return { success: true };
  }

  /**
   * Get trending courses
   */
  async getTrendingCourses(limit = 10, timeWindowDays = 7): Promise<TrendingCoursesResponse> {
    return apiClient.post<TrendingCoursesResponse>(
      AI.RECOMMENDATIONS.TRENDING,
      { limit, time_window_days: timeWindowDays }
    );
  }

  /**
   * Get similar courses
   */
  async getSimilarCourses(courseId: string): Promise<CourseRecommendation[]> {
    const response = await apiClient.get<{ similar_courses: CourseRecommendation[] }>(
      AI.RECOMMENDATIONS.SIMILAR(courseId)
    );
    return response.similar_courses || [];
  }

  // ============================================
  // LEARNING PATHS
  // ============================================

  /**
   * Generate a personalized learning path
   */
  async generateLearningPath(request: GenerateLearningPathRequest): Promise<AILearningPath> {
    return apiClient.post<AILearningPath>(
      AI.LEARNING_PATH_GENERATE,
      request
    );
  }

  /**
   * Get all learning paths for a user
   */
  async getLearningPaths(userId: string): Promise<AILearningPath[]> {
    return apiClient.get<AILearningPath[]>(AI.LEARNING_PATHS, { user_id: userId });
  }

  // ============================================
  // ASSESSMENTS
  // ============================================

  /**
   * Generate a quiz on a topic
   */
  async generateQuiz(request: GenerateQuizRequest): Promise<QuizQuestion[]> {
    return apiClient.post<QuizQuestion[]>(AI.GENERATE_QUIZ, request);
  }

  /**
   * Generate a full assessment
   */
  async generateAssessment(
    topic: string,
    options?: { difficulty?: string; question_count?: number }
  ): Promise<{ questions: QuizQuestion[]; time_limit_minutes: number }> {
    return apiClient.post(AI.GENERATE_ASSESSMENT, {
      topic,
      ...options,
    });
  }

  // ============================================
  // CHAT / TUTORING
  // ============================================

  /**
   * Send a message to the AI tutor
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    return apiClient.post<ChatResponse>(AI.CHAT, request);
  }

  /**
   * Send a chat message (alternative endpoint)
   */
  async sendMessage(
    message: string,
    conversationId?: string,
    context?: Record<string, unknown>
  ): Promise<ChatResponse> {
    return apiClient.post<ChatResponse>(AI.CHAT_MESSAGE, {
      message,
      conversation_id: conversationId,
      context,
    });
  }

  /**
   * Get chat history for a conversation
   */
  async getChatHistory(conversationId: string): Promise<ChatMessage[]> {
    return apiClient.get<ChatMessage[]>(AI.CHAT_HISTORY(conversationId));
  }

  // ============================================
  // PSYCHOMETRIC ASSESSMENT
  // ============================================

  /**
   * Submit psychometric assessment answers
   */
  async submitPsychometricAssessment(request: PsychometricRequest): Promise<PsychometricResult> {
    return apiClient.post<PsychometricResult>(
      AI.PSYCHOMETRIC_ASSESSMENT,
      request
    );
  }

  // ============================================
  // SKILLS & PROGRESS TRACKING
  // ============================================

  /**
   * Track skill progress
   */
  async trackSkill(
    userId: string,
    skillId: string,
    progress: number
  ): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>(AI.SKILLS_TRACK(userId, skillId), {
      current_level: progress,
      target_level: progress,
    });
  }

  /**
   * Get progress analytics
   */
  async getProgressAnalytics(userId: string): Promise<ProgressAnalytics> {
    return apiClient.get<ProgressAnalytics>(AI.ANALYTICS_PROGRESS, { user_id: userId });
  }

  // ============================================
  // CONTENT ANALYSIS
  // ============================================

  /**
   * Analyze content
   */
  async analyzeContent(contentId: string): Promise<{
    summary: string;
    keywords: string[];
    difficulty_score: number;
    estimated_reading_time: number;
  }> {
    return apiClient.post(AI.ANALYZE_CONTENT, { content_id: contentId });
  }

  /**
   * Check for plagiarism
   */
  async checkPlagiarism(text: string): Promise<{
    is_plagiarized: boolean;
    similarity_score: number;
    matches: Array<{ source: string; similarity: number }>;
  }> {
    return apiClient.post(AI.PLAGIARISM_CHECK, { text });
  }

  // ============================================
  // ANALYTICS SERVICE INTEGRATION
  // ============================================

  /**
   * Log an interaction for analytics
   */
  async logInteraction(
    userId: string,
    eventType: string,
    eventData: Record<string, unknown>
  ): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>(ANALYTICS.LOG_INTERACTION, {
      user_id: userId,
      event_type: eventType,
      event_data: eventData,
    });
  }

  /**
   * Get predictions for a user
   */
  async getPredictions(userId: string): Promise<{
    completion_probability: number;
    recommended_actions: string[];
    risk_factors: string[];
  }> {
    return apiClient.get(ANALYTICS.GET_PREDICTIONS(userId));
  }

  /**
   * Get analytics recommendations
   */
  async getAnalyticsRecommendations(): Promise<CourseRecommendation[]> {
    return apiClient.get<CourseRecommendation[]>(ANALYTICS.GET_RECOMMENDATIONS);
  }

  /**
   * Get performance metrics
   */
  async getPerformance(userId: string): Promise<{
    overall_score: number;
    trend: 'improving' | 'stable' | 'declining';
    metrics: Record<string, number>;
  }> {
    return apiClient.get(ANALYTICS.GET_PERFORMANCE(userId));
  }

  /**
   * Submit feedback
   */
  async submitFeedback(
    userId: string,
    feedbackType: string,
    feedback: string,
    metadata?: Record<string, unknown>
  ): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>(ANALYTICS.SUBMIT_FEEDBACK, {
      user_id: userId,
      feedback_type: feedbackType,
      feedback,
      metadata,
    });
  }

  /**
   * Log analytics event
   */
  async logEvent(
    userId: string,
    eventType: string,
    eventData?: Record<string, unknown>
  ): Promise<{ success: boolean }> {
    return apiClient.post<{ success: boolean }>(ANALYTICS.EVENTS, {
      user_id: userId,
      event_type: eventType,
      event_data: eventData,
    });
  }

  /**
   * Get analytics dashboard data
   */
  async getDashboard(windowDays = 30): Promise<{
    total_users: number;
    active_users: number;
    course_completions: number;
    average_engagement: number;
    trends: Record<string, number[]>;
  }> {
    return apiClient.get(ANALYTICS.DASHBOARD, { window_days: windowDays });
  }
}

// Export singleton instance
export const aiService = new AIService();
export default aiService;
