import React, { useEffect, useState } from 'react';
import { X, Award, Star, Sparkles } from 'lucide-react';
import { Badge } from '../../../types/course';

interface BadgeAwardModalProps {
  badge: Badge;
  onClose: () => void;
}

const BadgeAwardModal: React.FC<BadgeAwardModalProps> = ({ badge, onClose }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getRarityColors = () => {
    switch (badge.rarity) {
      case 'common':
        return {
          bg: 'from-green-400 to-teal-500',
          text: 'text-green-600 dark:text-green-400',
          badge: 'bg-green-100 dark:bg-green-900/30',
        };
      case 'rare':
        return {
          bg: 'from-blue-400 to-indigo-500',
          text: 'text-blue-600 dark:text-blue-400',
          badge: 'bg-blue-100 dark:bg-blue-900/30',
        };
      case 'epic':
        return {
          bg: 'from-purple-400 to-pink-500',
          text: 'text-purple-600 dark:text-purple-400',
          badge: 'bg-purple-100 dark:bg-purple-900/30',
        };
      case 'legendary':
        return {
          bg: 'from-yellow-400 to-orange-500',
          text: 'text-yellow-600 dark:text-yellow-400',
          badge: 'bg-yellow-100 dark:bg-yellow-900/30',
        };
    }
  };

  const colors = getRarityColors();

  const getBadgeIcon = () => {
    switch (badge.icon) {
      case 'foundation':
        return <Award className="w-16 h-16 text-white" />;
      case 'growth':
        return <Sparkles className="w-16 h-16 text-white" />;
      case 'mastery':
        return <Star className="w-16 h-16 text-white" />;
      default:
        return <Award className="w-16 h-16 text-white" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div
        className={`relative bg-white dark:bg-darkMode-surface rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all duration-500 ${
          showContent ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Confetti Background */}
        <div className={`relative bg-gradient-to-br ${colors.bg} p-8 text-center`}>
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                <Sparkles className="w-4 h-4 text-white/30" />
              </div>
            ))}
          </div>

          {/* Badge Icon */}
          <div className="relative">
            <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm mb-4 animate-pulse">
              {getBadgeIcon()}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Badge Earned!</h2>
          <p className="text-white/80">Congratulations on your achievement!</p>
        </div>

        {/* Badge Details */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colors.badge} ${colors.text} mb-3`}>
              {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
            </div>
            <h3 className="text-xl font-bold text-primary-dark dark:text-darkMode-text mb-2">
              {badge.name}
            </h3>
            <p className="text-gray-600 dark:text-darkMode-textSecondary">
              {badge.description}
            </p>
          </div>

          {/* Points */}
          <div className="flex items-center justify-center gap-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg mb-6">
            <Star className="w-6 h-6 text-yellow-500" />
            <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              +{badge.points}
            </span>
            <span className="text-yellow-600 dark:text-yellow-400 font-medium">points</span>
          </div>

          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full py-3 px-6 bg-primary dark:bg-darkMode-link text-white font-medium rounded-lg hover:bg-primary-dark dark:hover:bg-darkMode-linkHover transition-colors"
          >
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  );
};

export default BadgeAwardModal;
