import { useEffect, useRef } from 'react'

interface CosmicBackgroundProps {
  className?: string
}

export function CosmicBackground({ className = '' }: CosmicBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollY = window.scrollY
      const stars = container.querySelectorAll('.cosmic-star')
      const planets = container.querySelectorAll('.cosmic-planet')
      const nebula = container.querySelectorAll('.cosmic-nebula')

      // Animate stars with parallax
      stars.forEach((star, index) => {
        const speed = 0.5 + (index % 3) * 0.2
        const yPos = -(scrollY * speed)
        ;(star as HTMLElement).style.transform = `translateY(${yPos}px) rotate(${scrollY * 0.1}deg)`
      })

      // Animate planets with different speeds
      planets.forEach((planet, index) => {
        const speed = 0.3 + (index % 2) * 0.2
        const yPos = -(scrollY * speed)
        const rotation = scrollY * 0.05 * (index + 1)
        ;(planet as HTMLElement).style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`
      })

      // Animate nebula with slow movement
      nebula.forEach((neb, index) => {
        const speed = 0.1 + (index % 2) * 0.05
        const yPos = -(scrollY * speed)
        ;(neb as HTMLElement).style.transform = `translateY(${yPos}px) scale(${1 + scrollY * 0.0001})`
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div 
      ref={containerRef} 
      className={`fixed inset-0 overflow-hidden pointer-events-none z-0 ${className}`}
    >
      {/* Cosmic Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/5 via-blue-900/10 to-black/20" />
      
      {/* Twinkling Stars Layer 1 - Small */}
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={`star-small-${i}`}
          className="cosmic-star absolute w-1 h-1 bg-white rounded-full animate-twinkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            opacity: 0.3 + Math.random() * 0.7
          }}
        />
      ))}

      {/* Twinkling Stars Layer 2 - Medium */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={`star-medium-${i}`}
          className="cosmic-star absolute w-1.5 h-1.5 bg-blue-200 rounded-full animate-twinkle-slow"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${3 + Math.random() * 3}s`,
            opacity: 0.4 + Math.random() * 0.6
          }}
        />
      ))}

      {/* Twinkling Stars Layer 3 - Large */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={`star-large-${i}`}
          className="cosmic-star absolute w-2 h-2 bg-purple-200 rounded-full animate-pulse-slow"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${4 + Math.random() * 2}s`,
            opacity: 0.2 + Math.random() * 0.5
          }}
        />
      ))}

      {/* Nebula Clouds */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={`nebula-${i}`}
          className="cosmic-nebula absolute rounded-full bg-gradient-radial opacity-10 animate-float-slow"
          style={{
            left: `${20 + i * 30}%`,
            top: `${10 + i * 25}%`,
            width: `${100 + i * 50}px`,
            height: `${100 + i * 50}px`,
            background: i % 2 === 0 
              ? `radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)`
              : `radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)`,
            animationDelay: `${i * 2}s`,
            animationDuration: `${8 + i * 2}s`
          }}
        />
      ))}

      {/* Planets */}
      <div
        className="cosmic-planet absolute w-12 h-12 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-600/20 animate-orbit-slow"
        style={{
          right: '15%',
          top: '20%',
          animationDuration: '25s',
          boxShadow: '0 0 20px rgba(168, 85, 247, 0.3)'
        }}
      />
      
      <div
        className="cosmic-planet absolute w-8 h-8 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-500/20 animate-orbit-reverse"
        style={{
          left: '10%',
          top: '60%',
          animationDuration: '30s',
          boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)'
        }}
      />

      <div
        className="cosmic-planet absolute w-6 h-6 rounded-full bg-gradient-to-br from-yellow-400/20 to-orange-500/20 animate-float"
        style={{
          right: '25%',
          bottom: '30%',
          animationDuration: '20s',
          boxShadow: '0 0 10px rgba(251, 146, 60, 0.4)'
        }}
      />

      {/* Shooting Stars */}
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={`shooting-star-${i}`}
          className="absolute w-0.5 h-20 bg-gradient-to-b from-white to-transparent animate-shooting-star opacity-0"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50}%`,
            animationDelay: `${Math.random() * 10 + 5}s`,
            animationDuration: '2s',
            transform: 'rotate(45deg)'
          }}
        />
      ))}

      {/* Distant Galaxy */}
      <div
        className="cosmic-nebula absolute w-32 h-16 rounded-full opacity-5 animate-pulse-ultra-slow"
        style={{
          right: '5%',
          bottom: '15%',
          background: 'radial-gradient(ellipse, rgba(168, 85, 247, 0.3) 0%, transparent 70%)',
          animationDuration: '12s'
        }}
      />
    </div>
  )
}