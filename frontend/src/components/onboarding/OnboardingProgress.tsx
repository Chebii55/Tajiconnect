import React from 'react';
import { Check, Circle } from 'lucide-react';

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

const OnboardingProgress: React.FC<OnboardingProgressProps> = ({
  currentStep,
  totalSteps,
  stepLabels
}) => {
  const progressPercentage = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Progress Bar */}
      <div className="relative mb-6">
        <div className="w-full bg-neutral-gray dark:bg-darkMode-border rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary-light to-forest-sage dark:from-darkMode-progress dark:to-darkMode-success h-2 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="absolute top-0 right-0 text-sm font-medium text-forest-sage dark:text-darkMode-accent mt-3">
          {currentStep + 1} of {totalSteps}
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-center">
        {stepLabels.map((label, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div
              key={index}
              className={`flex flex-col items-center transition-all duration-500 ${
                isCurrent ? 'scale-110' : ''
              }`}
            >
              {/* Step Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  isCompleted
                    ? 'bg-secondary dark:bg-darkMode-success text-white shadow-lg dark:shadow-dark'
                    : isCurrent
                    ? 'bg-primary-light dark:bg-darkMode-progress text-white shadow-lg dark:shadow-dark animate-pulse'
                    : 'bg-neutral-gray dark:bg-darkMode-border text-neutral-dark/40 dark:text-darkMode-textMuted'
                }`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <Circle className={`w-4 h-4 ${isCurrent ? 'fill-current' : ''}`} />
                )}
              </div>

              {/* Step Label */}
              <span
                className={`text-xs font-medium mt-2 text-center transition-colors duration-300 ${
                  isCompleted || isCurrent
                    ? 'text-primary-dark dark:text-darkMode-text'
                    : 'text-neutral-dark/40 dark:text-darkMode-textMuted'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingProgress;
