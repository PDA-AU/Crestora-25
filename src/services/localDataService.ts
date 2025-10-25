// Local Data Service - Replaces API calls with local JSON data
import teamsData from '../data/teams.json';
import eventData from '../data/eventData.json';
import leaderboardData from '../data/leaderboard.json';
import teamScoresData from '../data/team-scores.json';

export interface Team {
  id: number;
  team_id: string;
  team_name: string;
  leader_name: string;
  leader_register_number: string;
  leader_contact: string;
  leader_email: string;
  password: string; // This is the leader's register number
  current_round: number;
  status: string;
  overall_score?: number;
  created_at: string;
  updated_at: string;
  members: TeamMember[];
}

export interface TeamMember {
  id: number;
  team_id: string;
  member_name: string;
  register_number: string;
  member_position: string;
  created_at: string;
}

export interface TeamScore {
  id: number;
  team_id: string;
  round_id: number;
  event_id: string;
  score: number;
  criteria_scores: Record<string, number>;
  raw_total_score: number;
  is_normalized: boolean;
  created_at: string;
  updated_at: string;
  round_info?: {
    round_number: number;
    round_name: string;
    round_type: string;
    club: string;
    date: string;
  };
}

export interface LeaderboardEntry {
  rank: number;
  team_id: string;
  team_name: string;
  leader_name: string;
  final_score: number;
  weighted_average: number;
  normalized_score: number;
  percentile: number;
  rounds_completed: number;
  current_round: number;
  status: string;
}

export interface Event {
  title: string;
  theme: string;
  organized_by: string;
  team_structure: string;
  total_rounds: number;
  total_rolling_events: number;
  prizes: {
    winner: string;
    runner: string;
  };
  registration: {
    opened: string;
    closed: string;
    teams_registered: string;
  };
}

export interface Round {
  id: string;
  round_number: number;
  name: string;
  club: string;
  type: string;
  date: string;
  description: string;
  is_wildcard?: boolean;
}

export interface RollingEvent {
  id: string;
  name: string;
  club: string;
  type: string;
  date: string;
  description: string;
}

class LocalDataService {
  // Team Authentication
  async authenticateTeam(teamId: string, password: string): Promise<{ success: boolean; team: Team; message: string }> {
    const team = teamsData.teams.find(t => t.team_id === teamId);
    
    if (!team) {
      throw new Error('No team found with this team ID');
    }
    
    // Check password (using leader's register number as password)
    if (team.leader_register_number !== password) {
      throw new Error('Invalid password');
    }
    
    // Check if team is active
    if (team.status !== 'ACTIVE' && team.status !== 'ELIMINATED') {
      throw new Error(`Team is ${team.status.toLowerCase()}. Please contact organizers.`);
    }
    
    return {
      success: true,
      team: {
        ...team,
        password: team.leader_register_number // Add password field
      },
      message: 'Login successful'
    };
  }

  // Get all teams
  async getTeams(): Promise<Team[]> {
    return teamsData.teams.map(team => ({
      ...team,
      password: team.leader_register_number // Add password field
    }));
  }

  // Get specific team
  async getTeam(teamId: string): Promise<Team> {
    const team = teamsData.teams.find(t => t.team_id === teamId);
    if (!team) {
      throw new Error('Team not found');
    }
    return {
      ...team,
      password: team.leader_register_number // Add password field
    };
  }

  // Get team scores
  async getTeamScores(teamId: string): Promise<TeamScore[]> {
    const scores = teamScoresData.team_scores[teamId];
    return scores || [];
  }

  // Get leaderboard
  async getLeaderboard(limit: number = 50): Promise<LeaderboardEntry[]> {
    return leaderboardData.leaderboard.slice(0, limit);
  }

  // Get event data
  async getEventData(): Promise<Event> {
    return eventData.event;
  }

  // Get rounds
  async getRounds(): Promise<Round[]> {
    return eventData.rounds.filter(round => !round.is_wildcard); // Hide wildcard rounds
  }

  // Get rolling events
  async getRollingEvents(): Promise<RollingEvent[]> {
    return eventData.rolling_events;
  }

  // Get team statistics
  async getTeamStats(): Promise<any> {
    const teams = teamsData.teams.map(team => ({
      ...team,
      password: team.leader_register_number // Add password field
    }));
    const totalTeams = teams.length;
    const activeTeams = teams.filter(t => t.status === 'ACTIVE').length;
    const eliminatedTeams = teams.filter(t => t.status === 'ELIMINATED').length;
    const completedTeams = teams.filter(t => t.status === 'COMPLETED').length;

    return {
      total_teams: totalTeams,
      active_teams: activeTeams,
      eliminated_teams: eliminatedTeams,
      completed_teams: completedTeams,
      teams_by_round: this.getTeamsByRound(teams),
      status_distribution: {
        active_percentage: totalTeams > 0 ? Math.round((activeTeams / totalTeams) * 100) : 0,
        eliminated_percentage: totalTeams > 0 ? Math.round((eliminatedTeams / totalTeams) * 100) : 0,
        completed_percentage: totalTeams > 0 ? Math.round((completedTeams / totalTeams) * 100) : 0
      }
    };
  }

  private getTeamsByRound(teams: Team[]): Record<string, number> {
    const teamsByRound: Record<string, number> = {};
    for (let round = 1; round <= 9; round++) {
      const count = teams.filter(t => t.current_round === round).length;
      if (count > 0) {
        teamsByRound[`round_${round}`] = count;
      }
    }
    return teamsByRound;
  }
}

export const localDataService = new LocalDataService();
