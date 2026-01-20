import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Monitor,
  Sun,
  Moon,
  Palette,
  Type,
  Layout,
  Eye,
  Globe
} from 'lucide-react';

const DisplaySettings: React.FC = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    theme: 'system', // 'light', 'dark', 'system'
    colorScheme: 'blue', // 'blue', 'green', 'purple', 'orange'
    fontSize: 'medium', // 'small', 'medium', 'large'
    density: 'comfortable', // 'compact', 'comfortable', 'spacious'
    language: 'en', // 'en', 'es', 'fr', 'de'
    animations: true,
    reducedMotion: false,
    highContrast: false,
    sidebarCollapsed: false
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Save settings logic here
    console.log('Saving display settings:', settings);
    setHasChanges(false);
  };

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun, description: 'Light theme for daytime use' },
    { value: 'dark', label: 'Dark', icon: Moon, description: 'Dark theme for low-light environments' },
    { value: 'system', label: 'System', icon: Monitor, description: 'Follow your system preference' }
  ];

  const colorSchemes = [
    { value: 'blue', label: 'Blue', color: 'bg-primary' },
    { value: 'green', label: 'Green', color: 'bg-success' },
    { value: 'purple', label: 'Purple', color: 'bg-secondary' },
    { value: 'orange', label: 'Orange', color: 'bg-accent-gold' },
    { value: 'red', label: 'Red', color: 'bg-error' },
    { value: 'teal', label: 'Teal', color: 'bg-forest-sage' }
  ];

  const fontSizes = [
    { value: 'small', label: 'Small', description: '14px base font size' },
    { value: 'medium', label: 'Medium', description: '16px base font size' },
    { value: 'large', label: 'Large', description: '18px base font size' }
  ];

  const densityOptions = [
    { value: 'compact', label: 'Compact', description: 'More content in less space' },
    { value: 'comfortable', label: 'Comfortable', description: 'Balanced spacing' },
    { value: 'spacious', label: 'Spacious', description: 'More breathing room' }
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Espanol' },
    { value: 'fr', label: 'Francais' },
    { value: 'de', label: 'Deutsch' },
    { value: 'pt', label: 'Portugues' },
    { value: 'zh', label: 'Chinese' }
  ];

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg font-['Inter']">
      {/* Header */}
      <div className="bg-neutral-white dark:bg-darkMode-surface shadow-sm border-b dark:border-darkMode-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/trainer/settings')}
                className="p-2 text-forest-sage hover:text-neutral-dark dark:text-darkMode-textSecondary dark:hover:text-darkMode-text rounded-lg hover:bg-neutral-gray dark:hover:bg-darkMode-navbar"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text">Display Settings</h1>
                <p className="text-forest-sage dark:text-darkMode-textSecondary mt-1">
                  Customize the appearance and layout of your interface
                </p>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Theme Selection */}
          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 dark:bg-darkMode-accent/20 rounded-lg">
                <Palette className="w-5 h-5 text-primary dark:text-darkMode-accent" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text">Theme</h2>
                <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">Choose your preferred theme</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themeOptions.map((theme) => {
                const Icon = theme.icon;
                return (
                  <button
                    key={theme.value}
                    onClick={() => handleSettingChange('theme', theme.value)}
                    className={`p-4 rounded-lg border-2 text-left transition-colors ${
                      settings.theme === theme.value
                        ? 'border-primary bg-primary/5 dark:bg-primary/10'
                        : 'border-neutral-gray dark:border-darkMode-border hover:border-forest-sage dark:hover:border-darkMode-textSecondary'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${
                      settings.theme === theme.value ? 'text-primary' : 'text-forest-sage dark:text-darkMode-textMuted'
                    }`} />
                    <h3 className={`font-medium mb-1 ${
                      settings.theme === theme.value ? 'text-primary' : 'text-neutral-dark dark:text-darkMode-text'
                    }`}>
                      {theme.label}
                    </h3>
                    <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">
                      {theme.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Scheme */}
          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 dark:bg-darkMode-accent/20 rounded-lg">
                <Palette className="w-5 h-5 text-primary dark:text-darkMode-accent" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text">Color Scheme</h2>
                <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">Choose your accent color</p>
              </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {colorSchemes.map((scheme) => (
                <button
                  key={scheme.value}
                  onClick={() => handleSettingChange('colorScheme', scheme.value)}
                  className={`p-4 rounded-lg border-2 text-center transition-colors ${
                    settings.colorScheme === scheme.value
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-neutral-gray dark:border-darkMode-border hover:border-forest-sage dark:hover:border-darkMode-textSecondary'
                  }`}
                >
                  <div className={`w-8 h-8 ${scheme.color} rounded-full mx-auto mb-2`}></div>
                  <span className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">{scheme.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 dark:bg-darkMode-accent/20 rounded-lg">
                <Type className="w-5 h-5 text-primary dark:text-darkMode-accent" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text">Typography</h2>
                <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">Adjust text size and readability</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-3">
                  Font Size
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {fontSizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => handleSettingChange('fontSize', size.value)}
                      className={`p-4 rounded-lg border-2 text-left transition-colors ${
                        settings.fontSize === size.value
                          ? 'border-primary bg-primary/5 dark:bg-primary/10'
                          : 'border-neutral-gray dark:border-darkMode-border hover:border-forest-sage dark:hover:border-darkMode-textSecondary'
                      }`}
                    >
                      <h3 className={`font-medium mb-1 ${
                        settings.fontSize === size.value ? 'text-primary' : 'text-neutral-dark dark:text-darkMode-text'
                      }`}>
                        {size.label}
                      </h3>
                      <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">
                        {size.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Layout */}
          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 dark:bg-darkMode-accent/20 rounded-lg">
                <Layout className="w-5 h-5 text-primary dark:text-darkMode-accent" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text">Layout</h2>
                <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">Customize spacing and layout density</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-3">
                  Content Density
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {densityOptions.map((density) => (
                    <button
                      key={density.value}
                      onClick={() => handleSettingChange('density', density.value)}
                      className={`p-4 rounded-lg border-2 text-left transition-colors ${
                        settings.density === density.value
                          ? 'border-primary bg-primary/5 dark:bg-primary/10'
                          : 'border-neutral-gray dark:border-darkMode-border hover:border-forest-sage dark:hover:border-darkMode-textSecondary'
                      }`}
                    >
                      <h3 className={`font-medium mb-1 ${
                        settings.density === density.value ? 'text-primary' : 'text-neutral-dark dark:text-darkMode-text'
                      }`}>
                        {density.label}
                      </h3>
                      <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">
                        {density.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-neutral-gray dark:border-darkMode-border">
                <div>
                  <h3 className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">Collapse Sidebar by Default</h3>
                  <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">Start with a collapsed navigation sidebar</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.sidebarCollapsed}
                    onChange={(e) => handleSettingChange('sidebarCollapsed', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-gray peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-darkMode-focus/30 rounded-full peer dark:bg-darkMode-navbar peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-gray after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-darkMode-border peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Accessibility */}
          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 dark:bg-darkMode-accent/20 rounded-lg">
                <Eye className="w-5 h-5 text-primary dark:text-darkMode-accent" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text">Accessibility</h2>
                <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">Options to improve accessibility</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-neutral-gray dark:border-darkMode-border">
                <div>
                  <h3 className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">Reduce Motion</h3>
                  <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">Minimize animations and transitions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.reducedMotion}
                    onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-gray peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-darkMode-focus/30 rounded-full peer dark:bg-darkMode-navbar peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-gray after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-darkMode-border peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-neutral-gray dark:border-darkMode-border">
                <div>
                  <h3 className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">High Contrast</h3>
                  <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">Increase contrast for better visibility</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-gray peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-darkMode-focus/30 rounded-full peer dark:bg-darkMode-navbar peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-gray after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-darkMode-border peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">Enable Animations</h3>
                  <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">Show smooth transitions and animations</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.animations}
                    onChange={(e) => handleSettingChange('animations', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-neutral-gray peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-darkMode-focus/30 rounded-full peer dark:bg-darkMode-navbar peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-gray after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-darkMode-border peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 dark:bg-darkMode-accent/20 rounded-lg">
                <Globe className="w-5 h-5 text-primary dark:text-darkMode-accent" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text">Language & Region</h2>
                <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">Set your preferred language</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">
                Interface Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-full px-4 py-3 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplaySettings;
