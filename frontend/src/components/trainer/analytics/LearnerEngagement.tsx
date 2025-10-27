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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-['Inter']">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/trainer/analytics')}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Learner Engagement</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Track learner activity and engagement patterns
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          <div className="text-center py-12">
            <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Engagement Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Detailed engagement tracking and analytics coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnerEngagement;