import { useEffect, useMemo, useState } from 'react'
import { Brain, TrendingUp, Target, Lightbulb } from 'lucide-react'
import { psychometricApi } from '../../services/api/psychometric'
import { skillsApi } from '../../services/api/skills'
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

interface TaxonomySkill {
  id: string
  skill_name: string
  category: string
  language: string
}

interface UserSkillAssessment {
  id: string
  user_id: string
  skill_id: string
  proficiency_level: number
  confidence_level: number
  assessment_method: string
  assessed_at: string
}

const getPrimaryPreference = (preferences: Record<string, unknown>) => {
  const entries = Object.entries(preferences || {})
    .filter(([, value]) => typeof value === 'number') as Array<[string, number]>
  if (entries.length === 0) return null
  entries.sort((a, b) => b[1] - a[1])
  return entries[0]?.[0] || null
}

const formatLabel = (value?: string) =>
  value ? value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : '—'

export default function AssessmentResults() {
  const [profile, setProfile] = useState<PsychometricAssessmentResponse | null>(null)
  const [skills, setSkills] = useState<TaxonomySkill[]>([])
  const [skillAssessments, setSkillAssessments] = useState<UserSkillAssessment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const userId = getUserId()

  useEffect(() => {
    if (!userId) {
      setError('Please sign in to view assessment results.')
      return
    }

    const loadResults = async () => {
      setIsLoading(true)
      setError(null)

      const [profileResult, taxonomyResult, assessmentResult] = await Promise.allSettled([
        psychometricApi.getLatestAssessment(userId),
        skillsApi.getTaxonomy(),
        skillsApi.getUserAssessments(userId),
      ])

      if (profileResult.status === 'fulfilled') {
        setProfile(profileResult.value)
      } else {
        setProfile(null)
      }

      if (taxonomyResult.status === 'fulfilled') {
        setSkills(Array.isArray(taxonomyResult.value.skills) ? taxonomyResult.value.skills : [])
      } else {
        setSkills([])
      }

      if (assessmentResult.status === 'fulfilled') {
        setSkillAssessments(Array.isArray(assessmentResult.value) ? assessmentResult.value : [])
      } else {
        setSkillAssessments([])
      }

      if (profileResult.status === 'rejected') {
        setError(handleApiError(profileResult.reason))
      }

      if (taxonomyResult.status === 'rejected' || assessmentResult.status === 'rejected') {
        setError((prev) => prev || handleApiError(taxonomyResult.status === 'rejected' ? taxonomyResult.reason : assessmentResult.reason))
      }

      setIsLoading(false)
    }

    loadResults()
  }, [userId])

  const assessmentMap = useMemo(() => {
    return new Map(skills.map((skill) => [skill.id, skill]))
  }, [skills])

  const assessedSkills = useMemo(() => {
    return skillAssessments.map((assessment) => ({
      assessment,
      skill: assessmentMap.get(assessment.skill_id),
    }))
  }, [skillAssessments, assessmentMap])

  const averageProficiency = useMemo(() => {
    if (skillAssessments.length === 0) return null
    const total = skillAssessments.reduce((sum, assessment) => sum + assessment.proficiency_level, 0)
    return total / skillAssessments.length
  }, [skillAssessments])

  const primaryPreference = profile ? getPrimaryPreference(profile.learning_preferences) : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary-dark rounded-xl flex items-center justify-center">
              <span className="text-3xl">🎯</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-dark dark:text-darkMode-link">Assessment Results</h1>
              <p className="text-gray-600 dark:text-gray-300">Your latest psychometric and skills insights</p>
            </div>
          </div>

          {isLoading && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-gray-600 dark:text-gray-300">
              Loading assessment data from the AI service...
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
        </div>

        {!isLoading && !profile && skillAssessments.length === 0 && !error && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center text-gray-600 dark:text-gray-300">
            No assessment results are available yet. Complete a psychometric or skills assessment to see insights here.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-4">Psychometric Summary</h2>
              {profile ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px] bg-gray-50 dark:bg-gray-900/40 rounded-lg p-4">
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Learner Archetype</p>
                      <p className="text-lg font-semibold text-primary-dark dark:text-darkMode-link">
                        {formatLabel(profile.learner_archetype)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Confidence: {Math.round(profile.archetype_confidence * 100)}%
                      </p>
                    </div>
                    <div className="flex-1 min-w-[200px] bg-gray-50 dark:bg-gray-900/40 rounded-lg p-4">
                      <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Primary Learning Style</p>
                      <p className="text-lg font-semibold text-primary-dark dark:text-darkMode-link">
                        {primaryPreference ? formatLabel(primaryPreference) : 'Not provided'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Assessment type: {formatLabel(profile.assessment_type)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4">
                      <Brain className="text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">Motivation</p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">
                          {JSON.stringify(profile.motivation_score)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg p-4">
                      <TrendingUp className="text-green-600 dark:text-green-400" />
                      <div>
                        <p className="text-sm text-green-800 dark:text-green-300 font-medium">Capability</p>
                        <p className="text-xs text-green-700 dark:text-green-300">
                          {JSON.stringify(profile.capability_assessment)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700/50 rounded-lg p-4">
                      <Target className="text-orange-600 dark:text-orange-400" />
                      <div>
                        <p className="text-sm text-orange-800 dark:text-orange-300 font-medium">Behavioral Profile</p>
                        <p className="text-xs text-orange-700 dark:text-orange-300">
                          {JSON.stringify(profile.behavioral_profile)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/50 rounded-lg p-4">
                      <Lightbulb className="text-purple-600 dark:text-purple-400" />
                      <div>
                        <p className="text-sm text-purple-800 dark:text-purple-300 font-medium">Learning Preferences</p>
                        <p className="text-xs text-purple-700 dark:text-purple-300">
                          {JSON.stringify(profile.learning_preferences)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Completed on {new Date(profile.completed_at).toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">
                  No psychometric assessment results yet. Complete the psychometric assessment to populate this section.
                </p>
              )}
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-4">Skills Assessment Summary</h2>
              {assessedSkills.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300">
                  No skills have been assessed yet. Start a skills assessment to see proficiency levels here.
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>Average proficiency</span>
                    <span className="font-semibold text-primary-dark dark:text-darkMode-link">
                      {averageProficiency ? `${Math.round(averageProficiency)}%` : '—'}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {assessedSkills.map(({ assessment, skill }) => (
                      <div key={assessment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-primary-dark dark:text-darkMode-link">
                              {skill?.skill_name || assessment.skill_id}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {skill ? formatLabel(skill.category) : 'Uncategorized'} · {skill?.language || '—'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-semibold text-primary-dark dark:text-darkMode-link">
                              {Math.round(assessment.proficiency_level)}%
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Confidence {Math.round(assessment.confidence_level * 100)}%
                            </p>
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          Assessed on {new Date(assessment.assessed_at).toLocaleDateString()} · Method: {formatLabel(assessment.assessment_method)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-primary-dark dark:text-darkMode-link mb-4">Next Steps</h3>
              <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Complete additional skills assessments to build a richer profile.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Review your learning path recommendations for targeted practice.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Schedule periodic psychometric assessments to track progress.
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">💡</span>
                <div>
                  <p className="text-blue-800 dark:text-blue-300 font-medium text-sm">Need stronger insights?</p>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    Finish the skills and psychometric assessments to unlock personalized recommendations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
