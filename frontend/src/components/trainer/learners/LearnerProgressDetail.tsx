import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrainer } from '../../../contexts/TrainerContext';
import {
  ArrowLeft,
  TrendingUp,
  Clock,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Calendar,
  BarChart3
} from 'lucide-react';

const LearnerProgressDetail: React.FC = () => {
  const { learnerId } = useParams();
  const navigate = useNavigate();
  const { learners, courses } = useTrainer();

  const learner = learners.find(l => l.id === learnerId);

  if (!learner) {
    return (
      <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mb-2">Learner Not Found</h2>
          <button
            onClick={() => navigate('/trainer/learners')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Back to Learners
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg font-['Inter']">
      {/* Header */}
      <div className="bg-neutral-white dark:bg-darkMode-surface shadow-sm border-b dark:border-darkMode-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/trainer/learners/${learnerId}`)}
                className="p-2 text-forest-sage hover:text-neutral-dark dark:text-darkMode-textSecondary dark:hover:text-darkMode-text rounded-lg hover:bg-neutral-gray dark:hover:bg-darkMode-navbar"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text">Progress Details</h1>
                <p className="text-forest-sage dark:text-darkMode-textSecondary mt-1">
                  {learner.name} • Detailed learning analytics
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-8">
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-forest-sage dark:text-darkMode-textMuted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-dark dark:text-darkMode-text mb-2">Detailed Progress Analytics</h3>
            <p className="text-forest-sage dark:text-darkMode-textSecondary">
              Advanced progress tracking and analytics coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerProgressDetail;
