import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../../services/api/analytics';
import { handleApiError } from '../../utils/errorHandler';
import { Settings, Zap, Target, Brain } from 'lucide-react';
import { getUserId } from '../../utils/auth';

interface AdaptiveSettings {
  difficulty_auto_adjust: boolean;
  content_format_preference: string[];
  learning_pace: 'slow' | 'normal' | 'fast';
  engagement_threshold: number;
  adaptation_sensitivity: number;
}

const DifficultyAdjuster: React.FC = () => {
  const [settings, setSettings] = useState<AdaptiveSettings>({
    difficulty_auto_adjust: true,
    content_format_preference: ['video', 'interactive'],
    learning_pace: 'normal',
    engagement_threshold: 0.7,
    adaptation_sensitivity: 0.8
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastAdaptation, setLastAdaptation] = useState<string | null>(null);

  const userId = getUserId();

  const handleSettingChange = async (key: keyof AdaptiveSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Log the preference change
    if (!userId) return;

    try {
      await analyticsApi.logInteraction({
        user_id: userId,
        content_id: 'adaptive_settings',
        interaction_type: `setting_change_${key}`,
        duration_seconds: Date.now()
      });
    } catch (err) {
      console.error('Failed to log setting change:', err);
    }
  };

  const triggerAdaptation = async () => {
    setIsLoading(true);
    try {
      if (!userId) {
        setIsLoading(false);
        return;
      }
      // In real implementation, this would trigger AI adaptation
      await analyticsApi.logInteraction({
        user_id: userId,
        content_id: 'manual_adaptation',
        interaction_type: 'trigger_adaptation',
        duration_seconds: Date.now()
      });
      
      setLastAdaptation(new Date().toLocaleTimeString());
    } catch (err: any) {
      console.error('Adaptation failed:', handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Adaptive Learning Settings
        </h3>
      </div>

      <div className="p-6 space-y-6">
        {/* Auto Difficulty Adjustment */}
        <div className="flex items-center justify-between">
          <div>
            <label className="font-medium text-gray-800 dark:text-gray-200">
              Auto Difficulty Adjustment
            </label>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Let AI adjust content difficulty based on your performance
            </p>
          </div>
          <button
            onClick={() => handleSettingChange('difficulty_auto_adjust', !settings.difficulty_auto_adjust)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              settings.difficulty_auto_adjust ? 'bg-primary' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                settings.difficulty_auto_adjust ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Learning Pace */}
        <div>
          <label className="block font-medium text-gray-800 dark:text-gray-200 mb-2">
            Learning Pace
          </label>
          <div className="flex gap-2">
            {(['slow', 'normal', 'fast'] as const).map((pace) => (
              <button
                key={pace}
                onClick={() => handleSettingChange('learning_pace', pace)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  settings.learning_pace === pace
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {pace.charAt(0).toUpperCase() + pace.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content Format Preferences */}
        <div>
          <label className="block font-medium text-gray-800 dark:text-gray-200 mb-2">
            Preferred Content Formats
          </label>
          <div className="flex flex-wrap gap-2">
            {['video', 'interactive', 'text', 'audio', 'practice'].map((format) => (
              <button
                key={format}
                onClick={() => {
                  const newPrefs = settings.content_format_preference.includes(format)
                    ? settings.content_format_preference.filter(f => f !== format)
                    : [...settings.content_format_preference, format];
                  handleSettingChange('content_format_preference', newPrefs);
                }}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  settings.content_format_preference.includes(format)
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200'
                }`}
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        {/* Adaptation Sensitivity */}
        <div>
          <label className="block font-medium text-gray-800 dark:text-gray-200 mb-2">
            Adaptation Sensitivity: {Math.round(settings.adaptation_sensitivity * 100)}%
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={settings.adaptation_sensitivity}
            onChange={(e) => handleSettingChange('adaptation_sensitivity', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Less Sensitive</span>
            <span>More Sensitive</span>
          </div>
        </div>

        {/* Manual Adaptation Trigger */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200">Manual Adaptation</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Trigger AI to re-analyze and adapt your learning path
              </p>
              {lastAdaptation && (
                <p className="text-xs text-green-600 mt-1">
                  Last adapted: {lastAdaptation}
                </p>
              )}
            </div>
            <button
              onClick={triggerAdaptation}
              disabled={isLoading}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              {isLoading ? 'Adapting...' : 'Adapt Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DifficultyAdjuster;
