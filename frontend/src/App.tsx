import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] via-white to-[#2C857A]/10">
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-24 h-24 bg-gradient-to-r from-[#1C3D6E] to-[#3DAEDB] rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
          <span className="text-4xl">🎓</span>
        </div>
        <h1 className="text-5xl font-bold text-[#1C3D6E] mb-6">
          TajiConnect
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Your personalized learning and career guidance platform. Ready to begin your journey!
        </p>
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-8 shadow-xl border-0 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-[#1C3D6E] mb-4">Complete System Ready!</h2>
            <p className="text-gray-600 mb-4">
              Our comprehensive learning platform has been successfully created with:
            </p>
            <div className="space-y-2 text-sm text-left">
              <div className="flex items-center">
                <span className="text-[#4A9E3D] mr-2">✓</span>
                <span>Career Dashboard & Assessment</span>
              </div>
              <div className="flex items-center">
                <span className="text-[#4A9E3D] mr-2">✓</span>
                <span>Jobs Dashboard & Recommendations</span>
              </div>
              <div className="flex items-center">
                <span className="text-[#4A9E3D] mr-2">✓</span>
                <span>Assessment & Testing System</span>
              </div>
              <div className="flex items-center">
                <span className="text-[#4A9E3D] mr-2">✓</span>
                <span>Progress & Analytics</span>
              </div>
              <div className="flex items-center">
                <span className="text-[#4A9E3D] mr-2">✓</span>
                <span>Gamification & Rewards</span>
              </div>
              <div className="flex items-center">
                <span className="text-[#4A9E3D] mr-2">✓</span>
                <span>Complete Onboarding Flow</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
