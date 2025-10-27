import { useState } from 'react'

interface TimeSession {
  id: string
  startTime: string
  endTime: string
  duration: number // in minutes
  activity: string
  category: 'course' | 'assessment' | 'reading' | 'practice' | 'other'
  subject: string
  focusScore: number // 0-100 based on interaction patterns
  productivity: 'high' | 'medium' | 'low'
  deviceType: 'desktop' | 'mobile' | 'tablet'
}

interface DailyStats {
  date: string
  totalMinutes: number
  sessions: number
  avgFocusScore: number
  topCategory: string
  longestSession: number
  productivity: 'high' | 'medium' | 'low'
}

interface TimePattern {
  hour: number
  avgMinutes: number
  sessionCount: number
  focusScore: number
  productivity: number
}

interface WeeklyComparison {
  week: string
  totalHours: number
  change: number
  avgSessionLength: number
  focusScore: number
}

const mockSessions: TimeSession[] = [
  {
    id: 's1',
    startTime: '2025-01-15T09:00:00Z',
    endTime: '2025-01-15T10:30:00Z',
    duration: 90,
    activity: 'Python Fundamentals - Variables and Data Types',
    category: 'course',
    subject: 'Python Programming',
    focusScore: 85,
    productivity: 'high',
    deviceType: 'desktop'
  },
  {
    id: 's2',
    startTime: '2025-01-15T14:15:00Z',
    endTime: '2025-01-15T15:00:00Z',
    duration: 45,
    activity: 'Data Analysis Quiz',
    category: 'assessment',
    subject: 'Data Science',
    focusScore: 92,
    productivity: 'high',
    deviceType: 'desktop'
  },
  {
    id: 's3',
    startTime: '2025-01-15T20:30:00Z',
    endTime: '2025-01-15T21:15:00Z',
    duration: 45,
    activity: 'JavaScript Practice Exercises',
    category: 'practice',
    subject: 'Web Development',
    focusScore: 67,
    productivity: 'medium',
    deviceType: 'mobile'
  }
]

const mockDailyStats: DailyStats[] = [
  { date: '2025-01-15', totalMinutes: 180, sessions: 3, avgFocusScore: 81, topCategory: 'course', longestSession: 90, productivity: 'high' },
  { date: '2025-01-14', totalMinutes: 135, sessions: 2, avgFocusScore: 78, topCategory: 'course', longestSession: 85, productivity: 'high' },
  { date: '2025-01-13', totalMinutes: 95, sessions: 2, avgFocusScore: 72, topCategory: 'practice', longestSession: 60, productivity: 'medium' },
  { date: '2025-01-12', totalMinutes: 210, sessions: 4, avgFocusScore: 88, topCategory: 'course', longestSession: 75, productivity: 'high' },
  { date: '2025-01-11', totalMinutes: 75, sessions: 1, avgFocusScore: 65, topCategory: 'reading', longestSession: 75, productivity: 'medium' },
  { date: '2025-01-10', totalMinutes: 165, sessions: 3, avgFocusScore: 84, topCategory: 'course', longestSession: 90, productivity: 'high' },
  { date: '2025-01-09', totalMinutes: 120, sessions: 2, avgFocusScore: 76, topCategory: 'assessment', longestSession: 80, productivity: 'medium' }
]

