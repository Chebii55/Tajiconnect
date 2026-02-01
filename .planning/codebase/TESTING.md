# Testing Patterns

**Analysis Date:** 2026-02-02

## Test Framework

**Runner:**
- Playwright Test (E2E and API testing)
- Version: ^1.57.0
- Config: `frontend/playwright.config.ts`

**Assertion Library:**
- Playwright's built-in `expect` assertions

**Run Commands:**
```bash
npx playwright test                    # Run all tests
npx playwright test --ui               # Interactive UI mode
npx playwright test --headed           # Run with browser visible
npx playwright test tests/api/         # Run API tests only
npx playwright test tests/e2e/         # Run E2E tests only
npx playwright show-report             # View HTML report
```

## Test Configuration

**Playwright Config (`frontend/playwright.config.ts`):**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Key Settings:**
- Tests run in parallel by default
- Single browser project (Chromium)
- Auto-starts dev server before tests
- Traces captured on first retry for debugging

## Test File Organization

**Location:**
- All tests in `frontend/tests/` directory
- Separate directories for test types

**Directory Structure:**
```
frontend/tests/
├── api/                    # API/service tests
│   ├── ai.spec.ts
│   ├── analytics.spec.ts
│   ├── auth.spec.ts
│   ├── content.spec.ts
│   ├── courses.spec.ts
│   ├── notification.spec.ts
│   ├── payment.spec.ts
│   └── user.spec.ts
├── e2e/                    # End-to-end UI tests
│   ├── dashboard.spec.ts
│   └── onboarding.spec.ts
└── fixtures/               # Shared test data
    └── test-data.ts
```

**Naming:**
- Test files: `{feature}.spec.ts`
- API tests grouped by service/domain
- E2E tests grouped by feature/flow

## Test Structure

**Suite Organization:**
```typescript
import { test, expect } from '@playwright/test';
import { API_ENDPOINTS, testUser, newUser } from '../fixtures/test-data';

const API_BASE = API_ENDPOINTS.gateway;

test.describe('Authentication Service Tests', () => {
  test.describe('Health Check', () => {
    test('should return healthy status from gateway', async ({ request }) => {
      const response = await request.get(`${API_BASE}/health`);
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.status).toBe('healthy');
    });
  });

  test.describe('User Registration', () => {
    test('should register a new user successfully', async ({ request }) => {
      // Test implementation
    });
  });
});
```

**Patterns:**
- Outer `describe` for service/feature
- Inner `describe` for related functionality
- Individual `test` for specific behaviors
- Descriptive test names: `should {expected behavior}`

## API Testing Pattern

**Request Handling:**
```typescript
test('should login with valid credentials', async ({ request }) => {
  const response = await request.post(`${API_BASE}/api/v1/auth/login`, {
    data: {
      email: testUser.email,
      password: testUser.password,
    },
  });

  // Handle potential service unavailability
  if (response.ok()) {
    try {
      const data = await response.json();
      if (data && typeof data === 'object' && data.access_token) {
        expect(data).toHaveProperty('refresh_token');
        expect(data).toHaveProperty('token_type');
      }
    } catch {
      // Response might not be JSON - service error
    }
  } else {
    expect([401, 404, 422, 500, 503]).toContain(response.status());
  }
});
```

**Error Tolerance Pattern:**
- Tests handle both success and various error codes
- Accept multiple status codes when backend may be unavailable
- Use try/catch for JSON parsing failures
- Graceful degradation when services are down

## E2E Testing Pattern

**Page Navigation:**
```typescript
const BASE_URL = 'http://localhost:5173';

test('should redirect to login when not authenticated', async ({ page }) => {
  await page.goto(`${BASE_URL}/dashboard`);
  await page.waitForTimeout(1000);
  const url = page.url();
  expect(url.includes('login') || url.includes('dashboard')).toBeTruthy();
});
```

