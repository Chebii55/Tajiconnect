import { useState, useEffect, useCallback } from 'react';
import type { CourseProgress, Course, Badge } from '../types/course';
import { eventBus } from '../lib/eventBus';

const STORAGE_KEY_PREFIX = 'course_progress_';

const createInitialProgress = (courseId: string): CourseProgress => ({
  courseId,
  startedAt: new Date().toISOString(),
  lastAccessedAt: new Date().toISOString(),
  completedLessons: [],
  currentLessonId: null,
  currentModuleId: null,
  quizScores: {},
  quizAttempts: {},
  earnedBadges: [],
  finalScore: null,
  finalAttempts: 0,
  certificateEarned: false,
  certificateEarnedAt: null,
  totalTimeSpent: 0,
});

export const useCourseProgress = (courseId: string, course: Course | null) => {
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [newBadge, setNewBadge] = useState<Badge | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  // Load progress from localStorage
  useEffect(() => {
    const storageKey = `${STORAGE_KEY_PREFIX}${courseId}`;
    const savedProgress = localStorage.getItem(storageKey);

    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setProgress({
          ...parsed,
          lastAccessedAt: new Date().toISOString(),
        });
      } catch {
        setProgress(createInitialProgress(courseId));
      }
    } else {
      setProgress(createInitialProgress(courseId));
    }
    setLoading(false);
  }, [courseId]);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    if (progress) {
      const storageKey = `${STORAGE_KEY_PREFIX}${courseId}`;
      localStorage.setItem(storageKey, JSON.stringify(progress));
    }
  }, [progress, courseId]);

  // Mark a lesson as complete
  const completeLesson = useCallback((lessonId: string, moduleId?: string) => {
    setProgress(prev => {
      if (!prev) return prev;
      if (prev.completedLessons.includes(lessonId)) return prev;

      // Emit lesson completed event for gamification
      eventBus.emit('lesson:completed', {
        lessonId,
        courseId,
        score: 100, // Lesson completion is binary
        timeSpent: 0, // Could be tracked with addTimeSpent
      });

      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        lastAccessedAt: new Date().toISOString(),
      };
    });
  }, [courseId]);

  // Set current lesson
  const setCurrentLesson = useCallback((lessonId: string, moduleId: string) => {
    setProgress(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        currentLessonId: lessonId,
        currentModuleId: moduleId,
        lastAccessedAt: new Date().toISOString(),
      };
    });
  }, []);

  // Record quiz score
  const recordQuizScore = useCallback((quizId: string, score: number, passingScore: number = 70) => {
    // Emit quiz completed event for gamification
    const passed = score >= passingScore;
    eventBus.emit('quiz:completed', {
      quizId,
      courseId,
      score,
      passed,
    });

    setProgress(prev => {
      if (!prev) return prev;
      const currentAttempts = prev.quizAttempts[quizId] || 0;
      const currentBestScore = prev.quizScores[quizId] || 0;

      return {
        ...prev,
        quizScores: {
          ...prev.quizScores,
          [quizId]: Math.max(currentBestScore, score),
        },
        quizAttempts: {
          ...prev.quizAttempts,
          [quizId]: currentAttempts + 1,
        },
        lastAccessedAt: new Date().toISOString(),
      };
    });
  }, [courseId]);

  // Record final assessment score
  const recordFinalScore = useCallback((score: number) => {
    setProgress(prev => {
      if (!prev) return prev;
      const currentBestScore = prev.finalScore || 0;

      return {
        ...prev,
        finalScore: Math.max(currentBestScore, score),
        finalAttempts: prev.finalAttempts + 1,
        lastAccessedAt: new Date().toISOString(),
      };
    });
  }, []);

  // Check and award badge
  const checkBadgeEligibility = useCallback((moduleId: string) => {
    if (!progress || !course) return;

    const module = course.modules.find(m => m.id === moduleId);
    if (!module) return;

    const badge = module.badge;
    if (progress.earnedBadges.includes(badge.id)) return;

    // Check if all lessons in module are complete
    const allLessonsComplete = module.lessons.every(
      lesson => progress.completedLessons.includes(lesson.id)
    );

    // Check if quiz is passed (70% or higher)
    const quizScore = progress.quizScores[module.quiz.id] || 0;
    const quizPassed = quizScore >= module.quiz.passingScore;

    if (allLessonsComplete && quizPassed) {
      setProgress(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          earnedBadges: [...prev.earnedBadges, badge.id],
        };
      });
      setNewBadge(badge);
    }
  }, [progress, course]);

  // Check final assessment badge eligibility
  const checkFinalBadgeEligibility = useCallback(() => {
    if (!progress || !course) return;

    const finalBadge = course.modules[course.modules.length - 1].badge;
    if (progress.earnedBadges.includes(finalBadge.id)) return;

    if (progress.finalScore !== null && progress.finalScore >= course.finalAssessment.passingScore) {
      setProgress(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          earnedBadges: [...prev.earnedBadges, finalBadge.id],
        };
      });
      setNewBadge(finalBadge);
    }
  }, [progress, course]);

  // Check certificate eligibility
  const checkCertificateEligibility = useCallback(() => {
    if (!progress || !course) return false;
    if (progress.certificateEarned) return true;

    const allBadgesEarned = course.certificate.requirement.badges.every(
      badgeId => progress.earnedBadges.includes(badgeId)
    );
    const finalPassed = progress.finalScore !== null &&
      progress.finalScore >= course.certificate.requirement.finalAssessmentScore;

    if (allBadgesEarned && finalPassed) {
      // Emit course completed event for gamification
      eventBus.emit('course:completed', {
        courseId,
        completedLessons: progress.completedLessons.length,
        allPerfect: progress.finalScore === 100,
      });

      setProgress(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          certificateEarned: true,
          certificateEarnedAt: new Date().toISOString(),
        };
      });
      setShowCertificate(true);
      return true;
    }
    return false;
  }, [progress, course, courseId]);

  // Clear badge notification
  const clearNewBadge = useCallback(() => {
    setNewBadge(null);
  }, []);

  // Clear certificate notification
  const clearCertificateNotification = useCallback(() => {
    setShowCertificate(false);
  }, []);

  // Add time spent
  const addTimeSpent = useCallback((minutes: number) => {
    setProgress(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        totalTimeSpent: prev.totalTimeSpent + minutes,
      };
    });
  }, []);

  // Calculate overall progress percentage
  const calculateOverallProgress = useCallback(() => {
    if (!progress || !course) return 0;

    const totalLessons = course.modules.reduce(
      (sum, module) => sum + module.lessons.length,
      0
    );
    const completedLessons = progress.completedLessons.length;
    const lessonProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 70 : 0;

    const totalQuizzes = course.modules.length;
    const passedQuizzes = course.modules.filter(
      module => (progress.quizScores[module.quiz.id] || 0) >= module.quiz.passingScore
    ).length;
    const quizProgress = totalQuizzes > 0 ? (passedQuizzes / totalQuizzes) * 20 : 0;

    const finalProgress = progress.finalScore !== null &&
      progress.finalScore >= course.finalAssessment.passingScore ? 10 : 0;

    return Math.round(lessonProgress + quizProgress + finalProgress);
  }, [progress, course]);

  // Check if a module is complete
  const isModuleComplete = useCallback((moduleId: string) => {
    if (!progress || !course) return false;

    const module = course.modules.find(m => m.id === moduleId);
    if (!module) return false;

    const allLessonsComplete = module.lessons.every(
      lesson => progress.completedLessons.includes(lesson.id)
    );
    const quizPassed = (progress.quizScores[module.quiz.id] || 0) >= module.quiz.passingScore;

    return allLessonsComplete && quizPassed;
  }, [progress, course]);

  // Check if module quiz is unlocked
  const isQuizUnlocked = useCallback((moduleId: string) => {
    if (!progress || !course) return false;

    const module = course.modules.find(m => m.id === moduleId);
    if (!module) return false;

    return module.lessons.every(
      lesson => progress.completedLessons.includes(lesson.id)
    );
  }, [progress, course]);

  // Check if final assessment is unlocked
  const isFinalUnlocked = useCallback(() => {
    if (!progress || !course) return false;

    return course.modules.every(module => {
      const allLessonsComplete = module.lessons.every(
        lesson => progress.completedLessons.includes(lesson.id)
      );
      const quizPassed = (progress.quizScores[module.quiz.id] || 0) >= module.quiz.passingScore;
      return allLessonsComplete && quizPassed;
    });
  }, [progress, course]);

  // Reset progress (for testing)
  const resetProgress = useCallback(() => {
    setProgress(createInitialProgress(courseId));
    setNewBadge(null);
    setShowCertificate(false);
  }, [courseId]);

  return {
    progress,
    loading,
    newBadge,
    showCertificate,
    completeLesson,
    setCurrentLesson,
    recordQuizScore,
    recordFinalScore,
    checkBadgeEligibility,
    checkFinalBadgeEligibility,
    checkCertificateEligibility,
    clearNewBadge,
    clearCertificateNotification,
    addTimeSpent,
    calculateOverallProgress,
    isModuleComplete,
    isQuizUnlocked,
    isFinalUnlocked,
    resetProgress,
  };
};

export default useCourseProgress;
