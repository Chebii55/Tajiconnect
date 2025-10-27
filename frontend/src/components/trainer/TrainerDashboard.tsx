import React from 'react';
import { useTrainer } from '../../contexts/TrainerContext';
import { 
  Users, 
  BookOpen, 
  Clock, 
  Star, 
  TrendingUp, 
  Activity,
  Calendar,
  MessageSquare,
  Award,
  BarChart3
} from 'lucide-react';

const TrainerDashboard: React.FC = () => {
  const { trainer, stats, learners, courses } = useTrainer();

  const recentActivity = [
    { id: 1, type: 'enrollment', message: 'John Smith enrolled in React Fundamentals', time: '2 hours ago' },
    { id: 2, type: 'completion', message: 'Emily Davis completed Module 2', time: '4 hours ago' },
    { id: 3, type: 'message', message: 'New message from Alex Johnson', time: '6 hours ago' },
    { id: 4, type: 'achievement', message: 'Sarah Wilson earned a certificate', time: '1 day ago' }
  ];

  const upcomingTasks = [
    { id: 1, task: 'Review assignment submissions', due: 'Today', priority: 'high' },
    { id: 2, task: 'Update course materials', due: 'Tomorrow', priority: 'medium' },
    { id: 3, task: 'Weekly progress review', due: 'Friday', priority: 'low' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-['Inter']">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, {trainer?.name || 'Trainer'}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Here's what's happening with your courses today
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-primary-light text-white px-4 py-2 rounded-lg hover:bg-primary transition-colors flex items-center gap-2 shadow-md hover:shadow-lg">
                <MessageSquare className="w-4 h-4" />
                Messages
              </button>
              <button className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary-dark transition-colors flex items-center gap-2 shadow-md hover:shadow-lg">
                <BookOpen className="w-4 h-4" />
                Create Course
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Learners</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalLearners}</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">+12% from last month</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-lg">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Courses</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.totalCourses}</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">+2 new this month</p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Rating</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.averageRating.toFixed(1)}</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">+0.2 from last month</p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.completionRate.toFixed(0)}%</p>
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">+5% from last month</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                  <button className="text-primary-light hover:text-primary text-sm font-medium">
                    View All
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'enrollment' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        activity.type === 'completion' ? 'bg-green-100 dark:bg-green-900/30' :
                        activity.type === 'message' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                        'bg-purple-100 dark:bg-purple-900/30'
                      }`}>
                        {activity.type === 'enrollment' && <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                        {activity.type === 'completion' && <Award className="w-4 h-4 text-green-600 dark:text-green-400" />}
                        {activity.type === 'message' && <MessageSquare className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />}
                        {activity.type === 'achievement' && <Star className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900 dark:text-gray-200">{activity.message}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Tasks */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-primary-light" />
                  <span className="text-sm font-medium dark:text-gray-200">Create New Course</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-secondary" />
                  <span className="text-sm font-medium dark:text-gray-200">View Analytics</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-primary-light" />
                  <span className="text-sm font-medium dark:text-gray-200">Message Learners</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-accent-teal" />
                  <span className="text-sm font-medium dark:text-gray-200">Schedule Session</span>
                </button>
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Upcoming Tasks</h3>
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 dark:bg-gray-700/50">
                    <div className={`w-3 h-3 rounded-full ${
                      task.priority === 'high' ? 'bg-red-500' :
                      task.priority === 'medium' ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{task.task}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Due: {task.due}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Course Performance Overview */}
        <div className="mt-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Course Performance</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow dark:bg-gray-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">{course.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        course.isPublished ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-300'
                      }`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Enrolled:</span>
                        <span className="font-medium dark:text-gray-200">{course.enrolledStudents}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Completion:</span>
                        <span className="font-medium dark:text-gray-200">{course.completionRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="font-medium dark:text-gray-200">{course.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-600">
                      <button className="text-primary-light hover:text-primary text-sm font-medium">
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerDashboard;