import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  Target, 
  BookOpen, 
  TrendingUp,
  Lightbulb,
  Calendar,
  Award
} from 'lucide-react'

import { useCareerAssessment, type RoadmapPhase } from '../../hooks/useCareerAssessment'

interface Roadmap {
  id: string
  userId: string
  title: string
  description: string
  careerTitle: string
  matchScore: string
  phases: RoadmapPhase[]
  totalDuration: string
  status: 'active' | 'available' | 'completed'
  createdAt: string
  aiGenerated: boolean
}

const PersonalizedRoadmap = () => {
  const { careerPath } = useParams()
  const navigate = useNavigate()
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null)
  const [loading, setLoading] = useState(true)
  const [activePhase, setActivePhase] = useState(0)
  
  const { getUserRoadmaps, updateRoadmapProgress } = useCareerAssessment()

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        // Mock user ID - in real app, get from auth context
        const userId = '1'
        const roadmaps = await getUserRoadmaps(userId)
        
        // Find roadmap matching the career path
        const careerTitle = careerPath?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
        const matchingRoadmap = roadmaps.find((r: Roadmap) => 
          r.careerTitle.toLowerCase() === careerTitle?.toLowerCase()
        )
        
        if (matchingRoadmap) {
          setRoadmap(matchingRoadmap)
        } else {
          // Create a mock roadmap if none found
          setRoadmap(createMockRoadmap(careerTitle || 'Software Developer'))
        }
      } catch (error) {
        console.error('Error fetching roadmap:', error)
        setRoadmap(createMockRoadmap(careerPath?.replace(/-/g, ' ') || 'Software Developer'))
      } finally {
        setLoading(false)
      }
    }

    fetchRoadmap()
  }, [careerPath, getUserRoadmaps])

  const createMockRoadmap = (careerTitle: string): Roadmap => ({
    id: 'mock-1',
    userId: '1',
    title: `${careerTitle} Career Path`,
    description: `AI-generated personalized roadmap for ${careerTitle}`,
    careerTitle,
    matchScore: '92%',
    totalDuration: '12 months',
    status: 'active',
    createdAt: new Date().toISOString(),
    aiGenerated: true,
    phases: [
      {
        phase: 'Foundation',
        duration: '2-3 months',
        skills: ['HTML/CSS', 'JavaScript Basics', 'Git/Version Control'],
        milestones: ['Build first webpage', 'Complete JavaScript course', 'Create GitHub profile'],
        personalizedTips: ['Start with small projects to build confidence', 'Practice coding daily for consistency']
      },
      {
        phase: 'Intermediate',
        duration: '3-4 months',
        skills: ['React/Vue.js', 'Backend Basics', 'Database Fundamentals'],
        milestones: ['Build interactive web app', 'Create REST API', 'Deploy first project'],
        personalizedTips: ['Focus on understanding concepts over memorizing syntax']
      },
      {
        phase: 'Advanced',
        duration: '4-6 months',
        skills: ['Full-stack Development', 'Testing', 'DevOps Basics'],
        milestones: ['Complete full-stack project', 'Implement CI/CD', 'Contribute to open source'],
        personalizedTips: ['Start building a portfolio of diverse projects']
      },
      {
        phase: 'Professional',
        duration: '2-3 months',
        skills: ['System Design', 'Code Review', 'Team Collaboration'],
        milestones: ['Build portfolio', 'Practice interviews', 'Apply for positions'],
        personalizedTips: ['Network with other developers and attend tech meetups']
      }
    ]
  })

  const handleMilestoneToggle = async (phaseIndex: number, milestoneIndex: number) => {
    if (!roadmap) return

    const phase = roadmap.phases[phaseIndex]
    const milestone = phase.milestones[milestoneIndex]
    
    const currentProgress = phase.progress || { completed: false, completedMilestones: [], timeSpent: 0 }
    const isCompleted = currentProgress.completedMilestones.includes(milestone)
    
    let updatedMilestones
    if (isCompleted) {
      updatedMilestones = currentProgress.completedMilestones.filter(m => m !== milestone)
    } else {
      updatedMilestones = [...currentProgress.completedMilestones, milestone]
    }

    const newProgress = {
      ...currentProgress,
      completedMilestones: updatedMilestones,
      completed: updatedMilestones.length === phase.milestones.length
    }

    try {
      await updateRoadmapProgress(roadmap.id, phaseIndex, newProgress)
      
      // Update local state
      const updatedRoadmap = { ...roadmap }
      updatedRoadmap.phases[phaseIndex].progress = newProgress
      setRoadmap(updatedRoadmap)
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  const getPhaseProgress = (phase: RoadmapPhase) => {
    if (!phase.progress) return 0
    return Math.round((phase.progress.completedMilestones.length / phase.milestones.length) * 100)
  }

  const getOverallProgress = () => {
    if (!roadmap) return 0
    const totalMilestones = roadmap.phases.reduce((sum, phase) => sum + phase.milestones.length, 0)
    const completedMilestones = roadmap.phases.reduce((sum, phase) => {
      return sum + (phase.progress?.completedMilestones.length || 0)
    }, 0)
    return Math.round((completedMilestones / totalMilestones) * 100)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="flex">
          
          <div>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">Loading your personalized roadmap...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="flex">
          
          <div>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Roadmap Not Found</h1>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  We couldn't find a roadmap for this career path.
                </p>
                <button
                  onClick={() => navigate('/student/career/assessment')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Take Career Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex">
        
        <div>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Assessment Results
              </button>
              
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h1 className="text-3xl font-bold text-primary-dark dark:text-darkMode-link mr-4">
                        {roadmap.title}
                      </h1>
                      {roadmap.aiGenerated && (
                        <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
                          AI Generated
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{roadmap.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center">
                        <Target className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="font-semibold">Match Score:</span>
                        <span className="ml-1 text-blue-600">{roadmap.matchScore}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-green-600 mr-2" />
                        <span className="font-semibold">Duration:</span>
                        <span className="ml-1 text-green-600">{roadmap.totalDuration}</span>
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-purple-600 mr-2" />
                        <span className="font-semibold">Progress:</span>
                        <span className="ml-1 text-purple-600">{getOverallProgress()}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <div className="w-24 h-24 relative">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          className="text-gray-200 dark:text-gray-700"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 40}`}
                          strokeDashoffset={`${2 * Math.PI * 40 * (1 - getOverallProgress() / 100)}`}
                          className="text-blue-600 transition-all duration-300"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-xl font-bold text-primary-dark dark:text-darkMode-link">
                          {getOverallProgress()}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phase Navigation */}
            <div className="mb-8">
              <div className="flex flex-wrap gap-2">
                {roadmap.phases.map((phase, index) => (
                  <button
                    key={index}
                    onClick={() => setActivePhase(index)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      activePhase === index
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {phase.phase} ({getPhaseProgress(phase)}%)
                  </button>
                ))}
              </div>
            </div>

            {/* Active Phase Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Phase Overview */}
              <div className="lg:col-span-2">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-link">
                        {roadmap.phases[activePhase].phase} Phase
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        Duration: {roadmap.phases[activePhase].duration}
                      </p>
                    </div>
                  </div>

                  {/* Skills to Learn */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-primary-dark dark:text-darkMode-link mb-3">
                      Skills to Master
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {roadmap.phases[activePhase].skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Milestones */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-primary-dark dark:text-darkMode-link mb-3">
                      Milestones
                    </h3>
                    <div className="space-y-3">
                      {roadmap.phases[activePhase].milestones.map((milestone, index) => {
                        const isCompleted = roadmap.phases[activePhase].progress?.completedMilestones.includes(milestone) || false
                        return (
                          <div
                            key={index}
                            className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                            onClick={() => handleMilestoneToggle(activePhase, index)}
                          >
                            <CheckCircle
                              className={`w-5 h-5 mr-3 ${
                                isCompleted
                                  ? 'text-green-600'
                                  : 'text-gray-400'
                              }`}
                            />
                            <span
                              className={`flex-1 ${
                                isCompleted
                                  ? 'text-green-800 dark:text-green-200 line-through'
                                  : 'text-gray-700 dark:text-gray-300'
                              }`}
                            >
                              {milestone}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Personalized Tips */}
                  {roadmap.phases[activePhase].personalizedTips && (
                    <div>
                      <h3 className="text-lg font-semibold text-primary-dark dark:text-darkMode-link mb-3 flex items-center">
                        <Lightbulb className="w-5 h-5 mr-2" />
                        Personalized Tips
                      </h3>
                      <div className="space-y-2">
                        {roadmap.phases[activePhase].personalizedTips.map((tip, index) => (
                          <div key={index} className="flex items-start p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <p className="text-yellow-800 dark:text-yellow-200 text-sm">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Sidebar */}
              <div className="space-y-6">
                {/* Phase Progress */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                  <h3 className="text-lg font-semibold text-primary-dark dark:text-darkMode-link mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Phase Progress
                  </h3>
                  <div className="space-y-4">
                    {roadmap.phases.map((phase, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {phase.phase}
                        </span>
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getPhaseProgress(phase)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400 w-8">
                            {getPhaseProgress(phase)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                  <h3 className="text-lg font-semibold text-primary-dark dark:text-darkMode-link mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Find Courses
                    </button>
                    <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">
                      Join Study Group
                    </button>
                    <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                      Find Mentor
                    </button>
                  </div>
                </div>

                {/* Timeline */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                  <h3 className="text-lg font-semibold text-primary-dark dark:text-darkMode-link mb-4 flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Timeline
                  </h3>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p className="mb-2">Started: {new Date(roadmap.createdAt).toLocaleDateString()}</p>
                    <p>Estimated completion: {roadmap.totalDuration}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PersonalizedRoadmap