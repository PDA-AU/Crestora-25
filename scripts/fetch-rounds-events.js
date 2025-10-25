#!/usr/bin/env node

/**
 * Script to fetch rounds and rolling events data from the API and store locally
 * This script fetches data from the public API endpoints and saves it to JSON files
 * for use by the frontend components.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const API_BASE_URL = 'http://localhost:8000/api/public';
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'data');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/**
 * Fetch data from API endpoint
 */
async function fetchFromAPI(endpoint) {
    try {
        console.log(`📡 Fetching data from ${endpoint}...`);
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`✅ Successfully fetched data from ${endpoint}`);
        return data;
    } catch (error) {
        console.error(`❌ Error fetching from ${endpoint}:`, error.message);
        throw error;
    }
}

/**
 * Save data to JSON file
 */
function saveToFile(filename, data) {
    try {
        const filePath = path.join(OUTPUT_DIR, filename);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log(`💾 Saved data to ${filename}`);
    } catch (error) {
        console.error(`❌ Error saving to ${filename}:`, error.message);
        throw error;
    }
}

/**
 * Transform rounds data to match existing format
 */
function transformRoundsData(apiData) {
    const rounds = apiData.rounds || [];
    
    return {
        event: {
            title: "Crestora'25",
            theme: "Beyond Limits – A Space Odyssey of Personality Development",
            organized_by: "Personality Development Association, MIT Campus, Anna University",
            team_structure: "4 members (UG 2nd and 3rd years)",
            total_rounds: rounds.length,
            total_rolling_events: 0, // Will be updated when we fetch rolling events
            prizes: {
                winner: "1 Team",
                runner: "1 Team"
            },
            registration: {
                opened: "2025-10-06T18:00:00",
                closed: "2025-10-13T18:00:00",
                teams_registered: "60 (approx)"
            }
        },
        rounds: rounds.map(round => ({
            id: `round${round.round_number}`,
            round_number: round.round_number,
            name: round.name,
            club: round.club,
            type: round.type || "Offline",
            date: round.date ? round.date.split('T')[0] : "", // Convert ISO date to YYYY-MM-DD
            description: round.description || "",
            // Extended data for modal
            extended_description: round.extended_description,
            form_link: round.form_link,
            contact: round.contact,
            venue: round.venue,
            status: round.status,
            is_frozen: round.is_frozen,
            is_evaluated: round.is_evaluated,
            criteria: round.criteria,
            max_score: round.max_score,
            min_score: round.min_score,
            avg_score: round.avg_score
        }))
    };
}

/**
 * Transform rolling events data to match existing format
 */
function transformRollingEventsData(apiData) {
    const rollingEvents = apiData.rolling_events || [];
    
    return {
        rolling_events: rollingEvents.map((event, index) => ({
            id: `rolling${index + 1}`,
            name: event.name,
            club: event.club,
            type: event.type || "Offline",
            date: event.date ? event.date.split('T')[0] : "", // Convert ISO date to YYYY-MM-DD
            description: event.description || "",
            // Extended data for modal
            extended_description: event.extended_description,
            form_link: event.form_link,
            contact: event.contact,
            venue: event.venue,
            status: event.status,
            start_date: event.start_date,
            end_date: event.end_date,
            event_id: event.event_id,
            event_code: event.event_code
        }))
    };
}

/**
 * Main function to fetch and save all data
 */
async function main() {
    console.log('🚀 Starting data fetch process...');
    console.log('=' * 50);
    
    try {
        // Fetch rounds data
        console.log('\n📋 Fetching rounds data...');
        const roundsData = await fetchFromAPI('/rounds');
        const transformedRounds = transformRoundsData(roundsData);
        saveToFile('eventData.json', transformedRounds);
        
        // Fetch rolling events data
        console.log('\n🎪 Fetching rolling events data...');
        const rollingEventsData = await fetchFromAPI('/rolling-events');
        const transformedRollingEvents = transformRollingEventsData(rollingEventsData);
        
        // Update the eventData.json with rolling events
        const updatedEventData = {
            ...transformedRounds,
            event: {
                ...transformedRounds.event,
                total_rolling_events: transformedRollingEvents.rolling_events.length
            },
            rolling_events: transformedRollingEvents.rolling_events
        };
        
        saveToFile('eventData.json', updatedEventData);
        
        // Also save rolling events separately for easier access
        saveToFile('rollingEvents.json', transformedRollingEvents);
        
        console.log('\n' + '=' * 50);
        console.log('🎉 Data fetch completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`   • Rounds: ${transformedRounds.rounds.length}`);
        console.log(`   • Rolling Events: ${transformedRollingEvents.rolling_events.length}`);
        console.log(`   • Files created: eventData.json, rollingEvents.json`);
        
    } catch (error) {
        console.error('\n❌ Data fetch failed:', error.message);
        process.exit(1);
    }
}

// Run the script
main().catch(console.error);
