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
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'not-started': return 'text-gray-600 bg-gray-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-600 bg-green-100';
      case 'Intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getMilestoneIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress': return <Clock className="w-5 h-5 text-blue-600" />;
      case 'overdue': return <Circle className="w-5 h-5 text-red-600" />;
      default: return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-['Inter']">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-[#1C3D6E] rounded-lg">
              <Map className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#1C3D6E]">Roadmap Overview</h1>
              <p className="text-gray-600">Manage your learning paths and milestones</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#4A9E3D]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Paths</p>
                <p className="text-2xl font-bold text-[#1C3D6E]">2</p>
              </div>
              <Map className="w-8 h-8 text-[#4A9E3D]" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#3DAEDB]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Progress</p>
                <p className="text-2xl font-bold text-[#1C3D6E]">48%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-[#3DAEDB]" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-[#2C857A]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Milestones</p>
                <p className="text-2xl font-bold text-[#1C3D6E]">1/3</p>
              </div>
              <Target className="w-8 h-8 text-[#2C857A]" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Est. Hours</p>
                <p className="text-2xl font-bold text-[#1C3D6E]">420h</p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search learning paths..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DAEDB] focus:border-transparent"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DAEDB] focus:border-transparent"
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
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#3DAEDB] focus:border-transparent"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Statuses' : status.replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-[#1C3D6E] text-white rounded-lg hover:bg-[#2A4F7C] transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Learning Paths */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-[#1C3D6E]">Learning Paths</h2>
              <Link
                to="/student/courses"
                className="text-[#3DAEDB] hover:text-[#1C3D6E] font-medium"
              >
                Browse All Paths
              </Link>
            </div>

            <div className="space-y-4">
              {filteredPaths.map((path) => (
                <div key={path.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-[#1C3D6E] mb-1">{path.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{path.description}</p>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-gray-500">{path.duration}</span>
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
                      <span>Progress</span>
                      <span>{path.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#4A9E3D] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${path.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {path.completedCourses} of {path.totalCourses} courses • {path.estimatedHours}h total
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Key Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {path.skills.slice(0, 3).map((skill) => (
                        <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                      {path.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{path.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <Link
                      to={`/student/roadmap/learning-path`}
                      className="inline-flex items-center gap-2 text-[#3DAEDB] hover:text-[#1C3D6E] transition-colors"
                    >
                      View Details <ChevronRight className="w-4 h-4" />
                    </Link>
                    {path.status === 'in-progress' && (
                      <button className="px-4 py-2 bg-[#4A9E3D] text-white text-sm rounded-lg hover:bg-[#3A7B30] transition-colors">
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
              <h2 className="text-2xl font-bold text-[#1C3D6E]">Upcoming Milestones</h2>
              <Link
                to="/student/roadmap/milestones"
                className="text-[#3DAEDB] hover:text-[#1C3D6E] font-medium"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {mockMilestones.map((milestone) => (
                <div key={milestone.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getMilestoneIcon(milestone.status)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-[#1C3D6E]">{milestone.title}</h3>
                          <p className="text-gray-600 text-sm">{milestone.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{milestone.pathTitle}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(milestone.status)}`}>
                          {milestone.status.replace('-', ' ')}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                        <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                        <span>{milestone.progress}%</span>
                      </div>

                      {milestone.status === 'in-progress' && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-[#3DAEDB] h-1.5 rounded-full"
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
            <div className="bg-gradient-to-r from-[#1C3D6E] to-[#3DAEDB] rounded-xl p-6 text-white">
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