/**
 * Container Component - 容器组件
 * 提供响应式布局和统一间距的容器
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const containerVariants = cva(
  'mx-auto w-full',
  {
    variants: {
      size: {
        xs: 'max-w-xs',
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        '6xl': 'max-w-6xl',
        '7xl': 'max-w-7xl',
        full: 'max-w-full',
      },
      padding: {
        none: 'px-0',
        xs: 'px-2',
        sm: 'px-3',
        md: 'px-4',
        lg: 'px-6',
        xl: 'px-8',
      },
      center: {
        true: 'flex items-center justify-center',
        false: '',
      },
    },
    defaultVariants: {
      size: 'lg',
      padding: 'md',
      center: false,
    },
  }
)

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  as?: React.ElementType
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, center, as: Comp = 'div', ...props }, ref) => {
    return (
      <Comp
        ref={ref}
        className={cn(containerVariants({ size, padding, center }), className)}
        {...props}
      />
    )
  }
)
Container.displayName = 'Container'

export { Container }
export type { ContainerProps }