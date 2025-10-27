import { supabase } from '../../lib/supabase/client'

export interface ContentBlock {
  id: string
  section: string
  title: string
  content: string
  priority: number
  visible: boolean
  background_color?: string
  text_color?: string
  icon?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface CreateContentBlockData {
  section: string
  title: string
  content: string
  priority?: number
  visible?: boolean
  background_color?: string
  text_color?: string
  icon?: string
}

// New types for landing page notifications
export type BadgeStatus = 'active_now' | 'coming_soon'
export type BadgeType = 'announcement' | 'upcoming'

export interface ContentNotification {
  id: string
  title_pl: string
  title_en: string
  content_pl: string
  content_en: string
  badge_status: BadgeStatus
  badge_type: BadgeType
  priority: number
  visible: boolean
  created_at: string
  updated_at: string
}

export interface CreateContentNotificationData {
  title_pl: string
  title_en: string
  content_pl: string
  content_en: string
  badge_status: BadgeStatus
  badge_type: BadgeType
  priority?: number
  visible?: boolean
}

export interface TrailerConfig {
  id: string
  youtube_video_id: string
  title_pl: string
  title_en: string
  description_pl?: string
  description_en?: string
  visible: boolean
  updated_at: string
}

export interface UpdateTrailerData {
  youtube_video_id: string
  title_pl: string
  title_en: string
  description_pl?: string
  description_en?: string
  visible: boolean
}

export class ContentService {
  // Get all content blocks
  static async getContentBlocks(section?: string) {
    let query = supabase
      .from('content_blocks')
      .select('*')
      .order('priority', { ascending: true })

    if (section) {
      query = query.eq('section', section)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch content blocks: ${error.message}`)
    }

    return data as ContentBlock[]
  }

  // Get visible content blocks (for public site)
  static async getVisibleContentBlocks(section?: string) {
    let query = supabase
      .from('content_blocks')
      .select('*')
      .eq('visible', true)
      .order('priority', { ascending: true })

    if (section) {
      query = query.eq('section', section)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch visible content blocks: ${error.message}`)
    }

    return data as ContentBlock[]
  }

