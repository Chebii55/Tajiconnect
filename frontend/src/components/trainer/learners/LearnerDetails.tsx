import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTrainer } from '../../../contexts/TrainerContext';
import {
  ArrowLeft,
  MessageSquare,
  Mail,
  Calendar,
  Clock,
  TrendingUp,
  Award,
  BookOpen,
  Star,
  Activity,
  User,
  BarChart3
} from 'lucide-react';

const LearnerDetails: React.FC = () => {
  const { learnerId } = useParams();
  const navigate = useNavigate();
  const { learners, courses } = useTrainer();

  const learner = learners.find(l => l.id === learnerId);
  const [activeTab, setActiveTab] = useState('overview');

  if (!learner) {
    return (
      <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mb-2">Learner Not Found</h2>
          <button
            onClick={() => navigate('/trainer/learners')}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Back to Learners
          </button>
        </div>
      </div>
    );
  }

  const enrolledCourses = courses.filter(course =>
    learner.enrolledCourses.includes(course.id)
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'activity', label: 'Activity', icon: Activity }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Learner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg p-6 border border-neutral-gray dark:border-darkMode-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Courses Enrolled</p>
              <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">{learner.enrolledCourses.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-primary dark:text-darkMode-accent" />
          </div>
        </div>

        <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg p-6 border border-neutral-gray dark:border-darkMode-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Overall Progress</p>
              <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">{learner.overallProgress}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-success dark:text-darkMode-success" />
          </div>
        </div>

        <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg p-6 border border-neutral-gray dark:border-darkMode-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Achievements</p>
              <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">{learner.achievements.length}</p>
            </div>
            <Award className="w-8 h-8 text-accent-gold dark:text-darkMode-accent" />
          </div>
        </div>

        <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg p-6 border border-neutral-gray dark:border-darkMode-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-forest-sage dark:text-darkMode-textSecondary">Total Time</p>
              <p className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mt-1">
                {Math.round(learner.progress.reduce((sum, p) => sum + p.timeSpent, 0) / 60)}h
              </p>
            </div>
            <Clock className="w-8 h-8 text-secondary dark:text-darkMode-accent" />
          </div>
        </div>
      </div>

      {/* Course Progress */}
      <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg border border-neutral-gray dark:border-darkMode-border p-6">
        <h3 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-6">Course Progress</h3>

        {enrolledCourses.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-12 h-12 text-forest-sage dark:text-darkMode-textMuted mx-auto mb-4" />
            <p className="text-forest-sage dark:text-darkMode-textSecondary">No courses enrolled yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {enrolledCourses.map((course) => {
              const progress = learner.progress.find(p => p.courseId === course.id);
              return (
                <div key={course.id} className="border border-neutral-gray dark:border-darkMode-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-neutral-dark dark:text-darkMode-text">{course.title}</h4>
                      <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">{course.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-neutral-dark dark:text-darkMode-text">
                        {progress?.completionPercentage || 0}%
                      </p>
                      {progress?.grade && (
                        <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">
                          Grade: {progress.grade}%
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="w-full bg-neutral-gray dark:bg-darkMode-navbar rounded-full h-2 mb-3">
                    <div
                      className="bg-primary dark:bg-darkMode-progress h-2 rounded-full"
                      style={{ width: `${progress?.completionPercentage || 0}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm text-forest-sage dark:text-darkMode-textSecondary">
                    <span>Current: {progress?.currentModule || 'Not started'}</span>
                    <span>
                      Last activity: {progress?.lastActivity
                        ? new Date(progress.lastActivity).toLocaleDateString()
                        : 'Never'
                      }
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg border border-neutral-gray dark:border-darkMode-border p-6">
      <h3 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-6">Detailed Progress</h3>
      <div className="text-center py-12">
        <BarChart3 className="w-16 h-16 text-forest-sage dark:text-darkMode-textMuted mx-auto mb-4" />
        <h3 className="text-lg font-medium text-neutral-dark dark:text-darkMode-text mb-2">Progress Analytics</h3>
        <p className="text-forest-sage dark:text-darkMode-textSecondary">
          Detailed progress analytics coming soon
        </p>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg border border-neutral-gray dark:border-darkMode-border p-6">
      <h3 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-6">Achievements & Badges</h3>

      {learner.achievements.length === 0 ? (
        <div className="text-center py-8">
          <Award className="w-12 h-12 text-forest-sage dark:text-darkMode-textMuted mx-auto mb-4" />
          <p className="text-forest-sage dark:text-darkMode-textSecondary">No achievements earned yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {learner.achievements.map((achievement) => (
            <div key={achievement.id} className="border border-neutral-gray dark:border-darkMode-border rounded-lg p-4 text-center">
              <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                achievement.type === 'badge' ? 'bg-primary/10 dark:bg-darkMode-accent/20' :
                achievement.type === 'certificate' ? 'bg-success/10 dark:bg-darkMode-success/20' :
                'bg-secondary/10 dark:bg-darkMode-accent/20'
              }`}>
                <Award className={`w-6 h-6 ${
                  achievement.type === 'badge' ? 'text-primary dark:text-darkMode-accent' :
                  achievement.type === 'certificate' ? 'text-success dark:text-darkMode-success' :
                  'text-secondary dark:text-darkMode-accent'
                }`} />
              </div>
              <h4 className="font-medium text-neutral-dark dark:text-darkMode-text mb-1">{achievement.name}</h4>
              <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">
                Earned {new Date(achievement.earnedDate).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderActivity = () => (
    <div className="bg-neutral-white dark:bg-darkMode-surface rounded-lg border border-neutral-gray dark:border-darkMode-border p-6">
      <h3 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-6">Recent Activity</h3>
      <div className="text-center py-12">
        <Activity className="w-16 h-16 text-forest-sage dark:text-darkMode-textMuted mx-auto mb-4" />
        <h3 className="text-lg font-medium text-neutral-dark dark:text-darkMode-text mb-2">Activity Timeline</h3>
        <p className="text-forest-sage dark:text-darkMode-textSecondary">
          Activity timeline coming soon
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg font-['Inter']">
      {/* Header */}
      <div className="bg-neutral-white dark:bg-darkMode-surface shadow-sm border-b dark:border-darkMode-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/trainer/learners')}
                className="p-2 text-forest-sage hover:text-neutral-dark dark:text-darkMode-textSecondary dark:hover:text-darkMode-text rounded-lg hover:bg-neutral-gray dark:hover:bg-darkMode-navbar"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-dark to-primary dark:from-darkMode-progress dark:to-darkMode-success rounded-full flex items-center justify-center text-white font-medium">
                  {learner.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text">{learner.name}</h1>
                  <p className="text-forest-sage dark:text-darkMode-textSecondary mt-1">
                    Joined {new Date(learner.joinedDate).toLocaleDateString()} •
                    Last active {new Date(learner.lastActive).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-neutral-dark dark:text-darkMode-textSecondary border border-neutral-gray dark:border-darkMode-border rounded-lg hover:bg-neutral-light dark:hover:bg-darkMode-navbar flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </button>
              <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Message
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-neutral-gray dark:border-darkMode-border mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-primary text-primary dark:border-darkMode-accent dark:text-darkMode-accent'
                      : 'border-transparent text-forest-sage dark:text-darkMode-textSecondary hover:text-neutral-dark dark:hover:text-darkMode-text hover:border-neutral-gray dark:hover:border-darkMode-border'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'progress' && renderProgress()}
        {activeTab === 'achievements' && renderAchievements()}
        {activeTab === 'activity' && renderActivity()}
      </div>
    </div>
  );
};

export default LearnerDetails;
