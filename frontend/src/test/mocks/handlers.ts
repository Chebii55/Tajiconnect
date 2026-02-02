/**
 * MSW Request Handlers
 *
 * Mock Service Worker handlers for intercepting API requests during tests.
 * These handlers provide realistic mock responses for all TajiConnect API endpoints.
 */

import { http, HttpResponse, delay } from 'msw'

// ============================================
// API BASE URL
// ============================================

const API_BASE = '/api/v1'

// ============================================
// MOCK DATA
// ============================================

/**
 * Mock user data
 */
export const mockUser = {
  id: 'user-123',
  email: 'test@tajiconnect.com',
  first_name: 'Test',
  last_name: 'User',
  phone: '+254700000000',
  role: 'student' as const,
  status: 'active' as const,
  subscription_tier: 'free' as const,
  is_active: true,
  is_superuser: false,
  is_verified: true,
  last_login: '2024-01-15T10:00:00Z',
  email_verified_at: '2024-01-01T00:00:00Z',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-15T10:00:00Z',
}

/**
 * Mock user profile
 */
export const mockUserProfile = {
  id: 'profile-123',
  user_id: 'user-123',
  bio: 'Passionate learner',
  avatar_url: 'https://example.com/avatar.jpg',
  location: 'Nairobi, Kenya',
  website: 'https://example.com',
  linkedin_url: 'https://linkedin.com/in/testuser',
  github_url: 'https://github.com/testuser',
  preferred_language: 'en',
  timezone: 'Africa/Nairobi',
  accessibility_preferences: {
    high_contrast: false,
    large_text: false,
    screen_reader_optimized: false,
    reduce_motion: false,
    captions_enabled: true,
  },
  notification_preferences: {
    email_notifications: true,
    push_notifications: true,
    sms_notifications: false,
    marketing_emails: false,
    course_updates: true,
    achievement_notifications: true,
  },
  total_courses_completed: 5,
  total_hours_learned: 120,
  current_streak: 7,
  longest_streak: 14,
  total_points: 2500,
  user_metadata: {},
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-15T10:00:00Z',
}

/**
 * Mock courses
 */
export const mockCourses = [
  {
    id: 'course-1',
    title: 'Introduction to Programming',
    description: 'Learn the basics of programming with Python',
    status: 'published' as const,
    grade_id: 1,
    subject_id: 1,
    instructor_id: 'instructor-1',
    thumbnail_url: 'https://example.com/course1.jpg',
    duration_hours: 10,
    difficulty_level: 'beginner' as const,
    tags: ['python', 'programming', 'beginner'],
    metadata: {},
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'course-2',
    title: 'Advanced Mathematics',
    description: 'Master advanced mathematical concepts',
    status: 'published' as const,
    grade_id: 2,
    subject_id: 2,
    instructor_id: 'instructor-2',
    thumbnail_url: 'https://example.com/course2.jpg',
    duration_hours: 20,
    difficulty_level: 'advanced' as const,
    tags: ['mathematics', 'calculus', 'advanced'],
    metadata: {},
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-20T00:00:00Z',
  },
  {
    id: 'course-3',
    title: 'Web Development Fundamentals',
    description: 'Build modern websites with HTML, CSS, and JavaScript',
    status: 'published' as const,
    grade_id: 1,
    subject_id: 1,
    instructor_id: 'instructor-1',
    thumbnail_url: 'https://example.com/course3.jpg',
    duration_hours: 15,
    difficulty_level: 'intermediate' as const,
    tags: ['web', 'html', 'css', 'javascript'],
    metadata: {},
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-25T00:00:00Z',
  },
]

/**
 * Mock gamification data
 */
export const mockGamificationData = {
  level: 5,
  currentXP: 350,
  xpToNextLevel: 500,
  totalXP: 2350,
  progressPercent: 70,
  currentStreak: 7,
  longestStreak: 14,
  lastActivityDate: '2024-01-15T00:00:00Z',
  streakFreezes: 2,
}

/**
 * Mock XP history
 */
