import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  GraduationCap,
  Gamepad2,
  Briefcase,
  BarChart3,
  Award,
  Globe,
} from 'lucide-react';

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  gradient: string;
}

const features: Feature[] = [
  {
    icon: GraduationCap,
    title: 'Personalized Learning',
    description:
      'AI-powered learning paths tailored to your unique goals, pace, and learning style. Get recommendations that adapt as you grow.',
    gradient: 'from-primary to-primary-light',
  },
  {
    icon: Gamepad2,
    title: 'Gamified Experience',
    description:
      'Earn XP, unlock badges, and climb leaderboards. Learning becomes an adventure with streaks, challenges, and rewards.',
    gradient: 'from-accent-gold to-accent-goldLight',
  },
  {
    icon: Briefcase,
    title: 'Job Connections',
    description:
      'Get matched with employers looking for your skills. Our platform connects you directly to career opportunities across Africa.',
    gradient: 'from-info to-info-light',
  },
  {
    icon: BarChart3,
    title: 'Progress Analytics',
    description:
      'Track your growth with detailed insights. Visualize your learning journey and identify areas for improvement.',
    gradient: 'from-success to-success-light',
  },
  {
    icon: Award,
    title: 'Certificates & Badges',
    description:
      'Earn industry-recognized certificates and showcase your achievements. Build a portfolio that impresses employers.',
    gradient: 'from-error to-error-light',
  },
  {
    icon: Globe,
    title: 'African Focused',
    description:
      'Content designed for African learners with local context, languages, and career paths relevant to our continent.',
    gradient: 'from-secondary to-secondary-light',
  },
];

const FeaturesGrid = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
  };

  return (
    <section
      ref={ref}
      className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-darkMode-bg dark:to-darkMode-surface"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2
            id="features-heading"
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-darkMode-text mb-4 font-heading"
          >
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-primary to-primary-light dark:from-darkMode-accent dark:to-darkMode-accentHover bg-clip-text text-transparent">
              Succeed
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-darkMode-textSecondary max-w-2xl mx-auto">
            A complete platform designed to transform African youth into skilled
            professionals ready for the global workforce
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                className="group relative"
                variants={cardVariants}
              >
                {/* Glassmorphism card */}
                <div className="relative h-full p-6 lg:p-8 rounded-2xl bg-white/70 dark:bg-darkMode-surface/70 backdrop-blur-xl border border-gray-200/50 dark:border-darkMode-border/50 shadow-lg hover:shadow-forest-lg dark:hover:shadow-dark-glow transition-all duration-300 hover:-translate-y-1">
                  {/* Gradient background on hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent dark:from-darkMode-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Icon container */}
                  <motion.div
                    className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} p-3 mb-5 shadow-lg`}
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-full h-full text-white" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="relative text-xl font-semibold text-gray-900 dark:text-darkMode-text mb-3 font-heading">
                    {feature.title}
                  </h3>
                  <p className="relative text-gray-600 dark:text-darkMode-textSecondary leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Decorative corner gradient */}
                  <div
                    className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.gradient} opacity-5 rounded-tr-2xl rounded-bl-[100px] pointer-events-none`}
                  />
                </div>

                {/* Numbered badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-light dark:from-darkMode-accent dark:to-darkMode-accentHover flex items-center justify-center text-white text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {index + 1}
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
