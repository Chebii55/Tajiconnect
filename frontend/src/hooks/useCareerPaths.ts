import { useState, useEffect } from 'react';

interface CareerPath {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  skills: string[];
  averageSalary: string;
  jobGrowth: string;
  prerequisites: string[];
  learningPath: string[];
}

export const useCareerPaths = () => {
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCareerPaths = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/careerPaths');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch career paths');
      }

      // Handle different response formats
      const paths = Array.isArray(data) ? data : data.careerPaths || [];
      setCareerPaths(paths);
      return paths;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCareerPathById = (id: string) => {
    return careerPaths.find(path => path.id === id);
  };

  const getCareerPathsByCategory = (category: string) => {
    return careerPaths.filter(path => 
      path.category.toLowerCase() === category.toLowerCase()
    );
  };

  const searchCareerPaths = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return careerPaths.filter(path =>
      path.title.toLowerCase().includes(lowercaseQuery) ||
      path.description.toLowerCase().includes(lowercaseQuery) ||
      path.skills.some(skill => skill.toLowerCase().includes(lowercaseQuery))
    );
  };

  useEffect(() => {
    fetchCareerPaths();
  }, []);

  return {
    careerPaths,
    loading,
    error,
    fetchCareerPaths,
    getCareerPathById,
    getCareerPathsByCategory,
    searchCareerPaths,
  };
};

export type { CareerPath };