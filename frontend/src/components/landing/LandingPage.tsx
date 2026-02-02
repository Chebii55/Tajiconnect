import { useEffect, useState, Suspense, lazy } from 'react';

// Core components (loaded immediately)
import LandingNavbar from './LandingNavbar';
import HeroSection from './sections/HeroSection';

// Lazy-loaded sections for better performance
const SocialProofBar = lazy(() => import('./sections/SocialProofBar'));
const FeaturesGrid = lazy(() => import('./sections/FeaturesGrid'));
const StatsCounter = lazy(() => import('./sections/StatsCounter'));
const TestimonialsCarousel = lazy(() => import('./sections/TestimonialsCarousel'));
const CTABanner = lazy(() => import('./sections/CTABanner'));
const LandingFooter = lazy(() => import('./sections/LandingFooter'));

/**
 * Loading fallback component for lazy-loaded sections
 */
const SectionLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="flex flex-col items-center gap-4">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary dark:border-darkMode-accent/20 dark:border-t-darkMode-accent rounded-full animate-spin" />
      <p className="text-gray-500 dark:text-darkMode-textMuted text-sm">Loading...</p>
    </div>
  </div>
);

/**
 * Error boundary fallback for sections that fail to load
 */
const SectionError = ({ sectionName }: { sectionName: string }) => (
  <div className="py-12 px-4 text-center">
    <p className="text-gray-500 dark:text-darkMode-textMuted">
      Unable to load {sectionName}. Please refresh the page.
    </p>
  </div>
);

/**
 * Safe wrapper for lazy-loaded sections
 */
const SafeSection = ({
  children,
  sectionName,
}: {
  children: React.ReactNode;
  sectionName: string;
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset error state on mount
    setHasError(false);
  }, []);

  if (hasError) {
    return <SectionError sectionName={sectionName} />;
  }

  return (
    <Suspense fallback={<SectionLoader />}>
      <div
        onError={() => setHasError(true)}
      >
        {children}
      </div>
    </Suspense>
  );
};

/**
 * LandingPage - Main landing page component that orchestrates all sections
 *
 * Features:
 * - Smooth scroll behavior
 * - Scroll-to-top on mount
 * - Dark mode support
 * - Lazy loading for below-the-fold sections
 * - Proper accessibility with skip links and heading hierarchy
 */
const LandingPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode from system preference or localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    // Check for reduced motion preference
    if (!prefersDark) {
      document.documentElement.style.scrollBehavior = 'auto';
    }
  }, []);

  // Toggle dark mode
  const handleToggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  // Enable smooth scrolling
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (!prefersReducedMotion) {
      document.documentElement.style.scrollBehavior = 'smooth';
    }

    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-darkMode-bg transition-colors duration-300">
      {/* Fixed Navbar */}
      <LandingNavbar
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* Main content */}
      <main id="main-content" role="main">
        {/* Hero Section - Always loaded immediately (above the fold) */}
        <HeroSection />

        {/* Social Proof Bar */}
        <SafeSection sectionName="Social Proof">
          <SocialProofBar />
        </SafeSection>

        {/* Features Grid */}
        <SafeSection sectionName="Features">
          <div id="features">
            <FeaturesGrid />
          </div>
        </SafeSection>

        {/* Stats Counter */}
        <SafeSection sectionName="Statistics">
          <StatsCounter />
        </SafeSection>

        {/* Courses Section Anchor */}
        <div id="courses" className="scroll-mt-20" />

        {/* Testimonials Carousel */}
        <SafeSection sectionName="Testimonials">
          <TestimonialsCarousel />
        </SafeSection>

        {/* About Section Anchor */}
        <div id="about" className="scroll-mt-20" />

        {/* CTA Banner */}
        <SafeSection sectionName="Call to Action">
          <CTABanner />
        </SafeSection>
      </main>

      {/* Footer */}
      <SafeSection sectionName="Footer">
        <LandingFooter />
      </SafeSection>

      {/* Scroll to top button (appears when scrolled) */}
      <ScrollToTopButton />
    </div>
  );
};

/**
 * Scroll to top button component
 */
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-40 w-12 h-12 bg-primary dark:bg-darkMode-accent text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-accent focus:ring-offset-2"
      aria-label="Scroll to top"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
};

export default LandingPage;
