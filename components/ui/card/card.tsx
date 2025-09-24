/**
 * Card Component - 卡片组件
 * 基于设计系统的卡片组件，支持多种变体和布局
 */

import * as React from 'react'
import { cn } from '@/lib/utils'
import { colors, radius, shadows, spacing } from '@/lib/design-tokens'
import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Card Variants - 卡片样式变体
 */
const cardVariants = cva(
  'relative overflow-hidden transition-all',
  {
    variants: {
      /* 视觉风格变体 */
      variant: {
        default: [
          'bg-card',
          'border border-border',
          'shadow-sm',
        ],
        elevated: [
          'bg-card',
          'border border-border',
          'shadow-lg',
          'hover:shadow-xl',
        ],
        bordered: [
          'bg-card',
          'border-2 border-border',
          'shadow-none',
        ],
        ghost: [
          'bg-transparent',
          'border border-border',
          'shadow-none',
        ],
        gradient: [
          'bg-gradient-to-br',
          'from-primary-500 to-primary-600',
          'text-white',
          'shadow-lg',
        ],
        dark: [
          'bg-neutral-900',
          'border border-neutral-800',
          'text-white',
          'shadow-lg',
        ],
        glass: [
          'bg-white/10',
          'backdrop-blur-md',
          'border border-white/20',
          'text-white',
        ],
      },
      /* 尺寸变体 */
      size: {
        xs: 'p-2',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
        '2xl': 'p-10',
      },
      /* 圆角变体 */
      radius: {
        none: 'rounded-none',
        sm: 'rounded-sm',
        base: 'rounded-base',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        '3xl': 'rounded-3xl',
        full: 'rounded-full',
      },
      /* 阴影变体 */
      shadow: {
        none: 'shadow-none',
        sm: 'shadow-sm',
        base: 'shadow-base',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
        '2xl': 'shadow-2xl',
      },
      /* 交互状态变体 */
      interactive: {
        none: '',
        hover: 'hover:scale-[1.02] hover:shadow-lg transition-transform',
        clickable: 'cursor-pointer hover:shadow-md active:scale-[0.98]',
      },
      /* 布局变体 */
      layout: {
        vertical: 'flex flex-col',
        horizontal: 'flex flex-row items-center',
        grid: 'grid',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      radius: 'lg',
      shadow: 'sm',
      interactive: 'none',
      layout: 'vertical',
    },
  }
)

/**
 * Card Props - 卡片属性接口
 */
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  as?: React.ElementType
  hover?: boolean
  clickable?: boolean
  elevatedOnHover?: boolean
}

/**
 * Card Component - 卡片组件
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      size,
      radius,
      shadow,
      interactive,
      layout,
      as: Comp = 'div',
      hover = false,
      clickable = false,
      elevatedOnHover = false,
      ...props
    },
    ref
  ) => {
    // 根据props调整交互状态
    const finalInteractive = clickable ? 'clickable' : hover ? 'hover' : interactive

    return (
      <Comp
        ref={ref}
        className={cn(
          cardVariants({
            variant,
            size,
            radius,
            shadow,
            interactive: finalInteractive,
            layout,
          }),
          elevatedOnHover && 'hover:shadow-xl transition-shadow',
          className
        )}
        {...props}
      />
    )
  }
)
Card.displayName = 'Card'

/**
 * Card Header - 卡片头部组件
 */
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  bordered?: boolean
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, align = 'left', size = 'md', bordered = false, ...props }, ref) => {
    const alignClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    }

    const sizeClasses = {
      xs: 'p-2',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col space-y-1.5',
          sizeClasses[size],
          alignClasses[align],
          bordered && 'border-b border-neutral-200',
          className
        )}
        {...props}
      />
    )
  }
)
CardHeader.displayName = 'CardHeader'

/**
 * Card Title - 卡片标题组件
 */
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, as: Comp = 'h3', size = 'md', ...props }, ref) => {
    const sizeClasses = {
      xs: 'text-sm font-medium',
      sm: 'text-base font-semibold',
      md: 'text-lg font-semibold',
      lg: 'text-xl font-bold',
      xl: 'text-2xl font-bold',
      '2xl': 'text-3xl font-bold',
    }

    return (
      <Comp
        ref={ref}
        className={cn(
          'leading-none tracking-tight',
          sizeClasses[size],
          className
        )}
        {...props}
      />
    )
  }
)
CardTitle.displayName = 'CardTitle'

/**
 * Card Description - 卡片描述组件
 */
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: 'xs' | 'sm' | 'md'
}

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, size = 'sm', ...props }, ref) => {
    const sizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
    }

    return (
      <p
        ref={ref}
        className={cn(
          'text-neutral-500',
          sizeClasses[size],
          className
        )}
        {...props}
      />
    )
  }
)
CardDescription.displayName = 'CardDescription'

