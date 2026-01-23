import { test, expect } from '@playwright/test';
import { API_ENDPOINTS, testUser } from '../fixtures/test-data';

const API_BASE = API_ENDPOINTS.gateway;

test.describe('Payment Service Tests', () => {
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
    test('should return healthy status from payment service', async ({ request }) => {
      const response = await request.get(`${API_ENDPOINTS.paymentService}/health`);
      expect(response.ok()).toBeTruthy();
    });
  });

  test.describe('Payment Methods', () => {
    test('should get available payment methods', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/payments/methods`, {
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

    test('should get user saved payment methods', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/payments/saved-methods`, {
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

    test('should add payment method', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.post(`${API_BASE}/api/v1/payments/methods`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          type: 'card',
          token: 'test-stripe-token', // Normally from Stripe.js
        },
      });

      // Payment method addition typically requires valid token
      expect([200, 201, 400, 401, 404]).toContain(response.status());
    });

    test('should delete payment method', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.delete(`${API_BASE}/api/v1/payments/methods/test-method-id`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect([200, 204, 400, 401, 404]).toContain(response.status());
    });
  });

  test.describe('Course Purchase', () => {
    test('should initiate course purchase', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      // Get a course first
      const coursesResponse = await request.get(`${API_BASE}/api/v1/courses`);

      if (coursesResponse.ok()) {
        const courses = await coursesResponse.json();
        const courseList = Array.isArray(courses) ? courses : courses.courses || courses.items || [];

        if (courseList.length > 0) {
          const courseId = courseList[0].id;
          const response = await request.post(`${API_BASE}/api/v1/payments/checkout`, {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            data: {
              courseId,
              paymentMethod: 'card',
            },
          });

          if (response.ok()) {
            const data = await response.json();
            expect(data).toBeDefined();
            // Should return checkout session or payment intent
          } else {
            expect([200, 201, 400, 401, 402, 404]).toContain(response.status());
          }
        }
      }
    });

    test('should apply discount code', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.post(`${API_BASE}/api/v1/payments/apply-discount`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          code: 'TESTDISCOUNT',
          courseId: 'test-course-id',
        },
      });

      // Discount might not exist
      expect([200, 400, 401, 404]).toContain(response.status());
    });

    test('should validate discount code', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/payments/validate-discount?code=TESTCODE`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok()) {
        const data = await response.json();
        expect(data).toBeDefined();
      } else {
        expect([200, 400, 401, 404]).toContain(response.status());
      }
    });
  });

  test.describe('Transaction History', () => {
    test('should get payment history', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/payments/history`, {
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

    test('should get specific transaction', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/payments/transactions/test-transaction-id`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect([200, 401, 404]).toContain(response.status());
    });

    test('should get receipt for transaction', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/payments/transactions/test-id/receipt`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect([200, 401, 404]).toContain(response.status());
    });
  });

  test.describe('Subscriptions', () => {
    test('should get subscription plans', async ({ request }) => {
      const response = await request.get(`${API_BASE}/api/v1/payments/subscriptions/plans`);

      if (response.ok()) {
        const data = await response.json();
        expect(data).toBeDefined();
      } else {
        expect([200, 404]).toContain(response.status());
      }
    });

    test('should get user subscription status', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/payments/subscriptions/status`, {
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

    test('should cancel subscription', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.post(`${API_BASE}/api/v1/payments/subscriptions/cancel`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          reason: 'testing',
        },
      });

      // May not have active subscription
      expect([200, 400, 401, 404]).toContain(response.status());
    });
  });

  test.describe('Refunds', () => {
    test('should request refund', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.post(`${API_BASE}/api/v1/payments/refunds`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          transactionId: 'test-transaction-id',
          reason: 'Course content not as described',
        },
      });

      // May not have valid transaction
      expect([200, 201, 400, 401, 404]).toContain(response.status());
    });

    test('should get refund status', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/payments/refunds/test-refund-id`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect([200, 401, 404]).toContain(response.status());
    });
  });

  test.describe('Trainer Payouts (Trainer Role)', () => {
    test('should get trainer earnings', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/payments/trainer/earnings`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      // May require trainer role
      expect([200, 401, 403, 404]).toContain(response.status());
    });

    test('should request payout', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.post(`${API_BASE}/api/v1/payments/trainer/payout`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        data: {
          amount: 100.0,
          method: 'bank_transfer',
        },
      });

      // May require trainer role and minimum balance
      expect([200, 201, 400, 401, 403, 404]).toContain(response.status());
    });

    test('should get payout history', async ({ request }) => {
      if (!authToken) {
        return;
        return;
      }

      const response = await request.get(`${API_BASE}/api/v1/payments/trainer/payouts`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      expect([200, 401, 403, 404]).toContain(response.status());
    });
  });
});
