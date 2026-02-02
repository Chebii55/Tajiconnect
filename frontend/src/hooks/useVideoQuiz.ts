/**
 * useVideoQuiz Hook
 *
 * Detects quiz triggers based on video playback time and manages quiz state.
 * Handles required vs optional quizzes and tracks answered quizzes.
 */

import { useState, useCallback, useMemo } from 'react'
import type { VideoQuizTrigger } from '../types/video'

interface UseVideoQuizOptions {
  currentTime: number
  quizTriggers: VideoQuizTrigger[]
  initialAnsweredQuizzes?: Set<string>
}

interface UseVideoQuizReturn {
  /** Quiz that should currently be shown (null if none) */
  activeQuiz: VideoQuizTrigger | null
  /** Whether video should pause for current quiz */
  shouldPause: boolean
  /** Whether there are unanswered required quizzes before current time */
  hasUnansweredRequired: boolean
  /** Set of quiz IDs that have been answered */
  answeredQuizzes: Set<string>
  /** Mark a quiz as answered */
  markAnswered: (quizId: string) => void
  /** Reset all answered quizzes */
  resetAnswered: () => void
}

// Tolerance in seconds for triggering quiz (within 1 second of timestamp)
const TRIGGER_TOLERANCE = 1

/**
 * Hook to manage in-video quiz triggers and state
 */
export function useVideoQuiz({
  currentTime,
  quizTriggers,
  initialAnsweredQuizzes = new Set(),
}: UseVideoQuizOptions): UseVideoQuizReturn {
  const [answeredQuizzes, setAnsweredQuizzes] = useState<Set<string>>(initialAnsweredQuizzes)

  // Sort triggers by timestamp for consistent processing
  const sortedTriggers = useMemo(() => {
    return [...quizTriggers].sort((a, b) => a.timestamp - b.timestamp)
  }, [quizTriggers])

  // Find the first unanswered quiz that should be triggered
  const activeQuiz = useMemo(() => {
    // Find first unanswered quiz where currentTime >= trigger timestamp
    // Use tolerance so quiz triggers when within 1 second of timestamp
    return sortedTriggers.find((trigger) => {
      const isTriggered = currentTime >= trigger.timestamp - TRIGGER_TOLERANCE
      const isUnanswered = !answeredQuizzes.has(trigger.quizId)
      return isTriggered && isUnanswered
    }) ?? null
  }, [sortedTriggers, currentTime, answeredQuizzes])

  // Determine if video should pause for current quiz
  const shouldPause = useMemo(() => {
    // Pause if there's an active quiz that's required
    return activeQuiz !== null && activeQuiz.required
  }, [activeQuiz])

  // Check if there are unanswered required quizzes before current time
  // This prevents users from skipping past required quizzes
  const hasUnansweredRequired = useMemo(() => {
    return sortedTriggers.some((trigger) => {
      const isBeforeCurrentTime = trigger.timestamp <= currentTime
      const isRequired = trigger.required
      const isUnanswered = !answeredQuizzes.has(trigger.quizId)
      return isBeforeCurrentTime && isRequired && isUnanswered
    })
  }, [sortedTriggers, currentTime, answeredQuizzes])

  // Mark a quiz as answered
  const markAnswered = useCallback((quizId: string) => {
    setAnsweredQuizzes((prev) => {
      const next = new Set(prev)
      next.add(quizId)
      return next
    })
  }, [])

  // Reset all answered quizzes
  const resetAnswered = useCallback(() => {
    setAnsweredQuizzes(new Set())
  }, [])

  return {
    activeQuiz,
    shouldPause,
    hasUnansweredRequired,
    answeredQuizzes,
    markAnswered,
    resetAnswered,
  }
}

export default useVideoQuiz
