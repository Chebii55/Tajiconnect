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
    if (progress >= 80) return 'text-success bg-success-light/20 dark:text-darkMode-success dark:bg-darkMode-success/20';
    if (progress >= 60) return 'text-warning-dark bg-warning-light/20 dark:text-warning dark:bg-warning/20';
    if (progress >= 40) return 'text-accent-gold bg-accent-goldSoft/30 dark:text-darkMode-accent dark:bg-darkMode-accent/20';
    return 'text-error bg-error-light/20 dark:text-error-light dark:bg-error/20';
  };

  const getActivityStatus = (lastActive: string) => {
    const daysSince = Math.floor((Date.now() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSince === 0) return { text: 'Today', color: 'text-success dark:text-darkMode-success' };
    if (daysSince === 1) return { text: 'Yesterday', color: 'text-warning-dark dark:text-warning' };
    if (daysSince <= 7) return { text: `${daysSince} days ago`, color: 'text-accent-gold dark:text-darkMode-accent' };
    return { text: `${daysSince} days ago`, color: 'text-error dark:text-error-light' };
  };

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg font-['Inter']">
      {/* Header */}
      <div className="bg-neutral-white dark:bg-darkMode-surface shadow-sm border-b border-border-light dark:border-darkMode-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text">Learner Progress</h1>
              <p className="text-forest-sage dark:text-darkMode-textSecondary mt-1">
                Track and monitor your learners' progress across all courses
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button className="bg-primary dark:bg-darkMode-progress text-neutral-white px-4 py-2 rounded-lg hover:bg-primary-dark dark:hover:bg-darkMode-success transition-colors flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Message All
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-forest-sage dark:text-darkMode-textMuted" />
                <input
                  type="text"
                  placeholder="Search learners by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent bg-neutral-white dark:bg-darkMode-bg text-neutral-dark dark:text-darkMode-text"
                />
              </div>
            </div>

            {/* Course Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent bg-neutral-white dark:bg-darkMode-bg text-neutral-dark dark:text-darkMode-text"
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
                className="w-full px-3 py-2 border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent bg-neutral-white dark:bg-darkMode-bg text-neutral-dark dark:text-darkMode-text"
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
          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm p-6 border border-neutral-gray dark:border-darkMode-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Total Learners</p>
                <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">{filteredLearners.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary dark:text-darkMode-progress" />
            </div>
          </div>

          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm p-6 border border-neutral-gray dark:border-darkMode-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Avg. Progress</p>
                <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">
                  {filteredLearners.length > 0
                    ? Math.round(filteredLearners.reduce((sum, l) => sum + l.overallProgress, 0) / filteredLearners.length)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-success dark:text-darkMode-success" />
            </div>
          </div>

          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm p-6 border border-neutral-gray dark:border-darkMode-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Active This Week</p>
                <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">
                  {filteredLearners.filter(l =>
                    new Date(l.lastActive) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-secondary dark:text-darkMode-progress" />
            </div>
          </div>

          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm p-6 border border-neutral-gray dark:border-darkMode-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Certificates Earned</p>
                <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">
                  {filteredLearners.reduce((sum, l) =>
                    sum + l.achievements.filter(a => a.type === 'certificate').length, 0
                  )}
                </p>
              </div>
              <Award className="w-8 h-8 text-accent-gold dark:text-darkMode-accent" />
            </div>
          </div>
        </div>

        {/* Learners Table */}
        <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border overflow-hidden">
          <div className="p-6 border-b border-neutral-gray dark:border-darkMode-border">
            <h2 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text">Learner Details</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-light dark:bg-darkMode-surfaceHover">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-forest-sage dark:text-darkMode-textMuted uppercase tracking-wider">
                    Learner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-forest-sage dark:text-darkMode-textMuted uppercase tracking-wider">
                    Overall Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-forest-sage dark:text-darkMode-textMuted uppercase tracking-wider">
                    Courses Enrolled
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-forest-sage dark:text-darkMode-textMuted uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-forest-sage dark:text-darkMode-textMuted uppercase tracking-wider">
                    Achievements
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-forest-sage dark:text-darkMode-textMuted uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-neutral-white dark:bg-darkMode-surface divide-y divide-neutral-gray dark:divide-darkMode-border">
                {sortedLearners.map((learner) => {
                  const activityStatus = getActivityStatus(learner.lastActive);
                  return (
                    <tr key={learner.id} className="hover:bg-neutral-light dark:hover:bg-darkMode-surfaceHover">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-r from-primary-dark to-primary dark:from-darkMode-progress dark:to-darkMode-success rounded-full flex items-center justify-center text-neutral-white font-medium">
                            {learner.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">{learner.name}</div>
                            <div className="text-sm text-forest-sage dark:text-darkMode-textMuted">{learner.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-neutral-gray dark:bg-darkMode-surfaceHover rounded-full h-2 mr-3">
                            <div
                              className="bg-gradient-to-r from-primary-dark to-primary dark:from-darkMode-progress dark:to-darkMode-success h-2 rounded-full"
                              style={{ width: `${learner.overallProgress}%` }}
                            />
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getProgressColor(learner.overallProgress)}`}>
                            {learner.overallProgress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-neutral-dark dark:text-darkMode-text">{learner.enrolledCourses.length} courses</div>
                        <div className="text-sm text-forest-sage dark:text-darkMode-textMuted">
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
                            <Award className="w-4 h-4 text-accent-gold dark:text-darkMode-accent" />
                            <span className="text-sm text-forest-sage dark:text-darkMode-textSecondary">
                              {learner.achievements.length}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedLearner(learner.id)}
                            className="text-primary dark:text-darkMode-accent hover:text-primary-dark dark:hover:text-darkMode-accentHover flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                          <button className="text-info dark:text-darkMode-link hover:text-info-dark flex items-center gap-1">
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
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-neutral-gray dark:border-darkMode-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-neutral-dark dark:text-darkMode-text">
                    {learners.find(l => l.id === selectedLearner)?.name} - Detailed Progress
                  </h2>
                  <button
                    onClick={() => setSelectedLearner(null)}
                    className="text-forest-sage dark:text-darkMode-textMuted hover:text-neutral-dark dark:hover:text-darkMode-text"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6">
                {learners.find(l => l.id === selectedLearner)?.progress.map((progress) => (
                  <div key={progress.courseId} className="mb-6 p-4 border border-neutral-gray dark:border-darkMode-border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-neutral-dark dark:text-darkMode-text">{progress.courseName}</h3>
                      <span className="text-sm text-forest-sage dark:text-darkMode-textMuted">
                        Last activity: {new Date(progress.lastActivity).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">Progress</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex-1 bg-neutral-gray dark:bg-darkMode-surfaceHover rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-primary-dark to-primary dark:from-darkMode-progress dark:to-darkMode-success h-2 rounded-full"
                              style={{ width: `${progress.completionPercentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">{progress.completionPercentage}%</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">Time Spent</p>
                        <p className="text-lg font-medium mt-1 text-neutral-dark dark:text-darkMode-text">{Math.round(progress.timeSpent / 60)}h {progress.timeSpent % 60}m</p>
                      </div>

                      <div>
                        <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">Current Module</p>
                        <p className="text-sm font-medium mt-1 text-neutral-dark dark:text-darkMode-text">{progress.currentModule}</p>
                      </div>
                    </div>

                    {progress.grade && (
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-accent-gold dark:text-darkMode-accent" />
                        <span className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">Grade: {progress.grade}%</span>
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
