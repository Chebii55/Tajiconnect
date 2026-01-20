import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Mail, Phone, Clock, ArrowLeft, AlertTriangle, UserCheck, Shield } from 'lucide-react';

const TermsOfService: React.FC = () => {
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
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-primary-dark dark:text-darkMode-text">Terms of Service</h1>
              <p className="text-neutral-dark/70 dark:text-darkMode-textSecondary">Your rights and responsibilities using TajiConnect</p>
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
              <div className="bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-lg mb-8">
                <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-text mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  Important Notice
                </h2>
                <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary">
                  By using TajiConnect, you agree to these terms. Please read them carefully as they contain
                  important information about your rights, responsibilities, and the limitations of our service.
                </p>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">1. Acceptance of Terms</h2>
                <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary mb-4">
                  By accessing or using TajiConnect (&quot;the Platform&quot;), you agree to be bound by these Terms of Service
                  and all applicable laws and regulations. If you do not agree with these terms, you are prohibited
                  from using or accessing this platform.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">
                    <strong>Note:</strong> These terms constitute a legally binding agreement between you and TajiConnect.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">2. User Accounts and Eligibility</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.1 Age Requirements</h3>
                <ul className="list-disc ml-6 space-y-2 text-neutral-dark/80 dark:text-darkMode-textSecondary mb-4">
                  <li>Users must be at least 13 years old to create an account</li>
                  <li>Users under 18 require parental consent and supervision</li>
                  <li>Parents/guardians are responsible for monitoring minors&apos; platform usage</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">2.2 Account Responsibilities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      Your Responsibilities
                    </h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• Provide accurate information</li>
                      <li>• Maintain account security</li>
                      <li>• Use platform responsibly</li>
                      <li>• Report violations promptly</li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Prohibited Actions
                    </h4>
                    <ul className="text-sm text-red-800 space-y-1">
                      <li>• Share account credentials</li>
                      <li>• Create multiple accounts</li>
                      <li>• Impersonate others</li>
                      <li>• Engage in harmful behavior</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">3. Platform Usage</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Permitted Use</h3>
                <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary mb-4">
                  TajiConnect is designed for educational purposes. You may use the platform to:
                </p>
                <ul className="list-disc ml-6 space-y-2 text-neutral-dark/80 dark:text-darkMode-textSecondary mb-6">
                  <li>Access educational content and courses</li>
                  <li>Track your learning progress and achievements</li>
                  <li>Receive career guidance and job recommendations</li>
                  <li>Participate in assessments and skill evaluations</li>
                  <li>Connect with educational and career opportunities</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Content Standards</h3>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary mb-3">All user-generated content must:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary space-y-2">
                      <li>✓ Be respectful and appropriate</li>
                      <li>✓ Comply with applicable laws</li>
                      <li>✓ Respect intellectual property rights</li>
                      <li>✓ Be accurate and truthful</li>
                    </ul>
                    <ul className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary space-y-2">
                      <li>✗ Contain hate speech or discrimination</li>
                      <li>✗ Include violent or harmful content</li>
                      <li>✗ Violate privacy or confidentiality</li>
                      <li>✗ Spread misinformation</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">4. Intellectual Property</h2>
                <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-4">
                  <h3 className="font-semibold text-primary-dark dark:text-darkMode-text mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Platform Content
                  </h3>
                  <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary">
                    All platform content, including courses, assessments, interface design, and proprietary algorithms,
                    is owned by TajiConnect or our content partners and protected by intellectual property laws.
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">4.1 User Content License</h3>
                <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary mb-4">
                  When you submit content to the platform, you grant TajiConnect a limited license to use, display,
                  and distribute that content solely for platform operation and improvement purposes.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">5. Payment and Subscription Terms</h2>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 Free and Premium Services</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-semibold mb-2">Free Tier</h4>
                    <ul className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary space-y-1">
                      <li>• Basic course access</li>
                      <li>• Limited assessments</li>
                      <li>• Basic progress tracking</li>
                      <li>• General career guidance</li>
                    </ul>
                  </div>
                  <div className="p-4 border border-primary dark:border-darkMode-link bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Premium Features</h4>
                    <ul className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary space-y-1">
                      <li>• Full course library access</li>
                      <li>• Advanced assessments</li>
                      <li>• Detailed analytics</li>
                      <li>• Personalized job matching</li>
                      <li>• Priority support</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">5.2 Billing and Refunds</h3>
                <ul className="list-disc ml-6 space-y-2 text-neutral-dark/80 dark:text-darkMode-textSecondary">
                  <li>Subscription fees are billed monthly or annually as selected</li>
                  <li>Refunds available within 30 days of purchase with valid reason</li>
                  <li>Cancellation takes effect at the end of current billing period</li>
                  <li>Price changes require 30 days advance notice</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">6. Limitation of Liability</h2>
                <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg">
                  <p className="text-gray-800 mb-4">
                    <strong>Important:</strong> TajiConnect provides educational guidance and job recommendations
                    based on available data and algorithms. We cannot guarantee:
                  </p>
                  <ul className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary space-y-2">
                    <li>• Specific learning outcomes or skill acquisition</li>
                    <li>• Job placement or career advancement</li>
                    <li>• Accuracy of third-party content or job listings</li>
                    <li>• Uninterrupted platform availability</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">7. Termination</h2>
                <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary mb-4">
                  Either party may terminate this agreement at any time. TajiConnect reserves the right to
                  suspend or terminate accounts that violate these terms or engage in harmful behavior.
                </p>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">7.1 Data Retention</h3>
                <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary">
                  Upon termination, your account data will be retained for 90 days for account recovery purposes,
                  then permanently deleted unless required by law to retain longer.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">8. Changes to Terms</h2>
                <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary">
                  We may update these terms from time to time to reflect changes in our services or legal requirements.
                  Significant changes will be communicated via email or platform notifications with at least 30 days notice.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">9. Governing Law</h2>
                <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary">
                  These terms are governed by the laws of [Jurisdiction] without regard to conflict of law principles.
                  Any disputes will be resolved through binding arbitration or in the courts of [Jurisdiction].
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-4">10. Contact Information</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary mb-4">
                    For questions about these Terms of Service or to report violations:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-primary dark:text-darkMode-link" />
                      <div>
                        <p className="font-medium">Legal Team</p>
                        <p className="text-sm text-neutral-dark/70 dark:text-darkMode-textSecondary">legal@tajiconnect.com</p>
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

export default TermsOfService;