import { useEffect, useMemo, useState } from 'react'
import { analyticsApi } from '../../services/api/analytics'
import { handleApiError } from '../../utils/errorHandler'
import { getUserId } from '../../utils/auth'

interface TimeSeriesPoint {
  date: string
  total_minutes: number
  sessions: number
  average_focus_score?: number
}

interface ProgressSummary {
  total_minutes: number
  total_sessions: number
  average_session_minutes: number
  average_focus_score?: number
  top_category?: string
  streak_days: number
  category_breakdown: Record<string, number>
}

export default function TimeSpentAnalytics() {
  const [activeTab, setActiveTab] = useState<'overview' | 'patterns' | 'focus' | 'insights'>('overview')
  const [timeSeries, setTimeSeries] = useState<TimeSeriesPoint[]>([])
  const [summary, setSummary] = useState<ProgressSummary | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const userId = getUserId()

  useEffect(() => {
    if (!userId) {
      setError('Please sign in to view time analytics.')
      return
    }

    const loadData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [series, summaryResponse] = await Promise.all([
          analyticsApi.getTimeSeries(userId, 30),
          analyticsApi.getProgressSummary(userId, 30),
        ])
        setTimeSeries((series as { points?: TimeSeriesPoint[] }).points || [])
        setSummary(summaryResponse as ProgressSummary)
      } catch (err: any) {
        setError(handleApiError(err))
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [userId])

  const totalMinutes = summary?.total_minutes || 0
  const totalHours = totalMinutes / 60
  const avgDailyMinutes = timeSeries.length > 0 ? totalMinutes / timeSeries.length : 0

  const categoryStats = useMemo(() => {
    if (!summary?.category_breakdown || totalMinutes === 0) return []
    return Object.entries(summary.category_breakdown).map(([category, minutes]) => ({
      category,
      minutes,
      percentage: Math.round((minutes / totalMinutes) * 100),
    }))
  }, [summary, totalMinutes])

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary-dark rounded-xl flex items-center justify-center">
              <span className="text-2xl">⏰</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-dark dark:text-darkMode-link">Time Spent Analytics</h1>
              <p className="text-gray-600 dark:text-gray-300">Based on backend learning session data</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="flex gap-2 mb-8 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'patterns', label: 'Patterns', icon: '🧭' },
            { id: 'focus', label: 'Focus', icon: '🎯' },
            { id: 'insights', label: 'Insights', icon: '💡' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary-dark text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-primary-dark hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center text-gray-600 dark:text-gray-300">
            Loading time analytics...
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
                    <div className="text-2xl font-bold text-secondary">{totalHours.toFixed(1)}h</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Total (30 days)</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{summary?.total_sessions || 0}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Sessions</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
                    <div className="text-2xl font-bold text-forest-sage">{avgDailyMinutes.toFixed(1)}m</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Avg/Day</div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
                    <div className="text-2xl font-bold text-primary-dark dark:text-darkMode-link">
                      {summary?.average_focus_score ? Math.round(summary.average_focus_score) : '—'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Avg Focus</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-6">Daily Totals</h2>
                  {timeSeries.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-300">No time series data yet.</p>
                  ) : (
                    <div className="grid grid-cols-7 gap-4">
                      {timeSeries.map((day) => (
                        <div key={day.date} className="text-center">
                          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                          </div>
                          <div
                            className="bg-secondary rounded-lg mx-auto relative"
                            style={{ height: `${Math.max(day.total_minutes / 2, 20)}px`, width: '40px' }}
                          >
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-primary-dark dark:text-darkMode-link">
                              {(day.total_minutes / 60).toFixed(1)}h
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'patterns' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-6">Category Breakdown</h2>
                {categoryStats.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-300">No category breakdown available.</p>
                ) : (
                  <div className="space-y-3">
                    {categoryStats.map((stat) => (
                      <div key={stat.category} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
                        <span className="text-primary-dark dark:text-darkMode-link capitalize">{stat.category}</span>
                        <span className="font-bold text-secondary">{stat.percentage}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'focus' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-6">Focus Summary</h2>
                <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>Average Focus Score</span>
                    <span className="font-bold text-secondary">
                      {summary?.average_focus_score ? Math.round(summary.average_focus_score) : '—'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Session Length</span>
                    <span className="font-bold text-primary">
                      {summary ? summary.average_session_minutes.toFixed(1) : '—'} minutes
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Learning Streak</span>
                    <span className="font-bold text-forest-sage">{summary?.streak_days || 0} days</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'insights' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-6">Insights</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Keep logging learning sessions to unlock richer time insights.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
