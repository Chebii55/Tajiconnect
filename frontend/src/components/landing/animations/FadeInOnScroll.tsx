import type { ReactNode } from 'react';
import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

interface FadeInOnScrollProps {
  /** Child elements to animate */
  children: ReactNode;
  /** Direction the element slides in from */
  direction?: Direction;
  /** Delay before animation starts (in seconds) */
  delay?: number;
  /** Duration of the animation (in seconds) */
  duration?: number;
  /** Distance to travel during animation (in pixels) */
  distance?: number;
  /** Threshold for triggering animation (0-1) */
  threshold?: number;
  /** Whether animation should only trigger once */
  once?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Custom Framer Motion variants */
  variants?: Variants;
  /** Whether to use stagger effect for children */
  stagger?: boolean;
  /** Stagger delay between children (in seconds) */
  staggerDelay?: number;
  /** Scale effect on entry */
  scale?: number;
  /** Rotation effect on entry (in degrees) */
  rotate?: number;
}

/**
 * FadeInOnScroll - A wrapper component for scroll-triggered animations
 * Uses Intersection Observer via Framer Motion's useInView hook
 * Respects prefers-reduced-motion for accessibility
 */
const FadeInOnScroll = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 40,
  threshold = 0.1,
  once = true,
  className = '',
  variants: customVariants,
  stagger = false,
  staggerDelay = 0.1,
  scale = 1,
  rotate = 0,
}: FadeInOnScrollProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount: threshold });
  const prefersReducedMotion = useReducedMotion();
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  // Calculate initial position based on direction
  const getInitialPosition = (): { x: number; y: number } => {
    switch (direction) {
      case 'up':
        return { x: 0, y: distance };
      case 'down':
        return { x: 0, y: -distance };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      case 'none':
      default:
        return { x: 0, y: 0 };
    }
  };

  const initialPosition = getInitialPosition();

  // Default animation variants
  const defaultVariants: Variants = {
    hidden: {
      opacity: 0,
      x: initialPosition.x,
      y: initialPosition.y,
      scale: scale !== 1 ? scale : 1,
      rotate: rotate !== 0 ? rotate : 0,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      rotate: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : duration,
        delay: prefersReducedMotion ? 0 : delay,
        ease: [0.25, 0.46, 0.45, 0.94], // Custom easing for natural feel
        ...(stagger && {
          staggerChildren: staggerDelay,
        }),
      },
    },
  };

  // Stagger child variants
  const childVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : duration * 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const variants = customVariants || defaultVariants;

  // If user prefers reduced motion, render without animation
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      className={className}
    >
      {stagger ? (
        <motion.div variants={childVariants}>{children}</motion.div>
      ) : (
        children
      )}
    </motion.div>
  );
};

/**
 * FadeInStagger - Container for staggered children animations
 */
interface FadeInStaggerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  direction?: Direction;
  distance?: number;
  duration?: number;
  delay?: number;
}

export const FadeInStagger = ({
  children,
  className = '',
  staggerDelay = 0.1,
  direction = 'up',
  distance = 30,
  duration = 0.5,
  delay = 0,
}: FadeInStaggerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const prefersReducedMotion = useReducedMotion();

  const getInitialPosition = (): { x: number; y: number } => {
    switch (direction) {
      case 'up':
        return { x: 0, y: distance };
      case 'down':
        return { x: 0, y: -distance };
      case 'left':
        return { x: distance, y: 0 };
      case 'right':
        return { x: -distance, y: 0 };
      case 'none':
      default:
        return { x: 0, y: 0 };
    }
  };

  const initialPosition = getInitialPosition();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: prefersReducedMotion ? 0 : delay,
        staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      x: initialPosition.x,
      y: initialPosition.y,
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : children}
    </motion.div>
  );
};

export default FadeInOnScroll;
