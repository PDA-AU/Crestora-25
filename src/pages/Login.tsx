import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import teams from '@/data/teams.json';
import { Button } from '@/components/ui/button';

type Team = {
  teamName: string;
  leaderRegisterNumber: string;
  password: string;
  teamId: string;
  leaderName: string;
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

const Login = () => {
  const navigate = useNavigate();
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [userType, setUserType] = useState<'participant' | 'organizer'>('participant');

  const teamsByLeader = useMemo(() => {
    const byReg = new Map<string, Team>();
    (teams as Team[]).forEach((t) => {
      if (t.leaderRegisterNumber) byReg.set(String(t.leaderRegisterNumber).trim(), t);
    });
    return byReg;
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (userType === 'organizer') {
      window.location.href = 'http://3.110.143.60:8080/login';
      return;
    }
    
    const key = String(regNo).trim();
    const team = teamsByLeader.get(key);
    if (!team) {
      setError('No team found for this leader register number');
      return;
    }
    // Simple password check against teams.json
    if (String(password).trim() !== String(team.password).trim()) {
      setError('Invalid password');
      return;
    }
    localStorage.setItem('crestora.teamId', team.teamId);
    navigate(`/team/${encodeURIComponent(team.teamId)}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pt-28 pb-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="relative bg-background/80 backdrop-blur-md border border-[hsl(var(--space-cyan))]/40 rounded-xl p-6 shadow-[0_0_30px_hsl(var(--space-cyan))/0.2]">
            <h1 className="font-orbitron text-2xl text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--space-cyan))] via-[hsl(var(--space-violet))] to-[hsl(var(--space-gold))]">
              Team Login
            </h1>
            <div className="mb-6">
              <div className="flex bg-background/20 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setUserType('participant')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    userType === 'participant'
                      ? 'bg-[hsl(var(--space-cyan))] text-background shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Participant
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('organizer')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    userType === 'organizer'
                      ? 'bg-[hsl(var(--space-cyan))] text-background shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Organizer
                </button>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {userType === 'participant' && (
                <>
                  <div>
                    <label className="block text-sm mb-1">Leader Register Number</label>
                    <input
                      className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-[hsl(var(--space-cyan))]"
                      value={regNo}
                      onChange={(e) => setRegNo(e.target.value)}
                      placeholder="e.g., 2027503053"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Password</label>
                    <input
                      className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-[hsl(var(--space-cyan))]"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="e.g., 2027503053"
                      required
                    />
                  </div>
                </>
              )}
              {userType === 'organizer' && (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">You will be redirected to the organizer portal</p>
                </div>
              )}
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <Button type="submit" className="w-full bg-[hsl(var(--space-cyan))] hover:bg-[hsl(var(--space-cyan))]/80 text-background font-orbitron">
                {userType === 'participant' ? 'Login' : 'Go to Organizer Portal'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


