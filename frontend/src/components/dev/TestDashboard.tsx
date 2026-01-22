import React, { useState, useEffect } from 'react';
import { testApiIntegration, validateUserProfile, validatePerformanceMetrics } from '../../utils/validation';
import { testScenarios } from '../../utils/mockData';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  duration?: number;
}

const TestDashboard: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    const testResults: TestResult[] = [];

    // API Integration Tests
    const startTime = Date.now();
    try {
      const integrationResults = await testApiIntegration();
      const duration = Date.now() - startTime;
      
      Object.entries(integrationResults).forEach(([service, success]) => {
        testResults.push({
          name: `${service} API Integration`,
          status: success ? 'success' : 'error',
          message: success ? 'API endpoint responding correctly' : 'API endpoint failed',
          duration
        });
      });
    } catch (error) {
      testResults.push({
        name: 'API Integration',
        status: 'error',
        message: 'Failed to test API integration',
        duration: Date.now() - startTime
      });
    }

    // Data Validation Tests
    try {
      const profileValidation = validateUserProfile(testScenarios.success.psychometric);
      testResults.push({
        name: 'User Profile Validation',
        status: profileValidation.isValid ? 'success' : 'error',
        message: profileValidation.isValid ? 'Profile data structure valid' : profileValidation.errors.join(', ')
      });

      const performanceValidation = validatePerformanceMetrics(testScenarios.success.performance);
      testResults.push({
        name: 'Performance Metrics Validation',
        status: performanceValidation.isValid ? 'success' : 'error',
        message: performanceValidation.isValid ? 'Performance data structure valid' : performanceValidation.errors.join(', ')
      });
    } catch (error) {
      testResults.push({
        name: 'Data Validation',
        status: 'error',
        message: 'Validation tests failed'
      });
    }

    // Error Handling Tests
    try {
      await testScenarios.failure.networkError().catch(() => {
        testResults.push({
          name: 'Error Handling',
          status: 'success',
          message: 'Network errors handled correctly'
        });
      });
    } catch (error) {
      testResults.push({
        name: 'Error Handling',
        status: 'warning',
        message: 'Error handling needs improvement'
      });
    }

    // Performance Tests
    const perfStart = Date.now();
    try {
      await testScenarios.slow.analysis();
      const perfDuration = Date.now() - perfStart;
      testResults.push({
        name: 'Performance Test',
        status: perfDuration > 10000 ? 'warning' : 'success',
        message: `AI analysis completed in ${perfDuration}ms`,
        duration: perfDuration
      });
    } catch (error) {
      testResults.push({
        name: 'Performance Test',
        status: 'error',
        message: 'Performance test failed'
      });
    }

    setTests(testResults);
    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  useEffect(() => {
    // Auto-run tests on component mount in development
    if (process.env.REACT_APP_ENV === 'development') {
      runTests();
    }
  }, []);

  const successCount = tests.filter(t => t.status === 'success').length;
  const errorCount = tests.filter(t => t.status === 'error').length;
  const warningCount = tests.filter(t => t.status === 'warning').length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">AI Integration Test Dashboard</h2>
            <button
              onClick={runTests}
              disabled={isRunning}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {isRunning ? 'Running Tests...' : 'Run Tests'}
            </button>
          </div>
          
          {tests.length > 0 && (
            <div className="flex gap-4 mt-4 text-sm">
              <span className="text-green-600">✓ {successCount} Passed</span>
              <span className="text-red-600">✗ {errorCount} Failed</span>
              <span className="text-yellow-600">⚠ {warningCount} Warnings</span>
            </div>
          )}
        </div>

        <div className="p-6">
          {tests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Click "Run Tests" to validate AI integration
            </div>
          ) : (
            <div className="space-y-4">
              {tests.map((test, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getStatusColor(test.status)}`}>
                  <div className="flex items-start gap-3">
                    {getStatusIcon(test.status)}
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{test.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{test.message}</p>
                      {test.duration && (
                        <p className="text-xs text-gray-500 mt-1">Duration: {test.duration}ms</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestDashboard;
