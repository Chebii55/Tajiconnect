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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-['Inter']">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/trainer/analytics')}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Course Performance</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Compare performance across all your courses
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
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
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Enrollments</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {courses.reduce((sum, course) => sum + course.enrolledStudents, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Completion</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {courses.length > 0 
                    ? Math.round(courses.reduce((sum, course) => sum + course.completionRate, 0) / courses.length)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {courses.length > 0 
                    ? (courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)
                    : '0.0'}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {courses.reduce((sum, course) => sum + course.duration, 0)}h
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Course Comparison */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Course Comparison</h2>
          </div>
          
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Courses Yet</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Create your first course to see performance analytics
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Enrolled
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Completion Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {sortedCourses.map((course) => (
                    <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {course.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {course.category} • {course.difficulty}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {course.enrolledStudents}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          students
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-1 mr-4">
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div
                                className="bg-primary-light h-2 rounded-full"
                                style={{ width: `${course.completionRate}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {course.completionRate}%
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {course.rating}
                          </span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          course.isPublished 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                        }`}>
                          {course.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {course.enrolledStudents > 20 && course.completionRate > 70 && course.rating > 4.0 ? (
                            <span className="text-green-600 dark:text-green-400 text-sm font-medium">Excellent</span>
                          ) : course.enrolledStudents > 10 && course.completionRate > 50 && course.rating > 3.5 ? (
                            <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">Good</span>
                          ) : course.enrolledStudents > 5 && course.completionRate > 30 ? (
                            <span className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">Average</span>
                          ) : (
                            <span className="text-red-600 dark:text-red-400 text-sm font-medium">Needs Attention</span>
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