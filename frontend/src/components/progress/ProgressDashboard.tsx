import { useEffect, useMemo, useState } from 'react'
import { analyticsApi } from '../../services/api/analytics'
import { skillsApi } from '../../services/api/skills'
import courseService from '../../services/api/courses'
import userService from '../../services/api/user'
import type { CourseEnrollment, Goal, Achievement } from '../../services/api/user'
import { handleApiError } from '../../utils/errorHandler'
import { getUserId } from '../../utils/auth'

interface ProgressSummary {
  total_minutes: number
  total_sessions: number
  average_session_minutes: number
  average_focus_score?: number
  top_category?: string
  streak_days: number
}

interface CourseCard {
  enrollment: CourseEnrollment
  title: string
}

export default function ProgressDashboard() {
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | 'year'>('month')
  const [summary, setSummary] = useState<ProgressSummary | null>(null)
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([])
  const [courseCards, setCourseCards] = useState<CourseCard[]>([])
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [skills, setSkills] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const userId = getUserId()
  const windowDays = timeFrame === 'week' ? 7 : timeFrame === 'month' ? 30 : 365

  useEffect(() => {
    if (!userId) {
      setError('Please sign in to view progress.')
      return
    }

    const loadProgress = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const [summaryResponse, enrollmentsResponse, achievementsResponse, goalsResponse, skillsResponse] = await Promise.all([
          analyticsApi.getProgressSummary(userId, windowDays),
          userService.getUserCourses(userId),
          userService.getUserAchievements(userId),
          userService.getUserGoals(userId),
          skillsApi.getUserAssessments(userId),
        ])

        setSummary(summaryResponse as ProgressSummary)
        setEnrollments(enrollmentsResponse)
        setAchievements(achievementsResponse)
        setGoals(goalsResponse)
        setSkills(Array.isArray(skillsResponse) ? skillsResponse : [])

        const courseDetails = await Promise.all(
          enrollmentsResponse.map(async (enrollment) => {
            try {
              const course = await courseService.getCourseById(enrollment.course_id)
              return { enrollment, title: course.title || 'Course' }
            } catch {
              return { enrollment, title: 'Course' }
            }
          })
        )
        setCourseCards(courseDetails)
      } catch (err: any) {
        setError(handleApiError(err))
      } finally {
        setIsLoading(false)
      }
    }

    loadProgress()
  }, [userId, windowDays])

  const completedCourses = enrollments.filter((enrollment) => enrollment.status === 'completed').length
  const learningHours = summary ? summary.total_minutes / 60 : 0

  const avgSkillProficiency = useMemo(() => {
    if (skills.length === 0) return null
    const total = skills.reduce((sum: number, skill: any) => sum + (skill.proficiency_level || 0), 0)
    return total / skills.length
  }, [skills])

  const masteredSkills = useMemo(() => {
    return skills.filter((skill: any) => (skill.proficiency_level || 0) >= 80).length
  }, [skills])

  const goalTarget = (type: string) => {
    const goal = goals.find((item) => item.type === type && item.status === 'active')
    return goal ? goal.target_value : null
  }

  const renderMetric = (label: string, current: number | string, target: number | null, unit: string) => {
    const progress = target && typeof current === 'number' ? Math.min((current / target) * 100, 100) : null
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-primary-dark dark:text-darkMode-link">{label}</h3>
        </div>
        <div className="mb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-primary-dark dark:text-darkMode-link">{current}</span>
            <span className="text-gray-600 dark:text-gray-300">
              {target ? `/ ${target} ${unit}` : unit}
            </span>
          </div>
        </div>
        {progress !== null && (
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div className="bg-primary-dark h-2 rounded-full" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-dark rounded-xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary-dark dark:text-darkMode-link">Progress Dashboard</h1>
                <p className="text-gray-600 dark:text-gray-300">Backend-driven learning progress</p>
              </div>
            </div>

            <div className="flex gap-2">
              {['week', 'month', 'year'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeFrame(period as typeof timeFrame)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                    timeFrame === period
                      ? 'bg-primary-dark text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary-dark hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center text-gray-600 dark:text-gray-300">
            Loading progress data...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {renderMetric('Learning Hours', learningHours.toFixed(1), goalTarget('hours'), 'hours')}
              {renderMetric('Courses Completed', completedCourses, goalTarget('courses'), 'courses')}
              {renderMetric('Skills Mastered', masteredSkills, goalTarget('skills'), 'skills')}
              {renderMetric('Assessment Avg', avgSkillProficiency ? avgSkillProficiency.toFixed(1) : '—', goalTarget('assessments'), '%')}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link">Course Progress</h2>
                </div>

                {courseCards.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-300">No course enrollments yet.</p>
                ) : (
                  <div className="space-y-4">
                    {courseCards.slice(0, 3).map((course) => (
                      <div key={course.enrollment.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-primary-dark dark:text-darkMode-link mb-1">{course.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                              {course.enrollment.last_accessed_at && (
                                <span>📅 Last: {new Date(course.enrollment.last_accessed_at).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                          <span className="text-lg font-bold text-secondary">{course.enrollment.progress_percent}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-primary-dark h-2 rounded-full"
                            style={{ width: `${course.enrollment.progress_percent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link">Recent Achievements</h2>
                  </div>

                  {achievements.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-300">No achievements earned yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {achievements.slice(0, 3).map((achievement) => (
                        <div key={achievement.id} className="flex items-center gap-3 p-3 bg-secondary/5 rounded-lg">
                          <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                            <span className="text-white">🏆</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-primary-dark dark:text-darkMode-link">{achievement.title}</h3>
                            {achievement.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-300">{achievement.description}</p>
                            )}
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(achievement.earned_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-6">Learning Goals</h2>
                  {goals.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-300">No goals set yet. Create goals in the Goals page.</p>
                  ) : (
                    <div className="space-y-3">
                      {goals.slice(0, 3).map((goal) => (
                        <div key={goal.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/40 rounded-lg">
                          <span className="text-primary-dark dark:text-darkMode-link font-medium">{goal.title}</span>
                          <span className="text-secondary font-bold">
                            {goal.current_value}/{goal.target_value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-6">Learning Time Summary</h2>
              {summary ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="p-4 bg-primary-dark/10 rounded-lg">
                    <div className="text-xl font-bold text-primary-dark dark:text-darkMode-link">
                      {summary.average_session_minutes.toFixed(1)} min
                    </div>
                    <div>Avg Session Length</div>
                  </div>
                  <div className="p-4 bg-secondary/10 rounded-lg">
                    <div className="text-xl font-bold text-secondary">{summary.total_sessions}</div>
                    <div>Total Sessions</div>
                  </div>
                  <div className="p-4 bg-forest-sage/10 rounded-lg">
                    <div className="text-xl font-bold text-forest-sage capitalize">{summary.top_category || '—'}</div>
                    <div>Top Category</div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">No time analytics available yet.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
