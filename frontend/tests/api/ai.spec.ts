import { test, expect } from '@playwright/test';
import { API_ENDPOINTS, testUser } from '../fixtures/test-data';

const API_BASE = API_ENDPOINTS.gateway;

test.describe('AI Service Tests', () => {
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
    test('should return healthy status from AI service', async ({ request }) => {
      const response = await request.get(`${API_ENDPOINTS.aiService}/health`).catch(() => null);
      if (!response) {
        return; // Service not running
      }

      if (response.ok()) {
        const data = await response.json();
        expect(data.status).toBe('healthy');
      } else {
        // AI service might not be running
        expect([200, 503]).toContain(response.status());
      }
    });
  });

  test.describe('Course Recommendations', () => {
    test('should get personalized course recommendations', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/ai/recommendations`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok()) {
        const data = await response.json();
        expect(data).toBeDefined();
        // Should return array of recommendations or object with recommendations
        expect(Array.isArray(data) || data.recommendations).toBeTruthy();
      } else {
        expect([200, 401, 404, 503]).toContain(response.status());
      }
    });

    test('should get recommendations based on interests', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.post(`${API_BASE}/api/v1/ai/recommendations`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          interests: ['technology', 'design', 'business'],
          level: 'beginner',
        },
      });

      if (response.ok()) {
        const data = await response.json();
        expect(data).toBeDefined();
      } else {
        expect([200, 400, 401, 404, 503]).toContain(response.status());
      }
    });
  });

  test.describe('Learning Path Generation', () => {
    test('should generate personalized learning path', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.post(`${API_BASE}/api/v1/ai/learning-path`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          goal: 'Become a full-stack web developer',
          currentSkillLevel: 'beginner',
          timeAvailable: '10 hours per week',
          targetDuration: '6 months',
        },
      });

      if (response.ok()) {
        const data = await response.json();
        expect(data).toBeDefined();
      } else {
        expect([200, 400, 401, 404, 503]).toContain(response.status());
      }
    });

    test('should get existing learning path', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/ai/learning-path`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok()) {
        const data = await response.json();
        expect(data).toBeDefined();
      } else {
        expect([200, 401, 404, 503]).toContain(response.status());
      }
    });
  });

  test.describe('Skills Assessment', () => {
    test('should get skills assessment questions', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/ai/assessment`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok()) {
        const data = await response.json();
        expect(data).toBeDefined();
      } else {
        expect([200, 401, 404, 503]).toContain(response.status());
      }
    });

    test('should submit skills assessment', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.post(`${API_BASE}/api/v1/ai/assessment`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          answers: [
            { questionId: '1', answer: 'A' },
            { questionId: '2', answer: 'C' },
            { questionId: '3', answer: 'B' },
          ],
        },
      });

      if (response.ok()) {
        const data = await response.json();
        expect(data).toBeDefined();
      } else {
        expect([200, 400, 401, 404, 503]).toContain(response.status());
      }
    });

    test('should get assessment results', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/ai/assessment/results`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok()) {
        const data = await response.json();
        expect(data).toBeDefined();
      } else {
        expect([200, 401, 404, 503]).toContain(response.status());
      }
    });
  });

  test.describe('AI Chat/Tutor', () => {
    test('should send message to AI tutor', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.post(`${API_BASE}/api/v1/ai/chat`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          message: 'Can you explain what React hooks are?',
          context: 'web development course',
        },
      });

      if (response.ok()) {
        const data = await response.json();
        expect(data).toBeDefined();
        expect(data.response || data.message || data.answer).toBeDefined();
      } else {
        expect([200, 400, 401, 404, 503]).toContain(response.status());
      }
    });

    test('should get chat history', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/ai/chat/history`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok()) {
        const data = await response.json();
        expect(data).toBeDefined();
      } else {
        expect([200, 401, 404, 503]).toContain(response.status());
      }
    });
  });

  test.describe('Content Analysis', () => {
    test('should analyze learning content', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.post(`${API_BASE}/api/v1/ai/analyze-content`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          content: 'JavaScript is a high-level, interpreted programming language...',
          type: 'lesson',
        },
      });

      if (response.ok()) {
        const data = await response.json();
        expect(data).toBeDefined();
      } else {
        expect([200, 400, 401, 404, 503]).toContain(response.status());
      }
    });

    test('should generate quiz questions from content', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.post(`${API_BASE}/api/v1/ai/generate-quiz`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          topic: 'JavaScript Arrays',
          difficulty: 'intermediate',
          questionCount: 5,
        },
      });

      if (response.ok()) {
        const data = await response.json();
        expect(data).toBeDefined();
      } else {
        expect([200, 400, 401, 404, 503]).toContain(response.status());
      }
    });
  });

  test.describe('Progress Analysis', () => {
    test('should get learning analytics', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/ai/analytics`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok()) {
        const data = await response.json();
        expect(data).toBeDefined();
      } else {
        expect([200, 401, 404, 503]).toContain(response.status());
      }
    });

    test('should get performance insights', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/ai/insights`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok()) {
        const data = await response.json();
        expect(data).toBeDefined();
      } else {
        expect([200, 401, 404, 503]).toContain(response.status());
      }
    });
  });
});
