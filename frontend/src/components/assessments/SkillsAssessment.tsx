import { useState } from 'react'

interface Skill {
  id: string
  name: string
  category: 'technical' | 'soft' | 'creative' | 'analytical' | 'language'
  description: string
  level: 0 | 1 | 2 | 3 | 4 | 5 // 0: Not assessed, 1: Beginner, 2: Novice, 3: Intermediate, 4: Advanced, 5: Expert
  assessmentType: 'quiz' | 'practical' | 'portfolio' | 'simulation'
  questions: number
  duration: string
  lastAssessed?: string
  certificateAvailable: boolean
  industryDemand: 'low' | 'medium' | 'high'
  trending: boolean
}

// interface SkillQuestion {
//   id: string
//   text: string
//   type: 'multiple_choice' | 'code' | 'practical' | 'drag_drop'
//   options?: string[]
//   correctAnswer?: string
//   code?: string
//   difficulty: 'easy' | 'medium' | 'hard'
//   points: number
// }


const mockSkills: Skill[] = [
  {
    id: 'python',
    name: 'Python Programming',
    category: 'technical',
    description: 'Core Python programming concepts, syntax, and problem-solving',
    level: 3,
    assessmentType: 'quiz',
    questions: 25,
    duration: '45 minutes',
    lastAssessed: '2025-01-10',
    certificateAvailable: true,
    industryDemand: 'high',
    trending: true
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    category: 'analytical',
    description: 'Statistical analysis, data interpretation, and visualization skills',
    level: 2,
    assessmentType: 'practical',
    questions: 15,
    duration: '60 minutes',
    lastAssessed: '2025-01-08',
    certificateAvailable: true,
    industryDemand: 'high',
    trending: true
  },
  {
    id: 'communication',
    name: 'Communication Skills',
    category: 'soft',
    description: 'Written and verbal communication effectiveness',
    level: 4,
    assessmentType: 'simulation',
    questions: 20,
    duration: '30 minutes',
    lastAssessed: '2025-01-05',
    certificateAvailable: false,
    industryDemand: 'high',
    trending: false
  },
  {
    id: 'javascript',
    name: 'JavaScript Development',
    category: 'technical',
    description: 'Modern JavaScript, ES6+, and web development fundamentals',
    level: 0,
    assessmentType: 'practical',
    questions: 20,
    duration: '50 minutes',
    certificateAvailable: true,
    industryDemand: 'high',
    trending: true
  },
  {
    id: 'design-thinking',
    name: 'Design Thinking',
    category: 'creative',
    description: 'Human-centered design process and creative problem solving',
    level: 1,
    assessmentType: 'portfolio',
    questions: 10,
    duration: '40 minutes',
    lastAssessed: '2024-12-20',
    certificateAvailable: true,
    industryDemand: 'medium',
    trending: true
  },
  {
    id: 'project-management',
    name: 'Project Management',
    category: 'soft',
    description: 'Planning, execution, and delivery of projects effectively',
    level: 0,
    assessmentType: 'simulation',
    questions: 30,
    duration: '55 minutes',
    certificateAvailable: true,
    industryDemand: 'high',
    trending: false
  }
]

/*
const mockQuestions: SkillQuestion[] = [
  {
    id: 'py1',
    text: 'What is the output of the following Python code?\n\nprint([i**2 for i in range(5)])',
    type: 'multiple_choice',
    options: ['[0, 1, 4, 9, 16]', '[1, 4, 9, 16, 25]', '[0, 1, 2, 3, 4]', 'Error'],
    correctAnswer: '[0, 1, 4, 9, 16]',
    difficulty: 'medium',
    points: 10
  },
  {
    id: 'py2',
    text: 'Complete the function to find the maximum value in a list:',
    type: 'code',
    code: 'def find_max(numbers):\n    # Your code here\n    pass',
    difficulty: 'easy',
    points: 15
  }
]
*/

