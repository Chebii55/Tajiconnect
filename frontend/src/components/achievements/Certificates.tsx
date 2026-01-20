import { useState } from 'react'
import { GraduationCap, PartyPopper, FileText, Award, CheckSquare, Rocket, Link, Mail, Briefcase, Smartphone, X, Plus, Shield } from 'lucide-react'

interface Certificate {
  id: string
  title: string
  issuer: string
  type: 'course_completion' | 'skill_mastery' | 'assessment' | 'project'
  earnedDate: string
  expiryDate?: string
  credentialId: string
  skillsValidated: string[]
  verificationUrl: string
  status: 'earned' | 'in_progress' | 'expired'
  progress?: number
  requirements?: string[]
  shareCount: number
  downloadCount: number
}

interface DigitalBadge {
  id: string
  name: string
  description: string
  issuer: string
  image: string
  earnedDate: string
  skills: string[]
  verificationUrl: string
  blockchain: boolean
  shareUrl: string
}

const mockCertificates: Certificate[] = [
  {
    id: '1',
    title: 'Python Programming Fundamentals',
    issuer: 'TajiConnect Academy',
    type: 'course_completion',
    earnedDate: '2025-01-10',
    credentialId: 'TC-PY-2025-001547',
    skillsValidated: ['Python Basics', 'Data Types', 'Control Structures', 'Functions'],
    verificationUrl: 'https://verify.tajiconnect.com/certificates/TC-PY-2025-001547',
    status: 'earned',
    shareCount: 12,
    downloadCount: 3
  },
  {
    id: '2',
    title: 'Data Analysis Expert',
    issuer: 'TajiConnect Academy',
    type: 'skill_mastery',
    earnedDate: '2025-01-08',
    expiryDate: '2026-01-08',
    credentialId: 'TC-DA-2025-000892',
    skillsValidated: ['Data Visualization', 'Statistical Analysis', 'Excel Advanced', 'SQL Queries'],
    verificationUrl: 'https://verify.tajiconnect.com/certificates/TC-DA-2025-000892',
    status: 'earned',
    shareCount: 25,
    downloadCount: 8
  },
  {
    id: '3',
    title: 'Web Development Bootcamp',
    issuer: 'TajiConnect Academy',
    type: 'course_completion',
    earnedDate: '',
    credentialId: '',
    skillsValidated: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js'],
    verificationUrl: '',
    status: 'in_progress',
    progress: 65,
    requirements: [
      'Complete HTML & CSS modules',
      'Build 3 JavaScript projects',
      'Pass React assessment (80%+)',
      'Deploy final project'
    ],
    shareCount: 0,
    downloadCount: 0
  },
  {
    id: '4',
    title: 'Career Readiness Assessment',
    issuer: 'Industry Partners',
    type: 'assessment',
    earnedDate: '2024-12-15',
    expiryDate: '2025-12-15',
    credentialId: 'IP-CRA-2024-003421',
    skillsValidated: ['Communication', 'Problem Solving', 'Teamwork', 'Time Management'],
    verificationUrl: 'https://verify.industrypartners.com/IP-CRA-2024-003421',
    status: 'expired',
    shareCount: 5,
    downloadCount: 2
  }
]

const mockDigitalBadges: DigitalBadge[] = [
  {
    id: '1',
    name: 'Python Developer',
    description: 'Demonstrated proficiency in Python programming language',
    issuer: 'TajiConnect Academy',
    image: 'python',
    earnedDate: '2025-01-10',
    skills: ['Python', 'OOP', 'Data Structures'],
    verificationUrl: 'https://verify.tajiconnect.com/badges/py-dev-001547',
    blockchain: true,
    shareUrl: 'https://badge.tajiconnect.com/share/py-dev-001547'
  },
  {
    id: '2',
    name: 'Data Analyst',
    description: 'Skilled in data analysis and visualization techniques',
    issuer: 'TajiConnect Academy',
    image: 'chart',
    earnedDate: '2025-01-08',
    skills: ['Data Analysis', 'Visualization', 'Statistics'],
    verificationUrl: 'https://verify.tajiconnect.com/badges/da-001892',
    blockchain: true,
    shareUrl: 'https://badge.tajiconnect.com/share/da-001892'
  },
  {
    id: '3',
    name: 'Problem Solver',
    description: 'Excellence in analytical thinking and problem resolution',
    issuer: 'Industry Partners',
    image: 'brain',
    earnedDate: '2024-12-15',
    skills: ['Critical Thinking', 'Analysis', 'Solution Design'],
    verificationUrl: 'https://verify.industrypartners.com/badges/ps-003421',
    blockchain: false,
    shareUrl: 'https://badge.industrypartners.com/share/ps-003421'
  }
]

