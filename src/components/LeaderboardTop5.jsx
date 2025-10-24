import React, { useEffect, useState, useRef } from "react";

/**
 * LeaderboardTop5.jsx
 *
 * - Fetches top K teams from API (configurable)
 * - Shows: Rank (1-K), Team Name, Score (Normalized)
 * - Real-time data from backend
 */

// Configuration - Change this to show different number of top teams
const TOP_K_TEAMS = 5; // Change this number to show top 3, 10, etc.

// API Configuration
const API_BASE_URL = 'http://3.110.143.60:8000/api/public';

// API function to fetch leaderboard data
const fetchLeaderboard = async () => {
  try {
    console.log(`Fetching leaderboard from: ${API_BASE_URL}/leaderboard?limit=${TOP_K_TEAMS}`);
    const response = await fetch(`${API_BASE_URL}/leaderboard?limit=${TOP_K_TEAMS}`);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Raw API response:', data);
    console.log('Response structure:', {
      hasLeaderboard: !!data.leaderboard,
      leaderboardLength: data.leaderboard?.length || 0,
      totalTeams: data.total_teams,
      displayedTeams: data.displayed_teams
    });
    
    if (!data.leaderboard) {
      throw new Error('Invalid API response: missing leaderboard field');
    }
    
    if (!Array.isArray(data.leaderboard)) {
      throw new Error('Invalid API response: leaderboard is not an array');
    }
    
    return data.leaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    
    // Provide more specific error messages
    if (error.name === 'TypeError' && error.message.includes('Load failed')) {
      throw new Error('Network error: Unable to connect to the server. Please check your internet connection and try again.');
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Failed to fetch data from the server.');
    } else {
      throw error;
    }
  }
};

export default function LeaderboardTop5() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchLeaderboardData() {
      setLoading(true);
      setError(null);

      try {
        const leaderboardData = await fetchLeaderboard();
        console.log('Leaderboard data received:', leaderboardData);
        
        if (!cancelled && mounted.current) {
          setTeams(leaderboardData);
          setLoading(false);
          setRetryCount(0); // Reset retry count on success
        }
      } catch (err) {
        if (!cancelled && mounted.current) {
          console.error("Leaderboard error:", err);
          setError(String(err));
          setLoading(false);
        }
      }
    }

    fetchLeaderboardData();
    return () => {
      cancelled = true;
    };
  }, [retryCount]); // Re-run when retryCount changes

  // Format score for display
  const formatScore = (score) => {
    if (score === null || score === undefined) return '-';
    return Number(score).toFixed(1);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
      <div style={{ width: "min(920px, 95%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <h3 style={{ textAlign: "center", marginBottom: 12, fontFamily: "Orbitron, sans-serif", color: "#7fffd4" }}>
          🏆 Top {TOP_K_TEAMS} Teams
        </h3>

        <div
          className="neon-border"
          style={{
            padding: 14,
            borderRadius: 12,
            width: "100%",
            border: "2px solid rgba(127,255,212,0.7)",
            boxShadow:
              "0 0 10px rgba(127,255,212,0.6), 0 0 20px rgba(127,255,212,0.4), inset 0 0 10px rgba(127,255,212,0.2)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.01), rgba(255,255,255,0.00))",
          }}
        >
          {loading && <div style={{ textAlign: "center", padding: 24, color: "#9aa0a6" }}>Loading top teams…</div>}

          {error && (
            <div style={{ textAlign: "center", padding: 18, color: "#ff6b6b" }}>
              <div style={{ marginBottom: 12 }}>
                Failed to load leaderboard: {error}
              </div>
              <button
                onClick={() => setRetryCount(prev => prev + 1)}
                style={{
                  background: "rgba(127,255,212,0.2)",
                  border: "1px solid rgba(127,255,212,0.5)",
                  color: "#7fffd4",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "14px"
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "rgba(127,255,212,0.3)";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "rgba(127,255,212,0.2)";
                }}
              >
                🔄 Retry
              </button>
            </div>
          )}

          {!loading && !error && (
            <table
              role="table"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "center",
                color: "#e6f7ff",
                fontFamily: "Inter, system-ui",
              }}
            >
              <thead>
                <tr>
                  <th style={thStyle}>Rank</th>
                  <th style={thStyle}>Team Name</th>
                  <th style={thStyle}>Percentile</th>
                </tr>
              </thead>

              <tbody>
                {teams.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ padding: 20, color: "#9aa0a6" }}>
                      {loading ? "Loading teams..." : "No teams found."}
                    </td>
                  </tr>
                ) : (
                  teams.map((team, index) => (
                    <tr key={team.team_id} style={index % 2 === 0 ? rowEvenStyle : rowOddStyle}>
                      <td style={tdCenter}>
                        <span style={{ 
                          fontWeight: 'bold', 
                          color: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#7fffd4' 
                        }}>
                          {team.rank || index + 1}
                        </span>
                      </td>
                      <td style={tdLeft}>{team.team_name || "-"}</td>
                      <td style={tdCenter}>{formatScore(team.percentile || team.normalized_score || team.final_score)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */
const thStyle = { padding: "12px", color: "#7fffd4", fontSize: 16, fontWeight: 700 };
const tdCenter = { padding: "10px", textAlign: "center", fontSize: 15 };
const tdLeft = { padding: "10px", textAlign: "left", fontSize: 15 };
const rowEvenStyle = { background: "rgba(255,255,255,0.02)" };
const rowOddStyle = { background: "rgba(255,255,255,0.04)" };
