import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Learner {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  enrolledCourses: string[];
  progress: {
    courseId: string;
    courseName: string;
    completionPercentage: number;
    lastActivity: string;
    timeSpent: number; // in minutes
    currentModule: string;
    grade?: number;
  }[];
  overallProgress: number;
  joinedDate: string;
  lastActive: string;
  achievements: {
    id: string;
    name: string;
    earnedDate: string;
    type: 'badge' | 'certificate' | 'milestone';
  }[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // in hours
  modules: Module[];
  enrolledStudents: number;
  completionRate: number;
  rating: number;
  createdDate: string;
  lastUpdated: string;
  isPublished: boolean;
  thumbnail?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'text' | 'quiz' | 'assignment' | 'interactive';
  duration: number; // in minutes
  content: string;
  order: number;
  isRequired: boolean;
  resources?: {
    id: string;
    name: string;
    type: string;
    url: string;
  }[];
}

export interface TrainerStats {
  totalCourses: number;
  totalLearners: number;
  totalHoursDelivered: number;
  averageRating: number;
  completionRate: number;
  activeThisMonth: number;
}

interface TrainerContextType {
  // Trainer info
  trainer: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    bio: string;
    expertise: string[];
    joinedDate: string;
  } | null;
  
  // Data
  learners: Learner[];
  courses: Course[];
  stats: TrainerStats;
  
  // Loading states
  isLoading: boolean;
  
  // Actions
  setTrainer: (trainer: any) => void;
  addCourse: (course: Omit<Course, 'id' | 'createdDate' | 'lastUpdated'>) => void;
  updateCourse: (courseId: string, updates: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
  addModule: (courseId: string, module: Omit<Module, 'id'>) => void;
  updateModule: (courseId: string, moduleId: string, updates: Partial<Module>) => void;
  deleteModule: (courseId: string, moduleId: string) => void;
  getLearnerProgress: (learnerId: string) => Learner | undefined;
  getCourseAnalytics: (courseId: string) => any;
  sendMessage: (learnerIds: string[], message: string) => void;
  refreshData: () => void;
}

const TrainerContext = createContext<TrainerContextType | undefined>(undefined);

export const useTrainer = () => {
  const context = useContext(TrainerContext);
  if (context === undefined) {
    throw new Error('useTrainer must be used within a TrainerProvider');
  }
  return context;
};

export const TrainerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trainer, setTrainer] = useState<any>(null);
  const [learners, setLearners] = useState<Learner[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<TrainerStats>({
    totalCourses: 0,
    totalLearners: 0,
    totalHoursDelivered: 0,
    averageRating: 0,
    completionRate: 0,
    activeThisMonth: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  // Mock data initialization
  useEffect(() => {
    initializeMockData();
  }, []);

  const initializeMockData = () => {
    // Mock trainer
    setTrainer({
      id: 'trainer-1',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@example.com',
      avatar: '/api/placeholder/150/150',
      bio: 'Experienced software engineering instructor with 10+ years in industry and education.',
      expertise: ['JavaScript', 'React', 'Node.js', 'Python', 'Data Structures'],
      joinedDate: '2022-01-15'
    });

    // Mock courses
    const mockCourses: Course[] = [
      {
        id: 'course-1',
        title: 'React Fundamentals',
        description: 'Learn the basics of React including components, state, and props.',
        category: 'Web Development',
        difficulty: 'Beginner',
        duration: 20,
        modules: [
          {
            id: 'module-1',
            title: 'Introduction to React',
            description: 'Overview of React and its ecosystem',
            type: 'video',
            duration: 45,
            content: 'Video content about React basics',
            order: 1,
            isRequired: true
          },
          {
            id: 'module-2',
            title: 'Components and JSX',
            description: 'Understanding React components and JSX syntax',
            type: 'video',
            duration: 60,
            content: 'Video content about components',
            order: 2,
            isRequired: true
          }
        ],
        enrolledStudents: 45,
        completionRate: 78,
        rating: 4.6,
        createdDate: '2024-01-15',
        lastUpdated: '2024-02-20',
        isPublished: true
      },
      {
        id: 'course-2',
        title: 'Advanced JavaScript',
        description: 'Deep dive into advanced JavaScript concepts and patterns.',
        category: 'Programming',
        difficulty: 'Advanced',
        duration: 35,
        modules: [],
        enrolledStudents: 28,
        completionRate: 65,
        rating: 4.8,
        createdDate: '2024-02-01',
        lastUpdated: '2024-03-10',
        isPublished: true
      }
    ];
    setCourses(mockCourses);

    // Mock learners
    const mockLearners: Learner[] = [
      {
        id: 'learner-1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        enrolledCourses: ['course-1', 'course-2'],
        progress: [
          {
            courseId: 'course-1',
            courseName: 'React Fundamentals',
            completionPercentage: 85,
            lastActivity: '2024-03-15',
            timeSpent: 340,
            currentModule: 'Components and JSX',
            grade: 92
          }
        ],
        overallProgress: 85,
        joinedDate: '2024-01-20',
        lastActive: '2024-03-15',
        achievements: [
          {
            id: 'achievement-1',
            name: 'First Course Completed',
            earnedDate: '2024-02-15',
            type: 'badge'
          }
        ]
      },
      {
        id: 'learner-2',
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        enrolledCourses: ['course-1'],
        progress: [
          {
            courseId: 'course-1',
            courseName: 'React Fundamentals',
            completionPercentage: 45,
            lastActivity: '2024-03-14',
            timeSpent: 180,
            currentModule: 'Introduction to React'
          }
        ],
        overallProgress: 45,
        joinedDate: '2024-02-01',
        lastActive: '2024-03-14',
        achievements: []
      }
    ];
    setLearners(mockLearners);

    // Calculate stats
    setStats({
      totalCourses: mockCourses.length,
      totalLearners: mockLearners.length,
      totalHoursDelivered: mockCourses.reduce((sum, course) => sum + course.duration, 0),
      averageRating: mockCourses.reduce((sum, course) => sum + course.rating, 0) / mockCourses.length,
      completionRate: mockCourses.reduce((sum, course) => sum + course.completionRate, 0) / mockCourses.length,
      activeThisMonth: mockLearners.filter(learner => 
        new Date(learner.lastActive) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length
    });
  };

  const addCourse = (courseData: Omit<Course, 'id' | 'createdDate' | 'lastUpdated'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `course-${Date.now()}`,
      createdDate: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      enrolledStudents: 0,
      completionRate: 0,
      rating: 0
    };
    setCourses(prev => [...prev, newCourse]);
  };

  const updateCourse = (courseId: string, updates: Partial<Course>) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { ...course, ...updates, lastUpdated: new Date().toISOString() }
        : course
    ));
  };

  const deleteCourse = (courseId: string) => {
    setCourses(prev => prev.filter(course => course.id !== courseId));
  };

  const addModule = (courseId: string, moduleData: Omit<Module, 'id'>) => {
    const newModule: Module = {
      ...moduleData,
      id: `module-${Date.now()}`
    };
    
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? { 
            ...course, 
            modules: [...course.modules, newModule],
            lastUpdated: new Date().toISOString()
          }
        : course
    ));
  };

  const updateModule = (courseId: string, moduleId: string, updates: Partial<Module>) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? {
            ...course,
            modules: course.modules.map(module => 
              module.id === moduleId ? { ...module, ...updates } : module
            ),
            lastUpdated: new Date().toISOString()
          }
        : course
    ));
  };

  const deleteModule = (courseId: string, moduleId: string) => {
    setCourses(prev => prev.map(course => 
      course.id === courseId 
        ? {
            ...course,
            modules: course.modules.filter(module => module.id !== moduleId),
            lastUpdated: new Date().toISOString()
          }
        : course
    ));
  };

  const getLearnerProgress = (learnerId: string) => {
    return learners.find(learner => learner.id === learnerId);
  };

  const getCourseAnalytics = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return null;

    const enrolledLearners = learners.filter(learner => 
      learner.enrolledCourses.includes(courseId)
    );

    return {
      course,
      enrolledLearners,
      averageProgress: enrolledLearners.reduce((sum, learner) => {
        const progress = learner.progress.find(p => p.courseId === courseId);
        return sum + (progress?.completionPercentage || 0);
      }, 0) / enrolledLearners.length || 0,
      totalTimeSpent: enrolledLearners.reduce((sum, learner) => {
        const progress = learner.progress.find(p => p.courseId === courseId);
        return sum + (progress?.timeSpent || 0);
      }, 0)
    };
  };

  const sendMessage = (_learnerIds: string[], _message: string) => {
    // Mock implementation - send message to learners
    // TODO: Replace with actual API call
  };

  const refreshData = () => {
    setIsLoading(true);
    // Mock refresh
    setTimeout(() => {
      initializeMockData();
      setIsLoading(false);
    }, 1000);
  };

  const value: TrainerContextType = {
    trainer,
    learners,
    courses,
    stats,
    isLoading,
    setTrainer,
    addCourse,
    updateCourse,
    deleteCourse,
    addModule,
    updateModule,
    deleteModule,
    getLearnerProgress,
    getCourseAnalytics,
    sendMessage,
    refreshData
  };

  return (
    <TrainerContext.Provider value={value}>
      {children}
    </TrainerContext.Provider>
  );
};