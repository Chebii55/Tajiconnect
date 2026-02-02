import { useState, useEffect } from 'react'
import { BookOpen, Activity, AlertCircle, ChevronRight, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { authService } from '../../services/api/auth'
import type { User } from '../../services/api/auth'
import { courseService } from '../../services/api/courses'
import type { Course, Content } from '../../services/api/courses'
import { apiClient } from '../../services/api/client'
import { API_ENDPOINTS } from '../../services/api/endpoints'
import { useGoalsStore, initializeGoalsListeners } from '../../stores/goalsStore'
import DailyGoalProgress from '../goals/DailyGoalProgress'
import GoalCompletedModal from '../goals/GoalCompletedModal'
import { CatchUpPromptFloating } from '../goals/CatchUpPrompt'
import LeaderboardPreview from '../gamification/LeaderboardPreview'

const StudentDashboard = () => {
  const [user, setUser] = useState<User | null>(null)
  const [analyticsData, setAnalyticsData] = useState<unknown>(null)
  const [contentData, setContentData] = useState<Content[] | null>(null)
  const [courseData, setCourseData] = useState<Course[] | null>(null)
  const [courseError, setCourseError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Initialize goals store
  const { checkDailyProgress } = useGoalsStore()

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)

    // Initialize goals listeners
    const cleanupGoals = initializeGoalsListeners()
    checkDailyProgress()

    const loadDashboard = async () => {
      try {
        setLoading(true)

        const [analytics, content] = await Promise.all([
          apiClient.get(API_ENDPOINTS.ANALYTICS.DASHBOARD, { window_days: 30 }).catch(() => null),
          courseService.getContent({ limit: 5 }).catch(() => null),
        ])

        setAnalyticsData(analytics)
        setContentData(content)

        try {
          const courses = await courseService.getCourses(0, 5)
          setCourseData(courses)
          setCourseError(null)
        } catch (err: any) {
          setCourseData(null)
          setCourseError(err?.message || 'Server Error (500)')
        }
      } catch (err) {
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()

    return () => {
      cleanupGoals()
    }
  }, [checkDailyProgress])

  const studentName = user ? `${user.first_name} ${user.last_name}` : "Student"

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-darkMode-text">
            Welcome back, {studentName}!
          </h1>
          <p className="mt-2 text-gray-600 dark:text-darkMode-textMuted">
            Here's your learning dashboard
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Daily Goal Progress - Featured */}
          <div className="lg:col-span-1 space-y-6">
            <DailyGoalProgress showStreak={true} showAction={true} />
            {/* Leaderboard Preview Widget */}
            <LeaderboardPreview userId={user?.id || 'demo-user'} />
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Continue Learning Card */}
            <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6 border border-gray-100 dark:border-darkMode-border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-primary/10 dark:bg-darkMode-link/20 rounded-lg">
                  <BookOpen className="w-6 h-6 text-primary dark:text-darkMode-link" />
                </div>
                {courseData && courseData.length > 0 && (
                  <span className="text-sm text-gray-500 dark:text-darkMode-textMuted">
                    {courseData.length} enrolled
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-darkMode-text mb-1">
                Continue Learning
              </h3>
              <p className="text-sm text-gray-500 dark:text-darkMode-textMuted mb-4">
                Pick up where you left off
              </p>
              <Link
                to="/student/my-courses"
                className="flex items-center justify-between w-full py-2.5 px-4 bg-primary/5 dark:bg-darkMode-link/10 text-primary dark:text-darkMode-link rounded-lg hover:bg-primary/10 dark:hover:bg-darkMode-link/20 transition-colors"
              >
                <span className="font-medium">View My Courses</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Activity Card */}
            <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6 border border-gray-100 dark:border-darkMode-border">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                  Active
                </span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-darkMode-text mb-1">
                Learning Activity
              </h3>
              <p className="text-sm text-gray-500 dark:text-darkMode-textMuted mb-4">
                Track your progress
              </p>
              <Link
                to="/student/progress"
                className="flex items-center justify-between w-full py-2.5 px-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              >
                <span className="font-medium">View Progress</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quick Lesson Suggestion */}
            <div className="sm:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white dark:bg-darkMode-surface rounded-lg shadow-sm">
                  <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-darkMode-text mb-1">
                    Quick 5-Minute Lesson
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-darkMode-textSecondary mb-3">
                    Perfect for a quick learning session during a break
                  </p>
                  <Link
                    to="/student/courses"
                    className="inline-flex items-center gap-2 py-2 px-4 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  >
                    <span className="font-medium">Browse Quick Lessons</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow p-6">
            <div className="flex items-center">
              <Activity className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900 dark:text-darkMode-text">Analytics</h3>
                <p className="text-sm text-green-600">Available</p>
                {analyticsData !== null && (
                  <p className="text-xs text-gray-500 mt-1">
                    {JSON.stringify(analyticsData).length} bytes loaded
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow p-6">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-green-500" />
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900 dark:text-darkMode-text">Content</h3>
                <p className="text-sm text-green-600">Available</p>
                {contentData && (
                  <p className="text-xs text-gray-500 mt-1">
                    {JSON.stringify(contentData).length} bytes loaded
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow p-6">
            <div className="flex items-center">
              <AlertCircle className={`w-8 h-8 ${courseError ? 'text-red-500' : 'text-green-500'}`} />
              <div className="ml-4">
                <h3 className="font-semibold text-gray-900 dark:text-darkMode-text">Courses</h3>
                {courseError ? (
                  <>
                    <p className="text-sm text-red-600">Server Error (500)</p>
                    <p className="text-xs text-gray-500 mt-1">{courseError}</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-green-600">Available</p>
                    {courseData && (
                      <p className="text-xs text-gray-500 mt-1">
                        {courseData.length} course(s) loaded
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Data Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-darkMode-text mb-4">
              Analytics Data
            </h3>
            {analyticsData !== null ? (
              <pre className="text-sm text-gray-600 dark:text-darkMode-textMuted overflow-auto max-h-60">
                {JSON.stringify(analyticsData, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-500 dark:text-darkMode-textMuted">No analytics data available</p>
            )}
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-darkMode-text mb-4">
              Content Data
            </h3>
            {contentData ? (
              <pre className="text-sm text-gray-600 dark:text-darkMode-textMuted overflow-auto max-h-60">
                {JSON.stringify(contentData, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-500 dark:text-darkMode-textMuted">No content data available</p>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}
      </div>

      {/* Goal Completed Modal */}
      <GoalCompletedModal />

      {/* Catch-Up Prompt (shows when behind on goal) */}
      <CatchUpPromptFloating />
    </div>
  )
}

export default StudentDashboard
