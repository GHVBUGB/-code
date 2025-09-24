export interface ProjectTemplate {
  id: string
  name: string
  description: string
  category: string
  type: 'web' | 'mobile' | 'desktop' | 'api' | 'ai' | 'other'
  tags: string[]
  features: string[]
  techStack: string[]
  estimatedDuration: string
  complexity: 'simple' | 'medium' | 'complex'
  icon: string
  color: string
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  // Web应用模板
  {
    id: 'ecommerce-web',
    name: '电商平台',
    description: '完整的在线购物平台，包含商品展示、购物车、支付、用户管理等功能',
    category: 'Web应用',
    type: 'web',
    tags: ['电商', '支付', '用户管理', '商品管理'],
    features: [
      '用户注册登录',
      '商品浏览和搜索',
      '购物车管理',
      '订单处理',
      '支付集成',
      '管理后台',
      '库存管理',
      '评价系统'
    ],
    techStack: ['Next.js', 'React', 'TailwindCSS', 'Supabase', 'Stripe'],
    estimatedDuration: '8-12周',
    complexity: 'complex',
    icon: '🛒',
    color: 'text-purple-500'
  },
  {
    id: 'saas-dashboard',
    name: 'SaaS管理后台',
    description: '企业级SaaS产品管理后台，包含数据可视化、用户管理、权限控制等',
    category: 'Web应用',
    type: 'web',
    tags: ['SaaS', '管理后台', '数据可视化', '权限管理'],
    features: [
      '仪表板数据展示',
      '用户权限管理',
      '多租户支持',
      '数据分析图表',
      'API管理',
      '订阅计费',
      '通知系统',
      '审计日志'
    ],
    techStack: ['Next.js', 'TypeScript', 'Chart.js', 'PostgreSQL', 'Redis'],
    estimatedDuration: '10-16周',
    complexity: 'complex',
    icon: '📊',
    color: 'text-blue-500'
  },
  {
    id: 'blog-cms',
    name: '博客内容管理系统',
    description: '现代化的博客平台，支持markdown编辑、SEO优化、评论系统',
    category: 'Web应用',
    type: 'web',
    tags: ['博客', 'CMS', 'SEO', 'Markdown'],
    features: [
      'Markdown编辑器',
      '文章分类标签',
      'SEO优化',
      '评论系统',
      '搜索功能',
      '用户订阅',
      '社交分享',
      '统计分析'
    ],
    techStack: ['Next.js', 'MDX', 'TailwindCSS', 'Vercel', 'PlanetScale'],
    estimatedDuration: '4-6周',
    complexity: 'medium',
    icon: '📝',
    color: 'text-green-500'
  },

  // 移动应用模板
  {
    id: 'social-mobile',
    name: '社交应用',
    description: '移动端社交应用，包含聊天、动态分享、好友系统等功能',
    category: '移动应用',
    type: 'mobile',
    tags: ['社交', '聊天', '动态', '移动端'],
    features: [
      '用户注册登录',
      '实时聊天',
      '动态发布',
      '好友系统',
      '推送通知',
      '图片视频上传',
      '点赞评论',
      '隐私设置'
    ],
    techStack: ['React Native', 'Firebase', 'Socket.io', 'Expo'],
    estimatedDuration: '12-16周',
    complexity: 'complex',
    icon: '💬',
    color: 'text-pink-500'
  },
  {
    id: 'fitness-app',
    name: '健身追踪应用',
    description: '个人健身助手应用，包含运动记录、计划制定、数据分析等功能',
    category: '移动应用',
    type: 'mobile',
    tags: ['健身', '追踪', '健康', '数据分析'],
    features: [
      '运动记录',
      '健身计划',
      '数据统计',
      '健康指标',
      '社区分享',
      '教练指导',
      '营养建议',
      '目标设定'
    ],
    techStack: ['Flutter', 'Dart', 'Firebase', 'HealthKit'],
    estimatedDuration: '8-12周',
    complexity: 'medium',
    icon: '💪',
    color: 'text-orange-500'
  },

  // API服务模板
  {
    id: 'rest-api',
    name: 'RESTful API服务',
    description: '标准的REST API服务，包含认证、CRUD操作、文档生成等',
    category: 'API服务',
    type: 'api',
    tags: ['REST', 'API', '认证', '文档'],
    features: [
      'RESTful设计',
      'JWT认证',
      'CRUD操作',
      'API文档',
      '限流控制',
      '日志记录',
      '错误处理',
      '数据验证'
    ],
    techStack: ['FastAPI', 'Python', 'PostgreSQL', 'Redis', 'Docker'],
    estimatedDuration: '4-8周',
    complexity: 'medium',
    icon: '🔌',
    color: 'text-indigo-500'
  },
  {
    id: 'graphql-api',
    name: 'GraphQL API服务',
    description: '现代化的GraphQL API服务，支持实时订阅、类型安全等',
    category: 'API服务',
    type: 'api',
    tags: ['GraphQL', '实时', '类型安全', 'API'],
    features: [
      'GraphQL Schema',
      '类型定义',
      '实时订阅',
      '查询优化',
      '认证授权',
      'DataLoader',
      '错误处理',
      '性能监控'
    ],
    techStack: ['Apollo Server', 'TypeScript', 'Prisma', 'PostgreSQL'],
    estimatedDuration: '6-10周',
    complexity: 'complex',
    icon: '🔄',
    color: 'text-purple-500'
  },

  // AI应用模板
  {
    id: 'chatbot-ai',
    name: 'AI聊天机器人',
    description: '智能客服聊天机器人，支持自然语言理解和多轮对话',
    category: 'AI应用',
    type: 'ai',
    tags: ['AI', '聊天机器人', 'NLP', '客服'],
    features: [
      '自然语言处理',
      '意图识别',
      '多轮对话',
      '知识库管理',
      '情感分析',
      '人工接入',
      '对话记录',
      '性能分析'
    ],
    techStack: ['OpenAI API', 'LangChain', 'Vector DB', 'FastAPI'],
    estimatedDuration: '8-12周',
    complexity: 'complex',
    icon: '🤖',
    color: 'text-cyan-500'
  },
  {
    id: 'content-generator',
    name: 'AI内容生成工具',
    description: 'AI驱动的内容创作平台，支持文本、图片、视频生成',
    category: 'AI应用',
    type: 'ai',
    tags: ['AI', '内容生成', '创作', '多媒体'],
    features: [
      '文本生成',
      '图片生成',
      '视频制作',
      '模板管理',
      '批量处理',
      '质量控制',
      '版本管理',
      '使用统计'
    ],
    techStack: ['Stability AI', 'OpenAI', 'FFmpeg', 'Next.js'],
    estimatedDuration: '10-14周',
    complexity: 'complex',
    icon: '✨',
    color: 'text-yellow-500'
  },

  // 其他应用模板
  {
    id: 'iot-dashboard',
    name: 'IoT设备管理平台',
    description: '物联网设备监控和管理平台，支持实时数据展示和远程控制',
    category: '物联网',
    type: 'web',
    tags: ['IoT', '设备管理', '实时数据', '监控'],
    features: [
      '设备注册',
      '实时监控',
      '数据可视化',
      '远程控制',
      '告警系统',
      '数据历史',
      '设备分组',
      '权限管理'
    ],
    techStack: ['Vue.js', 'MQTT', 'InfluxDB', 'Grafana', 'Node.js'],
    estimatedDuration: '12-16周',
    complexity: 'complex',
    icon: '📡',
    color: 'text-teal-500'
  },
  {
    id: 'learning-platform',
    name: '在线学习平台',
    description: '综合性在线教育平台，支持课程管理、直播教学、作业系统',
    category: '教育科技',
    type: 'web',
    tags: ['教育', '在线学习', '直播', '课程管理'],
    features: [
      '课程管理',
      '视频播放',
      '直播教学',
      '作业系统',
      '考试测评',
      '学习进度',
      '讨论社区',
      '证书颁发'
    ],
    techStack: ['React', 'WebRTC', 'Agora', 'MongoDB', 'Express'],
    estimatedDuration: '14-20周',
    complexity: 'complex',
    icon: '🎓',
    color: 'text-blue-600'
  }
]

