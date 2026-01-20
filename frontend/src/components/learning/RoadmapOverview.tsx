import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Map,
  Target,
  Clock,
  Star,
  CheckCircle,
  Circle,
  TrendingUp,
  ChevronRight,
  Search,
  Download
} from 'lucide-react';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
  totalCourses: number;
  completedCourses: number;
  skills: string[];
  estimatedHours: number;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'upcoming' | 'in-progress' | 'completed' | 'overdue';
  progress: number;
  pathId: string;
  pathTitle: string;
}

const RoadmapOverview: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const mockPaths: LearningPath[] = [
    {
      id: '1',
      title: 'Full-Stack Web Developer',
      description: 'Complete web development from frontend to backend',
      category: 'Web Development',
      difficulty: 'Intermediate',
      duration: '8-12 months',
      progress: 65,
      status: 'in-progress',
      totalCourses: 15,
      completedCourses: 10,
      skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'CSS'],
      estimatedHours: 240
    },
    {
      id: '2',
      title: 'UI/UX Design Specialist',
      description: 'Master user experience and interface design',
      category: 'Design',
      difficulty: 'Beginner',
      duration: '6-9 months',
      progress: 30,
      status: 'in-progress',
      totalCourses: 12,
      completedCourses: 4,
      skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
      estimatedHours: 180
    },
    {
      id: '3',
      title: 'Data Science Fundamentals',
      description: 'Introduction to data analysis and machine learning',
      category: 'Data Science',
      difficulty: 'Advanced',
      duration: '10-14 months',
      progress: 0,
      status: 'not-started',
      totalCourses: 20,
      completedCourses: 0,
      skills: ['Python', 'SQL', 'Machine Learning', 'Statistics'],
      estimatedHours: 320
    }
  ];

  const mockMilestones: Milestone[] = [
    {
      id: '1',
      title: 'Complete React Fundamentals',
      description: 'Master React components, hooks, and state management',
      dueDate: '2024-12-30',
      status: 'in-progress',
      progress: 75,
      pathId: '1',
      pathTitle: 'Full-Stack Web Developer'
    },
    {
      id: '2',
      title: 'Build First Portfolio Project',
      description: 'Create a full-stack web application',
      dueDate: '2025-01-15',
      status: 'upcoming',
      progress: 0,
      pathId: '1',
      pathTitle: 'Full-Stack Web Developer'
    },
    {
      id: '3',
      title: 'User Research Certification',
      description: 'Complete user research methodology course',
      dueDate: '2024-12-20',
      status: 'completed',
      progress: 100,
      pathId: '2',
      pathTitle: 'UI/UX Design Specialist'
    }
  ];

  const categories = ['all', 'Web Development', 'Design', 'Data Science', 'Mobile Development'];
  const statuses = ['all', 'not-started', 'in-progress', 'completed'];

  const filteredPaths = mockPaths.filter(path => {
    const matchesCategory = selectedCategory === 'all' || path.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || path.status === selectedStatus;
    const matchesSearch = searchTerm === '' ||
      path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      path.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-success dark:text-darkMode-success bg-success/10 dark:bg-darkMode-success/20';
      case 'in-progress': return 'text-info dark:text-darkMode-link bg-info/10 dark:bg-darkMode-link/20';
      case 'not-started': return 'text-neutral-dark/60 dark:text-darkMode-textMuted bg-neutral-gray dark:bg-darkMode-surfaceHover';
      case 'overdue': return 'text-error dark:text-error-light bg-error/10 dark:bg-error/20';
      default: return 'text-neutral-dark/60 dark:text-darkMode-textMuted bg-neutral-gray dark:bg-darkMode-surfaceHover';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-success dark:text-darkMode-success bg-success/10 dark:bg-darkMode-success/20';
      case 'Intermediate': return 'text-warning dark:text-warning-light bg-warning/10 dark:bg-warning/20';
      case 'Advanced': return 'text-error dark:text-error-light bg-error/10 dark:bg-error/20';
      default: return 'text-neutral-dark/60 dark:text-darkMode-textMuted bg-neutral-gray dark:bg-darkMode-surfaceHover';
    }
  };

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-success dark:text-darkMode-success" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-info dark:text-darkMode-link" />;
      case 'overdue': return <Circle className="w-5 h-5 text-error dark:text-error-light" />;
      default: return <Circle className="w-5 h-5 text-gray-400 dark:text-darkMode-textMuted" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light to-primary/10 dark:from-darkMode-bg dark:to-darkMode-surface font-['Inter']">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary-dark dark:bg-darkMode-navbar rounded-lg">
              <Map className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-primary-dark dark:text-darkMode-text">Roadmap Overview</h1>
              <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary">Manage your learning paths and milestones</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6 border-l-4 border-secondary dark:border-darkMode-success">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">Active Paths</p>
                <p className="text-2xl font-bold text-primary-dark dark:text-darkMode-text">2</p>
              </div>
              <Map className="w-8 h-8 text-secondary dark:text-darkMode-success" />
            </div>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6 border-l-4 border-primary-light dark:border-darkMode-accent">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">Avg Progress</p>
                <p className="text-2xl font-bold text-primary-dark dark:text-darkMode-text">48%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary-light dark:text-darkMode-accent" />
            </div>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6 border-l-4 border-forest-sage dark:border-darkMode-success">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">Milestones</p>
                <p className="text-2xl font-bold text-primary-dark dark:text-darkMode-text">1/3</p>
              </div>
              <Target className="w-8 h-8 text-forest-sage dark:text-darkMode-success" />
            </div>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6 border-l-4 border-purple-500 dark:border-purple-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">Est. Hours</p>
                <p className="text-2xl font-bold text-primary-dark dark:text-darkMode-text">420h</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-darkMode-textMuted" />
                <input
                  type="text"
                  placeholder="Search learning paths..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-darkMode-focus focus:border-transparent bg-white dark:bg-darkMode-surface text-neutral-dark dark:text-darkMode-text"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-darkMode-focus focus:border-transparent bg-white dark:bg-darkMode-surface text-neutral-dark dark:text-darkMode-text"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-darkMode-focus focus:border-transparent bg-white dark:bg-darkMode-surface text-neutral-dark dark:text-darkMode-text"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Statuses' : status.replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-primary-dark dark:bg-darkMode-navbar text-white rounded-lg hover:bg-primary dark:hover:bg-darkMode-surface transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Learning Paths */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text">Learning Paths</h2>
              <Link
                to="/student/courses"
                className="text-primary-light dark:text-darkMode-accent hover:text-primary-dark dark:hover:text-darkMode-accentHover font-medium"
              >
                Browse All Paths
              </Link>
            </div>

            <div className="space-y-4">
              {filteredPaths.map((path) => (
                <div key={path.id} className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6 hover:shadow-xl dark:hover:shadow-dark-lg transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-primary-dark dark:text-darkMode-text mb-1">{path.title}</h3>
                      <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary text-sm mb-2">{path.description}</p>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-neutral-dark/60 dark:text-darkMode-textMuted">{path.duration}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getDifficultyColor(path.difficulty)}`}>
                          {path.difficulty}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(path.status)}`}>
                          {path.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-neutral-dark dark:text-darkMode-textSecondary">Progress</span>
                      <span className="text-neutral-dark dark:text-darkMode-text">{path.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-darkMode-border rounded-full h-2">
                      <div
                        className="bg-secondary dark:bg-darkMode-success h-2 rounded-full transition-all duration-300"
                        style={{ width: `${path.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary mt-1">
                      {path.completedCourses} of {path.totalCourses} courses • {path.estimatedHours}h total
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">Key Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {path.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="px-2 py-1 bg-info/10 dark:bg-darkMode-link/20 text-info dark:text-darkMode-link text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                      {path.skills.length > 3 && (
                        <span className="px-2 py-1 bg-neutral-gray dark:bg-darkMode-surfaceHover text-neutral-dark/80 dark:text-darkMode-textSecondary text-xs rounded-full">
                          +{path.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Link
                      to={`/student/roadmap/learning-path`}
                      className="inline-flex items-center gap-2 text-primary-light dark:text-darkMode-accent hover:text-primary-dark dark:hover:text-darkMode-accentHover transition-colors"
                    >
                      View Details <ChevronRight className="w-4 h-4" />
                    </Link>
                    {path.status === 'in-progress' && (
                      <button className="px-4 py-2 bg-secondary dark:bg-darkMode-success text-white text-sm rounded-lg hover:bg-secondary-dark dark:hover:bg-darkMode-progress transition-colors">
                        Continue
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Milestones */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text">Upcoming Milestones</h2>
              <Link
                to="/student/roadmap/milestones"
                className="text-primary-light dark:text-darkMode-accent hover:text-primary-dark dark:hover:text-darkMode-accentHover font-medium"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {mockMilestones.map((milestone) => (
                <div key={milestone.id} className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getMilestoneIcon(milestone.status)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-primary-dark dark:text-darkMode-text">{milestone.title}</h3>
                          <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary text-sm">{milestone.description}</p>
                          <p className="text-xs text-neutral-dark/60 dark:text-darkMode-textMuted mt-1">{milestone.pathTitle}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(milestone.status)}`}>
                          {milestone.status.replace('-', ' ')}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary mb-2">
                        <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                        <span>{milestone.progress}%</span>
                      </div>

                      {milestone.status === 'in-progress' && (
                        <div className="w-full bg-gray-200 dark:bg-darkMode-border rounded-full h-1.5">
                          <div
                            className="bg-primary-light dark:bg-darkMode-accent h-1.5 rounded-full"
                            style={{ width: `${milestone.progress}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-r from-primary-dark to-primary-light dark:from-darkMode-navbar dark:to-darkMode-progress rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/student/courses"
                  className="flex items-center gap-3 p-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                >
                  <Map className="w-5 h-5" />
                  <span>Explore New Learning Paths</span>
                </Link>
                <Link
                  to="/student/roadmap/milestones"
                  className="flex items-center gap-3 p-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                >
                  <Target className="w-5 h-5" />
                  <span>Set New Milestone</span>
                </Link>
                <Link
                  to="/student/progress/analytics"
                  className="flex items-center gap-3 p-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
                >
                  <Star className="w-5 h-5" />
                  <span>View Progress Report</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapOverview;
