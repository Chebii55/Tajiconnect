import { useState, useEffect } from 'react'
import { Save, User, BookOpen, Heart, Award } from 'lucide-react'

const ProfileSettings = () => {
  const [profileData, setProfileData] = useState({
    educationLevel: '',
    interests: [],
    hobbies: [],
    talents: [],
    phone: '',
    gender: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      const userId = localStorage.getItem('userId')
      const response = await fetch(`/api/users/${userId}/profile`)
      if (response.ok) {
        const data = await response.json()
        setProfileData({
          educationLevel: data.educationLevel || '',
          interests: data.interests || [],
          hobbies: data.hobbies || [],
          talents: data.talents || [],
          phone: data.phone || '',
          gender: data.gender || ''
        })
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
    }
  }

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field, value, checked) => {
    const currentArray = profileData[field] || []
    const newArray = checked 
      ? [...currentArray, value]
      : currentArray.filter(item => item !== value)
    setProfileData(prev => ({ ...prev, [field]: newArray }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    setNotification(null)

    try {
      const userId = localStorage.getItem('userId')
      const response = await fetch(`/api/users/${userId}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      })

      if (response.ok) {
        setNotification({
          type: 'success',
          message: 'Profile updated successfully!'
        })
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to update profile. Please try again.'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <User className="w-6 h-6 text-blue-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        </div>

        {notification && (
          <div className={`mb-6 p-4 rounded-lg ${
            notification.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {notification.message}
          </div>
        )}

        <div className="space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="tel"
                placeholder="Phone Number"
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={profileData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>

          {/* Education */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Education
            </h2>
            <select
              value={profileData.educationLevel}
              onChange={(e) => handleInputChange('educationLevel', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Education Level</option>
              <option value="primary">Primary School</option>
              <option value="secondary">Secondary School</option>
              <option value="high-school">High School</option>
              <option value="diploma">Diploma</option>
              <option value="bachelor">Bachelor's Degree</option>
              <option value="master">Master's Degree</option>
              <option value="phd">PhD</option>
            </select>
          </div>

          {/* Interests */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Heart className="w-5 h-5 mr-2" />
              Interests
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['Technology', 'Business', 'Healthcare', 'Education', 'Arts', 'Science', 'Sports', 'Music', 'Writing', 'Engineering', 'Marketing', 'Finance'].map((interest) => (
                <label key={interest} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={profileData.interests.includes(interest)}
                    onChange={(e) => handleArrayChange('interests', interest, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm">{interest}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Hobbies & Talents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Hobbies</h2>
              <div className="space-y-2">
                {['Reading', 'Gaming', 'Cooking', 'Traveling', 'Photography', 'Coding', 'Sports', 'Music'].map((hobby) => (
                  <label key={hobby} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={profileData.hobbies.includes(hobby)}
                      onChange={(e) => handleArrayChange('hobbies', hobby, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{hobby}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Talents
              </h2>
              <div className="space-y-2">
                {['Public Speaking', 'Leadership', 'Problem Solving', 'Creativity', 'Communication', 'Analysis', 'Teaching', 'Organization'].map((talent) => (
                  <label key={talent} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={profileData.talents.includes(talent)}
                      onChange={(e) => handleArrayChange('talents', talent, e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{talent}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettings
