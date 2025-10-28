import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Target, Sparkles, BarChart3, ArrowRight, ChevronRight, ArrowLeft } from 'lucide-react'
import OnboardingProgress from './OnboardingProgress'

interface Question {
  id: number
  question: string
  options: string[]
  category: string
}

const InitialAssessment = () => {
  const navigate = useNavigate()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)

  // Load pre-filled data from profile setup
  const storedData = sessionStorage.getItem('onboardingData')
  const profileData = storedData ? JSON.parse(storedData) : {}

  // Pre-fill education and interests from profile setup
  const preFilledAnswers: Record<number, string> = {}
  if (profileData.educationLevel) {
    preFilledAnswers[1] = profileData.educationLevel
  }
  if (profileData.interests && profileData.interests.length > 0) {
    preFilledAnswers[2] = profileData.interests[0] // Use first interest
  }

  const questions: Question[] = [
    // Education and interests are now collected in profile setup, skip them here
    {
      id: 3,
      question: "How do you prefer to learn?",
      options: ["Visual (videos, diagrams)", "Auditory (lectures, discussions)", "Reading/Writing", "Hands-on activities", "Mixed approach"],
      category: "learning_style"
    },
    {
      id: 4,
      question: "What is your primary goal for using this platform?",
      options: ["Improve grades", "Learn new skills", "Career preparation", "Personal interest", "All of the above"],
      category: "goals"
    },
    {
      id: 5,
      question: "How much time can you dedicate to learning per day?",
      options: ["Less than 30 minutes", "30-60 minutes", "1-2 hours", "2-3 hours", "More than 3 hours"],
      category: "time_commitment"
    }
  ]

  const handleAnswer = (answer: string) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: answer }
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const handleContinue = () => {
    // Store assessment results
    const results = getResults()
    const storedData = sessionStorage.getItem('onboardingData')
    const existingData = storedData ? JSON.parse(storedData) : {}
    const updatedData = {
      ...existingData,
      assessmentResults: results,
      assessmentComplete: true
    }
    sessionStorage.setItem('onboardingData', JSON.stringify(updatedData))
    
    navigate('/onboarding/psychometric-test')
  }

  const handleBack = () => {
    navigate('/onboarding/profile-setup')
  }

  const resetAssessment = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
  }

  const getResults = () => {
    const categories = {
      education: profileData.educationLevel || "Not specified",
      interests: profileData.interests && profileData.interests.length > 0
        ? profileData.interests.join(", ")
        : "Not specified",
      learning_style: answers[3] || "Not specified",
      goals: answers[4] || "Not specified",
      time_commitment: answers[5] || "Not specified"
    }
    return categories
  }

  const stepLabels = ['Welcome', 'Verify Age', 'Profile', 'Assessment', 'Psychometric', 'Roadmap']

  if (showResults) {
    const results = getResults()
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-['Inter'] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <OnboardingProgress 
            currentStep={3} 
            totalSteps={6} 
            stepLabels={stepLabels}
          />

          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-[#1C3D6E] to-[#4A9E3D] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-[#1C3D6E] mb-4">
                Assessment Complete!
              </h2>
              <p className="text-gray-600 text-xl max-w-2xl mx-auto">
                Here's your personalized learning profile summary
              </p>
            </div>

            {/* Results Card */}
            <div className="bg-white rounded-2xl shadow-xl border-0 p-8">
              <h3 className="text-2xl font-bold text-[#1C3D6E] mb-8 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 mr-3 text-[#1C3D6E]" />
                Your Learning Profile
              </h3>

              <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-[#1C3D6E]/10 to-[#1C3D6E]/5 p-4 rounded-xl border border-[#1C3D6E]/20">
                  <dt className="text-sm font-semibold text-[#1C3D6E] mb-2">Education Level</dt>
                  <dd className="text-lg font-bold text-gray-800">{results.education}</dd>
                </div>
                <div className="bg-gradient-to-br from-[#3DAEDB]/10 to-[#3DAEDB]/5 p-4 rounded-xl border border-[#3DAEDB]/20">
                  <dt className="text-sm font-semibold text-[#3DAEDB] mb-2">Primary Interest</dt>
                  <dd className="text-lg font-bold text-gray-800">{results.interests}</dd>
                </div>
                <div className="bg-gradient-to-br from-[#2C857A]/10 to-[#2C857A]/5 p-4 rounded-xl border border-[#2C857A]/20">
                  <dt className="text-sm font-semibold text-[#2C857A] mb-2">Learning Style</dt>
                  <dd className="text-lg font-bold text-gray-800">{results.learning_style}</dd>
                </div>
                <div className="bg-gradient-to-br from-[#4A9E3D]/10 to-[#4A9E3D]/5 p-4 rounded-xl border border-[#4A9E3D]/20">
                  <dt className="text-sm font-semibold text-[#4A9E3D] mb-2">Primary Goal</dt>
                  <dd className="text-lg font-bold text-gray-800">{results.goals}</dd>
                </div>
                <div className="md:col-span-2 bg-gradient-to-br from-[#1C3D6E]/10 to-[#3DAEDB]/10 p-4 rounded-xl border border-[#1C3D6E]/20">
                  <dt className="text-sm font-semibold text-[#1C3D6E] mb-2">Daily Time Commitment</dt>
                  <dd className="text-lg font-bold text-gray-800">{results.time_commitment}</dd>
                </div>
              </dl>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={resetAssessment}
                className="flex-1 py-3 px-6 border-2 border-[#1C3D6E] text-[#1C3D6E] rounded-xl hover:bg-[#1C3D6E] hover:text-white transition-all duration-300 font-medium"
              >
                Retake Assessment
              </button>
              <button
                onClick={handleContinue}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-[#3DAEDB] to-[#2C857A] text-white rounded-xl hover:from-[#2A9BC8] hover:to-[#1F6B61] transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                Continue to Psychometric Test
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-['Inter'] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Indicator */}
        <OnboardingProgress 
          currentStep={3} 
          totalSteps={6} 
          stepLabels={stepLabels}
        />

        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center text-[#1C3D6E] hover:text-[#3DAEDB] transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Profile Setup
          </button>

          {/* Header */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#1C3D6E] to-[#3DAEDB] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-[#1C3D6E] mb-3">
              Learning Assessment
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Help us understand your learning needs and preferences to create your personalized journey
            </p>

            {/* Progress Bar */}
            <div className="mt-8">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-[#3DAEDB] to-[#2C857A] h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-center text-sm font-medium text-[#2C857A] mt-3">
                Question {currentQuestion + 1} of {questions.length}
              </p>
              <p className="text-center text-xs text-gray-500 mt-1">
                Education level and interests already collected from your profile
              </p>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-xl border-0 p-8">
            <h3 className="text-2xl font-bold text-[#1C3D6E] mb-8 text-center leading-relaxed">
              {questions[currentQuestion].question}
            </h3>

            <div className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="w-full text-left p-6 border-2 border-gray-200 rounded-xl hover:border-[#3DAEDB] hover:bg-[#3DAEDB]/5 transition-all duration-300 group transform hover:scale-105"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-base font-medium text-gray-800 group-hover:text-[#1C3D6E] transition-colors">
                      {option}
                    </span>
                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-[#3DAEDB] group-hover:scale-110 transition-all duration-200" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InitialAssessment