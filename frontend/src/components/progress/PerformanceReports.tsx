import { useState } from 'react'

interface PerformanceMetric {
  id: string
  name: string
  value: number
  previousValue: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  changePercentage: number
  category: 'learning' | 'assessment' | 'engagement' | 'achievement'
}

interface Report {
  id: string
  title: string
  type: 'weekly' | 'monthly' | 'quarterly' | 'custom'
  period: string
  generatedDate: string
  summary: string
  highlights: string[]
  recommendations: string[]
  metrics: PerformanceMetric[]
  downloadUrl?: string
}

interface ComparisonData {
  period: string
  learningHours: number
  coursesCompleted: number
  assessmentScore: number
  skillsLearned: number
}

const mockMetrics: PerformanceMetric[] = [
  {
    id: 'learning_hours',
    name: 'Learning Hours',
    value: 47,
    previousValue: 35,
    unit: 'hours',
    trend: 'up',
    changePercentage: 34.3,
    category: 'learning'
  },
  {
    id: 'assessment_score',
    name: 'Average Assessment Score',
    value: 85,
    previousValue: 78,
    unit: '%',
    trend: 'up',
    changePercentage: 9.0,
    category: 'assessment'
  },
  {
    id: 'course_completion',
    name: 'Course Completion Rate',
    value: 92,
    previousValue: 88,
    unit: '%',
    trend: 'up',
    changePercentage: 4.5,
    category: 'learning'
  },
  {
    id: 'streak_days',
    name: 'Learning Streak',
    value: 7,
    previousValue: 12,
    unit: 'days',
    trend: 'down',
    changePercentage: -41.7,
    category: 'engagement'
  },
  {
    id: 'skills_gained',
    name: 'Skills Gained',
    value: 3,
    previousValue: 2,
    unit: 'skills',
    trend: 'up',
    changePercentage: 50.0,
    category: 'achievement'
  },
  {
    id: 'forum_posts',
    name: 'Community Engagement',
    value: 15,
    previousValue: 18,
    unit: 'posts',
    trend: 'down',
    changePercentage: -16.7,
    category: 'engagement'
  }
]

const mockReports: Report[] = [
  {
    id: 'weekly_1',
    title: 'Weekly Performance Report',
    type: 'weekly',
    period: 'January 8-14, 2025',
    generatedDate: '2025-01-15T08:00:00Z',
    summary: 'Excellent week with significant improvement in learning hours and assessment scores. Your consistency in daily learning is paying off!',
    highlights: [
      'Increased learning time by 34% compared to last week',
      'Completed 2 new courses in Python and Data Analysis',
      'Achieved 85% average on all assessments',
      'Maintained 7-day learning streak'
    ],
    recommendations: [
      'Focus on extending your learning streak - you\'re doing great!',
      'Consider tackling more challenging assessments to boost skills',
      'Increase community engagement by participating in forums'
    ],
    metrics: mockMetrics,
    downloadUrl: '/reports/weekly-2025-01-15.pdf'
  },
  {
    id: 'monthly_1',
    title: 'Monthly Performance Report',
    type: 'monthly',
    period: 'December 2024',
    generatedDate: '2025-01-01T08:00:00Z',
    summary: 'Strong performance throughout December with steady progress across all learning areas. You\'ve built good momentum for the new year.',
    highlights: [
      'Completed 8 courses total for the month',
      'Earned 3 new skill certifications',
      'Improved average assessment score from 72% to 82%',
      'Logged 156 total learning hours'
    ],
    recommendations: [
      'Set higher goals for January to maintain momentum',
      'Explore advanced courses in your strongest skill areas',
      'Share knowledge with peers through mentoring'
    ],
    metrics: [],
    downloadUrl: '/reports/monthly-2024-12.pdf'
  }
]

