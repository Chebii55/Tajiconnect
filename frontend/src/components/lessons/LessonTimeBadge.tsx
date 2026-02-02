/**
 * Lesson Time Badge Component
 *
 * Displays estimated lesson duration with color-coded badge
 * indicating quick (green), standard (blue), or extended (orange) lessons.
 */

import React from 'react'
import { Clock } from 'lucide-react'
import { formatTimeEstimate, getTimeCategory } from '../../utils/lessonTime'

interface LessonTimeBadgeProps {
  /** Duration in minutes */
  minutes: number
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Show icon */
  showIcon?: boolean
  /** Show category label (Quick, Standard, Extended) */
  showLabel?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * Size configurations
 */
const sizeConfig = {
  sm: {
    container: 'px-2 py-0.5 text-xs gap-1',
    icon: 'w-3 h-3',
  },
  md: {
    container: 'px-2.5 py-1 text-sm gap-1.5',
    icon: 'w-4 h-4',
  },
  lg: {
    container: 'px-3 py-1.5 text-base gap-2',
    icon: 'w-5 h-5',
  },
}

/**
 * Color configurations by category
 */
const colorConfig = {
  quick: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
  },
  standard: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
  },
  extended: {
    bg: 'bg-orange-100 dark:bg-orange-900/30',
    text: 'text-orange-700 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-800',
  },
}

/**
 * Category labels
 */
const categoryLabels = {
  quick: 'Quick',
  standard: 'Standard',
  extended: 'Extended',
}

const LessonTimeBadge: React.FC<LessonTimeBadgeProps> = ({
  minutes,
  size = 'md',
  showIcon = true,
  showLabel = false,
  className = '',
}) => {
  const timeEstimate = formatTimeEstimate(minutes)
  const category = getTimeCategory(minutes)
  const colors = colorConfig[category]
  const sizes = sizeConfig[size]

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${sizes.container}
        ${colors.bg}
        ${colors.text}
        ${className}
      `.trim()}
      title={`Estimated time: ${timeEstimate.formatted}`}
    >
      {showIcon && <Clock className={sizes.icon} />}
      <span>{timeEstimate.formatted}</span>
      {showLabel && (
        <span className="opacity-75">({categoryLabels[category]})</span>
      )}
    </span>
  )
}

/**
 * Compact version for list views
 */
export const LessonTimeBadgeCompact: React.FC<{
  minutes: number
  className?: string
}> = ({ minutes, className = '' }) => {
  const category = getTimeCategory(minutes)
  const colors = colorConfig[category]

  return (
    <span
      className={`
        inline-flex items-center gap-1 text-xs
        ${colors.text}
        ${className}
      `.trim()}
    >
      <Clock className="w-3 h-3" />
      <span>{minutes}m</span>
    </span>
  )
}

/**
 * Badge with tooltip showing breakdown
 */
export const LessonTimeBadgeDetailed: React.FC<{
  minutes: number
  contentMinutes?: number
  quizMinutes?: number
  className?: string
}> = ({ minutes, contentMinutes, quizMinutes, className = '' }) => {
  const category = getTimeCategory(minutes)
  const colors = colorConfig[category]
  const sizes = sizeConfig.md

  return (
    <div className={`relative group ${className}`}>
      <span
        className={`
          inline-flex items-center rounded-full font-medium
          ${sizes.container}
          ${colors.bg}
          ${colors.text}
        `.trim()}
      >
        <Clock className={sizes.icon} />
        <span>{minutes} min</span>
      </span>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10">
        <div className="flex flex-col gap-1">
          <span className="font-medium">Time breakdown:</span>
          {contentMinutes !== undefined && (
            <span>Content: ~{contentMinutes} min</span>
          )}
          {quizMinutes !== undefined && (
            <span>Quiz: ~{quizMinutes} min</span>
          )}
          <span className="text-gray-300 text-[10px] mt-1">
            {categoryLabels[category]} lesson
          </span>
        </div>
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
          <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
        </div>
      </div>
    </div>
  )
}

export default LessonTimeBadge
