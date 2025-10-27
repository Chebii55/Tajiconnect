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
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Lesson</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Lesson content editor
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </button>
              <button className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Lesson
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Lesson Editor</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Detailed lesson editor coming soon. Use the module editor for now.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonEditor;