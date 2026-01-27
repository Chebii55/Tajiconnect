import { useEffect, useMemo, useState } from 'react'
import { skillsApi } from '../../services/api/skills'
import { handleApiError } from '../../utils/errorHandler'
import { getUserId } from '../../utils/auth'

interface TaxonomySkill {
  id: string
  skill_code: string
  skill_name: string
  description?: string
  category: string
  subcategory?: string
  parent_skill_id?: string
  skill_level: number
  assessment_criteria?: {
    assessment_methods?: string[]
    success_threshold?: number
    [key: string]: unknown
  }
  language: string
  is_active: boolean
  created_at: string
}

interface UserSkillAssessment {
  id: string
  user_id: string
  skill_id: string
  proficiency_level: number
  confidence_level: number
  assessment_method: string
  assessment_source?: string
  evidence_data?: Record<string, unknown>
  previous_level?: number
  improvement_rate?: number
  assessed_at: string
  expires_at?: string
}

const categoryIconMap: Record<string, string> = {
  vocabulary: '🧠',
  grammar: '📚',
  conversation: '💬',
  cultural: '🌍',
  pronunciation: '🗣️',
  listening: '🎧',
  reading: '📖',
  writing: '✍️',
}

const categoryLabel = (category: string) =>
  category.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())

export default function SkillsAssessment() {
  const [skills, setSkills] = useState<TaxonomySkill[]>([])
  const [assessments, setAssessments] = useState<UserSkillAssessment[]>([])
  const [selectedSkill, setSelectedSkill] = useState<TaxonomySkill | null>(null)
  const [isAssessing, setIsAssessing] = useState(false)
  const [filter, setFilter] = useState<'all' | string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'proficiency' | 'recent' | 'category'>('name')
  const [proficiencyInput, setProficiencyInput] = useState(0)
  const [confidenceInput, setConfidenceInput] = useState(0.5)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const userId = getUserId()

  const assessmentMap = useMemo(() => {
    return new Map(assessments.map((assessment) => [assessment.skill_id, assessment]))
  }, [assessments])

  const categories = useMemo(() => {
    const unique = new Set(skills.map((skill) => skill.category))
    return Array.from(unique).sort()
  }, [skills])

  useEffect(() => {
    if (!userId) {
      setError('Please sign in to view your skills assessments.')
      return
    }

    const loadSkills = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const [taxonomyResponse, assessmentResponse] = await Promise.all([
          skillsApi.getTaxonomy(),
          skillsApi.getUserAssessments(userId),
        ])

        setSkills(Array.isArray(taxonomyResponse.skills) ? taxonomyResponse.skills : [])
        setAssessments(Array.isArray(assessmentResponse) ? assessmentResponse : [])
      } catch (err: any) {
        setError(handleApiError(err))
      } finally {
        setIsLoading(false)
      }
    }

    loadSkills()
  }, [userId])

  useEffect(() => {
    if (!selectedSkill) return
    const assessment = assessmentMap.get(selectedSkill.id)
    setProficiencyInput(assessment?.proficiency_level ?? 0)
    setConfidenceInput(assessment?.confidence_level ?? 0.5)
  }, [selectedSkill, assessmentMap])

  const filteredSkills = useMemo(() => {
    return skills
      .filter((skill) => (filter === 'all' ? true : skill.category === filter))
      .sort((a, b) => {
        if (sortBy === 'category') return a.category.localeCompare(b.category)
        if (sortBy === 'proficiency') {
          const aScore = assessmentMap.get(a.id)?.proficiency_level ?? -1
          const bScore = assessmentMap.get(b.id)?.proficiency_level ?? -1
          return bScore - aScore
        }
        if (sortBy === 'recent') {
          const aDate = assessmentMap.get(a.id)?.assessed_at
          const bDate = assessmentMap.get(b.id)?.assessed_at
          return (bDate ? new Date(bDate).getTime() : 0) - (aDate ? new Date(aDate).getTime() : 0)
        }
        return a.skill_name.localeCompare(b.skill_name)
      })
  }, [skills, filter, sortBy, assessmentMap])

  const assessedSkills = useMemo(() => {
    return skills.filter((skill) => assessmentMap.has(skill.id))
  }, [skills, assessmentMap])

  const averageProficiency = useMemo(() => {
    if (assessments.length === 0) return 0
    const total = assessments.reduce((sum, assessment) => sum + assessment.proficiency_level, 0)
    return total / assessments.length
  }, [assessments])

  const startAssessment = (skill: TaxonomySkill) => {
    setSelectedSkill(skill)
    setIsAssessing(true)
  }

  const submitAssessment = async () => {
    if (!userId || !selectedSkill) return

    setIsSaving(true)
    setError(null)

    try {
      await skillsApi.upsertAssessment(userId, selectedSkill.id, {
        user_id: userId,
        skill_id: selectedSkill.id,
        proficiency_level: Number(proficiencyInput),
        confidence_level: Number(confidenceInput),
        assessment_method: 'self_reported',
        assessment_source: 'self_assessment',
      })

      const updatedAssessments = await skillsApi.getUserAssessments(userId)
      setAssessments(Array.isArray(updatedAssessments) ? updatedAssessments : [])
      setIsAssessing(false)
      setSelectedSkill(null)
    } catch (err: any) {
      setError(handleApiError(err))
    } finally {
      setIsSaving(false)
    }
  }

  const renderAssessmentDetails = (skill: TaxonomySkill) => {
    const assessment = assessmentMap.get(skill.id)
    if (!assessment) {
      return <span className="text-sm text-gray-500 dark:text-gray-400">Not assessed yet</span>
    }

    return (
      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex justify-between">
          <span>Proficiency</span>
          <span className="font-semibold">{Math.round(assessment.proficiency_level)}%</span>
        </div>
        <div className="flex justify-between">
          <span>Confidence</span>
          <span className="font-semibold">{Math.round(assessment.confidence_level * 100)}%</span>
        </div>
        <div className="flex justify-between">
          <span>Method</span>
          <span className="font-medium capitalize">{assessment.assessment_method.replace(/_/g, ' ')}</span>
        </div>
        <div className="flex justify-between">
          <span>Assessed</span>
          <span>{new Date(assessment.assessed_at).toLocaleDateString()}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {!isAssessing ? (
          <>
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary-dark rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-primary-dark dark:text-darkMode-link">Skills Assessment</h1>
                  <p className="text-gray-600 dark:text-gray-300">Track your skill proficiency with real assessments</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
                  <div className="text-2xl font-bold text-secondary">{skills.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Skills Available</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{assessedSkills.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Skills Assessed</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
                  <div className="text-2xl font-bold text-primary-dark dark:text-darkMode-link">
                    {assessments.length > 0 ? `${Math.round(averageProficiency)}%` : '—'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Average Proficiency</div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-600">⚠️</span>
                  <h3 className="text-red-800 dark:text-red-200 font-semibold">Assessment Error</h3>
                </div>
                <p className="text-red-600 dark:text-red-300 text-sm">{error}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-4 justify-between mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                    filter === 'all'
                      ? 'bg-primary text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary-dark bg-white'
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setFilter(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                      filter === category
                        ? 'bg-primary text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:text-primary-dark bg-white'
                    }`}
                  >
                    {categoryLabel(category)}
                  </button>
                ))}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="proficiency">Sort by Proficiency</option>
                <option value="recent">Sort by Recent</option>
                <option value="category">Sort by Category</option>
              </select>
            </div>

            {isLoading ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center text-gray-600 dark:text-gray-300">
                Loading skills from the AI service...
              </div>
            ) : filteredSkills.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center text-gray-600 dark:text-gray-300">
                No skills are available yet. Please check back once the skills taxonomy is populated.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSkills.map((skill) => {
                  const assessment = assessmentMap.get(skill.id)
                  const assessmentMethods = Array.isArray(skill.assessment_criteria?.assessment_methods)
                    ? skill.assessment_criteria?.assessment_methods.join(', ')
                    : null

                  return (
                    <div
                      key={skill.id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-0 hover:shadow-xl transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{categoryIconMap[skill.category] || '📘'}</span>
                            <div>
                              <h3 className="font-bold text-primary-dark dark:text-darkMode-link text-lg">
                                {skill.skill_name}
                              </h3>
                              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                {categoryLabel(skill.category)} · Level {skill.skill_level}
                              </span>
                            </div>
                          </div>
                        </div>

                        {skill.description && (
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{skill.description}</p>
                        )}

                        {renderAssessmentDetails(skill)}

                        {assessmentMethods && (
                          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                            Assessment methods: {assessmentMethods}
                          </div>
                        )}

                        <div className="mt-5">
                          <button
                            onClick={() => startAssessment(skill)}
                            className="btn-primary w-full"
                          >
                            {assessment ? 'Update Assessment' : 'Start Assessment'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-link">
                    {selectedSkill?.skill_name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Provide your current proficiency and confidence for this skill.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsAssessing(false)
                    setSelectedSkill(null)
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Proficiency level: {Math.round(proficiencyInput)}%
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={proficiencyInput}
                    onChange={(e) => setProficiencyInput(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confidence level: {Math.round(confidenceInput * 100)}%
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={confidenceInput}
                    onChange={(e) => setConfidenceInput(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-700 dark:text-red-300">
                    {error}
                  </div>
                )}

                <button
                  onClick={submitAssessment}
                  className="btn-primary w-full"
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Assessment'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
