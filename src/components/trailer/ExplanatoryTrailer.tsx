import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Play, ExternalLink, Loader } from 'lucide-react'
import { ContentService, TrailerConfig } from '../../services/admin/content.service'

interface ExplanatoryTrailerProps {
  className?: string
}

export function ExplanatoryTrailer({ className = '' }: ExplanatoryTrailerProps) {
  const { t, i18n } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)
  const [trailerConfig, setTrailerConfig] = useState<TrailerConfig | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch trailer configuration on mount
  useEffect(() => {
    loadTrailerConfig()
  }, [])

  const loadTrailerConfig = async () => {
    try {
      setLoading(true)
      const config = await ContentService.getTrailerConfig()
      setTrailerConfig(config)
    } catch (error) {
      console.error('Failed to load trailer config:', error)
      // Fall back to default config on error
      setTrailerConfig({
        id: '',
        youtube_video_id: 'dQw4w9WgXcQ',
        title_pl: 'Jak to działa',
        title_en: 'How it Works',
        description_pl: 'Zobacz krótki film wyjaśniający, jak działa platforma SeeUTrending',
        description_en: 'Watch a short video explaining how the SeeUTrending platform works',
        visible: true,
        updated_at: new Date().toISOString()
      })
    } finally {
      setLoading(false)
    }
  }

  // Don't render if config is not loaded or not visible
  if (loading || !trailerConfig || !trailerConfig.visible) {
    return null
  }

  const isPolish = i18n.language === 'pl'
  const youtubeVideoId = trailerConfig.youtube_video_id
  const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeVideoId}`
  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`
  const title = isPolish ? trailerConfig.title_pl : trailerConfig.title_en
  const description = isPolish ? trailerConfig.description_pl : trailerConfig.description_en

  const handleVideoClick = () => {
    window.open(youtubeUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className={`py-16 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Title */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Video Thumbnail with Hover Effects */}
        <div
          className="relative group cursor-pointer transform transition-all duration-500 hover:scale-105"
          onClick={handleVideoClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Video Container */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-primary/20 hover:border-primary/50 transition-all duration-300">

            {/* Thumbnail Image */}
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full aspect-video object-cover"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`
                flex items-center justify-center w-20 h-20 bg-primary/90 rounded-full
                transition-all duration-300 group-hover:scale-110 group-hover:bg-primary
                ${isHovered ? 'animate-pulse' : ''}
              `}>
                <Play className="w-8 h-8 text-white ml-1" fill="currentColor" />
              </div>
            </div>

            {/* Corner Badge */}
            <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              YouTube
            </div>

            {/* Bottom Info Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h3 className="text-white font-semibold text-lg">
                    {title}
                  </h3>
                  {description && (
                    <p className="text-white/80 text-sm">
                      {description}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-xs">
                    {isPolish ? 'Kliknij aby obejrzeć' : 'Click to watch'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Glow Effect on Hover */}
          <div className={`
            absolute inset-0 rounded-2xl transition-opacity duration-300
            bg-gradient-to-br from-primary/20 to-accent/20 blur-xl -z-10
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `} />
        </div>

        {/* Call to Action */}
        {description && (
          <div className="mt-6">
            <p className="text-text-muted text-sm">
              {isPolish ? 'Kliknij na wideo powyżej aby obejrzeć pełny film' : 'Click the video above to watch the full video'}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}