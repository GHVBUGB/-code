// OpenRouter AI Service - 使用配置管理
import { getOpenRouterConfig } from '../config/api-config'

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface ClarificationQuestion {
  id: number
  category: string
  question: string
  required: boolean
}

export interface ClarificationAnswer {
  id: number
  answer: string
}

export interface FeatureItem {
  id: string
  name: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: string
}

export interface TechStackItem {
  id: string
  name: string
  category: string
  description: string
  reason: string
}

export interface PRDData {
  name: string
  description: string
  type: string
  clarificationAnswers?: Record<number, string>
  features?: FeatureItem[]
  techStack?: TechStackItem[]
}

export const AI_MODELS = {
  // OpenAI 系列 - 最新模型
  CLAUDE_SONNET_4: 'anthropic/claude-sonnet-4',
  GPT45_PREVIEW: 'openai/gpt-4.5-preview',
  GPT4O_SEARCH: 'openai/gpt-4o-search-preview',
  GPT4_TURBO: 'openai/gpt-4-turbo',
  
  // Anthropic 系列 - 最新模型
  CLAUDE_OPUS_4: 'anthropic/claude-opus-4',
  CLAUDE_SONNET_4: 'anthropic/claude-sonnet-4',
  CLAUDE_37_SONNET_THINKING: 'anthropic/claude-3.7-sonnet-thinking',
  CLAUDE_35_SONNET: 'anthropic/claude-3.5-sonnet',
  
  // Google 系列 - 最新模型
  GEMINI_25_PRO_PREVIEW: 'google/gemini-2.5-pro-preview',
  GEMINI_25_FLASH_PREVIEW: 'google/gemini-2.5-flash-preview',
  GEMINI_25_FLASH_LITE: 'google/gemini-2.5-flash-lite',
  GEMINI_25_FLASH_IMAGE: 'google/gemini-2.5-flash-image',
  GEMINI_PRO_15: 'google/gemini-pro-1.5',
  
  // DeepSeek 系列
  DEEPSEEK_V3: 'deepseek/deepseek-v3',
  
  // Perplexity 系列
  PERPLEXITY_SONAR: 'perplexity/sonar-deep-research'
} as const

export class OpenRouterService {
  private apiKey: string
  private proxyUrl = '/api/openrouter'
  private config = getOpenRouterConfig()

  constructor(apiKey?: string) {
    this.apiKey = apiKey || this.config.apiKey
  }

  private async makeRequest(endpoint: string, data: any, method: string = 'POST'): Promise<any> {
    try {
      const response = await fetch(this.proxyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          endpoint, 
          method, 
          data, 
          apiKey: this.apiKey 
        })
      })

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`
        
        try {
          const errorData = await response.json()
          if (errorData.error) {
            errorMessage = typeof errorData.error === 'string' 
              ? errorData.error 
              : JSON.stringify(errorData.error)
          }
        } catch {
          // 如果无法解析JSON，使用默认错误消息
        }
        
        throw new Error(errorMessage)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('OpenRouter API request failed:', error)
      throw error
    }
  }

  async testConnection(): Promise<APIResponse<boolean>> {
    try {
      await this.makeRequest('/models', {}, 'GET')
      return { success: true, data: true }
    } catch (error) {
      let errorMessage = 'API连接失败'
      
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      } else if (error && typeof error === 'object') {
        // 处理可能的对象错误
        if ('message' in error) {
          errorMessage = String(error.message)
        } else if ('error' in error) {
          errorMessage = String(error.error)
        } else {
          errorMessage = 'API连接失败，请检查网络和API密钥'
        }
      }
      
      return { success: false, error: errorMessage }
    }
  }

  async optimizeDescription(params: {
    projectName: string
    description: string
    model?: string
  }): Promise<APIResponse<string>> {
    try {
      const prompt = `请优化以下项目描述，使其更加专业、清晰和吸引人：

项目名称：${params.projectName}
当前描述：${params.description}

请提供优化后的项目描述，要求：
1. 保持原意不变
2. 语言更加专业
3. 突出项目价值
4. 控制在200字以内

优化后的描述：`

      const response = await this.makeRequest('/chat/completions', {
        model: params.model || this.config.defaultModel,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })

      const optimizedDescription = response.choices?.[0]?.message?.content?.trim()
      
      if (!optimizedDescription) {
        throw new Error('AI返回内容为空')
      }

      return { success: true, data: optimizedDescription }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '优化失败' }
    }
  }

  async generateClarificationQuestions(params: {
    projectName: string
    projectDescription: string
    projectType?: string
  }): Promise<APIResponse<ClarificationQuestion[]>> {
    try {
      const prompt = `基于以下项目信息，生成5-8个澄清问题来帮助更好地理解项目需求：

项目名称：${params.projectName}
项目描述：${params.projectDescription}
项目类型：${params.projectType || 'web应用'}

请生成澄清问题，要求：
1. 问题要具体、实用
2. 涵盖功能需求、用户群体、技术要求、性能要求、预算时间等方面
3. 每个问题都要有明确的分类
4. 标记哪些是必答题
5. 返回JSON格式，包含id、category、question、required字段

