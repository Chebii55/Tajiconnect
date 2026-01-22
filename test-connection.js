#!/usr/bin/env node

const axios = require('axios');

// Test configuration
const FRONTEND_URL = 'http://localhost:3000';
const BACKEND_GATEWAY_URL = 'http://localhost:8000';
const BACKEND_SERVICES = {
  'user-service': 'http://localhost:8001',
  'course-service': 'http://localhost:8002',
  'content-service': 'http://localhost:8003',
  'analytics-service': 'http://localhost:8004',
  'notification-service': 'http://localhost:8005',
  'payment-service': 'http://localhost:8006',
  'ai-service': 'http://localhost:8007'
};

async function testEndpoint(name, url) {
  try {
    const response = await axios.get(`${url}/health`, { timeout: 5000 });
    console.log(`✅ ${name}: ${response.status} - ${response.data?.message || 'OK'}`);
    return true;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log(`❌ ${name}: Connection refused - Service not running`);
    } else if (error.code === 'ENOTFOUND') {
      console.log(`❌ ${name}: Host not found`);
    } else if (error.response) {
      console.log(`⚠️  ${name}: ${error.response.status} - ${error.response.statusText}`);
    } else {
      console.log(`❌ ${name}: ${error.message}`);
    }
    return false;
  }
}

async function testFrontendBackendConnection() {
  console.log('🔍 Testing Frontend-Backend Connection...\n');
  
  // Test Gateway (main backend entry point)
  console.log('📡 Testing API Gateway:');
  const gatewayRunning = await testEndpoint('Gateway', BACKEND_GATEWAY_URL);
  
  console.log('\n🔧 Testing Individual Services:');
  const serviceResults = {};
  
  for (const [serviceName, serviceUrl] of Object.entries(BACKEND_SERVICES)) {
    serviceResults[serviceName] = await testEndpoint(serviceName, serviceUrl);
  }
  
  // Test frontend API client configuration
  console.log('\n🌐 Testing Frontend Configuration:');
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Check if frontend API client exists
    const apiClientPath = path.join(__dirname, 'frontend/src/services/api/client.ts');
    if (fs.existsSync(apiClientPath)) {
      const apiClientContent = fs.readFileSync(apiClientPath, 'utf8');
      const baseUrlMatch = apiClientContent.match(/baseURL:\s*.*?['"`]([^'"`]+)['"`]/);
      
      if (baseUrlMatch) {
        const configuredUrl = baseUrlMatch[1];
        console.log(`📋 Frontend API URL: ${configuredUrl}`);
        
        if (configuredUrl === BACKEND_GATEWAY_URL) {
          console.log('✅ Frontend correctly configured to use Gateway');
        } else {
          console.log('⚠️  Frontend URL doesn\'t match Gateway URL');
        }
      }
    } else {
      console.log('❌ Frontend API client not found');
    }
  } catch (error) {
    console.log(`❌ Error checking frontend config: ${error.message}`);
  }
  
  // Summary
  console.log('\n📊 Connection Test Summary:');
  console.log(`Gateway: ${gatewayRunning ? '✅ Running' : '❌ Not Running'}`);
  
  const runningServices = Object.values(serviceResults).filter(Boolean).length;
  const totalServices = Object.keys(serviceResults).length;
  console.log(`Services: ${runningServices}/${totalServices} running`);
  
  if (gatewayRunning) {
    console.log('\n🎉 Gateway is running! Frontend should be able to connect.');
    console.log('💡 Make sure your frontend is configured to use: http://localhost:8000');
  } else {
    console.log('\n⚠️  Gateway is not running. Start it with:');
    console.log('   cd TajiConnectMain && docker-compose up gateway');
  }
}

// Run the test
testFrontendBackendConnection().catch(console.error);
