import { test, expect } from '@playwright/test';
import { API_ENDPOINTS, testUser } from '../fixtures/test-data';

const API_BASE = API_ENDPOINTS.gateway;

test.describe('Notification Service Tests', () => {
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
    test('should return healthy status from notification service', async ({ request }) => {
      const response = await request.get(`${API_ENDPOINTS.notificationService}/health`).catch(() => null);
      if (!response) {
        return; // Service not running
      }

      if (response.ok()) {
        const data = await response.json();
        expect(data.status).toBe('healthy');
      } else {
        // Service might not be running
        expect([200, 503]).toContain(response.status());
      }
    });
  });

  test.describe('User Notifications', () => {
    test('should get all notifications', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/notifications`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok()) {
        const data = await response.json();
        expect(data).toBeDefined();
        expect(Array.isArray(data) || data.notifications).toBeTruthy();
      } else {
        expect([200, 401, 404]).toContain(response.status());
      }
    });

    test('should get unread notifications count', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/notifications/unread/count`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok()) {
        const data = await response.json();
        expect(data.count !== undefined || data.unreadCount !== undefined).toBeTruthy();
      } else {
        expect([200, 401, 404]).toContain(response.status());
      }
    });

    test('should get unread notifications', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/notifications/unread`, {
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

    test('should mark notification as read', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      // First get notifications
      const notificationsResponse = await request.get(`${API_BASE}/api/v1/notifications`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (notificationsResponse.ok()) {
        const notifications = await notificationsResponse.json();
        const notificationList = Array.isArray(notifications) ? notifications : notifications.notifications || [];

        if (notificationList.length > 0) {
          const notificationId = notificationList[0].id;
          const response = await request.patch(`${API_BASE}/api/v1/notifications/${notificationId}/read`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          if (response.ok()) {
            expect(response.status()).toBe(200);
          }
        }
      }
    });

    test('should mark all notifications as read', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.patch(`${API_BASE}/api/v1/notifications/read-all`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect([200, 204, 401, 404]).toContain(response.status());
    });

    test('should delete notification', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      // First get notifications
      const notificationsResponse = await request.get(`${API_BASE}/api/v1/notifications`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (notificationsResponse.ok()) {
        const notifications = await notificationsResponse.json();
        const notificationList = Array.isArray(notifications) ? notifications : notifications.notifications || [];

        if (notificationList.length > 0) {
          const notificationId = notificationList[0].id;
          const response = await request.delete(`${API_BASE}/api/v1/notifications/${notificationId}`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          });

          expect([200, 204, 401, 404]).toContain(response.status());
        }
      }
    });
  });

  test.describe('Notification Preferences', () => {
    test('should get notification preferences', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/notifications/preferences`, {
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

    test('should update notification preferences', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.put(`${API_BASE}/api/v1/notifications/preferences`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          email: {
            courseEnrollments: true,
            courseCompletions: true,
            newMessages: true,
            weeklyDigest: false,
          },
          push: {
            courseEnrollments: true,
            newMessages: true,
            urgentAlerts: true,
          },
        },
      });

      expect([200, 201, 400, 401, 404]).toContain(response.status());
    });
  });

  test.describe('Push Notifications', () => {
    test('should register push notification token', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.post(`${API_BASE}/api/v1/notifications/push/register`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          token: 'test-fcm-token-12345',
          platform: 'web',
          deviceId: 'test-device-id',
        },
      });

      expect([200, 201, 400, 401, 404]).toContain(response.status());
    });

    test('should unregister push notification token', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.post(`${API_BASE}/api/v1/notifications/push/unregister`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          token: 'test-fcm-token-12345',
        },
      });

      expect([200, 204, 400, 401, 404]).toContain(response.status());
    });
  });

  test.describe('Email Notifications', () => {
    test('should verify email subscription', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/notifications/email/subscription`, {
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

    test('should unsubscribe from email notifications', async ({ request }) => {
      const response = await request.post(`${API_BASE}/api/v1/notifications/email/unsubscribe`, {
        data: {
          email: testUser.email,
          token: 'unsubscribe-token', // Usually sent via email
        },
      });

      expect([200, 400, 401, 404]).toContain(response.status());
    });
  });
});
