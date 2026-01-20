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
      <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mb-2">Course Not Found</h2>
          <p className="text-forest-sage dark:text-darkMode-textSecondary mb-4">The course you're trying to edit doesn't exist.</p>
          <button
            onClick={() => navigate('/trainer/courses')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
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
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg font-['Inter']">
      {/* Header */}
      <div className="bg-neutral-white dark:bg-darkMode-surface shadow-sm border-b dark:border-darkMode-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/trainer/courses/${courseId}`)}
                className="p-2 text-forest-sage hover:text-neutral-dark dark:text-darkMode-textSecondary dark:hover:text-darkMode-text rounded-lg hover:bg-neutral-gray dark:hover:bg-darkMode-navbar"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text">Edit Course</h1>
                <p className="text-forest-sage dark:text-darkMode-textSecondary mt-1">
                  {course.title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/trainer/courses/${courseId}/preview`)}
                className="px-4 py-2 text-neutral-dark dark:text-darkMode-textSecondary border border-neutral-gray dark:border-darkMode-border rounded-lg hover:bg-neutral-light dark:hover:bg-darkMode-navbar flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button
                onClick={handleSave}
                disabled={!hasChanges}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-6">
              <h2 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-6">Basic Information</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                    placeholder="Enter course title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                    placeholder="Describe what learners will gain from this course"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
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
                    <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">
                      Difficulty Level *
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => handleInputChange('difficulty', e.target.value)}
                      className="w-full px-4 py-3 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">
                    Duration (hours) *
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-3 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Course Content */}
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-6">
              <h2 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-6">Course Content</h2>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary">
                      Learning Objectives
                    </label>
                    <button
                      onClick={addLearningObjective}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
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
                          className="flex-1 px-4 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                          placeholder="What will learners achieve?"
                        />
                        {formData.learningObjectives.length > 1 && (
                          <button
                            onClick={() => removeLearningObjective(index)}
                            className="p-2 text-error hover:bg-error/10 dark:hover:bg-error/20 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">
                    Prerequisites
                  </label>
                  <textarea
                    value={formData.prerequisites}
                    onChange={(e) => handleInputChange('prerequisites', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                    placeholder="What should learners know before taking this course?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                    placeholder="react, javascript, frontend, web development"
                  />
                </div>
              </div>
            </div>

            {/* Course Thumbnail */}
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-6">
              <h2 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-6">Course Thumbnail</h2>

              <div className="border-2 border-dashed border-neutral-gray dark:border-darkMode-border rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-forest-sage dark:text-darkMode-textMuted mx-auto mb-4" />
                <p className="text-forest-sage dark:text-darkMode-textSecondary mb-2">Upload course thumbnail</p>
                <p className="text-sm text-forest-sage dark:text-darkMode-textMuted mb-4">PNG, JPG up to 2MB</p>
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                  Choose File
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing Status */}
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-6">
              <h3 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-4">Publishing</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-dark dark:text-darkMode-textSecondary">Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    formData.isPublished
                      ? 'bg-success/10 text-success dark:bg-darkMode-success/20 dark:text-darkMode-success'
                      : 'bg-neutral-gray text-forest-sage dark:bg-darkMode-navbar dark:text-darkMode-textSecondary'
                  }`}>
                    {formData.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => handleInputChange('isPublished', e.target.checked)}
                    className="rounded border-neutral-gray text-primary focus:ring-primary dark:focus:ring-darkMode-focus"
                  />
                  <span className="ml-2 text-sm text-neutral-dark dark:text-darkMode-textSecondary">
                    Publish course
                  </span>
                </label>

                <p className="text-xs text-forest-sage dark:text-darkMode-textMuted">
                  Published courses are visible to learners and can be enrolled in.
                </p>
              </div>
            </div>

            {/* Course Stats */}
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-6">
              <h3 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-4">Course Stats</h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-forest-sage dark:text-darkMode-textSecondary">Enrolled:</span>
                  <span className="font-medium text-neutral-dark dark:text-darkMode-text">{course.enrolledStudents}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-forest-sage dark:text-darkMode-textSecondary">Completion Rate:</span>
                  <span className="font-medium text-neutral-dark dark:text-darkMode-text">{course.completionRate}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-forest-sage dark:text-darkMode-textSecondary">Rating:</span>
                  <span className="font-medium text-neutral-dark dark:text-darkMode-text">{course.rating}/5</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-forest-sage dark:text-darkMode-textSecondary">Modules:</span>
                  <span className="font-medium text-neutral-dark dark:text-darkMode-text">{course.modules.length}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-6">
              <h3 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-4">Quick Actions</h3>

              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/trainer/courses/${courseId}/preview`)}
                  className="w-full text-left p-3 rounded-lg border border-neutral-gray dark:border-darkMode-border hover:bg-neutral-light dark:hover:bg-darkMode-navbar transition-colors flex items-center gap-3"
                >
                  <Eye className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary">Preview Course</span>
                </button>

                <button
                  onClick={() => navigate(`/trainer/courses/${courseId}/learners`)}
                  className="w-full text-left p-3 rounded-lg border border-neutral-gray dark:border-darkMode-border hover:bg-neutral-light dark:hover:bg-darkMode-navbar transition-colors flex items-center gap-3"
                >
                  <BookOpen className="w-5 h-5 text-secondary" />
                  <span className="text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary">Manage Modules</span>
                </button>

                <button className="w-full text-left p-3 rounded-lg border border-error/30 dark:border-error/50 hover:bg-error/10 dark:hover:bg-error/20 transition-colors flex items-center gap-3 text-error">
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
