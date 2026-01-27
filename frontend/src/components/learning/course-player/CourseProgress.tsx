import React from 'react';
import {
  BookOpen,
  CheckCircle,
  Circle,
  Lock,
  FileQuestion,
  Award,
  ChevronDown,
  ChevronRight,
  Trophy,
} from 'lucide-react';
import type { Course, CourseProgress as CourseProgressType } from '../../../types/course';

interface CourseProgressProps {
  course: Course;
  progress: CourseProgressType;
  overallProgress: number;
  selectedModuleIndex: number;
  selectedLessonIndex: number;
  onSelectLesson: (moduleIndex: number, lessonIndex: number) => void;
  onSelectQuiz: (moduleIndex: number) => void;
  onSelectFinal: () => void;
  onSelectOverview: () => void;
  isQuizUnlocked: (moduleId: string) => boolean;
  isFinalUnlocked: () => boolean;
  isModuleComplete: (moduleId: string) => boolean;
  currentView: 'overview' | 'lesson' | 'quiz' | 'final-assessment' | 'complete';
}

const CourseProgress: React.FC<CourseProgressProps> = ({
  course,
  progress,
  overallProgress,
  selectedModuleIndex,
  selectedLessonIndex,
  onSelectLesson,
  onSelectQuiz,
  onSelectFinal,
  onSelectOverview,
  isQuizUnlocked,
  isFinalUnlocked,
  isModuleComplete,
  currentView,
}) => {
  const [expandedModules, setExpandedModules] = React.useState<Set<number>>(
    new Set([selectedModuleIndex])
  );

  const toggleModule = (index: number) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const getModuleProgress = (moduleIndex: number) => {
    const module = course.modules[moduleIndex];
    const completedLessons = module.lessons.filter(
      lesson => progress.completedLessons.includes(lesson.id)
    ).length;
    return Math.round((completedLessons / module.lessons.length) * 100);
  };

  const getLessonIcon = (lessonId: string) => {
    if (progress.completedLessons.includes(lessonId)) {
      return <CheckCircle className="w-4 h-4 text-green-500 dark:text-darkMode-success" />;
    }
    return <Circle className="w-4 h-4 text-gray-400 dark:text-darkMode-textMuted" />;
  };

  const getQuizIcon = (moduleId: string) => {
    const module = course.modules.find(m => m.id === moduleId);
    if (!module) return <Lock className="w-4 h-4 text-gray-400" />;

    const score = progress.quizScores[module.quiz.id];
    if (score !== undefined && score >= module.quiz.passingScore) {
      return <CheckCircle className="w-4 h-4 text-green-500 dark:text-darkMode-success" />;
    }
    if (isQuizUnlocked(moduleId)) {
      return <FileQuestion className="w-4 h-4 text-primary dark:text-darkMode-link" />;
    }
    return <Lock className="w-4 h-4 text-gray-400 dark:text-darkMode-textMuted" />;
  };

  const getBadgeDisplay = (moduleIndex: number) => {
    const badge = course.modules[moduleIndex].badge;
    const earned = progress.earnedBadges.includes(badge.id);

    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
        earned
          ? 'bg-yellow-50 dark:bg-yellow-900/20'
          : 'bg-gray-50 dark:bg-darkMode-surfaceHover'
      }`}>
        <Award className={`w-4 h-4 ${
          earned
            ? 'text-yellow-500'
            : 'text-gray-400 dark:text-darkMode-textMuted'
        }`} />
        <span className={`text-xs font-medium ${
          earned
            ? 'text-yellow-700 dark:text-yellow-400'
            : 'text-gray-500 dark:text-darkMode-textMuted'
        }`}>
          {badge.name}
        </span>
        {earned && (
          <span className="text-xs text-yellow-600 dark:text-yellow-400">+{badge.points}pts</span>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg overflow-hidden">
      {/* Progress Header */}
      <div className="p-4 bg-primary dark:bg-darkMode-navbar">
        <h3 className="text-white font-semibold mb-2">Course Progress</h3>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-white/20 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <span className="text-white text-sm font-medium">{overallProgress}%</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-2">
        {/* Overview */}
        <button
          onClick={onSelectOverview}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
            currentView === 'overview'
              ? 'bg-primary/10 dark:bg-darkMode-link/20 text-primary dark:text-darkMode-link'
              : 'hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover text-gray-700 dark:text-darkMode-textSecondary'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="font-medium">Course Overview</span>
        </button>

        {/* Modules */}
        {course.modules.map((module, moduleIndex) => (
          <div key={module.id} className="mt-2">
            {/* Module Header */}
            <button
              onClick={() => toggleModule(moduleIndex)}
              className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover transition-colors"
            >
              {expandedModules.has(moduleIndex) ? (
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-darkMode-textMuted" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500 dark:text-darkMode-textMuted" />
              )}
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-primary-dark dark:text-darkMode-text">
                    Module {moduleIndex + 1}
                  </span>
                  {isModuleComplete(module.id) && (
                    <CheckCircle className="w-4 h-4 text-green-500 dark:text-darkMode-success" />
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-darkMode-textMuted truncate">
                  {module.title}
                </p>
              </div>
              <span className="text-xs text-gray-500 dark:text-darkMode-textMuted">
                {getModuleProgress(moduleIndex)}%
              </span>
            </button>

            {/* Module Content */}
            {expandedModules.has(moduleIndex) && (
              <div className="ml-6 pl-4 border-l-2 border-gray-200 dark:border-darkMode-border">
                {/* Lessons */}
                {module.lessons.map((lesson, lessonIndex) => (
                  <button
                    key={lesson.id}
                    onClick={() => onSelectLesson(moduleIndex, lessonIndex)}
                    className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-sm ${
                      currentView === 'lesson' &&
                      selectedModuleIndex === moduleIndex &&
                      selectedLessonIndex === lessonIndex
                        ? 'bg-primary/10 dark:bg-darkMode-link/20 text-primary dark:text-darkMode-link'
                        : 'hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover text-gray-600 dark:text-darkMode-textSecondary'
                    }`}
                  >
                    {getLessonIcon(lesson.id)}
                    <span className="truncate flex-1 text-left">{lesson.title}</span>
                    <span className="text-xs text-gray-400 dark:text-darkMode-textMuted">
                      {lesson.duration}m
                    </span>
                  </button>
                ))}

                {/* Quiz */}
                <button
                  onClick={() => onSelectQuiz(moduleIndex)}
                  disabled={!isQuizUnlocked(module.id)}
                  className={`w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-sm mt-2 ${
                    !isQuizUnlocked(module.id)
                      ? 'opacity-50 cursor-not-allowed'
                      : currentView === 'quiz' && selectedModuleIndex === moduleIndex
                      ? 'bg-primary/10 dark:bg-darkMode-link/20 text-primary dark:text-darkMode-link'
                      : 'hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover text-gray-600 dark:text-darkMode-textSecondary'
                  }`}
                >
                  {getQuizIcon(module.id)}
                  <span className="truncate flex-1 text-left">Module Quiz</span>
                  {progress.quizScores[module.quiz.id] !== undefined && (
                    <span className={`text-xs font-medium ${
                      progress.quizScores[module.quiz.id] >= module.quiz.passingScore
                        ? 'text-green-500 dark:text-darkMode-success'
                        : 'text-red-500 dark:text-error'
                    }`}>
                      {progress.quizScores[module.quiz.id]}%
                    </span>
                  )}
                </button>

                {/* Badge */}
                <div className="mt-2">
                  {getBadgeDisplay(moduleIndex)}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Final Assessment */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-darkMode-border">
          <button
            onClick={onSelectFinal}
            disabled={!isFinalUnlocked()}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
              !isFinalUnlocked()
                ? 'opacity-50 cursor-not-allowed'
                : currentView === 'final-assessment'
                ? 'bg-primary/10 dark:bg-darkMode-link/20 text-primary dark:text-darkMode-link'
                : 'hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover text-gray-700 dark:text-darkMode-textSecondary'
            }`}
          >
            {progress.finalScore !== null && progress.finalScore >= course.finalAssessment.passingScore ? (
              <Trophy className="w-5 h-5 text-yellow-500" />
            ) : isFinalUnlocked() ? (
              <FileQuestion className="w-5 h-5 text-primary dark:text-darkMode-link" />
            ) : (
              <Lock className="w-5 h-5 text-gray-400 dark:text-darkMode-textMuted" />
            )}
            <div className="flex-1 text-left">
              <span className="font-medium">Final Assessment</span>
              <p className="text-xs text-gray-500 dark:text-darkMode-textMuted">
                {isFinalUnlocked() ? '80% required to pass' : 'Complete all modules to unlock'}
              </p>
            </div>
            {progress.finalScore !== null && (
              <span className={`text-sm font-medium ${
                progress.finalScore >= course.finalAssessment.passingScore
                  ? 'text-green-500 dark:text-darkMode-success'
                  : 'text-red-500 dark:text-error'
              }`}>
                {progress.finalScore}%
              </span>
            )}
          </button>
        </div>

        {/* Certificate Status */}
        <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Award className={`w-5 h-5 ${
              progress.certificateEarned
                ? 'text-yellow-500'
                : 'text-gray-400 dark:text-darkMode-textMuted'
            }`} />
            <span className="font-medium text-sm text-primary-dark dark:text-darkMode-text">
              {course.certificate.title}
            </span>
          </div>
          <div className="flex gap-1">
            {course.certificate.requirement.badges.map(badgeId => {
              const earned = progress.earnedBadges.includes(badgeId);
              return (
                <div
                  key={badgeId}
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    earned
                      ? 'bg-yellow-400'
                      : 'bg-gray-300 dark:bg-darkMode-border'
                  }`}
                >
                  {earned && <CheckCircle className="w-4 h-4 text-white" />}
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 dark:text-darkMode-textMuted mt-2">
            {progress.certificateEarned
              ? 'Certificate earned!'
              : `Earn all ${course.certificate.requirement.badges.length} badges + pass final assessment`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