export const mockXPHistory = [
  {
    amount: 50,
    source: 'lesson' as const,
    lessonId: 'lesson-1',
    courseId: 'course-1',
    timestamp: '2024-01-15T10:00:00Z',
  },
  {
    amount: 25,
    source: 'quiz' as const,
    lessonId: 'quiz-1',
    courseId: 'course-1',
    timestamp: '2024-01-15T11:00:00Z',
  },
  {
    amount: 10,
    source: 'daily_login' as const,
    timestamp: '2024-01-15T09:00:00Z',
  },
]

/**
 * Mock tokens
 */
export const mockTokens = {
  access_token: 'mock-access-token-123',
  refresh_token: 'mock-refresh-token-456',
  token_type: 'Bearer',
  expires_in: 3600,
}

// ============================================
// AUTH HANDLERS
// ============================================

const authHandlers = [
  /**
   * Login endpoint
   */
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    await delay(100)
    const body = (await request.json()) as { email: string; password: string }

    if (body.email === 'test@tajiconnect.com' && body.password === 'password123') {
      return HttpResponse.json({
        ...mockTokens,
        user: mockUser,
      })
    }

    return HttpResponse.json(
      { detail: 'Invalid email or password' },
      { status: 401 }
    )
  }),

  /**
   * Register endpoint
   */
  http.post(`${API_BASE}/auth/register`, async ({ request }) => {
    await delay(100)
    const body = (await request.json()) as {
      email: string
      password: string
      first_name: string
      last_name: string
    }

    // Check for existing email
    if (body.email === 'existing@tajiconnect.com') {
      return HttpResponse.json(
        { detail: 'Email already registered' },
        { status: 400 }
      )
    }

    return HttpResponse.json({
      user: {
        ...mockUser,
        email: body.email,
        first_name: body.first_name,
        last_name: body.last_name,
        is_verified: false,
      },
      onboarding_status: 'pending',
      verification_required: true,
      next_steps: ['verify_email', 'complete_profile'],
    })
  }),

  /**
   * Refresh token endpoint
   */
  http.post(`${API_BASE}/auth/refresh`, async ({ request }) => {
    await delay(50)
    const body = (await request.json()) as { refresh_token: string }

    if (body.refresh_token === 'mock-refresh-token-456') {
      return HttpResponse.json({
        access_token: 'new-mock-access-token-789',
        token_type: 'Bearer',
        expires_in: 3600,
      })
    }

    return HttpResponse.json(
      { detail: 'Invalid refresh token' },
      { status: 401 }
    )
  }),

  /**
   * Logout endpoint
   */
  http.post(`${API_BASE}/auth/logout`, async () => {
    await delay(50)
    return HttpResponse.json({ message: 'Successfully logged out' })
  }),

  /**
   * Verify email endpoint
   */
  http.post(`${API_BASE}/auth/verify-email`, async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const token = url.searchParams.get('token')

    if (token === 'valid-token') {
      return HttpResponse.json({
        message: 'Email verified successfully',
        user_id: 'user-123',
        next_step: 'complete_profile',
        onboarding_completed: false,
      })
    }

    return HttpResponse.json(
      { detail: 'Invalid or expired verification token' },
      { status: 400 }
    )
  }),

  /**
   * Forgot password endpoint
   */
  http.post(`${API_BASE}/auth/forgot-password`, async ({ request }) => {
    await delay(100)
    const body = (await request.json()) as { email: string }

    // Always return success to prevent email enumeration
    return HttpResponse.json({
      message: `Password reset email sent to ${body.email}`,
    })
  }),

  /**
   * Reset password endpoint
   */
  http.post(`${API_BASE}/auth/reset-password`, async ({ request }) => {
    await delay(100)
    const body = (await request.json()) as { token: string; new_password: string }

    if (body.token === 'valid-reset-token') {
      return HttpResponse.json({
        message: 'Password reset successfully',
      })
    }

    return HttpResponse.json(
      { detail: 'Invalid or expired reset token' },
      { status: 400 }
    )
  }),

  /**
   * Change password endpoint
   */
  http.post(`${API_BASE}/auth/change-password`, async ({ request }) => {
    await delay(100)
    const body = (await request.json()) as {
      current_password: string
      new_password: string
    }

    if (body.current_password === 'currentPassword123') {
      return HttpResponse.json({
        message: 'Password changed successfully',
      })
    }

    return HttpResponse.json(
      { detail: 'Current password is incorrect' },
      { status: 400 }
    )
  }),

  /**
   * Google OAuth callback
   */
  http.post(`${API_BASE}/auth/google/callback`, async ({ request }) => {
    await delay(100)
    const body = (await request.json()) as { code: string }

    if (body.code === 'valid-google-code') {
      return HttpResponse.json({
        ...mockTokens,
        user: mockUser,
        is_new_user: false,
      })
    }

    return HttpResponse.json(
      { detail: 'Invalid authorization code' },
      { status: 400 }
    )
  }),
]

