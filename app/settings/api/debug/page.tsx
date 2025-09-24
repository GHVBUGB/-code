'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, XCircle, AlertTriangle, Key, Eye, EyeOff } from 'lucide-react'

interface ValidationResult {
  isValid: boolean
  message: string
  details?: any
}

export default function APIDebugPage() {
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
  const [testResults, setTestResults] = useState<any[]>([])

  const validateApiKeyFormat = (key: string): ValidationResult => {
    if (!key) {
      return {
        isValid: false,
        message: 'API密钥不能为空'
      }
    }

    if (!key.startsWith('sk-or-')) {
      return {
        isValid: false,
        message: 'API密钥格式错误：必须以 "sk-or-" 开头'
      }
    }

    if (key.length < 20) {
      return {
        isValid: false,
        message: 'API密钥长度不足：OpenRouter密钥通常较长'
      }
    }

    if (key.length > 200) {
      return {
        isValid: false,
        message: 'API密钥长度过长：请检查是否复制了多余内容'
      }
    }

    // 检查是否包含特殊字符
    const validChars = /^[a-zA-Z0-9_-]+$/
    if (!validChars.test(key.substring(6))) {
      return {
        isValid: false,
        message: 'API密钥包含无效字符：只能包含字母、数字、下划线和连字符'
      }
    }

    return {
      isValid: true,
      message: 'API密钥格式正确'
    }
  }

  const testApiKey = async () => {
    const formatCheck = validateApiKeyFormat(apiKey)
    setValidationResult(formatCheck)

    if (!formatCheck.isValid) {
      return
    }

    setIsValidating(true)
    setTestResults([])

    const tests = [
      {
        name: '基础连接测试',
        description: '测试API密钥是否能正常连接OpenRouter服务',
        test: async () => {
          const response = await fetch('/api/openrouter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              endpoint: '/models',
              method: 'GET',
              apiKey: apiKey
            })
          })
          return response
        }
      },
      {
        name: '简单对话测试',
        description: '测试API密钥是否能进行基本的AI对话',
        test: async () => {
          const response = await fetch('/api/openrouter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              endpoint: '/chat/completions',
              method: 'POST',
              apiKey: apiKey,
              data: {
                model: 'openai/gpt-4-turbo',
                messages: [
                  {
                    role: 'user',
                    content: 'Hello, please respond with "API test successful"'
                  }
                ],
                max_tokens: 10,
                temperature: 0.1
              }
            })
          })
          return response
        }
      },
      {
        name: '多模型测试',
        description: '测试不同AI模型的可用性',
        test: async () => {
          const models = ['openai/gpt-4-turbo', 'anthropic/claude-3.5-sonnet', 'google/gemini-pro-1.5']
          const results = []
          
          for (const model of models) {
            try {
              const response = await fetch('/api/openrouter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  endpoint: '/chat/completions',
                  method: 'POST',
                  apiKey: apiKey,
                  data: {
                    model: model,
                    messages: [
                      {
                        role: 'user',
                        content: 'Test'
                      }
                    ],
                    max_tokens: 5,
                    temperature: 0.1
                  }
                })
              })
              results.push({ model, status: response.status, ok: response.ok })
            } catch (error) {
              results.push({ model, status: 'error', ok: false, error: error.message })
            }
          }
          
          return {
            ok: results.some(r => r.ok),
            status: 200,
            results
          }
        }
      }
    ]

    for (const test of tests) {
      try {
        const startTime = Date.now()
        const result = await test.test()
        const endTime = Date.now()
        
        let testResult: any = {
          name: test.name,
          description: test.description,
          success: result.ok,
          status: result.status,
          duration: endTime - startTime,
          timestamp: new Date().toLocaleTimeString()
        }

        if (result.ok) {
          testResult.message = '测试通过'
          if (test.name === '多模型测试' && result.results) {
            testResult.availableModels = result.results.filter((r: any) => r.ok).map((r: any) => r.model)
            testResult.unavailableModels = result.results.filter((r: any) => !r.ok).map((r: any) => r.model)
          }
        } else {
          testResult.message = `测试失败 (HTTP ${result.status})`
          try {
            const errorData = await result.json()
            testResult.error = errorData.error?.message || errorData.error || '未知错误'
          } catch (e) {
            testResult.error = '无法解析错误信息'
          }
        }

        setTestResults(prev => [...prev, testResult])
      } catch (error) {
        setTestResults(prev => [...prev, {
          name: test.name,
          description: test.description,
          success: false,
          message: '测试异常',
          error: error instanceof Error ? error.message : '未知错误',
          timestamp: new Date().toLocaleTimeString()
        }])
      }
    }

    setIsValidating(false)
  }

  const clearResults = () => {
    setValidationResult(null)
    setTestResults([])
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">API密钥调试工具</h1>
        <p className="text-muted-foreground">
          深度测试和验证您的OpenRouter API密钥，诊断连接问题
        </p>
      </div>

      {/* API密钥输入 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API密钥配置
          </CardTitle>
          <CardDescription>
            输入您的OpenRouter API密钥进行验证和测试
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              OpenRouter API密钥
            </label>
            <div className="relative">
              <Input
                type={showKey ? "text" : "password"}
                placeholder="sk-or-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="font-mono pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              您的API密钥以"sk-or-"开头，请确保完整复制
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={testApiKey}
              disabled={isValidating || !apiKey.trim()}
              className="flex-1"
            >
              {isValidating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  测试中...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  开始测试
                </>
              )}
            </Button>
            <Button 
              onClick={clearResults}
              variant="outline"
              disabled={isValidating}
            >
              清除结果
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 格式验证结果 */}
      {validationResult && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">格式验证</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className={validationResult.isValid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <div className="flex items-center gap-2">
                {validationResult.isValid ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription>
                  <div className="font-medium">{validationResult.message}</div>
                </AlertDescription>
              </div>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* 测试结果 */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">测试结果</CardTitle>
            <CardDescription>
              详细的API功能测试结果
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {testResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{result.name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.success ? "通过" : "失败"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {result.duration}ms
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-2">
                  {result.description}
                </p>
                
                <div className="flex items-center gap-2 mb-2">
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <span className="text-sm">{result.message}</span>
                </div>

                {result.error && (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-red-600">
                      {result.error}
                    </AlertDescription>
                  </Alert>
                )}

                {result.availableModels && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-green-600 mb-1">可用模型：</p>
                    <div className="flex flex-wrap gap-1">
                      {result.availableModels.map((model: string) => (
                        <Badge key={model} variant="secondary" className="text-xs">
                          {model}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {result.unavailableModels && result.unavailableModels.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium text-red-600 mb-1">不可用模型：</p>
                    <div className="flex flex-wrap gap-1">
                      {result.unavailableModels.map((model: string) => (
                        <Badge key={model} variant="outline" className="text-xs text-red-600">
                          {model}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-xs text-muted-foreground mt-2">
                  测试时间: {result.timestamp}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 常见问题解决 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>常见问题解决</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <h4 className="font-medium text-red-600">❌ "Invalid token" 错误</h4>
            <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
              <li>检查API密钥是否完整复制（不要遗漏开头或结尾的字符）</li>
              <li>确认密钥格式正确（以 sk-or- 开头）</li>
              <li>验证密钥在OpenRouter控制台中是否仍然有效</li>
              <li>检查账户余额是否充足</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-amber-600">⚠️ 连接超时</h4>
            <ul className="list-disc list-inside text-muted-foreground ml-4 space-y-1">
              <li>检查网络连接是否正常</li>
              <li>确认防火墙没有阻止请求</li>
              <li>尝试使用VPN或更换网络环境</li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium text-blue-600">💡 获取新API密钥</h4>
            <ol className="list-decimal list-inside text-muted-foreground ml-4 space-y-1">
              <li>访问 <a href="https://openrouter.ai/" target="_blank" className="text-blue-600 hover:underline">OpenRouter官网</a></li>
              <li>登录您的账户</li>
              <li>进入API Keys页面</li>
              <li>创建新的API密钥</li>
              <li>复制完整的密钥（包括 sk-or- 前缀）</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}