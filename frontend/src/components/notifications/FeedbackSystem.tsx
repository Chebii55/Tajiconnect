import { useState } from 'react'

interface FeedbackForm {
  type: 'bug' | 'feature' | 'improvement' | 'general'
  category: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
  attachments: File[]
  contactInfo: {
    email: string
    allowContact: boolean
  }
}

interface FeedbackItem {
  id: string
  type: FeedbackForm['type']
  category: string
  title: string
  description: string
  priority: FeedbackForm['priority']
  status: 'submitted' | 'in_review' | 'in_progress' | 'resolved' | 'closed'
  submittedDate: string
  lastUpdate: string
  response?: string
  votes: number
  userVoted: boolean
}

const mockFeedback: FeedbackItem[] = [
  {
    id: '1',
    type: 'feature',
    category: 'Learning Experience',
    title: 'Dark mode for better night studying',
    description: 'Add a dark mode toggle to reduce eye strain during late-night study sessions.',
    priority: 'medium',
    status: 'in_progress',
    submittedDate: '2025-01-10',
    lastUpdate: '2025-01-14',
    response: 'Great suggestion! Our design team is working on implementing dark mode. Expected release in the next update.',
    votes: 45,
    userVoted: true
  },
  {
    id: '2',
    type: 'bug',
    category: 'Assessments',
    title: 'Assessment timer not displaying correctly',
    description: 'The countdown timer freezes during timed assessments, causing confusion about remaining time.',
    priority: 'high',
    status: 'resolved',
    submittedDate: '2025-01-08',
    lastUpdate: '2025-01-12',
    response: 'This issue has been fixed in the latest update. Thank you for reporting!',
    votes: 12,
    userVoted: false
  },
  {
    id: '3',
    type: 'improvement',
    category: 'Progress Tracking',
    title: 'More detailed progress analytics',
    description: 'Would love to see more granular analytics showing time spent on different topics and learning patterns.',
    priority: 'low',
    status: 'in_review',
    submittedDate: '2025-01-05',
    lastUpdate: '2025-01-11',
    votes: 28,
    userVoted: false
  }
]

