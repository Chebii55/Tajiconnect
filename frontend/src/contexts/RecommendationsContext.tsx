/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';
import { aiService } from '../services/api/ai';
import type { CourseRecommendation, ProgressAnalytics } from '../services/api/ai';
import { getCurrentUser } from '../utils/auth';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface ContentRecommendation {
  content_id: string;
  title?: string;
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
  adaptation_needs: Array<{
    type: string;
    severity: number;
    recommended_actions: string[];
  }>;
}

interface RecommendationsContextType {
  recommendations: ContentRecommendation[];
  courseRecommendations: CourseRecommendation[];
  trendingCourses: CourseRecommendation[];
  isLoading: boolean;
  error: string | null;
  fetchRecommendations: (userId?: string) => Promise<void>;
  fetchCourseRecommendations: (options?: { limit?: number }) => Promise<void>;
  fetchTrendingCourses: (limit?: number) => Promise<void>;
  updateRecommendation: (id: string, feedback: 'helpful' | 'not_helpful') => void;
  clearRecommendations: () => void;
  performanceMetrics: PerformanceMetrics | null;
  performance: PerformanceMetrics | null; // Alias for performanceMetrics
  progressAnalytics: ProgressAnalytics | null;
  fetchPerformanceMetrics: (userId?: string) => Promise<void>;
  trackBehavior: (
    courseId: string,
    actionType: 'view' | 'enroll' | 'complete' | 'rate' | 'bookmark' | 'share',
    actionValue?: number
  ) => Promise<void>;
  logInteraction: (contentId: string, interactionType: string) => void;
  refreshRecommendations: () => Promise<void>;
}

const RecommendationsContext = createContext<RecommendationsContextType | undefined>(undefined);

// ============================================
// PROVIDER COMPONENT
// ============================================

