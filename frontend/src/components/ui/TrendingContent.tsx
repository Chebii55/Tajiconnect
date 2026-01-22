import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../../services/api/analytics';
import { handleApiError } from '../../utils/errorHandler';
import { TrendingUp, Eye, Clock, Users } from 'lucide-react';

interface TrendingContent {
  content_id: string;
  title: string;
  content_type: string;
  view_count: number;
  engagement_rate: number;
  trending_score: number;
  category: string;
}

const TrendingContent: React.FC = () => {
  const [trendingItems, setTrendingItems] = useState<TrendingContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrendingContent();
  }, []);

  const loadTrendingContent = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Mock trending content - in real implementation, this would come from analytics API
      const mockTrending: TrendingContent[] = [
        {
          content_id: 'trend_1',
          title: 'Advanced Python Concepts',
          content_type: 'lesson',
          view_count: 1250,
          engagement_rate: 0.85,
          trending_score: 95,
          category: 'Programming'
        },
        {
          content_id: 'trend_2',
          title: 'Data Visualization Masterclass',
          content_type: 'practice',
          view_count: 890,
          engagement_rate: 0.78,
          trending_score: 88,
          category: 'Data Science'
        },
        {
          content_id: 'trend_3',
          title: 'Machine Learning Fundamentals',
          content_type: 'assessment',
          view_count: 675,
          engagement_rate: 0.92,
          trending_score: 82,
          category: 'AI/ML'
        }
      ];

      setTrendingItems(mockTrending);
    } catch (err: any) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'lesson': return '📚';
      case 'practice': return '🔧';
      case 'assessment': return '📝';
      default: return '📄';
    }
  };

  const getTrendingColor = (score: number) => {
    if (score >= 90) return 'text-red-600 bg-red-100';
    if (score >= 80) return 'text-orange-600 bg-orange-100';
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
            <div key={item.content_id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{getContentIcon(item.content_type)}</span>
                <div className="text-sm font-bold text-primary">#{index + 1}</div>
              </div>

              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                  {item.title}
                </h4>
                <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {item.view_count.toLocaleString()} views
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {Math.round(item.engagement_rate * 100)}% engagement
                  </span>
                  <span className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                    {item.category}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTrendingColor(item.trending_score)}`}>
                  {item.trending_score}% hot
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
