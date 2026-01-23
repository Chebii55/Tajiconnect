import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import {
  Home,
  BookOpen,
  Map,
  Book,
  Sparkles,
  Target,
  BarChart3,
  Wrench,
  Brain,
  TrendingUp,
  Briefcase,
  ClipboardList,
  Route,
  Search,
  Globe,
  Rocket,
  DollarSign,
  FileText,
  Trophy,
  Award,
  FileCheck,
  Menu,
  X,
  Sun,
  Moon,
  Settings,
  Users,
  GraduationCap,
  Handshake,
  Shield,
  MessageSquare
} from 'lucide-react'

interface DropdownItem {
  label: string
  path: string
  icon?: React.ReactNode
  description?: string
}

interface NavItem {
  label: string
  path?: string
  icon?: React.ReactNode
  dropdown?: DropdownItem[]
}

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { theme, toggleTheme } = useTheme()

  const navigationItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/student/dashboard',
      icon: <Home className="w-5 h-5" />
    },
    {
      label: 'Quick Actions',
      icon: <Rocket className="w-5 h-5" />,
      dropdown: [
        { label: 'Browse Courses', path: '/student/courses', icon: <BookOpen className="w-4 h-4" />, description: 'Explore available courses' },
        { label: 'View Progress', path: '/student/progress/analytics', icon: <BarChart3 className="w-4 h-4" />, description: 'Check your learning progress' },
        { label: 'Take Assessment', path: '/student/assessments', icon: <Brain className="w-4 h-4" />, description: 'Start a new assessment' },
        { label: 'Ask Question', path: '/student/help', icon: <MessageSquare className="w-4 h-4" />, description: 'Get help and support' }
      ]
    },
    {
      label: 'Learning',
      icon: <BookOpen className="w-5 h-5" />,
      dropdown: [
        { label: 'My Roadmap', path: '/student/roadmap', icon: <Map className="w-4 h-4" />, description: 'Your personalized learning path' },
        { label: 'Courses', path: '/student/courses', icon: <Book className="w-4 h-4" />, description: 'Browse and take courses' },
        { label: 'My Courses', path: '/student/courses/my-courses', icon: <BookOpen className="w-4 h-4" />, description: 'Your enrolled courses' },
        { label: 'Recommendations', path: '/student/courses/recommendations', icon: <Sparkles className="w-4 h-4" />, description: 'AI-powered course suggestions' }
      ]
    },
    {
      label: 'Assessment',
      icon: <Target className="w-5 h-5" />,
      dropdown: [
        { label: 'Assessment Center', path: '/student/assessments', icon: <BarChart3 className="w-4 h-4" />, description: 'All your assessments' },
        { label: 'Skills Assessment', path: '/student/assessments/skills', icon: <Wrench className="w-4 h-4" />, description: 'Test your technical skills' },
        { label: 'Psychometric Test', path: '/student/assessments/psychometric', icon: <Brain className="w-4 h-4" />, description: 'Personality & aptitude tests' },
        { label: 'Results', path: '/student/assessments/results', icon: <TrendingUp className="w-4 h-4" />, description: 'View your test results' }
      ]
    },
    {
      label: 'Progress',
      icon: <TrendingUp className="w-5 h-5" />,
      dropdown: [
        { label: 'Analytics', path: '/student/progress/analytics', icon: <BarChart3 className="w-4 h-4" />, description: 'Detailed learning analytics' },
        { label: 'Reports', path: '/student/progress/reports', icon: <FileText className="w-4 h-4" />, description: 'Performance reports' },
        { label: 'Goals', path: '/student/progress/goals', icon: <Target className="w-4 h-4" />, description: 'Track your learning goals' },
        { label: 'Time Tracking', path: '/student/progress/time-tracking', icon: <BarChart3 className="w-4 h-4" />, description: 'Monitor study time' }
      ]
    },
    {
      label: 'Career',
      icon: <Briefcase className="w-5 h-5" />,
      dropdown: [
        { label: 'Career Dashboard', path: '/student/career', icon: <ClipboardList className="w-4 h-4" />, description: 'Your career overview' },
        { label: 'Career Assessment', path: '/student/career/assessment', icon: <Target className="w-4 h-4" />, description: 'Discover your ideal career' },
        { label: 'Career Pathways', path: '/student/career/pathways', icon: <Route className="w-4 h-4" />, description: 'Explore career paths' },
        { label: 'Skills Gap Analysis', path: '/student/career/skills-gap', icon: <Search className="w-4 h-4" />, description: 'Identify skill gaps' }
      ]
    },
    {
      label: 'Jobs',
      icon: <Globe className="w-5 h-5" />,
      dropdown: [
        { label: 'Jobs Dashboard', path: '/student/jobs', icon: <Rocket className="w-4 h-4" />, description: 'Your job search hub' },
        { label: 'Personalized Jobs', path: '/student/jobs/personalized', icon: <Target className="w-4 h-4" />, description: 'Jobs matched to your profile' },
        { label: 'General Job Board', path: '/student/jobs/general', icon: <Globe className="w-4 h-4" />, description: 'Browse all job opportunities' },
        { label: 'Job Matching Quiz', path: '/student/jobs/matching-quiz', icon: <Target className="w-4 h-4" />, description: 'Find your perfect job match' },
        { label: 'Salary Insights', path: '/student/jobs/salary-insights', icon: <DollarSign className="w-4 h-4" />, description: 'Market salary information' },
        { label: 'Application Tracker', path: '/student/jobs/applications', icon: <FileText className="w-4 h-4" />, description: 'Track your applications' }
      ]
    },
    {
      label: 'Achievements',
      icon: <Trophy className="w-5 h-5" />,
      dropdown: [
        { label: 'My Achievements', path: '/student/achievements', icon: <Trophy className="w-4 h-4" />, description: 'Your accomplishments' },
        { label: 'Badges', path: '/student/achievements/badges', icon: <Award className="w-4 h-4" />, description: 'Earned badges' },
        { label: 'Certificates', path: '/student/certificates', icon: <FileCheck className="w-4 h-4" />, description: 'Your certifications' },
        { label: 'Leaderboard', path: '/student/achievements/leaderboard', icon: <Trophy className="w-4 h-4" />, description: 'Compare with peers' }
      ]
    },
    {
      label: 'Roles',
      icon: <Users className="w-5 h-5" />,
      dropdown: [
        { label: 'Learners', path: '/login', icon: <Users className="w-4 h-4" />, description: 'Student sign in' },
        { label: 'Tutors', path: '/trainer/login', icon: <GraduationCap className="w-4 h-4" />, description: 'Tutor portal' },
        { label: 'Donors & Sponsors', path: '/donors', icon: <Handshake className="w-4 h-4" />, description: 'Donor & sponsor access' },
        { label: 'Admin', path: '/admin/login', icon: <Shield className="w-4 h-4" />, description: 'Administrator access' }
      ]
    }
  ]

  const handleMouseEnter = (label: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setActiveDropdown(label)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <nav className="bg-neutral-white dark:bg-darkMode-navbar shadow-forest dark:shadow-dark sticky top-0 z-[150] border-b border-border-light dark:border-darkMode-border w-full">
      <div className="w-full px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/student/dashboard" className="flex items-center space-x-3 group">
              <img
                src="/zoomed-logo.png"
                alt="TajiConnect"
                className="h-10 w-auto group-hover:scale-105 transition-transform duration-200"
              />
              <span className="text-2xl font-extrabold bg-gradient-to-r from-primary-dark to-primary dark:from-darkMode-progress dark:to-darkMode-accent bg-clip-text text-transparent hidden sm:block tracking-tight" style={{fontFamily: 'Poppins, sans-serif'}}>
                TajiConnect
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.dropdown && handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                {item.path ? (
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-1 px-2 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActivePath(item.path)
                        ? 'bg-gradient-to-r from-primary to-primary-light dark:from-darkMode-progress dark:to-darkMode-success text-white shadow-forest dark:shadow-dark'
                        : 'text-neutral-dark dark:text-darkMode-textSecondary hover:bg-primary/10 dark:hover:bg-darkMode-surfaceHover hover:text-primary dark:hover:text-darkMode-accent'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <button
                    className={`flex items-center space-x-1 px-2 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeDropdown === item.label
                        ? 'bg-primary/10 dark:bg-darkMode-surfaceHover text-primary dark:text-darkMode-accent'
                        : 'text-neutral-dark dark:text-darkMode-textSecondary hover:bg-primary/10 dark:hover:bg-darkMode-surfaceHover hover:text-primary dark:hover:text-darkMode-accent'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        activeDropdown === item.label ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}

                {/* Dropdown Menu */}
                {item.dropdown && activeDropdown === item.label && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-neutral-white dark:bg-darkMode-surface rounded-2xl shadow-forest-lg dark:shadow-dark-lg border border-border-light dark:border-darkMode-border py-4 animate-fade-in z-[200]">
                    <div className="px-4 pb-3 border-b border-border-light dark:border-darkMode-border">
                      <h3 className="text-lg font-bold text-primary dark:text-darkMode-accent flex items-center">
                        <span className="mr-2">{item.icon}</span>
                        {item.label}
                      </h3>
                    </div>
                    {item.dropdown.map((dropdownItem) => (
                      <Link
                        key={dropdownItem.path}
                        to={dropdownItem.path}
                        className={`flex items-start space-x-3 px-4 py-3 hover:bg-primary/5 dark:hover:bg-darkMode-surfaceHover transition-colors duration-200 group ${
                          isActivePath(dropdownItem.path) ? 'bg-success/5 dark:bg-darkMode-success/10 border-r-4 border-success dark:border-darkMode-success' : ''
                        }`}
                        onClick={() => setActiveDropdown(null)}
                      >
                        <span className="group-hover:scale-110 transition-transform duration-200 mt-1 text-forest-medium dark:text-darkMode-textSecondary group-hover:text-primary dark:group-hover:text-darkMode-accent">
                          {dropdownItem.icon}
                        </span>
                        <div>
                          <div className="font-semibold text-primary dark:text-darkMode-text group-hover:text-primary-dark dark:group-hover:text-darkMode-accent">
                            {dropdownItem.label}
                          </div>
                          {dropdownItem.description && (
                            <div className="text-sm text-forest-sage dark:text-darkMode-textMuted mt-1">
                              {dropdownItem.description}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-neutral-dark dark:text-darkMode-textSecondary hover:text-primary dark:hover:text-darkMode-accent transition-colors duration-200"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
            <Link
              to="/settings"
              className="p-2 text-neutral-dark dark:text-darkMode-textSecondary hover:text-primary dark:hover:text-darkMode-accent transition-colors duration-200"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>
            <Link
              to="/student/profile"
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-darkMode-surfaceHover transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-light dark:from-darkMode-progress dark:to-darkMode-success rounded-full flex items-center justify-center text-white font-semibold">
                S
              </div>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
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
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-neutral-white dark:bg-darkMode-surface border-t border-border-light dark:border-darkMode-border shadow-forest-lg dark:shadow-dark-lg w-full z-[105]">
          <div className="px-6 sm:px-8 lg:px-12 py-6 space-y-3">
            {navigationItems.map((item) => (
              <div key={item.label}>
                {item.path ? (
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 p-3 rounded-lg font-medium transition-colors duration-200 ${
                      isActivePath(item.path)
                        ? 'bg-gradient-to-r from-primary to-primary-light dark:from-darkMode-progress dark:to-darkMode-success text-white'
                        : 'text-neutral-dark dark:text-darkMode-textSecondary hover:bg-primary/10 dark:hover:bg-darkMode-surfaceHover'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ) : (
                  <>
                    <div className="flex items-center space-x-3 p-3 text-primary dark:text-darkMode-accent font-semibold">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.dropdown && (
                      <div className="ml-8 space-y-2">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.path}
                            to={dropdownItem.path}
                            className={`flex items-center space-x-3 p-2 rounded-lg text-sm transition-colors duration-200 ${
                              isActivePath(dropdownItem.path)
                                ? 'bg-success dark:bg-darkMode-success text-white'
                                : 'text-forest-sage dark:text-darkMode-textMuted hover:bg-success/10 dark:hover:bg-darkMode-success/10 hover:text-success dark:hover:text-darkMode-success'
                            }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {dropdownItem.icon}
                            <span>{dropdownItem.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
