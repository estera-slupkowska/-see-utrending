import { supabase } from '../../lib/supabase/client'
import { tikTokApi, type TikTokVideoInfo } from './api.service'
import { tikTokAuth } from './auth.service'

interface VideoMetricsUpdate {
  video_id: string
  views_count: number
  likes_count: number
  comments_count: number
  shares_count: number
  engagement_score: number
  quality_score: number
  final_score: number
}

interface ContestSubmission {
  id: string
  contest_id: string
  user_id: string
  tiktok_video_id: string
  tiktok_url: string
  video_title?: string
  video_description?: string
  views_count: number
  likes_count: number
  comments_count: number
  shares_count: number
  engagement_score: number
  quality_score: number
  final_score: number
  status: 'pending' | 'approved' | 'rejected'
  rank_position?: number
  is_winner: boolean
  submitted_at: string
  last_updated: string
}

class VideoMetricsService {
  private readonly POLLING_INTERVAL = 5 * 60 * 1000 // 5 minutes
  private pollingTimer: NodeJS.Timeout | null = null

  async submitVideoToContest(
    contestId: string,
    userId: string,
    videoUrl: string
  ): Promise<ContestSubmission> {
    const videoId = tikTokApi.extractVideoId(videoUrl)
    
    if (!videoId) {
      throw new Error('Invalid TikTok video URL')
    }

    const existingSubmission = await supabase
      .from('contest_submissions')
      .select('id')
      .eq('contest_id', contestId)
      .eq('user_id', userId)
      .eq('tiktok_video_id', videoId)
      .single()

    if (existingSubmission.data) {
      throw new Error('Video already submitted to this contest')
    }

    const accessToken = await tikTokAuth.refreshTokenIfNeeded(userId)
    
    if (!accessToken) {
      throw new Error('TikTok account not connected or token expired')
    }

    let videoInfo: TikTokVideoInfo | null = null
    
    try {
      const response = await tikTokApi.getVideoInfo(accessToken, [videoId])
      videoInfo = response.videos[0]
    } catch (error) {
      console.warn('Failed to fetch video info from TikTok API:', error)
    }

    const engagementScore = videoInfo ? tikTokApi.calculateEngagementScore(videoInfo) : 0
    const qualityScore = this.calculateQualityScore(videoInfo)
    const finalScore = this.calculateFinalScore(engagementScore, qualityScore, videoInfo)

    const { data, error } = await supabase
      .from('contest_submissions')
      .insert({
        contest_id: contestId,
        user_id: userId,
        tiktok_video_id: videoId,
        tiktok_url: videoUrl,
        video_title: videoInfo?.title,
        video_description: videoInfo?.video_description,
        views_count: videoInfo?.view_count || 0,
        likes_count: videoInfo?.like_count || 0,
        comments_count: videoInfo?.comment_count || 0,
        shares_count: videoInfo?.share_count || 0,
        engagement_score: engagementScore,
        quality_score: qualityScore,
        final_score: finalScore,
        status: 'pending',
      })
      .select('*')
      .single()

    if (error) {
      throw new Error(`Failed to submit video: ${error.message}`)
    }

    await this.updateContestStats(contestId)
    return data
  }

  async updateVideoMetrics(submissionId: string): Promise<VideoMetricsUpdate | null> {
    const { data: submission } = await supabase
      .from('contest_submissions')
      .select('*, profiles!inner(*)')
      .eq('id', submissionId)
      .single()

    if (!submission) {
      return null
    }

    const accessToken = await tikTokAuth.refreshTokenIfNeeded(submission.user_id)
    
    if (!accessToken) {
      console.warn(`No valid access token for user ${submission.user_id}`)
      return null
    }

    try {
      const response = await tikTokApi.getVideoInfo(accessToken, [submission.tiktok_video_id])
      const videoInfo = response.videos[0]

      if (!videoInfo) {
        return null
      }

      const engagementScore = tikTokApi.calculateEngagementScore(videoInfo)
      const qualityScore = this.calculateQualityScore(videoInfo)
      const finalScore = this.calculateFinalScore(engagementScore, qualityScore, videoInfo)

      const update: VideoMetricsUpdate = {
        video_id: submission.tiktok_video_id,
        views_count: videoInfo.view_count,
        likes_count: videoInfo.like_count,
        comments_count: videoInfo.comment_count,
        shares_count: videoInfo.share_count,
        engagement_score: engagementScore,
        quality_score: qualityScore,
        final_score: finalScore,
      }

      await supabase
        .from('contest_submissions')
        .update({
          views_count: update.views_count,
          likes_count: update.likes_count,
          comments_count: update.comments_count,
          shares_count: update.shares_count,
          engagement_score: update.engagement_score,
          quality_score: update.quality_score,
          final_score: update.final_score,
          last_updated: new Date().toISOString(),
        })
        .eq('id', submissionId)

      return update
    } catch (error) {
      console.error(`Failed to update metrics for submission ${submissionId}:`, error)
      return null
    }
  }