返回格式：
[
  {
    "id": 1,
    "category": "功能需求",
    "question": "请详细描述你的项目核心功能有哪些？",
    "required": true
  }
]`

      const response = await this.makeRequest('/chat/completions', {
        model: this.config.defaultModel,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.7
      })

      const content = response.choices?.[0]?.message?.content?.trim()
      
      if (!content) {
        throw new Error('AI返回内容为空')
      }

      // 尝试解析JSON
      let questions: ClarificationQuestion[]
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          questions = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('无法找到JSON格式的问题列表')
        }
      } catch (parseError) {
        // 如果解析失败，返回默认问题
        questions = [
          {
            id: 1,
            category: "功能需求",
            question: "请详细描述你的项目核心功能有哪些？",
            required: true
          },
          {
            id: 2,
            category: "用户群体",
            question: "你的目标用户是谁？他们有什么特点？",
            required: true
          },
          {
            id: 3,
            category: "技术要求",
            question: "对技术栈有特殊要求吗？比如必须使用某些技术？",
            required: false
          },
          {
            id: 4,
            category: "性能要求",
            question: "对性能有什么要求？预期的用户量级？",
            required: false
          },
          {
            id: 5,
            category: "预算时间",
            question: "项目的预算和时间限制是什么？",
            required: true
          }
        ]
      }

      return { success: true, data: questions }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '生成问题失败' }
    }
  }

  async generateFeatureList(params: {
    projectName: string
    projectDescription: string
    clarificationAnswers?: Record<number, string>
  }): Promise<APIResponse<FeatureItem[]>> {
    try {
      const answersText = params.clarificationAnswers 
        ? Object.values(params.clarificationAnswers).join('\n')
        : ''

      const prompt = `基于以下项目信息，生成详细的功能清单：

项目名称：${params.projectName}
项目描述：${params.projectDescription}
澄清问题答案：${answersText}

请生成功能清单，要求：
1. 功能要具体、可实现
2. 按优先级分类（high/medium/low）
3. 按功能类别分组
4. 每个功能都要有清晰的描述
5. 返回JSON格式

返回格式：
[
  {
    "id": "feature_1",
    "name": "功能名称",
    "description": "功能描述",
    "priority": "high",
    "category": "用户管理"
  }
]`

      const response = await this.makeRequest('/chat/completions', {
        model: this.config.defaultModel,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.7
      })

      const content = response.choices?.[0]?.message?.content?.trim()
      
      if (!content) {
        throw new Error('AI返回内容为空')
      }

      let features: FeatureItem[]
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          features = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('无法找到JSON格式的功能列表')
        }
      } catch (parseError) {
        // 默认功能列表
        features = [
          {
            id: 'feature_1',
            name: '用户注册登录',
            description: '用户可以通过邮箱或手机号注册和登录系统',
            priority: 'high',
            category: '用户管理'
          },
          {
            id: 'feature_2',
            name: '核心功能模块',
            description: '实现项目的主要业务功能',
            priority: 'high',
            category: '核心功能'
          }
        ]
      }

      return { success: true, data: features }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '生成功能清单失败' }
    }
  }

  async generateTechStack(params: {
    projectName: string
    projectDescription: string
    clarificationAnswers?: Record<number, string>
  }): Promise<APIResponse<TechStackItem[]>> {
    try {
      const answersText = params.clarificationAnswers 
        ? Object.values(params.clarificationAnswers).join('\n')
        : ''

      const prompt = `基于以下项目信息，推荐合适的技术栈：

项目名称：${params.projectName}
项目描述：${params.projectDescription}
澄清问题答案：${answersText}

请推荐技术栈，要求：
1. 技术要成熟、稳定
2. 适合项目类型和规模
3. 包含前端、后端、数据库、部署等
4. 每个技术都要说明选择理由
5. 返回JSON格式

返回格式：
[
  {
    "id": "tech_1",
    "name": "技术名称",
    "category": "前端",
    "description": "技术描述",
    "reason": "选择理由"
  }
]`

      const response = await this.makeRequest('/chat/completions', {
        model: this.config.defaultModel,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.7
      })

      const content = response.choices?.[0]?.message?.content?.trim()
      
      if (!content) {
        throw new Error('AI返回内容为空')
      }

      let techStack: TechStackItem[]
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          techStack = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('无法找到JSON格式的技术栈列表')
        }
      } catch (parseError) {
        // 默认技术栈
        techStack = [
          {
            id: 'tech_1',
            name: 'Next.js',
            category: '前端',
            description: 'React全栈框架',
            reason: '提供SSR、路由、API等完整解决方案'
          },
          {
            id: 'tech_2',
            name: 'TypeScript',
            category: '开发语言',
            description: 'JavaScript的超集',
            reason: '提供类型安全，提高代码质量'
          }
        ]
      }

      return { success: true, data: techStack }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '生成技术栈失败' }
    }
  }

  async generatePRD(projectData: PRDData): Promise<APIResponse<{ prd: string }>> {
    try {
      const prompt = `基于以下项目信息，生成完整的PRD（产品需求文档）：

项目信息：
- 名称：${projectData.name}
- 描述：${projectData.description}
- 类型：${projectData.type}

功能清单：
${projectData.features?.map(f => `- ${f.name}: ${f.description}`).join('\n') || '暂无'}

技术栈：
${projectData.techStack?.map(t => `- ${t.name}: ${t.description}`).join('\n') || '暂无'}

澄清问题答案：
${projectData.clarificationAnswers ? Object.values(projectData.clarificationAnswers).join('\n') : '暂无'}

请生成专业的PRD文档，包含：
1. 项目概述
2. 功能需求
3. 技术架构
4. 开发计划
5. 风险评估

要求文档结构清晰，内容专业，适合开发团队使用。`

      const response = await this.makeRequest('/chat/completions', {
        model: this.config.defaultModel,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.7
      })

      const prd = response.choices?.[0]?.message?.content?.trim()
      
      if (!prd) {
        throw new Error('AI返回内容为空')
      }

      return { success: true, data: { prd } }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : '生成PRD失败' }
    }
  }
}