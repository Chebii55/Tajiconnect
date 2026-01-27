/**
 * Course Management Hook
 * Provides easy access to course-related operations
 */

import { useState, useEffect } from 'react';
import { courseService } from '../services/api/courses';
import type { Course, Grade, Subject } from '../services/api/courses';

interface UseCoursesReturn {
  courses: Course[];
  grades: Grade[];
  subjects: Subject[];
  loading: boolean;
  error: string | null;
  loadCourses: () => Promise<void>;
  searchCourses: (query: string) => Promise<void>;
  getCoursesByGrade: (gradeId: number) => Promise<void>;
  getCoursesBySubject: (subjectId: number) => Promise<void>;
  loadGrades: () => Promise<void>;
  loadSubjects: () => Promise<void>;
}

export const useCourses = (): UseCoursesReturn => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await courseService.getCourses(0, 100);
      setCourses(response);
    } catch (err) {
      console.error('Failed to load courses:', err);
      setError('Failed to load courses');
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const searchCourses = async (query: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await courseService.searchCourses(query);
      setCourses(response);
    } catch (err) {
      console.error('Search failed:', err);
      setError('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const getCoursesByGrade = async (gradeId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await courseService.getCoursesByGrade(gradeId);
      setCourses(response);
    } catch (err) {
      console.error('Failed to load courses by grade:', err);
      setError('Failed to load courses by grade');
    } finally {
      setLoading(false);
    }
  };

  const getCoursesBySubject = async (subjectId: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await courseService.getCoursesBySubject(subjectId);
      setCourses(response);
    } catch (err) {
      console.error('Failed to load courses by subject:', err);
      setError('Failed to load courses by subject');
    } finally {
      setLoading(false);
    }
  };

  const loadGrades = async () => {
    try {
      const gradesData = await courseService.getGrades();
      setGrades(gradesData);
    } catch (err) {
      console.error('Failed to load grades:', err);
    }
  };

  const loadSubjects = async () => {
    try {
      const subjectsData = await courseService.getSubjects();
      setSubjects(subjectsData);
    } catch (err) {
      console.error('Failed to load subjects:', err);
    }
  };

  // Load initial data
  useEffect(() => {
    loadCourses();
    loadGrades();
    loadSubjects();
  }, []);

  return {
    courses,
    grades,
    subjects,
    loading,
    error,
    loadCourses,
    searchCourses,
    getCoursesByGrade,
    getCoursesBySubject,
    loadGrades,
    loadSubjects,
  };
};

export default useCourses;
