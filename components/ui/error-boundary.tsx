'use client'

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback
        return (
          <FallbackComponent 
            error={this.state.error!} 
            resetError={() => this.setState({ hasError: false, error: undefined })}
          />
        )
      }

      return (
        <DefaultErrorFallback 
          error={this.state.error!} 
          resetError={() => this.setState({ hasError: false, error: undefined })}
        />
      )
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error: Error
  resetError: () => void
}

function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development'

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-6 text-center">
          <div className="w-12 h-12 bg-error-100 dark:bg-error-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-error-600 dark:text-error-400" />
          </div>
          
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            出现了错误
          </h2>
          
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            很抱歉，页面加载时出现了问题。请尝试刷新页面或联系技术支持。
          </p>

          {isDevelopment && (
            <details className="text-left mb-4 p-3 bg-neutral-50 dark:bg-neutral-800 rounded text-sm">
              <summary className="cursor-pointer font-medium">错误详情</summary>
              <pre className="mt-2 text-xs overflow-auto">
                {error.name}: {error.message}
                {error.stack && `\n${error.stack}`}
              </pre>
            </details>
          )}

          <div className="flex gap-2 justify-center">
            <Button onClick={resetError} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              重试
            </Button>
            <Button onClick={() => window.location.href = '/'} className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              回到首页
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// API Error Display Component
interface APIErrorProps {
  error: string | Error
  onRetry?: () => void
  className?: string
}

export function APIError({ error, onRetry, className }: APIErrorProps) {
  const errorMessage = typeof error === 'string' ? error : error.message

  return (
    <Card className={className}>
      <CardContent className="p-6 text-center">
        <div className="w-10 h-10 bg-error-100 dark:bg-error-900 rounded-full flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="w-5 h-5 text-error-600 dark:text-error-400" />
        </div>
        
        <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
          请求失败
        </h3>
        
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          {errorMessage}
        </p>

        {onRetry && (
          <Button onClick={onRetry} size="sm" variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-3 h-3" />
            重试
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Empty State Component
interface EmptyStateProps {
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  icon?: React.ComponentType<{ className?: string }>
  className?: string
}

export function EmptyState({ 
  title, 
  description, 
  action, 
  icon: Icon,
  className 
}: EmptyStateProps) {
  return (
    <div className={`text-center py-8 ${className || ''}`}>
      {Icon && (
        <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-6 h-6 text-neutral-400" />
        </div>
      )}
      
      <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          {description}
        </p>
      )}

      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

// Network Error Component
export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <APIError
      error="网络连接失败，请检查您的网络连接"
      onRetry={onRetry}
    />
  )
}

// Not Found Component
export function NotFound({ message = '页面未找到' }: { message?: string }) {
  return (
    <EmptyState
      title="404"
      description={message}
      action={{
        label: '返回首页',
        onClick: () => window.location.href = '/'
      }}
    />
  )
}










