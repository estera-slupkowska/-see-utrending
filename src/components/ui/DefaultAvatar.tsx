interface DefaultAvatarProps {
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-20 h-20 text-xl'
}

const colors = [
  'bg-gradient-to-br from-purple-500 to-pink-500',
  'bg-gradient-to-br from-blue-500 to-cyan-500',
  'bg-gradient-to-br from-green-500 to-emerald-500',
  'bg-gradient-to-br from-yellow-500 to-orange-500',
  'bg-gradient-to-br from-red-500 to-rose-500',
  'bg-gradient-to-br from-indigo-500 to-purple-500'
]

export function DefaultAvatar({ name = 'User', size = 'md', className = '' }: DefaultAvatarProps) {
  // Get initials from name
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // Select color based on name hash
  const colorIndex = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
  const bgColor = colors[colorIndex]

  return (
    <div
      className={`${sizeClasses[size]} ${bgColor} ${className} rounded-full flex items-center justify-center text-white font-bold shadow-lg animate-pulse-glow`}
    >
      {initials}
    </div>
  )
}