import { Link, useLocation } from 'react-router-dom'
import { Rocket, Target, Globe, Puzzle, DollarSign, FileText, BarChart3 } from 'lucide-react'

interface SubNavItem {
  label: string
  path: string
  icon: React.ReactNode
}

const JobsSidebar = () => {
  const location = useLocation()

  const navItems: SubNavItem[] = [
    { label: 'Dashboard', path: '/student/jobs', icon: <Rocket className="w-4 h-4" /> },
    { label: 'Personalized', path: '/student/jobs/personalized', icon: <Target className="w-4 h-4" /> },
    { label: 'Job Board', path: '/student/jobs/general', icon: <Globe className="w-4 h-4" /> },
    { label: 'Matching Quiz', path: '/student/jobs/matching-quiz', icon: <Puzzle className="w-4 h-4" /> },
    { label: 'Salary Insights', path: '/student/jobs/salary-insights', icon: <DollarSign className="w-4 h-4" /> },
    { label: 'Applications', path: '/student/jobs/applications', icon: <FileText className="w-4 h-4" /> }
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
          to="/student/career/assessment"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-[#1C3D6E]"
        >
          <Target className="w-4 h-4" />
          <span>Career Assessment</span>
        </Link>

        <Link
          to="/student/career/skills-gap"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-[#1C3D6E]"
        >
          <BarChart3 className="w-4 h-4" />
          <span>Skills Gap</span>
        </Link>
      </div>
    </aside>
  )
}

export default JobsSidebar