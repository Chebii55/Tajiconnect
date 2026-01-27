import { useEffect, useMemo, useState } from 'react'
import { CheckCircle, Target } from 'lucide-react'
import { getUserId } from '../../utils/auth'
import userService from '../../services/api/user'
import type { Goal, GoalCreate } from '../../services/api/user'
import { handleApiError } from '../../utils/errorHandler'

export default function GoalTracking() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'active' | 'completed' | 'create'>('overview')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newGoal, setNewGoal] = useState<Partial<GoalCreate>>({
    category: 'learning',
    type: 'hours',
    priority: 'medium',
    unit: 'hours',
    is_public: false,
  })

  const userId = getUserId()

  useEffect(() => {
    if (!userId) {
      setError('Please sign in to manage goals.')
      return
    }

    const loadGoals = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await userService.getUserGoals(userId)
        setGoals(data)
      } catch (err: any) {
        setError(handleApiError(err))
      } finally {
        setIsLoading(false)
      }
    }

    loadGoals()
  }, [userId])

  const activeGoals = useMemo(() => goals.filter((goal) => goal.status === 'active'), [goals])
  const completedGoals = useMemo(() => goals.filter((goal) => goal.status === 'completed'), [goals])
  const overdueGoals = useMemo(() => goals.filter((goal) => goal.status === 'overdue'), [goals])

  const handleCreateGoal = async () => {
    if (!userId) return
    if (!newGoal.title || !newGoal.target_value || !newGoal.target_date) {
      setError('Title, target value, and target date are required.')
      return
    }

    setError(null)
    try {
      const payload: GoalCreate = {
        title: newGoal.title,
        description: newGoal.description,
        category: (newGoal.category || 'learning') as GoalCreate['category'],
        type: (newGoal.type || 'hours') as GoalCreate['type'],
        status: newGoal.status || 'active',
        priority: newGoal.priority || 'medium',
        target_value: newGoal.target_value,
        current_value: newGoal.current_value || 0,
        unit: newGoal.unit || 'units',
        start_date: newGoal.start_date || new Date().toISOString().split('T')[0],
        target_date: newGoal.target_date,
        completed_date: newGoal.completed_date,
        tags: newGoal.tags,
        is_public: newGoal.is_public || false,
        reward: newGoal.reward,
        milestones: newGoal.milestones,
      }
      const created = await userService.createUserGoal(userId, payload)
      setGoals((prev) => [created, ...prev])
      setNewGoal({
        category: 'learning',
        type: 'hours',
        priority: 'medium',
        unit: 'hours',
        is_public: false,
      })
      setActiveTab('active')
    } catch (err: any) {
      setError(handleApiError(err))
    }
  }

  const getProgressPercent = (goal: Goal) =>
    goal.target_value > 0 ? Math.min((goal.current_value / goal.target_value) * 100, 100) : 0

  const renderGoalCard = (goal: Goal) => (
    <div key={goal.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-primary-dark dark:text-darkMode-link">{goal.title}</h3>
          {goal.description && <p className="text-sm text-gray-600 dark:text-gray-300">{goal.description}</p>}
        </div>
        <span className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {goal.category}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
        <span>
          {goal.current_value}/{goal.target_value} {goal.unit}
        </span>
        <span className="capitalize">{goal.status.replace('_', ' ')}</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className="bg-primary-dark h-2 rounded-full"
          style={{ width: `${getProgressPercent(goal)}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Target date: {new Date(goal.target_date).toLocaleDateString()}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary-dark rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-dark dark:text-darkMode-link">Goal Tracking</h1>
              <p className="text-gray-600 dark:text-gray-300">Create and track learning goals from the backend</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-secondary">{activeGoals.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Active Goals</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-primary">{completedGoals.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Completed Goals</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-red-500">{overdueGoals.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Overdue Goals</div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        <div className="flex gap-2 mb-6 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          {['overview', 'active', 'completed', 'create'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors capitalize ${
                activeTab === tab
                  ? 'bg-primary-dark text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-primary-dark hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center text-gray-600 dark:text-gray-300">
            Loading goals...
          </div>
        ) : (
          <>
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {goals.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center text-gray-600 dark:text-gray-300">
                    No goals yet. Create one to start tracking your progress.
                  </div>
                ) : (
                  goals.slice(0, 6).map(renderGoalCard)
                )}
              </div>
            )}

            {activeTab === 'active' && (
              <div className="space-y-4">
                {activeGoals.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center text-gray-600 dark:text-gray-300">
                    No active goals right now.
                  </div>
                ) : (
                  activeGoals.map(renderGoalCard)
                )}
              </div>
            )}

            {activeTab === 'completed' && (
              <div className="space-y-4">
                {completedGoals.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center text-gray-600 dark:text-gray-300">
                    No completed goals yet.
                  </div>
                ) : (
                  completedGoals.map(renderGoalCard)
                )}
              </div>
            )}

            {activeTab === 'create' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-4">Create a Goal</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Title</label>
                    <input
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
                      value={newGoal.title || ''}
                      onChange={(e) => setNewGoal((prev) => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                    <select
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
                      value={newGoal.category || 'learning'}
                      onChange={(e) => setNewGoal((prev) => ({ ...prev, category: e.target.value as GoalCreate['category'] }))}
                    >
                      <option value="learning">Learning</option>
                      <option value="skill">Skill</option>
                      <option value="career">Career</option>
                      <option value="personal">Personal</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Type</label>
                    <select
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
                      value={newGoal.type || 'hours'}
                      onChange={(e) => setNewGoal((prev) => ({ ...prev, type: e.target.value as GoalCreate['type'] }))}
                    >
                      <option value="hours">Hours</option>
                      <option value="courses">Courses</option>
                      <option value="assessments">Assessments</option>
                      <option value="skills">Skills</option>
                      <option value="streak">Streak</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Priority</label>
                    <select
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
                      value={newGoal.priority || 'medium'}
                      onChange={(e) => setNewGoal((prev) => ({ ...prev, priority: e.target.value as GoalCreate['priority'] }))}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Value</label>
                    <input
                      type="number"
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
                      value={newGoal.target_value || ''}
                      onChange={(e) => setNewGoal((prev) => ({ ...prev, target_value: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Unit</label>
                    <input
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
                      value={newGoal.unit || ''}
                      onChange={(e) => setNewGoal((prev) => ({ ...prev, unit: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Target Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
                      value={newGoal.target_date || ''}
                      onChange={(e) => setNewGoal((prev) => ({ ...prev, target_date: e.target.value }))}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</label>
                    <textarea
                      className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
                      value={newGoal.description || ''}
                      onChange={(e) => setNewGoal((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id="goal-public"
                      type="checkbox"
                      checked={newGoal.is_public || false}
                      onChange={(e) => setNewGoal((prev) => ({ ...prev, is_public: e.target.checked }))}
                    />
                    <label htmlFor="goal-public" className="text-sm text-gray-600 dark:text-gray-300">
                      Make goal public
                    </label>
                  </div>
                </div>

                <button onClick={handleCreateGoal} className="btn-primary w-full mt-6">
                  Create Goal
                </button>
              </div>
            )}
          </>
        )}

        {activeTab !== 'create' && goals.length > 0 && (
          <div className="mt-6 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <CheckCircle className="w-4 h-4 text-secondary" />
            Keep tracking goals to unlock personalized progress insights.
          </div>
        )}
      </div>
    </div>
  )
}
