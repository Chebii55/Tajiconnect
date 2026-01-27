import { useEffect, useMemo, useState } from 'react'
import { Brain, TrendingUp, Target, Lightbulb } from 'lucide-react'
import { psychometricApi } from '../../services/api/psychometric'
import { handleApiError } from '../../utils/errorHandler'
import { getUserId } from '../../utils/auth'

interface PsychometricAssessmentResponse {
  id: string
  user_id: string
  assessment_type: string
  version: string
  raw_responses: Record<string, unknown>
  motivation_score: Record<string, unknown>
  capability_assessment: Record<string, unknown>
  learning_preferences: Record<string, unknown>
  behavioral_profile: Record<string, unknown>
  learner_archetype: string
  archetype_confidence: number
  completed_at: string
  processing_version: string
}

const formatLabel = (value?: string) =>
  value ? value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '—'

const getPrimaryPreference = (preferences: Record<string, unknown>) => {
  const entries = Object.entries(preferences || {})
    .filter(([, value]) => typeof value === 'number') as Array<[string, number]>
  if (entries.length === 0) return null
  entries.sort((a, b) => b[1] - a[1])
  return entries[0]?.[0] || null
}

export default function PsychometricDashboard() {
  const [assessments, setAssessments] = useState<PsychometricAssessmentResponse[]>([])
  const [latestAssessment, setLatestAssessment] = useState<PsychometricAssessmentResponse | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'tests' | 'profile' | 'insights'>('overview')
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

      const [latestResult, listResult] = await Promise.allSettled([
        psychometricApi.getLatestAssessment(userId),
        psychometricApi.getUserAssessments(userId),
      ])

      if (latestResult.status === 'fulfilled') {
        setLatestAssessment(latestResult.value)
      } else {
        setLatestAssessment(null)
      }

      if (listResult.status === 'fulfilled') {
        setAssessments(Array.isArray(listResult.value) ? listResult.value : [])
      } else {
        setAssessments([])
      }

      if (latestResult.status === 'rejected' || listResult.status === 'rejected') {
        const latestError = latestResult.status === 'rejected' ? latestResult.reason : null
        const listError = listResult.status === 'rejected' ? listResult.reason : null
        setError(handleApiError(latestError || listError))
      }

      setIsLoading(false)
    }

    loadAssessments()
  }, [userId])

  const totalAssessments = assessments.length
  const primaryPreference = latestAssessment ? getPrimaryPreference(latestAssessment.learning_preferences) : null

  const assessmentsByType = useMemo(() => {
    const counts: Record<string, number> = {}
    assessments.forEach((assessment) => {
      counts[assessment.assessment_type] = (counts[assessment.assessment_type] || 0) + 1
    })
    return counts
  }, [assessments])

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
                <div className="text-2xl font-bold text-secondary">{totalAssessments}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Assessments Completed</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-primary">
                  {latestAssessment ? formatLabel(latestAssessment.learner_archetype) : '—'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Latest Archetype</div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
                <div className="text-2xl font-bold text-primary-dark dark:text-darkMode-link">
                  {latestAssessment ? `${Math.round(latestAssessment.archetype_confidence * 100)}%` : '—'}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Archetype Confidence</div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-8 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'tests', label: 'Assessments', icon: '🧪' },
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
                        {primaryPreference ? formatLabel(primaryPreference) : 'Not provided'}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Completed on {new Date(latestAssessment.completed_at).toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">
                  No psychometric assessment has been completed yet.
                </p>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-4">Assessment Coverage</h2>
              {totalAssessments === 0 ? (
                <p className="text-gray-600 dark:text-gray-300">No assessments are available yet.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(assessmentsByType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
                      <span className="text-sm font-medium text-primary-dark dark:text-darkMode-link">
                        {formatLabel(type)}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'tests' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-gray-600 dark:text-gray-300">
                No psychometric assessments found for your account.
              </div>
            ) : (
              assessments.map((assessment) => (
                <div key={assessment.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Assessment Type</p>
                      <p className="text-lg font-semibold text-primary-dark dark:text-darkMode-link">
                        {formatLabel(assessment.assessment_type)}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">v{assessment.version}</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex justify-between">
                      <span>Archetype</span>
                      <span className="font-medium">{formatLabel(assessment.learner_archetype)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Confidence</span>
                      <span className="font-medium">{Math.round(assessment.archetype_confidence * 100)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Completed</span>
                      <span className="font-medium">{new Date(assessment.completed_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-4">Latest Assessment Profile</h2>
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
                    <p className="text-xs text-gray-500 dark:text-gray-400">Processing Version</p>
                    <p className="text-base font-semibold text-primary-dark dark:text-darkMode-link">
                      {latestAssessment.processing_version}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Lightbulb className="text-forest-sage" />
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Primary Learning Preference</p>
                    <p className="text-base font-semibold text-primary-dark dark:text-darkMode-link">
                      {primaryPreference ? formatLabel(primaryPreference) : 'Not provided'}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Completed on {new Date(latestAssessment.completed_at).toLocaleString()}
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
                    <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Motivation</h3>
                    <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(latestAssessment.motivation_score, null, 2)}</pre>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 dark:text-green-300 mb-2">Capability</h3>
                    <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(latestAssessment.capability_assessment, null, 2)}</pre>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700/50 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-800 dark:text-orange-300 mb-2">Learning Preferences</h3>
                    <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(latestAssessment.learning_preferences, null, 2)}</pre>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/50 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">Behavioral Profile</h3>
                    <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(latestAssessment.behavioral_profile, null, 2)}</pre>
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
