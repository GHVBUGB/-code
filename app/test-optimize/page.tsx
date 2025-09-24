'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

export default function TestOptimizePage() {
  const [projectName, setProjectName] = useState('测试项目')
  const [projectDescription, setProjectDescription] = useState('这是一个测试项目，用于验证AI优化功能是否正常工作。')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testOptimize = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: '/chat/completions',
          method: 'POST',
          apiKey: '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',
          data: {
            model: 'anthropic/claude-sonnet-4',
            messages: [
              {
                role: 'user',
                content: `请优化以下项目描述，使其更加专业、清晰和吸引人：

项目名称：${projectName}
当前描述：${projectDescription}

请提供优化后的项目描述，要求：
1. 保持原意不变
2. 语言更加专业
3. 突出项目价值
4. 控制在200字以内

优化后的描述：`
              }
            ],
            max_tokens: 500,
            temperature: 0.7
          }
        })
      })

      const data = await response.json()
      setResult({ success: response.ok, data, status: response.status })
    } catch (error) {
      setResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        data: null 
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>项目优化功能测试</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">
              项目名称
            </label>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="输入项目名称..."
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              项目描述
            </label>
            <Textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="输入项目描述..."
              className="min-h-[120px]"
            />
          </div>

          <Button 
            onClick={testOptimize}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                优化中...
              </>
            ) : (
              '测试项目优化功能'
            )}
          </Button>

          {result && (
            <Alert className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
              <div className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription>
                  <div className="font-medium">
                    {result.success ? '优化测试成功' : '优化测试失败'}
                  </div>
                  <div className="text-sm mt-1">
                    状态码: {result.status}
                  </div>
                  {result.error && (
                    <div className="text-sm text-red-600 mt-1">
                      错误: {result.error}
                    </div>
                  )}
                  {result.success && result.data?.choices?.[0]?.message?.content && (
                    <div className="mt-3">
                      <div className="text-sm font-medium text-gray-700 mb-2">优化后的描述：</div>
                      <div className="bg-blue-50 p-3 rounded border">
                        {result.data.choices[0].message.content}
                      </div>
                    </div>
                  )}
                  {result.data && (
                    <details className="mt-3">
                      <summary className="text-sm cursor-pointer">查看完整响应</summary>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40 mt-2">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </AlertDescription>
              </div>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

