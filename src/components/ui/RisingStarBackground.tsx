interface RisingStarBackgroundProps {
  className?: string
}

export function RisingStarBackground({ className = '' }: RisingStarBackgroundProps) {
  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
      {/* Clean gradient background using Rising Star colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950/30 to-purple-950/20" />
      
      {/* Subtle accent gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-indigo-500/5 to-purple-500/5" />
      
      {/* Minimal decorative elements */}
      <div className="absolute top-20 right-20 w-2 h-2 bg-indigo-400 rounded-full opacity-60" />
      <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full opacity-40" />
      <div className="absolute top-32 right-48 w-1.5 h-1.5 bg-indigo-300 rounded-full opacity-50" />
    </div>
  )
}