import { Link } from 'react-router-dom'
import {
  Monitor,
  Building2,
  GraduationCap,
  DollarSign,
  Sprout,
  Target,
  BarChart3,
  Compass,
  Rocket,
  Zap
} from 'lucide-react'
import CareerSidebar from '../CareerSidebar'

const CareerDashboard = () => {
  const studentName = "John Doe" // Mock data - would come from auth context

  // Career categories for the Kenyan job market
  const careerCategories = [
    {
      id: 1,
      name: "Technology",
      icon: <Monitor className="w-8 h-8 text-white" />,
      jobCount: 1245,
      averageSalary: "KSh 120,000",
      growth: "+15%",
      color: "bg-primary-dark"
    },
    {
      id: 2,
      name: "Healthcare",
      icon: <Building2 className="w-8 h-8 text-white" />,
      jobCount: 856,
      averageSalary: "KSh 95,000",
      growth: "+12%",
      color: "bg-primary-dark"
    },
    {
      id: 3,
      name: "Education",
      icon: <GraduationCap className="w-8 h-8 text-white" />,
      jobCount: 634,
      averageSalary: "KSh 75,000",
      growth: "+8%",
      color: "bg-primary-dark"
    },
    {
      id: 4,
      name: "Finance",
      icon: <DollarSign className="w-8 h-8 text-white" />,
      jobCount: 892,
      averageSalary: "KSh 110,000",
      growth: "+10%",
      color: "bg-primary-dark"
    },
    {
      id: 5,
      name: "Agriculture",
      icon: <Sprout className="w-8 h-8 text-white" />,
      jobCount: 423,
      averageSalary: "KSh 65,000",
      growth: "+18%",
      color: "bg-primary-dark"
    },
    {
      id: 6,
      name: "Manufacturing",
      icon: "🏭",
      jobCount: 567,
      averageSalary: "KSh 85,000",
      growth: "+7%",
      color: "bg-primary-dark"
    }
  ]

  const quickStats = [
    {
      label: "Career Matches",
      value: "24",
      icon: <Target className="w-8 h-8" />,
      trend: "Based on your profile"
    },
    {
      label: "Skills Completed",
      value: "67%",
      icon: <BarChart3 className="w-8 h-8" />,
      trend: "8 skills to go"
    },
    {
      label: "Applications",
      value: "12",
      icon: "📄",
      trend: "3 pending responses"
    },
    {
      label: "Salary Range",
      value: "KSh 85-120K",
      icon: "💵",
      trend: "Based on your skills"
    }
  ]

  const careerActions = [
    {
      title: "Take Career Assessment",
      description: "Discover your ideal career path based on interests and skills",
      icon: <Compass className="w-8 h-8 text-white" />,
      link: "/student/career/assessment",
      color: "bg-primary-dark"
    },
    {
      title: "Explore Career Pathways",
      description: "View detailed career paths and requirements",
      icon: "🛤️",
      link: "/student/career/pathways",
      color: "bg-primary-dark"
    },
    {
      title: "Skills Gap Analysis",
      description: "Identify skills you need to reach your career goals",
      icon: "📈",
      link: "/student/career/skills-gap",
      color: "bg-primary-dark"
    },
    {
      title: "Job Matching Quiz",
      description: "Find jobs that perfectly match your profile",
      icon: "🔍",
      link: "/student/jobs/matching-quiz",
      color: "bg-primary-dark"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F2F2] via-white to-[#2C857A]/10 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="flex">
        <CareerSidebar />
        <div className="flex-1 ml-6">

      {/* Header */}
      <div className="bg-primary-dark py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              Welcome to Your Career Hub, {studentName}!
            </h1>
            <p className="text-white/90 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
              Discover your ideal career path, find matching jobs, and build the skills you need to succeed
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 -mt-6 lg:-mt-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-0 p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-2 sm:mb-0">
                  <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-300 mb-1 leading-tight">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB]">{stat.value}</p>
                  <p className="text-xs text-[#4A9E3D] font-medium mt-1 hidden sm:block">{stat.trend}</p>
                </div>
                <div className="self-start sm:self-center text-[#1C3D6E] dark:text-[#3DAEDB]">{stat.icon}</div>
              </div>
              <p className="text-xs text-[#4A9E3D] font-medium mt-2 sm:hidden truncate">{stat.trend}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6 lg:space-y-8">
            {/* Career Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-0 p-4 sm:p-6 lg:p-8 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-6 lg:mb-8 flex items-center">
                <Rocket className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-[#1C3D6E] dark:text-[#3DAEDB]" />
                Career Development Tools
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {careerActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className="block p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#3DAEDB] hover:shadow-lg transition-all duration-300 group"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-2xl">{action.icon}</span>
                    </div>
                    <h3 className="font-bold text-[#1C3D6E] dark:text-[#3DAEDB] text-lg mb-2 group-hover:text-[#0f2844] transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{action.description}</p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Career Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-0 p-4 sm:p-6 lg:p-8 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-xl sm:text-2xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-6 lg:mb-8 flex items-center">
                <span className="text-2xl sm:text-3xl mr-2 sm:mr-3">🏢</span>
                Top Career Categories
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {careerCategories.map((category, index) => (
                  <Link
                    key={category.id}
                    to={`/student/jobs/industry/${category.id}`}
                    className="block p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#3DAEDB] hover:shadow-lg transition-all duration-300 group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {category.icon}
                    </div>
                    <h3 className="font-bold text-[#1C3D6E] dark:text-[#3DAEDB] text-lg mb-2 group-hover:text-[#0f2844] transition-colors">
                      {category.name}
                    </h3>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-medium">{category.jobCount}</span> jobs available
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Avg: <span className="font-medium text-[#4A9E3D]">{category.averageSalary}</span>
                      </p>
                      <p className="text-sm text-[#2C857A] font-medium">
                        {category.growth} growth
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="order-first xl:order-last space-y-6 lg:space-y-8">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-0 p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-lg sm:text-xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-4 sm:mb-6 flex items-center">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-[#1C3D6E] dark:text-[#3DAEDB]" />
                Quick Actions
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <Link
                  to="/student/jobs/personalized"
                  className="w-full text-left p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl hover:border-[#3DAEDB] hover:bg-[#3DAEDB]/5 transition-all duration-200 group block"
                >
                  <div className="flex items-center">
                    <Target className="w-6 h-6 sm:w-8 sm:h-8 mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-200 flex-shrink-0 text-[#1C3D6E] dark:text-[#3DAEDB]" />
                    <div>
                      <p className="font-semibold text-[#1C3D6E] dark:text-[#3DAEDB] group-hover:text-[#0f2844] transition-colors text-sm sm:text-base">View Personalized Jobs</p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Jobs matched to your profile</p>
                    </div>
                  </div>
                </Link>
                <Link
                  to="/student/jobs/general"
                  className="w-full text-left p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl hover:border-[#4A9E3D] hover:bg-[#4A9E3D]/5 transition-all duration-200 group block"
                >
                  <div className="flex items-center">
                    <span className="text-2xl sm:text-3xl mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-200 flex-shrink-0">🌐</span>
                    <div>
                      <p className="font-semibold text-[#1C3D6E] dark:text-[#3DAEDB] group-hover:text-[#4A9E3D] transition-colors text-sm sm:text-base">Browse All Jobs</p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Explore general job board</p>
                    </div>
                  </div>
                </Link>
                <Link
                  to="/student/jobs/salary-insights"
                  className="w-full text-left p-3 sm:p-4 border border-gray-200 dark:border-gray-700 rounded-lg sm:rounded-xl hover:border-[#2C857A] hover:bg-[#2C857A]/5 transition-all duration-200 group block"
                >
                  <div className="flex items-center">
                    <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-200 flex-shrink-0 text-[#4A9E3D]" />
                    <div>
                      <p className="font-semibold text-[#1C3D6E] dark:text-[#3DAEDB] group-hover:text-[#2C857A] transition-colors text-sm sm:text-base">Salary Insights</p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Market salary information</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Career Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border-0 p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-lg sm:text-xl font-bold text-[#1C3D6E] dark:text-[#3DAEDB] mb-4 sm:mb-6 flex items-center">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-[#1C3D6E] dark:text-[#3DAEDB]" />
                Career Progress
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-[#1C3D6E] dark:text-[#3DAEDB]">Profile Completion</span>
                    <span className="font-bold text-[#333333]">75%</span>
                  </div>
                  <div className="w-full bg-[#F2F2F2] rounded-full h-3 shadow-inner">
                    <div className="bg-primary-dark h-3 rounded-full transition-all duration-500 shadow-sm" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-[#1C3D6E] dark:text-[#3DAEDB]">Skills Assessment</span>
                    <span className="font-bold text-[#333333]">60%</span>
                  </div>
                  <div className="w-full bg-[#F2F2F2] rounded-full h-3 shadow-inner">
                    <div className="bg-primary-dark h-3 rounded-full transition-all duration-500 shadow-sm" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
              <Link
                to="/student/career/assessment"
                className="btn-primary mt-4 w-full text-center block"
              >
                Complete Assessment
              </Link>
            </div>
          </div>
        </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default CareerDashboard