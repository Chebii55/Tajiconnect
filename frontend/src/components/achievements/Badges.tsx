import React from 'react';

const Badges: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-6">Badges</h1>
      <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow-sm p-6">
        <p className="text-gray-600 dark:text-darkMode-textSecondary">Your earned badges will appear here.</p>
      </div>
    </div>
  );
};

export default Badges;
