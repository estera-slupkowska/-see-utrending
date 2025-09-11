import { supabase } from '../../lib/supabase/client'

interface TikTokTokenResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
  scope: string
  open_id: string
  refresh_expires_in: number
}

interface TikTokAuthState {
  isConnected: boolean
  isLoading: boolean
  error: string | null
  user: {
    openId: string
    displayName: string
    username: string
    avatarUrl: string
    followerCount: number
    isVerified: boolean
  } | null
}

class TikTokAuthService {
  private clientKey = import.meta.env.VITE_TIKTOK_CLIENT_KEY
  private clientSecret = import.meta.env.VITE_TIKTOK_CLIENT_SECRET
  private redirectUri = import.meta.env.VITE_TIKTOK_REDIRECT_URI

  generateAuthUrl(state: string): string {
    const params = new URLSearchParams({
      client_key: this.clientKey,
      scope: 'user.info.basic,video.list',
      response_type: 'code',
      redirect_uri: this.redirectUri,
      state: state,
    })

    return `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`
  }

  generateCSRFToken(): string {
    return crypto.randomUUID()
  }

  async exchangeCodeForTokens(
    code: string,
    state: string
  ): Promise<TikTokTokenResponse> {
    const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
      },
      body: new URLSearchParams({
        client_key: this.clientKey,
        client_secret: this.clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: this.redirectUri,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`Token exchange failed: ${response.status} ${errorData}`)
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(`TikTok OAuth error: ${data.error_description}`)
    }

    return data
  }

  async refreshAccessToken(refreshToken: string): Promise<TikTokTokenResponse> {
    const response = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: this.clientKey,
        client_secret: this.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    })

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(`TikTok token refresh error: ${data.error_description}`)
    }

    return data
  }

  async revokeToken(accessToken: string): Promise<void> {
    const response = await fetch('https://open.tiktokapis.com/v2/oauth/revoke/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_key: this.clientKey,
        client_secret: this.clientSecret,
        token: accessToken,
      }),
    })

    if (!response.ok) {
      throw new Error(`Token revocation failed: ${response.status}`)
    }
  }

  private async encryptToken(token: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(token)
    
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(this.clientSecret.substring(0, 32)),
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    )

    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    )

    const encryptedArray = new Uint8Array(iv.length + encrypted.byteLength)
    encryptedArray.set(iv)
    encryptedArray.set(new Uint8Array(encrypted), iv.length)

    return btoa(String.fromCharCode(...encryptedArray))
  }

  private async decryptToken(encryptedToken: string): Promise<string> {
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()
    
    const encryptedArray = Uint8Array.from(
      atob(encryptedToken),
      c => c.charCodeAt(0)
    )

    const iv = encryptedArray.slice(0, 12)
    const encrypted = encryptedArray.slice(12)

    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(this.clientSecret.substring(0, 32)),
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    )

    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encrypted
    )

    return decoder.decode(decrypted)
  }

  async saveTikTokAccount(
    userId: string,
    tokenData: TikTokTokenResponse,
    userInfo: any
  ): Promise<void> {
    const accessTokenEncrypted = await this.encryptToken(tokenData.access_token)
    const refreshTokenEncrypted = await this.encryptToken(tokenData.refresh_token)

    const { error } = await supabase
      .from('tiktok_accounts')
      .upsert({
        user_id: userId,
        tiktok_user_id: tokenData.open_id,
        access_token_encrypted: accessTokenEncrypted,
        refresh_token_encrypted: refreshTokenEncrypted,
        token_expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
        username: userInfo.display_name,
        display_name: userInfo.display_name,
        avatar_url: userInfo.avatar_url,
        follower_count: userInfo.follower_count || 0,
        following_count: userInfo.following_count || 0,
        likes_count: userInfo.likes_count || 0,
        video_count: userInfo.video_count || 0,
        is_verified: userInfo.is_verified || false,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      throw new Error(`Failed to save TikTok account: ${error.message}`)
    }

    await supabase
      .from('profiles')
      .update({
        tiktok_handle: userInfo.display_name,
        tiktok_user_id: tokenData.open_id,
        total_followers: userInfo.follower_count || 0,
        verified: userInfo.is_verified || false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
  }

  async getTikTokAccount(userId: string) {
    const { data, error } = await supabase
      .from('tiktok_accounts')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      return null
    }

    return {
      ...data,
      access_token: await this.decryptToken(data.access_token_encrypted),
      refresh_token: await this.decryptToken(data.refresh_token_encrypted),
    }
  }

  async disconnectTikTok(userId: string): Promise<void> {
    const account = await this.getTikTokAccount(userId)
    
    if (account) {
      try {
        await this.revokeToken(account.access_token)
      } catch (error) {
        console.warn('Failed to revoke TikTok token:', error)
      }

      await supabase
        .from('tiktok_accounts')
        .delete()
        .eq('user_id', userId)

      await supabase
        .from('profiles')
        .update({
          tiktok_handle: null,
          tiktok_user_id: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
    }
  }

  async isTokenExpired(expiresAt: string): Promise<boolean> {
    return new Date(expiresAt) <= new Date()
  }

  async refreshTokenIfNeeded(userId: string): Promise<string | null> {
    const account = await this.getTikTokAccount(userId)
    
    if (!account) {
      return null
    }

    if (await this.isTokenExpired(account.token_expires_at)) {
      try {
        const tokenData = await this.refreshAccessToken(account.refresh_token)
        
        const accessTokenEncrypted = await this.encryptToken(tokenData.access_token)
        const refreshTokenEncrypted = await this.encryptToken(tokenData.refresh_token)

        await supabase
          .from('tiktok_accounts')
          .update({
            access_token_encrypted: accessTokenEncrypted,
            refresh_token_encrypted: refreshTokenEncrypted,
            token_expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)

        return tokenData.access_token
      } catch (error) {
        console.error('Failed to refresh token:', error)
        return null
      }
    }

    return account.access_token
  }
}

export const tikTokAuth = new TikTokAuthService()
export type { TikTokTokenResponse, TikTokAuthState }