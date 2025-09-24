import { AuthService, LoginData, RegisterData } from './supabase/auth'
import { ProjectService, CreateProjectData, UpdateProjectData } from './supabase/projects'
import { OpenRouterService, AI_MODELS } from './ai/openrouter'
import { getOpenRouterConfig, validateApiKey } from './config/api-config'

export interface User {
  id: string
  username: string
  email: string
}

export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// Error handler
export const handleAPIError = (error: any): string => {
  if (typeof error === 'string') return error
  if (error?.message) return error.message
  return '发生未知错误'
}

// Authentication API
export const authAPI = {
  async login(credentials: LoginData): Promise<APIResponse<{ user: User; token: string }>> {
    try {
      const result = await AuthService.login(credentials)
      
      if (result.success && result.user) {
        // Generate a simple token (in production, use proper JWT)
        const token = btoa(JSON.stringify({ userId: result.user.id, exp: Date.now() + 24 * 60 * 60 * 1000 }))
        
        return {
          success: true,
          data: {
            user: result.user,
            token
          }
        }
      }
      
      return {
        success: false,
        error: result.error || '登录失败'
      }
    } catch (error) {
      return {
        success: false,
        error: handleAPIError(error)
      }
    }
  },

  async register(userData: RegisterData): Promise<APIResponse<{ user: User }>> {
    try {
      const result = await AuthService.register(userData)
      
      if (result.success && result.user) {
        return {
          success: true,
          data: {
            user: result.user
          }
        }
      }
      
      return {
        success: false,
        error: result.error || '注册失败'
      }
    } catch (error) {
      return {
        success: false,
        error: handleAPIError(error)
      }
    }
  },

  async getCurrentUser(): Promise<APIResponse<User>> {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        return {
          success: false,
          error: '用户未登录'
        }
      }

      // Decode token to get user ID
      const tokenData = JSON.parse(atob(token))
      if (tokenData.exp < Date.now()) {
        localStorage.removeItem('auth-token')
        return {
          success: false,
          error: '登录已过期'
        }
      }

      const result = await AuthService.getUserById(tokenData.userId)
      
      if (result.success && result.user) {
        return {
          success: true,
          data: result.user
        }
      }
      
      return {
        success: false,
        error: result.error || '获取用户信息失败'
      }
    } catch (error) {
      return {
        success: false,
        error: handleAPIError(error)
      }
    }
  }
}

// Project API
export const projectAPI = {
  async createProject(projectData: CreateProjectData): Promise<APIResponse<any>> {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        return { success: false, error: '用户未登录' }
      }

      const tokenData = JSON.parse(atob(token))
      const result = await ProjectService.createProject(tokenData.userId, projectData)
      
      return result
    } catch (error) {
      return {
        success: false,
        error: handleAPIError(error)
      }
    }
  },

  async getProjects(): Promise<APIResponse<any[]>> {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        return { success: false, error: '用户未登录' }
      }

      const tokenData = JSON.parse(atob(token))
      const result = await ProjectService.getUserProjects(tokenData.userId)
      
      return {
        success: result.success,
        data: result.projects,
        error: result.error
      }
    } catch (error) {
      return {
        success: false,
        error: handleAPIError(error)
      }
    }
  },

  async updateProject(projectId: string, updateData: UpdateProjectData): Promise<APIResponse<any>> {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        return { success: false, error: '用户未登录' }
      }

      const tokenData = JSON.parse(atob(token))
      const result = await ProjectService.updateProject(projectId, tokenData.userId, updateData)
      
      return result
    } catch (error) {
      return {
        success: false,
        error: handleAPIError(error)
      }
    }
  },

  async getUserProjects(): Promise<APIResponse<any[]>> {
    return this.getProjects()
  },

  async saveDraft(projectData: any): Promise<APIResponse<{ id: string }>> {
    const result = await this.createProject(projectData)
    if (result.success && result.data) {
      return {
        success: true,
        data: { id: result.data.id }
      }
    }
    return result as APIResponse<{ id: string }>
  },

  async deleteProject(projectId: string): Promise<APIResponse<null>> {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        return { success: false, error: '用户未登录' }
      }

      const tokenData = JSON.parse(atob(token))
      const result = await ProjectService.deleteProject(projectId, tokenData.userId)
      
      return {
        success: result.success,
        data: null,
        error: result.error
      }
    } catch (error) {
      return {
        success: false,
        error: handleAPIError(error)
      }
    }
  }
}

