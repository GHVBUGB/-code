import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    console.log('OpenRouter API called')
    const body = await req.json()
    console.log('Request body:', body)
    
    const { endpoint, method = 'POST', data = {}, apiKey } = body

    // 必须从前端传递API密钥
    if (!apiKey) {
      return NextResponse.json({ 
        success: false, 
        error: '请在前端配置OpenRouter API密钥' 
      }, { status: 400 })
    }

    // 验证API密钥格式
    if (!apiKey.startsWith('sk-or-')) {
      return NextResponse.json({ 
        success: false, 
        error: 'API密钥格式无效，必须以sk-or-开头' 
      }, { status: 400 })
    }

    const OPENROUTER_BASE = 'https://openrouter.ai/api/v1'
    const url = `${OPENROUTER_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
    
    console.log('Making request to:', url)

    // 动态获取来源，用于 Referer 识别
    const incomingOrigin = req.headers.get('origin')
      || (() => { try { return new URL(req.url).origin } catch { return undefined } })()
      || req.headers.get('referer')
      || 'http://localhost:3000'

    const xTitle = req.headers.get('x-app-title') || 'CodeGuide AI'

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      // OpenRouter 推荐带上 HTTP-Referer 与 X-Title
      'HTTP-Referer': incomingOrigin,
      'Referer': incomingOrigin,
      'X-Title': xTitle,
    }

    // 为聊天请求添加提供商路由配置
    let requestData = data
    if (endpoint === '/chat/completions' && method.toUpperCase() === 'POST') {
      requestData = {
        ...data,
        provider: {
          order: ['OpenAI', 'Anthropic', 'Google', 'Azure'],
          allow_fallbacks: true
        }
      }
    }

    const response = await fetch(url, {
      method: method.toUpperCase(),
      headers,
      body: method.toUpperCase() === 'GET' ? undefined : JSON.stringify(requestData)
    })

    console.log('Response status:', response.status)
    const responseText = await response.text()
    console.log('Response text:', responseText)
    
    // 如果响应不成功，返回错误信息
    if (!response.ok) {
      console.log('OpenRouter API失败，返回错误信息')
      
      // 其他情况返回错误
      try {
        const errorResponse = JSON.parse(responseText)
        const errorMessage = errorResponse.error?.message || errorResponse.message || `HTTP ${response.status}: ${response.statusText}`
        return NextResponse.json({ 
          success: false, 
          error: errorMessage,
          details: errorResponse
        }, { status: response.status })
      } catch {
        return NextResponse.json({ 
          success: false, 
          error: `HTTP ${response.status}: ${response.statusText}`,
          details: responseText
        }, { status: response.status })
      }
    }
    
    // 尝试解析JSON响应
    try {
      const jsonResponse = JSON.parse(responseText)
      return NextResponse.json(jsonResponse, { status: response.status })
    } catch {
      // 如果不是JSON，直接返回文本
      return new NextResponse(responseText, { status: response.status })
    }
  } catch (error) {
    console.error('OpenRouter API Error:', error)
    
    let errorMessage = 'API请求失败'
    if (error instanceof Error) {
      errorMessage = error.message
    } else if (typeof error === 'string') {
      errorMessage = error
    } else if (error && typeof error === 'object') {
      if ('message' in error) {
        errorMessage = String(error.message)
      } else if ('error' in error) {
        errorMessage = String(error.error)
      }
    }
    
    return NextResponse.json({ 
      success: false, 
      error: errorMessage
    }, { status: 500 })
  }
}
