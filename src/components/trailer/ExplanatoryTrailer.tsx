import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Play, ExternalLink } from 'lucide-react'

interface ExplanatoryTrailerProps {
  className?: string
}

export function ExplanatoryTrailer({ className = '' }: ExplanatoryTrailerProps) {
  const { t } = useTranslation()
  const [isHovered, setIsHovered] = useState(false)

  // Placeholder YouTube video - Rick Astley "Never Gonna Give You Up"
  const youtubeVideoId = 'dQw4w9WgXcQ'
  const youtubeUrl = `https://www.youtube.com/watch?v=${youtubeVideoId}`
  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`

  const handleVideoClick = () => {
    window.open(youtubeUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className={`py-16 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Title */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-4">
            {t('trailer.title')}
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            {t('trailer.description')}
          </p>
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
              alt="SeeUTrending Explanatory Trailer"
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
                    {t('trailer.videoTitle')}
                  </h3>
                  <p className="text-white/80 text-sm">
                    {t('trailer.videoDescription')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-xs">
                    {t('trailer.clickToWatch')}
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
        <div className="mt-6">
          <p className="text-text-muted text-sm">
            {t('trailer.cta')}
          </p>
        </div>
      </div>
    </section>
  )
}