// ============================================
// USER HANDLERS
// ============================================

const userHandlers = [
  /**
   * Get current user
   */
  http.get(`${API_BASE}/users/me`, async () => {
    await delay(50)
    return HttpResponse.json(mockUser)
  }),

  /**
   * Update current user
   */
  http.put(`${API_BASE}/users/me`, async ({ request }) => {
    await delay(100)
    const body = (await request.json()) as Partial<typeof mockUser>
    return HttpResponse.json({
      ...mockUser,
      ...body,
      updated_at: new Date().toISOString(),
    })
  }),

  /**
   * Delete current user
   */
  http.delete(`${API_BASE}/users/me`, async () => {
    await delay(100)
    return new HttpResponse(null, { status: 204 })
  }),

  /**
   * Get user profile
   */
  http.get(`${API_BASE}/users/me/profile`, async () => {
    await delay(50)
    return HttpResponse.json(mockUserProfile)
  }),

  /**
   * Update user profile
   */
  http.put(`${API_BASE}/users/me/profile`, async ({ request }) => {
    await delay(100)
    const body = (await request.json()) as Partial<typeof mockUserProfile>
    return HttpResponse.json({
      ...mockUserProfile,
      ...body,
      updated_at: new Date().toISOString(),
    })
  }),

  /**
   * Get user by ID
   */
  http.get(`${API_BASE}/users/:userId`, async ({ params }) => {
    await delay(50)
    const { userId } = params

    if (userId === 'user-123') {
      return HttpResponse.json(mockUser)
    }

    return HttpResponse.json({ detail: 'User not found' }, { status: 404 })
  }),

  /**
   * Get user achievements
   */
  http.get(`${API_BASE}/users/me/achievements`, async () => {
    await delay(50)
    return HttpResponse.json([
      {
        id: 'achievement-1',
        user_id: 'user-123',
        title: 'First Steps',
        description: 'Completed your first lesson',
        category: 'learning',
        earned_at: '2024-01-05T00:00:00Z',
        created_at: '2024-01-05T00:00:00Z',
        updated_at: '2024-01-05T00:00:00Z',
      },
      {
        id: 'achievement-2',
        user_id: 'user-123',
        title: 'Week Warrior',
        description: 'Maintained a 7-day streak',
        category: 'streak',
        earned_at: '2024-01-10T00:00:00Z',
        created_at: '2024-01-10T00:00:00Z',
        updated_at: '2024-01-10T00:00:00Z',
      },
    ])
  }),
]

// ============================================
// COURSE HANDLERS
// ============================================

