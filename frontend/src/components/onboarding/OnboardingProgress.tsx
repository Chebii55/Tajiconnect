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
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[#3DAEDB] to-[#2C857A] h-2 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="absolute top-0 right-0 text-sm font-medium text-[#2C857A] mt-3">
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
                    ? 'bg-[#4A9E3D] text-white shadow-lg'
                    : isCurrent
                    ? 'bg-[#3DAEDB] text-white shadow-lg animate-pulse'
                    : 'bg-gray-200 text-gray-400'
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
                    ? 'text-[#1C3D6E]'
                    : 'text-gray-400'
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