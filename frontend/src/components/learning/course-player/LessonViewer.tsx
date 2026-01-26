import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Clock,
  Target,
  BookOpen,
} from 'lucide-react';
import { Lesson, Module } from '../../../types/course';

interface LessonViewerProps {
  lesson: Lesson;
  module: Module;
  lessonIndex: number;
  moduleIndex: number;
  totalLessonsInModule: number;
  isCompleted: boolean;
  onComplete: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson,
  module,
  lessonIndex,
  moduleIndex,
  totalLessonsInModule,
  isCompleted,
  onComplete,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}) => {
  const renderContent = (content: typeof lesson.content) => {
    return content.map((block, index) => {
      switch (block.type) {
        case 'heading':
          return (
            <h2
              key={index}
              className="text-xl font-bold text-primary-dark dark:text-darkMode-text mt-8 mb-4 first:mt-0"
            >
              {block.content}
            </h2>
          );

        case 'text':
          return (
            <p
              key={index}
              className="text-gray-700 dark:text-darkMode-textSecondary leading-relaxed mb-4"
            >
              {block.content}
            </p>
          );

        case 'list':
          return (
            <ul key={index} className="list-disc pl-6 mb-4 space-y-2">
              {block.items?.map((item, itemIndex) => (
                <li
                  key={itemIndex}
                  className="text-gray-700 dark:text-darkMode-textSecondary"
                >
                  {item}
                </li>
              ))}
            </ul>
          );

        case 'highlight':
          return (
            <div
              key={index}
              className="bg-blue-50 dark:bg-info/10 border-l-4 border-blue-500 dark:border-info p-4 my-6 rounded-r-lg"
            >
              <p className="text-blue-800 dark:text-info font-medium">
                {block.content}
              </p>
            </div>
          );

        case 'quote':
          return (
            <blockquote
              key={index}
              className="border-l-4 border-gray-300 dark:border-darkMode-border pl-4 my-6 italic text-gray-600 dark:text-darkMode-textSecondary"
            >
              "{block.content}"
            </blockquote>
          );

        case 'image':
          return (
            <figure key={index} className="my-6">
              <img
                src={block.src}
                alt={block.alt || ''}
                className="rounded-lg w-full"
              />
              {block.caption && (
                <figcaption className="text-center text-sm text-gray-500 dark:text-darkMode-textMuted mt-2">
                  {block.caption}
                </figcaption>
              )}
            </figure>
          );

        default:
          return null;
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Lesson Header */}
      <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-darkMode-textMuted mb-2">
          <BookOpen className="w-4 h-4" />
          <span>
            Module {moduleIndex + 1}: {module.title}
          </span>
          <span className="mx-2">•</span>
          <span>
            Lesson {lessonIndex + 1} of {totalLessonsInModule}
          </span>
        </div>

        <h1 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-3">
          {lesson.title}
        </h1>

        <p className="text-gray-600 dark:text-darkMode-textSecondary mb-4">
          {lesson.description}
        </p>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-darkMode-textMuted">
            <Clock className="w-4 h-4" />
            <span>{lesson.duration} minutes</span>
          </div>
          {isCompleted && (
            <div className="flex items-center gap-1 text-sm text-green-600 dark:text-darkMode-success">
              <CheckCircle className="w-4 h-4" />
              <span>Completed</span>
            </div>
          )}
        </div>
      </div>

      {/* Learning Objectives */}
      {lesson.objectives && lesson.objectives.length > 0 && (
        <div className="bg-green-50 dark:bg-darkMode-success/10 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-green-600 dark:text-darkMode-success" />
            <h3 className="font-semibold text-green-800 dark:text-darkMode-success">
              Learning Objectives
            </h3>
          </div>
          <ul className="space-y-2">
            {lesson.objectives.map((objective, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-darkMode-success flex-shrink-0 mt-0.5" />
                <span className="text-green-700 dark:text-green-300">{objective}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Lesson Content */}
      <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-8 mb-6">
        {renderContent(lesson.content)}
      </div>

      {/* Navigation & Complete */}
      <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          {/* Previous Button */}
          <button
            onClick={onPrevious}
            disabled={!hasPrevious}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              hasPrevious
                ? 'text-primary dark:text-darkMode-link hover:bg-primary/10 dark:hover:bg-darkMode-link/10'
                : 'text-gray-400 dark:text-darkMode-textMuted cursor-not-allowed'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Previous</span>
          </button>

          {/* Complete Button */}
          {!isCompleted ? (
            <button
              onClick={onComplete}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 dark:bg-darkMode-success text-white font-medium rounded-lg hover:bg-green-600 dark:hover:bg-green-600 transition-colors"
            >
              <CheckCircle className="w-5 h-5" />
              <span>Mark as Complete</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 px-6 py-3 bg-green-100 dark:bg-darkMode-success/20 text-green-700 dark:text-darkMode-success font-medium rounded-lg">
              <CheckCircle className="w-5 h-5" />
              <span>Completed</span>
            </div>
          )}

          {/* Next Button */}
          <button
            onClick={onNext}
            disabled={!hasNext && !isCompleted}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              hasNext || isCompleted
                ? 'text-primary dark:text-darkMode-link hover:bg-primary/10 dark:hover:bg-darkMode-link/10'
                : 'text-gray-400 dark:text-darkMode-textMuted cursor-not-allowed'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Progress indicator */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-darkMode-border">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-darkMode-textMuted mb-2">
            <span>Lesson Progress</span>
            <span>{lessonIndex + 1} / {totalLessonsInModule}</span>
          </div>
          <div className="flex gap-1">
            {Array.from({ length: totalLessonsInModule }).map((_, idx) => (
              <div
                key={idx}
                className={`flex-1 h-1.5 rounded-full ${
                  idx < lessonIndex
                    ? 'bg-green-500 dark:bg-darkMode-success'
                    : idx === lessonIndex
                    ? isCompleted
                      ? 'bg-green-500 dark:bg-darkMode-success'
                      : 'bg-primary dark:bg-darkMode-link'
                    : 'bg-gray-200 dark:bg-darkMode-border'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;
