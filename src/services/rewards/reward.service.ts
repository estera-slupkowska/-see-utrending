import { supabase } from '../../lib/supabase/client'
import { useGamificationStore } from '../../stores/gamification.store'

interface Reward {
  id: string
  type: 'xp' | 'badge' | 'physical' | 'vip_access' | 'custom'
  name: string
  description: string
  value: number | string
  requirements: {
    contest_id?: string
    rank_position?: number
    badge_id?: string
    xp_threshold?: number
    level_required?: string
  }
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  expires_at?: string
  is_active: boolean
}

interface RewardDistribution {
  id: string
  user_id: string
  reward_id: string
  contest_id?: string
  submission_id?: string
  distributed_at: string
  claimed_at?: string
  status: 'pending' | 'distributed' | 'claimed' | 'expired'
  metadata?: {
    tracking_code?: string
    delivery_info?: string
    custom_data?: Record<string, any>
  }
}

interface ContestRewards {
  first_place: Reward[]
  second_place: Reward[]
  third_place: Reward[]
  participation: Reward[]
  special: Reward[]
}

class RewardService {
  async createReward(reward: Omit<Reward, 'id'>): Promise<Reward> {
    const { data, error } = await supabase
      .from('rewards')
      .insert(reward)
      .select()
      .single()

    if (error) throw new Error(`Failed to create reward: ${error.message}`)
    return data
  }

  async getContestRewards(contestId: string): Promise<ContestRewards> {
    const { data: contest } = await supabase
      .from('contests')
      .select('*')
      .eq('id', contestId)
      .single()

    if (!contest) throw new Error('Contest not found')

    // Define rewards based on contest configuration
    const rewards: ContestRewards = {
      first_place: [
        {
          id: 'first_place_xp',
          type: 'xp',
          name: 'Winner XP Boost',
          description: `Massive XP reward for winning ${contest.title}`,
          value: 5000,
          requirements: { contest_id: contestId, rank_position: 1 },
          rarity: 'legendary',
          is_active: true
        }
      ],
      second_place: [
        {
          id: 'second_place_xp',
          type: 'xp',
          name: 'Runner-up XP Boost',
          description: `Great XP reward for 2nd place in ${contest.title}`,
          value: 2500,
          requirements: { contest_id: contestId, rank_position: 2 },
          rarity: 'epic',
          is_active: true
        }
      ],
      third_place: [
        {
          id: 'third_place_xp',
          type: 'xp',
          name: 'Third Place XP Boost',
          description: `Solid XP reward for 3rd place in ${contest.title}`,
          value: 1000,
          requirements: { contest_id: contestId, rank_position: 3 },
          rarity: 'rare',
          is_active: true
        }
      ],
      participation: [
        {
          id: 'participation_xp',
          type: 'xp',
          name: 'Participation Reward',
          description: `Thank you for participating in ${contest.title}`,
          value: contest.participation_reward || 10,
          requirements: { contest_id: contestId },
          rarity: 'common',
          is_active: true
        }
      ],
      special: []
    }

    // Add custom rewards based on contest prizes
    if (contest.first_prize) {
      rewards.first_place.push({
        id: 'first_place_prize',
        type: 'physical',
        name: 'First Place Prize',
        description: contest.first_prize,
        value: contest.first_prize,
        requirements: { contest_id: contestId, rank_position: 1 },
        rarity: 'legendary',
        is_active: true
      })
    }

    if (contest.second_prize) {
      rewards.second_place.push({
        id: 'second_place_prize',
        type: 'physical',
        name: 'Second Place Prize',
        description: contest.second_prize,
        value: contest.second_prize,
        requirements: { contest_id: contestId, rank_position: 2 },
        rarity: 'epic',
        is_active: true
      })
    }

    if (contest.third_prize) {
      rewards.third_place.push({
        id: 'third_place_prize',
        type: 'physical',
        name: 'Third Place Prize',
        description: contest.third_prize,
        value: contest.third_prize,
        requirements: { contest_id: contestId, rank_position: 3 },
        rarity: 'rare',
        is_active: true
      })
    }

    return rewards
  }

