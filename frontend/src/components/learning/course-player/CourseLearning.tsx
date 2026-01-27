import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { BookOpen, FileText, ArrowLeft, ExternalLink, CheckCircle } from 'lucide-react';
import { courseService } from '../../../services/api/courses';
import { userService } from '../../../services/api/user';
import type { Course, Content } from '../../../services/api/courses';
import type { CourseEnrollment } from '../../../services/api/user';
import { getUserId } from '../../../utils/auth';

const CourseLearning: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [contentItems, setContentItems] = useState<Content[]>([]);
  const [enrollment, setEnrollment] = useState<CourseEnrollment | null>(null);
  const [enrolling, setEnrolling] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId) return;
      try {
        setLoading(true);
        setError(null);
        const [courseData, contentData] = await Promise.all([
          courseService.getCourseById(courseId),
          courseService.getContentByCourse(courseId),
        ]);
        setCourse(courseData);
        setContentItems(contentData);

        const userId = getUserId();
        if (userId) {
          try {
            const existing = await userService.getUserCourse(userId, courseId);
            setEnrollment(existing);
          } catch {
            setEnrollment(null);
          }
        }
      } catch (err: any) {
        console.error('Failed to load course:', err);
        setError(err?.message || 'Unable to load course');
        setCourse(null);
        setContentItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  const handleEnroll = async () => {
    if (!courseId) return;
    const userId = getUserId();
    if (!userId) {
      setError('User not authenticated');
      return;
    }
    try {
      setEnrolling(true);
      const created = await userService.createEnrollment(userId, {
        course_id: courseId,
        status: 'enrolled',
        progress_percent: 0,
        source: 'course_detail',
      });
      setEnrollment(created);
    } catch (err: any) {
      setError(err?.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-darkMode-textSecondary">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg flex items-center justify-center">
        <div className="text-center max-w-lg">
          <h2 className="text-2xl font-bold text-primary-dark dark:text-darkMode-text mb-2">
            Course Unavailable
          </h2>
          <p className="text-gray-600 dark:text-darkMode-textSecondary mb-6">
            {error || 'We could not load this course.'}
          </p>
          <Link
            to="/student/courses"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/student/courses"
            className="flex items-center gap-2 text-gray-600 dark:text-darkMode-textSecondary hover:text-primary dark:hover:text-darkMode-link transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Courses
          </Link>
        </div>

        <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6 mb-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-primary-dark dark:text-darkMode-text mb-2">
                {course.title}
              </h1>
              <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary">
                {course.description || 'No description provided.'}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-info/10 dark:bg-darkMode-link/20 text-info dark:text-darkMode-link">
                {course.status}
              </span>
              <button
                onClick={handleEnroll}
                disabled={Boolean(enrollment) || enrolling}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  enrollment
                    ? 'bg-success/10 text-success dark:bg-darkMode-success/20 dark:text-darkMode-success cursor-not-allowed'
                    : 'bg-primary-dark text-white hover:bg-primary dark:bg-darkMode-navbar dark:hover:bg-darkMode-surface'
                }`}
              >
                {enrollment ? (
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Enrolled
                  </span>
                ) : enrolling ? (
                  'Enrolling...'
                ) : (
                  'Enroll'
                )}
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-neutral-dark/70 dark:text-darkMode-textMuted mt-4">
            <span>Created {new Date(course.created_at).toLocaleDateString()}</span>
            {course.updated_at ? (
              <span>Updated {new Date(course.updated_at).toLocaleDateString()}</span>
            ) : null}
          </div>
        </div>

        <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-primary-dark dark:text-darkMode-text">
              Course Content
            </h2>
          </div>

          {contentItems.length === 0 ? (
            <div className="text-center py-10">
              <FileText className="w-14 h-14 text-gray-400 dark:text-darkMode-textMuted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-neutral-dark dark:text-darkMode-text mb-2">
                No lessons yet
              </h3>
              <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary">
                This course doesn&apos;t have content published yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {contentItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 dark:border-darkMode-border rounded-lg p-4 flex items-start justify-between gap-4"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-primary-dark dark:text-darkMode-text">
                      {item.title}
                    </h3>
                    {item.description ? (
                      <p className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary mt-1">
                        {item.description}
                      </p>
                    ) : null}
                    <p className="text-xs text-neutral-dark/60 dark:text-darkMode-textMuted mt-2">
                      Type: {item.content_type} • Status: {item.status}
                    </p>
                  </div>
                  <a
                    href={courseService.getContentStreamUrl(item.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-primary dark:text-darkMode-link hover:text-primary-dark dark:hover:text-darkMode-linkHover"
                  >
                    View <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseLearning;
