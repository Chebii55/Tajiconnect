import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Target,
  Clock,
  CheckCircle,
  Circle,
  AlertCircle,
  Plus,
  Filter,
  TrendingUp,
  Award,
  ChevronRight,
  Edit,
  Trash2
} from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description: string;
  category: 'personal' | 'course' | 'career' | 'skill';
  priority: 'low' | 'medium' | 'high';
  status: 'upcoming' | 'in-progress' | 'completed' | 'overdue';
  startDate: string;
  dueDate: string;
  completedDate?: string;
  progress: number;
  estimatedHours: number;
  actualHours?: number;
  learningPath?: string;
  skills: string[];
  tasks: Task[];
  notes: string;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

interface MilestoneStats {
  total: number;
  completed: number;
  inProgress: number;
  overdue: number;
  completionRate: number;
  averageCompletionTime: number;
}

const MilestoneTracker: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'in-progress' | 'completed' | 'overdue'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const mockStats: MilestoneStats = {
    total: 12,
    completed: 7,
    inProgress: 3,
    overdue: 1,
    completionRate: 85,
    averageCompletionTime: 18.5
  };

  const mockMilestones: Milestone[] = [
    {
      id: '1',
      title: 'Complete React Fundamentals',
      description: 'Master React components, hooks, and state management to build dynamic user interfaces',
      category: 'course',
      priority: 'high',
      status: 'in-progress',
      startDate: '2024-11-01',
      dueDate: '2024-12-15',
      progress: 75,
      estimatedHours: 40,
      actualHours: 32,
      learningPath: 'Full-Stack Web Developer',
      skills: ['React', 'JSX', 'Components', 'State Management', 'Hooks'],
      tasks: [
        { id: '1', title: 'Complete React Basics course', completed: true },
        { id: '2', title: 'Build three practice projects', completed: true },
        { id: '3', title: 'Learn React Hooks', completed: false, dueDate: '2024-12-10' },
        { id: '4', title: 'Pass final assessment', completed: false, dueDate: '2024-12-15' }
      ],
      notes: 'Focus on practical projects to reinforce learning'
    },
    {
      id: '2',
      title: 'Build Portfolio Website',
      description: 'Create a professional portfolio showcasing completed projects and skills',
      category: 'personal',
      priority: 'high',
      status: 'upcoming',
      startDate: '2024-12-16',
      dueDate: '2025-01-15',
      progress: 0,
      estimatedHours: 25,
      learningPath: 'Full-Stack Web Developer',
      skills: ['React', 'CSS', 'Responsive Design', 'Git', 'Deployment'],
      tasks: [
        { id: '5', title: 'Design portfolio layout', completed: false },
        { id: '6', title: 'Develop homepage', completed: false },
        { id: '7', title: 'Add project showcases', completed: false },
        { id: '8', title: 'Deploy to production', completed: false }
      ],
      notes: 'Include at least 3 major projects'
    },
    {
      id: '3',
      title: 'JavaScript Certification',
      description: 'Obtain official JavaScript certification to validate fundamental programming skills',
      category: 'skill',
      priority: 'medium',
      status: 'completed',
      startDate: '2024-09-01',
      dueDate: '2024-10-30',
      completedDate: '2024-10-25',
      progress: 100,
      estimatedHours: 35,
      actualHours: 38,
      skills: ['JavaScript', 'ES6+', 'Async Programming', 'DOM Manipulation'],
      tasks: [
        { id: '9', title: 'Study JavaScript fundamentals', completed: true },
        { id: '10', title: 'Practice coding challenges', completed: true },
        { id: '11', title: 'Take practice exams', completed: true },
        { id: '12', title: 'Pass certification exam', completed: true }
      ],
      notes: 'Achieved 92% score on certification exam'
    },
    {
      id: '4',
      title: 'Land First Developer Job',
      description: 'Secure a position as a junior web developer at a tech company',
      category: 'career',
      priority: 'high',
      status: 'in-progress',
      startDate: '2024-11-15',
      dueDate: '2025-03-01',
      progress: 30,
      estimatedHours: 60,
      actualHours: 18,
      skills: ['Interview Skills', 'Technical Communication', 'Problem Solving'],
      tasks: [
        { id: '13', title: 'Update resume and LinkedIn', completed: true },
        { id: '14', title: 'Apply to 20 companies', completed: false, dueDate: '2024-12-31' },
        { id: '15', title: 'Complete 5 technical interviews', completed: false },
        { id: '16', title: 'Negotiate job offer', completed: false }
      ],
      notes: 'Focus on companies with good mentorship programs'
    },
    {
      id: '5',
      title: 'Learn Database Design',
      description: 'Master SQL and database design principles for backend development',
      category: 'course',
      priority: 'medium',
      status: 'overdue',
      startDate: '2024-10-01',
      dueDate: '2024-11-30',
      progress: 45,
      estimatedHours: 30,
      actualHours: 20,
      learningPath: 'Full-Stack Web Developer',
      skills: ['SQL', 'Database Design', 'MongoDB', 'PostgreSQL'],
      tasks: [
        { id: '17', title: 'Complete SQL basics', completed: true },
        { id: '18', title: 'Learn database normalization', completed: true },
        { id: '19', title: 'Practice complex queries', completed: false, dueDate: '2024-11-20' },
        { id: '20', title: 'Build database project', completed: false, dueDate: '2024-11-30' }
      ],
      notes: 'Behind schedule due to other priorities'
    }
  ];

  const categories = ['all', 'personal', 'course', 'career', 'skill'];
  const filters = ['all', 'upcoming', 'in-progress', 'completed', 'overdue'];

  const filteredMilestones = mockMilestones.filter(milestone => {
    const matchesFilter = selectedFilter === 'all' || milestone.status === selectedFilter;
    const matchesCategory = selectedCategory === 'all' || milestone.category === selectedCategory;
    return matchesFilter && matchesCategory;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-6 h-6 text-success dark:text-darkMode-success" />;
      case 'in-progress': return <Clock className="w-6 h-6 text-info dark:text-darkMode-link" />;
      case 'overdue': return <AlertCircle className="w-6 h-6 text-error dark:text-error-light" />;
      default: return <Circle className="w-6 h-6 text-gray-400 dark:text-darkMode-textMuted" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-success dark:text-darkMode-success bg-success/10 dark:bg-darkMode-success/20';
      case 'in-progress': return 'text-info dark:text-darkMode-link bg-info/10 dark:bg-darkMode-link/20';
      case 'overdue': return 'text-error dark:text-error-light bg-error/10 dark:bg-error/20';
      default: return 'text-neutral-dark dark:text-darkMode-textSecondary bg-neutral-gray dark:bg-darkMode-surface';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-error dark:text-error-light bg-error/10 dark:bg-error/20';
      case 'medium': return 'text-warning dark:text-warning-light bg-warning/10 dark:bg-warning/20';
      case 'low': return 'text-success dark:text-darkMode-success bg-success/10 dark:bg-darkMode-success/20';
      default: return 'text-neutral-dark dark:text-darkMode-textSecondary bg-neutral-gray dark:bg-darkMode-surface';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'personal': return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30';
      case 'course': return 'text-info dark:text-darkMode-link bg-info/10 dark:bg-darkMode-link/20';
      case 'career': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30';
      case 'skill': return 'text-success dark:text-darkMode-success bg-success/10 dark:bg-darkMode-success/20';
      default: return 'text-neutral-dark dark:text-darkMode-textSecondary bg-neutral-gray dark:bg-darkMode-surface';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-light to-primary/10 dark:from-darkMode-bg dark:to-darkMode-surface font-['Inter']">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-dark dark:bg-darkMode-navbar rounded-lg">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-primary-dark dark:text-darkMode-text">Milestone Tracker</h1>
                <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary">Track your learning goals and achievements</p>
              </div>
            </div>
            <button
              onClick={() => {/* TODO: Implement create modal */}}
              className="flex items-center gap-2 px-6 py-3 bg-secondary dark:bg-darkMode-success text-white rounded-lg hover:bg-secondary-dark dark:hover:bg-darkMode-progress transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Milestone
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6 border-l-4 border-secondary dark:border-darkMode-success">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">Total</p>
                <p className="text-2xl font-bold text-primary-dark dark:text-darkMode-text">{mockStats.total}</p>
              </div>
              <Target className="w-8 h-8 text-secondary dark:text-darkMode-success" />
            </div>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6 border-l-4 border-success dark:border-darkMode-success">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">Completed</p>
                <p className="text-2xl font-bold text-primary-dark dark:text-darkMode-text">{mockStats.completed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success dark:text-darkMode-success" />
            </div>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6 border-l-4 border-info dark:border-darkMode-link">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">In Progress</p>
                <p className="text-2xl font-bold text-primary-dark dark:text-darkMode-text">{mockStats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-info dark:text-darkMode-link" />
            </div>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6 border-l-4 border-error dark:border-error-light">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">Overdue</p>
                <p className="text-2xl font-bold text-primary-dark dark:text-darkMode-text">{mockStats.overdue}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-error dark:text-error-light" />
            </div>
          </div>

          <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6 border-l-4 border-purple-500 dark:border-purple-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">Success Rate</p>
                <p className="text-2xl font-bold text-primary-dark dark:text-darkMode-text">{mockStats.completionRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-neutral-dark/60 dark:text-darkMode-textMuted" />
              <span className="font-medium text-neutral-dark dark:text-darkMode-textSecondary">Filter by:</span>
            </div>

            <div className="flex gap-2">
              {filters.map(filter => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter as 'all' | 'upcoming' | 'in-progress' | 'completed' | 'overdue')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedFilter === filter
                      ? 'bg-primary-light dark:bg-darkMode-progress text-white'
                      : 'bg-neutral-gray dark:bg-darkMode-surfaceHover text-neutral-dark dark:text-darkMode-textSecondary hover:bg-gray-200 dark:hover:bg-darkMode-border'
                  }`}
                >
                  {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>

            <div className="border-l border-gray-300 dark:border-darkMode-border h-6"></div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-darkMode-focus focus:border-transparent bg-white dark:bg-darkMode-surface text-neutral-dark dark:text-darkMode-text"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Milestones List */}
        <div className="space-y-6">
          {filteredMilestones.map((milestone) => (
            <div key={milestone.id} className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark overflow-hidden hover:shadow-xl dark:hover:shadow-dark-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-grow">
                    <div className="flex-shrink-0 mt-1">
                      {getStatusIcon(milestone.status)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-primary-dark dark:text-darkMode-text mb-1">{milestone.title}</h3>
                          <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary mb-3">{milestone.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                              {milestone.status.replace('-', ' ')}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(milestone.priority)}`}>
                              {milestone.priority} priority
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(milestone.category)}`}>
                              {milestone.category}
                            </span>
                            {milestone.learningPath && (
                              <span className="px-2 py-1 bg-neutral-gray dark:bg-darkMode-surfaceHover text-neutral-dark dark:text-darkMode-textSecondary rounded-full text-xs">
                                {milestone.learningPath}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 dark:text-darkMode-textMuted hover:text-gray-600 dark:hover:text-darkMode-text transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 dark:text-darkMode-textMuted hover:text-error dark:hover:text-error-light transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-sm">
                          <span className="text-neutral-dark/60 dark:text-darkMode-textMuted">Start Date:</span>
                          <p className="font-medium text-neutral-dark dark:text-darkMode-text">{formatDate(milestone.startDate)}</p>
                        </div>
                        <div className="text-sm">
                          <span className="text-neutral-dark/60 dark:text-darkMode-textMuted">Due Date:</span>
                          <p className="font-medium text-neutral-dark dark:text-darkMode-text">{formatDate(milestone.dueDate)}</p>
                          {milestone.status !== 'completed' && (
                            <p className={`text-xs ${getDaysUntilDue(milestone.dueDate) < 0 ? 'text-error dark:text-error-light' : getDaysUntilDue(milestone.dueDate) < 7 ? 'text-warning dark:text-warning-light' : 'text-neutral-dark/60 dark:text-darkMode-textMuted'}`}>
                              {getDaysUntilDue(milestone.dueDate) < 0
                                ? `${Math.abs(getDaysUntilDue(milestone.dueDate))} days overdue`
                                : `${getDaysUntilDue(milestone.dueDate)} days remaining`}
                            </p>
                          )}
                        </div>
                        <div className="text-sm">
                          <span className="text-neutral-dark/60 dark:text-darkMode-textMuted">Time Investment:</span>
                          <p className="font-medium text-neutral-dark dark:text-darkMode-text">
                            {milestone.actualHours || 0}h / {milestone.estimatedHours}h
                          </p>
                        </div>
                      </div>

                      {milestone.status !== 'completed' && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-neutral-dark dark:text-darkMode-textSecondary">Progress</span>
                            <span className="text-neutral-dark dark:text-darkMode-text">{milestone.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-darkMode-border rounded-full h-2">
                            <div
                              className="bg-secondary dark:bg-darkMode-success h-2 rounded-full transition-all duration-300"
                              style={{ width: `${milestone.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {milestone.skills.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">Skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {milestone.skills.map((skill) => (
                              <span key={skill} className="px-2 py-1 bg-info/10 dark:bg-darkMode-link/20 text-info dark:text-darkMode-link text-xs rounded-full">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mb-4">
                        <p className="text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-2">Tasks ({milestone.tasks.filter(t => t.completed).length}/{milestone.tasks.length}):</p>
                        <div className="space-y-1">
                          {milestone.tasks.slice(0, 3).map((task) => (
                            <div key={task.id} className="flex items-center gap-2 text-sm">
                              <CheckCircle className={`w-4 h-4 ${task.completed ? 'text-success dark:text-darkMode-success' : 'text-gray-300 dark:text-darkMode-textMuted'}`} />
                              <span className={task.completed ? 'text-neutral-dark/60 dark:text-darkMode-textMuted line-through' : 'text-neutral-dark dark:text-darkMode-textSecondary'}>
                                {task.title}
                              </span>
                              {task.dueDate && !task.completed && (
                                <span className="text-xs text-neutral-dark/60 dark:text-darkMode-textMuted">
                                  (due {formatDate(task.dueDate)})
                                </span>
                              )}
                            </div>
                          ))}
                          {milestone.tasks.length > 3 && (
                            <p className="text-xs text-neutral-dark/60 dark:text-darkMode-textMuted">+{milestone.tasks.length - 3} more tasks</p>
                          )}
                        </div>
                      </div>

                      {milestone.notes && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-neutral-dark dark:text-darkMode-textSecondary mb-1">Notes:</p>
                          <p className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary italic">{milestone.notes}</p>
                        </div>
                      )}

                      {milestone.completedDate && (
                        <div className="flex items-center gap-2 p-3 bg-success/10 dark:bg-darkMode-success/20 rounded-lg">
                          <Award className="w-5 h-5 text-success dark:text-darkMode-success" />
                          <span className="text-sm font-medium text-success-dark dark:text-darkMode-successLight">
                            Completed on {formatDate(milestone.completedDate)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-darkMode-border">
                  <Link
                    to={`/student/roadmap/milestones/${milestone.id}`}
                    className="inline-flex items-center gap-2 text-primary-light dark:text-darkMode-accent hover:text-primary-dark dark:hover:text-darkMode-accentHover transition-colors"
                  >
                    View Details <ChevronRight className="w-4 h-4" />
                  </Link>

                  {milestone.status === 'in-progress' && (
                    <button className="px-4 py-2 bg-secondary dark:bg-darkMode-success text-white rounded-lg hover:bg-secondary-dark dark:hover:bg-darkMode-progress transition-colors">
                      Update Progress
                    </button>
                  )}

                  {milestone.status === 'upcoming' && (
                    <button className="px-4 py-2 bg-primary-light dark:bg-darkMode-progress text-white rounded-lg hover:bg-primary dark:hover:bg-darkMode-success transition-colors">
                      Start Milestone
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMilestones.length === 0 && (
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-400 dark:text-darkMode-textMuted mx-auto mb-4" />
            <h3 className="text-xl font-medium text-neutral-dark dark:text-darkMode-text mb-2">No milestones found</h3>
            <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary mb-6">Create your first milestone to start tracking your learning goals.</p>
            <button
              onClick={() => {/* TODO: Implement create modal */}}
              className="px-6 py-3 bg-secondary dark:bg-darkMode-success text-white rounded-lg hover:bg-secondary-dark dark:hover:bg-darkMode-progress transition-colors"
            >
              Create Milestone
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MilestoneTracker;
