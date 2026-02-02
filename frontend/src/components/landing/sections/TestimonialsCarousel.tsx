import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  location: string;
  quote: string;
  rating: number;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Amara Okonkwo',
    role: 'Software Developer',
    company: 'Andela',
    location: 'Lagos, Nigeria',
    quote:
      'TajiConnect transformed my career journey. The personalized learning path helped me transition from a customer service role to a full-stack developer in just 8 months. The gamified approach kept me motivated throughout.',
    rating: 5,
    image: 'AO',
  },
  {
    id: 2,
    name: 'Kwame Mensah',
    role: 'Data Analyst',
    company: 'MTN Ghana',
    location: 'Accra, Ghana',
    quote:
      'The job matching feature connected me with employers who valued my skills. Within 3 months of completing my learning path, I landed my dream job. The certificates I earned gave me credibility with recruiters.',
    rating: 5,
    image: 'KM',
  },
  {
    id: 3,
    name: 'Fatima Hassan',
    role: 'UX Designer',
    company: 'Jumia',
    location: 'Nairobi, Kenya',
    quote:
      'As a self-taught designer, I struggled to get noticed by employers. TajiConnect validated my skills through assessments and connected me with mentors who helped me build a portfolio that got me hired.',
    rating: 5,
    image: 'FH',
  },
];

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1
    );
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, goToNext]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <section
      ref={ref}
      className="py-20 bg-white dark:bg-darkMode-surface overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          <h2
            id="testimonials-heading"
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-darkMode-text mb-4 font-heading"
          >
            Success Stories from{' '}
            <span className="bg-gradient-to-r from-primary to-primary-light dark:from-darkMode-accent dark:to-darkMode-accentHover bg-clip-text text-transparent">
              Africa
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-darkMode-textSecondary max-w-2xl mx-auto">
            Real stories from real learners who transformed their careers with
            TajiConnect
          </p>
        </motion.div>

        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          {/* Quote decoration */}
          <div className="absolute -top-6 left-8 z-10">
            <Quote className="w-16 h-16 text-primary/10 dark:text-darkMode-accent/10 fill-current" />
          </div>

          {/* Carousel container */}
          <div className="relative min-h-[400px] md:min-h-[350px]">
            <AnimatePresence mode="wait" custom={currentIndex}>
              <motion.div
                key={currentIndex}
                custom={currentIndex}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                }}
                className="absolute inset-0"
              >
                <article className="bg-gradient-to-br from-gray-50 to-white dark:from-darkMode-bg dark:to-darkMode-surface rounded-2xl p-8 md:p-12 shadow-forest-lg dark:shadow-dark-lg border border-gray-100 dark:border-darkMode-border">
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-light dark:from-darkMode-accent dark:to-darkMode-accentHover flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {testimonials[currentIndex].image}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-center md:text-left">
                      {/* Star rating */}
                      <div
                        className="flex gap-1 justify-center md:justify-start mb-4"
                        aria-label={`${testimonials[currentIndex].rating} out of 5 stars`}
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < testimonials[currentIndex].rating
                                ? 'text-accent-gold fill-accent-gold'
                                : 'text-gray-300 dark:text-darkMode-textMuted'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Quote */}
                      <blockquote className="text-lg md:text-xl text-gray-700 dark:text-darkMode-textSecondary mb-6 leading-relaxed italic">
                        "{testimonials[currentIndex].quote}"
                      </blockquote>

                      {/* Author info */}
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-darkMode-text text-lg">
                          {testimonials[currentIndex].name}
                        </p>
                        <p className="text-primary dark:text-darkMode-accent font-medium">
                          {testimonials[currentIndex].role} at{' '}
                          {testimonials[currentIndex].company}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-darkMode-textMuted mt-1">
                          {testimonials[currentIndex].location}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 rounded-full bg-white dark:bg-darkMode-surface border border-gray-200 dark:border-darkMode-border shadow-lg flex items-center justify-center text-gray-600 dark:text-darkMode-textSecondary hover:text-primary dark:hover:text-darkMode-accent hover:border-primary/50 dark:hover:border-darkMode-accent/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:ring-offset-2"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 rounded-full bg-white dark:bg-darkMode-surface border border-gray-200 dark:border-darkMode-border shadow-lg flex items-center justify-center text-gray-600 dark:text-darkMode-textSecondary hover:text-primary dark:hover:text-darkMode-accent hover:border-primary/50 dark:hover:border-darkMode-accent/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:ring-offset-2"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots navigation */}
          <div
            className="flex justify-center gap-3 mt-8"
            role="tablist"
            aria-label="Testimonial navigation"
          >
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:ring-offset-2 ${
                  index === currentIndex
                    ? 'bg-primary dark:bg-darkMode-accent w-8'
                    : 'bg-gray-300 dark:bg-darkMode-border hover:bg-primary/50 dark:hover:bg-darkMode-accent/50'
                }`}
                role="tab"
                aria-selected={index === currentIndex}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          <div className="text-center mt-4">
            <span className="text-sm text-gray-400 dark:text-darkMode-textMuted">
              {isPaused ? 'Paused' : 'Auto-playing'} - {currentIndex + 1} of{' '}
              {testimonials.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
