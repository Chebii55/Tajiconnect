import React, { useState, useEffect } from 'react';
import { aiService } from '../../services/api/ai';
import { handleApiError } from '../../utils/errorHandler';
import { TrendingUp, Clock, Star } from 'lucide-react';

interface TrendingItem {
  id: string;
  title: string;
  contentType: string;
  trendingScore: number;
  estimatedDuration?: number;
  difficultyLevel?: string;
}

const TrendingContent: React.FC = () => {
  const [trendingItems, setTrendingItems] = useState<TrendingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrendingContent();
  }, []);

  const loadTrendingContent = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await aiService.getTrendingCourses(6, 7);
      const trendingList = Array.isArray(response)
        ? response
        : response.trending_courses ?? [];

      const mapped: TrendingItem[] = trendingList.map((item: any) => {
        if ('score' in item) {
          return {
            id: item.course_id,
            title: item.title,
            contentType: 'course',
            trendingScore: Math.round(item.score * 100),
            estimatedDuration: item.estimated_duration,
            difficultyLevel: item.difficulty_level,
          };
        }

        return {
          id: item.course_id,
          title: `Course ${item.course_id}`,
          contentType: 'course',
          trendingScore: Math.round(item.trend_score ?? 0),
        };
      });

      setTrendingItems(mapped);
    } catch (err: any) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'course': return '📚';
      default: return '📄';
    }
  };

  const getTrendingColor = (score: number) => {
    if (score >= 100) return 'text-red-600 bg-red-100';
    if (score >= 60) return 'text-orange-600 bg-orange-100';
    return 'text-blue-600 bg-blue-100';
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
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
          onClick={loadTrendingContent}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!trendingItems.length) {
    return (
      <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow p-6 text-center">
        <TrendingUp className="w-10 h-10 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-600 dark:text-gray-400">No trending content yet.</p>
        <button
          onClick={loadTrendingContent}
          className="mt-4 text-primary hover:text-primary-dark text-sm font-medium"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Trending Content
        </h3>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {trendingItems.map((item, index) => (
            <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getContentIcon(item.contentType)}</span>
                <div className="text-sm font-bold text-primary">#{index + 1}</div>
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {item.title}
                </h4>
                <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Score {item.trendingScore}
                  </span>
                  {item.estimatedDuration ? (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.estimatedDuration} hrs
                    </span>
                  ) : null}
                  {item.difficultyLevel ? (
                    <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded capitalize">
                      {item.difficultyLevel}
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTrendingColor(item.trendingScore)}`}>
                  {item.trendingScore} hot
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <button className="text-primary hover:text-primary-dark text-sm font-medium">
            View All Trending Content
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrendingContent;