**Element Selection:**
```typescript
// By role (preferred)
const loginLink = page.getByRole('link', { name: /login|sign in/i });
const submitButton = page.getByRole('button', { name: /sign up|register|submit/i });

// By label
const emailField = page.getByLabel(/email/i).or(page.locator('input[type="email"]'));

// By placeholder
const searchInput = page.getByPlaceholder(/search/i);

// By CSS selector (fallback)
const courseElements = page.locator('[class*="course"], [class*="card"], article');
```

**Visibility Checks:**
```typescript
// Safe visibility check with fallback
const isVisible = await signupButton.isVisible().catch(() => false);
if (isVisible) {
  await signupButton.click();
}
```

## Setup and Teardown

**beforeAll for Shared Setup:**
```typescript
test.describe('User Service Tests', () => {
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

  test('should get current user profile with valid token', async ({ request }) => {
    if (!authToken) {
      return; // Skip if setup failed
    }
    // Test using authToken
  });
});
```

**beforeEach for Per-Test Setup:**
```typescript
test.describe('Onboarding Steps', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/onboarding`);
  });

  test('should load onboarding page', async ({ page }) => {
    const url = page.url();
    expect(url.includes('onboarding') || url.includes('login')).toBeTruthy();
  });
});
```

## Fixtures and Test Data

**Fixture Location:**
- `frontend/tests/fixtures/test-data.ts`

**Test Data Pattern:**
```typescript
// Static test user
export const testUser = {
  email: 'test@example.com',
  password: 'TestPassword123!',
  firstName: 'Test',
  lastName: 'User',
  dateOfBirth: '1995-01-15',
};

// Dynamic test user (unique per run)
export const newUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'NewPassword123!',
  firstName: 'New',
  lastName: 'TestUser',
  dateOfBirth: '1998-06-20',
};

// API endpoints configuration
export const API_ENDPOINTS = {
  gateway: 'http://localhost:8000',
  userService: 'http://localhost:8001',
  courseService: 'http://localhost:8002',
  // ... more services
};
```

**Domain Objects:**
```typescript
export const testCourse = {
  title: 'Introduction to Web Development',
  description: 'Learn the fundamentals...',
  category: 'Technology',
  level: 'beginner',
  price: 49.99,
  duration: '8 weeks',
};

export const testAssessment = {
  title: 'HTML Basics Quiz',
  description: 'Test your knowledge...',
  questions: [
    {
      question: 'What does HTML stand for?',
      options: [...],
      correctAnswer: 0,
    },
  ],
};
```

## Assertions

**Common Assertions:**
```typescript
// Status checks
expect(response.ok()).toBeTruthy();
expect([200, 201, 400, 409]).toContain(response.status());

// Property checks
expect(data).toHaveProperty('access_token');
expect(data).toHaveProperty('refresh_token');

// Value checks
expect(data.email).toBe(uniqueUser.email);
expect(data.status).toBe('healthy');

// Type checks
expect(Array.isArray(data) || data.achievements).toBeTruthy();
expect(data && typeof data === 'object').toBeTruthy();

// Visibility (E2E)
await expect(body).toBeVisible();
await expect(nav).toBeVisible();

// URL checks
expect(page.url()).toContain('course');
await expect(page).toHaveURL(/register|signup/i);
await expect(page).toHaveTitle(/Taji/i);
```

## Handling Flaky Scenarios

**Timeout Handling:**
```typescript
// Wait for navigation/rendering
await page.waitForTimeout(1000);

