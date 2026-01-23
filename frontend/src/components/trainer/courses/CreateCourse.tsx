import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrainer } from '../../../contexts/TrainerContext';
import {
  ArrowLeft,
  Save,
  Plus,
  X,
  Upload,
  BookOpen,
  Clock,
  Users,
  Eye,
  Settings
} from 'lucide-react';

const CreateCourse: React.FC = () => {
  const navigate = useNavigate();
  const { addCourse } = useTrainer();

  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Advanced',
    duration: 0,
    modules: [] as never[],
    isPublished: false,
    thumbnail: '',
    learningObjectives: [''],
    prerequisites: [''],
    tags: [''],
    rating: 0,
    enrolledStudents: 0,
    completionRate: 0
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleSave = (publish = false) => {
    const newCourse = {
      ...courseData,
      isPublished: publish
    };
    addCourse(newCourse);
    navigate('/trainer/courses');
  };

  const addLearningObjective = () => {
    setCourseData(prev => ({
      ...prev,
      learningObjectives: [...prev.learningObjectives, '']
    }));
  };

  const updateLearningObjective = (index: number, value: string) => {
    setCourseData(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.map((obj, i) => i === index ? value : obj)
    }));
  };

  const removeLearningObjective = (index: number) => {
    setCourseData(prev => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter((_, i) => i !== index)
    }));
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">
          Course Title *
        </label>
        <input
          type="text"
          value={courseData.title}
          onChange={(e) => setCourseData({...courseData, title: e.target.value})}
          className="w-full px-4 py-3 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
          placeholder="Enter an engaging course title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">
          Course Description *
        </label>
        <textarea
          value={courseData.description}
          onChange={(e) => setCourseData({...courseData, description: e.target.value})}
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
            value={courseData.category}
            onChange={(e) => setCourseData({...courseData, category: e.target.value})}
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
            value={courseData.difficulty}
            onChange={(e) => setCourseData({...courseData, difficulty: e.target.value as any})}
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
          Estimated Duration (hours) *
        </label>
        <input
          type="number"
          value={courseData.duration}
          onChange={(e) => setCourseData({...courseData, duration: parseInt(e.target.value) || 0})}
          className="w-full px-4 py-3 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
          placeholder="0"
          min="0"
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">
          Course Thumbnail
        </label>
        <div className="border-2 border-dashed border-neutral-gray dark:border-darkMode-border rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-forest-sage dark:text-darkMode-textMuted mx-auto mb-4" />
          <p className="text-forest-sage dark:text-darkMode-textSecondary mb-2">Upload course thumbnail</p>
          <p className="text-sm text-forest-sage dark:text-darkMode-textMuted">PNG, JPG up to 2MB</p>
          <button className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
            Choose File
          </button>
        </div>
      </div>

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
          {courseData.learningObjectives.map((objective, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                value={objective}
                onChange={(e) => updateLearningObjective(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                placeholder="What will learners achieve?"
              />
              {courseData.learningObjectives.length > 1 && (
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
          className="w-full px-4 py-3 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
          placeholder="react, javascript, frontend, web development"
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center py-12">
        <BookOpen className="w-16 h-16 text-forest-sage dark:text-darkMode-textMuted mx-auto mb-4" />
        <h3 className="text-lg font-medium text-neutral-dark dark:text-darkMode-text mb-2">
          Course Structure
        </h3>
        <p className="text-forest-sage dark:text-darkMode-textSecondary mb-6">
          You can add modules and lessons after creating the course
        </p>
        <div className="bg-primary/10 dark:bg-darkMode-accent/20 border border-primary/20 dark:border-darkMode-accent/30 rounded-lg p-4">
          <p className="text-sm text-primary dark:text-darkMode-accent">
            Tip: Start with a basic course structure. You can always add more content later from the course management page.
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="bg-neutral-light dark:bg-darkMode-navbar rounded-lg p-6">
        <h3 className="text-lg font-medium text-neutral-dark dark:text-darkMode-text mb-4">Course Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-forest-sage dark:text-darkMode-textSecondary">Title:</span>
            <span className="font-medium text-neutral-dark dark:text-darkMode-text">{courseData.title || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-forest-sage dark:text-darkMode-textSecondary">Category:</span>
            <span className="font-medium text-neutral-dark dark:text-darkMode-text">{courseData.category || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-forest-sage dark:text-darkMode-textSecondary">Difficulty:</span>
            <span className="font-medium text-neutral-dark dark:text-darkMode-text">{courseData.difficulty}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-forest-sage dark:text-darkMode-textSecondary">Duration:</span>
            <span className="font-medium text-neutral-dark dark:text-darkMode-text">{courseData.duration} hours</span>
          </div>
          <div className="flex justify-between">
            <span className="text-forest-sage dark:text-darkMode-textSecondary">Objectives:</span>
            <span className="font-medium text-neutral-dark dark:text-darkMode-text">{courseData.learningObjectives.filter(obj => obj.trim()).length}</span>
          </div>
        </div>
      </div>

      <div className="bg-accent-gold/10 dark:bg-darkMode-accent/20 border border-accent-gold/20 dark:border-darkMode-accent/30 rounded-lg p-4">
        <h4 className="font-medium text-accent-gold dark:text-darkMode-accent mb-2">Publishing Options</h4>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="radio"
              name="publishOption"
              value="draft"
              defaultChecked
              className="mr-3"
            />
            <div>
              <span className="text-sm font-medium text-accent-gold dark:text-darkMode-accent">Save as Draft</span>
              <p className="text-xs text-accent-gold/80 dark:text-darkMode-accent/80">Course will be saved but not visible to learners</p>
            </div>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="publishOption"
              value="publish"
              className="mr-3"
            />
            <div>
              <span className="text-sm font-medium text-accent-gold dark:text-darkMode-accent">Publish Immediately</span>
              <p className="text-xs text-accent-gold/80 dark:text-darkMode-accent/80">Course will be available to learners right away</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg font-['Inter']">
      {/* Header */}
      <div className="bg-neutral-white dark:bg-darkMode-surface shadow-sm border-b dark:border-darkMode-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/trainer/courses')}
                className="p-2 text-forest-sage hover:text-neutral-dark dark:text-darkMode-textSecondary dark:hover:text-darkMode-text rounded-lg hover:bg-neutral-gray dark:hover:bg-darkMode-navbar"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text">Create New Course</h1>
                <p className="text-forest-sage dark:text-darkMode-textSecondary mt-1">
                  Step {currentStep} of {totalSteps}: {
                    currentStep === 1 ? 'Basic Information' :
                    currentStep === 2 ? 'Course Details' :
                    currentStep === 3 ? 'Course Structure' :
                    'Review & Publish'
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleSave(false)}
                className="px-4 py-2 text-neutral-dark dark:text-darkMode-textSecondary border border-neutral-gray dark:border-darkMode-border rounded-lg hover:bg-neutral-light dark:hover:bg-darkMode-navbar flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Draft
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  step <= currentStep
                    ? 'bg-primary text-white'
                    : 'bg-neutral-gray dark:bg-darkMode-navbar text-forest-sage dark:text-darkMode-textSecondary'
                }`}
              >
                {step}
              </div>
            ))}
          </div>
          <div className="w-full bg-neutral-gray dark:bg-darkMode-navbar rounded-full h-2">
            <div
              className="bg-primary dark:bg-darkMode-progress h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="px-6 py-2 text-neutral-dark dark:text-darkMode-textSecondary border border-neutral-gray dark:border-darkMode-border rounded-lg hover:bg-neutral-light dark:hover:bg-darkMode-navbar disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex items-center gap-3">
            {currentStep < totalSteps ? (
              <button
                onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                Next
              </button>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleSave(false)}
                  className="px-6 py-2 text-neutral-dark dark:text-darkMode-textSecondary border border-neutral-gray dark:border-darkMode-border rounded-lg hover:bg-neutral-light dark:hover:bg-darkMode-navbar"
                >
                  Save as Draft
                </button>
                <button
                  onClick={() => handleSave(true)}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Publish Course
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
