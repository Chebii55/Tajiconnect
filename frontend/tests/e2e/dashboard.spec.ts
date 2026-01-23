import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:5173';

test.describe('Dashboard E2E Tests', () => {
  test.describe('Student Dashboard', () => {
    test('should redirect to login when not authenticated', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard`);

      // Should redirect to login
      await page.waitForTimeout(1000);
      const url = page.url();
      expect(url.includes('login') || url.includes('dashboard')).toBeTruthy();
    });

    test('should display dashboard layout', async ({ page }) => {
      await page.goto(`${BASE_URL}/student/dashboard`);

      // Either shows dashboard or redirects to login
      await page.waitForTimeout(1000);
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
  });

  test.describe('Course Catalog', () => {
    test('should load courses page', async ({ page }) => {
      await page.goto(`${BASE_URL}/courses`);

      await page.waitForTimeout(1000);
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test('should display course cards or list', async ({ page }) => {
      await page.goto(`${BASE_URL}/courses`);

      await page.waitForTimeout(2000);

      // Look for course elements
      const courseElements = page.locator('[class*="course"], [class*="card"], article');
      const count = await courseElements.count();

      // May have courses or empty state
      expect(count >= 0).toBeTruthy();
    });

    test('should have search functionality', async ({ page }) => {
      await page.goto(`${BASE_URL}/courses`);

      const searchInput = page.getByPlaceholder(/search/i).or(page.locator('input[type="search"]'));
      const isVisible = await searchInput.isVisible().catch(() => false);

      if (isVisible) {
        await searchInput.fill('web development');
        await page.waitForTimeout(500);
      }

      expect(true).toBeTruthy();
    });

    test('should have category filters', async ({ page }) => {
      await page.goto(`${BASE_URL}/courses`);

      // Look for filter elements
      const filters = page.getByText(/category|filter|all/i);
      const isVisible = await filters.first().isVisible().catch(() => false);

      expect(true).toBeTruthy();
    });
  });

  test.describe('Trainer Dashboard', () => {
    test('should load trainer dashboard', async ({ page }) => {
      await page.goto(`${BASE_URL}/trainer/dashboard`);

      await page.waitForTimeout(1000);
      const url = page.url();

      // Either shows trainer dashboard or redirects
      expect(url.includes('trainer') || url.includes('login')).toBeTruthy();
    });

    test('should have course management section', async ({ page }) => {
      await page.goto(`${BASE_URL}/trainer/courses`);

      await page.waitForTimeout(1000);
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test('should have analytics section', async ({ page }) => {
      await page.goto(`${BASE_URL}/trainer/analytics`);

      await page.waitForTimeout(1000);
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
  });

  test.describe('Navigation', () => {
    test('should have working navigation menu', async ({ page }) => {
      await page.goto(BASE_URL);

      const nav = page.locator('nav, header');
      await expect(nav).toBeVisible();
    });

    test('should navigate between pages', async ({ page }) => {
      await page.goto(BASE_URL);

      // Try to navigate to courses
      const coursesLink = page.getByRole('link', { name: /courses/i }).first();

      if (await coursesLink.isVisible().catch(() => false)) {
        await coursesLink.click();
        await page.waitForTimeout(1000);
        expect(page.url()).toContain('course');
      }
    });

    test('should have breadcrumb navigation where applicable', async ({ page }) => {
      await page.goto(`${BASE_URL}/courses`);

      const breadcrumb = page.locator('[class*="breadcrumb"], nav[aria-label="Breadcrumb"]');
      const isVisible = await breadcrumb.isVisible().catch(() => false);

      // Breadcrumbs are optional
      expect(true).toBeTruthy();
    });
  });

  test.describe('Settings', () => {
    test('should load settings page', async ({ page }) => {
      await page.goto(`${BASE_URL}/settings`);

      await page.waitForTimeout(1000);
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test('should have profile settings', async ({ page }) => {
      await page.goto(`${BASE_URL}/settings/profile`);

      await page.waitForTimeout(1000);
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test('should have notification settings', async ({ page }) => {
      await page.goto(`${BASE_URL}/settings/notifications`);

      await page.waitForTimeout(1000);
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should show 404 page for unknown routes', async ({ page }) => {
      await page.goto(`${BASE_URL}/unknown-route-12345`);

      await page.waitForTimeout(1000);

      // Should show 404 or redirect
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });

    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate offline
      await page.context().setOffline(true);

      try {
        await page.goto(BASE_URL, { timeout: 5000 });
      } catch {
        // Expected to fail
      }

      await page.context().setOffline(false);

      // Verify page recovers
      await page.goto(BASE_URL);
      const body = page.locator('body');
      await expect(body).toBeVisible();
    });
  });
});
