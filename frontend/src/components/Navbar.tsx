import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { authService } from '../services/api/auth'
import {
  Sun,
  Moon,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown
} from 'lucide-react'
import MainSidebar from './MainSidebar'

// Public routes where user UI should not show
const PUBLIC_ROUTES = ['/login', '/register', '/trainer/login', '/forgot-password', '/reset-password']

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const [userInitials, setUserInitials] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  // Check if current route is a public route
  const isPublicRoute = PUBLIC_ROUTES.some(route => location.pathname.startsWith(route))

  useEffect(() => {
    // On public routes, always treat as logged out
    if (isPublicRoute) {
      setIsLoggedIn(false)
      setUserInitials('')
      return
    }

    const user = authService.getCurrentUser()
    const token = authService.getAccessToken()

    // Only consider logged in if both user and token exist
    if (user && token) {
      setIsLoggedIn(true)
      const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase()
      setUserInitials(initials || 'U')
    } else {
      setIsLoggedIn(false)
      setUserInitials('')
    }
  }, [location.pathname, isPublicRoute])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isProfileDropdownOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isProfileDropdownOpen])

  const handleLogout = async () => {
    try {
      // Clear local state immediately
      setIsLoggedIn(false)
      setUserInitials('')
      setIsProfileDropdownOpen(false)

      await authService.logout()
    } catch (error) {
      console.error('Logout failed:', error)
      // Ensure auth is cleared even if API call fails
      authService.clearAuth()
    } finally {
      // Always navigate to login
      navigate('/login')
    }
  }

  return (
    <>
      <nav className="bg-neutral-white dark:bg-darkMode-navbar shadow-sm dark:shadow-dark sticky top-0 z-[100] border-b border-border-light dark:border-darkMode-border">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Mobile menu button - only show when authenticated */}
            {isLoggedIn && (
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
            )}

            {/* Logo (public routes) or Search Bar (authenticated) */}
            {isPublicRoute ? (
              <Link to="/" className="flex items-center space-x-2">
                <img
                  src="/zoomed-logo.png"
                  alt="TajiConnect"
                  className="h-8 w-auto"
                />
                <span
                  className="text-lg font-bold bg-gradient-to-r from-primary-dark to-primary dark:from-darkMode-progress dark:to-darkMode-accent bg-clip-text text-transparent"
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                >
                  TajiConnect
                </span>
              </Link>
            ) : (
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
            )}

            {/* Right side actions */}
            <div className="flex items-center space-x-2">
              {/* Notifications - only show when logged in */}
              {isLoggedIn && (
                <button
                  className="p-2 text-neutral-dark dark:text-darkMode-textSecondary hover:text-primary dark:hover:text-darkMode-accent hover:bg-primary/10 dark:hover:bg-darkMode-surfaceHover rounded-lg transition-colors duration-200 relative"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-accent-coral dark:bg-darkMode-error rounded-full"></span>
                </button>
              )}

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

              {/* Profile */}
              {isLoggedIn && (
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-primary/10 dark:hover:bg-darkMode-surfaceHover transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-light dark:from-darkMode-progress dark:to-darkMode-success rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {userInitials}
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-500 dark:text-darkMode-textMuted" />
                  </button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-darkMode-surface rounded-xl shadow-xl border border-gray-100 dark:border-darkMode-border z-50 overflow-hidden">


                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/student/profile"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-darkMode-text hover:bg-primary/5 dark:hover:bg-darkMode-surfaceHover transition-colors group"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mr-3 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="font-medium">Profile</p>
                            <p className="text-xs text-gray-500 dark:text-darkMode-textMuted">View your profile</p>
                          </div>
                        </Link>

                        <Link
                          to="/settings"
                          className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-darkMode-text hover:bg-primary/5 dark:hover:bg-darkMode-surfaceHover transition-colors group"
                          onClick={() => setIsProfileDropdownOpen(false)}
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center mr-3 group-hover:bg-gray-100 dark:group-hover:bg-gray-700 transition-colors">
                            <Settings className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div>
                            <p className="font-medium">Settings</p>
                            <p className="text-xs text-gray-500 dark:text-darkMode-textMuted">Preferences & privacy</p>
                          </div>
                        </Link>
                      </div>

                      {/* Logout Section */}
                      <div className="border-t border-gray-100 dark:border-darkMode-border">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center mr-3 group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                            <LogOut className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </div>
                          <div>
                            <p className="font-medium">Logout</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay - only show when authenticated */}
      {isLoggedIn && isMobileMenuOpen && (
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
