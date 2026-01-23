/**
 * Onboarding Service
 * Handles all onboarding flow-related API calls
 */

import { apiClient } from './client';
import { ONBOARDING } from './endpoints';

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface OnboardingStep {
  id: string;
  name: string;
  title: string;
  description: string;
  order: number;
  is_required: boolean;
  is_completed: boolean;
  is_skipped: boolean;
  component_name?: string;
  metadata?: Record<string, unknown>;
}

export interface OnboardingFlow {
  steps: OnboardingStep[];
  current_step: number;
  current_step_name: string;
  total_steps: number;
  completed_steps: number;
  completed_percentage: number;
  is_completed: boolean;
}

export interface OnboardingStatus {
  user_id: string;
  is_completed: boolean;
  current_step: string;
  current_step_index: number;
  completed_steps: string[];
  skipped_steps: string[];
  started_at: string;
  completed_at?: string;
  last_activity_at: string;
}

export interface ProfileSetupData {
  bio?: string;
  location?: string;
  avatar_url?: string;
  preferred_language?: string;
  timezone?: string;
  date_of_birth?: string;
  education_level?: string;
  occupation?: string;
}

export interface LearningGoalsData {
  goals: string[];
  primary_goal?: string;
  target_completion_date?: string;
  weekly_hours_commitment: number;
  learning_style?: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  preferred_content_types?: string[];
  interests?: string[];
}

export interface PreferencesData {
  notification_preferences: {
    email: boolean;
    push: boolean;
    sms: boolean;
    marketing?: boolean;
  };
  content_preferences: {
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    content_types: string[];
    language?: string;
  };
  accessibility_preferences?: {
    high_contrast?: boolean;
    large_text?: boolean;
    screen_reader_optimized?: boolean;
    reduce_motion?: boolean;
    captions_enabled?: boolean;
  };
}

export interface CompleteStepResponse {
  success: boolean;
  step_completed: string;
  next_step?: string;
  is_onboarding_complete: boolean;
  message?: string;
}

export interface SkipStepResponse {
  success: boolean;
  step_skipped: string;
  next_step?: string;
  is_onboarding_complete: boolean;
  message?: string;
}

export interface NextStepsResponse {
  steps: OnboardingStep[];
  total_remaining: number;
  estimated_time_minutes: number;
}

// ============================================
// ONBOARDING SERVICE CLASS
// ============================================

class OnboardingService {
  // ============================================
  // FLOW MANAGEMENT
  // ============================================

  /**
   * Get the full onboarding flow with all steps
   */
  async getFlow(): Promise<OnboardingFlow> {
    return apiClient.get<OnboardingFlow>(ONBOARDING.FLOW);
  }

  /**
   * Get current user's onboarding status
   */
  async getStatus(): Promise<OnboardingStatus> {
    return apiClient.get<OnboardingStatus>(ONBOARDING.STATUS);
  }

  /**
   * Get next steps to complete
   */
  async getNextSteps(): Promise<NextStepsResponse> {
    return apiClient.get<NextStepsResponse>(ONBOARDING.NEXT_STEPS);
  }

  // ============================================
  // STEP COMPLETION
  // ============================================

  /**
   * Mark a step as complete
   */
  async completeStep(stepName: string, data?: Record<string, unknown>): Promise<CompleteStepResponse> {
    return apiClient.post<CompleteStepResponse>(ONBOARDING.COMPLETE_STEP, {
      step_name: stepName,
      data,
    });
  }

  /**
   * Skip an optional step
   */
  async skipStep(stepName: string, reason?: string): Promise<SkipStepResponse> {
    return apiClient.post<SkipStepResponse>(ONBOARDING.SKIP_STEP, {
      step_name: stepName,
      reason,
    });
  }

  // ============================================
  // STEP-SPECIFIC SUBMISSIONS
  // ============================================

  /**
   * Submit profile setup data
   */
  async submitProfileSetup(data: ProfileSetupData): Promise<CompleteStepResponse> {
    return apiClient.post<CompleteStepResponse>(ONBOARDING.PROFILE_SETUP, data);
  }

  /**
   * Submit learning goals
   */
  async submitLearningGoals(data: LearningGoalsData): Promise<CompleteStepResponse> {
    return apiClient.post<CompleteStepResponse>(ONBOARDING.LEARNING_GOALS, data);
  }

  /**
   * Submit user preferences
   */
  async submitPreferences(data: PreferencesData): Promise<CompleteStepResponse> {
    return apiClient.post<CompleteStepResponse>(ONBOARDING.PREFERENCES, data);
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  /**
   * Check if onboarding is complete
   */
  async isOnboardingComplete(): Promise<boolean> {
    const status = await this.getStatus();
    return status.is_completed;
  }

  /**
   * Get current step name
   */
  async getCurrentStep(): Promise<string> {
    const status = await this.getStatus();
    return status.current_step;
  }

  /**
   * Get progress percentage
   */
  async getProgress(): Promise<number> {
    const flow = await this.getFlow();
    return flow.completed_percentage;
  }

  /**
   * Check if a specific step is completed
   */
  async isStepCompleted(stepName: string): Promise<boolean> {
    const status = await this.getStatus();
    return status.completed_steps.includes(stepName);
  }

  /**
   * Get step by name from the flow
   */
  async getStepByName(stepName: string): Promise<OnboardingStep | undefined> {
    const flow = await this.getFlow();
    return flow.steps.find((step) => step.name === stepName);
  }
}

// Export singleton instance
export const onboardingService = new OnboardingService();
export default onboardingService;
