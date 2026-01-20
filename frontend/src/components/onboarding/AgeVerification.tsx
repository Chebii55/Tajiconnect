import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Cake, ArrowLeft } from 'lucide-react'
import OnboardingProgress from './OnboardingProgress'

const AgeVerification = () => {
  const [dateOfBirth, setDateOfBirth] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userData, setUserData] = useState<{name?: string; firstName?: string; email?: string; dateOfBirth?: string} | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Get registration data from sessionStorage
    const storedData = sessionStorage.getItem('onboardingData')
    if (storedData) {
      const data = JSON.parse(storedData)
      setUserData(data)
      // Pre-fill date of birth if available from registration
      if (data.dateOfBirth) {
        setDateOfBirth(data.dateOfBirth)
      }
    }
  }, [])

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (dateOfBirth) {
      setIsSubmitting(true)

      // Calculate age from date of birth
      const age = calculateAge(dateOfBirth)

      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Update stored data with age verification
      const updatedData = {
        ...userData,
        dateOfBirth,
        age,
        ageVerified: true
      }
      sessionStorage.setItem('onboardingData', JSON.stringify(updatedData))

      // Redirect based on age
      // Users under 13 require parental consent before proceeding
      // Users 13-17 will provide parent/guardian info in profile setup
      // Users 18+ proceed directly to profile setup
      if (age < 13) {
        navigate('/onboarding/parental-consent')
      } else {
        navigate('/onboarding/profile-setup')
      }
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const stepLabels = ['Welcome', 'Verify Age', 'Profile', 'Assessment', 'Psychometric', 'Roadmap']

  const handleBack = () => {
    navigate('/onboarding/welcome')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light to-forest-mist dark:from-darkMode-bg dark:to-darkMode-surface font-['Inter'] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Indicator */}
        <OnboardingProgress
          currentStep={1}
          totalSteps={6}
          stepLabels={stepLabels}
        />

        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center text-primary-dark dark:text-darkMode-text hover:text-primary-light dark:hover:text-darkMode-accent transition-colors duration-200 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Welcome
          </button>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-dark to-primary-light dark:from-darkMode-progress dark:to-darkMode-success rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg dark:shadow-dark">
              <Cake className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-primary-dark dark:text-darkMode-text mb-3">
              {userData?.firstName ? `Hi ${userData.firstName}!` : 'Age Verification'}
            </h2>
            <p className="text-neutral-dark/60 dark:text-darkMode-textSecondary text-lg">
              {dateOfBirth && userData?.dateOfBirth ?
                'We have your date of birth from registration. Please confirm or update it below.' :
                'Please enter your date of birth to continue your learning journey'
              }
            </p>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-2xl shadow-xl dark:shadow-dark-lg border-0 p-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-primary-dark dark:text-darkMode-text mb-3">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  max={today}
                  className="w-full px-4 py-3 border-2 border-neutral-gray dark:border-darkMode-border bg-white dark:bg-darkMode-surfaceHover rounded-xl focus:ring-2 focus:ring-primary-light dark:focus:ring-darkMode-focus focus:border-primary-light dark:focus:border-darkMode-focus transition-all duration-300 text-base text-neutral-dark dark:text-darkMode-text"
                  required
                />
                <p className="text-sm text-neutral-dark/50 dark:text-darkMode-textMuted mt-2">
                  We use this to provide age-appropriate content and experiences
                </p>
              </div>

              {dateOfBirth && (
                <div className="bg-gradient-to-r from-primary-light/10 to-forest-sage/10 dark:from-darkMode-progress/10 dark:to-darkMode-success/10 rounded-xl p-4 border border-primary-light/20 dark:border-darkMode-progress/20">
                  <p className="text-sm text-primary-dark dark:text-darkMode-text">
                    <span className="font-semibold">Age:</span> {calculateAge(dateOfBirth)} years old
                  </p>
                  {calculateAge(dateOfBirth) < 13 && (
                    <p className="text-sm text-warning dark:text-warning-light mt-1">
                      Parental consent will be required for users under 13
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={!dateOfBirth || isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95 ${
                  !dateOfBirth || isSubmitting
                    ? 'bg-neutral-gray dark:bg-darkMode-border text-neutral-dark/50 dark:text-darkMode-textMuted cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-light to-forest-sage dark:from-darkMode-progress dark:to-darkMode-success text-white hover:from-primary hover:to-forest-deep dark:hover:from-darkMode-success dark:hover:to-darkMode-progress'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Verifying...
                  </div>
                ) : (
                  <>
                    Continue to Profile Setup
                    <svg className="w-5 h-5 ml-2 inline" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-neutral-dark/50 dark:text-darkMode-textMuted">
                Your information is secure and used only for providing personalized learning experiences
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgeVerification
