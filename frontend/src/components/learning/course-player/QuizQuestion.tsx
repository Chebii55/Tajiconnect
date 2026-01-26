import React from 'react';
import { CheckCircle, XCircle, Circle } from 'lucide-react';
import { QuizQuestion as QuizQuestionType } from '../../../types/course';

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
  showResult: boolean;
  disabled?: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer,
  showResult,
  disabled = false,
}) => {
  const isCorrect = selectedAnswer === question.correctAnswer;

  const getOptionStyle = (option: string) => {
    if (!showResult) {
      if (selectedAnswer === option) {
        return 'border-primary bg-primary/10 dark:border-darkMode-link dark:bg-darkMode-link/20';
      }
      return 'border-gray-200 dark:border-darkMode-border hover:border-primary dark:hover:border-darkMode-link hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover';
    }

    // Show result state
    if (option === question.correctAnswer) {
      return 'border-green-500 bg-green-50 dark:border-darkMode-success dark:bg-darkMode-success/20';
    }
    if (selectedAnswer === option && option !== question.correctAnswer) {
      return 'border-red-500 bg-red-50 dark:border-error dark:bg-error/20';
    }
    return 'border-gray-200 dark:border-darkMode-border opacity-60';
  };

  const getOptionIcon = (option: string) => {
    if (!showResult) {
      return (
        <Circle
          className={`w-5 h-5 flex-shrink-0 ${
            selectedAnswer === option
              ? 'text-primary dark:text-darkMode-link fill-primary dark:fill-darkMode-link'
              : 'text-gray-400 dark:text-darkMode-textMuted'
          }`}
        />
      );
    }

    if (option === question.correctAnswer) {
      return <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-500 dark:text-darkMode-success" />;
    }
    if (selectedAnswer === option && option !== question.correctAnswer) {
      return <XCircle className="w-5 h-5 flex-shrink-0 text-red-500 dark:text-error" />;
    }
    return <Circle className="w-5 h-5 flex-shrink-0 text-gray-300 dark:text-darkMode-textMuted" />;
  };

  return (
    <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500 dark:text-darkMode-textMuted font-medium">
          Question {questionNumber} of {totalQuestions}
        </span>
        {showResult && (
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              isCorrect
                ? 'bg-green-100 text-green-700 dark:bg-darkMode-success/20 dark:text-darkMode-success'
                : 'bg-red-100 text-red-700 dark:bg-error/20 dark:text-error'
            }`}
          >
            {isCorrect ? 'Correct' : 'Incorrect'}
          </span>
        )}
      </div>

      {/* Question Text */}
      <h3 className="text-lg font-semibold text-primary-dark dark:text-darkMode-text mb-6">
        {question.question}
      </h3>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectAnswer(option)}
            disabled={disabled || showResult}
            className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${getOptionStyle(
              option
            )} ${disabled || showResult ? 'cursor-default' : 'cursor-pointer'}`}
          >
            {getOptionIcon(option)}
            <span
              className={`text-sm ${
                showResult && option === question.correctAnswer
                  ? 'text-green-700 dark:text-darkMode-success font-medium'
                  : showResult && selectedAnswer === option
                  ? 'text-red-700 dark:text-error'
                  : 'text-gray-700 dark:text-darkMode-textSecondary'
              }`}
            >
              {option}
            </span>
          </button>
        ))}
      </div>

      {/* Explanation */}
      {showResult && question.explanation && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-info/10 border border-blue-200 dark:border-info/30 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-info">
            <span className="font-medium">Explanation: </span>
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;
