import { cn } from '../../lib/utils'

interface ProgressProps {
  value: number
  max?: number
  className?: string
  showLabel?: boolean
  animated?: boolean
}

export function Progress({ 
  value, 
  max = 100, 
  className, 
  showLabel = false,
  animated = true 
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  
  return (
    <div className={cn('progress-bar', className)}>
      <div 
        className={cn(
          'progress-fill',
          !animated && 'transition-none'
        )}
        style={{ width: `${percentage}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemax={max}
        aria-valuemin={0}
      />
      {showLabel && (
        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-text-primary">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  )
}