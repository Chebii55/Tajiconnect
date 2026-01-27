import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Bell, 
  Mail, 
  MessageSquare, 
  Users, 
  BookOpen,
  TrendingUp,
  Award,
  Calendar
} from 'lucide-react';

const NotificationPreferences: React.FC = () => {
  const navigate = useNavigate();
  
  const [preferences, setPreferences] = useState({
    email: {
      newEnrollments: true,
      courseCompletions: true,
      newMessages: true,
      weeklyReports: true,
      systemUpdates: false,
      marketingEmails: false
    },
    push: {
      newEnrollments: true,
      courseCompletions: true,
      newMessages: true,
      urgentAlerts: true,
      dailyDigest: false
    },
    inApp: {
      newEnrollments: true,
      courseCompletions: true,
      newMessages: true,
      achievements: true,
      systemNotifications: true
    }
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handlePreferenceChange = (category: string, key: string, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // TODO: Save preferences via API
    setHasChanges(false);
  };

  const notificationCategories = [
    {
      id: 'email',
      title: 'Email Notifications',
      description: 'Receive notifications via email',
      icon: Mail,
      settings: [
        { key: 'newEnrollments', label: 'New course enrollments', description: 'When learners enroll in your courses' },
        { key: 'courseCompletions', label: 'Course completions', description: 'When learners complete your courses' },
        { key: 'newMessages', label: 'New messages', description: 'When learners send you messages' },
        { key: 'weeklyReports', label: 'Weekly performance reports', description: 'Summary of your teaching performance' },
        { key: 'systemUpdates', label: 'System updates', description: 'Platform updates and new features' },
        { key: 'marketingEmails', label: 'Marketing emails', description: 'Tips, best practices, and promotional content' }
      ]
    },
    {
      id: 'push',
      title: 'Push Notifications',
      description: 'Receive notifications on your device',
      icon: Bell,
      settings: [
        { key: 'newEnrollments', label: 'New enrollments', description: 'Instant notifications for new enrollments' },
        { key: 'courseCompletions', label: 'Course completions', description: 'When learners complete courses' },
        { key: 'newMessages', label: 'New messages', description: 'Instant message notifications' },
        { key: 'urgentAlerts', label: 'Urgent alerts', description: 'Important system alerts and issues' },
        { key: 'dailyDigest', label: 'Daily digest', description: 'Daily summary of activities' }
      ]
    },
    {
      id: 'inApp',
      title: 'In-App Notifications',
      description: 'Notifications within the platform',
      icon: MessageSquare,
      settings: [
        { key: 'newEnrollments', label: 'New enrollments', description: 'Show enrollment notifications in the app' },
        { key: 'courseCompletions', label: 'Course completions', description: 'Show completion notifications' },
        { key: 'newMessages', label: 'New messages', description: 'Show message notifications' },
        { key: 'achievements', label: 'Learner achievements', description: 'When learners earn badges or certificates' },
        { key: 'systemNotifications', label: 'System notifications', description: 'Platform announcements and updates' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-['Inter']">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/trainer/settings')}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Preferences</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Customize how and when you receive notifications
                </p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {notificationCategories.map((category) => {
            const Icon = category.icon;
            return (
              <div key={category.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary-light/10 dark:bg-primary-light/20 rounded-lg">
                    <Icon className="w-5 h-5 text-primary-light" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{category.title}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {category.settings.map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">{setting.label}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{setting.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer ml-4">
                        <input
                          type="checkbox"
                          checked={(preferences[category.id as keyof typeof preferences] as Record<string, boolean>)[setting.key] ?? false}
                          onChange={(e) => handlePreferenceChange(category.id, setting.key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light/20 dark:peer-focus:ring-primary-light/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-light"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => {
                  // Enable all notifications
                  const allEnabled = {
                    email: Object.keys(preferences.email).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
                    push: Object.keys(preferences.push).reduce((acc, key) => ({ ...acc, [key]: true }), {}),
                    inApp: Object.keys(preferences.inApp).reduce((acc, key) => ({ ...acc, [key]: true }), {})
                  };
                  setPreferences(allEnabled as typeof preferences);
                  setHasChanges(true);
                }}
                className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <Bell className="w-5 h-5 text-green-600 mb-2" />
                <h3 className="font-medium text-gray-900 dark:text-white">Enable All</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Turn on all notification types</p>
              </button>
              
              <button
                onClick={() => {
                  // Disable all notifications
                  const allDisabled = {
                    email: Object.keys(preferences.email).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
                    push: Object.keys(preferences.push).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
                    inApp: Object.keys(preferences.inApp).reduce((acc, key) => ({ ...acc, [key]: false }), {})
                  };
                  setPreferences(allDisabled as typeof preferences);
                  setHasChanges(true);
                }}
                className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <Bell className="w-5 h-5 text-red-600 mb-2" />
                <h3 className="font-medium text-gray-900 dark:text-white">Disable All</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Turn off all notification types</p>
              </button>
            </div>
          </div>

          {/* Notification Schedule */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Schedule</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quiet Hours
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Set hours when you don't want to receive notifications
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">From</label>
                    <input
                      type="time"
                      defaultValue="22:00"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">To</label>
                    <input
                      type="time"
                      defaultValue="08:00"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time Zone
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white">
                  <option value="UTC">UTC (Coordinated Universal Time)</option>
                  <option value="EST">EST (Eastern Standard Time)</option>
                  <option value="PST">PST (Pacific Standard Time)</option>
                  <option value="GMT">GMT (Greenwich Mean Time)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferences;