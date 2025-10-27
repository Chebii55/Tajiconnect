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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-['Inter'] flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full">
        {/* Progress Indicator */}
        <OnboardingProgress 
          currentStep={0} 
          totalSteps={6} 
          stepLabels={stepLabels}
        />

        {/* Welcome Card */}
        <div className="bg-white rounded-3xl shadow-2xl max-w-2xl mx-auto transform animate-slide-up relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#3DAEDB]/20 to-[#2C857A]/20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#4A9E3D]/20 to-[#3DAEDB]/20 rounded-full translate-y-12 -translate-x-12"></div>

          {/* Content */}
          <div className="relative p-8 text-center">
            {/* Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-[#1C3D6E] to-[#3DAEDB] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <span className="text-4xl">🎓</span>
            </div>

            {/* Personalized Greeting */}
            <h1 className="text-4xl font-bold text-[#1C3D6E] mb-2">
              {userData?.firstName ? `Welcome, ${userData.firstName}!` : 'Welcome!'}
            </h1>
            <h2 className="text-2xl font-semibold text-[#3DAEDB] mb-6">
              {userData?.onboardingComplete ? 'Your Journey Awaits!' : "Let's Build Your Learning Journey"}
            </h2>

            {/* Description */}
            <p className="text-gray-600 mb-8 leading-relaxed text-lg max-w-lg mx-auto">
              {userData?.onboardingComplete 
                ? 'Your personalized learning roadmap is ready! You\'ll be redirected to your dashboard shortly.'
                : 'We\'ll create a personalized learning experience tailored just for you. This quick setup will help us understand your goals and preferences.'
              }
            </p>

            {/* Completion Message */}
            {userData?.onboardingComplete && (
              <div className="bg-gradient-to-r from-[#4A9E3D]/10 to-[#3DAEDB]/10 rounded-xl p-4 mb-6 border border-[#4A9E3D]/20">
                <div className="flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-[#4A9E3D] mr-2" />
                  <span className="text-[#1C3D6E] font-semibold">Onboarding Complete!</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">Redirecting to your dashboard in a few seconds...</p>
              </div>
            )}

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-[#4A9E3D]/10 to-[#4A9E3D]/5 rounded-xl p-4">
                <div className="w-8 h-8 bg-[#4A9E3D] rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-sm">🎯</span>
                </div>
                <h3 className="font-semibold text-[#1C3D6E] text-sm">Personalized</h3>
                <p className="text-xs text-gray-600">Tailored to your goals</p>
              </div>
              <div className="bg-gradient-to-br from-[#3DAEDB]/10 to-[#3DAEDB]/5 rounded-xl p-4">
                <div className="w-8 h-8 bg-[#3DAEDB] rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-sm">🤖</span>
                </div>
                <h3 className="font-semibold text-[#1C3D6E] text-sm">AI-Powered</h3>
                <p className="text-xs text-gray-600">Smart recommendations</p>
              </div>
              <div className="bg-gradient-to-br from-[#2C857A]/10 to-[#2C857A]/5 rounded-xl p-4">
                <div className="w-8 h-8 bg-[#2C857A] rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white text-sm">📈</span>
                </div>
                <h3 className="font-semibold text-[#1C3D6E] text-sm">Goal-Oriented</h3>
                <p className="text-xs text-gray-600">Track your progress</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleGetStarted}
                className="w-full py-4 px-6 bg-gradient-to-r from-[#3DAEDB] to-[#2C857A] text-white rounded-xl hover:from-[#2A9BC8] hover:to-[#1F6B61] focus:ring-2 focus:ring-[#3DAEDB] focus:ring-offset-2 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {userData?.onboardingComplete ? 'Go to Dashboard' : 'Start My Journey'}
                <svg className="w-5 h-5 ml-2 inline" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {!userData?.onboardingComplete && (
                <button
                  onClick={handleSkipOnboarding}
                  className="w-full py-3 px-6 text-[#1C3D6E] border-2 border-[#1C3D6E] rounded-xl hover:bg-[#1C3D6E] hover:text-white transition-all duration-300 font-medium"
                >
                  Skip Setup (Go to Dashboard)
                </button>
              )}
            </div>

            {/* Time Estimate */}
            <p className="text-sm text-gray-500 mt-6">
              ⏱️ Takes about 5-7 minutes to complete
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-blue-600" />
            <div className="text-sm text-blue-800">
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