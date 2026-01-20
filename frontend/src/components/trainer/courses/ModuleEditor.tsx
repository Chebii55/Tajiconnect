import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrainer } from '../../../contexts/TrainerContext';
import {
  ArrowLeft,
  Save,
  Upload,
  Play,
  FileText,
  HelpCircle,
  Clipboard,
  Monitor,
  Eye,
  Settings,
  Plus,
  X
} from 'lucide-react';

const ModuleEditor: React.FC = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const { courses, addModule, updateModule } = useTrainer();

  const course = courses.find(c => c.id === courseId);
  const module = course?.modules.find(m => m.id === moduleId);
  const isNewModule = moduleId === 'new';

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'video' as 'video' | 'text' | 'quiz' | 'assignment' | 'interactive',
    duration: 0,
    content: '',
    order: 1,
    isRequired: true,
    resources: [] as Array<{ id: string; name: string; type: string; url: string }>
  });

  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    if (module && !isNewModule) {
      setFormData({
        title: module.title,
        description: module.description,
        type: module.type,
        duration: module.duration,
        content: module.content,
        order: module.order,
        isRequired: module.isRequired,
        resources: module.resources || []
      });
    } else if (course) {
      setFormData(prev => ({
        ...prev,
        order: course.modules.length + 1
      }));
    }
  }, [module, course, isNewModule]);

  if (!course) {
    return (
      <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mb-2">Course Not Found</h2>
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
    if (isNewModule) {
      addModule(courseId!, formData);
    } else {
      updateModule(courseId!, moduleId!, formData);
    }
    navigate(`/trainer/courses/${courseId}`);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addResource = () => {
    const newResource = {
      id: `resource-${Date.now()}`,
      name: '',
      type: 'file',
      url: ''
    };
    setFormData(prev => ({
      ...prev,
      resources: [...prev.resources, newResource]
    }));
  };

  const updateResource = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.map((resource, i) =>
        i === index ? { ...resource, [field]: value } : resource
      )
    }));
  };

  const removeResource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  const moduleTypes = [
    { value: 'video', label: 'Video Lesson', icon: Play, description: 'Video content with player controls' },
    { value: 'text', label: 'Text Content', icon: FileText, description: 'Written content and articles' },
    { value: 'quiz', label: 'Quiz', icon: HelpCircle, description: 'Interactive quiz with questions' },
    { value: 'assignment', label: 'Assignment', icon: Clipboard, description: 'Practical assignments and projects' },
    { value: 'interactive', label: 'Interactive', icon: Monitor, description: 'Interactive simulations and exercises' }
  ];

  const renderContentEditor = () => {
    switch (formData.type) {
      case 'video':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">
                Video Upload
              </label>
              <div className="border-2 border-dashed border-neutral-gray dark:border-darkMode-border rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-forest-sage dark:text-darkMode-textMuted mx-auto mb-4" />
                <p className="text-forest-sage dark:text-darkMode-textSecondary mb-2">Upload video file</p>
                <p className="text-sm text-forest-sage dark:text-darkMode-textMuted mb-4">MP4, MOV up to 500MB</p>
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                  Choose Video File
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">
                Video Description
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                placeholder="Describe what learners will see in this video..."
              />
            </div>
          </div>
        );

      case 'text':
        return (
          <div>
            <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text font-mono"
              placeholder="Write your lesson content here... You can use Markdown formatting."
            />
            <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary mt-2">
              Supports Markdown formatting for rich text content.
            </p>
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-6">
            <div className="bg-primary/10 dark:bg-darkMode-accent/20 border border-primary/20 dark:border-darkMode-accent/30 rounded-lg p-4">
              <p className="text-sm text-primary dark:text-darkMode-accent">
                Quiz builder coming soon! For now, you can describe the quiz structure in the content area.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">
                Quiz Instructions
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                placeholder="Describe the quiz questions and format..."
              />
            </div>
          </div>
        );

      case 'assignment':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">
                Assignment Instructions
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                placeholder="Provide detailed assignment instructions, requirements, and submission guidelines..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">
                  Max Points
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                  placeholder="100"
                />
              </div>
            </div>
          </div>
        );

      case 'interactive':
        return (
          <div className="space-y-6">
            <div className="bg-secondary/10 dark:bg-darkMode-accent/20 border border-secondary/20 dark:border-darkMode-accent/30 rounded-lg p-4">
              <p className="text-sm text-secondary dark:text-darkMode-accent">
                Interactive content builder coming soon! For now, you can embed external interactive content.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">
                Embed Code or URL
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text font-mono"
                placeholder="Paste embed code or URL for interactive content..."
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg font-['Inter']">
      {/* Header */}
      <div className="bg-neutral-white dark:bg-darkMode-surface shadow-sm border-b dark:border-darkMode-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/trainer/courses/${courseId}`)}
                className="p-2 text-forest-sage hover:text-neutral-dark dark:text-darkMode-textSecondary dark:hover:text-darkMode-text rounded-lg hover:bg-neutral-gray dark:hover:bg-darkMode-navbar"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text">
                  {isNewModule ? 'Create Module' : 'Edit Module'}
                </h1>
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
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isNewModule ? 'Create Module' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-6">
              <h2 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-6">Module Information</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">
                    Module Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                    placeholder="Enter module title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                    placeholder="Brief description of what this module covers"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">
                      Duration (minutes)
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

                  <div>
                    <label className="block text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">
                      Order
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-3 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                      placeholder="1"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isRequired}
                      onChange={(e) => handleInputChange('isRequired', e.target.checked)}
                      className="rounded border-neutral-gray text-primary focus:ring-primary dark:focus:ring-darkMode-focus"
                    />
                    <span className="ml-2 text-sm text-neutral-dark dark:text-darkMode-textSecondary">
                      This module is required for course completion
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Module Type Selection */}
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-6">
              <h2 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-6">Module Type</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {moduleTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => handleInputChange('type', type.value)}
                      className={`p-4 rounded-lg border-2 text-left transition-colors ${
                        formData.type === type.value
                          ? 'border-primary bg-primary/5 dark:bg-primary/10'
                          : 'border-neutral-gray dark:border-darkMode-border hover:border-forest-sage dark:hover:border-darkMode-textSecondary'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mb-2 ${
                        formData.type === type.value ? 'text-primary' : 'text-forest-sage dark:text-darkMode-textMuted'
                      }`} />
                      <h3 className={`font-medium mb-1 ${
                        formData.type === type.value ? 'text-primary' : 'text-neutral-dark dark:text-darkMode-text'
                      }`}>
                        {type.label}
                      </h3>
                      <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">
                        {type.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-6">
              <h2 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-6">Module Content</h2>
              {renderContentEditor()}
            </div>

            {/* Resources */}
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text">Additional Resources</h2>
                <button
                  onClick={addResource}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Resource
                </button>
              </div>

              {formData.resources.length === 0 ? (
                <p className="text-forest-sage dark:text-darkMode-textSecondary text-center py-8">
                  No additional resources added yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {formData.resources.map((resource, index) => (
                    <div key={resource.id} className="flex items-center gap-4 p-4 border border-neutral-gray dark:border-darkMode-border rounded-lg">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          value={resource.name}
                          onChange={(e) => updateResource(index, 'name', e.target.value)}
                          className="px-3 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                          placeholder="Resource name"
                        />
                        <select
                          value={resource.type}
                          onChange={(e) => updateResource(index, 'type', e.target.value)}
                          className="px-3 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                        >
                          <option value="file">File</option>
                          <option value="link">Link</option>
                          <option value="document">Document</option>
                        </select>
                        <input
                          type="text"
                          value={resource.url}
                          onChange={(e) => updateResource(index, 'url', e.target.value)}
                          className="px-3 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                          placeholder="URL or file path"
                        />
                      </div>
                      <button
                        onClick={() => removeResource(index)}
                        className="p-2 text-error hover:bg-error/10 dark:hover:bg-error/20 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Module Preview */}
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-6">
              <h3 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-4">Preview</h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-forest-sage dark:text-darkMode-textSecondary">Type:</span>
                  <span className="font-medium text-neutral-dark dark:text-darkMode-text capitalize">{formData.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-forest-sage dark:text-darkMode-textSecondary">Duration:</span>
                  <span className="font-medium text-neutral-dark dark:text-darkMode-text">{formData.duration} min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-forest-sage dark:text-darkMode-textSecondary">Order:</span>
                  <span className="font-medium text-neutral-dark dark:text-darkMode-text">#{formData.order}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-forest-sage dark:text-darkMode-textSecondary">Required:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    formData.isRequired
                      ? 'bg-error/10 text-error dark:bg-error/20 dark:text-error'
                      : 'bg-neutral-gray text-forest-sage dark:bg-darkMode-navbar dark:text-darkMode-textSecondary'
                  }`}>
                    {formData.isRequired ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="bg-primary/10 dark:bg-darkMode-accent/20 border border-primary/20 dark:border-darkMode-accent/30 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-primary dark:text-darkMode-accent mb-4">Tips</h3>
              <ul className="space-y-2 text-sm text-primary dark:text-darkMode-accent">
                <li>Keep module titles clear and descriptive</li>
                <li>Set realistic duration estimates</li>
                <li>Use required modules for essential content</li>
                <li>Add resources to supplement learning</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleEditor;
