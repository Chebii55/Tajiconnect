import React, { useEffect, useState } from 'react';
import { Award, CheckCircle } from 'lucide-react';
import { userService } from '../../services/api/user';
import type { Achievement } from '../../services/api/user';

const Badges: React.FC = () => {
  const [badges, setBadges] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadBadges = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await userService.getMyAchievements();
        if (!isMounted) return;
        setBadges(data.filter((item) => item.achievement_type === 'badge'));
      } catch (err) {
        console.error('Failed to load badges:', err);
        if (!isMounted) return;
        setError('Unable to load badges right now.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadBadges();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-6">Badges</h1>
      {loading && (
        <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-600 dark:text-darkMode-textSecondary">Loading badges...</p>
        </div>
      )}
      {!loading && error && (
        <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow-sm p-6 text-center">
          <p className="text-red-600 dark:text-darkMode-error">{error}</p>
        </div>
      )}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.length === 0 ? (
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow-sm p-6 text-center md:col-span-2 lg:col-span-3">
              <p className="text-gray-600 dark:text-darkMode-textSecondary">No badges earned yet.</p>
            </div>
          ) : (
            badges.map((badge) => (
              <div key={badge.id} className="bg-white dark:bg-darkMode-surface rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-3">
                  <Award className="w-6 h-6 text-primary-dark dark:text-darkMode-accent" />
                  {badge.status === 'earned' && (
                    <span className="inline-flex items-center gap-1 text-xs text-secondary dark:text-darkMode-success">
                      <CheckCircle className="w-3 h-3" /> Earned
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-primary-dark dark:text-darkMode-text">{badge.title}</h3>
                {badge.description && (
                  <p className="text-sm text-gray-600 dark:text-darkMode-textSecondary mt-1">{badge.description}</p>
                )}
                <div className="text-xs text-gray-500 dark:text-darkMode-textMuted mt-3">
                  {badge.earned_at ? new Date(badge.earned_at).toLocaleDateString() : 'Not earned yet'}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Badges;