// Conditional waits
await page.waitForTimeout(2000);
const courseElements = page.locator('[class*="course"]');
const count = await courseElements.count();
```

**Optional Element Pattern:**
```typescript
test('should have search functionality', async ({ page }) => {
  await page.goto(`${BASE_URL}/courses`);

  const searchInput = page.getByPlaceholder(/search/i)
    .or(page.locator('input[type="search"]'));
  const isVisible = await searchInput.isVisible().catch(() => false);

  if (isVisible) {
    await searchInput.fill('web development');
    await page.waitForTimeout(500);
  }

  // Test passes regardless - feature is optional
  expect(true).toBeTruthy();
});
```

**Graceful Skip Pattern:**
```typescript
test('should display profile setup step', async ({ page }) => {
  // If redirected to login, this test is skipped
  if (page.url().includes('login')) {
    return;
  }

  // Actual test logic
  const profileHeading = page.getByText(/profile|about you/i);
  await expect(profileHeading).toBeVisible();
});
```

## Responsive Testing

**Viewport Testing:**
```typescript
test('should be responsive on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
  await page.goto(BASE_URL);

  const body = page.locator('body');
  const scrollWidth = await body.evaluate((el) => el.scrollWidth);
  const clientWidth = await body.evaluate((el) => el.clientWidth);

  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 10);
});

test('should be responsive on tablet', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 }); // iPad
  await page.goto(BASE_URL);
  // ...
});
```

## Accessibility Testing

**Basic Accessibility Checks:**
```typescript
test('should have proper heading hierarchy', async ({ page }) => {
  await page.goto(BASE_URL);
  const h1 = page.locator('h1');
  const h1Count = await h1.count();
  expect(h1Count).toBeGreaterThanOrEqual(0);
});

test('should have alt text on images', async ({ page }) => {
  await page.goto(BASE_URL);
  const images = page.locator('img');
  const imageCount = await images.count();

  for (let i = 0; i < Math.min(imageCount, 5); i++) {
    const img = images.nth(i);
    const alt = await img.getAttribute('alt');
    expect(alt !== null).toBeTruthy();
  }
});

test('should be keyboard navigable', async ({ page }) => {
  await page.goto(BASE_URL);
  await page.keyboard.press('Tab');
  const focusedElement = page.locator(':focus');
  await expect(focusedElement).toBeVisible();
});
```

## Performance Testing

**Load Time Checks:**
```typescript
test('should load landing page within acceptable time', async ({ page }) => {
  const startTime = Date.now();
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
  const loadTime = Date.now() - startTime;
  expect(loadTime).toBeLessThan(5000);
});
```

**Console Error Monitoring:**
```typescript
test('should have no console errors on landing page', async ({ page }) => {
  const errors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  await page.goto(BASE_URL);
  await page.waitForTimeout(1000);

  // Filter acceptable errors
  const criticalErrors = errors.filter(
    (e) => !e.includes('favicon') && !e.includes('404')
  );

  if (criticalErrors.length > 0) {
    console.log('Console errors:', criticalErrors);
  }
});
```

## Coverage

**Requirements:** Not enforced (no coverage targets configured)

**Notes:**
- No unit test framework configured (Jest/Vitest)
- Coverage primarily through E2E and API tests
- Playwright traces available for debugging failures

## Test Types Summary

**API Tests (`tests/api/`):**
- Test microservice endpoints directly
- Verify authentication flows
- Test CRUD operations
- Handle service unavailability gracefully

**E2E Tests (`tests/e2e/`):**
- Test complete user flows
- Verify page navigation
- Test responsive design
- Check accessibility basics
- Monitor performance

**Unit Tests:**
- Not configured; no Jest/Vitest setup
- Gap: Component logic not unit tested
- Gap: Hook logic not isolated tested

## Adding New Tests

**New API Test:**
1. Create file in `frontend/tests/api/{service}.spec.ts`
2. Import fixtures from `../fixtures/test-data`
3. Use `test.describe` for service grouping
4. Follow graceful error handling pattern

**New E2E Test:**
1. Create file in `frontend/tests/e2e/{feature}.spec.ts`
2. Define `BASE_URL` constant
3. Use role-based selectors (`getByRole`, `getByLabel`)
4. Handle authentication state appropriately

**New Fixture Data:**
1. Add to `frontend/tests/fixtures/test-data.ts`
2. Export as named constant
3. Use `Date.now()` for unique values when needed

---

*Testing analysis: 2026-02-02*
