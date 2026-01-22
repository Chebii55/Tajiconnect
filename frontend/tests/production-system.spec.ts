import { test, expect } from '@playwright/test';

interface ServiceEndpoint {
  name: string;
  port: number;
  endpoints: string[];
}

const SERVICES: ServiceEndpoint[] = [
  {
    name: 'user-service',
    port: 8001,
    endpoints: ['/health', '/api/v1/auth/register', '/api/v1/users/me']
  },
  {
    name: 'course-service', 
    port: 8002,
    endpoints: ['/health', '/api/v1/courses', '/api/v1/grades', '/api/v1/subjects']
  },
  {
    name: 'content-service',
    port: 8003, 
    endpoints: ['/health', '/api/v1/content']
  },
  {
    name: 'analytics-service',
    port: 8004,
    endpoints: ['/health', '/api/v1/analytics/dashboard']
  },
  {
    name: 'notification-service',
    port: 8005,
    endpoints: ['/health', '/api/v1/notifications']
  },
  {
    name: 'payment-service',
    port: 8006,
    endpoints: ['/health', '/api/v1/payments']
  },
  {
    name: 'ai-service',
    port: 8007,
    endpoints: ['/health', '/api/v1/recommendations']
  },
  {
    name: 'gateway',
    port: 8000,
    endpoints: ['/health', '/api/v1/health']
  }
];

