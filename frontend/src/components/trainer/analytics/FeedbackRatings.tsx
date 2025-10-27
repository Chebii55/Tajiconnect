import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MessageSquare } from 'lucide-react';

const FeedbackRatings: React.FC = () => {
  const navigate = useNavigate();

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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Feedback & Ratings</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  View learner feedback and course ratings
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          <div className="text-center py-12">
            <Star className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Feedback Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Learner feedback and rating analytics coming soon
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackRatings;