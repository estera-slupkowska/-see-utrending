import { supabase } from './client'
import type { UserProfile } from '../../types/profiles'

export interface TikTokUserInfo {
  open_id: string
  union_id: string
  avatar_url: string
  display_name: string
  username: string
  follower_count: number
  following_count: number
  likes_count: number
  video_count: number
  is_verified: boolean
}

export interface TikTokMetrics {
  followers: number
  following: number
  likes: number
  videos: number
  verified: boolean
  last_updated: string
}

export class TikTokService {
  /**
   * Save TikTok user data to profile
   */
  static async connectTikTokAccount(
    userId: string,
    tiktokData: TikTokUserInfo
  ): Promise<{ data: UserProfile | null, error: any }> {
    try {
      const metrics: TikTokMetrics = {
        followers: tiktokData.follower_count,
        following: tiktokData.following_count,
        likes: tiktokData.likes_count,
        videos: tiktokData.video_count,
        verified: tiktokData.is_verified,
        last_updated: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          tiktok_username: tiktokData.username,
          tiktok_user_id: tiktokData.open_id,
          tiktok_handle: `@${tiktokData.username}`,
          tiktok_metrics: metrics,
          total_followers: tiktokData.follower_count,
          verified: tiktokData.is_verified,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Error connecting TikTok account:', error)
      return { data: null, error }
    }
  }

  /**
   * Update TikTok metrics for a user
   */
  static async updateTikTokMetrics(
    userId: string,
    metrics: Partial<TikTokMetrics>
  ): Promise<{ data: UserProfile | null, error: any }> {
    try {
      // Get current metrics
      const { data: profile } = await supabase
        .from('profiles')
        .select('tiktok_metrics')
        .eq('id', userId)
        .single()

      const currentMetrics = profile?.tiktok_metrics || {}
      const updatedMetrics = {
        ...currentMetrics,
        ...metrics,
        last_updated: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          tiktok_metrics: updatedMetrics,
          total_followers: metrics.followers || currentMetrics.followers || 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Error updating TikTok metrics:', error)
      return { data: null, error }
    }
  }

  /**
   * Get TikTok OAuth URL
   */
  static getTikTokAuthUrl(): string {
    const clientKey = import.meta.env.VITE_TIKTOK_CLIENT_KEY
    const redirectUri = import.meta.env.VITE_TIKTOK_REDIRECT_URI

    console.log('🔧 TikTok OAuth Configuration (Frontend):')
    console.log('Client Key (masked):', clientKey ? `${clientKey.substring(0, 4)}...${clientKey.substring(clientKey.length - 4)}` : 'NOT SET')
    console.log('Redirect URI:', redirectUri)
    console.log('🧪 Environment Mode:', import.meta.env.MODE)
    console.log('🏗️ Production Build:', import.meta.env.PROD)

    if (!clientKey) {
      throw new Error('VITE_TIKTOK_CLIENT_KEY is not configured')
    }

    if (!redirectUri) {
      throw new Error('VITE_TIKTOK_REDIRECT_URI is not configured')
    }

    const state = `tiktok_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    console.log('🔐 Generated OAuth state:', state)

    // Store state in sessionStorage for CSRF protection
    sessionStorage.setItem('tiktok_oauth_state', state)

    const params = new URLSearchParams({
      client_key: clientKey,
      scope: 'user.info.basic,user.info.profile,user.info.stats,video.list',
      response_type: 'code',
      redirect_uri: redirectUri,
      state: state
    })

    console.log('📋 OAuth Parameters:', {
      client_key: clientKey ? `${clientKey.substring(0, 4)}...${clientKey.substring(clientKey.length - 4)}` : 'NOT SET',
      scope: 'user.info.basic,user.info.profile,user.info.stats,video.list',
      response_type: 'code',
      redirect_uri: redirectUri,
      state: state
    })

    const authUrl = `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`
    console.log('🎯 Final Auth URL:', authUrl)

    return authUrl
  }

  /**
   * Handle TikTok OAuth callback
   */
  static async handleTikTokCallback(
    code: string,
    state: string,
    userId: string
  ): Promise<{ success: boolean, error?: string }> {
    try {
      console.log('🔄 Processing TikTok OAuth callback...')

      // Verify state parameter
      const storedState = sessionStorage.getItem('tiktok_oauth_state')
      if (!storedState || storedState !== state) {
        console.error('❌ State mismatch:', { stored: storedState, received: state })
        return { success: false, error: 'Invalid state parameter - possible CSRF attack' }
      }

      // Clear stored state
      sessionStorage.removeItem('tiktok_oauth_state')

      console.log('✅ State verified, exchanging code for token...')

      // Use full URL for production environment
      const apiUrl = import.meta.env.PROD
        ? `${window.location.origin}/api/tiktok/token`
        : '/api/tiktok/token'

      console.log('🌐 API URL:', apiUrl)

      // Exchange code for access token using our API endpoint
      // Pass client key AND redirect URI from frontend to ensure consistency
      const clientKey = import.meta.env.VITE_TIKTOK_CLIENT_KEY
      const redirectUri = import.meta.env.VITE_TIKTOK_REDIRECT_URI

      console.log('🔑 Sending frontend config to backend for consistency:')
      console.log('Client Key:', clientKey ? `${clientKey.substring(0, 4)}...${clientKey.substring(clientKey.length - 4)}` : 'NOT SET')
      console.log('Redirect URI:', redirectUri)

      const tokenResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          userId,
          clientKey: clientKey, // Pass the EXACT same client key used for authorization
          redirectUri: redirectUri // Pass the EXACT same redirect URI used for authorization
        })
      })

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json()
        console.error('❌ Token exchange failed:', errorData)
        return { success: false, error: errorData.error || 'Failed to exchange code for token' }
      }

      const responseData = await tokenResponse.json()
      console.log('✅ TikTok OAuth completed successfully')

      return { success: true, data: responseData }
    } catch (error) {
      console.error('💥 TikTok callback error:', error)
      return { success: false, error: 'Failed to process TikTok authentication' }
    }
  }

  /**
   * Disconnect TikTok account
   */
  static async disconnectTikTokAccount(userId: string): Promise<{ data: UserProfile | null, error: any }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          tiktok_username: null,
          tiktok_user_id: null,
          tiktok_handle: null,
          tiktok_metrics: {},
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      console.error('Error disconnecting TikTok account:', error)
      return { data: null, error }
    }
  }
}