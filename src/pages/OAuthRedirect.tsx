import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../lib/auth/context'
import { TikTokService } from '../lib/supabase/tiktok'

export function OAuthRedirect() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()

  useEffect(() => {
    const handleTikTokCallback = async () => {
      const code = searchParams.get('code')
      const state = searchParams.get('state')
      const error = searchParams.get('error')

      if (error) {
        console.error('TikTok OAuth error:', error)
        navigate('/dashboard?error=tiktok_auth_failed')
        return
      }

      if (!code || !state) {
        console.error('Missing code or state parameter')
        navigate('/dashboard?error=invalid_callback')
        return
      }

      if (!user) {
        console.error('User not authenticated')
        navigate('/auth?error=not_authenticated')
        return
      }

      try {
        const result = await TikTokService.handleTikTokCallback(code, state, user.id)

        if (result.success) {
          navigate('/dashboard?success=tiktok_connected')
        } else {
          navigate('/dashboard?error=tiktok_connection_failed')
        }
      } catch (error) {
        console.error('TikTok callback error:', error)
        navigate('/dashboard?error=tiktok_callback_error')
      }
    }

    handleTikTokCallback()
  }, [searchParams, navigate, user])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-text-primary mb-2">
          Łączenie z TikTok...
        </h2>
        <p className="text-text-secondary">
          Przetwarzamy Twoje dane z TikTok
        </p>
      </div>
    </div>
  )
}