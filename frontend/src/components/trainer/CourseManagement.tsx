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
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
              <p className="text-gray-600 mt-1">
                Create, edit, and manage your courses and modules
              </p>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
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
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{courses.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {courses.filter(c => c.isPublished).length}
                </p>
              </div>
              <Play className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {courses.reduce((sum, c) => sum + c.enrolledStudents, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Rating</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {courses.length > 0 
                    ? (courses.reduce((sum, c) => sum + c.rating, 0) / courses.length).toFixed(1)
                    : '0.0'}
                </p>
              </div>
              <Star className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Course Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button 
                      onClick={() => handleTogglePublish(course.id, course.isPublished)}
                      className={`p-2 rounded-lg ${
                        course.isPublished 
                          ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={course.isPublished ? 'Unpublish' : 'Publish'}
                    >
                      {course.isPublished ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Course Meta */}
                <div className="flex items-center gap-4 mb-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(course.difficulty)}`}>
                    {course.difficulty}
                  </span>
                  <span className="text-sm text-gray-500">{course.category}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    course.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>

                {/* Course Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Users className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">{course.enrolledStudents}</span>
                    </div>
                    <p className="text-xs text-gray-600">Enrolled</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Clock className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">{course.duration}h</span>
                    </div>
                    <p className="text-xs text-gray-600">Duration</p>
                  </div>
                </div>

                {/* Rating and Completion */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{course.rating}</span>
                    <span className="text-sm text-gray-500">rating</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {course.completionRate}% completion
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${course.completionRate}%` }}
                  />
                </div>

                {/* Modules Info */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>{course.modules.length} modules</span>
                  <span>Updated {new Date(course.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Course Actions */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
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
                      className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Module
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 text-sm font-medium flex items-center gap-1">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button 
                      onClick={() => deleteCourse(course.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
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
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Create New Course</h2>
                  <button 
                    onClick={() => setShowCreateModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                  <input
                    type="text"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter course title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter course description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <input
                      type="text"
                      value={newCourse.category}
                      onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g., Web Development"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                    <select
                      value={newCourse.difficulty}
                      onChange={(e) => setNewCourse({...newCourse, difficulty: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (hours)</label>
                  <input
                    type="number"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({...newCourse, duration: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={newCourse.isPublished}
                    onChange={(e) => setNewCourse({...newCourse, isPublished: e.target.checked})}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="isPublished" className="ml-2 text-sm text-gray-700">
                    Publish immediately
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateCourse}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
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
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Add New Module</h2>
                  <button 
                    onClick={() => setShowModuleModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Module Title</label>
                  <input
                    type="text"
                    value={newModule.title}
                    onChange={(e) => setNewModule({...newModule, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter module title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newModule.description}
                    onChange={(e) => setNewModule({...newModule, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter module description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                    <select
                      value={newModule.type}
                      onChange={(e) => setNewModule({...newModule, type: e.target.value as any})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="video">Video</option>
                      <option value="text">Text</option>
                      <option value="quiz">Quiz</option>
                      <option value="assignment">Assignment</option>
                      <option value="interactive">Interactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      value={newModule.duration}
                      onChange={(e) => setNewModule({...newModule, duration: parseInt(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={newModule.content}
                    onChange={(e) => setNewModule({...newModule, content: e.target.value})}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter module content or upload files"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isRequired"
                    checked={newModule.isRequired}
                    onChange={(e) => setNewModule({...newModule, isRequired: e.target.checked})}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="isRequired" className="ml-2 text-sm text-gray-700">
                    Required module
                  </label>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  onClick={() => setShowModuleModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddModule}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
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