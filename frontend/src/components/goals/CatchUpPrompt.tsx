/**
 * Catch-Up Prompt Component
 *
 * Displayed when user is behind on their daily goal, offering
 * a quick lesson suggestion or option to skip the day.
 */

import React, { useState, useEffect } from 'react'
import { Clock, PlayCircle, SkipForward, X, AlertCircle, Sparkles } from 'lucide-react'
import { useGoalsStore } from '../../stores/goalsStore'
import { Link } from 'react-router-dom'

interface CatchUpPromptProps {
  /** Suggested quick lesson to complete */
  quickLesson?: {
    id: string
    title: string
    duration: number // minutes
    courseId: string
    courseTitle: string
  }
  /** Whether user has a streak freeze available */
  hasStreakFreeze?: boolean
  /** Callback when using streak freeze */
  onUseStreakFreeze?: () => void
  /** Callback when dismissed */
  onDismiss?: () => void
  /** Additional CSS classes */
  className?: string
}

/**
 * Time thresholds for showing catch-up prompt
 */
const CATCH_UP_CONFIG = {
  showAfterHour: 18, // 6 PM
  urgentAfterHour: 21, // 9 PM
}

/**
 * Get current hour (0-23)
 */
function getCurrentHour(): number {
  return new Date().getHours()
}

/**
 * Determine urgency level based on time
 */
function getUrgencyLevel(): 'normal' | 'urgent' | 'critical' {
  const hour = getCurrentHour()
  if (hour >= 22) return 'critical'
  if (hour >= CATCH_UP_CONFIG.urgentAfterHour) return 'urgent'
  return 'normal'
}

const CatchUpPrompt: React.FC<CatchUpPromptProps> = ({
  quickLesson,
  hasStreakFreeze = false,
  onUseStreakFreeze,
  onDismiss,
  className = '',
}) => {
  const { getTodayProgress, dailyLessonsGoal, goalStreak } = useGoalsStore()
  const [dismissed, setDismissed] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)

  const progress = getTodayProgress()
  const remaining = Math.max(0, progress.goal - progress.completed)
  const urgency = getUrgencyLevel()

  // Determine if prompt should show
  useEffect(() => {
    const hour = getCurrentHour()
    const shouldShow =
      hour >= CATCH_UP_CONFIG.showAfterHour &&
      progress.completed < progress.goal &&
      !progress.goalMet &&
      !dismissed

    setShowPrompt(shouldShow)
  }, [progress, dismissed])

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  const handleUseStreakFreeze = () => {
    onUseStreakFreeze?.()
    setDismissed(true)
  }

  if (!showPrompt) return null

  const urgencyConfig = {
    normal: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'text-blue-500 dark:text-blue-400',
      text: 'text-blue-800 dark:text-blue-200',
    },
    urgent: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      icon: 'text-orange-500 dark:text-orange-400',
      text: 'text-orange-800 dark:text-orange-200',
    },
    critical: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: 'text-red-500 dark:text-red-400',
      text: 'text-red-800 dark:text-red-200',
    },
  }

  const config = urgencyConfig[urgency]

  const getMessage = () => {
    if (urgency === 'critical') {
      return {
        title: 'Last chance today!',
        subtitle: `${remaining} ${remaining === 1 ? 'lesson' : 'lessons'} to keep your streak`,
      }
    }
    if (urgency === 'urgent') {
      return {
        title: "You're a bit behind today",
        subtitle: `Complete ${remaining} ${remaining === 1 ? 'lesson' : 'lessons'} to meet your goal`,
      }
    }
    return {
      title: 'Time for a quick lesson?',
      subtitle: `${remaining} ${remaining === 1 ? 'lesson' : 'lessons'} left to reach your daily goal`,
    }
  }

  const message = getMessage()

  return (
    <div
      className={`relative rounded-xl border ${config.bg} ${config.border} overflow-hidden ${className}`}
    >
      {/* Close button */}
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 dark:text-darkMode-textMuted dark:hover:text-darkMode-text rounded-full hover:bg-white/50 dark:hover:bg-darkMode-surfaceHover transition-colors"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="p-4 sm:p-5">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`p-2 rounded-lg ${config.bg}`}>
            {urgency === 'critical' ? (
              <AlertCircle className={`w-5 h-5 ${config.icon}`} />
            ) : (
              <Clock className={`w-5 h-5 ${config.icon}`} />
            )}
          </div>
          <div className="flex-1 min-w-0 pr-6">
            <h4 className={`font-semibold ${config.text}`}>{message.title}</h4>
            <p className="text-sm text-gray-600 dark:text-darkMode-textSecondary mt-0.5">
              {message.subtitle}
            </p>
          </div>
        </div>

        {/* Quick Lesson Suggestion */}
        {quickLesson && (
          <Link
            to={`/student/courses/${quickLesson.courseId}/lesson/${quickLesson.id}`}
            className="block p-3 bg-white dark:bg-darkMode-surface rounded-lg border border-gray-200 dark:border-darkMode-border hover:border-primary dark:hover:border-darkMode-link hover:shadow-md transition-all mb-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Sparkles className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-darkMode-text truncate">
                  {quickLesson.title}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-darkMode-textMuted">
                  <span>{quickLesson.courseTitle}</span>
                  <span>-</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {quickLesson.duration} min
                  </span>
                </div>
              </div>
              <PlayCircle className="w-6 h-6 text-primary dark:text-darkMode-link flex-shrink-0" />
            </div>
          </Link>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Link
            to="/student/courses"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-primary dark:bg-darkMode-link text-white font-medium rounded-lg hover:bg-primary-dark dark:hover:bg-darkMode-accent transition-colors"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Start a Lesson</span>
          </Link>

          {hasStreakFreeze && goalStreak.current > 0 && (
            <button
              onClick={handleUseStreakFreeze}
              className="flex items-center justify-center gap-2 py-2.5 px-4 text-gray-600 dark:text-darkMode-textSecondary font-medium rounded-lg border border-gray-200 dark:border-darkMode-border hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover transition-colors"
            >
              <SkipForward className="w-4 h-4" />
              <span>Use Streak Freeze</span>
            </button>
          )}
        </div>

        {/* Skip option */}
        <button
          onClick={handleDismiss}
          className="w-full mt-3 py-2 text-sm text-gray-500 dark:text-darkMode-textMuted hover:text-gray-700 dark:hover:text-darkMode-text transition-colors"
        >
          Skip today
        </button>
      </div>
    </div>
  )
}

/**
 * Floating Catch-Up Prompt (for bottom of screen)
 */
export const CatchUpPromptFloating: React.FC<CatchUpPromptProps> = (props) => {
  const { getTodayProgress } = useGoalsStore()
  const [visible, setVisible] = useState(false)

  const progress = getTodayProgress()

  useEffect(() => {
    const hour = getCurrentHour()
    const shouldShow =
      hour >= CATCH_UP_CONFIG.showAfterHour &&
      progress.completed < progress.goal &&
      !progress.goalMet

    // Delay appearance for better UX
    if (shouldShow) {
      const timer = setTimeout(() => setVisible(true), 2000)
      return () => clearTimeout(timer)
    }
    setVisible(false)
  }, [progress])

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-40 animate-slide-up">
      <CatchUpPrompt {...props} onDismiss={() => setVisible(false)} />

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default CatchUpPrompt
