// Course Learning System Type Definitions

/**
 * Video chapter for navigation within video content
 */
export interface VideoChapterBlock {
  id: string;
  title: string;
  startTime: number; // in seconds
  endTime?: number; // in seconds (optional, defaults to next chapter or end)
}

/**
 * Quiz trigger point within video content
 */
export interface VideoQuizTriggerBlock {
  id: string;
  timestamp: number; // in seconds
  quizId: string;
  required: boolean; // must answer to continue
}

/**
 * Base content block types for lessons
 */
export interface ContentBlock {
  type: 'text' | 'heading' | 'list' | 'image' | 'quote' | 'highlight' | 'video';
  content?: string;
  items?: string[];
  src?: string;
  alt?: string;
  caption?: string;
  // Video-specific fields
  videoUrl?: string;
  chapters?: VideoChapterBlock[];
  quizTriggers?: VideoQuizTriggerBlock[];
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  content: ContentBlock[];
  objectives?: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false';
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  passingScore: number; // percentage (e.g., 70)
  timeLimit?: number; // in minutes
  questions: QuizQuestion[];
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirement: {
    type: 'module_completion' | 'assessment_pass' | 'course_completion';
    moduleId?: string;
    minimumScore?: number;
  };
}

export interface Certificate {
  id: string;
  title: string;
  description: string;
  issuer: string;
  requirement: {
    badges: string[];
    finalAssessmentScore: number;
  };
}

export interface Module {
  id: string;
  title: string;
  description: string;
  duration: number; // in hours
  lessons: Lesson[];
  quiz: Quiz;
  badge: Badge;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  instructorAvatar: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  totalDuration: number; // in hours
  modules: Module[];
  finalAssessment: Quiz;
  certificate: Certificate;
  learningOutcomes: string[];
  prerequisites: string[];
}

export interface CourseProgress {
  courseId: string;
  startedAt: string;
  lastAccessedAt: string;
  completedLessons: string[];
  currentLessonId: string | null;
  currentModuleId: string | null;
  quizScores: Record<string, number>;
  quizAttempts: Record<string, number>;
  earnedBadges: string[];
  finalScore: number | null;
  finalAttempts: number;
  certificateEarned: boolean;
  certificateEarnedAt: string | null;
  totalTimeSpent: number; // in minutes
}

export type CourseView =
  | 'overview'
  | 'lesson'
  | 'quiz'
  | 'final-assessment'
  | 'complete';

export interface CourseState {
  view: CourseView;
  selectedModuleIndex: number;
  selectedLessonIndex: number;
}
