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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Course Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The course you're looking for doesn't exist.</p>
          <Link
            to="/trainer/courses"
            className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors"
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
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Enrolled</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{course.enrolledStudents}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{course.completionRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rating</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{course.rating}</p>
            </div>
            <Star className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Duration</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{course.duration}h</p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Course Description */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Description</h3>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{course.description}</p>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Course Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Category:</span>
                <span className="font-medium dark:text-white">{course.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Difficulty:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  course.difficulty === 'Beginner' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  course.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {course.difficulty}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Modules:</span>
                <span className="font-medium dark:text-white">{course.modules.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  course.isPublished 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                }`}>
                  {course.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Timeline</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Created:</span>
                <span className="font-medium dark:text-white">{new Date(course.createdDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                <span className="font-medium dark:text-white">{new Date(course.lastUpdated).toLocaleDateString()}</span>
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
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Course Modules</h3>
        <Link
          to={`/trainer/courses/${courseId}/modules/new/edit`}
          className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Module
        </Link>
      </div>

      {course.modules.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 border border-gray-100 dark:border-gray-700 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Modules Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Start building your course by adding modules</p>
          <Link
            to={`/trainer/courses/${courseId}/modules/new/edit`}
            className="px-6 py-3 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create First Module
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {course.modules.map((module, index) => (
            <div key={module.id} className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary-light text-white rounded-full text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">{module.title}</h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{module.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {module.duration} min
                      </span>
                      <span className="capitalize">{module.type}</span>
                      {module.isRequired && (
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-full text-xs">
                          Required
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/trainer/courses/${courseId}/modules/${module.id}/edit`}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-['Inter']">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/trainer/courses')}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{course.title}</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {course.category} • {course.difficulty} Level
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleTogglePublish}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  course.isPublished
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                    : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                }`}
              >
                {course.isPublished ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {course.isPublished ? 'Unpublish' : 'Publish'}
              </button>
              <Link
                to={`/trainer/courses/${courseId}/preview`}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Link>
              <Link
                to={`/trainer/courses/${courseId}/edit`}
                className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors flex items-center gap-2"
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
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-primary-light text-primary-light'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
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
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Learner Management</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">View and manage learners enrolled in this course</p>
            <Link
              to={`/trainer/courses/${courseId}/learners`}
              className="px-6 py-3 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors inline-flex items-center gap-2"
            >
              <Users className="w-5 h-5" />
              View All Learners
            </Link>
          </div>
        )}
        {activeTab === 'analytics' && (
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Course Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Detailed performance metrics and insights</p>
            <Link
              to={`/trainer/analytics/courses`}
              className="px-6 py-3 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors inline-flex items-center gap-2"
            >
              <BarChart3 className="w-5 h-5" />
              View Analytics
            </Link>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Course Settings</h3>
            <div className="space-y-6">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={course.isPublished}
                    onChange={handleTogglePublish}
                    className="rounded border-gray-300 text-primary-light focus:ring-primary-light"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Course is published and visible to learners
                  </span>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-light focus:ring-primary-light"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Allow learner discussions
                  </span>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-light focus:ring-primary-light"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
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