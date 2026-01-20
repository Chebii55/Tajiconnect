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
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-darkMode-bg dark:via-darkMode-surface dark:to-darkMode-bg">
      {/* Header */}
      <header className="bg-white dark:bg-darkMode-navbar shadow-lg dark:shadow-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                to="/student/dashboard"
                className="mr-4 text-forest-sage hover:text-forest-deep dark:text-darkMode-link dark:hover:text-darkMode-accent font-medium transition-colors duration-200 flex items-center"
              >
                <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-primary-dark dark:text-darkMode-text">My Profile</h1>
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
            <div className="bg-white dark:bg-darkMode-surface rounded-2xl shadow-xl dark:shadow-dark border-0 p-8 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-8 flex items-center">
                <span className="text-3xl mr-3">👤</span>
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-primary-dark dark:text-darkMode-text mb-2">First Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-darkMode-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-darkMode-bg dark:text-darkMode-text transition-all duration-200"
                    />
                  ) : (
                    <p className="text-neutral-dark dark:text-darkMode-textSecondary font-medium">{profileData.firstName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-primary-dark dark:text-darkMode-text mb-2">Last Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-darkMode-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkMode-bg dark:text-darkMode-text"
                    />
                  ) : (
                    <p className="text-neutral-dark dark:text-darkMode-textSecondary">{profileData.lastName}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-dark/80 dark:text-darkMode-textSecondary mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkMode-bg dark:text-darkMode-text"
                    />
                  ) : (
                    <p className="text-neutral-dark dark:text-darkMode-text">{profileData.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-dark/80 dark:text-darkMode-textSecondary mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkMode-bg dark:text-darkMode-text"
                    />
                  ) : (
                    <p className="text-neutral-dark dark:text-darkMode-text">{profileData.phone}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-dark/80 dark:text-darkMode-textSecondary mb-2">Location</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkMode-bg dark:text-darkMode-text"
                    />
                  ) : (
                    <p className="text-neutral-dark dark:text-darkMode-text">{profileData.location}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-dark/80 dark:text-darkMode-textSecondary mb-2">Date of Birth</label>
                  {isEditing ? (
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={profileData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkMode-bg dark:text-darkMode-text"
                    />
                  ) : (
                    <p className="text-neutral-dark dark:text-darkMode-text">{new Date(profileData.dateOfBirth).toLocaleDateString()}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-neutral-dark/80 dark:text-darkMode-textSecondary mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    name="bio"
                    rows={4}
                    value={profileData.bio}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkMode-bg dark:text-darkMode-text"
                  />
                ) : (
                  <p className="text-neutral-dark dark:text-darkMode-text">{profileData.bio}</p>
                )}
              </div>

              {isEditing && (
                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={handleSave}
                    className="bg-primary dark:bg-darkMode-progress hover:bg-primary-dark dark:hover:bg-darkMode-success text-white px-4 py-2 rounded-md font-medium"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-300 hover:bg-gray-400 text-neutral-dark/80 dark:text-darkMode-textSecondary px-4 py-2 rounded-md font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Learning Stats */}
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow dark:shadow-dark p-6">
              <h2 className="text-xl font-semibold text-neutral-dark dark:text-darkMode-text mb-6">Learning Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {learningStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-16 h-16 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <span className="text-2xl font-bold text-white">{stat.value}</span>
                    </div>
                    <p className="text-sm text-neutral-dark/70 dark:text-darkMode-textSecondary">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow dark:shadow-dark p-6">
              <h2 className="text-xl font-semibold text-neutral-dark dark:text-darkMode-text mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3">
                    <span className="text-2xl">{activity.icon}</span>
                    <div className="flex-1">
                      <p className="text-neutral-dark dark:text-darkMode-text">
                        <span className="font-medium">{activity.action}</span> {activity.target}
                      </p>
                      <p className="text-sm text-neutral-dark/60 dark:text-darkMode-textMuted">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow dark:shadow-dark p-6 text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl text-neutral-dark/70 dark:text-darkMode-textSecondary">👤</span>
              </div>
              <h3 className="text-xl font-semibold text-neutral-dark dark:text-darkMode-text">
                {profileData.firstName} {profileData.lastName}
              </h3>
              <p className="text-neutral-dark/70 dark:text-darkMode-textSecondary mt-1">Student</p>
              {isEditing && (
                <button className="mt-3 text-primary dark:text-darkMode-link hover:text-primary-light dark:hover:text-darkMode-accent text-sm font-medium">
                  Change Photo
                </button>
              )}
            </div>

            {/* Achievements */}
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow dark:shadow-dark p-6">
              <h3 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                {achievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-start space-x-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <h4 className="font-medium text-neutral-dark dark:text-darkMode-text text-sm">{achievement.title}</h4>
                      <p className="text-xs text-neutral-dark/70 dark:text-darkMode-textSecondary">{achievement.description}</p>
                      <p className="text-xs text-neutral-dark/60 dark:text-darkMode-textMuted mt-1">{new Date(achievement.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-primary dark:text-darkMode-link hover:text-primary-light dark:hover:text-darkMode-accent text-sm font-medium">
                View All Achievements
              </button>
            </div>

            {/* Social Links */}
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow dark:shadow-dark p-6">
              <h3 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-4">Social Links</h3>
              <div className="space-y-3">
                {Object.entries(profileData.socialLinks).map(([platform, url]) => (
                  <div key={platform}>
                    <label className="block text-sm font-medium text-neutral-dark/80 dark:text-darkMode-textSecondary mb-1 capitalize">
                      {platform}
                    </label>
                    {isEditing ? (
                      <input
                        type="url"
                        name={`social.${platform}`}
                        value={url}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkMode-bg dark:text-darkMode-text text-sm"
                      />
                    ) : (
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary dark:text-darkMode-link hover:text-primary-light dark:hover:text-darkMode-accent text-sm break-all"
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