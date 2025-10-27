import { useState } from 'react'

interface ProgressMetric {
  label: string
  current: number
  target: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  change: string
}

interface CourseProgress {
  id: string
  title: string
  progress: number
  timeSpent: string
  lastAccessed: string
  nextMilestone: string
}

interface Achievement {
  id: string
  title: string
  description: string
  earnedDate: string
  category: string
}

const mockMetrics: ProgressMetric[] = [
  { label: 'Learning Hours', current: 47, target: 60, unit: 'hours', trend: 'up', change: '+8 this week' },
  { label: 'Courses Completed', current: 3, target: 8, unit: 'courses', trend: 'up', change: '+1 this month' },
  { label: 'Skills Mastered', current: 12, target: 20, unit: 'skills', trend: 'up', change: '+3 this month' },
  { label: 'Assessment Score', current: 85, target: 90, unit: '%', trend: 'stable', change: 'No change' }
]

const mockCourses: CourseProgress[] = [
  {
    id: '1',
    title: 'Introduction to Python Programming',
    progress: 75,
    timeSpent: '12h 30m',
    lastAccessed: '2025-01-15',
    nextMilestone: 'Complete Functions Module'
  },
  {
    id: '2',
    title: 'Data Analysis Fundamentals',
    progress: 45,
    timeSpent: '8h 15m',
    lastAccessed: '2025-01-14',
    nextMilestone: 'Excel Visualization Project'
  },
  {
    id: '3',
    title: 'Web Development Basics',
    progress: 20,
    timeSpent: '3h 45m',
    lastAccessed: '2025-01-12',
    nextMilestone: 'HTML Structure Quiz'
  }
]

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Course Completed',
    description: 'Completed your first course on TajiConnect',
    earnedDate: '2025-01-10',
    category: 'milestone'
  },
  {
    id: '2',
    title: 'Assessment Master',
    description: 'Scored above 80% on all assessments',
    earnedDate: '2025-01-08',
    category: 'performance'
  }
]

export default function ProgressDashboard() {
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'year'>('month')
  const [showGoals, setShowGoals] = useState(false)

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈'
      case 'down': return '📉'
      default: return '➡️'
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-[#4A9E3D]'
      case 'down': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] via-white to-[#2C857A]/10 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-dark rounded-xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#1C3D6E]">Progress Dashboard</h1>
                <p className="text-gray-600">Track your learning journey and achievements</p>
              </div>
            </div>

            <div className="flex gap-2">
              {['week', 'month', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeFrame(period as typeof timeFrame)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                    timeFrame === period
                      ? 'bg-[#1C3D6E] text-white'
                      : 'text-gray-600 hover:text-[#1C3D6E] hover:bg-gray-100'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Progress Notification */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-green-600">🎯</span>
              <div>
                <p className="text-green-800 font-medium">Great Progress This Month!</p>
                <p className="text-green-700 text-sm">
                  You're on track to meet your learning goals. Keep up the excellent work!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mockMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[#1C3D6E]">{metric.label}</h3>
                <span className={getTrendColor(metric.trend)}>{getTrendIcon(metric.trend)}</span>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[#1C3D6E]">{metric.current}</span>
                  <span className="text-gray-600">/ {metric.target} {metric.unit}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{metric.change}</p>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-dark h-2 rounded-full"
                  style={{ width: `${(metric.current / metric.target) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Course Progress */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#1C3D6E]">Course Progress</h2>
              <button className="text-[#3DAEDB] hover:text-[#1C3D6E] font-medium">View All</button>
            </div>

            <div className="space-y-4">
              {mockCourses.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1C3D6E] mb-1">{course.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>⏱️ {course.timeSpent}</span>
                        <span>📅 Last: {new Date(course.lastAccessed).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-[#4A9E3D]">{course.progress}%</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className="bg-primary-dark h-2 rounded-full"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Next: {course.nextMilestone}</span>
                    <button className="text-[#3DAEDB] hover:text-[#1C3D6E] text-sm font-medium">
                      Continue
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements & Goals */}
          <div className="space-y-6">
            {/* Recent Achievements */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1C3D6E]">Recent Achievements</h2>
                <button className="text-[#3DAEDB] hover:text-[#1C3D6E] font-medium">View All</button>
              </div>

              <div className="space-y-3">
                {mockAchievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-[#4A9E3D]/5 rounded-lg">
                    <div className="w-10 h-10 bg-[#4A9E3D] rounded-full flex items-center justify-center">
                      <span className="text-white">🏆</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1C3D6E]">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <span className="text-xs text-gray-500">
                        {new Date(achievement.earnedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Goals */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1C3D6E]">Learning Goals</h2>
                <button
                  onClick={() => setShowGoals(!showGoals)}
                  className="text-[#3DAEDB] hover:text-[#1C3D6E] font-medium"
                >
                  {showGoals ? 'Hide' : 'Set Goals'}
                </button>
              </div>

              {showGoals ? (
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-[#1C3D6E] mb-2">
                      Monthly Learning Hours
                    </label>
                    <input
                      type="number"
                      defaultValue="60"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DAEDB] focus:border-transparent"
                    />
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="block text-sm font-medium text-[#1C3D6E] mb-2">
                      Courses to Complete
                    </label>
                    <input
                      type="number"
                      defaultValue="8"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DAEDB] focus:border-transparent"
                    />
                  </div>
                  <button className="btn-primary w-full">
                    Update Goals
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-[#1C3D6E] font-medium">Complete 8 courses this year</span>
                    <span className="text-[#4A9E3D] font-bold">3/8</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-[#1C3D6E] font-medium">60 hours monthly learning</span>
                    <span className="text-[#4A9E3D] font-bold">47/60h</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-[#1C3D6E] font-medium">Master 20 skills</span>
                    <span className="text-[#4A9E3D] font-bold">12/20</span>
                  </div>
                </div>
              )}

              {/* Goal Progress Feedback */}
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600">📅</span>
                  <div>
                    <p className="text-blue-800 text-sm font-medium">Monthly Progress Check</p>
                    <p className="text-blue-700 text-sm">
                      You're 78% towards your monthly learning goal. Stay consistent to reach it!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Time Analytics Chart Placeholder */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#1C3D6E] mb-6">Learning Time Analytics</h2>
          <div className="h-64 bg-primary-dark/10 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">📈</div>
              <p className="text-gray-600">Interactive charts will be displayed here</p>
              <p className="text-sm text-gray-500">Weekly learning patterns, skill progress over time, etc.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}