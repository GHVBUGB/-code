'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Toast {
  id: string
  title?: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  success: (message: string, title?: string) => void
  error: (message: string, title?: string) => void
  warning: (message: string, title?: string) => void
  info: (message: string, title?: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

interface ToastProviderProps {
  children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [mounted, setMounted] = useState(false)
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null)

  useEffect(() => {
    setMounted(true)
    const el = document.getElementById('toast-root')
    setPortalEl(el)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast = { ...toast, id }
    
    setToasts(prev => [...prev, newToast])

    // 自动移除
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration || 5000)
    }
  }, [removeToast])

  const success = useCallback((message: string, title?: string) => {
    addToast({ type: 'success', message, title })
  }, [addToast])

  const error = useCallback((message: string, title?: string) => {
    addToast({ type: 'error', message, title, duration: 7000 })
  }, [addToast])

  const warning = useCallback((message: string, title?: string) => {
    addToast({ type: 'warning', message, title })
  }, [addToast])

  const info = useCallback((message: string, title?: string) => {
    addToast({ type: 'info', message, title })
  }, [addToast])

  const value: ToastContextValue = {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      {mounted && portalEl && (
        <ToastContainer toasts={toasts} onRemove={removeToast} portalEl={portalEl} />
      )}
    </ToastContext.Provider>
  )
}

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
  portalEl: HTMLElement
}

function ToastContainer({ toasts, onRemove, portalEl }: ToastContainerProps) {
  return createPortal(
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>,
    portalEl
  )
}

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-success-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-error-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning-500" />
      case 'info':
        return <Info className="w-5 h-5 text-info-500" />
    }
  }

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-success-50 border-success-200 dark:bg-success-950 dark:border-success-800'
      case 'error':
        return 'bg-error-50 border-error-200 dark:bg-error-950 dark:border-error-800'
      case 'warning':
        return 'bg-warning-50 border-warning-200 dark:bg-warning-950 dark:border-warning-800'
      case 'info':
        return 'bg-info-50 border-info-200 dark:bg-info-950 dark:border-info-800'
    }
  }

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg border p-4 shadow-lg transition-all duration-300 animate-in slide-in-from-right-full',
        getBackgroundColor()
      )}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          {toast.title && (
            <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
              {toast.title}
            </h4>
          )}
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            {toast.message}
          </p>
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-2 text-xs font-medium text-neutral-900 dark:text-neutral-100 underline hover:no-underline"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}


