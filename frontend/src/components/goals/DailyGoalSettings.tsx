/**
 * Daily Goal Settings Component
 *
 * Allows users to configure their daily learning goal (1-10 lessons)
 * with smart suggestions based on their time commitment and history.
 */

import React, { useState, useEffect } from 'react'
import { Target, Clock, TrendingUp, Info, Check } from 'lucide-react'
import { useGoalsStore } from '../../stores/goalsStore'
import { useUserProfileStore } from '../../stores/userProfileStore'
import {
  suggestDailyGoal,
  getTimeCommitmentOptions,
  estimateDailyTime,
} from '../../utils/goalSuggestions'

interface DailyGoalSettingsProps {
  /** Callback when goal is saved */
  onSave?: () => void
  /** Show in compact mode */
  compact?: boolean
  /** Additional CSS classes */
  className?: string
}

const DailyGoalSettings: React.FC<DailyGoalSettingsProps> = ({
  onSave,
  compact = false,
  className = '',
}) => {
  // Select state values individually
  const dailyLessonsGoal = useGoalsStore((state) => state.dailyLessonsGoal)
  const timeCommitment = useGoalsStore((state) => state.timeCommitment)
  const goalHistory = useGoalsStore((state) => state.goalHistory)

  // Select actions individually
  const setDailyGoal = useGoalsStore((state) => state.setDailyGoal)
  const setTimeCommitment = useGoalsStore((state) => state.setTimeCommitment)

  const { profile } = useUserProfileStore()

  const [localGoal, setLocalGoal] = useState(dailyLessonsGoal)
  const [localCommitment, setLocalCommitment] = useState(timeCommitment)
  const [showSuggestion, setShowSuggestion] = useState(false)

  // Get suggestion based on profile and history
  const lessonHistory = goalHistory.flatMap((day) =>
    day.lessonsCompleted.map((lessonId) => ({
      lessonId,
      completedAt: day.date,
      duration: 7, // Average duration
    }))
  )

  const suggestion = suggestDailyGoal(profile, lessonHistory)
  const estimatedTime = estimateDailyTime(localGoal)
  const timeCommitmentOptions = getTimeCommitmentOptions()

  // Sync local state with store on mount
  useEffect(() => {
    setLocalGoal(dailyLessonsGoal)
    setLocalCommitment(timeCommitment)
  }, [dailyLessonsGoal, timeCommitment])

  const handleSave = () => {
    setDailyGoal(localGoal)
    setTimeCommitment(localCommitment)
    onSave?.()
  }

  const handleApplySuggestion = () => {
    setLocalGoal(suggestion.dailyLessonsGoal)
    setLocalCommitment(suggestion.timeCommitment)
    setShowSuggestion(false)
  }

  const hasChanges =
    localGoal !== dailyLessonsGoal || localCommitment !== timeCommitment

  if (compact) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-between p-4 bg-white dark:bg-darkMode-surface rounded-lg border border-gray-200 dark:border-darkMode-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 dark:bg-darkMode-link/20 rounded-lg">
              <Target className="w-5 h-5 text-primary dark:text-darkMode-link" />
            </div>
            <div>
              <p className="font-medium text-gray-900 dark:text-darkMode-text">
                Daily Goal
              </p>
              <p className="text-sm text-gray-500 dark:text-darkMode-textMuted">
                {dailyLessonsGoal} lessons ({estimatedTime.formatted})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDailyGoal(Math.max(1, dailyLessonsGoal - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-darkMode-surfaceHover text-gray-600 dark:text-darkMode-textSecondary hover:bg-gray-200 dark:hover:bg-darkMode-border transition-colors"
              disabled={dailyLessonsGoal <= 1}
            >
              -
            </button>
            <span className="w-8 text-center font-bold text-lg text-gray-900 dark:text-darkMode-text">
              {dailyLessonsGoal}
            </span>
            <button
              onClick={() => setDailyGoal(Math.min(10, dailyLessonsGoal + 1))}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-darkMode-surfaceHover text-gray-600 dark:text-darkMode-textSecondary hover:bg-gray-200 dark:hover:bg-darkMode-border transition-colors"
              disabled={dailyLessonsGoal >= 10}
            >
              +
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`bg-white dark:bg-darkMode-surface rounded-xl shadow-lg border border-gray-200 dark:border-darkMode-border ${className}`}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-darkMode-border">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 dark:bg-darkMode-link/20 rounded-lg">
            <Target className="w-6 h-6 text-primary dark:text-darkMode-link" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-darkMode-text">
              Daily Learning Goal
            </h3>
            <p className="text-sm text-gray-500 dark:text-darkMode-textMuted">
              Set how many lessons you want to complete each day
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Smart Suggestion */}
        {suggestion.dailyLessonsGoal !== dailyLessonsGoal && (
          <div
            className={`p-4 rounded-lg border transition-all duration-300 ${
              showSuggestion
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                : 'bg-gray-50 dark:bg-darkMode-surfaceHover border-gray-200 dark:border-darkMode-border'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-darkMode-text">
                    Suggested Goal: {suggestion.dailyLessonsGoal} lessons
                  </p>
                  <p className="text-sm text-gray-600 dark:text-darkMode-textSecondary mt-1">
                    {suggestion.reason}
                  </p>
                </div>
              </div>
              <button
                onClick={handleApplySuggestion}
                className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        )}

        {/* Goal Slider */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="font-medium text-gray-900 dark:text-darkMode-text">
              Lessons per day
            </label>
            <span className="text-2xl font-bold text-primary dark:text-darkMode-link">
              {localGoal}
            </span>
          </div>

          <input
            type="range"
            min="1"
            max="10"
            value={localGoal}
            onChange={(e) => setLocalGoal(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-darkMode-border rounded-lg appearance-none cursor-pointer accent-primary dark:accent-darkMode-link"
          />

          <div className="flex justify-between text-xs text-gray-500 dark:text-darkMode-textMuted mt-2">
            <span>1</span>
            <span>5</span>
            <span>10</span>
          </div>

          {/* Estimated Time */}
          <div className="flex items-center gap-2 mt-4 p-3 bg-gray-50 dark:bg-darkMode-surfaceHover rounded-lg">
            <Clock className="w-4 h-4 text-gray-500 dark:text-darkMode-textMuted" />
            <span className="text-sm text-gray-600 dark:text-darkMode-textSecondary">
              Estimated daily time: <strong>{estimatedTime.formatted}</strong>
            </span>
          </div>
        </div>

        {/* Time Commitment Selection */}
        <div>
          <label className="block font-medium text-gray-900 dark:text-darkMode-text mb-3">
            Time Commitment
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {timeCommitmentOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setLocalCommitment(option.value)
                  setLocalGoal(option.config.suggestedLessons)
                }}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  localCommitment === option.value
                    ? 'border-primary dark:border-darkMode-link bg-primary/5 dark:bg-darkMode-link/10'
                    : 'border-gray-200 dark:border-darkMode-border hover:border-gray-300 dark:hover:border-darkMode-textMuted'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900 dark:text-darkMode-text">
                    {option.label}
                  </span>
                  {localCommitment === option.value && (
                    <Check className="w-5 h-5 text-primary dark:text-darkMode-link" />
                  )}
                </div>
                <span className="text-sm text-gray-500 dark:text-darkMode-textMuted">
                  {option.description}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Info Box */}
        <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <p className="font-medium mb-1">Tip: Start small and build up</p>
            <p className="text-blue-600 dark:text-blue-300">
              Consistency is more important than volume. A smaller achievable goal
              helps build lasting habits.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200 dark:border-darkMode-border bg-gray-50 dark:bg-darkMode-surfaceHover rounded-b-xl">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 dark:text-darkMode-textMuted">
            {hasChanges ? 'You have unsaved changes' : 'All changes saved'}
          </span>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              hasChanges
                ? 'bg-primary dark:bg-darkMode-link text-white hover:bg-primary-dark dark:hover:bg-darkMode-accent'
                : 'bg-gray-200 dark:bg-darkMode-border text-gray-400 dark:text-darkMode-textMuted cursor-not-allowed'
            }`}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default DailyGoalSettings
