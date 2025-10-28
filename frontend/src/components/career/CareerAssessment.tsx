import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Target, Brain, Loader2 } from 'lucide-react'
import CareerSidebar from '../CareerSidebar'
import { useCareerAssessment, type AssessmentAnswers, type CareerRecommendation } from '../../hooks/useCareerAssessment'
import { useCareerPaths } from '../../hooks/useCareerPaths'

interface AssessmentQuestion {
  id: number
  question: string
  type: 'multiple-choice' | 'scale' | 'checkbox'
  options?: string[]
  scaleLabel?: { min: string; max: string }
  category: 'interests' | 'skills' | 'values' | 'personality'
}

const CareerAssessment = () => {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<AssessmentAnswers>({})
  const [showResults, setShowResults] = useState(false)
  const [aiRecommendations, setAiRecommendations] = useState<CareerRecommendation[]>([])
  const [fallbackRecommendations, setFallbackRecommendations] = useState<CareerRecommendation[]>([])
  
  const { loading, submitAssessment } = useCareerAssessment()
  const { careerPaths } = useCareerPaths()
  
  // Mock user profile - in real app, this would come from auth context
  const userProfile = {
    id: '1',
    age: 20,
    education: { level: 'High school' },
    isPWD: false
  }

  const questions: AssessmentQuestion[] = [
    // Interests
    {
      id: 1,
      question: "Which type of work environment appeals to you most?",
      type: "multiple-choice",
      options: ["Corporate office", "Remote/flexible", "Field work", "Laboratory/research", "Creative studio"],
      category: "interests"
    },
    {
      id: 2,
      question: "How much do you enjoy working with technology?",
      type: "scale",
      scaleLabel: { min: "Not at all", max: "Love it" },
      category: "interests"
    },
    {
      id: 3,
      question: "Which activities interest you? (Select all that apply)",
      type: "checkbox",
      options: ["Problem solving", "Creative design", "Teaching others", "Data analysis", "Leading teams", "Helping people"],
      category: "interests"
    },

    // Skills
    {
      id: 4,
      question: "Rate your communication skills",
      type: "scale",
      scaleLabel: { min: "Need improvement", max: "Excellent" },
      category: "skills"
    },
    {
      id: 5,
      question: "Which technical skills do you have? (Select all that apply)",
      type: "checkbox",
      options: ["Programming", "Data analysis", "Digital marketing", "Graphic design", "Project management", "Financial analysis"],
      category: "skills"
    },
    {
      id: 6,
      question: "How comfortable are you with public speaking?",
      type: "scale",
      scaleLabel: { min: "Very uncomfortable", max: "Very comfortable" },
      category: "skills"
    },

    // Values
    {
      id: 7,
      question: "What's most important to you in a career?",
      type: "multiple-choice",
      options: ["High salary", "Work-life balance", "Career growth", "Making an impact", "Job security"],
      category: "values"
    },
    {
      id: 8,
      question: "How important is salary to you?",
      type: "scale",
      scaleLabel: { min: "Not important", max: "Very important" },
      category: "values"
    },

    // Personality
    {
      id: 9,
      question: "Do you prefer working independently or in teams?",
      type: "multiple-choice",
      options: ["Independently", "Small teams", "Large teams", "Mix of both", "Leadership role"],
      category: "personality"
    },
    {
      id: 10,
      question: "How do you handle stress and pressure?",
      type: "scale",
      scaleLabel: { min: "Struggle", max: "Thrive under pressure" },
      category: "personality"
    }
  ]

  const handleAnswer = async (answer: string | number | string[]) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: answer }
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Submit to AI assessment
      try {
        const result = await submitAssessment(userProfile.id, newAnswers, userProfile)
        setAiRecommendations(result.recommendations)
        setShowResults(true)
      } catch (err) {
        console.error('Assessment submission failed:', err)
        // Fallback to server recommendations
        const serverRecommendations = getCareerRecommendations()
        setFallbackRecommendations(serverRecommendations)
        setShowResults(true)
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const getCareerRecommendations = (): CareerRecommendation[] => {
    // Use career paths from the hook
    if (careerPaths.length > 0) {
      return careerPaths.slice(0, 3).map((career, index) => ({
        title: career.title,
        match: `${90 - index * 5}%`, // Mock match scores
        description: career.description,
        requiredSkills: Array.isArray(career.skills) ? career.skills : [],
        salaryRange: career.averageSalary || "KSh 80,000 - 150,000",
        growth: career.jobGrowth ? `${career.jobGrowth} growth` : "Growing field",
        color: ['bg-blue-600', 'bg-green-600', 'bg-purple-600'][index] || 'bg-gray-600',
        personalizedRoadmap: []
      }))
    }

    // Ultimate fallback if no career paths available
    return [
      {
        title: "Software Developer",
        match: "92%",
        description: "Design and develop software applications",
        requiredSkills: ["Programming", "Problem solving", "Technical analysis"],
        salaryRange: "KSh 100,000 - 200,000",
        growth: "High demand",
        color: "bg-blue-600",
        personalizedRoadmap: []
      }
    ]
  }

  const resetAssessment = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setAiRecommendations([])
    setFallbackRecommendations([])
  }

  if (showResults) {
    const recommendations = aiRecommendations.length > 0 ? aiRecommendations : fallbackRecommendations

    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] via-white to-[#2C857A]/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="flex">
          <CareerSidebar />
          <div className="flex-1 ml-6">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-4">
                  AI Career Assessment Complete!
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-xl max-w-3xl mx-auto">
                  {aiRecommendations.length > 0 
                    ? "Our AI analyzed your responses and generated personalized career paths with custom roadmaps"
                    : "Based on your responses, here are career recommendations from our database"
                  }
                </p>
                <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full">
                  {aiRecommendations.length > 0 ? (
                    <div className="bg-green-100 dark:bg-green-900 px-4 py-2 rounded-full">
                      <Brain className="w-4 h-4 text-green-600 dark:text-green-400 mr-2 inline" />
                      <span className="text-green-800 dark:text-green-200 text-sm font-medium">
                        Powered by AI • Personalized roadmaps generated
                      </span>
                    </div>
                  ) : (
                    <div className="bg-blue-100 dark:bg-blue-900 px-4 py-2 rounded-full">
                      <Target className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2 inline" />
                      <span className="text-blue-800 dark:text-blue-200 text-sm font-medium">
                        Server recommendations • Take assessment again for AI analysis
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6 mb-8">
                {recommendations.length === 0 ? (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-0 p-8 text-center">
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-600 dark:text-gray-400 mb-2">
                      No Recommendations Available
                    </h3>
                    <p className="text-gray-500 dark:text-gray-500 mb-4">
                      We're having trouble generating career recommendations right now.
                    </p>
                    <button
                      onClick={resetAssessment}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  recommendations.map((career, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-0 p-6 hover:shadow-2xl transition-all duration-300">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <h3 className="text-2xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mr-4">{career.title}</h3>
                          <span className={`px-4 py-2 rounded-full text-white font-bold ${career.color}`}>
                            {career.match} Match
                          </span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{career.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-semibold text-[#1C3D6E] dark:text-[#3DAEDB]">Key Skills:</span>
                            <p className="text-gray-600 dark:text-gray-300">{career.requiredSkills?.join(", ") || "N/A"}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-[#4A9E3D]">Salary Range:</span>
                            <p className="text-gray-600 dark:text-gray-300">{career.salaryRange || "N/A"}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-[#2C857A]">Market Outlook:</span>
                            <p className="text-gray-600 dark:text-gray-300">{career.growth || "N/A"}</p>
                          </div>
                        </div>
                        {career.personalizedRoadmap && career.personalizedRoadmap.length > 0 && (
                          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <h4 className="font-semibold text-[#1C3D6E] dark:text-[#3DAEDB] mb-2">
                              🗺️ Personalized Learning Roadmap ({career.personalizedRoadmap.length} phases)
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {career.personalizedRoadmap.slice(0, 3).map((phase, idx) => (
                                <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-xs">
                                  {phase.phase} ({phase.duration})
                                </span>
                              ))}
                              {career.personalizedRoadmap.length > 3 && (
                                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                                  +{career.personalizedRoadmap.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col gap-2">
                        <button
                          onClick={() => navigate(`/student/career/pathways?career=${encodeURIComponent(career.title)}`)}
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold w-full lg:w-auto"
                        >
                          Explore Career Path
                        </button>
                        {career.personalizedRoadmap && career.personalizedRoadmap.length > 0 && (
                          <button
                            onClick={() => navigate(`/student/roadmap/${career.title.replace(/\s+/g, '-').toLowerCase()}`)}
                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium w-full lg:w-auto text-sm"
                          >
                            View Roadmap
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  ))
                )}
              </div>

              {recommendations.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={resetAssessment}
                    className="py-3 px-6 border-2 border-[#1C3D6E] text-[#1C3D6E] dark:text-[#3DAEDB] hover:bg-[#1C3D6E] hover:text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
                  >
                    Retake Assessment
                  </button>
                  <button
                    onClick={() => navigate('/student/jobs/personalized')}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    View Matching Jobs
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state during AI processing
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] via-white to-[#2C857A]/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="flex">
          <CareerSidebar />
          <div className="flex-1 ml-6">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                </div>
                <h1 className="text-4xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-4">
                  AI is Analyzing Your Responses...
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-xl max-w-3xl mx-auto mb-8">
                  Our AI is generating personalized career recommendations and custom learning roadmaps just for you
                </p>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md mx-auto">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse mr-3"></div>
                      <span className="text-gray-700 dark:text-gray-300">Analyzing your interests and skills...</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-green-600 rounded-full animate-pulse mr-3" style={{ animationDelay: '0.5s' }}></div>
                      <span className="text-gray-700 dark:text-gray-300">Matching with career opportunities...</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-purple-600 rounded-full animate-pulse mr-3" style={{ animationDelay: '1s' }}></div>
                      <span className="text-gray-700 dark:text-gray-300">Creating personalized roadmaps...</span>
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

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] via-white to-[#2C857A]/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex">
        <CareerSidebar />
        <div className="flex-1 ml-6">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl">🧭</span>
              </div>
              <h1 className="text-4xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-3">
                Career Assessment
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
                Answer these questions to discover careers that match your interests, skills, and values
              </p>

              {/* Progress Bar */}
              <div className="mt-8">
                <div className="w-full bg-[#F2F2F2] rounded-full h-3 shadow-inner">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-center text-sm font-medium text-[#2C857A] mt-3">
                  Question {currentQuestion + 1} of {questions.length}
                </p>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-0 p-8 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-8 text-center leading-relaxed">
                {currentQ.question}
              </h2>

              <div className="space-y-4">
                {/* Multiple Choice */}
                {currentQ.type === 'multiple-choice' && currentQ.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(option)}
                    className="w-full text-left p-6 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#3DAEDB] hover:bg-[#3DAEDB]/5 focus:outline-none focus:ring-2 focus:ring-[#3DAEDB] focus:border-[#3DAEDB] transition-all duration-300 group"
                  >
                    <span className="text-base font-medium text-[#333333] group-hover:text-[#1C3D6E] dark:text-[#3DAEDB] transition-colors">
                      {option}
                    </span>
                  </button>
                ))}

                {/* Scale */}
                {currentQ.type === 'scale' && (
                  <div className="space-y-6">
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                      <span>{currentQ.scaleLabel?.min}</span>
                      <span>{currentQ.scaleLabel?.max}</span>
                    </div>
                    <div className="flex justify-between space-x-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          onClick={() => handleAnswer(value)}
                          className="flex-1 h-16 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#3DAEDB] hover:bg-[#3DAEDB]/5 focus:outline-none focus:ring-2 focus:ring-[#3DAEDB] focus:border-[#3DAEDB] transition-all duration-300 flex items-center justify-center font-bold text-lg text-[#333333] hover:text-[#1C3D6E] dark:text-[#3DAEDB]"
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Checkbox */}
                {currentQ.type === 'checkbox' && (
                  <div className="space-y-4">
                    {currentQ.options?.map((option, index) => (
                      <label key={index} className="flex items-center p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#3DAEDB] hover:bg-[#3DAEDB]/5 cursor-pointer transition-all duration-300">
                        <input
                          type="checkbox"
                          className="h-5 w-5 text-[#3DAEDB] focus:ring-[#3DAEDB] border-gray-300 rounded mr-4"
                          onChange={(e) => {
                            const currentAnswers = (answers[currentQ.id] as string[]) || []
                            if (e.target.checked) {
                              handleAnswer([...currentAnswers, option])
                            } else {
                              handleAnswer(currentAnswers.filter((a: string) => a !== option))
                            }
                          }}
                        />
                        <span className="text-base font-medium text-[#333333] dark:text-gray-300">{option}</span>
                      </label>
                    ))}
                    <button
                      onClick={() => handleAnswer(answers[currentQ.id] || [])}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold w-full mt-6"
                    >
                      Continue
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation */}
              {currentQ.type !== 'checkbox' && (
                <div className="flex justify-between mt-8">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className={`py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      currentQuestion === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-2 border-[#1C3D6E] text-[#1C3D6E] dark:text-[#3DAEDB] hover:bg-[#1C3D6E] hover:text-white'
                    }`}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-300 self-center">
                    {currentQuestion + 1} of {questions.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CareerAssessment