  async distributeContestRewards(contestId: string): Promise<void> {
    try {
      // Get final rankings
      const { data: submissions } = await supabase
        .from('contest_submissions')
        .select('*, profiles(id, name, email)')
        .eq('contest_id', contestId)
        .eq('status', 'approved')
        .order('final_score', { ascending: false })
        .limit(100)

      if (!submissions || submissions.length === 0) return

      const rewards = await this.getContestRewards(contestId)

      // Distribute rewards based on rankings
      for (let i = 0; i < submissions.length; i++) {
        const submission = submissions[i]
        const rank = i + 1
        let rewardsToDistribute: Reward[] = []

        // Participation rewards for everyone
        rewardsToDistribute.push(...rewards.participation)

        // Ranking rewards
        if (rank === 1) rewardsToDistribute.push(...rewards.first_place)
        else if (rank === 2) rewardsToDistribute.push(...rewards.second_place)
        else if (rank === 3) rewardsToDistribute.push(...rewards.third_place)

        // Distribute each reward
        for (const reward of rewardsToDistribute) {
          await this.distributeRewardToUser(
            submission.user_id,
            reward,
            contestId,
            submission.id
          )
        }
      }

      // Mark contest as rewards distributed
      await supabase
        .from('contests')
        .update({ rewards_distributed: true, updated_at: new Date().toISOString() })
        .eq('id', contestId)

    } catch (error) {
      console.error('Failed to distribute contest rewards:', error)
      throw error
    }
  }

