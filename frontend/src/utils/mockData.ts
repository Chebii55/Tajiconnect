// Mock API responses for development and testing
import type { UserProfile, LearningPath, ContentRecommendation, PerformanceMetrics, SkillGap } from '../services/api/types';

export const mockUserProfile: UserProfile = {
  user_id: 'test_user_123',
  learner_archetype: 'structured_learner',
  learning_preferences: {
    primary_style: 'visual',
    content_format_preferences: ['video', 'interactive', 'text'],
    difficulty_preference: 'gradual'
  },
  motivation_score: {
    intrinsic_motivation: 0.85,
    extrinsic_motivation: 0.65,
    engagement_prediction: 0.78,
    persistence_score: 0.72
  },
  skill_gaps: [
    {
      skill_name: 'Advanced Python',
      current_level: 45,
      target_level: 80,
      priority: 0.9
    },
    {
      skill_name: 'Data Structures',
      current_level: 30,
      target_level: 75,
      priority: 0.85
    }
  ]
};

export const mockLearningPath: LearningPath = {
  id: 'path_123',
  title: 'AI-Generated Python Mastery Path',
  description: 'Personalized learning journey for Python programming',
  estimated_duration_weeks: 12,
  difficulty_level: 'intermediate',
  modules: [
    {
      id: 'module_1',
      title: 'Python Fundamentals',
      order_index: 1,
      estimated_duration_hours: 8,
      difficulty_score: 45,
      lessons: [
        {
          id: 'lesson_1',
          title: 'Variables and Data Types',
          content_type: 'lesson',
          estimated_duration_minutes: 30
        }
      ]
    }
  ]
};

export const mockRecommendations: ContentRecommendation[] = [
  {
    content_id: 'rec_1',
    content_type: 'lesson',
    recommendation_type: 'next_lesson',
    relevance_score: 92.5,
    engagement_prediction: 0.85,
    reasoning: {
      explanation: 'Perfect match for your visual learning style',
      primary_factors: ['style_match', 'skill_gap_match']
    }
  }
];

export const mockPerformance: PerformanceMetrics = {
  user_id: 'test_user_123',
  overall_health_score: 0.78,
  performance_metrics: {
    success_rate: 0.85,
    engagement_score: 0.72,
    completion_rate: 0.68,
    performance_trend: 'improving'
  },
  adaptation_needs: [
    {
      type: 'difficulty_adjustment',
      severity: 0.3,
      recommended_actions: ['increase_difficulty', 'add_challenge_content']
    }
  ]
};

export const mockSkillGaps: SkillGap[] = [
  {
    skill_name: 'Machine Learning',
    current_level: 25,
    target_level: 70,
    priority: 0.95
  },
  {
    skill_name: 'Database Design',
    current_level: 40,
    target_level: 80,
    priority: 0.75
  }
];

// API Error simulation
export const mockApiError = {
  code: 'NETWORK_ERROR',
  message: 'Connection failed',
  details: { retry_after: 5000 }
};

// Test scenarios
export const testScenarios = {
  // Successful API calls
  success: {
    psychometric: () => Promise.resolve(mockUserProfile),
    learningPath: () => Promise.resolve(mockLearningPath),
    recommendations: () => Promise.resolve({ recommendations: mockRecommendations }),
    performance: () => Promise.resolve(mockPerformance),
    skillGaps: () => Promise.resolve(mockSkillGaps)
  },
  
  // API failures
  failure: {
    networkError: () => Promise.reject(mockApiError),
    timeout: () => new Promise((_, reject) => 
      setTimeout(() => reject({ code: 'TIMEOUT', message: 'Request timeout' }), 5000)
    ),
    serverError: () => Promise.reject({ 
      code: 'SERVER_ERROR', 
      message: 'Internal server error' 
    })
  },
  
  // Slow responses
  slow: {
    analysis: () => new Promise(resolve => 
      setTimeout(() => resolve(mockUserProfile), 8000)
    )
  }
};
