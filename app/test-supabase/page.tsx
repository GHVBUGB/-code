'use client'

import { useState } from "react"
import { supabase, checkSupabaseConnection } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Database, 
  Users, 
  FileText,
  Settings,
  RefreshCw
} from "lucide-react"

interface TestResult {
  name: string
  status: 'success' | 'error' | 'warning' | 'pending'
  message: string
  details?: any
}

export default function TestSupabasePage() {
  const [results, setResults] = useState<TestResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const runTests = async () => {
    setIsLoading(true)
    setResults([])

    const testResults: TestResult[] = []

    // 测试1: 基本连接
    try {
      const connectionResult = await checkSupabaseConnection()
      testResults.push({
        name: '数据库连接',
        status: connectionResult.connected ? 'success' : 'error',
        message: connectionResult.connected ? '连接成功' : `连接失败: ${connectionResult.error}`,
        details: connectionResult
      })
    } catch (error) {
      testResults.push({
        name: '数据库连接',
        status: 'error',
        message: `连接异常: ${error instanceof Error ? error.message : '未知错误'}`,
        details: error
      })
    }

    // 测试2: 用户表
    try {
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1)

      testResults.push({
        name: '用户表 (users)',
        status: error ? 'error' : 'success',
        message: error ? `表不存在或无法访问: ${error.message}` : '表结构正常',
        details: { data, error }
      })
    } catch (error) {
      testResults.push({
        name: '用户表 (users)',
        status: 'error',
        message: `测试失败: ${error instanceof Error ? error.message : '未知错误'}`,
        details: error
      })
    }

    // 测试3: 项目表
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('count')
        .limit(1)

      testResults.push({
        name: '项目表 (projects)',
        status: error ? 'error' : 'success',
        message: error ? `表不存在或无法访问: ${error.message}` : '表结构正常',
        details: { data, error }
      })
    } catch (error) {
      testResults.push({
        name: '项目表 (projects)',
        status: 'error',
        message: `测试失败: ${error instanceof Error ? error.message : '未知错误'}`,
        details: error
      })
    }

    // 测试4: 行级安全策略
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .limit(1)

      if (error && error.message.includes('RLS')) {
        testResults.push({
          name: '行级安全策略 (RLS)',
          status: 'success',
          message: 'RLS策略已启用（这是正常的）',
          details: { error: error.message }
        })
      } else if (error) {
        testResults.push({
          name: '行级安全策略 (RLS)',
          status: 'warning',
          message: `RLS策略可能未正确配置: ${error.message}`,
          details: { error }
        })
      } else {
        testResults.push({
          name: '行级安全策略 (RLS)',
          status: 'warning',
          message: 'RLS策略可能未启用，建议检查配置',
          details: { data }
        })
      }
    } catch (error) {
      testResults.push({
        name: '行级安全策略 (RLS)',
        status: 'error',
        message: `测试失败: ${error instanceof Error ? error.message : '未知错误'}`,
        details: error
      })
    }

    // 测试5: 环境变量检查
    const envCheck = {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    }

    const hasValidConfig = envCheck.supabaseUrl && 
                          envCheck.supabaseKey && 
                          !envCheck.supabaseUrl.includes('your-project') &&
                          !envCheck.supabaseKey.includes('your-')

    testResults.push({
      name: '环境变量配置',
      status: hasValidConfig ? 'success' : 'error',
      message: hasValidConfig ? '环境变量配置正确' : '环境变量配置不完整或包含占位符',
      details: {
        hasUrl: !!envCheck.supabaseUrl,
        hasKey: !!envCheck.supabaseKey,
        urlValid: !envCheck.supabaseUrl?.includes('your-project'),
        keyValid: !envCheck.supabaseKey?.includes('your-')
      }
    })

    setResults(testResults)
    setIsLoading(false)
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      default:
        return <RefreshCw className="w-5 h-5 text-gray-500 animate-spin" />
    }
  }

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500">成功</Badge>
      case 'error':
        return <Badge variant="destructive">失败</Badge>
      case 'warning':
        return <Badge className="bg-yellow-500">警告</Badge>
      default:
        return <Badge variant="secondary">测试中</Badge>
    }
  }

  const successCount = results.filter(r => r.status === 'success').length
  const errorCount = results.filter(r => r.status === 'error').length
  const warningCount = results.filter(r => r.status === 'warning').length

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Supabase 数据库配置测试</h1>
          <p className="text-muted-foreground">
            验证 Supabase 数据库连接和配置是否正确
          </p>
        </div>

        {/* 测试按钮 */}
        <div className="mb-6">
          <Button 
            onClick={runTests} 
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <Database className="w-4 h-4" />
            <span>{isLoading ? '测试中...' : '开始测试'}</span>
          </Button>
        </div>

        {/* 测试结果摘要 */}
        {results.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="w-5 h-5" />
                <span>测试结果摘要</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{successCount}</div>
                  <div className="text-sm text-muted-foreground">成功</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">{warningCount}</div>
                  <div className="text-sm text-muted-foreground">警告</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{errorCount}</div>
                  <div className="text-sm text-muted-foreground">失败</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 详细测试结果 */}
        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((result, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <h3 className="font-semibold">{result.name}</h3>
                        <p className="text-sm text-muted-foreground">{result.message}</p>
                      </div>
                    </div>
                    {getStatusBadge(result.status)}
                  </div>
                  
                  {result.details && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                        查看详细信息
                      </summary>
                      <pre className="mt-2 p-3 bg-muted rounded-lg text-xs overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* 配置指南 */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>配置指南</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">如果测试失败，请检查：</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Supabase 项目是否正常运行</li>
                <li>环境变量配置是否正确</li>
                <li>数据库表是否已创建</li>
                <li>网络连接是否正常</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">配置步骤：</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                <li>在 Supabase 中执行数据库脚本</li>
                <li>获取项目 URL 和 API Key</li>
                <li>配置环境变量到 .env.local</li>
                <li>重启开发服务器</li>
              </ol>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => window.open('/test-auth', '_blank')}>
                测试认证功能
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.open('/test-data-flow', '_blank')}>
                测试数据流
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}