#!/usr/bin/env python3

"""
Script to fetch rounds and rolling events data from the API and store locally
This script fetches data from the public API endpoints and saves it to JSON files
for use by the frontend components.
"""

import requests
import json
import os
from datetime import datetime
from pathlib import Path

# Configuration
API_BASE_URL = 'http://localhost:8000/api/public'
OUTPUT_DIR = Path(__file__).parent.parent / 'src' / 'data'

def ensure_output_dir():
    """Ensure output directory exists"""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def fetch_from_api(endpoint):
    """Fetch data from API endpoint"""
    try:
        print(f"📡 Fetching data from {endpoint}...")
        response = requests.get(f"{API_BASE_URL}{endpoint}")
        response.raise_for_status()
        
        data = response.json()
        print(f"✅ Successfully fetched data from {endpoint}")
        return data
    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching from {endpoint}: {e}")
        raise
    except Exception as e:
        print(f"❌ Unexpected error fetching from {endpoint}: {e}")
        raise

def save_to_file(filename, data):
    """Save data to JSON file"""
    try:
        file_path = OUTPUT_DIR / filename
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"💾 Saved data to {filename}")
    except Exception as e:
        print(f"❌ Error saving to {filename}: {e}")
        raise

def transform_rounds_data(api_data):
    """Transform rounds data to match existing format"""
    rounds = api_data.get('rounds', [])
    
    return {
        "event": {
            "title": "Crestora'25",
            "theme": "Beyond Limits – A Space Odyssey of Personality Development",
            "organized_by": "Personality Development Association, MIT Campus, Anna University",
            "team_structure": "4 members (UG 2nd and 3rd years)",
            "total_rounds": len(rounds),
            "total_rolling_events": 0,  # Will be updated when we fetch rolling events
            "prizes": {
                "winner": "1 Team",
                "runner": "1 Team"
            },
            "registration": {
                "opened": "2025-10-06T18:00:00",
                "closed": "2025-10-13T18:00:00",
                "teams_registered": "60 (approx)"
            }
        },
        "rounds": [
            {
                "id": f"round{round_data['round_number']}",
                "round_number": round_data['round_number'],
                "name": round_data['name'],
                "club": round_data['club'],
                "type": round_data.get('type', 'Offline'),
                "date": round_data['date'].split('T')[0] if round_data.get('date') else "",
                "description": round_data.get('description', ''),
                # Extended data for modal
                "extended_description": round_data.get('extended_description'),
                "form_link": round_data.get('form_link'),
                "contact": round_data.get('contact'),
                "venue": round_data.get('venue'),
                "status": round_data.get('status'),
                "is_frozen": round_data.get('is_frozen'),
                "is_evaluated": round_data.get('is_evaluated'),
                "criteria": round_data.get('criteria'),
                "max_score": round_data.get('max_score'),
                "min_score": round_data.get('min_score'),
                "avg_score": round_data.get('avg_score')
            }
            for round_data in rounds
        ]
    }

def transform_rolling_events_data(api_data):
    """Transform rolling events data to match existing format"""
    rolling_events = api_data.get('rolling_events', [])
    
    return {
        "rolling_events": [
            {
                "id": f"rolling{index + 1}",
                "name": event['name'],
                "club": event['club'],
                "type": event.get('type', 'Offline'),
                "date": event['date'].split('T')[0] if event.get('date') else "",
                "description": event.get('description', ''),
                # Extended data for modal
                "extended_description": event.get('extended_description'),
                "form_link": event.get('form_link'),
                "contact": event.get('contact'),
                "venue": event.get('venue'),
                "status": event.get('status'),
                "start_date": event.get('start_date'),
                "end_date": event.get('end_date'),
                "event_id": event.get('event_id'),
                "event_code": event.get('event_code')
            }
            for index, event in enumerate(rolling_events)
        ]
    }

def main():
    """Main function to fetch and save all data"""
    print('🚀 Starting data fetch process...')
    print('=' * 50)
    
    try:
        ensure_output_dir()
        
        # Fetch rounds data
        print('\n📋 Fetching rounds data...')
        rounds_data = fetch_from_api('/rounds')
        transformed_rounds = transform_rounds_data(rounds_data)
        
        # Fetch rolling events data
        print('\n🎪 Fetching rolling events data...')
        rolling_events_data = fetch_from_api('/rolling-events')
        transformed_rolling_events = transform_rolling_events_data(rolling_events_data)
        
        # Update the eventData.json with rolling events
        updated_event_data = {
            **transformed_rounds,
            "event": {
                **transformed_rounds["event"],
                "total_rolling_events": len(transformed_rolling_events["rolling_events"])
            },
            "rolling_events": transformed_rolling_events["rolling_events"]
        }
        
        save_to_file('eventData.json', updated_event_data)
        
        # Also save rolling events separately for easier access
        save_to_file('rollingEvents.json', transformed_rolling_events)
        
        print('\n' + '=' * 50)
        print('🎉 Data fetch completed successfully!')
        print('\n📊 Summary:')
        print(f'   • Rounds: {len(transformed_rounds["rounds"])}')
        print(f'   • Rolling Events: {len(transformed_rolling_events["rolling_events"])}')
        print('   • Files created: eventData.json, rollingEvents.json')
        
    except Exception as e:
        print(f'\n❌ Data fetch failed: {e}')
        return 1
    
    return 0

if __name__ == '__main__':
    exit(main())
