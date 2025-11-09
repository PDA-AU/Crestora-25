import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { localDataService, type Team, type TeamMember, type TeamScore, type LeaderboardEntry } from '@/services/localDataService';
import { cn } from '@/lib/utils';

type RoundPerformance = {
  roundNumber: number;  // 1-9 after renumbering
  originalRoundNumber: number;  // Original round number from data
  roundName: string;
  score: number;
  rank: number;
  maxScore: number;
  isCompleted: boolean;
  totalTeams: number;
};

type TeamPerformance = {
  score: number;
  rank: number;
  percentile: number;
  rounds: RoundPerformance[];
};

const TeamProfile = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [teamPerformance, setTeamPerformance] = useState<TeamPerformance | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to get team performance data including round-wise scores and ranks for all 9 rounds
  const getTeamPerformance = async (teamId: string): Promise<TeamPerformance | null> => {
    try {
      // Get leaderboard data
      const leaderboard = await localDataService.getLeaderboard(100);
      const teamInLeaderboard = leaderboard.find((team: LeaderboardEntry) => team.team_id === teamId);
      
      if (!teamInLeaderboard) return null;

      // Get team scores
      const teamScores = await localDataService.getTeamScores(teamId);
      
      // Initialize all 9 rounds with default values (1-9, with 6 removed and 7-10 renumbered to 6-9)
      const allRounds: RoundPerformance[] = Array.from({ length: 9 }, (_, i) => {
        const originalRoundNum = i < 5 ? i + 1 : i + 2; // Skip round 6 (original round 6 becomes 7, etc.)
        return {
          roundNumber: i + 1,  // 1-9
          originalRoundNumber: originalRoundNum,  // Original round number (1-5,7-10)
          roundName: `Round ${i + 1}`,
          score: 0,
          rank: 1, // Default to rank 1
          maxScore: 100, // Set default max score to 100
          isCompleted: false,
          totalTeams: 1 // Default to 1 team
        };
      });

      // Process completed rounds
      await Promise.all(teamScores.map(async (score) => {
        const originalRoundNumber = score.round_info?.round_number || 0;
        
        // Skip if round number is invalid or round 6
        if (originalRoundNumber < 1 || originalRoundNumber > 10 || originalRoundNumber === 6) return;
        
        // Calculate the renumbered round (1-5 stay same, 7-10 become 6-9)
        const roundNumber = originalRoundNumber < 6 ? originalRoundNumber : originalRoundNumber - 1;
        if (roundNumber < 1 || roundNumber > 9) return;

        // Get all teams that participated in this round with non-zero scores
        const allScores = (await localDataService.getLeaderboard(100))
          .filter((entry: any) => {
            const roundScore = entry.round_scores?.[score.round_id]?.score;
            return roundScore !== undefined && roundScore > 0;
          })
          .map((entry: any) => ({
            teamId: entry.team_id,
            score: entry.round_scores[score.round_id].score,
            rank: entry.round_scores[score.round_id].rank || 0
          }))
          .sort((a: any, b: any) => b.score - a.score);

        // Use the rank from the score if available, otherwise calculate it
        const rank = score.round_rank > 0 ? score.round_rank : 
                   allScores.findIndex((s: any) => s.teamId === teamId) + 1 || 1;
        const maxScore = 100; // Fixed max score of 100 for all rounds
        const totalTeams = Math.max(1, allScores.length); // Total teams with non-zero scores

        // Update the round with completed data
        const roundIndex = roundNumber - 1;
        allRounds[roundIndex] = {
          roundNumber,
          originalRoundNumber,
          roundName: score.round_info?.round_name || `Round ${roundNumber}`,
          score: score.score,
          rank,
          maxScore,
          isCompleted: true,
          totalTeams
        };
      }));

      return {
        score: teamInLeaderboard.final_score || 0,  // Use final_score instead of normalized_score
        rank: teamInLeaderboard.rank || 0,
        percentile: teamInLeaderboard.percentile || 0,
        rounds: allRounds
      };
    } catch (error) {
      console.error('Error fetching team performance:', error);
      return null;
    }
  };

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        // Get team data from localStorage
        const teamData = localStorage.getItem('crestora.teamData');
        if (teamData) {
          const parsedTeam = JSON.parse(teamData);
          setTeam(parsedTeam);
          
          // Fetch team performance data
          const performance = await getTeamPerformance(parsedTeam.team_id);
          setTeamPerformance(performance);
        }
      } catch (error) {
        console.error('Error loading team data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, [teamId]);

  const handleLogout = () => {
    localStorage.removeItem('crestora.teamId');
    localStorage.removeItem('crestora.teamData');
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--space-cyan))] mx-auto mb-4"></div>
          <p>Loading team profile...</p>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Team not found.</p>
          <Button onClick={() => navigate('/login')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pt-28 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-background/80 backdrop-blur-md border border-[hsl(var(--space-gold))]/40 rounded-2xl p-6 shadow-[0_0_30px_hsl(var(--space-gold))/0.2]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h1 className="font-orbitron text-2xl md:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--space-cyan))] via-[hsl(var(--space-violet))] to-[hsl(var(--space-gold))]">
                {team.team_name}
              </h1>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full md:w-auto">
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <a href="mailto:pda@mitindia.edu" aria-label="Email PDA for queries" className="text-center">Email PDA</a>
                </Button>
                <Button onClick={handleLogout} variant="outline" className="w-full sm:w-auto">Logout</Button>
              </div>
            </div>

            {teamPerformance ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-[hsl(var(--space-cyan))]/10 to-[hsl(var(--space-violet))]/10 border border-[hsl(var(--space-cyan))]/30 rounded-lg p-6">
                  <h2 className="font-orbitron text-xl font-bold text-[hsl(var(--space-cyan))] mb-4 text-center">
                    🏆 Team Performance
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-background/20 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Points</p>
                      <p className="text-3xl font-bold text-[hsl(var(--space-gold))]">
                        {teamPerformance.score.toFixed(1)}
                      </p>
                    </div>
                    <div className="bg-background/20 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Overall Rank</p>
                      <p className="text-3xl font-bold text-[hsl(var(--space-cyan))]">
                        #{teamPerformance.rank}
                        <span className="block text-sm font-normal text-muted-foreground">
                          Top {Math.ceil(teamPerformance.percentile)}% of teams
                        </span>
                      </p>
                    </div>
                    <div className="bg-background/20 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">Rounds Completed</p>
                      <p className="text-3xl font-bold text-[hsl(var(--space-violet))]">
                        {teamPerformance.rounds.filter(r => r.isCompleted).length} / 9
                      </p>
                    </div>
                  </div>
                </div>

                {teamPerformance.rounds.length > 0 && (
                  <div className="bg-background/20 border border-[hsl(var(--space-violet))]/30 rounded-lg p-6">
                    <h2 className="font-orbitron text-xl font-bold text-[hsl(var(--space-violet))] mb-4 text-center">
                      📊 Completed Rounds
                    </h2>
                    {teamPerformance.rounds.filter(round => round.isCompleted && round.score > 0).length === 0 && (
                      <p className="text-center text-muted-foreground py-4">No completed rounds with scores yet</p>
                    )}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-sm text-muted-foreground border-b border-border">
                            <th className="pb-2">Round</th>
                            <th className="text-right pb-2">Score</th>
                            <th className="text-right pb-2">Max Score</th>
                            <th className="text-right pb-2">Rank</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {teamPerformance.rounds
                            .filter(round => round.isCompleted && round.score > 0)
                            .map((round, index) => (
                            <tr key={index}>
                              <td className="py-3">
                                <div className="font-medium">{round.roundName}</div>
                              </td>
                              <td className="text-right">
                                {round.isCompleted ? (
                                  <span className="font-mono">{round.score.toFixed(1)}</span>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </td>
                              <td className="text-right">
                                {round.isCompleted ? (
                                  <span className="text-muted-foreground text-sm">/ {round.maxScore.toFixed(1)}</span>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </td>
                              <td className="text-right">
                                {round.isCompleted ? (
                                  <span className={cn(
                                    "inline-flex items-center justify-center min-w-8 h-8 rounded-full font-medium text-xs",
                                    round.rank === 1 ? "bg-yellow-100 text-yellow-800" :
                                    round.rank <= 3 ? "bg-purple-100 text-purple-800" :
                                    round.rank <= 10 ? "bg-blue-100 text-blue-800" :
                                    "bg-gray-100 text-gray-800"
                                  )}>
                                    #{round.rank}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2 break-words">
                    <h2 className="font-orbitron text-lg md:text-xl text-[hsl(var(--space-cyan))]">Team Details</h2>
                    <p><span className="text-muted-foreground">Team ID:</span> <span className="break-all">{team.team_id}</span></p>
                    <p>
                      <span className="text-muted-foreground">Status:</span>{' '}
                      <span className={team.status?.toLowerCase() === 'active' ? 'text-green-500 font-medium' : ''}>
                        {team.status || '—'}
                      </span>
                    </p>
                    <p><span className="text-muted-foreground">Current Round:</span> {team.current_round ?? '—'}</p>
                  </div>
                  <div className="space-y-2 break-words">
                    <h2 className="font-orbitron text-lg md:text-xl text-[hsl(var(--space-cyan))]">Leader</h2>
                    <p className="text-base md:text-lg">{team.leader_name}</p>
                    <p>Reg No: <span className="break-all">{team.leader_register_number}</span></p>
                    <p>Email: <span className="break-all">{team.leader_email}</span></p>
                    <p>Contact: <span className="break-all">{team.leader_contact}</span></p>
                  </div>
                </div>

                {team.members && team.members.length > 0 && (
                  <div className="mt-8">
                    <h2 className="font-orbitron text-lg md:text-xl text-[hsl(var(--space-violet))] mb-4">Team Members</h2>
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {team.members.map((member, index) => (
                        <div key={member.id} className="bg-background/20 rounded-lg p-4">
                          <h3 className="font-orbitron text-base font-semibold text-[hsl(var(--space-violet))] mb-2">
                            {member.member_position}
                          </h3>
                          <p className="text-base">{member.member_name}</p>
                          <p className="text-sm text-muted-foreground">{member.register_number}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className="mt-6 text-sm text-muted-foreground text-center">
                  For any queries, write to <a className="underline" href="mailto:pda@mitindia.edu">pda@mitindia.edu</a>
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p>Loading performance data...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamProfile;


