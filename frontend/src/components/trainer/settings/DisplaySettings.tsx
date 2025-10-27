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
    { value: 'blue', label: 'Blue', color: 'bg-blue-500' },
    { value: 'green', label: 'Green', color: 'bg-green-500' },
    { value: 'purple', label: 'Purple', color: 'bg-purple-500' },
    { value: 'orange', label: 'Orange', color: 'bg-orange-500' },
    { value: 'red', label: 'Red', color: 'bg-red-500' },
    { value: 'teal', label: 'Teal', color: 'bg-teal-500' }
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
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
    { value: 'pt', label: 'Português' },
    { value: 'zh', label: '中文' }
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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Display Settings</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Customize the appearance and layout of your interface
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
          {/* Theme Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-light/10 dark:bg-primary-light/20 rounded-lg">
                <Palette className="w-5 h-5 text-primary-light" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Theme</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Choose your preferred theme</p>
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
                        ? 'border-primary-light bg-primary-light/5 dark:bg-primary-light/10'
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${
                      settings.theme === theme.value ? 'text-primary-light' : 'text-gray-400'
                    }`} />
                    <h3 className={`font-medium mb-1 ${
                      settings.theme === theme.value ? 'text-primary-light' : 'text-gray-900 dark:text-white'
                    }`}>
                      {theme.label}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {theme.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Scheme */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-light/10 dark:bg-primary-light/20 rounded-lg">
                <Palette className="w-5 h-5 text-primary-light" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Color Scheme</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Choose your accent color</p>
              </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {colorSchemes.map((scheme) => (
                <button
                  key={scheme.value}
                  onClick={() => handleSettingChange('colorScheme', scheme.value)}
                  className={`p-4 rounded-lg border-2 text-center transition-colors ${
                    settings.colorScheme === scheme.value
                      ? 'border-primary-light bg-primary-light/5 dark:bg-primary-light/10'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className={`w-8 h-8 ${scheme.color} rounded-full mx-auto mb-2`}></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{scheme.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-light/10 dark:bg-primary-light/20 rounded-lg">
                <Type className="w-5 h-5 text-primary-light" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Typography</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Adjust text size and readability</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Font Size
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {fontSizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => handleSettingChange('fontSize', size.value)}
                      className={`p-4 rounded-lg border-2 text-left transition-colors ${
                        settings.fontSize === size.value
                          ? 'border-primary-light bg-primary-light/5 dark:bg-primary-light/10'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <h3 className={`font-medium mb-1 ${
                        settings.fontSize === size.value ? 'text-primary-light' : 'text-gray-900 dark:text-white'
                      }`}>
                        {size.label}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {size.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Layout */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-light/10 dark:bg-primary-light/20 rounded-lg">
                <Layout className="w-5 h-5 text-primary-light" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Layout</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Customize spacing and layout density</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Content Density
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {densityOptions.map((density) => (
                    <button
                      key={density.value}
                      onClick={() => handleSettingChange('density', density.value)}
                      className={`p-4 rounded-lg border-2 text-left transition-colors ${
                        settings.density === density.value
                          ? 'border-primary-light bg-primary-light/5 dark:bg-primary-light/10'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <h3 className={`font-medium mb-1 ${
                        settings.density === density.value ? 'text-primary-light' : 'text-gray-900 dark:text-white'
                      }`}>
                        {density.label}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {density.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between py-3 border-t border-gray-100 dark:border-gray-700">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Collapse Sidebar by Default</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Start with a collapsed navigation sidebar</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.sidebarCollapsed}
                    onChange={(e) => handleSettingChange('sidebarCollapsed', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light/20 dark:peer-focus:ring-primary-light/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-light"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Accessibility */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-light/10 dark:bg-primary-light/20 rounded-lg">
                <Eye className="w-5 h-5 text-primary-light" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Accessibility</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Options to improve accessibility</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Reduce Motion</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Minimize animations and transitions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.reducedMotion}
                    onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light/20 dark:peer-focus:ring-primary-light/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-light"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">High Contrast</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Increase contrast for better visibility</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.highContrast}
                    onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light/20 dark:peer-focus:ring-primary-light/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-light"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Enable Animations</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Show smooth transitions and animations</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.animations}
                    onChange={(e) => handleSettingChange('animations', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-light/20 dark:peer-focus:ring-primary-light/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-light"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Language */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-light/10 dark:bg-primary-light/20 rounded-lg">
                <Globe className="w-5 h-5 text-primary-light" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Language & Region</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Set your preferred language</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Interface Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleSettingChange('language', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
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