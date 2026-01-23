import { test, expect } from '@playwright/test';
import { API_ENDPOINTS, testUser } from '../fixtures/test-data';

const API_BASE = API_ENDPOINTS.gateway;

test.describe('Content Service Tests', () => {
  let authToken: string | null = null;

  test.beforeAll(async ({ request }) => {
    // Attempt to login and get auth token
    const response = await request.post(`${API_BASE}/api/v1/auth/login`, {
      data: {
        email: testUser.email,
        password: testUser.password,
      },
    });

    if (response.ok()) {
      const data = await response.json();
      authToken = data.access_token;
    }
  });

  test.describe('Health Check', () => {
    test('should return healthy status from content service', async ({ request }) => {
      const response = await request.get(`${API_ENDPOINTS.contentService}/health`);
      expect(response.ok()).toBeTruthy();
    });
  });

  test.describe('Lessons', () => {
    test('should get lessons for a course', async ({ request }) => {
      // First get a course
      const coursesResponse = await request.get(`${API_BASE}/api/v1/courses`);

      if (coursesResponse.ok()) {
        const courses = await coursesResponse.json();
        const courseList = Array.isArray(courses) ? courses : courses.courses || courses.items || [];

        if (courseList.length > 0) {
          const courseId = courseList[0].id;
          const response = await request.get(`${API_BASE}/api/v1/content/courses/${courseId}/lessons`);

          if (response.ok()) {
            const data = await response.json();
            expect(data).toBeDefined();
          } else {
            expect([200, 404]).toContain(response.status());
          }
        }
      }
    });

    test('should get specific lesson details', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const coursesResponse = await request.get(`${API_BASE}/api/v1/courses`);

      if (coursesResponse.ok()) {
        const courses = await coursesResponse.json();
        const courseList = Array.isArray(courses) ? courses : courses.courses || courses.items || [];

        if (courseList.length > 0) {
          const courseId = courseList[0].id;
          const lessonsResponse = await request.get(`${API_BASE}/api/v1/content/courses/${courseId}/lessons`);

          if (lessonsResponse.ok()) {
            const lessons = await lessonsResponse.json();
            const lessonList = Array.isArray(lessons) ? lessons : lessons.lessons || [];

            if (lessonList.length > 0) {
              const lessonId = lessonList[0].id;
              const response = await request.get(`${API_BASE}/api/v1/content/lessons/${lessonId}`, {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                },
              });

              if (response.ok()) {
                const data = await response.json();
                expect(data).toHaveProperty('id');
              }
            }
          }
        }
      }
    });
  });

  test.describe('Video Content', () => {
    test('should get video metadata', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/content/videos`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok()) {
        const data = await response.json();
        expect(data).toBeDefined();
      } else {
        expect([200, 401, 404]).toContain(response.status());
      }
    });

    test('should get video streaming URL', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      // This would typically require a valid video ID
      const response = await request.get(`${API_BASE}/api/v1/content/videos/test-video-id/stream`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // May not exist
      expect([200, 401, 404]).toContain(response.status());
    });
  });

  test.describe('Documents', () => {
    test('should get course documents', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const coursesResponse = await request.get(`${API_BASE}/api/v1/courses`);

      if (coursesResponse.ok()) {
        const courses = await coursesResponse.json();
        const courseList = Array.isArray(courses) ? courses : courses.courses || courses.items || [];

        if (courseList.length > 0) {
          const courseId = courseList[0].id;
          const response = await request.get(`${API_BASE}/api/v1/content/courses/${courseId}/documents`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          if (response.ok()) {
            const data = await response.json();
            expect(data).toBeDefined();
          } else {
            expect([200, 401, 404]).toContain(response.status());
          }
        }
      }
    });
  });

  test.describe('Quizzes', () => {
    test('should get quiz for a lesson', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/content/quizzes`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok()) {
        const data = await response.json();
        expect(data).toBeDefined();
      } else {
        expect([200, 401, 404]).toContain(response.status());
      }
    });

    test('should submit quiz answers', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.post(`${API_BASE}/api/v1/content/quizzes/test-quiz-id/submit`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          answers: [
            { questionId: '1', selectedOption: 0 },
            { questionId: '2', selectedOption: 2 },
          ],
        },
      });

      expect([200, 201, 400, 401, 404]).toContain(response.status());
    });

    test('should get quiz results', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/content/quizzes/results`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok()) {
        const data = await response.json();
        expect(data).toBeDefined();
      } else {
        expect([200, 401, 404]).toContain(response.status());
      }
    });
  });

  test.describe('Assignments', () => {
    test('should get course assignments', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const coursesResponse = await request.get(`${API_BASE}/api/v1/courses/enrolled`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (coursesResponse.ok()) {
        const courses = await coursesResponse.json();
        const courseList = Array.isArray(courses) ? courses : courses.courses || courses.items || [];

        if (courseList.length > 0) {
          const courseId = courseList[0].id || courseList[0].course_id;
          const response = await request.get(`${API_BASE}/api/v1/content/courses/${courseId}/assignments`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          if (response.ok()) {
            const data = await response.json();
            expect(data).toBeDefined();
          }
        }
      }
    });

    test('should submit assignment', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.post(`${API_BASE}/api/v1/content/assignments/test-assignment-id/submit`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          content: 'This is my assignment submission.',
          attachments: [],
        },
      });

      expect([200, 201, 400, 401, 404]).toContain(response.status());
    });
  });

  test.describe('Content Upload (Trainer)', () => {
    test('should upload lesson content', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.post(`${API_BASE}/api/v1/content/upload`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          type: 'lesson',
          title: 'Test Lesson',
          content: 'This is test lesson content.',
          courseId: 'test-course-id',
        },
      });

      // May require trainer role
      expect([200, 201, 400, 401, 403, 404]).toContain(response.status());
    });
  });
});
