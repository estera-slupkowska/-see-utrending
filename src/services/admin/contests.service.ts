import { supabase } from '../../lib/supabase/client'

export interface Contest {
  id: string
  title: string
  description: string
  brand_name?: string
  brand_email?: string
  hashtag: string
  additional_rules?: string
  min_followers?: number
  first_prize?: string
  second_prize?: string
  third_prize?: string
  participation_reward?: number
  start_date: string
  end_date: string
  submission_deadline?: string
  status: 'draft' | 'active' | 'completed' | 'cancelled'
  max_participants?: number
  total_submissions?: number
  total_views?: number
  total_likes?: number
  total_comments?: number
  created_by?: string
  featured?: boolean
  created_at: string
  updated_at: string
}

export interface CreateContestData {
  title: string
  description: string
  brand_name?: string
  brand_email?: string
  hashtag: string
  additional_rules?: string
  min_followers?: number
  first_prize?: string
  second_prize?: string
  third_prize?: string
  participation_reward?: number
  start_date: string
  end_date: string
  submission_deadline?: string
  max_participants?: number
  featured?: boolean
}

export class ContestsService {
  // Get all contests with optional filtering
  static async getContests(options?: {
    status?: string
    search?: string
    limit?: number
    offset?: number
  }) {
    let query = supabase
      .from('contests')
      .select('*')
      .order('created_at', { ascending: false })

    if (options?.status && options.status !== 'all') {
      query = query.eq('status', options.status)
    }

    if (options?.search) {
      query = query.or(`title.ilike.%${options.search}%,hashtag.ilike.%${options.search}%`)
    }

    if (options?.limit) {
      query = query.limit(options.limit)
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 50) - 1)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch contests: ${error.message}`)
    }

    return data as Contest[]
  }

  // Get contest by ID
  static async getContestById(id: string) {
    const { data, error } = await supabase
      .from('contests')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Failed to fetch contest: ${error.message}`)
    }

    return data as Contest
  }

  // Create new contest
  static async createContest(contestData: CreateContestData, userId: string) {
    const { data, error } = await supabase
      .from('contests')
      .insert({
        ...contestData,
        created_by: userId,
        status: 'draft'
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create contest: ${error.message}`)
    }

    return data as Contest
  }

  // Update contest
  static async updateContest(id: string, updates: Partial<CreateContestData>) {
    const { data, error } = await supabase
      .from('contests')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update contest: ${error.message}`)
    }

    return data as Contest
  }

  // Delete contest
  static async deleteContest(id: string) {
    const { error } = await supabase
      .from('contests')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete contest: ${error.message}`)
    }

    return true
  }

  // Update contest status
  static async updateContestStatus(id: string, status: Contest['status']) {
    const { data, error } = await supabase
      .from('contests')
      .update({ status })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update contest status: ${error.message}`)
    }

    return data as Contest
  }

  // Get contest statistics
  static async getContestStats() {
    // Get counts by status
    const { data: statusCounts, error: statusError } = await supabase
      .from('contests')
      .select('status')

    if (statusError) {
      throw new Error(`Failed to fetch contest stats: ${statusError.message}`)
    }

    const stats = {
      total: statusCounts.length,
      active: statusCounts.filter(c => c.status === 'active').length,
      draft: statusCounts.filter(c => c.status === 'draft').length,
      completed: statusCounts.filter(c => c.status === 'completed').length,
      cancelled: statusCounts.filter(c => c.status === 'cancelled').length
    }

    // Get total participants
    const { data: participantsData, error: participantsError } = await supabase
      .from('contests')
      .select('total_submissions')

    if (participantsError) {
      throw new Error(`Failed to fetch participant stats: ${participantsError.message}`)
    }

    const totalParticipants = participantsData.reduce((sum, contest) => 
      sum + (contest.total_submissions || 0), 0
    )

    return {
      ...stats,
      totalParticipants
    }
  }

  // Get recent contest activity
  static async getRecentActivity(limit = 10) {
    const { data, error } = await supabase
      .from('contests')
      .select('id, title, status, created_at, updated_at')
      .order('updated_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`Failed to fetch recent activity: ${error.message}`)
    }

    return data
  }
}