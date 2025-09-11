import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'btn-primary',
        primary: 'btn-primary',
        secondary: 'btn-secondary', 
        gaming: 'btn-gaming',
        ghost: 'text-text-primary hover:bg-surface hover:text-text-primary rounded-lg',
        destructive: 'bg-error-red text-text-primary hover:bg-red-600 rounded-lg px-6 py-3 font-semibold transition-all duration-200',
        // Legacy support
        glow: 'btn-primary',
        outline: 'btn-secondary',
      },
      size: {
        default: '',  // Size is handled by btn-* classes
        sm: 'text-xs px-4 py-2',
        lg: 'text-base px-8 py-4',
        xl: 'text-lg px-10 py-5',
        icon: 'p-3 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }