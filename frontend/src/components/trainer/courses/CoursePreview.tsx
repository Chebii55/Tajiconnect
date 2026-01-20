import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrainer } from '../../../contexts/TrainerContext';
import {
  ArrowLeft,
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  CheckCircle,
  Lock,
  Award
} from 'lucide-react';

const CoursePreview: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses } = useTrainer();

  const course = courses.find(c => c.id === courseId);

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

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg font-['Inter']">
      {/* Header */}
      <div className="bg-neutral-white dark:bg-darkMode-surface shadow-sm border-b dark:border-darkMode-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/trainer/courses/${courseId}`)}
                className="p-2 text-forest-sage hover:text-neutral-dark dark:text-darkMode-textSecondary dark:hover:text-darkMode-text rounded-lg hover:bg-neutral-gray dark:hover:bg-darkMode-navbar"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text">Course Preview</h1>
                <p className="text-forest-sage dark:text-darkMode-textSecondary mt-1">
                  How learners will see your course
                </p>
              </div>
            </div>
            <div className="bg-accent-gold/20 dark:bg-darkMode-accent/20 text-accent-gold dark:text-darkMode-accent px-3 py-1 rounded-full text-sm font-medium">
              Preview Mode
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border overflow-hidden mb-8">
              <div className="aspect-video bg-gradient-to-r from-primary-dark to-primary dark:from-darkMode-progress dark:to-darkMode-success flex items-center justify-center">
                <Play className="w-16 h-16 text-white" />
              </div>

              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-neutral-dark dark:text-darkMode-text mb-2">{course.title}</h1>
                    <p className="text-forest-sage dark:text-darkMode-textSecondary text-lg">{course.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    course.difficulty === 'Beginner' ? 'bg-success/10 text-success dark:bg-darkMode-success/20 dark:text-darkMode-success' :
                    course.difficulty === 'Intermediate' ? 'bg-accent-gold/20 text-accent-gold dark:bg-darkMode-accent/20 dark:text-darkMode-accent' :
                    'bg-error/10 text-error dark:bg-error/20 dark:text-error'
                  }`}>
                    {course.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-6 text-sm text-forest-sage dark:text-darkMode-textSecondary mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{course.duration} hours</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{course.enrolledStudents} enrolled</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-accent-gold dark:text-darkMode-accent fill-current" />
                    <span>{course.rating} rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.modules.length} modules</span>
                  </div>
                </div>

                <button className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors font-medium">
                  Start Learning
                </button>
              </div>
            </div>

            {/* Course Content */}
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-8">
              <h2 className="text-2xl font-bold text-neutral-dark dark:text-darkMode-text mb-6">Course Content</h2>

              {course.modules.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-forest-sage dark:text-darkMode-textMuted mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-dark dark:text-darkMode-text mb-2">No Modules Yet</h3>
                  <p className="text-forest-sage dark:text-darkMode-textSecondary">
                    This course doesn't have any modules yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {course.modules.map((module, index) => (
                    <div key={module.id} className="border border-neutral-gray dark:border-darkMode-border rounded-lg">
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="font-medium text-neutral-dark dark:text-darkMode-text">{module.title}</h3>
                            <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">{module.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-forest-sage dark:text-darkMode-textSecondary flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {module.duration} min
                          </span>
                          {module.isRequired ? (
                            <CheckCircle className="w-5 h-5 text-success dark:text-darkMode-success" />
                          ) : (
                            <Lock className="w-5 h-5 text-forest-sage dark:text-darkMode-textMuted" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Stats */}
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-6">
              <h3 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-4">Course Stats</h3>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-forest-sage dark:text-darkMode-textSecondary">Students Enrolled</span>
                  <span className="font-medium text-neutral-dark dark:text-darkMode-text">{course.enrolledStudents}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-forest-sage dark:text-darkMode-textSecondary">Completion Rate</span>
                  <span className="font-medium text-neutral-dark dark:text-darkMode-text">{course.completionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-forest-sage dark:text-darkMode-textSecondary">Average Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-accent-gold dark:text-darkMode-accent fill-current" />
                    <span className="font-medium text-neutral-dark dark:text-darkMode-text">{course.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-forest-sage dark:text-darkMode-textSecondary">Category</span>
                  <span className="font-medium text-neutral-dark dark:text-darkMode-text">{course.category}</span>
                </div>
              </div>
            </div>

            {/* What You'll Learn */}
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-6">
              <h3 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-4">What You'll Learn</h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success dark:text-darkMode-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-neutral-dark dark:text-darkMode-textSecondary">
                    Master the fundamentals of {course.category.toLowerCase()}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success dark:text-darkMode-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-neutral-dark dark:text-darkMode-textSecondary">
                    Build practical projects and gain hands-on experience
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success dark:text-darkMode-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-neutral-dark dark:text-darkMode-textSecondary">
                    Understand best practices and industry standards
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success dark:text-darkMode-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-neutral-dark dark:text-darkMode-textSecondary">
                    Prepare for real-world applications
                  </span>
                </div>
              </div>
            </div>

            {/* Certificate */}
            <div className="bg-gradient-to-r from-primary-dark to-primary dark:from-darkMode-progress dark:to-darkMode-success rounded-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Certificate of Completion</h3>
              </div>
              <p className="text-sm opacity-90">
                Earn a certificate upon successful completion of this course.
              </p>
            </div>

            {/* Instructor */}
            <div className="bg-neutral-white dark:bg-darkMode-surface rounded-xl shadow-sm border border-neutral-gray dark:border-darkMode-border p-6">
              <h3 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-4">Instructor</h3>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-dark to-primary dark:from-darkMode-progress dark:to-darkMode-success rounded-full flex items-center justify-center text-white font-medium">
                  T
                </div>
                <div>
                  <h4 className="font-medium text-neutral-dark dark:text-darkMode-text">Trainer Name</h4>
                  <p className="text-sm text-forest-sage dark:text-darkMode-textSecondary">Expert Instructor</p>
                </div>
              </div>

              <p className="text-sm text-neutral-dark dark:text-darkMode-textSecondary mt-4">
                Experienced professional with expertise in {course.category.toLowerCase()} and a passion for teaching.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePreview;
