import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/auth/context'
import { TikTokService } from '../lib/supabase/tiktok'

export function OAuthRedirect() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, loading: authLoading } = useAuth()
  const [retryCount, setRetryCount] = useState(0)
  const [status, setStatus] = useState('Sprawdzanie autoryzacji...')

  useEffect(() => {
    const handleTikTokCallback = async () => {
      const code = searchParams.get('code')
      const state = searchParams.get('state')
      const error = searchParams.get('error')

      console.log('🔄 OAuth callback started:', { code: !!code, state: !!state, error, user: !!user, authLoading })

      if (error) {
        console.error('TikTok OAuth error:', error)
        setStatus('Błąd autoryzacji TikTok')
        navigate('/dashboard?error=tiktok_auth_failed')
        return
      }

      if (!code || !state) {
        console.error('Missing code or state parameter')
        setStatus('Brakujące parametry autoryzacji')
        navigate('/dashboard?error=invalid_callback')
        return
      }

      // Wait for auth to finish loading
      if (authLoading) {
        console.log('⏳ Waiting for auth to finish loading...')
        setStatus('Ładowanie sesji użytkownika...')
        return
      }

      // If no user after auth finished loading, try to recover from storage
      if (!user) {
        console.log('⚠️ No user found, attempting recovery...')

        // Try to get stored user ID (consistent with new storage approach)
        const storedUserId = sessionStorage.getItem('tiktok_oauth_user_id') || localStorage.getItem('tiktok_oauth_user_id_backup')

        if (storedUserId) {
          console.log('✅ Recovered user ID from storage:', storedUserId)

          // Proceed with the stored user ID (no need to verify state here as it's verified in TikTokService)
          try {
            setStatus('Przetwarzanie danych TikTok...')
            console.log('🔄 Processing TikTok OAuth callback with recovered user ID:', storedUserId)

            const result = await TikTokService.handleTikTokCallback(code, state, storedUserId)
            console.log('📊 TikTok callback result:', result)

            // Clear stored data
            sessionStorage.removeItem('tiktok_oauth_user_id')
            localStorage.removeItem('tiktok_oauth_user_id_backup')

            if (result.success) {
              console.log('✅ TikTok connected successfully, redirecting to dashboard')
              await new Promise(resolve => setTimeout(resolve, 500))
              navigate('/dashboard?success=tiktok_connected&refresh=1')
            } else {
              console.error('❌ TikTok connection failed:', result.error)
              navigate(`/dashboard?error=tiktok_connection_failed&details=${encodeURIComponent(result.error || 'Unknown error')}`)
            }
          } catch (error) {
            console.error('💥 TikTok callback error:', error)
            navigate(`/dashboard?error=tiktok_callback_error&details=${encodeURIComponent(error.message || 'Unknown error')}`)
          }
          return
        }

        // Retry mechanism
        if (retryCount < 3) {
          console.log(`🔄 Retrying auth check (${retryCount + 1}/3)...`)
          setStatus(`Ponowne sprawdzanie autoryzacji (${retryCount + 1}/3)...`)
          setRetryCount(prev => prev + 1)
          setTimeout(() => {
            // This will trigger the useEffect again
          }, 1000)
          return
        } else {
          console.error('❌ User not authenticated after retries')
          setStatus('Sesja użytkownika wygasła')
          navigate('/auth/login?error=session_expired&message=Zaloguj się ponownie aby połączyć TikTok')
          return
        }
      }

      try {
        console.log('🔄 Processing TikTok OAuth callback with data:', { code: code?.substring(0, 10), state: state?.substring(0, 10), userId: user.id })

        const result = await TikTokService.handleTikTokCallback(code, state, user.id)

        console.log('📊 TikTok callback result:', result)

        if (result.success) {
          console.log('✅ TikTok connected successfully, redirecting to dashboard')
          // Add a small delay to ensure the database is updated
          await new Promise(resolve => setTimeout(resolve, 500))
          navigate('/dashboard?success=tiktok_connected&refresh=1')
        } else {
          console.error('❌ TikTok connection failed:', result.error)
          navigate(`/dashboard?error=tiktok_connection_failed&details=${encodeURIComponent(result.error || 'Unknown error')}`)
        }
      } catch (error) {
        console.error('💥 TikTok callback error:', error)
        navigate(`/dashboard?error=tiktok_callback_error&details=${encodeURIComponent(error.message || 'Unknown error')}`)
      }
    }

    handleTikTokCallback()
  }, [searchParams, navigate, user, authLoading, retryCount])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Łączenie z TikTok...
        </h2>
        <p className="text-text-secondary">
          {status}
        </p>
      </div>
    </div>
  )
}