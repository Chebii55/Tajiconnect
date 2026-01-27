import React from 'react';
import {
  Clock,
  BookOpen,
  Award,
  Target,
  Users,
  CheckCircle,
  Play,
  ChevronRight,
  Heart,
} from 'lucide-react';
import type { Course, CourseProgress } from '../../../types/course';

interface CourseOverviewProps {
  course: Course;
  progress: CourseProgress;
  overallProgress: number;
  onStartLearning: () => void;
  onContinueLearning: () => void;
}

const CourseOverview: React.FC<CourseOverviewProps> = ({
  course,
  progress,
  overallProgress,
  onStartLearning,
  onContinueLearning,
}) => {
  const hasStarted = progress.completedLessons.length > 0;
  const totalLessons = course.modules.reduce(
    (sum, module) => sum + module.lessons.length,
    0
  );

  const getCourseIcon = () => {
    switch (course.thumbnail) {
      case 'heart':
        return <Heart className="w-12 h-12 text-red-400" />;
      default:
        return <BookOpen className="w-12 h-12 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary-dark to-primary-dark dark:from-darkMode-navbar dark:via-darkMode-surface dark:to-darkMode-bg rounded-2xl p-8 text-white">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex-shrink-0 w-24 h-24 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
            {getCourseIcon()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                {course.category}
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                {course.level}
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
            <p className="text-white/80 mb-4">{course.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{course.instructorAvatar}</span>
                <span>{course.instructor}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{course.totalDuration} hours</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{totalLessons} lessons</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>{course.modules.length} badges</span>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {hasStarted && (
          <div className="mt-6 bg-white/10 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Your Progress</span>
              <span className="text-sm font-bold">{overallProgress}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* CTA Button */}
        <div className="mt-6">
          <button
            onClick={hasStarted ? onContinueLearning : onStartLearning}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-dark font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Play className="w-5 h-5" />
            {hasStarted ? 'Continue Learning' : 'Start Course'}
          </button>
        </div>
      </div>

      {/* Learning Outcomes */}
      <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary dark:text-darkMode-link" />
          <h2 className="text-lg font-bold text-primary-dark dark:text-darkMode-text">
            What You'll Learn
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {course.learningOutcomes.map((outcome, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 dark:text-darkMode-success flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 dark:text-darkMode-textSecondary">{outcome}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Course Content */}
      <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-primary dark:text-darkMode-link" />
          <h2 className="text-lg font-bold text-primary-dark dark:text-darkMode-text">
            Course Content
          </h2>
        </div>

        <div className="space-y-4">
          {course.modules.map((module, moduleIndex) => {
            const completedLessons = module.lessons.filter(
              lesson => progress.completedLessons.includes(lesson.id)
            ).length;
            const moduleProgress = Math.round((completedLessons / module.lessons.length) * 100);

            return (
              <div
                key={module.id}
                className="border border-gray-200 dark:border-darkMode-border rounded-lg overflow-hidden"
              >
                <div className="p-4 bg-gray-50 dark:bg-darkMode-surfaceHover">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        moduleProgress === 100
                          ? 'bg-green-100 dark:bg-darkMode-success/20'
                          : 'bg-primary/10 dark:bg-darkMode-link/20'
                      }`}>
                        {moduleProgress === 100 ? (
                          <CheckCircle className="w-5 h-5 text-green-500 dark:text-darkMode-success" />
                        ) : (
                          <span className="text-sm font-bold text-primary dark:text-darkMode-link">
                            {moduleIndex + 1}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-primary-dark dark:text-darkMode-text">
                          {module.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-darkMode-textMuted">
                          {module.lessons.length} lessons • {module.duration} hours
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-600 dark:text-darkMode-textSecondary">
                        {moduleProgress}%
                      </span>
                    </div>
                  </div>

                  {/* Module Progress Bar */}
                  <div className="mt-3 w-full bg-gray-200 dark:bg-darkMode-border rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        moduleProgress === 100
                          ? 'bg-green-500 dark:bg-darkMode-success'
                          : 'bg-primary dark:bg-darkMode-link'
                      }`}
                      style={{ width: `${moduleProgress}%` }}
                    />
                  </div>
                </div>

                {/* Lesson List */}
                <div className="divide-y divide-gray-100 dark:divide-darkMode-border">
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover"
                    >
                      {progress.completedLessons.includes(lesson.id) ? (
                        <CheckCircle className="w-5 h-5 text-green-500 dark:text-darkMode-success flex-shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-darkMode-border flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 dark:text-darkMode-textSecondary truncate">
                          {moduleIndex + 1}.{lessonIndex + 1} {lesson.title}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400 dark:text-darkMode-textMuted">
                        {lesson.duration} min
                      </span>
                      <ChevronRight className="w-4 h-4 text-gray-400 dark:text-darkMode-textMuted" />
                    </div>
                  ))}
                </div>

                {/* Badge Preview */}
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 border-t border-yellow-200 dark:border-yellow-900/30">
                  <div className="flex items-center gap-2">
                    <Award className={`w-5 h-5 ${
                      progress.earnedBadges.includes(module.badge.id)
                        ? 'text-yellow-500'
                        : 'text-yellow-400/50'
                    }`} />
                    <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                      {module.badge.name}
                    </span>
                    <span className="text-xs text-yellow-600 dark:text-yellow-500">
                      +{module.badge.points} pts
                    </span>
                    {progress.earnedBadges.includes(module.badge.id) && (
                      <CheckCircle className="w-4 h-4 text-green-500 dark:text-darkMode-success ml-auto" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Final Assessment */}
          <div className="border border-gray-200 dark:border-darkMode-border rounded-lg overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-dark dark:text-darkMode-text">
                    Final Assessment
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-darkMode-textMuted">
                    {course.finalAssessment.questions.length} questions • {course.finalAssessment.timeLimit} minutes • 80% to pass
                  </p>
                </div>
                {progress.finalScore !== null && progress.finalScore >= course.finalAssessment.passingScore && (
                  <CheckCircle className="w-5 h-5 text-green-500 dark:text-darkMode-success ml-auto" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prerequisites */}
      {course.prerequisites.length > 0 && (
        <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-bold text-primary-dark dark:text-darkMode-text mb-4">
            Prerequisites
          </h2>
          <ul className="space-y-2">
            {course.prerequisites.map((prereq, index) => (
              <li key={index} className="flex items-center gap-2 text-gray-700 dark:text-darkMode-textSecondary">
                <ChevronRight className="w-4 h-4 text-gray-400 dark:text-darkMode-textMuted" />
                {prereq}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CourseOverview;
