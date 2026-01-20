import { useState } from 'react'
import { Brain, Settings, User, BarChart3 } from 'lucide-react'

interface Assessment {
  id: string
  title: string
  type: 'psychometric' | 'skills' | 'personality'
  description: string
  duration: string
  questions: number
  status: 'not_started' | 'in_progress' | 'completed'
  lastTaken?: string
  score?: number
}

const mockAssessments: Assessment[] = [
  {
    id: 'psych-1',
    title: 'Career Aptitude Assessment',
    type: 'psychometric',
    description: 'Discover your natural strengths and ideal career paths',
    duration: '25 minutes',
    questions: 50,
    status: 'completed',
    lastTaken: '2025-01-15',
    score: 85
  },
  {
    id: 'skills-1',
    title: 'Technical Skills Evaluation',
    type: 'skills',
    description: 'Assess your current technical competencies',
    duration: '45 minutes',
    questions: 30,
    status: 'in_progress'
  },
  {
    id: 'personality-1',
    title: 'DISC Personality Test',
    type: 'personality',
    description: 'Understanding your personality type for better career fit',
    duration: '20 minutes',
    questions: 40,
    status: 'not_started'
  }
]

export default function AssessmentCenter() {
  const [assessments] = useState<Assessment[]>(mockAssessments)
  const [filter, setFilter] = useState<'all' | 'psychometric' | 'skills' | 'personality'>('all')

  const filteredAssessments = assessments.filter(assessment =>
    filter === 'all' || assessment.type === filter
  )

  const getStatusColor = (status: Assessment['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
      case 'in_progress': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
      default: return 'bg-gray-100 dark:bg-gray-700/50 text-gray-800 dark:text-gray-300'
    }
  }

  const getTypeIcon = (type: Assessment['type']) => {
    switch (type) {
      case 'psychometric': return <Brain className="w-6 h-6" />
      case 'skills': return <Settings className="w-6 h-6" />
      case 'personality': return <User className="w-6 h-6" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-primary-dark rounded-xl flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-dark dark:text-darkMode-link">Assessment Center</h1>
              <p className="text-gray-600 dark:text-gray-300">Discover your strengths and track your progress</p>
            </div>
          </div>

          {/* Notification */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-blue-600">ℹ️</span>
              <p className="text-blue-800 dark:text-blue-300 text-sm">
                Complete all assessments to get personalized career recommendations and learning paths.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          {['all', 'psychometric', 'skills', 'personality'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as typeof filter)}
              className={`px-4 py-2 rounded-md font-medium transition-colors capitalize ${
                filter === tab
                  ? 'bg-[#1C3D6E] text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-primary-dark dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Assessment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.map((assessment) => (
            <div key={assessment.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-0 hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getTypeIcon(assessment.type)}</span>
                    <div>
                      <h3 className="font-bold text-primary-dark dark:text-darkMode-link text-lg">{assessment.title}</h3>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assessment.status)}`}>
                        {assessment.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{assessment.description}</p>

                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{assessment.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Questions:</span>
                    <span>{assessment.questions}</span>
                  </div>
                  {assessment.score && (
                    <div className="flex justify-between">
                      <span>Score:</span>
                      <span className="font-bold text-[#4A9E3D] dark:text-[#5BC0EB]">{assessment.score}%</span>
                    </div>
                  )}
                </div>

                {assessment.status === 'completed' ? (
                  <div className="space-y-2">
                    <button className="w-full bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors">
                      View Results
                    </button>
                    <button className="w-full border border-[#1C3D6E] dark:border-[#3DAEDB] text-primary-dark dark:text-darkMode-link py-2 px-4 rounded-lg font-medium hover:bg-[#1C3D6E] dark:hover:bg-primary hover:text-white dark:hover:text-gray-900 transition-colors">
                      Retake Assessment
                    </button>
                  </div>
                ) : (
                  <button className="btn-primary w-full">
                    {assessment.status === 'in_progress' ? 'Continue' : 'Start'} Assessment
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Progress Overview */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-4">Assessment Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-[#4A9E3D]">1</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Completed</div>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-primary">1</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">In Progress</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-300">1</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Not Started</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}