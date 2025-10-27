import { Link, useLocation } from 'react-router-dom'
import { Rocket, Target, Globe, BarChart3, Brain, TrendingUp } from 'lucide-react'

interface SubNavItem {
  label: string
  path: string
  icon: React.ReactNode
}

const CareerSidebar = () => {
  const location = useLocation()

  const navItems: SubNavItem[] = [
    { label: 'Dashboard', path: '/student/career', icon: <Rocket className="w-4 h-4" /> },
    { label: 'Assessment', path: '/student/career/assessment', icon: <Brain className="w-4 h-4" /> },
    { label: 'Pathways', path: '/student/career/pathways', icon: <Target className="w-4 h-4" /> },
    { label: 'Skills Gap', path: '/student/career/skills-gap', icon: <BarChart3 className="w-4 h-4" /> }
  ]

  const isActivePath = (path: string) => location.pathname === path

  return (
    <aside className="w-60 bg-[#F9FAFB] p-3 rounded-2xl shadow-sm border border-gray-100">
      <nav className="flex flex-col space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActivePath(item.path)
                ? 'bg-[#E6F0FF] text-[#1C3D6E]'
                : 'text-gray-600 hover:bg-gray-50 hover:text-[#1C3D6E]'
            }`}
          >
            <span
              className={`flex items-center justify-center ${
                isActivePath(item.path) ? 'text-[#1C3D6E]' : 'text-gray-500'
              }`}
            >
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Divider */}
      <div className="my-3 border-t border-gray-200" />

      {/* Bottom Links */}
      <div className="flex flex-col space-y-1">
        <Link
          to="/student/jobs"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-[#1C3D6E]"
        >
          <Globe className="w-4 h-4" />
          <span>Job Search</span>
        </Link>

        <Link
          to="/student/progress/analytics"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-[#1C3D6E]"
        >
          <TrendingUp className="w-4 h-4" />
          <span>Progress Analytics</span>
        </Link>
      </div>
    </aside>
  )
}

export default CareerSidebar