/**
 * Test Utilities
 *
 * Common test utilities, mock data generators, and helper functions.
 */

import { vi, expect, type Mock } from 'vitest'
import userEvent from '@testing-library/user-event'

// ============================================
// USER EVENT SETUP
// ============================================

/**
 * Creates a user event instance with default options
 * Use this for simulating user interactions in tests
 *
 * @example
 * ```tsx
 * const user = createUserEvent()
 * await user.click(button)
 * await user.type(input, 'hello')
 * ```
 */
export function createUserEvent() {
  return userEvent.setup({
    advanceTimers: vi.advanceTimersByTime,
  })
}

// ============================================
// WAIT HELPERS
// ============================================

/**
 * Wait for a specified number of milliseconds
 *
 * @example
 * ```tsx
 * await wait(100) // Wait 100ms
 * ```
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Wait for the next tick of the event loop
 */
export function waitForNextTick(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

/**
 * Wait for a condition to be true
 *
 * @example
 * ```tsx
 * await waitFor(() => element.textContent === 'loaded', { timeout: 5000 })
 * ```
 */
export async function waitForCondition(
  condition: () => boolean | Promise<boolean>,
  options: { timeout?: number; interval?: number } = {}
): Promise<void> {
  const { timeout = 5000, interval = 50 } = options
  const startTime = Date.now()

  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return
    }
    await wait(interval)
  }

  throw new Error(`Condition not met within ${timeout}ms`)
}

// ============================================
// MOCK DATA GENERATORS
// ============================================

/**
 * Generate a unique ID
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 11)}`
}

/**
 * Generate a random email
 */
export function generateEmail(domain = 'tajiconnect.com'): string {
  const randomString = Math.random().toString(36).substring(2, 8)
  return `test-${randomString}@${domain}`
}

/**
 * Generate a mock user
 */
