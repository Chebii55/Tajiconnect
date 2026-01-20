import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, Play, FileText, Eye } from 'lucide-react';

const LessonEditor: React.FC = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const [lessonData, setLessonData] = useState({
    title: '',
    content: '',
    type: 'video' as 'video' | 'text' | 'interactive',
    duration: 0,
    order: 1
  });

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
                <h1 className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text">Edit Lesson</h1>
                <p className="text-forest-sage dark:text-darkMode-textSecondary mt-1">
                  Lesson content editor
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-neutral-dark dark:text-darkMode-textSecondary border border-neutral-gray dark:border-darkMode-border rounded-lg hover:bg-neutral-light dark:hover:bg-darkMode-navbar flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Lesson
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-8">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-forest-sage dark:text-darkMode-textMuted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-dark dark:text-darkMode-text mb-2">Lesson Editor</h3>
            <p className="text-forest-sage dark:text-darkMode-textSecondary">
              Detailed lesson editor coming soon. Use the module editor for now.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonEditor;
