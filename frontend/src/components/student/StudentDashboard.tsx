import { useState, useEffect, useMemo } from 'react'
import {
  Trophy,
  Flame,
  BookOpen,
  Target,
  Star,
  Award,
  Activity,
  Lightbulb,
  Plus,
  Play,
} from 'lucide-react'
import { useRecommendations } from '../../contexts/RecommendationsContext'
import { authService } from '../../services/api/auth'
import { userService } from '../../services/api'
import { learningPathsApi } from '../../services/api/learningPaths'
import type { UserProfileData } from '../../services/api'
import type { LearningPath } from '../../services/api/types'
import RecommendationCard from '../ui/RecommendationCard'
import PerformanceWidget from '../ui/PerformanceWidget'
import LoadingSpinner from '../ui/LoadingSpinner'
import TrendingContent from '../ui/TrendingContent'
import DifficultyAdjuster from '../ui/DifficultyAdjuster'

const StudentDashboard = () => {
  const {
    recommendations,
    performance,
    progressAnalytics,
    isLoading,
    error,
    refreshRecommendations,
  } = useRecommendations()
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState<UserProfileData | null>(null)
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>([])
  const [dashboardLoading, setDashboardLoading] = useState(true)

  useEffect(() => {
    // Get user data
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)

    const loadDashboard = async () => {
      if (!currentUser?.id) {
        setDashboardLoading(false)
        return
      }

      setDashboardLoading(true)
      try {
        const [profileData, userPaths] = await Promise.all([
          userService.getProfile().catch(() => null),
          learningPathsApi.getUserPaths(currentUser.id).catch(() => []),
          refreshRecommendations().catch(() => null),
        ])

        setProfile(profileData)
        setLearningPaths(userPaths)
      } finally {
        setDashboardLoading(false)
      }
    }

    void loadDashboard()
  }, [refreshRecommendations])

  const studentName = user ? `${user.first_name} ${user.last_name}` : "Student"

  const activityItems = progressAnalytics?.recent_activity ?? []
  const hasActivity = activityItems.length > 0
  const hasLearningPaths = learningPaths.length > 0

  const stats = useMemo(() => {
    const enrolledCourses = progressAnalytics?.courses_in_progress ?? null
    const completedCourses = progressAnalytics?.courses_completed ?? profile?.total_courses_completed ?? null
    const currentStreak = progressAnalytics?.current_streak ?? profile?.current_streak ?? null
    const averageScore = performance?.performance_metrics?.success_rate ?? null

    return {
      enrolledCourses,
      completedCourses,
      currentStreak,
      averageScore,
    }
  }, [performance, profile, progressAnalytics])

  const formatPercent = (value: number | null) => {
    if (value === null) return null
    const percent = value <= 1 ? value * 100 : value
    return `${Math.round(percent)}%`
  }

  const formatTimestamp = (timestamp: string) => {
    const parsed = new Date(timestamp)
    if (Number.isNaN(parsed.getTime())) {
      return 'Just now'
    }
    return parsed.toLocaleString()
  }

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white dark:bg-darkMode-surface border-b border-gray-200 dark:border-darkMode-border rounded-lg">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-darkMode-text mb-2">
                  Welcome back, {studentName}!
                </h1>
                <p className="text-gray-600 dark:text-darkMode-textMuted">
                  Continue your learning journey and achieve your goals
                </p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark dark:hover:bg-darkMode-success transition-colors">
                  <Plus className="w-4 h-4" />
                  New Course
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards - Student Focused */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-darkMode-textMuted truncate">
                    Enrolled Courses
                  </dt>
                  <dd className="flex items-baseline">
                    {stats.enrolledCourses === null ? (
                      <div className="text-sm text-gray-500 dark:text-darkMode-textMuted">
                        No data yet
                      </div>
                    ) : (
                      <div className="text-2xl font-semibold text-gray-900 dark:text-darkMode-text">
                        {stats.enrolledCourses}
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Trophy className="w-8 h-8 text-success dark:text-darkMode-success" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-darkMode-textMuted truncate">
                    Completed Courses
                  </dt>
                  <dd className="flex items-baseline">
                    {stats.completedCourses === null ? (
                      <div className="text-sm text-gray-500 dark:text-darkMode-textMuted">
                        No data yet
                      </div>
                    ) : (
                      <div className="text-2xl font-semibold text-gray-900 dark:text-darkMode-text">
                        {stats.completedCourses}
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="w-8 h-8 text-accent-gold" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-darkMode-textMuted truncate">
                    Average Score
                  </dt>
                  <dd className="flex items-baseline">
                    {formatPercent(stats.averageScore) === null ? (
                      <div className="text-sm text-gray-500 dark:text-darkMode-textMuted">
                        No data yet
                      </div>
                    ) : (
                      <div className="text-2xl font-semibold text-gray-900 dark:text-darkMode-text">
                        {formatPercent(stats.averageScore)}
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Flame className="w-8 h-8 text-warning" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-darkMode-textMuted truncate">
                    Learning Streak
                  </dt>
                  <dd className="flex items-baseline">
                    {stats.currentStreak === null ? (
                      <div className="text-sm text-gray-500 dark:text-darkMode-textMuted">
                        No data yet
                      </div>
                    ) : (
                      <div className="text-2xl font-semibold text-gray-900 dark:text-darkMode-text">
                        {stats.currentStreak}
                      </div>
                    )}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Continue Learning */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-darkMode-border">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-darkMode-text">Continue Learning</h2>
              </div>
              <div className="p-6">
                {dashboardLoading ? (
                  <LoadingSpinner message="Loading learning paths..." />
                ) : hasLearningPaths ? (
                  <div className="space-y-4">
                    {learningPaths.map((path) => {
                      const nextModule = path.modules?.[0]
                      return (
                        <div key={path.id} className="border border-gray-200 dark:border-darkMode-border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 dark:text-darkMode-text">{path.title}</h3>
                              <p className="text-sm text-gray-600 dark:text-darkMode-textMuted mt-1">
                                {nextModule ? `Next: ${nextModule.title}` : 'Next module coming soon'}
                              </p>
                            </div>
                            <span className="px-2 py-1 bg-primary/10 dark:bg-darkMode-link/20 text-primary-dark dark:text-darkMode-link text-xs font-medium rounded-full">
                              {path.difficulty_level}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mb-3 text-sm text-gray-500 dark:text-darkMode-textMuted">
                            <span>{path.modules?.length ?? 0} modules</span>
                            <span>{path.estimated_duration_weeks} weeks</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 dark:text-darkMode-textMuted">
                              Keep going to unlock the next lesson
                            </span>
                            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark dark:hover:bg-darkMode-success transition-colors text-sm">
                              <Play className="w-4 h-4" />
                              Continue
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-darkMode-textMuted">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No learning paths yet.</p>
                    <p className="text-sm mt-1">Complete onboarding to generate a personalized path.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow mt-6">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-darkMode-border">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-darkMode-text">Recent Activity</h2>
              </div>
              <div className="p-6">
                {dashboardLoading ? (
                  <LoadingSpinner message="Loading activity..." />
                ) : hasActivity ? (
                  <div className="space-y-4">
                    {activityItems.map((activity, index) => (
                      <div key={`${activity.title}-${index}`} className="flex items-start gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          activity.type === 'completion' ? 'bg-success/10 dark:bg-darkMode-success/20' :
                          activity.type === 'start' ? 'bg-primary/10 dark:bg-darkMode-link/20' :
                          activity.type === 'achievement' ? 'bg-info/10 dark:bg-info/20' :
                          activity.type === 'submission' ? 'bg-warning/10 dark:bg-warning/20' :
                          'bg-gray-100 dark:bg-darkMode-surfaceHover'
                        }`}>
                          {activity.type === 'completion' && <Trophy className="w-4 h-4 text-success dark:text-darkMode-success" />}
                          {activity.type === 'start' && <BookOpen className="w-4 h-4 text-primary" />}
                          {activity.type === 'achievement' && <Award className="w-4 h-4 text-info" />}
                          {activity.type === 'submission' && <Target className="w-4 h-4 text-warning" />}
                          {!['completion', 'start', 'achievement', 'submission'].includes(activity.type) && (
                            <Activity className="w-4 h-4 text-gray-500 dark:text-darkMode-textMuted" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-darkMode-text">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-darkMode-textMuted">
                            {formatTimestamp(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-darkMode-textMuted">
                    <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No recent activity yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Achievements */}
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-darkMode-border">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-darkMode-text">Recent Achievements</h3>
              </div>
              <div className="p-6">
                <div className="text-center py-6 text-gray-500 dark:text-darkMode-textMuted">
                  <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No achievements yet.</p>
                  <p className="text-sm mt-1">Complete lessons to unlock badges.</p>
                </div>
              </div>
            </div>

            {/* Learning Goals */}
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-darkMode-border">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-darkMode-text">Learning Goals</h3>
              </div>
              <div className="p-6">
                <div className="text-center py-6 text-gray-500 dark:text-darkMode-textMuted">
                  <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No learning goals yet.</p>
                  <p className="text-sm mt-1">Set goals during onboarding to track progress.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Recommendations Section */}
        <div className="mt-8 space-y-6">
          {/* Performance Widget */}
          {performance && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <PerformanceWidget performance={performance} />
              </div>
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                      AI-Powered Recommendations
                    </h3>
                    <button
                      onClick={refreshRecommendations}
                      className="text-sm text-primary hover:text-primary-dark transition-colors"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Refreshing...' : 'Refresh'}
                    </button>
                  </div>
                  
                  {isLoading ? (
                    <LoadingSpinner message="Loading personalized recommendations..." />
                  ) : error ? (
                    <div className="text-center py-8">
                      <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
                      <button
                        onClick={refreshRecommendations}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : recommendations.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recommendations.slice(0, 4).map((recommendation, index) => (
                        <RecommendationCard key={index} recommendation={recommendation} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Complete more assessments to get personalized recommendations</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Additional AI Features Section */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TrendingContent />
            <DifficultyAdjuster />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard
