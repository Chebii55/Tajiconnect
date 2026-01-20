import { useState } from 'react'
import { Globe, Heart, Brain, Users, Lightbulb, Shield, Target, TrendingUp, Award } from 'lucide-react'

// TFDN Evidence-Based Assessment Framework
interface TFDNAssessment {
  id: string
  name: string
  type: 'sel_core' | 'gced_foundation' | 'trauma_screening' | 'resilience' | 'empathy' | 'critical_thinking' | 'cultural_competence' | 'leadership_potential'
  description: string
  duration: string
  questions: number
  status: 'not_taken' | 'in_progress' | 'completed'
  score?: number
  hrbaAlignment: number // How well this supports HRBA principles (0-100)
  cbcLevel?: 'JSS' | 'Senior' // Competency-Based Curriculum level
  lastTaken?: string
  developmentAreas: string[]
  communityImpactPotential: string[]
  evidenceBase: string // Research foundation
}

// TFDN Psychometric Profile aligned with GCED & SEL
interface TFDNProfile {
  globalCitizenshipLevel: 'Emerging' | 'Developing' | 'Proficient' | 'Advanced'
  selCompetencies: {
    selfAwareness: number
    selfManagement: number
    socialAwareness: number
    relationshipSkills: number
    responsibleDecisionMaking: number
  }
  hrbaIndicators: {
    participation: number
    accountability: number
    nonDiscrimination: number
    empowerment: number
  }
  culturalCompetenceIndex: number
  resilienceScore: number
  empathyIndex: number
  criticalThinkingLevel: number
  leadershipPotential: number
  traumaInformedNeeds: {
    safety: boolean
    trustworthiness: boolean
    peerSupport: boolean
    collaboration: boolean
    empowerment: boolean
    culturalHumility: boolean
  }
  communityEngagementReadiness: number
  careerPathways: string[]
  recommendedInterventions: string[]
}

// TFDN Evidence-Based Assessments aligned with research frameworks
const tfdhAssessments: TFDNAssessment[] = [
  {
    id: 'sel_core',
    name: 'SEL Core Competencies Assessment',
    type: 'sel_core',
    description: 'Evidence-based assessment of social-emotional learning competencies using CASEL framework adapted for Kenyan context.',
    duration: '25 minutes',
    questions: 50,
    status: 'completed',
    score: 88,
    hrbaAlignment: 95,
    cbcLevel: 'JSS',
    lastTaken: '2025-01-10',
    developmentAreas: [
      'Self-awareness through cultural identity exploration',
      'Emotion regulation in challenging circumstances',
      'Empathy development across cultural differences',
      'Responsible decision-making for community benefit'
    ],
    communityImpactPotential: [
      'Peer mentoring and support programs',
      'Conflict resolution in school settings',
      'Community organizing for youth issues',
      'Cross-cultural bridge building'
    ],
    evidenceBase: 'CASEL SEL Framework, adapted for East African contexts (Weare & Nind, 2011)'
  },
  {
    id: 'gced_foundation',
    name: 'Global Citizenship Readiness Index',
    type: 'gced_foundation',
    description: 'UNESCO GCED framework assessment measuring critical thinking, empathy, and action orientation for social justice.',
    duration: '30 minutes',
    questions: 45,
    status: 'completed',
    score: 92,
    hrbaAlignment: 98,
    cbcLevel: 'Senior',
    lastTaken: '2025-01-08',
    developmentAreas: [
      'Critical analysis of global power structures',
      'Local-to-global issue connections',
      'Advocacy strategy development',
      'Intercultural communication skills'
    ],
    communityImpactPotential: [
      'Policy advocacy and civic engagement',
      'Community education and awareness',
      'Social justice campaign leadership',
      'International collaboration projects'
    ],
    evidenceBase: 'UNESCO GCED Topics and Learning Objectives (2015), Oxfam Education for Global Citizenship'
  },
  {
    id: 'trauma_screening',
    name: 'Trauma-Informed Resilience Assessment',
    type: 'trauma_screening',
    description: 'Culturally sensitive screening for trauma exposure and resilience factors, following Kenya Children\'s Act 2022 guidelines.',
    duration: '20 minutes',
    questions: 35,
    status: 'completed',
    score: 76,
    hrbaAlignment: 100,
    cbcLevel: 'JSS',
    lastTaken: '2025-01-05',
    developmentAreas: [
      'Building safety and trust networks',
      'Developing healthy coping strategies',
      'Strengthening family and community connections',
      'Processing trauma through culturally appropriate methods'
    ],
    communityImpactPotential: [
      'Peer support and healing circles',
      'Community trauma awareness education',
      'Advocacy for child protection services',
      'Family strengthening program participation'
    ],
    evidenceBase: 'SAMHSA Trauma-Informed Care, adapted for Kenyan cultural contexts'
  },
  {
    id: 'empathy_index',
    name: 'Empathy Development Tracker',
    type: 'empathy',
    description: 'Measures cognitive and affective empathy development, crucial for GCED and community impact.',
    duration: '15 minutes',
    questions: 30,
    status: 'in_progress',
    hrbaAlignment: 90,
    cbcLevel: 'JSS',
    developmentAreas: [],
    communityImpactPotential: [],
    evidenceBase: 'Davis Interpersonal Reactivity Index, culturally adapted'
  },
  {
    id: 'critical_thinking',
    name: 'Critical Thinking for Social Justice',
    type: 'critical_thinking',
    description: 'Assesses ability to analyze social issues, question assumptions, and develop solutions for community challenges.',
    duration: '35 minutes',
    questions: 40,
    status: 'not_taken',
    hrbaAlignment: 95,
    cbcLevel: 'Senior',
    developmentAreas: [],
    communityImpactPotential: [],
    evidenceBase: 'Critical Thinking Assessment Test, adapted for social justice contexts'
  },
  {
    id: 'cultural_competence',
    name: 'Cultural Competence & Inclusion Scale',
    type: 'cultural_competence',
    description: 'Evaluates ability to work effectively across cultural differences and promote inclusion.',
    duration: '25 minutes',
    questions: 42,
    status: 'not_taken',
    hrbaAlignment: 100,
    cbcLevel: 'Senior',
    developmentAreas: [],
    communityImpactPotential: [],
    evidenceBase: 'Intercultural Development Inventory, adapted for East African contexts'
  }
]

