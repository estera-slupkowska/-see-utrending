interface TikTokApiResponse<T = any> {
  data?: T
  error?: {
    code: string
    message: string
    log_id: string
  }
}

interface TikTokUserInfo {
  open_id: string
  union_id: string
  avatar_url: string
  avatar_url_100: string
  avatar_url_200: string
  display_name: string
  bio_description?: string
  profile_deep_link: string
  is_verified: boolean
  follower_count: number
  following_count: number
  likes_count: number
  video_count: number
}

interface TikTokVideoInfo {
  id: string
  title: string
  video_description: string
  duration: number
  cover_image_url: string
  create_time: number
  share_url: string
  embed_html: string
  embed_link: string
  like_count: number
  comment_count: number
  share_count: number
  view_count: number
}

interface TikTokVideoListResponse {
  videos: TikTokVideoInfo[]
  cursor: string
  has_more: boolean
}

class TikTokApiError extends Error {
  constructor(
    message: string,
    public code: string,
    public logId?: string
  ) {
    super(message)
    this.name = 'TikTokApiError'
  }
}

class TikTokApiService {
  private baseUrl = 'https://open.tiktokapis.com'
  private rateLimitRemaining = 100
  private rateLimitReset = Date.now() + 60000

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit,
    accessToken: string
  ): Promise<T> {
    await this.checkRateLimit()

    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    this.updateRateLimit(response)

    const data: TikTokApiResponse<T> = await response.json()

    if (data.error) {
      throw new TikTokApiError(
        data.error.message,
        data.error.code,
        data.error.log_id
      )
    }

    if (!response.ok) {
      throw new TikTokApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        'HTTP_ERROR'
      )
    }

    return data.data as T
  }

  private async checkRateLimit(): Promise<void> {
    if (this.rateLimitRemaining <= 0) {
      const waitTime = this.rateLimitReset - Date.now()
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime))
      }
    }
  }

  private updateRateLimit(response: Response): void {
    const remaining = response.headers.get('X-RateLimit-Remaining')
    const reset = response.headers.get('X-RateLimit-Reset')

    if (remaining) {
      this.rateLimitRemaining = parseInt(remaining)
    }
    
    if (reset) {
      this.rateLimitReset = parseInt(reset) * 1000
    }
  }

  async getUserInfo(accessToken: string): Promise<TikTokUserInfo> {
    return this.makeRequest<TikTokUserInfo>(
      '/v2/user/info/',
      { method: 'GET' },
      accessToken
    )
  }

  async getUserVideos(
    accessToken: string,
    cursor?: string,
    maxCount = 20
  ): Promise<TikTokVideoListResponse> {
    const params = new URLSearchParams({
      max_count: maxCount.toString(),
    })

    if (cursor) {
      params.append('cursor', cursor)
    }

    return this.makeRequest<TikTokVideoListResponse>(
      `/v2/video/list/?${params.toString()}`,
      { method: 'GET' },
      accessToken
    )
  }

  async getVideoInfo(
    accessToken: string,
    videoIds: string[]
  ): Promise<{ videos: TikTokVideoInfo[] }> {
    return this.makeRequest<{ videos: TikTokVideoInfo[] }>(
      '/v2/video/query/',
      {
        method: 'POST',
        body: JSON.stringify({
          video_ids: videoIds,
        }),
      },
      accessToken
    )
  }

  extractVideoId(url: string): string | null {
    const patterns = [
      /tiktok\.com\/@[\w.-]+\/video\/(\d+)/,
      /tiktok\.com\/t\/(\w+)/,
      /vm\.tiktok\.com\/(\w+)/,
      /vt\.tiktok\.com\/(\w+)/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return match[1]
      }
    }

    return null
  }

  isValidTikTokUrl(url: string): boolean {
    return this.extractVideoId(url) !== null
  }

  calculateEngagementScore(video: TikTokVideoInfo): number {
    if (video.view_count === 0) return 0

    const engagementRate = (
      (video.like_count + video.comment_count + video.share_count) / 
      video.view_count
    ) * 100

    const viewWeight = Math.log10(video.view_count + 1) / 10
    const likeWeight = video.like_count / Math.max(video.view_count, 1)
    const commentWeight = (video.comment_count * 2) / Math.max(video.view_count, 1)
    const shareWeight = (video.share_count * 3) / Math.max(video.view_count, 1)

    return Math.round(
      engagementRate * 0.4 + 
      viewWeight * 0.3 + 
      (likeWeight + commentWeight + shareWeight) * 0.3
    )
  }

  getVideoAgeInHours(video: TikTokVideoInfo): number {
    return (Date.now() / 1000 - video.create_time) / 3600
  }

  isRecentVideo(video: TikTokVideoInfo, maxAgeHours = 72): boolean {
    return this.getVideoAgeInHours(video) <= maxAgeHours
  }
}

export const tikTokApi = new TikTokApiService()
export type { 
  TikTokUserInfo, 
  TikTokVideoInfo, 
  TikTokVideoListResponse,
  TikTokApiResponse
}
export { TikTokApiError }