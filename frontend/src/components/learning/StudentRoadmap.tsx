import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../ui/LoadingSpinner';
import { learningPathsApi } from '../../services/api/learningPaths';
import type { LearningPath, LearningPathModule } from '../../services/api/types';
import { getUserId } from '../../utils/auth';
import {
  Map,
  Target,
  Calendar,
  BookOpen,
  Clock,
  TrendingUp,
  ChevronRight,
  BarChart3
} from 'lucide-react';

const StudentRoadmap: React.FC = () => {
  const [path, setPath] = useState<LearningPath | null>(null);
  const [modules, setModules] = useState<LearningPathModule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRoadmap = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userId = getUserId();
        if (!userId) {
          throw new Error('User not authenticated');
        }

        const activePath = await learningPathsApi.getActivePath(userId);
        setPath(activePath);
        const pathModules = await learningPathsApi.getPathModules(activePath.id);
        setModules(pathModules);
      } catch (err: any) {
        console.error('Failed to load learning path:', err);
        setError(err?.message || 'Unable to load learning path');
        setPath(null);
        setModules([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadRoadmap();
  }, []);

  const stats = useMemo(() => {
    if (!path) {
      return {
        totalModules: 0,
        completedModules: 0,
        completionPercentage: 0,
        totalHours: 0,
        estimatedCompletion: null as string | null,
      };
    }

    const completedModules = modules.filter((module) => module.status === 'completed').length;
    const estimatedCompletion = path.estimated_duration_weeks
      ? new Date(
          Date.now() + path.estimated_duration_weeks * 7 * 24 * 60 * 60 * 1000
        ).toLocaleDateString()
      : null;

    return {
      totalModules: path.total_modules || modules.length,
      completedModules,
      completionPercentage: Math.round(path.completion_percentage || 0),
      totalHours: path.total_estimated_hours,
      estimatedCompletion,
    };
  }, [path, modules]);

  const currentModule = useMemo(() => {
    if (!path) return null;
    const byIndex = modules.find(
      (module) => module.sequence_order === path.current_module_index
    );
    return byIndex || modules[path.current_module_index] || modules[0] || null;
  }, [modules, path]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-light to-primary/10 dark:from-darkMode-bg dark:to-darkMode-surface flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading your learning roadmap..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-light to-primary/10 dark:from-darkMode-bg dark:to-darkMode-surface flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-light to-primary/10 dark:from-darkMode-bg dark:to-darkMode-surface flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">
            No Active Roadmap
          </h1>
          <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary mb-6">
            You don&apos;t have an active learning path yet.
          </p>
          <Link to="/student/courses" className="btn-primary inline-flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Browse Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light to-primary/10 dark:from-darkMode-bg dark:to-darkMode-surface font-['Inter']">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary-dark dark:bg-darkMode-navbar rounded-lg">
              <Map className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-primary-dark dark:text-darkMode-text">
                Learning Roadmap
              </h1>
              <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary">
                Your personalized path to success
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-4 border-l-4 border-secondary dark:border-darkMode-success">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">Modules</p>
                <p className="text-xl font-bold text-primary-dark dark:text-darkMode-text">
                  {stats.completedModules}/{stats.totalModules}
                </p>
              </div>
              <Target className="w-6 h-6 text-secondary dark:text-darkMode-success" />
            </div>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-4 border-l-4 border-primary-light dark:border-darkMode-accent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">Completion</p>
                <p className="text-xl font-bold text-primary-dark dark:text-darkMode-text">
                  {stats.completionPercentage}%
                </p>
              </div>
              <TrendingUp className="w-6 h-6 text-primary-light dark:text-darkMode-accent" />
            </div>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-4 border-l-4 border-purple-500 dark:border-purple-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">Est. Completion</p>
                <p className="text-xl font-bold text-primary-dark dark:text-darkMode-text">
                  {stats.estimatedCompletion || '—'}
                </p>
              </div>
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-4 border-l-4 border-pink-500 dark:border-pink-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">Total Hours</p>
                <p className="text-xl font-bold text-primary-dark dark:text-darkMode-text">
                  {stats.totalHours}h
                </p>
              </div>
              <Clock className="w-6 h-6 text-pink-600 dark:text-pink-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6">
          <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-6">
            Your Learning Journey
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-primary-dark to-primary-light dark:from-darkMode-navbar dark:to-darkMode-progress rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Current Learning Path</h3>
              <p className="text-blue-100 dark:text-darkMode-textSecondary mb-4">{path.path_name}</p>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{stats.completionPercentage}%</span>
                </div>
                <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full"
                    style={{ width: `${stats.completionPercentage}%` }}
                  ></div>
                </div>
              </div>
              <Link
                to="/student/roadmap/learning-path"
                className="inline-flex items-center gap-2 mt-4 text-white hover:text-blue-100 dark:hover:text-darkMode-accent transition-colors"
              >
                View Details <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-white dark:bg-darkMode-surface border border-gray-200 dark:border-darkMode-border rounded-xl p-6">
              <h3 className="text-xl font-bold text-primary-dark dark:text-darkMode-text mb-4">
                Current Module
              </h3>
              {currentModule ? (
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-info dark:text-darkMode-link mt-1" />
                    <div>
                      <h4 className="font-semibold text-neutral-dark dark:text-darkMode-text">
                        {currentModule.title}
                      </h4>
                      <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary text-sm">
                        Estimated {Math.round(currentModule.estimated_duration_minutes / 60)} hours
                      </p>
                      {currentModule.learning_objectives?.length ? (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {currentModule.learning_objectives.slice(0, 3).map((objective) => (
                            <span
                              key={objective}
                              className="px-2 py-1 bg-info/10 dark:bg-darkMode-link/20 text-info dark:text-darkMode-link text-xs rounded-full"
                            >
                              {objective}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary text-sm">
                  No module details available.
                </p>
              )}
              <Link
                to="/student/roadmap/milestones"
                className="inline-flex items-center gap-2 mt-4 text-primary-light dark:text-darkMode-accent hover:text-primary-dark dark:hover:text-darkMode-accentHover transition-colors"
              >
                View All Modules <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Link
              to="/student/courses"
              className="flex items-center gap-3 p-4 bg-neutral-light dark:bg-darkMode-surfaceHover rounded-xl hover:shadow-lg dark:hover:shadow-dark transition-shadow"
            >
              <BookOpen className="w-8 h-8 text-secondary dark:text-darkMode-success" />
              <div>
                <h4 className="font-semibold text-primary-dark dark:text-darkMode-text">Browse Courses</h4>
                <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary text-sm">
                  Explore available courses
                </p>
              </div>
            </Link>

            <Link
              to="/student/assessments"
              className="flex items-center gap-3 p-4 bg-neutral-light dark:bg-darkMode-surfaceHover rounded-xl hover:shadow-lg dark:hover:shadow-dark transition-shadow"
            >
              <Target className="w-8 h-8 text-primary-light dark:text-darkMode-accent" />
              <div>
                <h4 className="font-semibold text-primary-dark dark:text-darkMode-text">Take Assessment</h4>
                <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary text-sm">
                  Test your skills
                </p>
              </div>
            </Link>

            <Link
              to="/student/progress/analytics"
              className="flex items-center gap-3 p-4 bg-neutral-light dark:bg-darkMode-surfaceHover rounded-xl hover:shadow-lg dark:hover:shadow-dark transition-shadow"
            >
              <BarChart3 className="w-8 h-8 text-forest-sage dark:text-darkMode-success" />
              <div>
                <h4 className="font-semibold text-primary-dark dark:text-darkMode-text">View Analytics</h4>
                <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary text-sm">
                  Track your progress
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRoadmap;
