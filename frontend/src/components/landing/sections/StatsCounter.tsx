import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useSpring, useTransform } from 'framer-motion';
import { Users, BookOpen, TrendingUp, Building2 } from 'lucide-react';

interface Stat {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  suffix: string;
  label: string;
  description: string;
}

const stats: Stat[] = [
  {
    icon: Users,
    value: 10000,
    suffix: '+',
    label: 'Active Learners',
    description: 'Growing community across Africa',
  },
  {
    icon: BookOpen,
    value: 50,
    suffix: '+',
    label: 'Expert-Led Courses',
    description: 'Industry-relevant curriculum',
  },
  {
    icon: TrendingUp,
    value: 85,
    suffix: '%',
    label: 'Job Placement Rate',
    description: 'Within 6 months of completion',
  },
  {
    icon: Building2,
    value: 100,
    suffix: '+',
    label: 'Partner Employers',
    description: 'Hiring our graduates',
  },
];

interface AnimatedCounterProps {
  value: number;
  suffix: string;
  isInView: boolean;
}

const AnimatedCounter = ({ value, suffix, isInView }: AnimatedCounterProps) => {
  const [hasAnimated, setHasAnimated] = useState(false);

  const springValue = useSpring(0, {
    stiffness: 50,
    damping: 20,
    duration: 2000,
  });

  const displayValue = useTransform(springValue, (latest) =>
    Math.floor(latest).toLocaleString()
  );

  useEffect(() => {
    if (isInView && !hasAnimated) {
      springValue.set(value);
      setHasAnimated(true);
    }
  }, [isInView, value, springValue, hasAnimated]);

  return (
    <span className="tabular-nums">
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </span>
  );
};

const StatsCounter = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section
      ref={ref}
      className="py-20 bg-gradient-to-br from-primary via-primary-dark to-forest-deepest dark:from-darkMode-navbar dark:via-darkMode-bg dark:to-darkMode-surface relative overflow-hidden"
      aria-labelledby="stats-heading"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 bg-accent-gold/20 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-light/20 rounded-full blur-3xl"
        animate={{
          x: [0, -40, 0],
          y: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2
            id="stats-heading"
            className="text-3xl md:text-4xl font-bold text-white mb-4 font-heading"
          >
            Our Impact in Numbers
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Join thousands of African youth who are transforming their careers
            through TajiConnect
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="relative group"
                variants={itemVariants}
              >
                <div className="text-center p-6 lg:p-8 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                  {/* Icon */}
                  <motion.div
                    className="w-14 h-14 mx-auto mb-4 rounded-xl bg-white/20 flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Icon className="w-7 h-7 text-accent-gold" />
                  </motion.div>

                  {/* Value with count-up animation */}
                  <div className="text-4xl lg:text-5xl font-bold text-white mb-2 font-heading">
                    <AnimatedCounter
                      value={stat.value}
                      suffix={stat.suffix}
                      isInView={isInView}
                    />
                  </div>

                  {/* Label */}
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {stat.label}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-white/70">{stat.description}</p>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-accent-gold/0 group-hover:bg-accent-gold/5 transition-colors duration-300 pointer-events-none" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <p className="text-white/60 text-sm">
            Data as of {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} | Verified by independent auditors
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsCounter;
