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

    // TikTok OAuth configuration - Use frontend values first, then server env vars
    const clientKey = frontendClientKey || process.env.TIKTOK_CLIENT_KEY || 'sbawnbpy8ri5x8kz7d'
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET || 'itx3DHTZz7xjDpMy3IPfD7mNHdtWnGgv'
    const redirectUri = frontendRedirectUri || process.env.TIKTOK_REDIRECT_URI || 'https://seeutrending.vercel.app/oauth/redirect'

    console.log('🔧 TikTok OAuth Configuration:')
    console.log('Frontend Client Key used:', !!frontendClientKey)
    console.log('Final Client Key exists:', !!clientKey)
    console.log('Client Secret exists:', !!clientSecret)
    console.log('Frontend Redirect URI used:', !!frontendRedirectUri)
    console.log('Final Redirect URI:', redirectUri)
    console.log('Client Key matches frontend:', clientKey === frontendClientKey)

    if (!clientKey || !clientSecret || !redirectUri) {
      console.error('Missing TikTok OAuth configuration')
      return res.status(500).json({ error: 'Server configuration error' })
    }

    console.log('🔄 Exchanging code for access token...')

    // Step 1: Exchange authorization code for access token
    const tokenResponse = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache'
      },
      body: new URLSearchParams({
        client_key: clientKey,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri
      })
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('❌ Token exchange failed:', errorText)
      console.error('❌ Request details:', {
        client_key: clientKey,
        client_secret_exists: !!clientSecret,
        redirect_uri: redirectUri,
        code_length: code?.length
      })

      // Parse JSON error if possible
      try {
        const errorJson = JSON.parse(errorText)
        console.error('❌ Parsed error:', errorJson)
        return res.status(400).json({ error: errorJson.error_description || errorJson.error || 'Token exchange failed' })
      } catch {
        return res.status(400).json({ error: 'Client key or secret is incorrect.' })
      }
    }

    const tokenData = await tokenResponse.json()
    console.log('✅ Token exchange successful')

    if (tokenData.error) {
      console.error('❌ TikTok token error:', tokenData.error_description)
      return res.status(400).json({ error: tokenData.error_description })
    }

    const accessToken = tokenData.access_token

    if (!accessToken) {
      console.error('❌ No access token in response')
      return res.status(400).json({ error: 'No access token received' })
    }

    // Step 2: Get user information from TikTok with required fields parameter
    console.log('👤 Fetching user info...')

    // Only request fields available with user.info.basic scope
    const fields = 'open_id,union_id,avatar_url,display_name'
    const userInfoResponse = await fetch(`https://open.tiktokapis.com/v2/user/info/?fields=${encodeURIComponent(fields)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!userInfoResponse.ok) {
      const errorText = await userInfoResponse.text()
      console.error('❌ User info fetch failed:', errorText)
      return res.status(400).json({ error: 'Failed to fetch user information', details: errorText })
    }

    const userInfoData = await userInfoResponse.json()

    if (userInfoData.error) {
      console.error('❌ TikTok user info error:', userInfoData.error)
      return res.status(400).json({ error: userInfoData.error.message || userInfoData.error })
    }

    if (!userInfoData.data || !userInfoData.data.user) {
      console.error('❌ Invalid user info response structure:', userInfoData)
      return res.status(400).json({ error: 'Invalid user info response structure' })
    }

    const tikTokUser = userInfoData.data.user
    console.log('✅ User info fetched:', tikTokUser.display_name)

    // Step 3: Save to Supabase
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration')
      return res.status(500).json({ error: 'Database configuration error' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log('💾 Saving to database...')

    // Basic metrics with defaults (since we only have basic scope)
    const tiktokMetrics = {
      followers: 0, // Not available with user.info.basic
      following: 0, // Not available with user.info.basic
      likes: 0, // Not available with user.info.basic
      videos: 0, // Not available with user.info.basic
      verified: false, // Not available with user.info.basic
      last_updated: new Date().toISOString()
    }

    const { data: updatedProfile, error: dbError } = await supabase
      .from('profiles')
      .update({
        tiktok_username: tikTokUser.display_name, // Use display_name as username
        tiktok_user_id: tikTokUser.open_id,
        tiktok_handle: `@${tikTokUser.display_name}`,
        tiktok_metrics: tiktokMetrics,
        total_followers: 0, // Not available with basic scope
        verified: false, // Not available with basic scope
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (dbError) {
      console.error('❌ Database update failed:', dbError)
      return res.status(500).json({ error: 'Failed to save user data', details: dbError.message })
    }

    console.log('✅ Successfully saved TikTok data to database')

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'TikTok account connected successfully',
      user_info: {
        open_id: tikTokUser.open_id,
        union_id: tikTokUser.union_id,
        display_name: tikTokUser.display_name,
        avatar_url: tikTokUser.avatar_url,
        username: tikTokUser.display_name // Use display_name as username
      },
      profile: updatedProfile
    })

  } catch (error) {
    console.error('💥 API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}