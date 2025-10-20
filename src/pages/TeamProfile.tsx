import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import teams from '@/data/teams.json';
import { Button } from '@/components/ui/button';

type Team = {
  teamName: string;
  teamId: string;
  leaderName: string;
  leaderRegisterNumber: string;
  leaderContactNumber: string;
  leaderEmail: string;
  member2Name?: string;
  member2RegisterNumber?: string;
  member3Name?: string;
  member3RegisterNumber?: string;
  member4Name?: string;
  member4RegisterNumber?: string;
  currRound?: number;
  status?: string;
};

const TeamProfile = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const team = useMemo(() => {
    const id = String(teamId || '').trim();
    return (teams as Team[]).find((t) => String(t.teamId).trim() === id);
  }, [teamId]);

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Team not found.</p>
          <a href="/" className="underline">Go Home</a>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem('crestora.teamId');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pt-28 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-background/80 backdrop-blur-md border border-[hsl(var(--space-gold))]/40 rounded-2xl p-6 shadow-[0_0_30px_hsl(var(--space-gold))/0.2]">
            <div className="flex items-center justify-between mb-6">
              <h1 className="font-orbitron text-3xl bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--space-cyan))] via-[hsl(var(--space-violet))] to-[hsl(var(--space-gold))]">
                {team.teamName}
              </h1>
              <Button onClick={handleLogout} variant="outline">Logout</Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h2 className="font-orbitron text-xl text-[hsl(var(--space-cyan))]">Team Details</h2>
                <p><span className="text-muted-foreground">Team ID:</span> {team.teamId}</p>
                <p>
                  <span className="text-muted-foreground">Status:</span>{' '}
                  <span className={team.status?.toLowerCase() === 'active' ? 'text-green-500 font-medium' : ''}>
                    {team.status || '—'}
                  </span>
                </p>
                <p><span className="text-muted-foreground">Current Round:</span> {team.currRound ?? '—'}</p>
              </div>
              <div className="space-y-2">
                <h2 className="font-orbitron text-xl text-[hsl(var(--space-cyan))]">Leader</h2>
                <p>{team.leaderName}</p>
                <p>Reg No: {team.leaderRegisterNumber}</p>
                <p>Contact: {team.leaderContactNumber}</p>
                <p>Email: {team.leaderEmail}</p>
              </div>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-orbitron text-lg text-[hsl(var(--space-violet))] mb-2">Member 2</h3>
                <p>{team.member2Name || '-'}</p>
                <p className="text-sm text-muted-foreground">{team.member2RegisterNumber || ''}</p>
              </div>
              <div>
                <h3 className="font-orbitron text-lg text-[hsl(var(--space-violet))] mb-2">Member 3</h3>
                <p>{team.member3Name || '-'}</p>
                <p className="text-sm text-muted-foreground">{team.member3RegisterNumber || ''}</p>
              </div>
              <div>
                <h3 className="font-orbitron text-lg text-[hsl(var(--space-violet))] mb-2">Member 4</h3>
                <p>{team.member4Name || '-'}</p>
                <p className="text-sm text-muted-foreground">{team.member4RegisterNumber || ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamProfile;


