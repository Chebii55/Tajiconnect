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
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Data Science',
      description: 'Analytics, ML, AI',
      courseCount: 890,
      icon: '📊',
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Mobile Development',
      description: 'iOS, Android, Cross-platform',
      courseCount: 650,
      icon: '📱',
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Design',
      description: 'UI/UX, Graphics, Product',
      courseCount: 420,
      icon: '🎨',
      color: 'from-pink-500 to-pink-600'
    },
    {
      name: 'DevOps',
      description: 'CI/CD, Cloud, Infrastructure',
      courseCount: 380,
      icon: '⚙️',
      color: 'from-orange-500 to-orange-600'
    },
    {
      name: 'Cybersecurity',
      description: 'Security, Ethical Hacking',
      courseCount: 290,
      icon: '🔒',
      color: 'from-red-500 to-red-600'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-['Inter']">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#1C3D6E] mb-4">
            Find Your Perfect Course
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Search through thousands of courses and find the one that matches your learning goals
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              placeholder="What do you want to learn today?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#3DAEDB] focus:border-transparent shadow-lg"
            />
            <button
              onClick={() => handleSearch(searchTerm)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-6 py-2 bg-[#3DAEDB] text-white rounded-xl hover:bg-[#2A9BC8] transition-colors"
            >
              Search
            </button>
          </div>

          {/* Search Suggestions */}
          {searchTerm === '' && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Popular searches:</p>
              <div className="flex flex-wrap gap-2">
                {searchSuggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSearch(suggestion)}
                    className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-50 transition-colors"
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
          <h2 className="text-2xl font-bold text-[#1C3D6E] mb-6 text-center">Quick Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {quickFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => toggleFilter(filter.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  activeFilters.includes(filter.id)
                    ? 'border-[#3DAEDB] bg-blue-50 text-[#1C3D6E]'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
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
          <h2 className="text-2xl font-bold text-[#1C3D6E] mb-6 text-center">Browse by Category</h2>
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
            <h2 className="text-xl font-bold text-[#1C3D6E] mb-4">Recent Searches</h2>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="space-y-3">
                {recentSearches.map((search, index) => (
                  <div key={index} className="flex items-center justify-between group">
                    <button
                      onClick={() => handleSearch(search)}
                      className="flex items-center gap-3 text-gray-700 hover:text-[#1C3D6E] transition-colors"
                    >
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{search}</span>
                    </button>
                    <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 transition-opacity">
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
          <h2 className="text-2xl font-bold text-[#1C3D6E] mb-6 text-center">Trending Now</h2>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'ChatGPT for Developers', trend: '+45%', icon: '🤖' },
                { title: 'React Native 2024', trend: '+32%', icon: '📱' },
                { title: 'Python Data Analysis', trend: '+28%', icon: '📊' },
                { title: 'Cybersecurity Basics', trend: '+25%', icon: '🔒' }
              ].map((item, index) => (
                <div key={index} className="text-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                  <div className="flex items-center justify-center gap-1 text-green-600">
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
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-[#1C3D6E] mb-4">Advanced Search</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DAEDB] focus:border-transparent">
                  <option value="">Any duration</option>
                  <option value="short">Under 5 hours</option>
                  <option value="medium">5-20 hours</option>
                  <option value="long">20+ hours</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DAEDB] focus:border-transparent">
                  <option value="">All levels</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DAEDB] focus:border-transparent">
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
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1C3D6E] text-white rounded-lg hover:bg-[#2A4F7C] transition-colors"
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