const courseHandlers = [
  /**
   * Get all courses
   */
  http.get(`${API_BASE}/courses`, async ({ request }) => {
    await delay(100)
    const url = new URL(request.url)
    const skip = parseInt(url.searchParams.get('skip') ?? '0', 10)
    const limit = parseInt(url.searchParams.get('limit') ?? '100', 10)
    const gradeId = url.searchParams.get('grade_id')
    const subjectId = url.searchParams.get('subject_id')

    let filteredCourses = [...mockCourses]

    if (gradeId) {
      filteredCourses = filteredCourses.filter(
        (c) => c.grade_id === parseInt(gradeId, 10)
      )
    }

    if (subjectId) {
      filteredCourses = filteredCourses.filter(
        (c) => c.subject_id === parseInt(subjectId, 10)
      )
    }

    return HttpResponse.json(filteredCourses.slice(skip, skip + limit))
  }),

  /**
   * Get course by ID
   */
  http.get(`${API_BASE}/courses/:courseId`, async ({ params }) => {
    await delay(50)
    const { courseId } = params
    const course = mockCourses.find((c) => c.id === courseId)

    if (course) {
      return HttpResponse.json(course)
    }

    return HttpResponse.json({ detail: 'Course not found' }, { status: 404 })
  }),

  /**
   * Create course
   */
  http.post(`${API_BASE}/courses`, async ({ request }) => {
    await delay(100)
    const body = (await request.json()) as Partial<(typeof mockCourses)[0]>
    const newCourse = {
      id: `course-${Date.now()}`,
      ...body,
      status: 'draft' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    return HttpResponse.json(newCourse, { status: 201 })
  }),

  /**
   * Update course
   */
  http.put(`${API_BASE}/courses/:courseId`, async ({ params, request }) => {
    await delay(100)
    const { courseId } = params
    const body = (await request.json()) as Partial<(typeof mockCourses)[0]>
    const course = mockCourses.find((c) => c.id === courseId)

    if (course) {
      return HttpResponse.json({
        ...course,
        ...body,
        updated_at: new Date().toISOString(),
      })
    }

    return HttpResponse.json({ detail: 'Course not found' }, { status: 404 })
  }),

  /**
   * Delete course
   */
  http.delete(`${API_BASE}/courses/:courseId`, async ({ params }) => {
    await delay(100)
    const { courseId } = params
    const course = mockCourses.find((c) => c.id === courseId)

    if (course) {
      return new HttpResponse(null, { status: 204 })
    }

    return HttpResponse.json({ detail: 'Course not found' }, { status: 404 })
  }),

  /**
   * Get grades
   */
  http.get(`${API_BASE}/grades`, async () => {
    await delay(50)
    return HttpResponse.json([
      { id: 1, name: 'Grade 9', description: 'Ninth grade curriculum', order: 1 },
      { id: 2, name: 'Grade 10', description: 'Tenth grade curriculum', order: 2 },
      { id: 3, name: 'Grade 11', description: 'Eleventh grade curriculum', order: 3 },
    ])
  }),

  /**
   * Get subjects
   */
  http.get(`${API_BASE}/subjects`, async () => {
    await delay(50)
    return HttpResponse.json([
      { id: 1, name: 'Computer Science', description: 'Programming and technology', icon: 'code', color: '#3B82F6' },
      { id: 2, name: 'Mathematics', description: 'Mathematical concepts', icon: 'calculator', color: '#10B981' },
      { id: 3, name: 'Science', description: 'Natural sciences', icon: 'flask', color: '#8B5CF6' },
    ])
  }),
]

// ============================================
// GAMIFICATION HANDLERS
// ============================================

const gamificationHandlers = [
  /**
   * Get XP data
   */
  http.get(`${API_BASE}/gamification/xp`, async () => {
    await delay(50)
    return HttpResponse.json({
      success: true,
      data: mockGamificationData,
    })
  }),

  /**
   * Record XP
   */
  http.post(`${API_BASE}/gamification/xp`, async ({ request }) => {
    await delay(100)
    const body = (await request.json()) as {
      userId: string
      amount: number
      source: string
      metadata?: Record<string, string>
    }

    const newTotalXP = mockGamificationData.totalXP + body.amount
    const newCurrentXP = mockGamificationData.currentXP + body.amount
    const didLevelUp = newCurrentXP >= mockGamificationData.xpToNextLevel

    return HttpResponse.json({
      success: true,
      data: {
        xpEarned: body.amount,
        source: body.source,
        level: didLevelUp ? mockGamificationData.level + 1 : mockGamificationData.level,
        currentXP: didLevelUp ? newCurrentXP - mockGamificationData.xpToNextLevel : newCurrentXP,
        xpToNextLevel: mockGamificationData.xpToNextLevel,
        totalXP: newTotalXP,
        progressPercent: didLevelUp
          ? ((newCurrentXP - mockGamificationData.xpToNextLevel) / mockGamificationData.xpToNextLevel) * 100
          : (newCurrentXP / mockGamificationData.xpToNextLevel) * 100,
        didLevelUp,
        previousLevel: didLevelUp ? mockGamificationData.level : null,
        streakBonus: mockGamificationData.currentStreak > 0 ? Math.floor(body.amount * 0.1) : 0,
      },
    })
  }),

  /**
   * Get XP history
   */
  http.get(`${API_BASE}/gamification/xp/history`, async ({ request }) => {
    await delay(50)
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') ?? '10', 10)
    const offset = parseInt(url.searchParams.get('offset') ?? '0', 10)

    return HttpResponse.json({
      success: true,
      data: {
        history: mockXPHistory.slice(offset, offset + limit),
        total: mockXPHistory.length,
        totalXP: mockGamificationData.totalXP,
        pagination: {
          offset,
          limit,
          hasMore: offset + limit < mockXPHistory.length,
        },
      },
    })
  }),

  /**
   * Check level up
   */
  http.post(`${API_BASE}/gamification/level-check`, async ({ request }) => {
    await delay(50)
    const body = (await request.json()) as { userId: string; xpToAdd: number }

    const projectedXP = mockGamificationData.currentXP + body.xpToAdd
    const wouldLevelUp = projectedXP >= mockGamificationData.xpToNextLevel

    return HttpResponse.json({
      success: true,
      data: {
        currentLevel: mockGamificationData.level,
        projectedLevel: wouldLevelUp ? mockGamificationData.level + 1 : mockGamificationData.level,
        wouldLevelUp,
        levelsGained: wouldLevelUp ? 1 : 0,
        currentProgress: mockGamificationData.progressPercent,
        projectedProgress: wouldLevelUp
          ? ((projectedXP - mockGamificationData.xpToNextLevel) / mockGamificationData.xpToNextLevel) * 100
          : (projectedXP / mockGamificationData.xpToNextLevel) * 100,
      },
    })
  }),

  /**
   * Daily login
   */
  http.post(`${API_BASE}/gamification/daily-login`, async () => {
    await delay(100)
    const xpEarned = 10
    const newStreak = mockGamificationData.currentStreak + 1

    return HttpResponse.json({
      success: true,
      data: {
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, mockGamificationData.longestStreak),
        xpEarned,
        level: mockGamificationData.level,
        currentXP: mockGamificationData.currentXP + xpEarned,
        xpToNextLevel: mockGamificationData.xpToNextLevel,
        totalXP: mockGamificationData.totalXP + xpEarned,
        progressPercent:
          ((mockGamificationData.currentXP + xpEarned) / mockGamificationData.xpToNextLevel) * 100,
        isNewRecord: newStreak > mockGamificationData.longestStreak,
      },
    })
  }),
]

