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
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg font-['Inter'] flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-neutral-white dark:bg-darkMode-surface shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-gray dark:border-darkMode-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-dark to-primary dark:from-darkMode-progress dark:to-darkMode-success rounded-lg flex items-center justify-center shadow-md">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-neutral-dark dark:text-darkMode-text">Trainer Portal</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-forest-sage hover:text-neutral-dark dark:text-darkMode-textSecondary dark:hover:text-darkMode-text"
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
                      ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light'
                      : 'text-forest-sage dark:text-darkMode-textSecondary hover:bg-neutral-light dark:hover:bg-darkMode-navbar hover:text-neutral-dark dark:hover:text-darkMode-text'
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
        <div className="p-4 border-t border-neutral-gray dark:border-darkMode-border bg-neutral-white dark:bg-darkMode-surface mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-dark to-primary dark:from-darkMode-progress dark:to-darkMode-success rounded-full flex items-center justify-center text-white font-medium shadow-md">
              {trainer?.name?.charAt(0) || 'T'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-dark dark:text-darkMode-text truncate">
                {trainer?.name || 'Trainer'}
              </p>
              <p className="text-xs text-forest-sage dark:text-darkMode-textMuted truncate">
                {trainer?.email || 'trainer@example.com'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:pl-0">
        {/* Top navigation */}
        <div className="bg-neutral-white dark:bg-darkMode-surface shadow-sm border-b border-neutral-gray dark:border-darkMode-border sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-forest-sage hover:text-neutral-dark dark:text-darkMode-textSecondary dark:hover:text-darkMode-text"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Search */}
              <div className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-forest-sage dark:text-darkMode-textMuted" />
                  <input
                    type="text"
                    placeholder="Search learners, courses..."
                    className="pl-10 pr-4 py-2 w-64 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent text-sm dark:bg-darkMode-navbar dark:text-darkMode-text dark:placeholder-darkMode-textMuted"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 text-forest-sage hover:text-neutral-dark dark:text-darkMode-textSecondary dark:hover:text-darkMode-text rounded-lg hover:bg-neutral-light dark:hover:bg-darkMode-navbar">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
              </button>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-light dark:hover:bg-darkMode-navbar"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-dark to-primary dark:from-darkMode-progress dark:to-darkMode-success rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md">
                    {trainer?.name?.charAt(0) || 'T'}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-neutral-dark dark:text-darkMode-text">
                    {trainer?.name || 'Trainer'}
                  </span>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-neutral-white dark:bg-darkMode-surface rounded-lg shadow-lg border border-neutral-gray dark:border-darkMode-border py-1 z-50">
                    <Link
                      to="/trainer/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-dark dark:text-darkMode-text hover:bg-neutral-light dark:hover:bg-darkMode-navbar"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <Link
                      to="/trainer/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-dark dark:text-darkMode-text hover:bg-neutral-light dark:hover:bg-darkMode-navbar"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <hr className="my-1 border-neutral-gray dark:border-darkMode-border" />
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        // Handle logout
                        window.location.href = '/trainer/login';
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-error dark:text-error hover:bg-error/10 dark:hover:bg-error/20"
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
