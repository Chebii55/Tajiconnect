import React, { useState, useEffect } from 'react';
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Replace with actual API call when endpoint is available
      throw new Error('Course endpoint not implemented');
    } catch (err: any) {
      console.error('Failed to load courses:', err);
      setError(`Failed to load courses: ${err.message}`);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = courses.filter(course => {
    if (activeTab === 'all') return true;
    return course.status === activeTab;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button 
            onClick={loadCourses}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-success dark:text-darkMode-success bg-success/10 dark:bg-darkMode-success/20';
      case 'in-progress': return 'text-info dark:text-darkMode-link bg-info/10 dark:bg-darkMode-link/20';
      default: return 'text-neutral-dark dark:text-darkMode-textSecondary bg-neutral-gray dark:bg-darkMode-surface';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-success dark:bg-darkMode-success';
    if (progress >= 50) return 'bg-info dark:bg-darkMode-link';
    return 'bg-warning dark:bg-warning';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-darkMode-bg dark:via-darkMode-surface dark:to-darkMode-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary-dark dark:bg-darkMode-navbar rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-primary-dark dark:text-darkMode-text font-heading">My GCED Journey</h1>
              <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary">Track your progress through TFDN's transformative learning pathways</p>
              <p className="text-sm text-secondary dark:text-darkMode-success font-medium mt-1">
                🌍 Building empowered global citizens for positive change
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-secondary dark:bg-darkMode-success rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-secondary dark:text-darkMode-success">60%</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-neutral-dark/80 dark:text-darkMode-textSecondary">Average Progress</p>
            <p className="text-xs text-secondary dark:text-darkMode-success font-medium">+15% this month</p>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-light dark:bg-darkMode-progress rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-light dark:text-darkMode-accent">55h</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-neutral-dark/80 dark:text-darkMode-textSecondary">Learning Hours</p>
            <p className="text-xs text-secondary dark:text-darkMode-success font-medium">94h total available</p>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-forest-sage dark:bg-darkMode-success rounded-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-forest-sage dark:text-darkMode-success">1</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-neutral-dark/80 dark:text-darkMode-textSecondary">Certificates</p>
            <p className="text-xs text-secondary dark:text-darkMode-success font-medium">3 in progress</p>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-600 dark:bg-purple-500 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">80%</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-neutral-dark/80 dark:text-darkMode-textSecondary">HRBA Impact</p>
            <p className="text-xs text-secondary dark:text-darkMode-success font-medium">Community engagement</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark mb-8">
          <div className="flex border-b border-gray-200 dark:border-darkMode-border">
            {[
              { key: 'all', label: 'All Courses', count: courses.length },
              { key: 'in-progress', label: 'In Progress', count: courses.filter(c => c.status === 'in-progress').length },
              { key: 'completed', label: 'Completed', count: courses.filter(c => c.status === 'completed').length }
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as 'all' | 'in-progress' | 'completed')}
                className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === key
                    ? 'border-primary-light dark:border-darkMode-accent text-primary-dark dark:text-darkMode-text bg-primary/5 dark:bg-darkMode-accent/10'
                    : 'border-transparent text-neutral-dark/80 dark:text-darkMode-textSecondary hover:text-primary-dark dark:hover:text-darkMode-text hover:bg-neutral-light dark:hover:bg-darkMode-surfaceHover'
                }`}
              >
                {label}
                <span className="px-2 py-1 bg-neutral-gray dark:bg-darkMode-surfaceHover text-neutral-dark dark:text-darkMode-textSecondary text-xs rounded-full">{count}</span>
              </button>
            ))}
          </div>

          {/* Course Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCourses.map((course) => (
                <div key={course.id} className="border border-gray-200 dark:border-darkMode-border rounded-xl p-6 hover:shadow-lg dark:hover:shadow-dark transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{course.thumbnail}</span>
                      <div>
                        <h3 className="font-bold text-primary-dark dark:text-darkMode-text text-lg group-hover:text-primary-light dark:group-hover:text-darkMode-accent transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">{course.category}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                      {course.status === 'in-progress' ? 'In Progress' : course.status === 'completed' ? 'Completed' : 'Not Started'}
                    </span>
                  </div>

                  <p className="text-neutral-dark dark:text-darkMode-textSecondary text-sm mb-4">{course.description}</p>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm font-medium mb-2">
                      <span className="text-primary-dark dark:text-darkMode-text">{course.progress}% complete</span>
                      <span className="text-neutral-dark/80 dark:text-darkMode-textSecondary">{course.completedHours}h / {course.totalHours}h</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-darkMode-border rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(course.progress)}`}
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {course.hrbaScore && (
                    <div className="mb-4 p-3 bg-info/10 dark:bg-darkMode-link/10 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-primary-dark dark:text-darkMode-text">HRBA Impact Score</span>
                        <span className="text-lg font-bold text-primary-light dark:text-darkMode-accent">{course.hrbaScore}%</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-neutral-dark/60 dark:text-darkMode-textMuted">Last accessed: {course.lastAccessed}</p>
                      {course.nextLesson && (
                        <p className="text-xs text-secondary dark:text-darkMode-success font-medium">Next: {course.nextLesson}</p>
                      )}
                    </div>
                    <Link
                      to={`/student/courses/${course.id}`}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                        course.status === 'completed'
                          ? 'bg-success/10 dark:bg-darkMode-success/20 text-success dark:text-darkMode-success hover:bg-success/20 dark:hover:bg-darkMode-success/30'
                          : 'bg-primary-dark dark:bg-darkMode-navbar text-white hover:bg-primary dark:hover:bg-darkMode-surface'
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
                <BookOpen className="w-16 h-16 text-gray-400 dark:text-darkMode-textMuted mx-auto mb-4" />
                <h3 className="text-xl font-medium text-neutral-dark dark:text-darkMode-text mb-2">No courses found</h3>
                <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary mb-6">
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
