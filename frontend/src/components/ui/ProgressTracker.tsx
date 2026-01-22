import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../../services/api/analytics';
import { handleApiError } from '../../utils/errorHandler';
import { TrendingUp, Target, Clock, Award, BarChart3 } from 'lucide-react';

interface ProgressData {
  overall_progress: number;
  weekly_progress: number;
  learning_streak: number;
  completed_activities: number;
  time_spent_hours: number;
  achievements_earned: number;
  performance_trend: 'improving' | 'stable' | 'declining';
}

const ProgressTracker: React.FC = () => {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userId = localStorage.getItem('user_id') || 'temp_user';

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const performance = await analyticsApi.getPerformance(userId);
      
      // Transform performance data to progress data
      const progress: ProgressData = {
        overall_progress: performance.overall_health_score * 100,
        weekly_progress: performance.performance_metrics.completion_rate * 100,
        learning_streak: 15, // Mock data
        completed_activities: 42, // Mock data
        time_spent_hours: 28, // Mock data
        achievements_earned: 8, // Mock data
        performance_trend: performance.performance_metrics.performance_trend
      };
      
      setProgressData(progress);
    } catch (err: any) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <BarChart3 className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'text-green-600 bg-green-100';
      case 'declining': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow p-6 text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <button
          onClick={loadProgressData}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!progressData) return null;

  return (
    <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Learning Progress
          </h3>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(progressData.performance_trend)}`}>
            {getTrendIcon(progressData.performance_trend)}
            <span className="capitalize">{progressData.performance_trend}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
            <span className="text-lg font-bold text-primary">{Math.round(progressData.overall_progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-primary h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressData.overall_progress}%` }}
            />
          </div>
        </div>

        {/* Progress Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {Math.round(progressData.weekly_progress)}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">This Week</div>
          </div>

          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {progressData.learning_streak}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Day Streak</div>
          </div>

          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <BarChart3 className="w-5 h-5 text-purple-500" />
            </div>
            <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {progressData.completed_activities}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Activities</div>
          </div>

          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Award className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-xl font-bold text-gray-800 dark:text-gray-200">
              {progressData.achievements_earned}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Achievements</div>
          </div>
        </div>

        {/* Time Spent */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Time Spent This Week</span>
            <span className="font-semibold text-gray-800 dark:text-gray-200">
              {progressData.time_spent_hours}h
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
