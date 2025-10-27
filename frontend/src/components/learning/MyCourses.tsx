import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Clock,
  TrendingUp,
  Play,
  Award,
  CheckCircle,
  BarChart3
} from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  totalHours: number;
  completedHours: number;
  status: 'in-progress' | 'completed' | 'not-started';
  lastAccessed: string;
  nextLesson?: string;
  instructor: string;
  rating: number;
  thumbnail: string;
  skills: string[];
  hrbaScore?: number;
}

const MyCourses: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'in-progress' | 'completed'>('all');

  const mockCourses: Course[] = [
    {
      id: '1',
      title: 'Global Citizenship & Human Rights Foundations',
      description: 'Develop understanding of human rights principles and your role as a global citizen',
      category: 'GCED Core',
      progress: 100,
      totalHours: 24,
      completedHours: 24,
      status: 'completed',
      lastAccessed: '2 days ago',
      instructor: 'Dr. Amina Hassan',
      rating: 4.9,
      thumbnail: '🌍',
      skills: ['Human Rights', 'Global Citizenship', 'Social Justice'],
      hrbaScore: 95
    },
    {
      id: '2',
      title: 'Social-Emotional Learning (SEL) Essentials',
      description: 'Build resilience, empathy, and emotional intelligence through evidence-based SEL practices',
      category: 'SEL Foundation',
      progress: 75,
      totalHours: 18,
      completedHours: 13.5,
      status: 'in-progress',
      lastAccessed: 'Yesterday',
      nextLesson: 'Empathy Circle Practice',
      instructor: 'Grace Wanjiru',
      rating: 4.8,
      thumbnail: '❤️',
      skills: ['Emotional Intelligence', 'Resilience', 'Empathy'],
      hrbaScore: 82
    },
    {
      id: '3',
      title: 'Climate Justice & Environmental Action',
      description: 'Understand climate change impacts and develop environmental advocacy skills',
      category: 'Environmental Stewardship',
      progress: 45,
      totalHours: 30,
      completedHours: 13.5,
      status: 'in-progress',
      lastAccessed: '3 days ago',
      nextLesson: 'Community Climate Action Planning',
      instructor: 'Dr. James Kinyanjui',
      rating: 4.7,
      thumbnail: '🌱',
      skills: ['Climate Science', 'Environmental Advocacy', 'Sustainability'],
      hrbaScore: 78
    },
    {
      id: '4',
      title: 'Digital Citizenship & AI Ethics',
      description: 'Navigate the digital world responsibly and understand AI impacts',
      category: 'Digital Citizenship',
      progress: 20,
      totalHours: 22,
      completedHours: 4.4,
      status: 'in-progress',
      lastAccessed: '1 week ago',
      nextLesson: 'Understanding AI Bias',
      instructor: 'Tech4Good Kenya Team',
      rating: 4.6,
      thumbnail: '🛡️',
      skills: ['Digital Literacy', 'AI Ethics', 'Online Safety'],
      hrbaScore: 65
    }
  ];

  const filteredCourses = mockCourses.filter(course => {
    if (activeTab === 'all') return true;
    return course.status === activeTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] via-white to-[#2C857A]/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-[#1C3D6E] rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#1C3D6E] font-heading">My GCED Journey</h1>
              <p className="text-gray-600">Track your progress through TFDN's transformative learning pathways</p>
              <p className="text-sm text-[#4A9E3D] font-medium mt-1">
                🌍 Building empowered global citizens for positive change
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#4A9E3D] rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#4A9E3D]">60%</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-600">Average Progress</p>
            <p className="text-xs text-[#4A9E3D] font-medium">+15% this month</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#3DAEDB] rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#3DAEDB]">55h</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-600">Learning Hours</p>
            <p className="text-xs text-[#4A9E3D] font-medium">94h total available</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-[#2C857A] rounded-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#2C857A]">1</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-600">Certificates</p>
            <p className="text-xs text-[#4A9E3D] font-medium">3 in progress</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-600 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600">80%</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-600">HRBA Impact</p>
            <p className="text-xs text-[#4A9E3D] font-medium">Community engagement</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="flex border-b border-gray-200">
            {[
              { key: 'all', label: 'All Courses', count: mockCourses.length },
              { key: 'in-progress', label: 'In Progress', count: mockCourses.filter(c => c.status === 'in-progress').length },
              { key: 'completed', label: 'Completed', count: mockCourses.filter(c => c.status === 'completed').length }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as 'all' | 'in-progress' | 'completed')}
                className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === key
                    ? 'border-[#3DAEDB] text-[#1C3D6E] bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-[#1C3D6E] hover:bg-gray-50'
                }`}
              >
                {label}
                <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">{count}</span>
              </button>
            ))}
          </div>

          {/* Course Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCourses.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{course.thumbnail}</span>
                      <div>
                        <h3 className="font-bold text-[#1C3D6E] text-lg group-hover:text-[#3DAEDB] transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-600">{course.category}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                      {course.status === 'in-progress' ? 'In Progress' : course.status === 'completed' ? 'Completed' : 'Not Started'}
                    </span>
                  </div>

                  <p className="text-gray-700 text-sm mb-4">{course.description}</p>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm font-medium mb-2">
                      <span className="text-[#1C3D6E]">{course.progress}% complete</span>
                      <span className="text-gray-600">{course.completedHours}h / {course.totalHours}h</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(course.progress)}`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {course.hrbaScore && (
                    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-[#1C3D6E]">HRBA Impact Score</span>
                        <span className="text-lg font-bold text-[#3DAEDB]">{course.hrbaScore}%</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Last accessed: {course.lastAccessed}</p>
                      {course.nextLesson && (
                        <p className="text-xs text-[#4A9E3D] font-medium">Next: {course.nextLesson}</p>
                      )}
                    </div>
                    <Link
                      to={`/student/courses/${course.id}`}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                        course.status === 'completed'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-[#1C3D6E] text-white hover:bg-[#2A4F7C]'
                      }`}
                    >
                      {course.status === 'completed' ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Review
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          {course.status === 'in-progress' ? 'Continue' : 'Start'}
                        </>
                      )}
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === 'completed' ? 'Complete some courses to see them here!' :
                   activeTab === 'in-progress' ? 'Start learning to see courses in progress!' :
                   'Enroll in GCED courses to begin your journey.'}
                </p>
                <Link
                  to="/student/courses"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Browse GCED Courses
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCourses;