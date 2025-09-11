import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, Check, AlertTriangle, ExternalLink, Users, Eye, Heart, Zap, Unlink } from 'lucide-react'
import { tikTokAuth } from '../../services/tiktok/auth.service'
import { tikTokApi } from '../../services/tiktok/api.service'
import { useAuth } from '../../lib/auth/context'

interface TikTokAccount {
  id: string
  tiktok_user_id: string
  username: string
  display_name: string
  avatar_url?: string
  follower_count: number
  following_count: number
  likes_count: number
  video_count: number
  is_verified: boolean
  last_sync: string
}

interface TikTokConnectProps {
  onConnectionSuccess?: (account: TikTokAccount) => void
  showStats?: boolean
  compact?: boolean
}

export function TikTokConnect({ 
  onConnectionSuccess, 
  showStats = true, 
  compact = false 
}: TikTokConnectProps) {
  const { user } = useAuth()
  
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [account, setAccount] = useState<TikTokAccount | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      checkExistingConnection()
    }
  }, [user])

  useEffect(() => {
    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const state = urlParams.get('state')
    const error = urlParams.get('error')

    if (error) {
      setError(`TikTok authorization failed: ${error}`)
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
      return
    }

    if (code && state) {
      handleOAuthCallback(code, state)
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const checkExistingConnection = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      const existingAccount = await tikTokAuth.getTikTokAccount(user.id)
      
      if (existingAccount) {
        setIsConnected(true)
        setAccount(existingAccount)
      }
    } catch (error) {
      console.error('Failed to check TikTok connection:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthCallback = async (code: string, state: string) => {
    if (!user) return

    setIsConnecting(true)
    setError(null)

    try {
      // Verify CSRF state
      const storedState = localStorage.getItem('tiktok_oauth_state')
      if (!storedState || storedState !== state) {
        throw new Error('Invalid OAuth state')
      }

      // Exchange code for tokens
      const tokenData = await tikTokAuth.exchangeCodeForTokens(code, state)

      // Get user info from TikTok API
      const userInfo = await tikTokApi.getUserInfo(tokenData.access_token)

      // Save to database
      await tikTokAuth.saveTikTokAccount(user.id, tokenData, userInfo)

      // Update local state
      const newAccount: TikTokAccount = {
        id: user.id,
        tiktok_user_id: tokenData.open_id,
        username: userInfo.display_name,
        display_name: userInfo.display_name,
        avatar_url: userInfo.avatar_url,
        follower_count: userInfo.follower_count || 0,
        following_count: userInfo.following_count || 0,
        likes_count: userInfo.likes_count || 0,
        video_count: userInfo.video_count || 0,
        is_verified: userInfo.is_verified || false,
        last_sync: new Date().toISOString()
      }

      setIsConnected(true)
      setAccount(newAccount)
      onConnectionSuccess?.(newAccount)

      // Clean up localStorage
      localStorage.removeItem('tiktok_oauth_state')
      
    } catch (error: any) {
      setError(error.message || 'Failed to connect TikTok account')
    } finally {
      setIsConnecting(false)
    }
  }

  const startConnection = () => {
    if (!user) {
      setError('Please log in first')
      return
    }

    const state = tikTokAuth.generateCSRFToken()
    localStorage.setItem('tiktok_oauth_state', state)
    
    const authUrl = tikTokAuth.generateAuthUrl(state)
    window.location.href = authUrl
  }

  const disconnectAccount = async () => {
    if (!user) return

    try {
      await tikTokAuth.disconnectTikTok(user.id)
      setIsConnected(false)
      setAccount(null)
    } catch (error: any) {
      setError(error.message || 'Failed to disconnect TikTok account')
    }
  }

  const syncAccount = async () => {
    if (!user || !account) return

    try {
      const accessToken = await tikTokAuth.refreshTokenIfNeeded(user.id)
      if (!accessToken) {
        throw new Error('Failed to refresh access token')
      }

      const userInfo = await tikTokApi.getUserInfo(accessToken)
      
      // Update account data
      const updatedAccount = {
        ...account,
        follower_count: userInfo.follower_count || 0,
        following_count: userInfo.following_count || 0,
        likes_count: userInfo.likes_count || 0,
        video_count: userInfo.video_count || 0,
        last_sync: new Date().toISOString()
      }

      setAccount(updatedAccount)
    } catch (error: any) {
      setError(error.message || 'Failed to sync account data')
    }
  }

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
        <div className="flex items-center justify-center py-8">
          <motion.div
            className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    )
  }

  if (compact && isConnected && account) {
    return (
      <div className="flex items-center space-x-3 bg-gray-800/30 rounded-lg p-3 border border-gray-600">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">T</span>
          </div>
          <div>
            <div className="text-white text-sm font-medium">@{account.username}</div>
            <div className="text-gray-400 text-xs">
              {account.follower_count.toLocaleString()} followers
            </div>
          </div>
        </div>
        <button
          onClick={syncAccount}
          className="text-primary hover:text-primary/80 text-sm"
        >
          Sync
        </button>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg">
          <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">T</span>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">TikTok Integration</h3>
          <p className="text-gray-400 text-sm">
            Connect your TikTok account to participate in contests
          </p>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center space-x-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isConnecting && (
        <div className="text-center py-8">
          <motion.div
            className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-white">Connecting your TikTok account...</p>
          <p className="text-gray-400 text-sm mt-1">
            Please complete the authorization on TikTok
          </p>
        </div>
      )}

      {!isConnected && !isConnecting && (
        <div className="text-center py-8">
          <div className="mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Link className="w-8 h-8 text-primary" />
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">
              Connect Your TikTok Account
            </h4>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Link your TikTok account to submit videos, track performance, and compete in contests.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 max-w-sm mx-auto">
            <div className="text-center">
              <div className="text-primary font-bold text-lg">Submit</div>
              <div className="text-gray-400 text-xs">Videos to contests</div>
            </div>
            <div className="text-center">
              <div className="text-green-400 font-bold text-lg">Track</div>
              <div className="text-gray-400 text-xs">Real-time metrics</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-400 font-bold text-lg">Compete</div>
              <div className="text-gray-400 text-xs">On leaderboards</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold text-lg">Win</div>
              <div className="text-gray-400 text-xs">Prizes & badges</div>
            </div>
          </div>

          <motion.button
            onClick={startConnection}
            disabled={!user}
            className="
              flex items-center justify-center space-x-2 w-full py-3 px-6
              bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium rounded-lg
              hover:shadow-lg hover:shadow-primary/25 transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none
            "
            whileHover={user ? { scale: 1.02 } : undefined}
            whileTap={user ? { scale: 0.98 } : undefined}
          >
            <ExternalLink className="w-5 h-5" />
            <span>Connect TikTok Account</span>
          </motion.button>

          {!user && (
            <p className="text-gray-400 text-sm mt-3">
              Please log in to connect your TikTok account
            </p>
          )}
        </div>
      )}

      {isConnected && account && !isConnecting && (
        <div>
          {/* Connected Account Info */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">Account Connected</span>
            </div>
            
            <div className="flex items-center space-x-4">
              {account.avatar_url ? (
                <img
                  src={account.avatar_url}
                  alt={account.display_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {account.display_name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="text-white font-semibold">{account.display_name}</h4>
                  {account.is_verified && (
                    <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <p className="text-gray-400 text-sm">@{account.username}</p>
                <p className="text-gray-500 text-xs">
                  Last synced: {new Date(account.last_sync).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Account Stats */}
          {showStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="w-4 h-4 text-blue-400 mr-1" />
                </div>
                <div className="text-blue-400 font-bold text-lg">
                  {account.follower_count.toLocaleString()}
                </div>
                <div className="text-gray-400 text-xs">Followers</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Eye className="w-4 h-4 text-green-400 mr-1" />
                </div>
                <div className="text-green-400 font-bold text-lg">
                  {account.video_count.toLocaleString()}
                </div>
                <div className="text-gray-400 text-xs">Videos</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Heart className="w-4 h-4 text-red-400 mr-1" />
                </div>
                <div className="text-red-400 font-bold text-lg">
                  {account.likes_count.toLocaleString()}
                </div>
                <div className="text-gray-400 text-xs">Likes</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-1">
                  <Users className="w-4 h-4 text-purple-400 mr-1" />
                </div>
                <div className="text-purple-400 font-bold text-lg">
                  {account.following_count.toLocaleString()}
                </div>
                <div className="text-gray-400 text-xs">Following</div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={syncAccount}
              className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg transition-colors"
            >
              <Zap className="w-4 h-4" />
              <span>Sync Data</span>
            </button>
            
            <button
              onClick={disconnectAccount}
              className="flex items-center justify-center space-x-2 py-2 px-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
            >
              <Unlink className="w-4 h-4" />
              <span>Disconnect</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}