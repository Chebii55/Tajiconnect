import {
  Clock,
  Trophy,
  Flame,
  Rocket,
  BookOpen,
  Target,
  Calendar,
  Star,
  Award,
  Activity,
  Brain,
  Globe,
  Heart,
  Users,
  Lightbulb,
  Leaf,
  Shield,
  Search,
  Bell,
  MessageSquare,
  Plus,
  BarChart3,
  TrendingUp,
  Play,
  ChevronRight
} from 'lucide-react'

const StudentDashboard = () => {
  // Mock student data
  const studentName = "Amara Wanjiku"
  
  const recentCourses = [
    {
      id: 1,
      title: "Global Citizenship & Human Rights",
      progress: 75,
      nextLesson: "Climate Justice & Advocacy",
      category: "GCED Core",
      timeRemaining: "2 hours"
    },
    {
      id: 2,
      title: "Social-Emotional Learning (SEL)",
      progress: 45,
      nextLesson: "Empathy & Cultural Understanding",
      category: "SEL Foundation",
      timeRemaining: "1.5 hours"
    },
    {
      id: 3,
      title: "STEM for Sustainable Development",
      progress: 90,
      nextLesson: "Innovation Project",
      category: "STEM Pathways",
      timeRemaining: "45 minutes"
    }
  ]

  const achievements = [
    { id: 1, title: "First Course Completed", icon: "🏆", date: "2 days ago" },
    { id: 2, title: "Week Streak", icon: "🔥", date: "1 week ago" },
    { id: 3, title: "Quiz Master", icon: "🧠", date: "3 days ago" }
  ]

  const recentActivity = [
    { id: 1, action: "Completed lesson: State Management", time: "2 hours ago", type: "completion" },
    { id: 2, action: "Started: Async/Await module", time: "Yesterday", type: "start" },
    { id: 3, action: "Earned badge: React Basics", time: "2 days ago", type: "achievement" },
    { id: 4, action: "Submitted assignment: Portfolio Project", time: "3 days ago", type: "submission" }
  ]

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg">
      {/* Header */}
      <div className="bg-white dark:bg-darkMode-navbar border-b border-gray-200 dark:border-darkMode-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Search Bar */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search courses, lessons..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-darkMode-border rounded-lg bg-white dark:bg-darkMode-surfaceHover text-gray-900 dark:text-darkMode-text placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-darkMode-textSecondary">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-darkMode-textSecondary">{studentName}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="bg-white dark:bg-darkMode-surface border-b border-gray-200 dark:border-darkMode-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-darkMode-text mb-2">
                Welcome back, {studentName}!
              </h1>
              <p className="text-gray-600 dark:text-darkMode-textMuted">
                Continue your learning journey and achieve your goals
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark dark:hover:bg-darkMode-success transition-colors">
                <Search className="w-4 h-4" />
                Browse Courses
              </button>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Cards - Student Focused */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-darkMode-textMuted truncate">
                    Enrolled Courses
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-darkMode-text">
                      8
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-success dark:text-darkMode-success">
                      +2 this month
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Trophy className="w-8 h-8 text-success dark:text-darkMode-success" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-darkMode-textMuted truncate">
                    Completed Courses
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-darkMode-text">
                      15
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-success dark:text-darkMode-success">
                      +3 this month
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="w-8 h-8 text-accent-gold" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-darkMode-textMuted truncate">
                    Average Score
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-darkMode-text">
                      87%
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-success dark:text-darkMode-success">
                      +5% improvement
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Flame className="w-8 h-8 text-warning" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-darkMode-textMuted truncate">
                    Learning Streak
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900 dark:text-darkMode-text">
                      12
                    </div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-success dark:text-darkMode-success">
                      days strong
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Continue Learning */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-darkMode-border">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-darkMode-text">Continue Learning</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentCourses.map((course) => (
                    <div key={course.id} className="border border-gray-200 dark:border-darkMode-border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-darkMode-text">{course.title}</h3>
                          <p className="text-sm text-gray-600 dark:text-darkMode-textMuted mt-1">
                            Next: {course.nextLesson}
                          </p>
                        </div>
                        <span className="px-2 py-1 bg-primary/10 dark:bg-darkMode-link/20 text-primary-dark dark:text-darkMode-link text-xs font-medium rounded-full">
                          {course.category}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 dark:text-darkMode-textMuted">{course.progress}% complete</span>
                            <span className="text-success dark:text-darkMode-success">{course.timeRemaining} left</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-darkMode-surfaceHover rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all duration-500"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500 dark:text-darkMode-textMuted">
                          {course.timeRemaining} remaining
                        </span>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark dark:hover:bg-darkMode-success transition-colors text-sm">
                          <Play className="w-4 h-4" />
                          Continue
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow mt-6">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-darkMode-border">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-darkMode-text">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'completion' ? 'bg-success/10 dark:bg-darkMode-success/20' :
                        activity.type === 'start' ? 'bg-primary/10 dark:bg-darkMode-link/20' :
                        activity.type === 'achievement' ? 'bg-info/10 dark:bg-info/20' :
                        'bg-warning/10 dark:bg-warning/20'
                      }`}>
                        {activity.type === 'completion' && <Trophy className="w-4 h-4 text-success dark:text-darkMode-success" />}
                        {activity.type === 'start' && <BookOpen className="w-4 h-4 text-primary" />}
                        {activity.type === 'achievement' && <Award className="w-4 h-4 text-info" />}
                        {activity.type === 'submission' && <Target className="w-4 h-4 text-warning" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-darkMode-text">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-darkMode-textMuted">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Achievements */}
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-darkMode-border">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-darkMode-text">Recent Achievements</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-darkMode-surfaceHover rounded-lg">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-darkMode-text">{achievement.title}</p>
                        <p className="text-xs text-gray-500 dark:text-darkMode-textMuted">{achievement.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-darkMode-border">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-darkMode-text">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between p-3 text-left bg-gray-50 dark:bg-darkMode-surfaceHover rounded-lg hover:bg-gray-100 dark:hover:bg-darkMode-border transition-colors">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium text-gray-900 dark:text-darkMode-text">Browse Courses</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-3 text-left bg-gray-50 dark:bg-darkMode-surfaceHover rounded-lg hover:bg-gray-100 dark:hover:bg-darkMode-border transition-colors">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-success dark:text-darkMode-success" />
                      <span className="text-sm font-medium text-gray-900 dark:text-darkMode-text">View Progress</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-3 text-left bg-gray-50 dark:bg-darkMode-surfaceHover rounded-lg hover:bg-gray-100 dark:hover:bg-darkMode-border transition-colors">
                    <div className="flex items-center gap-3">
                      <Brain className="w-5 h-5 text-info" />
                      <span className="text-sm font-medium text-gray-900 dark:text-darkMode-text">Take Assessment</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between p-3 text-left bg-gray-50 dark:bg-darkMode-surfaceHover rounded-lg hover:bg-gray-100 dark:hover:bg-darkMode-border transition-colors">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="w-5 h-5 text-warning" />
                      <span className="text-sm font-medium text-gray-900 dark:text-darkMode-text">Ask Question</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Learning Goals */}
            <div className="bg-white dark:bg-darkMode-surface rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-darkMode-border">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-darkMode-text">Learning Goals</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-darkMode-textMuted">Complete 3 courses this month</span>
                    <span className="text-sm font-medium text-success dark:text-darkMode-success">2/3</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-darkMode-surfaceHover rounded-full h-2">
                    <div className="bg-success dark:bg-darkMode-success h-2 rounded-full" style={{ width: '67%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-darkMode-textMuted">Maintain 90% average score</span>
                    <span className="text-sm font-medium text-primary">87%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-darkMode-surfaceHover rounded-full h-2">
                    <div className="bg-primary dark:bg-darkMode-link h-2 rounded-full" style={{ width: '87%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default StudentDashboard