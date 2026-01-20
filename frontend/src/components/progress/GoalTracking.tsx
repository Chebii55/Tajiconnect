import { useState } from 'react'
import { Target, BookOpen, Zap, Briefcase, Trophy, BarChart3, CheckCircle, X, Globe, Lightbulb } from 'lucide-react'

interface Goal {
  id: string
  title: string
  description: string
  category: 'learning' | 'skill' | 'career' | 'personal'
  type: 'hours' | 'courses' | 'assessments' | 'skills' | 'streak' | 'custom'
  status: 'active' | 'completed' | 'paused' | 'overdue'
  priority: 'low' | 'medium' | 'high'
  targetValue: number
  currentValue: number
  unit: string
  startDate: string
  targetDate: string
  completedDate?: string
  milestones: Milestone[]
  tags: string[]
  isPublic: boolean
  reward?: string
}

interface Milestone {
  id: string
  title: string
  targetValue: number
  completed: boolean
  completedDate?: string
  reward?: string
}

interface GoalTemplate {
  id: string
  title: string
  description: string
  category: Goal['category']
  type: Goal['type']
  suggestedTarget: number
  suggestedDuration: string
  unit: string
  popular: boolean
}

const mockGoals: Goal[] = [
  {
    id: 'goal1',
    title: 'Master Python Programming',
    description: 'Complete 5 Python courses and pass all assessments with 80%+ score',
    category: 'skill',
    type: 'courses',
    status: 'active',
    priority: 'high',
    targetValue: 5,
    currentValue: 3,
    unit: 'courses',
    startDate: '2025-01-01',
    targetDate: '2025-03-31',
    milestones: [
      { id: 'm1', title: 'Complete Basic Python', targetValue: 1, completed: true, completedDate: '2025-01-15' },
      { id: 'm2', title: 'Complete Intermediate Python', targetValue: 2, completed: true, completedDate: '2025-01-28' },
      { id: 'm3', title: 'Complete Advanced Python', targetValue: 3, completed: true, completedDate: '2025-02-10' },
      { id: 'm4', title: 'Complete Data Structures', targetValue: 4, completed: false },
      { id: 'm5', title: 'Complete Final Project', targetValue: 5, completed: false, reward: 'Python Certificate' }
    ],
    tags: ['python', 'programming', 'certification'],
    isPublic: true,
    reward: 'Python Mastery Badge'
  },
  {
    id: 'goal2',
    title: 'Daily Learning Streak',
    description: 'Maintain consistent daily learning for 30 consecutive days',
    category: 'learning',
    type: 'streak',
    status: 'active',
    priority: 'medium',
    targetValue: 30,
    currentValue: 7,
    unit: 'days',
    startDate: '2025-01-08',
    targetDate: '2025-02-07',
    milestones: [
      { id: 'm6', title: 'Week 1 Complete', targetValue: 7, completed: true, completedDate: '2025-01-15' },
      { id: 'm7', title: 'Week 2 Complete', targetValue: 14, completed: false },
      { id: 'm8', title: 'Week 3 Complete', targetValue: 21, completed: false },
      { id: 'm9', title: 'Month Complete', targetValue: 30, completed: false, reward: 'Consistency Badge' }
    ],
    tags: ['consistency', 'daily', 'habits'],
    isPublic: false
  },
  {
    id: 'goal3',
    title: 'Career Preparation',
    description: 'Complete career assessment, update portfolio, and apply to 10 jobs',
    category: 'career',
    type: 'custom',
    status: 'active',
    priority: 'high',
    targetValue: 100,
    currentValue: 45,
    unit: '%',
    startDate: '2025-01-01',
    targetDate: '2025-04-01',
    milestones: [
      { id: 'm10', title: 'Complete Career Assessment', targetValue: 25, completed: true, completedDate: '2025-01-10' },
      { id: 'm11', title: 'Update Portfolio', targetValue: 50, completed: false },
      { id: 'm12', title: 'Apply to 5 Jobs', targetValue: 75, completed: false },
      { id: 'm13', title: 'Apply to 10 Jobs', targetValue: 100, completed: false, reward: 'Job Ready Certificate' }
    ],
    tags: ['career', 'portfolio', 'job-search'],
    isPublic: true
  },
  {
    id: 'goal4',
    title: '100 Learning Hours',
    description: 'Accumulate 100 hours of focused learning time',
    category: 'learning',
    type: 'hours',
    status: 'completed',
    priority: 'medium',
    targetValue: 100,
    currentValue: 100,
    unit: 'hours',
    startDate: '2024-12-01',
    targetDate: '2025-01-31',
    completedDate: '2025-01-20',
    milestones: [
      { id: 'm14', title: '25 Hours', targetValue: 25, completed: true, completedDate: '2024-12-15' },
      { id: 'm15', title: '50 Hours', targetValue: 50, completed: true, completedDate: '2025-01-01' },
      { id: 'm16', title: '75 Hours', targetValue: 75, completed: true, completedDate: '2025-01-10' },
      { id: 'm17', title: '100 Hours', targetValue: 100, completed: true, completedDate: '2025-01-20', reward: 'Dedication Badge' }
    ],
    tags: ['hours', 'dedication', 'milestone'],
    isPublic: true,
    reward: 'Learning Champion Badge'
  }
]