export default function Certificates() {
  const [activeTab, setActiveTab] = useState<'certificates' | 'badges' | 'wallet'>('certificates')
  const [statusFilter, setStatusFilter] = useState<'all' | 'earned' | 'in_progress' | 'expired'>('all')
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)
  const [showShareModal, setShowShareModal] = useState(false)

  const getStatusColor = (status: Certificate['status']) => {
    switch (status) {
      case 'earned': return 'bg-green-100 text-green-800 dark:bg-darkMode-success/20 dark:text-darkMode-success'
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-info/20 dark:text-info'
      case 'expired': return 'bg-red-100 text-red-800 dark:bg-error/20 dark:text-error'
    }
  }

  const getTypeIcon = (type: Certificate['type']) => {
    switch (type) {
      case 'course_completion': return <FileText className="w-6 h-6" />
      case 'skill_mastery': return <Award className="w-6 h-6" />
      case 'assessment': return <CheckSquare className="w-6 h-6" />
      case 'project': return <Rocket className="w-6 h-6" />
    }
  }

  const filteredCertificates = mockCertificates.filter(cert =>
    statusFilter === 'all' || cert.status === statusFilter
  )

  const earnedCount = mockCertificates.filter(c => c.status === 'earned').length
  const inProgressCount = mockCertificates.filter(c => c.status === 'in_progress').length
  const totalShares = mockCertificates.reduce((sum, c) => sum + c.shareCount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-darkMode-bg dark:via-darkMode-surface dark:to-darkMode-bg p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary-dark rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-dark dark:text-darkMode-text">Certificates & Credentials</h1>
              <p className="text-gray-600 dark:text-darkMode-textSecondary">Showcase your achievements and verified skills</p>
            </div>
          </div>

          {/* New Certificate Notification */}
          <div className="bg-green-50 dark:bg-darkMode-success/10 border border-green-200 dark:border-darkMode-success/30 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <PartyPopper className="w-5 h-5 text-green-600 dark:text-darkMode-success" />
              <div>
                <p className="text-green-800 dark:text-darkMode-success font-medium">New Certificate Earned!</p>
                <p className="text-green-700 dark:text-darkMode-textSecondary text-sm">
                  You've just earned the "Python Programming Fundamentals" certificate. Add it to your professional profile!
                </p>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-secondary dark:text-darkMode-success">{earnedCount}</div>
              <div className="text-sm text-gray-600 dark:text-darkMode-textSecondary">Certificates Earned</div>
            </div>
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-primary-light dark:text-darkMode-link">{mockDigitalBadges.length}</div>
              <div className="text-sm text-gray-600 dark:text-darkMode-textSecondary">Digital Badges</div>
            </div>
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-forest-sage dark:text-darkMode-progress">{inProgressCount}</div>
              <div className="text-sm text-gray-600 dark:text-darkMode-textSecondary">In Progress</div>
            </div>
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-primary-dark dark:text-darkMode-text">{totalShares}</div>
              <div className="text-sm text-gray-600 dark:text-darkMode-textSecondary">Total Shares</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-white dark:bg-darkMode-surface rounded-lg shadow-sm">
          {[
            { id: 'certificates', label: 'Certificates', icon: <FileText className="w-4 h-4" /> },
            { id: 'badges', label: 'Digital Badges', icon: <Award className="w-4 h-4" /> },
            { id: 'wallet', label: 'Credential Wallet', icon: <Briefcase className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-colors flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-primary-dark text-white'
                  : 'text-gray-600 dark:text-darkMode-textSecondary hover:text-primary-dark dark:hover:text-darkMode-text hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Certificates Tab */}
        {activeTab === 'certificates' && (
          <div>
            {/* Status Filters */}
            <div className="flex gap-2 mb-6">
              {['all', 'earned', 'in_progress', 'expired'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as typeof statusFilter)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                    statusFilter === status
                      ? 'bg-primary-light text-white dark:bg-darkMode-accent dark:text-darkMode-bg'
                      : 'text-gray-600 dark:text-darkMode-textSecondary hover:text-primary-dark dark:hover:text-darkMode-text bg-white dark:bg-darkMode-surface'
                  }`}
                >
                  {status.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Certificates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCertificates.map((certificate) => (
                <div
                  key={certificate.id}
                  className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => setSelectedCertificate(certificate)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-primary-dark dark:text-darkMode-text">{getTypeIcon(certificate.type)}</div>
                        <div>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(certificate.status)}`}>
                            {certificate.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      {certificate.status === 'earned' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedCertificate(certificate)
                            setShowShareModal(true)
                          }}
                          className="text-primary-light hover:text-primary-dark dark:text-darkMode-link dark:hover:text-darkMode-text transition-colors"
                        >
                          <Link className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <h3 className="font-bold text-primary-dark dark:text-darkMode-text text-lg mb-2">{certificate.title}</h3>
                    <p className="text-gray-600 dark:text-darkMode-textSecondary text-sm mb-3">Issued by {certificate.issuer}</p>

                    {certificate.status === 'earned' && (
                      <div className="space-y-2 text-sm text-gray-500 dark:text-darkMode-textMuted mb-4">
                        <div className="flex justify-between">
                          <span>Earned:</span>
                          <span>{new Date(certificate.earnedDate).toLocaleDateString()}</span>
                        </div>
                        {certificate.expiryDate && (
                          <div className="flex justify-between">
                            <span>Expires:</span>
                            <span>{new Date(certificate.expiryDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>ID:</span>
                          <span className="font-mono text-xs">{certificate.credentialId}</span>
                        </div>
                      </div>
                    )}

                    {certificate.status === 'in_progress' && certificate.progress && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-darkMode-textSecondary mb-2">
                          <span>Progress</span>
                          <span>{certificate.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-darkMode-border rounded-full h-2">
                          <div
                            className="bg-primary dark:bg-darkMode-progress h-2 rounded-full"
                            style={{ width: `${certificate.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <p className="text-xs text-gray-500 dark:text-darkMode-textMuted mb-2">Skills Validated:</p>
                      <div className="flex flex-wrap gap-1">
                        {certificate.skillsValidated.slice(0, 3).map((skill, index) => (
                          <span key={index} className="text-xs bg-primary-light/10 dark:bg-darkMode-link/20 text-primary-dark dark:text-darkMode-link px-2 py-1 rounded-full">
                            {skill}
                          </span>
                        ))}
                        {certificate.skillsValidated.length > 3 && (
                          <span className="text-xs bg-gray-100 dark:bg-darkMode-surfaceHover text-gray-600 dark:text-darkMode-textSecondary px-2 py-1 rounded-full">
                            +{certificate.skillsValidated.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {certificate.status === 'earned' ? (
                      <div className="flex gap-2">
                        <button className="btn-primary flex-1">
                          Download
                        </button>
                        <button className="px-4 py-2 border border-primary-light dark:border-darkMode-link text-primary-light dark:text-darkMode-link rounded-lg hover:bg-primary-light dark:hover:bg-darkMode-link hover:text-white dark:hover:text-darkMode-bg transition-colors">
                          Verify
                        </button>
                      </div>
                    ) : certificate.status === 'in_progress' ? (
                      <button className="w-full bg-secondary dark:bg-darkMode-success text-white py-2 px-4 rounded-lg font-medium hover:bg-success-dark dark:hover:bg-darkMode-successLight transition-colors">
                        Continue Learning
                      </button>
                    ) : (
                      <button className="w-full bg-gray-300 dark:bg-darkMode-surfaceHover text-gray-600 dark:text-darkMode-textSecondary py-2 px-4 rounded-lg font-medium">
                        Renew Certificate
                      </button>
                    )}

                    {certificate.status === 'earned' && (
                      <div className="flex justify-between text-xs text-gray-500 dark:text-darkMode-textMuted mt-2">
                        <span>{certificate.shareCount} shares</span>
                        <span>{certificate.downloadCount} downloads</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Digital Badges Tab */}
        {activeTab === 'badges' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockDigitalBadges.map((badge) => (
              <div key={badge.id} className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6 text-center">
                <div className="text-6xl mb-4 flex justify-center text-primary-dark dark:text-darkMode-text">
                  {badge.image === 'python' && <FileText className="w-16 h-16" />}
                  {badge.image === 'chart' && <Award className="w-16 h-16" />}
                  {badge.image === 'brain' && <CheckSquare className="w-16 h-16" />}
                </div>
                <h3 className="font-bold text-primary-dark dark:text-darkMode-text text-lg mb-2">{badge.name}</h3>
                <p className="text-gray-600 dark:text-darkMode-textSecondary text-sm mb-3">{badge.description}</p>
                <p className="text-xs text-gray-500 dark:text-darkMode-textMuted mb-4">Issued by {badge.issuer}</p>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 dark:text-darkMode-textMuted mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {badge.skills.map((skill, index) => (
                      <span key={index} className="text-xs bg-secondary/10 dark:bg-darkMode-success/20 text-secondary dark:text-darkMode-success px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-gray-500 dark:text-darkMode-textMuted mb-4">
                  <div className="flex justify-between">
                    <span>Earned:</span>
                    <span>{new Date(badge.earnedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Blockchain:</span>
                    <span className={badge.blockchain ? 'text-secondary dark:text-darkMode-success' : 'text-gray-400 dark:text-darkMode-textMuted'}>
                      {badge.blockchain ? <span className="flex items-center gap-1"><CheckSquare className="w-3 h-3" /> Verified</span> : <span className="flex items-center gap-1"><X className="w-3 h-3" /> Not verified</span>}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button className="btn-primary w-full">
                    Share Badge
                  </button>
                  <button className="w-full border border-secondary dark:border-darkMode-success text-secondary dark:text-darkMode-success py-2 px-4 rounded-lg font-medium hover:bg-secondary dark:hover:bg-darkMode-success hover:text-white dark:hover:text-darkMode-bg transition-colors">
                    Verify
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Credential Wallet Tab */}
        {activeTab === 'wallet' && (
          <div className="space-y-8">
            {/* Wallet Overview */}
            <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-text mb-6">Digital Credential Wallet</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-secondary/10 dark:bg-darkMode-success/10 rounded-lg">
                  <div className="text-3xl font-bold text-secondary dark:text-darkMode-success">{earnedCount + mockDigitalBadges.length}</div>
                  <div className="text-sm text-gray-600 dark:text-darkMode-textSecondary">Total Credentials</div>
                </div>
                <div className="text-center p-4 bg-primary-light/10 dark:bg-darkMode-link/10 rounded-lg">
                  <div className="text-3xl font-bold text-primary-light dark:text-darkMode-link">
                    {mockDigitalBadges.filter(b => b.blockchain).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-darkMode-textSecondary">Blockchain Verified</div>
                </div>
                <div className="text-center p-4 bg-primary-dark/10 dark:bg-darkMode-text/10 rounded-lg">
                  <div className="text-3xl font-bold text-primary-dark dark:text-darkMode-text">100%</div>
                  <div className="text-sm text-gray-600 dark:text-darkMode-textSecondary">Verification Rate</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-primary-dark dark:text-darkMode-text mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-darkMode-border rounded-lg hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover transition-colors">
                  <FileText className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium text-primary-dark dark:text-darkMode-text">Export All</div>
                    <div className="text-xs text-gray-500 dark:text-darkMode-textMuted">Download portfolio</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-darkMode-border rounded-lg hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover transition-colors">
                  <Link className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium text-primary-dark dark:text-darkMode-text">Share Profile</div>
                    <div className="text-xs text-gray-500 dark:text-darkMode-textMuted">Public link</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-darkMode-border rounded-lg hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover transition-colors">
                  <Briefcase className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium text-primary-dark dark:text-darkMode-text">LinkedIn</div>
                    <div className="text-xs text-gray-500 dark:text-darkMode-textMuted">Add to profile</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-4 border border-gray-200 dark:border-darkMode-border rounded-lg hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover transition-colors">
                  <Mail className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium text-primary-dark dark:text-darkMode-text">Email</div>
                    <div className="text-xs text-gray-500 dark:text-darkMode-textMuted">Send to employer</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-primary-dark dark:text-darkMode-text mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-darkMode-success/10 rounded-lg">
                  <Plus className="w-5 h-5 text-green-600 dark:text-darkMode-success" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary-dark dark:text-darkMode-text">New certificate earned</p>
                    <p className="text-xs text-gray-600 dark:text-darkMode-textSecondary">Python Programming Fundamentals - 2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-info/10 rounded-lg">
                  <Link className="w-5 h-5 text-blue-600 dark:text-info" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary-dark dark:text-darkMode-text">Certificate shared</p>
                    <p className="text-xs text-gray-600 dark:text-darkMode-textSecondary">Data Analysis Expert shared on LinkedIn - 5 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                  <CheckSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-primary-dark dark:text-darkMode-text">Badge verified</p>
                    <p className="text-xs text-gray-600 dark:text-darkMode-textSecondary">Python Developer badge blockchain verified - 1 week ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Feedback */}
            <div className="bg-blue-50 dark:bg-info/10 border border-blue-200 dark:border-info/30 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-blue-600 dark:text-info" />
                <div>
                  <p className="text-blue-800 dark:text-info font-medium">Credential Security</p>
                  <p className="text-blue-700 dark:text-darkMode-textSecondary text-sm">
                    All your credentials are cryptographically signed and can be verified independently. Share them with confidence!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && selectedCertificate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-darkMode-surface rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold text-primary-dark dark:text-darkMode-text mb-4">Share Certificate</h3>
              <div className="text-center mb-6">
                <div className="mb-2 flex justify-center text-primary-dark dark:text-darkMode-text">{getTypeIcon(selectedCertificate.type)}</div>
                <h4 className="font-bold text-primary-dark dark:text-darkMode-text">{selectedCertificate.title}</h4>
                <p className="text-sm text-gray-600 dark:text-darkMode-textSecondary">{selectedCertificate.issuer}</p>
              </div>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-3 p-3 border border-gray-200 dark:border-darkMode-border rounded-lg hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>Share via Email</span>
                </button>
                <button className="w-full flex items-center justify-center gap-3 p-3 border border-gray-200 dark:border-darkMode-border rounded-lg hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover transition-colors">
                  <Link className="w-4 h-4" />
                  <span>Copy Verification Link</span>
                </button>
                <button className="w-full flex items-center justify-center gap-3 p-3 border border-gray-200 dark:border-darkMode-border rounded-lg hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover transition-colors">
                  <Briefcase className="w-4 h-4" />
                  <span>Add to LinkedIn</span>
                </button>
                <button className="w-full flex items-center justify-center gap-3 p-3 border border-gray-200 dark:border-darkMode-border rounded-lg hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover transition-colors">
                  <Smartphone className="w-4 h-4" />
                  <span>Share on Social Media</span>
                </button>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 border border-gray-300 dark:border-darkMode-border text-gray-600 dark:text-darkMode-textSecondary py-2 px-4 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 bg-primary-dark dark:bg-darkMode-accent text-white dark:text-darkMode-bg py-2 px-4 rounded-lg font-medium hover:bg-primary dark:hover:bg-darkMode-accentHover transition-colors"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Certificate Detail Modal */}
        {selectedCertificate && !showShareModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-darkMode-surface rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="text-primary-dark dark:text-darkMode-text">{getTypeIcon(selectedCertificate.type)}</div>
                  <div>
                    <h3 className="text-xl font-bold text-primary-dark dark:text-darkMode-text">{selectedCertificate.title}</h3>
                    <p className="text-gray-600 dark:text-darkMode-textSecondary">Issued by {selectedCertificate.issuer}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="text-gray-500 dark:text-darkMode-textMuted hover:text-gray-700 dark:hover:text-darkMode-text"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {selectedCertificate.status === 'earned' && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-darkMode-textSecondary">Earned Date</label>
                    <p className="font-medium dark:text-darkMode-text">{new Date(selectedCertificate.earnedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-darkMode-textSecondary">Credential ID</label>
                    <p className="font-mono text-sm dark:text-darkMode-text">{selectedCertificate.credentialId}</p>
                  </div>
                  {selectedCertificate.expiryDate && (
                    <div>
                      <label className="text-sm text-gray-600 dark:text-darkMode-textSecondary">Expiry Date</label>
                      <p className="font-medium dark:text-darkMode-text">{new Date(selectedCertificate.expiryDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-gray-600 dark:text-darkMode-textSecondary">Verification URL</label>
                    <a
                      href={selectedCertificate.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-light hover:text-primary-dark dark:text-darkMode-link dark:hover:text-darkMode-text text-sm underline block"
                    >
                      Verify Certificate
                    </a>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="text-sm text-gray-600 dark:text-darkMode-textSecondary block mb-2">Skills Validated</label>
                <div className="flex flex-wrap gap-2">
                  {selectedCertificate.skillsValidated.map((skill, index) => (
                    <span key={index} className="bg-secondary/10 dark:bg-darkMode-success/20 text-secondary dark:text-darkMode-success px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {selectedCertificate.requirements && (
                <div className="mb-6">
                  <label className="text-sm text-gray-600 dark:text-darkMode-textSecondary block mb-2">Requirements</label>
                  <ul className="space-y-1">
                    {selectedCertificate.requirements.map((req, index) => (
                      <li key={index} className="text-sm text-gray-700 dark:text-darkMode-textSecondary flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-secondary dark:text-darkMode-success" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="flex-1 border border-gray-300 dark:border-darkMode-border text-gray-600 dark:text-darkMode-textSecondary py-2 px-4 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-darkMode-surfaceHover transition-colors"
                >
                  Close
                </button>
                {selectedCertificate.status === 'earned' && (
                  <>
                    <button className="flex-1 bg-secondary dark:bg-darkMode-success text-white py-2 px-4 rounded-lg font-medium hover:bg-success-dark dark:hover:bg-darkMode-successLight transition-colors">
                      Download PDF
                    </button>
                    <button
                      onClick={() => setShowShareModal(true)}
                      className="btn-primary flex-1"
                    >
                      Share
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