export const PROJECT_CATEGORIES = [
  'Web应用',
  '移动应用',
  'API服务',
  'AI应用',
  '物联网',
  '教育科技',
  '其他'
]

export const COMPLEXITY_LEVELS = [
  { value: 'simple', label: '简单', color: 'text-green-500', description: '基础功能，技术栈简单' },
  { value: 'medium', label: '中等', color: 'text-yellow-500', description: '功能完整，技术栈适中' },
  { value: 'complex', label: '复杂', color: 'text-red-500', description: '功能复杂，技术栈高级' }
]

export function getTemplatesByCategory(category?: string): ProjectTemplate[] {
  if (!category) return PROJECT_TEMPLATES
  return PROJECT_TEMPLATES.filter(template => template.category === category)
}

export function getTemplatesByType(type?: string): ProjectTemplate[] {
  if (!type) return PROJECT_TEMPLATES
  return PROJECT_TEMPLATES.filter(template => template.type === type)
}

export function getTemplatesByComplexity(complexity?: string): ProjectTemplate[] {
  if (!complexity) return PROJECT_TEMPLATES
  return PROJECT_TEMPLATES.filter(template => template.complexity === complexity)
}

export function searchTemplates(query: string): ProjectTemplate[] {
  const searchLower = query.toLowerCase()
  return PROJECT_TEMPLATES.filter(template => 
    template.name.toLowerCase().includes(searchLower) ||
    template.description.toLowerCase().includes(searchLower) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
    template.features.some(feature => feature.toLowerCase().includes(searchLower))
  )
}

export function getRecommendedTemplates(userPreferences?: {
  type?: string
  complexity?: string
  tags?: string[]
}): ProjectTemplate[] {
  if (!userPreferences) return PROJECT_TEMPLATES.slice(0, 6)
  
  let filtered = PROJECT_TEMPLATES
  
  if (userPreferences.type) {
    filtered = filtered.filter(t => t.type === userPreferences.type)
  }
  
  if (userPreferences.complexity) {
    filtered = filtered.filter(t => t.complexity === userPreferences.complexity)
  }
  
  if (userPreferences.tags && userPreferences.tags.length > 0) {
    filtered = filtered.filter(t => 
      userPreferences.tags!.some(tag => 
        t.tags.some(templateTag => 
          templateTag.toLowerCase().includes(tag.toLowerCase())
        )
      )
    )
  }
  
  return filtered.slice(0, 6)
}










