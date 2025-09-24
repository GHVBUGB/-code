'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

export default function SimpleTestPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testAPI = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: '/models',
          method: 'GET',
          apiKey: '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'
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
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>简单API测试</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testAPI}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                测试中...
              </>
            ) : (
              '测试OpenRouter API'
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
                    {result.success ? 'API测试成功' : 'API测试失败'}
                  </div>
                  <div className="text-sm mt-1">
                    状态码: {result.status}
                  </div>
                  {result.error && (
                    <div className="text-sm text-red-600 mt-1">
                      错误: {result.error}
                    </div>
                  )}
                  {result.data && (
                    <div className="text-sm mt-2">
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
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

