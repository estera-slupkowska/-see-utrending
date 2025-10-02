export default function handler(req, res) {
  console.log('🔍 Debug OAuth endpoint called:', {
    method: req.method,
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent'],
    origin: req.headers.origin
  })

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    // Environment variables check
    const envVars = {
      VITE_TIKTOK_CLIENT_KEY: process.env.VITE_TIKTOK_CLIENT_KEY,
      VITE_TIKTOK_CLIENT_SECRET: process.env.VITE_TIKTOK_CLIENT_SECRET,
      VITE_TIKTOK_REDIRECT_URI: process.env.VITE_TIKTOK_REDIRECT_URI,
      VITE_TIKTOK_SANDBOX_MODE: process.env.VITE_TIKTOK_SANDBOX_MODE,
      TIKTOK_CLIENT_KEY: process.env.TIKTOK_CLIENT_KEY,
      TIKTOK_CLIENT_SECRET: process.env.TIKTOK_CLIENT_SECRET,
      TIKTOK_REDIRECT_URI: process.env.TIKTOK_REDIRECT_URI
    }

    // Hardcoded sandbox values for comparison
    const sandboxValues = {
      clientKey: 'sbawnbpy8ri5x8kz7d',
      clientSecret: 'itx3DHTZz7xjDpMy3IPfD7mNHdtWnGgv',
      redirectUri: 'https://seeutrending.vercel.app/oauth/redirect'
    }

    // OAuth URL construction test
    const clientKey = envVars.VITE_TIKTOK_CLIENT_KEY || envVars.TIKTOK_CLIENT_KEY || sandboxValues.clientKey
    const redirectUri = envVars.VITE_TIKTOK_REDIRECT_URI || envVars.TIKTOK_REDIRECT_URI || sandboxValues.redirectUri
    const scope = 'user.info.basic,user.info.profile'
    const state = `debug_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const baseUrl = 'https://www.tiktok.com/v2/auth/authorize/'
    const paramString = [
      `client_key=${clientKey}`,
      `scope=${scope}`,
      `response_type=code`,
      `redirect_uri=${encodeURIComponent(redirectUri)}`,
      `state=${state}`
    ].join('&')

    const authUrl = `${baseUrl}?${paramString}`

    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        VERCEL_ENV: process.env.VERCEL_ENV
      },
      environmentVariables: {
        foundViteClientKey: !!envVars.VITE_TIKTOK_CLIENT_KEY,
        foundViteClientSecret: !!envVars.VITE_TIKTOK_CLIENT_SECRET,
        foundViteRedirectUri: !!envVars.VITE_TIKTOK_REDIRECT_URI,
        foundClientKey: !!envVars.TIKTOK_CLIENT_KEY,
        foundClientSecret: !!envVars.TIKTOK_CLIENT_SECRET,
        foundRedirectUri: !!envVars.TIKTOK_REDIRECT_URI,
        sandboxMode: envVars.VITE_TIKTOK_SANDBOX_MODE
      },
      maskedValues: {
        clientKey: clientKey ? `${clientKey.substring(0, 4)}...${clientKey.substring(clientKey.length - 4)}` : 'NOT SET',
        redirectUri: redirectUri || 'NOT SET',
        scope: scope
      },
      oauthUrl: {
        baseUrl,
        fullUrl: authUrl,
        urlLength: authUrl.length,
        containsScope: authUrl.includes('scope='),
        scopeValue: authUrl.split('scope=')[1]?.split('&')[0] || 'NOT FOUND'
      },
      sandboxComparison: {
        clientKeyMatches: clientKey === sandboxValues.clientKey,
        redirectUriMatches: redirectUri === sandboxValues.redirectUri,
        usingSandboxValues: clientKey === sandboxValues.clientKey && redirectUri === sandboxValues.redirectUri
      },
      validation: {
        hasClientKey: !!clientKey,
        hasRedirectUri: !!redirectUri,
        clientKeyLength: clientKey?.length || 0,
        expectedClientKeyLength: 18, // sbawnbpy8ri5x8kz7d length
        redirectUriValid: redirectUri && redirectUri.startsWith('https://'),
        scopeFormat: scope === 'user.info.basic,user.info.profile'
      }
    }

    console.log('🔍 OAuth Debug Info:', debugInfo)

    res.status(200).json({
      success: true,
      debug: debugInfo,
      message: 'OAuth debug information collected successfully'
    })

  } catch (error) {
    console.error('❌ Debug endpoint error:', error)
    res.status(500).json({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    })
  }
}