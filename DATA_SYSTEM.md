# Local Data System

This project uses local JSON files instead of API calls to avoid Mixed Content issues and improve performance.

## 📁 Data Files

The following JSON files store all the application data:

- `src/data/teams.json` - All teams data
- `src/data/leaderboard.json` - Leaderboard rankings
- `src/data/team-scores.json` - Individual team scores across rounds
- `src/data/eventData.json` - Event information, rounds, and rolling events

## 🔄 Updating Data

### Automatic Update Script

Use the update script to fetch fresh data from the API:

```bash
npm run update-data
```

This script will:
1. Fetch teams data from `/api/public/teams`
2. Fetch leaderboard from `/api/public/leaderboard`
3. Fetch team scores from `/api/public/teams/{team_id}/scores`
4. Update all local JSON files

### Manual Update

You can also manually update the JSON files by:

1. **Teams Data**: Copy from API response at `/api/public/teams`
2. **Leaderboard**: Copy from API response at `/api/public/leaderboard`
3. **Team Scores**: Copy from API response at `/api/public/teams/{team_id}/scores`
4. **Event Data**: Usually static, update manually if needed

## 🚀 Usage

The application now uses `localDataService` instead of direct API calls:

```typescript
import { localDataService } from '@/services/localDataService';

// Authenticate team
const result = await localDataService.authenticateTeam(teamId, password);

// Get teams
const teams = await localDataService.getTeams();

// Get leaderboard
const leaderboard = await localDataService.getLeaderboard(50);

// Get team scores
const scores = await localDataService.getTeamScores(teamId);
```

## 🔧 Configuration

### API Base URL

Update the API base URL in `scripts/update-data.js`:

```javascript
const API_BASE_URL = 'http://3.110.143.60:8000/api';
```

### Data Directory

The data files are stored in `src/data/` directory.

## 📊 Data Structure

### Teams Data
```json
{
  "teams": [
    {
      "id": 1,
      "team_id": "CRES-96DA2",
      "team_name": "3ngineers",
      "leader_name": "Vaishnavi M",
      "leader_register_number": "2023505017",
      "leader_contact": "8015314027",
      "leader_email": "vaishnavimanju05@gmail.com",
      "current_round": 3,
      "status": "ACTIVE",
      "overall_score": 84.25,
      "created_at": "2025-10-21T09:40:01",
      "updated_at": "2025-10-24T07:34:20",
      "members": [...]
    }
  ]
}
```

### Leaderboard Data
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "team_id": "CRES-96DA2",
      "team_name": "3ngineers",
      "leader_name": "Vaishnavi M",
      "final_score": 84.25,
      "weighted_average": 84.25,
      "normalized_score": 100.0,
      "percentile": 100.0,
      "rounds_completed": 3,
      "current_round": 3,
      "status": "ACTIVE"
    }
  ],
  "total_teams": 60,
  "displayed_teams": 3,
  "last_updated": "2025-01-27T10:00:00Z"
}
```

### Team Scores Data
```json
{
  "team_scores": {
    "CRES-96DA2": [
      {
        "id": 1,
        "team_id": "CRES-96DA2",
        "round_id": 1,
        "event_id": "round1",
        "score": 85.5,
        "criteria_scores": {
          "Creativity": 25,
          "Presentation": 30,
          "Originality": 30.5
        },
        "raw_total_score": 85.5,
        "is_normalized": true,
        "created_at": "2025-10-18T15:30:00",
        "updated_at": "2025-10-18T15:30:00",
        "round_info": {...}
      }
    ]
  },
  "last_updated": "2025-01-27T10:00:00Z"
}
```

## 🎯 Benefits

1. **No Mixed Content Issues**: Eliminates HTTPS/HTTP conflicts
2. **Better Performance**: Faster loading with local data
3. **Offline Capability**: Works without internet connection
4. **Easier Development**: No need to run backend for frontend development
5. **Version Control**: Data changes are tracked in git

## 🔄 Workflow

1. **Development**: Use local JSON files for development
2. **Updates**: Run `npm run update-data` to sync with API
3. **Deployment**: Deploy with updated JSON files
4. **Maintenance**: Regularly update data files as needed

## 🚨 Important Notes

- Always update data files before deployment
- Keep JSON files in sync with the API
- Test locally before deploying
- Backup data files before major updates
