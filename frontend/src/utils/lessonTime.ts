/**
 * Lesson Time Estimation Utilities
 *
 * Provides functions to estimate lesson completion time based on
 * content type, length, and interactive elements.
 */

import type { Lesson, ContentBlock, Quiz } from '../types/course'

/**
 * Time estimation result with formatted display
 */
export interface LessonTimeEstimate {
  minutes: number
  formatted: string
  badge: 'quick' | 'standard' | 'extended'
  badgeColor: string
  badgeLabel: string
}

/**
 * Reading speed configuration (words per minute)
 */
const READING_SPEED = {
  average: 200,
  slow: 150,
  fast: 250,
}

/**
 * Time estimates for different content types (in seconds)
 */
const CONTENT_TIME = {
  heading: 5,
  text: 0, // Calculated based on word count
  list: 0, // Calculated based on items
  image: 15, // Time to view and understand an image
  quote: 8,
  highlight: 10,
  video: 0, // Uses actual duration
  interactive: 30, // Base time for interactive elements
}

/**
 * Quiz time estimates
 */
const QUIZ_TIME = {
  perQuestion: 45, // seconds per quiz question
  readInstructions: 30, // seconds to read quiz instructions
  minimumPerQuiz: 60, // minimum seconds per quiz
}

/**
 * Badge thresholds in minutes
 */
const BADGE_THRESHOLDS = {
  quick: 5,
  standard: 10,
}

/**
 * Badge configuration for each duration category
 */
const BADGE_CONFIG = {
  quick: {
    color: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
    label: 'Quick',
  },
  standard: {
    color: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
    label: 'Standard',
  },
  extended: {
    color: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30',
    label: 'Extended',
  },
}

/**
 * Count words in a string
 */
function countWords(text: string): number {
  if (!text) return 0
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

/**
 * Estimate time for a single content block
 */
function estimateContentBlockTime(block: ContentBlock): number {
  switch (block.type) {
    case 'heading':
      return CONTENT_TIME.heading + (countWords(block.content || '') / READING_SPEED.average) * 60

    case 'text':
      return (countWords(block.content || '') / READING_SPEED.average) * 60

    case 'list':
      if (!block.items) return 0
      const totalListWords = block.items.reduce((sum, item) => sum + countWords(item), 0)
      return (totalListWords / READING_SPEED.average) * 60 + block.items.length * 2

    case 'image':
      return CONTENT_TIME.image

    case 'quote':
      return CONTENT_TIME.quote + (countWords(block.content || '') / READING_SPEED.average) * 60

    case 'highlight':
      return CONTENT_TIME.highlight + (countWords(block.content || '') / READING_SPEED.average) * 60

    default:
      return 0
  }
}

/**
 * Estimate time for a quiz
 */
export function estimateQuizTime(quiz: Quiz): number {
  if (!quiz || !quiz.questions) return 0

  const questionTime = quiz.questions.length * QUIZ_TIME.perQuestion
  const totalTime = QUIZ_TIME.readInstructions + questionTime

  return Math.max(totalTime, QUIZ_TIME.minimumPerQuiz)
}

/**
 * Estimate total lesson time based on content analysis
 */
export function estimateLessonTime(lesson: Lesson): LessonTimeEstimate {
  // If duration is explicitly set, use it
  if (lesson.duration && lesson.duration > 0) {
    return formatTimeEstimate(lesson.duration)
  }

  // Calculate from content
  let totalSeconds = 0

  // Content blocks
  if (lesson.content) {
    for (const block of lesson.content) {
      totalSeconds += estimateContentBlockTime(block)
    }
  }

  // Objectives reading time
  if (lesson.objectives && lesson.objectives.length > 0) {
    const objectiveWords = lesson.objectives.reduce((sum, obj) => sum + countWords(obj), 0)
    totalSeconds += (objectiveWords / READING_SPEED.average) * 60
    totalSeconds += lesson.objectives.length * 3 // Additional time per objective
  }

  // Description reading time
  if (lesson.description) {
    totalSeconds += (countWords(lesson.description) / READING_SPEED.average) * 60
  }

  // Convert to minutes with minimum of 1 minute
  const minutes = Math.max(1, Math.ceil(totalSeconds / 60))

  return formatTimeEstimate(minutes)
}

/**
 * Format time estimate with badge information
 */
export function formatTimeEstimate(minutes: number): LessonTimeEstimate {
  let badge: 'quick' | 'standard' | 'extended'

  if (minutes <= BADGE_THRESHOLDS.quick) {
    badge = 'quick'
  } else if (minutes <= BADGE_THRESHOLDS.standard) {
    badge = 'standard'
  } else {
    badge = 'extended'
  }

  const config = BADGE_CONFIG[badge]

  return {
    minutes,
    formatted: `${minutes} min`,
    badge,
    badgeColor: config.color,
    badgeLabel: config.label,
  }
}

/**
 * Get total estimated time for a module
 */
export function estimateModuleTime(lessons: Lesson[], quiz?: Quiz): number {
  let totalMinutes = 0

  for (const lesson of lessons) {
    const estimate = estimateLessonTime(lesson)
    totalMinutes += estimate.minutes
  }

  if (quiz) {
    totalMinutes += Math.ceil(estimateQuizTime(quiz) / 60)
  }

  return totalMinutes
}

/**
 * Format duration for display
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (remainingMinutes === 0) {
    return `${hours}h`
  }

  return `${hours}h ${remainingMinutes}m`
}

/**
 * Get time category for styling
 */
export function getTimeCategory(minutes: number): 'quick' | 'standard' | 'extended' {
  if (minutes <= BADGE_THRESHOLDS.quick) return 'quick'
  if (minutes <= BADGE_THRESHOLDS.standard) return 'standard'
  return 'extended'
}

export default {
  estimateLessonTime,
  estimateQuizTime,
  estimateModuleTime,
  formatDuration,
  formatTimeEstimate,
  getTimeCategory,
}
