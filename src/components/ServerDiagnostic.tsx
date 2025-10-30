import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const ServerDiagnostic = () => {
  const [diagnostics, setDiagnostics] = useState<string[]>([]);
  const [testing, setTesting] = useState(false);

  const API_BASE_URL = 'http://3.110.143.60:8080/api/public';
  const BACKEND_BASE_URL = 'http://3.110.143.60:8080';

  const addDiagnostic = (message: string) => {
    setDiagnostics(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const runFullDiagnostic = async () => {
    setTesting(true);
    setDiagnostics([]);
    
    addDiagnostic('🔍 Starting comprehensive server diagnostic...');
    addDiagnostic('');

    // Test 1: Basic connectivity
    addDiagnostic('1️⃣ Testing basic server connectivity...');
    try {
      const response = await fetch(BACKEND_BASE_URL, { 
        method: 'GET',
        mode: 'cors'
      });
      addDiagnostic(`   ✅ Server is reachable (Status: ${response.status})`);
      addDiagnostic(`   📄 Response type: ${response.headers.get('content-type')}`);
      
      const text = await response.text();
      addDiagnostic(`   📝 Response preview: ${text.substring(0, 200)}...`);
    } catch (error) {
      addDiagnostic(`   ❌ Server unreachable: ${error}`);
      addDiagnostic('   💡 Check if server is running on port 8080');
    }

    addDiagnostic('');

    // Test 2: API health endpoint
    addDiagnostic('2️⃣ Testing API health endpoint...');
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        mode: 'cors'
      });
      addDiagnostic(`   📊 Health endpoint status: ${response.status}`);
      addDiagnostic(`   📄 Content-Type: ${response.headers.get('content-type')}`);
      
      const text = await response.text();
      addDiagnostic(`   📝 Raw response: ${text}`);
      
      if (response.headers.get('content-type')?.includes('application/json')) {
        try {
          const data = JSON.parse(text);
          addDiagnostic(`   ✅ Valid JSON response: ${JSON.stringify(data)}`);
        } catch (parseError) {
          addDiagnostic(`   ❌ JSON parse error: ${parseError}`);
        }
      } else {
        addDiagnostic(`   ⚠️ Non-JSON response detected`);
      }
    } catch (error) {
      addDiagnostic(`   ❌ Health endpoint error: ${error}`);
    }

    addDiagnostic('');

    // Test 3: Teams endpoint
    addDiagnostic('3️⃣ Testing teams endpoint...');
    try {
      const response = await fetch(`${API_BASE_URL}/teams?limit=1`, {
        method: 'GET',
        mode: 'cors'
      });
      addDiagnostic(`   📊 Teams endpoint status: ${response.status}`);
      addDiagnostic(`   📄 Content-Type: ${response.headers.get('content-type')}`);
      
      const text = await response.text();
      addDiagnostic(`   📝 Raw response (first 300 chars): ${text.substring(0, 300)}...`);
      
      if (response.headers.get('content-type')?.includes('application/json')) {
        try {
          const data = JSON.parse(text);
          addDiagnostic(`   ✅ Valid JSON response`);
          addDiagnostic(`   📊 Teams found: ${data.teams?.length || 0}`);
        } catch (parseError) {
          addDiagnostic(`   ❌ JSON parse error: ${parseError}`);
        }
      } else {
        addDiagnostic(`   ⚠️ Non-JSON response - this is the problem!`);
        addDiagnostic(`   🔍 Full response: ${text}`);
      }
    } catch (error) {
      addDiagnostic(`   ❌ Teams endpoint error: ${error}`);
    }

    addDiagnostic('');

    // Test 4: Specific team endpoint
    addDiagnostic('4️⃣ Testing specific team endpoint...');
    const testTeamId = 'CRES-96DA2';
    try {
      const response = await fetch(`${API_BASE_URL}/teams/${testTeamId}`, {
        method: 'GET',
        mode: 'cors'
      });
      addDiagnostic(`   📊 Team endpoint status: ${response.status}`);
      addDiagnostic(`   📄 Content-Type: ${response.headers.get('content-type')}`);
      
      const text = await response.text();
      addDiagnostic(`   📝 Raw response: ${text}`);
      
      if (response.status === 404) {
        addDiagnostic(`   ℹ️ Team ${testTeamId} not found (this is expected if team doesn't exist)`);
      } else if (response.headers.get('content-type')?.includes('application/json')) {
        try {
          const data = JSON.parse(text);
          addDiagnostic(`   ✅ Valid JSON response for team ${testTeamId}`);
        } catch (parseError) {
          addDiagnostic(`   ❌ JSON parse error: ${parseError}`);
        }
      } else {
        addDiagnostic(`   ⚠️ Non-JSON response for team endpoint`);
      }
    } catch (error) {
      addDiagnostic(`   ❌ Team endpoint error: ${error}`);
    }

    addDiagnostic('');

    // Test 5: CORS test
    addDiagnostic('5️⃣ Testing CORS configuration...');
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'OPTIONS',
        mode: 'cors'
      });
      addDiagnostic(`   📊 CORS preflight status: ${response.status}`);
      addDiagnostic(`   🔗 CORS headers: ${response.headers.get('access-control-allow-origin') || 'Not set'}`);
    } catch (error) {
      addDiagnostic(`   ❌ CORS test error: ${error}`);
    }

    addDiagnostic('');
    addDiagnostic('🏁 Diagnostic complete!');
    addDiagnostic('');
    addDiagnostic('💡 Common solutions:');
    addDiagnostic('   • If server unreachable: Start the backend server');
    addDiagnostic('   • If non-JSON response: Check server logs for errors');
    addDiagnostic('   • If 404: Verify API routes are correctly configured');
    addDiagnostic('   • If CORS issues: Check CORS middleware configuration');

    setTesting(false);
  };

  const testLocalServer = async () => {
    setTesting(true);
    setDiagnostics([]);
    
    addDiagnostic('🏠 Testing local server (localhost:8000)...');
    
    const LOCAL_API_URL = 'http://localhost:8000/api/public';
    
    try {
      const response = await fetch(`${LOCAL_API_URL}/health`);
      const text = await response.text();
      
      addDiagnostic(`Local server status: ${response.status}`);
      addDiagnostic(`Local server response: ${text}`);
      
      if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
        addDiagnostic('✅ Local server is working correctly!');
        addDiagnostic('💡 Consider using local server for development');
      }
    } catch (error) {
      addDiagnostic(`❌ Local server error: ${error}`);
      addDiagnostic('💡 Make sure to start local server: python -m uvicorn app.main:app --host 0.0.0.0 --port 8000');
    }
    
    setTesting(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-background/80 backdrop-blur-md border border-[hsl(var(--space-cyan))]/40 rounded-xl shadow-[0_0_30px_hsl(var(--space-cyan))/0.2]">
      <h2 className="text-2xl font-bold mb-4 text-center">🔧 Server Diagnostic Tool</h2>
      
      <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
        <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Current Configuration:</h3>
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          <strong>Production API:</strong> {API_BASE_URL}
        </p>
        <p className="text-sm text-yellow-700 dark:text-yellow-300">
          <strong>Backend Base:</strong> {BACKEND_BASE_URL}
        </p>
      </div>
      
      <div className="mb-4 flex gap-2 flex-wrap">
        <Button 
          onClick={runFullDiagnostic} 
          disabled={testing}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          🔍 Run Full Diagnostic
        </Button>
        
        <Button 
          onClick={testLocalServer} 
          disabled={testing}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          🏠 Test Local Server
        </Button>
      </div>

      <div className="bg-black/20 rounded-lg p-4 max-h-96 overflow-y-auto">
        <h3 className="font-semibold mb-2">Diagnostic Results:</h3>
        {diagnostics.length === 0 ? (
          <p className="text-muted-foreground">Click "Run Full Diagnostic" to start</p>
        ) : (
          <div className="space-y-1">
            {diagnostics.map((info, index) => (
              <div 
                key={index} 
                className={`text-sm font-mono whitespace-pre-wrap ${
                  info.includes('✅') ? 'text-green-400' : 
                  info.includes('❌') ? 'text-red-400' : 
                  info.includes('⚠️') ? 'text-yellow-400' :
                  info.includes('💡') ? 'text-blue-400' :
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
        <p><strong>Quick Fixes:</strong></p>
        <ul className="list-disc list-inside space-y-1 mt-2">
          <li>Make sure your backend server is running</li>
          <li>Check if the API routes are correctly configured</li>
          <li>Verify CORS settings allow your frontend domain</li>
          <li>Check server logs for any error messages</li>
        </ul>
      </div>
    </div>
  );
};

export default ServerDiagnostic;
