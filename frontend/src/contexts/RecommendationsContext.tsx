import React, { createContext, useContext, useState, useEffect } from 'react';
// import type { ContentRecommendation, PerformanceMetrics } from '../services/api/types';

// Temporary inline types to test
interface ContentRecommendation {
  content_id: string;
  content_type: string;
  recommendation_type: string;
  relevance_score: number;
  engagement_prediction: number;
  reasoning: {
    explanation: string;
    primary_factors: string[];
  };
}

interface PerformanceMetrics {
  user_id: string;
  overall_health_score: number;
  performance_metrics: {
    success_rate: number;
    engagement_score: number;
    completion_rate: number;
    performance_trend: 'improving' | 'stable' | 'declining';
  };
  adaptation_needs: any[];
}

interface RecommendationsContextType {
  recommendations: ContentRecommendation[];
  isLoading: boolean;
  error: string | null;
  fetchRecommendations: (userId: string) => Promise<void>;
  updateRecommendation: (id: string, feedback: 'helpful' | 'not_helpful') => void;
  clearRecommendations: () => void;
  performanceMetrics: PerformanceMetrics | null;
}

const RecommendationsContext = createContext<RecommendationsContextType | undefined>(undefined);

export const RecommendationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recommendations, setRecommendations] = useState<ContentRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);

  const fetchRecommendations = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Mock data for now
      const mockRecommendations: ContentRecommendation[] = [
        {
          content_id: '1',
          content_type: 'lesson',
          recommendation_type: 'next_lesson',
          relevance_score: 0.9,
          engagement_prediction: 0.8,
          reasoning: {
            explanation: 'Based on your progress',
            primary_factors: ['skill_gap', 'learning_style']
          }
        }
      ];
      
      setRecommendations(mockRecommendations);
    } catch (err) {
      setError('Failed to fetch recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const updateRecommendation = (id: string, feedback: 'helpful' | 'not_helpful') => {
    // Implementation for updating recommendation feedback
    console.log(`Updating recommendation ${id} with feedback: ${feedback}`);
  };

  const clearRecommendations = () => {
    setRecommendations([]);
    setError(null);
  };

  const value: RecommendationsContextType = {
    recommendations,
    isLoading,
    error,
    fetchRecommendations,
    updateRecommendation,
    clearRecommendations,
    performanceMetrics,
  };

  return (
    <RecommendationsContext.Provider value={value}>
      {children}
    </RecommendationsContext.Provider>
  );
};

export const useRecommendations = () => {
  const context = useContext(RecommendationsContext);
  if (context === undefined) {
    throw new Error('useRecommendations must be used within a RecommendationsProvider');
  }
  return context;
};
