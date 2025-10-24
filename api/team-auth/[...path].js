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
    // Extract the path from the request
    const { path } = req.query;
    const apiPath = Array.isArray(path) ? path.join('/') : path;
    
    // Build the backend URL for team-auth endpoints
    const backendUrl = `http://3.110.143.60:8000/api/team-auth/${apiPath}`;
    
    console.log(`Proxying team-auth request to: ${backendUrl}`);
    
    // Forward the request to your backend
    const response = await fetch(backendUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization && { Authorization: req.headers.authorization }),
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    
    // Return the response with the same status code
    return res.status(response.status).json(data);
    
  } catch (error) {
    console.error('Team auth proxy error:', error);
    return res.status(500).json({ 
      error: 'Team auth proxy error', 
      message: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