const mockComparisonData: ComparisonData[] = [
  { period: 'Week 1', learningHours: 25, coursesCompleted: 1, assessmentScore: 75, skillsLearned: 1 },
  { period: 'Week 2', learningHours: 32, coursesCompleted: 2, assessmentScore: 78, skillsLearned: 2 },
  { period: 'Week 3', learningHours: 28, coursesCompleted: 1, assessmentScore: 82, skillsLearned: 1 },
  { period: 'Week 4', learningHours: 35, coursesCompleted: 2, assessmentScore: 80, skillsLearned: 2 },
  { period: 'Week 5', learningHours: 47, coursesCompleted: 3, assessmentScore: 85, skillsLearned: 3 }
]

export default function PerformanceReports() {
  const [activeTab, setActiveTab] = useState<'current' | 'history' | 'comparison' | 'export'>('current')
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'quarterly'>('weekly')
  // Future feature: detailed report selection
  // const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [showNotification, setShowNotification] = useState(true)

  const getCategoryColor = (category: PerformanceMetric['category']) => {
    switch (category) {
      case 'learning': return 'bg-blue-100 text-blue-800'
      case 'assessment': return 'bg-green-100 text-green-800'
      case 'engagement': return 'bg-purple-100 text-purple-800'
      case 'achievement': return 'bg-yellow-100 text-yellow-800'
    }
  }

  const getTrendIcon = (trend: PerformanceMetric['trend']) => {
    switch (trend) {
      case 'up': return '📈'
      case 'down': return '📉'
      case 'stable': return '➡️'
    }
  }

  const getTrendColor = (trend: PerformanceMetric['trend']) => {
    switch (trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      case 'stable': return 'text-gray-600 dark:text-gray-300'
    }
  }

  const currentReport = mockReports.find(r => r.type === selectedPeriod) || mockReports[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] via-white to-[#2C857A]/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary-dark rounded-xl flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB]">Performance Reports</h1>
              <p className="text-gray-600 dark:text-gray-300">Detailed analysis of your learning progress and achievements</p>
            </div>
          </div>

          {/* New Report Notification */}
          {showNotification && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">📈</span>
                  <div>
                    <p className="text-blue-800 font-medium">New Weekly Report Available!</p>
                    <p className="text-blue-700 text-sm">
                      Your performance report for January 8-14 is ready with insights and recommendations.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowNotification(false)}
                  className="text-blue-400 hover:text-blue-600"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          {[
            { id: 'current', label: 'Current Report', icon: '📋' },
            { id: 'history', label: 'Report History', icon: '📚' },
            { id: 'comparison', label: 'Trend Analysis', icon: '📈' },
            { id: 'export', label: 'Export & Share', icon: '📤' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-colors flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-[#1C3D6E] text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-[#1C3D6E] dark:text-[#3DAEDB] hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Current Report Tab */}
        {activeTab === 'current' && (
          <div className="space-y-6">
            {/* Period Selector */}
            <div className="flex justify-center mb-6">
              <div className="flex gap-2 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                {['weekly', 'monthly', 'quarterly'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period as typeof selectedPeriod)}
                    className={`px-4 py-2 rounded-md font-medium transition-colors capitalize ${
                      selectedPeriod === period
                        ? 'bg-[#3DAEDB] text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:text-[#1C3D6E] dark:text-[#3DAEDB]'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Report Header */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB]">{currentReport.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300">{currentReport.period}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Generated</p>
                  <p className="font-medium">{new Date(currentReport.generatedDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="bg-[#4A9E3D]/10 border border-[#4A9E3D]/20 rounded-lg p-4">
                <p className="text-[#4A9E3D] font-medium">{currentReport.summary}</p>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentReport.metrics.map((metric) => (
                <div key={metric.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(metric.category)}`}>
                        {metric.category}
                      </span>
                    </div>
                    <span className={`text-xl ${getTrendColor(metric.trend)}`}>{getTrendIcon(metric.trend)}</span>
                  </div>

                  <h3 className="font-semibold text-[#1C3D6E] dark:text-[#3DAEDB] mb-2">{metric.name}</h3>

                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB]">{metric.value}</span>
                    <span className="text-gray-600 dark:text-gray-300">{metric.unit}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                      {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '-' : ''}
                      {Math.abs(metric.changePercentage)}%
                    </span>
                    <span className="text-sm text-gray-500">vs last {selectedPeriod.slice(0, -2)}</span>
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    Previous: {metric.previousValue} {metric.unit}
                  </div>
                </div>
              ))}
            </div>

            {/* Highlights & Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-4">📈 Highlights</h3>
                <div className="space-y-3">
                  {currentReport.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <span className="text-[#4A9E3D] mt-0.5">✓</span>
                      <span className="text-green-800 text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-4">💡 Recommendations</h3>
                <div className="space-y-3">
                  {currentReport.recommendations.map((recommendation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <span className="text-[#3DAEDB] mt-0.5">→</span>
                      <span className="text-blue-800 text-sm">{recommendation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-4">Performance Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-[#4A9E3D]/10 rounded-lg">
                  <div className="text-2xl font-bold text-[#4A9E3D]">A+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Overall Grade</div>
                </div>
                <div className="text-center p-4 bg-[#3DAEDB]/10 rounded-lg">
                  <div className="text-2xl font-bold text-[#3DAEDB]">92%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Goal Achievement</div>
                </div>
                <div className="text-center p-4 bg-[#2C857A]/10 rounded-lg">
                  <div className="text-2xl font-bold text-[#2C857A]">Top 15%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Peer Ranking</div>
                </div>
                <div className="text-center p-4 bg-[#1C3D6E]/10 rounded-lg">
                  <div className="text-2xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB]">+18%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Improvement</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Report History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-6">Report Archive</h2>
              <div className="space-y-4">
                {mockReports.map((report) => (
                  <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-[#1C3D6E] dark:text-[#3DAEDB]">{report.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            report.type === 'weekly' ? 'bg-blue-100 text-blue-800' :
                            report.type === 'monthly' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {report.type}
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{report.period}</p>
                        <p className="text-gray-700 text-sm">{report.summary}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => console.log('Selected report:', report)}
                          className="px-4 py-2 bg-[#3DAEDB] text-white rounded-lg hover:bg-[#1C3D6E] transition-colors"
                        >
                          View
                        </button>
                        {report.downloadUrl && (
                          <button className="px-4 py-2 border border-gray-300 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trend Analysis Tab */}
        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-6">Performance Trends</h2>

              {/* Chart Placeholder */}
              <div className="h-64 bg-primary-dark/10 rounded-lg flex items-center justify-center mb-6">
                <div className="text-center">
                  <div className="text-4xl mb-2">📈</div>
                  <p className="text-gray-600 dark:text-gray-300">Interactive trend charts will be displayed here</p>
                  <p className="text-sm text-gray-500">Showing learning hours, scores, and engagement over time</p>
                </div>
              </div>

              {/* Trend Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-[#1C3D6E] dark:text-[#3DAEDB]">Period</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#1C3D6E] dark:text-[#3DAEDB]">Learning Hours</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#1C3D6E] dark:text-[#3DAEDB]">Courses</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#1C3D6E] dark:text-[#3DAEDB]">Avg Score</th>
                      <th className="text-left py-3 px-4 font-semibold text-[#1C3D6E] dark:text-[#3DAEDB]">Skills</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockComparisonData.map((data, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{data.period}</td>
                        <td className="py-3 px-4">{data.learningHours}h</td>
                        <td className="py-3 px-4">{data.coursesCompleted}</td>
                        <td className="py-3 px-4">{data.assessmentScore}%</td>
                        <td className="py-3 px-4">{data.skillsLearned}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-3">📈 Positive Trends</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">↗</span>
                    <span>Learning hours increasing weekly</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">↗</span>
                    <span>Assessment scores improving</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">↗</span>
                    <span>Skills acquisition accelerating</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-3">⚠️ Areas to Watch</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-yellow-600">→</span>
                    <span>Course completion rate stable</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-600">↘</span>
                    <span>Community engagement declining</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-3">🎯 Recommendations</h3>
                <ul className="space-y-2 text-sm">
                  <li className="text-gray-700">• Maintain current learning pace</li>
                  <li className="text-gray-700">• Focus on course completion</li>
                  <li className="text-gray-700">• Increase forum participation</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Export & Share Tab */}
        {activeTab === 'export' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-6">Export & Share Options</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-[#1C3D6E] dark:text-[#3DAEDB] mb-4">Export Formats</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📄</span>
                        <div className="text-left">
                          <div className="font-medium text-[#1C3D6E] dark:text-[#3DAEDB]">PDF Report</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Detailed formatted report</div>
                        </div>
                      </div>
                      <span className="text-[#3DAEDB]">→</span>
                    </button>

                    <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📊</span>
                        <div className="text-left">
                          <div className="font-medium text-[#1C3D6E] dark:text-[#3DAEDB]">Excel/CSV Data</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Raw data for analysis</div>
                        </div>
                      </div>
                      <span className="text-[#3DAEDB]">→</span>
                    </button>

                    <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📋</span>
                        <div className="text-left">
                          <div className="font-medium text-[#1C3D6E] dark:text-[#3DAEDB]">Summary Card</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Visual highlights</div>
                        </div>
                      </div>
                      <span className="text-[#3DAEDB]">→</span>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-[#1C3D6E] dark:text-[#3DAEDB] mb-4">Share Options</h3>
                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">📧</span>
                        <div className="text-left">
                          <div className="font-medium text-[#1C3D6E] dark:text-[#3DAEDB]">Email Report</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Send to advisor/mentor</div>
                        </div>
                      </div>
                      <span className="text-[#3DAEDB]">→</span>
                    </button>

                    <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💼</span>
                        <div className="text-left">
                          <div className="font-medium text-[#1C3D6E] dark:text-[#3DAEDB]">LinkedIn Profile</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Add to accomplishments</div>
                        </div>
                      </div>
                      <span className="text-[#3DAEDB]">→</span>
                    </button>

                    <button className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🔗</span>
                        <div className="text-left">
                          <div className="font-medium text-[#1C3D6E] dark:text-[#3DAEDB]">Public Link</div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Share with anyone</div>
                        </div>
                      </div>
                      <span className="text-[#3DAEDB]">→</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-[#1C3D6E] dark:text-[#3DAEDB] mb-2">Schedule Automatic Reports</h4>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300 focus:ring-[#3DAEDB]" />
                    <span className="text-sm">Weekly email summary</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300 focus:ring-[#3DAEDB]" />
                    <span className="text-sm">Monthly detailed report</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300 focus:ring-[#3DAEDB]" />
                    <span className="text-sm">Quarterly review</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Report Customization */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-4">Customize Your Report</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#1C3D6E] dark:text-[#3DAEDB] mb-2">Include Sections</label>
                  <div className="space-y-2">
                    {['Performance Metrics', 'Learning Goals', 'Course Progress', 'Assessment Scores', 'Time Analytics', 'Peer Comparison'].map((section) => (
                      <label key={section} className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded border-gray-300 focus:ring-[#3DAEDB]" />
                        <span className="text-sm text-gray-700">{section}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1C3D6E] dark:text-[#3DAEDB] mb-2">Date Range</label>
                  <div className="space-y-3">
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DAEDB] focus:border-transparent"
                    />
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DAEDB] focus:border-transparent"
                    />
                    <button className="w-full bg-[#4A9E3D] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#2F6B29] transition-colors">
                      Generate Custom Report
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Export Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <span className="text-blue-600">💡</span>
                <div>
                  <p className="text-blue-800 font-medium">Export Tips</p>
                  <p className="text-blue-700 text-sm">
                    Use PDF reports for presentations, CSV data for detailed analysis, and summary cards for quick social sharing.
                    Reports include verification codes for authenticity.
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