  async updateAllActiveContestMetrics(): Promise<void> {
    const { data: contests } = await supabase
      .from('contests')
      .select('id')
      .eq('status', 'active')

    if (!contests) return

    for (const contest of contests) {
      await this.updateContestSubmissionMetrics(contest.id)
      await this.updateContestRankings(contest.id)
      await this.updateContestStats(contest.id)
    }
  }

  async updateContestSubmissionMetrics(contestId: string): Promise<void> {
    const { data: submissions } = await supabase
      .from('contest_submissions')
      .select('id, user_id, tiktok_video_id')
      .eq('contest_id', contestId)
      .eq('status', 'approved')

    if (!submissions) return

    const updatePromises = submissions.map(submission => 
      this.updateVideoMetrics(submission.id)
    )

    await Promise.allSettled(updatePromises)
  }

  async updateContestRankings(contestId: string): Promise<void> {
    const { data: submissions } = await supabase
      .from('contest_submissions')
      .select('id, final_score')
      .eq('contest_id', contestId)
      .eq('status', 'approved')
      .order('final_score', { ascending: false })

    if (!submissions) return

    const rankingUpdates = submissions.map((submission, index) => ({
      id: submission.id,
      rank_position: index + 1,
      is_winner: index < 3, // Top 3 are winners
    }))

    for (const update of rankingUpdates) {
      await supabase
        .from('contest_submissions')
        .update({
          rank_position: update.rank_position,
          is_winner: update.is_winner,
        })
        .eq('id', update.id)
    }
  }

  async updateContestStats(contestId: string): Promise<void> {
    const { data: stats } = await supabase
      .from('contest_submissions')
      .select('views_count, likes_count, comments_count')
      .eq('contest_id', contestId)
      .eq('status', 'approved')

    if (!stats) return

    const totalStats = stats.reduce(
      (acc, submission) => ({
        total_submissions: acc.total_submissions + 1,
        total_views: acc.total_views + (submission.views_count || 0),
        total_likes: acc.total_likes + (submission.likes_count || 0),
        total_comments: acc.total_comments + (submission.comments_count || 0),
      }),
      { total_submissions: 0, total_views: 0, total_likes: 0, total_comments: 0 }
    )

    await supabase
      .from('contests')
      .update(totalStats)
      .eq('id', contestId)
  }

  private calculateQualityScore(video: TikTokVideoInfo | null): number {
    if (!video) return 0

    let score = 50 // Base score

    if (video.title && video.title.length > 10) score += 10
    if (video.video_description && video.video_description.length > 20) score += 10
    if (video.duration >= 15) score += 10 // Reasonable length
    if (video.duration <= 60) score += 10 // Not too long

    const ageHours = tikTokApi.getVideoAgeInHours(video)
    if (ageHours <= 24) score += 20 // Recent content bonus

    return Math.min(score, 100)
  }

  private calculateFinalScore(
    engagementScore: number,
    qualityScore: number,
    video: TikTokVideoInfo | null
  ): number {
    const engagementWeight = 0.6
    const qualityWeight = 0.2
    const viralityWeight = 0.2

    let viralityScore = 0
    if (video) {
      const viewsNormalized = Math.min(video.view_count / 1000000, 1) * 100
      const likesRatio = video.like_count / Math.max(video.view_count, 1)
      const commentsRatio = video.comment_count / Math.max(video.view_count, 1)
      
      viralityScore = (viewsNormalized * 0.5) + (likesRatio * 100 * 0.3) + (commentsRatio * 100 * 0.2)
    }

    return Math.round(
      engagementScore * engagementWeight +
      qualityScore * qualityWeight +
      viralityScore * viralityWeight
    )
  }

  startPolling(): void {
    if (this.pollingTimer) {
      this.stopPolling()
    }

    this.pollingTimer = setInterval(async () => {
      try {
        await this.updateAllActiveContestMetrics()
        console.log('Metrics updated at', new Date().toISOString())
      } catch (error) {
        console.error('Failed to update metrics:', error)
      }
    }, this.POLLING_INTERVAL)

    console.log('Started TikTok metrics polling')
  }

  stopPolling(): void {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer)
      this.pollingTimer = null
      console.log('Stopped TikTok metrics polling')
    }
  }

  async getContestSubmissions(contestId: string): Promise<ContestSubmission[]> {
    const { data, error } = await supabase
      .from('contest_submissions')
      .select(`
        *,
        profiles!inner(
          name,
          tiktok_handle,
          avatar_url
        )
      `)
      .eq('contest_id', contestId)
      .eq('status', 'approved')
      .order('rank_position', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch submissions: ${error.message}`)
    }

    return data || []
  }

  async getUserSubmissions(userId: string): Promise<ContestSubmission[]> {
    const { data, error } = await supabase
      .from('contest_submissions')
      .select(`
        *,
        contests!inner(
          title,
          status,
          start_date,
          end_date
        )
      `)
      .eq('user_id', userId)
      .order('submitted_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch user submissions: ${error.message}`)
    }

    return data || []
  }
}

export const videoMetricsService = new VideoMetricsService()
export type { VideoMetricsUpdate, ContestSubmission }