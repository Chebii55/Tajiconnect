/**
 * Landing Page Components
 *
 * This module exports all landing page components for easy imports.
 * Usage: import { LandingPage, LandingNavbar } from '@/components/landing';
 */

// Main landing page component
export { default as LandingPage } from './LandingPage';

// Navigation component
export { default as LandingNavbar } from './LandingNavbar';

// Section components
export { default as HeroSection } from './sections/HeroSection';
export { default as SocialProofBar } from './sections/SocialProofBar';
export { default as FeaturesGrid } from './sections/FeaturesGrid';
export { default as StatsCounter } from './sections/StatsCounter';
export { default as TestimonialsCarousel } from './sections/TestimonialsCarousel';
export { default as CTABanner } from './sections/CTABanner';
export { default as LandingFooter } from './sections/LandingFooter';

// Animation components
export { default as TypewriterText } from './animations/TypewriterText';
export { default as FadeInOnScroll, FadeInStagger } from './animations/FadeInOnScroll';

// UI components
export { default as AnimatedButton } from './ui/AnimatedButton';

// Data and types
export * from './data/landingData';
