import { useState } from 'react'
import { Link } from 'react-router-dom'

interface ProfileData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  bio: string
  location: string
  interests: string[]
  socialLinks: {
    github: string
    linkedin: string
    twitter: string
  }
}

const StudentProfile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1998-05-15',
    bio: 'Passionate web developer with a keen interest in modern JavaScript frameworks and user experience design.',
    location: 'San Francisco, CA',
    interests: ['React', 'Node.js', 'UI/UX Design', 'Machine Learning'],
    socialLinks: {
      github: 'https://github.com/johndoe',
      linkedin: 'https://linkedin.com/in/johndoe',
      twitter: 'https://twitter.com/johndoe'
    }
  })

  const achievements = [
    {
      id: 1,
      title: 'JavaScript Master',
      description: 'Completed 10 JavaScript courses',
      icon: '🏆',
      date: '2024-01-15',
      category: 'Programming'
    },
    {
      id: 2,
      title: 'React Specialist',
      description: 'Built 5 React applications',
      icon: '⚛️',
      date: '2024-02-20',
      category: 'Frontend'
    },
    {
      id: 3,
      title: 'Learning Streak',
      description: '30 days of continuous learning',
      icon: '🔥',
      date: '2024-03-01',
      category: 'Consistency'
    }
  ]

  const recentActivity = [
    {
      id: 1,
      action: 'Completed course',
      target: 'React Hooks Deep Dive',
      timestamp: '2 hours ago',
      icon: '✅'
    },
    {
      id: 2,
      action: 'Earned badge',
      target: 'Component Architecture Expert',
      timestamp: '1 day ago',
      icon: '🏅'
    },
    {
      id: 3,
      action: 'Started course',
      target: 'Advanced TypeScript',
      timestamp: '3 days ago',
      icon: '▶️'
    }
  ]

  const learningStats = [
    { label: 'Courses Completed', value: '15', color: 'bg-primary-dark' },
    { label: 'Hours Learned', value: '168', color: 'bg-primary-dark' },
    { label: 'Certificates Earned', value: '8', color: 'bg-primary-dark' },
    { label: 'Projects Built', value: '12', color: 'bg-primary-dark' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.startsWith('social.')) {
      const socialKey = name.split('.')[1] as keyof typeof profileData.socialLinks
      setProfileData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialKey]: value
        }
      }))
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSave = () => {
    setIsEditing(false)
  }

  const handleCancel = () => {
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] via-white to-[#2C857A]/10">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                to="/student/dashboard"
                className="mr-4 text-[#2C857A] hover:text-[#236660] font-medium transition-colors duration-200 flex items-center"
              >
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-[#1C3D6E]">My Profile</h1>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-primary"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-2xl shadow-xl border-0 p-8 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl font-bold text-[#1C3D6E] mb-8 flex items-center">
                <span className="text-3xl mr-3">👤</span>
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#1C3D6E] mb-2">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3DAEDB] focus:border-[#3DAEDB] transition-all duration-200"
                    />
                  ) : (
                    <p className="text-[#333333] font-medium">{profileData.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#1C3D6E] mb-2">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.lastName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-gray-900">{profileData.location}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={profileData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  ) : (
                    <p className="text-gray-900">{new Date(profileData.dateOfBirth).toLocaleDateString()}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    rows={4}
                    value={profileData.bio}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <p className="text-gray-900">{profileData.bio}</p>
                )}
              </div>

              {isEditing && (
                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={handleSave}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Learning Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Learning Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {learningStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-16 h-16 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <span className="text-2xl font-bold text-white">{stat.value}</span>
                    </div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <span className="text-2xl">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="text-gray-900">
                        <span className="font-medium">{activity.action}</span> {activity.target}
                      </p>
                      <p className="text-sm text-gray-500">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl text-gray-600">👤</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">
                {profileData.firstName} {profileData.lastName}
              </h3>
              <p className="text-gray-600 mt-1">Student</p>
              {isEditing && (
                <button className="mt-3 text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                  Change Photo
                </button>
              )}
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                {achievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-start space-x-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">{achievement.title}</h4>
                      <p className="text-xs text-gray-600">{achievement.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(achievement.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                View All Achievements
              </button>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
              <div className="space-y-3">
                {Object.entries(profileData.socialLinks).map(([platform, url]) => (
                  <div key={platform}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                      {platform}
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name={`social.${platform}`}
                        value={url}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                    ) : (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-500 text-sm break-all"
                      >
                        {url}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default StudentProfile