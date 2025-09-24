import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { colors, radius, shadows, transitions } from '@/lib/design-tokens'

/**
 * Button Variants - 按钮样式变体
 * 基于设计令牌的按钮样式系统
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      /* 视觉风格变体 */
      variant: {
        primary: [
          'bg-primary-500 text-white',
          'hover:bg-primary-600 active:bg-primary-700',
          'focus-visible:ring-primary-500',
          'shadow-md hover:shadow-lg',
        ],
        secondary: [
          'bg-secondary-500 text-white',
          'hover:bg-secondary-600 active:bg-secondary-700',
          'focus-visible:ring-secondary-500',
          'shadow-md hover:shadow-lg',
        ],
        accent: [
          'bg-accent-500 text-white',
          'hover:bg-accent-600 active:bg-accent-700',
          'focus-visible:ring-accent-500',
          'shadow-md hover:shadow-lg',
        ],
        outline: [
          'bg-transparent border-2',
          'border-primary-500 text-primary-500',
          'hover:bg-primary-50 hover:border-primary-600 hover:text-primary-600',
          'active:bg-primary-100',
          'focus-visible:ring-primary-500',
        ],
        ghost: [
          'bg-transparent text-neutral-700',
          'hover:bg-neutral-100 hover:text-neutral-800',
          'active:bg-neutral-200',
          'focus-visible:ring-neutral-500',
        ],
        link: [
          'bg-transparent text-primary-500 underline-offset-4',
          'hover:text-primary-600 hover:underline',
          'active:text-primary-700',
          'focus-visible:ring-primary-500',
        ],
        destructive: [
          'bg-error-500 text-white',
          'hover:bg-error-600 active:bg-error-700',
          'focus-visible:ring-error-500',
          'shadow-md hover:shadow-lg',
        ],
        success: [
          'bg-success-500 text-white',
          'hover:bg-success-600 active:bg-success-700',
          'focus-visible:ring-success-500',
          'shadow-md hover:shadow-lg',
        ],
        warning: [
          'bg-warning-500 text-white',
          'hover:bg-warning-600 active:bg-warning-700',
          'focus-visible:ring-warning-500',
          'shadow-md hover:shadow-lg',
        ],
      },
      /* 尺寸变体 */
      size: {
        xs: 'h-6 px-2 text-xs gap-1',
        sm: 'h-8 px-3 text-sm gap-1.5',
        md: 'h-10 px-4 text-sm gap-2',
        lg: 'h-12 px-6 text-base gap-2',
        xl: 'h-14 px-8 text-lg gap-3',
        '2xl': 'h-16 px-10 text-xl gap-4',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
        'icon-lg': 'h-12 w-12',
        'icon-xl': 'h-14 w-14',
      },
      /* 形状变体 */
      shape: {
        square: '',
        rounded: 'rounded-md',
        pill: 'rounded-full',
        circle: 'rounded-full',
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
      /* 动画变体 */
      animation: {
        none: '',
        pulse: 'animate-pulse',
        bounce: 'animate-bounce',
        spin: 'animate-spin',
      },
      /* 状态变体 */
      state: {
        default: '',
        loading: 'opacity-75 cursor-not-allowed',
        disabled: 'opacity-50 cursor-not-allowed',
        active: 'ring-2 ring-offset-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      shape: 'rounded',
      radius: 'md',
      shadow: 'base',
      animation: 'none',
      state: 'default',
    },
  }
)

/**
 * Button Props - 按钮属性接口
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  uppercase?: boolean
}

/**
 * Button Component - 按钮组件
 * 基于设计系统的按钮组件，支持多种变体和状态
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      shape,
      radius,
      shadow,
      animation,
      state,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      uppercase = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading || state === 'loading' || state === 'disabled'
    const finalState = loading ? 'loading' : state

    // Special rendering when asChild is true: Slot expects exactly one child
    if (asChild) {
      return (
        <Slot
          className={cn(
            buttonVariants({ variant, size, shape, radius, shadow, animation, state: finalState, className }),
            fullWidth && 'w-full',
            uppercase && 'uppercase tracking-wide',
          )}
          {...(props as any)}
        >
          {children}
        </Slot>
      )
    }

    return (
      <button
        className={cn(
          buttonVariants({ variant, size, shape, radius, shadow, animation, state: finalState, className }),
          fullWidth && 'w-full',
          uppercase && 'uppercase tracking-wide',
          'relative'
        )}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-inherit">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          </div>
        )}
        <div className={cn('flex items-center gap-2', loading && 'opacity-0')}>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </div>
      </button>
    )
  }
)

Button.displayName = 'Button'

/**
 * Button Group - 按钮组组件
 * 用于组合多个相关按钮
 */
