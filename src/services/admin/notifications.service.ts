import { supabase } from '../../lib/supabase/client'

export type NotificationType = 'announcement' | 'contest_start' | 'contest_end' | 'winner' | 'badge_earned'

export interface Notification {
  id: string
  title: string
  message: string
  type: NotificationType
  target_audience?: string[] // ['all', 'creators', 'brands', 'spectators']
  target_users?: string[] // specific user IDs
  action_url?: string
  image_url?: string
  published: boolean
  published_at?: string
  expires_at?: string
  total_sent: number
  total_read: number
  created_by?: string
  created_at: string
  updated_at: string
}

export interface CreateNotificationData {
  title: string
  message: string
  type: NotificationType
  target_audience?: string[]
  target_users?: string[]
  action_url?: string
  image_url?: string
  published?: boolean
  expires_at?: string
}

export class NotificationsService {
  // Get all notifications with optional filtering
  static async getNotifications(options?: {
    published?: boolean
    type?: string
    limit?: number
    offset?: number
  }) {
    let query = supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })

    if (options?.published !== undefined) {
      query = query.eq('published', options.published)
    }

    if (options?.type && options.type !== 'all') {
      query = query.eq('type', options.type)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 50) - 1)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch notifications: ${error.message}`)
    }

    return data as Notification[]
  }

  // Get notification by ID
  static async getNotificationById(id: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Failed to fetch notification: ${error.message}`)
    }

    return data as Notification
  }

  // Create new notification
  static async createNotification(notificationData: CreateNotificationData) {
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await supabase
      .from('notifications')
      .insert([{
        ...notificationData,
        created_by: userData.user.id,
        published_at: notificationData.published ? new Date().toISOString() : null
      }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create notification: ${error.message}`)
    }

    // If published, create user_notifications for targeted users
    if (notificationData.published) {
      await this.sendToTargetedUsers(data.id, notificationData.target_audience, notificationData.target_users)
    }

    return data as Notification
  }

  // Update notification
  static async updateNotification(id: string, updates: Partial<CreateNotificationData>) {
    const { data, error } = await supabase
      .from('notifications')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update notification: ${error.message}`)
    }

    return data as Notification
  }

  // Publish notification (send to users)
  static async publishNotification(id: string) {
    // Get notification details
    const notification = await this.getNotificationById(id)

    // Update notification status
    const { data, error } = await supabase
      .from('notifications')
      .update({
        published: true,
        published_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to publish notification: ${error.message}`)
    }

    // Send to targeted users
    await this.sendToTargetedUsers(id, notification.target_audience, notification.target_users)

    return data as Notification
  }

  // Send notification to targeted users
  private static async sendToTargetedUsers(
    notificationId: string,
    targetAudience?: string[],
    targetUsers?: string[]
  ) {
    let userIds: string[] = []

    // If specific users are targeted
    if (targetUsers && targetUsers.length > 0) {
      userIds = targetUsers
    }
    // If audience groups are targeted
    else if (targetAudience && targetAudience.length > 0) {
      if (targetAudience.includes('all')) {
        // Get all users
        const { data: allUsers } = await supabase
          .from('profiles')
          .select('id')
        userIds = allUsers?.map(u => u.id) || []
      } else {
        // Get users by role
        const { data: users } = await supabase
          .from('profiles')
          .select('id')
          .in('role', targetAudience)
        userIds = users?.map(u => u.id) || []
      }
    }

    if (userIds.length === 0) return

    // Create user_notifications entries
    const userNotifications = userIds.map(userId => ({
      user_id: userId,
      notification_id: notificationId
    }))

    const { error } = await supabase
      .from('user_notifications')
      .insert(userNotifications)

    if (error) {
      console.error('Failed to create user notifications:', error)
    }

    // Update total_sent count
    await supabase
      .from('notifications')
      .update({ total_sent: userIds.length })
      .eq('id', notificationId)
  }

  // Delete notification
  static async deleteNotification(id: string) {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete notification: ${error.message}`)
    }

    return true
  }

  // Get notification statistics
  static async getNotificationStats() {
    const { data: allNotifications, error } = await supabase
      .from('notifications')
      .select('*')

    if (error) {
      throw new Error(`Failed to fetch notification stats: ${error.message}`)
    }

    const totalNotifications = allNotifications.length
    const publishedNotifications = allNotifications.filter(n => n.published).length
    const draftNotifications = allNotifications.filter(n => !n.published).length

    const totalSent = allNotifications.reduce((sum, n) => sum + (n.total_sent || 0), 0)
    const totalRead = allNotifications.reduce((sum, n) => sum + (n.total_read || 0), 0)
    const readRate = totalSent > 0 ? ((totalRead / totalSent) * 100).toFixed(1) : '0'

    return {
      totalNotifications,
      publishedNotifications,
      draftNotifications,
      totalSent,
      totalRead,
      readRate: `${readRate}%`
    }
  }

  // Mark notification as read for a user
  static async markAsRead(notificationId: string, userId: string) {
    const { error } = await supabase
      .from('user_notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('notification_id', notificationId)
      .eq('user_id', userId)

    if (error) {
      console.error('Failed to mark notification as read:', error)
      return false
    }

    // Increment total_read count
    const { data: notification } = await supabase
      .from('notifications')
      .select('total_read')
      .eq('id', notificationId)
      .single()

    if (notification) {
      await supabase
        .from('notifications')
        .update({ total_read: (notification.total_read || 0) + 1 })
        .eq('id', notificationId)
    }

    return true
  }

  // Get user's notifications
  static async getUserNotifications(userId: string, options?: {
    unreadOnly?: boolean
    limit?: number
  }) {
    let query = supabase
      .from('user_notifications')
      .select(`
        *,
        notifications (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (options?.unreadOnly) {
      query = query.is('read_at', null)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch user notifications: ${error.message}`)
    }

    return data
  }
}
