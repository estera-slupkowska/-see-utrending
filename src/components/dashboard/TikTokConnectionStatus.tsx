import { useState, useEffect } from 'react'
import { useAuth } from '../../lib/auth/context'
import { supabase } from '../../lib/supabase/client'
import { TikTokService } from '../../lib/supabase/tiktok'
import { Button } from '../ui'
import { CheckCircle, XCircle, Loader, ExternalLink } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

interface TikTokAccount {
  username: string
  display_name: string
  avatar_url: string
  follower_count: number
  is_verified: boolean
  is_active: boolean
  last_sync: string
}

interface UserProfile {
  tiktok_username?: string
  tiktok_user_id?: string
  tiktok_handle?: string
  tiktok_metrics?: {
    followers: number
    following: number
    likes: number
    videos: number
    verified: boolean
    last_updated: string
  }
  verified?: boolean
}

export function TikTokConnectionStatus() {
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [tikTokAccount, setTikTokAccount] = useState<TikTokAccount | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // Fetch real TikTok connection status from database
  useEffect(() => {
    const checkConnection = async () => {
      if (!user?.id) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      try {
        console.log('🔍 Checking TikTok connection for user:', user.id)

        // Fetch user profile from database
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('tiktok_username, tiktok_user_id, tiktok_handle, tiktok_metrics, verified')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('❌ Error fetching profile:', error)
          setTikTokAccount(null)
        } else if (profile && profile.tiktok_user_id) {
          console.log('✅ Found TikTok connection in database:', profile)

          // Convert database profile to TikTokAccount format
          const metrics = profile.tiktok_metrics || {}
          setTikTokAccount({
            username: profile.tiktok_handle || profile.tiktok_username || '@unknown',
            display_name: profile.tiktok_username || 'Unknown User',
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.tiktok_user_id}`,
            follower_count: metrics.followers || 0,
            is_verified: profile.verified || metrics.verified || false,
            is_active: true, // Assume active if data exists
            last_sync: metrics.last_updated || new Date().toISOString()
          })
        } else {
          console.log('ℹ️ No TikTok connection found in database')
          setTikTokAccount(null)
        }
      } catch (error) {
        console.error('💥 Error checking TikTok connection:', error)
        setTikTokAccount(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkConnection()
  }, [user])

  // Handle refresh from OAuth redirect
  useEffect(() => {
    const shouldRefresh = searchParams.get('refresh')
    const success = searchParams.get('success')

    if (shouldRefresh === '1' || success === 'tiktok_connected') {
      console.log('🔄 Auto-refreshing TikTok connection status due to OAuth success')
      // Add a small delay to ensure database is updated
      setTimeout(() => {
        refreshConnection()
      }, 1000)
    }
  }, [searchParams])

  const handleConnect = () => {
    setIsConnecting(true)

    if (!user?.id) {
      console.error('❌ User not authenticated')
      alert('You must be logged in to connect TikTok')
      setIsConnecting(false)
      return
    }

    try {
      // Store user ID for recovery after OAuth redirect
      sessionStorage.setItem('tiktok_oauth_user_id', user.id)
      localStorage.setItem('tiktok_oauth_user_id_backup', user.id)

      // Use centralized OAuth URL generation to ensure consistency
      const authUrl = TikTokService.getTikTokAuthUrl()

      console.log('🚀 TikTok Auth URL (centralized):', authUrl)
      console.log('👤 User ID stored:', user.id)
      console.log('🌟 Using unified OAuth flow with consistent scopes')

      window.location.href = authUrl
    } catch (error) {
      console.error('❌ Failed to generate TikTok auth URL:', error)
      alert('Failed to initialize TikTok connection. Please check configuration.')
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    if (!user?.id) return

    try {
      console.log('🔄 Disconnecting TikTok account...')

      // Clear TikTok data from database
      const { error } = await supabase
        .from('profiles')
        .update({
          tiktok_username: null,
          tiktok_user_id: null,
          tiktok_handle: null,
          tiktok_metrics: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        console.error('❌ Error disconnecting TikTok:', error)
        alert('Failed to disconnect TikTok account')
      } else {
        console.log('✅ TikTok account disconnected successfully')
        setTikTokAccount(null)
      }
    } catch (error) {
      console.error('💥 Error disconnecting TikTok:', error)
      alert('Failed to disconnect TikTok account')
    }
  }

  // Function to refresh connection status
  const refreshConnection = async () => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      console.log('🔄 Refreshing TikTok connection status...')

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('tiktok_username, tiktok_user_id, tiktok_handle, tiktok_metrics, verified')
        .eq('id', user.id)
        .single()

      if (error) {
        console.error('❌ Error fetching profile:', error)
        setTikTokAccount(null)
      } else if (profile && profile.tiktok_user_id) {
        const metrics = profile.tiktok_metrics || {}
        setTikTokAccount({
          username: profile.tiktok_handle || profile.tiktok_username || '@unknown',
          display_name: profile.tiktok_username || 'Unknown User',
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.tiktok_user_id}`,
          follower_count: metrics.followers || 0,
          is_verified: profile.verified || metrics.verified || false,
          is_active: true,
          last_sync: metrics.last_updated || new Date().toISOString()
        })
      } else {
        setTikTokAccount(null)
      }
    } catch (error) {
      console.error('💥 Error refreshing TikTok connection:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="card-clean">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
          <h3 className="text-xl font-display font-semibold text-text-primary">TikTok Integration</h3>
          <Loader className="w-4 h-4 animate-spin text-primary" />
        </div>
        <p className="text-text-secondary">Checking connection status...</p>
      </div>
    )
  }

  if (tikTokAccount) {
    return (
      <div className="card-clean">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-6 h-6 text-success-green" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
          </svg>
          <h3 className="text-xl font-display font-semibold text-text-primary">TikTok Connected</h3>
          <CheckCircle className="w-5 h-5 text-success-green" />
        </div>

        <div className="flex items-center gap-4 mb-4">
          <img
            src={tikTokAccount.avatar_url}
            alt="TikTok Avatar"
            className="w-12 h-12 rounded-full border-2 border-primary/20"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-text-primary">{tikTokAccount.display_name}</h4>
              {tikTokAccount.is_verified && (
                <CheckCircle className="w-4 h-4 text-success-green" />
              )}
            </div>
            <p className="text-text-secondary text-sm">{tikTokAccount.username}</p>
            <p className="text-text-muted text-xs">
              {tikTokAccount.follower_count.toLocaleString('pl-PL')} obserwujących
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <div className={`w-2 h-2 rounded-full ${tikTokAccount.is_active ? 'bg-success-green' : 'bg-error-red'}`} />
            {tikTokAccount.is_active ? 'Połączenie aktywne' : 'Połączenie nieaktywne'}
          </div>
          <p className="text-xs text-text-muted">
            Ostatnia synchronizacja: {new Date(tikTokAccount.last_sync).toLocaleString('pl-PL')}
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={handleDisconnect}>
            Rozłącz
          </Button>
          <Button variant="outline" size="sm" onClick={refreshConnection}>
            <Loader className="w-4 h-4 mr-2" />
            Odśwież
          </Button>
          <Button variant="primary" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            Zobacz profil TikTok
          </Button>
        </div>

        <div className="mt-4 p-3 bg-success-green/5 border border-success-green/20 rounded-lg">
          <p className="text-sm text-success-green font-medium">
            ✅ Możesz teraz brać udział w konkursach
          </p>
          <p className="text-xs text-text-muted mt-1">
            Twoje konto TikTok jest połączone i zweryfikowane. Możesz teraz przesyłać linki do swoich filmów w aktywnych konkursach.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card-clean">
      <div className="flex items-center gap-3 mb-4">
        <svg className="w-6 h-6 text-text-muted" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
        <h3 className="text-xl font-display font-semibold text-text-primary">TikTok Integration</h3>
        <XCircle className="w-5 h-5 text-text-muted" />
      </div>

      <p className="text-text-secondary mb-4">
        Połącz swoje konto TikTok, aby brać udział w konkursach i śledzić swoje postępy w czasie rzeczywistym.
      </p>

      <div className="flex gap-3 mb-4">
        <Button
          variant="primary"
          onClick={handleConnect}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Łączenie...
            </>
          ) : (
            'Połącz TikTok'
          )}
        </Button>
      </div>

      <div className="p-3 bg-warning-amber/5 border border-warning-amber/20 rounded-lg">
        <p className="text-sm text-warning-amber font-medium">
          ⚠️ Wymagane połączenie TikTok
        </p>
        <p className="text-xs text-text-muted mt-1">
          Aby brać udział w konkursach, musisz połączyć swoje konto TikTok. To pozwala nam automatycznie śledzić metryki Twoich filmów.
        </p>
      </div>
    </div>
  )
}