const mockTimePatterns: TimePattern[] = [
  { hour: 6, avgMinutes: 0, sessionCount: 0, focusScore: 0, productivity: 0 },
  { hour: 7, avgMinutes: 15, sessionCount: 2, focusScore: 70, productivity: 65 },
  { hour: 8, avgMinutes: 25, sessionCount: 4, focusScore: 75, productivity: 70 },
  { hour: 9, avgMinutes: 45, sessionCount: 8, focusScore: 88, productivity: 85 },
  { hour: 10, avgMinutes: 38, sessionCount: 6, focusScore: 85, productivity: 82 },
  { hour: 11, avgMinutes: 30, sessionCount: 5, focusScore: 80, productivity: 78 },
  { hour: 12, avgMinutes: 20, sessionCount: 3, focusScore: 65, productivity: 60 },
  { hour: 13, avgMinutes: 18, sessionCount: 3, focusScore: 62, productivity: 58 },
  { hour: 14, avgMinutes: 35, sessionCount: 7, focusScore: 82, productivity: 80 },
  { hour: 15, avgMinutes: 28, sessionCount: 5, focusScore: 78, productivity: 75 },
  { hour: 16, avgMinutes: 22, sessionCount: 4, focusScore: 70, productivity: 68 },
  { hour: 17, avgMinutes: 15, sessionCount: 2, focusScore: 65, productivity: 62 },
  { hour: 18, avgMinutes: 10, sessionCount: 2, focusScore: 60, productivity: 55 },
  { hour: 19, avgMinutes: 20, sessionCount: 3, focusScore: 68, productivity: 65 },
  { hour: 20, avgMinutes: 25, sessionCount: 4, focusScore: 72, productivity: 70 },
  { hour: 21, avgMinutes: 18, sessionCount: 3, focusScore: 65, productivity: 62 },
  { hour: 22, avgMinutes: 12, sessionCount: 2, focusScore: 58, productivity: 55 },
  { hour: 23, avgMinutes: 5, sessionCount: 1, focusScore: 50, productivity: 45 }
]

const mockWeeklyComparison: WeeklyComparison[] = [
  { week: 'This Week', totalHours: 18.5, change: 12.5, avgSessionLength: 52, focusScore: 81 },
  { week: 'Last Week', totalHours: 16.4, change: -3.2, avgSessionLength: 48, focusScore: 78 },
  { week: '2 Weeks Ago', totalHours: 16.9, change: 8.1, avgSessionLength: 45, focusScore: 75 },
  { week: '3 Weeks Ago', totalHours: 15.6, change: -5.5, avgSessionLength: 42, focusScore: 73 }
]

