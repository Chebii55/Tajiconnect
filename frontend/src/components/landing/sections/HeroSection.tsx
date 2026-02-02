import { useState, useEffect, useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, BookOpen, Users, Star, Sparkles } from 'lucide-react';
import TypewriterText from '../animations/TypewriterText';
import FadeInOnScroll from '../animations/FadeInOnScroll';
import AnimatedButton from '../ui/AnimatedButton';

interface HeroSectionProps {
  /** Override the main headline text */
  headline?: string;
  /** Override the subheadline text */
  subheadline?: string;
  /** Starting count for learners counter */
  initialLearnerCount?: number;
  /** Path for primary CTA */
  primaryCtaPath?: string;
  /** Path for secondary CTA */
  secondaryCtaPath?: string;
}

/**
 * HeroSection - A stunning, modern hero section for TajiConnect landing page
 * Features:
 * - Animated gradient background (forest green #1E4F2A to gold #FDC500)
 * - Typewriter headline effect: "Build Skills That Get You Hired"
 * - Real-time learner counter with animated updates
 * - Floating decorative elements with glassmorphism
 * - Framer Motion animations (fade-in, slide-up)
 * - Mobile-first responsive design
 * - Dark mode support
 * - Prefers-reduced-motion respect
 */
const HeroSection = ({
  headline = 'Build Skills That Get You Hired',
  subheadline = 'Free career-focused courses designed for African youth',
  initialLearnerCount = 12847,
  primaryCtaPath = '/register',
  secondaryCtaPath = '/courses',
}: HeroSectionProps) => {
  const [learnerCount, setLearnerCount] = useState(initialLearnerCount);
  const [displayCount, setDisplayCount] = useState(initialLearnerCount);
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(contentRef, { once: true, margin: '-50px' });

  // Parallax effect on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

  // Simulate real-time learner count updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Random increment between 1-5 every 5-15 seconds
      const increment = Math.floor(Math.random() * 5) + 1;
      setLearnerCount((prev) => prev + increment);
    }, Math.random() * 10000 + 5000);

    return () => clearInterval(interval);
  }, []);

  // Animated counter effect
  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayCount(learnerCount);
      return;
    }

    const duration = 1000; // 1 second animation
    const startCount = displayCount;
    const endCount = learnerCount;
    const diff = endCount - startCount;
    const startTime = performance.now();

    const animateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(startCount + diff * easeOutQuart);

      setDisplayCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      }
    };

    requestAnimationFrame(animateCount);
  }, [learnerCount, prefersReducedMotion]);

  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString('en-US');
  };

  // Floating shapes configuration
  const floatingShapes = [
    { id: 1, size: 'w-16 h-16 md:w-24 md:h-24', position: 'top-20 left-[5%] md:left-[10%]', delay: 0, shape: 'circle' },
    { id: 2, size: 'w-12 h-12 md:w-20 md:h-20', position: 'top-32 right-[8%] md:right-[15%]', delay: 0.5, shape: 'square' },
    { id: 3, size: 'w-8 h-8 md:w-16 md:h-16', position: 'bottom-40 left-[15%] md:left-[20%]', delay: 1, shape: 'circle' },
    { id: 4, size: 'w-10 h-10 md:w-14 md:h-14', position: 'bottom-32 right-[10%] md:right-[12%]', delay: 1.5, shape: 'square' },
    { id: 5, size: 'w-6 h-6 md:w-12 md:h-12', position: 'top-48 left-[25%]', delay: 2, shape: 'circle' },
    { id: 6, size: 'w-14 h-14 md:w-18 md:h-18', position: 'bottom-48 right-[25%]', delay: 0.75, shape: 'square' },
  ];

  // Animation variants for floating shapes
  const floatVariants = {
    animate: (delay: number) => ({
      y: [0, -20, 0],
      rotate: [0, 5, -5, 0],
      transition: {
        y: {
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut' as const,
          delay,
        },
        rotate: {
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut' as const,
          delay,
        },
      },
    }),
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' as const },
    },
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Animated Gradient Background - Forest Green (#1E4F2A) to Gold (#FDC500) */}
      <motion.div
        className="absolute inset-0 -z-20"
        style={prefersReducedMotion ? {} : { y: backgroundY }}
      >
        {/* Base gradient from primary green to gold - darkened for better text contrast */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0d2814 0%, #1E4F2A 25%, #2a6b3a 50%, #3A7D44 75%, #4a8a54 100%)',
          }}
        />

        {/* Dark mode gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-darkMode-bg via-darkMode-surface to-darkMode-navbar opacity-0 dark:opacity-100 transition-opacity duration-300" />

        {/* Animated gradient overlay for dynamic effect */}
        <motion.div
          className="absolute inset-0 dark:hidden"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  background: [
                    'linear-gradient(135deg, rgba(30, 79, 42, 0.9) 0%, rgba(58, 125, 68, 0.7) 50%, rgba(253, 197, 0, 0.4) 100%)',
                    'linear-gradient(135deg, rgba(30, 79, 42, 0.8) 0%, rgba(58, 125, 68, 0.6) 50%, rgba(253, 197, 0, 0.5) 100%)',
                    'linear-gradient(135deg, rgba(30, 79, 42, 0.9) 0%, rgba(58, 125, 68, 0.7) 50%, rgba(253, 197, 0, 0.4) 100%)',
                  ],
                }
          }
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          }}
        />

        {/* Radial glow effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(253,197,0,0.3),transparent)] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(230,201,122,0.1),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_100%,rgba(253,197,0,0.2),transparent)] dark:bg-[radial-gradient(ellipse_60%_40%_at_80%_100%,rgba(230,201,122,0.05),transparent)]" />
      </motion.div>

      {/* Floating Decorative Shapes */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {floatingShapes.map((shape) => (
          <motion.div
            key={shape.id}
            className={`absolute ${shape.size} ${shape.position}`}
            variants={floatVariants}
            animate={prefersReducedMotion ? {} : 'animate'}
            custom={shape.delay}
          >
            {/* Abstract shapes with glassmorphism */}
            <div
              className={`w-full h-full backdrop-blur-sm border border-white/20 dark:border-darkMode-accent/20 ${
                shape.shape === 'circle'
                  ? 'rounded-full bg-white/10 dark:bg-darkMode-accent/10'
                  : 'rounded-2xl rotate-45 bg-accent-gold/10 dark:bg-darkMode-accent/10'
              }`}
            />
          </motion.div>
        ))}

        {/* Large ambient glow circles */}
        <motion.div
          className="absolute top-1/4 right-1/3 w-64 h-64 md:w-96 md:h-96 rounded-full bg-accent-gold/10 blur-3xl dark:bg-darkMode-accent/5"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }
          }
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-48 h-48 md:w-72 md:h-72 rounded-full bg-white/10 blur-3xl dark:bg-darkMode-progress/5"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  scale: [1.2, 1, 1.2],
                  opacity: [0.2, 0.4, 0.2],
                }
          }
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut' as const,
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        ref={contentRef}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center"
        style={prefersReducedMotion ? {} : { y: contentY }}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={containerVariants}
      >
        {/* Live Badge with Learner Count */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-dark/90 backdrop-blur-md border border-white/25 text-white text-sm font-medium dark:bg-darkMode-surface/50 dark:border-darkMode-border shadow-lg">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-gold opacity-75 dark:bg-darkMode-accent" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-gold dark:bg-darkMode-accent" />
            </span>
            <Sparkles className="w-4 h-4 text-accent-gold dark:text-darkMode-accent" />
            <span className="text-white dark:text-darkMode-text">
              Join <strong className="text-accent-gold dark:text-darkMode-accent">{formatNumber(displayCount)}+</strong> learners across Africa
            </span>
          </div>
        </motion.div>

        {/* Main Headline with Typewriter Effect */}
        <motion.div variants={itemVariants}>
          <h1
            id="hero-heading"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading text-white mb-6 leading-tight dark:text-darkMode-text drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
          >
            <TypewriterText
              text={headline}
              speed={60}
              delay={500}
              showCursor={true}
              className="text-white dark:text-darkMode-text"
            />
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl md:text-2xl text-white max-w-3xl mx-auto mb-10 leading-relaxed dark:text-darkMode-textSecondary drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
        >
          {subheadline}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
        >
          <AnimatedButton
            as="link"
            to={primaryCtaPath}
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Start Learning Free
          </AnimatedButton>
          <AnimatedButton
            as="link"
            to={secondaryCtaPath}
            variant="outline"
            size="lg"
            leftIcon={<BookOpen className="w-5 h-5" />}
          >
            Explore Courses
          </AnimatedButton>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 text-white dark:text-darkMode-textSecondary drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)]"
        >
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary-dark/80 dark:bg-darkMode-surface/50">
              <Users className="w-5 h-5 text-accent-gold dark:text-darkMode-accent" />
            </div>
            <span className="text-sm sm:text-base">
              <strong className="text-white dark:text-darkMode-text text-lg">
                {formatNumber(displayCount)}+
              </strong>
              <span className="ml-1 text-white/90">Active Learners</span>
            </span>
          </div>

          <div className="hidden sm:block w-px h-8 bg-white/30 dark:bg-darkMode-border" />

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary-dark/80 dark:bg-darkMode-surface/50">
              <BookOpen className="w-5 h-5 text-accent-gold dark:text-darkMode-accent" />
            </div>
            <span className="text-sm sm:text-base">
              <strong className="text-white dark:text-darkMode-text text-lg">50+</strong>
              <span className="ml-1 text-white/90">Free Courses</span>
            </span>
          </div>

          <div className="hidden sm:block w-px h-8 bg-white/30 dark:bg-darkMode-border" />

          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-primary-dark/80 dark:bg-darkMode-surface/50">
              <Star className="w-5 h-5 text-accent-gold dark:text-darkMode-accent fill-accent-gold dark:fill-darkMode-accent" />
            </div>
            <span className="text-sm sm:text-base">
              <strong className="text-white dark:text-darkMode-text text-lg">4.9/5</strong>
              <span className="ml-1 text-white/90">Rating</span>
            </span>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.5 }}
        >
          <motion.div
            animate={
              prefersReducedMotion
                ? {}
                : {
                    y: [0, 8, 0],
                  }
            }
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut' as const,
            }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-white/40 flex justify-center pt-2 dark:border-darkMode-border">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-white/70 dark:bg-darkMode-textMuted"
                animate={
                  prefersReducedMotion
                    ? {}
                    : {
                        y: [0, 12, 0],
                        opacity: [1, 0.3, 1],
                      }
                }
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom Gradient Fade for smooth transition to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-neutral-light via-neutral-light/50 to-transparent dark:from-darkMode-bg dark:via-darkMode-bg/50 pointer-events-none" />
    </section>
  );
};

export default HeroSection;
