import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrainer } from '../../../contexts/TrainerContext';
import {
  ArrowLeft,
  TrendingUp,
  Users,
  Clock,
  Star,
  BarChart3,
  Filter,
  Calendar,
  Download
} from 'lucide-react';

const CoursePerformance: React.FC = () => {
  const navigate = useNavigate();
  const { courses } = useTrainer();

  const [timeRange, setTimeRange] = useState('30d');
  const [sortBy, setSortBy] = useState('enrollment');

  const sortedCourses = [...courses].sort((a, b) => {
    switch (sortBy) {
      case 'enrollment':
        return b.enrolledStudents - a.enrolledStudents;
      case 'completion':
        return b.completionRate - a.completionRate;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg font-['Inter']">
      {/* Header */}
      <div className="bg-neutral-white dark:bg-darkMode-surface shadow-sm border-b dark:border-darkMode-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/trainer/analytics')}
                className="p-2 text-forest-sage hover:text-neutral-dark dark:text-darkMode-textSecondary dark:hover:text-darkMode-text rounded-lg hover:bg-neutral-light dark:hover:bg-darkMode-navbar"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text">Course Performance</h1>
                <p className="text-forest-sage dark:text-darkMode-textSecondary mt-1">
                  Compare performance across all your courses
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-neutral-dark dark:text-darkMode-text border border-neutral-gray dark:border-darkMode-border rounded-lg hover:bg-neutral-light dark:hover:bg-darkMode-navbar flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg border border-neutral-gray dark:border-darkMode-border p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-forest-sage dark:text-darkMode-textMuted" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="border border-neutral-gray dark:border-darkMode-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-forest-sage dark:text-darkMode-textMuted" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-neutral-gray dark:border-darkMode-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                >
                  <option value="enrollment">Sort by Enrollment</option>
                  <option value="completion">Sort by Completion</option>
                  <option value="rating">Sort by Rating</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg p-6 border border-neutral-gray dark:border-darkMode-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Total Enrollments</p>
                <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">
                  {courses.reduce((sum, course) => sum + course.enrolledStudents, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-primary dark:text-primary-light" />
            </div>
          </div>

          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg p-6 border border-neutral-gray dark:border-darkMode-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Avg. Completion</p>
                <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">
                  {courses.length > 0
                    ? Math.round(courses.reduce((sum, course) => sum + course.completionRate, 0) / courses.length)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-success dark:text-darkMode-success" />
            </div>
          </div>

          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg p-6 border border-neutral-gray dark:border-darkMode-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Avg. Rating</p>
                <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">
                  {courses.length > 0
                    ? (courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)
                    : '0.0'}
                </p>
              </div>
              <Star className="w-8 h-8 text-accent-gold dark:text-darkMode-accent" />
            </div>
          </div>

          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg p-6 border border-neutral-gray dark:border-darkMode-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Total Hours</p>
                <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">
                  {courses.reduce((sum, course) => sum + course.duration, 0)}h
                </p>
              </div>
              <Clock className="w-8 h-8 text-accent-teal dark:text-accent-teal" />
            </div>
          </div>
        </div>

        {/* Course Comparison */}
        <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg border border-neutral-gray dark:border-darkMode-border overflow-hidden">
          <div className="p-6 border-b border-neutral-gray dark:border-darkMode-border">
            <h2 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text">Course Comparison</h2>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-forest-sage dark:text-darkMode-textMuted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-dark dark:text-darkMode-text mb-2">No Courses Yet</h3>
              <p className="text-forest-sage dark:text-darkMode-textSecondary">
                Create your first course to see performance analytics
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-light dark:bg-darkMode-navbar">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-forest-sage dark:text-darkMode-textMuted uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-forest-sage dark:text-darkMode-textMuted uppercase tracking-wider">
                      Enrolled
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-forest-sage dark:text-darkMode-textMuted uppercase tracking-wider">
                      Completion Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-forest-sage dark:text-darkMode-textMuted uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-forest-sage dark:text-darkMode-textMuted uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-forest-sage dark:text-darkMode-textMuted uppercase tracking-wider">
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-gray dark:divide-darkMode-border">
                  {sortedCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-neutral-light dark:hover:bg-darkMode-navbar">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">
                            {course.title}
                          </div>
                          <div className="text-sm text-forest-sage dark:text-darkMode-textMuted">
                            {course.category} - {course.difficulty}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">
                          {course.enrolledStudents}
                        </div>
                        <div className="text-sm text-forest-sage dark:text-darkMode-textMuted">
                          students
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 mr-4">
                            <div className="w-full bg-neutral-gray dark:bg-darkMode-border rounded-full h-2">
                              <div
                                className="bg-primary dark:bg-darkMode-progress h-2 rounded-full"
                                style={{ width: `${course.completionRate}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">
                            {course.completionRate}%
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-accent-gold dark:text-darkMode-accent fill-current" />
                          <span className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">
                            {course.rating}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          course.isPublished
                            ? 'bg-success/10 text-success dark:bg-darkMode-success/20 dark:text-darkMode-success'
                            : 'bg-neutral-gray text-forest-sage dark:bg-darkMode-border dark:text-darkMode-textSecondary'
                        }`}>
                          {course.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {course.enrolledStudents > 20 && course.completionRate > 70 && course.rating > 4.0 ? (
                            <span className="text-success dark:text-darkMode-success text-sm font-medium">Excellent</span>
                          ) : course.enrolledStudents > 10 && course.completionRate > 50 && course.rating > 3.5 ? (
                            <span className="text-primary dark:text-primary-light text-sm font-medium">Good</span>
                          ) : course.enrolledStudents > 5 && course.completionRate > 30 ? (
                            <span className="text-accent-gold dark:text-darkMode-accent text-sm font-medium">Average</span>
                          ) : (
                            <span className="text-error dark:text-error text-sm font-medium">Needs Attention</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursePerformance;
