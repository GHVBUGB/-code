'use client'

import { useState } from "react"
import { LocalAuthService } from "@/lib/auth/local-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function TestAuthPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  })

  const testRegister = async () => {
    setLoading(true)
    setResult('')
    
    try {
      console.log('测试注册...')
      const response = await LocalAuthService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.password
      })
      
      if (response.success) {
        setResult(`注册成功！\n\n用户信息：\n${JSON.stringify(response.user, null, 2)}`)
      } else {
        setResult(`注册失败：\n${response.error}`)
      }
    } catch (error) {
      setResult(`注册异常：\n${error instanceof Error ? error.message : '未知错误'}`)
    } finally {
      setLoading(false)
    }
  }

  const testLogin = async () => {
    setLoading(true)
    setResult('')
    
    try {
      console.log('测试登录...')
      const response = await LocalAuthService.login({
        email: formData.email,
        password: formData.password
      })
      
      if (response.success) {
        setResult(`登录成功！\n\n用户信息：\n${JSON.stringify(response.user, null, 2)}`)
      } else {
        setResult(`登录失败：\n${response.error}`)
      }
    } catch (error) {
      setResult(`登录异常：\n${error instanceof Error ? error.message : '未知错误'}`)
    } finally {
      setLoading(false)
    }
  }

  const testSession = () => {
    setResult('')
    
    try {
      const session = LocalAuthService.getCurrentSession()
      if (session) {
        setResult(`当前会话：\n${JSON.stringify(session, null, 2)}`)
      } else {
        setResult('没有找到当前会话')
      }
    } catch (error) {
      setResult(`获取会话异常：\n${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  const testAllUsers = () => {
    setResult('')
    
    try {
      const users = LocalAuthService.getAllUsers()
      setResult(`所有用户：\n${JSON.stringify(users, null, 2)}`)
    } catch (error) {
      setResult(`获取用户列表异常：\n${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  const clearAllData = () => {
    setResult('')
    
    try {
      LocalAuthService.clearAllData()
      setResult('所有数据已清除')
    } catch (error) {
      setResult(`清除数据异常：\n${error instanceof Error ? error.message : '未知错误'}`)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">认证系统测试页面</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>测试表单</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username">用户名</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>测试操作</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={testRegister} disabled={loading} className="w-full">
                {loading ? '测试中...' : '测试注册'}
              </Button>
              <Button onClick={testLogin} disabled={loading} variant="outline" className="w-full">
                {loading ? '测试中...' : '测试登录'}
              </Button>
              <Button onClick={testSession} variant="secondary" className="w-full">
                检查会话
              </Button>
              <Button onClick={testAllUsers} variant="secondary" className="w-full">
                查看所有用户
              </Button>
              <Button onClick={clearAllData} variant="destructive" className="w-full">
                清除所有数据
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>测试结果</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm whitespace-pre-wrap">
              {result || '点击按钮开始测试...'}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
