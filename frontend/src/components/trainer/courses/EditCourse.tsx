import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrainer } from '../../../contexts/TrainerContext';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload, 
  Plus, 
  X, 
  Trash2,
  Settings,
  BookOpen
} from 'lucide-react';

const EditCourse: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses, updateCourse } = useTrainer();
  
  const course = courses.find(c => c.id === courseId);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    duration: 0,
    isPublished: false,
    thumbnail: '',
    learningObjectives: [''],
    prerequisites: '',
    tags: ''
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        description: course.description,
        category: course.category,
        difficulty: course.difficulty,
        duration: course.duration,
        isPublished: course.isPublished,
        thumbnail: course.thumbnail || '',
        learningObjectives: [''], // This would come from course data in real implementation
        prerequisites: '',
        tags: ''
      });
    }
  }, [course]);

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Course Not Found</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">The course you're trying to edit doesn't exist.</p>
          <button
            onClick={() => navigate('/trainer/courses')}
            className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    updateCourse(courseId!, {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      difficulty: formData.difficulty,
      duration: formData.duration,
      isPublished: formData.isPublished
    });
    setHasChanges(false);
    navigate(`/trainer/courses/${courseId}`);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const addLearningObjective = () => {
    setFormData(prev => ({
      ...prev,
      learningObjectives: [...prev.learningObjectives, '']
    }));
    setHasChanges(true);
  };

  const updateLearningObjective = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.map((obj, i) => i === index ? value : obj)
    }));
    setHasChanges(true);
  };

  const removeLearningObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter((_, i) => i !== index)
    }));
    setHasChanges(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-['Inter']">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/trainer/courses/${courseId}`)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Course</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {course.title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/trainer/courses/${courseId}/preview`)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Basic Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter course title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Describe what learners will gain from this course"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select a category</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile Development">Mobile Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Design">Design</option>
                      <option value="Business">Business</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Difficulty Level *
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => handleInputChange('difficulty', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration (hours) *
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Course Content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Course Content</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Learning Objectives
                    </label>
                    <button
                      onClick={addLearningObjective}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-primary-light text-white rounded-lg hover:bg-primary transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Objective
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.learningObjectives.map((objective, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="text"
                          value={objective}
                          onChange={(e) => updateLearningObjective(index, e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="What will learners achieve?"
                        />
                        {formData.learningObjectives.length > 1 && (
                          <button
                            onClick={() => removeLearningObjective(index)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Prerequisites
                  </label>
                  <textarea
                    value={formData.prerequisites}
                    onChange={(e) => handleInputChange('prerequisites', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="What should learners know before taking this course?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="react, javascript, frontend, web development"
                  />
                </div>
              </div>
            </div>

            {/* Course Thumbnail */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Course Thumbnail</h2>
              
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">Upload course thumbnail</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">PNG, JPG up to 2MB</p>
                <button className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors">
                  Choose File
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing Status */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Publishing</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 dark:text-gray-300">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    formData.isPublished 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                  }`}>
                    {formData.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                    className="rounded border-gray-300 text-primary-light focus:ring-primary-light"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Publish course
                  </span>
                </label>
                
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Published courses are visible to learners and can be enrolled in.
                </p>
              </div>
            </div>

            {/* Course Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Course Stats</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Enrolled:</span>
                  <span className="font-medium dark:text-white">{course.enrolledStudents}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Completion Rate:</span>
                  <span className="font-medium dark:text-white">{course.completionRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Rating:</span>
                  <span className="font-medium dark:text-white">{course.rating}/5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Modules:</span>
                  <span className="font-medium dark:text-white">{course.modules.length}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/trainer/courses/${courseId}/preview`)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                >
                  <Eye className="w-5 h-5 text-primary-light" />
                  <span className="text-sm font-medium dark:text-gray-200">Preview Course</span>
                </button>
                
                <button
                  onClick={() => navigate(`/trainer/courses/${courseId}/learners`)}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-3"
                >
                  <BookOpen className="w-5 h-5 text-secondary" />
                  <span className="text-sm font-medium dark:text-gray-200">Manage Modules</span>
                </button>
                
                <button className="w-full text-left p-3 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3 text-red-600 dark:text-red-400">
                  <Trash2 className="w-5 h-5" />
                  <span className="text-sm font-medium">Delete Course</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;