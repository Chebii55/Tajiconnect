import { Link, useLocation } from 'react-router-dom'
import { LucideIcon } from 'lucide-react'

interface SidebarItem {
  label: string
  path: string
  icon: LucideIcon
}

interface SidebarProps {
  title?: string
  items: SidebarItem[]
  bottomItems?: SidebarItem[]
  className?: string
}

const Sidebar = ({ title, items, bottomItems, className = "" }: SidebarProps) => {
  const location = useLocation()

  const isActivePath = (path: string) => location.pathname === path

  return (
    <aside className={`w-60 bg-neutral-light dark:bg-darkMode-surface p-3 rounded-2xl shadow-sm border border-gray-100 ${className}`}>
      {title && (
        <div className="mb-4 px-3">
          <h2 className="text-lg font-semibold text-primary-dark dark:text-darkMode-text">{title}</h2>
        </div>
      )}
      
      <nav className="flex flex-col space-y-1">
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActivePath(item.path)
                ? 'bg-primary/10 dark:bg-darkMode-accent/20 text-primary-dark dark:text-darkMode-text'
                : 'text-gray-600 hover:bg-gray-50 hover:text-primary-dark dark:text-darkMode-text'
            }`}
          >
            <item.icon className={`w-4 h-4 ${
              isActivePath(item.path) ? 'text-primary-dark dark:text-darkMode-text' : 'text-gray-500'
            }`} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {bottomItems && (
        <>
          <div className="my-3 border-t border-gray-200" />
          <div className="flex flex-col space-y-1">
            {bottomItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 hover:text-primary-dark dark:text-darkMode-text"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </>
      )}
    </aside>
  )
}

export default Sidebar