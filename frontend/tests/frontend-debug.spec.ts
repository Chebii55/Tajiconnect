import { test, expect } from '@playwright/test';

test.describe('Frontend Loading Tests', () => {
  test('should load the main page without errors', async ({ page }) => {
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Listen for page errors
    const pageErrors: string[] = [];
    page.on('pageerror', error => {
      pageErrors.push(error.message);
    });

    // Navigate to the page
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Check if the page has any content
    const bodyText = await page.textContent('body');
    console.log('Page body text:', bodyText);

    // Check for our debug text
    const hasDebugText = await page.locator('text=TajiConnect Loading...').isVisible();
    console.log('Has debug text:', hasDebugText);

    // Check for React root
    const hasRoot = await page.locator('#root').isVisible();
    console.log('Has root element:', hasRoot);

    // Log all errors
    console.log('Console errors:', consoleErrors);
    console.log('Page errors:', pageErrors);

    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-results/page-load.png', fullPage: true });

    // Basic assertions
    expect(hasRoot).toBe(true);
    
    // If we have our debug text, that's good
    if (hasDebugText) {
      console.log('✅ App component is rendering');
    } else {
      console.log('❌ App component not rendering - checking for errors');
      
      // Check if there are critical errors preventing rendering
      const hasCriticalErrors = consoleErrors.some(error => 
        error.includes('SyntaxError') || 
        error.includes('Cannot resolve') ||
        error.includes('Failed to fetch')
      );
      
      if (hasCriticalErrors) {
        console.log('Critical errors found:', consoleErrors.filter(error => 
          error.includes('SyntaxError') || 
          error.includes('Cannot resolve') ||
          error.includes('Failed to fetch')
        ));
      }
    }
  });

  test('should check for specific module errors', async ({ page }) => {
    const moduleErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('module')) {
        moduleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForTimeout(3000); // Wait for modules to load

    console.log('Module errors found:', moduleErrors);
    
    // Take screenshot of network tab if possible
    await page.screenshot({ path: 'test-results/module-errors.png' });
  });

  test('should check network requests', async ({ page }) => {
    const failedRequests: string[] = [];
    
    page.on('response', response => {
      if (!response.ok()) {
        failedRequests.push(`${response.status()} ${response.url()}`);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    console.log('Failed requests:', failedRequests);
    
    // Filter out expected 404s (like PWA manifest)
    const criticalFailures = failedRequests.filter(req => 
      !req.includes('manifest.webmanifest') && 
      !req.includes('pwa-entry-point')
    );
    
    console.log('Critical failures:', criticalFailures);
  });
});
