'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Send } from 'lucide-react'

export default function SimpleAPITestPage() {
  const [apiKey, setApiKey] = useState('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')
  const [message, setMessage] = useState('Hello, test')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const testAPI = async () => {
    setIsLoading(true)
    setError('')
    setResponse('')

    try {
      console.log('Testing API with:', {
        endpoint: '/chat/completions',
        method: 'POST',
        apiKey: apiKey,
        data: {
          model: 'openai/gpt-4-turbo',
          messages: [{ role: 'user', content: message }],
          max_tokens: 50,
          temperature: 0.1
        }
      })

      const response = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: '/chat/completions',
          method: 'POST',
          apiKey: apiKey,
          data: {
            model: 'openai/gpt-4-turbo',
            messages: [{ role: 'user', content: message }],
            max_tokens: 50,
            temperature: 0.1
          }
        })
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)

      if (response.ok) {
        setResponse(JSON.stringify(data, null, 2))
      } else {
        setError(`Error ${response.status}: ${data.error || 'Unknown error'}`)
      }
    } catch (err) {
      console.error('API Error:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">简单API测试</h1>
        <p className="text-muted-foreground">
          测试OpenRouter API连接
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API测试</CardTitle>
          <CardDescription>
            测试OpenRouter API连接和聊天功能
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              API密钥
            </label>
            <Input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-or-..."
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              测试消息
            </label>
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="输入测试消息"
            />
          </div>

          <Button 
            onClick={testAPI}
            disabled={isLoading || !apiKey || !message}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                测试中...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                测试API
              </>
            )}
          </Button>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {response && (
            <div>
              <label className="text-sm font-medium mb-2 block">
                API响应
              </label>
              <Textarea
                value={response}
                readOnly
                className="min-h-[200px] font-mono text-sm"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


