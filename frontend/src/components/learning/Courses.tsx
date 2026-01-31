import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { courseService } from '../../services/api/courses';
import { userService } from '../../services/api/user';
import type { Course, CourseStatus, Grade, Subject } from '../../services/api/courses';
import type { CourseEnrollment } from '../../services/api/user';
import { getUserId } from '../../utils/auth';
import { BookOpen, Search, Filter, ChevronDown, Grid, List, Play } from 'lucide-react';

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [enrollments, setEnrollments] = useState<Record<string, CourseEnrollment>>({});
  const [enrollingIds, setEnrollingIds] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | CourseStatus>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'title'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [courseData, gradeData, subjectData] = await Promise.all([
          courseService.getCourses(0, 200),
          courseService.getGrades(),
          courseService.getSubjects(),
        ]);
        setCourses(courseData);
        setGrades(gradeData);
        setSubjects(subjectData);

        const userId = getUserId();
        if (userId) {
          const userEnrollments = await userService.getUserCourses(userId, 0, 500);
          const enrollmentMap: Record<string, CourseEnrollment> = {};
          userEnrollments.forEach((enrollment) => {
            enrollmentMap[enrollment.course_id] = enrollment;
          });
          setEnrollments(enrollmentMap);
        }
      } catch (err: any) {
        console.error('Failed to load courses:', err);
        setError(err?.message || 'Course service unavailable');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleEnroll = async (courseId: string) => {
    const userId = getUserId();
    if (!userId) {
      setError('User not authenticated');
      return;
    }
    try {
      setEnrollingIds((prev) => ({ ...prev, [courseId]: true }));
      const enrollment = await userService.createEnrollment(userId, {
        course_id: courseId,
        status: 'enrolled',
        progress_percent: 0,
        source: 'courses_list',
      });
      setEnrollments((prev) => ({ ...prev, [courseId]: enrollment }));
    } catch (err: any) {
      console.error('Failed to enroll:', err);
      setError(err?.message || 'Failed to enroll');
    } finally {
      setEnrollingIds((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  const gradeMap = useMemo(() => {
    return new Map(grades.map((grade) => [String(grade.id), grade.name]));
  }, [grades]);

  const subjectMap = useMemo(() => {
    return new Map(subjects.map((subject) => [String(subject.id), subject.name]));
  }, [subjects]);

  const filteredCourses = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filtered = courses.filter((course) => {
      const matchesSearch =
        !normalizedSearch ||
        course.title.toLowerCase().includes(normalizedSearch) ||
        (course.description || '').toLowerCase().includes(normalizedSearch);

      const matchesGrade = selectedGrade === 'all' || String(course.grade_id) === selectedGrade;
      const matchesSubject =
        selectedSubject === 'all' || String(course.subject_id) === selectedSubject;
      const matchesStatus = selectedStatus === 'all' || course.status === selectedStatus;

      return matchesSearch && matchesGrade && matchesSubject && matchesStatus;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [courses, searchTerm, selectedGrade, selectedSubject, selectedStatus, sortBy]);

  const getStatusColor = (status: CourseStatus) => {
    switch (status) {
      case 'published':
        return 'text-success dark:text-darkMode-success bg-success/10 dark:bg-darkMode-success/20';
      case 'archived':
        return 'text-neutral-dark/60 dark:text-darkMode-textMuted bg-neutral-gray dark:bg-darkMode-surfaceHover';
      default:
        return 'text-info dark:text-darkMode-link bg-info/10 dark:bg-darkMode-link/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading courses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-light dark:bg-darkMode-bg font-sans">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary dark:bg-darkMode-navbar rounded-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-primary dark:text-darkMode-text font-heading">
                Browse Courses
              </h1>
              <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary">
                Explore available courses and start learning
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-darkMode-textMuted" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-modern focus-ring pl-10 dark:bg-darkMode-surfaceHover dark:text-darkMode-text dark:border-darkMode-border"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 dark:border-darkMode-border rounded-lg hover:bg-neutral-light dark:hover:bg-darkMode-surfaceHover transition-colors focus-ring text-neutral-dark dark:text-darkMode-textSecondary"
            >
              <Filter className="w-5 h-5" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-neutral-gray dark:bg-darkMode-surfaceHover rounded-lg">
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="input-modern focus-ring dark:bg-darkMode-surface dark:text-darkMode-text dark:border-darkMode-border"
              >
                <option value="all">All Grades</option>
                {grades.map((grade) => (
                  <option key={grade.id} value={String(grade.id)}>
                    {grade.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="input-modern focus-ring dark:bg-darkMode-surface dark:text-darkMode-text dark:border-darkMode-border"
              >
                <option value="all">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={String(subject.id)}>
                    {subject.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as 'all' | CourseStatus)}
                className="input-modern focus-ring dark:bg-darkMode-surface dark:text-darkMode-text dark:border-darkMode-border"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'recent' | 'title')}
                className="input-modern focus-ring dark:bg-darkMode-surface dark:text-darkMode-text dark:border-darkMode-border"
              >
                <option value="recent">Most Recent</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          )}

          <div className="flex items-center justify-between mt-4">
            <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary">
              {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">View:</span>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary-light dark:bg-darkMode-progress text-white'
                    : 'text-neutral-dark/80 dark:text-darkMode-textSecondary hover:bg-neutral-light dark:hover:bg-darkMode-surfaceHover'
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-light dark:bg-darkMode-progress text-white'
                    : 'text-neutral-dark/80 dark:text-darkMode-textSecondary hover:bg-neutral-light dark:hover:bg-darkMode-surfaceHover'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div
          className={`grid gap-6 ${
            viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
          }`}
        >
          {filteredCourses.map((course) => {
            const gradeName = course.grade_id ? gradeMap.get(String(course.grade_id)) : null;
            const subjectName = course.subject_id ? subjectMap.get(String(course.subject_id)) : null;
            const enrollment = enrollments[course.id];
            const isEnrolled = Boolean(enrollment);
            const isEnrolling = Boolean(enrollingIds[course.id]);

            return (
              <div
                key={course.id}
                className={`bg-white dark:bg-darkMode-surface rounded-xl shadow-lg dark:shadow-dark overflow-hidden hover:shadow-xl dark:hover:shadow-dark-lg transition-shadow ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                <div
                  className={`relative ${
                    viewMode === 'list' ? 'w-64 flex-shrink-0' : 'h-32'
                  } bg-gradient-to-r from-primary-dark to-primary dark:from-darkMode-progress dark:to-darkMode-success flex items-center justify-center`}
                >
                  <BookOpen className="w-10 h-10 text-white" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(course.status)}`}>
                      {course.status}
                    </span>
                  </div>
                </div>

                <div className={`p-6 ${viewMode === 'list' ? 'flex-grow' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-2 text-sm text-neutral-dark/80 dark:text-darkMode-textSecondary">
                        {gradeName ? <span>{gradeName}</span> : null}
                        {gradeName && subjectName ? <span>•</span> : null}
                        {subjectName ? <span>{subjectName}</span> : null}
                      </div>
                      <h3 className="text-lg font-bold text-primary dark:text-darkMode-text font-heading mb-2 line-clamp-2">
                        {course.title}
                      </h3>
                      {course.description ? (
                        <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary text-sm mb-3 line-clamp-3">
                          {course.description}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-neutral-dark/70 dark:text-darkMode-textMuted mb-4">
                    <span>Created {new Date(course.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <Link
                      to={`/student/courses/${course.id}`}
                      className="btn-primary flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>View Course</span>
                    </Link>
                    <button
                      onClick={() => handleEnroll(course.id)}
                      disabled={isEnrolled || isEnrolling}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isEnrolled
                          ? 'bg-success/10 text-success dark:bg-darkMode-success/20 dark:text-darkMode-success cursor-not-allowed'
                          : 'bg-primary-dark text-white hover:bg-primary dark:bg-darkMode-navbar dark:hover:bg-darkMode-surface'
                      }`}
                    >
                      {isEnrolled ? 'Enrolled' : isEnrolling ? 'Enrolling...' : 'Enroll'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 dark:text-darkMode-textMuted mx-auto mb-4" />
            <h3 className="text-xl font-medium text-neutral-dark dark:text-darkMode-text mb-2">
              No courses found
            </h3>
            <p className="text-neutral-dark/80 dark:text-darkMode-textSecondary mb-6">
              Try adjusting your search or filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedGrade('all');
                setSelectedSubject('all');
                setSelectedStatus('all');
              }}
              className="btn-primary"
            >
              <span>Clear Filters</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