// AI API - 使用配置管理系统
export const aiAPI = {
  // 项目上下文分析方法
  analyzeProjectContext(projectData: { 
    name: string; 
    description: string; 
    type: string;
    selectedModel?: string;
    selectedTools?: string[];
  }) {
    const { name, description, type, selectedModel, selectedTools } = projectData
    
    // 项目类型特定分析
    const typeAnalysis = this.getProjectTypeAnalysis(type)
    
    // 描述关键词分析
    const keywordAnalysis = this.analyzeDescriptionKeywords(description)
    
    // 项目规模推测
    const scaleAnalysis = this.estimateProjectScale(description)
    
    // AI模型和工具选择分析
    const techStackAnalysis = this.analyzeTechStackChoices(selectedModel, selectedTools)
    
    return {
      contextInfo: `
### 项目类型特征分析
${typeAnalysis.characteristics}

### 关键需求识别
${keywordAnalysis.keyRequirements}

### 项目规模评估
${scaleAnalysis.estimation}

### 技术复杂度分析
${typeAnalysis.technicalComplexity}

${techStackAnalysis.contextInfo}`,
      
      suggestions: `
### 重点关注领域
${typeAnalysis.focusAreas}

### 常见挑战点
${typeAnalysis.commonChallenges}

### 建议问题方向
${keywordAnalysis.questionDirections}

${techStackAnalysis.suggestions}`
    }
  },

  // AI模型和工具选择分析
  analyzeTechStackChoices(selectedModel?: string, selectedTools?: string[]) {
    let contextInfo = ''
    let suggestions = ''
    
    if (selectedModel) {
      contextInfo += `
### AI模型集成分析
- **选择的AI模型**: ${selectedModel}
- **集成考虑**: 该模型的API调用方式、响应时间、成本控制
- **应用场景**: 需要明确AI功能在项目中的具体应用场景`
      
      suggestions += `
### AI集成重点关注
- AI模型的具体应用场景和集成方式
- 数据处理流程和模型调用架构
- AI功能的性能要求和成本控制
- 用户交互体验和AI响应优化`
    }
    
    if (selectedTools && selectedTools.length > 0) {
      contextInfo += `
### 开发工具栈分析
- **选择的工具**: ${selectedTools.join(', ')}
- **工具集成**: 需要考虑工具间的兼容性和协作流程
- **开发效率**: 工具选择对开发速度和代码质量的影响`
      
      suggestions += `
### 开发工具集成重点
- 开发流程和CI/CD集成方案
- 技术栈兼容性和依赖管理
- 团队协作和代码质量保证
- 部署和运维自动化需求`
    }
    
    return {
      contextInfo: contextInfo || '### 技术栈分析\n- 未选择特定的AI模型或开发工具',
      suggestions: suggestions || '### 技术选型建议\n- 建议明确AI模型和开发工具的选择'
    }
  },

  // 项目类型分析
  getProjectTypeAnalysis(type: string) {
    const typeMap: Record<string, any> = {
      'web应用': {
        characteristics: '- 需要考虑前后端架构设计\n- 用户界面和交互体验是关键\n- 需要处理数据存储和API设计',
        technicalComplexity: '- 前端框架选择（React/Vue/Angular）\n- 后端技术栈（Node.js/Python/Java）\n- 数据库设计和优化',
        focusAreas: '- 用户认证和权限管理\n- 数据安全和隐私保护\n- 性能优化和SEO',
        commonChallenges: '- 跨浏览器兼容性\n- 响应式设计适配\n- API接口设计和版本管理'
      },
      '移动应用': {
        characteristics: '- 需要考虑iOS/Android平台差异\n- 移动端特有的交互模式\n- 设备性能和电池优化',
        technicalComplexity: '- 原生开发vs跨平台方案\n- 推送通知和离线功能\n- 应用商店发布流程',
        focusAreas: '- 用户体验和界面设计\n- 设备权限管理\n- 数据同步和缓存策略',
        commonChallenges: '- 不同屏幕尺寸适配\n- 网络连接不稳定处理\n- 应用性能和启动速度'
      },
      '桌面应用': {
        characteristics: '- 需要考虑操作系统兼容性\n- 本地文件系统访问\n- 系统集成和自动化',
        technicalComplexity: '- 跨平台框架选择（Electron/Qt/Flutter）\n- 系统API调用和权限\n- 安装包制作和分发',
        focusAreas: '- 用户界面设计和可用性\n- 文件处理和数据管理\n- 系统资源使用优化',
        commonChallenges: '- 不同操作系统的兼容性\n- 软件更新和版本管理\n- 安全性和权限控制'
      },
      'API服务': {
        characteristics: '- 专注于数据处理和业务逻辑\n- 需要考虑接口设计和文档\n- 高并发和性能要求',
        technicalComplexity: '- RESTful/GraphQL API设计\n- 数据库优化和缓存策略\n- 微服务架构考虑',
        focusAreas: '- API安全和认证机制\n- 数据验证和错误处理\n- 监控和日志系统',
        commonChallenges: '- 高并发处理\n- 数据一致性保证\n- API版本兼容性管理'
      },
      '数据分析': {
        characteristics: '- 大量数据处理和分析\n- 可视化展示需求\n- 算法和模型应用',
        technicalComplexity: '- 数据清洗和预处理\n- 机器学习模型选择\n- 大数据处理框架',
        focusAreas: '- 数据质量和准确性\n- 分析结果的可解释性\n- 实时vs批处理需求',
        commonChallenges: '- 数据源整合和标准化\n- 计算资源和性能优化\n- 结果可视化和报告生成'
      },
      '电商平台': {
        characteristics: '- 复杂的业务流程和状态管理\n- 支付和订单处理\n- 库存和物流管理',
        technicalComplexity: '- 分布式系统架构\n- 支付网关集成\n- 高可用性和容灾设计',
        focusAreas: '- 用户购买体验优化\n- 商品搜索和推荐\n- 订单和支付安全',
        commonChallenges: '- 高并发秒杀处理\n- 数据一致性保证\n- 多渠道库存同步'
      }
    }

    return typeMap[type] || {
      characteristics: '- 通用软件项目特征\n- 需要明确具体业务需求\n- 考虑用户使用场景',
      technicalComplexity: '- 技术栈选择和架构设计\n- 数据存储和处理方案\n- 用户界面和交互设计',
      focusAreas: '- 核心功能实现\n- 用户体验优化\n- 系统性能和稳定性',
      commonChallenges: '- 需求变更管理\n- 技术债务控制\n- 项目进度和质量平衡'
    }
  },

  // 描述关键词分析
  analyzeDescriptionKeywords(description: string) {
    const keywords = {
      userManagement: ['用户', '登录', '注册', '权限', '角色'],
      dataProcessing: ['数据', '分析', '统计', '报表', '导入', '导出'],
      realTime: ['实时', '即时', '同步', '推送', '通知'],
      integration: ['集成', '对接', 'API', '第三方', '接口'],
      mobile: ['移动', '手机', '微信', '小程序', 'APP'],
      ecommerce: ['商城', '购物', '支付', '订单', '商品', '库存'],
      social: ['社交', '分享', '评论', '点赞', '关注'],
      search: ['搜索', '查询', '筛选', '排序'],
      multimedia: ['图片', '视频', '文件', '上传', '下载']
    }

    const foundFeatures: string[] = []
    const questionDirections: string[] = []

    Object.entries(keywords).forEach(([feature, words]) => {
      if (words.some(word => description.includes(word))) {
        switch (feature) {
          case 'userManagement':
            foundFeatures.push('用户管理系统')
            questionDirections.push('- 用户认证方式和权限级别设计')
            break
          case 'dataProcessing':
            foundFeatures.push('数据处理功能')
            questionDirections.push('- 数据来源、格式和处理频率')
            break
          case 'realTime':
            foundFeatures.push('实时功能')
            questionDirections.push('- 实时性要求和技术实现方案')
            break
          case 'integration':
            foundFeatures.push('系统集成')
            questionDirections.push('- 集成的第三方系统和数据交换格式')
            break
          case 'mobile':
            foundFeatures.push('移动端支持')
            questionDirections.push('- 移动端功能范围和平台支持')
            break
          case 'ecommerce':
            foundFeatures.push('电商功能')
            questionDirections.push('- 支付方式、订单流程和库存管理')
            break
          case 'social':
            foundFeatures.push('社交功能')
            questionDirections.push('- 社交互动方式和内容管理策略')
            break
          case 'search':
            foundFeatures.push('搜索功能')
            questionDirections.push('- 搜索范围、算法和性能要求')
            break
          case 'multimedia':
            foundFeatures.push('多媒体处理')
            questionDirections.push('- 文件类型、大小限制和存储方案')
            break
        }
      }
    })

    return {
      keyRequirements: foundFeatures.length > 0 
        ? foundFeatures.map(f => `- ${f}`).join('\n')
        : '- 需要进一步明确具体功能需求',
      questionDirections: questionDirections.length > 0
        ? questionDirections.join('\n')
        : '- 深入了解核心业务流程和用户需求\n- 明确技术实现的关键约束条件'
    }
  },

  // 项目规模评估
  estimateProjectScale(description: string) {
    const scaleIndicators = {
      small: ['简单', '基础', '小型', '个人', '演示'],
      medium: ['中等', '企业', '团队', '部门', '管理'],
      large: ['大型', '平台', '系统', '复杂', '分布式', '高并发']
    }

    let estimatedScale = 'medium' // 默认中等规模
    
    Object.entries(scaleIndicators).forEach(([scale, indicators]) => {
      if (indicators.some(indicator => description.includes(indicator))) {
        estimatedScale = scale
      }
    })

    const scaleDescriptions = {
      small: '- 小型项目，功能相对简单\n- 用户量预计在千级别\n- 可采用简化的技术架构',
      medium: '- 中等规模项目，功能较为完整\n- 用户量预计在万级别\n- 需要考虑扩展性和维护性',
      large: '- 大型项目，功能复杂多样\n- 用户量预计在十万级以上\n- 需要分布式架构和高可用设计'
    }

    return {
      estimation: scaleDescriptions[estimatedScale as keyof typeof scaleDescriptions]
    }
  },

  // 获取针对性的回退问题
  getFallbackQuestions(projectData: { name: string; description: string; type: string }) {
    const baseQuestions = [
      { id: 1, question: "项目的主要目标用户群体是什么？他们的典型使用场景和需求是什么？", category: "用户体验", importance: "high", reasoning: "明确目标用户有助于设计合适的功能和界面" },
      { id: 2, question: "项目的核心功能优先级如何排序？哪些是MVP必需功能？", category: "功能需求", importance: "high", reasoning: "确定开发优先级和项目范围" }
    ]

    // 根据项目类型添加特定问题
    const typeSpecificQuestions = this.getTypeSpecificQuestions(projectData.type)
    
    // 根据描述添加相关问题
    const contextQuestions = this.getContextSpecificQuestions(projectData.description)

    return [...baseQuestions, ...typeSpecificQuestions, ...contextQuestions].slice(0, 5)
  },

  // 获取类型特定问题
  getTypeSpecificQuestions(type: string) {
    const typeQuestions: Record<string, any[]> = {
      'web应用': [
        { id: 3, question: "需要支持哪些浏览器和设备？是否需要响应式设计？", category: "技术实现", importance: "medium", reasoning: "确定前端兼容性要求" },
        { id: 4, question: "预期的并发用户数量是多少？有哪些性能要求？", category: "项目规模", importance: "medium", reasoning: "指导架构设计和技术选型" }
      ],
      '移动应用': [
        { id: 3, question: "需要支持iOS和Android双平台吗？是否考虑跨平台开发？", category: "技术实现", importance: "high", reasoning: "决定开发方案和成本" },
        { id: 4, question: "应用需要哪些设备权限？是否需要离线功能？", category: "功能需求", importance: "medium", reasoning: "影响用户体验和技术实现" }
      ],
      'API服务': [
        { id: 3, question: "API的调用频率和并发量预期是多少？", category: "项目规模", importance: "high", reasoning: "决定架构设计和性能优化策略" },
        { id: 4, question: "需要什么级别的安全认证？是否需要API版本管理？", category: "技术实现", importance: "high", reasoning: "确保API的安全性和可维护性" }
      ]
    }

    return typeQuestions[type] || [
      { id: 3, question: "项目有哪些特殊的技术要求或约束条件？", category: "技术实现", importance: "medium", reasoning: "了解技术限制和特殊需求" },
      { id: 4, question: "项目的预算范围和时间要求是什么？", category: "商业价值", importance: "low", reasoning: "平衡功能范围和开发成本" }
    ]
  },

  // 获取上下文特定问题
  getContextSpecificQuestions(description: string) {
    const questions: any[] = []

    if (description.includes('支付') || description.includes('订单')) {
      questions.push({ id: 5, question: "需要集成哪些支付方式？对支付安全有什么特殊要求？", category: "功能需求", importance: "high", reasoning: "支付功能的安全性和用户体验至关重要" })
    } else if (description.includes('数据') || description.includes('分析')) {
      questions.push({ id: 5, question: "数据的来源、格式和更新频率是什么？需要什么级别的数据分析？", category: "技术实现", importance: "high", reasoning: "数据处理是项目的核心技术挑战" })
    } else if (description.includes('实时') || description.includes('推送')) {
      questions.push({ id: 5, question: "实时功能的响应时间要求是多少？需要支持多少并发连接？", category: "技术实现", importance: "high", reasoning: "实时性能直接影响用户体验" })
    } else {
      questions.push({ id: 5, question: "项目成功的关键指标是什么？如何衡量项目的商业价值？", category: "商业价值", importance: "medium", reasoning: "明确项目目标和成功标准" })
    }

    return questions
  },
  // 获取API配置
  getConfig() {
    return getOpenRouterConfig()
  },

  // 验证API密钥
  validateApiKey(apiKey: string) {
    return validateApiKey(apiKey)
  },

  async optimizeDescription(projectData: { name: string; description: string }, model: string): Promise<APIResponse<{ optimized: string }>> {
    try {
      // 使用直接的API调用方式，避免复杂的服务类
      const response = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: '/chat/completions',
          method: 'POST',
          apiKey: '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',
          data: {
            model: model || 'anthropic/claude-sonnet-4',
            messages: [
              {
                role: 'user',
                content: `请优化以下项目描述，使其更加专业、清晰和吸引人：

项目名称：${projectData.name}
当前描述：${projectData.description}

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

      if (!response.ok) {
        // 如果Claude Sonnet 4失败，自动回退到Claude 3.5
        if (model === 'anthropic/claude-sonnet-4') {
          console.log('Claude Sonnet 4 failed, falling back to Claude 3.5...')
          return this.optimizeDescription(projectData, 'anthropic/claude-3.5-sonnet')
        }
        
        const errorData = await response.json()
        return { 
          success: false, 
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}` 
        }
      }

      const data = await response.json()
      const optimizedDescription = data.choices?.[0]?.message?.content?.trim()
      
      if (!optimizedDescription) {
        return { success: false, error: 'AI返回内容为空' }
      }

      return { 
        success: true, 
        data: { optimized: optimizedDescription }
      }
    } catch (error) {
      console.error('Optimize description error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : '优化失败，请稍后重试' 
      }
    }
  },

  async generateClarificationQuestions(projectData: {
    name: string
    description: string
    type: string
    selectedModel?: string
    selectedTools?: string[]
  }): Promise<APIResponse<any[]>> {
    try {
      // 获取API密钥
      const { APIKeyHelper } = await import('./utils/api-key-helper')
      const apiKey = APIKeyHelper.getAPIKey()
      
      if (!apiKey) {
        return {
          success: false,
          error: '请先配置OpenRouter API密钥'
        }
      }

      // 项目类型分析和上下文增强
      const projectAnalysis = this.analyzeProjectContext(projectData)

      const response = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: '/chat/completions',
          method: 'POST',
          apiKey: apiKey,
          data: {
            model: 'anthropic/claude-sonnet-4',
            messages: [
              {
                role: 'system',
                content: `你是一个专业的产品需求分析师和技术架构师。你的任务是基于项目信息生成精准的澄清问题，帮助深入理解项目需求和技术实现细节。

你需要：
1. 深度分析项目描述中的关键信息和潜在需求
2. 识别项目类型的特定要求和常见痛点
3. 生成具有针对性的、能够获得关键信息的问题
4. 确保问题能够帮助明确技术选型和架构设计
5. 考虑项目的商业价值和用户体验

请始终以JSON格式返回结果。`
              },
              {
                role: 'user',
                content: `请基于以下项目信息，生成5个高质量的澄清问题：

## 项目基本信息
- **项目名称**: ${projectData.name}
- **项目描述**: ${projectData.description}
- **项目类型**: ${projectData.type}
${projectData.selectedModel ? `- **选择的AI模型**: ${projectData.selectedModel}` : ''}
${projectData.selectedTools && projectData.selectedTools.length > 0 ? `- **选择的开发工具**: ${projectData.selectedTools.join(', ')}` : ''}

## 项目分析结果
${projectAnalysis.contextInfo}

## 针对性建议
${projectAnalysis.suggestions}

## 技术栈上下文分析
${projectData.selectedModel ? `
**AI模型选择分析**:
- 选择的模型: ${projectData.selectedModel}
- 这表明项目可能需要AI功能集成，请重点关注AI相关的技术实现细节
` : ''}

${projectData.selectedTools && projectData.selectedTools.length > 0 ? `
**开发工具选择分析**:
- 选择的工具: ${projectData.selectedTools.join(', ')}
- 基于工具选择，请考虑相应的开发流程和技术栈兼容性问题
` : ''}

## 分析要求
请深度分析上述信息，并生成5个澄清问题。每个问题应该：

### 核心原则
1. **具体性**: 问题要具体明确，避免泛泛而谈
2. **针对性**: 根据项目类型、描述特点和技术选择提出针对性问题
3. **实用性**: 问题的答案应该能直接指导技术实现和产品设计
4. **层次性**: 涵盖不同层面的需求（功能、技术、用户、商业）
5. **上下文相关性**: 结合已选择的AI模型和开发工具，提出相关问题

### 问题类别指导
- **功能需求**: 深入挖掘核心功能的具体实现细节，特别是与AI集成相关的功能
- **技术实现**: 关注性能要求、技术约束、集成需求，考虑选择的技术栈
- **用户体验**: 了解目标用户、使用场景、交互需求
- **项目规模**: 明确数据量、并发量、扩展性要求
- **商业价值**: 理解商业目标、盈利模式、竞争优势

### 输出格式
请严格按照以下JSON格式返回：
[
  {
    "id": 1,
    "question": "具体的问题内容（要求详细、明确、有针对性）",
    "category": "功能需求|技术实现|用户体验|项目规模|商业价值",
    "importance": "high|medium|low",
    "reasoning": "为什么这个问题重要的简短说明"
  }
]

请确保生成的问题能够帮助我们深入理解项目的真实需求和技术挑战。`
              }
            ],
            max_tokens: 1500,
            temperature: 0.7
          }
        })
      })

      if (!response.ok) {
        // 如果Claude Sonnet 4失败，自动回退到Claude 3.5
        console.log('Claude Sonnet 4 failed, falling back to Claude 3.5...')
        return this.generateClarificationQuestions({
          ...projectData,
          type: projectData.type
        })
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content?.trim()
      
      if (!content) {
        return { success: false, error: 'AI返回内容为空' }
      }

      try {
        // 尝试解析JSON响应
        const questions = JSON.parse(content)
        if (Array.isArray(questions)) {
          return { success: true, data: questions }
        } else {
          // 如果不是数组，尝试提取问题
          const fallbackQuestions = this.getFallbackQuestions(projectData)
          return { success: true, data: fallbackQuestions }
        }
      } catch (parseError) {
        // JSON解析失败，返回针对性的默认问题
        const fallbackQuestions = this.getFallbackQuestions(projectData)
        return { success: true, data: fallbackQuestions }
      }
    } catch (error) {
      console.error('Generate clarification questions error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '生成澄清问题失败，请稍后重试'
      }
    }
  },

  async generateClarificationQuestionsWithModel(projectData: {
    name: string
    description: string
    type: string
    selectedModel?: string
    selectedTools?: string[]
  }, model: string): Promise<APIResponse<any[]>> {
    try {
      // 获取API密钥
      const { APIKeyHelper } = await import('./utils/api-key-helper')
      const apiKey = APIKeyHelper.getAPIKey()
      
      if (!apiKey) {
        return {
          success: false,
          error: '请先配置OpenRouter API密钥'
        }
      }

      // 项目类型分析和上下文增强
      const projectAnalysis = this.analyzeProjectContext(projectData)

      const response = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: '/chat/completions',
          method: 'POST',
          apiKey: apiKey,
          data: {
            model: model, // 使用传入的模型参数
            messages: [
              {
                role: 'system',
                content: `你是一个专业的产品需求分析师和技术架构师。你的任务是基于项目信息生成精准的澄清问题，帮助深入理解项目需求和技术实现细节。

你需要：
1. 深度分析项目描述中的关键信息和潜在需求
2. 识别项目类型的特定要求和常见痛点
3. 生成具有针对性的、能够获得关键信息的问题
4. 确保问题能够帮助明确技术选型和架构设计
5. 考虑项目的商业价值和用户体验
6. 特别关注已选择的AI模型和开发工具的集成需求

请始终以JSON格式返回结果。`
              },
              {
                role: 'user',
                content: `请基于以下项目信息，生成5个高质量的澄清问题：

## 项目基本信息
- **项目名称**: ${projectData.name}
- **项目描述**: ${projectData.description}
- **项目类型**: ${projectData.type}
${projectData.selectedModel ? `- **选择的AI模型**: ${projectData.selectedModel}` : ''}
${projectData.selectedTools && projectData.selectedTools.length > 0 ? `- **选择的开发工具**: ${projectData.selectedTools.join(', ')}` : ''}

## 项目分析结果
${projectAnalysis.contextInfo}

## 针对性建议
${projectAnalysis.suggestions}

## 技术栈上下文分析
${projectData.selectedModel ? `
**AI模型选择分析**:
- 选择的模型: ${projectData.selectedModel}
- 这表明项目需要AI功能集成，请重点关注：
  * AI模型的具体应用场景和集成方式
  * 数据处理和模型调用的技术架构
  * AI功能的性能要求和成本控制
  * 用户交互体验和AI响应优化
` : ''}

${projectData.selectedTools && projectData.selectedTools.length > 0 ? `
**开发工具选择分析**:
- 选择的工具: ${projectData.selectedTools.join(', ')}
- 基于工具选择，请考虑：
  * 开发流程和CI/CD集成
  * 技术栈兼容性和依赖管理
  * 团队协作和代码质量保证
  * 部署和运维自动化需求
` : ''}

## 分析要求
请深度分析上述信息，并生成5个澄清问题。每个问题应该：

### 核心原则
1. **具体性**: 问题要具体明确，避免泛泛而谈
2. **针对性**: 根据项目类型、描述特点和技术选择提出针对性问题
3. **实用性**: 问题的答案应该能直接指导技术实现和产品设计
4. **层次性**: 涵盖不同层面的需求（功能、技术、用户、商业）
5. **上下文相关性**: 结合已选择的AI模型和开发工具，提出相关问题

### 问题类别指导
- **功能需求**: 深入挖掘核心功能的具体实现细节，特别是与AI集成相关的功能
- **技术实现**: 关注性能要求、技术约束、集成需求，考虑选择的技术栈
- **用户体验**: 了解目标用户、使用场景、交互需求
- **项目规模**: 明确数据量、并发量、扩展性要求
- **商业价值**: 理解商业目标、盈利模式、竞争优势

### 特别关注点
基于项目描述"${projectData.description}"，请特别关注：
1. 项目描述中提到的具体功能和需求
2. 可能的技术挑战和实现难点
3. 用户使用场景和体验要求
4. 与选择的AI模型和开发工具的集成方式

### 输出格式
请严格按照以下JSON格式返回：
[
  {
    "id": 1,
    "question": "具体的问题内容（要求详细、明确、有针对性）",
    "category": "功能需求|技术实现|用户体验|项目规模|商业价值",
    "importance": "high|medium|low",
    "reasoning": "为什么这个问题重要的简短说明",
    "placeholder": "建议的回答示例或提示"
  }
]

请确保生成的问题能够帮助我们深入理解项目的真实需求和技术挑战，特别是与已选择的技术栈相关的具体实现细节。`
              }
            ],
            max_tokens: 2000,
            temperature: 0.7
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        return { 
          success: false, 
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}` 
        }
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content?.trim()
      
      if (!content) {
        return { success: false, error: 'AI返回内容为空' }
      }

      try {
        // 尝试解析JSON响应
        const questions = JSON.parse(content)
        if (Array.isArray(questions)) {
          return { success: true, data: questions }
        } else {
          // 如果不是数组，尝试提取问题
          const fallbackQuestions = this.getFallbackQuestions(projectData)
          return { success: true, data: fallbackQuestions }
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
        console.log('Raw AI response:', content)
        // JSON解析失败，返回针对性的默认问题
        const fallbackQuestions = this.getFallbackQuestions(projectData)
        return { success: true, data: fallbackQuestions }
      }
    } catch (error) {
      console.error('Generate clarification questions with model error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '生成澄清问题失败，请稍后重试'
      }
    }
  },

  async aiAutoAnswerClarifications(projectData: any, questions: any[], model: string): Promise<APIResponse<any[]>> {
    try {
      const response = await fetch('/api/openrouter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: '/chat/completions',
          method: 'POST',
          apiKey: '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',
          data: {
            model: model || 'anthropic/claude-sonnet-4',
            messages: [
              {
                role: 'user',
                content: `基于以下项目信息，为澄清问题提供合理的答案：

项目名称：${projectData.name}
项目描述：${projectData.description}
项目类型：${projectData.type}

澄清问题：
${questions.map((q, i) => `${i + 1}. ${q.question}`).join('\n')}

请为每个问题提供合理的答案，答案应该：
1. 基于项目描述进行合理推测
2. 符合项目类型的常见需求
3. 具体且实用
4. 考虑实际开发场景

请以JSON格式返回，格式如下：
[
  {
    "questionId": 1,
    "answer": "答案内容",
    "reasoning": "推理过程"
  }
]`
              }
            ],
            max_tokens: 1500,
            temperature: 0.7
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        return { 
          success: false, 
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}` 
        }
      }

      const data = await response.json()
      const content = data.choices?.[0]?.message?.content?.trim()
      
      if (!content) {
        return { success: false, error: 'AI返回内容为空' }
      }

      try {
        const answers = JSON.parse(content)
        if (Array.isArray(answers)) {
          return { success: true, data: answers }
        } else {
          // 返回默认答案
          const fallbackAnswers = questions.map((q, i) => ({
            questionId: q.id || i + 1,
            answer: "基于项目需求的标准实现方案",
            reasoning: "根据项目类型和描述进行的合理推测"
          }))
          return { success: true, data: fallbackAnswers }
        }
      } catch (parseError) {
        // JSON解析失败，返回默认答案
        const fallbackAnswers = questions.map((q, i) => ({
          questionId: q.id || i + 1,
          answer: "基于项目需求的标准实现方案",
          reasoning: "根据项目类型和描述进行的合理推测"
        }))
        return { success: true, data: fallbackAnswers }
      }
    } catch (error) {
      console.error('AI auto answer clarifications error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '自动回答澄清问题失败，请稍后重试'
      }
    }
  },

  async generateFeatureList(projectData: any, model: string): Promise<APIResponse<any>> {
    try {
      const apiKey = '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'
      const aiService = new OpenRouterService(apiKey)
      
      const result = await aiService.generateFeatureList({
        projectName: projectData.name,
        projectDescription: projectData.description,
        clarificationAnswers: projectData.clarificationAnswers
      })

      return result
    } catch (error) {
      return {
        success: false,
        error: handleAPIError(error)
      }
    }
  },

  async generateTechStack(projectData: any, model: string): Promise<APIResponse<any>> {
    try {
      const aiService = new OpenRouterService()
      
      const result = await aiService.generateTechStack({
        projectName: projectData.name,
        projectDescription: projectData.description,
        clarificationAnswers: projectData.clarificationAnswers
      })

      return result
    } catch (error) {
      return {
        success: false,
        error: handleAPIError(error)
      }
    }
  },

  async recommendTechStack(projectData: any): Promise<APIResponse<any>> {
    const config = this.getConfig()
    return this.generateTechStack(projectData, config.defaultModel)
  },

  async generateProjectDocuments(projectData: any): Promise<APIResponse<any[]>> {
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
                content: `基于以下项目信息，生成完整的产品需求文档(PRD)：

项目名称：${projectData.name}
项目描述：${projectData.description}
项目类型：${projectData.type}
${projectData.clarificationAnswers ? `澄清问题答案：\n${JSON.stringify(projectData.clarificationAnswers, null, 2)}` : ''}

请生成一个完整的PRD文档，包含以下章节：

1. 项目概述
2. 产品目标
3. 目标用户
4. 功能需求
5. 非功能需求
6. 技术架构建议
7. 开发计划
8. 风险评估

请以Markdown格式返回完整的PRD文档内容。`
              }
            ],
            max_tokens: 3000,
            temperature: 0.7
          }
        })
      })

      if (!response.ok) {
        // 如果Claude Sonnet 4失败，自动回退到Claude 3.5
        console.log('Claude Sonnet 4 failed for PRD generation, falling back to Claude 3.5...')
        const fallbackResponse = await fetch('/api/openrouter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            endpoint: '/chat/completions',
            method: 'POST',
            apiKey: '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',
            data: {
              model: 'anthropic/claude-3.5-sonnet',
              messages: [
                {
                  role: 'user',
                  content: `基于以下项目信息，生成完整的产品需求文档(PRD)：

项目名称：${projectData.name}
项目描述：${projectData.description}
项目类型：${projectData.type}

请生成一个完整的PRD文档，包含项目概述、产品目标、目标用户、功能需求、技术架构建议等章节。
请以Markdown格式返回。`
                }
              ],
              max_tokens: 3000,
              temperature: 0.7
            }
          })
        })

        if (!fallbackResponse.ok) {
          const errorData = await fallbackResponse.json()
          return { 
            success: false, 
            error: errorData.error || `HTTP ${fallbackResponse.status}: ${fallbackResponse.statusText}` 
          }
        }

        const fallbackData = await fallbackResponse.json()
        const prdContent = fallbackData.choices?.[0]?.message?.content?.trim()
        
        if (!prdContent) {
          return { success: false, error: 'AI返回内容为空' }
        }

        return {
          success: true,
          data: [{
            id: 'prd',
            title: '产品需求文档 (PRD)',
            description: '基于AI生成的完整产品需求文档',
            status: 'completed',
            content: prdContent,
            downloadUrl: '#'
          }]
        }
      }

      const data = await response.json()
      const prdContent = data.choices?.[0]?.message?.content?.trim()
      
      if (!prdContent) {
        return { success: false, error: 'AI返回内容为空' }
      }

      return {
        success: true,
        data: [{
          id: 'prd',
          title: '产品需求文档 (PRD)',
          description: '基于AI生成的完整产品需求文档',
          status: 'completed',
          content: prdContent,
          downloadUrl: '#'
        }]
      }
    } catch (error) {
      console.error('Generate PRD error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '生成PRD文档失败，请稍后重试'
      }
    }
  },

  async generatePRD(projectData: any): Promise<APIResponse<{ prd: string }>> {
    // 为了兼容性，提供一个简化的PRD生成方法
    const result = await this.generateProjectDocuments(projectData)
    if (result.success && result.data && result.data[0]) {
      return {
        success: true,
        data: { prd: result.data[0].content }
      }
    }
    return {
      success: false,
      error: result.error || '生成PRD失败'
    }
  },

  async generateTechStack(projectData: any, model: string): Promise<APIResponse<any>> {
    try {
      const aiService = new OpenRouterService()
      
      const result = await aiService.generateTechStack({
        projectName: projectData.name,
        projectDescription: projectData.description,
        clarificationAnswers: projectData.clarificationAnswers
      })

      return result
    } catch (error) {
      return {
        success: false,
        error: handleAPIError(error)
      }
    }
  },

  async recommendTechStack(projectData: any): Promise<APIResponse<any>> {
    const config = this.getConfig()
    return this.generateTechStack(projectData, config.defaultModel)
  },

  async generateProjectDocuments(projectData: any): Promise<APIResponse<any[]>> {
    try {
      const aiService = new OpenRouterService()
      
      const result = await aiService.generatePRD(projectData)

      if (result.success && result.data) {
        return {
          success: true,
          data: [{
            id: 'prd',
            title: '产品需求文档 (PRD)',
            description: '基于AI生成的完整产品需求文档',
            status: 'completed',
            content: result.data.prd,
            downloadUrl: '#'
          }]
        }
      }

      return {
        success: false,
        error: result.error
      }
    } catch (error) {
      return {
        success: false,
        error: handleAPIError(error)
      }
    }
  },

  async testApiKey(apiKey?: string): Promise<APIResponse<boolean>> {
    try {
      const aiService = new OpenRouterService(apiKey)
      const result = await aiService.testConnection()
      
      return {
        success: result.success,
        data: result.success,
        error: typeof result.error === 'string' ? result.error : 'API连接测试失败'
      }
    } catch (error) {
      return {
        success: false,
        error: handleAPIError(error)
      }
    }
  }
}

