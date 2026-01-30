import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Mail,
  Phone,
  MessageSquare,
  BookOpen,
  FileQuestion,
  Clock,
  ArrowLeft,
  Send,
  CheckCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const Support: React.FC = () => {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const faqs: FAQItem[] = [
    {
      question: 'How do I reset my password?',
      answer: 'Click "Forgot password?" on the login page, enter your email address, and we\'ll send you a link to reset your password. The link expires in 24 hours.'
    },
    {
      question: 'How do I upgrade to Premium?',
      answer: 'Go to Settings > Subscription and choose a premium plan. You can pay monthly or annually. All plans include a 7-day free trial.'
    },
    {
      question: 'Can I download my certificates?',
      answer: 'Yes! Navigate to Achievements > Certificates to view and download all your earned certificates as PDF files.'
    },
    {
      question: 'How does the job matching feature work?',
      answer: 'Our AI analyzes your skills, learning progress, and career goals to match you with relevant job opportunities. The more assessments you complete, the better the matches.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use industry-standard encryption, secure servers, and never sell your personal data. Read our Privacy Policy for full details.'
    },
    {
      question: 'How do I delete my account?',
      answer: 'Go to Settings > Account > Delete Account. Your data will be retained for 90 days for recovery purposes, then permanently deleted.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setIsSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

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
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-primary-dark dark:text-white">Support Center</h1>
              <p className="text-neutral-dark/70 dark:text-gray-400">We're here to help you succeed</p>
            </div>
          </div>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-[#1e2433] rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/20 p-6 dark:border dark:border-gray-700/50 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Email Support</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Get a response within 24 hours</p>
            <a href="mailto:support@tajiconnect.com" className="text-primary dark:text-emerald-400 font-medium hover:underline">
              support@tajiconnect.com
            </a>
          </div>

          <div className="bg-white dark:bg-[#1e2433] rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/20 p-6 dark:border dark:border-gray-700/50 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-green-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Phone Support</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Mon-Fri, 9AM - 6PM EAT</p>
            <a href="tel:+254700000000" className="text-primary dark:text-emerald-400 font-medium hover:underline">
              +254 700 000 000
            </a>
          </div>

          <div className="bg-white dark:bg-[#1e2433] rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/20 p-6 dark:border dark:border-gray-700/50 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Chat with our support team</p>
            <button className="text-primary dark:text-emerald-400 font-medium hover:underline">
              Start Chat
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <FileQuestion className="w-6 h-6 text-primary dark:text-emerald-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-[#1e2433] rounded-xl shadow dark:shadow-black/20 dark:border dark:border-gray-700/50 overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-[#262d3d] transition-colors"
                  >
                    <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                    {expandedFAQ === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    )}
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Help Resources */}
            <div className="mt-8">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-primary dark:text-emerald-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Help Resources</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Link
                  to="/privacy"
                  className="p-4 bg-white dark:bg-[#1e2433] rounded-lg shadow dark:shadow-black/20 dark:border dark:border-gray-700/50 hover:shadow-md transition-shadow"
                >
                  <p className="font-medium text-gray-900 dark:text-white">Privacy Policy</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">How we protect your data</p>
                </Link>
                <Link
                  to="/terms"
                  className="p-4 bg-white dark:bg-[#1e2433] rounded-lg shadow dark:shadow-black/20 dark:border dark:border-gray-700/50 hover:shadow-md transition-shadow"
                >
                  <p className="font-medium text-gray-900 dark:text-white">Terms of Service</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Usage guidelines</p>
                </Link>
                <Link
                  to="/cookies"
                  className="p-4 bg-white dark:bg-[#1e2433] rounded-lg shadow dark:shadow-black/20 dark:border dark:border-gray-700/50 hover:shadow-md transition-shadow"
                >
                  <p className="font-medium text-gray-900 dark:text-white">Cookie Policy</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">How we use cookies</p>
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Send className="w-6 h-6 text-primary dark:text-emerald-400" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Send us a Message</h2>
            </div>

            {isSubmitted ? (
              <div className="bg-white dark:bg-[#1e2433] rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/20 p-8 dark:border dark:border-gray-700/50 text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Thank you for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-primary dark:text-emerald-400 font-medium hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1e2433] rounded-xl shadow-lg dark:shadow-2xl dark:shadow-black/20 p-8 dark:border dark:border-gray-700/50">
                <div className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-[#262d3d] dark:text-white dark:placeholder-gray-500"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-[#262d3d] dark:text-white dark:placeholder-gray-500"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-[#262d3d] dark:text-white"
                    >
                      <option value="">Select a topic</option>
                      <option value="account">Account Issues</option>
                      <option value="billing">Billing & Payments</option>
                      <option value="technical">Technical Support</option>
                      <option value="courses">Course Content</option>
                      <option value="feedback">Feedback & Suggestions</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-emerald-500 focus:border-transparent bg-white dark:bg-[#262d3d] dark:text-white dark:placeholder-gray-500 resize-none"
                      placeholder="Describe your issue or question..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-gradient-to-r from-primary to-primary-dark dark:from-emerald-500 dark:to-emerald-600 text-white rounded-lg hover:from-primary-dark hover:to-primary dark:hover:from-emerald-600 dark:hover:to-emerald-700 focus:ring-2 focus:ring-primary dark:focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-[#1e2433] transition-all font-medium shadow-lg dark:shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send Message
                  </button>
                </div>
              </form>
            )}

            {/* Response Time */}
            <div className="mt-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Average response time: 4-6 hours during business hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;
