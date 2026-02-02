/**
 * Landing Page Data
 * Centralized data for all landing page sections
 * Easy to update and maintain
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'indigo';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  avatar: string;
  quote: string;
  rating: number;
}

export interface Stat {
  id: string;
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  description: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
}

export interface NavLink {
  id: string;
  label: string;
  href: string;
  isAnchor?: boolean;
}

// ============================================
// FEATURES DATA
// ============================================

export const features: Feature[] = [
  {
    id: 'gce',
    icon: 'Globe',
    title: 'Global Citizenship Education',
    description:
      'Develop critical thinking, empathy, and global awareness through UN-aligned curriculum designed for African youth.',
    color: 'blue',
  },
  {
    id: 'sel',
    icon: 'Heart',
    title: 'Social-Emotional Learning',
    description:
      'Build emotional intelligence, resilience, and interpersonal skills essential for life and career success.',
    color: 'green',
  },
  {
    id: 'career',
    icon: 'TrendingUp',
    title: 'Career Development',
    description:
      'Explore 15+ career pathways with personalized guidance, job matching, and industry connections.',
    color: 'purple',
  },
  {
    id: 'learning',
    icon: 'BookOpen',
    title: 'Interactive Microlearning',
    description:
      'Engage with bite-sized lessons, multimedia content, and hands-on projects that fit your schedule.',
    color: 'orange',
  },
  {
    id: 'achievements',
    icon: 'Award',
    title: 'Gamified Achievement System',
    description:
      'Earn badges, certificates, and climb leaderboards to stay motivated on your learning journey.',
    color: 'red',
  },
  {
    id: 'community',
    icon: 'Users',
    title: 'Community & Mentorship',
    description:
      'Connect with peers, mentors, and industry professionals for guidance and networking opportunities.',
    color: 'indigo',
  },
];

// ============================================
// TESTIMONIALS DATA
// ============================================

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Amara Okonkwo',
    role: 'Software Developer',
    location: 'Lagos, Nigeria',
    avatar: 'AO',
    quote:
      'TajiConnect transformed my career. The personalized learning path helped me transition from retail to tech in just 6 months. The mentorship program was invaluable.',
    rating: 5,
  },
  {
    id: '2',
    name: 'David Mensah',
    role: 'Data Analyst',
    location: 'Accra, Ghana',
    avatar: 'DM',
    quote:
      'The microlearning approach fits perfectly with my busy schedule. I could learn during my commute and lunch breaks. Now I work at one of the top tech companies in Africa.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Fatima Hassan',
    role: 'UX Designer',
    location: 'Nairobi, Kenya',
    avatar: 'FH',
    quote:
      'What sets TajiConnect apart is the focus on African contexts. The courses are relevant to our market, and the job matching connected me with local opportunities.',
    rating: 5,
  },
  {
    id: '4',
    name: 'Samuel Adeyemi',
    role: 'Product Manager',
    location: 'Kigali, Rwanda',
    avatar: 'SA',
    quote:
      'The gamification kept me engaged throughout my learning journey. Earning badges and competing on leaderboards made learning fun. Highly recommend!',
    rating: 5,
  },
  {
    id: '5',
    name: 'Grace Mwangi',
    role: 'Digital Marketer',
    location: 'Dar es Salaam, Tanzania',
    avatar: 'GM',
    quote:
      'TajiConnect understood my career goals better than I did. The psychometric assessments helped me discover strengths I never knew I had.',
    rating: 5,
  },
];

// ============================================
// STATS DATA
// ============================================

export const stats: Stat[] = [
  {
    id: 'learners',
    value: 10000,
    suffix: '+',
    label: 'Active Learners',
    description: 'Growing community across Africa',
  },
  {
    id: 'courses',
    value: 200,
    suffix: '+',
    label: 'Expert-Led Courses',
    description: 'Curated for African markets',
  },
  {
    id: 'careers',
    value: 15,
    label: 'Career Pathways',
    description: 'From tech to creative industries',
  },
  {
    id: 'satisfaction',
    value: 94,
    suffix: '%',
    label: 'Satisfaction Rate',
    description: 'Learners recommend us',
  },
];

// ============================================
// PARTNERS DATA
// ============================================

export const partners: Partner[] = [
  { id: 'safaricom', name: 'Safaricom', logo: 'S' },
  { id: 'mtn', name: 'MTN', logo: 'M' },
  { id: 'andela', name: 'Andela', logo: 'A' },
  { id: 'jumia', name: 'Jumia', logo: 'J' },
  { id: 'flutterwave', name: 'Flutterwave', logo: 'F' },
];

// ============================================
// NAVIGATION DATA
// ============================================

export const navLinks: NavLink[] = [
  { id: 'features', label: 'Features', href: '#features', isAnchor: true },
  { id: 'courses', label: 'Courses', href: '#courses', isAnchor: true },
  { id: 'about', label: 'About', href: '#about', isAnchor: true },
];

// ============================================
// HERO SECTION DATA
// ============================================

export const heroData = {
  badge: 'Empowering African Youth',
  title: {
    main: 'Build Skills That Get You Hired',
    line1: 'Build Skills That',
    line2: 'Get You Hired',
    highlight: 'Get You Hired',
  },
  description:
    'Free career-focused courses designed for African youth. Discover your potential through AI-powered career guidance, skill assessments, and personalized learning paths.',
  subheadline: 'Free career-focused courses designed for African youth',
  ctaPrimary: {
    text: 'Start Learning Free',
    href: '/register',
  },
  ctaSecondary: {
    text: 'Explore Courses',
    href: '/courses',
  },
  stats: [
    { value: '12K+', label: 'Active Learners' },
    { value: '50+', label: 'Free Courses' },
    { value: '4.9/5', label: 'Rating' },
  ],
  initialLearnerCount: 12847,
};

// ============================================
// CTA BANNER DATA
// ============================================

export const ctaBannerData = {
  title: 'Ready to Transform Your Future?',
  description:
    'Join thousands of African youth who are building successful careers through personalized learning and expert guidance.',
  primaryCta: {
    text: 'Create Free Account',
    href: '/register',
  },
  secondaryCta: {
    text: 'Become a Trainer',
    href: '/trainer/login',
  },
};

// ============================================
// FOOTER DATA
// ============================================

export const footerLinks = {
  platform: [
    { label: 'Student Login', href: '/login' },
    { label: 'Trainer Portal', href: '/trainer/login' },
    { label: 'Sign Up', href: '/register' },
    { label: 'Courses', href: '#courses' },
  ],
  company: [
    { label: 'About Us', href: '#about' },
    { label: 'Careers', href: '#careers' },
    { label: 'Blog', href: '#blog' },
    { label: 'Press', href: '#press' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
  support: [
    { label: 'Help Center', href: '/support' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQ', href: '#faq' },
  ],
};

export const socialLinks = [
  { id: 'facebook', label: 'Facebook', href: 'https://facebook.com' },
  { id: 'twitter', label: 'Twitter', href: 'https://twitter.com' },
  { id: 'instagram', label: 'Instagram', href: 'https://instagram.com' },
  { id: 'linkedin', label: 'LinkedIn', href: 'https://linkedin.com' },
];
