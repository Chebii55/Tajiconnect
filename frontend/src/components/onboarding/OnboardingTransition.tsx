import React, { useEffect, useState } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface OnboardingTransitionProps {
  fromStep: string;
  toStep: string;
  message: string;
  onComplete: () => void;
  duration?: number;
}

const OnboardingTransition: React.FC<OnboardingTransitionProps> = ({
  fromStep,
  toStep,
  message,
  onComplete,
  duration = 2000
}) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setIsComplete(true);
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + (100 / (duration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#1C3D6E]/90 to-[#3DAEDB]/90 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 text-center animate-fade-in">
        {/* Success Icon */}
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-500 ${
          isComplete ? 'bg-[#4A9E3D] scale-110' : 'bg-[#3DAEDB]'
        }`}>
          {isComplete ? (
            <CheckCircle className="w-8 h-8 text-white" />
          ) : (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
        </div>

        {/* Step Transition */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-600">
            {fromStep}
          </span>
          <ArrowRight className="w-5 h-5 text-[#3DAEDB]" />
          <span className="px-3 py-1 bg-[#3DAEDB]/10 rounded-full text-sm font-medium text-[#1C3D6E]">
            {toStep}
          </span>
        </div>

        {/* Message */}
        <h3 className="text-xl font-bold text-[#1C3D6E] mb-2">
          {isComplete ? 'Complete!' : 'Processing...'}
        </h3>
        <p className="text-gray-600 mb-6">
          {message}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-gradient-to-r from-[#3DAEDB] to-[#2C857A] h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm text-gray-500">
          {Math.round(progress)}% complete
        </p>
      </div>
    </div>
  );
};

export default OnboardingTransition;