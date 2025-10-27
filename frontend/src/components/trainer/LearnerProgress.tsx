import React, { useState } from 'react';
import { useTrainer } from '../../contexts/TrainerContext';
import { 
  Search, 
  Filter, 
  Users, 
  Clock, 
  Award, 
  TrendingUp, 
  TrendingDown,
  MessageSquare,
  Eye,
  Calendar,
  BookOpen,
  Star,
  MoreVertical
} from 'lucide-react';

const LearnerProgress: React.FC = () => {
  const { learners, courses } = useTrainer();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedLearner, setSelectedLearner] = useState<string | null>(null);

  const filteredLearners = learners.filter(learner => {
    const matchesSearch = learner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         learner.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = selectedCourse === 'all' || 
                         learner.enrolledCourses.includes(selectedCourse);
    return matchesSearch && matchesCourse;
  });

  const sortedLearners = [...filteredLearners].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'progress':
        return b.overallProgress - a.overallProgress;
      case 'lastActive':
        return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
      case 'joinedDate':
        return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
      default:
        return 0;
    }
  });

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600 bg-green-100';
    if (progress >= 60) return 'text-yellow-600 bg-yellow-100';
    if (progress >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getActivityStatus = (lastActive: string) => {
    const daysSince = Math.floor((Date.now() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince === 0) return { text: 'Today', color: 'text-green-600' };
    if (daysSince === 1) return { text: 'Yesterday', color: 'text-yellow-600' };
    if (daysSince <= 7) return { text: `${daysSince} days ago`, color: 'text-orange-600' };
    return { text: `${daysSince} days ago`, color: 'text-red-600' };
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Learner Progress</h1>
              <p className="text-gray-600 mt-1">
                Track and monitor your learners' progress across all courses
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Message All
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search learners by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Course Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Courses</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="progress">Sort by Progress</option>
                <option value="lastActive">Sort by Last Active</option>
                <option value="joinedDate">Sort by Join Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Learners</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{filteredLearners.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Progress</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {filteredLearners.length > 0 
                    ? Math.round(filteredLearners.reduce((sum, l) => sum + l.overallProgress, 0) / filteredLearners.length)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active This Week</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {filteredLearners.filter(l => 
                    new Date(l.lastActive) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Certificates Earned</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {filteredLearners.reduce((sum, l) => 
                    sum + l.achievements.filter(a => a.type === 'certificate').length, 0
                  )}
                </p>
              </div>
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Learners Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Learner Details</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Learner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Overall Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Courses Enrolled
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Achievements
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedLearners.map((learner) => {
                  const activityStatus = getActivityStatus(learner.lastActive);
                  return (
                    <tr key={learner.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                            {learner.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{learner.name}</div>
                            <div className="text-sm text-gray-500">{learner.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full" 
                              style={{ width: `${learner.overallProgress}%` }}
                            />
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getProgressColor(learner.overallProgress)}`}>
                            {learner.overallProgress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{learner.enrolledCourses.length} courses</div>
                        <div className="text-sm text-gray-500">
                          {learner.progress.length} in progress
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm ${activityStatus.color}`}>
                          {activityStatus.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Award className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm text-gray-600">
                              {learner.achievements.length}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setSelectedLearner(learner.id)}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button className="text-blue-600 hover:text-blue-900 flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            Message
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detailed Progress Modal */}
        {selectedLearner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {learners.find(l => l.id === selectedLearner)?.name} - Detailed Progress
                  </h2>
                  <button 
                    onClick={() => setSelectedLearner(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {learners.find(l => l.id === selectedLearner)?.progress.map((progress) => (
                  <div key={progress.courseId} className="mb-6 p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-gray-900">{progress.courseName}</h3>
                      <span className="text-sm text-gray-500">
                        Last activity: {new Date(progress.lastActivity).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Progress</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${progress.completionPercentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{progress.completionPercentage}%</span>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Time Spent</p>
                        <p className="text-lg font-medium mt-1">{Math.round(progress.timeSpent / 60)}h {progress.timeSpent % 60}m</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600">Current Module</p>
                        <p className="text-sm font-medium mt-1">{progress.currentModule}</p>
                      </div>
                    </div>
                    
                    {progress.grade && (
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">Grade: {progress.grade}%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnerProgress;