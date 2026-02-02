import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TypewriterTextProps {
  /** The text to display with typewriter effect */
  text: string;
  /** Speed in milliseconds between each character */
  speed?: number;
  /** Delay in milliseconds before starting the animation */
  delay?: number;
  /** Whether to show the blinking cursor */
  showCursor?: boolean;
  /** Custom cursor character */
  cursor?: string;
  /** Callback when typing is complete */
  onComplete?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Tag to render (default: span) */
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
}

/**
 * TypewriterText - A reusable typewriter effect component
 * Respects prefers-reduced-motion for accessibility
 */
const TypewriterText = ({
  text,
  speed = 50,
  delay = 0,
  showCursor = true,
  cursor = '|',
  onComplete,
  className = '',
  as: Tag = 'span',
}: TypewriterTextProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const prefersReducedMotion = useRef(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check for reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      prefersReducedMotion.current = mediaQuery.matches;

      const handleChange = (e: MediaQueryListEvent) => {
        prefersReducedMotion.current = e.matches;
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const startTyping = useCallback(() => {
    // If user prefers reduced motion, show text immediately
    if (prefersReducedMotion.current) {
      setDisplayedText(text);
      setIsComplete(true);
      onComplete?.();
      return;
    }

    setIsTyping(true);
    let currentIndex = 0;

    const typeChar = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutRef.current = setTimeout(typeChar, speed);
      } else {
        setIsTyping(false);
        setIsComplete(true);
        onComplete?.();
      }
    };

    typeChar();
  }, [text, speed, onComplete]);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Reset state when text changes
    setDisplayedText('');
    setIsComplete(false);
    setIsTyping(false);

    // Start typing after delay
    timeoutRef.current = setTimeout(startTyping, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, delay, startTyping]);

  // Cursor blink animation variants
  const cursorVariants = {
    blink: {
      opacity: [1, 1, 0, 0],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: 'loop' as const,
        ease: 'linear' as const,
        times: [0, 0.5, 0.5, 1],
      },
    },
    solid: {
      opacity: 1,
    },
  };

  return (
    <Tag className={`inline ${className}`}>
      <span aria-label={text} role="text">
        {displayedText}
      </span>
      <AnimatePresence>
        {showCursor && (
          <motion.span
            className="inline-block ml-0.5 font-light text-accent-gold dark:text-darkMode-accent"
            initial={{ opacity: 1 }}
            animate={isTyping ? 'solid' : 'blink'}
            variants={cursorVariants}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            aria-hidden="true"
          >
            {cursor}
          </motion.span>
        )}
      </AnimatePresence>
      {/* Screen reader only: full text for accessibility */}
      <span className="sr-only">{text}</span>
    </Tag>
  );
};

export default TypewriterText;
