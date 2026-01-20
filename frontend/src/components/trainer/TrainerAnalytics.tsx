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
      color: 'bg-primary'
    },
    completions: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: [8, 12, 10, 16],
      color: 'bg-success'
    },
    engagement: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: [85, 78, 92, 88],
      color: 'bg-accent-teal'
    },
    revenue: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      data: [1200, 1800, 1500, 2200],
      color: 'bg-accent-gold'
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
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg font-['Inter']">
      {/* Header */}
      <div className="bg-neutral-white dark:bg-darkMode-surface shadow-sm border-b dark:border-darkMode-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text">Analytics Dashboard</h1>
              <p className="text-forest-sage dark:text-darkMode-textSecondary mt-1">
                Track your teaching performance and learner engagement
              </p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2">
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
          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm p-6 border border-neutral-gray dark:border-darkMode-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Total Revenue</p>
                <p className="text-3xl font-bold text-neutral-dark dark:text-darkMode-text mt-2">$12,450</p>
                <p className="text-sm text-success dark:text-darkMode-success mt-1 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +15% from last month
                </p>
              </div>
              <div className="bg-success/10 dark:bg-darkMode-success/20 p-3 rounded-lg">
                <BarChart3 className="w-6 h-6 text-success dark:text-darkMode-success" />
              </div>
            </div>
          </div>

          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm p-6 border border-neutral-gray dark:border-darkMode-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">New Enrollments</p>
                <p className="text-3xl font-bold text-neutral-dark dark:text-darkMode-text mt-2">68</p>
                <p className="text-sm text-success dark:text-darkMode-success mt-1 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +22% from last month
                </p>
              </div>
              <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
                <Users className="w-6 h-6 text-primary dark:text-primary-light" />
              </div>
            </div>
          </div>

          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm p-6 border border-neutral-gray dark:border-darkMode-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Course Completions</p>
                <p className="text-3xl font-bold text-neutral-dark dark:text-darkMode-text mt-2">46</p>
                <p className="text-sm text-success dark:text-darkMode-success mt-1 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +8% from last month
                </p>
              </div>
              <div className="bg-accent-teal/10 dark:bg-accent-teal/20 p-3 rounded-lg">
                <Award className="w-6 h-6 text-accent-teal dark:text-accent-teal" />
              </div>
            </div>
          </div>

          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm p-6 border border-neutral-gray dark:border-darkMode-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Avg. Engagement</p>
                <p className="text-3xl font-bold text-neutral-dark dark:text-darkMode-text mt-2">86%</p>
                <p className="text-sm text-success dark:text-darkMode-success mt-1 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +3% from last month
                </p>
              </div>
              <div className="bg-accent-gold/10 dark:bg-darkMode-accent/20 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-accent-gold dark:text-darkMode-accent" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border">
              <div className="p-6 border-b border-neutral-gray dark:border-darkMode-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text">Performance Trends</h2>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedMetric}
                      onChange={(e) => setSelectedMetric(e.target.value)}
                      className="px-3 py-1 text-sm border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                    >
                      <option value="enrollments">Enrollments</option>
                      <option value="completions">Completions</option>
                      <option value="engagement">Engagement %</option>
                      <option value="revenue">Revenue</option>
                    </select>
                    <button className="p-1 text-forest-sage hover:text-neutral-dark dark:text-darkMode-textSecondary dark:hover:text-darkMode-text">
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
                        className={`w-full ${analyticsData[selectedMetric as keyof typeof analyticsData].color} dark:opacity-80 rounded-t-lg transition-all duration-500`}
                        style={{ height: `${(value / maxValue) * 200}px` }}
                      />
                      <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary mt-2">
                        {analyticsData[selectedMetric as keyof typeof analyticsData].labels[index]}
                      </p>
                      <p className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Learner Engagement */}
          <div>
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border mb-6">
              <div className="p-6 border-b border-neutral-gray dark:border-darkMode-border">
                <h3 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text">Learner Engagement</h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-forest-sage dark:text-darkMode-textSecondary">Active Today</span>
                  <span className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text">{learnerEngagement.activeToday}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-forest-sage dark:text-darkMode-textSecondary">Active This Week</span>
                  <span className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text">{learnerEngagement.activeThisWeek}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-forest-sage dark:text-darkMode-textSecondary">Active This Month</span>
                  <span className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text">{learnerEngagement.activeThisMonth}</span>
                </div>
                <div className="pt-4 border-t border-neutral-gray dark:border-darkMode-border">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary dark:text-primary-light">
                      {Math.round((learnerEngagement.activeThisMonth / learners.length) * 100)}%
                    </p>
                    <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">Monthly Engagement Rate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Performing Courses */}
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border">
              <div className="p-6 border-b border-neutral-gray dark:border-darkMode-border">
                <h3 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text">Top Performing Courses</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {topPerformingCourses.map((course, index) => (
                    <div key={course.id} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary dark:text-primary-light">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-dark dark:text-darkMode-text truncate">{course.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-forest-sage dark:text-darkMode-textMuted">{course.enrolledStudents} enrolled</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-accent-gold dark:text-darkMode-accent fill-current" />
                            <span className="text-xs text-forest-sage dark:text-darkMode-textMuted">{course.rating}</span>
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
          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border">
            <div className="p-6 border-b border-neutral-gray dark:border-darkMode-border">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text">Recent Enrollments</h2>
                <button className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary text-sm font-medium">
                  View All
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-light dark:bg-darkMode-navbar">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-forest-sage dark:text-darkMode-textMuted uppercase tracking-wider">
                      Learner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-forest-sage dark:text-darkMode-textMuted uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-forest-sage dark:text-darkMode-textMuted uppercase tracking-wider">
                      Enrollment Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-forest-sage dark:text-darkMode-textMuted uppercase tracking-wider">
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-neutral-white dark:bg-darkMode-surface divide-y divide-neutral-gray dark:divide-darkMode-border">
                  {recentEnrollments.map((enrollment, index) => (
                    <tr key={index} className="hover:bg-neutral-light dark:hover:bg-darkMode-navbar">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-primary-dark to-primary dark:from-darkMode-progress dark:to-darkMode-success rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {enrollment.name.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">{enrollment.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-neutral-dark dark:text-darkMode-text">{enrollment.course}</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">
                          {new Date(enrollment.date).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-neutral-gray dark:bg-darkMode-border rounded-full h-2 mr-2">
                            <div
                              className="bg-primary dark:bg-darkMode-progress h-2 rounded-full"
                              style={{ width: `${enrollment.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-forest-sage dark:text-darkMode-textSecondary">{enrollment.progress}%</span>
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
