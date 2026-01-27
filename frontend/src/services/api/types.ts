// Core Types
export type LearnerArchetype = 'structured_learner' | 'cultural_explorer' | 'casual_learner' | 'conversational_learner';
export type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type ContentType = 'lesson' | 'practice' | 'assessment' | 'game';
export type RecommendationType = 'next_lesson' | 'remedial_content' | 'challenge_content';

// User Profile
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

// Skills
export interface SkillGap {
  skill_name: string;
  current_level: number;
  target_level: number;
  priority: number;
}

// Learning Paths (AI service)
export type LearningPathStatus = 'active' | 'paused' | 'completed' | 'abandoned';
export type ModuleStatus = 'not_started' | 'in_progress' | 'completed' | 'skipped';

export interface LearningPath {
  id: string;
  user_id: string;
  path_name: string;
  description?: string;
  target_language: string;
  estimated_duration_weeks: number;
  total_modules: number;
  total_estimated_hours: number;
  status: LearningPathStatus;
  current_module_index: number;
  completion_percentage: number;
  adaptation_count: number;
  last_adapted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LearningPathModule {
  id: string;
  learning_path_id: string;
  sequence_order: number;
  module_type: string;
  title: string;
  description?: string;
  learning_objectives: string[];
  difficulty_level: DifficultyLevel;
  prerequisites?: string[];
  course_id?: string;
  lesson_id?: string;
  assessment_id?: string;
  estimated_duration_minutes: number;
  estimated_difficulty_score: number;
  recommended_study_time?: string;
  recommended_session_length?: number;
  status: ModuleStatus;
  started_at?: string;
  completed_at?: string;
  attempts_count: number;
  best_score?: number;
  time_spent_minutes: number;
  created_at: string;
  updated_at: string;
}

export interface GeneratedLearningPath {
  user_id: string;
  path_name: string;
  goal: string;
  recommended_courses: GeneratedLearningPathCourse[];
  total_courses: number;
  estimated_total_hours: number;
  difficulty_progression: string;
  created_at: string;
}

export interface GeneratedLearningPathCourse {
  course_id: string;
  position: number;
  title: string;
  difficulty_level: string;
  estimated_duration_hours: number;
  prerequisites: string[];
  rationale: string;
}

// Recommendations
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

// Performance
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

// Psychometric
export interface PsychometricResponse {
  question_id: number;
  response_value: number;
  response_time_ms?: number;
}

// API Error
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
