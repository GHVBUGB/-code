'use client'

import { useState } from "react"
import { AuthService } from "@/lib/supabase/auth"
import { supabase, supabaseAdmin, isUsingServiceRole } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  UserPlus,
  Database,
  RefreshCw
} from "lucide-react"

export default function TestRegistrationPage() {
  const [formData, setFormData] = useState({
    username: 'testuser_' + Date.now(),
    email: `test_${Date.now()}@example.com`,
    password: 'password123'
  })
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const testDirectInsert = async () => {
    setIsLoading(true)
    const testResults = []

    try {
      // 测试1: 使用 anon key 直接插入
      const { data: anonData, error: anonError } = await supabase
        .from('users')
        .insert({
          username: formData.username + '_anon',
          email: formData.email.replace('@', '_anon@'),
          password_hash: 'test_hash_anon',
          salt: 'test_salt_anon'
        })
        .select()

      testResults.push({
        method: 'Anon Key 直接插入',
        success: !anonError,
        error: anonError?.message,
        data: anonData
      })
    } catch (error) {
      testResults.push({
        method: 'Anon Key 直接插入',
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      })
    }

    try {
      // 测试2: 使用 service role 直接插入
      const { data: serviceData, error: serviceError } = await supabaseAdmin
        .from('users')
        .insert({
          username: formData.username + '_service',
          email: formData.email.replace('@', '_service@'),
          password_hash: 'test_hash_service',
          salt: 'test_salt_service'
        })
        .select()

      testResults.push({
        method: 'Service Role 直接插入',
        success: !serviceError,
        error: serviceError?.message,
        data: serviceData
      })
    } catch (error) {
      testResults.push({
        method: 'Service Role 直接插入',
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      })
    }

    setResults(testResults)
    setIsLoading(false)
  }

  const testAuthService = async () => {
    setIsLoading(true)
    const testResults = []

    try {
      // 测试3: 使用 AuthService 注册
      const result = await AuthService.register({
        username: formData.username + '_auth',
        email: formData.email.replace('@', '_auth@'),
        password: formData.password,
        confirmPassword: formData.password
      })

      testResults.push({
        method: 'AuthService 注册',
        success: result.success,
        error: result.error,
        user: result.user
      })
    } catch (error) {
      testResults.push({
        method: 'AuthService 注册',
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      })
    }

    setResults(prev => [...prev, ...testResults])
    setIsLoading(false)
  }

  const checkDatabaseState = async () => {
    setIsLoading(true)
    const testResults = []

    try {
      // 检查用户表状态
      const { data: users, error: usersError } = await supabaseAdmin
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      testResults.push({
        method: '数据库状态检查',
        success: !usersError,
        error: usersError?.message,
        userCount: users?.length || 0,
        users: users
      })
    } catch (error) {
      testResults.push({
        method: '数据库状态检查',
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      })
    }

    setResults(prev => [...prev, ...testResults])
    setIsLoading(false)
  }

  const getStatusIcon = (success: boolean) => {
    return success ? 
      <CheckCircle className="w-5 h-5 text-green-500" /> : 
      <XCircle className="w-5 h-5 text-red-500" />
  }

  const getStatusBadge = (success: boolean) => {
    return success ? 
      <Badge className="bg-green-500">成功</Badge> : 
      <Badge variant="destructive">失败</Badge>
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">用户注册问题诊断</h1>
          <p className="text-muted-foreground">
            测试不同的注册方法，找出问题所在
          </p>
        </div>

        {/* 配置信息 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>当前配置</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span>Service Role 配置:</span>
                {isUsingServiceRole() ? 
                  <Badge className="bg-green-500">已配置</Badge> : 
                  <Badge variant="destructive">未配置</Badge>
                }
              </div>
              <div className="text-sm text-muted-foreground">
                {isUsingServiceRole() ? 
                  '使用 Service Role 可以绕过 RLS 限制' : 
                  '建议配置 SUPABASE_SERVICE_ROLE_KEY 环境变量'
                }
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 测试表单 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="w-5 h-5" />
              <span>测试数据</span>
            </CardTitle>
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

        {/* 测试按钮 */}
        <div className="mb-6 space-x-2">
          <Button onClick={testDirectInsert} disabled={isLoading}>
            {isLoading ? '测试中...' : '测试直接插入'}
          </Button>
          <Button onClick={testAuthService} disabled={isLoading} variant="outline">
            {isLoading ? '测试中...' : '测试认证服务'}
          </Button>
          <Button onClick={checkDatabaseState} disabled={isLoading} variant="secondary">
            {isLoading ? '检查中...' : '检查数据库状态'}
          </Button>
        </div>

        {/* 测试结果 */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">测试结果</h3>
            {results.map((result, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(result.success)}
                      <div>
                        <h4 className="font-semibold">{result.method}</h4>
                        {result.error && (
                          <p className="text-sm text-red-500">{result.error}</p>
                        )}
                        {result.success && (
                          <p className="text-sm text-green-500">操作成功</p>
                        )}
                      </div>
                    </div>
                    {getStatusBadge(result.success)}
                  </div>
                  
                  {result.data && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm text-muted-foreground">
                        查看返回数据
                      </summary>
                      <pre className="mt-2 p-3 bg-muted rounded-lg text-xs overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}

                  {result.users && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm text-muted-foreground">
                        查看用户列表 ({result.userCount} 个用户)
                      </summary>
                      <pre className="mt-2 p-3 bg-muted rounded-lg text-xs overflow-auto">
                        {JSON.stringify(result.users, null, 2)}
                      </pre>
                    </details>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* 解决方案建议 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>解决方案建议</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">如果直接插入失败：</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>检查 RLS 策略配置</li>
                <li>确保用户表允许插入操作</li>
                <li>验证 API 密钥权限</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">如果 Service Role 插入成功：</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>配置 SUPABASE_SERVICE_ROLE_KEY 环境变量</li>
                <li>重启开发服务器</li>
                <li>使用 AuthService 进行注册</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-2">快速修复：</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>在 Supabase 中执行 fix-rls-policies.sql 脚本</li>
                <li>或者配置 Service Role Key 环境变量</li>
                <li>重启应用并重新测试</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
