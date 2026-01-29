import { useEffect, useMemo, useState } from 'react'
import { analyticsApi } from '../../services/api/analytics'
import { skillsApi } from '../../services/api/skills'
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

interface SkillAssessment {
  id: string
  skill_id: string
  proficiency_level: number
  confidence_level: number
  assessed_at: string
}

interface SkillTaxonomy {
  id: string
  skill_name: string
}

export default function LearningAnalytics() {
  const [activeTab, setActiveTab] = useState<'overview' | 'time' | 'skills' | 'performance'>('overview')
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('week')
  const [timeSeries, setTimeSeries] = useState<TimeSeriesPoint[]>([])
  const [summary, setSummary] = useState<ProgressSummary | null>(null)
  const [skillAssessments, setSkillAssessments] = useState<SkillAssessment[]>([])
  const [skillTaxonomy, setSkillTaxonomy] = useState<SkillTaxonomy[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const userId = getUserId()

  const windowDays = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 90

  useEffect(() => {
    if (!userId) {
      setError('Please sign in to view analytics.')
      return
    }

    const loadAnalytics = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const [series, summaryResponse, assessmentsResponse, taxonomyResponse] = await Promise.all([
          analyticsApi.getTimeSeries(userId, windowDays),
          analyticsApi.getProgressSummary(userId, windowDays),
          skillsApi.getUserAssessments(userId) as Promise<SkillAssessment[]>,
          skillsApi.getTaxonomy() as Promise<{ skills: SkillTaxonomy[] }>,
        ])

        setTimeSeries((series as { points?: TimeSeriesPoint[] }).points || [])
        setSummary(summaryResponse as ProgressSummary)
        setSkillAssessments(Array.isArray(assessmentsResponse) ? assessmentsResponse : [])
        setSkillTaxonomy(Array.isArray(taxonomyResponse.skills) ? taxonomyResponse.skills : [])
      } catch (err: any) {
        setError(handleApiError(err))
      } finally {
        setIsLoading(false)
      }
    }

    loadAnalytics()
  }, [userId, windowDays])

  const totalMinutes = summary?.total_minutes || 0
  const totalHours = totalMinutes / 60
  const avgMinutesPerDay = timeSeries.length > 0 ? totalMinutes / timeSeries.length : 0

  const categoryData = useMemo(() => {
    if (!summary?.category_breakdown || totalMinutes === 0) return []
    return Object.entries(summary.category_breakdown).map(([label, minutes]) => ({
      label,
      minutes,
      percentage: Math.round((minutes / totalMinutes) * 100),
    }))
  }, [summary, totalMinutes])

  const skillMap = useMemo(() => {
    return new Map(skillTaxonomy.map((skill) => [skill.id, skill.skill_name]))
  }, [skillTaxonomy])

  const skillProgress = useMemo(() => {
    return skillAssessments.map((assessment) => ({
      id: assessment.id,
      name: skillMap.get(assessment.skill_id) || assessment.skill_id,
      proficiency: assessment.proficiency_level,
      confidence: assessment.confidence_level,
      assessed_at: assessment.assessed_at,
    }))
  }, [skillAssessments, skillMap])

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary-dark rounded-xl flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-dark dark:text-darkMode-link">Learning Analytics</h1>
              <p className="text-gray-600 dark:text-gray-300">Insights driven by backend analytics data</p>
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
            { id: 'time', label: 'Time Analysis', icon: '⏰' },
            { id: 'skills', label: 'Skill Progress', icon: '🎯' },
            { id: 'performance', label: 'Performance', icon: '📈' },
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

        <div className="flex justify-end mb-6">
          <div className="flex gap-2 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
            {['week', 'month', 'quarter'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period as typeof selectedPeriod)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors capitalize ${
                  selectedPeriod === period
                    ? 'bg-primary text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-dark'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center text-gray-600 dark:text-gray-300">
            Loading analytics...
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-6">Learning Categories</h2>
                  {categoryData.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-300">No category data yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {categoryData.map((category) => (
                        <div key={category.label}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-primary-dark dark:text-darkMode-link capitalize">{category.label}</span>
                            <span className="text-sm text-gray-600 dark:text-gray-300">
                              {Math.round(category.minutes / 60)}h ({category.percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-primary-dark"
                              style={{ width: `${category.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-6">Period Summary</h2>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-secondary/10 rounded-lg">
                      <div className="text-2xl font-bold text-secondary">{totalHours.toFixed(1)}h</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Total Hours</div>
                    </div>
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{avgMinutesPerDay.toFixed(1)}m</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Avg/Day</div>
                    </div>
                    <div className="text-center p-4 bg-forest-sage/10 rounded-lg">
                      <div className="text-2xl font-bold text-forest-sage">{summary?.total_sessions || 0}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Sessions</div>
                    </div>
                    <div className="text-center p-4 bg-primary-dark/10 rounded-lg">
                      <div className="text-2xl font-bold text-primary-dark dark:text-darkMode-link">
                        {summary?.average_focus_score ? Math.round(summary.average_focus_score) : '—'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Avg Focus</div>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-primary-dark dark:text-darkMode-link">Learning Streak</span>
                      <span className="text-2xl font-bold text-secondary">
                        {summary?.streak_days || 0} days
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'time' && (
              <div className="space-y-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-6">Daily Learning Time</h2>
                  {timeSeries.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-300">No time tracking data yet.</p>
                  ) : (
                    <div className="grid grid-cols-7 gap-4">
                      {timeSeries.map((day) => (
                        <div key={day.date} className="text-center">
                          <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                            {new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}
                          </div>
                          <div
                            className="bg-secondary rounded-lg mx-auto relative"
                            style={{
                              height: `${Math.max(day.total_minutes / 2, 20)}px`,
                              width: '40px',
                            }}
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

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-primary-dark dark:text-darkMode-link mb-4">Session Summary</h3>
                  <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex justify-between">
                      <span>Average Session Length</span>
                      <span className="font-bold text-secondary">
                        {summary ? summary.average_session_minutes.toFixed(1) : '—'} minutes
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Sessions</span>
                      <span className="font-bold text-primary">{summary?.total_sessions || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Top Category</span>
                      <span className="font-bold text-forest-sage capitalize">{summary?.top_category || '—'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-6">Skill Development Progress</h2>
                {skillProgress.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-300">No skill assessments found yet.</p>
                ) : (
                  <div className="space-y-6">
                    {skillProgress.map((skill) => (
                      <div key={skill.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-primary-dark dark:text-darkMode-link text-lg">{skill.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                              <span>📅 {new Date(skill.assessed_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-secondary">
                              {Math.round(skill.proficiency)}%
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">confidence {Math.round(skill.confidence * 100)}%</div>
                          </div>
                        </div>

                        <div className="mb-2">
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                            <span>Proficiency</span>
                            <span>{Math.round(skill.proficiency)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div
                              className="bg-primary-dark h-3 rounded-full"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-6">Performance Trends</h2>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-primary-dark dark:text-darkMode-link">Average Focus Score</span>
                      </div>
                      <div className="text-2xl font-bold text-primary-dark dark:text-darkMode-link">
                        {summary?.average_focus_score ? Math.round(summary.average_focus_score) : '—'}
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-primary-dark dark:text-darkMode-link">Average Session</span>
                      </div>
                      <div className="text-2xl font-bold text-primary-dark dark:text-darkMode-link">
                        {summary ? summary.average_session_minutes.toFixed(1) : '—'} min
                      </div>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-primary-dark dark:text-darkMode-link">Active Streak</span>
                      </div>
                      <div className="text-2xl font-bold text-primary-dark dark:text-darkMode-link">
                        {summary?.streak_days || 0} days
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-6">Session Insights</h2>
                  <div className="space-y-4">
                    <div className="p-4 bg-secondary/10 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-primary-dark dark:text-darkMode-link">Total Sessions</span>
                        <span className="text-secondary font-bold">{summary?.total_sessions || 0}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Sessions recorded in this period.</p>
                    </div>
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-primary-dark dark:text-darkMode-link">Top Category</span>
                        <span className="text-primary font-bold capitalize">{summary?.top_category || '—'}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Most frequent learning focus.</p>
                    </div>
                    <div className="p-4 bg-forest-sage/10 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-primary-dark dark:text-darkMode-link">Total Hours</span>
                        <span className="text-forest-sage font-bold">{totalHours.toFixed(1)}h</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Total time logged.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
