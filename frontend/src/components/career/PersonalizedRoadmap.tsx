import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { learningPathsApi } from '../../services/api/learningPaths';
import type { LearningPath, LearningPathModule } from '../../services/api/types';
import { getUserId } from '../../utils/auth';
import {
  ArrowLeft,
  Clock,
  Target,
  CheckCircle,
  TrendingUp,
  Lightbulb
} from 'lucide-react';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const PersonalizedRoadmap = () => {
  const { careerPath } = useParams();
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState<LearningPath | null>(null);
  const [modules, setModules] = useState<LearningPathModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        setLoading(true);
        setError(null);
        const userId = getUserId();
        if (!userId) {
          throw new Error('User not authenticated');
        }

        const paths = await learningPathsApi.getUserPaths(userId);
        const match = careerPath
          ? paths.find((path) => slugify(path.path_name) === careerPath)
          : paths[0];

        if (!match) {
          setRoadmap(null);
          setModules([]);
          return;
        }

        setRoadmap(match);
        const pathModules = await learningPathsApi.getPathModules(match.id);
        setModules(pathModules);
      } catch (err: any) {
        console.error('Error fetching roadmap:', err);
        setError(err?.message || 'Failed to load roadmap');
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [careerPath]);

  const completion = useMemo(() => {
    if (!roadmap) return 0;
    return Math.round(roadmap.completion_percentage || 0);
  }, [roadmap]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="flex">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your personalized roadmap...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="flex">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Roadmap Error</h1>
              <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="flex">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Roadmap Not Found</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                We couldn&apos;t find a roadmap for this career path.
              </p>
              <button
                onClick={() => navigate('/student/career/assessment')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Take Career Assessment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {roadmap.path_name}
            </h1>
            {roadmap.description ? (
              <p className="text-gray-600 dark:text-gray-300">{roadmap.description}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Target className="w-6 h-6 text-blue-600" />
                <span className="text-2xl font-bold text-blue-600">{completion}%</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Overall Progress</p>
            </div>
            <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-6 h-6 text-purple-600" />
                <span className="text-2xl font-bold text-purple-600">
                  {roadmap.total_estimated_hours}h
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Hours</p>
            </div>
            <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <span className="text-2xl font-bold text-green-600">
                  {roadmap.total_modules}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Modules</p>
            </div>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Roadmap Modules
            </h2>
            <div className="space-y-4">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="border border-gray-200 dark:border-darkMode-border rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {module.title}
                      </h3>
                      {module.description ? (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {module.description}
                        </p>
                      ) : null}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        module.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : module.status === 'in_progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {module.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {Math.round(module.estimated_duration_minutes / 60)}h
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      {module.learning_objectives?.length || 0} objectives
                    </span>
                  </div>

                  {module.learning_objectives?.length ? (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                        Objectives
                      </p>
                      <ul className="mt-2 list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        {module.learning_objectives.map((objective) => (
                          <li key={objective}>{objective}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            {modules.length === 0 && (
              <div className="text-center py-8 text-gray-600 dark:text-gray-300">
                No modules are available for this roadmap yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedRoadmap;
