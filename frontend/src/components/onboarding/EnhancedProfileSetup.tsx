import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserCheck, ArrowRight, ArrowLeft, Upload, X, Shield, Image, AlertCircle } from 'lucide-react'
import OnboardingProgress from './OnboardingProgress'
import LegalDocumentModal from '../legal/LegalDocumentModal'
import { TERMS_OF_SERVICE, PRIVACY_POLICY } from '../../constants/legalDocuments'

interface ProfileForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  interests: string[]

  // PWD Information
  isPWD: boolean
  impairmentType: string

  // Parent/Guardian Information (conditional)
  requiresParentInfo: boolean
  parentGuardian: {
    name: string
    email: string
    phone: string
    relationship: string
  }

  // Photo and Documents
  profilePhoto: string | null
  educationLevel: string
  educationDocuments: File[]

  // Hobbies and Talents
  hobbies: string[]
  talents: string[]
  customHobby: string
  customTalent: string

  // Consents
  termsAccepted: boolean
  privacyAccepted: boolean
  dataConsentAccepted: boolean
  mediaConsentAccepted: boolean
  newsletterOptIn: boolean
}

const EnhancedProfileSetup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<ProfileForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    interests: [],

    isPWD: false,
    impairmentType: '',

    requiresParentInfo: false,
    parentGuardian: {
      name: '',
      email: '',
      phone: '',
      relationship: ''
    },

    profilePhoto: null,
    educationLevel: '',
    educationDocuments: [],

    hobbies: [],
    talents: [],
    customHobby: '',
    customTalent: '',

    termsAccepted: false,
    privacyAccepted: false,
    dataConsentAccepted: false,
    mediaConsentAccepted: false,
    newsletterOptIn: false
  })

  const [currentSection, setCurrentSection] = useState(1)
  const [showLegalModal, setShowLegalModal] = useState(false)
  const [legalDocument, setLegalDocument] = useState<'terms' | 'privacy'>('terms')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [age, setAge] = useState<number>(0)

  // Constants
  const availableInterests = [
    'Accounts and Finance', 'Agriculture, Food and Nutrition', 'Artificial Intelligence',
    'Education', 'Energy', 'Environment and Climate Change', 'Healthcare', 'Innovation',
    'Manufacturing', 'Media', 'Research Activities', 'Startups and Early-Stage',
    'Sustainable Development', 'Technology', 'Travel and Tourism'
  ]

  const impairmentTypes = [
    'Visual Impairment', 'Hearing Impairment', 'Physical/Mobility Impairment',
    'Intellectual/Learning Disability', 'Speech and Language Impairment',
    'Autism Spectrum Disorder', 'Multiple Disabilities', 'Other'
  ]

  const educationLevels = [
    'Primary Education', 'Junior Secondary School (JSS)', 'Senior Secondary School',
    'Technical and Vocational Education and Training (TVET)',
    'University Undergraduate', 'University Graduate', 'Postgraduate', 'Other'
  ]

  const commonHobbies = [
    'Reading', 'Writing', 'Sports', 'Music', 'Art & Painting',
    'Dancing', 'Cooking', 'Photography', 'Gaming', 'Travel'
  ]

  const commonTalents = [
    'Public Speaking', 'Singing', 'Musical Instrument', 'Acting/Drama',
    'Leadership', 'Problem Solving', 'Creative Writing', 'Programming', 'Design', 'Teaching'
  ]

  // Effects
  useEffect(() => {
    const storedData = sessionStorage.getItem('onboardingData')
    if (storedData) {
      const data = JSON.parse(storedData)
      const userAge = data.age || 0
      setAge(userAge)

      setFormData(prev => ({
        ...prev,
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        email: data.email || '',
        dateOfBirth: data.dateOfBirth || '',
        requiresParentInfo: userAge < 18 || data.requiresParentInfo || false,
        parentGuardian: data.parentGuardian || prev.parentGuardian,
        termsAccepted: data.termsAcceptedAtRegistration || false,
        privacyAccepted: data.termsAcceptedAtRegistration || false,
        newsletterOptIn: data.newsletterOptIn || false
      }))
    }
  }, [])

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      requiresParentInfo: age < 18 || prev.isPWD
    }))
  }, [formData.isPWD, age])

  useEffect(() => {
    const hasAcceptedTerms = sessionStorage.getItem('termsAccepted')
    const hasAcceptedPrivacy = sessionStorage.getItem('privacyAccepted')

    // Only show legal modal if terms weren't already accepted during registration
    if (!hasAcceptedTerms || !hasAcceptedPrivacy) {
      setLegalDocument('terms')
      setShowLegalModal(true)
    } else {
      // If already accepted during registration, update the form state
      setFormData(prev => ({
        ...prev,
        termsAccepted: true,
        privacyAccepted: true
      }))
    }
  }, [])

  // Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else if (name.startsWith('parentGuardian.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        parentGuardian: {
          ...prev.parentGuardian,
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleToggle = (field: 'interests' | 'hobbies' | 'talents', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item: string) => item !== value)
        : [...prev[field], value]
    }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should not exceed 5MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPhotoPreview(result)
        setFormData(prev => ({ ...prev, profilePhoto: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} exceeds 10MB limit`)
        return false
      }
      return true
    })

    setFormData(prev => ({
      ...prev,
      educationDocuments: [...prev.educationDocuments, ...validFiles]
    }))
  }

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      educationDocuments: prev.educationDocuments.filter((_, i) => i !== index)
    }))
  }

  const handleLegalAccept = () => {
    if (legalDocument === 'terms') {
      setFormData(prev => ({ ...prev, termsAccepted: true }))
      sessionStorage.setItem('termsAccepted', 'true')
      setShowLegalModal(false)
      // Show privacy policy next
      setTimeout(() => {
        setLegalDocument('privacy')
        setShowLegalModal(true)
      }, 300)
    } else {
      setFormData(prev => ({ ...prev, privacyAccepted: true }))
      sessionStorage.setItem('privacyAccepted', 'true')
      setShowLegalModal(false)
    }
  }

  const validateSection = (section: number): boolean => {
    switch (section) {
      case 1:
        return !!(formData.firstName && formData.lastName && formData.email &&
                  formData.termsAccepted && formData.privacyAccepted)
      case 2:
        if (formData.isPWD && !formData.impairmentType) return false
        if (formData.requiresParentInfo) {
          return !!(formData.parentGuardian.name && formData.parentGuardian.email &&
                    formData.parentGuardian.phone)
        }
        return true
      case 3:
        return !!(formData.educationLevel)
      case 4:
        return !!(formData.dataConsentAccepted)
      default:
        return true
    }
  }

  const handleNext = () => {
    if (validateSection(currentSection)) {
      setCurrentSection(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      let errorMessage = 'Please complete all required fields:\n'

      if (currentSection === 1) {
        if (!formData.firstName) errorMessage += '• First Name\n'
        if (!formData.lastName) errorMessage += '• Last Name\n'
        if (!formData.email) errorMessage += '• Email Address\n'
        if (!formData.termsAccepted || !formData.privacyAccepted) errorMessage += '• Terms of Service and Privacy Policy acceptance\n'
      } else if (currentSection === 2) {
        if (formData.isPWD && !formData.impairmentType) errorMessage += '• Type of Impairment (required for PWD)\n'
        if (formData.requiresParentInfo) {
          if (!formData.parentGuardian.name) errorMessage += '• Parent/Guardian Name\n'
          if (!formData.parentGuardian.email) errorMessage += '• Parent/Guardian Email\n'
          if (!formData.parentGuardian.phone) errorMessage += '• Parent/Guardian Phone\n'
        }
      } else if (currentSection === 3) {
        if (!formData.educationLevel) errorMessage += '• Current Education Level\n'
      } else if (currentSection === 4) {
        if (!formData.dataConsentAccepted) errorMessage += '• Data Consent (required)\n'
      }

      alert(errorMessage)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateSection(4)) {
      let errorMessage = 'Please complete all required fields:\n'
      if (!formData.dataConsentAccepted) errorMessage += '• Data Consent (required)\n'
      alert(errorMessage)
      return
    }

    const finalHobbies = [...formData.hobbies]
    if (formData.customHobby.trim()) finalHobbies.push(formData.customHobby.trim())

    const finalTalents = [...formData.talents]
    if (formData.customTalent.trim()) finalTalents.push(formData.customTalent.trim())

    const storedData = sessionStorage.getItem('onboardingData')
    const existingData = storedData ? JSON.parse(storedData) : {}
    const updatedData = {
      ...existingData,
      ...formData,
      hobbies: finalHobbies,
      talents: finalTalents,
      profileComplete: true
    }
    sessionStorage.setItem('onboardingData', JSON.stringify(updatedData))

    navigate('/onboarding/initial-assessment')
  }

  const stepLabels = ['Welcome', 'Verify Age', 'Profile', 'Assessment', 'Psychometric', 'Roadmap']

  // Render Sections
  const renderSection1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-[#1C3D6E]">Basic Information</h3>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="block text-sm font-semibold text-[#1C3D6E] mb-2">
            First Name *
          </label>
          <input
            id="firstName" name="firstName" type="text" required
            value={formData.firstName} onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3DAEDB] focus:border-[#3DAEDB]"
            placeholder="Enter your first name"
          />
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-semibold text-[#1C3D6E] mb-2">
            Last Name *
          </label>
          <input
            id="lastName" name="lastName" type="text" required
            value={formData.lastName} onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3DAEDB] focus:border-[#3DAEDB]"
            placeholder="Enter your last name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-[#1C3D6E] mb-2">
            Email Address *
          </label>
          <input
            id="email" name="email" type="email" required
            value={formData.email} onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3DAEDB] focus:border-[#3DAEDB]"
            placeholder="your@email.com" disabled={!!formData.email}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-[#1C3D6E] mb-2">
            Phone Number
          </label>
          <input
            id="phone" name="phone" type="tel"
            value={formData.phone} onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3DAEDB] focus:border-[#3DAEDB]"
            placeholder="+254..."
          />
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-semibold text-[#1C3D6E] mb-2">
            Gender
          </label>
          <select
            id="gender" name="gender"
            value={formData.gender} onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3DAEDB] focus:border-[#3DAEDB]"
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
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {availableInterests.map((interest) => (
            <label key={interest} className="flex items-center p-3 rounded-lg border-2 border-gray-200 hover:border-[#3DAEDB] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.interests.includes(interest)}
                onChange={() => handleToggle('interests', interest)}
                className="h-4 w-4 text-[#1C3D6E] focus:ring-[#3DAEDB] rounded"
              />
              <span className="ml-2 text-sm">{interest}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Terms and Privacy */}
      <div className={`border-2 rounded-xl p-4 ${
        formData.termsAccepted && formData.privacyAccepted
          ? 'bg-green-50 border-green-200'
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <h4 className="font-semibold text-[#1C3D6E] mb-3 flex items-center">
          {formData.termsAccepted && formData.privacyAccepted ? (
            <>
              <Shield className="w-5 h-5 mr-2 text-green-600" />
              Legal Agreement Accepted
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 mr-2" />
              Legal Agreement Required
            </>
          )}
        </h4>

        {formData.termsAccepted && formData.privacyAccepted ? (
          <div className="text-sm text-green-700">
            <p>✓ You have already accepted the Terms of Service and Privacy Policy during registration.</p>
            <p className="mt-2 text-xs text-gray-600">
              You can review them anytime:{' '}
              <button
                type="button"
                onClick={() => { setLegalDocument('terms'); setShowLegalModal(true); }}
                className="text-[#3DAEDB] underline hover:text-[#2A9BC8]"
              >
                Terms of Service
              </button>
              {' | '}
              <button
                type="button"
                onClick={() => { setLegalDocument('privacy'); setShowLegalModal(true); }}
                className="text-[#3DAEDB] underline hover:text-[#2A9BC8]"
              >
                Privacy Policy
              </button>
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="flex items-start">
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                className="mt-1 h-4 w-4 text-[#1C3D6E] focus:ring-[#3DAEDB] rounded"
                required
              />
              <span className="ml-2 text-sm text-gray-700">
                I have read and accept the{' '}
                <button
                  type="button"
                  onClick={() => { setLegalDocument('terms'); setShowLegalModal(true); }}
                  className="text-[#3DAEDB] underline hover:text-[#2A9BC8]"
                >
                  Terms of Service
                </button>
              </span>
            </label>

            <label className="flex items-start">
              <input
                type="checkbox"
                name="privacyAccepted"
                checked={formData.privacyAccepted}
                onChange={handleInputChange}
                className="mt-1 h-4 w-4 text-[#1C3D6E] focus:ring-[#3DAEDB] rounded"
                required
              />
              <span className="ml-2 text-sm text-gray-700">
                I have read and accept the{' '}
                <button
                  type="button"
                  onClick={() => { setLegalDocument('privacy'); setShowLegalModal(true); }}
                  className="text-[#3DAEDB] underline hover:text-[#2A9BC8]"
                >
                  Privacy Policy
                </button>
              </span>
            </label>
          </div>
        )}
      </div>
    </div>
  )

  const renderSection2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-[#1C3D6E]">Accessibility & Support</h3>

      {/* PWD Status */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="isPWD"
            checked={formData.isPWD}
            onChange={handleInputChange}
            className="h-5 w-5 text-[#1C3D6E] focus:ring-[#3DAEDB] rounded"
          />
          <span className="ml-3 text-sm font-medium text-[#1C3D6E]">
            I am a Person with Disability (PWD)
          </span>
        </label>

        {formData.isPWD && (
          <div className="mt-4">
            <label htmlFor="impairmentType" className="block text-sm font-semibold text-[#1C3D6E] mb-2">
              Type of Impairment *
            </label>
            <select
              id="impairmentType" name="impairmentType" required
              value={formData.impairmentType} onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3DAEDB] focus:border-[#3DAEDB]"
            >
              <option value="">Select Impairment Type</option>
              {impairmentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Parent/Guardian Info */}
      {formData.requiresParentInfo && (
        <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
          <h4 className="font-semibold text-[#1C3D6E] mb-4">
            Parent/Guardian Information *
            <p className="text-sm font-normal text-gray-600 mt-1">
              {age < 18 && !formData.isPWD && 'Required for users under 18'}
              {age >= 18 && formData.isPWD && 'Required for all PWD users'}
              {age < 18 && formData.isPWD && 'Required for users under 18 and PWD users'}
            </p>
          </h4>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-[#1C3D6E] mb-2">
                Full Name *
              </label>
              <input
                name="parentGuardian.name" type="text" required
                value={formData.parentGuardian.name} onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3DAEDB] focus:border-[#3DAEDB]"
                placeholder="Parent/Guardian name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1C3D6E] mb-2">
                Relationship *
              </label>
              <select
                name="parentGuardian.relationship" required
                value={formData.parentGuardian.relationship} onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3DAEDB] focus:border-[#3DAEDB]"
              >
                <option value="">Select Relationship</option>
                <option value="parent">Parent</option>
                <option value="guardian">Guardian</option>
                <option value="sibling">Sibling</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1C3D6E] mb-2">
                Email *
              </label>
              <input
                name="parentGuardian.email" type="email" required
                value={formData.parentGuardian.email} onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3DAEDB] focus:border-[#3DAEDB]"
                placeholder="parent@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1C3D6E] mb-2">
                Phone *
              </label>
              <input
                name="parentGuardian.phone" type="tel" required
                value={formData.parentGuardian.phone} onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3DAEDB] focus:border-[#3DAEDB]"
                placeholder="+254..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const renderSection3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-[#1C3D6E]">Education & Profile Photo</h3>

      {/* Profile Photo */}
      <div>
        <label className="block text-sm font-semibold text-[#1C3D6E] mb-3">
          Profile Photo (Passport Size)
        </label>

        <div className="flex items-center gap-4">
          <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <Image className="w-12 h-12 text-gray-400" />
            )}
          </div>

          <div>
            <input
              type="file"
              id="profilePhoto"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <label
              htmlFor="profilePhoto"
              className="inline-flex items-center px-4 py-2 bg-[#3DAEDB] text-white rounded-lg cursor-pointer hover:bg-[#2A9BC8]"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Photo
            </label>
            <p className="text-xs text-gray-500 mt-2">Max 5MB, JPG/PNG</p>
          </div>
        </div>
      </div>

      {/* Education Level */}
      <div>
        <label htmlFor="educationLevel" className="block text-sm font-semibold text-[#1C3D6E] mb-2">
          Current Education Level *
        </label>
        <select
          id="educationLevel" name="educationLevel" required
          value={formData.educationLevel} onChange={handleInputChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#3DAEDB] focus:border-[#3DAEDB]"
        >
          <option value="">Select Education Level</option>
          {educationLevels.map(level => (
            <option key={level} value={level}>{level}</option>
          ))}
        </select>
      </div>

      {/* Education Documents */}
      <div>
        <label className="block text-sm font-semibold text-[#1C3D6E] mb-3">
          Education Documents (Certificates, Diplomas, Transcripts)
        </label>

        <input
          type="file"
          id="educationDocs"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleDocumentUpload}
          className="hidden"
        />
        <label
          htmlFor="educationDocs"
          className="inline-flex items-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#3DAEDB] hover:bg-blue-50"
        >
          <Upload className="w-5 h-5 mr-2 text-gray-600" />
          <span className="text-sm text-gray-700">Upload Documents (PDF, JPG, PNG - Max 10MB each)</span>
        </label>

        {formData.educationDocuments.length > 0 && (
          <div className="mt-3 space-y-2">
            {formData.educationDocuments.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-700 truncate flex-1">{doc.name}</span>
                <button
                  type="button"
                  onClick={() => removeDocument(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  const renderSection4 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-[#1C3D6E]">Hobbies, Talents & Consent</h3>

      {/* Hobbies */}
      <div>
        <label className="block text-sm font-semibold text-[#1C3D6E] mb-3">
          Hobbies (Select all that apply)
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {commonHobbies.map((hobby) => (
            <label key={hobby} className="flex items-center p-3 rounded-lg border-2 border-gray-200 hover:border-[#3DAEDB] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hobbies.includes(hobby)}
                onChange={() => handleToggle('hobbies', hobby)}
                className="h-4 w-4 text-[#1C3D6E] focus:ring-[#3DAEDB] rounded"
              />
              <span className="ml-2 text-sm">{hobby}</span>
            </label>
          ))}
        </div>

        <input
          type="text"
          name="customHobby"
          value={formData.customHobby}
          onChange={handleInputChange}
          placeholder="Other hobby (optional)"
          className="mt-3 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3DAEDB] focus:border-[#3DAEDB]"
        />
      </div>

      {/* Talents */}
      <div>
        <label className="block text-sm font-semibold text-[#1C3D6E] mb-3">
          Talents (Select all that apply)
        </label>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {commonTalents.map((talent) => (
            <label key={talent} className="flex items-center p-3 rounded-lg border-2 border-gray-200 hover:border-[#3DAEDB] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.talents.includes(talent)}
                onChange={() => handleToggle('talents', talent)}
                className="h-4 w-4 text-[#1C3D6E] focus:ring-[#3DAEDB] rounded"
              />
              <span className="ml-2 text-sm">{talent}</span>
            </label>
          ))}
        </div>

        <input
          type="text"
          name="customTalent"
          value={formData.customTalent}
          onChange={handleInputChange}
          placeholder="Other talent (optional)"
          className="mt-3 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#3DAEDB] focus:border-[#3DAEDB]"
        />
      </div>

      {/* Consents */}
      <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6 space-y-4">
        <h4 className="font-semibold text-[#1C3D6E] mb-3">Data Usage & Consent</h4>

        <label className="flex items-start cursor-pointer">
          <input
            type="checkbox"
            name="dataConsentAccepted"
            checked={formData.dataConsentAccepted}
            onChange={handleInputChange}
            className="mt-1 h-4 w-4 text-[#1C3D6E] focus:ring-[#3DAEDB] rounded"
            required
          />
          <span className="ml-3 text-sm text-gray-700">
            <strong className="text-[#1C3D6E]">Data Consent *</strong><br />
            I consent to TFDN collecting and processing my personal data for educational purposes, career guidance, and program improvement as described in the Privacy Policy.
          </span>
        </label>

        <label className="flex items-start cursor-pointer">
          <input
            type="checkbox"
            name="mediaConsentAccepted"
            checked={formData.mediaConsentAccepted}
            onChange={handleInputChange}
            className="mt-1 h-4 w-4 text-[#1C3D6E] focus:ring-[#3DAEDB] rounded"
          />
          <span className="ml-3 text-sm text-gray-700">
            <strong className="text-[#1C3D6E]">Media Consent</strong><br />
            I consent to TFDN using my photos and success stories for program promotion and impact reporting (your identity can be anonymized upon request).
          </span>
        </label>

        <label className="flex items-start cursor-pointer">
          <input
            type="checkbox"
            name="newsletterOptIn"
            checked={formData.newsletterOptIn}
            onChange={handleInputChange}
            className="mt-1 h-4 w-4 text-[#1C3D6E] focus:ring-[#3DAEDB] rounded"
          />
          <span className="ml-3 text-sm text-gray-700">
            <strong className="text-[#1C3D6E]">Newsletter</strong><br />
            Yes, I would like to receive updates about new courses, opportunities, and TFDN programs via email.
          </span>
        </label>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-['Inter'] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <OnboardingProgress currentStep={2} totalSteps={6} stepLabels={stepLabels} />

        <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
          <button
            onClick={() => navigate('/onboarding/age-verification')}
            className="flex items-center text-[#1C3D6E] hover:text-[#3DAEDB] transition-colors mb-4"
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
              Section {currentSection} of 4: {['Basic Information', 'Accessibility & Support', 'Education & Photo', 'Hobbies & Consent'][currentSection - 1]}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={currentSection === 4 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
              {currentSection === 1 && renderSection1()}
              {currentSection === 2 && renderSection2()}
              {currentSection === 3 && renderSection3()}
              {currentSection === 4 && renderSection4()}

              <div className="mt-8 flex gap-4">
                {currentSection > 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentSection(prev => prev - 1)}
                    className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50"
                  >
                    <ArrowLeft className="w-5 h-5 inline mr-2" />
                    Previous
                  </button>
                )}

                <button
                  type="submit"
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-[#3DAEDB] to-[#2C857A] text-white rounded-xl font-semibold hover:shadow-lg"
                >
                  {currentSection === 4 ? 'Complete Profile' : 'Next Section'}
                  <ArrowRight className="w-5 h-5 inline ml-2" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Legal Document Modal */}
      {showLegalModal && (
        <LegalDocumentModal
          isOpen={showLegalModal}
          onClose={() => setShowLegalModal(false)}
          document={legalDocument}
          content={legalDocument === 'terms' ? TERMS_OF_SERVICE : PRIVACY_POLICY}
          onAccept={handleLegalAccept}
          requiresAcceptance={true}
        />
      )}
    </div>
  )
}

export default EnhancedProfileSetup