export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: VariantProps<typeof buttonVariants>['variant']
  size?: VariantProps<typeof buttonVariants>['size']
  attached?: boolean
  children: React.ReactElement<ButtonProps>[]
}

export function ButtonGroup({
  className,
  variant,
  size,
  attached = false,
  children,
  ...props
}: ButtonGroupProps) {
  const enhancedChildren = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        variant: child.props.variant || variant,
        size: child.props.size || size,
      } as Partial<ButtonProps>)
    }
    return child
  })

  return (
    <div
      className={cn(
        'flex items-center',
        attached ? 'inline-flex' : 'flex gap-2',
        attached && '[&>button]:rounded-none [&>button:first-child]:rounded-l-md [&>button:last-child]:rounded-r-md',
        className
      )}
      {...props}
    >
      {enhancedChildren}
    </div>
  )
}

/**
 * Icon Button - 图标按钮组件
 * 专门用于显示图标的按钮
 */
export interface IconButtonProps extends Omit<ButtonProps, 'size' | 'children'> {
  icon: React.ReactNode
  'aria-label': string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export function IconButton({
  icon,
  size = 'md',
  className,
  'aria-label': ariaLabel,
  ...props
}: IconButtonProps) {
  const sizeClasses = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-14 w-14',
  }

  return (
    <Button
      size="icon"
      className={cn(sizeClasses[size], className)}
      aria-label={ariaLabel}
      {...props}
    >
      {icon}
    </Button>
  )
}

/**
 * Action Button - 操作按钮组件
 * 带有特定操作意图的按钮
 */
export interface ActionButtonProps extends ButtonProps {
  action?: 'create' | 'delete' | 'edit' | 'save' | 'cancel' | 'confirm'
  confirmText?: string
  onConfirm?: () => void
}

export function ActionButton({
  action = 'create',
  confirmText = '确定要执行此操作吗？',
  onConfirm,
  children,
  onClick,
  ...props
}: ActionButtonProps) {
  const [isConfirming, setIsConfirming] = React.useState(false)

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (action === 'delete' && !isConfirming) {
      setIsConfirming(true)
      return
    }

    if (isConfirming && onConfirm) {
      onConfirm()
      setIsConfirming(false)
    } else if (onClick) {
      onClick(e)
    }
  }

  const getActionVariant = () => {
    switch (action) {
      case 'delete':
        return 'destructive'
      case 'create':
      case 'save':
        return 'primary'
      case 'edit':
        return 'secondary'
      case 'cancel':
        return 'ghost'
      case 'confirm':
        return 'success'
      default:
        return 'primary'
    }
  }

  return (
    <Button
      variant={getActionVariant()}
      onClick={handleClick}
      {...props}
    >
      {isConfirming ? confirmText : children}
    </Button>
  )
}

/**
 * 预设按钮组件
 */

export function PrimaryButton(props: ButtonProps) {
  return <Button variant="primary" {...props} />
}

export function SecondaryButton(props: ButtonProps) {
  return <Button variant="secondary" {...props} />
}

export function AccentButton(props: ButtonProps) {
  return <Button variant="accent" {...props} />
}

export function OutlineButton(props: ButtonProps) {
  return <Button variant="outline" {...props} />
}

export function GhostButton(props: ButtonProps) {
  return <Button variant="ghost" {...props} />
}

export function DestructiveButton(props: ButtonProps) {
  return <Button variant="destructive" {...props} />
}

export function SuccessButton(props: ButtonProps) {
  return <Button variant="success" {...props} />
}

export function WarningButton(props: ButtonProps) {
  return <Button variant="warning" {...props} />
}

export { Button, buttonVariants }
export type { ButtonProps, ButtonGroupProps, IconButtonProps, ActionButtonProps }