// API Key management API
export const apiKeyAPI = {
  async validateAPIKey(provider: string, key: string): Promise<APIResponse<{ valid: boolean; model?: string }>> {
    if (provider === 'openrouter') {
      const result = await aiAPI.testApiKey(key)
      return {
        success: true,
        data: {
          valid: result.success || false,
          model: result.success ? 'claude-sonnet-4' : undefined
        }
      }
    }

    return {
      success: false,
      error: '不支持的API提供商'
    }
  },

  async saveAPIKey(provider: string, key: string, name?: string): Promise<APIResponse<{ id: string }>> {
    // Store in localStorage
    localStorage.setItem(`${provider}-api-key`, key)
    if (name) {
      localStorage.setItem(`${provider}-api-key-name`, name)
    }

    return {
      success: true,
      data: { id: Date.now().toString() }
    }
  },

  async getAPIKeys(): Promise<APIResponse<any[]>> {
    const keys = []
    
    // Check for OpenRouter key
    const openrouterKey = localStorage.getItem('openrouter-api-key')
    if (openrouterKey) {
      keys.push({
        id: '1',
        provider: 'openrouter',
        name: localStorage.getItem('openrouter-api-key-name') || 'OpenRouter API Key',
        isActive: true,
        createdAt: new Date().toISOString()
      })
    }

    return {
      success: true,
      data: keys
    }
  }
}

// Utility functions
export async function checkConnection(): Promise<boolean> {
  try {
    const response = await fetch('/api/health', { method: 'HEAD' })
    return response.ok
  } catch {
    return false
  }
}

// Export AI models for UI use
export { AI_MODELS }