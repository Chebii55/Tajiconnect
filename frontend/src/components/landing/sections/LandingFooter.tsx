import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: 'Platform',
    links: [
      { label: 'Browse Courses', href: '/courses' },
      { label: 'Learning Paths', href: '/paths' },
      { label: 'Career Guidance', href: '/careers' },
      { label: 'Job Board', href: '/jobs' },
      { label: 'Certificates', href: '/certificates' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Blog', href: '/blog' },
      { label: 'Community', href: '/community' },
      { label: 'Success Stories', href: '/stories' },
      { label: 'API Documentation', href: '/docs', external: true },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Partnerships', href: '/partners' },
      { label: 'Become a Trainer', href: '/trainer/login' },
      { label: 'Careers at Taji', href: '/careers' },
    ],
  },
];

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com/tajiconnect', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com/tajiconnect', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com/tajiconnect', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com/company/tajiconnect', label: 'LinkedIn' },
  { icon: Youtube, href: 'https://youtube.com/tajiconnect', label: 'YouTube' },
];

const LandingFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-[#111827] text-white"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-primary to-primary-light rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.4 }}
              >
                <span className="text-2xl">T</span>
              </motion.div>
              <span className="text-2xl font-bold font-heading">
                Taji<span className="text-accent-gold">Connect</span>
              </span>
            </Link>

            <p className="text-gray-400 mb-6 max-w-sm leading-relaxed">
              Empowering African youth through personalized learning, career
              development, and real job opportunities. Building the future of
              education in Africa.
            </p>

            {/* Contact info */}
            <div className="space-y-3 text-gray-400">
              <a
                href="mailto:hello@tajiconnect.com"
                className="flex items-center gap-3 hover:text-accent-gold transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span>hello@tajiconnect.com</span>
              </a>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                <span>Nairobi, Kenya</span>
              </div>
              <a
                href="tel:+254700000000"
                className="flex items-center gap-3 hover:text-accent-gold transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span>+254 700 000 000</span>
              </a>
            </div>

            {/* Social links */}
            <div className="flex gap-4 mt-8">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-accent-gold hover:border-accent-gold/50 hover:bg-accent-gold/10 transition-all duration-300"
                    whileHover={{ y: -3 }}
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Link columns */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-lg mb-6">{section.title}</h3>
              <ul className="space-y-4">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-accent-gold transition-colors duration-200 inline-flex items-center gap-1"
                      >
                        {link.label}
                        <span className="text-xs">(external)</span>
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-accent-gold transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter signup */}
        <div className="mt-16 p-8 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                Stay Updated with TajiConnect
              </h3>
              <p className="text-gray-400">
                Get the latest courses, career tips, and opportunities delivered
                to your inbox.
              </p>
            </div>
            <form
              className="flex gap-3 w-full md:w-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                id="newsletter-email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent transition-all"
              />
              <motion.button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-accent-gold to-accent-goldLight text-forest-deepest font-semibold rounded-lg hover:shadow-gold transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Subscribe
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              &copy; {currentYear} TajiConnect. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
              <Link
                to="/privacy"
                className="hover:text-accent-gold transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="hover:text-accent-gold transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="/cookies"
                className="hover:text-accent-gold transition-colors"
              >
                Cookie Policy
              </Link>
              <Link
                to="/accessibility"
                className="hover:text-accent-gold transition-colors"
              >
                Accessibility
              </Link>
            </div>

            {/* Language/Region selector placeholder */}
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>Africa</span>
              <span className="text-accent-gold">|</span>
              <span>English</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
