import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { psychometricApi } from '../../services/api/psychometric'
import type { PsychometricResponse, UserProfile } from '../../services/api/types'
import { handleApiError } from '../../utils/errorHandler'
import LoadingSpinner from '../ui/LoadingSpinner'

interface PsychometricQuestion {
  id: number
  question: string
  scale: string[]
  category: 'personality' | 'cognitive' | 'interests' | 'values'
}

const PsychometricTest = () => {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<UserProfile | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [assessmentId, setAssessmentId] = useState<string | null>(null)

  const questions: PsychometricQuestion[] = [
    {
      id: 1,
      question: "I enjoy working in teams and collaborating with others",
      scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
      category: 'personality'
    },
    {
      id: 2,
      question: "I prefer to plan ahead rather than be spontaneous",
      scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
      category: 'personality'
    },
    {
      id: 3,
      question: "I can easily focus on tasks for long periods",
      scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
      category: 'cognitive'
    },
    {
      id: 4,
      question: "I enjoy solving complex problems",
      scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
      category: 'cognitive'
    },
    {
      id: 5,
      question: "I am interested in creative and artistic activities",
      scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
      category: 'interests'
    },
    {
      id: 6,
      question: "I am motivated by helping others succeed",
      scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
      category: 'values'
    },
    {
      id: 7,
      question: "I adapt quickly to new situations and changes",
      scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
      category: 'personality'
    },
    {
      id: 8,
      question: "I prefer learning through hands-on experience",
      scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
      category: 'cognitive'
    },
    {
      id: 9,
      question: "I am interested in how things work mechanically or technically",
      scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
      category: 'interests'
    },
    {
      id: 10,
      question: "I value financial security and stability",
      scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
      category: 'values'
    }
  ]

  const handleAnswer = async (score: number) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: score }
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      await submitAssessment(newAnswers)
    }
  }

  const submitAssessment = async (finalAnswers: Record<number, number>) => {
    setIsAnalyzing(true)
    setError(null)
    
    try {
      // Get user ID from localStorage or context
      const userId = localStorage.getItem('user_id') || 'temp_user'
      
      // Create assessment if not exists
      if (!assessmentId) {
        const assessment = await psychometricApi.createAssessment({ 
          user_id: userId,
          assessment_type: 'onboarding'
        })
        setAssessmentId(assessment.id)
      }

      // Submit responses
      const responses: PsychometricResponse[] = Object.entries(finalAnswers).map(([questionId, value]) => ({
        question_id: parseInt(questionId),
        response_value: value,
        response_time_ms: Date.now() // Simple timestamp
      }))

      await psychometricApi.submitResponses({
        assessment_id: assessmentId!,
        responses
      })

      // Trigger AI analysis
      const results = await psychometricApi.analyzeUser(userId)
      setAnalysisResults(results)
      setShowResults(true)
      
    } catch (err: any) {
      setError(handleApiError(err))
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleContinue = () => {
    navigate('/onboarding/path-generation')
  }

  const resetTest = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
  }

  const getResults = () => {
    const categories = {
      personality: 0,
      cognitive: 0,
      interests: 0,
      values: 0
    }

    const counts = {
      personality: 0,
      cognitive: 0,
      interests: 0,
      values: 0
    }

    questions.forEach((question) => {
      const score = answers[question.id]
      if (score !== undefined) {
        categories[question.category] += score
        counts[question.category]++
      }
    })

    // Calculate averages
    Object.keys(categories).forEach((key) => {
      const categoryKey = key as keyof typeof categories
      if (counts[categoryKey] > 0) {
        categories[categoryKey] = categories[categoryKey] / counts[categoryKey]
      }
    })

    return categories
  }

  const getPersonalityTraits = (results: ReturnType<typeof getResults>) => {
    const traits: string[] = []

    if (results.personality >= 4) traits.push("Highly collaborative")
    if (results.personality >= 3.5) traits.push("Well-organized")
    if (results.cognitive >= 4) traits.push("Strong problem solver")
    if (results.cognitive >= 3.5) traits.push("Detail-oriented")
    if (results.interests >= 4) traits.push("Creative thinker")
    if (results.interests >= 3.5) traits.push("Technically inclined")
    if (results.values >= 4) traits.push("Service-oriented")
    if (results.values >= 3.5) traits.push("Security-focused")

    return traits.length > 0 ? traits : ["Well-rounded individual"]
  }

  // Show loading state during AI analysis
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-darkMode-bg dark:via-darkMode-surface dark:to-darkMode-success/10 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <LoadingSpinner size="lg" message="Analyzing your responses with AI..." />
          <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            This may take a few moments as we process your psychometric profile
          </p>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-darkMode-bg dark:via-darkMode-surface dark:to-darkMode-success/10 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              Assessment Error
            </h3>
            <p className="text-red-600 dark:text-red-300 mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null)
                setCurrentQuestion(0)
                setAnswers({})
                setShowResults(false)
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (showResults && analysisResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-darkMode-bg dark:via-darkMode-surface dark:to-darkMode-success/10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-8 animate-fade-in">
          {/* Header */}
          <div className="text-center">
            <div className="w-24 h-24 bg-primary-dark dark:bg-darkMode-progress rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl dark:shadow-dark-lg">
              <span className="text-4xl">🎯</span>
            </div>
            <h2 className="text-4xl font-bold text-primary-dark dark:text-darkMode-text mb-4">
              AI Analysis Complete!
            </h2>
            <p className="text-neutral-dark/60 dark:text-darkMode-textSecondary text-xl max-w-3xl mx-auto">
              Your personalized learning profile based on AI analysis
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Learner Archetype */}
            <div className="bg-white dark:bg-darkMode-surface rounded-2xl shadow-xl dark:shadow-dark-lg border-0 p-8 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-6 flex items-center">
                <span className="text-3xl mr-3">🎭</span>
                Your Learner Type
              </h3>
              <div className="text-center">
                <div className="text-lg font-semibold text-primary capitalize mb-2">
                  {analysisResults.learner_archetype.replace('_', ' ')}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Primary Learning Style: {analysisResults.learning_preferences.primary_style}
                </div>
              </div>
            </div>

            {/* Motivation Scores */}
            <div className="bg-white dark:bg-darkMode-surface rounded-2xl shadow-xl dark:shadow-dark-lg border-0 p-8 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-6 flex items-center">
                <span className="text-3xl mr-3">⚡</span>
                Motivation Profile
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Intrinsic Motivation</span>
                    <span>{Math.round(analysisResults.motivation_score.intrinsic_motivation * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ width: `${analysisResults.motivation_score.intrinsic_motivation * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Engagement Prediction</span>
                    <span>{Math.round(analysisResults.motivation_score.engagement_prediction * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-secondary h-2 rounded-full" 
                      style={{ width: `${analysisResults.motivation_score.engagement_prediction * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Skill Gaps */}
            {analysisResults.skill_gaps.length > 0 && (
              <div className="lg:col-span-2 bg-white dark:bg-darkMode-surface rounded-2xl shadow-xl dark:shadow-dark-lg border-0 p-8 hover:shadow-2xl transition-all duration-300">
                <h3 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-6 flex items-center">
                  <span className="text-3xl mr-3">🎯</span>
                  Priority Learning Areas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysisResults.skill_gaps.slice(0, 4).map((gap, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <div className="font-semibold text-gray-800 dark:text-gray-200">{gap.skill_name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Current: {gap.current_level}% → Target: {gap.target_level}%
                      </div>
                      <div className="text-xs text-primary mt-1">
                        Priority: {Math.round(gap.priority * 100)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={resetTest}
              className="flex-1 py-3 px-6 border-2 border-primary-dark dark:border-darkMode-border text-primary-dark dark:text-darkMode-text hover:bg-primary-dark dark:hover:bg-darkMode-surfaceHover hover:text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg"
            >
              Retake Test
            </button>
            <button
              onClick={handleContinue}
              className="flex-1 py-4 px-6 bg-gradient-to-r from-primary-light to-forest-sage dark:from-darkMode-progress dark:to-darkMode-success text-white rounded-xl hover:from-primary hover:to-forest-deep dark:hover:from-darkMode-success dark:hover:to-darkMode-progress transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              Generate My Roadmap
              <svg className="w-5 h-5 ml-2 inline" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-darkMode-bg dark:via-darkMode-surface dark:to-darkMode-success/10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="w-20 h-20 bg-primary-dark dark:bg-darkMode-progress rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg dark:shadow-dark">
            <span className="text-3xl">🧠</span>
          </div>
          <h2 className="text-4xl font-bold text-primary-dark dark:text-darkMode-text mb-3">
            Psychometric Assessment
          </h2>
          <p className="text-neutral-dark/60 dark:text-darkMode-textSecondary text-lg max-w-2xl mx-auto">
            Help us understand your personality and learning preferences to optimize your experience
          </p>

          {/* Progress Bar */}
          <div className="mt-8">
            <div className="w-full bg-neutral-gray dark:bg-darkMode-border rounded-full h-3 shadow-inner">
              <div
                className="bg-primary-dark dark:bg-darkMode-progress h-3 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-center text-sm font-medium text-forest-sage dark:text-darkMode-accent mt-3">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white dark:bg-darkMode-surface rounded-2xl shadow-xl dark:shadow-dark-lg border-0 p-8 hover:shadow-2xl transition-all duration-300">
          <h3 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-8 text-center leading-relaxed">
            {questions[currentQuestion].question}
          </h3>

          <div className="space-y-3">
            {questions[currentQuestion].scale.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index + 1)}
                className="w-full text-center p-6 border-2 border-neutral-gray dark:border-darkMode-border rounded-xl hover:border-forest-sage dark:hover:border-darkMode-success hover:bg-forest-sage/5 dark:hover:bg-darkMode-success/5 focus:outline-none focus:ring-2 focus:ring-forest-sage dark:focus:ring-darkMode-focus focus:border-forest-sage dark:focus:border-darkMode-success transition-all duration-300 group"
              >
                <span className="text-base font-medium text-neutral-dark dark:text-darkMode-textSecondary group-hover:text-primary-dark dark:group-hover:text-darkMode-text transition-colors">
                  {option}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PsychometricTest
