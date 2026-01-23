import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ArrowLeft, CheckCircle, User, Target, Loader } from 'lucide-react'

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
      const userId = localStorage.getItem('userId') || Date.now().toString()
      const age = calculateAge(data.dateOfBirth)
      
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...data, 
          userId,
          age,
          isComplete: true 
        })
      })

      if (response.ok) {
        localStorage.setItem('onboardingComplete', 'true')
        navigate('/student/dashboard')
      } else {
        throw new Error('Failed to complete onboarding')
      }
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
              <User className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
              <p className="text-gray-600 mt-2">Tell us about yourself to get started</p>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  value={data.firstName}
                  onChange={(e) => updateData({ firstName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={data.lastName}
                  onChange={(e) => updateData({ lastName: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <input
                type="email"
                placeholder="Email Address"
                value={data.email}
                onChange={(e) => updateData({ email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              
              <input
                type="date"
                value={data.dateOfBirth}
                onChange={(e) => updateData({ dateOfBirth: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Target className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Your Interests</h2>
              <p className="text-gray-600 mt-2">Help us personalize your experience (optional)</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education Level (Optional)
                </label>
                <select
                  value={data.educationLevel}
                  onChange={(e) => updateData({ educationLevel: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Areas of Interest (Optional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['Technology', 'Business', 'Healthcare', 'Education', 'Arts', 'Science'].map(interest => (
                    <label key={interest} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={data.interests?.includes(interest)}
                        onChange={(e) => handleArrayChange('interests', interest, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Career Goals (Optional)
                </label>
                <textarea
                  placeholder="What are your career aspirations?"
                  value={data.careerGoals}
                  onChange={(e) => updateData({ careerGoals: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
              <CheckCircle className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900">Terms & Privacy</h2>
              <p className="text-gray-600 mt-2">Please review and accept our terms</p>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={data.termsAccepted}
                  onChange={(e) => updateData({ termsAccepted: e.target.checked })}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  required
                />
                <span className="text-sm text-gray-700">
                  I agree to the <button className="text-blue-600 underline">Terms of Service</button>
                </span>
              </label>
              
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={data.privacyAccepted}
                  onChange={(e) => updateData({ privacyAccepted: e.target.checked })}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  required
                />
                <span className="text-sm text-gray-700">
                  I agree to the <button className="text-blue-600 underline">Privacy Policy</button>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
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
            className="flex items-center px-4 py-2 text-gray-600 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>

          <div className="flex space-x-2">
            {currentStep === 2 && (
              <button
                onClick={handleSkip}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Skip
              </button>
            )}
            
            <button
              onClick={handleNext}
              disabled={!validateStep(currentStep) || isSubmitting}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
