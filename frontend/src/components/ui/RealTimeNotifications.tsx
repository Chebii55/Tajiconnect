import React, { useState, useEffect } from 'react';
import { useRealTime } from '../../contexts/RealTimeContext';
import { Bell, Wifi, WifiOff, Zap, Target, TrendingUp } from 'lucide-react';

interface Notification {
  id: string;
  type: 'recommendation' | 'adaptation' | 'performance' | 'milestone';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const RealTimeNotifications: React.FC = () => {
  const { isConnected, connectionStatus } = useRealTime();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 9)]); // Keep only 10 notifications
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return <Zap className="w-4 h-4 text-blue-500" />;
      case 'adaptation': return <Target className="w-4 h-4 text-purple-500" />;
      case 'performance': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'milestone': return <Target className="w-4 h-4 text-yellow-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Mock notifications for demo
  useEffect(() => {
    const interval = setInterval(() => {
      if (isConnected && Math.random() > 0.7) {
        const mockNotifications = [
          {
            type: 'recommendation' as const,
            title: 'New Content Available',
            message: 'AI found 3 new lessons matching your learning style'
          },
          {
            type: 'adaptation' as const,
            title: 'Learning Path Adapted',
            message: 'Your path was adjusted based on recent performance'
          },
          {
            type: 'performance' as const,
            title: 'Great Progress!',
            message: 'You\'ve improved 15% this week'
          }
        ];
        
        const randomNotif = mockNotifications[Math.floor(Math.random() * mockNotifications.length)];
        addNotification(randomNotif);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [isConnected]);

  return (
    <div className="relative">
      {/* Connection Status Indicator */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
          isConnected 
            ? 'bg-green-100 text-green-700' 
            : 'bg-red-100 text-red-700'
        }`}>
          {isConnected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          <span>{isConnected ? 'Live' : 'Offline'}</span>
        </div>
      </div>

      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              Real-time Updates
            </h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No notifications yet
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                    !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm">
                        {notification.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                        {notification.message}
                      </p>
                      <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setNotifications([])}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RealTimeNotifications;
