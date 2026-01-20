import { Link } from 'react-router-dom'
import {
  FileText,
  Target,
  Briefcase,
  Star,
  Globe,
  Puzzle,
  DollarSign,
  BarChart3,
  Building2,
  Bell,
  PenTool,
  Rocket,
  Settings,
  Zap,
  Smartphone
} from 'lucide-react'
import JobsSidebar from '../JobsSidebar'

const JobsDashboard = () => {
  const studentName = "John Doe" // Mock data - would come from auth context

  // Quick stats for the jobs dashboard
  const jobStats = [
    {
      label: "Jobs Applied",
      value: "12",
      icon: <FileText className="w-8 h-8" />,
      trend: "3 this week",
      color: "bg-primary-dark dark:bg-primary"
    },
    {
      label: "Profile Match",
      value: "87%",
      icon: <Target className="w-8 h-8" />,
      trend: "Based on skills",
      color: "bg-primary-dark dark:bg-primary"
    },
    {
      label: "Interviews",
      value: "3",
      icon: <Briefcase className="w-8 h-8" />,
      trend: "2 pending",
      color: "bg-primary-dark dark:bg-primary"
    },
    {
      label: "Saved Jobs",
      value: "24",
      icon: <Star className="w-8 h-8" />,
      trend: "8 new matches",
      color: "bg-primary-dark dark:bg-primary"
    }
  ]

  // Main job features
  const jobFeatures = [
    {
      title: "Personalized Job Recommendations",
      description: "AI-powered job matches based on your skills, preferences, and career goals",
      icon: <Target className="w-8 h-8 text-white" />,
      link: "/student/jobs/personalized",
      color: "bg-primary-dark dark:bg-primary",
      stats: "24 new matches",
      action: "View Matches"
    },
    {
      title: "General Job Board",
      description: "Browse all available job opportunities from top companies in Kenya",
      icon: <Globe className="w-8 h-8 text-white" />,
      link: "/student/jobs/general",
      color: "bg-primary-dark dark:bg-primary",
      stats: "150+ jobs available",
      action: "Browse Jobs"
    },
    {
      title: "Job Matching Quiz",
      description: "Take a quick quiz to discover jobs that perfectly align with your personality and skills",
      icon: <Puzzle className="w-8 h-8 text-white" />,
      link: "/student/jobs/matching-quiz",
      color: "bg-primary-dark dark:bg-primary",
      stats: "5 min assessment",
      action: "Take Quiz"
    },
    {
      title: "Salary Insights",
      description: "Get detailed salary information and market trends for different roles and industries",
      icon: <DollarSign className="w-8 h-8 text-white" />,
      link: "/student/jobs/salary-insights",
      color: "bg-primary-dark dark:bg-primary",
      stats: "Updated weekly",
      action: "View Insights"
    }
  ]

  // Job tools and utilities
  const jobTools = [
    {
      title: "Application Tracker",
      description: "Track all your job applications in one place",
      icon: <BarChart3 className="w-6 h-6" />,
      link: "/student/jobs/applications",
      color: "bg-primary-dark/10 dark:bg-primary/10"
    },
    {
      title: "Industry Explorer",
      description: "Explore jobs by industry and company",
      icon: <Building2 className="w-6 h-6" />,
      link: "/student/jobs/industry",
      color: "bg-primary-dark/10 dark:bg-primary/10"
    },
    {
      title: "Job Alerts",
      description: "Set up notifications for new job postings",
      icon: <Bell className="w-6 h-6" />,
      link: "/student/jobs/alerts",
      color: "bg-primary-dark/10 dark:bg-primary/10"
    },
    {
      title: "Resume Builder",
      description: "Create and optimize your resume",
      icon: <PenTool className="w-6 h-6" />,
      link: "/student/profile",
      color: "bg-primary-dark/10 dark:bg-primary/10"
    }
  ]

  // Recent job activities
  const recentActivities = [
    {
      type: "application",
      title: "Applied to Frontend Developer at TechCorp",
      time: "2 hours ago",
      icon: <FileText className="w-5 h-5" />,
      status: "pending"
    },
    {
      type: "match",
      title: "New job match: React Developer at StartupTech",
      time: "1 day ago",
      icon: <Target className="w-5 h-5" />,
      status: "new"
    },
    {
      type: "interview",
      title: "Interview scheduled with InnovateLab",
      time: "2 days ago",
      icon: <Briefcase className="w-5 h-5" />,
      status: "scheduled"
    },
    {
      type: "save",
      title: "Saved UX Designer position at DesignHub",
      time: "3 days ago",
      icon: <Star className="w-5 h-5" />,
      status: "saved"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light via-white to-forest-sage/10 dark:from-darkMode-bg dark:via-darkMode-surface dark:to-darkMode-bg">
      <div className="flex">
        <JobsSidebar />
        <div className="flex-1 ml-6">

      {/* Header */}
      <div className="bg-primary-dark dark:bg-gradient-to-r dark:from-primary-dark dark:to-primary py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              Your Job Search Hub, {studentName}!
            </h1>
            <p className="text-white/90 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
              Discover opportunities, track applications, and advance your career with AI-powered job matching
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 -mt-6 lg:-mt-8">
          {jobStats.map((stat, index) => (
            <div key={index} className="bg-white dark:bg-darkMode-surface rounded-2xl shadow-xl border-0 dark:border dark:border-darkMode-border p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-2 sm:mb-0">
                  <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-darkMode-textSecondary mb-1 leading-tight">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-dark dark:text-darkMode-text">{stat.value}</p>
                  <p className="text-xs text-secondary dark:text-darkMode-success font-medium mt-1 hidden sm:block">{stat.trend}</p>
                </div>
                <div className="self-start sm:self-center text-primary-dark dark:text-primary">{stat.icon}</div>
              </div>
              <p className="text-xs text-secondary dark:text-darkMode-success font-medium mt-2 sm:hidden truncate">{stat.trend}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Job Features */}
          <div className="xl:col-span-2 space-y-6 lg:space-y-8">
            {/* Featured Job Tools */}
            <div className="bg-white dark:bg-darkMode-surface rounded-2xl shadow-xl border-0 dark:border dark:border-darkMode-border p-4 sm:p-6 lg:p-8 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-xl sm:text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-6 lg:mb-8 flex items-center">
                <Rocket className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-primary-dark dark:text-primary" />
                Job Search Tools
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {jobFeatures.map((feature, index) => (
                  <Link
                    key={index}
                    to={feature.link}
                    className="block p-6 border border-gray-200 dark:border-darkMode-border rounded-xl hover:border-primary dark:hover:border-primary hover:shadow-lg transition-all duration-300 group"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className={`w-12 h-12 ${feature.color} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <h3 className="font-bold text-primary-dark dark:text-darkMode-text text-lg mb-2 group-hover:text-primary dark:group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-darkMode-textSecondary text-sm leading-relaxed mb-3">{feature.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-secondary dark:text-darkMode-success font-medium">{feature.stats}</span>
                      <span className="text-sm font-semibold text-primary-dark dark:text-primary group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                        {feature.action} →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Additional Job Tools */}
            <div className="bg-white dark:bg-darkMode-surface rounded-2xl shadow-xl border-0 dark:border dark:border-darkMode-border p-4 sm:p-6 lg:p-8 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-xl sm:text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-6 lg:mb-8 flex items-center">
                <Settings className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-3 text-primary-dark dark:text-primary" />
                Career Tools
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {jobTools.map((tool, index) => (
                  <Link
                    key={index}
                    to={tool.link}
                    className={`block p-4 rounded-xl ${tool.color} border border-gray-200 dark:border-darkMode-border hover:border-primary dark:hover:border-primary hover:shadow-md transition-all duration-300 group`}
                  >
                    <div className="flex items-center mb-3">
                      <span className="mr-3 group-hover:scale-110 transition-transform duration-300 text-primary-dark dark:text-primary">{tool.icon}</span>
                      <h3 className="font-bold text-primary-dark dark:text-darkMode-text group-hover:text-primary dark:group-hover:text-primary transition-colors">
                        {tool.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-darkMode-textSecondary text-sm">{tool.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="order-first xl:order-last space-y-6 lg:space-y-8">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-darkMode-surface rounded-2xl shadow-xl border-0 dark:border dark:border-darkMode-border p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-lg sm:text-xl font-bold text-primary-dark dark:text-darkMode-text mb-4 sm:mb-6 flex items-center">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary-dark dark:text-primary" />
                Quick Actions
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <Link
                  to="/student/jobs/personalized"
                  className="w-full text-left p-3 sm:p-4 border border-gray-200 dark:border-darkMode-border rounded-lg sm:rounded-xl hover:border-primary dark:hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all duration-200 group block"
                >
                  <div className="flex items-center">
                    <Target className="w-6 h-6 sm:w-8 sm:h-8 mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-200 flex-shrink-0 text-primary-dark dark:text-primary" />
                    <div>
                      <p className="font-semibold text-primary-dark dark:text-darkMode-text group-hover:text-primary dark:group-hover:text-primary transition-colors text-sm sm:text-base">Find My Jobs</p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-darkMode-textSecondary">24 new matches</p>
                    </div>
                  </div>
                </Link>
                <Link
                  to="/student/jobs/matching-quiz"
                  className="w-full text-left p-3 sm:p-4 border border-gray-200 dark:border-darkMode-border rounded-lg sm:rounded-xl hover:border-secondary dark:hover:border-darkMode-success hover:bg-secondary/5 dark:hover:bg-darkMode-success/10 transition-all duration-200 group block"
                >
                  <div className="flex items-center">
                    <Puzzle className="w-6 h-6 sm:w-8 sm:h-8 mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-200 flex-shrink-0 text-secondary dark:text-darkMode-success" />
                    <div>
                      <p className="font-semibold text-primary-dark dark:text-darkMode-text group-hover:text-secondary dark:group-hover:text-darkMode-success transition-colors text-sm sm:text-base">Take Quiz</p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-darkMode-textSecondary">Find perfect matches</p>
                    </div>
                  </div>
                </Link>
                <Link
                  to="/student/career/assessment"
                  className="w-full text-left p-3 sm:p-4 border border-gray-200 dark:border-darkMode-border rounded-lg sm:rounded-xl hover:border-forest-sage dark:hover:border-darkMode-accent hover:bg-forest-sage/5 dark:hover:bg-darkMode-accent/10 transition-all duration-200 group block"
                >
                  <div className="flex items-center">
                    <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 mr-3 sm:mr-4 group-hover:scale-110 transition-transform duration-200 flex-shrink-0 text-forest-sage dark:text-darkMode-accent" />
                    <div>
                      <p className="font-semibold text-primary-dark dark:text-darkMode-text group-hover:text-forest-sage dark:group-hover:text-darkMode-accent transition-colors text-sm sm:text-base">Career Assessment</p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-darkMode-textSecondary">Discover your path</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-darkMode-surface rounded-2xl shadow-xl border-0 dark:border dark:border-darkMode-border p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
              <h2 className="text-lg sm:text-xl font-bold text-primary-dark dark:text-darkMode-text mb-4 sm:mb-6 flex items-center">
                <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-primary-dark dark:text-primary" />
                Recent Activity
              </h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-darkMode-bg transition-colors duration-200">
                    <span className="flex-shrink-0 mt-0.5 text-primary-dark dark:text-primary">{activity.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-primary-dark dark:text-darkMode-text leading-snug">{activity.title}</p>
                      <p className="text-xs text-gray-500 dark:text-darkMode-textSecondary mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/student/jobs/applications"
                className="mt-4 w-full bg-primary-dark/10 dark:bg-primary/20 hover:bg-primary-dark/20 dark:hover:bg-primary/30 text-primary dark:text-primary-light font-semibold py-3 px-6 rounded-xl transition-all duration-300 text-center block"
              >
                View All Activity
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

export default JobsDashboard
