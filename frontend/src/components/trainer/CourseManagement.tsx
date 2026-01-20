import React, { useState } from 'react';
import { useTrainer } from '../../contexts/TrainerContext';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  Clock,
  Star,
  BookOpen,
  Play,
  Pause,
  Settings,
  BarChart3,
  Upload,
  Save,
  X
} from 'lucide-react';

const CourseManagement: React.FC = () => {
  const { courses, addCourse, updateCourse, deleteCourse, addModule } = useTrainer();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [showModuleModal, setShowModuleModal] = useState(false);

  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    duration: 0,
    modules: [],
    isPublished: false
  });

  const [newModule, setNewModule] = useState({
    title: '',
    description: '',
    type: 'video' as 'video' | 'text' | 'quiz' | 'assignment' | 'interactive',
    duration: 0,
    content: '',
    order: 1,
    isRequired: true
  });

  const handleCreateCourse = () => {
    if (newCourse.title && newCourse.description) {
      addCourse(newCourse);
      setNewCourse({
        title: '',
        description: '',
        category: '',
        difficulty: 'Beginner',
        duration: 0,
        modules: [],
        isPublished: false
      });
      setShowCreateModal(false);
    }
  };

  const handleAddModule = () => {
    if (selectedCourse && newModule.title) {
      addModule(selectedCourse, newModule);
      setNewModule({
        title: '',
        description: '',
        type: 'video',
        duration: 0,
        content: '',
        order: 1,
        isRequired: true
      });
      setShowModuleModal(false);
    }
  };

  const handleTogglePublish = (courseId: string, currentStatus: boolean) => {
    updateCourse(courseId, { isPublished: !currentStatus });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-success-light/20 text-success dark:bg-success/20 dark:text-success-light';
      case 'Intermediate': return 'bg-warning-light/20 text-warning-dark dark:bg-warning/20 dark:text-warning-light';
      case 'Advanced': return 'bg-error-light/20 text-error-dark dark:bg-error/20 dark:text-error-light';
      default: return 'bg-neutral-gray text-neutral-dark dark:bg-darkMode-surface dark:text-darkMode-textSecondary';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg font-['Inter']">
      {/* Header */}
      <div className="bg-neutral-white dark:bg-darkMode-surface shadow-sm border-b border-border-light dark:border-darkMode-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text">Course Management</h1>
              <p className="text-forest-sage dark:text-darkMode-textSecondary mt-1">
                Create, edit, and manage your courses and modules
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-primary text-neutral-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Course
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm p-6 border border-neutral-gray dark:border-darkMode-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Total Courses</p>
                <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">{courses.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-primary dark:text-darkMode-progress" />
            </div>
          </div>

          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm p-6 border border-neutral-gray dark:border-darkMode-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Published</p>
                <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">
                  {courses.filter(c => c.isPublished).length}
                </p>
              </div>
              <Play className="w-8 h-8 text-success dark:text-darkMode-success" />
            </div>
          </div>

          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm p-6 border border-neutral-gray dark:border-darkMode-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Total Enrollments</p>
                <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">
                  {courses.reduce((sum, c) => sum + c.enrolledStudents, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-secondary dark:text-darkMode-progress" />
            </div>
          </div>

          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm p-6 border border-neutral-gray dark:border-darkMode-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Avg. Rating</p>
                <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">
                  {courses.length > 0
                    ? (courses.reduce((sum, c) => sum + c.rating, 0) / courses.length).toFixed(1)
                    : '0.0'}
                </p>
              </div>
              <Star className="w-8 h-8 text-accent-gold dark:text-darkMode-accent" />
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border overflow-hidden">
              {/* Course Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-2">{course.title}</h3>
                    <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary line-clamp-2">{course.description}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleTogglePublish(course.id, course.isPublished)}
                      className={`p-2 rounded-lg ${
                        course.isPublished
                          ? 'bg-success-light/20 text-success dark:bg-darkMode-success/20 dark:text-darkMode-success hover:bg-success-light/30'
                          : 'bg-neutral-gray text-forest-sage dark:bg-darkMode-surfaceHover dark:text-darkMode-textSecondary hover:bg-neutral-light'
                      }`}
                      title={course.isPublished ? 'Unpublish' : 'Publish'}
                    >
                      {course.isPublished ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button className="p-2 rounded-lg bg-neutral-gray dark:bg-darkMode-surfaceHover text-forest-sage dark:text-darkMode-textSecondary hover:bg-neutral-light dark:hover:bg-darkMode-border">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Course Meta */}
                <div className="flex items-center gap-4 mb-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(course.difficulty)}`}>
                    {course.difficulty}
                  </span>
                  <span className="text-sm text-forest-sage dark:text-darkMode-textMuted">{course.category}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    course.isPublished ? 'bg-success-light/20 text-success dark:bg-darkMode-success/20 dark:text-darkMode-success' : 'bg-neutral-gray text-neutral-dark dark:bg-darkMode-surfaceHover dark:text-darkMode-textSecondary'
                  }`}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-neutral-light dark:bg-darkMode-surfaceHover rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className="w-4 h-4 text-forest-sage dark:text-darkMode-textSecondary" />
                      <span className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">{course.enrolledStudents}</span>
                    </div>
                    <p className="text-xs text-forest-sage dark:text-darkMode-textMuted">Enrolled</p>
                  </div>
                  <div className="text-center p-3 bg-neutral-light dark:bg-darkMode-surfaceHover rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clock className="w-4 h-4 text-forest-sage dark:text-darkMode-textSecondary" />
                      <span className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">{course.duration}h</span>
                    </div>
                    <p className="text-xs text-forest-sage dark:text-darkMode-textMuted">Duration</p>
                  </div>
                </div>

                {/* Rating and Completion */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-accent-gold fill-current" />
                    <span className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">{course.rating}</span>
                    <span className="text-sm text-forest-sage dark:text-darkMode-textMuted">rating</span>
                  </div>
                  <div className="text-sm text-forest-sage dark:text-darkMode-textSecondary">
                    {course.completionRate}% completion
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-neutral-gray dark:bg-darkMode-surfaceHover rounded-full h-2 mb-4">
                  <div
                    className="bg-gradient-to-r from-primary-dark to-primary dark:from-darkMode-progress dark:to-darkMode-success h-2 rounded-full"
                    style={{ width: `${course.completionRate}%` }}
                  />
                </div>

                {/* Modules Info */}
                <div className="flex items-center justify-between text-sm text-forest-sage dark:text-darkMode-textMuted mb-4">
                  <span>{course.modules.length} modules</span>
                  <span>Updated {new Date(course.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Course Actions */}
              <div className="px-6 py-4 bg-neutral-light dark:bg-darkMode-surfaceHover border-t border-neutral-gray dark:border-darkMode-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button className="text-primary dark:text-darkMode-accent hover:text-primary-dark dark:hover:text-darkMode-accentHover text-sm font-medium flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button className="text-info dark:text-darkMode-link hover:text-info-dark text-sm font-medium flex items-center gap-1">
                      <BarChart3 className="w-4 h-4" />
                      Analytics
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedCourse(course.id);
                        setShowModuleModal(true);
                      }}
                      className="text-success dark:text-darkMode-success hover:text-success-dark text-sm font-medium flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Module
                    </button>
                    <button className="text-forest-sage dark:text-darkMode-textSecondary hover:text-neutral-dark dark:hover:text-darkMode-text text-sm font-medium flex items-center gap-1">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCourse(course.id)}
                      className="text-error dark:text-error-light hover:text-error-dark text-sm font-medium flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Course Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-neutral-gray dark:border-darkMode-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-neutral-dark dark:text-darkMode-text">Create New Course</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-forest-sage dark:text-darkMode-textMuted hover:text-neutral-dark dark:hover:text-darkMode-text"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">Course Title</label>
                  <input
                    type="text"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                    className="w-full px-3 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent bg-neutral-white dark:bg-darkMode-bg text-neutral-dark dark:text-darkMode-text"
                    placeholder="Enter course title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">Description</label>
                  <textarea
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent bg-neutral-white dark:bg-darkMode-bg text-neutral-dark dark:text-darkMode-text"
                    placeholder="Enter course description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">Category</label>
                    <input
                      type="text"
                      value={newCourse.category}
                      onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                      className="w-full px-3 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent bg-neutral-white dark:bg-darkMode-bg text-neutral-dark dark:text-darkMode-text"
                      placeholder="e.g., Web Development"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">Difficulty</label>
                    <select
                      value={newCourse.difficulty}
                      onChange={(e) => setNewCourse({...newCourse, difficulty: e.target.value as any})}
                      className="w-full px-3 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent bg-neutral-white dark:bg-darkMode-bg text-neutral-dark dark:text-darkMode-text"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">Duration (hours)</label>
                  <input
                    type="number"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({...newCourse, duration: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent bg-neutral-white dark:bg-darkMode-bg text-neutral-dark dark:text-darkMode-text"
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={newCourse.isPublished}
                    onChange={(e) => setNewCourse({...newCourse, isPublished: e.target.checked})}
                    className="rounded border-neutral-gray dark:border-darkMode-border text-primary dark:text-darkMode-toggle focus:ring-primary dark:focus:ring-darkMode-focus"
                  />
                  <label htmlFor="isPublished" className="ml-2 text-sm text-neutral-dark dark:text-darkMode-textSecondary">
                    Publish immediately
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-neutral-gray dark:border-darkMode-border flex justify-end gap-3">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-neutral-dark dark:text-darkMode-textSecondary border border-neutral-gray dark:border-darkMode-border rounded-lg hover:bg-neutral-light dark:hover:bg-darkMode-surfaceHover"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCourse}
                  className="px-4 py-2 bg-primary dark:bg-darkMode-progress text-neutral-white rounded-lg hover:bg-primary-dark dark:hover:bg-darkMode-success flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Create Course
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Module Modal */}
        {showModuleModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-neutral-gray dark:border-darkMode-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-neutral-dark dark:text-darkMode-text">Add New Module</h2>
                  <button
                    onClick={() => setShowModuleModal(false)}
                    className="text-forest-sage dark:text-darkMode-textMuted hover:text-neutral-dark dark:hover:text-darkMode-text"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">Module Title</label>
                  <input
                    type="text"
                    value={newModule.title}
                    onChange={(e) => setNewModule({...newModule, title: e.target.value})}
                    className="w-full px-3 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent bg-neutral-white dark:bg-darkMode-bg text-neutral-dark dark:text-darkMode-text"
                    placeholder="Enter module title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">Description</label>
                  <textarea
                    value={newModule.description}
                    onChange={(e) => setNewModule({...newModule, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent bg-neutral-white dark:bg-darkMode-bg text-neutral-dark dark:text-darkMode-text"
                    placeholder="Enter module description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">Type</label>
                    <select
                      value={newModule.type}
                      onChange={(e) => setNewModule({...newModule, type: e.target.value as any})}
                      className="w-full px-3 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent bg-neutral-white dark:bg-darkMode-bg text-neutral-dark dark:text-darkMode-text"
                    >
                      <option value="video">Video</option>
                      <option value="text">Text</option>
                      <option value="quiz">Quiz</option>
                      <option value="assignment">Assignment</option>
                      <option value="interactive">Interactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      value={newModule.duration}
                      onChange={(e) => setNewModule({...newModule, duration: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent bg-neutral-white dark:bg-darkMode-bg text-neutral-dark dark:text-darkMode-text"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">Content</label>
                  <textarea
                    value={newModule.content}
                    onChange={(e) => setNewModule({...newModule, content: e.target.value})}
                    rows={6}
                    className="w-full px-3 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent bg-neutral-white dark:bg-darkMode-bg text-neutral-dark dark:text-darkMode-text"
                    placeholder="Enter module content or upload files"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isRequired"
                    checked={newModule.isRequired}
                    onChange={(e) => setNewModule({...newModule, isRequired: e.target.checked})}
                    className="rounded border-neutral-gray dark:border-darkMode-border text-primary dark:text-darkMode-toggle focus:ring-primary dark:focus:ring-darkMode-focus"
                  />
                  <label htmlFor="isRequired" className="ml-2 text-sm text-neutral-dark dark:text-darkMode-textSecondary">
                    Required module
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-neutral-gray dark:border-darkMode-border flex justify-end gap-3">
                <button
                  onClick={() => setShowModuleModal(false)}
                  className="px-4 py-2 text-neutral-dark dark:text-darkMode-textSecondary border border-neutral-gray dark:border-darkMode-border rounded-lg hover:bg-neutral-light dark:hover:bg-darkMode-surfaceHover"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddModule}
                  className="px-4 py-2 bg-primary dark:bg-darkMode-progress text-neutral-white rounded-lg hover:bg-primary-dark dark:hover:bg-darkMode-success flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Module
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseManagement;
