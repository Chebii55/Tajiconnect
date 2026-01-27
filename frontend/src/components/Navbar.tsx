import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { authService } from '../services/api/auth'
import {
  Sun,
  Moon,
  Settings,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react'
import MainSidebar from './MainSidebar'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userInitials, setUserInitials] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (user) {
      setIsLoggedIn(true)
      const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase()
      setUserInitials(initials || 'U')
    } else {
      setIsLoggedIn(false)
      setUserInitials('')
    }
  }, [])

  return (
    <>
      <nav className="bg-neutral-white dark:bg-darkMode-navbar shadow-sm dark:shadow-dark sticky top-0 z-[100] border-b border-border-light dark:border-darkMode-border">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-forest-sage dark:text-darkMode-textMuted hover:text-primary dark:hover:text-darkMode-accent hover:bg-primary/10 dark:hover:bg-darkMode-surfaceHover transition-colors duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-forest-sage dark:text-darkMode-textMuted" />
                <input
                  type="text"
                  placeholder="Search courses, jobs, resources..."
                  className="w-full pl-10 pr-4 py-2 bg-neutral-light dark:bg-darkMode-bg border border-border-light dark:border-darkMode-border rounded-lg text-sm text-neutral-dark dark:text-darkMode-text placeholder-forest-sage dark:placeholder-darkMode-textMuted focus:outline-none focus:ring-2 focus:ring-primary/50 dark:focus:ring-darkMode-accent/50 focus:border-primary dark:focus:border-darkMode-accent transition-all"
                />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-2">
              {/* Notifications */}
              <button
                className="p-2 text-neutral-dark dark:text-darkMode-textSecondary hover:text-primary dark:hover:text-darkMode-accent hover:bg-primary/10 dark:hover:bg-darkMode-surfaceHover rounded-lg transition-colors duration-200 relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-accent-coral dark:bg-darkMode-error rounded-full"></span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 text-neutral-dark dark:text-darkMode-textSecondary hover:text-primary dark:hover:text-darkMode-accent hover:bg-primary/10 dark:hover:bg-darkMode-surfaceHover rounded-lg transition-colors duration-200"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>

              {/* Settings */}
              <Link
                to="/settings"
                className="p-2 text-neutral-dark dark:text-darkMode-textSecondary hover:text-primary dark:hover:text-darkMode-accent hover:bg-primary/10 dark:hover:bg-darkMode-surfaceHover rounded-lg transition-colors duration-200"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </Link>

              {/* Profile */}
              {isLoggedIn && (
                <Link
                  to="/student/profile"
                  className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-primary/10 dark:hover:bg-darkMode-surfaceHover transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-light dark:from-darkMode-progress dark:to-darkMode-success rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {userInitials}
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[140] lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-[150] lg:hidden">
            <MainSidebar />
          </div>
        </>
      )}
    </>
  )
}

export default Navbar
