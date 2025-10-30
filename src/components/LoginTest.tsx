import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

// Test component to verify API connectivity
const LoginTest = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const API_BASE_URL = 'http://3.110.143.60:8080/api/public';

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testAPI = async () => {
    setTesting(true);
    setTestResults([]);
    
    addResult('Starting API tests...');

    try {
      // Test 1: Health Check
      addResult('Testing health check...');
      const healthResponse = await fetch(`${API_BASE_URL}/health`);
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        addResult(`✅ Health check passed: ${healthData.status}`);
      } else {
        addResult(`❌ Health check failed: ${healthResponse.status}`);
      }

      // Test 2: Get Teams
      addResult('Testing get teams...');
      const teamsResponse = await fetch(`${API_BASE_URL}/teams?limit=5`);
      if (teamsResponse.ok) {
        const teamsData = await teamsResponse.json();
        addResult(`✅ Get teams passed: Found ${teamsData.teams?.length || 0} teams`);
        
        // Test 3: Get specific team (if teams exist)
        if (teamsData.teams && teamsData.teams.length > 0) {
          const firstTeam = teamsData.teams[0];
          addResult(`Testing get specific team: ${firstTeam.team_id}`);
          
          const teamResponse = await fetch(`${API_BASE_URL}/teams/${firstTeam.team_id}`);
          if (teamResponse.ok) {
            const teamData = await teamResponse.json();
            addResult(`✅ Get specific team passed: ${teamData.team_name}`);
            addResult(`   Team status: ${teamData.status}`);
            addResult(`   Current round: ${teamData.current_round}`);
            addResult(`   Members: ${teamData.members?.length || 0}`);
          } else {
            addResult(`❌ Get specific team failed: ${teamResponse.status}`);
          }
        }
      } else {
        addResult(`❌ Get teams failed: ${teamsResponse.status}`);
      }

      // Test 4: Get Team Stats
      addResult('Testing team stats...');
      const statsResponse = await fetch(`${API_BASE_URL}/teams/stats`);
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        addResult(`✅ Team stats passed: ${statsData.total_teams} total teams`);
        addResult(`   Active: ${statsData.active_teams}, Eliminated: ${statsData.eliminated_teams}`);
      } else {
        addResult(`❌ Team stats failed: ${statsResponse.status}`);
      }

      addResult('🎉 All tests completed!');

    } catch (error) {
      addResult(`❌ Test error: ${error}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-background/80 backdrop-blur-md border border-[hsl(var(--space-cyan))]/40 rounded-xl shadow-[0_0_30px_hsl(var(--space-cyan))/0.2]">
      <h2 className="text-xl font-bold mb-4 text-center">API Connection Test</h2>
      
      <div className="mb-4">
        <Button 
          onClick={testAPI} 
          disabled={testing}
          className="w-full bg-[hsl(var(--space-cyan))] hover:bg-[hsl(var(--space-cyan))]/80 text-background"
        >
          {testing ? 'Testing...' : 'Test API Connection'}
        </Button>
      </div>

      <div className="bg-black/20 rounded-lg p-4 max-h-96 overflow-y-auto">
        <h3 className="font-semibold mb-2">Test Results:</h3>
        {testResults.length === 0 ? (
          <p className="text-muted-foreground">Click "Test API Connection" to start testing</p>
        ) : (
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div 
                key={index} 
                className={`text-sm font-mono ${
                  result.includes('✅') ? 'text-green-400' : 
                  result.includes('❌') ? 'text-red-400' : 
                  'text-foreground'
                }`}
              >
                {result}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        <p><strong>API Base URL:</strong> {API_BASE_URL}</p>
        <p><strong>Note:</strong> This tests the public API endpoints that the login form will use.</p>
      </div>
    </div>
  );
};

export default LoginTest;
