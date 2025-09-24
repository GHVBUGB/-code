import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'outline' | 'filled' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  error?: boolean
  success?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type,
    variant = 'default',
    size = 'md',
    error = false,
    success = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    ...props
  }, ref) => {

    const sizeClasses = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-4 text-base',
    }

    const variantClasses = {
      default: 'border border-border bg-input focus:border-primary-500 focus:ring-primary-500',
      outline: 'border-2 border-border bg-transparent focus:border-primary-500 focus:ring-primary-500',
      filled: 'border border-transparent bg-muted focus:bg-input focus:border-primary-500',
      ghost: 'border border-transparent bg-transparent focus:bg-muted focus:border-border',
    }

    const stateClasses = {
      normal: '',
      error: 'border-error-500 focus:border-error-500 focus:ring-error-500',
      success: 'border-success-500 focus:border-success-500 focus:ring-success-500',
    }

    const currentState = error ? 'error' : success ? 'success' : 'normal'

    return (
      <div className={cn('relative', fullWidth && 'w-full')} >
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            'flex w-full rounded-md border border-border bg-input px-3 py-2 text-sm placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            sizeClasses[size],
            variantClasses[variant],
            stateClasses[currentState],
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            className
          )}
          ref={ref}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }