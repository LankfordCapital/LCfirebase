#!/usr/bin/env node

/**
 * 🧪 Lankford Capital Deployment Verification Script
 * This script tests critical functionality after deployment
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'https://lankfordcapital.com';
const LOCAL_URL = 'http://localhost:3000';

// Test configuration
const tests = [
  {
    name: 'Home Page',
    url: '/',
    expectedStatus: 200,
    description: 'Landing page loads successfully'
  },
  {
    name: 'Sign In Page',
    url: '/auth/signin',
    expectedStatus: 200,
    description: 'Authentication page loads'
  },
  {
    name: 'API Health Check',
    url: '/api/test-env',
    expectedStatus: 200,
    description: 'API endpoints are responding'
  },
  {
    name: 'AI Assistant API',
    url: '/api/test-ai',
    expectedStatus: 200,
    description: 'AI assistant is configured'
  }
];

// Test function
async function testEndpoint(name, url, expectedStatus, description) {
  return new Promise((resolve) => {
    const fullUrl = `${BASE_URL}${url}`;
    const protocol = fullUrl.startsWith('https') ? https : http;
    
    console.log(`🧪 Testing ${name}...`);
    
    const req = protocol.get(fullUrl, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === expectedStatus) {
          console.log(`✅ ${name}: ${description}`);
          resolve({ success: true, status: res.statusCode });
        } else {
          console.log(`❌ ${name}: Expected ${expectedStatus}, got ${res.statusCode}`);
          resolve({ success: false, status: res.statusCode, error: `Expected ${expectedStatus}, got ${res.statusCode}` });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ ${name}: ${error.message}`);
      resolve({ success: false, error: error.message });
    });
    
    req.setTimeout(10000, () => {
      console.log(`❌ ${name}: Request timeout`);
      req.destroy();
      resolve({ success: false, error: 'Request timeout' });
    });
  });
}

// Main verification function
async function verifyDeployment() {
  console.log('🚀 Starting Lankford Capital Deployment Verification...\n');
  
  const results = [];
  
  for (const test of tests) {
    const result = await testEndpoint(test.name, test.url, test.expectedStatus, test.description);
    results.push({ ...test, ...result });
    console.log(''); // Empty line for readability
  }
  
  // Summary
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log('📊 Verification Summary:');
  console.log(`✅ Successful: ${successful}/${total}`);
  console.log(`❌ Failed: ${total - successful}/${total}`);
  
  if (successful === total) {
    console.log('\n🎉 All tests passed! Your deployment is working correctly.');
    console.log('🌐 Visit https://lankfordcapital.com to start using your application.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
    console.log('🔍 Check the Firebase Console for more details: https://console.firebase.google.com');
  }
  
  return successful === total;
}

// Run verification
if (require.main === module) {
  verifyDeployment()
    .then(success => process.exit(success ? 0 : 1))
    .catch(error => {
      console.error('❌ Verification failed:', error);
      process.exit(1);
    });
}

module.exports = { verifyDeployment, testEndpoint };