// TFDN Evidence-Based Profile aligned with GCED, SEL, and HRBA
const tfdhProfile: TFDNProfile = {
  globalCitizenshipLevel: 'Proficient',
  selCompetencies: {
    selfAwareness: 88,
    selfManagement: 82,
    socialAwareness: 94,
    relationshipSkills: 90,
    responsibleDecisionMaking: 85
  },
  hrbaIndicators: {
    participation: 92, // Active engagement in learning and community
    accountability: 78, // Understanding of rights and responsibilities
    nonDiscrimination: 95, // Inclusive attitudes and behaviors
    empowerment: 87 // Agency and leadership potential
  },
  culturalCompetenceIndex: 89,
  resilienceScore: 84,
  empathyIndex: 94,
  criticalThinkingLevel: 81,
  leadershipPotential: 88,
  traumaInformedNeeds: {
    safety: true,
    trustworthiness: true,
    peerSupport: true,
    collaboration: true,
    empowerment: true,
    culturalHumility: true
  },
  communityEngagementReadiness: 91,
  careerPathways: [
    'Community Development Officer',
    'Human Rights Advocate',
    'Social Enterprise Leader',
    'Inclusive Education Specialist',
    'Policy Research Analyst',
    'Youth Empowerment Coordinator'
  ],
  recommendedInterventions: [
    'Advanced leadership development programming',
    'Policy advocacy skills training',
    'Trauma-informed peer support training',
    'Community organizing mentorship'
  ]
}