export default function SkillsAssessment() {
  const [skills] = useState<Skill[]>(mockSkills)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [isAssessing, setIsAssessing] = useState(false)
  const [filter, setFilter] = useState<'all' | Skill['category'] | 'trending' | 'not_assessed'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'level' | 'demand' | 'recent'>('name')

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-gray-100 text-gray-800'
      case 1: return 'bg-red-100 text-red-800'
      case 2: return 'bg-yellow-100 text-yellow-800'
      case 3: return 'bg-blue-100 text-blue-800'
      case 4: return 'bg-purple-100 text-purple-800'
      case 5: return 'bg-green-100 text-green-800'
    }
  }

  const getLevelText = (level: number) => {
    switch (level) {
      case 0: return 'Not Assessed'
      case 1: return 'Beginner'
      case 2: return 'Novice'
      case 3: return 'Intermediate'
      case 4: return 'Advanced'
      case 5: return 'Expert'
    }
  }

  const getCategoryIcon = (category: Skill['category']) => {
    switch (category) {
      case 'technical': return '💻'
      case 'soft': return '🤝'
      case 'creative': return '🎨'
      case 'analytical': return '📊'
      case 'language': return '🗣️'
    }
  }

  const getDemandColor = (demand: Skill['industryDemand']) => {
    switch (demand) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
    }
  }

  const getAssessmentTypeIcon = (type: Skill['assessmentType']) => {
    switch (type) {
      case 'quiz': return '📝'
      case 'practical': return '🔧'
      case 'portfolio': return '📁'
      case 'simulation': return '🎮'
      default: return '💻'
    }
  }

  const filteredSkills = skills
    .filter(skill => {
      if (filter === 'all') return true
      if (filter === 'trending') return skill.trending
      if (filter === 'not_assessed') return skill.level === 0
      return skill.category === filter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'level': return b.level - a.level
        case 'demand': return b.industryDemand.localeCompare(a.industryDemand)
        case 'recent': {
          const aDate = a.lastAssessed ? new Date(a.lastAssessed).getTime() : 0
          const bDate = b.lastAssessed ? new Date(b.lastAssessed).getTime() : 0
          return bDate - aDate
        }
        default: return a.name.localeCompare(b.name)
      }
    })

  const assessedSkills = skills.filter(s => s.level > 0)
  const averageLevel = assessedSkills.length > 0
    ? assessedSkills.reduce((sum, s) => sum + s.level, 0) / assessedSkills.length
    : 0

  const startAssessment = (skill: Skill) => {
    setSelectedSkill(skill)
    setCurrentQuestion(0)
    setIsAssessing(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] via-white to-[#2C857A]/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {!isAssessing ? (
          <>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-primary-dark rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB]">Skills Assessment</h1>
                  <p className="text-gray-600 dark:text-gray-300">Evaluate and track your professional skills</p>
                </div>
              </div>

              {/* Skills Progress Notification */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">📈</span>
                  <div>
                    <p className="text-green-800 font-medium">Skill Level Improved!</p>
                    <p className="text-green-700 text-sm">
                      Your Python Programming skill has advanced to Intermediate level. Keep practicing to reach Advanced!
                    </p>
                  </div>
                </div>
              </div>

              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
                  <div className="text-2xl font-bold text-[#4A9E3D]">{assessedSkills.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Skills Assessed</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
                  <div className="text-2xl font-bold text-[#3DAEDB]">{averageLevel.toFixed(1)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Average Level</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
                  <div className="text-2xl font-bold text-[#2C857A]">{skills.filter(s => s.trending).length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Trending Skills</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
                  <div className="text-2xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB]">{skills.filter(s => s.certificateAvailable).length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Certifiable</div>
                </div>
              </div>
            </div>

            {/* Filters and Sort */}
            <div className="flex flex-wrap gap-4 justify-between mb-6">
              <div className="flex flex-wrap gap-2">
                {['all', 'technical', 'soft', 'creative', 'analytical', 'trending', 'not_assessed'].map((filterOption) => (
                  <button
                    key={filterOption}
                    onClick={() => setFilter(filterOption as typeof filter)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                      filter === filterOption
                        ? 'bg-[#3DAEDB] text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:text-[#1C3D6E] dark:text-[#3DAEDB] bg-white'
                    }`}
                  >
                    {filterOption.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DAEDB] focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="level">Sort by Level</option>
                <option value="demand">Sort by Demand</option>
                <option value="recent">Sort by Recent</option>
              </select>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSkills.map((skill) => (
                <div key={skill.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{getCategoryIcon(skill.category)}</span>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-[#1C3D6E] dark:text-[#3DAEDB] text-lg">{skill.name}</h3>
                            {skill.trending && (
                              <span className="text-orange-500 text-sm">🔥</span>
                            )}
                          </div>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(skill.level)}`}>
                            {getLevelText(skill.level)}
                          </span>
                        </div>
                      </div>
                      {skill.certificateAvailable && (
                        <span className="text-yellow-500 text-xl">🏆</span>
                      )}
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{skill.description}</p>

                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      <div className="flex justify-between">
                        <span>Assessment Type:</span>
                        <span className="flex items-center gap-1">
                          {getAssessmentTypeIcon(skill.assessmentType)}
                          {skill.assessmentType}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{skill.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Questions:</span>
                        <span>{skill.questions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Industry Demand:</span>
                        <span className={`font-medium ${getDemandColor(skill.industryDemand)}`}>
                          {skill.industryDemand}
                        </span>
                      </div>
                      {skill.lastAssessed && (
                        <div className="flex justify-between">
                          <span>Last Assessed:</span>
                          <span>{new Date(skill.lastAssessed).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {skill.level > 0 ? (
                      <div className="space-y-2">
                        <button
                          onClick={() => startAssessment(skill)}
                          className="btn-primary w-full"
                        >
                          Reassess Skill
                        </button>
                        <button className="w-full border border-gray-300 text-gray-600 dark:text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                          View Results
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startAssessment(skill)}
                        className="btn-primary w-full"
                      >
                        Start Assessment
                      </button>
                    )}

                    {skill.level >= 3 && skill.certificateAvailable && (
                      <div className="mt-2">
                        <button className="w-full bg-yellow-100 border border-yellow-300 text-yellow-800 py-2 px-4 rounded-lg font-medium hover:bg-yellow-200 transition-colors">
                          🏆 Earn Certificate
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Skills Development Recommendations */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-4">Skill Development Recommendations</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-bold text-red-800 mb-2">🎯 Priority Skills</h3>
                  <p className="text-red-700 text-sm">
                    Focus on JavaScript Development and Project Management - both are in high demand and complement your existing skills.
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-bold text-blue-800 mb-2">📈 Trending Skills</h3>
                  <p className="text-blue-700 text-sm">
                    Stay current with trending skills like Python, Data Analysis, and Design Thinking to remain competitive.
                  </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-bold text-green-800 mb-2">🏆 Certification Ready</h3>
                  <p className="text-green-700 text-sm">
                    Your Communication Skills are at Advanced level - consider earning a certificate to showcase your expertise.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Assessment Interface */
          <div className="max-w-4xl mx-auto">
            {/* Assessment Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-dark rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">{currentQuestion + 1}</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB]">{selectedSkill?.name} Assessment</h1>
                    <p className="text-gray-600 dark:text-gray-300">Question {currentQuestion + 1} of {selectedSkill?.questions}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAssessing(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-dark h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / (selectedSkill?.questions || 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-[#3DAEDB]/10 text-[#1C3D6E] dark:text-[#3DAEDB] px-3 py-1 rounded-full text-sm font-medium">
                    {selectedSkill?.assessmentType}
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    10 points
                  </span>
                </div>
                <h2 className="text-xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-4">
                  What is the output of the following Python code?
                </h2>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm mb-4">
                  print([i**2 for i in range(5)])
                </div>
              </div>

              <div className="space-y-3">
                {['[0, 1, 4, 9, 16]', '[1, 4, 9, 16, 25]', '[0, 1, 2, 3, 4]', 'Error'].map((option, index) => (
                  <button
                    key={index}
                    className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-[#3DAEDB] hover:bg-[#3DAEDB]/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                      <span className="text-gray-800">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                disabled={currentQuestion === 0}
                className="px-6 py-3 border border-gray-300 text-gray-600 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <button className="btn-primary px-6 py-3">
                {currentQuestion === (selectedSkill?.questions || 1) - 1 ? 'Complete Assessment' : 'Next Question'}
              </button>
            </div>

            {/* Assessment Tips */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <span className="text-blue-600">💡</span>
                <div>
                  <p className="text-blue-800 text-sm font-medium">Assessment Tip</p>
                  <p className="text-blue-700 text-sm">
                    Take your time and read each question carefully. You can't go back once you submit an answer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}