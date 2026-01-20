import { useState } from 'react'

interface AnalyticsData {
  label: string
  value: number
  percentage: number
  color: string
}

interface TimeData {
  day: string
  hours: number
  courses: number
  skills: number
}

interface SkillProgress {
  skill: string
  level: number
  maxLevel: number
  progress: number
  timeSpent: string
  lastPracticed: string
}

const mockCategoryData: AnalyticsData[] = [
  { label: 'Programming', value: 24, percentage: 45, color: 'var(--color-primary-dark)' },
  { label: 'Data Analysis', value: 15, percentage: 28, color: 'var(--color-secondary)' },
  { label: 'Design', value: 8, percentage: 15, color: 'var(--color-primary)' },
  { label: 'Business', value: 6, percentage: 12, color: 'var(--color-forest-sage)' }
]

const mockTimeData: TimeData[] = [
  { day: 'Mon', hours: 2.5, courses: 1, skills: 2 },
  { day: 'Tue', hours: 3.2, courses: 2, skills: 1 },
  { day: 'Wed', hours: 1.8, courses: 1, skills: 3 },
  { day: 'Thu', hours: 4.1, courses: 2, skills: 2 },
  { day: 'Fri', hours: 2.9, courses: 1, skills: 1 },
  { day: 'Sat', hours: 3.7, courses: 3, skills: 2 },
  { day: 'Sun', hours: 2.3, courses: 1, skills: 1 }
]

const mockSkillProgress: SkillProgress[] = [
  {
    skill: 'Python Programming',
    level: 3,
    maxLevel: 5,
    progress: 78,
    timeSpent: '24h 30m',
    lastPracticed: '2025-01-15'
  },
  {
    skill: 'Data Visualization',
    level: 2,
    maxLevel: 5,
    progress: 45,
    timeSpent: '12h 15m',
    lastPracticed: '2025-01-14'
  },
  {
    skill: 'SQL Databases',
    level: 1,
    maxLevel: 5,
    progress: 25,
    timeSpent: '6h 45m',
    lastPracticed: '2025-01-13'
  },
  {
    skill: 'Web Development',
    level: 2,
    maxLevel: 5,
    progress: 35,
    timeSpent: '8h 20m',
    lastPracticed: '2025-01-12'
  }
]

