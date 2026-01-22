// Backend API Types - Aligned with AI Service Schemas

export type LearnerArchetype = 'structured_learner' | 'cultural_explorer' | 'casual_learner' | 'conversational_learner';
export type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type ContentType = 'lesson' | 'practice' | 'assessment' | 'game';
export type RecommendationType = 'next_lesson' | 'remedial_content' | 'challenge_content';

export interface UserProfile {
  user_id: string;
  learner_archetype: LearnerArchetype;
  learning_preferences: {
    primary_style: LearningStyle;
    content_format_preferences: string[];
    difficulty_preference: string;
  };
  motivation_score: {
    intrinsic_motivation: number;
    extrinsic_motivation: number;
    engagement_prediction: number;
    persistence_score: number;
  };
  skill_gaps: SkillGap[];
}

export interface SkillGap {
  skill_name: string;
  current_level: number;
  target_level: number;
  priority: number;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  estimated_duration_weeks: number;
  difficulty_level: DifficultyLevel;
  modules: LearningModule[];
}

export interface LearningModule {
  id: string;
  title: string;
  order_index: number;
  estimated_duration_hours: number;
  difficulty_score: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content_type: ContentType;
  estimated_duration_minutes: number;
}

export interface ContentRecommendation {
  content_id: string;
  content_type: ContentType;
  recommendation_type: RecommendationType;
  relevance_score: number;
  engagement_prediction: number;
  reasoning: {
    explanation: string;
    primary_factors: string[];
  };
}

export interface PerformanceMetrics {
  user_id: string;
  overall_health_score: number;
  performance_metrics: {
    success_rate: number;
    engagement_score: number;
    completion_rate: number;
    performance_trend: 'improving' | 'stable' | 'declining';
  };
  adaptation_needs: AdaptationNeed[];
}

export interface AdaptationNeed {
  type: string;
  severity: number;
  recommended_actions: string[];
}

export interface PsychometricResponse {
  question_id: number;
  response_value: number;
  response_time_ms?: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}
