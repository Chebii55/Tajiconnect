import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, Clock, ArrowLeft } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
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
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-primary-dark dark:text-darkMode-text">Privacy Policy</h1>
              <p className="text-neutral-dark/70 dark:text-darkMode-textSecondary">How we collect, use, and protect your information</p>
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
          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-8">
            <div className="prose prose-lg max-w-none">
              <div className="bg-blue-50 border-l-4 border-primary dark:border-darkMode-link p-6 rounded-r-lg mb-8">
                <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-text mb-2">Quick Summary</h2>
                <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary">
                  TajiConnect is committed to protecting your privacy. We collect information to provide better
                  educational services, never sell your personal data, and give you control over your information.
                </p>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">1. Information We Collect</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">1.1 Information You Provide</h3>
                <ul className="list-disc ml-6 space-y-2 text-neutral-dark/80 dark:text-darkMode-textSecondary">
                  <li><strong>Account Information:</strong> Name, email address, password, profile picture</li>
                  <li><strong>Educational Information:</strong> Learning goals, skill assessments, course progress</li>
                  <li><strong>Payment Information:</strong> Billing details (processed securely through third-party providers)</li>
                  <li><strong>Communication:</strong> Messages, support requests, feedback</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">1.2 Information We Collect Automatically</h3>
                <ul className="list-disc ml-6 space-y-2 text-neutral-dark/80 dark:text-darkMode-textSecondary">
                  <li><strong>Usage Data:</strong> Course views, time spent learning, quiz results, progress metrics</li>
                  <li><strong>Device Information:</strong> IP address, browser type, device identifiers</li>
                  <li><strong>Analytics:</strong> How you interact with our platform to improve user experience</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">2. How We Use Your Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Educational Services</h3>
                    <ul className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary space-y-1">
                      <li>• Personalized learning recommendations</li>
                      <li>• Progress tracking and analytics</li>
                      <li>• Course completion certificates</li>
                      <li>• Career guidance and job matching</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-3">Platform Improvement</h3>
                    <ul className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary space-y-1">
                      <li>• Enhance user experience</li>
                      <li>• Develop new features</li>
                      <li>• Ensure platform security</li>
                      <li>• Provide customer support</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">3. Information Sharing</h2>
                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mb-4">
                  <p className="text-gray-800 font-medium">
                    🔒 We never sell your personal information to third parties.
                  </p>
                </div>

                <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary mb-4">We may share your information in the following limited circumstances:</p>
                <ul className="list-disc ml-6 space-y-2 text-neutral-dark/80 dark:text-darkMode-textSecondary">
                  <li><strong>Service Providers:</strong> Trusted partners who help operate our platform (hosting, payment processing, analytics)</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and users' safety</li>
                  <li><strong>Business Transfer:</strong> In case of merger or acquisition (with your consent)</li>
                  <li><strong>With Your Consent:</strong> Any other sharing will require your explicit permission</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">4. Data Security</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl mb-2">🔐</div>
                    <h3 className="font-semibold mb-2">Encryption</h3>
                    <p className="text-sm text-neutral-dark/70 dark:text-darkMode-textSecondary">All data is encrypted in transit and at rest</p>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl mb-2">🏢</div>
                    <h3 className="font-semibold mb-2">Secure Servers</h3>
                    <p className="text-sm text-neutral-dark/70 dark:text-darkMode-textSecondary">Hosted on industry-standard secure infrastructure</p>
                  </div>
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <div className="text-2xl mb-2">👥</div>
                    <h3 className="font-semibold mb-2">Limited Access</h3>
                    <p className="text-sm text-neutral-dark/70 dark:text-darkMode-textSecondary">Only authorized personnel have access to your data</p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">5. Your Rights and Choices</h2>
                <div className="bg-green-50 border border-green-200 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">You have the right to:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary space-y-2">
                      <li>✓ Access your personal information</li>
                      <li>✓ Update or correct your data</li>
                      <li>✓ Delete your account and data</li>
                      <li>✓ Export your learning data</li>
                    </ul>
                    <ul className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary space-y-2">
                      <li>✓ Opt out of marketing communications</li>
                      <li>✓ Control cookie preferences</li>
                      <li>✓ Request data portability</li>
                      <li>✓ Lodge a complaint with authorities</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">6. Cookies and Tracking</h2>
                <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary mb-4">
                  We use cookies and similar technologies to enhance your experience. You can control cookie
                  preferences through your browser settings or our cookie preferences center.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold mb-2">Essential Cookies</h3>
                    <p className="text-sm text-neutral-dark/70 dark:text-darkMode-textSecondary">Required for basic platform functionality</p>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold mb-2">Analytics Cookies</h3>
                    <p className="text-sm text-neutral-dark/70 dark:text-darkMode-textSecondary">Help us understand usage patterns (opt-out available)</p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">7. Children's Privacy</h2>
                <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg">
                  <p className="text-gray-800">
                    TajiConnect is designed for users 13 years and older. For users under 18, we require
                    parental consent and provide additional privacy protections as required by applicable laws.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">8. International Data Transfers</h2>
                <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary">
                  Your data may be processed in countries outside your residence. We ensure appropriate
                  safeguards are in place, including standard contractual clauses and adequacy decisions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">9. Changes to This Policy</h2>
                <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary">
                  We may update this privacy policy from time to time. We'll notify you of significant
                  changes via email or prominent notices on our platform. Continued use constitutes
                  acceptance of the updated policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">10. Contact Us</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary mb-4">
                    If you have questions about this privacy policy or want to exercise your rights:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary dark:text-darkMode-link" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-neutral-dark/70 dark:text-darkMode-textSecondary">privacy@tajiconnect.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary dark:text-darkMode-link" />
                      <div>
                        <p className="font-medium">Phone</p>
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
                to="/terms"
                className="px-4 py-2 text-primary dark:text-darkMode-link hover:text-primary-dark dark:hover:text-darkMode-accent transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="px-4 py-2 text-primary dark:text-darkMode-link hover:text-primary-dark dark:hover:text-darkMode-accent transition-colors"
              >
                Cookie Policy
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

export default PrivacyPolicy;