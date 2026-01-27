import React, { useState, useCallback } from 'react';
import {
  BookOpen,
  Award,
  AlertCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import type { Module, Quiz } from '../../../types/course';
import QuizQuestion from './QuizQuestion';

interface ModuleQuizProps {
  module: Module;
  moduleIndex: number;
  previousScore: number | undefined;
  attempts: number;
  onSubmit: (score: number) => void;
  onContinue: () => void;
  hasPassed: boolean;
}

const ModuleQuiz: React.FC<ModuleQuizProps> = ({
  module,
  moduleIndex,
  previousScore,
  attempts,
  onSubmit,
  onContinue,
  hasPassed,
}) => {
  const quiz = module.quiz;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const allAnswered = quiz.questions.every(q => answers[q.id]);

  const handleSelectAnswer = useCallback((answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  }, [currentQuestion.id]);

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    const correctCount = quiz.questions.filter(
      q => answers[q.id] === q.correctAnswer
    ).length;
    return Math.round((correctCount / quiz.questions.length) * 100);
  };

  const handleSubmit = () => {
    const calculatedScore = calculateScore();
    setScore(calculatedScore);
    setShowResults(true);
    onSubmit(calculatedScore);
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setScore(null);
    setQuizStarted(true);
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  // Show previous result summary if already passed
  if (hasPassed && !quizStarted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-darkMode-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-500 dark:text-darkMode-success" />
          </div>
          <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-2">
            Quiz Completed!
          </h2>
          <p className="text-gray-600 dark:text-darkMode-textSecondary mb-4">
            You've already passed this quiz
          </p>

          <div className="bg-green-50 dark:bg-darkMode-success/10 rounded-lg p-4 mb-6">
            <p className="text-3xl font-bold text-green-600 dark:text-darkMode-success">
              {previousScore}%
            </p>
            <p className="text-sm text-green-700 dark:text-green-400">
              Best Score (Passing: {quiz.passingScore}%)
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onContinue}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary dark:bg-darkMode-link text-white font-medium rounded-lg hover:bg-primary-dark dark:hover:bg-darkMode-linkHover transition-colors"
            >
              <span>Continue to Next Module</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={handleRetake}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-darkMode-border text-gray-700 dark:text-darkMode-textSecondary font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Retake Quiz</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz intro screen
  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 dark:bg-darkMode-link/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-primary dark:text-darkMode-link" />
            </div>
            <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-2">
              {quiz.title}
            </h2>
            <p className="text-gray-600 dark:text-darkMode-textSecondary">
              Module {moduleIndex + 1}: {module.title}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-darkMode-surfaceHover rounded-lg p-4 mb-6">
            <p className="text-gray-700 dark:text-darkMode-textSecondary">
              {quiz.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-info/10 rounded-lg">
              <p className="text-2xl font-bold text-blue-600 dark:text-info">
                {quiz.questions.length}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Questions</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-darkMode-success/10 rounded-lg">
              <p className="text-2xl font-bold text-green-600 dark:text-darkMode-success">
                {quiz.passingScore}%
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">To Pass</p>
            </div>
          </div>

          {previousScore !== undefined && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <div>
                  <p className="text-yellow-800 dark:text-yellow-300 font-medium">
                    Previous Score: {previousScore}%
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">
                    Attempts: {attempts}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Badge preview */}
          <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-yellow-500" />
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-300">
                  Complete to earn: {module.badge.name}
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  +{module.badge.points} points
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleStartQuiz}
            className="w-full py-3 px-6 bg-primary dark:bg-darkMode-link text-white font-medium rounded-lg hover:bg-primary-dark dark:hover:bg-darkMode-linkHover transition-colors"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // Show results
  if (showResults && score !== null) {
    const passed = score >= quiz.passingScore;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Results Summary */}
        <div className={`rounded-xl shadow-lg p-8 text-center ${
          passed
            ? 'bg-green-50 dark:bg-darkMode-success/10'
            : 'bg-red-50 dark:bg-error/10'
        }`}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
            passed
              ? 'bg-green-100 dark:bg-darkMode-success/20'
              : 'bg-red-100 dark:bg-error/20'
          }`}>
            {passed ? (
              <CheckCircle className="w-10 h-10 text-green-500 dark:text-darkMode-success" />
            ) : (
              <XCircle className="w-10 h-10 text-red-500 dark:text-error" />
            )}
          </div>

          <h2 className={`text-2xl font-bold mb-2 ${
            passed
              ? 'text-green-800 dark:text-darkMode-success'
              : 'text-red-800 dark:text-error'
          }`}>
            {passed ? 'Congratulations!' : 'Keep Trying!'}
          </h2>

          <p className={`text-4xl font-bold mb-2 ${
            passed
              ? 'text-green-600 dark:text-darkMode-success'
              : 'text-red-600 dark:text-error'
          }`}>
            {score}%
          </p>

          <p className={`text-sm mb-6 ${
            passed
              ? 'text-green-700 dark:text-green-400'
              : 'text-red-700 dark:text-red-400'
          }`}>
            {passed
              ? `You passed! Required: ${quiz.passingScore}%`
              : `Required: ${quiz.passingScore}% to pass`}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {passed ? (
              <button
                onClick={onContinue}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 dark:bg-darkMode-success text-white font-medium rounded-lg hover:bg-green-600 dark:hover:bg-green-600 transition-colors"
              >
                <span>Continue</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleRetake}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary dark:bg-darkMode-link text-white font-medium rounded-lg hover:bg-primary-dark dark:hover:bg-darkMode-linkHover transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Try Again</span>
              </button>
            )}
          </div>
        </div>

        {/* Review Questions */}
        <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-primary-dark dark:text-darkMode-text mb-4">
            Review Your Answers
          </h3>
          <div className="space-y-4">
            {quiz.questions.map((question, index) => (
              <QuizQuestion
                key={question.id}
                question={question}
                questionNumber={index + 1}
                totalQuestions={quiz.questions.length}
                selectedAnswer={answers[question.id]}
                onSelectAnswer={() => {}}
                showResult={true}
                disabled={true}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Quiz in progress
  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Header */}
      <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600 dark:text-darkMode-textSecondary">
            {quiz.title}
          </span>
          <span className="text-sm text-gray-500 dark:text-darkMode-textMuted">
            {Object.keys(answers).length} / {quiz.questions.length} answered
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-darkMode-border rounded-full h-2">
          <div
            className="bg-primary dark:bg-darkMode-link h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(Object.keys(answers).length / quiz.questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <QuizQuestion
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={quiz.questions.length}
        selectedAnswer={answers[currentQuestion.id] || null}
        onSelectAnswer={handleSelectAnswer}
        showResult={false}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className={`px-4 py-2 rounded-lg transition-colors ${
            currentQuestionIndex === 0
              ? 'text-gray-400 dark:text-darkMode-textMuted cursor-not-allowed'
              : 'text-primary dark:text-darkMode-link hover:bg-primary/10 dark:hover:bg-darkMode-link/10'
          }`}
        >
          Previous
        </button>

        <div className="flex gap-1">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                index === currentQuestionIndex
                  ? 'bg-primary dark:bg-darkMode-link text-white'
                  : answers[quiz.questions[index].id]
                  ? 'bg-green-100 dark:bg-darkMode-success/20 text-green-700 dark:text-darkMode-success'
                  : 'bg-gray-100 dark:bg-darkMode-surfaceHover text-gray-600 dark:text-darkMode-textSecondary'
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        {isLastQuestion ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              allAnswered
                ? 'bg-green-500 dark:bg-darkMode-success text-white hover:bg-green-600 dark:hover:bg-green-600'
                : 'bg-gray-300 dark:bg-darkMode-surfaceHover text-gray-500 dark:text-darkMode-textMuted cursor-not-allowed'
            }`}
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-4 py-2 text-primary dark:text-darkMode-link hover:bg-primary/10 dark:hover:bg-darkMode-link/10 rounded-lg transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default ModuleQuiz;