  // Get content block by ID
  static async getContentBlockById(id: string) {
    const { data, error } = await supabase
      .from('content_blocks')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Failed to fetch content block: ${error.message}`)
    }

    return data as ContentBlock
  }

  // Create new content block
  static async createContentBlock(blockData: CreateContentBlockData, userId: string) {
    const { data, error } = await supabase
      .from('content_blocks')
      .insert({
        ...blockData,
        created_by: userId,
        priority: blockData.priority || 1,
        visible: blockData.visible !== false
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create content block: ${error.message}`)
    }

    return data as ContentBlock
  }

  // Update content block
  static async updateContentBlock(id: string, updates: Partial<CreateContentBlockData>) {
    const { data, error } = await supabase
      .from('content_blocks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update content block: ${error.message}`)
    }

    return data as ContentBlock
  }

  // Delete content block
  static async deleteContentBlock(id: string) {
    const { error } = await supabase
      .from('content_blocks')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete content block: ${error.message}`)
    }

    return true
  }

  // Toggle content block visibility
  static async toggleContentBlockVisibility(id: string) {
    // First get current visibility
    const { data: currentBlock, error: fetchError } = await supabase
      .from('content_blocks')
      .select('visible')
      .eq('id', id)
      .single()

    if (fetchError) {
      throw new Error(`Failed to fetch content block: ${fetchError.message}`)
    }

    // Toggle visibility
    const { data, error } = await supabase
      .from('content_blocks')
      .update({ visible: !currentBlock.visible })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to toggle visibility: ${error.message}`)
    }

    return data as ContentBlock
  }

  // Reorder content blocks
  static async updateContentBlockPriority(id: string, priority: number) {
    const { data, error } = await supabase
      .from('content_blocks')
      .update({ priority })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update priority: ${error.message}`)
    }

    return data as ContentBlock
  }

  // Bulk update priorities (for drag and drop reordering)
  static async bulkUpdatePriorities(updates: Array<{ id: string; priority: number }>) {
    const promises = updates.map(({ id, priority }) =>
      supabase
        .from('content_blocks')
        .update({ priority })
        .eq('id', id)
    )

    try {
      await Promise.all(promises)
      return true
    } catch (error) {
      throw new Error(`Failed to update priorities: ${error}`)
    }
  }

  // Get content statistics
  static async getContentStats() {
    const { data, error } = await supabase
      .from('content_blocks')
      .select('section, visible')

    if (error) {
      throw new Error(`Failed to fetch content stats: ${error.message}`)
    }

    const stats = {
      total: data.length,
      visible: data.filter(block => block.visible).length,
      hidden: data.filter(block => !block.visible).length,
      bySection: data.reduce((acc, block) => {
        acc[block.section] = (acc[block.section] || 0) + 1
        return acc
      }, {} as Record<string, number>)
    }

    return stats
  }

  // Search content blocks
  static async searchContentBlocks(searchTerm: string) {
    const { data, error } = await supabase
      .from('content_blocks')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
      .order('priority', { ascending: true })

    if (error) {
      throw new Error(`Failed to search content blocks: ${error.message}`)
    }

    return data as ContentBlock[]
  }

  // ==================== Content Notifications (Landing Page) ====================

  // Get all content notifications
  static async getContentNotifications(options?: {
    visible?: boolean
    orderBy?: 'priority' | 'created_at'
  }) {
    let query = supabase
      .from('content_notifications')
      .select('*')

    if (options?.visible !== undefined) {
      query = query.eq('visible', options.visible)
    }

    const orderBy = options?.orderBy || 'priority'
    query = query.order(orderBy, { ascending: orderBy === 'priority' })

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch content notifications: ${error.message}`)
    }

    return data as ContentNotification[]
  }

  // Get visible notifications for public display
  static async getVisibleNotifications() {
    return this.getContentNotifications({ visible: true, orderBy: 'priority' })
  }

  // Get notification by ID
  static async getContentNotificationById(id: string) {
    const { data, error } = await supabase
      .from('content_notifications')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Failed to fetch notification: ${error.message}`)
    }

    return data as ContentNotification
  }

  // Create new content notification
  static async createContentNotification(notificationData: CreateContentNotificationData) {
    const { data, error } = await supabase
      .from('content_notifications')
      .insert([{
        ...notificationData,
        priority: notificationData.priority || 1,
        visible: notificationData.visible !== undefined ? notificationData.visible : true
      }])
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create notification: ${error.message}`)
    }

    return data as ContentNotification
  }

  // Update content notification
  static async updateContentNotification(id: string, updates: Partial<CreateContentNotificationData>) {
    const { data, error } = await supabase
      .from('content_notifications')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update notification: ${error.message}`)
    }

    return data as ContentNotification
  }

  // Delete content notification
  static async deleteContentNotification(id: string) {
    const { error } = await supabase
      .from('content_notifications')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete notification: ${error.message}`)
    }

    return true
  }

  // Toggle notification visibility
  static async toggleNotificationVisibility(id: string, visible: boolean) {
    return this.updateContentNotification(id, { visible })
  }

  // ==================== Trailer Configuration ====================

  // Get trailer configuration
  static async getTrailerConfig() {
    const { data, error } = await supabase
      .from('trailer_config')
      .select('*')
      .limit(1)
      .single()

    if (error) {
      // If no config exists, return default
      if (error.code === 'PGRST116') {
        return {
          id: '',
          youtube_video_id: 'dQw4w9WgXcQ',
          title_pl: 'Jak to działa',
          title_en: 'How it Works',
          description_pl: 'Zobacz krótki film wyjaśniający, jak działa platforma SeeUTrending',
          description_en: 'Watch a short video explaining how the SeeUTrending platform works',
          visible: true,
          updated_at: new Date().toISOString()
        } as TrailerConfig
      }
      throw new Error(`Failed to fetch trailer config: ${error.message}`)
    }

    return data as TrailerConfig
  }

  // Update trailer configuration
  static async updateTrailerConfig(updates: UpdateTrailerData) {
    // Try to get existing config
    const { data: existing, error: fetchError } = await supabase
      .from('trailer_config')
      .select('id')
      .limit(1)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw new Error(`Failed to fetch trailer config: ${fetchError.message}`)
    }

    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('trailer_config')
        .update(updates)
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to update trailer config: ${error.message}`)
      }

      return data as TrailerConfig
    } else {
      // Create new
      const { data, error } = await supabase
        .from('trailer_config')
        .insert([updates])
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to create trailer config: ${error.message}`)
      }

      return data as TrailerConfig
    }
  }
}