export default function TimeSpentAnalytics() {
  const [activeTab, setActiveTab] = useState<'overview' | 'patterns' | 'focus' | 'insights'>('overview')
  // Future feature: period and category filtering
  // const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('week')
  // const [selectedCategory, setSelectedCategory] = useState<'all' | TimeSession['category']>('all')

  const getCategoryColor = (category: TimeSession['category']) => {
    switch (category) {
      case 'course': return 'bg-blue-100 text-blue-800'
      case 'assessment': return 'bg-green-100 text-green-800'
      case 'reading': return 'bg-purple-100 text-purple-800'
      case 'practice': return 'bg-yellow-100 text-yellow-800'
      case 'other': return 'bg-gray-100 text-gray-800'
    }
  }

  const getProductivityColor = (productivity: string) => {
    switch (productivity) {
      case 'high': return 'text-green-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-red-600'
    }
  }

  const getDeviceIcon = (device: TimeSession['deviceType']) => {
    switch (device) {
      case 'desktop': return '🖥️'
      case 'mobile': return '📱'
      case 'tablet': return '📱'
    }
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const totalMinutesThisWeek = mockDailyStats.reduce((sum, day) => sum + day.totalMinutes, 0)
  const avgSessionLength = mockSessions.reduce((sum, session) => sum + session.duration, 0) / mockSessions.length
  const avgFocusScore = mockSessions.reduce((sum, session) => sum + session.focusScore, 0) / mockSessions.length

  const categoryStats = Object.entries(
    mockSessions.reduce((acc, session) => {
      acc[session.category] = (acc[session.category] || 0) + session.duration
      return acc
    }, {} as Record<string, number>)
  ).map(([category, minutes]) => ({
    category: category as TimeSession['category'],
    minutes,
    percentage: (minutes / totalMinutesThisWeek) * 100
  }))

  const peakHour = mockTimePatterns.reduce((max, current) =>
    current.avgMinutes > max.avgMinutes ? current : max
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] via-white to-[#2C857A]/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary-dark rounded-xl flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB]">Time Spent Analytics</h1>
              <p className="text-gray-600 dark:text-gray-300">Detailed analysis of your learning time and productivity patterns</p>
            </div>
          </div>

          {/* Time Insight Notification */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-yellow-600">⏰</span>
              <div>
                <p className="text-yellow-800 font-medium">Peak Performance Time Detected!</p>
                <p className="text-yellow-700 text-sm">
                  Your focus score is highest at {peakHour.hour}:00. Consider scheduling challenging topics during this time.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-[#4A9E3D]">{formatDuration(totalMinutesThisWeek)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total This Week</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-[#3DAEDB]">{Math.round(avgSessionLength)}m</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Avg Session</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-[#2C857A]">{Math.round(avgFocusScore)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Focus Score</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB]">{mockSessions.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Sessions Today</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'patterns', label: 'Time Patterns', icon: '🕐' },
            { id: 'focus', label: 'Focus Analysis', icon: '🎯' },
            { id: 'insights', label: 'Insights', icon: '💡' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-colors flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-[#1C3D6E] text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-[#1C3D6E] dark:text-[#3DAEDB] hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Weekly Comparison */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-6">Weekly Progress Comparison</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockWeeklyComparison.map((week, index) => (
                  <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold text-[#1C3D6E] dark:text-[#3DAEDB] mb-2">{week.week}</h3>
                    <div className="text-2xl font-bold text-[#4A9E3D] mb-1">{week.totalHours}h</div>
                    <div className={`text-sm font-medium ${week.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {week.change >= 0 ? '+' : ''}{week.change}%
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Avg: {week.avgSessionLength}m | Focus: {week.focusScore}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Daily Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-6">Daily Activity Overview</h2>
              <div className="space-y-4">
                {mockDailyStats.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="font-bold text-[#1C3D6E] dark:text-[#3DAEDB]">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="font-semibold text-[#1C3D6E] dark:text-[#3DAEDB]">{formatDuration(day.totalMinutes)}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">{day.sessions} sessions</div>
                          </div>
                          <div className="flex-1 max-w-xs">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary-dark h-2 rounded-full"
                                style={{ width: `${Math.min((day.totalMinutes / 240) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-[#3DAEDB]">Focus: {day.avgFocusScore}</div>
                      <div className={`text-sm ${getProductivityColor(day.productivity)}`}>
                        {day.productivity} productivity
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-6">Time by Category</h2>
                <div className="space-y-4">
                  {categoryStats.map((stat) => (
                    <div key={stat.category}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(stat.category)}`}>
                          {stat.category}
                        </span>
                        <span className="text-sm font-medium">{formatDuration(stat.minutes)}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${stat.percentage}%` }}
                        />
                      </div>
                      <div className="text-right text-xs text-gray-500 mt-1">
                        {Math.round(stat.percentage)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-6">Recent Sessions</h2>
                <div className="space-y-3">
                  {mockSessions.slice(0, 5).map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{getDeviceIcon(session.deviceType)}</span>
                        <div>
                          <div className="font-medium text-[#1C3D6E] dark:text-[#3DAEDB] text-sm">{session.activity}</div>
                          <div className="text-xs text-gray-500">
                            {formatTime(session.startTime)} - {formatTime(session.endTime)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-[#4A9E3D]">{formatDuration(session.duration)}</div>
                        <div className="text-xs text-gray-500">Focus: {session.focusScore}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Time Patterns Tab */}
        {activeTab === 'patterns' && (
          <div className="space-y-6">
            {/* Hour-by-Hour Analysis */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-6">Learning Time by Hour</h2>

              {/* Chart Placeholder */}
              <div className="h-64 bg-primary-dark/10 rounded-lg flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <p className="text-gray-600 dark:text-gray-300">Interactive hourly activity chart</p>
                  <p className="text-sm text-gray-500">Shows learning minutes and focus scores by hour</p>
                </div>
              </div>

              {/* Peak Hours */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#4A9E3D]">{peakHour.hour}:00</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Peak Hour</div>
                  <div className="text-xs text-gray-500">{peakHour.avgMinutes}min avg</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#3DAEDB]">
                    {Math.max(...mockTimePatterns.map(p => p.focusScore))}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Best Focus Score</div>
                  <div className="text-xs text-gray-500">at {mockTimePatterns.find(p => p.focusScore === Math.max(...mockTimePatterns.map(p => p.focusScore)))?.hour}:00</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {mockTimePatterns.reduce((sum, p) => sum + p.sessionCount, 0)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Total Sessions</div>
                  <div className="text-xs text-gray-500">this week</div>
                </div>
              </div>
            </div>

            {/* Time Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-4">Preferred Learning Times</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium text-[#1C3D6E] dark:text-[#3DAEDB]">🌅 Morning (6-12 PM)</span>
                    <span className="font-bold text-[#4A9E3D]">45%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium text-[#1C3D6E] dark:text-[#3DAEDB]">🌞 Afternoon (12-6 PM)</span>
                    <span className="font-bold text-[#3DAEDB]">35%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="font-medium text-[#1C3D6E] dark:text-[#3DAEDB]">🌙 Evening (6+ PM)</span>
                    <span className="font-bold text-purple-600">20%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-4">Session Length Distribution</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[#1C3D6E] dark:text-[#3DAEDB]">Short (&lt; 30min)</span>
                    <span className="font-bold text-[#4A9E3D]">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#1C3D6E] dark:text-[#3DAEDB]">Medium (30-60min)</span>
                    <span className="font-bold text-[#3DAEDB]">50%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#1C3D6E] dark:text-[#3DAEDB]">Long (60+ min)</span>
                    <span className="font-bold text-[#2C857A]">25%</span>
                  </div>
                </div>

                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-yellow-800 text-sm">
                    💡 Your optimal session length appears to be 45-60 minutes for maximum focus.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Focus Analysis Tab */}
        {activeTab === 'focus' && (
          <div className="space-y-6">
            {/* Focus Score Trends */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-6">Focus Score Analysis</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#4A9E3D]">{Math.round(avgFocusScore)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Average Focus Score</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-[#3DAEDB]">{Math.max(...mockSessions.map(s => s.focusScore))}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Highest Score</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{Math.min(...mockSessions.map(s => s.focusScore))}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Lowest Score</div>
                </div>
              </div>

              {/* Focus by Category */}
              <div className="space-y-4">
                <h3 className="font-semibold text-[#1C3D6E] dark:text-[#3DAEDB]">Focus Score by Activity Type</h3>
                {Object.entries(
                  mockSessions.reduce((acc, session) => {
                    if (!acc[session.category]) {
                      acc[session.category] = { total: 0, count: 0 }
                    }
                    acc[session.category].total += session.focusScore
                    acc[session.category].count += 1
                    return acc
                  }, {} as Record<string, { total: number; count: number }>)
                ).map(([category, data]) => {
                  const avgScore = Math.round(data.total / data.count)
                  return (
                    <div key={category} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getCategoryColor(category as TimeSession['category'])}`}>
                        {category}
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-dark h-2 rounded-full"
                            style={{ width: `${avgScore}%` }}
                          />
                        </div>
                        <span className="font-bold text-[#4A9E3D] w-8">{avgScore}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Focus Factors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-4">Focus Factors</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span>🖥️</span>
                      <span className="text-[#1C3D6E] dark:text-[#3DAEDB]">Desktop Learning</span>
                    </div>
                    <span className="font-bold text-[#4A9E3D]">+15% focus</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span>🌅</span>
                      <span className="text-[#1C3D6E] dark:text-[#3DAEDB]">Morning Sessions</span>
                    </div>
                    <span className="font-bold text-[#3DAEDB]">+12% focus</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span>📚</span>
                      <span className="text-[#1C3D6E] dark:text-[#3DAEDB]">Course Content</span>
                    </div>
                    <span className="font-bold text-purple-600">+8% focus</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span>📱</span>
                      <span className="text-[#1C3D6E] dark:text-[#3DAEDB]">Mobile Learning</span>
                    </div>
                    <span className="font-bold text-red-600">-10% focus</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-4">Improvement Suggestions</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-600">💡</span>
                    <div>
                      <p className="text-blue-800 font-medium text-sm">Optimize Device Usage</p>
                      <p className="text-blue-700 text-xs">Use desktop for complex topics, mobile for quick reviews</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                    <span className="text-green-600">⏰</span>
                    <div>
                      <p className="text-green-800 font-medium text-sm">Schedule Peak Hours</p>
                      <p className="text-green-700 text-xs">Block 9-11 AM for challenging material</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <span className="text-yellow-600">🎯</span>
                    <div>
                      <p className="text-yellow-800 font-medium text-sm">Break Management</p>
                      <p className="text-yellow-700 text-xs">Take 5-minute breaks every 45 minutes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            {/* Key Insights */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-6">Personalized Insights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-bold text-green-800 mb-2">🚀 Productivity Strengths</h3>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Consistent morning learning routine</li>
                      <li>• High focus during course materials</li>
                      <li>• Optimal session lengths (45-60 min)</li>
                      <li>• Strong desktop learning habits</li>
                    </ul>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-bold text-blue-800 mb-2">📈 Growth Opportunities</h3>
                    <ul className="text-blue-700 text-sm space-y-1">
                      <li>• Increase evening learning efficiency</li>
                      <li>• Improve mobile learning focus</li>
                      <li>• Extend practice session duration</li>
                      <li>• Add more assessment practice</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-bold text-yellow-800 mb-2">⚡ Quick Wins</h3>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      <li>• Schedule complex topics at 9 AM</li>
                      <li>• Use desktop for skill practice</li>
                      <li>• Take breaks every 45 minutes</li>
                      <li>• Limit mobile sessions to 30 min</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h3 className="font-bold text-purple-800 mb-2">🔮 Predictions</h3>
                    <ul className="text-purple-700 text-sm space-y-1">
                      <li>• 23% productivity boost with optimized schedule</li>
                      <li>• 15% faster course completion</li>
                      <li>• +10 focus score improvement possible</li>
                      <li>• 2.5 hours/week time savings</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Habit Formation */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-6">Learning Habit Analysis</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#4A9E3D] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🔥</span>
                  </div>
                  <h3 className="font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-2">Consistency Score</h3>
                  <div className="text-3xl font-bold text-[#4A9E3D] mb-2">87%</div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Learning 6.2 days per week on average</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-[#3DAEDB] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">⏱️</span>
                  </div>
                  <h3 className="font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-2">Time Stability</h3>
                  <div className="text-3xl font-bold text-[#3DAEDB] mb-2">92%</div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Consistent learning times established</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-[#2C857A] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-2">Focus Stability</h3>
                  <div className="text-3xl font-bold text-[#2C857A] mb-2">78%</div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Room for focus improvement</p>
                </div>
              </div>
            </div>

            {/* Action Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-6">Recommended Action Plan</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="w-8 h-8 bg-[#4A9E3D] text-white rounded-full flex items-center justify-center font-bold">1</div>
                  <div>
                    <h3 className="font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-1">Optimize Peak Hours (This Week)</h3>
                    <p className="text-gray-700 text-sm">Schedule your most challenging learning topics between 9-11 AM when your focus score is highest.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="w-8 h-8 bg-[#3DAEDB] text-white rounded-full flex items-center justify-center font-bold">2</div>
                  <div>
                    <h3 className="font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-1">Improve Mobile Learning (Next 2 Weeks)</h3>
                    <p className="text-gray-700 text-sm">Use mobile sessions for lighter content like reviews and reading. Limit to 30-minute sessions.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="w-8 h-8 bg-[#2C857A] text-white rounded-full flex items-center justify-center font-bold">3</div>
                  <div>
                    <h3 className="font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-1">Structured Break System (This Month)</h3>
                    <p className="text-gray-700 text-sm">Implement 5-minute breaks every 45 minutes to maintain focus throughout longer sessions.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Tracking Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <span className="text-blue-600">📊</span>
                <div>
                  <p className="text-blue-800 font-medium">Time Tracking Tips</p>
                  <p className="text-blue-700 text-sm">
                    Your analytics improve with more data. Keep consistent tracking, and try the suggested optimizations to see measurable improvement in your focus scores and productivity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}