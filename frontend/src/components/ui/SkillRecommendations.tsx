import React from 'react';
import { Lightbulb, BookOpen, Target, Clock, Star } from 'lucide-react';

interface SkillRecommendation {
  skill_name: string;
  recommendation_type: string;
  priority_score: number;
  estimated_time_weeks: number;
  learning_resources: string[];
  reasoning: string;
}

interface SkillRecommendationsProps {
  recommendations: SkillRecommendation[];
  isLoading?: boolean;
  onStartLearning?: (skillName: string) => void;
}

const SkillRecommendations: React.FC<SkillRecommendationsProps> = ({ 
  recommendations, 
  isLoading, 
  onStartLearning 
}) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow p-6 text-center">
        <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          No Recommendations Available
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Complete skill assessments to get AI-powered learning recommendations
        </p>
      </div>
    );
  }

  const getPriorityColor = (score: number) => {
    if (score >= 0.8) return 'text-red-600 bg-red-100';
    if (score >= 0.6) return 'text-orange-600 bg-orange-100';
    return 'text-blue-600 bg-blue-100';
  };

  const getPriorityLabel = (score: number) => {
    if (score >= 0.8) return 'High Priority';
    if (score >= 0.6) return 'Medium Priority';
    return 'Low Priority';
  };

  return (
    <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          AI Learning Recommendations
        </h3>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {recommendations.slice(0, 4).map((rec, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                    {rec.skill_name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {rec.reasoning}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(rec.priority_score)}`}>
                  {getPriorityLabel(rec.priority_score)}
                </span>
              </div>
              
              <div className="flex items-center gap-4 mb-3 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {rec.estimated_time_weeks} weeks
                </span>
                <span className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  {rec.recommendation_type.replace('_', ' ')}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  {Math.round(rec.priority_score * 100)}% match
                </span>
              </div>
              
              {rec.learning_resources.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-1">Recommended Resources:</div>
                  <div className="flex flex-wrap gap-1">
                    {rec.learning_resources.slice(0, 3).map((resource, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {resource}
                      </span>
                    ))}
                    {rec.learning_resources.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{rec.learning_resources.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <BookOpen className="w-3 h-3" />
                  <span>AI-Recommended Learning Path</span>
                </div>
                <button
                  onClick={() => onStartLearning?.(rec.skill_name)}
                  className="bg-primary hover:bg-primary-dark text-white px-3 py-1 rounded text-xs transition-colors"
                >
                  Start Learning
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {recommendations.length > 4 && (
          <div className="mt-4 text-center">
            <button className="text-primary hover:text-primary-dark text-sm font-medium">
              View All {recommendations.length} Recommendations
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillRecommendations;
