import React from 'react';

const JobMatchingQuiz: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-6">Job Matching Quiz</h1>
      <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow-sm p-6">
        <p className="text-gray-600 dark:text-darkMode-textSecondary">Take our quiz to find jobs that match your interests.</p>
      </div>
    </div>
  );
};

export default JobMatchingQuiz;
