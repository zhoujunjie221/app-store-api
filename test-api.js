#!/usr/bin/env node

/**
 * App Store API Test Script
 * 
 * This script tests all the API endpoints to ensure they're working correctly.
 * Make sure the server is running before executing this script.
 * 
 * Usage: node test-api.js
 */

const axios = require('axios');
require('dotenv').config();

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8081';
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error('❌ API_KEY not found in environment variables');
  console.error('Please set API_KEY in your .env file');
  process.exit(1);
}

const headers = {
  'x-api-key': API_KEY,
  'Content-Type': 'application/json'
};

class APITester {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.results = [];
  }

  async test(name, testFn) {
    try {
      console.log(`🧪 Testing: ${name}`);
      const result = await testFn();
      console.log(`✅ ${name} - PASSED`);
      this.passed++;
      this.results.push({ name, status: 'PASSED', result });
      return result;
    } catch (error) {
      console.log(`❌ ${name} - FAILED: ${error.message}`);
      this.failed++;
      this.results.push({ name, status: 'FAILED', error: error.message });
      return null;
    }
  }

  async makeRequest(endpoint, params = {}) {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      headers,
      params,
      timeout: 30000 // 30 second timeout
    });
    return response.data;
  }

  async runAllTests() {
    console.log('🚀 Starting App Store API Tests...\n');

    // Test 1: Get app details (Candy Crush Saga)
    await this.test('Get App Details', async () => {
      const result = await this.makeRequest('/app/553834731');
      if (!result.id || !result.title) {
        throw new Error('Invalid app data structure');
      }
      console.log(`   📱 App: ${result.title} (ID: ${result.id})`);
      return result;
    });

    // Test 2: Get app details with ratings
    await this.test('Get App Details with Ratings', async () => {
      const result = await this.makeRequest('/app/553834731', { ratings: true });
      if (!result.id || !result.title) {
        throw new Error('Invalid app data structure');
      }
      console.log(`   📊 App with ratings: ${result.title}`);
      return result;
    });

    // Test 3: Search for apps
    await this.test('Search Apps', async () => {
      const result = await this.makeRequest('/search', { 
        term: 'candy crush', 
        num: 5 
      });
      if (!Array.isArray(result) || result.length === 0) {
        throw new Error('Search returned no results');
      }
      console.log(`   🔍 Found ${result.length} apps for "candy crush"`);
      return result;
    });

    // Test 4: Get top free apps
    await this.test('Get Top Free Apps', async () => {
      const result = await this.makeRequest('/list/topfreeapplications', { 
        num: 10 
      });
      if (!Array.isArray(result) || result.length === 0) {
        throw new Error('List returned no results');
      }
      console.log(`   📋 Found ${result.length} top free apps`);
      return result;
    });

    // Test 5: Get top free games
    await this.test('Get Top Free Games', async () => {
      const result = await this.makeRequest('/list/topfreeapplications', { 
        category: 6014, 
        num: 5 
      });
      if (!Array.isArray(result) || result.length === 0) {
        throw new Error('Games list returned no results');
      }
      console.log(`   🎮 Found ${result.length} top free games`);
      return result;
    });

    // Test 6: Get developer apps (King - Candy Crush developer)
    await this.test('Get Developer Apps', async () => {
      const result = await this.makeRequest('/developer/526656015');
      if (!Array.isArray(result) || result.length === 0) {
        throw new Error('Developer apps returned no results');
      }
      console.log(`   👨‍💻 Found ${result.length} apps by King`);
      return result;
    });

    // Test 7: Get app reviews
    await this.test('Get App Reviews', async () => {
      const result = await this.makeRequest('/reviews/553834731', { 
        page: 1,
        sort: 'recent'
      });
      if (!Array.isArray(result)) {
        throw new Error('Reviews returned invalid data');
      }
      console.log(`   💬 Found ${result.length} reviews`);
      return result;
    });

    // Test 8: Get similar apps
    await this.test('Get Similar Apps', async () => {
      const result = await this.makeRequest('/similar/553834731');
      if (!Array.isArray(result)) {
        throw new Error('Similar apps returned invalid data');
      }
      console.log(`   🔗 Found ${result.length} similar apps`);
      return result;
    });

    // Test 9: Get app privacy details
    await this.test('Get App Privacy', async () => {
      const result = await this.makeRequest('/privacy/553834731');
      if (!result || typeof result !== 'object') {
        throw new Error('Privacy data returned invalid structure');
      }
      console.log(`   🔒 Privacy data retrieved`);
      return result;
    });

    // Test 10: Get version history
    await this.test('Get Version History', async () => {
      const result = await this.makeRequest('/version-history/553834731');
      if (!Array.isArray(result)) {
        throw new Error('Version history returned invalid data');
      }
      console.log(`   📝 Found ${result.length} version entries`);
      return result;
    });

    // Test 11: Test error handling (invalid app ID)
    await this.test('Error Handling (404)', async () => {
      try {
        await this.makeRequest('/app/invalid_id_12345');
        throw new Error('Should have returned 404 error');
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log(`   ✅ Correctly returned 404 for invalid app ID`);
          return { status: 404, message: 'App not found' };
        }
        throw error;
      }
    });

    // Test 12: Test authentication (invalid API key)
    await this.test('Authentication Error (401)', async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/app/553834731`, {
          headers: { 'x-api-key': 'invalid_key' },
          timeout: 10000
        });
        throw new Error('Should have returned 401 error');
      } catch (error) {
        if (error.response && error.response.status === 401) {
          console.log(`   ✅ Correctly returned 401 for invalid API key`);
          return { status: 401, message: 'Unauthorized' };
        }
        throw error;
      }
    });

    this.printSummary();
  }

  printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${this.passed}`);
    console.log(`❌ Failed: ${this.failed}`);
    console.log(`📈 Success Rate: ${((this.passed / (this.passed + this.failed)) * 100).toFixed(1)}%`);
    
    if (this.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => r.status === 'FAILED')
        .forEach(r => console.log(`   - ${r.name}: ${r.error}`));
    }

    console.log('\n' + '='.repeat(50));
    
    if (this.failed === 0) {
      console.log('🎉 All tests passed! Your API is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Please check the server logs and configuration.');
      process.exit(1);
    }
  }
}

// Run the tests
async function main() {
  const tester = new APITester();
  
  try {
    await tester.runAllTests();
  } catch (error) {
    console.error('❌ Test runner failed:', error.message);
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = APITester;
