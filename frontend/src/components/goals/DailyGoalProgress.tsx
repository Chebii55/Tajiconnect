/**
 * Daily Goal Progress Component
 *
 * Displays progress toward daily learning goal with
 * visual indicators (ring/bar) and motivational messaging.
 */

import React from 'react'
import { Target, CheckCircle, Star, Trophy, ChevronRight } from 'lucide-react'
import { useGoalsStore } from '../../stores/goalsStore'
import { Link } from 'react-router-dom'

interface DailyGoalProgressProps {
  /** Compact mode for header/sidebar */
  compact?: boolean
  /** Show streak information */
  showStreak?: boolean
  /** Show action button to continue learning */
  showAction?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Progress ring states
 */
type RingState = 'empty' | 'progress' | 'complete' | 'exceeded'

/**
 * Get ring state based on progress
 */
function getRingState(completed: number, goal: number): RingState {
  if (completed === 0) return 'empty'
  if (completed > goal) return 'exceeded'
  if (completed >= goal) return 'complete'
  return 'progress'
}

/**
 * Ring color configuration
 */
const ringColors: Record<RingState, { stroke: string; bg: string; text: string }> = {
  empty: {
    stroke: 'stroke-gray-200 dark:stroke-darkMode-border',
    bg: 'bg-gray-100 dark:bg-darkMode-surfaceHover',
    text: 'text-gray-500 dark:text-darkMode-textMuted',
  },
  progress: {
    stroke: 'stroke-blue-500 dark:stroke-darkMode-link',
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-600 dark:text-darkMode-link',
  },
  complete: {
    stroke: 'stroke-green-500 dark:stroke-darkMode-success',
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-600 dark:text-darkMode-success',
  },
  exceeded: {
    stroke: 'stroke-yellow-500 dark:stroke-yellow-400',
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-600 dark:text-yellow-400',
  },
}

/**
 * Progress Ring SVG Component
 */
const ProgressRing: React.FC<{
  progress: number
  size: number
  strokeWidth: number
  state: RingState
}> = ({ progress, size, strokeWidth, state }) => {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (progress / 100) * circumference
  const colors = ringColors[state]

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        className="stroke-gray-200 dark:stroke-darkMode-border"
      />
      {/* Progress circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className={`${colors.stroke} transition-all duration-500 ease-out`}
      />
    </svg>
  )
}

/**
 * Compact Progress Ring (for header)
 */
export const DailyGoalProgressCompact: React.FC<{
  className?: string
}> = ({ className = '' }) => {
  const { getTodayProgress, goalStreak } = useGoalsStore()
  const progress = getTodayProgress()
  const percentage = Math.min(100, Math.round((progress.completed / progress.goal) * 100))
  const state = getRingState(progress.completed, progress.goal)
  const colors = ringColors[state]

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <ProgressRing progress={percentage} size={32} strokeWidth={3} state={state} />
        <div className="absolute inset-0 flex items-center justify-center">
          {state === 'complete' ? (
            <CheckCircle className={`w-4 h-4 ${colors.text}`} />
          ) : state === 'exceeded' ? (
            <Star className={`w-4 h-4 ${colors.text}`} />
          ) : (
            <span className={`text-[10px] font-bold ${colors.text}`}>
              {progress.completed}
            </span>
          )}
        </div>
      </div>
      <div className="text-xs">
        <span className={`font-medium ${colors.text}`}>
          {progress.completed}/{progress.goal}
        </span>
        {goalStreak.current > 0 && (
          <span className="ml-1 text-gray-400 dark:text-darkMode-textMuted">
            ({goalStreak.current}d)
          </span>
        )}
      </div>
    </div>
  )
}

/**
 * Full Progress Display
 */
const DailyGoalProgress: React.FC<DailyGoalProgressProps> = ({
  compact = false,
  showStreak = true,
  showAction = true,
  className = '',
}) => {
  const { getTodayProgress, goalStreak, dailyLessonsGoal } = useGoalsStore()
  const progress = getTodayProgress()
  const percentage = Math.min(100, Math.round((progress.completed / progress.goal) * 100))
  const state = getRingState(progress.completed, progress.goal)
  const colors = ringColors[state]
  const remaining = Math.max(0, progress.goal - progress.completed)

  // Message based on progress state
  const getMessage = () => {
    if (state === 'exceeded') {
      return {
        title: 'Exceeding your goal!',
        subtitle: `+${progress.exceededBy} extra ${progress.exceededBy === 1 ? 'lesson' : 'lessons'} today`,
      }
    }
    if (state === 'complete') {
      return {
        title: 'Goal achieved!',
        subtitle: 'Great job hitting your daily target',
      }
    }
    if (progress.completed === 0) {
      return {
        title: 'Ready to learn?',
        subtitle: `Complete ${progress.goal} ${progress.goal === 1 ? 'lesson' : 'lessons'} to reach your goal`,
      }
    }
    return {
      title: `${remaining} more to go!`,
      subtitle: `${progress.completed} of ${progress.goal} lessons completed`,
    }
  }

  const message = getMessage()

  if (compact) {
    return <DailyGoalProgressCompact className={className} />
  }

  return (
    <div
      className={`bg-white dark:bg-darkMode-surface rounded-xl shadow-lg border border-gray-200 dark:border-darkMode-border overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-primary/5 to-transparent dark:from-darkMode-link/10">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary dark:text-darkMode-link" />
          <h3 className="font-semibold text-gray-900 dark:text-darkMode-text">
            Daily Goal
          </h3>
        </div>
      </div>

      {/* Progress Content */}
      <div className="p-6">
        <div className="flex items-center gap-6">
          {/* Progress Ring */}
          <div className="relative flex-shrink-0">
            <ProgressRing progress={percentage} size={80} strokeWidth={6} state={state} />
            <div className="absolute inset-0 flex items-center justify-center">
              {state === 'complete' ? (
                <CheckCircle className={`w-8 h-8 ${colors.text}`} />
              ) : state === 'exceeded' ? (
                <Star className={`w-8 h-8 ${colors.text} fill-current`} />
              ) : (
                <div className="text-center">
                  <span className={`text-xl font-bold ${colors.text}`}>
                    {progress.completed}
                  </span>
                  <span className="text-sm text-gray-400 dark:text-darkMode-textMuted">
                    /{progress.goal}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 dark:text-darkMode-text">
              {message.title}
            </h4>
            <p className="text-sm text-gray-500 dark:text-darkMode-textMuted mt-1">
              {message.subtitle}
            </p>

            {/* Progress dots */}
            <div className="flex gap-1.5 mt-3">
              {Array.from({ length: dailyLessonsGoal }).map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    idx < progress.completed
                      ? state === 'exceeded'
                        ? 'bg-yellow-500 dark:bg-yellow-400'
                        : state === 'complete'
                        ? 'bg-green-500 dark:bg-darkMode-success'
                        : 'bg-blue-500 dark:bg-darkMode-link'
                      : 'bg-gray-200 dark:bg-darkMode-border'
                  }`}
                />
              ))}
              {/* Extra dots for exceeded */}
              {progress.exceededBy > 0 &&
                Array.from({ length: Math.min(progress.exceededBy, 3) }).map((_, idx) => (
                  <div
                    key={`extra-${idx}`}
                    className="w-3 h-3 rounded-full bg-yellow-500 dark:bg-yellow-400"
                  />
                ))}
            </div>
          </div>
        </div>

        {/* Streak Info */}
        {showStreak && goalStreak.current > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-darkMode-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-darkMode-textSecondary">
                  Goal Streak
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-orange-500">
                  {goalStreak.current} {goalStreak.current === 1 ? 'day' : 'days'}
                </span>
                {goalStreak.longest > goalStreak.current && (
                  <span className="text-xs text-gray-400 dark:text-darkMode-textMuted">
                    Best: {goalStreak.longest}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        {showAction && state !== 'complete' && state !== 'exceeded' && (
          <Link
            to="/student/courses"
            className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-primary dark:bg-darkMode-link text-white font-medium rounded-lg hover:bg-primary-dark dark:hover:bg-darkMode-accent transition-colors"
          >
            <span>Continue Learning</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  )
}

export default DailyGoalProgress
