import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

export function LoadingSpinner({ 
  size = 'md', 
  className,
  text 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-primary-500', sizeClasses[size])} />
      {text && (
        <span className="text-neutral-600 dark:text-neutral-400">
          {text}
        </span>
      )}
    </div>
  )
}

interface LoadingStateProps {
  isLoading: boolean
  children: React.ReactNode
  loadingText?: string
  className?: string
}

export function LoadingState({ 
  isLoading, 
  children, 
  loadingText = '加载中...',
  className 
}: LoadingStateProps) {
  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center py-8', className)}>
        <LoadingSpinner text={loadingText} />
      </div>
    )
  }

  return <>{children}</>
}

interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  loadingText?: string
}

export function LoadingOverlay({ 
  isLoading, 
  children, 
  loadingText = '处理中...' 
}: LoadingOverlayProps) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
          <LoadingSpinner text={loadingText} />
        </div>
      )}
    </div>
  )
}

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn('animate-pulse bg-neutral-200 dark:bg-neutral-700 rounded', className)} />
  )
}

export function SkeletonCard() {
  return (
    <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
      <div className="flex justify-between">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  )
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}










