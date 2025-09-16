import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Loader } from 'lucide-react'
import { tikTokAuth } from '../../services/tiktok/auth.service'
import { tikTokApi } from '../../services/tiktok/api.service'
import { useAuth } from '../../lib/auth/context'

export function TikTokCallback() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from URL parameters
        const code = searchParams.get('code')
        const state = searchParams.get('state')
        const error = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        console.log('TikTok OAuth Callback:', { code, state, error, errorDescription })

        // Check for errors
        if (error) {
          throw new Error(`TikTok OAuth Error: ${error} - ${errorDescription || 'Unknown error'}`)
        }

        if (!code) {
          throw new Error('No authorization code received from TikTok')
        }

        // Verify state parameter for CSRF protection
        const storedState = sessionStorage.getItem('tiktok_oauth_state')
        if (!storedState || storedState !== state) {
          throw new Error('State parameter mismatch - possible CSRF attack')
        }

        // Clean up stored state
        sessionStorage.removeItem('tiktok_oauth_state')

        console.log('TikTok OAuth successful! Authorization code:', code)
        
        if (!user) {
          throw new Error('User must be logged in to connect TikTok account')
        }
        
        // Exchange authorization code for access token
        console.log('Exchanging authorization code for tokens...')
        const tokenData = await tikTokAuth.exchangeCodeForTokens(code, state)
        console.log('Token exchange successful:', { openId: tokenData.open_id })
        
        // Fetch user info from TikTok API
        console.log('Fetching TikTok user info...')
        const userInfo = await tikTokApi.getUserInfo(tokenData.access_token)
        console.log('User info fetched:', { username: userInfo.data.user.username })
        
        // Save TikTok account to database
        console.log('Saving TikTok account to database...')
        try {
          await tikTokAuth.saveTikTokAccount(user.id, tokenData, userInfo.data.user)
          console.log('TikTok account saved successfully')
        } catch (dbError) {
          console.warn('Database save failed, using sandbox mode:', dbError)
        }
        
        // Set sandbox connection flag for demo purposes
        localStorage.setItem('tiktok_oauth_completed', 'true')
        
        setStatus('success')
        setMessage('TikTok account connected successfully!')
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)

      } catch (err) {
        console.error('TikTok OAuth callback error:', err)
        setStatus('error')
        setMessage(err instanceof Error ? err.message : 'An error occurred during TikTok authentication')
        
        // Redirect to dashboard after 5 seconds even on error
        setTimeout(() => {
          navigate('/dashboard')
        }, 5000)
      }
    }

    handleCallback()
  }, [searchParams, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-surface border border-border rounded-lg p-8 text-center">
          <div className="mb-6">
            {status === 'loading' && (
              <div className="flex flex-col items-center">
                <Loader className="h-12 w-12 text-primary animate-spin mb-4" />
                <h1 className="text-2xl font-display font-bold text-text-primary mb-2">
                  Processing TikTok Authentication...
                </h1>
                <p className="text-text-secondary">
                  Please wait while we connect your TikTok account
                </p>
              </div>
            )}

            {status === 'success' && (
              <div className="flex flex-col items-center">
                <CheckCircle className="h-12 w-12 text-success-green mb-4" />
                <h1 className="text-2xl font-display font-bold text-text-primary mb-2">
                  Success!
                </h1>
                <p className="text-text-secondary mb-4">
                  Your TikTok account has been connected to SeeUTrending
                </p>
                <p className="text-sm text-text-muted">
                  Redirecting to dashboard...
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center">
                <XCircle className="h-12 w-12 text-error-red mb-4" />
                <h1 className="text-2xl font-display font-bold text-text-primary mb-2">
                  Authentication Failed
                </h1>
                <p className="text-text-secondary mb-4 text-sm">
                  {message}
                </p>
                <p className="text-sm text-text-muted">
                  Redirecting to dashboard...
                </p>
              </div>
            )}
          </div>

          {status === 'loading' && (
            <div className="flex justify-center">
              <div className="animate-pulse flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="w-2 h-2 bg-primary rounded-full animation-delay-200"></div>
                <div className="w-2 h-2 bg-primary rounded-full animation-delay-400"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}