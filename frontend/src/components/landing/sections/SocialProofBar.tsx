import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface Partner {
  name: string;
  logo: string;
}

const partners: Partner[] = [
  { name: 'Safaricom', logo: 'S' },
  { name: 'MTN', logo: 'M' },
  { name: 'Andela', logo: 'A' },
  { name: 'Jumia', logo: 'J' },
  { name: 'Flutterwave', logo: 'F' },
];

const SocialProofBar = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  };

  return (
    <motion.section
      ref={ref}
      className="py-12 bg-white dark:bg-darkMode-surface border-y border-gray-100 dark:border-darkMode-border"
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      aria-label="Trusted partners"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          className="text-center text-gray-600 dark:text-darkMode-textSecondary mb-8 text-lg font-medium"
          variants={itemVariants}
        >
          Trusted by{' '}
          <span className="text-primary dark:text-darkMode-progress font-bold">
            10,000+
          </span>{' '}
          learners across Africa
        </motion.p>

        <div className="relative overflow-hidden">
          {/* Gradient masks for carousel effect */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-darkMode-surface to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-darkMode-surface to-transparent z-10 pointer-events-none" />

          {/* Logo carousel - infinite scroll animation */}
          <motion.div
            className="flex items-center justify-center gap-8 md:gap-16"
            variants={itemVariants}
          >
            {/* Duplicate logos for seamless scroll effect on larger screens */}
            <div className="flex items-center gap-8 md:gap-16 animate-scroll md:animate-none">
              {partners.map((partner, index) => (
                <motion.div
                  key={`${partner.name}-${index}`}
                  className="flex-shrink-0 group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <div
                    className="w-24 h-12 md:w-32 md:h-14 flex items-center justify-center rounded-lg bg-gray-50 dark:bg-darkMode-bg border border-gray-100 dark:border-darkMode-border transition-all duration-300 group-hover:border-primary/30 dark:group-hover:border-darkMode-accent/30 group-hover:shadow-forest"
                    role="img"
                    aria-label={`${partner.name} logo`}
                  >
                    {/* Placeholder logo - first letter with gradient */}
                    <span className="text-2xl md:text-3xl font-bold bg-gradient-to-br from-primary to-primary-light dark:from-darkMode-accent dark:to-darkMode-accentHover bg-clip-text text-transparent">
                      {partner.logo}
                    </span>
                    <span className="sr-only">{partner.name}</span>
                  </div>
                  <p className="text-xs text-center mt-2 text-gray-500 dark:text-darkMode-textMuted opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {partner.name}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.p
          className="text-center text-sm text-gray-500 dark:text-darkMode-textMuted mt-8"
          variants={itemVariants}
        >
          Partnering with leading African tech companies to create opportunities
        </motion.p>
      </div>
    </motion.section>
  );
};

export default SocialProofBar;
