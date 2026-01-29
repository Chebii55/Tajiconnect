import { useState, useEffect } from 'react'
import { BookOpen, Activity, AlertCircle } from 'lucide-react'
import { authService } from '../../services/api/auth'
import type { User } from '../../services/api/auth'
import { courseService } from '../../services/api/courses'
import type { Course, Content } from '../../services/api/courses'
import { apiClient } from '../../services/api/client'
import { API_ENDPOINTS } from '../../services/api/endpoints'

const StudentDashboard = () => {
  const [user, setUser] = useState<User | null>(null)
  const [analyticsData, setAnalyticsData] = useState<unknown>(null)
  const [contentData, setContentData] = useState<Content[] | null>(null)
  const [courseData, setCourseData] = useState<Course[] | null>(null)
  const [courseError, setCourseError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)

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
  }, [])

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
              <pre className="text-sm text-gray-600 dark:text-darkMode-textMuted overflow-auto">
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
              <pre className="text-sm text-gray-600 dark:text-darkMode-textMuted overflow-auto">
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
    </div>
  )
}

export default StudentDashboard
