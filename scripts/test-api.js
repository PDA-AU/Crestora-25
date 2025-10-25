#!/usr/bin/env node

/**
 * Simple test script to verify the API endpoints are working
 */

import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:8000/api/public';

async function testEndpoint(endpoint, name) {
  try {
    console.log(`\n🧪 Testing ${name}...`);
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ ${name} - Success!`);
    console.log(`   Response keys: ${Object.keys(data).join(', ')}`);
    
    if (data.rounds) {
      console.log(`   Rounds count: ${data.rounds.length}`);
    }
    if (data.rolling_events) {
      console.log(`   Rolling events count: ${data.rolling_events.length}`);
    }
    
    return data;
  } catch (error) {
    console.log(`❌ ${name} - Failed: ${error.message}`);
    return null;
  }
}

async function main() {
  console.log('🚀 Testing Crestora API Endpoints');
  console.log('=' * 50);
  
  // Test health check
  await testEndpoint('/health', 'Health Check');
  
  // Test rounds endpoint
  await testEndpoint('/rounds', 'Rounds Endpoint');
  
  // Test rolling events endpoint
  await testEndpoint('/rolling-events', 'Rolling Events Endpoint');
  
  // Test events endpoint
  await testEndpoint('/events', 'Events Endpoint');
  
  console.log('\n' + '=' * 50);
  console.log('🎉 API testing completed!');
  console.log('\n💡 Next steps:');
  console.log('   1. Make sure the backend server is running on port 8000');
  console.log('   2. Run the fetch script to get data: node scripts/fetch-rounds-events.js');
  console.log('   3. Check the generated JSON files in src/data/');
}

main().catch(console.error);