export function createMockUser(overrides: Partial<MockUser> = {}): MockUser {
  return {
    id: generateId('user'),
    email: generateEmail(),
    first_name: 'Test',
    last_name: 'User',
    phone: '+254700000000',
    role: 'student',
    status: 'active',
    subscription_tier: 'free',
    is_active: true,
    is_superuser: false,
    is_verified: true,
    last_login: new Date().toISOString(),
    email_verified_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

interface MockUser {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  role: 'admin' | 'instructor' | 'student' | 'moderator'
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification'
  subscription_tier: 'free' | 'premium' | 'corporate' | 'enterprise'
  is_active: boolean
  is_superuser: boolean
  is_verified: boolean
  last_login?: string
  email_verified_at?: string
  created_at: string
  updated_at: string
}

/**
 * Generate a mock user profile
 */
export function createMockUserProfile(overrides: Partial<MockUserProfile> = {}): MockUserProfile {
  return {
    id: generateId('profile'),
    user_id: generateId('user'),
    bio: 'Test user bio',
    avatar_url: 'https://example.com/avatar.jpg',
    location: 'Nairobi, Kenya',
    website: 'https://example.com',
    preferred_language: 'en',
    timezone: 'Africa/Nairobi',
    accessibility_preferences: {
      high_contrast: false,
      large_text: false,
      reduce_motion: false,
      captions_enabled: true,
    },
    notification_preferences: {
      email_notifications: true,
      push_notifications: true,
      sms_notifications: false,
      marketing_emails: false,
    },
    total_courses_completed: 0,
    total_hours_learned: 0,
    current_streak: 0,
    longest_streak: 0,
    total_points: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

interface MockUserProfile {
  id: string
  user_id: string
  bio?: string
  avatar_url?: string
  location?: string
  website?: string
  preferred_language: string
  timezone: string
  accessibility_preferences: {
    high_contrast?: boolean
    large_text?: boolean
    reduce_motion?: boolean
    captions_enabled?: boolean
  }
  notification_preferences: {
    email_notifications: boolean
    push_notifications: boolean
    sms_notifications: boolean
    marketing_emails: boolean
  }
  total_courses_completed: number
  total_hours_learned: number
  current_streak: number
  longest_streak: number
  total_points: number
  created_at: string
  updated_at: string
}

/**
 * Generate a mock course
 */
export function createMockCourse(overrides: Partial<MockCourse> = {}): MockCourse {
  return {
    id: generateId('course'),
    title: 'Test Course',
    description: 'A test course description',
    status: 'published',
    grade_id: 1,
    subject_id: 1,
    instructor_id: generateId('instructor'),
    thumbnail_url: 'https://example.com/course.jpg',
    duration_hours: 10,
    difficulty_level: 'beginner',
    tags: ['test', 'course'],
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  }
}

interface MockCourse {
  id: string
  title: string
  description: string
  status: 'draft' | 'published' | 'archived'
  grade_id?: number
  subject_id?: number
  instructor_id?: string
  thumbnail_url?: string
  duration_hours?: number
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
  tags?: string[]
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

/**
 * Generate multiple mock courses
 */
export function createMockCourses(count: number): MockCourse[] {
  return Array.from({ length: count }, (_, i) =>
    createMockCourse({
      id: `course-${i + 1}`,
      title: `Course ${i + 1}`,
    })
  )
}

/**
 * Generate mock gamification data
 */
export function createMockGamificationData(overrides: Partial<MockGamificationData> = {}): MockGamificationData {
  return {
    level: 1,
    currentXP: 0,
    xpToNextLevel: 100,
    totalXP: 0,
    progressPercent: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: null,
    streakFreezes: 0,
    ...overrides,
  }
}

interface MockGamificationData {
  level: number
  currentXP: number
  xpToNextLevel: number
  totalXP: number
  progressPercent: number
  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null
  streakFreezes: number
}

/**
 * Generate mock XP event
 */
export function createMockXPEvent(overrides: Partial<MockXPEvent> = {}): MockXPEvent {
  return {
    amount: 50,
    source: 'lesson',
    lessonId: generateId('lesson'),
    courseId: generateId('course'),
    timestamp: new Date().toISOString(),
    ...overrides,
  }
}

interface MockXPEvent {
  amount: number
  source: 'lesson' | 'quiz' | 'daily_login' | 'streak_bonus' | 'badge' | 'achievement' | 'challenge'
  lessonId?: string
  courseId?: string
  timestamp: string
}

/**
 * Generate mock badge
 */
export function createMockBadge(overrides: Partial<MockBadge> = {}): MockBadge {
  return {
    id: generateId('badge'),
    name: 'Test Badge',
    description: 'A test badge',
    icon: 'star',
    category: 'achievement',
    rarity: 'common',
    xpReward: 50,
    unlockedAt: undefined,
    ...overrides,
  }
}

interface MockBadge {
  id: string
  name: string
  description: string
  icon: string
  category: 'achievement' | 'streak' | 'mastery' | 'social' | 'special'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  xpReward: number
  unlockedAt?: string
}

// ============================================
// MOCK FUNCTION HELPERS
// ============================================

/**
 * Create a mock function that resolves with data
 */
export function createAsyncMock<T>(data: T): Mock<() => Promise<T>> {
  return vi.fn().mockResolvedValue(data)
}

/**
 * Create a mock function that rejects with an error
 */
export function createAsyncErrorMock(error: Error | string): Mock<() => Promise<never>> {
  const err = typeof error === 'string' ? new Error(error) : error
  return vi.fn().mockRejectedValue(err)
}

/**
 * Create a mock function that returns data
 */
export function createMock<T>(data: T): Mock<() => T> {
  return vi.fn().mockReturnValue(data)
}

// ============================================
// LOCAL STORAGE HELPERS
// ============================================

/**
 * Set up localStorage with mock data
 */
export function setupLocalStorage(data: Record<string, unknown>): void {
  Object.entries(data).forEach(([key, value]) => {
    localStorage.setItem(key, JSON.stringify(value))
  })
}

/**
 * Clear specific keys from localStorage
 */
export function clearLocalStorageKeys(...keys: string[]): void {
  keys.forEach((key) => localStorage.removeItem(key))
}

/**
 * Set up authentication in localStorage
 */
export function setupAuthStorage(
  accessToken = 'mock-access-token',
  refreshToken = 'mock-refresh-token',
  user = createMockUser()
): void {
  localStorage.setItem('access_token', accessToken)
  localStorage.setItem('refresh_token', refreshToken)
  localStorage.setItem('user', JSON.stringify(user))
}

/**
 * Clear authentication from localStorage
 */
export function clearAuthStorage(): void {
  clearLocalStorageKeys('access_token', 'refresh_token', 'user')
}

// ============================================
// FORM HELPERS
// ============================================

/**
 * Fill a form with values using userEvent
 *
 * @example
 * ```tsx
 * const user = createUserEvent()
 * await fillForm(user, {
 *   email: screen.getByLabelText(/email/i),
 *   password: screen.getByLabelText(/password/i),
 * }, {
 *   email: 'test@example.com',
 *   password: 'password123',
 * })
 * ```
 */
export async function fillForm(
  user: ReturnType<typeof userEvent.setup>,
  fields: Record<string, HTMLElement>,
  values: Record<string, string>
): Promise<void> {
  for (const [key, value] of Object.entries(values)) {
    const field = fields[key]
    if (field) {
      await user.clear(field)
      await user.type(field, value)
    }
  }
}

// ============================================
// ASSERTION HELPERS
// ============================================

/**
 * Assert that an element has specific styles
 */
export function expectStyles(
  element: HTMLElement,
  styles: Record<string, string>
): void {
  const computedStyles = window.getComputedStyle(element)
  Object.entries(styles).forEach(([property, value]) => {
    expect(computedStyles.getPropertyValue(property)).toBe(value)
  })
}

/**
 * Assert that a mock was called with specific arguments
 */
export function expectCalledWith(
  mockFn: Mock,
  ...args: unknown[]
): void {
  expect(mockFn).toHaveBeenCalledWith(...args)
}

/**
 * Assert that a mock was called n times
 */
export function expectCalledTimes(mockFn: Mock, times: number): void {
  expect(mockFn).toHaveBeenCalledTimes(times)
}

// ============================================
// DATE HELPERS
// ============================================

/**
 * Create a date string in ISO format
 */
export function createISODate(
  year: number,
  month: number,
  day: number,
  hours = 0,
  minutes = 0,
  seconds = 0
): string {
  return new Date(year, month - 1, day, hours, minutes, seconds).toISOString()
}

/**
 * Create a date string relative to now
 */
export function createRelativeDate(
  days: number,
  hours = 0,
  minutes = 0
): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  date.setHours(date.getHours() + hours)
  date.setMinutes(date.getMinutes() + minutes)
  return date.toISOString()
}

// ============================================
// ERROR HELPERS
// ============================================

/**
 * Create an API error response
 */
export function createApiError(
  message: string,
  status = 400,
  detail?: string
): { message: string; status: number; detail?: string } {
  return {
    message,
    status,
    detail: detail || message,
  }
}

// ============================================
// EXPORTS
// ============================================

export type {
  MockUser,
  MockUserProfile,
  MockCourse,
  MockGamificationData,
  MockXPEvent,
  MockBadge,
}
