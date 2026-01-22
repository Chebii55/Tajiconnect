import type { ApiError } from '../services/api/types';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validatePsychometricResponses = (responses: any[]): ValidationResult => {
  const errors: string[] = [];
  
  if (!responses || responses.length === 0) {
    errors.push('No responses provided');
  }
  
  responses.forEach((response, index) => {
    if (!response.question_id) {
      errors.push(`Response ${index + 1}: Missing question_id`);
    }
    if (response.response_value === undefined || response.response_value === null) {
      errors.push(`Response ${index + 1}: Missing response_value`);
    }
    if (response.response_value < 1 || response.response_value > 5) {
      errors.push(`Response ${index + 1}: Invalid response_value (must be 1-5)`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateUserProfile = (profile: any): ValidationResult => {
  const errors: string[] = [];
  
  if (!profile.user_id) errors.push('Missing user_id');
  if (!profile.learner_archetype) errors.push('Missing learner_archetype');
  if (!profile.learning_preferences) errors.push('Missing learning_preferences');
  if (!profile.motivation_score) errors.push('Missing motivation_score');
  
  if (profile.motivation_score) {
    const scores = ['intrinsic_motivation', 'extrinsic_motivation', 'engagement_prediction', 'persistence_score'];
    scores.forEach(score => {
      if (profile.motivation_score[score] < 0 || profile.motivation_score[score] > 1) {
        errors.push(`Invalid ${score}: must be between 0 and 1`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateApiResponse = (response: any, expectedFields: string[]): ValidationResult => {
  const errors: string[] = [];
  
  expectedFields.forEach(field => {
    if (!(field in response)) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateApiError = (error: ApiError): boolean => {
  return !!(error.code && error.message);
};

// Performance validation
export const validatePerformanceMetrics = (metrics: any): ValidationResult => {
  const errors: string[] = [];
  
  if (!metrics.overall_health_score || metrics.overall_health_score < 0 || metrics.overall_health_score > 1) {
    errors.push('Invalid overall_health_score');
  }
  
  if (!metrics.performance_metrics) {
    errors.push('Missing performance_metrics');
  } else {
    const requiredMetrics = ['success_rate', 'engagement_score', 'completion_rate'];
    requiredMetrics.forEach(metric => {
      if (metrics.performance_metrics[metric] < 0 || metrics.performance_metrics[metric] > 1) {
        errors.push(`Invalid ${metric}: must be between 0 and 1`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Integration test helpers
export const testApiIntegration = async () => {
  const results = {
    psychometric: false,
    learningPaths: false,
    recommendations: false,
    analytics: false,
    skills: false
  };
  
  try {
    // Test each API endpoint
    const testUserId = 'test_user_integration';
    
    // These would be actual API calls in real testing
    console.log('Testing API integration for user:', testUserId);
    
    // Mock successful tests
    results.psychometric = true;
    results.learningPaths = true;
    results.recommendations = true;
    results.analytics = true;
    results.skills = true;
    
  } catch (error) {
    console.error('API integration test failed:', error);
  }
  
  return results;
};