export default function LearningAnalytics() {
  const [activeTab, setActiveTab] = useState<'overview' | 'time' | 'skills' | 'performance'>('overview')
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('week')

  const totalHours = mockTimeData.reduce((sum, day) => sum + day.hours, 0)
  const avgHoursPerDay = totalHours / mockTimeData.length

  const getSkillLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-red-100 text-red-800'
      case 2: return 'bg-yellow-100 text-yellow-800'
      case 3: return 'bg-blue-100 text-blue-800'
      case 4: return 'bg-purple-100 text-purple-800'
      case 5: return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSkillLevelText = (level: number) => {
    switch (level) {
      case 1: return 'Beginner'
      case 2: return 'Novice'
      case 3: return 'Intermediate'
      case 4: return 'Advanced'
      case 5: return 'Expert'
      default: return 'Unknown'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary-dark rounded-xl flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-dark">Learning Analytics</h1>
              <p className="text-gray-600">Detailed insights into your learning patterns and progress</p>
            </div>
          </div>

          {/* Analytics Insights Notification */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-purple-600">🔍</span>
              <div>
                <p className="text-purple-800 font-medium">Learning Insight</p>
                <p className="text-purple-700 text-sm">
                  Your most productive learning time is Thursday mornings. Consider scheduling difficult topics then.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-white rounded-lg shadow-sm">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'time', label: 'Time Analysis', icon: '⏰' },
            { id: 'skills', label: 'Skill Progress', icon: '🎯' },
            { id: 'performance', label: 'Performance', icon: '📈' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-dark text-white'
                  : 'text-gray-600 hover:text-primary-dark hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Period Selector */}
        <div className="flex justify-end mb-6">
          <div className="flex gap-2 p-1 bg-white rounded-lg shadow-sm">
            {['week', 'month', 'quarter'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period as typeof selectedPeriod)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors capitalize ${
                  selectedPeriod === period
                    ? 'bg-primary text-white'
                    : 'text-gray-600 hover:text-primary-dark'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Learning Categories */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark mb-6">Learning Categories</h2>
              <div className="space-y-4">
                {mockCategoryData.map((category, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-primary-dark">{category.label}</span>
                      <span className="text-sm text-gray-600">{category.value}h ({category.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${category.percentage}%`,
                          backgroundColor: category.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark mb-6">Weekly Summary</h2>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">{totalHours.toFixed(1)}h</div>
                  <div className="text-sm text-gray-600">Total Hours</div>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{avgHoursPerDay.toFixed(1)}h</div>
                  <div className="text-sm text-gray-600">Avg/Day</div>
                </div>
                <div className="text-center p-4 bg-forest-sage/10 rounded-lg">
                  <div className="text-2xl font-bold text-forest-sage">11</div>
                  <div className="text-sm text-gray-600">Courses</div>
                </div>
                <div className="text-center p-4 bg-primary-dark/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary-dark">12</div>
                  <div className="text-sm text-gray-600">Skills</div>
                </div>
              </div>

              {/* Learning Streak */}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-primary-dark">Learning Streak</span>
                  <span className="text-2xl font-bold text-secondary">7 days 🔥</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">Keep it up! You're on a roll!</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'time' && (
          <div className="space-y-8">
            {/* Daily Time Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark mb-6">Daily Learning Time</h2>
              <div className="grid grid-cols-7 gap-4">
                {mockTimeData.map((day, index) => (
                  <div key={index} className="text-center">
                    <div className="text-sm text-gray-600 mb-2">{day.day}</div>
                    <div
                      className="bg-secondary rounded-lg mx-auto relative"
                      style={{
                        height: `${Math.max(day.hours * 20, 20)}px`,
                        width: '40px'
                      }}
                    >
                      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-primary-dark">
                        {day.hours}h
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-primary-dark mb-4">Best Learning Times</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-secondary/10 rounded-lg">
                    <span className="text-primary-dark font-medium">🌅 Morning (6-12 PM)</span>
                    <span className="font-bold text-secondary">40%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                    <span className="text-primary-dark font-medium">🌞 Afternoon (12-6 PM)</span>
                    <span className="font-bold text-primary">35%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-forest-sage/10 rounded-lg">
                    <span className="text-primary-dark font-medium">🌙 Evening (6+ PM)</span>
                    <span className="font-bold text-forest-sage">25%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-primary-dark mb-4">Session Duration</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-primary-dark">Average Session</span>
                    <span className="font-bold text-secondary">45 minutes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-dark">Longest Session</span>
                    <span className="font-bold text-primary">2h 30m</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-dark">Sessions This Week</span>
                    <span className="font-bold text-forest-sage">18</span>
                  </div>
                </div>

                {/* Time Feedback */}
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-600">💡</span>
                    <div>
                      <p className="text-yellow-800 text-sm font-medium">Optimization Tip</p>
                      <p className="text-yellow-700 text-sm">
                        Your focus peaks after 30 minutes. Consider longer sessions for better retention.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-primary-dark mb-6">Skill Development Progress</h2>
            <div className="space-y-6">
              {mockSkillProgress.map((skill, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-primary-dark text-lg">{skill.skill}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${getSkillLevelColor(skill.level)}`}>
                          Level {skill.level} - {getSkillLevelText(skill.level)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>⏱️ {skill.timeSpent}</span>
                        <span>📅 Last: {new Date(skill.lastPracticed).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-secondary">{skill.progress}%</div>
                      <div className="text-xs text-gray-500">to next level</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress to Level {skill.level + 1}</span>
                      <span>{skill.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-primary-dark h-3 rounded-full"
                        style={{ width: `${skill.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: skill.maxLevel }, (_, i) => (
                      <div
                        key={i}
                        className={`w-4 h-4 rounded-full ${
                          i < skill.level ? 'bg-secondary' : 'bg-gray-200'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      {skill.level}/{skill.maxLevel} levels
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Skill Recommendations */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <span className="text-blue-600">🎯</span>
                <div>
                  <p className="text-blue-800 font-medium">Skill Development Recommendations</p>
                  <p className="text-blue-700 text-sm">
                    Focus on SQL Databases this week to maintain balanced skill growth across all areas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Performance Trends */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark mb-6">Performance Trends</h2>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-primary-dark">Assessment Scores</span>
                    <span className="text-secondary font-bold">↗️ +5%</span>
                  </div>
                  <div className="text-2xl font-bold text-primary-dark">85%</div>
                  <p className="text-sm text-gray-600">Average across all assessments</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-primary-dark">Completion Rate</span>
                    <span className="text-secondary font-bold">↗️ +12%</span>
                  </div>
                  <div className="text-2xl font-bold text-primary-dark">92%</div>
                  <p className="text-sm text-gray-600">Course completion rate</p>
                </div>
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-primary-dark">Learning Efficiency</span>
                    <span className="text-secondary font-bold">↗️ +8%</span>
                  </div>
                  <div className="text-2xl font-bold text-primary-dark">78%</div>
                  <p className="text-sm text-gray-600">Skills gained per hour</p>
                </div>
              </div>
            </div>

            {/* Comparative Analysis */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark mb-6">Comparative Performance</h2>
              <div className="space-y-4">
                <div className="p-4 bg-secondary/10 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-primary-dark">vs. Peer Average</span>
                    <span className="text-secondary font-bold">+18%</span>
                  </div>
                  <p className="text-sm text-gray-600">You're performing above average</p>
                </div>
                <div className="p-4 bg-primary/10 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-primary-dark">Top 25%</span>
                    <span className="text-primary font-bold">🏆</span>
                  </div>
                  <p className="text-sm text-gray-600">In your learning cohort</p>
                </div>
                <div className="p-4 bg-forest-sage/10 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-primary-dark">Consistency Score</span>
                    <span className="text-forest-sage font-bold">94%</span>
                  </div>
                  <p className="text-sm text-gray-600">Daily learning consistency</p>
                </div>
              </div>

              {/* Performance Feedback */}
              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <span className="text-green-600">⭐</span>
                  <div>
                    <p className="text-green-800 font-medium">Outstanding Performance!</p>
                    <p className="text-green-700 text-sm">
                      Your consistent learning approach is paying off. Keep maintaining this excellent pace.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}