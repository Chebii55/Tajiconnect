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
      case 'earned': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'expired': return 'bg-red-100 text-red-800'
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
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] via-white to-[#2C857A]/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary-dark rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB]">Certificates & Credentials</h1>
              <p className="text-gray-600 dark:text-gray-300">Showcase your achievements and verified skills</p>
            </div>
          </div>

          {/* New Certificate Notification */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <PartyPopper className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-green-800 font-medium">New Certificate Earned!</p>
                <p className="text-green-700 text-sm">
                  You've just earned the "Python Programming Fundamentals" certificate. Add it to your professional profile!
                </p>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-[#4A9E3D]">{earnedCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Certificates Earned</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-[#3DAEDB]">{mockDigitalBadges.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Digital Badges</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-[#2C857A]">{inProgressCount}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">In Progress</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB]">{totalShares}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Shares</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
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
                  ? 'bg-[#1C3D6E] text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-[#1C3D6E] dark:text-[#3DAEDB] hover:bg-gray-50'
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
                      ? 'bg-[#3DAEDB] text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:text-[#1C3D6E] dark:text-[#3DAEDB] bg-white'
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
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-0 hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => setSelectedCertificate(certificate)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-[#1C3D6E] dark:text-[#3DAEDB]">{getTypeIcon(certificate.type)}</div>
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
                          className="text-[#3DAEDB] hover:text-[#1C3D6E] dark:text-[#3DAEDB] transition-colors"
                        >
                          <Link className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <h3 className="font-bold text-[#1C3D6E] dark:text-[#3DAEDB] text-lg mb-2">{certificate.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">Issued by {certificate.issuer}</p>

                    {certificate.status === 'earned' && (
                      <div className="space-y-2 text-sm text-gray-500 mb-4">
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
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                          <span>Progress</span>
                          <span>{certificate.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${certificate.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-2">Skills Validated:</p>
                      <div className="flex flex-wrap gap-1">
                        {certificate.skillsValidated.slice(0, 3).map((skill, index) => (
                          <span key={index} className="text-xs bg-[#3DAEDB]/10 text-[#1C3D6E] dark:text-[#3DAEDB] px-2 py-1 rounded-full">
                            {skill}
                          </span>
                        ))}
                        {certificate.skillsValidated.length > 3 && (
                          <span className="text-xs bg-gray-100 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
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
                        <button className="px-4 py-2 border border-[#3DAEDB] text-[#3DAEDB] rounded-lg hover:bg-[#3DAEDB] hover:text-white transition-colors">
                          Verify
                        </button>
                      </div>
                    ) : certificate.status === 'in_progress' ? (
                      <button className="w-full bg-[#4A9E3D] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#2F6B29] transition-colors">
                        Continue Learning
                      </button>
                    ) : (
                      <button className="w-full bg-gray-300 text-gray-600 dark:text-gray-300 py-2 px-4 rounded-lg font-medium">
                        Renew Certificate
                      </button>
                    )}

                    {certificate.status === 'earned' && (
                      <div className="flex justify-between text-xs text-gray-500 mt-2">
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
              <div key={badge.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
                <div className="text-6xl mb-4 flex justify-center text-[#1C3D6E] dark:text-[#3DAEDB]">
                  {badge.image === 'python' && <FileText className="w-16 h-16" />}
                  {badge.image === 'chart' && <Award className="w-16 h-16" />}
                  {badge.image === 'brain' && <CheckSquare className="w-16 h-16" />}
                </div>
                <h3 className="font-bold text-[#1C3D6E] dark:text-[#3DAEDB] text-lg mb-2">{badge.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{badge.description}</p>
                <p className="text-xs text-gray-500 mb-4">Issued by {badge.issuer}</p>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-2">Skills:</p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {badge.skills.map((skill, index) => (
                      <span key={index} className="text-xs bg-[#4A9E3D]/10 text-[#4A9E3D] px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-gray-500 mb-4">
                  <div className="flex justify-between">
                    <span>Earned:</span>
                    <span>{new Date(badge.earnedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Blockchain:</span>
                    <span className={badge.blockchain ? 'text-[#4A9E3D]' : 'text-gray-400'}>
                      {badge.blockchain ? <span className="flex items-center gap-1"><CheckSquare className="w-3 h-3" /> Verified</span> : <span className="flex items-center gap-1"><X className="w-3 h-3" /> Not verified</span>}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button className="btn-primary w-full">
                    Share Badge
                  </button>
                  <button className="w-full border border-[#4A9E3D] text-[#4A9E3D] py-2 px-4 rounded-lg font-medium hover:bg-[#4A9E3D] hover:text-white transition-colors">
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-6">Digital Credential Wallet</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-[#4A9E3D]/10 rounded-lg">
                  <div className="text-3xl font-bold text-[#4A9E3D]">{earnedCount + mockDigitalBadges.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Total Credentials</div>
                </div>
                <div className="text-center p-4 bg-[#3DAEDB]/10 rounded-lg">
                  <div className="text-3xl font-bold text-[#3DAEDB]">
                    {mockDigitalBadges.filter(b => b.blockchain).length}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Blockchain Verified</div>
                </div>
                <div className="text-center p-4 bg-[#1C3D6E]/10 rounded-lg">
                  <div className="text-3xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB]">100%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Verification Rate</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <FileText className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium text-[#1C3D6E] dark:text-[#3DAEDB]">Export All</div>
                    <div className="text-xs text-gray-500">Download portfolio</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Link className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium text-[#1C3D6E] dark:text-[#3DAEDB]">Share Profile</div>
                    <div className="text-xs text-gray-500">Public link</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Briefcase className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium text-[#1C3D6E] dark:text-[#3DAEDB]">LinkedIn</div>
                    <div className="text-xs text-gray-500">Add to profile</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Mail className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium text-[#1C3D6E] dark:text-[#3DAEDB]">Email</div>
                    <div className="text-xs text-gray-500">Send to employer</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Plus className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1C3D6E] dark:text-[#3DAEDB]">New certificate earned</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Python Programming Fundamentals - 2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Link className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1C3D6E] dark:text-[#3DAEDB]">Certificate shared</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Data Analysis Expert shared on LinkedIn - 5 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <CheckSquare className="w-5 h-5 text-purple-600" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1C3D6E] dark:text-[#3DAEDB]">Badge verified</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Python Developer badge blockchain verified - 1 week ago</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Feedback */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-blue-800 font-medium">Credential Security</p>
                  <p className="text-blue-700 text-sm">
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
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-4">Share Certificate</h3>
              <div className="text-center mb-6">
                <div className="mb-2 flex justify-center text-[#1C3D6E] dark:text-[#3DAEDB]">{getTypeIcon(selectedCertificate.type)}</div>
                <h4 className="font-bold text-[#1C3D6E] dark:text-[#3DAEDB]">{selectedCertificate.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{selectedCertificate.issuer}</p>
              </div>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>Share via Email</span>
                </button>
                <button className="w-full flex items-center justify-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Link className="w-4 h-4" />
                  <span>Copy Verification Link</span>
                </button>
                <button className="w-full flex items-center justify-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Briefcase className="w-4 h-4" />
                  <span>Add to LinkedIn</span>
                </button>
                <button className="w-full flex items-center justify-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Smartphone className="w-4 h-4" />
                  <span>Share on Social Media</span>
                </button>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 border border-gray-300 text-gray-600 dark:text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 bg-[#1C3D6E] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#1C3D6E]/90 transition-colors"
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
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="text-[#1C3D6E] dark:text-[#3DAEDB]">{getTypeIcon(selectedCertificate.type)}</div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB]">{selectedCertificate.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">Issued by {selectedCertificate.issuer}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {selectedCertificate.status === 'earned' && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300">Earned Date</label>
                    <p className="font-medium">{new Date(selectedCertificate.earnedDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300">Credential ID</label>
                    <p className="font-mono text-sm">{selectedCertificate.credentialId}</p>
                  </div>
                  {selectedCertificate.expiryDate && (
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-300">Expiry Date</label>
                      <p className="font-medium">{new Date(selectedCertificate.expiryDate).toLocaleDateString()}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-300">Verification URL</label>
                    <a
                      href={selectedCertificate.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#3DAEDB] hover:text-[#1C3D6E] dark:text-[#3DAEDB] text-sm underline block"
                    >
                      Verify Certificate
                    </a>
                  </div>
                </div>
              )}

              <div className="mb-6">
                <label className="text-sm text-gray-600 dark:text-gray-300 block mb-2">Skills Validated</label>
                <div className="flex flex-wrap gap-2">
                  {selectedCertificate.skillsValidated.map((skill, index) => (
                    <span key={index} className="bg-[#4A9E3D]/10 text-[#4A9E3D] px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {selectedCertificate.requirements && (
                <div className="mb-6">
                  <label className="text-sm text-gray-600 dark:text-gray-300 block mb-2">Requirements</label>
                  <ul className="space-y-1">
                    {selectedCertificate.requirements.map((req, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-[#4A9E3D]" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="flex-1 border border-gray-300 text-gray-600 dark:text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                {selectedCertificate.status === 'earned' && (
                  <>
                    <button className="flex-1 bg-[#4A9E3D] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#2F6B29] transition-colors">
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