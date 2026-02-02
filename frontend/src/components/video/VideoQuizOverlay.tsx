/**
 * VideoQuizOverlay Component
 *
 * Displays a quiz question as an overlay on the video player.
 * Pauses video until user answers (required) or skips (optional).
 * Emits gamification events on correct answers.
 */

import { useState, useCallback } from 'react'
import { CheckCircle, XCircle, Circle, X, SkipForward } from 'lucide-react'
import type { QuizQuestion } from '../../types/course'
import { eventBus } from '../../lib/eventBus'

interface VideoQuizOverlayProps {
  /** Quiz question to display */
  quiz: QuizQuestion
  /** Quiz ID for tracking */
  quizId: string
  /** Whether user must answer to continue */
  required: boolean
  /** Called when user answers the quiz */
  onAnswer: (answerId: string, correct: boolean) => void
  /** Called when user skips (only if not required) */
  onSkip?: () => void
  /** Called to close overlay and resume video */
  onClose: () => void
}

/**
 * Overlay component for in-video quiz display
 */
const VideoQuizOverlay: React.FC<VideoQuizOverlayProps> = ({
  quiz,
  quizId,
  required,
  onAnswer,
  onSkip,
  onClose,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  // Handle answer selection
  const handleSelectAnswer = useCallback((option: string) => {
    if (showResult) return
    setSelectedAnswer(option)
  }, [showResult])

  // Handle submit answer
  const handleSubmit = useCallback(() => {
    if (!selectedAnswer) return

    const correct = selectedAnswer === quiz.correctAnswer
    setIsCorrect(correct)
    setShowResult(true)

    // Call onAnswer callback
    onAnswer(selectedAnswer, correct)

    // Emit event for gamification (only on correct answers)
    if (correct) {
      eventBus.emit('quiz:completed', {
        quizId,
        courseId: '', // Video quiz doesn't have course context
        score: 100,
        passed: true,
      })
    }
  }, [selectedAnswer, quiz.correctAnswer, onAnswer, quizId])

  // Handle continue after viewing result
  const handleContinue = useCallback(() => {
    onClose()
  }, [onClose])

  // Handle skip (only for optional quizzes)
  const handleSkip = useCallback(() => {
    if (required) return
    onSkip?.()
    onClose()
  }, [required, onSkip, onClose])

  // Get styling for option based on state
  const getOptionStyle = (option: string) => {
    if (!showResult) {
      if (selectedAnswer === option) {
        return 'border-primary bg-primary/10 dark:border-darkMode-link dark:bg-darkMode-link/20'
      }
      return 'border-gray-200 dark:border-darkMode-border hover:border-primary dark:hover:border-darkMode-link hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover'
    }

    // Show result state
    if (option === quiz.correctAnswer) {
      return 'border-green-500 bg-green-50 dark:border-darkMode-success dark:bg-darkMode-success/20'
    }
    if (selectedAnswer === option && option !== quiz.correctAnswer) {
      return 'border-red-500 bg-red-50 dark:border-error dark:bg-error/20'
    }
    return 'border-gray-200 dark:border-darkMode-border opacity-60'
  }

  // Get icon for option based on state
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
      )
    }

    if (option === quiz.correctAnswer) {
      return <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-500 dark:text-darkMode-success" />
    }
    if (selectedAnswer === option && option !== quiz.correctAnswer) {
      return <XCircle className="w-5 h-5 flex-shrink-0 text-red-500 dark:text-error" />
    }
    return <Circle className="w-5 h-5 flex-shrink-0 text-gray-300 dark:text-darkMode-textMuted" />
  }

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 animate-in fade-in duration-300">
      {/* Quiz card */}
      <div className="relative w-full max-w-lg mx-4 bg-white dark:bg-darkMode-surface rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-darkMode-border">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500 dark:text-darkMode-textMuted">
              {required ? 'Required Quiz' : 'Quick Check'}
            </span>
            {required && (
              <span className="px-2 py-0.5 text-xs font-medium bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-full">
                Must Answer
              </span>
            )}
          </div>
          {!required && !showResult && (
            <button
              type="button"
              onClick={handleSkip}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 dark:text-darkMode-textMuted dark:hover:text-darkMode-text transition-colors"
            >
              <SkipForward className="w-4 h-4" />
              Skip
            </button>
          )}
        </div>

        {/* Question content */}
        <div className="p-6">
          {/* Result badge */}
          {showResult && (
            <div className="flex justify-center mb-4">
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                  isCorrect
                    ? 'bg-green-100 text-green-700 dark:bg-darkMode-success/20 dark:text-darkMode-success'
                    : 'bg-red-100 text-red-700 dark:bg-error/20 dark:text-error'
                }`}
              >
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
          )}

          {/* Question text */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-darkMode-text mb-6">
            {quiz.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {quiz.options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectAnswer(option)}
                disabled={showResult}
                className={`w-full flex items-center gap-3 p-4 rounded-lg border-2 transition-all text-left ${getOptionStyle(
                  option
                )} ${showResult ? 'cursor-default' : 'cursor-pointer'}`}
              >
                {getOptionIcon(option)}
                <span
                  className={`text-sm ${
                    showResult && option === quiz.correctAnswer
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

          {/* Explanation (shown after answering) */}
          {showResult && quiz.explanation && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-info/10 border border-blue-200 dark:border-info/30 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-info">
                <span className="font-medium">Explanation: </span>
                {quiz.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer with actions */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-darkMode-border bg-gray-50 dark:bg-darkMode-surfaceHover">
          {!showResult ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                selectedAnswer
                  ? 'bg-primary dark:bg-darkMode-link text-white hover:bg-primary-dark dark:hover:bg-darkMode-linkHover'
                  : 'bg-gray-300 dark:bg-darkMode-border text-gray-500 dark:text-darkMode-textMuted cursor-not-allowed'
              }`}
            >
              Submit Answer
            </button>
          ) : (
            <button
              type="button"
              onClick={handleContinue}
              className="w-full py-3 bg-primary dark:bg-darkMode-link text-white font-medium rounded-lg hover:bg-primary-dark dark:hover:bg-darkMode-linkHover transition-colors"
            >
              Continue Watching
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default VideoQuizOverlay
