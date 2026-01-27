import { useState, useEffect } from 'react'
import {
  Clock,
  Trophy,
  Flame,
  Rocket,
  BookOpen,
  Target,
  Calendar,
  Star,
  Award,
  Activity,
  Brain,
  Globe,
  Heart,
  Users,
  Lightbulb,
  Leaf,
  Shield,
  Plus,
  BarChart3,
  TrendingUp,
  Play,
  ChevronRight
} from 'lucide-react'
import { useRecommendations } from '../../contexts/RecommendationsContext'
import { authService } from '../../services/api/auth'
import RecommendationCard from '../ui/RecommendationCard'
import PerformanceWidget from '../ui/PerformanceWidget'
import LoadingSpinner from '../ui/LoadingSpinner'
import TrendingContent from '../ui/TrendingContent'
import DifficultyAdjuster from '../ui/DifficultyAdjuster'
import RealTimeNotifications from '../ui/RealTimeNotifications'

const StudentDashboard = () => {
  const { recommendations, performance, isLoading, error, refreshRecommendations } = useRecommendations()
  const [user, setUser] = useState(null)
  const [dashboardData, setDashboardData] = useState({
    recentCourses: [],
    stats: {
      coursesCompleted: 0,
      hoursLearned: 0,
      streak: 0,
      points: 0
    }
  })

  useEffect(() => {
    // Get user data
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)

    // Mock dashboard data (replace with API call)
    setDashboardData({
      recentCourses: [
        {
          id: 1,
          title: "Global Citizenship & Human Rights",
          progress: 75,
          nextLesson: "Climate Justice & Advocacy",
          category: "GCED Core",
          timeRemaining: "2 hours"
        },
        {
          id: 2,
          title: "Sustainable Development Goals",
          progress: 45,
          nextLesson: "SDG Implementation Strategies",
          category: "Sustainability",
          timeRemaining: "1.5 hours"
        }
      ],
      stats: {
        coursesCompleted: 3,
        hoursLearned: 24,
        streak: 7,
        points: 1250
      }
    })
  }, [])

  const studentName = user ? `${user.first_name} ${user.last_name}` : "Student"

  const achievements = [
    { id: 1, title: "First Course Completed", icon: "🏆", date: "2 days ago" },
    { id: 2, title: "Week Streak", icon: "🔥", date: "1 week ago" },
    { id: 3, title: "Quiz Master", icon: "🧠", date: "3 days ago" }
  ]

  const recentActivity = [
    { id: 1, action: "Completed lesson: State Management", time: "2 hours ago", type: "completion" },
    { id: 2, action: "Started: Async/Await module", time: "Yesterday", type: "start" },
    { id: 3, action: "Earned badge: React Basics", time: "2 days ago", type: "achievement" },
    { id: 4, action: "Submitted assignment: Portfolio Project", time: "3 days ago", type: "submission" }
  ]

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
                    <div className="text-2xl font-semibold text-gray-900 dark:text-darkMode-text">
                      {dashboardData.stats.hoursLearned}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-success dark:text-darkMode-success">
                      +2 this month
                    </div>
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
                    <div className="text-2xl font-semibold text-gray-900 dark:text-darkMode-text">
                      {dashboardData.stats.coursesCompleted}
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-success dark:text-darkMode-success">
                      +3 this month
                    </div>
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
                    <div className="text-2xl font-semibold text-gray-900 dark:text-darkMode-text">
                      87%
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-success dark:text-darkMode-success">
                      +5% improvement
                    </div>
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
                    <div className="text-2xl font-semibold text-gray-900 dark:text-darkMode-text">
                      12
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-success dark:text-darkMode-success">
                      days strong
                    </div>
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
                <div className="space-y-4">
                  {dashboardData.recentCourses.map((course) => (
                    <div key={course.id} className="border border-gray-200 dark:border-darkMode-border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-darkMode-text">{course.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-darkMode-textMuted mt-1">
                            Next: {course.nextLesson}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-primary/10 dark:bg-darkMode-link/20 text-primary-dark dark:text-darkMode-link text-xs font-medium rounded-full">
                          {course.category}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-darkMode-textMuted">{course.progress}% complete</span>
                            <span className="text-success dark:text-darkMode-success">{course.timeRemaining} left</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-darkMode-surfaceHover rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-500"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-darkMode-textMuted">
                          {course.timeRemaining} remaining
                        </span>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark dark:hover:bg-darkMode-success transition-colors text-sm">
                          <Play className="w-4 h-4" />
                          Continue
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow mt-6">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-darkMode-border">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-darkMode-text">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'completion' ? 'bg-success/10 dark:bg-darkMode-success/20' :
                        activity.type === 'start' ? 'bg-primary/10 dark:bg-darkMode-link/20' :
                        activity.type === 'achievement' ? 'bg-info/10 dark:bg-info/20' :
                        'bg-warning/10 dark:bg-warning/20'
                      }`}>
                        {activity.type === 'completion' && <Trophy className="w-4 h-4 text-success dark:text-darkMode-success" />}
                        {activity.type === 'start' && <BookOpen className="w-4 h-4 text-primary" />}
                        {activity.type === 'achievement' && <Award className="w-4 h-4 text-info" />}
                        {activity.type === 'submission' && <Target className="w-4 h-4 text-warning" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-darkMode-text">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-darkMode-textMuted">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
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
                <div className="space-y-3">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-darkMode-surfaceHover rounded-lg">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-darkMode-text">{achievement.title}</p>
                        <p className="text-xs text-gray-500 dark:text-darkMode-textMuted">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Learning Goals */}
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-darkMode-border">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-darkMode-text">Learning Goals</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-darkMode-textMuted">Complete 3 courses this month</span>
                    <span className="text-sm font-medium text-success dark:text-darkMode-success">2/3</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-darkMode-surfaceHover rounded-full h-2">
                    <div className="bg-success dark:bg-darkMode-success h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-darkMode-textMuted">Maintain 90% average score</span>
                    <span className="text-sm font-medium text-primary">87%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-darkMode-surfaceHover rounded-full h-2">
                    <div className="bg-primary dark:bg-darkMode-link h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
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