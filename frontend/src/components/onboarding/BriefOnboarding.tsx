import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, CheckCircle, User, Target, Loader } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { onboardingService } from '../../services/api/onboarding'

interface OnboardingData {
  firstName: string
  lastName: string
  email: string
  dateOfBirth: string
  age: number
  educationLevel?: string
  interests?: string[]
  careerGoals?: string
  termsAccepted: boolean
  privacyAccepted: boolean
}

const BriefOnboarding = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    age: 0,
    educationLevel: '',
    interests: [],
    careerGoals: '',
    termsAccepted: false,
    privacyAccepted: false
  })

  const totalSteps = 3

  // Initialize form with data from registration
  useEffect(() => {
    // Check if onboarding is already completed
    const onboardingComplete = localStorage.getItem('onboardingComplete') === 'true';
    if (onboardingComplete) {
      navigate('/student/dashboard', { replace: true });
      return;
    }

    const firstName = localStorage.getItem('userFirstName') || ''
    const lastName = localStorage.getItem('userLastName') || ''
    const email = localStorage.getItem('userEmail') || ''
    const dateOfBirth = localStorage.getItem('userDateOfBirth') || ''
    
    if (firstName || lastName || email || dateOfBirth) {
      setData(prev => ({
        ...prev,
        firstName,
        lastName,
        email,
        dateOfBirth,
        age: dateOfBirth ? calculateAge(dateOfBirth) : 0
      }))
    }
  }, [navigate])

  const updateData = (updates: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }

  const handleArrayChange = (field: 'interests', value: string, checked: boolean) => {
    const currentArray = data[field] || []
    const newArray = checked 
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value)
    updateData({ [field]: newArray })
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birth = new Date(dateOfBirth)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(data.firstName && data.lastName && data.email && data.dateOfBirth)
      case 2:
        return true // Optional step
      case 3:
        return data.termsAccepted && data.privacyAccepted
      default:
        return false
    }
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1)
      } else {
        handleSubmit()
      }
    }
  }

  const handleSkip = () => {
    if (currentStep === 2) {
      setCurrentStep(3)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const age = calculateAge(data.dateOfBirth)
      
      // Complete onboarding with all required data in one call
      await onboardingService.completeStep('profile_setup', {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        date_of_birth: data.dateOfBirth,
        age: age,
        education_level: data.educationLevel || 'bachelor',
        skill_level: 'beginner', // Add required skill level
        interests: data.interests || [],
        career_goals: data.careerGoals || '',
        terms_accepted: data.termsAccepted,
        privacy_accepted: data.privacyAccepted,
        completed_at: new Date().toISOString()
      })

      localStorage.setItem('onboardingComplete', 'true')
      navigate('/student/dashboard')
    } catch (error) {
      console.error('Onboarding failed:', error)
      alert('Failed to complete onboarding. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <User className="mx-auto h-12 w-12 text-primary dark:text-darkMode-link mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-darkMode-text">Basic Information</h2>
              <p className="text-gray-600 dark:text-darkMode-textSecondary mt-2">Tell us about yourself to get started</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={data.firstName}
                  onChange={(e) => updateData({ firstName: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus bg-white dark:bg-darkMode-surfaceHover text-gray-900 dark:text-darkMode-text placeholder-gray-500 dark:placeholder-gray-400"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={data.lastName}
                  onChange={(e) => updateData({ lastName: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus bg-white dark:bg-darkMode-surfaceHover text-gray-900 dark:text-darkMode-text placeholder-gray-500 dark:placeholder-gray-400"
                  required
                />
              </div>
              
              <input
                type="email"
                placeholder="Email Address"
                value={data.email}
                onChange={(e) => updateData({ email: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus bg-white dark:bg-darkMode-surfaceHover text-gray-900 dark:text-darkMode-text placeholder-gray-500 dark:placeholder-gray-400"
                required
              />
              
              <input
                type="date"
                value={data.dateOfBirth}
                onChange={(e) => updateData({ dateOfBirth: e.target.value })}
                className="w-full p-3 border border-gray-300 dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus bg-white dark:bg-darkMode-surfaceHover text-gray-900 dark:text-darkMode-text"
                required
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="mx-auto h-12 w-12 text-primary dark:text-darkMode-link mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-darkMode-text">Your Interests</h2>
              <p className="text-gray-600 dark:text-darkMode-textSecondary mt-2">Help us personalize your experience (optional)</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-darkMode-textSecondary mb-2">
                  Education Level (Optional)
                </label>
                <select
                  value={data.educationLevel}
                  onChange={(e) => updateData({ educationLevel: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus bg-white dark:bg-darkMode-surfaceHover text-gray-900 dark:text-darkMode-text"
                >
                  <option value="">Select your education level</option>
                  <option value="high-school">High School</option>
                  <option value="bachelor">Bachelor's Degree</option>
                  <option value="master">Master's Degree</option>
                  <option value="phd">PhD</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-darkMode-textSecondary mb-2">
                  Areas of Interest (Optional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Technology', 'Business', 'Healthcare', 'Education', 'Arts', 'Science'].map(interest => (
                    <label key={interest} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={data.interests?.includes(interest)}
                        onChange={(e) => handleArrayChange('interests', interest, e.target.checked)}
                        className="rounded border-gray-300 dark:border-darkMode-border text-primary dark:text-darkMode-link focus:ring-primary dark:focus:ring-darkMode-focus"
                      />
                      <span className="text-sm text-gray-700 dark:text-darkMode-textSecondary">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-darkMode-textSecondary mb-2">
                  Career Goals (Optional)
                </label>
                <textarea
                  placeholder="What are your career aspirations?"
                  value={data.careerGoals}
                  onChange={(e) => updateData({ careerGoals: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus bg-white dark:bg-darkMode-surfaceHover text-gray-900 dark:text-darkMode-text placeholder-gray-500 dark:placeholder-gray-400"
                  rows={3}
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="mx-auto h-12 w-12 text-success dark:text-darkMode-success mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-darkMode-text">Terms & Privacy</h2>
              <p className="text-gray-600 dark:text-darkMode-textSecondary mt-2">Please review and accept our terms</p>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={data.termsAccepted}
                  onChange={(e) => updateData({ termsAccepted: e.target.checked })}
                  className="mt-1 rounded border-gray-300 dark:border-darkMode-border text-primary dark:text-darkMode-link focus:ring-primary dark:focus:ring-darkMode-focus"
                  required
                />
                <span className="text-sm text-gray-700 dark:text-darkMode-textSecondary">
                  I agree to the <button className="text-primary dark:text-darkMode-link underline">Terms of Service</button>
                </span>
              </label>
              
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={data.privacyAccepted}
                  onChange={(e) => updateData({ privacyAccepted: e.target.checked })}
                  className="mt-1 rounded border-gray-300 dark:border-darkMode-border text-primary dark:text-darkMode-link focus:ring-primary dark:focus:ring-darkMode-focus"
                  required
                />
                <span className="text-sm text-gray-700 dark:text-darkMode-textSecondary">
                  I agree to the <button className="text-primary dark:text-darkMode-link underline">Privacy Policy</button>
                </span>
              </label>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-darkMode-bg dark:via-darkMode-surface dark:to-darkMode-bg flex items-center justify-center p-4">
      <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-xl p-8 w-full max-w-md border dark:border-darkMode-border">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-darkMode-border rounded-full h-2">
            <div 
              className="bg-primary dark:bg-darkMode-link h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {renderStep()}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="flex items-center px-4 py-2 text-gray-600 dark:text-darkMode-textSecondary disabled:opacity-50 hover:text-gray-800 dark:hover:text-darkMode-text"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>

          <div className="flex space-x-2">
            {currentStep === 2 && (
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-gray-600 dark:text-darkMode-textSecondary hover:text-gray-800 dark:hover:text-darkMode-text"
              >
                Skip
              </button>
            )}
            
            <button
              onClick={handleNext}
              disabled={!validateStep(currentStep) || isSubmitting}
              className="flex items-center px-6 py-2 bg-primary dark:bg-darkMode-link text-white rounded-lg hover:bg-primary-dark dark:hover:bg-darkMode-linkHover disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : currentStep === totalSteps ? (
                'Complete'
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BriefOnboarding
