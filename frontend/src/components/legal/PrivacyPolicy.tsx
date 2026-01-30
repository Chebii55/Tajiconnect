import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Mail, Phone, Clock, ArrowLeft } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-[#0f1419] dark:via-[#1a1f2e] dark:to-[#0f1419] font-['Inter']">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary dark:text-emerald-400 hover:text-primary-dark dark:hover:text-emerald-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-primary to-primary-dark dark:from-emerald-500 dark:to-emerald-600 rounded-lg shadow-lg dark:shadow-emerald-500/20">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-primary-dark dark:text-white">Privacy Policy</h1>
              <p className="text-neutral-dark/70 dark:text-gray-400">How we collect, use, and protect your information</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-neutral-dark/70 dark:text-gray-400">
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
          <div className="bg-white dark:bg-[#1e2433] rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/20 p-8 dark:border dark:border-gray-700/50">
            <div className="prose prose-lg max-w-none">
              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-primary dark:border-emerald-500 p-6 rounded-r-lg mb-8">
                <h2 className="text-xl font-bold text-primary-dark dark:text-white mb-2">Quick Summary</h2>
                <p className="text-neutral-dark/80 dark:text-gray-300">
                  TajiConnect is committed to protecting your privacy. We collect information to provide better
                  educational services, never sell your personal data, and give you control over your information.
                </p>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4">1. Information We Collect</h2>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">1.1 Information You Provide</h3>
                <ul className="list-disc ml-6 space-y-2 text-neutral-dark/80 dark:text-gray-300">
                  <li><strong className="dark:text-white">Account Information:</strong> Name, email address, password, profile picture</li>
                  <li><strong className="dark:text-white">Educational Information:</strong> Learning goals, skill assessments, course progress</li>
                  <li><strong className="dark:text-white">Payment Information:</strong> Billing details (processed securely through third-party providers)</li>
                  <li><strong className="dark:text-white">Communication:</strong> Messages, support requests, feedback</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-6">1.2 Information We Collect Automatically</h3>
                <ul className="list-disc ml-6 space-y-2 text-neutral-dark/80 dark:text-gray-300">
                  <li><strong className="dark:text-white">Usage Data:</strong> Course views, time spent learning, quiz results, progress metrics</li>
                  <li><strong className="dark:text-white">Device Information:</strong> IP address, browser type, device identifiers</li>
                  <li><strong className="dark:text-white">Analytics:</strong> How you interact with our platform to improve user experience</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4">2. How We Use Your Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-[#262d3d] p-6 rounded-lg border dark:border-gray-600">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Educational Services</h3>
                    <ul className="text-sm text-neutral-dark/80 dark:text-gray-300 space-y-1">
                      <li>• Personalized learning recommendations</li>
                      <li>• Progress tracking and analytics</li>
                      <li>• Course completion certificates</li>
                      <li>• Career guidance and job matching</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 dark:bg-[#262d3d] p-6 rounded-lg border dark:border-gray-600">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Platform Improvement</h3>
                    <ul className="text-sm text-neutral-dark/80 dark:text-gray-300 space-y-1">
                      <li>• Enhance user experience</li>
                      <li>• Develop new features</li>
                      <li>• Ensure platform security</li>
                      <li>• Provide customer support</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4">3. Information Sharing</h2>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 p-6 rounded-lg mb-4">
                  <p className="text-gray-800 dark:text-yellow-200 font-medium">
                    We never sell your personal information to third parties.
                  </p>
                </div>

                <p className="text-neutral-dark/80 dark:text-gray-300 mb-4">We may share your information in the following limited circumstances:</p>
                <ul className="list-disc ml-6 space-y-2 text-neutral-dark/80 dark:text-gray-300">
                  <li><strong className="dark:text-white">Service Providers:</strong> Trusted partners who help operate our platform (hosting, payment processing, analytics)</li>
                  <li><strong className="dark:text-white">Legal Requirements:</strong> When required by law or to protect our rights and users' safety</li>
                  <li><strong className="dark:text-white">Business Transfer:</strong> In case of merger or acquisition (with your consent)</li>
                  <li><strong className="dark:text-white">With Your Consent:</strong> Any other sharing will require your explicit permission</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4">4. Data Security</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-[#262d3d]">
                    <div className="text-2xl mb-2">🔐</div>
                    <h3 className="font-semibold mb-2 dark:text-white">Encryption</h3>
                    <p className="text-sm text-neutral-dark/70 dark:text-gray-400">All data is encrypted in transit and at rest</p>
                  </div>
                  <div className="text-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-[#262d3d]">
                    <div className="text-2xl mb-2">🏢</div>
                    <h3 className="font-semibold mb-2 dark:text-white">Secure Servers</h3>
                    <p className="text-sm text-neutral-dark/70 dark:text-gray-400">Hosted on industry-standard secure infrastructure</p>
                  </div>
                  <div className="text-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-[#262d3d]">
                    <div className="text-2xl mb-2">👥</div>
                    <h3 className="font-semibold mb-2 dark:text-white">Limited Access</h3>
                    <p className="text-sm text-neutral-dark/70 dark:text-gray-400">Only authorized personnel have access to your data</p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4">5. Your Rights and Choices</h2>
                <div className="bg-green-50 dark:bg-emerald-900/20 border border-green-200 dark:border-emerald-700/50 p-6 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">You have the right to:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm text-neutral-dark/80 dark:text-gray-300 space-y-2">
                      <li>✓ Access your personal information</li>
                      <li>✓ Update or correct your data</li>
                      <li>✓ Delete your account and data</li>
                      <li>✓ Export your learning data</li>
                    </ul>
                    <ul className="text-sm text-neutral-dark/80 dark:text-gray-300 space-y-2">
                      <li>✓ Opt out of marketing communications</li>
                      <li>✓ Control cookie preferences</li>
                      <li>✓ Request data portability</li>
                      <li>✓ Lodge a complaint with authorities</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4">6. Cookies and Tracking</h2>
                <p className="text-neutral-dark/80 dark:text-gray-300 mb-4">
                  We use cookies and similar technologies to enhance your experience. You can control cookie
                  preferences through your browser settings or our cookie preferences center.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-[#262d3d]">
                    <h3 className="font-semibold mb-2 dark:text-white">Essential Cookies</h3>
                    <p className="text-sm text-neutral-dark/70 dark:text-gray-400">Required for basic platform functionality</p>
                  </div>
                  <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-[#262d3d]">
                    <h3 className="font-semibold mb-2 dark:text-white">Analytics Cookies</h3>
                    <p className="text-sm text-neutral-dark/70 dark:text-gray-400">Help us understand usage patterns (opt-out available)</p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4">7. Children's Privacy</h2>
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700/50 p-6 rounded-lg">
                  <p className="text-gray-800 dark:text-orange-200">
                    TajiConnect is designed for users 13 years and older. For users under 18, we require
                    parental consent and provide additional privacy protections as required by applicable laws.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4">8. International Data Transfers</h2>
                <p className="text-neutral-dark/80 dark:text-gray-300">
                  Your data may be processed in countries outside your residence. We ensure appropriate
                  safeguards are in place, including standard contractual clauses and adequacy decisions.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4">9. Changes to This Policy</h2>
                <p className="text-neutral-dark/80 dark:text-gray-300">
                  We may update this privacy policy from time to time. We'll notify you of significant
                  changes via email or prominent notices on our platform. Continued use constitutes
                  acceptance of the updated policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-4">10. Contact Us</h2>
                <div className="bg-gray-50 dark:bg-[#262d3d] p-6 rounded-lg border dark:border-gray-600">
                  <p className="text-neutral-dark/80 dark:text-gray-300 mb-4">
                    If you have questions about this privacy policy or want to exercise your rights:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary dark:text-emerald-400" />
                      <div>
                        <p className="font-medium dark:text-white">Email</p>
                        <p className="text-sm text-neutral-dark/70 dark:text-gray-400">privacy@tajiconnect.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-primary dark:text-emerald-400" />
                      <div>
                        <p className="font-medium dark:text-white">Phone</p>
                        <p className="text-sm text-neutral-dark/70 dark:text-gray-400">+254 700 000 000</p>
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
                className="px-4 py-2 text-primary dark:text-emerald-400 hover:text-primary-dark dark:hover:text-emerald-300 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="px-4 py-2 text-primary dark:text-emerald-400 hover:text-primary-dark dark:hover:text-emerald-300 transition-colors"
              >
                Cookie Policy
              </Link>
              <Link
                to="/support"
                className="px-4 py-2 bg-gradient-to-r from-primary to-primary-dark dark:from-emerald-500 dark:to-emerald-600 text-white rounded-lg hover:from-primary-dark hover:to-primary dark:hover:from-emerald-600 dark:hover:to-emerald-700 transition-all shadow-lg dark:shadow-emerald-500/20"
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
