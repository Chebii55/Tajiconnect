import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserCheck, ArrowRight, ArrowLeft } from 'lucide-react'
import OnboardingProgress from './OnboardingProgress'

interface ProfileForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  interests: string[]
}

const ProfileSetup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<ProfileForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    interests: []
  })

  useEffect(() => {
    // Pre-fill data from registration/previous steps
    const storedData = sessionStorage.getItem('onboardingData')
    if (storedData) {
      const data = JSON.parse(storedData)
      setFormData(prev => ({
        ...prev,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        dateOfBirth: data.dateOfBirth || ''
      }))
    }
  }, [])

  const availableInterests = [
    'Accounts and Finance',
    'Agriculture, Food and Nutrition',
    'Artificial Intelligence',
    'Education',
    'Energy',
    'Environment and Climate Change',
    'Healthcare',
    'Innovation',
    'Manufacturing',
    'Media',
    'Research Activities',
    'Startups and Early-Stage',
    'Sustainable Development',
    'Technology',
    'Travel and Tourism'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Update stored data with profile information
    const storedData = sessionStorage.getItem('onboardingData')
    const existingData = storedData ? JSON.parse(storedData) : {}
    const updatedData = {
      ...existingData,
      ...formData,
      profileComplete: true
    }
    sessionStorage.setItem('onboardingData', JSON.stringify(updatedData))
    
    navigate('/onboarding/initial-assessment')
  }

  const handleBack = () => {
    navigate('/onboarding/age-verification')
  }

  const stepLabels = ['Welcome', 'Verify Age', 'Profile', 'Assessment', 'Psychometric', 'Roadmap']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-['Inter'] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Indicator */}
        <OnboardingProgress 
          currentStep={2} 
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
            Back to Age Verification
          </button>

          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[#1C3D6E] to-[#4A9E3D] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-[#1C3D6E] mb-3">
              Complete Your Profile
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Tell us about yourself to personalize your learning experience and create your unique learning path
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border-0 p-8">
            <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-[#1C3D6E] mb-2">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3DAEDB] focus:border-[#3DAEDB] transition-all duration-300"
                  placeholder="Enter your first name"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-[#1C3D6E] mb-2">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3DAEDB] focus:border-[#3DAEDB] transition-all duration-300"
                  placeholder="Enter your last name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#1C3D6E] mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3DAEDB] focus:border-[#3DAEDB] transition-all duration-300"
                  placeholder="your@email.com"
                  disabled={!!formData.email}
                />
                {formData.email && (
                  <p className="text-sm text-gray-500 mt-1">Email from registration</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-[#1C3D6E] mb-2">
                  Phone Number (Optional)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3DAEDB] focus:border-[#3DAEDB] transition-all duration-300"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-[#1C3D6E] mb-2">
                  Date of Birth
                </label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3DAEDB] focus:border-[#3DAEDB] transition-all duration-300"
                  disabled={!!formData.dateOfBirth}
                />
                {formData.dateOfBirth && (
                  <p className="text-sm text-gray-500 mt-1">Date from previous step</p>
                )}
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-semibold text-[#1C3D6E] mb-2">
                  Gender (Optional)
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3DAEDB] focus:border-[#3DAEDB] transition-all duration-300"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1C3D6E] mb-4">
                Interests (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {availableInterests.map((interest) => (
                  <label key={interest} className="flex items-center p-3 rounded-lg border-2 border-gray-200 hover:border-[#3DAEDB] hover:bg-[#3DAEDB]/5 cursor-pointer transition-all duration-200">
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest)}
                      onChange={() => handleInterestToggle(interest)}
                      className="h-4 w-4 text-[#1C3D6E] focus:ring-[#3DAEDB] border-gray-300 rounded"
                    />
                    <span className="ml-3 text-sm font-medium text-[#1C3D6E]">{interest}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                This helps us recommend relevant courses and content
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-[#3DAEDB] to-[#2C857A] text-white rounded-xl hover:from-[#2A9BC8] hover:to-[#1F6B61] focus:ring-2 focus:ring-[#3DAEDB] focus:ring-offset-2 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Continue to Assessment
              <ArrowRight className="w-5 h-5 ml-2 inline" />
            </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSetup