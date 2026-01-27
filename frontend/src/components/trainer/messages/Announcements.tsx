import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrainer } from '../../../contexts/TrainerContext';
import { 
  ArrowLeft, 
  Send, 
  Users, 
  BookOpen, 
  Plus, 
  Calendar,
  Bell,
  Edit,
  Trash2
} from 'lucide-react';

const Announcements: React.FC = () => {
  const navigate = useNavigate();
  const { courses, learners } = useTrainer();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [announcement, setAnnouncement] = useState({
    title: '',
    message: '',
    recipients: 'all' as 'all' | 'course',
    courseId: '',
    scheduled: false,
    scheduleDate: ''
  });

  // Mock announcements data
  const announcements = [
    {
      id: '1',
      title: 'Course Update: New React Module Added',
      message: 'I\'ve added a new module covering React Hooks. Check it out!',
      recipients: 'React Fundamentals',
      sentDate: '2024-03-15T10:00:00Z',
      recipientCount: 45
    },
    {
      id: '2',
      title: 'Weekly Office Hours',
      message: 'Join me every Friday at 3 PM for Q&A sessions.',
      recipients: 'All Learners',
      sentDate: '2024-03-14T15:00:00Z',
      recipientCount: 120
    }
  ];

  const handleSendAnnouncement = () => {
    // TODO: Send announcement via API
    setShowCreateModal(false);
    setAnnouncement({
      title: '',
      message: '',
      recipients: 'all',
      courseId: '',
      scheduled: false,
      scheduleDate: ''
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-['Inter']">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/trainer/messages')}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Announcements</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Send updates and notifications to your learners
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Announcement
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sent</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{announcements.length}</p>
              </div>
              <Bell className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Recipients</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {announcements.reduce((sum, ann) => sum + ann.recipientCount, 0)}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {announcements.filter(ann => 
                    new Date(ann.sentDate).getMonth() === new Date().getMonth()
                  ).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Announcements List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Announcements</h2>
          </div>
          
          {announcements.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Announcements Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create your first announcement to communicate with learners
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors"
              >
                Create Announcement
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-600">
              {announcements.map((ann) => (
                <div key={ann.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {ann.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {ann.message}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {ann.recipients} • {ann.recipientCount} recipients
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(ann.sentDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create Announcement</h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={announcement.title}
                  onChange={(e) => setAnnouncement({...announcement, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter announcement title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  value={announcement.message}
                  onChange={(e) => setAnnouncement({...announcement, message: e.target.value})}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Write your announcement message..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Recipients
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="recipients"
                      value="all"
                      checked={announcement.recipients === 'all'}
                      onChange={(e) => setAnnouncement({...announcement, recipients: e.target.value as any})}
                      className="mr-3"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">All Learners</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Send to all enrolled learners ({learners.length} total)</p>
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="recipients"
                      value="course"
                      checked={announcement.recipients === 'course'}
                      onChange={(e) => setAnnouncement({...announcement, recipients: e.target.value as any})}
                      className="mr-3"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Specific Course</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Send to learners in a specific course</p>
                    </div>
                  </label>
                </div>
                
                {announcement.recipients === 'course' && (
                  <div className="mt-3">
                    <select
                      value={announcement.courseId}
                      onChange={(e) => setAnnouncement({...announcement, courseId: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select a course</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title} ({course.enrolledStudents} learners)
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={announcement.scheduled}
                    onChange={(e) => setAnnouncement({...announcement, scheduled: e.target.checked})}
                    className="rounded border-gray-300 text-primary-light focus:ring-primary-light mr-3"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    Schedule for later
                  </span>
                </label>
                
                {announcement.scheduled && (
                  <div className="mt-3">
                    <input
                      type="datetime-local"
                      value={announcement.scheduleDate}
                      onChange={(e) => setAnnouncement({...announcement, scheduleDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button 
                onClick={handleSendAnnouncement}
                disabled={!announcement.title || !announcement.message}
                className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
                {announcement.scheduled ? 'Schedule' : 'Send'} Announcement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;