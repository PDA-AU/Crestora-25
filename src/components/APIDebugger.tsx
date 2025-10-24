import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const APIDebugger = () => {
  const [teamId, setTeamId] = useState('CRES-96DA2');
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const API_BASE_URL = 'http://3.110.143.60:8080/api/public';

  const addDebugInfo = (message: string) => {
    setDebugInfo(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testTeamAPI = async () => {
    setTesting(true);
    setDebugInfo([]);
    
    addDebugInfo(`Testing team API with ID: ${teamId}`);
    addDebugInfo(`API URL: ${API_BASE_URL}/teams/${teamId}`);

    try {
      // Test the exact same API call that the login form uses
      const response = await fetch(`${API_BASE_URL}/teams/${teamId}`);
      
      addDebugInfo(`Response status: ${response.status}`);
      addDebugInfo(`Response status text: ${response.statusText}`);
      addDebugInfo(`Response headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`);
      
      // Get the response text first to see what we're actually receiving
      const responseText = await response.text();
      addDebugInfo(`Raw response text: ${responseText.substring(0, 500)}${responseText.length > 500 ? '...' : ''}`);
      
      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          addDebugInfo(`✅ Successfully parsed JSON response`);
          addDebugInfo(`Team name: ${data.team_name || 'N/A'}`);
          addDebugInfo(`Team status: ${data.status || 'N/A'}`);
          addDebugInfo(`Current round: ${data.current_round || 'N/A'}`);
          addDebugInfo(`Members count: ${data.members?.length || 0}`);
        } catch (parseError) {
          addDebugInfo(`❌ Failed to parse JSON: ${parseError}`);
        }
      } else {
        addDebugInfo(`❌ API returned error status: ${response.status}`);
        try {
          const errorData = JSON.parse(responseText);
          addDebugInfo(`Error details: ${JSON.stringify(errorData)}`);
        } catch (parseError) {
          addDebugInfo(`Error response is not JSON: ${responseText}`);
        }
      }
      
    } catch (error) {
      addDebugInfo(`❌ Network/Request error: ${error}`);
    } finally {
      setTesting(false);
    }
  };

  const testHealthAPI = async () => {
    setTesting(true);
    setDebugInfo([]);
    
    addDebugInfo('Testing health API...');
    
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      const responseText = await response.text();
      
      addDebugInfo(`Health API status: ${response.status}`);
      addDebugInfo(`Health API response: ${responseText}`);
      
    } catch (error) {
      addDebugInfo(`❌ Health API error: ${error}`);
    } finally {
      setTesting(false);
    }
  };

  const testTeamsListAPI = async () => {
    setTesting(true);
    setDebugInfo([]);
    
    addDebugInfo('Testing teams list API...');
    
    try {
      const response = await fetch(`${API_BASE_URL}/teams?limit=5`);
      const responseText = await response.text();
      
      addDebugInfo(`Teams list status: ${response.status}`);
      addDebugInfo(`Teams list response: ${responseText.substring(0, 500)}${responseText.length > 500 ? '...' : ''}`);
      
      if (response.ok) {
        try {
          const data = JSON.parse(responseText);
          addDebugInfo(`✅ Found ${data.teams?.length || 0} teams`);
          if (data.teams && data.teams.length > 0) {
            addDebugInfo(`First team ID: ${data.teams[0].team_id}`);
            setTeamId(data.teams[0].team_id); // Auto-fill with a real team ID
          }
        } catch (parseError) {
          addDebugInfo(`❌ Failed to parse teams list JSON: ${parseError}`);
        }
      }
      
    } catch (error) {
      addDebugInfo(`❌ Teams list API error: ${error}`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-background/80 backdrop-blur-md border border-[hsl(var(--space-cyan))]/40 rounded-xl shadow-[0_0_30px_hsl(var(--space-cyan))/0.2]">
      <h2 className="text-xl font-bold mb-4 text-center">API Debugger</h2>
      
      <div className="mb-4 space-y-2">
        <div>
          <label className="block text-sm mb-1">Team ID to test:</label>
          <input
            type="text"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-[hsl(var(--space-cyan))]"
            placeholder="e.g., CRES-96DA2"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button 
            onClick={testHealthAPI} 
            disabled={testing}
            className="bg-green-600 hover:bg-green-700"
          >
            Test Health API
          </Button>
          
          <Button 
            onClick={testTeamsListAPI} 
            disabled={testing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Test Teams List
          </Button>
          
          <Button 
            onClick={testTeamAPI} 
            disabled={testing}
            className="bg-[hsl(var(--space-cyan))] hover:bg-[hsl(var(--space-cyan))]/80"
          >
            Test Team API
          </Button>
        </div>
      </div>

      <div className="bg-black/20 rounded-lg p-4 max-h-96 overflow-y-auto">
        <h3 className="font-semibold mb-2">Debug Output:</h3>
        {debugInfo.length === 0 ? (
          <p className="text-muted-foreground">Click a test button to start debugging</p>
        ) : (
          <div className="space-y-1">
            {debugInfo.map((info, index) => (
              <div 
                key={index} 
                className={`text-sm font-mono ${
                  info.includes('✅') ? 'text-green-400' : 
                  info.includes('❌') ? 'text-red-400' : 
                  'text-foreground'
                }`}
              >
                {info}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        <p><strong>API Base URL:</strong> {API_BASE_URL}</p>
        <p><strong>Note:</strong> This will help identify the exact issue with the API calls.</p>
      </div>
    </div>
  );
};

export default APIDebugger;
