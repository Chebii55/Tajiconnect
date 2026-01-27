import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../services/api/courses';
import { userService } from '../../services/api/user';
import type { Course } from '../../services/api/courses';
import type { CourseEnrollment } from '../../services/api/user';
import { getUserId } from '../../utils/auth';
import {
  BookOpen,
  Clock,
  TrendingUp,
  Play,
  CheckCircle,
  BarChart3
} from 'lucide-react';

interface EnrolledCourse {
  course: Course;
  enrollment: CourseEnrollment;
}

const MyCourses: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'in-progress' | 'completed'>('all');
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const userId = getUserId();
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const enrollments = await userService.getUserCourses(userId, 0, 200);
      const courseResults = await Promise.allSettled(
        enrollments.map((enrollment) => courseService.getCourseById(enrollment.course_id))
      );

      const enriched: EnrolledCourse[] = [];
      courseResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          enriched.push({ course: result.value, enrollment: enrollments[index] });
        } else {
          console.warn('Failed to load course details', enrollments[index].course_id, result.reason);
        }
      });

      setCourses(enriched);
    } catch (err: any) {
      console.error('Failed to load courses:', err);
      setError(`Failed to load courses: ${err.message || 'Service unavailable'}`);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCourses = useMemo(() => {
    if (activeTab === 'all') return courses;
    return courses.filter(({ enrollment }) => {
      if (activeTab === 'completed') return enrollment.status === 'completed';
      return enrollment.status === 'in_progress' || enrollment.status === 'enrolled';
    });
  }, [courses, activeTab]);

  const stats = useMemo(() => {
    const total = courses.length;
    const completed = courses.filter((item) => item.enrollment.status === 'completed').length;
    const inProgress = courses.filter((item) => item.enrollment.status === 'in_progress').length;
    const averageProgress =
      total === 0
        ? 0
        : Math.round(
            courses.reduce((sum, item) => sum + item.enrollment.progress_percent, 0) / total
          );
    const totalHours = courses.reduce(
      (sum, item) => sum + (item.course.duration_hours || 0),
      0
    );

    return {
      total,
      completed,
      inProgress,
      averageProgress,
      totalHours,
    };
  }, [courses]);

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

  const getStatusColor = (status: CourseEnrollment['status']) => {
    switch (status) {
      case 'completed':
        return 'text-success dark:text-darkMode-success bg-success/10 dark:bg-darkMode-success/20';
      case 'in_progress':
        return 'text-info dark:text-darkMode-link bg-info/10 dark:bg-darkMode-link/20';
      default:
        return 'text-neutral-dark dark:text-darkMode-textSecondary bg-neutral-gray dark:bg-darkMode-surface';
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
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary-dark dark:bg-darkMode-navbar rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-primary-dark dark:text-darkMode-text font-heading">
                My Courses
              </h1>
              <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary">
                Track your enrolled courses and progress
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-secondary dark:bg-darkMode-success rounded-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-secondary dark:text-darkMode-success">
                  {stats.averageProgress}%
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold text-neutral-dark/80 dark:text-darkMode-textSecondary">
              Average Progress
            </p>
            <p className="text-xs text-secondary dark:text-darkMode-success font-medium">
              {stats.inProgress} in progress
            </p>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-light dark:bg-darkMode-progress rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-light dark:text-darkMode-accent">
                  {stats.totalHours}h
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold text-neutral-dark/80 dark:text-darkMode-textSecondary">
              Total Course Hours
            </p>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-forest-sage dark:bg-darkMode-success rounded-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-forest-sage dark:text-darkMode-success">
                  {stats.completed}
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold text-neutral-dark/80 dark:text-darkMode-textSecondary">
              Completed Courses
            </p>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-600 dark:bg-purple-500 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.total}
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold text-neutral-dark/80 dark:text-darkMode-textSecondary">
              Total Enrollments
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark mb-8">
          <div className="flex border-b border-gray-200 dark:border-darkMode-border">
            {[
              { key: 'all', label: 'All Courses', count: courses.length },
              {
                key: 'in-progress',
                label: 'In Progress',
                count: courses.filter((c) => c.enrollment.status === 'in_progress').length,
              },
              {
                key: 'completed',
                label: 'Completed',
                count: courses.filter((c) => c.enrollment.status === 'completed').length,
              },
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
                <span className="px-2 py-1 bg-neutral-gray dark:bg-darkMode-surfaceHover text-neutral-dark dark:text-darkMode-textSecondary text-xs rounded-full">
                  {count}
                </span>
              </button>
            ))}
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredCourses.map(({ course, enrollment }) => (
                <div
                  key={course.id}
                  className="border border-gray-200 dark:border-darkMode-border rounded-xl p-6 hover:shadow-lg dark:hover:shadow-dark transition-all duration-300 group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">📘</span>
                      <div>
                        <h3 className="font-bold text-primary-dark dark:text-darkMode-text text-lg group-hover:text-primary-light dark:group-hover:text-darkMode-accent transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">
                          {course.status}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        enrollment.status
                      )}`}
                    >
                      {enrollment.status.replace('_', ' ')}
                    </span>
                  </div>

                  {course.description ? (
                    <p className="text-neutral-dark dark:text-darkMode-textSecondary text-sm mb-4">
                      {course.description}
                    </p>
                  ) : null}

                  <div className="mb-4">
                    <div className="flex justify-between text-sm font-medium mb-2">
                      <span className="text-primary-dark dark:text-darkMode-text">
                        {enrollment.progress_percent}% complete
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-darkMode-border rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(
                          enrollment.progress_percent
                        )}`}
                        style={{ width: `${enrollment.progress_percent}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-neutral-dark/60 dark:text-darkMode-textMuted">
                        Last accessed:{' '}
                        {enrollment.last_accessed_at
                          ? new Date(enrollment.last_accessed_at).toLocaleDateString()
                          : new Date(enrollment.enrolled_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Link
                      to={`/student/courses/${course.id}`}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                        enrollment.status === 'completed'
                          ? 'bg-success/10 dark:bg-darkMode-success/20 text-success dark:text-darkMode-success hover:bg-success/20 dark:hover:bg-darkMode-success/30'
                          : 'bg-primary-dark dark:bg-darkMode-navbar text-white hover:bg-primary dark:hover:bg-darkMode-surface'
                      }`}
                    >
                      {enrollment.status === 'completed' ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Review
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          {enrollment.status === 'in_progress' ? 'Continue' : 'Start'}
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
                <h3 className="text-xl font-medium text-neutral-dark dark:text-darkMode-text mb-2">
                  No courses found
                </h3>
                <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary mb-6">
                  {activeTab === 'completed'
                    ? 'Complete some courses to see them here!'
                    : activeTab === 'in-progress'
                    ? 'Start learning to see courses in progress!'
                    : 'Enroll in courses to begin your journey.'}
                </p>
                <Link to="/student/courses" className="btn-primary inline-flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Browse Courses
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