// ============================================
// LEADERBOARD HANDLERS (existing handlers preserved)
// ============================================

const leaderboardHandlers = [
  http.get(`${API_BASE}/leaderboard`, ({ request }) => {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')

    return HttpResponse.json({
      success: true,
      data: {
        league: 'bronze',
        entries: [
          { rank: 1, userId: 'user-1', username: 'Alex K.', weeklyXP: 1000, league: 'bronze', trend: 'up', trendAmount: 2, isCurrentUser: false },
          { rank: 2, userId: 'user-2', username: 'Maria S.', weeklyXP: 950, league: 'bronze', trend: 'same', isCurrentUser: false },
          { rank: 3, userId: 'user-3', username: 'James L.', weeklyXP: 900, league: 'bronze', trend: 'down', trendAmount: 1, isCurrentUser: false },
          { rank: 4, userId: 'user-4', username: 'Sarah M.', weeklyXP: 850, league: 'bronze', trend: 'up', trendAmount: 3, isCurrentUser: false },
          { rank: 5, userId: userId || 'current-user', username: 'You', weeklyXP: 800, league: 'bronze', trend: 'up', trendAmount: 1, isCurrentUser: true },
        ],
        userRank: 5,
        totalInLeague: 25,
        promotionZone: true,
        demotionZone: false,
        timeUntilReset: 259200,
        weekStartDate: new Date().toISOString(),
        weekEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    })
  }),

  http.get(`${API_BASE}/leaderboard/:league`, ({ params, request }) => {
    const { league } = params
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')

    return HttpResponse.json({
      success: true,
      data: {
        league,
        entries: [
          { rank: 1, userId: 'user-1', username: 'Alex K.', weeklyXP: 1000, league, trend: 'up', trendAmount: 2, isCurrentUser: false },
          { rank: 2, userId: 'user-2', username: 'Maria S.', weeklyXP: 950, league, trend: 'same', isCurrentUser: false },
          { rank: 3, userId: userId || 'current-user', username: 'You', weeklyXP: 800, league, trend: 'up', trendAmount: 1, isCurrentUser: true },
        ],
        userRank: 3,
        totalInLeague: 20,
        promotionZone: league !== 'diamond',
        demotionZone: league !== 'bronze',
        timeUntilReset: 259200,
        weekStartDate: new Date().toISOString(),
        weekEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    })
  }),

  http.get(`${API_BASE}/leaderboard/user/status`, ({ request }) => {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')

    return HttpResponse.json({
      success: true,
      data: {
        userId,
        league: 'bronze',
        isOptedIn: true,
        weeklyXP: 800,
        currentRank: 5,
        promotionStreak: 0,
      },
    })
  }),

  http.post(`${API_BASE}/leaderboard/opt-out`, async ({ request }) => {
    const body = await request.json() as { userId: string; optIn: boolean }

    return HttpResponse.json({
      success: true,
      data: {
        isOptedIn: body.optIn,
        message: body.optIn ? 'Opted back in to leaderboards' : 'Opted out of leaderboards',
      },
    })
  }),

  http.get(`${API_BASE}/leaderboard/user/history`, ({ request }) => {
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '10')

    return HttpResponse.json({
      success: true,
      data: {
        history: Array.from({ length: Math.min(limit, 5) }, (_, i) => ({
          weekId: `week-${i + 1}`,
          league: 'bronze',
          finalRank: 5 + i,
          totalParticipants: 25,
          weeklyXP: 800 - i * 50,
          promoted: i === 0,
          demoted: false,
        })),
        total: 5,
      },
    })
  }),
]

// ============================================
// ONBOARDING HANDLERS
// ============================================

const onboardingHandlers = [
  /**
   * Get onboarding flow
   */
  http.get(`${API_BASE}/onboarding/flow`, async () => {
    await delay(50)
    return HttpResponse.json({
      steps: [
        { id: 'welcome', completed: true, required: true },
        { id: 'profile', completed: false, required: true },
        { id: 'preferences', completed: false, required: false },
        { id: 'goals', completed: false, required: false },
      ],
      current_step: 'profile',
      completed: false,
    })
  }),

  /**
   * Get onboarding status
   */
  http.get(`${API_BASE}/onboarding/status`, async () => {
    await delay(50)
    return HttpResponse.json({
      completed: false,
      current_step: 'profile',
      steps_completed: 1,
      total_steps: 4,
    })
  }),

  /**
   * Complete onboarding step
   */
  http.post(`${API_BASE}/onboarding/step/complete`, async ({ request }) => {
    await delay(100)
    const body = (await request.json()) as { step: string; data?: Record<string, unknown> }

    return HttpResponse.json({
      message: `Step ${body.step} completed successfully`,
      next_step: body.step === 'goals' ? null : 'preferences',
      completed: body.step === 'goals',
    })
  }),
]

// ============================================
// ERROR HANDLERS (for testing error scenarios)
// ============================================

export const errorHandlers = {
  /**
   * Simulate network error
   */
  networkError: http.get(`${API_BASE}/*`, () => {
    return HttpResponse.error()
  }),

  /**
   * Simulate 500 internal server error
   */
  serverError: http.get(`${API_BASE}/*`, () => {
    return HttpResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    )
  }),

  /**
   * Simulate 401 unauthorized
   */
  unauthorized: http.get(`${API_BASE}/*`, () => {
    return HttpResponse.json(
      { detail: 'Not authenticated' },
      { status: 401 }
    )
  }),

  /**
   * Simulate 403 forbidden
   */
  forbidden: http.get(`${API_BASE}/*`, () => {
    return HttpResponse.json(
      { detail: 'Permission denied' },
      { status: 403 }
    )
  }),

  /**
   * Simulate 429 rate limit
   */
  rateLimited: http.get(`${API_BASE}/*`, () => {
    return HttpResponse.json(
      { detail: 'Rate limit exceeded' },
      { status: 429 }
    )
  }),

  /**
   * Simulate slow response
   */
  slowResponse: http.get(`${API_BASE}/*`, async () => {
    await delay(5000)
    return HttpResponse.json({ message: 'Slow response' })
  }),
}

// ============================================
// EXPORT ALL HANDLERS
// ============================================

export const handlers = [
  ...authHandlers,
  ...userHandlers,
  ...courseHandlers,
  ...gamificationHandlers,
  ...leaderboardHandlers,
  ...onboardingHandlers,
]

export default handlers