const goalTemplates: GoalTemplate[] = [
  {
    id: 't1',
    title: 'Learning Hours Challenge',
    description: 'Set a target for total learning hours',
    category: 'learning',
    type: 'hours',
    suggestedTarget: 50,
    suggestedDuration: '3 months',
    unit: 'hours',
    popular: true
  },
  {
    id: 't2',
    title: 'Course Completion Marathon',
    description: 'Complete a specific number of courses',
    category: 'learning',
    type: 'courses',
    suggestedTarget: 8,
    suggestedDuration: '6 months',
    unit: 'courses',
    popular: true
  },
  {
    id: 't3',
    title: 'Skill Mastery Path',
    description: 'Master a specific number of skills',
    category: 'skill',
    type: 'skills',
    suggestedTarget: 5,
    suggestedDuration: '4 months',
    unit: 'skills',
    popular: true
  },
  {
    id: 't4',
    title: 'Assessment Excellence',
    description: 'Pass assessments with high scores',
    category: 'learning',
    type: 'assessments',
    suggestedTarget: 10,
    suggestedDuration: '2 months',
    unit: 'assessments',
    popular: false
  }
]

export default function GoalTracking() {
  const [goals, setGoals] = useState<Goal[]>(mockGoals)
  const [activeTab, setActiveTab] = useState<'overview' | 'active' | 'completed' | 'create'>('overview')
  const [filter, setFilter] = useState<'all' | Goal['category']>('all')
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({})

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'paused': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
    }
  }

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
    }
  }

  const getCategoryIcon = (category: Goal['category']) => {
    switch (category) {
      case 'learning': return <BookOpen className="w-6 h-6" />
      case 'skill': return <Zap className="w-6 h-6" />
      case 'career': return <Briefcase className="w-6 h-6" />
      case 'personal': return <Target className="w-6 h-6" />
    }
  }

  const calculateProgress = (goal: Goal) => {
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100)
  }

  const getDaysRemaining = (targetDate: string) => {
    const target = new Date(targetDate)
    const today = new Date()
    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const filteredGoals = goals.filter(goal => {
    const categoryMatch = filter === 'all' || goal.category === filter
    return categoryMatch
  })

  const activeGoals = goals.filter(g => g.status === 'active')
  const completedGoals = goals.filter(g => g.status === 'completed')
  const overdueGoals = goals.filter(g => g.status === 'overdue')

  const handleCreateGoal = () => {
    if (newGoal.title && newGoal.targetValue && newGoal.targetDate) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description || '',
        category: newGoal.category || 'learning',
        type: newGoal.type || 'custom',
        status: 'active',
        priority: newGoal.priority || 'medium',
        targetValue: newGoal.targetValue,
        currentValue: 0,
        unit: newGoal.unit || '',
        startDate: new Date().toISOString().split('T')[0],
        targetDate: newGoal.targetDate,
        milestones: [],
        tags: newGoal.tags || [],
        isPublic: newGoal.isPublic || false
      }
      setGoals(prev => [...prev, goal])
      setNewGoal({})
      setShowCreateModal(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-dark rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary-dark dark:text-darkMode-link">Goal Tracking</h1>
                <p className="text-gray-600 dark:text-gray-300">Set, track, and achieve your learning objectives</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              + Create Goal
            </button>
          </div>

          {/* Goal Achievement Notification */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-yellow-800 font-medium">Goal Achievement!</p>
                <p className="text-yellow-700 text-sm">
                  Congratulations! You've completed your "100 Learning Hours" goal 11 days early. Keep up the great work!
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-secondary">{activeGoals.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Active Goals</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-primary">{completedGoals.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Completed</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-forest-sage">
                {Math.round(activeGoals.reduce((sum, g) => sum + calculateProgress(g), 0) / Math.max(activeGoals.length, 1))}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Avg Progress</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-primary-dark dark:text-darkMode-link">{overdueGoals.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Overdue</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'active', label: 'Active Goals' },
            { id: 'completed', label: 'Completed' },
            { id: 'create', label: 'Goal Templates' }
          ].map((tab) => {
            const getTabIcon = (id: string) => {
              switch(id) {
                case 'overview': return <BarChart3 className="w-4 h-4" />
                case 'active': return <Target className="w-4 h-4" />
                case 'completed': return <CheckCircle className="w-4 h-4" />
                case 'create': return <BookOpen className="w-4 h-4" />
                default: return null
              }
            }
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-colors flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'bg-primary-dark text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-primary-dark dark:text-darkMode-link hover:bg-gray-50'
                }`}
              >
                {getTabIcon(tab.id)}
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Priority Goals */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-6">Priority Goals</h2>
              <div className="space-y-4">
                {activeGoals.filter(g => g.priority === 'high').map((goal) => (
                  <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-primary-dark dark:text-darkMode-link">{getCategoryIcon(goal.category)}</div>
                        <div>
                          <h3 className="font-bold text-primary-dark dark:text-darkMode-link">{goal.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{goal.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-secondary">{Math.round(calculateProgress(goal))}%</div>
                        <div className="text-xs text-gray-500">{getDaysRemaining(goal.targetDate)} days left</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-dark h-2 rounded-full"
                        style={{ width: `${calculateProgress(goal)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mt-2">
                      <span>{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                      <span>{new Date(goal.targetDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Goal Categories Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {['learning', 'skill', 'career', 'personal'].map((category) => {
                const categoryGoals = goals.filter(g => g.category === category)
                const activeCount = categoryGoals.filter(g => g.status === 'active').length
                const completedCount = categoryGoals.filter(g => g.status === 'completed').length

                return (
                  <div key={category} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                    <div className="flex justify-center mb-3 text-primary-dark dark:text-darkMode-link">{getCategoryIcon(category as Goal['category'])}</div>
                    <h3 className="font-bold text-primary-dark dark:text-darkMode-link mb-2 capitalize">{category}</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <div className="text-lg font-bold text-primary">{activeCount}</div>
                        <div className="text-gray-600 dark:text-gray-300">Active</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-secondary">{completedCount}</div>
                        <div className="text-gray-600 dark:text-gray-300">Done</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Recent Achievements */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-6">Recent Achievements</h2>
              <div className="space-y-3">
                {completedGoals.slice(0, 3).map((goal) => (
                  <div key={goal.id} className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
                    <Trophy className="w-6 h-6 text-yellow-600" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary-dark dark:text-darkMode-link">{goal.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Completed {goal.completedDate ? new Date(goal.completedDate).toLocaleDateString() : 'recently'}
                      </p>
                    </div>
                    {goal.reward && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                        {goal.reward}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Goals Tab */}
        {(activeTab === 'active' || activeTab === 'completed') && (
          <div>
            {/* Filters */}
            <div className="flex gap-2 mb-6">
              {['all', 'learning', 'skill', 'career', 'personal'].map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category as typeof filter)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                    filter === category
                      ? 'bg-primary text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-primary-dark dark:text-darkMode-link bg-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredGoals
                .filter(g => activeTab === 'active' ? g.status === 'active' : g.status === 'completed')
                .map((goal) => (
                <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-0 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-primary-dark dark:text-darkMode-link">{getCategoryIcon(goal.category)}</div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-primary-dark dark:text-darkMode-link text-lg">{goal.title}</h3>
                          <span className={`w-2 h-2 rounded-full ${getPriorityColor(goal.priority)} bg-current`}></span>
                        </div>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                          {goal.status}
                        </span>
                      </div>
                    </div>
                    {goal.isPublic && (
                      <Globe className="w-5 h-5 text-primary" />
                    )}
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{goal.description}</p>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <span>Progress</span>
                      <span>{goal.currentValue} / {goal.targetValue} {goal.unit}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          goal.status === 'completed'
                            ? 'bg-primary-dark'
                            : 'bg-primary'
                        }`}
                        style={{ width: `${calculateProgress(goal)}%` }}
                      />
                    </div>
                    <div className="text-right text-sm font-bold text-secondary mt-1">
                      {Math.round(calculateProgress(goal))}%
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex justify-between">
                      <span>Started:</span>
                      <span>{new Date(goal.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Target:</span>
                      <span>{new Date(goal.targetDate).toLocaleDateString()}</span>
                    </div>
                    {goal.status === 'active' && (
                      <div className="flex justify-between">
                        <span>Days left:</span>
                        <span className={getDaysRemaining(goal.targetDate) < 7 ? 'text-red-500 font-medium' : ''}>
                          {getDaysRemaining(goal.targetDate)}
                        </span>
                      </div>
                    )}
                    {goal.completedDate && (
                      <div className="flex justify-between">
                        <span>Completed:</span>
                        <span className="text-secondary font-medium">{new Date(goal.completedDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {goal.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedGoal(goal)}
                      className="btn-primary w-full"
                    >
                      View Details
                    </button>
                    {goal.status === 'active' && (
                      <div className="grid grid-cols-2 gap-2">
                        <button className="border border-gray-300 text-gray-600 dark:text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                          Update Progress
                        </button>
                        <button className="border border-secondary text-secondary py-2 px-4 rounded-lg font-medium hover:bg-secondary hover:text-white transition-colors">
                          Mark Complete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Goal Templates Tab */}
        {activeTab === 'create' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-6">Goal Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {goalTemplates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-6 hover:border-primary transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-primary-dark dark:text-darkMode-link">{getCategoryIcon(template.category)}</div>
                        <div>
                          <h3 className="font-bold text-primary-dark dark:text-darkMode-link">{template.title}</h3>
                          {template.popular && (
                            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                              Popular
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{template.description}</p>

                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      <div className="flex justify-between">
                        <span>Suggested Target:</span>
                        <span>{template.suggestedTarget} {template.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{template.suggestedDuration}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setNewGoal({
                          title: template.title,
                          description: template.description,
                          category: template.category,
                          type: template.type,
                          targetValue: template.suggestedTarget,
                          unit: template.unit,
                          priority: 'medium'
                        })
                        setShowCreateModal(true)
                      }}
                      className="btn-primary w-full"
                    >
                      Use This Template
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Goal Creation */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-primary-dark dark:text-darkMode-link mb-4">Create Custom Goal</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Design your own goal with personalized targets, milestones, and rewards.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary"
              >
                Create Custom Goal
              </button>
            </div>
          </div>
        )}

        {/* Create Goal Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-primary-dark dark:text-darkMode-link">Create New Goal</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary-dark dark:text-darkMode-link mb-2">Goal Title</label>
                  <input
                    type="text"
                    value={newGoal.title || ''}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your goal title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-dark dark:text-darkMode-link mb-2">Description</label>
                  <textarea
                    value={newGoal.description || ''}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={3}
                    placeholder="Describe your goal in detail"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-dark dark:text-darkMode-link mb-2">Category</label>
                    <select
                      value={newGoal.category || 'learning'}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value as Goal['category'] }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="learning">Learning</option>
                      <option value="skill">Skill</option>
                      <option value="career">Career</option>
                      <option value="personal">Personal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-dark dark:text-darkMode-link mb-2">Priority</label>
                    <select
                      value={newGoal.priority || 'medium'}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value as Goal['priority'] }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-dark dark:text-darkMode-link mb-2">Target Value</label>
                    <input
                      type="number"
                      value={newGoal.targetValue || ''}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, targetValue: Number(e.target.value) }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., 100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-primary-dark dark:text-darkMode-link mb-2">Unit</label>
                    <input
                      type="text"
                      value={newGoal.unit || ''}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="hours, courses, skills, etc."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-dark dark:text-darkMode-link mb-2">Target Date</label>
                  <input
                    type="date"
                    value={newGoal.targetDate || ''}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={newGoal.isPublic || false}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, isPublic: e.target.checked }))}
                    className="rounded border-gray-300 focus:ring-primary"
                  />
                  <span className="text-sm text-gray-700">Make this goal public (visible to other learners)</span>
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 border border-gray-300 text-gray-600 dark:text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGoal}
                  className="btn-primary flex-1"
                >
                  Create Goal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Goal Detail Modal */}
        {selectedGoal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="text-primary-dark dark:text-darkMode-link">{getCategoryIcon(selectedGoal.category)}</div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary-dark dark:text-darkMode-link">{selectedGoal.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{selectedGoal.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedGoal(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Progress Overview */}
              <div className="bg-secondary/10 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-primary-dark dark:text-darkMode-link">Overall Progress</span>
                  <span className="text-2xl font-bold text-secondary">{Math.round(calculateProgress(selectedGoal))}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-primary-dark h-3 rounded-full"
                    style={{ width: `${calculateProgress(selectedGoal)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mt-2">
                  <span>{selectedGoal.currentValue} / {selectedGoal.targetValue} {selectedGoal.unit}</span>
                  <span>{getDaysRemaining(selectedGoal.targetDate)} days remaining</span>
                </div>
              </div>

              {/* Milestones */}
              <div className="mb-6">
                <h4 className="font-bold text-primary-dark dark:text-darkMode-link mb-4">Milestones</h4>
                <div className="space-y-3">
                  {selectedGoal.milestones.map((milestone, index) => (
                    <div key={milestone.id} className={`flex items-center gap-4 p-3 rounded-lg ${
                      milestone.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'
                    }`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        milestone.completed ? 'bg-secondary text-white' : 'bg-gray-300'
                      }`}>
                        {milestone.completed ? '✓' : index + 1}
                      </div>
                      <div className="flex-1">
                        <h5 className={`font-medium ${milestone.completed ? 'text-secondary' : 'text-gray-700'}`}>
                          {milestone.title}
                        </h5>
                        {milestone.completedDate && (
                          <p className="text-sm text-gray-500">Completed {new Date(milestone.completedDate).toLocaleDateString()}</p>
                        )}
                      </div>
                      {milestone.reward && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                          {milestone.reward}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedGoal(null)}
                  className="flex-1 border border-gray-300 text-gray-600 dark:text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {selectedGoal.status === 'active' && (
                  <>
                    <button className="flex-1 bg-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-dark transition-colors">
                      Update Progress
                    </button>
                    <button className="flex-1 bg-secondary text-white py-2 px-4 rounded-lg font-medium hover:bg-secondary-dark transition-colors">
                      Mark Complete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Goal Tracking Tips */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-blue-800 font-medium">Goal Setting Tips</p>
              <p className="text-blue-700 text-sm">
                Set SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound). Break large goals into smaller milestones
                and celebrate progress along the way. Share public goals for accountability!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}