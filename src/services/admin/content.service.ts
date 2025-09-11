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
}