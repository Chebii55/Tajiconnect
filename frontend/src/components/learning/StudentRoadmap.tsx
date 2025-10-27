import React from 'react';
import { Link } from 'react-router-dom';
import {
  Map,
  Target,
  Calendar,
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  ChevronRight,
  Star,
  BarChart3
} from 'lucide-react';

const StudentRoadmap: React.FC = () => {

  const mockStats = {
    totalMilestones: 12,
    completedMilestones: 7,
    currentStreak: 15,
    totalSkills: 24,
    masteredSkills: 18,
    estimatedCompletion: 'March 2025'
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
              <h1 className="text-4xl font-bold text-[#1C3D6E]">Learning Roadmap</h1>
              <p className="text-gray-600">Your personalized path to success</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-[#4A9E3D]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Milestones</p>
                <p className="text-xl font-bold text-[#1C3D6E]">{mockStats.completedMilestones}/{mockStats.totalMilestones}</p>
              </div>
              <Target className="w-6 h-6 text-[#4A9E3D]" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-[#3DAEDB]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Current Streak</p>
                <p className="text-xl font-bold text-[#1C3D6E]">{mockStats.currentStreak} days</p>
              </div>
              <Star className="w-6 h-6 text-[#3DAEDB]" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-[#2C857A]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Skills Mastered</p>
                <p className="text-xl font-bold text-[#1C3D6E]">{mockStats.masteredSkills}/{mockStats.totalSkills}</p>
              </div>
              <Award className="w-6 h-6 text-[#2C857A]" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion</p>
                <p className="text-xl font-bold text-[#1C3D6E]">{mockStats.estimatedCompletion}</p>
              </div>
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-xl font-bold text-[#1C3D6E]">68%</p>
              </div>
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 border-l-4 border-pink-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Study Time</p>
                <p className="text-xl font-bold text-[#1C3D6E]">127h</p>
              </div>
              <Clock className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-[#1C3D6E] mb-6">Your Learning Journey</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Learning Path */}
            <div className="bg-gradient-to-r from-[#1C3D6E] to-[#3DAEDB] rounded-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Current Learning Path</h3>
              <p className="text-blue-100 mb-4">Full-Stack Web Developer</p>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>58%</span>
                </div>
                <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{ width: '58%' }}></div>
                </div>
              </div>
              <Link
                to="/student/roadmap/learning-path"
                className="inline-flex items-center gap-2 mt-4 text-white hover:text-blue-100 transition-colors"
              >
                View Details <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Next Milestone */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#1C3D6E] mb-4">Next Milestone</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">React Development</h4>
                    <p className="text-gray-600 text-sm">Complete by January 30, 2025</p>
                    <div className="flex gap-2 mt-2">
                      {['React', 'JSX', 'Components'].map((skill) => (
                        <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <Link
                to="/student/roadmap/milestones"
                className="inline-flex items-center gap-2 mt-4 text-[#3DAEDB] hover:text-[#1C3D6E] transition-colors"
              >
                View All Milestones <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <Link
              to="/student/courses"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow"
            >
              <BookOpen className="w-8 h-8 text-[#4A9E3D]" />
              <div>
                <h4 className="font-semibold text-[#1C3D6E]">Browse Courses</h4>
                <p className="text-gray-600 text-sm">Explore available courses</p>
              </div>
            </Link>

            <Link
              to="/student/assessments"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow"
            >
              <Target className="w-8 h-8 text-[#3DAEDB]" />
              <div>
                <h4 className="font-semibold text-[#1C3D6E]">Take Assessment</h4>
                <p className="text-gray-600 text-sm">Test your skills</p>
              </div>
            </Link>

            <Link
              to="/student/progress/analytics"
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow"
            >
              <BarChart3 className="w-8 h-8 text-[#2C857A]" />
              <div>
                <h4 className="font-semibold text-[#1C3D6E]">View Analytics</h4>
                <p className="text-gray-600 text-sm">Track your progress</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRoadmap;