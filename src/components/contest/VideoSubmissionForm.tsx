import { useState } from 'react'
import { Button } from '../ui'
import { Upload, ExternalLink, CheckCircle, AlertCircle, Loader } from 'lucide-react'

interface VideoSubmissionFormProps {
  contestId: string
  contestTitle: string
  onSubmissionSuccess?: (submission: any) => void
}

interface SubmissionResult {
  id: string
  tiktok_url: string
  video_title: string
  status: 'pending' | 'approved' | 'rejected'
  submitted_at: string
  engagement_score: number
  quality_score: number
  final_score: number
}

export function VideoSubmissionForm({ contestId, contestTitle, onSubmissionSuccess }: VideoSubmissionFormProps) {
  const [videoUrl, setVideoUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submission, setSubmission] = useState<SubmissionResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const validateTikTokUrl = (url: string): boolean => {
    const tikTokPatterns = [
      /^https?:\/\/(?:www\.)?tiktok\.com\/@[\w.-]+\/video\/\d+/,
      /^https?:\/\/vm\.tiktok\.com\/[\w]+/,
      /^https?:\/\/(?:www\.)?tiktok\.com\/t\/[\w]+/
    ]
    
    return tikTokPatterns.some(pattern => pattern.test(url))
  }

  const extractVideoId = (url: string): string | null => {
    // Extract video ID from different TikTok URL formats
    const patterns = [
      /\/video\/(\d+)/,
      /vm\.tiktok\.com\/([\w]+)/,
      /tiktok\.com\/t\/([\w]+)/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    
    return null
  }

  const simulateVideoMetrics = (videoId: string) => {
    // Sandbox: Generate realistic but fake metrics
    const baseViews = Math.floor(Math.random() * 100000) + 5000
    const engagementRate = 0.03 + Math.random() * 0.07 // 3-10% engagement
    const likes = Math.floor(baseViews * engagementRate)
    const comments = Math.floor(likes * (0.05 + Math.random() * 0.15)) // 5-20% of likes
    const shares = Math.floor(likes * (0.02 + Math.random() * 0.08)) // 2-10% of likes
    
    return {
      views: baseViews,
      likes,
      comments,
      shares,
      duration: 15 + Math.floor(Math.random() * 45) // 15-60 seconds
    }
  }

  const calculateScores = (metrics: any) => {
    const engagementScore = Math.min(((metrics.likes + metrics.comments * 2 + metrics.shares * 3) / metrics.views) * 1000, 100)
    const qualityScore = 50 + (metrics.duration >= 15 ? 10 : 0) + (metrics.duration <= 60 ? 10 : 0) + Math.random() * 30
    const viralityScore = Math.min((metrics.views / 10000) * 10, 100)
    
    const finalScore = Math.round(
      engagementScore * 0.6 + 
      qualityScore * 0.2 + 
      viralityScore * 0.2
    )
    
    return {
      engagementScore: Math.round(engagementScore),
      qualityScore: Math.round(qualityScore),
      finalScore
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Validate URL
      if (!validateTikTokUrl(videoUrl)) {
        throw new Error('Podaj prawidłowy link do filmu TikTok')
      }

      const videoId = extractVideoId(videoUrl)
      if (!videoId) {
        throw new Error('Nie można wyodrębnić ID filmu z podanego linku')
      }

      // Check TikTok connection
      const isConnected = localStorage.getItem('tiktok_oauth_completed') === 'true'
      if (!isConnected) {
        throw new Error('Połącz swoje konto TikTok przed przesłaniem filmu')
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Sandbox: Generate mock video data
      const mockMetrics = simulateVideoMetrics(videoId)
      const scores = calculateScores(mockMetrics)

      const mockSubmission: SubmissionResult = {
        id: crypto.randomUUID(),
        tiktok_url: videoUrl,
        video_title: `Demo Video ${videoId.substring(0, 8)}`,
        status: 'pending',
        submitted_at: new Date().toISOString(),
        engagement_score: scores.engagementScore,
        quality_score: scores.qualityScore,
        final_score: scores.finalScore
      }

      // Save to localStorage for persistence across reloads
      const existingSubmissions = JSON.parse(localStorage.getItem('contest_submissions') || '[]')
      existingSubmissions.push({
        ...mockSubmission,
        contest_id: contestId,
        contest_title: contestTitle,
        metrics: mockMetrics
      })
      localStorage.setItem('contest_submissions', JSON.stringify(existingSubmissions))

      setSubmission(mockSubmission)
      setVideoUrl('')
      
      if (onSubmissionSuccess) {
        onSubmissionSuccess(mockSubmission)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas przesyłania filmu')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submission) {
    return (
      <div className="card-clean">
        <div className="text-center mb-6">
          <CheckCircle className="w-12 h-12 text-success-green mx-auto mb-4" />
          <h3 className="text-xl font-display font-semibold text-text-primary mb-2">
            Film przesłany pomyślnie!
          </h3>
          <p className="text-text-secondary">
            Twój film został przesłany do konkursu i oczekuje na moderację.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-text-primary">{submission.video_title}</h4>
            <span className="px-2 py-1 text-xs bg-warning-amber/20 text-warning-amber rounded-full">
              {submission.status === 'pending' ? 'Oczekuje' : submission.status}
            </span>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{submission.engagement_score}</p>
              <p className="text-xs text-text-muted">Zaangażowanie</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-success-green">{submission.quality_score}</p>
              <p className="text-xs text-text-muted">Jakość</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-xp-gold">{submission.final_score}</p>
              <p className="text-xs text-text-muted">Wynik końcowy</p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 pt-3 border-t border-border">
            <p className="text-xs text-text-muted">
              Przesłano: {new Date(submission.submitted_at).toLocaleString('pl-PL')}
            </p>
            <Button size="sm" variant="secondary">
              <ExternalLink className="w-3 h-3 mr-1" />
              Zobacz film
            </Button>
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            variant="primary" 
            onClick={() => {
              setSubmission(null)
              setError(null)
            }}
          >
            Prześlij kolejny film
          </Button>
          <Button variant="secondary">
            Zobacz wszystkie zgłoszenia
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="card-clean">
      <div className="flex items-center gap-3 mb-6">
        <Upload className="w-6 h-6 text-primary" />
        <div>
          <h3 className="text-xl font-display font-semibold text-text-primary">
            Prześlij swój film
          </h3>
          <p className="text-text-secondary text-sm">
            Konkurs: {contestTitle}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="videoUrl" className="block text-sm font-medium text-text-primary mb-2">
            Link do filmu TikTok
          </label>
          <input
            id="videoUrl"
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.tiktok.com/@username/video/123456789..."
            className="w-full px-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
            required
            disabled={isSubmitting}
          />
          <p className="text-xs text-text-muted mt-1">
            Wklej link do swojego filmu TikTok, który chcesz przesłać do konkursu
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-error-red/10 border border-error-red/20 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-error-red flex-shrink-0" />
            <p className="text-sm text-error-red">{error}</p>
          </div>
        )}

        <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <h4 className="font-semibold text-text-primary mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
            Kryteria oceny
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div>
              <p className="font-medium text-primary">Zaangażowanie (60%)</p>
              <p className="text-text-muted">Lajki, komentarze, udostępnienia</p>
            </div>
            <div>
              <p className="font-medium text-success-green">Jakość (20%)</p>
              <p className="text-text-muted">Długość, opis, aktualność</p>
            </div>
            <div>
              <p className="font-medium text-xp-gold">Viralność (20%)</p>
              <p className="text-text-muted">Wyświetlenia, tempo wzrostu</p>
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          className="w-full"
          disabled={isSubmitting || !videoUrl.trim()}
        >
          {isSubmitting ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Przesyłanie filmu...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Prześlij film do konkursu
            </>
          )}
        </Button>
      </form>
    </div>
  )
}