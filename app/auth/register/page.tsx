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
import { Cpu, Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react"
import Link from "next/link"

import { RouteGuard } from "@/components/auth/route-guard"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { setUser } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      const form = e.target as HTMLFormElement
      const formData = new FormData(form)
      const username = (formData.get('username') as string) || ''
      const email = (formData.get('email') as string) || ''
      const password = (formData.get('password') as string) || ''
      const confirmPassword = (formData.get('confirmPassword') as string) || ''

      const resp = await authAPI.register({ username, email, password, confirmPassword })
      if (resp.success && resp.data) {
        // 注册完成后直接登录
        const loginResp = await authAPI.login({ email, password })
        if (loginResp.success && loginResp.data) {
          setUser(loginResp.data.user)
          localStorage.setItem('auth-token', loginResp.data.token)
          localStorage.setItem('user-data', JSON.stringify(loginResp.data.user))
          router.push('/dashboard')
          return
        }
        setError('注册成功，但自动登录失败，请手动登录')
        return
      }
      setError(resp.error || '注册失败')
    } catch (err) {
      setError(handleAPIError(err))
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
              <CardTitle className="text-2xl font-bold">创建账户</CardTitle>
              <CardDescription>
                注册 CodeGuide 账户，开始您的 AI 辅助项目分析之旅
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username">用户名</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="请输入用户名"
                      className="pl-10"
                      required
                      name="username"
                    />
                  </div>
                </div>

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
                      required
                      name="email"
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
                      placeholder="请输入密码（至少8位）"
                      className="pl-10 pr-10"
                      required
                      minLength={8}
                      name="password"
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

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">确认密码</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="请再次输入密码"
                      className="pl-10 pr-10"
                      required
                      name="confirmPassword"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Terms checkbox */}
                <div className="flex items-start space-x-2 text-sm">
                  <input
                    type="checkbox"
                    id="terms"
                    className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500 mt-0.5"
                    required
                  />
                  <label htmlFor="terms" className="text-gray-300">
                    我已阅读并同意{" "}
                    <Link href="/terms" className="text-primary-400 hover:text-primary-300">
                      服务条款
                    </Link>{" "}
                    和{" "}
                    <Link href="/privacy" className="text-primary-400 hover:text-primary-300">
                      隐私政策
                    </Link>
                  </label>
                </div>

                {/* Error */}
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
                  {isLoading ? "注册中..." : "创建账户"}
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

                {/* Social Registration - Future implementation */}
                <div className="space-y-3">
                  <Button variant="outline" size="lg" className="w-full" disabled>
                    <div className="w-5 h-5 bg-gray-400 rounded mr-2" />
                    使用 Google 注册
                  </Button>
                  <Button variant="outline" size="lg" className="w-full" disabled>
                    <div className="w-5 h-5 bg-gray-400 rounded mr-2" />
                    使用 GitHub 注册
                  </Button>
                </div>
              </form>

              {/* Sign in link */}
              <div className="mt-6 text-center text-sm">
                <span className="text-gray-400">已经有账户？</span>{" "}
                <Link href="/auth/login" className="text-primary-400 hover:text-primary-300 font-medium">
                  立即登录
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


