import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { handleApiError } from '../../utils/errorHandler'
import { getUserId } from '../../utils/auth'
import userService from '../../services/api/user'
import type { Achievement, UserProfile } from '../../services/api/user'
import type { User } from '../../services/api/auth'

interface ProfileFormState {
  first_name: string
  last_name: string
  email: string
  phone: string
}

interface ProfileExtrasState {
  bio: string
  location: string
  website: string
  linkedin_url: string
  github_url: string
}

const StudentProfile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [userForm, setUserForm] = useState<ProfileFormState>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  })

  const [profileForm, setProfileForm] = useState<ProfileExtrasState>({
    bio: '',
    location: '',
    website: '',
    linkedin_url: '',
    github_url: '',
  })

  const userId = getUserId()

  useEffect(() => {
    if (!userId) {
      setError('Please sign in to view your profile.')
      return
    }

    const loadProfile = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const [currentUser, achievementsData] = await Promise.all([
          userService.getCurrentUser(),
          userService.getUserAchievements(userId),
        ])

        let profileData: UserProfile | null = null
        try {
          profileData = await userService.getProfile()
        } catch (profileErr: any) {
          const message = handleApiError(profileErr)
          if (!message.toLowerCase().includes('not found')) {
            throw profileErr
          }
        }

        setUser(currentUser)
        setProfile(profileData)
        setAchievements(achievementsData)

        setUserForm({
          first_name: currentUser.first_name || '',
          last_name: currentUser.last_name || '',
          email: currentUser.email || '',
          phone: currentUser.phone || '',
        })

        setProfileForm({
          bio: profileData?.bio || '',
          location: profileData?.location || '',
          website: profileData?.website || '',
          linkedin_url: profileData?.linkedin_url || '',
          github_url: profileData?.github_url || '',
        })
      } catch (err: any) {
        setError(handleApiError(err))
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [userId])

  const learningStats = useMemo(() => {
    return [
      { label: 'Courses Completed', value: profile?.total_courses_completed ?? 0 },
      { label: 'Hours Learned', value: profile?.total_hours_learned ?? 0 },
      { label: 'Current Streak', value: profile?.current_streak ?? 0 },
      { label: 'Total Points', value: profile?.total_points ?? 0 },
    ]
  }, [profile])

  const handleSave = async () => {
    if (!userId) return

    setError(null)
    setIsLoading(true)

    try {
      const [updatedUser] = await Promise.all([
        userService.updateCurrentUser({
          first_name: userForm.first_name,
          last_name: userForm.last_name,
          phone: userForm.phone || undefined,
        }),
        profile
          ? userService.updateProfile({
              bio: profileForm.bio || undefined,
              location: profileForm.location || undefined,
              website: profileForm.website || undefined,
              linkedin_url: profileForm.linkedin_url || undefined,
              github_url: profileForm.github_url || undefined,
            })
          : userService.createProfile({
              bio: profileForm.bio || undefined,
              location: profileForm.location || undefined,
              website: profileForm.website || undefined,
              linkedin_url: profileForm.linkedin_url || undefined,
              github_url: profileForm.github_url || undefined,
            }),
      ])

      setUser(updatedUser)
      const updatedProfile = await userService.getProfile()
      setProfile(updatedProfile)
      setIsEditing(false)
    } catch (err: any) {
      setError(handleApiError(err))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    if (user) {
      setUserForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
      })
    }
    setProfileForm({
      bio: profile?.bio || '',
      location: profile?.location || '',
      website: profile?.website || '',
      linkedin_url: profile?.linkedin_url || '',
      github_url: profile?.github_url || '',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-darkMode-bg dark:via-darkMode-surface dark:to-darkMode-bg">
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
              onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
              className="btn-primary"
              disabled={isLoading}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-sm text-red-700 dark:text-red-300">
            {error}
          </div>
        )}

        {isLoading && !user ? (
          <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow p-6 text-center text-gray-600 dark:text-gray-300">
            Loading profile...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
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
                        value={userForm.first_name}
                        onChange={(e) => setUserForm((prev) => ({ ...prev, first_name: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-darkMode-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary dark:bg-darkMode-bg dark:text-darkMode-text transition-all duration-200"
                      />
                    ) : (
                      <p className="text-neutral-dark dark:text-darkMode-textSecondary font-medium">{userForm.first_name || '—'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-primary-dark dark:text-darkMode-text mb-2">Last Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={userForm.last_name}
                        onChange={(e) => setUserForm((prev) => ({ ...prev, last_name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-darkMode-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkMode-bg dark:text-darkMode-text"
                      />
                    ) : (
                      <p className="text-neutral-dark dark:text-darkMode-textSecondary">{userForm.last_name || '—'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark/80 dark:text-darkMode-textSecondary mb-2">Email</label>
                    <p className="text-neutral-dark dark:text-darkMode-text">{userForm.email || '—'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark/80 dark:text-darkMode-textSecondary mb-2">Phone</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={userForm.phone}
                        onChange={(e) => setUserForm((prev) => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkMode-bg dark:text-darkMode-text"
                      />
                    ) : (
                      <p className="text-neutral-dark dark:text-darkMode-text">{userForm.phone || '—'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark/80 dark:text-darkMode-textSecondary mb-2">Location</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileForm.location}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, location: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkMode-bg dark:text-darkMode-text"
                      />
                    ) : (
                      <p className="text-neutral-dark dark:text-darkMode-text">{profileForm.location || '—'}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-neutral-dark/80 dark:text-darkMode-textSecondary mb-2">Bio</label>
                  {isEditing ? (
                    <textarea
                      rows={4}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm((prev) => ({ ...prev, bio: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkMode-bg dark:text-darkMode-text"
                    />
                  ) : (
                    <p className="text-neutral-dark dark:text-darkMode-text">{profileForm.bio || 'No bio provided.'}</p>
                  )}
                </div>

                {isEditing && (
                  <div className="mt-6 flex space-x-3">
                    <button
                      onClick={handleSave}
                      className="bg-primary dark:bg-darkMode-progress hover:bg-primary-dark dark:hover:bg-darkMode-success text-white px-4 py-2 rounded-md font-medium"
                      disabled={isLoading}
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-300 hover:bg-gray-400 text-neutral-dark/80 dark:text-darkMode-textSecondary px-4 py-2 rounded-md font-medium"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow dark:shadow-dark p-6">
                <h2 className="text-xl font-semibold text-neutral-dark dark:text-darkMode-text mb-6">Learning Statistics</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {learningStats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="w-16 h-16 bg-primary-dark rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-2xl font-bold text-white">{stat.value}</span>
                      </div>
                      <p className="text-sm text-neutral-dark/70 dark:text-darkMode-textSecondary">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow dark:shadow-dark p-6">
                <h2 className="text-xl font-semibold text-neutral-dark dark:text-darkMode-text mb-6">Recent Activity</h2>
                <p className="text-sm text-neutral-dark/60 dark:text-darkMode-textMuted">
                  Activity feed is not yet available from the backend.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow dark:shadow-dark p-6 text-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl text-neutral-dark/70 dark:text-darkMode-textSecondary">👤</span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-neutral-dark dark:text-darkMode-text">
                  {userForm.first_name || '—'} {userForm.last_name || ''}
                </h3>
                <p className="text-neutral-dark/70 dark:text-darkMode-textSecondary mt-1">Student</p>
              </div>

              <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow dark:shadow-dark p-6">
                <h3 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-4">Recent Achievements</h3>
                {achievements.length === 0 ? (
                  <p className="text-sm text-neutral-dark/60 dark:text-darkMode-textMuted">No achievements yet.</p>
                ) : (
                  <div className="space-y-3">
                    {achievements.slice(0, 3).map((achievement) => (
                      <div key={achievement.id} className="flex items-start space-x-3">
                        <span className="text-2xl">🏆</span>
                        <div>
                          <h4 className="font-medium text-neutral-dark dark:text-darkMode-text text-sm">
                            {achievement.title}
                          </h4>
                          {achievement.description && (
                            <p className="text-xs text-neutral-dark/70 dark:text-darkMode-textSecondary">{achievement.description}</p>
                          )}
                          <p className="text-xs text-neutral-dark/60 dark:text-darkMode-textMuted mt-1">
                            {new Date(achievement.earned_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button className="mt-4 text-primary dark:text-darkMode-link hover:text-primary-light dark:hover:text-darkMode-accent text-sm font-medium">
                  View All Achievements
                </button>
              </div>

              <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow dark:shadow-dark p-6">
                <h3 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-4">Social Links</h3>
                <div className="space-y-3">
                  {(
                    [
                      { label: 'Website', key: 'website' },
                      { label: 'LinkedIn', key: 'linkedin_url' },
                      { label: 'GitHub', key: 'github_url' },
                    ] as const
                  ).map((entry) => (
                    <div key={entry.key}>
                      <label className="block text-sm font-medium text-neutral-dark/80 dark:text-darkMode-textSecondary mb-1">
                        {entry.label}
                      </label>
                      {isEditing ? (
                        <input
                          type="url"
                          value={profileForm[entry.key]}
                          onChange={(e) => setProfileForm((prev) => ({ ...prev, [entry.key]: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-darkMode-bg dark:text-darkMode-text text-sm"
                        />
                      ) : profileForm[entry.key] ? (
                        <a
                          href={profileForm[entry.key]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary dark:text-darkMode-link hover:text-primary-light dark:hover:text-darkMode-accent text-sm break-all"
                        >
                          {profileForm[entry.key]}
                        </a>
                      ) : (
                        <p className="text-sm text-neutral-dark/60 dark:text-darkMode-textMuted">Not provided</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default StudentProfile
