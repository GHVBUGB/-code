import * as React from 'react'
import { cn } from '@/lib/utils'

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'secondary' | 'error'
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, size = 'md', variant = 'default', children, ...props }, ref) => {

    const sizeClasses = {
      sm: 'text-sm',
      md: 'text-sm',
      lg: 'text-base',
    }

    const variantClasses = {
      default: 'text-neutral-700',
      secondary: 'text-neutral-500',
      error: 'text-error-600',
    }

    return (
      <label
        ref={ref}
        className={cn(
          'font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        {...props}
      >
        {children}
        {required && <span className="text-error-500 ml-1">*</span>}
      </label>
    )
  }
)
Label.displayName = 'Label'

export { Label }