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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Course Not Found</h2>
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Video Upload
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">Upload video file</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">MP4, MOV up to 500MB</p>
                <button className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors">
                  Choose Video File
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Video Description
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Describe what learners will see in this video..."
              />
            </div>
          </div>
        );

      case 'text':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white font-mono"
              placeholder="Write your lesson content here... You can use Markdown formatting."
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Supports Markdown formatting for rich text content.
            </p>
          </div>
        );

      case 'quiz':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                💡 Quiz builder coming soon! For now, you can describe the quiz structure in the content area.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Quiz Instructions
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Describe the quiz questions and format..."
              />
            </div>
          </div>
        );

      case 'assignment':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assignment Instructions
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Provide detailed assignment instructions, requirements, and submission guidelines..."
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Points
                </label>
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="100"
                />
              </div>
            </div>
          </div>
        );

      case 'interactive':
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <p className="text-sm text-purple-800 dark:text-purple-200">
                🚀 Interactive content builder coming soon! For now, you can embed external interactive content.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Embed Code or URL
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white font-mono"
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-['Inter']">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/trainer/courses/${courseId}`)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isNewModule ? 'Create Module' : 'Edit Module'}
                </h1>
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
                className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors flex items-center gap-2"
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Module Information</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Module Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter module title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Brief description of what this module covers"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Duration (minutes)
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Order
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                      className="rounded border-gray-300 text-primary-light focus:ring-primary-light"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      This module is required for course completion
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Module Type Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Module Type</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {moduleTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => handleInputChange('type', type.value)}
                      className={`p-4 rounded-lg border-2 text-left transition-colors ${
                        formData.type === type.value
                          ? 'border-primary-light bg-primary-light/5 dark:bg-primary-light/10'
                          : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mb-2 ${
                        formData.type === type.value ? 'text-primary-light' : 'text-gray-400'
                      }`} />
                      <h3 className={`font-medium mb-1 ${
                        formData.type === type.value ? 'text-primary-light' : 'text-gray-900 dark:text-white'
                      }`}>
                        {type.label}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {type.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Module Content</h2>
              {renderContentEditor()}
            </div>

            {/* Resources */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Additional Resources</h2>
                <button
                  onClick={addResource}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-primary-light text-white rounded-lg hover:bg-primary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Resource
                </button>
              </div>
              
              {formData.resources.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No additional resources added yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {formData.resources.map((resource, index) => (
                    <div key={resource.id} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          value={resource.name}
                          onChange={(e) => updateResource(index, 'name', e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="Resource name"
                        />
                        <select
                          value={resource.type}
                          onChange={(e) => updateResource(index, 'type', e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                        >
                          <option value="file">File</option>
                          <option value="link">Link</option>
                          <option value="document">Document</option>
                        </select>
                        <input
                          type="text"
                          value={resource.url}
                          onChange={(e) => updateResource(index, 'url', e.target.value)}
                          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                          placeholder="URL or file path"
                        />
                      </div>
                      <button
                        onClick={() => removeResource(index)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Type:</span>
                  <span className="font-medium dark:text-white capitalize">{formData.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                  <span className="font-medium dark:text-white">{formData.duration} min</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Order:</span>
                  <span className="font-medium dark:text-white">#{formData.order}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Required:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    formData.isRequired 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                  }`}>
                    {formData.isRequired ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Help */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-4">💡 Tips</h3>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                <li>• Keep module titles clear and descriptive</li>
                <li>• Set realistic duration estimates</li>
                <li>• Use required modules for essential content</li>
                <li>• Add resources to supplement learning</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleEditor;