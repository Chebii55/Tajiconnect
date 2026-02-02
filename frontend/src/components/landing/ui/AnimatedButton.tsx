import { forwardRef, useState, useRef } from 'react';
import type { ButtonHTMLAttributes, MouseEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { LinkProps } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'dark' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface RippleEffect {
  x: number;
  y: number;
  id: number;
}

interface BaseButtonProps {
  /** Button visual variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Whether button is in loading state */
  isLoading?: boolean;
  /** Whether button spans full width */
  fullWidth?: boolean;
  /** Icon to display before text */
  leftIcon?: React.ReactNode;
  /** Icon to display after text */
  rightIcon?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Children elements */
  children: React.ReactNode;
}

type ButtonAsButton = BaseButtonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: 'button';
    to?: never;
  };

type ButtonAsLink = BaseButtonProps &
  Omit<LinkProps, 'className'> & {
    as: 'link';
    to: string;
  };

type AnimatedButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * AnimatedButton - A highly interactive button component with:
 * - Scale on hover (1.05)
 * - Glow effect on primary variant
 * - Ripple effect on click
 * - Multiple variants: primary (gold), secondary (outline), dark
 * - Respects prefers-reduced-motion
 */
const AnimatedButton = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  AnimatedButtonProps
>((props, ref) => {
  const {
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    leftIcon,
    rightIcon,
    className = '',
    children,
    ...rest
  } = props;

  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const rippleIdRef = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  // Size classes
  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-2.5',
  };

  // Variant styles
  const variantClasses: Record<ButtonVariant, string> = {
    primary: `
      bg-accent-gold text-primary-dark font-semibold
      hover:bg-accent-goldLight
      dark:bg-accent-gold dark:text-primary-dark dark:hover:bg-accent-goldLight
      shadow-gold hover:shadow-lg
    `,
    secondary: `
      bg-transparent border-2 border-primary text-primary font-semibold
      hover:bg-primary hover:text-white
      dark:border-darkMode-accent dark:text-darkMode-accent
      dark:hover:bg-darkMode-accent dark:hover:text-primary-dark
    `,
    dark: `
      bg-primary-dark text-white font-semibold
      hover:bg-primary
      dark:bg-darkMode-surface dark:text-darkMode-text
      dark:hover:bg-darkMode-surfaceHover
    `,
    outline: `
      bg-transparent border-2 border-white/30 text-white font-semibold
      hover:bg-white/10 hover:border-white/50
      dark:border-darkMode-border dark:text-darkMode-text
      dark:hover:bg-darkMode-surfaceHover
    `,
  };

  // Glow effect classes for primary variant
  const glowClasses =
    variant === 'primary' && !prefersReducedMotion
      ? 'relative before:absolute before:inset-0 before:rounded-lg before:bg-accent-gold before:blur-xl before:opacity-0 hover:before:opacity-40 before:transition-opacity before:-z-10'
      : '';

  // Combined classes
  const buttonClasses = `
    relative overflow-hidden
    inline-flex items-center justify-center
    rounded-lg font-heading
    transition-colors duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-accent-gold focus:ring-offset-2
    dark:focus:ring-offset-darkMode-bg
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${glowClasses}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  // Handle ripple effect
  const createRipple = (event: MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion || isLoading) return;

    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newRipple: RippleEffect = {
      x,
      y,
      id: rippleIdRef.current++,
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id));
    }, 600);
  };

  // Motion variants
  const buttonVariants = {
    initial: { scale: 1 },
    hover: prefersReducedMotion ? {} : { scale: 1.05 },
    tap: prefersReducedMotion ? {} : { scale: 0.98 },
  };

  // Loading spinner
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Ripple elements
  const RippleElements = () => (
    <>
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none"
          initial={{ width: 0, height: 0, opacity: 0.5 }}
          animate={{
            width: 300,
            height: 300,
            opacity: 0,
            x: -150,
            y: -150,
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}
    </>
  );

  // Button content
  const ButtonContent = () => (
    <>
      <RippleElements />
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </>
  );

  // Render as Link
  if (rest.as === 'link') {
    const { as: _, to, ...linkRest } = rest as ButtonAsLink;
    return (
      <motion.div
        variants={buttonVariants}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        className="inline-block"
      >
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          to={to}
          className={buttonClasses}
          onClick={createRipple}
          {...linkRest}
        >
          <ButtonContent />
        </Link>
      </motion.div>
    );
  }

  // Render as Button
  const { as: _, onClick, disabled, type, ...buttonRest } = rest as ButtonAsButton;
  return (
    <motion.button
      ref={ref as React.Ref<HTMLButtonElement>}
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={buttonClasses}
      disabled={isLoading || disabled}
      type={type || 'button'}
      onClick={(e) => {
        createRipple(e as unknown as MouseEvent<HTMLElement>);
        onClick?.(e as unknown as React.MouseEvent<HTMLButtonElement>);
      }}
    >
      <ButtonContent />
    </motion.button>
  );
});

AnimatedButton.displayName = 'AnimatedButton';

export default AnimatedButton;
