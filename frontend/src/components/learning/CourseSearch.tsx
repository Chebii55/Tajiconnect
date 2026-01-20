import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  Clock,
  TrendingUp,
  Target
} from 'lucide-react';

const CourseSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const searchSuggestions = [
    'React hooks', 'JavaScript ES6', 'Python Django', 'Machine Learning',
    'CSS Grid', 'Node.js API', 'Data Science', 'UI/UX Design'
  ];


  const quickFilters = [
    { id: 'free', label: 'Free Courses', count: 1240 },
    { id: 'certificate', label: 'With Certificate', count: 890 },
    { id: 'beginner', label: 'Beginner Friendly', count: 2100 },
    { id: 'new', label: 'New This Month', count: 45 },
    { id: 'trending', label: 'Trending', count: 180 }
  ];

  const recentSearches = [
    'React Native development',
    'Machine learning basics',
    'JavaScript advanced concepts'
  ];

  const featuredCategories = [
    {
      name: 'Web Development',
      description: 'Frontend, Backend, Full-Stack',
      courseCount: 1250,
      icon: '💻',
      color: 'from-primary-dark to-primary dark:from-darkMode-progress dark:to-darkMode-success'
    },
    {
      name: 'Data Science',
      description: 'Analytics, ML, AI',
      courseCount: 890,
      icon: '📊',
      color: 'from-secondary to-forest-sage dark:from-darkMode-progress dark:to-darkMode-success'
    },
    {
      name: 'Mobile Development',
      description: 'iOS, Android, Cross-platform',
      courseCount: 650,
      icon: '📱',
      color: 'from-purple-500 to-purple-600 dark:from-purple-700 dark:to-purple-800'
    },
    {
      name: 'Design',
      description: 'UI/UX, Graphics, Product',
      courseCount: 420,
      icon: '🎨',
      color: 'from-pink-500 to-pink-600 dark:from-pink-700 dark:to-pink-800'
    },
    {
      name: 'DevOps',
      description: 'CI/CD, Cloud, Infrastructure',
      courseCount: 380,
      icon: '⚙️',
      color: 'from-orange-500 to-orange-600 dark:from-orange-700 dark:to-orange-800'
    },
    {
      name: 'Cybersecurity',
      description: 'Security, Ethical Hacking',
      courseCount: 290,
      icon: '🔒',
      color: 'from-red-500 to-red-600 dark:from-red-700 dark:to-red-800'
    }
  ];

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    // Here you would typically trigger the actual search
  };

  const toggleFilter = (filterId: string) => {
    setActiveFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(id => id !== filterId)
        : [...prev, filterId]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light to-primary/10 dark:from-darkMode-bg dark:to-darkMode-surface font-['Inter']">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-primary-dark dark:text-darkMode-text mb-4">
            Find Your Perfect Course
          </h1>
          <p className="text-xl text-neutral-dark/80 dark:text-darkMode-textSecondary max-w-2xl mx-auto">
            Search through thousands of courses and find the one that matches your learning goals
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400 dark:text-darkMode-textMuted" />
            <input
              type="text"
              placeholder="What do you want to learn today?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 text-lg border border-gray-300 dark:border-darkMode-border rounded-2xl focus:ring-2 focus:ring-primary-light dark:focus:ring-darkMode-focus focus:border-transparent shadow-lg bg-white dark:bg-darkMode-surface text-neutral-dark dark:text-darkMode-text"
            />
            <button
              onClick={() => handleSearch(searchTerm)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-primary-light dark:bg-darkMode-progress text-white rounded-xl hover:bg-primary dark:hover:bg-darkMode-success transition-colors"
            >
              Search
            </button>
          </div>

          {/* Search Suggestions */}
          {searchTerm === '' && (
            <div className="mt-4">
              <p className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary mb-2">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {searchSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSearch(suggestion)}
                    className="px-3 py-1 bg-white dark:bg-darkMode-surface border border-gray-200 dark:border-darkMode-border rounded-full text-sm text-neutral-dark dark:text-darkMode-textSecondary hover:bg-neutral-light dark:hover:bg-darkMode-surfaceHover transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Filters */}
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-6 text-center">Quick Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  activeFilters.includes(filter.id)
                    ? 'border-primary-light dark:border-darkMode-accent bg-primary/10 dark:bg-darkMode-accent/10 text-primary-dark dark:text-darkMode-accent'
                    : 'border-gray-200 dark:border-darkMode-border bg-white dark:bg-darkMode-surface text-neutral-dark dark:text-darkMode-textSecondary hover:border-gray-300 dark:hover:border-darkMode-border'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1">{filter.count.toLocaleString()}</div>
                  <div className="text-sm">{filter.label}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Categories */}
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-6 text-center">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCategories.map((category) => (
              <Link
                key={category.name}
                to={`/student/courses?category=${encodeURIComponent(category.name)}`}
                className={`bg-gradient-to-r ${category.color} rounded-xl p-6 text-white hover:scale-105 transition-transform`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{category.icon}</span>
                  <div>
                    <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                    <p className="text-sm opacity-90 mb-2">{category.description}</p>
                    <p className="text-sm font-medium">{category.courseCount} courses</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
          <div className="max-w-4xl mx-auto mb-12">
            <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-text mb-4">Recent Searches</h2>
            <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6">
              <div className="space-y-3">
                {recentSearches.map((search, index) => (
                  <div key={index} className="flex items-center justify-between group">
                    <button
                      onClick={() => handleSearch(search)}
                      className="flex items-center gap-3 text-neutral-dark dark:text-darkMode-textSecondary hover:text-primary-dark dark:hover:text-darkMode-accent transition-colors"
                    >
                      <Clock className="w-4 h-4 text-gray-400 dark:text-darkMode-textMuted" />
                      <span>{search}</span>
                    </button>
                    <button className="opacity-0 group-hover:opacity-100 text-gray-400 dark:text-darkMode-textMuted hover:text-gray-600 dark:hover:text-darkMode-text transition-opacity">
                      <Target className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trending Now */}
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-6 text-center">Trending Now</h2>
          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'ChatGPT for Developers', trend: '+45%', icon: '🤖' },
                { title: 'React Native 2024', trend: '+32%', icon: '📱' },
                { title: 'Python Data Analysis', trend: '+28%', icon: '📊' },
                { title: 'Cybersecurity Basics', trend: '+25%', icon: '🔒' }
              ].map((item, index) => (
                <div key={index} className="text-center p-4 border border-gray-200 dark:border-darkMode-border rounded-lg hover:shadow-md dark:hover:shadow-dark transition-shadow">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h3 className="font-semibold text-neutral-dark dark:text-darkMode-text mb-1">{item.title}</h3>
                  <div className="flex items-center justify-center gap-1 text-success dark:text-darkMode-success">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Search Options */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6">
            <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-text mb-4">Advanced Search</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">Duration</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-darkMode-focus focus:border-transparent bg-white dark:bg-darkMode-surface text-neutral-dark dark:text-darkMode-text">
                  <option value="">Any duration</option>
                  <option value="short">Under 5 hours</option>
                  <option value="medium">5-20 hours</option>
                  <option value="long">20+ hours</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">Level</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-darkMode-focus focus:border-transparent bg-white dark:bg-darkMode-surface text-neutral-dark dark:text-darkMode-text">
                  <option value="">All levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">Rating</label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-darkMode-focus focus:border-transparent bg-white dark:bg-darkMode-surface text-neutral-dark dark:text-darkMode-text">
                  <option value="">Any rating</option>
                  <option value="4.5">4.5+ stars</option>
                  <option value="4.0">4.0+ stars</option>
                  <option value="3.5">3.5+ stars</option>
                </select>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link
                to="/student/courses"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-dark dark:bg-darkMode-navbar text-white rounded-lg hover:bg-primary dark:hover:bg-darkMode-surface transition-colors"
              >
                <Filter className="w-5 h-5" />
                Apply Advanced Filters
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSearch;
