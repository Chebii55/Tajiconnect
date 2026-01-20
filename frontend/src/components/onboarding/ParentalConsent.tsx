import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const ParentalConsent = () => {
  const navigate = useNavigate()
  const [parentEmail, setParentEmail] = useState('')
  const [parentName, setParentName] = useState('')
  const [parentPhone, setParentPhone] = useState('')
  const [relationship, setRelationship] = useState('')
  const [consentGiven, setConsentGiven] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  useEffect(() => {
    // Get user age from session storage and redirect to profile setup if user is 13 or older
    const storedData = sessionStorage.getItem('onboardingData')
    if (storedData) {
      const data = JSON.parse(storedData)

      if (data.age >= 13) {
        navigate('/onboarding/profile-setup')
      }
    }
  }, [navigate])

  const handleSendConsent = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate phone number is provided
    if (!parentPhone || !parentName || !parentEmail || !relationship) {
      alert('Please fill in all required fields including phone number');
      return;
    }

    // Save parent/guardian info to session storage
    const storedData = sessionStorage.getItem('onboardingData')
    const data = storedData ? JSON.parse(storedData) : {}
    const updatedData = {
      ...data,
      requiresParentInfo: true,
      parentGuardian: {
        name: parentName,
        email: parentEmail,
        phone: parentPhone,
        relationship: relationship
      }
    }
    sessionStorage.setItem('onboardingData', JSON.stringify(updatedData))

    setEmailSent(true);
  }

  const handleContinue = () => {
    if (consentGiven) {
      navigate('/onboarding/profile-setup')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-darkMode-bg dark:via-darkMode-surface dark:to-darkMode-success/10 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary-dark dark:bg-darkMode-progress rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg dark:shadow-dark">
            <span className="text-3xl">👨‍👩‍👧‍👦</span>
          </div>
          <h2 className="text-4xl font-bold text-primary-dark dark:text-darkMode-text mb-4">
            Parental Consent Required
          </h2>
          <p className="text-neutral-dark/60 dark:text-darkMode-textSecondary text-lg max-w-2xl mx-auto">
            Since you're under 13, we need permission from your parent or guardian to continue your learning journey
          </p>
        </div>

        {!emailSent ? (
          <div className="bg-white dark:bg-darkMode-surface rounded-2xl shadow-xl dark:shadow-dark-lg border-0 p-8 hover:shadow-2xl transition-all duration-300">
            <form className="space-y-6" onSubmit={handleSendConsent}>
              <div>
                <label htmlFor="parentName" className="block text-sm font-semibold text-primary-dark dark:text-darkMode-text mb-2">
                  Parent/Guardian Name
                </label>
                <input
                  id="parentName"
                  name="parentName"
                  type="text"
                  required
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-neutral-gray dark:border-darkMode-border bg-white dark:bg-darkMode-surfaceHover rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-darkMode-focus focus:border-primary-light dark:focus:border-darkMode-focus transition-all duration-200 text-neutral-dark dark:text-darkMode-text"
                  placeholder="Enter parent/guardian name"
                />
              </div>

              <div>
                <label htmlFor="relationship" className="block text-sm font-semibold text-primary-dark dark:text-darkMode-text mb-2">
                  Relationship
                </label>
                <select
                  id="relationship"
                  name="relationship"
                  required
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-neutral-gray dark:border-darkMode-border bg-white dark:bg-darkMode-surfaceHover rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-darkMode-focus focus:border-primary-light dark:focus:border-darkMode-focus transition-all duration-200 text-neutral-dark dark:text-darkMode-text"
                >
                  <option value="">Select relationship</option>
                  <option value="parent">Parent</option>
                  <option value="guardian">Guardian</option>
                  <option value="grandparent">Grandparent</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="parentEmail" className="block text-sm font-semibold text-primary-dark dark:text-darkMode-text mb-2">
                  Parent/Guardian Email
                </label>
                <input
                  id="parentEmail"
                  name="parentEmail"
                  type="email"
                  required
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-neutral-gray dark:border-darkMode-border bg-white dark:bg-darkMode-surfaceHover rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-darkMode-focus focus:border-primary-light dark:focus:border-darkMode-focus transition-all duration-200 text-neutral-dark dark:text-darkMode-text"
                  placeholder="parent@example.com"
                />
              </div>

              <div>
                <label htmlFor="parentPhone" className="block text-sm font-semibold text-primary-dark dark:text-darkMode-text mb-2">
                  Parent/Guardian Phone Number
                </label>
                <input
                  id="parentPhone"
                  name="parentPhone"
                  type="tel"
                  required
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-neutral-gray dark:border-darkMode-border bg-white dark:bg-darkMode-surfaceHover rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-darkMode-focus focus:border-primary-light dark:focus:border-darkMode-focus transition-all duration-200 text-neutral-dark dark:text-darkMode-text"
                  placeholder="+254..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 text-lg bg-gradient-to-r from-primary-light to-forest-sage dark:from-darkMode-progress dark:to-darkMode-success text-white rounded-xl hover:from-primary hover:to-forest-deep dark:hover:from-darkMode-success dark:hover:to-darkMode-progress transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
              >
                Send Consent Request
                <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white dark:bg-darkMode-surface rounded-2xl shadow-xl dark:shadow-dark-lg border-0 p-8 hover:shadow-2xl transition-all duration-300">
              <div className="bg-primary-dark dark:bg-darkMode-navbar rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Consent Request Sent!
                </h3>
                <p className="text-white/90 leading-relaxed text-lg">
                  We've sent a consent request to <strong>{parentEmail}</strong>. Please ask your {relationship} to check their email and approve your account to continue.
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-darkMode-surface rounded-2xl shadow-xl dark:shadow-dark-lg border-0 p-8 hover:shadow-2xl transition-all duration-300 space-y-6">
              <label className="flex items-center p-6 rounded-xl border-2 border-neutral-gray dark:border-darkMode-border hover:border-secondary dark:hover:border-darkMode-success hover:bg-secondary/5 dark:hover:bg-darkMode-success/5 cursor-pointer transition-all duration-200">
                <input
                  type="checkbox"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="h-5 w-5 text-secondary dark:text-darkMode-success focus:ring-secondary dark:focus:ring-darkMode-success border-neutral-gray dark:border-darkMode-border rounded"
                />
                <span className="ml-4 text-primary-dark dark:text-darkMode-text font-semibold text-lg">
                  My parent/guardian has given consent via email
                </span>
              </label>

              <button
                onClick={handleContinue}
                disabled={!consentGiven}
                className={`w-full text-lg py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  consentGiven
                    ? 'bg-gradient-to-r from-primary-light to-forest-sage dark:from-darkMode-progress dark:to-darkMode-success text-white hover:from-primary hover:to-forest-deep dark:hover:from-darkMode-success dark:hover:to-darkMode-progress shadow-lg hover:shadow-xl'
                    : 'bg-neutral-gray dark:bg-darkMode-border text-neutral-dark/50 dark:text-darkMode-textMuted cursor-not-allowed'
                }`}
              >
                Continue Your Journey
                {consentGiven && (
                  <svg className="w-5 h-5 ml-2 inline" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={() => setEmailSent(false)}
                className="text-forest-sage dark:text-darkMode-accent hover:text-forest-deep dark:hover:text-darkMode-accentHover text-sm font-medium transition-colors duration-200"
              >
                Need to change email address?
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ParentalConsent
