// Debug endpoint for TikTok token exchange - bypasses frontend complexity
export default async function handler(req, res) {
  // Allow CORS for testing
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { testCode, testClientKey, testClientSecret, testRedirectUri } = req.body

    console.log('🧪 DEBUG: Direct TikTok token exchange test')
    console.log('Test Code provided:', !!testCode)
    console.log('Test Client Key provided:', !!testClientKey)
    console.log('Test Client Secret provided:', !!testClientSecret)
    console.log('Test Redirect URI provided:', !!testRedirectUri)

    // Use provided values or defaults (exact same values as main endpoint)
    const clientKey = testClientKey || process.env.TIKTOK_CLIENT_KEY || 'sbawnbpy8ri5x8kz7d'
    const clientSecret = testClientSecret || process.env.TIKTOK_CLIENT_SECRET || 'itx3DHTZz7xjDpMy3IPfD7mNHdtWnGgv'
    const redirectUri = testRedirectUri || process.env.TIKTOK_REDIRECT_URI || 'https://seeutrending.vercel.app/oauth/redirect'

    console.log('🔧 Using credentials:')
    console.log('Client Key:', clientKey ? `${clientKey.substring(0, 4)}...${clientKey.substring(clientKey.length - 4)}` : 'NOT SET')
    console.log('Client Secret:', clientSecret ? `${clientSecret.substring(0, 4)}...${clientSecret.substring(clientSecret.length - 4)}` : 'NOT SET')
    console.log('Redirect URI:', redirectUri)

    if (!testCode) {
      return res.status(400).json({
        error: 'Missing testCode',
        info: 'This is a debug endpoint. Provide testCode from TikTok OAuth callback',
        currentConfig: {
          hasClientKey: !!clientKey,
          hasClientSecret: !!clientSecret,
          redirectUri: redirectUri,
          environment: {
            TIKTOK_CLIENT_KEY: !!process.env.TIKTOK_CLIENT_KEY,
            TIKTOK_CLIENT_SECRET: !!process.env.TIKTOK_CLIENT_SECRET,
            TIKTOK_REDIRECT_URI: !!process.env.TIKTOK_REDIRECT_URI
          }
        }
      })
    }

    // Create the exact same request as the main endpoint
    const formBody = `client_key=${encodeURIComponent(clientKey)}&client_secret=${encodeURIComponent(clientSecret)}&code=${encodeURIComponent(testCode)}&grant_type=authorization_code&redirect_uri=${encodeURIComponent(redirectUri)}`

    console.log('📤 Debug: Exact form body being sent to TikTok:', formBody.replace(clientSecret, '***SECRET***'))

    const tokenEndpoint = 'https://open.tiktokapis.com/v2/oauth/token/'
    console.log('🌐 Debug: Using token endpoint:', tokenEndpoint)

    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache'
      },
      body: formBody
    })

    console.log('📊 Debug: TikTok response status:', tokenResponse.status)
    console.log('📊 Debug: TikTok response headers:', Object.fromEntries(tokenResponse.headers.entries()))

    const responseText = await tokenResponse.text()
    console.log('📊 Debug: Raw TikTok response:', responseText)

    let responseData
    try {
      responseData = JSON.parse(responseText)
      console.log('📊 Debug: Parsed TikTok response:', responseData)
    } catch (parseError) {
      console.error('❌ Debug: Could not parse response as JSON:', parseError.message)
      responseData = { rawResponse: responseText }
    }

    return res.status(200).json({
      success: tokenResponse.ok,
      status: tokenResponse.status,
      headers: Object.fromEntries(tokenResponse.headers.entries()),
      response: responseData,
      requestDetails: {
        endpoint: tokenEndpoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache'
        },
        bodyPreview: formBody.replace(clientSecret, '***SECRET***'),
        credentials: {
          clientKey: clientKey ? `${clientKey.substring(0, 4)}...${clientKey.substring(clientKey.length - 4)}` : 'NOT SET',
          clientSecret: clientSecret ? `${clientSecret.substring(0, 4)}...${clientSecret.substring(clientSecret.length - 4)}` : 'NOT SET',
          redirectUri: redirectUri
        }
      }
    })

  } catch (error) {
    console.error('💥 Debug endpoint error:', error)
    return res.status(500).json({
      error: 'Debug endpoint error',
      message: error.message,
      stack: error.stack
    })
  }
}