import { test, expect } from '@playwright/test';

test.describe('Deep System Analysis', () => {
  test('should identify the exact failing module', async ({ page }) => {
    const moduleErrors: Array<{error: string, stack?: string}> = [];
    const consoleMessages: Array<{type: string, text: string}> = [];
    
    // Capture all console messages
    page.on('console', msg => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text()
      });
    });

    // Capture page errors with stack traces
    page.on('pageerror', error => {
      moduleErrors.push({
        error: error.message,
        stack: error.stack
      });
    });

    // Navigate and wait
    await page.goto('/');
    await page.waitForTimeout(5000); // Give time for all modules to load

    console.log('\n=== CONSOLE MESSAGES ===');
    consoleMessages.forEach((msg, i) => {
      console.log(`${i + 1}. [${msg.type.toUpperCase()}] ${msg.text}`);
    });

    console.log('\n=== MODULE ERRORS ===');
    moduleErrors.forEach((error, i) => {
      console.log(`${i + 1}. ERROR: ${error.error}`);
      if (error.stack) {
        console.log(`   STACK: ${error.stack}`);
      }
    });

    // Check if React root exists
    const rootExists = await page.locator('#root').count() > 0;
    console.log(`\n=== ROOT ELEMENT ===`);
    console.log(`Root exists: ${rootExists}`);

    if (rootExists) {
      const rootContent = await page.locator('#root').innerHTML();
      console.log(`Root content: ${rootContent.substring(0, 200)}...`);
    }

    // Check if any React components loaded
    const hasReactComponents = await page.locator('[data-reactroot], [data-react-helmet]').count() > 0;
    console.log(`React components loaded: ${hasReactComponents}`);

    // Take screenshot for visual debugging
    await page.screenshot({ 
      path: 'test-results/deep-analysis.png', 
      fullPage: true 
    });

    // The test should pass - we're just gathering info
    expect(true).toBe(true);
  });

  test('should test individual component imports', async ({ page }) => {
    // Test if we can access the types module directly
    const typesModuleTest = await page.evaluate(async () => {
      try {
        const module = await import('/src/services/api/types.ts');
        return {
          success: true,
          exports: Object.keys(module),
          hasApiError: 'ApiError' in module,
          hasPsychometricResponse: 'PsychometricResponse' in module
        };
      } catch (error) {
        return {
          success: false,
          error: error.message
        };
      }
    });

    console.log('\n=== TYPES MODULE TEST ===');
    console.log(JSON.stringify(typesModuleTest, null, 2));

    expect(true).toBe(true);
  });
});
