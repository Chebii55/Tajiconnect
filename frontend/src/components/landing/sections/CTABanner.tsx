import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Shield, Sparkles } from 'lucide-react';

const CTABanner = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      ref={ref}
      className="relative py-24 overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-dark to-forest-deepest dark:from-darkMode-navbar dark:via-darkMode-bg dark:to-darkMode-surface" />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating circles */}
        <motion.div
          className="absolute -top-20 -left-20 w-80 h-80 bg-accent-gold/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          {/* Sparkle decoration */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <div className="w-16 h-16 rounded-full bg-accent-gold/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-accent-gold" />
            </div>
          </motion.div>

          {/* Headline */}
          <h2
            id="cta-heading"
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-heading leading-tight"
          >
            Ready to Start Your
            <br />
            <span className="bg-gradient-to-r from-accent-gold to-accent-goldLight bg-clip-text text-transparent">
              Career Journey?
            </span>
          </h2>

          {/* Subtext */}
          <p className="text-xl md:text-2xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join{' '}
            <span className="text-accent-gold font-semibold">10,000+</span>{' '}
            African youth building their future with personalized learning and
            real job opportunities
          </p>

          {/* CTA Button with glow animation */}
          <motion.div
            className="relative inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Animated glow effect */}
            <motion.div
              className="absolute -inset-2 bg-accent-gold/40 rounded-xl blur-xl"
              animate={{
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            <Link
              to="/register"
              className="relative inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-accent-gold to-accent-goldLight text-forest-deepest font-bold text-lg rounded-xl shadow-gold hover:shadow-gold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-accent-gold/50"
            >
              Get Started for Free
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <ArrowRight className="w-6 h-6" />
              </motion.span>
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <div className="flex items-center gap-2 text-white/70">
              <Shield className="w-5 h-5 text-accent-gold" />
              <span>No credit card required</span>
            </div>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/30" />
            <div className="flex items-center gap-2 text-white/70">
              <Sparkles className="w-5 h-5 text-accent-gold" />
              <span>Free forever plan available</span>
            </div>
            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-white/30" />
            <div className="flex items-center gap-2 text-white/70">
              <ArrowRight className="w-5 h-5 text-accent-gold" />
              <span>Start learning in 2 minutes</span>
            </div>
          </motion.div>

          {/* Social proof micro-text */}
          <motion.p
            className="mt-6 text-sm text-white/50"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Trusted by learners from Nigeria, Kenya, Ghana, South Africa, and 30+ African countries
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTABanner;