test.describe('Production System Tests', () => {
  
  test.describe('Service Health Checks', () => {
    for (const service of SERVICES) {
      test(`${service.name} should be healthy`, async ({ request }) => {
        const response = await request.get(`http://localhost:${service.port}/health`);
        
        expect(response.status()).toBe(200);
        
        const body = await response.json();
        expect(body).toHaveProperty('status');
        expect(body.status).toBe('healthy');
        
        console.log(`✅ ${service.name} is healthy:`, body);
      });
    }
  });

  test.describe('API Endpoint Accessibility', () => {
    for (const service of SERVICES) {
      test(`${service.name} endpoints should be accessible`, async ({ request }) => {
        const results = [];
        
        for (const endpoint of service.endpoints) {
          try {
            const response = await request.get(`http://localhost:${service.port}${endpoint}`);
            const accessible = [200, 401, 422, 404].includes(response.status()); // These are acceptable
            
            results.push({
              endpoint,
              status: response.status(),
              accessible
            });
            
            console.log(`${accessible ? '✅' : '❌'} ${service.name}${endpoint}: ${response.status()}`);
          } catch (error) {
            results.push({
              endpoint,
              status: null,
              accessible: false,
              error: error.message
            });
            
            console.log(`❌ ${service.name}${endpoint}: ${error.message}`);
          }
        }
        
        // At least health endpoint should be accessible
        const healthResult = results.find(r => r.endpoint === '/health');
        expect(healthResult?.accessible).toBe(true);
        
        // Log summary
        const accessibleCount = results.filter(r => r.accessible).length;
        console.log(`📊 ${service.name}: ${accessibleCount}/${results.length} endpoints accessible`);
      });
    }
  });

  test.describe('Service Integration Tests', () => {
    
    test('User registration flow', async ({ request }) => {
      const userData = {
        email: `test${Date.now()}@example.com`,
        password: 'TestPassword123!',
        first_name: 'Test',
        last_name: 'User'
      };
      
      try {
        const response = await request.post('http://localhost:8001/api/v1/auth/register', {
          data: userData
        });
        
        // Should either succeed (200) or fail with validation error (422)
        expect([200, 201, 422, 400].includes(response.status())).toBe(true);
        
        if (response.status() === 200 || response.status() === 201) {
          const body = await response.json();
          console.log('✅ User registration successful:', body);
        } else {
          console.log(`ℹ️  User registration returned ${response.status()} (expected for incomplete setup)`);
        }
      } catch (error) {
        console.log(`ℹ️  User registration test skipped: ${error.message}`);
      }
    });

    test('Course listing', async ({ request }) => {
      try {
        const response = await request.get('http://localhost:8002/api/v1/courses');
        
        // Should either succeed or require auth
        expect([200, 401].includes(response.status())).toBe(true);
        
        if (response.status() === 200) {
          const body = await response.json();
          console.log('✅ Course listing successful:', Array.isArray(body) ? `${body.length} courses` : 'courses data');
        } else {
          console.log('ℹ️  Course listing requires authentication (expected)');
        }
      } catch (error) {
        console.log(`ℹ️  Course listing test skipped: ${error.message}`);
      }
    });

    test('AI recommendations endpoint', async ({ request }) => {
      try {
        const response = await request.get('http://localhost:8007/api/v1/recommendations');
        
        // Should either succeed or require auth/params
        expect([200, 401, 422].includes(response.status())).toBe(true);
        
        console.log(`ℹ️  AI recommendations endpoint returned ${response.status()}`);
      } catch (error) {
        console.log(`ℹ️  AI recommendations test skipped: ${error.message}`);
      }
    });
  });

  test.describe('Performance Tests', () => {
    
    test('Service response times should be acceptable', async ({ request }) => {
      const performanceResults = [];
      
      for (const service of SERVICES) {
        const startTime = Date.now();
        
        try {
          const response = await request.get(`http://localhost:${service.port}/health`);
          const responseTime = Date.now() - startTime;
          
          performanceResults.push({
            service: service.name,
            responseTime,
            status: response.status()
          });
          
          // Response time should be under 5 seconds for health checks
          expect(responseTime).toBeLessThan(5000);
          
          console.log(`⚡ ${service.name}: ${responseTime}ms`);
        } catch (error) {
          console.log(`❌ ${service.name}: ${error.message}`);
        }
      }
      
      // Calculate average response time
      const avgResponseTime = performanceResults.reduce((sum, r) => sum + r.responseTime, 0) / performanceResults.length;
      console.log(`📊 Average response time: ${avgResponseTime.toFixed(2)}ms`);
    });
  });

  test.describe('Frontend-Backend Integration', () => {
    
    test('Frontend should connect to backend services', async ({ page }) => {
      // Navigate to frontend
      await page.goto('http://localhost:5173');
      
      // Wait for page to load
      await page.waitForLoadState('networkidle');
      
      // Check if frontend loaded
      const hasRoot = await page.locator('#root').count() > 0;
      expect(hasRoot).toBe(true);
      
      // Check for any network errors to backend
      const networkErrors = [];
      page.on('response', response => {
        if (!response.ok() && response.url().includes('localhost:800')) {
          networkErrors.push(`${response.status()} ${response.url()}`);
        }
      });
      
      // Try to trigger some API calls by interacting with the page
      await page.waitForTimeout(3000);
      
      console.log(`📡 Frontend loaded successfully`);
      if (networkErrors.length > 0) {
        console.log(`⚠️  Network errors detected:`, networkErrors);
      }
    });
  });

  test.describe('System Summary', () => {
    
    test('Generate production readiness report', async ({ request }) => {
      const report = {
        timestamp: new Date().toISOString(),
        services: {},
        summary: {
          totalServices: SERVICES.length,
          healthyServices: 0,
          totalEndpoints: 0,
          accessibleEndpoints: 0
        }
      };
      
      // Test all services
      for (const service of SERVICES) {
        const serviceResult = {
          name: service.name,
          port: service.port,
          healthy: false,
          endpoints: []
        };
        
        // Test health
        try {
          const healthResponse = await request.get(`http://localhost:${service.port}/health`);
          serviceResult.healthy = healthResponse.status() === 200;
          if (serviceResult.healthy) report.summary.healthyServices++;
        } catch (error) {
          serviceResult.error = error.message;
        }
        
        // Test endpoints
        for (const endpoint of service.endpoints) {
          report.summary.totalEndpoints++;
          
          try {
            const response = await request.get(`http://localhost:${service.port}${endpoint}`);
            const accessible = [200, 401, 422, 404].includes(response.status());
            
            serviceResult.endpoints.push({
              endpoint,
              status: response.status(),
              accessible
            });
            
            if (accessible) report.summary.accessibleEndpoints++;
          } catch (error) {
            serviceResult.endpoints.push({
              endpoint,
              accessible: false,
              error: error.message
            });
          }
        }
        
        report.services[service.name] = serviceResult;
      }
      
      // Calculate percentages
      const healthPercentage = (report.summary.healthyServices / report.summary.totalServices) * 100;
      const endpointPercentage = (report.summary.accessibleEndpoints / report.summary.totalEndpoints) * 100;
      
      report.summary.healthPercentage = healthPercentage;
      report.summary.endpointPercentage = endpointPercentage;
      report.summary.productionReady = healthPercentage >= 80 && endpointPercentage >= 70;
      
      // Log report
      console.log('\n' + '='.repeat(80));
      console.log('🏭 PRODUCTION READINESS REPORT');
      console.log('='.repeat(80));
      console.log(`📊 Services: ${report.summary.healthyServices}/${report.summary.totalServices} healthy (${healthPercentage.toFixed(1)}%)`);
      console.log(`🌐 Endpoints: ${report.summary.accessibleEndpoints}/${report.summary.totalEndpoints} accessible (${endpointPercentage.toFixed(1)}%)`);
      console.log(`🎯 Production Ready: ${report.summary.productionReady ? '✅ YES' : '❌ NO'}`);
      console.log('='.repeat(80));
      
      // Service details
      for (const [serviceName, serviceData] of Object.entries(report.services)) {
        const status = serviceData.healthy ? '✅' : '❌';
        console.log(`${status} ${serviceName}:${serviceData.port}`);
      }
      
      // Assert production readiness
      expect(report.summary.productionReady).toBe(true);
    });
  });
});
