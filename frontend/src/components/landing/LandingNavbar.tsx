import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, GraduationCap, Sun, Moon } from 'lucide-react';
import { navLinks } from './data/landingData';

interface LandingNavbarProps {
  /** Whether dark mode is currently active */
  isDarkMode?: boolean;
  /** Callback to toggle dark mode */
  onToggleDarkMode?: () => void;
}

const LandingNavbar = ({ isDarkMode = false, onToggleDarkMode }: LandingNavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        const navbarHeight = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
      setIsMobileMenuOpen(false);
    }
  };

  // Mobile menu animation variants
  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        duration: 0.3,
        ease: 'easeInOut' as const,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut' as const,
      },
    },
  };

  const mobileMenuItemVariants = {
    closed: { opacity: 0, x: 20 },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3,
      },
    }),
  };

  return (
    <>
      {/* Skip link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent-gold focus:text-primary-dark focus:rounded-lg"
      >
        Skip to main content
      </a>

      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-darkMode-navbar/95 backdrop-blur-md shadow-md'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' as const }}
        role="banner"
      >
        <nav
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          aria-label="Main navigation"
        >
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 group"
              aria-label="TajiConnect home"
            >
              <motion.div
                className="w-10 h-10 bg-gradient-to-br from-primary to-primary-light dark:from-darkMode-progress dark:to-darkMode-success rounded-xl flex items-center justify-center shadow-md"
                whileHover={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.4 }}
              >
                <GraduationCap className="w-6 h-6 text-white" />
              </motion.div>
              <span
                className={`text-xl font-bold font-heading transition-colors ${
                  isScrolled
                    ? 'text-primary-dark dark:text-white'
                    : 'text-primary-dark dark:text-white'
                }`}
              >
                Taji<span className="text-accent-gold dark:text-darkMode-accent">Connect</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {/* Nav Links */}
              <ul className="flex items-center gap-6" role="list">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    {link.isAnchor ? (
                      <a
                        href={link.href}
                        onClick={(e) => handleAnchorClick(e, link.href)}
                        className={`font-medium transition-colors hover:text-primary dark:hover:text-darkMode-accent ${
                          isScrolled
                            ? 'text-gray-700 dark:text-darkMode-textSecondary'
                            : 'text-gray-700 dark:text-darkMode-textSecondary'
                        }`}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className={`font-medium transition-colors hover:text-primary dark:hover:text-darkMode-accent ${
                          isScrolled
                            ? 'text-gray-700 dark:text-darkMode-textSecondary'
                            : 'text-gray-700 dark:text-darkMode-textSecondary'
                        }`}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>

              {/* Dark mode toggle */}
              {onToggleDarkMode && (
                <button
                  onClick={onToggleDarkMode}
                  className={`p-2 rounded-lg transition-colors ${
                    isScrolled
                      ? 'text-gray-600 hover:bg-gray-100 dark:text-darkMode-textSecondary dark:hover:bg-darkMode-surface'
                      : 'text-gray-600 hover:bg-gray-100/50 dark:text-darkMode-textSecondary dark:hover:bg-white/10'
                  }`}
                  aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
              )}

              {/* Auth buttons */}
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className={`px-4 py-2 font-medium rounded-lg border-2 transition-all ${
                    isScrolled
                      ? 'border-primary text-primary hover:bg-primary hover:text-white dark:border-darkMode-accent dark:text-darkMode-accent dark:hover:bg-darkMode-accent dark:hover:text-darkMode-bg'
                      : 'border-primary text-primary hover:bg-primary hover:text-white dark:border-darkMode-accent dark:text-darkMode-accent dark:hover:bg-darkMode-accent dark:hover:text-darkMode-bg'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 font-medium rounded-lg bg-gradient-to-r from-accent-gold to-accent-goldLight dark:from-darkMode-accent dark:to-darkMode-accentHover text-primary-dark hover:shadow-gold transition-all"
                >
                  Sign Up
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-3">
              {/* Dark mode toggle (mobile) */}
              {onToggleDarkMode && (
                <button
                  onClick={onToggleDarkMode}
                  className="p-2 rounded-lg text-gray-600 dark:text-darkMode-textSecondary"
                  aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {isDarkMode ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-lg transition-colors ${
                  isScrolled
                    ? 'text-gray-700 dark:text-darkMode-text'
                    : 'text-gray-700 dark:text-white'
                }`}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Mobile menu panel */}
            <motion.div
              id="mobile-menu"
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white dark:bg-darkMode-surface z-50 md:hidden shadow-2xl"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-darkMode-border">
                  <span className="text-lg font-bold text-primary-dark dark:text-darkMode-text">
                    Menu
                  </span>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-darkMode-textSecondary dark:hover:bg-darkMode-bg"
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Navigation links */}
                <nav className="flex-1 overflow-y-auto p-4">
                  <ul className="space-y-2">
                    {navLinks.map((link, index) => (
                      <motion.li
                        key={link.id}
                        custom={index}
                        variants={mobileMenuItemVariants}
                        initial="closed"
                        animate="open"
                      >
                        {link.isAnchor ? (
                          <a
                            href={link.href}
                            onClick={(e) => handleAnchorClick(e, link.href)}
                            className="block py-3 px-4 text-lg font-medium text-gray-700 dark:text-darkMode-textSecondary hover:bg-primary/5 dark:hover:bg-darkMode-progress/10 hover:text-primary dark:hover:text-darkMode-accent rounded-lg transition-colors"
                          >
                            {link.label}
                          </a>
                        ) : (
                          <Link
                            to={link.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block py-3 px-4 text-lg font-medium text-gray-700 dark:text-darkMode-textSecondary hover:bg-primary/5 dark:hover:bg-darkMode-progress/10 hover:text-primary dark:hover:text-darkMode-accent rounded-lg transition-colors"
                          >
                            {link.label}
                          </Link>
                        )}
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                {/* Auth buttons */}
                <div className="p-4 border-t border-gray-100 dark:border-darkMode-border space-y-3">
                  <motion.div
                    custom={navLinks.length}
                    variants={mobileMenuItemVariants}
                    initial="closed"
                    animate="open"
                  >
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full py-3 px-4 text-center font-medium border-2 border-primary dark:border-darkMode-accent text-primary dark:text-darkMode-accent rounded-lg hover:bg-primary hover:text-white dark:hover:bg-darkMode-accent dark:hover:text-darkMode-bg transition-colors"
                    >
                      Login
                    </Link>
                  </motion.div>
                  <motion.div
                    custom={navLinks.length + 1}
                    variants={mobileMenuItemVariants}
                    initial="closed"
                    animate="open"
                  >
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full py-3 px-4 text-center font-medium bg-gradient-to-r from-accent-gold to-accent-goldLight dark:from-darkMode-accent dark:to-darkMode-accentHover text-primary-dark rounded-lg hover:shadow-gold transition-all"
                    >
                      Sign Up Free
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default LandingNavbar;
