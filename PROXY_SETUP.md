# HTTPS Proxy Setup for Crestora'25

## Overview
This setup creates HTTPS proxy endpoints that forward requests to your HTTP backend server, solving the Mixed Content Policy issue.

## How It Works

### 1. Proxy Endpoints Created
- `/api/public/[...path]` - Proxies all public API calls
- `/api/team-auth/[...path]` - Proxies team authentication calls
- `/api/test-proxy` - Test endpoint to verify proxy functionality

### 2. Request Flow
```
Frontend (HTTPS) → Vercel Proxy (HTTPS) → Backend (HTTP)
```

### 3. Benefits
- ✅ Solves Mixed Content Policy issues
- ✅ Maintains HTTPS security for frontend
- ✅ No changes needed to backend server
- ✅ Automatic CORS handling
- ✅ Error handling and logging

## API Endpoints

### Public API Proxy
- **URL**: `/api/public/*`
- **Backend**: `http://3.110.143.60:8000/api/public/*`
- **Methods**: GET, POST, PUT, DELETE

### Team Auth Proxy
- **URL**: `/api/team-auth/*`
- **Backend**: `http://3.110.143.60:8000/api/team-auth/*`
- **Methods**: GET, POST, PUT, DELETE

### Test Proxy
- **URL**: `/api/test-proxy`
- **Purpose**: Test backend connectivity
- **Method**: GET

## Usage Example

### Before (Mixed Content Error)
```javascript
const response = await fetch('http://3.110.143.60:8000/api/team-auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ team_id: 'CRES-123', password: 'password' })
});
```

### After (Using Proxy)
```javascript
const response = await fetch('/api/team-auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ team_id: 'CRES-123', password: 'password' })
});
```

## Deployment

1. **Deploy to Vercel**: The proxy endpoints will be automatically available
2. **Test the proxy**: Visit `/api/test-proxy` to verify connectivity
3. **Update frontend**: All API calls now use relative URLs

## Troubleshooting

### Check Proxy Status
Visit: `https://your-app.vercel.app/api/test-proxy`

### Check Backend Connectivity
Visit: `http://3.110.143.60:8000/api/health`

### Common Issues
1. **502 Bad Gateway**: Backend server might be down
2. **CORS Errors**: Check proxy CORS headers
3. **Timeout**: Backend server might be slow to respond

## Files Modified
- `api/public/[...path].ts` - Public API proxy
- `api/team-auth/[...path].ts` - Team auth proxy
- `api/test-proxy.ts` - Test endpoint
- `src/pages/Login.tsx` - Updated to use proxy URLs
- `vercel.json` - Added function configuration
- `package.json` - Added @vercel/node dependency

## Security Notes
- All requests are logged for debugging
- CORS headers are properly set
- No sensitive data is exposed in logs
- Backend credentials are not stored in proxy
