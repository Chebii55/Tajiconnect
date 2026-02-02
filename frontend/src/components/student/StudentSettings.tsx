import { useState } from 'react'
import { Link } from 'react-router-dom'
import LeaderboardSettings from '../settings/LeaderboardSettings'

interface NotificationSettings {
  emailNotifications: boolean
  pushNotifications: boolean
  courseReminders: boolean
  achievementAlerts: boolean
  weeklyProgress: boolean
  marketingEmails: boolean
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends'
  showProgress: boolean
  showAchievements: boolean
  allowMessages: boolean
}

interface AccountSettings {
  language: string
  timezone: string
  theme: 'light' | 'dark' | 'auto'
  autoPlay: boolean
  subtitles: boolean
}

const StudentSettings = () => {
  const [activeTab, setActiveTab] = useState<'account' | 'notifications' | 'privacy' | 'security' | 'competition'>('account')

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    courseReminders: true,
    achievementAlerts: true,
    weeklyProgress: false,
    marketingEmails: false
  })

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showProgress: true,
    showAchievements: true,
    allowMessages: true
  })

  const [accountSettings, setAccountSettings] = useState<AccountSettings>({
    language: 'en',
    timezone: 'America/New_York',
    theme: 'light',
    autoPlay: true,
    subtitles: false
  })

  const [showChangePassword, setShowChangePassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handlePrivacyChange = (key: keyof PrivacySettings, value: string | boolean) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleAccountChange = (key: keyof AccountSettings, value: string | boolean) => {
    setAccountSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    alert('Password changed successfully')
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setShowChangePassword(false)
  }

  const handleSave = () => {
    alert('Settings saved successfully!')
  }

  const handleDeactivateAccount = () => {
    if (window.confirm('Are you sure you want to deactivate your account? This action cannot be undone.')) {
      alert('Account deactivation requested. You will receive an email confirmation.')
    }
  }

  const tabs = [
    { id: 'account', label: 'Account', icon: '⚙️' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'security', label: 'Security', icon: '🛡️' },
    { id: 'competition', label: 'Competition', icon: '🏆' }
  ] as const

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg">
      {/* Header */}
      <header className="bg-white dark:bg-darkMode-navbar shadow dark:shadow-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                to="/student/dashboard"
                className="mr-4 text-primary dark:text-darkMode-link hover:text-primary-light dark:hover:text-darkMode-accent"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl font-bold text-neutral-dark dark:text-darkMode-text">Settings</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white dark:bg-darkMode-surface rounded-lg shadow dark:shadow-dark p-4">
              <ul className="space-y-2">
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary/10 text-primary dark:bg-darkMode-accent/20 dark:text-darkMode-accent border border-primary/30 dark:border-darkMode-accent/30'
                          : 'text-neutral-dark/80 dark:text-darkMode-textSecondary hover:bg-neutral-gray dark:hover:bg-darkMode-surfaceHover'
                      }`}
                    >
                      <span className="mr-3">{tab.icon}</span>
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow dark:shadow-dark">
              {/* Account Settings */}
              {activeTab === 'account' && (
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-neutral-dark dark:text-darkMode-text mb-6">Account Settings</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark/80 dark:text-darkMode-textSecondary mb-2">Language</label>
                      <select
                        value={accountSettings.language}
                        onChange={(e) => handleAccountChange('language', e.target.value)}
                        className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark/80 dark:text-darkMode-textSecondary mb-2">Timezone</label>
                      <select
                        value={accountSettings.timezone}
                        onChange={(e) => handleAccountChange('timezone', e.target.value)}
                        className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark/80 dark:text-darkMode-textSecondary mb-2">Theme</label>
                      <select
                        value={accountSettings.theme}
                        onChange={(e) => handleAccountChange('theme', e.target.value)}
                        className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-neutral-dark dark:text-darkMode-text">Video Settings</h3>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={accountSettings.autoPlay}
                          onChange={(e) => handleAccountChange('autoPlay', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-primary border-gray-300 dark:border-darkMode-border dark:bg-darkMode-bg rounded"
                        />
                        <span className="ml-2 text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">Auto-play videos</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={accountSettings.subtitles}
                          onChange={(e) => handleAccountChange('subtitles', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-primary border-gray-300 dark:border-darkMode-border dark:bg-darkMode-bg rounded"
                        />
                        <span className="ml-2 text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">Show subtitles by default</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-neutral-dark dark:text-darkMode-text mb-6">Notification Settings</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-neutral-dark dark:text-darkMode-text mb-3">General Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <span className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">Email notifications</span>
                          <input
                            type="checkbox"
                            checked={notificationSettings.emailNotifications}
                            onChange={() => handleNotificationChange('emailNotifications')}
                            className="h-4 w-4 text-indigo-600 focus:ring-primary border-gray-300 dark:border-darkMode-border dark:bg-darkMode-bg rounded"
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">Push notifications</span>
                          <input
                            type="checkbox"
                            checked={notificationSettings.pushNotifications}
                            onChange={() => handleNotificationChange('pushNotifications')}
                            className="h-4 w-4 text-indigo-600 focus:ring-primary border-gray-300 dark:border-darkMode-border dark:bg-darkMode-bg rounded"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-neutral-dark dark:text-darkMode-text mb-3">Learning Notifications</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between">
                          <span className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">Course reminders</span>
                          <input
                            type="checkbox"
                            checked={notificationSettings.courseReminders}
                            onChange={() => handleNotificationChange('courseReminders')}
                            className="h-4 w-4 text-indigo-600 focus:ring-primary border-gray-300 dark:border-darkMode-border dark:bg-darkMode-bg rounded"
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">Achievement alerts</span>
                          <input
                            type="checkbox"
                            checked={notificationSettings.achievementAlerts}
                            onChange={() => handleNotificationChange('achievementAlerts')}
                            className="h-4 w-4 text-indigo-600 focus:ring-primary border-gray-300 dark:border-darkMode-border dark:bg-darkMode-bg rounded"
                          />
                        </label>
                        <label className="flex items-center justify-between">
                          <span className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">Weekly progress reports</span>
                          <input
                            type="checkbox"
                            checked={notificationSettings.weeklyProgress}
                            onChange={() => handleNotificationChange('weeklyProgress')}
                            className="h-4 w-4 text-indigo-600 focus:ring-primary border-gray-300 dark:border-darkMode-border dark:bg-darkMode-bg rounded"
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium text-neutral-dark dark:text-darkMode-text mb-3">Marketing</h3>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">Marketing emails</span>
                        <input
                          type="checkbox"
                          checked={notificationSettings.marketingEmails}
                          onChange={() => handleNotificationChange('marketingEmails')}
                          className="h-4 w-4 text-indigo-600 focus:ring-primary border-gray-300 dark:border-darkMode-border dark:bg-darkMode-bg rounded"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Settings */}
              {activeTab === 'privacy' && (
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-neutral-dark dark:text-darkMode-text mb-6">Privacy Settings</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark/80 dark:text-darkMode-textSecondary mb-2">Profile Visibility</label>
                      <select
                        value={privacySettings.profileVisibility}
                        onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                        className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="public">Public</option>
                        <option value="friends">Friends Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-neutral-dark dark:text-darkMode-text">Profile Information</h3>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">Show learning progress</span>
                        <input
                          type="checkbox"
                          checked={privacySettings.showProgress}
                          onChange={(e) => handlePrivacyChange('showProgress', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-primary border-gray-300 dark:border-darkMode-border dark:bg-darkMode-bg rounded"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">Show achievements</span>
                        <input
                          type="checkbox"
                          checked={privacySettings.showAchievements}
                          onChange={(e) => handlePrivacyChange('showAchievements', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-primary border-gray-300 dark:border-darkMode-border dark:bg-darkMode-bg rounded"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">Allow messages from other users</span>
                        <input
                          type="checkbox"
                          checked={privacySettings.allowMessages}
                          onChange={(e) => handlePrivacyChange('allowMessages', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-primary border-gray-300 dark:border-darkMode-border dark:bg-darkMode-bg rounded"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-neutral-dark dark:text-darkMode-text mb-6">Security Settings</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium text-neutral-dark dark:text-darkMode-text mb-3">Password</h3>
                      {!showChangePassword ? (
                        <button
                          onClick={() => setShowChangePassword(true)}
                          className="bg-primary hover:bg-primary-dark dark:bg-darkMode-progress dark:hover:bg-darkMode-success text-white px-4 py-2 rounded-md font-medium"
                        >
                          Change Password
                        </button>
                      ) : (
                        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                          <div>
                            <label className="block text-sm font-medium text-neutral-dark/80 dark:text-darkMode-textSecondary mb-1">Current Password</label>
                            <input
                              type="password"
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-dark/80 dark:text-darkMode-textSecondary mb-1">New Password</label>
                            <input
                              type="password"
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-neutral-dark/80 dark:text-darkMode-textSecondary mb-1">Confirm New Password</label>
                            <input
                              type="password"
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              required
                            />
                          </div>
                          <div className="flex space-x-3">
                            <button
                              type="submit"
                              className="bg-primary hover:bg-primary-dark dark:bg-darkMode-progress dark:hover:bg-darkMode-success text-white px-4 py-2 rounded-md font-medium"
                            >
                              Update Password
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowChangePassword(false)}
                              className="bg-neutral-gray hover:bg-gray-400 dark:bg-darkMode-surfaceHover dark:hover:bg-darkMode-border text-neutral-dark/80 dark:text-darkMode-textSecondary px-4 py-2 rounded-md font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-neutral-dark dark:text-darkMode-text mb-3 text-red-600">Danger Zone</h3>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <h4 className="font-medium text-red-800 mb-2">Deactivate Account</h4>
                        <p className="text-sm text-red-600 mb-4">
                          Once you deactivate your account, your profile and data will be permanently removed. This action cannot be undone.
                        </p>
                        <button
                          onClick={handleDeactivateAccount}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium"
                        >
                          Deactivate Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Competition Settings */}
              {activeTab === 'competition' && (
                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-neutral-dark dark:text-darkMode-text mb-6">Competition Settings</h2>
                  <LeaderboardSettings userId={localStorage.getItem('userId') || 'demo-user'} />
                </div>
              )}

              {/* Save Button */}
              {activeTab !== 'security' && activeTab !== 'competition' && (
                <div className="border-t px-6 py-4">
                  <button
                    onClick={handleSave}
                    className="bg-primary hover:bg-primary-dark dark:bg-darkMode-progress dark:hover:bg-darkMode-success text-white px-6 py-2 rounded-md font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default StudentSettings