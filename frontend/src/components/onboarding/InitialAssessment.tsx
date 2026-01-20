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
      <div className="min-h-screen bg-gradient-to-br from-neutral-light to-forest-mist dark:from-darkMode-bg dark:to-darkMode-surface font-['Inter'] py-12 px-4 sm:px-6 lg:px-8">
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
              <div className="w-24 h-24 bg-gradient-to-br from-primary-dark to-secondary dark:from-darkMode-progress dark:to-darkMode-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl dark:shadow-dark-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-primary-dark dark:text-darkMode-text mb-4">
                Assessment Complete!
              </h2>
              <p className="text-neutral-dark/60 dark:text-darkMode-textSecondary text-xl max-w-2xl mx-auto">
                Here's your personalized learning profile summary
              </p>
            </div>

            {/* Results Card */}
            <div className="bg-white dark:bg-darkMode-surface rounded-2xl shadow-xl dark:shadow-dark-lg border-0 p-8">
              <h3 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-8 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 mr-3 text-primary-dark dark:text-darkMode-accent" />
                Your Learning Profile
              </h3>

              <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-primary-dark/10 to-primary-dark/5 dark:from-darkMode-progress/10 dark:to-darkMode-progress/5 p-4 rounded-xl border border-primary-dark/20 dark:border-darkMode-progress/20">
                  <dt className="text-sm font-semibold text-primary-dark dark:text-darkMode-text mb-2">Education Level</dt>
                  <dd className="text-lg font-bold text-neutral-dark dark:text-darkMode-textSecondary">{results.education}</dd>
                </div>
                <div className="bg-gradient-to-br from-primary-light/10 to-primary-light/5 dark:from-darkMode-accent/10 dark:to-darkMode-accent/5 p-4 rounded-xl border border-primary-light/20 dark:border-darkMode-accent/20">
                  <dt className="text-sm font-semibold text-primary-light dark:text-darkMode-accent mb-2">Primary Interest</dt>
                  <dd className="text-lg font-bold text-neutral-dark dark:text-darkMode-textSecondary">{results.interests}</dd>
                </div>
                <div className="bg-gradient-to-br from-forest-sage/10 to-forest-sage/5 dark:from-darkMode-success/10 dark:to-darkMode-success/5 p-4 rounded-xl border border-forest-sage/20 dark:border-darkMode-success/20">
                  <dt className="text-sm font-semibold text-forest-sage dark:text-darkMode-success mb-2">Learning Style</dt>
                  <dd className="text-lg font-bold text-neutral-dark dark:text-darkMode-textSecondary">{results.learning_style}</dd>
                </div>
                <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 dark:from-darkMode-successLight/10 dark:to-darkMode-successLight/5 p-4 rounded-xl border border-secondary/20 dark:border-darkMode-successLight/20">
                  <dt className="text-sm font-semibold text-secondary dark:text-darkMode-successLight mb-2">Primary Goal</dt>
                  <dd className="text-lg font-bold text-neutral-dark dark:text-darkMode-textSecondary">{results.goals}</dd>
                </div>
                <div className="md:col-span-2 bg-gradient-to-br from-primary-dark/10 to-primary-light/10 dark:from-darkMode-progress/10 dark:to-darkMode-accent/10 p-4 rounded-xl border border-primary-dark/20 dark:border-darkMode-border">
                  <dt className="text-sm font-semibold text-primary-dark dark:text-darkMode-text mb-2">Daily Time Commitment</dt>
                  <dd className="text-lg font-bold text-neutral-dark dark:text-darkMode-textSecondary">{results.time_commitment}</dd>
                </div>
              </dl>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={resetAssessment}
                className="flex-1 py-3 px-6 border-2 border-primary-dark dark:border-darkMode-border text-primary-dark dark:text-darkMode-text rounded-xl hover:bg-primary-dark dark:hover:bg-darkMode-surfaceHover hover:text-white transition-all duration-300 font-medium"
              >
                Retake Assessment
              </button>
              <button
                onClick={handleContinue}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-primary-light to-forest-sage dark:from-darkMode-progress dark:to-darkMode-success text-white rounded-xl hover:from-primary hover:to-forest-deep dark:hover:from-darkMode-success dark:hover:to-darkMode-progress transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-light to-forest-mist dark:from-darkMode-bg dark:to-darkMode-surface font-['Inter'] py-12 px-4 sm:px-6 lg:px-8">
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
            className="flex items-center text-primary-dark dark:text-darkMode-text hover:text-primary-light dark:hover:text-darkMode-accent transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Profile Setup
          </button>

          {/* Header */}
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-dark to-primary-light dark:from-darkMode-progress dark:to-darkMode-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg dark:shadow-dark">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-primary-dark dark:text-darkMode-text mb-3">
              Learning Assessment
            </h2>
            <p className="text-neutral-dark/60 dark:text-darkMode-textSecondary text-lg max-w-2xl mx-auto">
              Help us understand your learning needs and preferences to create your personalized journey
            </p>

            {/* Progress Bar */}
            <div className="mt-8">
              <div className="w-full bg-neutral-gray dark:bg-darkMode-border rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-primary-light to-forest-sage dark:from-darkMode-progress dark:to-darkMode-success h-3 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
              <p className="text-center text-sm font-medium text-forest-sage dark:text-darkMode-accent mt-3">
                Question {currentQuestion + 1} of {questions.length}
              </p>
              <p className="text-center text-xs text-neutral-dark/50 dark:text-darkMode-textMuted mt-1">
                Education level and interests already collected from your profile
              </p>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white dark:bg-darkMode-surface rounded-2xl shadow-xl dark:shadow-dark-lg border-0 p-8">
            <h3 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-8 text-center leading-relaxed">
              {questions[currentQuestion].question}
            </h3>

            <div className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className="w-full text-left p-6 border-2 border-neutral-gray dark:border-darkMode-border rounded-xl hover:border-primary-light dark:hover:border-darkMode-progress hover:bg-primary-light/5 dark:hover:bg-darkMode-progress/5 transition-all duration-300 group transform hover:scale-105"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex-1 text-base font-medium text-neutral-dark dark:text-darkMode-textSecondary group-hover:text-primary-dark dark:group-hover:text-darkMode-text transition-colors">
                      {option}
                    </span>
                    <ChevronRight className="w-6 h-6 text-neutral-dark/40 dark:text-darkMode-textMuted group-hover:text-primary-light dark:group-hover:text-darkMode-progress group-hover:scale-110 transition-all duration-200" />
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
