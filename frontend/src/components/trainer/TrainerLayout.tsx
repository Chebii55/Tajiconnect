import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  Bell, 
  Search,
  Menu,
  X,
  LogOut,
  User,
  GraduationCap
} from 'lucide-react';
import { useTrainer } from '../../contexts/TrainerContext';

const TrainerLayout: React.FC = () => {
  const location = useLocation();
  const { trainer } = useTrainer();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/trainer/dashboard', icon: LayoutDashboard },
    { name: 'Learner Progress', href: '/trainer/learners', icon: Users },
    { name: 'Course Management', href: '/trainer/courses', icon: BookOpen },
    { name: 'Analytics', href: '/trainer/analytics', icon: BarChart3 },
    { name: 'Messages', href: '/trainer/messages', icon: MessageSquare },
    { name: 'Settings', href: '/trainer/settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-['Inter'] flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Trainer Portal</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Trainer Info */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white font-medium shadow-md">
              {trainer?.name?.charAt(0) || 'T'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {trainer?.name || 'Trainer'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {trainer?.email || 'trainer@example.com'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-0">
        {/* Top navigation */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Search */}
              <div className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search learners, courses..."
                    className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md">
                    {trainer?.name?.charAt(0) || 'T'}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {trainer?.name || 'Trainer'}
                  </span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                    <Link
                      to="/trainer/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <Link
                      to="/trainer/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <hr className="my-1 border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        // Handle logout
                        window.location.href = '/trainer/login';
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TrainerLayout;