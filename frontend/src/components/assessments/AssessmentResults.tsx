import { useState } from 'react'

interface ResultCategory {
  name: string
  score: number
  description: string
  strengths: string[]
  recommendations: string[]
}

interface AssessmentResult {
  id: string
  title: string
  completedDate: string
  overallScore: number
  categories: ResultCategory[]
  careerMatches: string[]
  nextSteps: string[]
}

const mockResult: AssessmentResult = {
  id: 'psych-1',
  title: 'Career Aptitude Assessment',
  completedDate: '2025-01-15',
  overallScore: 85,
  categories: [
    {
      name: 'Analytical Thinking',
      score: 92,
      description: 'Your ability to break down complex problems and find logical solutions',
      strengths: ['Data analysis', 'Pattern recognition', 'Logical reasoning'],
      recommendations: ['Consider roles in data science', 'Explore programming opportunities', 'Develop statistical skills']
    },
    {
      name: 'Creative Problem Solving',
      score: 78,
      description: 'Your capacity for innovative thinking and creative approaches',
      strengths: ['Brainstorming', 'Out-of-box thinking', 'Design thinking'],
      recommendations: ['Try UX/UI design courses', 'Explore creative industries', 'Practice design challenges']
    },
    {
      name: 'Communication',
      score: 85,
      description: 'Your ability to convey ideas clearly and work with others',
      strengths: ['Written communication', 'Presentation skills', 'Active listening'],
      recommendations: ['Consider leadership roles', 'Practice public speaking', 'Join debate or presentation clubs']
    }
  ],
  careerMatches: [
    'Data Scientist',
    'Software Engineer',
    'Product Manager',
    'Business Analyst',
    'UX Designer'
  ],
  nextSteps: [
    'Complete the Technical Skills Assessment',
    'Explore recommended career paths',
    'Begin learning Python programming',
    'Connect with industry professionals'
  ]
}

export default function AssessmentResults() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-secondary dark:text-green-400'
    if (score >= 60) return 'text-primary dark:text-blue-400'
    return 'text-orange-500 dark:text-orange-400'
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-[#4A9E3D] dark:bg-green-500'
    if (score >= 60) return 'bg-primary dark:bg-blue-500'
    return 'bg-orange-500 dark:bg-orange-500'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-dark rounded-xl flex items-center justify-center">
                <span className="text-3xl">🎯</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary-dark dark:text-darkMode-link">{mockResult.title}</h1>
                <p className="text-gray-600 dark:text-gray-300">Completed on {new Date(mockResult.completedDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-secondary dark:text-green-400">{mockResult.overallScore}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Overall Score</div>
            </div>
          </div>

          {/* Success Notification */}
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-green-600 dark:text-green-400">🎉</span>
              <div>
                <p className="text-green-800 dark:text-green-300 font-medium">Excellent Performance!</p>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  Your assessment results show strong potential in analytical and communication skills.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Category Scores */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-6">Category Breakdown</h2>
              <div className="space-y-4">
                {mockResult.categories.map((category, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedCategory === index
                        ? 'border-[#4A9E3D] dark:border-green-500 bg-[#4A9E3D]/5 dark:bg-green-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-[#3DAEDB] dark:hover:border-blue-500 hover:bg-primary/5 dark:hover:bg-blue-900/20'
                    }`}
                    onClick={() => setSelectedCategory(selectedCategory === index ? null : index)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-primary-dark dark:text-darkMode-link">{category.name}</h3>
                      <span className={`text-xl font-bold ${getScoreColor(category.score)}`}>
                        {category.score}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full ${getScoreBackground(category.score)}`}
                        style={{ width: `${category.score}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{category.description}</p>

                    {selectedCategory === index && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-primary-dark dark:text-darkMode-link mb-2">Strengths</h4>
                            <ul className="space-y-1">
                              {category.strengths.map((strength, idx) => (
                                <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                  <span className="text-secondary dark:text-green-400">✓</span>
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium text-primary-dark dark:text-darkMode-link mb-2">Recommendations</h4>
                            <ul className="space-y-1">
                              {category.recommendations.map((rec, idx) => (
                                <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                                  <span className="text-primary dark:text-blue-400">→</span>
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setShowShareModal(true)}
                className="btn-primary flex-1"
              >
                Share Results
              </button>
              <button className="flex-1 border border-[#1C3D6E] dark:border-[#3DAEDB] text-primary-dark dark:text-darkMode-link py-3 px-6 rounded-lg font-medium hover:bg-[#1C3D6E] dark:hover:bg-primary hover:text-white dark:hover:text-gray-900 transition-colors">
                Download Report
              </button>
            </div>
          </div>

          {/* Career Matches & Next Steps */}
          <div className="space-y-6">
            {/* Career Matches */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-primary-dark dark:text-darkMode-link mb-4">Top Career Matches</h3>
              <div className="space-y-3">
                {mockResult.careerMatches.map((career, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-[#4A9E3D]/5 dark:bg-green-900/20 rounded-lg">
                    <div className="w-6 h-6 bg-[#4A9E3D] text-white rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <span className="text-primary-dark dark:text-darkMode-link font-medium">{career}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 bg-[#4A9E3D] dark:bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-[#2F6B29] dark:hover:bg-green-700 transition-colors">
                Explore Career Paths
              </button>
            </div>

            {/* Next Steps */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-primary-dark dark:text-darkMode-link mb-4">Recommended Next Steps</h3>
              <div className="space-y-3">
                {mockResult.nextSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment Feedback */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400">💡</span>
                <div>
                  <p className="text-blue-800 dark:text-blue-300 font-medium text-sm">Want to improve your scores?</p>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    Consider taking additional skill assessments or exploring our learning modules to strengthen weaker areas.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold text-primary-dark dark:text-darkMode-link mb-4">Share Your Results</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100">
                  <span>📧</span>
                  <span>Share via Email</span>
                </button>
                <button className="w-full flex items-center justify-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100">
                  <span>🔗</span>
                  <span>Copy Link</span>
                </button>
                <button className="w-full flex items-center justify-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-gray-100">
                  <span>💼</span>
                  <span>Share on LinkedIn</span>
                </button>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 bg-[#1C3D6E] dark:bg-primary text-white dark:text-gray-900 py-2 px-4 rounded-lg font-medium hover:bg-[#1C3D6E]/90 dark:hover:bg-primary/90 transition-colors"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}