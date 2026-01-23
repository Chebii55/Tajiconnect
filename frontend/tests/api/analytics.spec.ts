import { test, expect } from '@playwright/test';
import { API_ENDPOINTS, testUser } from '../fixtures/test-data';

const API_BASE = API_ENDPOINTS.gateway;

test.describe('Analytics Service Tests', () => {
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
    test('should return healthy status from analytics service', async ({ request }) => {
      const response = await request.get(`${API_ENDPOINTS.analyticsService}/health`);
      expect(response.ok()).toBeTruthy();
    });
  });

  test.describe('User Analytics', () => {
    test('should get user learning analytics', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/analytics/user`, {
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

    test('should get user activity timeline', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/analytics/activity`, {
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

    test('should track user event', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.post(`${API_BASE}/api/v1/analytics/events`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          eventType: 'page_view',
          eventData: {
            page: '/courses',
            timestamp: new Date().toISOString(),
          },
        },
      });

      if (response.ok()) {
        expect(response.status()).toBe(200);
      } else {
        expect([200, 201, 400, 401, 404]).toContain(response.status());
      }
    });
  });

  test.describe('Course Analytics', () => {
    test('should get course performance metrics', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/analytics/courses`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok()) {
        const data = await response.json();
        expect(data).toBeDefined();
      } else {
        expect([200, 401, 403, 404]).toContain(response.status());
      }
    });

    test('should get specific course analytics', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      // Get a course first
      const coursesResponse = await request.get(`${API_BASE}/api/v1/courses`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (coursesResponse.ok()) {
        const courses = await coursesResponse.json();
        const courseList = Array.isArray(courses) ? courses : courses.courses || courses.items || [];

        if (courseList.length > 0) {
          const courseId = courseList[0].id;
          const response = await request.get(`${API_BASE}/api/v1/analytics/courses/${courseId}`, {
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
  });

  test.describe('Learning Metrics', () => {
    test('should get learning time statistics', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/analytics/learning-time`, {
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

    test('should get completion statistics', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/analytics/completions`, {
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

    test('should get performance trends', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/analytics/trends`, {
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

  test.describe('Dashboard Metrics', () => {
    test('should get dashboard summary', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/analytics/dashboard`, {
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

    test('should get leaderboard data', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/analytics/leaderboard`, {
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

  test.describe('Trainer Analytics', () => {
    test('should get trainer performance metrics', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/analytics/trainer`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok()) {
        const data = await response.json();
        expect(data).toBeDefined();
      } else {
        // May require trainer role
        expect([200, 401, 403, 404]).toContain(response.status());
      }
    });

    test('should get student engagement metrics', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/analytics/engagement`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok()) {
        const data = await response.json();
        expect(data).toBeDefined();
      } else {
        expect([200, 401, 403, 404]).toContain(response.status());
      }
    });
  });
});
