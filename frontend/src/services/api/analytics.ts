import { apiClient } from './client';
import { API_ENDPOINTS } from './endpoints';
import type { ContentRecommendation, PerformanceMetrics } from './types';
import { cacheManager, CACHE_KEYS, CACHE_TTL } from '../../utils/cache';

export const analyticsApi = {
  getProgressSummary: async (userId: string, windowDays = 30) => {
    return apiClient.get(API_ENDPOINTS.ANALYTICS.USER_PROGRESS_SUMMARY(userId), {
      window_days: windowDays,
    });
  },

  getTimeSeries: async (userId: string, windowDays = 30) => {
    return apiClient.get(API_ENDPOINTS.ANALYTICS.USER_TIME_SERIES(userId), {
      window_days: windowDays,
    });
  },
  // Get personalized recommendations with caching
  getRecommendations: async (userId: string, limit = 10): Promise<{
    recommendations: ContentRecommendation[];
  }> => {
    const cacheKey = CACHE_KEYS.RECOMMENDATIONS(userId);
    const cached = cacheManager.get(cacheKey) as { recommendations: ContentRecommendation[] } | null;

    if (cached) {
      return cached;
    }

    const result = await apiClient.post(API_ENDPOINTS.ANALYTICS.GET_RECOMMENDATIONS, {
      user_id: userId,
      limit,
      context: { current_time: new Date().toISOString() }
    }) as { recommendations: ContentRecommendation[] };

    cacheManager.set(cacheKey, result, CACHE_TTL.RECOMMENDATIONS);
    return result;
  },

  // Get performance metrics with caching
  getPerformance: async (userId: string): Promise<PerformanceMetrics> => {
    const cacheKey = CACHE_KEYS.PERFORMANCE(userId);
    const cached = cacheManager.get(cacheKey) as PerformanceMetrics | null;

    if (cached) {
      return cached;
    }

    const result = await apiClient.get(API_ENDPOINTS.ANALYTICS.GET_PERFORMANCE(userId)) as PerformanceMetrics;
    cacheManager.set(cacheKey, result, CACHE_TTL.PERFORMANCE);
    return result;
  },

  // Log learning interaction (no caching)
  logInteraction: async (data: {
    user_id: string;
    content_id: string;
    interaction_type: string;
    duration_seconds?: number;
    success_rate?: number;
  }) => {
    // Invalidate related caches when logging interactions
    cacheManager.invalidatePattern(`recommendations_${data.user_id}`);
    cacheManager.invalidatePattern(`performance_${data.user_id}`);
    
    return apiClient.post(API_ENDPOINTS.ANALYTICS.LOG_INTERACTION, data);
  },

  // Submit user feedback (no caching)
  submitFeedback: async (data: {
    user_id: string;
    content_id?: string;
    feedback_type: string;
    rating?: number;
    comments?: string;
  }) => {
    // Invalidate recommendations cache after feedback
    cacheManager.invalidate(CACHE_KEYS.RECOMMENDATIONS(data.user_id));
    
    return apiClient.post(API_ENDPOINTS.ANALYTICS.SUBMIT_FEEDBACK, data);
  },

  // Get AI predictions with caching
  getPredictions: async (userId: string) => {
    const cacheKey = `predictions_${userId}`;
    const cached = cacheManager.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const result = await apiClient.get(API_ENDPOINTS.ANALYTICS.GET_PREDICTIONS(userId));
    cacheManager.set(cacheKey, result, CACHE_TTL.PERFORMANCE);
    return result;
  },
};
