interface KomentarzMasterBackgroundProps {
  className?: string
}

export function KomentarzMasterBackground({ className = '' }: KomentarzMasterBackgroundProps) {
  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
      {/* Clean gradient background using Komentarz Master colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-cyan-950/30 to-blue-950/20" />
      
      {/* Subtle accent gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-cyan-500/5 to-blue-500/5" />
      
      {/* Minimal decorative elements */}
      <div className="absolute top-24 left-20 w-2 h-2 bg-cyan-400 rounded-full opacity-60" />
      <div className="absolute top-36 left-32 w-1 h-1 bg-blue-400 rounded-full opacity-40" />
      <div className="absolute top-28 left-48 w-1.5 h-1.5 bg-cyan-300 rounded-full opacity-50" />
    </div>
  )
}