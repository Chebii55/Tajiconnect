import React from 'react';
import type { SkillGap } from '../../services/api/types';
import { Target, TrendingUp, Clock } from 'lucide-react';

interface SkillGapAnalysisProps {
  skillGaps: SkillGap[];
  isLoading?: boolean;
}

const SkillGapAnalysis: React.FC<SkillGapAnalysisProps> = ({ skillGaps, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (skillGaps.length === 0) {
    return (
      <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow p-6 text-center">
        <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          No Skill Gaps Identified
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Complete more assessments to get AI-powered skill gap analysis
        </p>
      </div>
    );
  }

  const getGapSeverity = (gap: SkillGap) => {
    const difference = gap.target_level - gap.current_level;
    if (difference >= 40) return { color: 'text-red-600', bg: 'bg-red-100', label: 'Critical' };
    if (difference >= 20) return { color: 'text-orange-600', bg: 'bg-orange-100', label: 'High' };
    return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Medium' };
  };

  return (
    <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          AI Skill Gap Analysis
        </h3>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {skillGaps.slice(0, 5).map((gap, index) => {
            const severity = getGapSeverity(gap);
            const progressPercentage = (gap.current_level / gap.target_level) * 100;
            
            return (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200">
                      {gap.skill_name}
                    </h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                      <span>Current: {gap.current_level}%</span>
                      <span>Target: {gap.target_level}%</span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Priority: {Math.round(gap.priority * 100)}%
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${severity.bg} ${severity.color}`}>
                    {severity.label}
                  </span>
                </div>
                
                <div className="mb-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress to Target</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    />
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Est. {Math.ceil((gap.target_level - gap.current_level) / 10)} weeks
                  </span>
                  <span>Gap: {gap.target_level - gap.current_level} points</span>
                </div>
              </div>
            );
          })}
        </div>
        
        {skillGaps.length > 5 && (
          <div className="mt-4 text-center">
            <button className="text-primary hover:text-primary-dark text-sm font-medium">
              View All {skillGaps.length} Skill Gaps
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillGapAnalysis;
