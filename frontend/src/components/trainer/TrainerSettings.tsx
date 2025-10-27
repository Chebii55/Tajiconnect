import React, { useState } from 'react';
import { useTrainer } from '../../contexts/TrainerContext';
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Shield, 
  Palette, 
  Globe,
  Save,
  Camera,
  Eye,
  EyeOff
} from 'lucide-react';

const TrainerSettings: React.FC = () => {
  const { trainer, setTrainer } = useTrainer();
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: trainer?.name || '',
    email: trainer?.email || '',
    bio: trainer?.bio || '',
    expertise: trainer?.expertise || [],
    phone: '',
    location: '',
    website: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newEnrollments: true,
    messageAlerts: true,
    courseUpdates: true,
    weeklyReports: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowMessages: true
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'privacy', name: 'Privacy', icon: Shield },
    { id: 'preferences', name: 'Preferences', icon: Palette }
  ];

  const handleSaveProfile = () => {
    setTrainer({
      ...trainer,
      ...profileData
    });
    // Show success message
    alert('Profile updated successfully!');
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    // Handle password change
    alert('Password changed successfully!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const addExpertise = (skill: string) => {
    if (skill && !profileData.expertise.includes(skill)) {
      setProfileData({
        ...profileData,
        expertise: [...profileData.expertise, skill]
      });
    }
  };

  const removeExpertise = (skill: string) => {
    setProfileData({
      ...profileData,
      expertise: profileData.expertise.filter(s => s !== skill)
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h2>
                  
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {profileData.name.charAt(0) || 'T'}
                      </div>
                      <button className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{profileData.name}</h3>
                      <p className="text-gray-600">{profileData.email}</p>
                      <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-1">
                        Change Avatar
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Tell learners about yourself..."
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Areas of Expertise</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {profileData.expertise.map((skill) => (
                        <span
                          key={skill}
                          className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {skill}
                          <button
                            onClick={() => removeExpertise(skill)}
                            className="text-indigo-600 hover:text-indigo-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      type="text"
                      placeholder="Add a skill and press Enter"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addExpertise(e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button 
                      onClick={handleSaveProfile}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button 
                        onClick={handleChangePassword}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
                      >
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                        <p className="text-sm text-gray-500">Receive notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">New Enrollments</h3>
                        <p className="text-sm text-gray-500">Get notified when learners enroll in your courses</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.newEnrollments}
                          onChange={(e) => setNotificationSettings({...notificationSettings, newEnrollments: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Message Alerts</h3>
                        <p className="text-sm text-gray-500">Get notified when learners send you messages</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.messageAlerts}
                          onChange={(e) => setNotificationSettings({...notificationSettings, messageAlerts: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Weekly Reports</h3>
                        <p className="text-sm text-gray-500">Receive weekly performance reports</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.weeklyReports}
                          onChange={(e) => setNotificationSettings({...notificationSettings, weeklyReports: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Privacy Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
                      <select
                        value={privacySettings.profileVisibility}
                        onChange={(e) => setPrivacySettings({...privacySettings, profileVisibility: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="public">Public - Visible to all learners</option>
                        <option value="enrolled">Enrolled Only - Visible to enrolled learners</option>
                        <option value="private">Private - Not visible</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Show Email Address</h3>
                        <p className="text-sm text-gray-500">Allow learners to see your email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacySettings.showEmail}
                          onChange={(e) => setPrivacySettings({...privacySettings, showEmail: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Allow Direct Messages</h3>
                        <p className="text-sm text-gray-500">Let learners send you direct messages</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacySettings.allowMessages}
                          onChange={(e) => setPrivacySettings({...privacySettings, allowMessages: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">Preferences</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                        <option value="UTC">UTC</option>
                        <option value="EST">Eastern Time</option>
                        <option value="PST">Pacific Time</option>
                        <option value="GMT">Greenwich Mean Time</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                        <option value="light">Light</option>
                        <option value="dark">Dark</option>
                        <option value="auto">Auto</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerSettings;