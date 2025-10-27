/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface OnboardingData {
  // Registration data
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  age: number;

  // Profile data
  phone: string;
  gender: string;
  interests: string[];

  // Assessment data
  educationLevel: string;
  primaryInterest: string;
  learningStyle: string;
  goals: string;
  timeCommitment: string;

  // Psychometric data
  personalityType?: string;
  strengths?: string[];

  // Progress tracking
  currentStep: number;
  completedSteps: number[];
  isComplete: boolean;
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  nextStep: () => void;
  setCurrentStep: (step: number) => void;
  markStepComplete: (step: number) => void;
  resetOnboarding: () => void;
}

const initialData: OnboardingData = {
  firstName: '',
  lastName: '',
  email: '',
  dateOfBirth: '',
  age: 0,
  phone: '',
  gender: '',
  interests: [],
  educationLevel: '',
  primaryInterest: '',
  learningStyle: '',
  goals: '',
  timeCommitment: '',
  currentStep: 0,
  completedSteps: [],
  isComplete: false,
};

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

interface OnboardingProviderProps {
  children: ReactNode;
}

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [data, setData] = useState<OnboardingData>(initialData);

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    setData(prev => ({
      ...prev,
      currentStep: prev.currentStep + 1,
      completedSteps: [...prev.completedSteps, prev.currentStep]
    }));
  };

  const setCurrentStep = (step: number) => {
    setData(prev => ({ ...prev, currentStep: step }));
  };

  const markStepComplete = (step: number) => {
    setData(prev => ({
      ...prev,
      completedSteps: [...prev.completedSteps.filter(s => s !== step), step]
    }));
  };

  const resetOnboarding = () => {
    setData(initialData);
  };

  return (
    <OnboardingContext.Provider
      value={{
        data,
        updateData,
        nextStep,
        setCurrentStep,
        markStepComplete,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};