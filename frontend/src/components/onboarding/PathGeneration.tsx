import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { learningPathsApi } from '../../services/api/learningPaths';
import type { GeneratedLearningPath } from '../../services/api/types';
import { handleApiError } from '../../utils/errorHandler';
import LoadingSpinner from '../ui/LoadingSpinner';
import { Clock, BookOpen, Target, ChevronRight } from 'lucide-react';

const PathGeneration: React.FC = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPath, setGeneratedPath] = useState<GeneratedLearningPath | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateLearningPath();
  }, []);

  const generateLearningPath = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const userId = localStorage.getItem('user_id') || 'temp_user';
      const path = await learningPathsApi.generatePath(userId, {
        focus_areas: ['grammar', 'vocabulary', 'communication'],
        max_duration_weeks: 16
      });
      
      setGeneratedPath(path);
    } catch (err: any) {
      setError(handleApiError(err));
    } finally {
      setIsGenerating(false);
    }
  };

  const acceptPath = () => {
    // Store the accepted path and navigate to dashboard
    if (generatedPath) {
      localStorage.setItem('current_learning_path', generatedPath.id);
      navigate('/student/dashboard');
    }
  };

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-light to-primary/10 dark:from-darkMode-bg dark:to-darkMode-surface flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <LoadingSpinner size="lg" message="Generating your personalized learning path..." />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Our AI is creating a customized learning journey based on your profile
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-light to-primary/10 dark:from-darkMode-bg dark:to-darkMode-surface flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Generation Failed
            </h3>
            <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
            <button
              onClick={generateLearningPath}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!generatedPath) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light to-primary/10 dark:from-darkMode-bg dark:to-darkMode-surface py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-primary-dark dark:text-darkMode-text mb-2">
            Your AI-Generated Learning Path
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Personalized based on your psychometric profile and learning preferences
          </p>
        </div>

        {/* Path Overview */}
        <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">
            {generatedPath.path_name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {generatedPath.goal}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm">
                {generatedPath.estimated_total_hours} hours
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span className="text-sm capitalize">
                {generatedPath.difficulty_progression}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-sm">
                {generatedPath.total_courses} courses
              </span>
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-4 mb-8">
          <h3 className="text-xl font-bold text-primary-dark dark:text-darkMode-text">
            Learning Modules
          </h3>
          {generatedPath.recommended_courses.map((course, index) => (
            <div key={course.course_id} className="bg-white dark:bg-darkMode-surface rounded-lg shadow p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {course.position || index + 1}
                    </span>
                    <h4 className="font-semibold text-primary-dark dark:text-darkMode-text">
                      {course.title}
                    </h4>
                  </div>
                  <div className="ml-11">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {course.estimated_duration_hours} hours • Difficulty: {course.difficulty_level}
                    </p>
                    <div className="text-xs text-gray-500">
                      {course.rationale}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/onboarding/psychometric')}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Regenerate Path
          </button>
          <button
            onClick={acceptPath}
            className="px-8 py-3 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors font-semibold"
          >
            Start Learning Journey
          </button>
        </div>
      </div>
    </div>
  );
};

export default PathGeneration;
