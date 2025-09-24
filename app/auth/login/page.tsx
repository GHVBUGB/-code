'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { authAPI, handleAPIError } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import { Cpu, Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react"
import Link from "next/link"

import { RouteGuard } from "@/components/auth/route-guard"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  
  const router = useRouter()
  const { setUser } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError("请填写所有必填字段")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await authAPI.login({ email, password })
      
      if (response.success && response.data) {
        // 设置用户信息到状态管理
        setUser(response.data.user)
        
        // 保存token到localStorage
        localStorage.setItem('auth-token', response.data.token)
        localStorage.setItem('user-data', JSON.stringify(response.data.user))
        
        // 跳转到仪表板
        router.push('/dashboard')
      } else {
        setError(response.error || '邮箱或密码错误')
      }
    } catch (error) {
      setError(handleAPIError(error))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <RouteGuard requireAuth={false}>
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500/5 via-transparent to-accent-500/5" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <Container>
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-500 rounded-lg flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">CodeGuide</span>
            </Link>
            
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回首页
              </Button>
            </Link>
          </div>
        </Container>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <Container size="sm">
          <Card variant="elevated" className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">登录账户</CardTitle>
              <CardDescription>
                登录您的 CodeGuide 账户以开始使用 AI 项目分析功能
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email">邮箱地址</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="请输入您的邮箱地址"
                      className="pl-10"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password">密码</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="请输入您的密码"
                      className="pl-10 pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-gray-300">记住我</span>
                  </label>
                  <Link href="/auth/forgot-password" className="text-primary-400 hover:text-primary-300">
                    忘记密码？
                  </Link>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 text-sm text-error-400 bg-error-50 dark:bg-error-950 border border-error-200 dark:border-error-800 rounded-md">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? "登录中..." : "登录"}
                </Button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-neutral-800 text-gray-400">或</span>
                  </div>
                </div>

                {/* Social Login - Future implementation */}
                <div className="space-y-3">
                  <Button variant="outline" size="lg" className="w-full" disabled>
                    <div className="w-5 h-5 bg-gray-400 rounded mr-2" />
                    使用 Google 登录
                  </Button>
                  <Button variant="outline" size="lg" className="w-full" disabled>
                    <div className="w-5 h-5 bg-gray-400 rounded mr-2" />
                    使用 GitHub 登录
                  </Button>
                </div>
              </form>

              {/* Sign up link */}
              <div className="mt-6 text-center text-sm">
                <span className="text-gray-400">还没有账户？</span>{" "}
                <Link href="/auth/register" className="text-primary-400 hover:text-primary-300 font-medium">
                  立即注册
                </Link>
              </div>
            </CardContent>
          </Card>
        </Container>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8">
        <Container>
          <div className="text-center text-sm text-gray-400">
            <p>© 2024 CodeGuide. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
    </RouteGuard>
  )
}