/**
 * Card Content - 卡片内容组件
 */
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  padded?: boolean
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, padded = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          padded && 'p-6 pt-0',
          className
        )}
        {...props}
      />
    )
  }
)
CardContent.displayName = 'CardContent'

/**
 * Card Footer - 卡片底部组件
 */
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right' | 'between'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  bordered?: boolean
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, align = 'left', size = 'md', bordered = false, ...props }, ref) => {
    const alignClasses = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end',
      between: 'justify-between',
    }

    const sizeClasses = {
      xs: 'p-2',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center',
          sizeClasses[size],
          alignClasses[align],
          bordered && 'border-t border-neutral-200',
          className
        )}
        {...props}
      />
    )
  }
)
CardFooter.displayName = 'CardFooter'

/**
 * Card Image - 卡片图片组件
 */
export interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape' | 'auto'
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  overlay?: boolean
  overlayContent?: React.ReactNode
}

const CardImage = React.forwardRef<HTMLImageElement, CardImageProps>(
  ({
    className,
    aspectRatio = 'auto',
    objectFit = 'cover',
    overlay = false,
    overlayContent,
    ...props
  }, ref) => {
    const aspectRatioClasses = {
      square: 'aspect-square',
      video: 'aspect-video',
      portrait: 'aspect-[3/4]',
      landscape: 'aspect-[4/3]',
      auto: '',
    }

    const objectFitClasses = {
      cover: 'object-cover',
      contain: 'object-contain',
      fill: 'object-fill',
      none: 'object-none',
      'scale-down': 'object-scale-down',
    }

    return (
      <div className={cn('relative overflow-hidden', aspectRatioClasses[aspectRatio])}>
        <img
          ref={ref}
          className={cn(
            'w-full h-full',
            objectFitClasses[objectFit],
            className
          )}
          {...props}
        />
        {overlay && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            {overlayContent}
          </div>
        )}
      </div>
    )
  }
)
CardImage.displayName = 'CardImage'

/**
 * Card Badge - 卡片徽章组件
 */
export interface CardBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error'
  size?: 'xs' | 'sm' | 'md'
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

const CardBadge = React.forwardRef<HTMLDivElement, CardBadgeProps>(
  ({
    className,
    variant = 'primary',
    size = 'sm',
    position = 'top-right',
    children,
    ...props
  }, ref) => {
    const variantClasses = {
      primary: 'bg-primary-500 text-white',
      secondary: 'bg-secondary-500 text-white',
      accent: 'bg-accent-500 text-white',
      success: 'bg-success-500 text-white',
      warning: 'bg-warning-500 text-white',
      error: 'bg-error-500 text-white',
    }

    const sizeClasses = {
      xs: 'px-1.5 py-0.5 text-xs',
      sm: 'px-2 py-1 text-sm',
      md: 'px-3 py-1.5 text-sm',
    }

    const positionClasses = {
      'top-left': 'top-3 left-3',
      'top-right': 'top-3 right-3',
      'bottom-left': 'bottom-3 left-3',
      'bottom-right': 'bottom-3 right-3',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'absolute z-10 rounded-full font-medium',
          variantClasses[variant],
          sizeClasses[size],
          positionClasses[position],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
CardBadge.displayName = 'CardBadge'

/**
 * Card Loading - 卡片加载状态组件
 */
export interface CardLoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string
  size?: 'sm' | 'md' | 'lg'
}

const CardLoading = React.forwardRef<HTMLDivElement, CardLoadingProps>(
  ({ className, text = 'Loading...', size = 'md', ...props }, ref) => {
    const sizeClasses = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center space-y-4',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent" />
        {text && <p className="text-sm text-neutral-500">{text}</p>}
      </div>
    )
  }
)
CardLoading.displayName = 'CardLoading'

/**
 * Card Empty - 卡片空状态组件
 */
export interface CardEmptyProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
}

const CardEmpty = React.forwardRef<HTMLDivElement, CardEmptyProps>(
  ({ className, title, description, icon, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center space-y-4 p-8 text-center',
          className
        )}
        {...props}
      >
        {icon && (
          <div className="text-neutral-400">{icon}</div>
        )}
        {title && (
          <h3 className="text-lg font-medium text-neutral-700">{title}</h3>
        )}
        {description && (
          <p className="text-sm text-neutral-500 max-w-sm">{description}</p>
        )}
        {action && <div>{action}</div>}
      </div>
    )
  }
)
CardEmpty.displayName = 'CardEmpty'

// 导出所有组件
export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  CardImage,
  CardBadge,
  CardLoading,
  CardEmpty,
}

export type {
  CardProps,
  CardHeaderProps,
  CardFooterProps,
  CardTitleProps,
  CardDescriptionProps,
  CardContentProps,
  CardImageProps,
  CardBadgeProps,
  CardLoadingProps,
  CardEmptyProps,
}