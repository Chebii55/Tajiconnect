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
      <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mb-2">Course Not Found</h2>
          <button
            onClick={() => navigate('/trainer/courses')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
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

    if (completionRate >= 100) return { status: 'completed', color: 'text-success dark:text-darkMode-success', bg: 'bg-success/10 dark:bg-darkMode-success/20' };
    if (completionRate > 0) return { status: 'in-progress', color: 'text-primary dark:text-darkMode-accent', bg: 'bg-primary/10 dark:bg-darkMode-accent/20' };
    return { status: 'not-started', color: 'text-forest-sage dark:text-darkMode-textSecondary', bg: 'bg-neutral-gray dark:bg-darkMode-surface' };
  };

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg font-['Inter']">
      {/* Header */}
      <div className="bg-neutral-white dark:bg-darkMode-surface shadow-sm border-b dark:border-darkMode-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/trainer/courses/${courseId}`)}
                className="p-2 text-forest-sage hover:text-neutral-dark dark:text-darkMode-textSecondary dark:hover:text-darkMode-text rounded-lg hover:bg-neutral-gray dark:hover:bg-darkMode-navbar"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text">Course Learners</h1>
                <p className="text-forest-sage dark:text-darkMode-textSecondary mt-1">
                  {course.title} • {courseLearners.length} enrolled
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2">
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
          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg p-6 border border-neutral-gray dark:border-darkMode-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Total Enrolled</p>
                <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">{courseLearners.length}</p>
              </div>
              <Users className="w-8 h-8 text-primary dark:text-darkMode-accent" />
            </div>
          </div>

          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg p-6 border border-neutral-gray dark:border-darkMode-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Completed</p>
                <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">
                  {courseLearners.filter(l => {
                    const progress = l.progress.find((p: any) => p.courseId === courseId);
                    return (progress?.completionPercentage || 0) >= 100;
                  }).length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-success dark:text-darkMode-success" />
            </div>
          </div>

          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg p-6 border border-neutral-gray dark:border-darkMode-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">In Progress</p>
                <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">
                  {courseLearners.filter(l => {
                    const progress = l.progress.find((p: any) => p.courseId === courseId);
                    const rate = progress?.completionPercentage || 0;
                    return rate > 0 && rate < 100;
                  }).length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-accent-gold dark:text-darkMode-accent" />
            </div>
          </div>

          <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg p-6 border border-neutral-gray dark:border-darkMode-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Avg. Progress</p>
                <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">
                  {courseLearners.length > 0
                    ? Math.round(courseLearners.reduce((sum, l) => {
                        const progress = l.progress.find((p: any) => p.courseId === courseId);
                        return sum + (progress?.completionPercentage || 0);
                      }, 0) / courseLearners.length)
                    : 0}%
                </p>
              </div>
              <Clock className="w-8 h-8 text-secondary dark:text-darkMode-accent" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg border border-neutral-gray dark:border-darkMode-border p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-forest-sage dark:text-darkMode-textMuted" />
                <input
                  type="text"
                  placeholder="Search learners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-neutral-gray dark:border-darkMode-border rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-forest-sage dark:text-darkMode-textMuted" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-neutral-gray dark:border-darkMode-border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary dark:focus:ring-darkMode-focus focus:border-transparent dark:bg-darkMode-navbar dark:text-darkMode-text"
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
        <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg border border-neutral-gray dark:border-darkMode-border overflow-hidden">
          {filteredLearners.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-forest-sage dark:text-darkMode-textMuted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-dark dark:text-darkMode-text mb-2">No Learners Found</h3>
              <p className="text-forest-sage dark:text-darkMode-textSecondary">
                {searchTerm || filterStatus !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No learners are enrolled in this course yet.'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-light dark:bg-darkMode-navbar">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-forest-sage dark:text-darkMode-textSecondary uppercase tracking-wider">
                      Learner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-forest-sage dark:text-darkMode-textSecondary uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-forest-sage dark:text-darkMode-textSecondary uppercase tracking-wider">
                      Last Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-forest-sage dark:text-darkMode-textSecondary uppercase tracking-wider">
                      Time Spent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-forest-sage dark:text-darkMode-textSecondary uppercase tracking-wider">
                      Grade
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-forest-sage dark:text-darkMode-textSecondary uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-gray dark:divide-darkMode-border">
                  {filteredLearners.map((learner) => {
                    const progress = learner.progress.find((p: any) => p.courseId === courseId);
                    const progressStatus = getProgressStatus(learner);

                    return (
                      <tr key={learner.id} className="hover:bg-neutral-light dark:hover:bg-darkMode-navbar">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-primary-dark to-primary dark:from-darkMode-progress dark:to-darkMode-success rounded-full flex items-center justify-center text-white font-medium text-sm">
                              {learner.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">
                                {learner.name}
                              </div>
                              <div className="text-sm text-forest-sage dark:text-darkMode-textSecondary">
                                {learner.email}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-1 mr-4">
                              <div className="w-full bg-neutral-gray dark:bg-darkMode-navbar rounded-full h-2">
                                <div
                                  className="bg-primary dark:bg-darkMode-progress h-2 rounded-full"
                                  style={{ width: `${progress?.completionPercentage || 0}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">
                              {progress?.completionPercentage || 0}%
                            </span>
                          </div>
                          <div className="mt-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${progressStatus.bg} ${progressStatus.color}`}>
                              {progressStatus.status.replace('-', ' ')}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark dark:text-darkMode-text">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-forest-sage dark:text-darkMode-textMuted" />
                            {progress?.lastActivity
                              ? new Date(progress.lastActivity).toLocaleDateString()
                              : 'Never'
                            }
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark dark:text-darkMode-text">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-forest-sage dark:text-darkMode-textMuted" />
                            {progress?.timeSpent
                              ? `${Math.round(progress.timeSpent / 60)}h ${progress.timeSpent % 60}m`
                              : '0h 0m'
                            }
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-dark dark:text-darkMode-text">
                          {progress?.grade ? (
                            <span className={`font-medium ${
                              progress.grade >= 90 ? 'text-success dark:text-darkMode-success' :
                              progress.grade >= 80 ? 'text-primary dark:text-darkMode-accent' :
                              progress.grade >= 70 ? 'text-accent-gold dark:text-darkMode-accent' :
                              'text-error'
                            }`}>
                              {progress.grade}%
                            </span>
                          ) : (
                            <span className="text-forest-sage dark:text-darkMode-textMuted">-</span>
                          )}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/trainer/learners/${learner.id}`}
                              className="text-primary hover:text-primary-dark dark:text-darkMode-accent dark:hover:text-darkMode-text"
                            >
                              View Details
                            </Link>
                            <button className="text-forest-sage hover:text-neutral-dark dark:text-darkMode-textSecondary dark:hover:text-darkMode-text">
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
