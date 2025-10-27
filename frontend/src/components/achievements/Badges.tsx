import React from 'react';

const Badges: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-6">Badges</h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <p className="text-gray-600 dark:text-gray-300">Your earned badges will appear here.</p>
      </div>
    </div>
  );
};

export default Badges;