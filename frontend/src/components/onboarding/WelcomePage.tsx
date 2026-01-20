import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Shield } from 'lucide-react'
import OnboardingProgress from './OnboardingProgress'

const WelcomePage = () => {
  const navigate = useNavigate()
  const [isVisible] = useState(true)
  const [userData, setUserData] = useState<{name?: string; firstName?: string; email?: string; onboardingComplete?: boolean} | null>(null)

  useEffect(() => {
    // Get registration data from sessionStorage
    const storedData = sessionStorage.getItem('onboardingData')
    if (storedData) {
      const data = JSON.parse(storedData)
      setUserData(data)

      // If onboarding is complete, redirect to dashboard after a short delay
      if (data.onboardingComplete) {
        setTimeout(() => {
          navigate('/student/dashboard')
        }, 3000)
      }
    }
  }, [navigate])

  const handleGetStarted = () => {
    if (userData?.onboardingComplete) {
      navigate('/student/dashboard')
    } else {
      navigate('/onboarding/age-verification')
    }
  }

  const handleSkipOnboarding = () => {
    navigate('/student/dashboard')
  }

  if (!isVisible) {
    return null
  }

  const stepLabels = ['Welcome', 'Verify Age', 'Profile', 'Assessment', 'Psychometric', 'Roadmap']

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light to-forest-mist dark:from-darkMode-bg dark:to-darkMode-surface font-['Inter'] flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full">
        {/* Progress Indicator */}
        <OnboardingProgress
          currentStep={0}
          totalSteps={6}
          stepLabels={stepLabels}
        />

        {/* Welcome Card */}
        <div className="bg-white dark:bg-darkMode-surface rounded-3xl shadow-2xl dark:shadow-dark-lg max-w-2xl mx-auto transform animate-slide-up relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-light/20 to-forest-sage/20 dark:from-darkMode-progress/20 dark:to-darkMode-success/20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-secondary/20 to-primary-light/20 dark:from-darkMode-success/20 dark:to-darkMode-progress/20 rounded-full translate-y-12 -translate-x-12"></div>

          {/* Content */}
          <div className="relative p-8 text-center">
            {/* Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-primary-dark to-primary dark:from-darkMode-progress dark:to-darkMode-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg dark:shadow-dark">
              <span className="text-4xl">🎓</span>
            </div>

            {/* Personalized Greeting */}
            <h1 className="text-4xl font-bold text-primary-dark dark:text-darkMode-text mb-2">
              {userData?.firstName ? `Welcome, ${userData.firstName}!` : 'Welcome!'}
            </h1>
            <h2 className="text-2xl font-semibold text-primary-light dark:text-darkMode-accent mb-6">
              {userData?.onboardingComplete ? 'Your Journey Awaits!' : "Let's Build Your Learning Journey"}
            </h2>

            {/* Description */}
            <p className="text-neutral-dark/70 dark:text-darkMode-textSecondary mb-8 leading-relaxed text-lg max-w-lg mx-auto">
              {userData?.onboardingComplete
                ? 'Your personalized learning roadmap is ready! You\'ll be redirected to your dashboard shortly.'
                : 'We\'ll create a personalized learning experience tailored just for you. This quick setup will help us understand your goals and preferences.'
              }
            </p>

            {/* Completion Message */}
            {userData?.onboardingComplete && (
              <div className="bg-gradient-to-r from-secondary/10 to-primary-light/10 dark:from-darkMode-success/10 dark:to-darkMode-progress/10 rounded-xl p-4 mb-6 border border-secondary/20 dark:border-darkMode-success/20">
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-secondary dark:text-darkMode-success mr-2" />
                  <span className="text-primary-dark dark:text-darkMode-text font-semibold">Onboarding Complete!</span>
                </div>
                <p className="text-sm text-neutral-dark/60 dark:text-darkMode-textMuted mt-1">Redirecting to your dashboard in a few seconds...</p>
              </div>
            )}

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-secondary/10 to-secondary/5 dark:from-darkMode-success/10 dark:to-darkMode-success/5 rounded-xl p-4">
                <div className="w-8 h-8 bg-secondary dark:bg-darkMode-success rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-sm">🎯</span>
                </div>
                <h3 className="font-semibold text-primary-dark dark:text-darkMode-text text-sm">Personalized</h3>
                <p className="text-xs text-neutral-dark/60 dark:text-darkMode-textMuted">Tailored to your goals</p>
              </div>
              <div className="bg-gradient-to-br from-primary-light/10 to-primary-light/5 dark:from-darkMode-progress/10 dark:to-darkMode-progress/5 rounded-xl p-4">
                <div className="w-8 h-8 bg-primary-light dark:bg-darkMode-progress rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <h3 className="font-semibold text-primary-dark dark:text-darkMode-text text-sm">AI-Powered</h3>
                <p className="text-xs text-neutral-dark/60 dark:text-darkMode-textMuted">Smart recommendations</p>
              </div>
              <div className="bg-gradient-to-br from-forest-sage/10 to-forest-sage/5 dark:from-darkMode-accent/10 dark:to-darkMode-accent/5 rounded-xl p-4">
                <div className="w-8 h-8 bg-forest-sage dark:bg-darkMode-accent rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white dark:text-darkMode-bg text-sm">📈</span>
                </div>
                <h3 className="font-semibold text-primary-dark dark:text-darkMode-text text-sm">Goal-Oriented</h3>
                <p className="text-xs text-neutral-dark/60 dark:text-darkMode-textMuted">Track your progress</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleGetStarted}
                className="w-full py-4 px-6 bg-gradient-to-r from-primary-light to-forest-sage dark:from-darkMode-progress dark:to-darkMode-success text-white rounded-xl hover:from-primary hover:to-forest-deep dark:hover:from-darkMode-success dark:hover:to-darkMode-progress focus:ring-2 focus:ring-primary-light dark:focus:ring-darkMode-focus focus:ring-offset-2 dark:focus:ring-offset-darkMode-bg transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {userData?.onboardingComplete ? 'Go to Dashboard' : 'Start My Journey'}
                <svg className="w-5 h-5 ml-2 inline" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {!userData?.onboardingComplete && (
                <button
                  onClick={handleSkipOnboarding}
                  className="w-full py-3 px-6 text-primary-dark dark:text-darkMode-text border-2 border-primary-dark dark:border-darkMode-border rounded-xl hover:bg-primary-dark dark:hover:bg-darkMode-surfaceHover hover:text-white transition-all duration-300 font-medium"
                >
                  Skip Setup (Go to Dashboard)
                </button>
              )}
            </div>

            {/* Time Estimate */}
            <p className="text-sm text-neutral-dark/50 dark:text-darkMode-textMuted mt-6">
              Takes about 5-7 minutes to complete
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-info/10 dark:bg-darkMode-surface border border-info/20 dark:border-darkMode-border rounded-lg p-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-info dark:text-darkMode-link" />
            <div className="text-sm text-info-dark dark:text-darkMode-textSecondary">
              <p className="font-medium mb-1">Your privacy matters</p>
              <p>All information is securely stored and used only to enhance your learning experience.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomePage
