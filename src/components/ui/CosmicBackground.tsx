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
      {/* Cosmic Background Gradient - Brighter */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-400/10 via-blue-400/8 to-indigo-900/15" />
      
      {/* Twinkling Stars Layer 1 - Small & Bright */}
      {Array.from({ length: 40 }).map((_, i) => (
        <div
          key={`star-small-${i}`}
          className="cosmic-star absolute w-1 h-1 bg-white rounded-full animate-twinkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
            opacity: 0.4 + Math.random() * 0.5
          }}
        />
      ))}

      {/* Twinkling Stars Layer 2 - Medium & Bright */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={`star-medium-${i}`}
          className="cosmic-star absolute w-1.5 h-1.5 bg-cyan-200 rounded-full animate-twinkle-slow"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${3 + Math.random() * 3}s`,
            opacity: 0.5 + Math.random() * 0.4
          }}
        />
      ))}

      {/* Twinkling Stars Layer 3 - Large & Colorful */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={`star-large-${i}`}
          className="cosmic-star absolute w-2 h-2 rounded-full animate-pulse-slow"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${4 + Math.random() * 2}s`,
            opacity: 0.6 + Math.random() * 0.3,
            background: i % 3 === 0 ? '#fef08a' : i % 3 === 1 ? '#a5f3fc' : '#e9d5ff'
          }}
        />
      ))}

      {/* Nebula Clouds - Brighter & More Colorful with Balanced Distribution */}
      {Array.from({ length: 7 }).map((_, i) => (
        <div
          key={`nebula-${i}`}
          className="cosmic-nebula absolute rounded-full bg-gradient-radial animate-float-slow"
          style={{
            left: `${8 + i * 14}%`,
            top: `${5 + (i * 13) % 80}%`,
            width: `${100 + (i * 30)}px`,
            height: `${100 + (i * 30)}px`,
            background: i % 3 === 0
              ? `radial-gradient(circle, rgba(168, 85, 247, 0.25) 0%, transparent 70%)`
              : i % 3 === 1
              ? `radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)`
              : `radial-gradient(circle, rgba(251, 191, 36, 0.20) 0%, transparent 70%)`,
            animationDelay: `${i * 1.5}s`,
            animationDuration: `${7 + i * 1.5}s`
          }}
        />
      ))}

      {/* Planets - Brighter with Enhanced Glow */}
      <div
        className="cosmic-planet absolute w-12 h-12 rounded-full bg-gradient-to-br from-purple-400/30 to-pink-600/25 animate-orbit-slow"
        style={{
          right: '15%',
          top: '20%',
          animationDuration: '25s',
          boxShadow: '0 0 40px rgba(168, 85, 247, 0.5), 0 0 60px rgba(236, 72, 153, 0.3)'
        }}
      />

      <div
        className="cosmic-planet absolute w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400/30 to-blue-500/25 animate-orbit-reverse"
        style={{
          left: '10%',
          top: '60%',
          animationDuration: '30s',
          boxShadow: '0 0 30px rgba(6, 182, 212, 0.5), 0 0 50px rgba(59, 130, 246, 0.3)'
        }}
      />

      <div
        className="cosmic-planet absolute w-6 h-6 rounded-full bg-gradient-to-br from-yellow-300/35 to-orange-400/30 animate-float"
        style={{
          right: '25%',
          bottom: '30%',
          animationDuration: '20s',
          boxShadow: '0 0 25px rgba(251, 191, 36, 0.6), 0 0 40px rgba(251, 146, 60, 0.4)'
        }}
      />

      <div
        className="cosmic-planet absolute w-10 h-10 rounded-full bg-gradient-to-br from-pink-400/30 to-purple-600/25 animate-orbit-reverse"
        style={{
          left: '5%',
          top: '25%',
          animationDuration: '28s',
          boxShadow: '0 0 35px rgba(236, 72, 153, 0.5), 0 0 55px rgba(168, 85, 247, 0.3)'
        }}
      />

      {/* Shooting Stars - Colorful */}
      {Array.from({ length: 5 }).map((_, i) => {
        const colors = [
          'from-yellow-200 via-yellow-300 to-transparent',
          'from-pink-200 via-pink-300 to-transparent',
          'from-cyan-200 via-cyan-300 to-transparent',
          'from-white to-transparent',
          'from-purple-200 via-purple-300 to-transparent'
        ]
        return (
          <div
            key={`shooting-star-${i}`}
            className={`absolute w-0.5 h-24 bg-gradient-to-b ${colors[i]} animate-shooting-star opacity-0`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 50}%`,
              animationDelay: `${Math.random() * 10 + 3}s`,
              animationDuration: '1.5s',
              transform: 'rotate(45deg)'
            }}
          />
        )
      })}

      {/* Distant Galaxy */}
      <div
        className="cosmic-nebula absolute w-32 h-16 rounded-full opacity-3 animate-pulse-ultra-slow"
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