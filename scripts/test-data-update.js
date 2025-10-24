#!/usr/bin/env node

/**
 * Test Data Update Script
 * Tests the data update functionality
 * Usage: node scripts/test-data-update.js
 */

const { updateAllData } = require('./update-data.js');

async function testDataUpdate() {
  console.log('🧪 Testing data update functionality...');
  
  try {
    await updateAllData();
    console.log('✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

testDataUpdate();
