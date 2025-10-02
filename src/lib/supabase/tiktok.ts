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

    console.log('🏗️ Adding explicit scope to fix TikTok error:', {
      reason: 'TikTok portal requires explicit scope parameter',
      scope: 'user.info.basic',
      clientKeyPreview: clientKey ? `${clientKey.substring(0, 4)}...${clientKey.substring(clientKey.length - 4)}` : 'NOT SET'
    })

    // Build URL with explicit scope parameter - TikTok requires it
    const baseUrl = 'https://www.tiktok.com/v2/auth/authorize/'
    const paramString = [
      `client_key=${clientKey}`,
      `response_type=code`,
      `scope=user.info.basic`,
      `redirect_uri=${encodeURIComponent(redirectUri)}`,
      `state=${state}`
    ].join('&')

    console.log('📋 OAuth Parameters:', {
      client_key: clientKey ? `${clientKey.substring(0, 4)}...${clientKey.substring(clientKey.length - 4)}` : 'NOT SET',
      scope: 'user.info.basic',
      response_type: 'code',
      redirect_uri: redirectUri,
      state: state,
      mode: 'Explicit scope parameter'
    })

    const authUrl = `${baseUrl}?${paramString}`
    console.log('🎯 Final Auth URL (manual build):', authUrl)
    console.log('🔍 URL Check:', {
      hasScopeParam: authUrl.includes('scope=user.info.basic'),
      scopeValue: 'user.info.basic',
      urlLength: authUrl.length
    })

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

      // Enhanced state verification with detailed logging
      const storedState = sessionStorage.getItem('tiktok_oauth_state')
      console.log('🔐 State Verification Details:', {
        receivedState: state ? `${state.substring(0, 10)}...${state.substring(state.length - 4)}` : 'NULL',
        storedState: storedState ? `${storedState.substring(0, 10)}...${storedState.substring(storedState.length - 4)}` : 'NULL',
        statesMatch: storedState === state,
        sessionStorageKeys: Object.keys(sessionStorage),
        localStorageKeys: Object.keys(localStorage)
      })

      if (!storedState) {
        console.error('❌ No stored state found - OAuth session may have expired or been cleared')
        return { success: false, error: 'OAuth session expired - please try connecting again' }
      }

      if (storedState !== state) {
        console.error('❌ State mismatch - possible CSRF attack or multiple OAuth attempts:', {
          stored: storedState,
          received: state,
          suggestion: 'Try clearing browser data and connecting again'
        })
        // Clear potentially corrupted state
        sessionStorage.removeItem('tiktok_oauth_state')
        return { success: false, error: 'Security validation failed - please clear browser data and try again' }
      }

      console.log('✅ State verification passed successfully')
      console.log('🔄 Proceeding to token exchange...')

      // Use full URL for production environment
      const apiUrl = import.meta.env.PROD
        ? `${window.location.origin}/api/tiktok/token`
        : '/api/tiktok/token'

      console.log('🌐 API URL:', apiUrl)

      // Exchange code for access token using our API endpoint
      // Pass the EXACT same client key and redirect URI used for authorization
      const frontendClientKey = import.meta.env.VITE_TIKTOK_CLIENT_KEY
      const frontendRedirectUri = import.meta.env.VITE_TIKTOK_REDIRECT_URI

      console.log('🔑 Sending EXACT frontend config to backend:')
      console.log('Client Key:', frontendClientKey ? `${frontendClientKey.substring(0, 4)}...${frontendClientKey.substring(frontendClientKey.length - 4)}` : 'NOT SET')
      console.log('Redirect URI:', frontendRedirectUri)

      const tokenResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          userId,
          clientKey: frontendClientKey, // EXACT same client key used for authorization
          redirectUri: frontendRedirectUri // EXACT same redirect URI used for authorization
        })
      })

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json()
        console.error('❌ Token exchange failed:', errorData)
        // Extract meaningful error message from various possible error structures
        const errorMessage = errorData.error?.message
          || errorData.error_description
          || errorData.details
          || errorData.error
          || 'Failed to exchange code for token'
        return { success: false, error: errorMessage }
      }

      const responseData = await tokenResponse.json()
      console.log('✅ TikTok OAuth completed successfully')

      // Only clear state AFTER successful completion
      sessionStorage.removeItem('tiktok_oauth_state')
      console.log('🧹 Cleared OAuth state after success')

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