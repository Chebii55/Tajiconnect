import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Save,
  RefreshCw,
  Download,
  Trash2,
  HelpCircle,
  ChevronRight,
  Sun,
  Moon,
  Volume2,
  Zap,
  Database,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    courseReminders: true,
    achievementAlerts: true,
    weeklyReports: false,
    marketingEmails: false
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showProgress: true,
    showAchievements: true,
    dataSharing: false
  });
  const [preferences, setPreferences] = useState({
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    soundEffects: true,
    animations: true,
    autoSave: true
  });
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    { id: 'data', label: 'Data & Storage', icon: Database },
    { id: 'help', label: 'Help & Support', icon: HelpCircle }
  ];

  const handleSaveSettings = async () => {
    setSaveStatus('saving');
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key: string, value: string | boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  const handlePreferenceChange = (key: string, value: string | boolean) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 bg-primary-dark rounded-full flex items-center justify-center text-white text-2xl font-bold">
            JD
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary-dark transition-colors">
            <User className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-primary-dark dark:text-darkMode-link">John Doe</h3>
          <p className="text-gray-600 dark:text-gray-300">john.doe@example.com</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Member since November 2024</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            First Name
          </label>
          <input
            type="text"
            defaultValue="John"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Last Name
          </label>
          <input
            type="text"
            defaultValue="Doe"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            defaultValue="john.doe@example.com"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            defaultValue="+1 (555) 123-4567"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Bio
        </label>
        <textarea
          rows={3}
          defaultValue="Passionate learner exploring web development and data science. Always excited to take on new challenges and grow my skills."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
        <h4 className="text-lg font-semibold text-primary-dark dark:text-darkMode-link mb-4">Change Password</h4>
        <button
          onClick={() => setShowPasswordFields(!showPasswordFields)}
          className="mb-4 text-primary hover:text-[#2A9BC8] transition-colors"
        >
          {showPasswordFields ? 'Cancel Password Change' : 'Change Password'}
        </button>

        {showPasswordFields && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-primary-dark dark:text-darkMode-link mb-4">Email Notifications</h3>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'General Email Notifications', description: 'Receive important updates and announcements' },
            { key: 'courseReminders', label: 'Course Reminders', description: 'Get reminded about upcoming lessons and deadlines' },
            { key: 'achievementAlerts', label: 'Achievement Alerts', description: 'Notifications when you earn badges or complete milestones' },
            { key: 'weeklyReports', label: 'Weekly Progress Reports', description: 'Summary of your learning progress each week' },
            { key: 'marketingEmails', label: 'Marketing Communications', description: 'Information about new courses and features' }
          ].map((item) => (
            <div key={item.key} className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">{item.label}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={notifications[item.key as keyof typeof notifications]}
                  onChange={(e) => handleNotificationChange(item.key, e.target.checked)}
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${
                  notifications[item.key as keyof typeof notifications] ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0'
                  } mt-0.5 ml-0.5`} />
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-primary-dark dark:text-darkMode-link mb-4">Push Notifications</h3>
        <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 dark:text-white">Browser Notifications</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications even when the app is closed</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer ml-4">
              <input
                type="checkbox"
                className="sr-only"
                checked={notifications.pushNotifications}
                onChange={(e) => handleNotificationChange('pushNotifications', e.target.checked)}
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${
                notifications.pushNotifications ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
              }`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                  notifications.pushNotifications ? 'translate-x-5' : 'translate-x-0'
                } mt-0.5 ml-0.5`} />
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacyTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-primary-dark dark:text-darkMode-link mb-4">Profile Visibility</h3>
        <div className="space-y-3">
          {[
            { value: 'public', label: 'Public', description: 'Anyone can see your profile and progress' },
            { value: 'friends', label: 'Friends Only', description: 'Only your connections can see your profile' },
            { value: 'private', label: 'Private', description: 'Your profile is only visible to you' }
          ].map((option) => (
            <label key={option.value} className="flex items-start space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
              <input
                type="radio"
                name="profileVisibility"
                value={option.value}
                checked={privacy.profileVisibility === option.value}
                onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{option.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-primary-dark dark:text-darkMode-link mb-4">Data Sharing</h3>
        <div className="space-y-4">
          {[
            { key: 'showProgress', label: 'Show Learning Progress', description: 'Allow others to see your course progress and completion status' },
            { key: 'showAchievements', label: 'Show Achievements', description: 'Display your badges and certificates on your profile' },
            { key: 'dataSharing', label: 'Anonymous Analytics', description: 'Help improve TajiConnect by sharing anonymous usage data' }
          ].map((item) => (
            <div key={item.key} className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">{item.label}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={privacy[item.key as keyof typeof privacy] as boolean}
                  onChange={(e) => handlePrivacyChange(item.key, e.target.checked)}
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${
                  privacy[item.key as keyof typeof privacy] ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    privacy[item.key as keyof typeof privacy] ? 'translate-x-5' : 'translate-x-0'
                  } mt-0.5 ml-0.5`} />
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Privacy Notice</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              Your data is always encrypted and secure. We never sell your personal information to third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-primary-dark dark:text-darkMode-link mb-4">Appearance</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Theme
            </label>
            <div className="flex space-x-4">
              <button
                onClick={theme === 'dark' ? toggleTheme : undefined}
                className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                  theme === 'light' ? 'border-primary bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Light</span>
              </button>
              <button
                onClick={theme === 'light' ? toggleTheme : undefined}
                className={`flex items-center space-x-2 px-4 py-2 border rounded-lg transition-colors ${
                  theme === 'dark' ? 'border-primary bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Language
              </label>
              <select
                value={preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="ja">日本語</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timezone
              </label>
              <select
                value={preferences.timezone}
                onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="UTC">UTC</option>
                <option value="EST">Eastern Time</option>
                <option value="PST">Pacific Time</option>
                <option value="GMT">GMT</option>
                <option value="JST">Japan Time</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-primary-dark dark:text-darkMode-link mb-4">Learning Preferences</h3>
        <div className="space-y-4">
          {[
            { key: 'soundEffects', label: 'Sound Effects', description: 'Play sounds for achievements and interactions', icon: Volume2 },
            { key: 'animations', label: 'Animations', description: 'Enable smooth transitions and animations', icon: Zap },
            { key: 'autoSave', label: 'Auto-save Progress', description: 'Automatically save your learning progress', icon: Save }
          ].map((item) => (
            <div key={item.key} className="flex items-start justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
              <div className="flex items-start space-x-3">
                <item.icon className="w-5 h-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">{item.label}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={preferences[item.key as keyof typeof preferences] as boolean}
                  onChange={(e) => handlePreferenceChange(item.key, e.target.checked)}
                />
                <div className={`w-11 h-6 rounded-full transition-colors ${
                  preferences[item.key as keyof typeof preferences] ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                    preferences[item.key as keyof typeof preferences] ? 'translate-x-5' : 'translate-x-0'
                  } mt-0.5 ml-0.5`} />
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDataTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">Storage Used</h4>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">2.3 GB</p>
          <p className="text-sm text-blue-700 dark:text-blue-300">of 5 GB available</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 dark:text-green-200 mb-2">Courses Downloaded</h4>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">12</p>
          <p className="text-sm text-green-700 dark:text-green-300">Available offline</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <h4 className="font-semibold text-purple-900 dark:text-purple-200 mb-2">Backup Status</h4>
          <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Last backup: 2 hours ago</p>
          <p className="text-sm text-purple-700 dark:text-purple-300">Auto-backup enabled</p>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-primary-dark dark:text-darkMode-link mb-4">Data Management</h3>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center space-x-3">
              <Download className="w-5 h-5 text-primary" />
              <div className="text-left">
                <h4 className="font-medium text-gray-900 dark:text-white">Export Your Data</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Download all your learning data and progress</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center space-x-3">
              <RefreshCw className="w-5 h-5 text-primary" />
              <div className="text-left">
                <h4 className="font-medium text-gray-900 dark:text-white">Sync Data</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Synchronize your data across all devices</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between p-4 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <div className="flex items-center space-x-3">
              <Trash2 className="w-5 h-5 text-red-500" />
              <div className="text-left">
                <h4 className="font-medium text-red-600 dark:text-red-400">Clear Cache</h4>
                <p className="text-sm text-red-500 dark:text-red-400">Remove temporary files and cached data</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderHelpTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary-dark dark:text-darkMode-link">Support Resources</h3>
          {[
            { title: 'Help Center', description: 'Browse articles and tutorials' },
            { title: 'Contact Support', description: 'Get help from our team' },
            { title: 'Community Forum', description: 'Connect with other learners' },
            { title: 'Feature Requests', description: 'Suggest new features' }
          ].map((item, index) => (
            <button key={index} className="w-full flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="text-left">
                <h4 className="font-medium text-gray-900 dark:text-white">{item.title}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary-dark dark:text-darkMode-link">App Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Version</span>
              <span className="font-medium">2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Last Updated</span>
              <span className="font-medium">Nov 17, 2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Platform</span>
              <span className="font-medium">Web</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                Report a Bug
              </button>
              <button className="w-full text-left px-3 py-2 text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                Rate TajiConnect
              </button>
              <button className="w-full text-left px-3 py-2 text-primary hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                Share Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'profile': return renderProfileTab();
      case 'notifications': return renderNotificationsTab();
      case 'privacy': return renderPrivacyTab();
      case 'preferences': return renderPreferencesTab();
      case 'data': return renderDataTab();
      case 'help': return renderHelpTab();
      default: return renderProfileTab();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-dark dark:text-darkMode-link mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your account preferences and privacy settings</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary/10 text-primary-dark dark:text-darkMode-link border-l-4 border-primary'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              {renderActiveTab()}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {saveStatus === 'saved' && (
                      <div className="flex items-center space-x-2 text-green-600">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Settings saved successfully!</span>
                      </div>
                    )}
                    {saveStatus === 'error' && (
                      <div className="flex items-center space-x-2 text-red-600">
                        <X className="w-5 h-5" />
                        <span className="text-sm font-medium">Error saving settings. Please try again.</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleSaveSettings}
                    disabled={saveStatus === 'saving'}
                    className="flex items-center space-x-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saveStatus === 'saving' ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;