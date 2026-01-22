import React from 'react';
// import type { ContentRecommendation } from '../../services/api/types';

// Temporary inline type
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
import { useRecommendations } from '../../contexts/RecommendationsContext';
import RecommendationFeedback from './RecommendationFeedback';
import { BookOpen, Play, Target, Lightbulb } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: ContentRecommendation;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const { logInteraction } = useRecommendations();

  const getIcon = () => {
    switch (recommendation.content_type) {
      case 'lesson': return <BookOpen className="w-5 h-5" />;
      case 'practice': return <Target className="w-5 h-5" />;
      case 'assessment': return <Lightbulb className="w-5 h-5" />;
      default: return <Play className="w-5 h-5" />;
    }
  };

  const getTypeColor = () => {
    switch (recommendation.recommendation_type) {
      case 'next_lesson': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'remedial_content': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
      case 'challenge_content': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const handleClick = () => {
    logInteraction(recommendation.content_id, 'click');
    // Navigate to content or open modal
  };

  return (
    <div 
      className="bg-white dark:bg-darkMode-surface rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            {getIcon()}
          </div>
          <div>
            <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor()}`}>
              {recommendation.recommendation_type.replace('_', ' ')}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-semibold text-primary">
            {Math.round(recommendation.relevance_score)}%
          </div>
          <div className="text-xs text-gray-500">relevance</div>
        </div>
      </div>

      <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
        {recommendation.content_type.charAt(0).toUpperCase() + recommendation.content_type.slice(1)} Content
      </h4>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {recommendation.reasoning.explanation}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {recommendation.reasoning.primary_factors.slice(0, 2).map((factor, index) => (
            <span key={index} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              {factor.replace('_', ' ')}
            </span>
          ))}
        </div>
        <div className="text-xs text-gray-500">
          {Math.round(recommendation.engagement_prediction * 100)}% engagement
        </div>
      </div>

      <RecommendationFeedback 
        recommendation={recommendation}
        onFeedbackSubmitted={() => {
          // Optionally refresh recommendations after feedback
        }}
      />
    </div>
  );
};

export default RecommendationCard;
