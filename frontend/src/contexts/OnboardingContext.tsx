/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

// ============================================
// LEARNER PROFILE TYPES (Psychometric Assessment)
// ============================================

export type Motivation = 'school' | 'culture' | 'communication' | 'travel' | 'personal'
export type Level = 'new' | 'few_words' | 'sentences'
export type LearningStyleType = 'listening' | 'watching' | 'reading' | 'mixed'
export type TimeCommitmentType = 'short' | 'medium' | 'flexible'
export type Archetype = 'structured' | 'cultural_explorer' | 'casual' | 'conversational'

export interface LearnerProfile {
  motivation: Motivation
  level: Level
  learningStyle: LearningStyleType
  timeCommitment: TimeCommitmentType
  targetLanguage: string
  archetype?: Archetype
}

// ============================================
// ONBOARDING DATA INTERFACE
// ============================================

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

  // PWD Information
  isPWD: boolean;
  impairmentType: string;

  // Parent/Guardian Information (conditional)
  requiresParentInfo: boolean;
  parentGuardian: {
    name: string;
    email: string;
    phone: string;
    relationship: string;
  };

  // Photo and Documents
  profilePhoto: string | null;
  educationLevel: string;
  educationDocuments: File[];

  // Hobbies and Talents
  hobbies: string[];
  talents: string[];

  // Assessment data
  primaryInterest: string;
  learningStyle: string;
  goals: string;
  timeCommitment: string;

  // Psychometric data (legacy)
  personalityType?: string
  strengths?: string[]

  // Learner Profile (new psychometric assessment)
  learnerProfile?: LearnerProfile

  // Consents
  termsAccepted: boolean;
  privacyAccepted: boolean;
  dataConsentAccepted: boolean;
  mediaConsentAccepted: boolean;
  newsletterOptIn: boolean;

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

  isPWD: false,
  impairmentType: '',

  requiresParentInfo: false,
  parentGuardian: {
    name: '',
    email: '',
    phone: '',
    relationship: ''
  },

  profilePhoto: null,
  educationLevel: '',
  educationDocuments: [],

  hobbies: [],
  talents: [],

  primaryInterest: '',
  learningStyle: '',
  goals: '',
  timeCommitment: '',

  termsAccepted: false,
  privacyAccepted: false,
  dataConsentAccepted: false,
  mediaConsentAccepted: false,
  newsletterOptIn: false,

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
    setData(prev => {
      const newData = { ...prev, ...updates };
      
      // Auto-calculate age when dateOfBirth changes
      if (updates.dateOfBirth) {
        const birthDate = new Date(updates.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear() - 
          (today.getMonth() < birthDate.getMonth() || 
           (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate()) ? 1 : 0);
        newData.age = age;
        newData.requiresParentInfo = age < 18;
      }
      
      return newData;
    });
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