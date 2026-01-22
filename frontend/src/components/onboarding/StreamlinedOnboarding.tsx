import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserCheck, ArrowRight, ArrowLeft, Upload, Shield, AlertCircle } from 'lucide-react'
import { useOnboarding } from '../../contexts/OnboardingContext'
import LegalDocumentModal from '../legal/LegalDocumentModal'
import { TERMS_OF_SERVICE, PRIVACY_POLICY } from '../../constants/legalDocuments'

const StreamlinedOnboarding = () => {
  const navigate = useNavigate()
  const { data, updateData, nextStep } = useOnboarding()
  const [currentStep, setCurrentStep] = useState(1)
  const [showLegalModal, setShowLegalModal] = useState(false)
  const [legalDocument, setLegalDocument] = useState<'terms' | 'privacy'>('terms')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalSteps = data.age < 18 ? 4 : 3

  const handleInputChange = (field: string, value: any) => {
    updateData({ [field]: value })
  }

  const handleArrayChange = (field: string, value: string, checked: boolean) => {
    const currentArray = data[field as keyof typeof data] as string[] || []
    const newArray = checked 
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value)
    updateData({ [field]: newArray })
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(data.firstName && data.lastName && data.email && data.dateOfBirth)
      case 2:
        return data.age >= 18 || !!(data.parentGuardian.name && data.parentGuardian.email)
      case 3:
        return true // Education and interests are now optional
      case 4:
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

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const userId = localStorage.getItem('userId') || Date.now().toString()
      
      const response = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, userId })
      })

      if (response.ok) {
        const result = await response.json()
        updateData({ isComplete: true })
        localStorage.setItem('onboardingComplete', 'true')
        navigate('/student/dashboard')
      } else {
        throw new Error('Failed to complete onboarding')
      }
    } catch (error) {
      console.error('Onboarding submission failed:', error)
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
            <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={data.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={data.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <input
              type="email"
              placeholder="Email Address"
              value={data.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="date"
                value={data.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                value={data.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender (Optional)</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>

            <input
              type="tel"
              placeholder="Phone Number (Optional)"
              value={data.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )

      case 2:
        if (data.age >= 18) return null
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Parent/Guardian Information</h2>
            <p className="text-gray-600">Since you're under 18, we need your parent or guardian's information.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Parent/Guardian Name"
                value={data.parentGuardian.name}
                onChange={(e) => handleInputChange('parentGuardian', { ...data.parentGuardian, name: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <select
                value={data.parentGuardian.relationship}
                onChange={(e) => handleInputChange('parentGuardian', { ...data.parentGuardian, relationship: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Relationship</option>
                <option value="parent">Parent</option>
                <option value="guardian">Guardian</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                placeholder="Parent/Guardian Email"
                value={data.parentGuardian.email}
                onChange={(e) => handleInputChange('parentGuardian', { ...data.parentGuardian, email: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="tel"
                placeholder="Parent/Guardian Phone"
                value={data.parentGuardian.phone}
                onChange={(e) => handleInputChange('parentGuardian', { ...data.parentGuardian, phone: e.target.value })}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Education & Interests</h2>
              <p className="text-gray-600 mt-2">Help us personalize your experience (you can complete this later in settings)</p>
            </div>
            
            <select
              value={data.educationLevel}
              onChange={(e) => handleInputChange('educationLevel', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Education Level (Optional)</option>
              <option value="primary">Primary School</option>
              <option value="secondary">Secondary School</option>
              <option value="high-school">High School</option>
              <option value="diploma">Diploma</option>
              <option value="bachelor">Bachelor's Degree</option>
              <option value="master">Master's Degree</option>
              <option value="phd">PhD</option>
            </select>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select your interests (optional - helps with career recommendations):
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['Technology', 'Business', 'Healthcare', 'Education', 'Arts', 'Science', 'Sports', 'Music', 'Writing', 'Engineering', 'Marketing', 'Finance'].map((interest) => (
                  <label key={interest} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={data.interests.includes(interest)}
                      onChange={(e) => handleArrayChange('interests', interest, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> You can skip this section and complete it later in your profile settings to get better career recommendations.
              </p>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Terms & Privacy</h2>
            
            <div className="space-y-4">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={data.termsAccepted}
                  onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  required
                />
                <span className="text-sm text-gray-700">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setLegalDocument('terms')
                      setShowLegalModal(true)
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Terms of Service
                  </button>
                </span>
              </label>

              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={data.privacyAccepted}
                  onChange={(e) => handleInputChange('privacyAccepted', e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  required
                />
                <span className="text-sm text-gray-700">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setLegalDocument('privacy')
                      setShowLegalModal(true)
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Privacy Policy
                  </button>
                </span>
              </label>

              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={data.newsletterOptIn}
                  onChange={(e) => handleInputChange('newsletterOptIn', e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  I would like to receive updates and newsletters (optional)
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          {renderStep()}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={!validateStep(currentStep) || isSubmitting}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : currentStep === totalSteps ? 'Complete Setup' : 'Next'}
              {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
            </button>
          </div>
        </div>
      </div>

      {/* Legal Document Modal */}
      {showLegalModal && (
        <LegalDocumentModal
          isOpen={showLegalModal}
          onClose={() => setShowLegalModal(false)}
          document={legalDocument === 'terms' ? TERMS_OF_SERVICE : PRIVACY_POLICY}
          title={legalDocument === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
        />
      )}
    </div>
  )
}

export default StreamlinedOnboarding
