// CommonJS format for Vercel functions

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // Test the backend connection
    const backendUrl = 'http://3.110.143.60:8000/api/health';
    
    console.log(`Testing backend connection: ${backendUrl}`);
    
    const response = await fetch(backendUrl);
    const data = await response.json();
    
    return res.status(200).json({
      message: 'Proxy is working!',
      backend_status: data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Proxy test error:', error);
    return res.status(500).json({ 
      error: 'Proxy test failed', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
