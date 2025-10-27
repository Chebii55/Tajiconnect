import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTrainer } from '../../../contexts/TrainerContext';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Users, 
  TrendingUp, 
  Clock, 
  MessageSquare,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';

const CourseLearners: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses, learners } = useTrainer();
  
  const course = courses.find(c => c.id === courseId);
  const courseLearners = learners.filter(learner => 
    learner.enrolledCourses.includes(courseId!)
  );

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Course Not Found</h2>
          <button
            onClick={() => navigate('/trainer/courses')}
            className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const filteredLearners = courseLearners.filter(learner => {
    const matchesSearch = learner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         learner.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    
    const progress = learner.progress.find(p => p.courseId === courseId);
    const completionRate = progress?.completionPercentage || 0;
    
    if (filterStatus === 'completed') return matchesSearch && completionRate >= 100;
    if (filterStatus === 'in-progress') return matchesSearch && completionRate > 0 && completionRate < 100;
    if (filterStatus === 'not-started') return matchesSearch && completionRate === 0;
    
    return matchesSearch;
  });

  const getProgressStatus = (learner: any) => {
    const progress = learner.progress.find((p: any) => p.courseId === courseId);
    const completionRate = progress?.completionPercentage || 0;
    
    if (completionRate >= 100) return { status: 'completed', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' };
    if (completionRate > 0) return { status: 'in-progress', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' };
    return { status: 'not-started', color: 'text-gray-600', bg: 'bg-gray-100 dark:bg-gray-600' };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-['Inter']">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/trainer/courses/${courseId}`)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Course Learners</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {course.title} • {courseLearners.length} enrolled
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Message All
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Enrolled</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{courseLearners.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {courseLearners.filter(l => {
                    const progress = l.progress.find((p: any) => p.courseId === courseId);
                    return (progress?.completionPercentage || 0) >= 100;
                  }).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {courseLearners.filter(l => {
                    const progress = l.progress.find((p: any) => p.courseId === courseId);
                    const rate = progress?.completionPercentage || 0;
                    return rate > 0 && rate < 100;
                  }).length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {courseLearners.length > 0 
                    ? Math.round(courseLearners.reduce((sum, l) => {
                        const progress = l.progress.find((p: any) => p.courseId === courseId);
                        return sum + (progress?.completionPercentage || 0);
                      }, 0) / courseLearners.length)
                    : 0}%
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search learners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-light focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Learners</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="not-started">Not Started</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Learners List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
          {filteredLearners.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Learners Found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No learners are enrolled in this course yet.'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Learner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Last Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Time Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {filteredLearners.map((learner) => {
                    const progress = learner.progress.find((p: any) => p.courseId === courseId);
                    const progressStatus = getProgressStatus(learner);
                    
                    return (
                      <tr key={learner.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-primary-light to-secondary rounded-full flex items-center justify-center text-white font-medium text-sm">
                              {learner.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {learner.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {learner.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-1 mr-4">
                              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                <div
                                  className="bg-primary-light h-2 rounded-full"
                                  style={{ width: `${progress?.completionPercentage || 0}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {progress?.completionPercentage || 0}%
                            </span>
                          </div>
                          <div className="mt-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${progressStatus.bg} ${progressStatus.color}`}>
                              {progressStatus.status.replace('-', ' ')}
                            </span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {progress?.lastActivity 
                              ? new Date(progress.lastActivity).toLocaleDateString()
                              : 'Never'
                            }
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            {progress?.timeSpent 
                              ? `${Math.round(progress.timeSpent / 60)}h ${progress.timeSpent % 60}m`
                              : '0h 0m'
                            }
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {progress?.grade ? (
                            <span className={`font-medium ${
                              progress.grade >= 90 ? 'text-green-600' :
                              progress.grade >= 80 ? 'text-blue-600' :
                              progress.grade >= 70 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {progress.grade}%
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/trainer/learners/${learner.id}`}
                              className="text-primary-light hover:text-primary"
                            >
                              View Details
                            </Link>
                            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseLearners;