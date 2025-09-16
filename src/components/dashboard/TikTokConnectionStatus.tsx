import { useState, useEffect } from 'react'
import { useAuth } from '../../lib/auth/context'
import { Button } from '../ui'
import { CheckCircle, XCircle, Loader, ExternalLink } from 'lucide-react'

interface TikTokAccount {
  username: string
  display_name: string
  avatar_url: string
  follower_count: number
  is_verified: boolean
  is_active: boolean
  last_sync: string
}

export function TikTokConnectionStatus() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [tikTokAccount, setTikTokAccount] = useState<TikTokAccount | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  // Sandbox mode: simulate TikTok connection status
  useEffect(() => {
    const checkConnection = async () => {
      setIsLoading(true)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Sandbox: Check if user has completed OAuth (simulate with localStorage)
      const hasCompletedOAuth = localStorage.getItem('tiktok_oauth_completed') === 'true'
      
      if (hasCompletedOAuth) {
        // Simulate connected account data
        setTikTokAccount({
          username: '@demo_creator',
          display_name: 'Demo Creator',
          avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tiktok',
          follower_count: 15420,
          is_verified: false,
          is_active: true,
          last_sync: new Date().toISOString()
        })
      } else {
        setTikTokAccount(null)
      }
      
      setIsLoading(false)
    }

    if (user) {
      checkConnection()
    }
  }, [user])

  const handleConnect = () => {
    setIsConnecting(true)
    
    const clientKey = import.meta.env.VITE_TIKTOK_CLIENT_KEY || 'sbawnbpy8ri5x8kz7d'
    const redirectUri = import.meta.env.VITE_TIKTOK_REDIRECT_URI || 'https://see-utrending-eta.vercel.app/oauth/redirect'
    
    if (clientKey && redirectUri) {
      // Generate CSRF state
      const state = crypto.randomUUID()
      sessionStorage.setItem('tiktok_oauth_state', state)
      
      const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=user.info.basic,user.info.profile,video.list&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`
      
      window.location.href = authUrl
    } else {
      console.error('Missing TikTok configuration')
      alert('TikTok integration is not configured')
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    // Sandbox: clear connection status
    localStorage.removeItem('tiktok_oauth_completed')
    setTikTokAccount(null)
  }

  const handleSandboxConnect = () => {
    // Sandbox: simulate successful connection
    localStorage.setItem('tiktok_oauth_completed', 'true')
    setTikTokAccount({
      username: '@demo_creator',
      display_name: 'Demo Creator',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tiktok',
      follower_count: 15420,
      is_verified: false,
      is_active: true,
      last_sync: new Date().toISOString()
    })
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
        <Button 
          variant="secondary" 
          onClick={handleSandboxConnect}
          className="text-xs"
        >
          🧪 Demo Connect
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