import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bell, 
  Check, 
  X, 
  Trophy, 
  Star, 
  Users, 
  Calendar, 
  Gift,
  TrendingUp,
  MessageCircle,
  Crown,
  Zap
} from 'lucide-react'
import { supabase } from '../../lib/supabase/client'
import { useAuth } from '../../lib/auth/context'

interface Notification {
  id: string
  title: string
  message: string
  type: 'announcement' | 'contest_start' | 'contest_end' | 'winner' | 'badge_earned' | 'level_up' | 'rank_change'
  action_url?: string
  image_url?: string
  created_at: string
  read_at?: string
  clicked_at?: string
  metadata?: {
    badge_id?: string
    contest_id?: string
    rank?: number
    level?: string
    xp_amount?: number
  }
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  showUnreadOnly?: boolean
}

const notificationIcons = {
  announcement: { icon: Bell, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  contest_start: { icon: Trophy, color: 'text-green-400', bg: 'bg-green-500/20' },
  contest_end: { icon: Calendar, color: 'text-orange-400', bg: 'bg-orange-500/20' },
  winner: { icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  badge_earned: { icon: Star, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  level_up: { icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/20' },
  rank_change: { icon: Users, color: 'text-cyan-400', bg: 'bg-cyan-500/20' }
}

export function NotificationCenter({ isOpen, onClose, showUnreadOnly = false }: NotificationCenterProps) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (user && isOpen) {
      loadNotifications()
      subscribeToNotifications()
    }
  }, [user, isOpen])

  const subscribeToNotifications = () => {
    if (!user) return

    // Subscribe to new notifications
    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadNotifications()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const loadNotifications = async () => {
    if (!user) return

    setLoading(true)
    try {
      let query = supabase
        .from('user_notifications')
        .select(`
          id,
          read_at,
          clicked_at,
          created_at,
          notifications!inner(
            id,
            title,
            message,
            type,
            action_url,
            image_url,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)

      if (showUnreadOnly) {
        query = query.is('read_at', null)
      }

      const { data, error } = await query

      if (error) throw error

      const formattedNotifications = data?.map(item => ({
        id: item.id,
        title: item.notifications.title,
        message: item.notifications.message,
        type: item.notifications.type as Notification['type'],
        action_url: item.notifications.action_url,
        image_url: item.notifications.image_url,
        created_at: item.notifications.created_at,
        read_at: item.read_at,
        clicked_at: item.clicked_at,
      })) || []

      setNotifications(formattedNotifications)
      setUnreadCount(formattedNotifications.filter(n => !n.read_at).length)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    if (!user) return

    try {
      await supabase
        .from('user_notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId)
        .eq('user_id', user.id)

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId
            ? { ...n, read_at: new Date().toISOString() }
            : n
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    if (!user) return

    try {
      const unreadNotifications = notifications.filter(n => !n.read_at)
      const notificationIds = unreadNotifications.map(n => n.id)

      if (notificationIds.length === 0) return

      await supabase
        .from('user_notifications')
        .update({ read_at: new Date().toISOString() })
        .in('id', notificationIds)
        .eq('user_id', user.id)

      setNotifications(prev =>
        prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
      )
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    if (!user) return

    try {
      await supabase
        .from('user_notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user.id)

      setNotifications(prev => prev.filter(n => n.id !== notificationId))
      if (!notifications.find(n => n.id === notificationId)?.read_at) {
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as clicked
    try {
      await supabase
        .from('user_notifications')
        .update({ 
          clicked_at: new Date().toISOString(),
          read_at: notification.read_at || new Date().toISOString()
        })
        .eq('id', notification.id)
        .eq('user_id', user.id)

      if (!notification.read_at) {
        markAsRead(notification.id)
      }

      // Navigate to action URL if provided
      if (notification.action_url) {
        window.open(notification.action_url, '_blank')
      }
    } catch (error) {
      console.error('Failed to update notification click:', error)
    }
  }

  const getRelativeTime = (date: string) => {
    const now = new Date()
    const past = new Date(date)
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return past.toLocaleDateString()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-end pt-16 pr-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, x: 400, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 400, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-96 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-gray-700 shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <motion.div
                  className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8 px-4">
                <Bell className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">No notifications yet</p>
                <p className="text-gray-500 text-sm">
                  You'll see updates about contests, badges, and more here
                </p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {notifications.map((notification, index) => {
                  const iconConfig = notificationIcons[notification.type] || notificationIcons.announcement
                  const IconComponent = iconConfig.icon
                  const isUnread = !notification.read_at

                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`
                        relative p-3 rounded-lg cursor-pointer transition-all duration-200
                        ${isUnread 
                          ? 'bg-primary/10 border border-primary/20 hover:bg-primary/15' 
                          : 'bg-gray-800/30 border border-gray-700 hover:bg-gray-700/50'
                        }
                      `}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${iconConfig.bg} flex-shrink-0`}>
                          <IconComponent className={`w-4 h-4 ${iconConfig.color}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <h4 className={`font-medium text-sm ${isUnread ? 'text-white' : 'text-gray-300'}`}>
                              {notification.title}
                            </h4>
                            <div className="flex items-center space-x-1 ml-2">
                              {isUnread && (
                                <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  deleteNotification(notification.id)
                                }}
                                className="text-gray-500 hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                            {notification.message}
                          </p>

                          <div className="flex items-center justify-between mt-2">
                            <span className="text-gray-500 text-xs">
                              {getRelativeTime(notification.created_at)}
                            </span>

                            {!isUnread && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  markAsRead(notification.id)
                                }}
                                className="text-gray-500 hover:text-primary text-xs"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Special notification enhancements */}
                      {notification.type === 'badge_earned' && (
                        <div className="mt-2 pt-2 border-t border-gray-600">
                          <div className="flex items-center space-x-2 text-xs">
                            <Star className="w-3 h-3 text-yellow-400" />
                            <span className="text-yellow-400">New badge unlocked!</span>
                          </div>
                        </div>
                      )}

                      {notification.type === 'level_up' && (
                        <div className="mt-2 pt-2 border-t border-gray-600">
                          <div className="flex items-center space-x-2 text-xs">
                            <Zap className="w-3 h-3 text-primary" />
                            <span className="text-primary">Level up!</span>
                          </div>
                        </div>
                      )}

                      {notification.action_url && (
                        <div className="absolute bottom-2 right-2">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={() => {
                // Open full notifications page or settings
                console.log('Open notification settings')
              }}
              className="w-full text-center text-sm text-gray-400 hover:text-primary transition-colors"
            >
              Notification Settings
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Hook for easy notification management
export function useNotifications() {
  const { user } = useAuth()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (user) {
      loadUnreadCount()
      subscribeToNotifications()
    }
  }, [user])

  const subscribeToNotifications = () => {
    if (!user) return

    const channel = supabase
      .channel(`notifications-count-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_notifications',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadUnreadCount()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const loadUnreadCount = async () => {
    if (!user) return

    try {
      const { count, error } = await supabase
        .from('user_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .is('read_at', null)

      if (error) throw error
      setUnreadCount(count || 0)
    } catch (error) {
      console.error('Failed to load unread count:', error)
    }
  }

  const createNotification = async (
    title: string,
    message: string,
    type: Notification['type'],
    actionUrl?: string
  ) => {
    if (!user) return

    try {
      // Create global notification
      const { data: notification, error: notificationError } = await supabase
        .from('notifications')
        .insert({
          title,
          message,
          type,
          action_url: actionUrl,
          target_users: [user.id],
          published: true,
          published_at: new Date().toISOString(),
          created_by: user.id,
        })
        .select()
        .single()

      if (notificationError) throw notificationError

      // Create user notification
      await supabase
        .from('user_notifications')
        .insert({
          user_id: user.id,
          notification_id: notification.id,
        })

    } catch (error) {
      console.error('Failed to create notification:', error)
    }
  }

  return {
    unreadCount,
    createNotification,
    loadUnreadCount
  }
}