export default function FeedbackSystem() {
  const [activeTab, setActiveTab] = useState<'submit' | 'community' | 'my_feedback'>('submit')
  const [feedbackForm, setFeedbackForm] = useState<Partial<FeedbackForm>>({
    type: 'general',
    priority: 'medium',
    contactInfo: { email: '', allowContact: true },
    attachments: []
  })
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [communityFeedback] = useState<FeedbackItem[]>(mockFeedback)

  const categories = {
    bug: ['Login/Authentication', 'Courses', 'Assessments', 'Progress Tracking', 'Notifications', 'Other'],
    feature: ['Learning Experience', 'Social Features', 'Mobile App', 'Accessibility', 'Integration', 'Other'],
    improvement: ['User Interface', 'Performance', 'Content Quality', 'Progress Tracking', 'Gamification', 'Other'],
    general: ['Content', 'Platform', 'Support', 'Billing', 'Other']
  }

  const getStatusColor = (status: FeedbackItem['status']) => {
    switch (status) {
      case 'submitted': return 'bg-gray-100 text-gray-800'
      case 'in_review': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-red-100 text-red-800'
    }
  }

  const getPriorityColor = (priority: FeedbackForm['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600'
      case 'medium': return 'text-yellow-600'
      case 'low': return 'text-green-600'
    }
  }

  const getTypeIcon = (type: FeedbackForm['type']) => {
    switch (type) {
      case 'bug': return '🐛'
      case 'feature': return '💡'
      case 'improvement': return '⚡'
      case 'general': return '💬'
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    setSubmitSuccess(true)
    setTimeout(() => setSubmitSuccess(false), 5000)

    // Reset form
    setFeedbackForm({
      type: 'general',
      priority: 'medium',
      contactInfo: { email: '', allowContact: true },
      attachments: []
    })
  }

  const handleVote = (id: string) => {
    // Handle voting logic
    console.log('Voted for feedback:', id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] via-white to-[#2C857A]/10 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary-dark rounded-xl flex items-center justify-center">
              <span className="text-2xl">💭</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#1C3D6E]">Feedback & Support</h1>
              <p className="text-gray-600">Help us improve your learning experience</p>
            </div>
          </div>

          {/* Feedback Success Notification */}
          {submitSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✅</span>
                <div>
                  <p className="text-green-800 font-medium">Feedback Submitted Successfully!</p>
                  <p className="text-green-700 text-sm">
                    Thank you for your feedback. We'll review it and get back to you within 3-5 business days.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-white rounded-lg shadow-sm">
          {[
            { id: 'submit', label: 'Submit Feedback', icon: '📝' },
            { id: 'community', label: 'Community Feedback', icon: '👥' },
            { id: 'my_feedback', label: 'My Feedback', icon: '📋' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-colors flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-[#1C3D6E] text-white'
                  : 'text-gray-600 hover:text-[#1C3D6E] hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Submit Feedback Tab */}
        {activeTab === 'submit' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-[#1C3D6E] mb-6">Submit New Feedback</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Feedback Type */}
              <div>
                <label className="block text-sm font-medium text-[#1C3D6E] mb-3">Feedback Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['bug', 'feature', 'improvement', 'general'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFeedbackForm(prev => ({ ...prev, type, category: '' }))}
                      className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-colors capitalize ${
                        feedbackForm.type === type
                          ? 'border-[#4A9E3D] bg-[#4A9E3D]/5 text-[#4A9E3D]'
                          : 'border-gray-200 hover:border-[#3DAEDB] hover:bg-[#3DAEDB]/5'
                      }`}
                    >
                      <span>{getTypeIcon(type)}</span>
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              {feedbackForm.type && (
                <div>
                  <label className="block text-sm font-medium text-[#1C3D6E] mb-2">Category</label>
                  <select
                    value={feedbackForm.category || ''}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DAEDB] focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories[feedbackForm.type].map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-[#1C3D6E] mb-2">Title</label>
                <input
                  type="text"
                  value={feedbackForm.title || ''}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief description of your feedback"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DAEDB] focus:border-transparent"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-[#1C3D6E] mb-2">Description</label>
                <textarea
                  value={feedbackForm.description || ''}
                  onChange={(e) => setFeedbackForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Please provide detailed information about your feedback..."
                  rows={5}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DAEDB] focus:border-transparent"
                  required
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-[#1C3D6E] mb-3">Priority</label>
                <div className="flex gap-3">
                  {(['low', 'medium', 'high'] as const).map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      onClick={() => setFeedbackForm(prev => ({ ...prev, priority }))}
                      className={`px-4 py-2 rounded-lg border-2 transition-colors capitalize ${
                        feedbackForm.priority === priority
                          ? 'border-[#4A9E3D] bg-[#4A9E3D]/5 text-[#4A9E3D]'
                          : 'border-gray-200 hover:border-[#3DAEDB]'
                      }`}
                    >
                      <span className={getPriorityColor(priority)}>●</span> {priority}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-[#1C3D6E] mb-4">Contact Information (Optional)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1C3D6E] mb-2">Email</label>
                    <input
                      type="email"
                      value={feedbackForm.contactInfo?.email || ''}
                      onChange={(e) => setFeedbackForm(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo!, email: e.target.value }
                      }))}
                      placeholder="your.email@example.com"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DAEDB] focus:border-transparent"
                    />
                  </div>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={feedbackForm.contactInfo?.allowContact || false}
                      onChange={(e) => setFeedbackForm(prev => ({
                        ...prev,
                        contactInfo: { ...prev.contactInfo!, allowContact: e.target.checked }
                      }))}
                      className="rounded border-gray-300 focus:ring-[#3DAEDB]"
                    />
                    <span className="text-sm text-gray-700">
                      Allow us to contact you for follow-up questions
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Submit Feedback
                </button>
                <button
                  type="button"
                  onClick={() => setFeedbackForm({
                    type: 'general',
                    priority: 'medium',
                    contactInfo: { email: '', allowContact: true },
                    attachments: []
                  })}
                  className="px-6 py-3 border border-gray-300 text-gray-600 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Community Feedback Tab */}
        {activeTab === 'community' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#1C3D6E]">Community Feedback</h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span>📊</span>
                  <span>{communityFeedback.length} submissions</span>
                </div>
              </div>

              <div className="space-y-4">
                {communityFeedback.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{getTypeIcon(item.type)}</span>
                        <div>
                          <h3 className="font-bold text-[#1C3D6E]">{item.title}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="capitalize">{item.type}</span>
                            <span>•</span>
                            <span>{item.category}</span>
                            <span>•</span>
                            <span className={getPriorityColor(item.priority)}>
                              {item.priority} priority
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-gray-700 mb-4">{item.description}</p>

                    {item.response && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex items-start gap-2">
                          <span className="text-blue-600">💬</span>
                          <div>
                            <p className="text-blue-800 font-medium text-sm">Team Response</p>
                            <p className="text-blue-700 text-sm">{item.response}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>📅 {new Date(item.submittedDate).toLocaleDateString()}</span>
                        <span>🔄 Updated {new Date(item.lastUpdate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleVote(item.id)}
                          className={`flex items-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                            item.userVoted
                              ? 'bg-[#4A9E3D] text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-[#4A9E3D] hover:text-white'
                          }`}
                        >
                          <span>👍</span>
                          <span>{item.votes}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* My Feedback Tab */}
        {activeTab === 'my_feedback' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-[#1C3D6E] mb-6">My Submitted Feedback</h2>

            <div className="space-y-4">
              {mockFeedback.slice(0, 2).map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTypeIcon(item.type)}</span>
                      <div>
                        <h3 className="font-bold text-[#1C3D6E]">{item.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="capitalize">{item.type}</span>
                          <span>•</span>
                          <span>{item.category}</span>
                          <span>•</span>
                          <span>ID: {item.id}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4">{item.description}</p>

                  {item.response && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-2">
                        <span className="text-green-600">💬</span>
                        <div>
                          <p className="text-green-800 font-medium text-sm">Team Response</p>
                          <p className="text-green-700 text-sm">{item.response}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>📅 Submitted {new Date(item.submittedDate).toLocaleDateString()}</span>
                    <span>🔄 Last updated {new Date(item.lastUpdate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Feedback Tips */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <span className="text-blue-600">💡</span>
                <div>
                  <p className="text-blue-800 font-medium">Feedback Tips</p>
                  <p className="text-blue-700 text-sm">
                    • Be specific about the issue or suggestion<br/>
                    • Include steps to reproduce bugs<br/>
                    • Check community feedback to avoid duplicates<br/>
                    • Higher priority feedback gets faster review
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