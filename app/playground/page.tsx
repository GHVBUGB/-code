'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Send, Bot, User } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function PlaygroundPage() {
  const [apiKey, setApiKey] = useState('')
  const [selectedModel, setSelectedModel] = useState('anthropic/claude-sonnet-4')
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const sendMessage = async () => {
    if (!apiKey.trim()) {
      setError('请输入API密钥')
      return
    }

    if (!message.trim()) {
      setError('请输入消息内容')
      return
    }

    setIsLoading(true)
    setError('')

    // 添加用户消息
    const userMessage: Message = {
      role: 'user',
      content: message,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    try {
      const response = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: '/chat/completions',
          method: 'POST',
          apiKey: apiKey,
          data: {
            model: selectedModel,
            messages: [
              ...messages.map(m => ({ role: m.role, content: m.content })),
              { role: 'user', content: message }
            ],
            max_tokens: 1000,
            temperature: 0.7
          }
        })
      })

      const data = await response.json()

      if (response.ok) {
        const aiResponse: Message = {
          role: 'assistant',
          content: data.choices?.[0]?.message?.content || '抱歉，我没有收到回复。',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, aiResponse])
        setMessage('')
      } else {
        setError(data.error || '请求失败')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '网络错误')
    } finally {
      setIsLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    setError('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">AI 对话测试</h1>
        <p className="text-muted-foreground">
          测试OpenRouter API的对话功能，与各种AI模型进行交互
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* 配置面板 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">配置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  API密钥
                </label>
                <Input
                  type="password"
                  placeholder="sk-or-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  模型
                </label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                <SelectContent>
                  {/* OpenAI 系列 */}
                  <SelectItem value="anthropic/claude-sonnet-4">Claude Sonnet 4</SelectItem>
                  <SelectItem value="openai/gpt-4.5-preview">GPT-4.5 (Preview)</SelectItem>
                  <SelectItem value="openai/gpt-4o-search-preview">GPT-4o Search Preview</SelectItem>
                  <SelectItem value="openai/gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  
                  {/* Anthropic 系列 */}
                  <SelectItem value="anthropic/claude-opus-4">Claude Opus 4</SelectItem>
                  <SelectItem value="anthropic/claude-sonnet-4">Claude Sonnet 4</SelectItem>
                  <SelectItem value="anthropic/claude-3.7-sonnet-thinking">Claude 3.7 Sonnet (Thinking)</SelectItem>
                  <SelectItem value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
                  
                  {/* Google 系列 */}
                  <SelectItem value="google/gemini-2.5-pro-preview">Gemini 2.5 Pro Preview</SelectItem>
                  <SelectItem value="google/gemini-2.5-flash-preview">Gemini 2.5 Flash Preview</SelectItem>
                  <SelectItem value="google/gemini-2.5-flash-lite">Gemini 2.5 Flash Lite</SelectItem>
                  <SelectItem value="google/gemini-2.5-flash-image">Gemini 2.5 Flash Image</SelectItem>
                  <SelectItem value="google/gemini-pro-1.5">Gemini Pro 1.5</SelectItem>
                  
                  {/* DeepSeek 系列 */}
                  <SelectItem value="deepseek/deepseek-v3">DeepSeek V3</SelectItem>
                  
                  {/* Perplexity 系列 */}
                  <SelectItem value="perplexity/sonar-deep-research">Perplexity Sonar Deep Research</SelectItem>
                </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={clearChat}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                清空对话
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* 对话区域 */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">对话</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* 消息列表 */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>开始与AI对话吧！</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex gap-3 ${
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">AI正在思考...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 错误提示 */}
              {error && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-600">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* 输入区域 */}
              <div className="flex gap-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="输入消息..."
                  className="flex-1 min-h-[60px] resize-none"
                  disabled={isLoading}
                />
                <Button
                  onClick={sendMessage}
                  disabled={isLoading || !message.trim() || !apiKey.trim()}
                  size="lg"
                  className="self-end"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 使用说明 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>1. 在左侧配置面板中输入您的OpenRouter API密钥</p>
          <p>2. 选择要测试的AI模型</p>
          <p>3. 在对话区域输入消息，按Enter发送</p>
          <p>4. 支持多轮对话，AI会记住之前的对话内容</p>
          <p className="text-amber-600 font-medium">
            ⚠️ 注意：每次对话都会消耗您的OpenRouter账户余额
          </p>
        </CardContent>
      </Card>
    </div>
  )
}