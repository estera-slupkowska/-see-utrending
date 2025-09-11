import { forwardRef, type ReactNode } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full text-xs font-medium transition-all duration-300',
  {
    variants: {
      variant: {
        default: 'bg-surface border border-border text-text-secondary',
        primary: 'bg-primary text-text-primary',
        success: 'bg-success-green text-text-primary',
        warning: 'bg-warning-amber text-text-inverse',
        error: 'bg-error-red text-text-primary',
        achievement: 'achievement-badge',
        xp: 'bg-xp-gold text-text-inverse',
        streak: 'bg-streak-orange text-text-inverse',
        live: 'bg-live-green text-text-primary animate-pulse',
      },
      size: {
        sm: 'px-2 py-1 text-xs',
        default: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base',
        achievement: 'w-16 h-16', // For achievement badges
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children: ReactNode
  unlocked?: boolean
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, unlocked, children, ...props }, ref) => {
    return (
      <div
        className={cn(
          badgeVariants({ variant, size }),
          unlocked && variant === 'achievement' && 'unlocked',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Badge.displayName = 'Badge'

export { Badge, badgeVariants }