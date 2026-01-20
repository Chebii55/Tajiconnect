import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp,
  Target,
  Briefcase,
  AlertTriangle,
  BarChart3,
  BookOpen
} from 'lucide-react'
import CareerSidebar from '../CareerSidebar'

interface Skill {
  id: number
  name: string
  category: 'technical' | 'soft' | 'industry'
  currentLevel: number
  requiredLevel: number
  importance: 'high' | 'medium' | 'low'
  description: string
  resources: {
    type: 'course' | 'certification' | 'book' | 'practice'
    title: string
    provider: string
    duration: string
    cost: 'Free' | 'Paid' | 'Premium'
    link: string
  }[]
}

interface CareerProfile {
  title: string
  description: string
  matchPercentage: number
  skillsGap: number
  color: string
}

const SkillsGapAnalysis = () => {
  const navigate = useNavigate()
  const [selectedCareer, setSelectedCareer] = useState<string>('Software Developer')
  const [currentStep, setCurrentStep] = useState<'profile' | 'analysis' | 'plan'>('profile')
  const [skillsData, setSkillsData] = useState<Skill[]>([])

  const careerProfiles: CareerProfile[] = [
    {
      title: "Software Developer",
      description: "Full-stack web development with modern technologies",
      matchPercentage: 72,
      skillsGap: 28,
      color: "bg-blue-600"
    },
    {
      title: "Data Scientist",
      description: "Data analysis, machine learning, and statistical modeling",
      matchPercentage: 65,
      skillsGap: 35,
      color: "bg-green-600"
    },
    {
      title: "Digital Marketing Manager",
      description: "Digital campaigns, SEO, and marketing analytics",
      matchPercentage: 78,
      skillsGap: 22,
      color: "bg-purple-600"
    },
    {
      title: "UX/UI Designer",
      description: "User experience design and interface development",
      matchPercentage: 58,
      skillsGap: 42,
      color: "bg-orange-600"
    }
  ]

  const getSkillsForCareer = (career: string): Skill[] => {
    const skillsMap: { [key: string]: Skill[] } = {
      "Software Developer": [
        {
          id: 1,
          name: "JavaScript",
          category: 'technical',
          currentLevel: 3,
          requiredLevel: 4,
          importance: 'high',
          description: "Essential programming language for web development",
          resources: [
            {
              type: 'course',
              title: "JavaScript: The Complete Guide",
              provider: "Udemy",
              duration: "52 hours",
              cost: "Paid",
              link: "#"
            },
            {
              type: 'practice',
              title: "JavaScript30",
              provider: "Wes Bos",
              duration: "30 days",
              cost: "Free",
              link: "#"
            }
          ]
        },
        {
          id: 2,
          name: "React",
          category: 'technical',
          currentLevel: 2,
          requiredLevel: 4,
          importance: 'high',
          description: "Popular JavaScript library for building user interfaces",
          resources: [
            {
              type: 'course',
              title: "React - The Complete Guide",
              provider: "Udemy",
              duration: "48 hours",
              cost: "Paid",
              link: "#"
            },
            {
              type: 'practice',
              title: "React Projects",
              provider: "FreeCodeCamp",
              duration: "40 hours",
              cost: "Free",
              link: "#"
            }
          ]
        },
        {
          id: 3,
          name: "Problem Solving",
          category: 'soft',
          currentLevel: 4,
          requiredLevel: 5,
          importance: 'high',
          description: "Critical thinking and analytical problem-solving skills",
          resources: [
            {
              type: 'practice',
              title: "LeetCode Practice",
              provider: "LeetCode",
              duration: "Ongoing",
              cost: "Free",
              link: "#"
            },
            {
              type: 'book',
              title: "Cracking the Coding Interview",
              provider: "Gayle McDowell",
              duration: "Self-paced",
              cost: "Paid",
              link: "#"
            }
          ]
        },
        {
          id: 4,
          name: "Node.js",
          category: 'technical',
          currentLevel: 2,
          requiredLevel: 3,
          importance: 'medium',
          description: "JavaScript runtime for server-side development",
          resources: [
            {
              type: 'course',
              title: "Node.js Developer Course",
              provider: "The Complete Node.js Developer Course",
              duration: "35 hours",
              cost: "Paid",
              link: "#"
            }
          ]
        },
        {
          id: 5,
          name: "Team Collaboration",
          category: 'soft',
          currentLevel: 3,
          requiredLevel: 4,
          importance: 'medium',
          description: "Working effectively in development teams",
          resources: [
            {
              type: 'course',
              title: "Agile Software Development",
              provider: "Coursera",
              duration: "4 weeks",
              cost: "Free",
              link: "#"
            }
          ]
        }
      ],
      "Data Scientist": [
        {
          id: 1,
          name: "Python",
          category: 'technical',
          currentLevel: 2,
          requiredLevel: 4,
          importance: 'high',
          description: "Primary programming language for data science",
          resources: [
            {
              type: 'course',
              title: "Python for Data Science",
              provider: "DataCamp",
              duration: "4 weeks",
              cost: "Paid",
              link: "#"
            }
          ]
        },
        {
          id: 2,
          name: "Statistics",
          category: 'technical',
          currentLevel: 2,
          requiredLevel: 5,
          importance: 'high',
          description: "Statistical analysis and hypothesis testing",
          resources: [
            {
              type: 'course',
              title: "Statistics for Data Science",
              provider: "edX",
              duration: "8 weeks",
              cost: "Free",
              link: "#"
            }
          ]
        },
        {
          id: 3,
          name: "Machine Learning",
          category: 'technical',
          currentLevel: 1,
          requiredLevel: 4,
          importance: 'high',
          description: "ML algorithms and model development",
          resources: [
            {
              type: 'course',
              title: "Machine Learning Course",
              provider: "Andrew Ng - Coursera",
              duration: "11 weeks",
              cost: "Free",
              link: "#"
            }
          ]
        }
      ]
    }
    return skillsMap[career] || []
  }

  const handleCareerSelect = (career: string) => {
    setSelectedCareer(career)
    const skills = getSkillsForCareer(career)
    setSkillsData(skills)
    setCurrentStep('analysis')
  }

  const handleCreatePlan = () => {
    setCurrentStep('plan')
  }

  const getSkillGapLevel = (current: number, required: number) => {
    const gap = required - current
    if (gap <= 0) return { level: 'no-gap', color: 'text-[#4A9E3D]', bg: 'bg-[#4A9E3D]/20' }
    if (gap === 1) return { level: 'small-gap', color: 'text-[#2C857A]', bg: 'bg-[#2C857A]/20' }
    if (gap === 2) return { level: 'medium-gap', color: 'text-orange-600', bg: 'bg-orange-100' }
    return { level: 'large-gap', color: 'text-red-600', bg: 'bg-red-100' }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-orange-600 bg-orange-100'
      case 'low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 dark:text-gray-300 bg-gray-100'
    }
  }

  if (currentStep === 'profile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="flex">
          <CareerSidebar />
          <div className="flex-1 ml-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-primary-dark dark:text-darkMode-link mb-4">
                  Skills Gap Analysis
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-xl max-w-3xl mx-auto">
                  Identify the skills you need to develop to reach your career goals
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-0 p-8 mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-link mb-6 flex items-center">
                  <Target className="w-8 h-8 mr-3 text-primary-dark dark:text-darkMode-link" />
                  Select Your Target Career
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {careerProfiles.map((career) => (
                    <div
                      key={career.title}
                      className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-[#3DAEDB] cursor-pointer transition-all duration-300 group"
                      onClick={() => handleCareerSelect(career.title)}
                    >
                      <div className={`w-16 h-16 ${career.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Briefcase className="w-8 h-8 text-white" />
                      </div>

                      <h3 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-2 group-hover:text-[#0f2844] transition-colors">
                        {career.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-300 mb-4">{career.description}</p>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">Profile Match</p>
                          <p className="text-lg font-bold text-[#4A9E3D]">{career.matchPercentage}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Skills Gap</p>
                          <p className="text-lg font-bold text-orange-600">{career.skillsGap}%</p>
                        </div>
                      </div>

                      <button className="w-full mt-4 bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300">
                        Analyze Skills Gap →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 'analysis') {
    const highPrioritySkills = skillsData.filter(skill => skill.importance === 'high');
    const mediumPrioritySkills = skillsData.filter(skill => skill.importance === 'medium');

    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="flex">
          <CareerSidebar />
          <div className="flex-1 ml-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Header */}
              <div className="mb-8">
                <button
                  onClick={() => setCurrentStep('profile')}
                  className="flex items-center text-primary-dark dark:text-darkMode-link hover:text-[#0f2844] mb-4 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Career Selection
                </button>

                <div className="text-center">
                  <h1 className="text-4xl font-bold text-primary-dark dark:text-darkMode-link mb-4">
                    Skills Gap Analysis: {selectedCareer}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-xl max-w-3xl mx-auto">
                    Here's your personalized skills assessment and development roadmap
                  </p>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Total Skills</p>
                  <p className="text-3xl font-bold text-primary-dark dark:text-darkMode-link">{skillsData.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Skills with Gaps</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {skillsData.filter(s => s.currentLevel < s.requiredLevel).length}
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">High Priority</p>
                  <p className="text-3xl font-bold text-red-600">{highPrioritySkills.length}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1">Skills Mastered</p>
                  <p className="text-3xl font-bold text-[#4A9E3D]">
                    {skillsData.filter(s => s.currentLevel >= s.requiredLevel).length}
                  </p>
                </div>
              </div>

              {/* Skills Analysis */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  {/* High Priority Skills */}
                  {highPrioritySkills.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-0 p-8 mb-8">
                      <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-link mb-6 flex items-center">
                        <span className="text-3xl mr-3">🚨</span>
                        High Priority Skills
                      </h2>
                      <div className="space-y-6">
                        {highPrioritySkills.map((skill) => {
                          const gapInfo = getSkillGapLevel(skill.currentLevel, skill.requiredLevel)
                          return (
                            <div key={skill.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:border-[#3DAEDB] transition-all duration-300">
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                  <h3 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-2">{skill.name}</h3>
                                  <p className="text-gray-600 dark:text-gray-300 mb-3">{skill.description}</p>

                                  <div className="flex items-center space-x-4 mb-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getImportanceColor(skill.importance)}`}>
                                      {skill.importance.charAt(0).toUpperCase() + skill.importance.slice(1)} Priority
                                    </span>
                                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                                      {skill.category.charAt(0).toUpperCase() + skill.category.slice(1)}
                                    </span>
                                  </div>

                                  <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                      <span>Current Level: {skill.currentLevel}/5</span>
                                      <span>Required Level: {skill.requiredLevel}/5</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                      <div className="relative h-3 rounded-full bg-[#F2F2F2]">
                                        <div
                                          className="h-3 bg-blue-600 rounded-full"
                                          style={{ width: `${(skill.currentLevel / 5) * 100}%` }}
                                        ></div>
                                      </div>
                                    </div>
                                    <p className={`text-sm font-semibold ${gapInfo.color}`}>
                                      Gap: {skill.requiredLevel - skill.currentLevel} level{skill.requiredLevel - skill.currentLevel > 1 ? 's' : ''}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Medium Priority Skills */}
                  {mediumPrioritySkills.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-0 p-8 mb-8">
                      <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-link mb-6 flex items-center">
                        <AlertTriangle className="w-8 h-8 mr-3 text-primary-dark dark:text-darkMode-link" />
                        Medium Priority Skills
                      </h2>
                      <div className="space-y-4">
                        {mediumPrioritySkills.map((skill) => (
                          <div key={skill.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-[#3DAEDB] transition-all duration-300">
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-lg font-bold text-primary-dark dark:text-darkMode-link">{skill.name}</h3>
                              <span className="text-sm text-orange-600 font-semibold">
                                Gap: {skill.requiredLevel - skill.currentLevel} level{skill.requiredLevel - skill.currentLevel > 1 ? 's' : ''}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div className="relative h-2 rounded-full bg-[#F2F2F2]">
                                <div
                                  className="h-2 bg-blue-600 rounded-full"
                                  style={{ width: `${(skill.currentLevel / 5) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">{skill.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Action Plan */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-0 p-6">
                    <h3 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-4 flex items-center">
                      <span className="text-2xl mr-2">📋</span>
                      Action Plan
                    </h3>
                    <div className="space-y-4">
                      <button
                        onClick={handleCreatePlan}
                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Create Learning Plan
                      </button>
                      <button
                        onClick={() => navigate('/student/jobs/personalized')}
                        className="w-full border-2 border-[#4A9E3D] text-[#4A9E3D] hover:bg-[#4A9E3D] hover:text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
                      >
                        Find Matching Jobs
                      </button>
                      <button
                        onClick={() => navigate('/student/career/pathways')}
                        className="w-full border-2 border-[#2C857A] text-[#2C857A] hover:bg-[#2C857A] hover:text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300"
                      >
                        Explore Career Paths
                      </button>
                    </div>
                  </div>

                  {/* Skill Categories */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-0 p-6">
                    <h3 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-4 flex items-center">
                      <BarChart3 className="w-6 h-6 mr-2 text-primary-dark dark:text-darkMode-link" />
                      Skill Categories
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Technical Skills</span>
                        <span className="font-semibold text-primary-dark dark:text-darkMode-link">
                          {skillsData.filter(s => s.category === 'technical').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Soft Skills</span>
                        <span className="font-semibold text-primary-dark dark:text-darkMode-link">
                          {skillsData.filter(s => s.category === 'soft').length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">Industry Skills</span>
                        <span className="font-semibold text-primary-dark dark:text-darkMode-link">
                          {skillsData.filter(s => s.category === 'industry').length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Overview */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-0 p-6">
                    <h3 className="text-xl font-bold text-primary-dark dark:text-darkMode-link mb-4 flex items-center">
                      <Target className="w-6 h-6 mr-2 text-primary-dark dark:text-darkMode-link" />
                      Progress Overview
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-semibold text-primary-dark dark:text-darkMode-link">Overall Readiness</span>
                          <span className="font-bold text-[#333333]">
                            {Math.round((skillsData.reduce((acc, skill) => acc + skill.currentLevel, 0) /
                              skillsData.reduce((acc, skill) => acc + skill.requiredLevel, 0)) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-[#F2F2F2] rounded-full h-3 shadow-inner">
                          <div
                            className="bg-blue-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                            style={{
                              width: `${Math.round((skillsData.reduce((acc, skill) => acc + skill.currentLevel, 0) /
                                skillsData.reduce((acc, skill) => acc + skill.requiredLevel, 0)) * 100)}%`
                            }}
                          ></div>
                        </div>
                      </div>
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

  // Learning Plan Step
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex">
        <CareerSidebar />
        <div className="flex-1 ml-6">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <button
                onClick={() => setCurrentStep('analysis')}
                className="flex items-center text-primary-dark dark:text-darkMode-link hover:text-[#0f2844] mb-4 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Skills Analysis
              </button>

              <div className="text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <BookOpen className="w-12 h-12 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-primary-dark dark:text-darkMode-link mb-4">
                  Your Personalized Learning Plan
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-xl max-w-3xl mx-auto">
                  Curated resources to help you bridge your skills gap for {selectedCareer}
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {skillsData.filter(skill => skill.currentLevel < skill.requiredLevel).map((skill) => (
                <div key={skill.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-0 p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-link mb-2">{skill.name}</h2>
                      <p className="text-gray-600 dark:text-gray-300">{skill.description}</p>
                      <div className="flex items-center space-x-4 mt-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getImportanceColor(skill.importance)}`}>
                          {skill.importance.charAt(0).toUpperCase() + skill.importance.slice(1)} Priority
                        </span>
                        <span className="text-sm text-gray-500">
                          Gap: {skill.requiredLevel - skill.currentLevel} level{skill.requiredLevel - skill.currentLevel > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-primary-dark dark:text-darkMode-link mb-4">Recommended Learning Resources:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {skill.resources.map((resource, resourceIndex) => (
                      <div key={resourceIndex} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-[#3DAEDB] hover:bg-primary/5 transition-all duration-300">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-primary-dark dark:text-darkMode-link">{resource.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${resource.cost === 'Free' ? 'bg-[#4A9E3D]/20 text-[#4A9E3D]' :
                              resource.cost === 'Paid' ? 'bg-primary/20 text-primary-dark dark:text-darkMode-link' :
                                'bg-[#333333]/20 text-[#333333]'
                            }`}>
                            {resource.cost}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{resource.provider}</p>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span className="capitalize">{resource.type}</span>
                          <span>{resource.duration}</span>
                        </div>
                        <button className="w-full mt-3 bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm">
                          Start Learning →
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => navigate('/student/career')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                Return to Career Hub
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SkillsGapAnalysis