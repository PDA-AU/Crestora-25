
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { localDataService, type Team, type TeamMember } from '@/services/localDataService';

// API Configuration
const API_BASE_URL = 'http://13.127.109.143:8000/api/public';

const Login = () => {
  const navigate = useNavigate();
  const [teamId, setTeamId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState<'participant' | 'organizer'>('participant');

  // Local authentication function
  const authenticateTeam = async (teamId: string, password: string): Promise<Team | null> => {
    try {
      const result = await localDataService.authenticateTeam(teamId, password);
      return result.team;
    } catch (error) {
      throw error;
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (userType === 'organizer') {
      window.location.href = 'http://13.127.109.143:8080/login';
      return;
    }
    
    try {
      const trimmedTeamId = String(teamId).trim();
      
      if (!trimmedTeamId) {
        setError('Please enter a team ID');
        setLoading(false);
        return;
      }
      
      // Authenticate team with API
      const team = await authenticateTeam(trimmedTeamId, String(password).trim());
      
      if (!team) {
        setError('Authentication failed');
        setLoading(false);
        return;
      }
      
      // Store team data in localStorage
      localStorage.setItem('crestora.teamId', team.team_id);
      localStorage.setItem('crestora.teamData', JSON.stringify(team));
      
      // Navigate to team profile
      navigate(`/team/${encodeURIComponent(team.team_id)}`);
      
    } catch (error) {
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('404') || error.message.includes('not found')) {
          setError('No team found with this team ID');
        } else if (error.message.includes('401') || error.message.includes('Invalid password')) {
          setError('Invalid password');
        } else if (error.message.includes('403') || error.message.includes('not active')) {
          setError('Team is not active. Please contact organizers.');
        } else if (error.message.includes('500')) {
          setError('Server error. Please try again later.');
        } else if (error.message.includes('network') || error.message.includes('fetch') || error.message.includes('SSL') || error.message.includes('Mixed Content')) {
          setError('Network error. Please try accessing the site via HTTP: http://crestora-25.vercel.app/login');
        } else {
          setError('Login failed. Please check your credentials and try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pt-28 pb-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="relative bg-background/80 backdrop-blur-md border border-[hsl(var(--space-cyan))]/40 rounded-xl p-6 shadow-[0_0_30px_hsl(var(--space-cyan))/0.2]">
            <h1 className="font-orbitron text-2xl text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--space-cyan))] via-[hsl(var(--space-violet))] to-[hsl(var(--space-gold))]">
              Login
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
                    <label className="block text-sm mb-1">Team ID</label>
                    <input
                      className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-[hsl(var(--space-cyan))]"
                      value={teamId}
                      onChange={(e) => setTeamId(e.target.value)}
                      placeholder="e.g., CRES-11AABB"
                      required
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter your team ID (e.g., CRES-11AABB)
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Password</label>
                    <input
                      className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-[hsl(var(--space-cyan))]"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="e.g., 2027505017"
                      required
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Team Leader's Register Number (e.g., 2027505017)
                    </p>
                  </div>
                </>
              )}
              {userType === 'organizer' && (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">You wil be redirected to the organizer portal</p>
                </div>
              )}
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <Button 
                type="submit" 
                className="w-full bg-[hsl(var(--space-cyan))] hover:bg-[hsl(var(--space-cyan))]/80 text-background font-orbitron"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-background mr-2"></div>
                    Logging in...
                  </div>
                ) : (
                  userType === 'participant' ? 'Login' : 'Go to Organizer Portal'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


