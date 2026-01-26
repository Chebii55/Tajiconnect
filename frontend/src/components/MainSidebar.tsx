import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  BookOpen,
  Map,
  Sparkles,
  Target,
  BarChart3,
  Wrench,
  Brain,
  TrendingUp,
  Briefcase,
  Route,
  Search,
  Globe,
  DollarSign,
  FileText,
  Trophy,
  Award,
  FileCheck,
  Clock,
  Puzzle,
  MessageSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'

interface DropdownItem {
  label: string
  path: string
  icon?: React.ReactNode
}

interface NavItem {
  label: string
  path?: string
  icon?: React.ReactNode
  dropdown?: DropdownItem[]
}

const MainSidebar = () => {
  const [expandedSections, setExpandedSections] = useState<string[]>(['Learning'])
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()

  const navigationItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/student/dashboard',
      icon: <Home className="w-5 h-5" />
    },
    {
      label: 'Learning',
      icon: <BookOpen className="w-5 h-5" />,
      dropdown: [
        { label: 'My Roadmap', path: '/student/roadmap', icon: <Map className="w-4 h-4" /> },
        { label: 'Browse Courses', path: '/student/courses', icon: <Search className="w-4 h-4" /> },
        { label: 'My Courses', path: '/student/courses/my-courses', icon: <BookOpen className="w-4 h-4" /> },
        { label: 'Recommendations', path: '/student/courses/recommendations', icon: <Sparkles className="w-4 h-4" /> }
      ]
    },
    {
      label: 'Assessment',
      icon: <Target className="w-5 h-5" />,
      dropdown: [
        { label: 'Skills Test', path: '/student/assessments/skills', icon: <Wrench className="w-4 h-4" /> },
        { label: 'Psychometric', path: '/student/assessments/psychometric', icon: <Brain className="w-4 h-4" /> },
        { label: 'Results', path: '/student/assessments/results', icon: <BarChart3 className="w-4 h-4" /> }
      ]
    },
    {
      label: 'Progress',
      icon: <TrendingUp className="w-5 h-5" />,
      dropdown: [
        { label: 'Analytics', path: '/student/progress/analytics', icon: <BarChart3 className="w-4 h-4" /> },
        { label: 'Goals', path: '/student/progress/goals', icon: <Target className="w-4 h-4" /> },
        { label: 'Time Tracking', path: '/student/progress/time-tracking', icon: <Clock className="w-4 h-4" /> }
      ]
    },
    {
      label: 'Career',
      icon: <Briefcase className="w-5 h-5" />,
      dropdown: [
        { label: 'Overview', path: '/student/career', icon: <Briefcase className="w-4 h-4" /> },
        { label: 'Assessment', path: '/student/career/assessment', icon: <Target className="w-4 h-4" /> },
        { label: 'Pathways', path: '/student/career/pathways', icon: <Route className="w-4 h-4" /> },
        { label: 'Skills Gap', path: '/student/career/skills-gap', icon: <Search className="w-4 h-4" /> }
      ]
    },
    {
      label: 'Jobs',
      icon: <Globe className="w-5 h-5" />,
      dropdown: [
        { label: 'For You', path: '/student/jobs/personalized', icon: <Sparkles className="w-4 h-4" /> },
        { label: 'Job Board', path: '/student/jobs/general', icon: <Globe className="w-4 h-4" /> },
        { label: 'Matching Quiz', path: '/student/jobs/matching-quiz', icon: <Puzzle className="w-4 h-4" /> },
        { label: 'Salaries', path: '/student/jobs/salary-insights', icon: <DollarSign className="w-4 h-4" /> },
        { label: 'Applications', path: '/student/jobs/applications', icon: <FileText className="w-4 h-4" /> }
      ]
    },
    {
      label: 'Achievements',
      icon: <Trophy className="w-5 h-5" />,
      dropdown: [
        { label: 'Overview', path: '/student/achievements', icon: <Trophy className="w-4 h-4" /> },
        { label: 'Badges', path: '/student/achievements/badges', icon: <Award className="w-4 h-4" /> },
        { label: 'Certificates', path: '/student/certificates', icon: <FileCheck className="w-4 h-4" /> }
      ]
    }
  ]

  const toggleSection = (label: string) => {
    setExpandedSections(prev =>
      prev.includes(label)
        ? prev.filter(s => s !== label)
        : [...prev, label]
    )
  }

  const isActivePath = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const isParentActive = (item: NavItem) => {
    if (item.path) return isActivePath(item.path)
    return item.dropdown?.some(d => isActivePath(d.path)) || false
  }

  return (
    <aside
      className={`${
        isCollapsed ? 'w-16' : 'w-64'
      } h-screen bg-neutral-white dark:bg-darkMode-surface border-r border-border-light dark:border-darkMode-border flex flex-col transition-all duration-300 sticky top-0`}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border-light dark:border-darkMode-border">
        {!isCollapsed && (
          <Link to="/student/dashboard" className="flex items-center space-x-2">
            <img
              src="/zoomed-logo.png"
              alt="TajiConnect"
              className="h-8 w-auto"
            />
            <span className="text-lg font-bold bg-gradient-to-r from-primary-dark to-primary dark:from-darkMode-progress dark:to-darkMode-accent bg-clip-text text-transparent" style={{fontFamily: 'Poppins, sans-serif'}}>
              TajiConnect
            </span>
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-neutral-dark dark:text-darkMode-textSecondary hover:bg-primary/10 dark:hover:bg-darkMode-surfaceHover transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.label}>
              {item.path ? (
                // Direct link item
                <Link
                  to={item.path}
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    isActivePath(item.path)
                      ? 'bg-gradient-to-r from-primary to-primary-light dark:from-darkMode-progress dark:to-darkMode-success text-white shadow-md'
                      : 'text-neutral-dark dark:text-darkMode-textSecondary hover:bg-primary/10 dark:hover:bg-darkMode-surfaceHover hover:text-primary dark:hover:text-darkMode-accent'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              ) : (
                // Dropdown section
                <div>
                  <button
                    onClick={() => !isCollapsed && toggleSection(item.label)}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                      isParentActive(item)
                        ? 'bg-primary/10 dark:bg-darkMode-surfaceHover text-primary dark:text-darkMode-accent'
                        : 'text-neutral-dark dark:text-darkMode-textSecondary hover:bg-primary/10 dark:hover:bg-darkMode-surfaceHover hover:text-primary dark:hover:text-darkMode-accent'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3'}`}>
                      <span className="flex-shrink-0">{item.icon}</span>
                      {!isCollapsed && <span>{item.label}</span>}
                    </div>
                    {!isCollapsed && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          expandedSections.includes(item.label) ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {/* Dropdown items */}
                  {!isCollapsed && expandedSections.includes(item.label) && item.dropdown && (
                    <ul className="mt-1 ml-4 pl-4 border-l-2 border-border-light dark:border-darkMode-border space-y-1">
                      {item.dropdown.map((dropdownItem) => (
                        <li key={dropdownItem.path}>
                          <Link
                            to={dropdownItem.path}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                              isActivePath(dropdownItem.path)
                                ? 'bg-success/10 dark:bg-darkMode-success/20 text-success dark:text-darkMode-success font-medium border-l-2 border-success dark:border-darkMode-success -ml-[18px] pl-[26px]'
                                : 'text-forest-sage dark:text-darkMode-textMuted hover:bg-primary/5 dark:hover:bg-darkMode-surfaceHover hover:text-primary dark:hover:text-darkMode-accent'
                            }`}
                          >
                            <span className="flex-shrink-0">{dropdownItem.icon}</span>
                            <span>{dropdownItem.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom section - Help */}
      <div className="p-4 border-t border-border-light dark:border-darkMode-border">
        {!isCollapsed ? (
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-darkMode-progress/10 dark:to-darkMode-success/10 rounded-xl p-4">
            <p className="text-sm font-medium text-primary dark:text-darkMode-accent mb-2">
              Need Help?
            </p>
            <p className="text-xs text-forest-sage dark:text-darkMode-textMuted mb-3">
              Check out our guides and FAQs
            </p>
            <Link
              to="/student/help"
              className="block w-full text-center py-2 px-3 bg-primary dark:bg-darkMode-progress text-white text-sm font-medium rounded-lg hover:bg-primary-dark dark:hover:bg-darkMode-success transition-colors"
            >
              Get Support
            </Link>
          </div>
        ) : (
          <Link
            to="/student/help"
            className="flex items-center justify-center p-2 rounded-lg text-primary dark:text-darkMode-accent hover:bg-primary/10 dark:hover:bg-darkMode-surfaceHover transition-colors"
            title="Get Help"
          >
            <MessageSquare className="w-5 h-5" />
          </Link>
        )}
      </div>
    </aside>
  )
}

export default MainSidebar
