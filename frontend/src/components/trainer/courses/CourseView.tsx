import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTrainer } from '../../../contexts/TrainerContext';
import {
  ArrowLeft,
  Edit,
  Users,
  Clock,
  Star,
  Play,
  Pause,
  Eye,
  BarChart3,
  MessageSquare,
  Settings,
  Plus,
  BookOpen,
  CheckCircle,
  Circle,
  Calendar,
  Award,
  TrendingUp
} from 'lucide-react';

const CourseView: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses, getCourseAnalytics, updateCourse } = useTrainer();

  const course = courses.find(c => c.id === courseId);
  const analytics = courseId ? getCourseAnalytics(courseId) : null;

  const [activeTab, setActiveTab] = useState('overview');

  if (!course) {
    return (
      <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mb-2">Course Not Found</h2>
          <p className="text-forest-sage dark:text-darkMode-textSecondary mb-4">The course you're looking for doesn't exist.</p>
          <Link
            to="/trainer/courses"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const handleTogglePublish = () => {
    updateCourse(course.id, { isPublished: !course.isPublished });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'modules', label: 'Modules', icon: Play },
    { id: 'learners', label: 'Learners', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg p-6 border border-neutral-gray dark:border-darkMode-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Enrolled</p>
              <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">{course.enrolledStudents}</p>
            </div>
            <Users className="w-8 h-8 text-primary dark:text-darkMode-accent" />
          </div>
        </div>

        <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg p-6 border border-neutral-gray dark:border-darkMode-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Completion</p>
              <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">{course.completionRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-success dark:text-darkMode-success" />
          </div>
        </div>

        <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg p-6 border border-neutral-gray dark:border-darkMode-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Rating</p>
              <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">{course.rating}</p>
            </div>
            <Star className="w-8 h-8 text-accent-gold dark:text-darkMode-accent" />
          </div>
        </div>

        <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg p-6 border border-neutral-gray dark:border-darkMode-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Duration</p>
              <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">{course.duration}h</p>
            </div>
            <Clock className="w-8 h-8 text-secondary dark:text-darkMode-accent" />
          </div>
        </div>
      </div>

      {/* Course Description */}
      <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg p-6 border border-neutral-gray dark:border-darkMode-border">
        <h3 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-4">Course Description</h3>
        <p className="text-forest-sage dark:text-darkMode-textSecondary leading-relaxed">{course.description}</p>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-neutral-dark dark:text-darkMode-text mb-2">Course Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-forest-sage dark:text-darkMode-textSecondary">Category:</span>
                <span className="font-medium text-neutral-dark dark:text-darkMode-text">{course.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-forest-sage dark:text-darkMode-textSecondary">Difficulty:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  course.difficulty === 'Beginner' ? 'bg-success/10 text-success dark:bg-darkMode-success/20 dark:text-darkMode-success' :
                  course.difficulty === 'Intermediate' ? 'bg-accent-gold/20 text-accent-gold dark:bg-darkMode-accent/20 dark:text-darkMode-accent' :
                  'bg-error/10 text-error dark:bg-error/20 dark:text-error'
                }`}>
                  {course.difficulty}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-forest-sage dark:text-darkMode-textSecondary">Modules:</span>
                <span className="font-medium text-neutral-dark dark:text-darkMode-text">{course.modules.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-forest-sage dark:text-darkMode-textSecondary">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  course.isPublished
                    ? 'bg-success/10 text-success dark:bg-darkMode-success/20 dark:text-darkMode-success'
                    : 'bg-neutral-gray text-forest-sage dark:bg-darkMode-navbar dark:text-darkMode-textSecondary'
                }`}>
                  {course.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-neutral-dark dark:text-darkMode-text mb-2">Timeline</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-forest-sage dark:text-darkMode-textSecondary">Created:</span>
                <span className="font-medium text-neutral-dark dark:text-darkMode-text">{new Date(course.createdDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-forest-sage dark:text-darkMode-textSecondary">Last Updated:</span>
                <span className="font-medium text-neutral-dark dark:text-darkMode-text">{new Date(course.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderModules = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text">Course Modules</h3>
        <Link
          to={`/trainer/courses/${courseId}/modules/new/edit`}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Module
        </Link>
      </div>

      {course.modules.length === 0 ? (
        <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg p-12 border border-neutral-gray dark:border-darkMode-border text-center">
          <BookOpen className="w-16 h-16 text-forest-sage dark:text-darkMode-textMuted mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-dark dark:text-darkMode-text mb-2">No Modules Yet</h3>
          <p className="text-forest-sage dark:text-darkMode-textSecondary mb-6">Start building your course by adding modules</p>
          <Link
            to={`/trainer/courses/${courseId}/modules/new/edit`}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create First Module
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {course.modules.map((module, index) => (
            <div key={module.id} className="bg-neutral-white dark:bg-darkMode-surface rounded-lg p-6 border border-neutral-gray dark:border-darkMode-border">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-neutral-dark dark:text-darkMode-text mb-2">{module.title}</h4>
                    <p className="text-forest-sage dark:text-darkMode-textSecondary text-sm mb-3">{module.description}</p>
                    <div className="flex items-center gap-4 text-sm text-forest-sage dark:text-darkMode-textSecondary">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {module.duration} min
                      </span>
                      <span className="capitalize">{module.type}</span>
                      {module.isRequired && (
                        <span className="px-2 py-1 bg-error/10 dark:bg-error/20 text-error rounded-full text-xs">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/trainer/courses/${courseId}/modules/${module.id}/edit`}
                    className="p-2 text-forest-sage hover:text-neutral-dark dark:text-darkMode-textSecondary dark:hover:text-darkMode-text rounded-lg hover:bg-neutral-gray dark:hover:bg-darkMode-navbar"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button className="p-2 text-forest-sage hover:text-neutral-dark dark:text-darkMode-textSecondary dark:hover:text-darkMode-text rounded-lg hover:bg-neutral-gray dark:hover:bg-darkMode-navbar">
                    <Settings className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg font-['Inter']">
      {/* Header */}
      <div className="bg-neutral-white dark:bg-darkMode-surface shadow-sm border-b dark:border-darkMode-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/trainer/courses')}
                className="p-2 text-forest-sage hover:text-neutral-dark dark:text-darkMode-textSecondary dark:hover:text-darkMode-text rounded-lg hover:bg-neutral-gray dark:hover:bg-darkMode-navbar"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text">{course.title}</h1>
                <p className="text-forest-sage dark:text-darkMode-textSecondary mt-1">
                  {course.category} • {course.difficulty} Level
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleTogglePublish}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  course.isPublished
                    ? 'bg-accent-gold/20 dark:bg-darkMode-accent/20 text-accent-gold dark:text-darkMode-accent hover:bg-accent-gold/30 dark:hover:bg-darkMode-accent/30'
                    : 'bg-success/10 dark:bg-darkMode-success/20 text-success dark:text-darkMode-success hover:bg-success/20 dark:hover:bg-darkMode-success/30'
                }`}
              >
                {course.isPublished ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {course.isPublished ? 'Unpublish' : 'Publish'}
              </button>
              <Link
                to={`/trainer/courses/${courseId}/preview`}
                className="px-4 py-2 text-neutral-dark dark:text-darkMode-textSecondary border border-neutral-gray dark:border-darkMode-border rounded-lg hover:bg-neutral-light dark:hover:bg-darkMode-navbar flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Link>
              <Link
                to={`/trainer/courses/${courseId}/edit`}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Course
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-neutral-gray dark:border-darkMode-border mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary dark:border-darkMode-accent dark:text-darkMode-accent'
                      : 'border-transparent text-forest-sage dark:text-darkMode-textSecondary hover:text-neutral-dark dark:hover:text-darkMode-text hover:border-neutral-gray dark:hover:border-darkMode-border'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'modules' && renderModules()}
        {activeTab === 'learners' && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-forest-sage dark:text-darkMode-textMuted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-dark dark:text-darkMode-text mb-2">Learner Management</h3>
            <p className="text-forest-sage dark:text-darkMode-textSecondary mb-6">View and manage learners enrolled in this course</p>
            <Link
              to={`/trainer/courses/${courseId}/learners`}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
            >
              <Users className="w-5 h-5" />
              View All Learners
            </Link>
          </div>
        )}
        {activeTab === 'analytics' && (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-forest-sage dark:text-darkMode-textMuted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-dark dark:text-darkMode-text mb-2">Course Analytics</h3>
            <p className="text-forest-sage dark:text-darkMode-textSecondary mb-6">Detailed performance metrics and insights</p>
            <Link
              to={`/trainer/analytics/courses`}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center gap-2"
            >
              <BarChart3 className="w-5 h-5" />
              View Analytics
            </Link>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg p-6 border border-neutral-gray dark:border-darkMode-border">
            <h3 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-6">Course Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={course.isPublished}
                    onChange={handleTogglePublish}
                    className="rounded border-neutral-gray text-primary focus:ring-primary dark:focus:ring-darkMode-focus"
                  />
                  <span className="ml-2 text-sm text-neutral-dark dark:text-darkMode-textSecondary">
                    Course is published and visible to learners
                  </span>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-neutral-gray text-primary focus:ring-primary dark:focus:ring-darkMode-focus"
                  />
                  <span className="ml-2 text-sm text-neutral-dark dark:text-darkMode-textSecondary">
                    Allow learner discussions
                  </span>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-neutral-gray text-primary focus:ring-primary dark:focus:ring-darkMode-focus"
                  />
                  <span className="ml-2 text-sm text-neutral-dark dark:text-darkMode-textSecondary">
                    Send notifications for new enrollments
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseView;
