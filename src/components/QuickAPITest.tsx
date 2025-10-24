import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const QuickAPITest = () => {
  const [result, setResult] = useState<string>('');
  const [testing, setTesting] = useState(false);

  const testCorrectAPI = async () => {
    setTesting(true);
    setResult('Testing...\n');
    
    const API_URL = 'http://3.110.143.60:8000/api/public/health';
    
    try {
      setResult(prev => prev + `Testing: ${API_URL}\n`);
      
      const response = await fetch(API_URL);
      const text = await response.text();
      
      setResult(prev => prev + `Status: ${response.status}\n`);
      setResult(prev => prev + `Content-Type: ${response.headers.get('content-type')}\n`);
      setResult(prev => prev + `Response: ${text}\n`);
      
      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        setResult(prev => prev + '✅ SUCCESS: API is working correctly!\n');
      } else {
        setResult(prev => prev + '❌ ERROR: Still getting non-JSON response\n');
      }
      
    } catch (error) {
      setResult(prev => prev + `❌ ERROR: ${error}\n`);
    } finally {
      setTesting(false);
    }
  };

  const testTeamsAPI = async () => {
    setTesting(true);
    setResult('Testing teams API...\n');
    
    const API_URL = 'http://3.110.143.60:8000/api/public/teams?limit=1';
    
    try {
      const response = await fetch(API_URL);
      const text = await response.text();
      
      setResult(prev => prev + `Teams API Status: ${response.status}\n`);
      setResult(prev => prev + `Response: ${text.substring(0, 200)}...\n`);
      
      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        setResult(prev => prev + '✅ Teams API is working!\n');
      } else {
        setResult(prev => prev + '❌ Teams API still has issues\n');
      }
      
    } catch (error) {
      setResult(prev => prev + `❌ Teams API Error: ${error}\n`);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-background/80 backdrop-blur-md border border-[hsl(var(--space-cyan))]/40 rounded-xl shadow-[0_0_30px_hsl(var(--space-cyan))/0.2]">
      <h2 className="text-xl font-bold mb-4 text-center">🚀 Quick API Test</h2>
      
      <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
        <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Fixed Configuration:</h3>
        <p className="text-sm text-green-700 dark:text-green-300">
          <strong>API URL:</strong> http://3.110.143.60:8000/api/public/
        </p>
        <p className="text-sm text-green-700 dark:text-green-300">
          <strong>Note:</strong> Changed from port 8080 to 8000
        </p>
      </div>
      
      <div className="mb-4 flex gap-2">
        <Button 
          onClick={testCorrectAPI} 
          disabled={testing}
          className="bg-green-600 hover:bg-green-700"
        >
          Test Health API
        </Button>
        
        <Button 
          onClick={testTeamsAPI} 
          disabled={testing}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Test Teams API
        </Button>
      </div>

      <div className="bg-black/20 rounded-lg p-4 max-h-64 overflow-y-auto">
        <h3 className="font-semibold mb-2">Test Results:</h3>
        <pre className="text-sm font-mono whitespace-pre-wrap text-foreground">
          {result || 'Click a test button to start'}
        </pre>
      </div>

      <div className="mt-4 text-sm text-muted-foreground">
        <p><strong>What was wrong:</strong></p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>You were using port 8080 (frontend) instead of 8000 (backend)</li>
          <li>The server was returning your frontend's HTML instead of API JSON</li>
          <li>Now using the correct backend port 8000</li>
        </ul>
      </div>
    </div>
  );
};

export default QuickAPITest;