  async distributeRewardToUser(
    userId: string,
    reward: Reward,
    contestId?: string,
    submissionId?: string
  ): Promise<RewardDistribution> {
    try {
      // Create reward distribution record
      const { data: distribution, error } = await supabase
        .from('reward_distributions')
        .insert({
          user_id: userId,
          reward_type: reward.type,
          reward_name: reward.name,
          reward_description: reward.description,
          reward_value: reward.value.toString(),
          contest_id: contestId,
          submission_id: submissionId,
          rarity: reward.rarity,
          status: 'pending',
          distributed_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (error) throw error

      // Process reward based on type
      await this.processRewardDistribution(userId, reward, distribution.id)

      return distribution
    } catch (error) {
      console.error('Failed to distribute reward:', error)
      throw error
    }
  }

  private async processRewardDistribution(
    userId: string,
    reward: Reward,
    distributionId: string
  ): Promise<void> {
    switch (reward.type) {
      case 'xp':
        await this.distributeXPReward(userId, parseInt(reward.value.toString()), reward.name)
        break
      
      case 'badge':
        await this.distributeBadgeReward(userId, reward.value.toString())
        break
      
      case 'physical':
        await this.schedulePhysicalReward(userId, reward, distributionId)
        break
      
      case 'vip_access':
        await this.grantVIPAccess(userId, reward)
        break
      
      case 'custom':
        await this.processCustomReward(userId, reward)
        break
    }

    // Mark as distributed
    await supabase
      .from('reward_distributions')
      .update({ 
        status: 'distributed',
        processed_at: new Date().toISOString()
      })
      .eq('id', distributionId)
  }

  private async distributeXPReward(userId: string, amount: number, reason: string): Promise<void> {
    const { awardXP } = useGamificationStore.getState()
    await awardXP(userId, amount, reason, 'earned')

    // Create notification
    await this.createRewardNotification(
      userId,
      'XP Reward Earned!',
      `You've earned ${amount} XP for ${reason}`,
      'xp_reward'
    )
  }

  private async distributeBadgeReward(userId: string, badgeId: string): Promise<void> {
    const { unlockBadge } = useGamificationStore.getState()
    await unlockBadge(userId, badgeId)

    // Create notification
    await this.createRewardNotification(
      userId,
      'New Badge Unlocked!',
      'Congratulations on earning a new badge!',
      'badge_earned'
    )
  }

  private async schedulePhysicalReward(
    userId: string,
    reward: Reward,
    distributionId: string
  ): Promise<void> {
    // Generate tracking code
    const trackingCode = this.generateTrackingCode()

    // Update distribution with tracking info
    await supabase
      .from('reward_distributions')
      .update({
        metadata: {
          tracking_code: trackingCode,
          requires_shipping: true,
          status: 'awaiting_shipping_info'
        }
      })
      .eq('id', distributionId)

    // Create notification with instructions
    await this.createRewardNotification(
      userId,
      'Physical Prize Won!',
      `You've won: ${reward.description}. Please provide your shipping information to claim this prize.`,
      'physical_reward',
      `/rewards/claim/${distributionId}`
    )

    // TODO: Integrate with shipping/fulfillment service
  }

  private async grantVIPAccess(userId: string, reward: Reward): Promise<void> {
    // Add VIP role or permissions
    const expiresAt = reward.expires_at || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    await supabase
      .from('user_permissions')
      .upsert({
        user_id: userId,
        permission: 'vip_access',
        granted_at: new Date().toISOString(),
        expires_at: expiresAt,
        granted_by: 'reward_system'
      })

    // Create notification
    await this.createRewardNotification(
      userId,
      'VIP Access Granted!',
      `You now have VIP access! ${reward.description}`,
      'vip_access'
    )
  }

  private async processCustomReward(userId: string, reward: Reward): Promise<void> {
    // Handle custom reward logic
    console.log('Processing custom reward:', reward)

    // Create notification
    await this.createRewardNotification(
      userId,
      'Special Reward!',
      reward.description,
      'custom_reward'
    )
  }

  private async createRewardNotification(
    userId: string,
    title: string,
    message: string,
    type: string,
    actionUrl?: string
  ): Promise<void> {
    // Create global notification
    const { data: notification } = await supabase
      .from('notifications')
      .insert({
        title,
        message,
        type: type as any,
        action_url: actionUrl,
        target_users: [userId],
        published: true,
        published_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (notification) {
      // Create user notification
      await supabase
        .from('user_notifications')
        .insert({
          user_id: userId,
          notification_id: notification.id,
        })
    }
  }

  private generateTrackingCode(): string {
    return `ST-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  }

  async claimReward(distributionId: string, userId: string): Promise<void> {
    try {
      const { data: distribution } = await supabase
        .from('reward_distributions')
        .select('*')
        .eq('id', distributionId)
        .eq('user_id', userId)
        .single()

      if (!distribution) {
        throw new Error('Reward not found or not owned by user')
      }

      if (distribution.status === 'claimed') {
        throw new Error('Reward already claimed')
      }

      // Mark as claimed
      await supabase
        .from('reward_distributions')
        .update({
          status: 'claimed',
          claimed_at: new Date().toISOString()
        })
        .eq('id', distributionId)

      // Create success notification
      await this.createRewardNotification(
        userId,
        'Reward Claimed!',
        'Your reward has been successfully claimed.',
        'reward_claimed'
      )

    } catch (error) {
      console.error('Failed to claim reward:', error)
      throw error
    }
  }

  async getUserRewards(userId: string): Promise<RewardDistribution[]> {
    const { data, error } = await supabase
      .from('reward_distributions')
      .select('*')
      .eq('user_id', userId)
      .order('distributed_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async getAvailableRewards(userId: string): Promise<Reward[]> {
    // Get user stats for eligibility checking
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (!profile) return []

    // Mock available rewards based on user progress
    const rewards: Reward[] = [
      {
        id: 'level_up_bonus',
        type: 'xp',
        name: 'Level Up Bonus',
        description: 'Extra XP for reaching the next level',
        value: 500,
        requirements: { xp_threshold: profile.xp_points + 100 },
        rarity: 'common',
        is_active: true
      },
      {
        id: 'streak_master',
        type: 'badge',
        name: 'Streak Master Badge',
        description: 'Awarded for consistent daily activity',
        value: 'streak_master_badge',
        requirements: { level_required: 'rising_star' },
        rarity: 'rare',
        is_active: profile.level !== 'rookie'
      }
    ]

    return rewards.filter(reward => reward.is_active)
  }

  // Automated reward distribution for milestones
  async checkAndDistributeMilestoneRewards(userId: string): Promise<void> {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (!profile) return

      // Check for XP milestones
      const xpMilestones = [100, 500, 1000, 2500, 5000, 10000]
      for (const milestone of xpMilestones) {
        if (profile.xp_points >= milestone) {
          // Check if already awarded
          const { data: existing } = await supabase
            .from('reward_distributions')
            .select('id')
            .eq('user_id', userId)
            .eq('reward_name', `XP Milestone: ${milestone}`)
            .single()

          if (!existing) {
            const reward: Reward = {
              id: `xp_milestone_${milestone}`,
              type: 'badge',
              name: `XP Milestone: ${milestone}`,
              description: `Reached ${milestone} XP points`,
              value: `xp_milestone_${milestone}_badge`,
              requirements: { xp_threshold: milestone },
              rarity: milestone >= 5000 ? 'epic' : milestone >= 1000 ? 'rare' : 'common',
              is_active: true
            }

            await this.distributeRewardToUser(userId, reward)
          }
        }
      }

      // Check for streak milestones
      const streakMilestones = [7, 30, 100]
      for (const milestone of streakMilestones) {
        if (profile.streak_days >= milestone) {
          const { data: existing } = await supabase
            .from('reward_distributions')
            .select('id')
            .eq('user_id', userId)
            .eq('reward_name', `Streak Milestone: ${milestone} days`)
            .single()

          if (!existing) {
            const reward: Reward = {
              id: `streak_milestone_${milestone}`,
              type: 'xp',
              name: `Streak Milestone: ${milestone} days`,
              description: `Bonus XP for ${milestone} day streak`,
              value: milestone * 10,
              requirements: {},
              rarity: 'rare',
              is_active: true
            }

            await this.distributeRewardToUser(userId, reward)
          }
        }
      }

    } catch (error) {
      console.error('Failed to check milestone rewards:', error)
    }
  }
}

export const rewardService = new RewardService()
export type { Reward, RewardDistribution, ContestRewards }