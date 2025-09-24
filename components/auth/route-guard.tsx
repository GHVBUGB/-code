'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store'

interface RouteGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
}

export function RouteGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth/login' 
}: RouteGuardProps) {
  const { isAuthenticated, user, setUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // 检查本地存储的token（统一键名）
    const token = localStorage.getItem('auth-token')
    const savedUser = localStorage.getItem('user-data')
    
    if (token && savedUser && !user) {
      // 恢复用户状态
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
      } catch (error) {
        // 清除无效数据
        localStorage.removeItem('auth-token')
        localStorage.removeItem('user-data')
      }
    }
    
    setIsLoading(false)
  }, [user, setUser])

  useEffect(() => {
    if (isLoading) return
    if (requireAuth && !isAuthenticated) {
      router.replace(redirectTo)
    } else if (!requireAuth && isAuthenticated) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, requireAuth, isLoading, router, redirectTo])

  // 显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">加载中...</p>
        </div>
      </div>
    )
  }

  // 如果需要认证但用户未登录，不渲染内容
  if (requireAuth && !isAuthenticated) {
    return null
  }

  // 如果不需要认证但用户已登录（如登录页面），不渲染内容
  if (!requireAuth && isAuthenticated) {
    return null
  }

  return <>{children}</>
}

// 高阶组件版本
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<RouteGuardProps, 'children'> = {}
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <RouteGuard {...options}>
        <Component {...props} />
      </RouteGuard>
    )
  }
}


