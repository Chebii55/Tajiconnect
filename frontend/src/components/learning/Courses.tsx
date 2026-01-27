import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../services/api/courses';
import type { Course } from '../../services/api/courses';
import {
  BookOpen,
  Search,
  Filter,
  Star,
  Clock,
  Users,
  Play,
  Bookmark,
  Award,
  ChevronDown,
  Grid,
  List
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar: string;
  category: string;
  subcategory: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  totalHours: number;
  totalLessons: number;
  rating: number;
  reviews: number;
  enrolledStudents: number;
  price: number;
  originalPrice?: number;
  isFree: boolean;
  isPopular: boolean;
  isNew: boolean;
  thumbnail: string;
  skills: string[];
  learningOutcomes: string[];
  prerequisites: string[];
  lastUpdated: string;
  language: string;
  hasSubtitles: boolean;
  certificate: boolean;
}

const Courses: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const response = await courseService.getCourses(0, 50);
      setCourses(response.items);
      setError(null);
    } catch (err) {
      console.error('Failed to load courses:', err);
      setError('Failed to load courses. Using sample data.');
      // Fallback to sample data if API fails
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      loadCourses();
      return;
    }
    
    try {
      setLoading(true);
      const response = await courseService.searchCourses(query);
      setCourses(response.items);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedPrice, setSelectedPrice] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const mockCourses: Course[] = [
    {
      id: '1',
      title: 'Global Citizenship & Human Rights Foundations',
      description: 'Develop understanding of human rights principles, social justice, and your role as a global citizen in creating positive change',
      instructor: 'Dr. Amina Hassan',
      instructorAvatar: '🌍',
      category: 'GCED Core',
      subcategory: 'Human Rights',
      level: 'Beginner',
      duration: '24 hours',
      totalHours: 24,
      totalLessons: 48,
      rating: 4.9,
      reviews: 8420,
      enrolledStudents: 45000,
      price: 0,
      isFree: true,
      isPopular: true,
      isNew: false,
      thumbnail: '🌍',
      skills: ['Human Rights', 'Global Citizenship', 'Social Justice', 'Advocacy', 'Cultural Awareness'],
      learningOutcomes: [
        'Understand the Universal Declaration of Human Rights',
        'Develop critical thinking about global issues',
        'Learn advocacy and social action skills',
        'Build empathy and cultural competence'
      ],
      prerequisites: ['Basic literacy skills'],
      lastUpdated: '2024-11-01',
      language: 'English & Kiswahili',
      hasSubtitles: true,
      certificate: true
    },
    {
      id: '2',
      title: 'Social-Emotional Learning (SEL) Essentials',
      description: 'Build resilience, empathy, and emotional intelligence through evidence-based SEL practices aligned with CBC',
      instructor: 'Grace Wanjiru',
      instructorAvatar: '❤️',
      category: 'SEL Foundation',
      subcategory: 'Emotional Intelligence',
      level: 'Beginner',
      duration: '18 hours',
      totalHours: 18,
      totalLessons: 36,
      rating: 4.8,
      reviews: 12100,
      enrolledStudents: 38000,
      price: 0,
      isFree: true,
      isPopular: true,
      isNew: false,
      thumbnail: '❤️',
      skills: ['Emotional Intelligence', 'Resilience', 'Empathy', 'Self-Awareness', 'Relationship Skills'],
      learningOutcomes: [
        'Develop emotional self-awareness',
        'Build healthy relationships and communication skills',
        'Learn stress management and resilience techniques',
        'Practice empathy and perspective-taking'
      ],
      prerequisites: ['None'],
      lastUpdated: '2024-10-15',
      language: 'English & Kiswahili',
      hasSubtitles: true,
      certificate: true
    },
    {
      id: '3',
      title: 'Climate Justice & Environmental Action',
      description: 'Understand climate change impacts and develop skills for environmental advocacy and sustainable development',
      instructor: 'Dr. James Kinyanjui',
      instructorAvatar: '🌱',
      category: 'Environmental Stewardship',
      subcategory: 'Climate Action',
      level: 'Intermediate',
      duration: '30 hours',
      totalHours: 30,
      totalLessons: 60,
      rating: 4.7,
      reviews: 6750,
      enrolledStudents: 22000,
      price: 0,
      isFree: true,
      isPopular: false,
      isNew: true,
      thumbnail: '🌱',
      skills: ['Climate Science', 'Environmental Advocacy', 'Sustainability', 'Community Organizing', 'Policy Analysis'],
      learningOutcomes: [
        'Understand climate change science and impacts',
        'Develop environmental advocacy skills',
        'Learn sustainable development practices',
        'Create community action plans'
      ],
      prerequisites: ['Basic science knowledge'],
      lastUpdated: '2024-11-10',
      language: 'English & Kiswahili',
      hasSubtitles: true,
      certificate: true
    },
    {
      id: '4',
      title: 'Digital Citizenship & AI Ethics',
      description: 'Navigate the digital world responsibly, understand AI impacts, and develop ethical technology use practices',
      instructor: 'Tech4Good Kenya Team',
      instructorAvatar: '🛡️',
      category: 'Digital Citizenship',
      subcategory: 'AI Ethics',
      level: 'Intermediate',
      duration: '22 hours',
      totalHours: 22,
      totalLessons: 44,
      rating: 4.6,
      reviews: 4200,
      enrolledStudents: 18000,
      price: 0,
      isFree: true,
      isPopular: false,
      isNew: true,
      thumbnail: '🛡️',
      skills: ['Digital Literacy', 'AI Ethics', 'Online Safety', 'Data Privacy', 'Responsible Technology'],
      learningOutcomes: [
        'Understand digital rights and responsibilities',
        'Learn about AI bias and ethical considerations',
        'Develop critical media literacy skills',
        'Practice safe and responsible online behavior'
      ],
      prerequisites: ['Basic computer skills'],
      lastUpdated: '2024-09-20',
      language: 'English',
      hasSubtitles: true,
      certificate: true
    },
    {
      id: '5',
      title: 'STEM for Girls: Innovation & Problem-Solving',
      description: 'Empower girls through hands-on STEM education, focusing on innovation, problem-solving, and career pathways',
      instructor: 'She-Can STEM Collective',
      instructorAvatar: '🔬',
      category: 'STEM Pathways',
      subcategory: 'Girls Empowerment',
      level: 'Beginner',
      duration: '40 hours',
      totalHours: 40,
      totalLessons: 80,
      rating: 4.9,
      reviews: 3200,
      enrolledStudents: 15000,
      price: 0,
      isFree: true,
      isPopular: true,
      isNew: false,
      thumbnail: '🔬',
      skills: ['Scientific Method', 'Engineering Design', 'Data Analysis', 'Innovation', 'Leadership'],
      learningOutcomes: [
        'Develop confidence in STEM fields',
        'Apply scientific method to real-world problems',
        'Learn engineering design thinking',
        'Build leadership and collaboration skills'
      ],
      prerequisites: ['Basic mathematics'],
      lastUpdated: '2024-10-05',
      language: 'English & Kiswahili',
      hasSubtitles: true,
      certificate: true
    },
    {
      id: '6',
      title: 'Inclusive Leadership & Community Building',
      description: 'Develop inclusive leadership skills, learn community organizing, and practice participatory development approaches',
      instructor: 'Community Leaders Network',
      instructorAvatar: '🤝',
      category: 'Leadership Development',
      subcategory: 'Inclusive Leadership',
      level: 'Advanced',
      duration: '35 hours',
      totalHours: 35,
      totalLessons: 70,
      rating: 4.8,
      reviews: 2800,
      enrolledStudents: 12000,
      price: 0,
      isFree: true,
      isPopular: false,
      isNew: false,
      thumbnail: '🤝',
      skills: ['Inclusive Leadership', 'Community Organizing', 'Conflict Resolution', 'Project Management', 'Cultural Competence'],
      learningOutcomes: [
        'Practice inclusive leadership principles',
        'Learn community organizing strategies',
        'Develop conflict resolution skills',
        'Master participatory project management'
      ],
      prerequisites: ['SEL Essentials', 'GCED Foundations'],
      lastUpdated: '2024-08-15',
      language: 'English & Kiswahili',
      hasSubtitles: true,
      certificate: true
    }
  ];

  const categories = [
    'all',
    'Accounts and Finance',
    'Agriculture, Food and Nutrition',
    'Artificial Intelligence',
    'Education',
    'Energy',
    'Environment and Climate Change',
    'Healthcare',
    'Innovation',
    'Manufacturing',
    'Media',
    'Research Activities',
    'Startups and Early-Stage',
    'Sustainable Development',
    'Technology',
    'Travel and Tourism'
  ];

  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced'];
  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' }
  ];

  const filteredCourses = mockCourses.filter(course => {
    const matchesSearch = searchTerm === '' ||
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    const matchesPrice = selectedPrice === 'all' ||
      (selectedPrice === 'free' && course.isFree) ||
      (selectedPrice === 'paid' && !course.isFree);

    return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'text-success dark:text-darkMode-success bg-success/10 dark:bg-darkMode-success/20';
      case 'Intermediate': return 'text-warning dark:text-warning-light bg-warning/10 dark:bg-warning/20';
      case 'Advanced': return 'text-error dark:text-error-light bg-error/10 dark:bg-error/20';
      default: return 'text-neutral-dark dark:text-darkMode-textSecondary bg-neutral-gray dark:bg-darkMode-surface';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg font-sans">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary dark:bg-darkMode-navbar rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-primary dark:text-darkMode-text font-heading">TFDN Learning Hub</h1>
              <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary">Explore GCED courses designed to empower you as a global citizen and change-maker</p>
              <p className="text-sm text-secondary dark:text-darkMode-success font-medium mt-1">
                🌍 Aligned with CBC, SDGs, and Kenya's Children's Act 2022
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-darkMode-textMuted" />
              <input
                type="text"
                placeholder="Search courses, skills, or instructors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-modern focus-ring dark:bg-darkMode-surfaceHover dark:text-darkMode-text dark:border-darkMode-border"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 dark:border-darkMode-border rounded-lg hover:bg-neutral-light dark:hover:bg-darkMode-surfaceHover transition-colors focus-ring text-neutral-dark dark:text-darkMode-textSecondary"
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-neutral-gray dark:bg-darkMode-surfaceHover rounded-lg">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-modern focus-ring dark:bg-darkMode-surface dark:text-darkMode-text dark:border-darkMode-border"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="input-modern focus-ring dark:bg-darkMode-surface dark:text-darkMode-text dark:border-darkMode-border"
              >
                {levels.map(level => (
                  <option key={level} value={level}>
                    {level === 'all' ? 'All Levels' : level}
                  </option>
                ))}
              </select>

              <select
                value={selectedPrice}
                onChange={(e) => setSelectedPrice(e.target.value)}
                className="input-modern focus-ring dark:bg-darkMode-surface dark:text-darkMode-text dark:border-darkMode-border"
              >
                <option value="all">All Prices</option>
                <option value="free">Free</option>
                <option value="paid">Paid</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-modern focus-ring dark:bg-darkMode-surface dark:text-darkMode-text dark:border-darkMode-border"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary">
              {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">View:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-primary-light dark:bg-darkMode-progress text-white' : 'text-neutral-dark/80 dark:text-darkMode-textSecondary hover:bg-neutral-light dark:hover:bg-darkMode-surfaceHover'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-primary-light dark:bg-darkMode-progress text-white' : 'text-neutral-dark/80 dark:text-darkMode-textSecondary hover:bg-neutral-light dark:hover:bg-darkMode-surfaceHover'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Course Grid/List */}
        <div className={`grid gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            : 'grid-cols-1'
        }`}>
          {filteredCourses.map((course) => (
            <div key={course.id} className={`bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark overflow-hidden hover:shadow-xl dark:hover:shadow-dark-lg transition-shadow ${
              viewMode === 'list' ? 'flex' : ''
            }`}>
              <div className={`relative ${
                viewMode === 'list' ? 'w-64 flex-shrink-0' : 'h-48'
              } bg-gradient-to-r from-primary-dark to-primary dark:from-darkMode-progress dark:to-darkMode-success flex items-center justify-center`}>
                <span className="text-6xl">{course.thumbnail}</span>
                <div className="absolute top-3 left-3 flex gap-2">
                  {course.isPopular && (
                    <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded-full font-medium">
                      Popular
                    </span>
                  )}
                  {course.isNew && (
                    <span className="px-2 py-1 bg-success dark:bg-darkMode-success text-white text-xs rounded-full font-medium">
                      New
                    </span>
                  )}
                  {course.isFree && (
                    <span className="px-2 py-1 bg-info dark:bg-darkMode-link text-white text-xs rounded-full font-medium">
                      Free
                    </span>
                  )}
                </div>
                <button className="absolute top-3 right-3 p-2 bg-white bg-opacity-20 rounded-full text-white hover:bg-opacity-30 transition-colors">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>

              <div className={`p-6 ${viewMode === 'list' ? 'flex-grow' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">{course.category}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                        {course.level}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-primary dark:text-darkMode-text font-heading mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary text-sm mb-3 line-clamp-2">{course.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{course.instructorAvatar}</span>
                  <span className="text-sm text-neutral-dark dark:text-darkMode-textSecondary">{course.instructor}</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-warning" />
                    <span className="font-medium">{course.rating}</span>
                    <span>({course.reviews.toLocaleString()})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{course.enrolledStudents.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {course.skills.slice(0, 3).map((skill) => (
                      <span key={skill} className="px-2 py-1 bg-info/10 dark:bg-darkMode-link/20 text-info dark:text-darkMode-link text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                    {course.skills.length > 3 && (
                      <span className="px-2 py-1 bg-neutral-gray dark:bg-darkMode-surfaceHover text-neutral-dark/80 dark:text-darkMode-textSecondary text-xs rounded-full">
                        +{course.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    {course.isFree ? (
                      <span className="text-xl font-bold text-secondary dark:text-darkMode-success">Free</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-primary dark:text-darkMode-text">${course.price}</span>
                        {course.originalPrice && (
                          <span className="text-sm text-neutral-dark/60 dark:text-darkMode-textMuted line-through">${course.originalPrice}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <Link
                    to={`/student/courses/${course.id}`}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>{course.isFree ? 'Start Free' : 'Enroll Now'}</span>
                  </Link>
                </div>

                {course.certificate && (
                  <div className="flex items-center gap-1 mt-3 text-xs text-neutral-dark/80 dark:text-darkMode-textSecondary">
                    <Award className="w-3 h-3" />
                    <span>Certificate included</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 dark:text-darkMode-textMuted mx-auto mb-4" />
            <h3 className="text-xl font-medium text-neutral-dark dark:text-darkMode-text mb-2">No courses found</h3>
            <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary mb-6">Try adjusting your search criteria or filters.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
                setSelectedLevel('all');
                setSelectedPrice('all');
              }}
              className="btn-primary"
            >
              <span>Clear Filters</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
