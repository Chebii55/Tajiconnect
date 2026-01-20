import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrainer } from '../../../contexts/TrainerContext';
import {
  ArrowLeft,
  Activity,
  Clock,
  Users,
  TrendingUp,
  Calendar,
  Filter,
  Download,
  BarChart3
} from 'lucide-react';

const LearnerEngagement: React.FC = () => {
  const navigate = useNavigate();
  const { learners } = useTrainer();

  const [timeRange, setTimeRange] = useState('30d');

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg font-['Inter']">
      {/* Header */}
      <div className="bg-neutral-white dark:bg-darkMode-surface shadow-sm border-b dark:border-darkMode-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/trainer/analytics')}
                className="p-2 text-forest-sage hover:text-neutral-dark dark:text-darkMode-textSecondary dark:hover:text-darkMode-text rounded-lg hover:bg-neutral-light dark:hover:bg-darkMode-navbar"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text">Learner Engagement</h1>
                <p className="text-forest-sage dark:text-darkMode-textSecondary mt-1">
                  Track learner activity and engagement patterns
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-neutral-dark dark:text-darkMode-text border border-neutral-gray dark:border-darkMode-border rounded-lg hover:bg-neutral-light dark:hover:bg-darkMode-navbar flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-8">
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-forest-sage dark:text-darkMode-textMuted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-dark dark:text-darkMode-text mb-2">Engagement Analytics</h3>
            <p className="text-forest-sage dark:text-darkMode-textSecondary">
              Detailed engagement tracking and analytics coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerEngagement;
