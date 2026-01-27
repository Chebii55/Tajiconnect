import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { GeneratedLearningPath, LearningPath } from '../services/api/types';
import { learningPathsApi } from '../services/api/learningPaths';
import { handleApiError } from '../utils/errorHandler';

interface LearningPathContextType {
  userPaths: LearningPath[];
  currentPath: LearningPath | null;
  isLoading: boolean;
  error: string | null;
  generatePath: (preferences?: any) => Promise<GeneratedLearningPath | null>;
  getUserPaths: () => Promise<void>;
  setCurrentPath: (pathId: string) => void;
  createAdaptation: (pathId: string, adaptationData: any) => Promise<void>;
}

const LearningPathContext = createContext<LearningPathContextType | undefined>(undefined);

export const useLearningPath = () => {
  const context = useContext(LearningPathContext);
  if (!context) {
    throw new Error('useLearningPath must be used within a LearningPathProvider');
  }
  return context;
};

interface LearningPathProviderProps {
  children: ReactNode;
}

export const LearningPathProvider: React.FC<LearningPathProviderProps> = ({ children }) => {
  const [userPaths, setUserPaths] = useState<LearningPath[]>([]);
  const [currentPath, setCurrentPathState] = useState<LearningPath | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = localStorage.getItem('user_id') || 'temp_user';

  const generatePath = async (preferences?: any): Promise<GeneratedLearningPath | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const path = await learningPathsApi.generatePath(userId, preferences);
      return path;
    } catch (err: any) {
      setError(handleApiError(err));
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserPaths = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const paths = await learningPathsApi.getUserPaths(userId);
      setUserPaths(paths);
      
      // Set current path if stored in localStorage
      const currentPathId = localStorage.getItem('current_learning_path');
      if (currentPathId) {
        const current = paths.find(p => p.id === currentPathId);
        if (current) {
          setCurrentPathState(current);
        }
      }
    } catch (err: any) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  const setCurrentPath = (pathId: string) => {
    const path = userPaths.find(p => p.id === pathId);
    if (path) {
      setCurrentPathState(path);
      localStorage.setItem('current_learning_path', pathId);
    }
  };

  const createAdaptation = async (pathId: string, adaptationData: any) => {
    try {
      await learningPathsApi.createAdaptation(pathId, adaptationData);
      // Refresh user paths to get updated data
      await getUserPaths();
    } catch (err: any) {
      setError(handleApiError(err));
    }
  };

  useEffect(() => {
    getUserPaths();
  }, []);

  const value: LearningPathContextType = {
    userPaths,
    currentPath,
    isLoading,
    error,
    generatePath,
    getUserPaths,
    setCurrentPath,
    createAdaptation
  };

  return (
    <LearningPathContext.Provider value={value}>
      {children}
    </LearningPathContext.Provider>
  );
};