export default function PsychometricDashboard() {
  const [assessments] = useState<TFDNAssessment[]>(tfdhAssessments)
  const [profile] = useState<TFDNProfile>(tfdhProfile)
  const [activeTab, setActiveTab] = useState<'overview' | 'tests' | 'profile' | 'insights'>('overview')

  const getStatusColor = (status: TFDNAssessment['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
      case 'not_taken': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const getTypeIcon = (type: TFDNAssessment['type']) => {
    switch (type) {
      case 'sel_core': return <Heart className="w-6 h-6" />
      case 'gced_foundation': return <Globe className="w-6 h-6" />
      case 'trauma_screening': return <Shield className="w-6 h-6" />
      case 'empathy': return <Users className="w-6 h-6" />
      case 'critical_thinking': return <Lightbulb className="w-6 h-6" />
      case 'cultural_competence': return <Target className="w-6 h-6" />
      case 'resilience': return <TrendingUp className="w-6 h-6" />
      case 'leadership_potential': return <Award className="w-6 h-6" />
      default: return <Brain className="w-6 h-6" />
    }
  }

  const getTypeColor = (type: TFDNAssessment['type']) => {
    switch (type) {
      case 'sel_core': return 'bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-700'
      case 'gced_foundation': return 'bg-blue-100 border-blue-300 dark:bg-blue-900/30 dark:border-blue-700'
      case 'trauma_screening': return 'bg-purple-100 border-purple-300 dark:bg-purple-900/30 dark:border-purple-700'
      case 'empathy': return 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700'
      case 'critical_thinking': return 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/30 dark:border-yellow-700'
      case 'cultural_competence': return 'bg-teal-100 border-teal-300 dark:bg-teal-900/30 dark:border-teal-700'
      case 'resilience': return 'bg-orange-100 border-orange-300 dark:bg-orange-900/30 dark:border-orange-700'
      case 'leadership_potential': return 'bg-indigo-100 border-indigo-300 dark:bg-indigo-900/30 dark:border-indigo-700'
      default: return 'bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600'
    }
  }

  const completedAssessments = assessments.filter(a => a.status === 'completed')
  const avgHRBAAlignment = completedAssessments.reduce((sum, a) => sum + a.hrbaAlignment, 0) / completedAssessments.length || 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-[#1C3D6E] rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary-dark dark:text-darkMode-link font-heading">TFDN Assessment Center</h1>
              <p className="text-gray-600 dark:text-gray-300">Evidence-based assessments for Global Citizenship & Social-Emotional Learning</p>
              <p className="text-sm text-secondary font-medium mt-1">
                🌍 Building holistic profiles for positive community impact
              </p>
            </div>
          </div>

          {/* TFDN Insight Notification */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-blue-800 font-medium">TFDN Profile Insight</p>
                <p className="text-blue-700 text-sm">
                  Your assessment profile shows strong potential for {profile.globalCitizenshipLevel.toLowerCase()} global citizenship with high empathy and community engagement readiness.
                </p>
              </div>
            </div>
          </div>

          {/* TFDN Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-secondary">{completedAssessments.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Assessments Complete</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-primary">{Math.round(avgHRBAAlignment)}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">HRBA Alignment</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-forest-sage">{profile.communityEngagementReadiness}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Community Readiness</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 text-center">
              <div className="text-2xl font-bold text-primary-dark dark:text-darkMode-link">{profile.careerPathways.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Career Pathways</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'tests', label: 'Assessments', icon: '🧪' },
            { id: 'profile', label: 'TFDN Profile', icon: '🌍' },
            { id: 'insights', label: 'Development', icon: '🌱' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-3 rounded-md font-medium transition-colors flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-[#1C3D6E] text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:text-primary-dark dark:text-darkMode-link hover:bg-gray-50'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Global Citizenship Profile */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-4">Global Citizenship Profile</h2>
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-[#1C3D6E] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-primary-dark dark:text-darkMode-link mb-2">{profile.globalCitizenshipLevel}</h3>
                <p className="text-gray-600 dark:text-gray-300">Global Citizenship Development Level</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-primary-dark dark:text-darkMode-link font-medium">Empathy Index</span>
                  <span className="text-blue-600 font-bold">{profile.empathyIndex}/100</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-primary-dark dark:text-darkMode-link font-medium">Resilience Score</span>
                  <span className="text-green-600 font-bold">{profile.resilienceScore}/100</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-primary-dark dark:text-darkMode-link font-medium">Cultural Competence</span>
                  <span className="text-purple-600 font-bold">{profile.culturalCompetenceIndex}/100</span>
                </div>
              </div>
            </div>

            {/* SEL Competencies */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-4">SEL Competencies</h2>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-primary-dark dark:text-darkMode-link font-medium">Social-Emotional Learning</span>
                </div>
              </div>

              <h3 className="font-bold text-primary-dark dark:text-darkMode-link mb-3">CASEL Framework Scores</h3>
              <div className="space-y-3">
                {Object.entries(profile.selCompetencies).map(([competency, score]) => (
                  <div key={competency}>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                      <span className="capitalize">{competency.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span>{score}/100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#4A9E3D] h-2 rounded-full"
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="font-bold text-primary-dark dark:text-darkMode-link mb-3">HRBA Indicators</h3>
                <div className="space-y-3">
                  {Object.entries(profile.hrbaIndicators).map(([indicator, score]) => (
                    <div key={indicator}>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                        <span className="capitalize">{indicator}</span>
                        <span>{score}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* TFDN Career Pathways */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 lg:col-span-2">
              <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-4">TFDN-Aligned Career Pathways</h2>
              <p className="text-gray-600 mb-6">Career paths aligned with your GCED competencies and community impact potential</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profile.careerPathways.map((career, index) => (
                  <div key={index} className="text-center p-4 bg-[#2C857A]/10 rounded-lg hover:bg-[#2C857A]/20 transition-colors cursor-pointer border border-[#2C857A]/20">
                    <div className="text-2xl mb-2">🌍</div>
                    <h3 className="font-semibold text-primary-dark dark:text-darkMode-link text-sm">{career}</h3>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-bold text-primary-dark mb-2">Trauma-Informed Care Needs</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(profile.traumaInformedNeeds).map(([need, met]) => (
                    <span key={need} className={`px-3 py-1 rounded-full text-xs font-medium ${
                      met ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {met ? '✓' : '⚠'} {need.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Assessments Tab */}
        {activeTab === 'tests' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map((assessment) => (
              <div key={assessment.id} className={`rounded-xl p-6 border-2 transition-all hover:shadow-lg ${getTypeColor(assessment.type)}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      {getTypeIcon(assessment.type)}
                    </div>
                    <div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assessment.status)}`}>
                        {assessment.status.replace('_', ' ')}
                      </span>
                      {assessment.cbcLevel && (
                        <span className="block text-xs text-gray-500 mt-1">CBC: {assessment.cbcLevel}</span>
                      )}
                    </div>
                  </div>
                  {assessment.score && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-secondary">{assessment.score}%</div>
                      <div className="text-xs text-primary">HRBA: {assessment.hrbaAlignment}%</div>
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-primary-dark dark:text-darkMode-link text-lg mb-2">{assessment.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{assessment.description}</p>

                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span>{assessment.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Questions:</span>
                    <span>{assessment.questions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>HRBA Alignment:</span>
                    <span className="text-primary font-medium">{assessment.hrbaAlignment}%</span>
                  </div>
                  {assessment.lastTaken && (
                    <div className="flex justify-between">
                      <span>Last taken:</span>
                      <span>{new Date(assessment.lastTaken).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">Evidence Base:</div>
                  <div className="text-xs text-forest-sage font-medium">{assessment.evidenceBase}</div>
                </div>

                {assessment.status === 'completed' ? (
                  <div className="space-y-2">
                    <button className="w-full bg-[#4A9E3D] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#4A9E3D]/90 transition-colors">
                      View TFDN Report
                    </button>
                    <button className="w-full border border-[#1C3D6E] text-primary-dark dark:text-darkMode-link py-2 px-4 rounded-lg font-medium hover:bg-[#1C3D6E] hover:text-white transition-colors">
                      Retake Assessment
                    </button>
                  </div>
                ) : assessment.status === 'in_progress' ? (
                  <button className="w-full bg-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-[#1C3D6E] transition-colors">
                    Continue Assessment
                  </button>
                ) : (
                  <button className="w-full bg-[#1C3D6E] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#2A4F7C] transition-colors">
                    Begin Assessment
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TFDN Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-6">Complete TFDN Assessment Profile</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-primary-dark dark:text-darkMode-link mb-4">Development Areas</h3>
                  <div className="space-y-3">
                    {completedAssessments.filter(a => a.developmentAreas.length > 0).map((assessment) => (
                      <div key={assessment.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-primary-dark dark:text-darkMode-link mb-2">{assessment.name}</h4>
                        <ul className="space-y-1">
                          {assessment.developmentAreas.map((area, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-secondary mt-1">•</span>
                              <span>{area}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-primary-dark dark:text-darkMode-link mb-4">Community Impact Potential</h3>
                  <div className="space-y-3">
                    {completedAssessments.filter(a => a.communityImpactPotential.length > 0).map((assessment) => (
                      <div key={assessment.id} className="border border-gray-200 rounded-lg p-4">
                        <h4 className="font-semibold text-primary-dark dark:text-darkMode-link mb-2">{assessment.name}</h4>
                        <ul className="space-y-1">
                          {assessment.communityImpactPotential.map((potential, index) => (
                            <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                              <span className="text-forest-sage mt-1">✓</span>
                              <span>{potential}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* TFDN Recommended Interventions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-primary-dark dark:text-darkMode-link mb-4">Recommended TFDN Interventions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.recommendedInterventions.map((intervention, index) => (
                  <div key={index} className="p-4 bg-[#4A9E3D]/10 rounded-lg border border-[#4A9E3D]/20">
                    <span className="text-secondary font-medium">{intervention}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Development Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-6">TFDN Development Insights</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Global Citizenship
                  </h3>
                  <p className="text-blue-700 text-sm mb-3">
                    Your {profile.globalCitizenshipLevel.toLowerCase()} level shows strong awareness of global issues and local-to-global connections. You demonstrate {profile.hrbaIndicators.participation}% participation readiness.
                  </p>
                  <div className="text-xs text-blue-600">
                    Based on UNESCO GCED Framework Assessment
                  </div>
                </div>

                <div className="bg-red-50 rounded-lg p-6">
                  <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Social-Emotional Learning
                  </h3>
                  <p className="text-red-700 text-sm mb-3">
                    Strong SEL competencies with {profile.empathyIndex}% empathy index and {profile.selCompetencies.socialAwareness}% social awareness. Excellent foundation for community leadership.
                  </p>
                  <div className="text-xs text-red-600">
                    Based on CASEL SEL Framework Assessment
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Trauma-Informed Care
                  </h3>
                  <p className="text-purple-700 text-sm mb-3">
                    Assessment indicates {profile.resilienceScore}% resilience score with strong safety and support networks. All trauma-informed care needs are currently met.
                  </p>
                  <div className="text-xs text-purple-600">
                    Based on SAMHSA Trauma-Informed Care Framework
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Community Impact
                  </h3>
                  <p className="text-green-700 text-sm mb-3">
                    {profile.communityEngagementReadiness}% community readiness with {profile.leadershipPotential}% leadership potential. Ready for advanced advocacy and organizing roles.
                  </p>
                  <div className="text-xs text-green-600">
                    Based on Community Engagement Assessment
                  </div>
                </div>
              </div>
            </div>

            {/* TFDN Development Plan */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-6">Personalized TFDN Development Plan</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-[#4A9E3D]/10 rounded-lg">
                  <span className="text-2xl">🌱</span>
                  <div>
                    <h3 className="font-bold text-primary-dark dark:text-darkMode-link mb-2">SEL Competency Growth</h3>
                    <p className="text-gray-700 text-sm">
                      Focus on strengthening responsible decision-making skills (currently {profile.selCompetencies.responsibleDecisionMaking}%) through community-based scenarios and ethical dilemma discussions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-primary/10 rounded-lg">
                  <span className="text-2xl">🌍</span>
                  <div>
                    <h3 className="font-bold text-primary-dark dark:text-darkMode-link mb-2">Global Citizenship Advancement</h3>
                    <p className="text-gray-700 text-sm">
                      Advance to expert level through critical thinking enhancement (currently {profile.criticalThinkingLevel}%) and policy advocacy training.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-[#2C857A]/10 rounded-lg">
                  <span className="text-2xl">🤝</span>
                  <div>
                    <h3 className="font-bold text-primary-dark dark:text-darkMode-link mb-2">Community Leadership</h3>
                    <p className="text-gray-700 text-sm">
                      Your high community engagement readiness ({profile.communityEngagementReadiness}%) positions you for peer mentoring and community organizing roles.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-purple-50 rounded-lg">
                  <span className="text-2xl">🚪</span>
                  <div>
                    <h3 className="font-bold text-primary-dark dark:text-darkMode-link mb-2">Career Pathway Preparation</h3>
                    <p className="text-gray-700 text-sm">
                      Based on your profile, pursue internships or shadowing in {profile.careerPathways[0]} or {profile.careerPathways[1]} to apply your competencies in real-world settings.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment Recommendations */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-blue-800 font-medium">Complete Your TFDN Assessment Profile</p>
                  <p className="text-blue-700 text-sm">
                    Take the remaining evidence-based assessments to unlock advanced HRBA indicators and specialized career pathway recommendations.
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