import React, { useState, useEffect, useCallback } from 'react';
import {
  Award,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Trophy,
  AlertTriangle,
} from 'lucide-react';
import type { Quiz, Course } from '../../../types/course';
import QuizQuestion from './QuizQuestion';

interface FinalAssessmentProps {
  assessment: Quiz;
  course: Course;
  previousScore: number | null;
  attempts: number;
  onSubmit: (score: number) => void;
  onComplete: () => void;
  hasPassed: boolean;
}

const FinalAssessment: React.FC<FinalAssessmentProps> = ({
  assessment,
  course,
  previousScore,
  attempts,
  onSubmit,
  onComplete,
  hasPassed,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(
    assessment.timeLimit ? assessment.timeLimit * 60 : 0
  );
  const [timerActive, setTimerActive] = useState(false);
  const [showTimeWarning, setShowTimeWarning] = useState(false);

  const currentQuestion = assessment.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === assessment.questions.length - 1;
  const allAnswered = assessment.questions.every(q => answers[q.id]);

  // Timer effect
  useEffect(() => {
    if (!timerActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setTimerActive(false);
          handleAutoSubmit();
          return 0;
        }
        // Show warning at 5 minutes
        if (prev === 300) {
          setShowTimeWarning(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (timeRemaining <= 60) return 'text-red-500 dark:text-error';
    if (timeRemaining <= 300) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-gray-600 dark:text-darkMode-textSecondary';
  };

  const handleSelectAnswer = useCallback((answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  }, [currentQuestion.id]);

  const handleNext = () => {
    if (currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateScore = () => {
    const correctCount = assessment.questions.filter(
      q => answers[q.id] === q.correctAnswer
    ).length;
    return Math.round((correctCount / assessment.questions.length) * 100);
  };

  const handleSubmit = () => {
    setTimerActive(false);
    const calculatedScore = calculateScore();
    setScore(calculatedScore);
    setShowResults(true);
    onSubmit(calculatedScore);
  };

  const handleAutoSubmit = () => {
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
    setTimeRemaining(assessment.timeLimit ? assessment.timeLimit * 60 : 0);
    setShowTimeWarning(false);
    setAssessmentStarted(true);
    setTimerActive(true);
  };

  const handleStartAssessment = () => {
    setAssessmentStarted(true);
    setTimerActive(true);
  };

  // Show previous result if already passed
  if (hasPassed && !assessmentStarted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-10 h-10 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-2">
            Assessment Completed!
          </h2>
          <p className="text-gray-600 dark:text-darkMode-textSecondary mb-4">
            You've passed the final assessment
          </p>

          <div className="bg-white dark:bg-darkMode-surface rounded-lg p-4 mb-6">
            <p className="text-4xl font-bold text-green-600 dark:text-darkMode-success">
              {previousScore}%
            </p>
            <p className="text-sm text-gray-500 dark:text-darkMode-textMuted">
              Best Score (Passing: {assessment.passingScore}%)
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onComplete}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary dark:bg-darkMode-link text-white font-medium rounded-lg hover:bg-primary-dark dark:hover:bg-darkMode-linkHover transition-colors"
            >
              <Award className="w-5 h-5" />
              <span>View Your Certificate</span>
            </button>
            <button
              onClick={handleRetake}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 dark:border-darkMode-border text-gray-700 dark:text-darkMode-textSecondary font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Retake Assessment</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Assessment intro screen
  if (!assessmentStarted) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-2">
              {assessment.title}
            </h2>
            <p className="text-gray-600 dark:text-darkMode-textSecondary">
              {course.title}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-darkMode-surfaceHover rounded-lg p-4 mb-6">
            <p className="text-gray-700 dark:text-darkMode-textSecondary">
              {assessment.description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-info/10 rounded-lg">
              <p className="text-2xl font-bold text-blue-600 dark:text-info">
                {assessment.questions.length}
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">Questions</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {assessment.timeLimit}
              </p>
              <p className="text-sm text-purple-700 dark:text-purple-300">Minutes</p>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-darkMode-success/10 rounded-lg">
              <p className="text-2xl font-bold text-green-600 dark:text-darkMode-success">
                {assessment.passingScore}%
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">To Pass</p>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-800 dark:text-yellow-300 font-medium mb-1">
                  Important Instructions
                </p>
                <ul className="text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                  <li>You have {assessment.timeLimit} minutes to complete this assessment</li>
                  <li>The assessment will auto-submit when time runs out</li>
                  <li>You need {assessment.passingScore}% to earn your certificate</li>
                  <li>You can retake if you don't pass</li>
                </ul>
              </div>
            </div>
          </div>

          {previousScore !== null && (
            <div className="bg-red-50 dark:bg-error/10 border border-red-200 dark:border-error/30 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-error" />
                <div>
                  <p className="text-red-800 dark:text-error font-medium">
                    Previous Score: {previousScore}%
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    Attempts: {attempts}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Certificate preview */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <Award className="w-10 h-10 text-yellow-500" />
              <div>
                <p className="font-medium text-yellow-800 dark:text-yellow-300">
                  Pass to earn: {course.certificate.title}
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  Plus the SEL Mastery badge (+500 points)
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleStartAssessment}
            className="w-full py-4 px-6 bg-gradient-to-r from-primary to-primary-dark dark:from-darkMode-link dark:to-darkMode-linkHover text-white font-semibold rounded-lg hover:shadow-lg transition-all"
          >
            Start Final Assessment
          </button>
        </div>
      </div>
    );
  }

  // Show results
  if (showResults && score !== null) {
    const passed = score >= assessment.passingScore;

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Results Summary */}
        <div className={`rounded-xl shadow-lg p-8 text-center ${
          passed
            ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-darkMode-success/20 dark:to-green-900/20'
            : 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-error/20 dark:to-orange-900/20'
        }`}>
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
            passed
              ? 'bg-green-100 dark:bg-darkMode-success/30'
              : 'bg-red-100 dark:bg-error/30'
          }`}>
            {passed ? (
              <Trophy className="w-12 h-12 text-yellow-500" />
            ) : (
              <XCircle className="w-12 h-12 text-red-500 dark:text-error" />
            )}
          </div>

          <h2 className={`text-3xl font-bold mb-2 ${
            passed
              ? 'text-green-800 dark:text-darkMode-success'
              : 'text-red-800 dark:text-error'
          }`}>
            {passed ? 'Congratulations!' : 'Not Quite There Yet'}
          </h2>

          <p className={`text-5xl font-bold mb-2 ${
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
              ? `You passed! Required: ${assessment.passingScore}%`
              : `Required: ${assessment.passingScore}% to pass`}
          </p>

          {passed ? (
            <div className="bg-white/50 dark:bg-darkMode-surface/50 rounded-lg p-4 mb-6">
              <p className="text-green-800 dark:text-green-300 font-medium mb-2">
                You've earned:
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-500" />
                  <span className="text-green-700 dark:text-green-400">SEL Mastery Badge</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <span className="text-green-700 dark:text-green-400">Certificate</span>
                </div>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {passed ? (
              <button
                onClick={onComplete}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
              >
                <Award className="w-5 h-5" />
                <span>Claim Your Certificate</span>
              </button>
            ) : (
              <button
                onClick={handleRetake}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-primary dark:bg-darkMode-link text-white font-medium rounded-lg hover:bg-primary-dark dark:hover:bg-darkMode-linkHover transition-colors"
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
            {assessment.questions.map((question, index) => (
              <QuizQuestion
                key={question.id}
                question={question}
                questionNumber={index + 1}
                totalQuestions={assessment.questions.length}
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

  // Assessment in progress
  return (
    <div className="max-w-2xl mx-auto">
      {/* Timer Warning Modal */}
      {showTimeWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
              <h3 className="text-lg font-bold text-primary-dark dark:text-darkMode-text mb-2">
                5 Minutes Remaining!
              </h3>
              <p className="text-gray-600 dark:text-darkMode-textSecondary mb-4">
                Please review your answers and submit soon.
              </p>
              <button
                onClick={() => setShowTimeWarning(false)}
                className="px-6 py-2 bg-primary dark:bg-darkMode-link text-white font-medium rounded-lg hover:bg-primary-dark dark:hover:bg-darkMode-linkHover transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timer & Progress Header */}
      <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-4 mb-6 sticky top-4 z-10">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600 dark:text-darkMode-textSecondary">
            Final Assessment
          </span>
          <div className={`flex items-center gap-2 font-mono text-lg font-bold ${getTimerColor()}`}>
            <Clock className="w-5 h-5" />
            <span>{formatTime(timeRemaining)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2 text-sm text-gray-500 dark:text-darkMode-textMuted">
          <span>{Object.keys(answers).length} / {assessment.questions.length} answered</span>
          <span>{currentQuestionIndex + 1} of {assessment.questions.length}</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-darkMode-border rounded-full h-2 mt-2">
          <div
            className="bg-primary dark:bg-darkMode-link h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((currentQuestionIndex + 1) / assessment.questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Question */}
      <QuizQuestion
        question={currentQuestion}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={assessment.questions.length}
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

        <div className="flex gap-1 flex-wrap justify-center max-w-xs">
          {assessment.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-7 h-7 rounded-full text-xs font-medium transition-colors ${
                index === currentQuestionIndex
                  ? 'bg-primary dark:bg-darkMode-link text-white'
                  : answers[assessment.questions[index].id]
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

      {/* Quick Submit */}
      {allAnswered && !isLastQuestion && (
        <div className="mt-6 p-4 bg-green-50 dark:bg-darkMode-success/10 rounded-lg">
          <p className="text-green-700 dark:text-darkMode-success text-sm mb-2">
            All questions answered! You can submit now or review your answers.
          </p>
          <button
            onClick={handleSubmit}
            className="w-full py-2 bg-green-500 dark:bg-darkMode-success text-white font-medium rounded-lg hover:bg-green-600 dark:hover:bg-green-600 transition-colors"
          >
            Submit Assessment
          </button>
        </div>
      )}
    </div>
  );
};

export default FinalAssessment;
