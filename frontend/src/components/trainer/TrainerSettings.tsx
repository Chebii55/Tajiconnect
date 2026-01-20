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
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg font-['Inter']">
      {/* Header */}
      <div className="bg-neutral-white dark:bg-darkMode-surface shadow-sm border-b dark:border-darkMode-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text">Settings</h1>
              <p className="text-forest-sage dark:text-darkMode-textSecondary mt-1">
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
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light'
                          : 'text-forest-sage dark:text-darkMode-textSecondary hover:bg-neutral-light dark:hover:bg-darkMode-navbar hover:text-neutral-dark dark:hover:text-darkMode-text'
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
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-6">Profile Information</h2>

                  {/* Avatar Section */}
                  <div className="flex items-center gap-6 mb-8">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-r from-primary-dark to-primary dark:from-darkMode-progress dark:to-darkMode-success rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {profileData.name.charAt(0) || 'T'}
                      </div>
                      <button className="absolute bottom-0 right-0 bg-primary dark:bg-darkMode-progress text-white p-2 rounded-full hover:bg-primary-dark dark:hover:bg-darkMode-success">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-neutral-dark dark:text-darkMode-text">{profileData.name}</h3>
                      <p className="text-forest-sage dark:text-darkMode-textSecondary">{profileData.email}</p>
                      <button className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary text-sm font-medium mt-1">
                        Change Avatar
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-text mb-2">Full Name</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-text mb-2">Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-text mb-2">Phone</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-text mb-2">Location</label>
                      <input
                        type="text"
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        className="w-full px-3 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-text mb-2">Bio</label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      rows={4}
                      className="w-full px-3 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                      placeholder="Tell learners about yourself..."
                    />
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-text mb-2">Areas of Expertise</label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {profileData.expertise.map((skill) => (
                        <span
                          key={skill}
                          className="bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {skill}
                          <button
                            onClick={() => removeExpertise(skill)}
                            className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
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
                      className="w-full px-3 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                    />
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      className="bg-primary dark:bg-darkMode-progress text-white px-6 py-2 rounded-lg hover:bg-primary-dark dark:hover:bg-darkMode-success flex items-center gap-2"
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
                  <h2 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-6">Security Settings</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-text mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-forest-sage hover:text-neutral-dark dark:text-darkMode-textSecondary dark:hover:text-darkMode-text"
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-text mb-2">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-forest-sage hover:text-neutral-dark dark:text-darkMode-textSecondary dark:hover:text-darkMode-text"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-text mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                        className="w-full px-3 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handleChangePassword}
                        className="bg-primary dark:bg-darkMode-progress text-white px-6 py-2 rounded-lg hover:bg-primary-dark dark:hover:bg-darkMode-success"
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
                  <h2 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-6">Notification Preferences</h2>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">Email Notifications</h3>
                        <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">Receive notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.emailNotifications}
                          onChange={(e) => setNotificationSettings({...notificationSettings, emailNotifications: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-gray peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-darkMode-focus/30 rounded-full peer dark:bg-darkMode-border peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-gray after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-darkMode-border peer-checked:bg-primary dark:peer-checked:bg-darkMode-progress"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">New Enrollments</h3>
                        <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">Get notified when learners enroll in your courses</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.newEnrollments}
                          onChange={(e) => setNotificationSettings({...notificationSettings, newEnrollments: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-gray peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-darkMode-focus/30 rounded-full peer dark:bg-darkMode-border peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-gray after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-darkMode-border peer-checked:bg-primary dark:peer-checked:bg-darkMode-progress"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">Message Alerts</h3>
                        <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">Get notified when learners send you messages</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.messageAlerts}
                          onChange={(e) => setNotificationSettings({...notificationSettings, messageAlerts: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-gray peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-darkMode-focus/30 rounded-full peer dark:bg-darkMode-border peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-gray after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-darkMode-border peer-checked:bg-primary dark:peer-checked:bg-darkMode-progress"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">Weekly Reports</h3>
                        <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">Receive weekly performance reports</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings.weeklyReports}
                          onChange={(e) => setNotificationSettings({...notificationSettings, weeklyReports: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-gray peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-darkMode-focus/30 rounded-full peer dark:bg-darkMode-border peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-gray after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-darkMode-border peer-checked:bg-primary dark:peer-checked:bg-darkMode-progress"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-6">Privacy Settings</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-text mb-2">Profile Visibility</label>
                      <select
                        value={privacySettings.profileVisibility}
                        onChange={(e) => setPrivacySettings({...privacySettings, profileVisibility: e.target.value})}
                        className="w-full px-3 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                      >
                        <option value="public">Public - Visible to all learners</option>
                        <option value="enrolled">Enrolled Only - Visible to enrolled learners</option>
                        <option value="private">Private - Not visible</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">Show Email Address</h3>
                        <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">Allow learners to see your email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacySettings.showEmail}
                          onChange={(e) => setPrivacySettings({...privacySettings, showEmail: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-gray peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-darkMode-focus/30 rounded-full peer dark:bg-darkMode-border peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-gray after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-darkMode-border peer-checked:bg-primary dark:peer-checked:bg-darkMode-progress"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">Allow Direct Messages</h3>
                        <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">Let learners send you direct messages</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacySettings.allowMessages}
                          onChange={(e) => setPrivacySettings({...privacySettings, allowMessages: e.target.checked})}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-neutral-gray peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-darkMode-focus/30 rounded-full peer dark:bg-darkMode-border peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-gray after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-darkMode-border peer-checked:bg-primary dark:peer-checked:bg-darkMode-progress"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-6">Preferences</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-text mb-2">Language</label>
                      <select className="w-full px-3 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text">
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-text mb-2">Time Zone</label>
                      <select className="w-full px-3 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text">
                        <option value="UTC">UTC</option>
                        <option value="EST">Eastern Time</option>
                        <option value="PST">Pacific Time</option>
                        <option value="GMT">Greenwich Mean Time</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-text mb-2">Theme</label>
                      <select className="w-full px-3 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text">
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
