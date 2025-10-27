import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTrainer } from '../../../contexts/TrainerContext';
import { 
  Edit, 
  Mail, 
  Calendar, 
  Award, 
  BookOpen, 
  Users, 
  Star,
  MapPin,
  Globe,
  Linkedin,
  Twitter
} from 'lucide-react';

const TrainerProfile: React.FC = () => {
  const navigate = useNavigate();
  const { trainer, courses, learners, stats } = useTrainer();

  if (!trainer) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profile Not Found</h2>
          <button
            onClick={() => navigate('/trainer/dashboard')}
            className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-['Inter']">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trainer Profile</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage your public profile and information
              </p>
            </div>
            <Link
              to="/trainer/profile/edit"
              className="px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary transition-colors flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-primary-light to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {trainer.name.charAt(0)}
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{trainer.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">Expert Instructor</p>
                
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCourses}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Courses</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalLearners}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Learners</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageRating.toFixed(1)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Rating</p>
                  </div>
                </div>

                <div className="space-y-3 text-left">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4" />
                    <span>{trainer.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {new Date(trainer.joinedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>Location not set</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Social Links</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Globe className="w-4 h-4" />
                  <span>Website not set</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn not set</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <Twitter className="w-4 h-4" />
                  <span>Twitter not set</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {trainer.bio || 'No bio available. Add a bio to tell learners about your background and expertise.'}
              </p>
            </div>

            {/* Expertise */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Areas of Expertise</h3>
              {trainer.expertise && trainer.expertise.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {trainer.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-light/10 dark:bg-primary-light/20 text-primary-light rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  No expertise areas listed. Add your skills and areas of expertise.
                </p>
              )}
            </div>

            {/* Teaching Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Teaching Statistics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCourses}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Courses Created</p>
                </div>
                
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalLearners}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Learners</p>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageRating.toFixed(1)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
                </div>
                
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completionRate.toFixed(0)}%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
                </div>
              </div>
            </div>

            {/* Recent Courses */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Courses</h3>
                <Link
                  to="/trainer/courses"
                  className="text-primary-light hover:text-primary text-sm font-medium"
                >
                  View All
                </Link>
              </div>
              
              {courses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No courses created yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {courses.slice(0, 3).map((course) => (
                    <div key={course.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{course.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{course.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {course.enrolledStudents} enrolled
                          </p>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{course.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerProfile;