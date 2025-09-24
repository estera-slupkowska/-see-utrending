import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { code, userId } = req.body

    if (!code || !userId) {
      return res.status(400).json({ error: 'Missing code or userId' })
    }

    // TikTok OAuth configuration
    const clientKey = process.env.VITE_TIKTOK_CLIENT_KEY
    const clientSecret = process.env.VITE_TIKTOK_CLIENT_SECRET
    const redirectUri = process.env.VITE_TIKTOK_REDIRECT_URI

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
      return res.status(400).json({ error: 'Failed to exchange code for token' })
    }

    const tokenData = await tokenResponse.json()
    console.log('✅ Token exchange successful')

    if (tokenData.error) {
      console.error('❌ TikTok token error:', tokenData.error_description)
      return res.status(400).json({ error: tokenData.error_description })
    }

    const accessToken = tokenData.access_token

    // Step 2: Get user information from TikTok
    console.log('👤 Fetching user info...')

    const userInfoResponse = await fetch('https://open.tiktokapis.com/v2/user/info/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!userInfoResponse.ok) {
      const errorText = await userInfoResponse.text()
      console.error('❌ User info fetch failed:', errorText)
      return res.status(400).json({ error: 'Failed to fetch user information' })
    }

    const userInfoData = await userInfoResponse.json()

    if (userInfoData.error) {
      console.error('❌ TikTok user info error:', userInfoData.error)
      return res.status(400).json({ error: userInfoData.error.message })
    }

    const tikTokUser = userInfoData.data.user
    console.log('✅ User info fetched:', tikTokUser.display_name)

    // Step 3: Get user stats (if available in scope)
    let userStats = {}
    try {
      console.log('📊 Fetching user stats...')

      const statsResponse = await fetch('https://open.tiktokapis.com/v2/user/info/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      })

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        if (statsData.data && statsData.data.user) {
          userStats = {
            follower_count: statsData.data.user.follower_count || 0,
            following_count: statsData.data.user.following_count || 0,
            likes_count: statsData.data.user.likes_count || 0,
            video_count: statsData.data.user.video_count || 0
          }
        }
      }
    } catch (statsError) {
      console.log('⚠️ Stats fetch failed (may not be in scope):', statsError.message)
    }

    // Step 4: Save to Supabase
    const supabaseUrl = process.env.VITE_SUPABASE_URL
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

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
      return res.status(500).json({ error: 'Failed to save user data' })
    }

    console.log('✅ Successfully saved TikTok data to database')

    // Return success response
    return res.status(200).json({
      success: true,
      user_info: {
        open_id: tikTokUser.open_id,
        username: tikTokUser.username || tikTokUser.unique_id,
        display_name: tikTokUser.display_name,
        avatar_url: tikTokUser.avatar_url,
        is_verified: tikTokUser.is_verified,
        ...userStats
      },
      profile: updatedProfile
    })

  } catch (error) {
    console.error('💥 API Error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}