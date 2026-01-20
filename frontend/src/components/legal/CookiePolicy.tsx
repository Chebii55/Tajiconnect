import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Mail, Phone, Clock, ArrowLeft, Settings, Shield, BarChart3, Target } from 'lucide-react';

const CookiePolicy: React.FC = () => {
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always enabled
    analytics: true,
    marketing: false,
    preferences: true
  });

  const handlePreferenceChange = (type: keyof typeof cookiePreferences) => {
    if (type === 'essential') return; // Essential cookies cannot be disabled
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const savePreferences = () => {
    // Here you would typically save the preferences to localStorage or send to server
    console.log('Cookie preferences saved:', cookiePreferences);
    // Show success notification
    alert('Cookie preferences saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-darkMode-bg dark:via-darkMode-surface dark:to-darkMode-bg font-['Inter']">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary dark:text-darkMode-link hover:text-primary-dark dark:hover:text-darkMode-accent transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary-dark dark:bg-darkMode-navbar rounded-lg">
              <Cookie className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-primary-dark dark:text-darkMode-text">Cookie Policy</h1>
              <p className="text-neutral-dark/70 dark:text-darkMode-textSecondary">How we use cookies and similar technologies</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-neutral-dark/70 dark:text-darkMode-textSecondary">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>Last updated: November 17, 2024</span>
            </div>
            <span>•</span>
            <span>Effective from: November 17, 2024</span>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {/* Cookie Preferences Panel */}
          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6 mb-8">
            <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4 flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Manage Your Cookie Preferences
            </h2>
            <p className="text-neutral-dark/70 dark:text-darkMode-textSecondary mb-6">
              Customize your cookie preferences below. Essential cookies are required for the platform to function and cannot be disabled.
            </p>

            <div className="space-y-4">
              {/* Essential Cookies */}
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Essential Cookies
                  </h3>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Always Active
                  </div>
                </div>
                <p className="text-sm text-neutral-dark/70 dark:text-darkMode-textSecondary mb-2">
                  Required for basic platform functionality, security, and user authentication.
                </p>
                <div className="text-xs text-gray-500">
                  Examples: Session management, security tokens, basic preferences
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Analytics Cookies
                  </h3>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={cookiePreferences.analytics}
                      onChange={() => handlePreferenceChange('analytics')}
                      className="rounded border-gray-300 text-primary dark:text-darkMode-link focus:ring-primary dark:focus:ring-darkMode-focus"
                    />
                  </label>
                </div>
                <p className="text-sm text-neutral-dark/70 dark:text-darkMode-textSecondary mb-2">
                  Help us understand how you use our platform to improve user experience.
                </p>
                <div className="text-xs text-gray-500">
                  Examples: Google Analytics, usage patterns, performance metrics
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-600" />
                    Marketing Cookies
                  </h3>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={cookiePreferences.marketing}
                      onChange={() => handlePreferenceChange('marketing')}
                      className="rounded border-gray-300 text-primary dark:text-darkMode-link focus:ring-primary dark:focus:ring-darkMode-focus"
                    />
                  </label>
                </div>
                <p className="text-sm text-neutral-dark/70 dark:text-darkMode-textSecondary mb-2">
                  Enable personalized course recommendations and relevant career opportunities.
                </p>
                <div className="text-xs text-gray-500">
                  Examples: Course recommendations, job matching, targeted content
                </div>
              </div>

              {/* Preference Cookies */}
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-orange-600" />
                    Preference Cookies
                  </h3>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={cookiePreferences.preferences}
                      onChange={() => handlePreferenceChange('preferences')}
                      className="rounded border-gray-300 text-primary dark:text-darkMode-link focus:ring-primary dark:focus:ring-darkMode-focus"
                    />
                  </label>
                </div>
                <p className="text-sm text-neutral-dark/70 dark:text-darkMode-textSecondary mb-2">
                  Remember your settings and preferences for a personalized experience.
                </p>
                <div className="text-xs text-gray-500">
                  Examples: Theme preferences, language settings, dashboard layout
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={savePreferences}
                className="px-6 py-2 bg-primary dark:bg-darkMode-progress text-white rounded-lg hover:bg-primary-dark dark:hover:bg-darkMode-success transition-colors"
              >
                Save Preferences
              </button>
              <button
                onClick={() => setCookiePreferences({
                  essential: true,
                  analytics: false,
                  marketing: false,
                  preferences: false
                })}
                className="px-6 py-2 border border-gray-300 text-neutral-dark/80 dark:text-darkMode-textSecondary rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reject All (Except Essential)
              </button>
            </div>
          </div>

          {/* Detailed Policy */}
          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-8">
            <div className="prose prose-lg max-w-none">
              <div className="bg-blue-50 border-l-4 border-primary dark:border-darkMode-link p-6 rounded-r-lg mb-8">
                <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-text mb-2">What Are Cookies?</h2>
                <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary">
                  Cookies are small text files stored on your device when you visit websites. They help us provide
                  you with a better, more personalized experience on TajiConnect.
                </p>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">1. How We Use Cookies</h2>
                <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary mb-4">
                  TajiConnect uses cookies and similar technologies to enhance your learning experience, provide
                  personalized content, and improve our services.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-green-900 mb-3">Essential Functions</h3>
                    <ul className="text-sm text-green-800 space-y-2">
                      <li>• User authentication and session management</li>
                      <li>• Security and fraud prevention</li>
                      <li>• Basic platform functionality</li>
                      <li>• Form data retention during sessions</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-3">Enhanced Experience</h3>
                    <ul className="text-sm text-blue-800 space-y-2">
                      <li>• Remember your preferences and settings</li>
                      <li>• Personalized course recommendations</li>
                      <li>• Learning progress tracking</li>
                      <li>• Customized dashboard layout</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">2. Types of Cookies We Use</h2>

                <div className="space-y-6">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Session Cookies</h3>
                    <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary text-sm mb-2">
                      Temporary cookies that expire when you close your browser. Essential for platform functionality.
                    </p>
                    <div className="bg-gray-50 p-3 rounded text-xs text-neutral-dark/70 dark:text-darkMode-textSecondary">
                      <strong>Duration:</strong> Until browser session ends<br />
                      <strong>Purpose:</strong> Authentication, security, form data
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Persistent Cookies</h3>
                    <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary text-sm mb-2">
                      Stored on your device for a specific period to remember your preferences across visits.
                    </p>
                    <div className="bg-gray-50 p-3 rounded text-xs text-neutral-dark/70 dark:text-darkMode-textSecondary">
                      <strong>Duration:</strong> 30 days to 2 years (varies by purpose)<br />
                      <strong>Purpose:</strong> User preferences, analytics, recommendations
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Third-Party Cookies</h3>
                    <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary text-sm mb-2">
                      Set by trusted third-party services we use to enhance our platform functionality.
                    </p>
                    <div className="bg-gray-50 p-3 rounded text-xs text-neutral-dark/70 dark:text-darkMode-textSecondary">
                      <strong>Examples:</strong> Google Analytics, payment processors, content delivery networks<br />
                      <strong>Control:</strong> Managed through our cookie preferences or browser settings
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">3. Managing Cookies</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Browser Controls</h3>
                <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary mb-4">
                  Most browsers allow you to control cookies through their settings. However, disabling cookies
                  may limit platform functionality.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {['Chrome', 'Firefox', 'Safari', 'Edge'].map((browser) => (
                    <div key={browser} className="text-center p-3 border border-gray-200 rounded-lg">
                      <div className="text-2xl mb-2">🌐</div>
                      <h4 className="font-semibold mb-1">{browser}</h4>
                      <p className="text-xs text-neutral-dark/70 dark:text-darkMode-textSecondary">Settings → Privacy → Cookies</p>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Our Cookie Preference Center</h3>
                <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary mb-4">
                  Use our preference center above to customize which types of cookies you accept. Your choices
                  are respected and stored locally.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">4. Third-Party Services</h2>
                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mb-4">
                  <h3 className="font-semibold text-yellow-900 mb-2">Analytics Partners</h3>
                  <p className="text-yellow-800 text-sm">
                    We use Google Analytics to understand how users interact with our platform. You can opt-out
                    through our cookie preferences or Google&apos;s opt-out tools.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-semibold">Google Analytics</h4>
                      <p className="text-sm text-neutral-dark/70 dark:text-darkMode-textSecondary">Website usage analytics and user behavior insights</p>
                    </div>
                    <a
                      href="https://tools.google.com/dlpage/gaoptout"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary dark:text-darkMode-link hover:text-primary-dark dark:hover:text-darkMode-accent text-sm"
                    >
                      Opt-out →
                    </a>
                  </div>
                  <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-semibold">Payment Processors</h4>
                      <p className="text-sm text-neutral-dark/70 dark:text-darkMode-textSecondary">Secure payment processing and fraud prevention</p>
                    </div>
                    <span className="text-sm text-gray-500">Essential</span>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">5. Data Retention</h2>
                <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary mb-4">
                  Cookie data is retained for different periods based on its purpose:
                </p>
                <ul className="list-disc ml-6 space-y-2 text-neutral-dark/80 dark:text-darkMode-textSecondary">
                  <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
                  <li><strong>Preference cookies:</strong> Retained for up to 1 year</li>
                  <li><strong>Analytics cookies:</strong> Retained for up to 2 years</li>
                  <li><strong>Marketing cookies:</strong> Retained for up to 1 year</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">6. Updates to This Policy</h2>
                <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary">
                  We may update this cookie policy to reflect changes in our practices or legal requirements.
                  Significant changes will be communicated through our platform or via email.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">7. Contact Us</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary mb-4">
                    Questions about our use of cookies? Contact our privacy team:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary dark:text-darkMode-link" />
                      <div>
                        <p className="font-medium">Privacy Team</p>
                        <p className="text-sm text-neutral-dark/70 dark:text-darkMode-textSecondary">privacy@tajiconnect.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary dark:text-darkMode-link" />
                      <div>
                        <p className="font-medium">Support</p>
                        <p className="text-sm text-neutral-dark/70 dark:text-darkMode-textSecondary">+1 (555) 123-4567</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Related Links */}
          <div className="mt-8 text-center">
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/privacy"
                className="px-4 py-2 text-primary dark:text-darkMode-link hover:text-primary-dark dark:hover:text-darkMode-accent transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="px-4 py-2 text-primary dark:text-darkMode-link hover:text-primary-dark dark:hover:text-darkMode-accent transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/contact"
                className="px-4 py-2 bg-primary dark:bg-darkMode-progress text-white rounded-lg hover:bg-primary-dark dark:hover:bg-darkMode-success transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;