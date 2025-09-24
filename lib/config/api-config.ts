// API配置管理 - 简化版本
export interface APIConfig {
  openrouter: {
    apiKey: string
    baseUrl: string
    defaultModel: string
    fallbackModel: string
  }
}

// 默认配置
const DEFAULT_CONFIG: APIConfig = {
  openrouter: {
    apiKey: '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',
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'anthropic/claude-sonnet-4', // 使用Claude 4
    fallbackModel: 'anthropic/claude-3.5-sonnet'
  }
}

// 配置管理类
export class APIConfigManager {
  private static instance: APIConfigManager
  private config: APIConfig

  private constructor() {
    this.config = this.loadConfig()
  }

  public static getInstance(): APIConfigManager {
    if (!APIConfigManager.instance) {
      APIConfigManager.instance = new APIConfigManager()
    }
    return APIConfigManager.instance
  }

  private loadConfig(): APIConfig {
    try {
      // 首先尝试从环境变量获取API密钥
      let config = { ...DEFAULT_CONFIG }
      
      // 在服务器端，从环境变量读取
      if (typeof window === 'undefined') {
        const envApiKey = process.env.OPENROUTER_API_KEY
        if (envApiKey) {
          config.openrouter.apiKey = envApiKey
        }
        return config
      }
      
      // 在浏览器端，优先从localStorage读取，然后从环境变量读取
      const saved = localStorage.getItem('api-config')
      if (saved) {
        const userConfig = JSON.parse(saved)
        config = this.mergeConfig(config, userConfig)
      }
      
      // 检查localStorage中的单独API密钥存储
      const storedApiKey = localStorage.getItem('openrouter-api-key')
      if (storedApiKey) {
        config.openrouter.apiKey = storedApiKey
      }
      
      return config
    } catch (error) {
      console.warn('Failed to load API config:', error)
    }
    
    return DEFAULT_CONFIG
  }

  private mergeConfig(defaultConfig: APIConfig, userConfig: Partial<APIConfig>): APIConfig {
    return {
      openrouter: {
        ...defaultConfig.openrouter,
        ...userConfig.openrouter
      }
    }
  }

  public getConfig(): APIConfig {
    return this.config
  }

  public getOpenRouterConfig() {
    return this.config.openrouter
  }

  public updateOpenRouterKey(apiKey: string): void {
    this.config.openrouter.apiKey = apiKey
    this.saveConfig()
  }

  public updateDefaultModel(model: string): void {
    this.config.openrouter.defaultModel = model
    this.saveConfig()
  }

  private saveConfig(): void {
    try {
      // 检查是否在浏览器环境
      if (typeof window === 'undefined') {
        return
      }
      
      localStorage.setItem('api-config', JSON.stringify(this.config))
    } catch (error) {
      console.warn('Failed to save API config:', error)
    }
  }

  public resetToDefault(): void {
    this.config = DEFAULT_CONFIG
    this.saveConfig()
  }

  // 验证API密钥格式
  public validateApiKey(apiKey: string): { valid: boolean; error?: string } {
    if (!apiKey) {
      return { valid: false, error: 'API密钥不能为空' }
    }
    
    if (!apiKey.startsWith('sk-or-')) {
      return { valid: false, error: 'API密钥格式无效，必须以sk-or-开头' }
    }
    
    if (apiKey.length < 20) {
      return { valid: false, error: 'API密钥长度不足' }
    }
    
    return { valid: true }
  }
}

// 导出单例实例
export const apiConfig = APIConfigManager.getInstance()

// 便捷函数
export const getOpenRouterConfig = () => apiConfig.getOpenRouterConfig()
export const updateOpenRouterKey = (key: string) => apiConfig.updateOpenRouterKey(key)
export const updateDefaultModel = (model: string) => apiConfig.updateDefaultModel(model)
export const validateApiKey = (key: string) => apiConfig.validateApiKey(key)
