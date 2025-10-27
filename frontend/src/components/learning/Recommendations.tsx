import React from 'react';

const Recommendations: React.FC = () => {
  return (
    <div className="p-6 bg-neutral-light min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-primary font-heading">Course Recommendations</h1>
      <div className="card-modern p-6">
        <p className="text-neutral-dark/80">Personalized course recommendations based on your profile.</p>
      </div>
    </div>
  );
};

export default Recommendations;