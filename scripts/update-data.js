#!/usr/bin/env node

/**
 * Data Update Script
 * Fetches data from the API and updates local JSON files
 * Usage: node scripts/update-data.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const API_BASE_URL = 'http://3.110.143.60:8000/api';
const DATA_DIR = path.join(__dirname, '../src/data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper function to make API requests
async function fetchFromAPI(endpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error.message);
    throw error;
  }
}

// Update teams data
async function updateTeamsData() {
  console.log('🔄 Updating teams data...');
  try {
    const teamsData = await fetchFromAPI('/public/teams');
    const filePath = path.join(DATA_DIR, 'teams.json');
    fs.writeFileSync(filePath, JSON.stringify(teamsData, null, 2));
    console.log('✅ Teams data updated successfully');
  } catch (error) {
    console.error('❌ Failed to update teams data:', error.message);
  }
}

// Update leaderboard data
async function updateLeaderboardData() {
  console.log('🔄 Updating leaderboard data...');
  try {
    // Fetch all teams by setting a high limit
    const leaderboardData = await fetchFromAPI('/public/leaderboard?limit=100');
    const filePath = path.join(DATA_DIR, 'leaderboard.json');
    fs.writeFileSync(filePath, JSON.stringify(leaderboardData, null, 2));
    console.log('✅ Leaderboard data updated successfully');
  } catch (error) {
    console.error('❌ Failed to update leaderboard data:', error.message);
  }
}

// Update team scores data
async function updateTeamScoresData() {
  console.log('🔄 Updating team scores data...');
  try {
    // Get all teams first
    const teamsData = await fetchFromAPI('/public/teams');
    const teamScores = {};
    
    // Fetch scores for each team
    for (const team of teamsData.teams) {
      try {
        const scores = await fetchFromAPI(`/public/teams/${team.team_id}/scores`);
        teamScores[team.team_id] = scores.scores || [];
      } catch (error) {
        console.warn(`⚠️ Failed to fetch scores for team ${team.team_id}:`, error.message);
        teamScores[team.team_id] = [];
      }
    }
    
    const data = {
      team_scores: teamScores,
      last_updated: new Date().toISOString()
    };
    
    const filePath = path.join(DATA_DIR, 'team-scores.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log('✅ Team scores data updated successfully');
  } catch (error) {
    console.error('❌ Failed to update team scores data:', error.message);
  }
}

// Update event data (this is usually static, but we can fetch if needed)


// Main update function
async function updateAllData() {
  console.log('🚀 Starting data update process...');
  console.log(`📡 API Base URL: ${API_BASE_URL}`);
  console.log(`📁 Data Directory: ${DATA_DIR}`);
  console.log('');
  
  try {
    await updateTeamsData();
    await updateLeaderboardData();
    await updateTeamScoresData();
   
    
    console.log('');
    console.log('🎉 All data updated successfully!');
    console.log(`📅 Updated at: ${new Date().toISOString()}`);
  } catch (error) {
    console.error('❌ Data update failed:', error.message);
    process.exit(1);
  }
}

// Run the update if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  updateAllData();
}

export {
  updateAllData,
  updateTeamsData,
  updateLeaderboardData,
  updateTeamScoresData,
 
};
