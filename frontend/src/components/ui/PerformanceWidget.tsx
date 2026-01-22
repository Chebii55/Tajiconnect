import React from 'react';
import type { PerformanceMetrics } from '../../services/api/types';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';

interface PerformanceWidgetProps {
  performance: PerformanceMetrics;
}

const PerformanceWidget: React.FC<PerformanceWidgetProps> = ({ performance }) => {
  const getTrendIcon = () => {
    switch (performance.performance_metrics.performance_trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Minus className="w-4 h-4 text-gray-500" />;
    }
  };

  const getHealthColor = () => {
    if (performance.overall_health_score >= 0.8) return 'text-green-600';
    if (performance.overall_health_score >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Learning Performance
        </h3>
        <div className="flex items-center gap-1">
          {getTrendIcon()}
          <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
            {performance.performance_metrics.performance_trend}
          </span>
        </div>
      </div>

      {/* Overall Health Score */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Overall Health</span>
          <span className={`text-lg font-bold ${getHealthColor()}`}>
            {Math.round(performance.overall_health_score * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              performance.overall_health_score >= 0.8 ? 'bg-green-500' :
              performance.overall_health_score >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${performance.overall_health_score * 100}%` }}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="text-xs text-gray-500 mb-1">Success Rate</div>
          <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {Math.round(performance.performance_metrics.success_rate * 100)}%
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Engagement</div>
          <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {Math.round(performance.performance_metrics.engagement_score * 100)}%
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Completion</div>
          <div className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {Math.round(performance.performance_metrics.completion_rate * 100)}%
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Trend</div>
          <div className="text-sm font-medium text-gray-800 dark:text-gray-200 capitalize">
            {performance.performance_metrics.performance_trend}
          </div>
        </div>
      </div>

      {/* Adaptation Needs */}
      {performance.adaptation_needs.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              Adaptation Suggestions
            </span>
          </div>
          <div className="space-y-2">
            {performance.adaptation_needs.slice(0, 2).map((need, index) => (
              <div key={index} className="text-xs text-gray-600 dark:text-gray-400">
                <span className="font-medium">{need.type.replace('_', ' ')}:</span>
                <span className="ml-1">
                  {need.recommended_actions[0]?.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceWidget;
