# API Integration for Rounds and Rolling Events

This document describes the new API integration system for fetching rounds and rolling events data from the backend database.

## Overview

The system now fetches rounds and rolling events data from the backend API instead of using static JSON files. This allows for dynamic updates and real-time data synchronization.

## API Endpoints

### Public Endpoints (No Authentication Required)

1. **GET /api/public/rounds** - Fetch all rounds
   - Returns detailed round information including extended descriptions, form links, and contact details
   - Includes evaluation criteria, scoring information, and status

2. **GET /api/public/rolling-events** - Fetch all rolling events
   - Returns detailed rolling event information
   - Includes extended descriptions, form links, and contact details

3. **GET /api/public/events** - Fetch all events with rounds
   - Returns complete event structure with nested rounds

4. **GET /api/public/health** - Health check endpoint

## Data Fetch Scripts

### JavaScript Version
```bash
cd Crestora-25
node scripts/fetch-rounds-events.js
```

### Python Version
```bash
cd Crestora-25
python scripts/fetch-rounds-events.py
```

### Test API Endpoints
```bash
cd Crestora-25
node scripts/test-api.js
```

## Generated Files

The fetch scripts generate the following files in `src/data/`:

1. **eventData.json** - Complete event data including rounds and rolling events
2. **rollingEvents.json** - Separate file for rolling events (for easier access)

## Data Structure

### Round Object
```typescript
interface Round {
  id: string;
  round_number: number;
  name: string;
  club: string;
  type: string;
  date: string;
  description: string;
  // Extended data for modal
  extended_description?: string;
  form_link?: string;
  contact?: string;
  venue?: string;
  status?: string;
  is_frozen?: boolean;
  is_evaluated?: boolean;
  criteria?: any;
  max_score?: number;
  min_score?: number;
  avg_score?: number;
}
```

### Rolling Event Object
```typescript
interface RollingEvent {
  id: string;
  name: string;
  club: string;
  type: string;
  date: string;
  description: string;
  // Extended data for modal
  extended_description?: string;
  form_link?: string;
  contact?: string;
  venue?: string;
  status?: string;
  start_date?: string;
  end_date?: string;
  event_id?: string;
  event_code?: string;
}
```

## Component Updates

### RoundCard Component
- Updated to use new data structure
- Enhanced modal with detailed information
- Dynamic content based on API data

### RollingEvents Component
- Updated to use new data structure
- Added modal functionality for detailed view
- Click-to-view details for each event

### Modal Components
- **RoundModal**: Displays comprehensive round information
- **RollingEventModal**: Displays comprehensive rolling event information
- Both modals include:
  - Extended descriptions
  - Form links with copy functionality
  - Contact information
  - Venue details
  - Status information
  - Evaluation criteria (for rounds)
  - Score information (for rounds)

## Usage Instructions

1. **Start the Backend Server**
   ```bash
   cd crestora-hub/backend
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Test API Endpoints**
   ```bash
   cd Crestora-25
   node scripts/test-api.js
   ```

3. **Fetch Latest Data**
   ```bash
   cd Crestora-25
   node scripts/fetch-rounds-events.js
   ```

4. **Start Frontend**
   ```bash
   cd Crestora-25
   npm run dev
   ```

## Features

### Enhanced Modal System
- **Dynamic Content**: Modals now display data directly from the API
- **Rich Information**: Extended descriptions, contact details, form links
- **Interactive Elements**: Copy form links, open external forms
- **Status Indicators**: Visual status badges for events
- **Responsive Design**: Works on all screen sizes

### Data Synchronization
- **Real-time Updates**: Fetch latest data from database
- **Consistent Format**: Maintains compatibility with existing UI
- **Error Handling**: Graceful fallbacks for missing data

### Developer Experience
- **Type Safety**: Full TypeScript support
- **Modular Scripts**: Separate scripts for different tasks
- **Comprehensive Testing**: API endpoint testing included

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Ensure backend server is running on port 8000
   - Check CORS settings in backend
   - Verify API endpoints are accessible

2. **Data Not Loading**
   - Run the fetch script to update local data
   - Check console for JavaScript errors
   - Verify JSON file structure

3. **Modal Not Opening**
   - Check browser console for errors
   - Verify component imports
   - Ensure data structure matches interface

### Debug Steps

1. Test API endpoints: `node scripts/test-api.js`
2. Check generated JSON files in `src/data/`
3. Verify component props and data flow
4. Check browser developer tools for errors

## Future Enhancements

- Real-time data updates without manual fetching
- Caching mechanism for better performance
- Offline support with service workers
- Enhanced error handling and user feedback
- Toast notifications for copy actions
