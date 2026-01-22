import React, { useState } from 'react';
// import type { ContentRecommendation } from '../../services/api/types';

// Temporary inline type
interface ContentRecommendation {
  content_id: string;
  content_type: string;
  recommendation_type: string;
  relevance_score: number;
  engagement_prediction: number;
  reasoning: {
    explanation: string;
    primary_factors: string[];
  };
}
import { useRecommendations } from '../../contexts/RecommendationsContext';
import { ThumbsUp, ThumbsDown, Star, MessageSquare } from 'lucide-react';

interface RecommendationFeedbackProps {
  recommendation: ContentRecommendation;
  onFeedbackSubmitted?: () => void;
}

const RecommendationFeedback: React.FC<RecommendationFeedbackProps> = ({ 
  recommendation, 
  onFeedbackSubmitted 
}) => {
  const { logInteraction } = useRecommendations();
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedback = async (type: 'positive' | 'negative') => {
    setFeedback(type);
    await logInteraction(recommendation.content_id, `feedback_${type}`);
  };

  const handleRating = async (stars: number) => {
    setRating(stars);
    await logInteraction(recommendation.content_id, `rating_${stars}`);
  };

  const submitDetailedFeedback = async () => {
    if (!comment.trim()) return;
    
    setIsSubmitting(true);
    try {
      await logInteraction(recommendation.content_id, 'detailed_feedback');
      setComment('');
      onFeedbackSubmitted?.();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500">Was this helpful?</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleFeedback('positive')}
            className={`p-1 rounded ${feedback === 'positive' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-green-600'}`}
          >
            <ThumbsUp className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleFeedback('negative')}
            className={`p-1 rounded ${feedback === 'negative' ? 'bg-red-100 text-red-600' : 'text-gray-400 hover:text-red-600'}`}
          >
            <ThumbsDown className="w-3 h-3" />
          </button>
        </div>
      </div>

      {feedback && (
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                className={`${rating >= star ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}
              >
                <Star className="w-3 h-3" fill="currentColor" />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="flex-1 text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={submitDetailedFeedback}
              disabled={!comment.trim() || isSubmitting}
              className="text-xs bg-primary text-white px-2 py-1 rounded disabled:opacity-50"
            >
              <MessageSquare className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationFeedback;
