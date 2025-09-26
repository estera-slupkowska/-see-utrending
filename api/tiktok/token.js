import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { code, userId, clientKey: frontendClientKey, redirectUri: frontendRedirectUri } = req.body

    if (!code || !userId) {
      return res.status(400).json({ error: 'Missing code or userId' })
    }

    console.log('🔄 Request received:', {
      hasCode: !!code,
      hasUserId: !!userId,
      hasFrontendClientKey: !!frontendClientKey,
      hasFrontendRedirectUri: !!frontendRedirectUri,
      codePreview: code ? code.substring(0, 10) + '...' : 'NONE'
    })

    // DON'T decode the authorization code - use it exactly as received from TikTok
    console.log('🔄 Using authorization code exactly as received from TikTok:', {
      codeLength: code?.length || 0,
      codePreview: code ? code.substring(0, 15) + '...' : 'NONE'
    })

    // TikTok OAuth configuration - Use sandbox credentials directly to bypass env issues
    const clientKey = frontendClientKey || 'sbawnbpy8ri5x8kz7d' // Sandbox client key
    const clientSecret = 'itx3DHTZz7xjDpMy3IPfD7mNHdtWnGgv' // Sandbox client secret - hardcoded for reliability
    const redirectUri = frontendRedirectUri || 'https://seeutrending.vercel.app/oauth/redirect'

    // Detect sandbox mode based on client key
    const isSandboxMode = clientKey === 'sbawnbpy8ri5x8kz7d'
    console.log('🏗️ Environment Detection:', {
      isSandboxMode,
      clientKeyType: isSandboxMode ? 'Sandbox' : 'Production',
      expectedBehavior: isSandboxMode ? 'Limited scopes, may return different response format' : 'Full functionality'
    })

    console.log('🔑 OAuth Configuration Selection:', {
      usingFrontendKey: !!frontendClientKey,
      usingServerKey: !frontendClientKey && !!process.env.TIKTOK_CLIENT_KEY,
      usingFrontendRedirectUri: !!frontendRedirectUri,
      usingServerRedirectUri: !frontendRedirectUri && !!process.env.TIKTOK_REDIRECT_URI,
      frontendKeyPreview: frontendClientKey ? `${frontendClientKey.substring(0, 4)}...${frontendClientKey.substring(frontendClientKey.length - 4)}` : 'NOT PROVIDED',
      serverKeyPreview: process.env.TIKTOK_CLIENT_KEY ? `${process.env.TIKTOK_CLIENT_KEY.substring(0, 4)}...${process.env.TIKTOK_CLIENT_KEY.substring(process.env.TIKTOK_CLIENT_KEY.length - 4)}` : 'NOT SET',
      frontendRedirectUri: frontendRedirectUri || 'NOT PROVIDED',
      serverRedirectUri: process.env.TIKTOK_REDIRECT_URI || 'NOT SET'
    })

    console.log('🔧 TikTok OAuth Configuration:')
    console.log('Client Key exists:', !!clientKey)
    console.log('Client Secret exists:', !!clientSecret)
    console.log('Redirect URI exists:', !!redirectUri)
    console.log('Code provided:', !!code)
    console.log('User ID:', userId)

    // All sandbox credentials are hardcoded, so this check should never fail
    if (!clientKey || !clientSecret || !redirectUri) {
      console.error('❌ UNEXPECTED: Missing hardcoded credentials')
      return res.status(500).json({
        error: 'Server configuration error - missing hardcoded credentials',
        details: { clientKey: !!clientKey, clientSecret: !!clientSecret, redirectUri: !!redirectUri }
      })
    }

    // Log exact credentials being used for TikTok API
    console.log('🔑 Using sandbox credentials:')
    console.log('Client Key:', clientKey ? `${clientKey.substring(0, 4)}...${clientKey.substring(clientKey.length - 4)}` : 'UNDEFINED')
    console.log('Client Secret:', clientSecret ? `${clientSecret.substring(0, 4)}...${clientSecret.substring(clientSecret.length - 4)}` : 'UNDEFINED')
    console.log('Redirect URI:', redirectUri)

    console.log('🔄 Exchanging code for access token...')

    // Prepare exact parameters being sent to TikTok
    const tokenParams = {
      client_key: clientKey,
      client_secret: clientSecret,
      code: code, // Use original code, not decoded
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    }

    console.log('📤 Token request parameters:', {
      client_key: clientKey ? `${clientKey.substring(0, 4)}...${clientKey.substring(clientKey.length - 4)}` : 'NOT SET',
      client_secret: clientSecret ? `${clientSecret.substring(0, 4)}...${clientSecret.substring(clientSecret.length - 4)}` : 'NOT SET',
      code: code ? `${code.substring(0, 8)}...` : 'NOT SET',
      grant_type: 'authorization_code',
      redirect_uri: redirectUri
    })

    // Step 1: Exchange authorization code for access token
    // Note: For sandbox, we might need a different endpoint, but using the standard one first
    const tokenEndpoint = 'https://open.tiktokapis.com/v2/oauth/token/'
    console.log('🌐 Using token endpoint:', tokenEndpoint)

    // Create form-urlencoded body manually to ensure correct formatting
    const formBody = `client_key=${encodeURIComponent(clientKey)}&client_secret=${encodeURIComponent(clientSecret)}&code=${encodeURIComponent(code)}&grant_type=authorization_code&redirect_uri=${encodeURIComponent(redirectUri)}`

    console.log('📤 Exact form body being sent to TikTok:', formBody.replace(clientSecret, '***SECRET***'))

    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache'
      },
      body: formBody
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('❌ Token exchange failed:', errorText)
      console.error('❌ Request was made with:')
      console.error('   - client_key:', clientKey ? `${clientKey.substring(0, 4)}...${clientKey.substring(clientKey.length - 4)}` : 'NOT SET')
      console.error('   - redirect_uri:', redirectUri)
      console.error('   - code provided:', !!code)
      console.error('❌ Response status:', tokenResponse.status)
      console.error('❌ Response headers:', Object.fromEntries(tokenResponse.headers.entries()))

      // Try to parse error response as JSON
      let errorMessage = errorText
      let errorDetails = {}

      try {
        const errorData = JSON.parse(errorText)
        console.error('❌ Parsed TikTok error:', errorData)

        if (errorData.error) {
          errorMessage = errorData.error
          errorDetails = errorData
        } else if (errorData.error_description) {
          errorMessage = errorData.error_description
          errorDetails = errorData
        } else if (errorData.message) {
          errorMessage = errorData.message
          errorDetails = errorData
        }
      } catch (parseError) {
        console.error('❌ Could not parse error as JSON:', parseError.message)
        console.error('❌ Raw error text:', errorText)
      }

      return res.status(400).json({
        error: errorMessage,
        details: errorText,
        parsedError: errorDetails,
        requestInfo: {
          client_key: clientKey ? `${clientKey.substring(0, 4)}...${clientKey.substring(clientKey.length - 4)}` : 'NOT SET',
          redirect_uri: redirectUri,
          has_code: !!code
        }
      })
    }

    const tokenData = await tokenResponse.json()
    console.log('✅ Token exchange response received')
    console.log('🔍 Full TikTok token response:', JSON.stringify(tokenData, null, 2))

    // Handle TikTok's various response formats
    if (tokenData.error) {
      console.error('❌ TikTok token error:', tokenData.error_description)
      return res.status(400).json({ error: tokenData.error_description })
    }

    // Check for TikTok's "ok" response format (sandbox mode)
    if (tokenData.code === "ok") {
      console.log('🔍 TikTok returned "ok" response - this is expected in sandbox mode')
      console.log('🏗️ Sandbox Mode Detected - checking for access token in response')

      // Look for access token in various possible locations
      const accessToken = tokenData.access_token
        || tokenData.data?.access_token
        || tokenData.token
        || tokenData.data?.token

      console.log('🔑 Access token found in "ok" response:', !!accessToken)

      if (!accessToken) {
        console.error('❌ No access token found in TikTok sandbox "ok" response')
        console.error('Available fields in response:', Object.keys(tokenData))
        console.error('🏗️ This is a sandbox limitation - checking scope compatibility')

        // Check if this is a scope mismatch issue
        const scopeGuidance = isSandboxMode ?
          'Sandbox mode may only support basic scopes (user.info.basic, user.info.profile)' :
          'Check that all requested scopes are configured in TikTok Developer portal'

        return res.status(400).json({
          error: 'TikTok Sandbox Mode - No Access Token',
          message: 'TikTok sandbox returned "ok" but no access token. This typically indicates scope mismatch.',
          guidance: {
            issue: 'Scope mismatch or sandbox configuration issue',
            possibleCauses: [
              '1. Requested scopes not configured in sandbox',
              '2. Target user account not properly added to sandbox',
              '3. Sandbox only supports basic scopes',
              '4. App needs approval for advanced scopes'
            ],
            solutions: [
              '1. Verify sandbox is configured with only basic scopes (user.info.basic, user.info.profile)',
              '2. Check that target user accounts (esti_besti22, framefever14) are added to sandbox',
              '3. Test with minimal scopes first, then add more gradually',
              '4. Ensure redirect URI matches exactly in TikTok Developer portal'
            ],
            nextSteps: scopeGuidance
          },
          tiktokResponse: tokenData,
          debugInfo: {
            isSandboxMode,
            clientKey: clientKey ? `${clientKey.substring(0, 4)}...${clientKey.substring(clientKey.length - 4)}` : 'NOT SET',
            redirectUri
          }
        })
      }

      console.log('✅ Access token extracted from sandbox "ok" response')
    } else if (!tokenData.access_token) {
      console.error('❌ No access token in standard TikTok response format')
      console.error('Response structure:', Object.keys(tokenData))

      // Check if this is an error response
      if (tokenData.error || tokenData.error_description) {
        const errorMsg = tokenData.error_description || tokenData.error || 'Unknown TikTok API error'
        return res.status(400).json({
          error: errorMsg,
          tiktokResponse: tokenData
        })
      }

      return res.status(400).json({
        error: 'Unexpected TikTok API response format',
        message: 'TikTok API returned an unexpected response structure',
        tiktokResponse: tokenData
      })
    }

    const accessToken = tokenData.access_token
      || tokenData.data?.access_token
      || tokenData.token
      || tokenData.data?.token

    // Step 2: Get user information from TikTok
    console.log('👤 Fetching user info with access token...')
    console.log('Access token exists:', !!accessToken)
    console.log('Access token preview:', accessToken ? `${accessToken.substring(0, 10)}...` : 'NONE')

    // Required fields parameter for TikTok User Info API
    const fields = 'open_id,union_id,avatar_url,display_name,username,follower_count,following_count,likes_count,video_count,is_verified'
    const userInfoUrl = `https://open.tiktokapis.com/v2/user/info/?fields=${encodeURIComponent(fields)}`

    console.log('🌐 User info URL:', userInfoUrl)

    const userInfoResponse = await fetch(userInfoUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    console.log('📊 User info response status:', userInfoResponse.status)

    if (!userInfoResponse.ok) {
      const errorText = await userInfoResponse.text()
      console.error('❌ User info fetch failed:', errorText)
      console.error('❌ Response status:', userInfoResponse.status)
      console.error('❌ Response headers:', Object.fromEntries(userInfoResponse.headers.entries()))
      return res.status(400).json({
        error: 'Failed to fetch user information',
        details: errorText,
        status: userInfoResponse.status
      })
    }

    const userInfoData = await userInfoResponse.json()
    console.log('✅ User info response:', JSON.stringify(userInfoData, null, 2))

    if (userInfoData.error) {
      console.error('❌ TikTok user info error:', userInfoData.error)
      return res.status(400).json({ error: userInfoData.error.message || userInfoData.error })
    }

    if (!userInfoData.data || !userInfoData.data.user) {
      console.error('❌ Invalid user info response structure:', userInfoData)
      return res.status(400).json({ error: 'Invalid user info response structure' })
    }

    const tikTokUser = userInfoData.data.user
    console.log('✅ User info fetched successfully')
    console.log('User ID:', tikTokUser.open_id)
    console.log('Display Name:', tikTokUser.display_name)
    console.log('Username:', tikTokUser.username)
    console.log('Followers:', tikTokUser.follower_count || 0)

    // User stats are already included in the user info response
    const userStats = {
      follower_count: tikTokUser.follower_count || 0,
      following_count: tikTokUser.following_count || 0,
      likes_count: tikTokUser.likes_count || 0,
      video_count: tikTokUser.video_count || 0
    }

    // Step 4: Save to Supabase
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

    console.log('🔧 Supabase Configuration:')
    console.log('URL exists:', !!supabaseUrl)
    console.log('Key exists:', !!supabaseKey)
    console.log('URL:', supabaseUrl)

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration')
      return res.status(500).json({ error: 'Database configuration error' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('💾 Saving to database...')

    const tiktokMetrics = {
      followers: userStats.follower_count || 0,
      following: userStats.following_count || 0,
      likes: userStats.likes_count || 0,
      videos: userStats.video_count || 0,
      verified: tikTokUser.is_verified || false,
      last_updated: new Date().toISOString()
    }

    const { data: updatedProfile, error: dbError } = await supabase
      .from('profiles')
      .update({
        tiktok_username: tikTokUser.username || tikTokUser.unique_id,
        tiktok_user_id: tikTokUser.open_id,
        tiktok_handle: `@${tikTokUser.username || tikTokUser.unique_id}`,
        tiktok_metrics: tiktokMetrics,
        total_followers: userStats.follower_count || 0,
        verified: tikTokUser.is_verified || false,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (dbError) {
      console.error('❌ Database update failed:', dbError)
      console.error('❌ User ID:', userId)
      console.error('❌ TikTok Data:', {
        username: tikTokUser.username || tikTokUser.unique_id,
        user_id: tikTokUser.open_id,
        metrics: tiktokMetrics
      })
      return res.status(500).json({ error: 'Failed to save user data', details: dbError.message })
    }

    console.log('✅ Successfully saved TikTok data to database')
    console.log('✅ Updated profile:', updatedProfile)

    // Return success response with comprehensive data
    return res.status(200).json({
      success: true,
      message: 'TikTok account connected successfully',
      user_info: {
        open_id: tikTokUser.open_id,
        union_id: tikTokUser.union_id,
        username: tikTokUser.username || tikTokUser.unique_id,
        display_name: tikTokUser.display_name,
        avatar_url: tikTokUser.avatar_url,
        is_verified: tikTokUser.is_verified || false,
        follower_count: userStats.follower_count,
        following_count: userStats.following_count,
        likes_count: userStats.likes_count,
        video_count: userStats.video_count
      },
      profile: updatedProfile
    })

  } catch (error) {
    console.error('💥 API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}