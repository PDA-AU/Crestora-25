import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { localDataService, type Team, type TeamMember } from '@/services/localDataService';

type TeamScore = {
  score: number;
};

const TeamProfile = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState<Team | null>(null);
  const [teamScore, setTeamScore] = useState<TeamScore | null>(null);
  const [loading, setLoading] = useState(true);

  // Local function to get team score from leaderboard (using local data instead of API)
  const getTeamScoreFromLeaderboard = async (teamId: string): Promise<TeamScore | null> => {
    try {
      const leaderboard = await localDataService.getLeaderboard(100);
      const teamInLeaderboard = leaderboard.find((team: any) => team.team_id === teamId);
      if (teamInLeaderboard) {
        const score = teamInLeaderboard.normalized_score || teamInLeaderboard.final_score || 0;
        return {
          score: score
        };
      }
      return {
        score: 0
      };
    } catch (error) {
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
          
          // Fetch team score from leaderboard
          const score = await getTeamScoreFromLeaderboard(parsedTeam.team_id);
          setTeamScore(score);
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

            {/* Team Performance Score Card */}
            {teamScore && (
              <div className="bg-gradient-to-r from-[hsl(var(--space-cyan))]/10 to-[hsl(var(--space-violet))]/10 border border-[hsl(var(--space-cyan))]/30 rounded-lg p-6 mb-6">
                <h2 className="font-orbitron text-xl font-bold text-[hsl(var(--space-cyan))] mb-4 text-center">
                  🏆 Team Performance
                </h2>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Performance Score</p>
                  <p className="text-4xl font-bold text-[hsl(var(--space-gold))]">
                    {teamScore.score}
                  </p>
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

            {/* Team Members */}
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
              For any queries, write to <a className="underline" href="mailto:pda@mitindia.edu">pda@mitindia.edu</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamProfile;


