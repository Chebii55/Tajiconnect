import React, { useState, useCallback } from 'react';
import { useRecommendations } from '../../contexts/RecommendationsContext';
import RecommendationCard from '../ui/RecommendationCard';
import LoadingSpinner from '../ui/LoadingSpinner';
import LazyComponent from '../ui/LazyComponent';
import { useDebounce } from '../../hooks/usePerformance';
import { Lightbulb, RefreshCw } from 'lucide-react';

const Recommendations: React.FC = () => {
  const { recommendations, isLoading, error, refreshRecommendations } = useRecommendations();
  const [searchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  const filteredRecommendations = useCallback(() => {
    if (!debouncedSearch) return recommendations;
    return recommendations.filter(rec =>
      rec.reasoning.explanation.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      rec.content_type.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [recommendations, debouncedSearch]);

  return (
    <div className="p-6 bg-neutral-light dark:bg-darkMode-bg min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary dark:text-darkMode-text font-heading">
              AI-Powered Recommendations
            </h1>
            <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary mt-2">
              Personalized content recommendations based on your learning profile and progress
            </p>
          </div>
          <button
            onClick={refreshRecommendations}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" message="Loading personalized recommendations..." />
          </div>
        ) : error ? (
          <div className="card-modern p-8 text-center dark:bg-darkMode-surface dark:border-darkMode-border">
            <div className="text-red-500 mb-4">
              <Lightbulb className="w-12 h-12 mx-auto opacity-50" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Unable to Load Recommendations
            </h3>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={refreshRecommendations}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : recommendations.length > 0 ? (
          <LazyComponent componentName="RecommendationsList">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecommendations().map((recommendation, index) => (
                <RecommendationCard key={index} recommendation={recommendation} />
              ))}
            </div>
          </LazyComponent>
        ) : (
          <div className="card-modern p-12 text-center dark:bg-darkMode-surface dark:border-darkMode-border">
            <Lightbulb className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              No Recommendations Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Complete more assessments and learning activities to get personalized AI recommendations
            </p>
            <button
              onClick={() => window.location.href = '/student/assessments'}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg transition-colors"
            >
              Take Assessment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;
