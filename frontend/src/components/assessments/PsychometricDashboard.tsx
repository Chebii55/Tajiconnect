import { useEffect, useState } from 'react'
import { Brain, TrendingUp, Target, Lightbulb } from 'lucide-react'
import { psychometricApi } from '../../services/api/psychometric'
import { handleApiError } from '../../utils/errorHandler'
import { getUserId } from '../../utils/auth'
import type { UserProfile } from '../../services/api/types'

const formatLabel = (value?: string) =>
  value ? value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '—'

export default function PsychometricDashboard() {
  const [latestAssessment, setLatestAssessment] = useState<UserProfile | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'insights'>('overview')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const userId = getUserId()

  useEffect(() => {
    if (!userId) {
      setError('Please sign in to view psychometric assessments.')
      return
    }

    const loadAssessments = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const latest = await psychometricApi.getLatestAssessment(userId)
        setLatestAssessment(latest)
      } catch (err: unknown) {
        setLatestAssessment(null)
        const errorMessage = err instanceof Error ? err.message : 'Failed to load assessments'
        setError(errorMessage)
      }

      setIsLoading(false)
    }

    loadAssessments()
  }, [userId])

  const primaryStyle = latestAssessment?.learning_preferences?.primary_style

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-[#1C3D6E] rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-dark dark:text-darkMode-link font-heading">Psychometric Center</h1>
              <p className="text-gray-600 dark:text-gray-300">
                Real-time psychometric insights powered by the AI service
              </p>
            </div>
          </div>

          {isLoading && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-gray-600 dark:text-gray-300">
              Loading psychometric assessments...
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-red-600">⚠️</span>
                <h3 className="text-red-800 dark:text-red-200 font-semibold">Assessment Error</h3>
              </div>
              <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-secondary">
                  {latestAssessment ? '1' : '0'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Assessments Available</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {latestAssessment ? formatLabel(latestAssessment.learner_archetype) : '—'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Learner Archetype</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-primary-dark dark:text-darkMode-link">
                  {primaryStyle ? formatLabel(primaryStyle) : '—'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Primary Style</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-8 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'profile', label: 'Profile', icon: '🧠' },
            { id: 'insights', label: 'Insights', icon: '🌱' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-colors flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-[#1C3D6E] text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-primary-dark hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-4">Latest Psychometric Snapshot</h2>
              {latestAssessment ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Brain className="text-primary" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Learner Archetype</p>
                      <p className="text-lg font-semibold text-primary-dark dark:text-darkMode-link">
                        {formatLabel(latestAssessment.learner_archetype)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Target className="text-secondary" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Primary Learning Style</p>
                      <p className="text-lg font-semibold text-primary-dark dark:text-darkMode-link">
                        {primaryStyle ? formatLabel(primaryStyle) : 'Not provided'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    User ID: {latestAssessment.user_id}
                  </p>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">
                  No psychometric assessment has been completed yet.
                </p>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-4">Skill Gaps</h2>
              {latestAssessment && latestAssessment.skill_gaps?.length > 0 ? (
                <div className="space-y-3">
                  {latestAssessment.skill_gaps.map((gap, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
                      <span className="text-sm font-medium text-primary-dark dark:text-darkMode-link">
                        {gap.skill_name}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {gap.current_level} → {gap.target_level}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">No skill gaps identified yet.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-4">Assessment Profile</h2>
            {latestAssessment ? (
              <div className="space-y-4 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-3">
                  <Brain className="text-primary" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Learner Archetype</p>
                    <p className="text-base font-semibold text-primary-dark dark:text-darkMode-link">
                      {formatLabel(latestAssessment.learner_archetype)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-secondary" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Content Preferences</p>
                    <p className="text-base font-semibold text-primary-dark dark:text-darkMode-link">
                      {latestAssessment.learning_preferences?.content_format_preferences?.join(', ') || 'Not specified'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Lightbulb className="text-forest-sage" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Difficulty Preference</p>
                    <p className="text-base font-semibold text-primary-dark dark:text-darkMode-link">
                      {latestAssessment.learning_preferences?.difficulty_preference || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-300">
                No assessment profile is available yet.
              </p>
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-4">Psychometric Insights</h2>
              {latestAssessment ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Motivation Scores</h3>
                    <div className="space-y-2">
                      <p>Intrinsic: {Math.round((latestAssessment.motivation_score?.intrinsic_motivation || 0) * 100)}%</p>
                      <p>Extrinsic: {Math.round((latestAssessment.motivation_score?.extrinsic_motivation || 0) * 100)}%</p>
                      <p>Engagement: {Math.round((latestAssessment.motivation_score?.engagement_prediction || 0) * 100)}%</p>
                      <p>Persistence: {Math.round((latestAssessment.motivation_score?.persistence_score || 0) * 100)}%</p>
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">Learning Preferences</h3>
                    <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(latestAssessment.learning_preferences, null, 2)}</pre>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700/50 rounded-lg p-4 md:col-span-2">
                    <h3 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">Skill Gaps ({latestAssessment.skill_gaps?.length || 0})</h3>
                    {latestAssessment.skill_gaps && latestAssessment.skill_gaps.length > 0 ? (
                      <ul className="space-y-1">
                        {latestAssessment.skill_gaps.map((gap, i) => (
                          <li key={i} className="text-xs">
                            {gap.skill_name}: Level {gap.current_level} → {gap.target_level} (Priority: {gap.priority})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs">No skill gaps identified</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">
                  Complete a psychometric assessment to populate your AI insights.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
