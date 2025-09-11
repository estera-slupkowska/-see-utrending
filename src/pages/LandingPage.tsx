import { HeroSection } from '../components/landing/HeroSection'
import { LockedLeaderboard } from '../components/leaderboard/LockedLeaderboard'
import { UpdatesSection } from '../components/landing/UpdatesSection'
import { HowItWorksSection } from '../components/landing/HowItWorksSection'
import { CosmicBackground } from '../components/ui'

export function LandingPage() {
  return (
    <div className="cosmic-background min-h-screen relative overflow-hidden">
      {/* Cosmic Background with Stars and Planets */}
      <CosmicBackground />
      
      {/* Enhanced background gradient overlay */}
      <div className="absolute inset-0 gradient-overlay-rising opacity-25 z-10"></div>
      
      <div className="relative z-20">
        <HeroSection />
        <LockedLeaderboard />
        <UpdatesSection />
        <HowItWorksSection />
      </div>
    </div>
  )
}