import { useState } from 'react';

interface AssessmentAnswers {
  [questionId: number]: string | number | string[];
}

interface UserProfile {
  id: string;
  age?: number;
  education?: {
    level: string;
  };
  isPWD?: boolean;
  impairmentType?: string;
}

interface CareerRecommendation {
  title: string;
  match: string;
  description: string;
  requiredSkills: string[];
  salaryRange: string;
  growth: string;
  color: string;
  personalizedRoadmap: RoadmapPhase[];
}

interface RoadmapPhase {
  phase: string;
  duration: string;
  skills: string[];
  milestones: string[];
  personalizedTips?: string[];
  progress?: {
    completed: boolean;
    completedMilestones: string[];
    timeSpent: number;
  };
}

interface AssessmentAnalysis {
  interests: Array<{ interest: string; score: number }>;
  skills: Record<string, number>;
  values: Record<string, any>;
  personality: Record<string, any>;
}

interface AssessmentResult {
  recommendations: CareerRecommendation[];
  analysis: AssessmentAnalysis;
  savedAssessment: any;
  generatedRoadmaps: any[];
}

export const useCareerAssessment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AssessmentResult | null>(null);

  const submitAssessment = async (
    userId: string,
    answers: AssessmentAnswers,
    userProfile?: UserProfile
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/career/assess', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          answers,
          userProfile
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Assessment failed');
      }

      if (data.success) {
        setResult(data.data);
        return data.data;
      } else {
        throw new Error(data.message || 'Assessment failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUserRoadmaps = async (userId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/${userId}/roadmaps`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch roadmaps');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRoadmapProgress = async (
    roadmapId: string,
    phaseIndex: number,
    progress: any
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/roadmaps/${roadmapId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phaseIndex,
          progress
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update progress');
      }

      return data.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    result,
    submitAssessment,
    getUserRoadmaps,
    updateRoadmapProgress,
  };
};

export type {
  AssessmentAnswers,
  UserProfile,
  CareerRecommendation,
  RoadmapPhase,
  AssessmentResult,
  AssessmentAnalysis
};