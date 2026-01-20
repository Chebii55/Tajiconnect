import React from 'react';

const Recommendations: React.FC = () => {
  return (
    <div className="p-6 bg-neutral-light dark:bg-darkMode-bg min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-primary dark:text-darkMode-text font-heading">Course Recommendations</h1>
      <div className="card-modern p-6 dark:bg-darkMode-surface dark:border-darkMode-border">
        <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary">Personalized course recommendations based on your profile.</p>
      </div>
    </div>
  );
};

export default Recommendations;
