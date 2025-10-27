import React, { useState } from 'react';
import { useTrainer } from '../../contexts/TrainerContext';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Star, 
  Award,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';

const TrainerAnalytics: React.FC = () => {
  const { courses, learners, stats } = useTrainer();
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('enrollments');

  // Mock analytics data
  const analyticsData = {
    enrollments: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: [12, 19, 15, 22],
      color: 'bg-blue-500'
    },
    completions: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: [8, 12, 10, 16],
      color: 'bg-green-500'
    },
    engagement: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: [85, 78, 92, 88],
      color: 'bg-purple-500'
    },
    revenue: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: [1200, 1800, 1500, 2200],
      color: 'bg-yellow-500'
    }
  };

  const topPerformingCourses = courses
    .sort((a, b) => b.enrolledStudents - a.enrolledStudents)
    .slice(0, 5);

  const recentEnrollments = [
    { name: 'John Smith', course: 'React Fundamentals', date: '2024-03-15', progress: 25 },
    { name: 'Emily Davis', course: 'Advanced JavaScript', date: '2024-03-14', progress: 0 },
    { name: 'Michael Johnson', course: 'React Fundamentals', date: '2024-03-13', progress: 45 },
    { name: 'Sarah Wilson', course: 'Node.js Basics', date: '2024-03-12', progress: 80 }
  ];

  const learnerEngagement = {
    activeToday: learners.filter(l => 
      new Date(l.lastActive).toDateString() === new Date().toDateString()
    ).length,
    activeThisWeek: learners.filter(l => 
      new Date(l.lastActive) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length,
    activeThisMonth: learners.filter(l => 
      new Date(l.lastActive) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ).length
  };

  const maxValue = Math.max(...analyticsData[selectedMetric as keyof typeof analyticsData].data);

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Track your teaching performance and learner engagement
              </p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">$12,450</p>
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +15% from last month
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Enrollments</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">68</p>
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +22% from last month
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Course Completions</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">46</p>
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +8% from last month
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Engagement</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">86%</p>
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +3% from last month
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Performance Trends</h2>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedMetric}
                      onChange={(e) => setSelectedMetric(e.target.value)}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="enrollments">Enrollments</option>
                      <option value="completions">Completions</option>
                      <option value="engagement">Engagement %</option>
                      <option value="revenue">Revenue</option>
                    </select>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="h-64 flex items-end justify-between gap-4">
                  {analyticsData[selectedMetric as keyof typeof analyticsData].data.map((value, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className={`w-full ${analyticsData[selectedMetric as keyof typeof analyticsData].color} rounded-t-lg transition-all duration-500`}
                        style={{ height: `${(value / maxValue) * 200}px` }}
                      />
                      <p className="text-sm text-gray-600 mt-2">
                        {analyticsData[selectedMetric as keyof typeof analyticsData].labels[index]}
                      </p>
                      <p className="text-sm font-medium text-gray-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Learner Engagement */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Learner Engagement</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Today</span>
                  <span className="text-lg font-semibold text-gray-900">{learnerEngagement.activeToday}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active This Week</span>
                  <span className="text-lg font-semibold text-gray-900">{learnerEngagement.activeThisWeek}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active This Month</span>
                  <span className="text-lg font-semibold text-gray-900">{learnerEngagement.activeThisMonth}</span>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-indigo-600">
                      {Math.round((learnerEngagement.activeThisMonth / learners.length) * 100)}%
                    </p>
                    <p className="text-sm text-gray-600">Monthly Engagement Rate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Performing Courses */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Top Performing Courses</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {topPerformingCourses.map((course, index) => (
                    <div key={course.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{course.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">{course.enrolledStudents} enrolled</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-xs text-gray-500">{course.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Enrollments</h2>
                <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  View All
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Learner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Enrollment Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentEnrollments.map((enrollment, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {enrollment.name.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{enrollment.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-900">{enrollment.course}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-gray-500">
                          {new Date(enrollment.date).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full" 
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{enrollment.progress}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerAnalytics;