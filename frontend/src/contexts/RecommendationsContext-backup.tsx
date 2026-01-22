import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { ContentRecommendation, PerformanceMetrics } from '../services/api/types';
import { analyticsApi } from '../services/api/analytics';
import { handleApiError } from '../utils/errorHandler';

interface RecommendationsContextType {
  recommendations: ContentRecommendation[];
  performance: PerformanceMetrics | null;
  isLoading: boolean;
  error: string | null;
  refreshRecommendations: () => Promise<void>;
  logInteraction: (contentId: string, interactionType: string) => Promise<void>;
}

const RecommendationsContext = createContext<RecommendationsContextType | undefined>(undefined);

export const useRecommendations = () => {
  const context = useContext(RecommendationsContext);
  if (!context) {
    throw new Error('useRecommendations must be used within a RecommendationsProvider');
  }
  return context;
};

interface RecommendationsProviderProps {
  children: ReactNode;
}

export const RecommendationsProvider: React.FC<RecommendationsProviderProps> = ({ children }) => {
  const [recommendations, setRecommendations] = useState<ContentRecommendation[]>([]);
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = localStorage.getItem('user_id') || 'temp_user';

  const refreshRecommendations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [recsResponse, perfResponse] = await Promise.all([
        analyticsApi.getRecommendations(userId, 10),
        analyticsApi.getPerformance(userId)
      ]);

      setRecommendations(recsResponse.recommendations);
      setPerformance(perfResponse);
    } catch (err: any) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const logInteraction = async (contentId: string, interactionType: string) => {
    try {
      await analyticsApi.logInteraction({
        user_id: userId,
        content_id: contentId,
        interaction_type: interactionType,
        duration_seconds: Date.now() // Simple timestamp
      });
    } catch (err: any) {
      console.error('Failed to log interaction:', err);
    }
  };

  useEffect(() => {
    refreshRecommendations();
    
    // Refresh recommendations every 30 minutes
    const interval = setInterval(refreshRecommendations, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const value: RecommendationsContextType = {
    recommendations,
    performance,
    isLoading,
    error,
    refreshRecommendations,
    logInteraction
  };

  return (
    <RecommendationsContext.Provider value={value}>
      {children}
    </RecommendationsContext.Provider>
  );
};