export const RecommendationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recommendations, setRecommendations] = useState<ContentRecommendation[]>([]);
  const [courseRecommendations, setCourseRecommendations] = useState<CourseRecommendation[]>([]);
  const [trendingCourses, setTrendingCourses] = useState<CourseRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [progressAnalytics, setProgressAnalytics] = useState<ProgressAnalytics | null>(null);

  // Helper to get current user ID
  const getUserId = useCallback((): string | null => {
    const user = getCurrentUser();
    return user?.id || null;
  }, []);

  // Fetch content recommendations (legacy format)
  const fetchRecommendations = useCallback(async (userId?: string) => {
    const uid = userId || getUserId();
    if (!uid) {
      setError('User not authenticated');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const courseRecs = await aiService.getCourseRecommendations({
        user_id: uid,
        limit: 10,
      });

      // Transform course recommendations to content recommendations format
      const contentRecs: ContentRecommendation[] = courseRecs.map((rec) => {
        const metadata = rec.metadata || {};
        const primaryFactors = Array.isArray((metadata as any).match_factors)
          ? (metadata as any).match_factors
          : [];

        return {
          content_id: rec.course_id,
          content_type: 'course',
          recommendation_type: 'next_lesson',
          relevance_score: rec.score,
          engagement_prediction: rec.score * 0.9,
          reasoning: {
            explanation: rec.explanation || '',
            primary_factors: primaryFactors,
          },
        };
      });

      setRecommendations(contentRecs);
      setCourseRecommendations(courseRecs);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch recommendations';
      setError(message);
      console.error('Error fetching recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  }, [getUserId]);

  // Fetch course recommendations directly
  const fetchCourseRecommendations = useCallback(
    async (options?: { limit?: number }) => {
      const userId = getUserId();
      if (!userId) {
        setError('User not authenticated');
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const recs = await aiService.getCourseRecommendations({
          user_id: userId,
          limit: options?.limit || 10,
        });
        setCourseRecommendations(recs);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch course recommendations';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [getUserId]
  );

  // Fetch trending courses
  const fetchTrendingCourses = useCallback(async (limit = 10) => {
    try {
      const response = await aiService.getTrendingCourses(limit);
      // Transform TrendingCourse to CourseRecommendation format
      const transformedCourses: CourseRecommendation[] = response.trending_courses.map((course, index) => ({
        course_id: course.course_id,
        score: course.trend_score,
        rank: index + 1,
        explanation: `Trending with ${course.enrollment_count} enrollments`,
        metadata: {
          view_count: course.view_count,
          enrollment_count: course.enrollment_count,
          completion_count: course.completion_count,
          rating_avg: course.rating_avg,
          growth_rate: course.growth_rate,
        },
      }));
      setTrendingCourses(transformedCourses);
    } catch (err) {
      console.error('Error fetching trending courses:', err);
    }
  }, []);

  // Fetch performance metrics
  const fetchPerformanceMetrics = useCallback(
    async (userId?: string) => {
      const uid = userId || getUserId();
      if (!uid) return;

      try {
        const analytics = await aiService.getProgressAnalytics(uid);
        setProgressAnalytics(analytics);

        // Transform to legacy format
        const metrics: PerformanceMetrics = {
          user_id: uid,
          overall_health_score: analytics.overall_progress,
          performance_metrics: {
            success_rate: analytics.overall_progress / 100,
            engagement_score: analytics.current_streak / 10,
            completion_rate: analytics.courses_completed / Math.max(1, analytics.courses_in_progress + analytics.courses_completed),
            performance_trend: analytics.performance_trend,
          },
          adaptation_needs: [],
        };
        setPerformanceMetrics(metrics);
      } catch (err) {
        console.error('Error fetching performance metrics:', err);
      }
    },
    [getUserId]
  );

  // Track user behavior
  const trackBehavior = useCallback(
    async (
      courseId: string,
      actionType: 'view' | 'enroll' | 'complete' | 'rate' | 'bookmark' | 'share',
      actionValue?: number
    ) => {
      const userId = getUserId();
      if (!userId) return;

      try {
        await aiService.trackBehavior({
          user_id: userId,
          course_id: courseId,
          action_type: actionType,
          action_value: actionValue,
        });
      } catch (err) {
        console.error('Error tracking behavior:', err);
      }
    },
    [getUserId]
  );

  // Update recommendation with feedback
  const updateRecommendation = useCallback(
    (id: string, feedback: 'helpful' | 'not_helpful') => {
      const userId = getUserId();
      if (!userId) return;

      // Submit feedback via analytics
      aiService.submitFeedback(userId, 'recommendation', feedback, {
        recommendation_id: id,
      }).catch(console.error);

      // Update local state to reflect feedback
      setRecommendations((prev) =>
        prev.map((rec) =>
          rec.content_id === id
            ? {
                ...rec,
                relevance_score: feedback === 'helpful' ? rec.relevance_score * 1.1 : rec.relevance_score * 0.9,
              }
            : rec
        )
      );
    },
    [getUserId]
  );

  // Clear all recommendations
  const clearRecommendations = useCallback(() => {
    setRecommendations([]);
    setCourseRecommendations([]);
    setTrendingCourses([]);
    setError(null);
  }, []);

  // Log interaction (wrapper for trackBehavior)
  const logInteraction = useCallback(
    (contentId: string, interactionType: string) => {
      // Map interaction types to action types
      const actionTypeMap: Record<string, 'view' | 'enroll' | 'complete' | 'rate' | 'bookmark' | 'share'> = {
        click: 'view',
        view: 'view',
        start: 'enroll',
        complete: 'complete',
        rate: 'rate',
        bookmark: 'bookmark',
        share: 'share',
      };
      const actionType = actionTypeMap[interactionType] || 'view';
      trackBehavior(contentId, actionType).catch(console.error);
    },
    [trackBehavior]
  );

  // Refresh all recommendations
  const refreshRecommendations = useCallback(async () => {
    const userId = getUserId();
    if (!userId) return;

    await Promise.all([
      fetchRecommendations(userId),
      fetchTrendingCourses(),
      fetchPerformanceMetrics(userId),
    ]);
  }, [getUserId, fetchRecommendations, fetchTrendingCourses, fetchPerformanceMetrics]);

  const value: RecommendationsContextType = {
    recommendations,
    courseRecommendations,
    trendingCourses,
    isLoading,
    error,
    fetchRecommendations,
    fetchCourseRecommendations,
    fetchTrendingCourses,
    updateRecommendation,
    clearRecommendations,
    performanceMetrics,
    performance: performanceMetrics, // Alias
    progressAnalytics,
    fetchPerformanceMetrics,
    trackBehavior,
    logInteraction,
    refreshRecommendations,
  };

  return (
    <RecommendationsContext.Provider value={value}>
      {children}
    </RecommendationsContext.Provider>
  );
};

// ============================================
// HOOK
// ============================================

export const useRecommendations = () => {
  const context = useContext(RecommendationsContext);
  if (context === undefined) {
    throw new Error('useRecommendations must be used within a RecommendationsProvider');
  }
  return context;
};
