import { useState } from 'react'

interface Notification {
  id: string
  type: 'achievement' | 'reminder' | 'update' | 'social' | 'system' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  actionText?: string
  priority: 'low' | 'medium' | 'high'
  category: string
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'achievement',
    title: 'New Achievement Unlocked!',
    message: 'Congratulations! You\'ve earned the "Week Warrior" achievement for maintaining a 7-day learning streak.',
    timestamp: '2025-01-15T14:30:00Z',
    read: false,
    actionUrl: '/student/achievements',
    actionText: 'View Achievement',
    priority: 'high',
    category: 'Achievements'
  },
  {
    id: '2',
    type: 'success',
    title: 'Certificate Earned',
    message: 'Your "Python Programming Fundamentals" certificate is now available for download and sharing.',
    timestamp: '2025-01-15T12:15:00Z',
    read: false,
    actionUrl: '/student/certificates',
    actionText: 'Download Certificate',
    priority: 'high',
    category: 'Certifications'
  },
  {
    id: '3',
    type: 'reminder',
    title: 'Assessment Due Tomorrow',
    message: 'Don\'t forget to complete your "Data Analysis Skills" assessment by tomorrow at 11:59 PM.',
    timestamp: '2025-01-15T09:00:00Z',
    read: false,
    actionUrl: '/student/assessments/data-analysis-skills',
    actionText: 'Take Assessment',
    priority: 'medium',
    category: 'Assessments'
  },
  {
    id: '4',
    type: 'update',
    title: 'New Course Available',
    message: 'Check out the new "Advanced Python Programming" course, perfectly suited for your learning path.',
    timestamp: '2025-01-14T16:45:00Z',
    read: true,
    actionUrl: '/student/courses/advanced-python',
    actionText: 'Explore Course',
    priority: 'low',
    category: 'Courses'
  },
  {
    id: '5',
    type: 'social',
    title: 'Learning Challenge Invitation',
    message: 'Your friend Alex Chen invited you to join the "Week Sprint" challenge. 234 participants and counting!',
    timestamp: '2025-01-14T11:20:00Z',
    read: true,
    actionUrl: '/student/achievements/challenges',
    actionText: 'Join Challenge',
    priority: 'medium',
    category: 'Social'
  },
  {
    id: '6',
    type: 'warning',
    title: 'Learning Streak at Risk',
    message: 'You haven\'t logged any learning time today. Keep your 7-day streak alive!',
    timestamp: '2025-01-14T20:00:00Z',
    read: true,
    actionUrl: '/student/courses',
    actionText: 'Continue Learning',
    priority: 'medium',
    category: 'Progress'
  },
  {
    id: '7',
    type: 'system',
    title: 'Weekly Progress Report',
    message: 'Your weekly learning report is ready. You\'ve completed 3.2 hours of learning this week!',
    timestamp: '2025-01-13T08:00:00Z',
    read: true,
    actionUrl: '/student/progress/reports',
    actionText: 'View Report',
    priority: 'low',
    category: 'Reports'
  }
]

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread' | Notification['type']>('all')
  const [expandedNotification, setExpandedNotification] = useState<string | null>(null)

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'achievement': return '🏆'
      case 'reminder': return '⏰'
      case 'update': return '📢'
      case 'social': return '👥'
      case 'system': return '🔧'
      case 'success': return '✅'
      case 'warning': return '⚠️'
      case 'error': return '❌'
    }
  }

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'achievement': return 'bg-yellow-100 border-yellow-300 text-yellow-800'
      case 'reminder': return 'bg-blue-100 border-blue-300 text-blue-800'
      case 'update': return 'bg-purple-100 border-purple-300 text-purple-800'
      case 'social': return 'bg-green-100 border-green-300 text-green-800'
      case 'system': return 'bg-gray-100 border-gray-300 text-gray-800'
      case 'success': return 'bg-green-100 border-green-300 text-green-800'
      case 'warning': return 'bg-orange-100 border-orange-300 text-orange-800'
      case 'error': return 'bg-red-100 border-red-300 text-red-800'
    }
  }

  const getPriorityColor = (priority: Notification['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-red-500'
      case 'medium': return 'border-l-yellow-500'
      case 'low': return 'border-l-gray-300'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    if (filter === 'unread') return !notification.read
    return notification.type === filter
  })

  const unreadCount = notifications.filter(n => !n.read).length
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && !n.read).length

  const formatTime = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays === 1) return 'Yesterday'
    return `${diffInDays} days ago`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-darkMode-bg dark:via-darkMode-surface dark:to-darkMode-bg p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-dark dark:bg-darkMode-navbar rounded-xl flex items-center justify-center">
                <span className="text-2xl">🔔</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-primary-dark dark:text-darkMode-text">Notification Center</h1>
                <p className="text-neutral-dark/70 dark:text-darkMode-textSecondary">Stay updated with your learning progress and activities</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary dark:text-darkMode-success">{unreadCount}</div>
                <div className="text-sm text-neutral-dark/70 dark:text-darkMode-textSecondary">Unread</div>
              </div>
              {highPriorityCount > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{highPriorityCount}</div>
                  <div className="text-sm text-neutral-dark/70 dark:text-darkMode-textSecondary">High Priority</div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats & Actions */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="px-4 py-2 bg-secondary dark:bg-darkMode-success text-white rounded-lg font-medium hover:bg-secondary-dark dark:hover:bg-darkMode-progress transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Mark All as Read
            </button>
            <div className="flex items-center gap-2 text-sm text-neutral-dark/70 dark:text-darkMode-textSecondary">
              <span>📊</span>
              <span>{notifications.length} total notifications</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-neutral-dark/70 dark:text-darkMode-textSecondary">
              <span>🎯</span>
              <span>{notifications.filter(n => n.type === 'achievement').length} achievements</span>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 p-1 bg-white rounded-lg shadow-sm">
          {[
            { id: 'all', label: 'All', count: notifications.length },
            { id: 'unread', label: 'Unread', count: unreadCount },
            { id: 'achievement', label: 'Achievements', count: notifications.filter(n => n.type === 'achievement').length },
            { id: 'reminder', label: 'Reminders', count: notifications.filter(n => n.type === 'reminder').length },
            { id: 'update', label: 'Updates', count: notifications.filter(n => n.type === 'update').length },
            { id: 'social', label: 'Social', count: notifications.filter(n => n.type === 'social').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as typeof filter)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                filter === tab.id
                  ? 'bg-primary-dark dark:bg-darkMode-navbar text-white'
                  : 'text-neutral-dark/70 dark:text-darkMode-textSecondary hover:text-primary-dark dark:text-darkMode-text hover:bg-gray-50'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  filter === tab.id ? 'bg-white text-primary-dark dark:text-darkMode-text' : 'bg-gray-200 text-neutral-dark/70 dark:text-darkMode-textSecondary'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-primary-dark dark:text-darkMode-text mb-2">No notifications</h3>
              <p className="text-neutral-dark/70 dark:text-darkMode-textSecondary">
                {filter === 'unread' ? 'All caught up! No unread notifications.' : 'You\'re all set! No notifications found.'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark border-l-4 transition-all hover:shadow-xl ${
                  getPriorityColor(notification.priority)
                } ${!notification.read ? 'ring-2 ring-primary dark:ring-darkMode-link/20' : ''}`}
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${getTypeColor(notification.type)} border`}>
                      {getTypeIcon(notification.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className={`font-bold text-lg ${!notification.read ? 'text-primary-dark dark:text-darkMode-text' : 'text-neutral-dark/80 dark:text-darkMode-textSecondary'}`}>
                            {notification.title}
                            {!notification.read && (
                              <span className="ml-2 w-2 h-2 bg-secondary dark:bg-darkMode-success rounded-full inline-block"></span>
                            )}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-neutral-dark/60 dark:text-darkMode-textMuted">
                            <span>{notification.category}</span>
                            <span>•</span>
                            <span>{formatTime(notification.timestamp)}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              notification.priority === 'high' ? 'bg-red-100 text-red-700' :
                              notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-neutral-dark/70 dark:text-darkMode-textSecondary'
                            }`}>
                              {notification.priority} priority
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-primary dark:text-darkMode-link hover:text-primary-dark dark:text-darkMode-text text-sm font-medium"
                            >
                              Mark as read
                            </button>
                          )}
                          <button
                            onClick={() => setExpandedNotification(
                              expandedNotification === notification.id ? null : notification.id
                            )}
                            className="text-gray-400 hover:text-neutral-dark/70 dark:text-darkMode-textSecondary"
                          >
                            {expandedNotification === notification.id ? '−' : '+'}
                          </button>
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>

                      <p className={`text-sm mb-4 ${!notification.read ? 'text-neutral-dark/80 dark:text-darkMode-textSecondary' : 'text-neutral-dark/70 dark:text-darkMode-textSecondary'}`}>
                        {notification.message}
                      </p>

                      {notification.actionUrl && notification.actionText && (
                        <div className="flex gap-3">
                          <button className="btn-primary">
                            {notification.actionText}
                          </button>
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="border border-gray-300 text-neutral-dark/70 dark:text-darkMode-textSecondary px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                            >
                              Dismiss
                            </button>
                          )}
                        </div>
                      )}

                      {expandedNotification === notification.id && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <label className="text-neutral-dark/60 dark:text-darkMode-textMuted">Notification ID</label>
                              <p className="font-mono">{notification.id}</p>
                            </div>
                            <div>
                              <label className="text-neutral-dark/60 dark:text-darkMode-textMuted">Type</label>
                              <p className="capitalize">{notification.type}</p>
                            </div>
                            <div>
                              <label className="text-neutral-dark/60 dark:text-darkMode-textMuted">Timestamp</label>
                              <p>{new Date(notification.timestamp).toLocaleString()}</p>
                            </div>
                            <div>
                              <label className="text-neutral-dark/60 dark:text-darkMode-textMuted">Status</label>
                              <p className={notification.read ? 'text-neutral-dark/70 dark:text-darkMode-textSecondary' : 'text-secondary dark:text-darkMode-success font-medium'}>
                                {notification.read ? 'Read' : 'Unread'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Notification Settings */}
        <div className="mt-8 bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6">
          <h2 className="text-xl font-bold text-primary-dark dark:text-darkMode-text mb-4">Notification Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-primary-dark dark:text-darkMode-text mb-3">Email Notifications</h3>
              <div className="space-y-2">
                {[
                  { id: 'achievements', label: 'New achievements and badges', checked: true },
                  { id: 'reminders', label: 'Assignment and assessment reminders', checked: true },
                  { id: 'weekly', label: 'Weekly progress reports', checked: false },
                  { id: 'social', label: 'Social activities and challenges', checked: true }
                ].map((setting) => (
                  <label key={setting.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      defaultChecked={setting.checked}
                      className="rounded border-gray-300 focus:ring-primary dark:ring-darkMode-link"
                    />
                    <span className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">{setting.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-primary-dark dark:text-darkMode-text mb-3">Push Notifications</h3>
              <div className="space-y-2">
                {[
                  { id: 'immediate', label: 'Immediate notifications', checked: true },
                  { id: 'daily', label: 'Daily digest (8:00 AM)', checked: false },
                  { id: 'streak', label: 'Learning streak reminders', checked: true },
                  { id: 'challenges', label: 'Challenge updates', checked: true }
                ].map((setting) => (
                  <label key={setting.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      defaultChecked={setting.checked}
                      className="rounded border-gray-300 focus:ring-primary dark:ring-darkMode-link"
                    />
                    <span className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">{setting.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button className="bg-secondary dark:bg-darkMode-success text-white px-6 py-2 rounded-lg font-medium hover:bg-secondary-dark dark:hover:bg-darkMode-progress transition-colors">
              Save Preferences
            </button>
          </div>
        </div>

        {/* Notification Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <span className="text-blue-600">💡</span>
            <div>
              <p className="text-blue-800 font-medium">Notification Tips</p>
              <p className="text-blue-700 text-sm">
                Keep your notifications organized by marking important ones as read after action.
                Use filters to focus on specific types of updates that matter most to your learning journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}