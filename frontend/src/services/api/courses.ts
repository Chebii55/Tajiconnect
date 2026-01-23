/**
 * Course Service
 * Handles all course, grade, subject, and content-related API calls
 */

import { apiClient } from './client';
import { COURSES, GRADES, SUBJECTS, CONTENT } from './endpoints';
import type { PaginatedResponse } from './user';

// ============================================
// TYPE DEFINITIONS - COURSES
// ============================================

export type CourseStatus = 'draft' | 'published' | 'archived';

export interface Course {
  id: string;
  title: string;
  description: string;
  status: CourseStatus;
  grade_id?: number;
  subject_id?: number;
  instructor_id?: string;
  thumbnail_url?: string;
  duration_hours?: number;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  grade_id?: number;
  subject_id?: number;
  thumbnail_url?: string;
  duration_hours?: number;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
}

export interface UpdateCourseRequest {
  title?: string;
  description?: string;
  status?: CourseStatus;
  grade_id?: number;
  subject_id?: number;
  thumbnail_url?: string;
  duration_hours?: number;
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
}

// ============================================
// TYPE DEFINITIONS - GRADES & SUBJECTS
// ============================================

export interface Grade {
  id: number;
  name: string;
  description: string;
  order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Subject {
  id: number;
  name: string;
  description: string;
  icon?: string;
  color?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateGradeRequest {
  name: string;
  description: string;
  order?: number;
}

export interface CreateSubjectRequest {
  name: string;
  description: string;
  icon?: string;
  color?: string;
}

// ============================================
// TYPE DEFINITIONS - CONTENT
// ============================================

export type ContentType = 'video' | 'audio' | 'image' | 'document' | 'other';
export type ContentStatus = 'draft' | 'ready' | 'processing' | 'archived';

export interface Content {
  id: string;
  title: string;
  description?: string;
  course_id?: string;
  content_type: ContentType;
  mime_type: string;
  file_name: string;
  storage_path: string;
  storage_url?: string;
  size_bytes: number;
  status: ContentStatus;
  duration_seconds?: number;
  extra_metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface CreateContentRequest {
  title: string;
  description?: string;
  course_id?: string;
  content_type: ContentType;
}

export interface UpdateContentRequest {
  title?: string;
  description?: string;
  status?: ContentStatus;
  extra_metadata?: Record<string, unknown>;
}

export interface ContentListParams {
  skip?: number;
  limit?: number;
  course_id?: string;
  content_type?: ContentType;
  status?: ContentStatus;
}

// ============================================
// COURSE SERVICE CLASS
// ============================================

class CourseService {
  // ============================================
  // COURSES
  // ============================================

  /**
   * Get all courses with pagination
   */
  async getCourses(skip = 0, limit = 100): Promise<PaginatedResponse<Course>> {
    return apiClient.get<PaginatedResponse<Course>>(COURSES.LIST, { skip, limit });
  }

  /**
   * Get course by ID
   */
  async getCourseById(courseId: string): Promise<Course> {
    return apiClient.get<Course>(COURSES.BY_ID(courseId));
  }

  /**
   * Create a new course
   */
  async createCourse(data: CreateCourseRequest): Promise<Course> {
    return apiClient.post<Course>(COURSES.CREATE, data);
  }

  /**
   * Update a course
   */
  async updateCourse(courseId: string, data: UpdateCourseRequest): Promise<Course> {
    return apiClient.put<Course>(COURSES.UPDATE(courseId), data);
  }

  /**
   * Delete a course
   */
  async deleteCourse(courseId: string): Promise<void> {
    await apiClient.delete(COURSES.DELETE(courseId));
  }

  /**
   * Get courses by grade
   */
  async getCoursesByGrade(gradeId: number, skip = 0, limit = 100): Promise<PaginatedResponse<Course>> {
    return apiClient.get<PaginatedResponse<Course>>(COURSES.LIST, {
      grade_id: gradeId,
      skip,
      limit,
    });
  }

  /**
   * Get courses by subject
   */
  async getCoursesBySubject(subjectId: number, skip = 0, limit = 100): Promise<PaginatedResponse<Course>> {
    return apiClient.get<PaginatedResponse<Course>>(COURSES.LIST, {
      subject_id: subjectId,
      skip,
      limit,
    });
  }

  /**
   * Search courses
   */
  async searchCourses(query: string, skip = 0, limit = 100): Promise<PaginatedResponse<Course>> {
    return apiClient.get<PaginatedResponse<Course>>(COURSES.LIST, {
      search: query,
      skip,
      limit,
    });
  }

  // ============================================
  // GRADES
  // ============================================

  /**
   * Get all grades
   */
  async getGrades(): Promise<Grade[]> {
    return apiClient.get<Grade[]>(GRADES.LIST);
  }

  /**
   * Get grade by ID
   */
  async getGradeById(gradeId: string): Promise<Grade> {
    return apiClient.get<Grade>(GRADES.BY_ID(gradeId));
  }

  /**
   * Create a new grade
   */
  async createGrade(data: CreateGradeRequest): Promise<Grade> {
    return apiClient.post<Grade>(GRADES.CREATE, data);
  }

  /**
   * Update a grade
   */
  async updateGrade(gradeId: string, data: Partial<CreateGradeRequest>): Promise<Grade> {
    return apiClient.put<Grade>(GRADES.UPDATE(gradeId), data);
  }

  /**
   * Delete a grade
   */
  async deleteGrade(gradeId: string): Promise<void> {
    await apiClient.delete(GRADES.DELETE(gradeId));
  }

  /**
   * Get subjects in a grade
   */
  async getSubjectsInGrade(gradeId: string): Promise<Subject[]> {
    return apiClient.get<Subject[]>(GRADES.GET_SUBJECTS(gradeId));
  }

  /**
   * Add subject to grade
   */
  async addSubjectToGrade(gradeId: string, subjectId: number): Promise<void> {
    await apiClient.post(GRADES.ADD_SUBJECT(gradeId), { subject_id: subjectId });
  }

  /**
   * Remove subject from grade
   */
  async removeSubjectFromGrade(gradeId: string, subjectId: string): Promise<void> {
    await apiClient.delete(GRADES.REMOVE_SUBJECT(gradeId, subjectId));
  }

  // ============================================
  // SUBJECTS
  // ============================================

  /**
   * Get all subjects
   */
  async getSubjects(): Promise<Subject[]> {
    return apiClient.get<Subject[]>(SUBJECTS.LIST);
  }

  /**
   * Get subject by ID
   */
  async getSubjectById(subjectId: string): Promise<Subject> {
    return apiClient.get<Subject>(SUBJECTS.BY_ID(subjectId));
  }

  /**
   * Create a new subject
   */
  async createSubject(data: CreateSubjectRequest): Promise<Subject> {
    return apiClient.post<Subject>(SUBJECTS.CREATE, data);
  }

  /**
   * Update a subject
   */
  async updateSubject(subjectId: string, data: Partial<CreateSubjectRequest>): Promise<Subject> {
    return apiClient.put<Subject>(SUBJECTS.UPDATE(subjectId), data);
  }

  /**
   * Delete a subject
   */
  async deleteSubject(subjectId: string): Promise<void> {
    await apiClient.delete(SUBJECTS.DELETE(subjectId));
  }

  // ============================================
  // CONTENT
  // ============================================

  /**
   * Get all content with filters
   */
  async getContent(params?: ContentListParams): Promise<PaginatedResponse<Content>> {
    return apiClient.get<PaginatedResponse<Content>>(
      CONTENT.LIST,
      params as Record<string, unknown>
    );
  }

  /**
   * Get content by ID
   */
  async getContentById(contentId: string): Promise<Content> {
    return apiClient.get<Content>(CONTENT.BY_ID(contentId));
  }

  /**
   * Create content metadata
   */
  async createContent(data: CreateContentRequest): Promise<Content> {
    return apiClient.post<Content>(CONTENT.CREATE, data);
  }

  /**
   * Upload content file
   */
  async uploadContent(
    file: File,
    metadata?: { title?: string; description?: string; course_id?: string },
    onProgress?: (progress: number) => void
  ): Promise<Content> {
    return apiClient.uploadFile<Content>(
      CONTENT.UPLOAD,
      file,
      onProgress,
      metadata as Record<string, string>
    );
  }

  /**
   * Update content metadata
   */
  async updateContent(contentId: string, data: UpdateContentRequest): Promise<Content> {
    return apiClient.put<Content>(CONTENT.UPDATE(contentId), data);
  }

  /**
   * Delete content
   */
  async deleteContent(contentId: string): Promise<void> {
    await apiClient.delete(CONTENT.DELETE(contentId));
  }

  /**
   * Get content stream URL
   */
  getContentStreamUrl(contentId: string): string {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    return `${baseUrl}${CONTENT.STREAM(contentId)}`;
  }

  /**
   * Get content for a course
   */
  async getContentByCourse(courseId: string): Promise<Content[]> {
    const response = await this.getContent({ course_id: courseId });
    return response.items;
  }
}

// Export singleton instance
export const courseService = new CourseService();
export default courseService;
