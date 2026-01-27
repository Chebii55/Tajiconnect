import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Menu, X } from 'lucide-react';
import type { Course, CourseView, CourseState } from '../../../types/course';
import { useCourseProgress } from '../../../hooks/useCourseProgress';
import CourseOverview from './CourseOverview';
import CourseProgress from './CourseProgress';
import LessonViewer from './LessonViewer';
import ModuleQuiz from './ModuleQuiz';
import FinalAssessment from './FinalAssessment';
import BadgeAwardModal from './BadgeAwardModal';
import CertificateAwardModal from './CertificateAwardModal';

// Import course data
import selEssentialsData from '../../../data/courses/sel-essentials.json';

const courseData: Record<string, Course> = {
  'sel-essentials': selEssentialsData as Course,
  '2': selEssentialsData as Course, // Also allow access via ID "2" which matches the Courses.tsx mock
};

const CourseLearning: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [courseState, setCourseState] = useState<CourseState>({
    view: 'overview',
    selectedModuleIndex: 0,
    selectedLessonIndex: 0,
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load course data
  useEffect(() => {
    if (courseId && courseData[courseId]) {
      setCourse(courseData[courseId]);
    }
  }, [courseId]);

  // Use course progress hook
  const {
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
    calculateOverallProgress,
    isModuleComplete,
    isQuizUnlocked,
    isFinalUnlocked,
  } = useCourseProgress(courseId || '', course);

  const overallProgress = calculateOverallProgress();

  // Navigation handlers
  const handleSelectOverview = useCallback(() => {
    setCourseState(prev => ({ ...prev, view: 'overview' }));
  }, []);

  const handleSelectLesson = useCallback((moduleIndex: number, lessonIndex: number) => {
    if (!course) return;
    const lesson = course.modules[moduleIndex].lessons[lessonIndex];
    const module = course.modules[moduleIndex];
    setCurrentLesson(lesson.id, module.id);
    setCourseState({
      view: 'lesson',
      selectedModuleIndex: moduleIndex,
      selectedLessonIndex: lessonIndex,
    });
    setMobileMenuOpen(false);
  }, [course, setCurrentLesson]);

  const handleSelectQuiz = useCallback((moduleIndex: number) => {
    setCourseState({
      view: 'quiz',
      selectedModuleIndex: moduleIndex,
      selectedLessonIndex: 0,
    });
    setMobileMenuOpen(false);
  }, []);

  const handleSelectFinal = useCallback(() => {
    setCourseState(prev => ({
      ...prev,
      view: 'final-assessment',
    }));
    setMobileMenuOpen(false);
  }, []);

  const handleStartLearning = useCallback(() => {
    handleSelectLesson(0, 0);
  }, [handleSelectLesson]);

  const handleContinueLearning = useCallback(() => {
    if (!course || !progress) return;

    // Find the first incomplete lesson
    for (let mi = 0; mi < course.modules.length; mi++) {
      const module = course.modules[mi];
      for (let li = 0; li < module.lessons.length; li++) {
        if (!progress.completedLessons.includes(module.lessons[li].id)) {
          handleSelectLesson(mi, li);
          return;
        }
      }
      // Check if quiz needs to be taken
      if (!progress.quizScores[module.quiz.id] || progress.quizScores[module.quiz.id] < module.quiz.passingScore) {
        if (isQuizUnlocked(module.id)) {
          handleSelectQuiz(mi);
          return;
        }
      }
    }

    // All modules done, go to final if unlocked
    if (isFinalUnlocked() && (!progress.finalScore || progress.finalScore < course.finalAssessment.passingScore)) {
      handleSelectFinal();
      return;
    }

    // Default to overview
    handleSelectOverview();
  }, [course, progress, handleSelectLesson, handleSelectQuiz, handleSelectFinal, handleSelectOverview, isQuizUnlocked, isFinalUnlocked]);

  // Lesson navigation
  const handleLessonComplete = useCallback(() => {
    if (!course) return;
    const lesson = course.modules[courseState.selectedModuleIndex].lessons[courseState.selectedLessonIndex];
    completeLesson(lesson.id);
  }, [course, courseState, completeLesson]);

  const handleLessonPrevious = useCallback(() => {
    if (courseState.selectedLessonIndex > 0) {
      handleSelectLesson(courseState.selectedModuleIndex, courseState.selectedLessonIndex - 1);
    } else if (courseState.selectedModuleIndex > 0 && course) {
      const prevModuleIndex = courseState.selectedModuleIndex - 1;
      const prevModule = course.modules[prevModuleIndex];
      handleSelectLesson(prevModuleIndex, prevModule.lessons.length - 1);
    }
  }, [courseState, course, handleSelectLesson]);

  const handleLessonNext = useCallback(() => {
    if (!course) return;
    const module = course.modules[courseState.selectedModuleIndex];

    if (courseState.selectedLessonIndex < module.lessons.length - 1) {
      handleSelectLesson(courseState.selectedModuleIndex, courseState.selectedLessonIndex + 1);
    } else if (isQuizUnlocked(module.id)) {
      // Go to quiz after last lesson
      handleSelectQuiz(courseState.selectedModuleIndex);
    }
  }, [course, courseState, handleSelectLesson, handleSelectQuiz, isQuizUnlocked]);

  // Quiz handlers
  const handleQuizSubmit = useCallback((score: number) => {
    if (!course) return;
    const module = course.modules[courseState.selectedModuleIndex];
    recordQuizScore(module.quiz.id, score);

    // Check badge eligibility after recording score
    setTimeout(() => {
      checkBadgeEligibility(module.id);
    }, 500);
  }, [course, courseState, recordQuizScore, checkBadgeEligibility]);

  const handleQuizContinue = useCallback(() => {
    if (!course) return;

    // Move to next module or final assessment
    if (courseState.selectedModuleIndex < course.modules.length - 1) {
      handleSelectLesson(courseState.selectedModuleIndex + 1, 0);
    } else if (isFinalUnlocked()) {
      handleSelectFinal();
    } else {
      handleSelectOverview();
    }
  }, [course, courseState, handleSelectLesson, handleSelectFinal, handleSelectOverview, isFinalUnlocked]);

  // Final assessment handlers
  const handleFinalSubmit = useCallback((score: number) => {
    recordFinalScore(score);

    // Check final badge and certificate eligibility
    setTimeout(() => {
      checkFinalBadgeEligibility();
      setTimeout(() => {
        checkCertificateEligibility();
      }, 1000);
    }, 500);
  }, [recordFinalScore, checkFinalBadgeEligibility, checkCertificateEligibility]);

  const handleFinalComplete = useCallback(() => {
    // Certificate modal will show automatically via showCertificate state
  }, []);

  // Loading state
  if (loading || !course || !progress) {
    return (
      <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-darkMode-textSecondary">Loading course...</p>
        </div>
      </div>
    );
  }

  // Course not found
  if (!courseData[courseId || '']) {
    return (
      <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-600 dark:text-darkMode-textSecondary mb-4">
            The course you're looking for doesn't exist.
          </p>
          <Link
            to="/student/courses"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const currentModule = course.modules[courseState.selectedModuleIndex];
  const currentLesson = currentModule?.lessons[courseState.selectedLessonIndex];

  // Check navigation state
  const hasPreviousLesson = courseState.selectedLessonIndex > 0 || courseState.selectedModuleIndex > 0;
  const hasNextLesson =
    courseState.selectedLessonIndex < currentModule.lessons.length - 1 ||
    courseState.selectedModuleIndex < course.modules.length - 1;

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg">
      {/* Header */}
      <header className="bg-white dark:bg-darkMode-surface border-b border-gray-200 dark:border-darkMode-border sticky top-0 z-20">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <Link
              to="/student/courses"
              className="flex items-center gap-2 text-gray-600 dark:text-darkMode-textSecondary hover:text-primary dark:hover:text-darkMode-link transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Courses</span>
            </Link>
            <div className="hidden md:block h-6 w-px bg-gray-300 dark:bg-darkMode-border" />
            <h1 className="hidden md:block text-lg font-semibold text-primary-dark dark:text-darkMode-text truncate max-w-md">
              {course.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Progress indicator */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-32 bg-gray-200 dark:bg-darkMode-border rounded-full h-2">
                <div
                  className="bg-primary dark:bg-darkMode-link h-2 rounded-full transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-600 dark:text-darkMode-textSecondary">
                {overallProgress}%
              </span>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-darkMode-surfaceHover transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-600 dark:text-darkMode-textSecondary" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600 dark:text-darkMode-textSecondary" />
              )}
            </button>

            {/* Desktop sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-darkMode-surfaceHover transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-darkMode-textSecondary" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside
          className={`hidden lg:block transition-all duration-300 ${
            sidebarOpen ? 'w-80' : 'w-0 overflow-hidden'
          }`}
        >
          <div className="sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto p-4">
            <CourseProgress
              course={course}
              progress={progress}
              overallProgress={overallProgress}
              selectedModuleIndex={courseState.selectedModuleIndex}
              selectedLessonIndex={courseState.selectedLessonIndex}
              onSelectLesson={handleSelectLesson}
              onSelectQuiz={handleSelectQuiz}
              onSelectFinal={handleSelectFinal}
              onSelectOverview={handleSelectOverview}
              isQuizUnlocked={isQuizUnlocked}
              isFinalUnlocked={isFinalUnlocked}
              isModuleComplete={isModuleComplete}
              currentView={courseState.view}
            />
          </div>
        </aside>

        {/* Sidebar - Mobile */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-30">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-neutral-light dark:bg-darkMode-bg overflow-y-auto">
              <div className="p-4">
                <CourseProgress
                  course={course}
                  progress={progress}
                  overallProgress={overallProgress}
                  selectedModuleIndex={courseState.selectedModuleIndex}
                  selectedLessonIndex={courseState.selectedLessonIndex}
                  onSelectLesson={handleSelectLesson}
                  onSelectQuiz={handleSelectQuiz}
                  onSelectFinal={handleSelectFinal}
                  onSelectOverview={handleSelectOverview}
                  isQuizUnlocked={isQuizUnlocked}
                  isFinalUnlocked={isFinalUnlocked}
                  isModuleComplete={isModuleComplete}
                  currentView={courseState.view}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 min-h-[calc(100vh-57px)]">
          {courseState.view === 'overview' && (
            <CourseOverview
              course={course}
              progress={progress}
              overallProgress={overallProgress}
              onStartLearning={handleStartLearning}
              onContinueLearning={handleContinueLearning}
            />
          )}

          {courseState.view === 'lesson' && currentLesson && (
            <LessonViewer
              lesson={currentLesson}
              module={currentModule}
              lessonIndex={courseState.selectedLessonIndex}
              moduleIndex={courseState.selectedModuleIndex}
              totalLessonsInModule={currentModule.lessons.length}
              isCompleted={progress.completedLessons.includes(currentLesson.id)}
              onComplete={handleLessonComplete}
              onPrevious={handleLessonPrevious}
              onNext={handleLessonNext}
              hasPrevious={hasPreviousLesson}
              hasNext={hasNextLesson || isQuizUnlocked(currentModule.id)}
            />
          )}

          {courseState.view === 'quiz' && (
            <ModuleQuiz
              module={currentModule}
              moduleIndex={courseState.selectedModuleIndex}
              previousScore={progress.quizScores[currentModule.quiz.id]}
              attempts={progress.quizAttempts[currentModule.quiz.id] || 0}
              onSubmit={handleQuizSubmit}
              onContinue={handleQuizContinue}
              hasPassed={
                (progress.quizScores[currentModule.quiz.id] || 0) >= currentModule.quiz.passingScore
              }
            />
          )}

          {courseState.view === 'final-assessment' && (
            <FinalAssessment
              assessment={course.finalAssessment}
              course={course}
              previousScore={progress.finalScore}
              attempts={progress.finalAttempts}
              onSubmit={handleFinalSubmit}
              onComplete={handleFinalComplete}
              hasPassed={
                progress.finalScore !== null &&
                progress.finalScore >= course.finalAssessment.passingScore
              }
            />
          )}
        </main>
      </div>

      {/* Badge Award Modal */}
      {newBadge && (
        <BadgeAwardModal badge={newBadge} onClose={clearNewBadge} />
      )}

      {/* Certificate Award Modal */}
      {showCertificate && progress.certificateEarnedAt && (
        <CertificateAwardModal
          certificate={course.certificate}
          course={course}
          earnedDate={progress.certificateEarnedAt}
          onClose={clearCertificateNotification}
        />
      )}
    </div>
  );
};

export default CourseLearning;
