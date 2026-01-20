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
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg font-['Inter']">
      {/* Header */}
      <div className="bg-neutral-white dark:bg-darkMode-surface shadow-sm border-b dark:border-darkMode-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text">
                Welcome back, {trainer?.name || 'Trainer'}!
              </h1>
              <p className="text-forest-sage dark:text-darkMode-textSecondary mt-1">
                Here's what's happening with your courses today
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-md hover:shadow-lg">
                <MessageSquare className="w-4 h-4" />
                Messages
              </button>
              <button className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-success transition-colors flex items-center gap-2 shadow-md hover:shadow-lg">
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
          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm p-6 border border-neutral-gray dark:border-darkMode-border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Total Learners</p>
                <p className="text-3xl font-bold text-neutral-dark dark:text-darkMode-text mt-2">{stats.totalLearners}</p>
                <p className="text-sm text-success dark:text-darkMode-success mt-1">+12% from last month</p>
              </div>
              <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg">
                <Users className="w-6 h-6 text-primary dark:text-primary-light" />
              </div>
            </div>
          </div>

          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm p-6 border border-neutral-gray dark:border-darkMode-border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Active Courses</p>
                <p className="text-3xl font-bold text-neutral-dark dark:text-darkMode-text mt-2">{stats.totalCourses}</p>
                <p className="text-sm text-success dark:text-darkMode-success mt-1">+2 new this month</p>
              </div>
              <div className="bg-success/10 dark:bg-success/20 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-success dark:text-darkMode-success" />
              </div>
            </div>
          </div>

          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm p-6 border border-neutral-gray dark:border-darkMode-border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Avg. Rating</p>
                <p className="text-3xl font-bold text-neutral-dark dark:text-darkMode-text mt-2">{stats.averageRating.toFixed(1)}</p>
                <p className="text-sm text-success dark:text-darkMode-success mt-1">+0.2 from last month</p>
              </div>
              <div className="bg-accent-gold/10 dark:bg-darkMode-accent/20 p-3 rounded-lg">
                <Star className="w-6 h-6 text-accent-gold dark:text-darkMode-accent" />
              </div>
            </div>
          </div>

          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm p-6 border border-neutral-gray dark:border-darkMode-border hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Completion Rate</p>
                <p className="text-3xl font-bold text-neutral-dark dark:text-darkMode-text mt-2">{stats.completionRate.toFixed(0)}%</p>
                <p className="text-sm text-success dark:text-darkMode-success mt-1">+5% from last month</p>
              </div>
              <div className="bg-accent-teal/10 dark:bg-accent-teal/20 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-accent-teal dark:text-accent-teal" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border">
              <div className="p-6 border-b border-neutral-gray dark:border-darkMode-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text">Recent Activity</h2>
                  <button className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary text-sm font-medium">
                    View All
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'enrollment' ? 'bg-primary/10 dark:bg-primary/20' :
                        activity.type === 'completion' ? 'bg-success/10 dark:bg-success/20' :
                        activity.type === 'message' ? 'bg-accent-gold/10 dark:bg-darkMode-accent/20' :
                        'bg-accent-teal/10 dark:bg-accent-teal/20'
                      }`}>
                        {activity.type === 'enrollment' && <Users className="w-4 h-4 text-primary dark:text-primary-light" />}
                        {activity.type === 'completion' && <Award className="w-4 h-4 text-success dark:text-darkMode-success" />}
                        {activity.type === 'message' && <MessageSquare className="w-4 h-4 text-accent-gold dark:text-darkMode-accent" />}
                        {activity.type === 'achievement' && <Star className="w-4 h-4 text-accent-teal dark:text-accent-teal" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-neutral-dark dark:text-darkMode-text">{activity.message}</p>
                        <p className="text-xs text-forest-sage dark:text-darkMode-textMuted mt-1">{activity.time}</p>
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
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-6">
              <h3 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg border border-neutral-gray dark:border-darkMode-border hover:bg-neutral-light dark:hover:bg-darkMode-navbar transition-colors flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-primary dark:text-primary-light" />
                  <span className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">Create New Course</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-neutral-gray dark:border-darkMode-border hover:bg-neutral-light dark:hover:bg-darkMode-navbar transition-colors flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-secondary dark:text-darkMode-success" />
                  <span className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">View Analytics</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-neutral-gray dark:border-darkMode-border hover:bg-neutral-light dark:hover:bg-darkMode-navbar transition-colors flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-primary dark:text-primary-light" />
                  <span className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">Message Learners</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-neutral-gray dark:border-darkMode-border hover:bg-neutral-light dark:hover:bg-darkMode-navbar transition-colors flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-accent-teal dark:text-accent-teal" />
                  <span className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">Schedule Session</span>
                </button>
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-6">
              <h3 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-4">Upcoming Tasks</h3>
              <div className="space-y-3">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border border-neutral-gray dark:border-darkMode-border dark:bg-darkMode-navbar/50">
                    <div className={`w-3 h-3 rounded-full ${
                      task.priority === 'high' ? 'bg-error' :
                      task.priority === 'medium' ? 'bg-accent-gold dark:bg-darkMode-accent' :
                      'bg-success dark:bg-darkMode-success'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">{task.task}</p>
                      <p className="text-xs text-forest-sage dark:text-darkMode-textMuted">Due: {task.due}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Course Performance Overview */}
        <div className="mt-8">
          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border">
            <div className="p-6 border-b border-neutral-gray dark:border-darkMode-border">
              <h2 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text">Course Performance</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="border border-neutral-gray dark:border-darkMode-border rounded-lg p-4 hover:shadow-md transition-shadow dark:bg-darkMode-navbar/50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-neutral-dark dark:text-darkMode-text truncate">{course.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        course.isPublished ? 'bg-success/10 dark:bg-darkMode-success/20 text-success dark:text-darkMode-success' : 'bg-neutral-gray dark:bg-darkMode-border text-forest-sage dark:text-darkMode-textSecondary'
                      }`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-forest-sage dark:text-darkMode-textSecondary">Enrolled:</span>
                        <span className="font-medium text-neutral-dark dark:text-darkMode-text">{course.enrolledStudents}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-forest-sage dark:text-darkMode-textSecondary">Completion:</span>
                        <span className="font-medium text-neutral-dark dark:text-darkMode-text">{course.completionRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-forest-sage dark:text-darkMode-textSecondary">Rating:</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-accent-gold dark:text-darkMode-accent fill-current" />
                          <span className="font-medium text-neutral-dark dark:text-darkMode-text">{course.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-neutral-gray dark:border-darkMode-border">
                      <button className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary text-sm font-medium">
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
