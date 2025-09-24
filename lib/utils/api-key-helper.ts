// API密钥辅助工具
export interface APIKeyStatus {
  hasKey: boolean
  isValid: boolean
  error?: string
  keyPreview?: string
}

export class APIKeyHelper {
  static getAPIKey(): string | null {
    if (typeof window === 'undefined') {
      // 服务器端：从环境变量读取
      return process.env.OPENROUTER_API_KEY || null
    }
    
    // 浏览器端：优先从localStorage读取，然后从环境变量读取
    const localStorageKey = localStorage.getItem('openrouter-api-key')
    if (localStorageKey) {
      return localStorageKey
    }
    
    // 如果localStorage中没有，尝试从环境变量读取（通过Next.js的NEXT_PUBLIC_前缀）
    return process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || null
  }

  static getAPIKeyStatus(): APIKeyStatus {
    const apiKey = this.getAPIKey()
    
    if (!apiKey) {
      return {
        hasKey: false,
        isValid: false,
        error: '未找到API密钥'
      }
    }

    if (!apiKey.startsWith('sk-or-')) {
      return {
        hasKey: true,
        isValid: false,
        error: 'API密钥格式无效，应以"sk-or-"开头',
        keyPreview: `${apiKey.substring(0, 8)}...`
      }
    }

    return {
      hasKey: true,
      isValid: true,
      keyPreview: `${apiKey.substring(0, 12)}...`
    }
  }

  static async testAPIKey(apiKey?: string): Promise<{ success: boolean; error?: string; details?: any }> {
    const key = apiKey || this.getAPIKey()
    
    if (!key) {
      return { success: false, error: '未找到API密钥' }
    }

    if (!key.startsWith('sk-or-')) {
      return { success: false, error: 'API密钥格式无效' }
    }

    try {
      console.log('Testing API key:', `${key.substring(0, 12)}...`)
      console.log('Request headers:', {
        'Authorization': `Bearer ${key.substring(0, 12)}...`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'CodeGuide AI'
      })

      const response = await fetch('https://openrouter.ai/api/v1/models', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${key}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'CodeGuide AI'
        }
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      if (response.status === 401) {
        const errorText = await response.text()
        console.log('401 Error response:', errorText)
        return { 
          success: false, 
          error: 'API密钥无效或已过期',
          details: { status: 401, response: errorText }
        }
      }

      if (response.status === 402) {
        return { success: false, error: 'API配额不足，请检查账户余额' }
      }

      if (response.status === 403) {
        const errorText = await response.text()
        console.log('403 Error response:', errorText)
        return { 
          success: false, 
          error: 'API访问被拒绝，请检查账户权限',
          details: { status: 403, response: errorText }
        }
      }

      if (!response.ok) {
        const errorText = await response.text()
        console.log('Error response:', errorText)
        return { 
          success: false, 
          error: `API请求失败 (${response.status})`,
          details: { status: response.status, response: errorText }
        }
      }

      const data = await response.json()
      console.log('Success response:', data)
      return { success: true, details: data }
    } catch (error) {
      console.error('Network error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '网络连接失败',
        details: { error: error }
      }
    }
  }

  static getSetupInstructions(): string[] {
    return [
      '1. 访问 https://openrouter.ai/ 注册账户',
      '2. 在账户设置中创建API密钥',
      '3. 复制以"sk-or-"开头的API密钥',
      '4. 在设置页面粘贴并保存API密钥',
      '5. 验证密钥有效性后即可使用AI功能'
    ]
  }
}
