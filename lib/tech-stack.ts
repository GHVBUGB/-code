// 技术栈配置
export interface TechStackItem {
  id: string
  name: string
  category: string
  description: string
  icon?: string
  popularity: 'high' | 'medium' | 'low'
  learningCurve: 'easy' | 'medium' | 'hard'
  performance: 'high' | 'medium' | 'low'
  ecosystem: 'mature' | 'growing' | 'new'
  cost: 'free' | 'paid' | 'mixed'
  recommendedFor: string[]
}

export const TECH_STACK = {
  // 编程语言
  languages: {
    'javascript': {
      id: 'javascript',
      name: 'JavaScript',
      category: '编程语言',
      description: 'Web开发的核心语言，全栈开发首选',
      icon: '🟨',
      popularity: 'high',
      learningCurve: 'easy',
      performance: 'medium',
      ecosystem: 'mature',
      cost: 'free',
      recommendedFor: ['web应用', '移动应用', '桌面应用', 'API服务']
    },
    'typescript': {
      id: 'typescript',
      name: 'TypeScript',
      category: '编程语言',
      description: 'JavaScript的超集，提供类型安全',
      icon: '🔷',
      popularity: 'high',
      learningCurve: 'medium',
      performance: 'high',
      ecosystem: 'mature',
      cost: 'free',
      recommendedFor: ['web应用', 'API服务', '大型项目']
    },
    'python': {
      id: 'python',
      name: 'Python',
      category: '编程语言',
      description: '简洁易学，适合AI/ML和数据科学',
      icon: '🐍',
      popularity: 'high',
      learningCurve: 'easy',
      performance: 'medium',
      ecosystem: 'mature',
      cost: 'free',
      recommendedFor: ['AI/ML', '数据分析', 'API服务', '自动化']
    },
    'java': {
      id: 'java',
      name: 'Java',
      category: '编程语言',
      description: '企业级应用开发，稳定可靠',
      icon: '☕',
      popularity: 'high',
      learningCurve: 'hard',
      performance: 'high',
      ecosystem: 'mature',
      cost: 'free',
      recommendedFor: ['企业应用', '大型系统', '微服务']
    },
    'csharp': {
      id: 'csharp',
      name: 'C#',
      category: '编程语言',
      description: '微软生态，适合Windows和Web开发',
      icon: '🔷',
      popularity: 'medium',
      learningCurve: 'medium',
      performance: 'high',
      ecosystem: 'mature',
      cost: 'mixed',
      recommendedFor: ['Windows应用', 'Web应用', '游戏开发']
    },
    'go': {
      id: 'go',
      name: 'Go',
      category: '编程语言',
      description: 'Google开发，高并发性能优秀',
      icon: '🐹',
      popularity: 'medium',
      learningCurve: 'easy',
      performance: 'high',
      ecosystem: 'growing',
      cost: 'free',
      recommendedFor: ['API服务', '微服务', '云原生应用']
    },
    'rust': {
      id: 'rust',
      name: 'Rust',
      category: '编程语言',
      description: '内存安全，系统级编程首选',
      icon: '🦀',
      popularity: 'medium',
      learningCurve: 'hard',
      performance: 'high',
      ecosystem: 'growing',
      cost: 'free',
      recommendedFor: ['系统编程', '高性能应用', '区块链']
    },
    'php': {
      id: 'php',
      name: 'PHP',
      category: '编程语言',
      description: 'Web开发传统语言，WordPress等广泛使用',
      icon: '🐘',
      popularity: 'medium',
      learningCurve: 'easy',
      performance: 'medium',
      ecosystem: 'mature',
      cost: 'free',
      recommendedFor: ['Web应用', 'CMS', '电商平台']
    }
  },

  // 前端框架
  frontend: {
    'react': {
      id: 'react',
      name: 'React',
      category: '前端框架',
      description: 'Facebook开发，组件化开发首选',
      icon: '⚛️',
      popularity: 'high',
      learningCurve: 'medium',
      performance: 'high',
      ecosystem: 'mature',
      cost: 'free',
      recommendedFor: ['web应用', '移动应用', '桌面应用']
    },
    'vue': {
      id: 'vue',
      name: 'Vue.js',
      category: '前端框架',
      description: '渐进式框架，学习曲线平缓',
      icon: '💚',
      popularity: 'high',
      learningCurve: 'easy',
      performance: 'high',
      ecosystem: 'mature',
      cost: 'free',
      recommendedFor: ['web应用', '快速原型', '中小型项目']
    },
    'angular': {
      id: 'angular',
      name: 'Angular',
      category: '前端框架',
      description: 'Google开发，企业级应用框架',
      icon: '🔴',
      popularity: 'medium',
      learningCurve: 'hard',
      performance: 'high',
      ecosystem: 'mature',
      cost: 'free',
      recommendedFor: ['企业应用', '大型项目', '复杂SPA']
    },
    'nextjs': {
      id: 'nextjs',
      name: 'Next.js',
      category: '前端框架',
      description: 'React全栈框架，SSR/SSG支持',
      icon: '▲',
      popularity: 'high',
      learningCurve: 'medium',
      performance: 'high',
      ecosystem: 'mature',
      cost: 'free',
      recommendedFor: ['web应用', 'SEO优化', '全栈开发']
    },
    'nuxt': {
      id: 'nuxt',
      name: 'Nuxt.js',
      category: '前端框架',
      description: 'Vue全栈框架，SSR/SSG支持',
      icon: '💚',
      popularity: 'medium',
      learningCurve: 'easy',
      performance: 'high',
      ecosystem: 'mature',
      cost: 'free',
      recommendedFor: ['web应用', 'SEO优化', 'Vue生态']
    },
    'svelte': {
      id: 'svelte',
      name: 'Svelte',
      category: '前端框架',
      description: '编译时优化，运行时性能优秀',
      icon: '🧡',
      popularity: 'medium',
      learningCurve: 'easy',
      performance: 'high',
      ecosystem: 'growing',
      cost: 'free',
      recommendedFor: ['性能敏感应用', '轻量级项目']
    }
  },

  // 后端框架
  backend: {
    'nodejs': {
      id: 'nodejs',
      name: 'Node.js',
      category: '后端框架',
      description: 'JavaScript运行时，全栈开发统一语言',
      icon: '🟢',
      popularity: 'high',
      learningCurve: 'easy',
      performance: 'medium',
      ecosystem: 'mature',
      cost: 'free',
      recommendedFor: ['API服务', '实时应用', '全栈开发']
    },
    'express': {
      id: 'express',
      name: 'Express.js',
      category: '后端框架',
      description: 'Node.js轻量级Web框架',
      icon: '🚀',
      popularity: 'high',
      learningCurve: 'easy',
      performance: 'high',
      ecosystem: 'mature',
      cost: 'free',
      recommendedFor: ['API服务', '微服务', '快速开发']
    },
    'fastapi': {
      id: 'fastapi',
      name: 'FastAPI',
      category: '后端框架',
      description: 'Python现代Web框架，高性能',
      icon: '⚡',
      popularity: 'high',
      learningCurve: 'easy',
      performance: 'high',
      ecosystem: 'growing',
      cost: 'free',
      recommendedFor: ['API服务', 'AI/ML应用', '高性能后端']
    },
    'django': {
      id: 'django',
      name: 'Django',
      category: '后端框架',
      description: 'Python全功能Web框架',
      icon: '🎸',
      popularity: 'high',
      learningCurve: 'medium',
      performance: 'medium',
      ecosystem: 'mature',
      cost: 'free',
      recommendedFor: ['Web应用', 'CMS', '内容管理']
    },
    'spring': {
      id: 'spring',
      name: 'Spring Boot',
      category: '后端框架',
      description: 'Java企业级应用框架',
      icon: '🍃',
      popularity: 'high',
      learningCurve: 'hard',
      performance: 'high',
      ecosystem: 'mature',
      cost: 'free',
      recommendedFor: ['企业应用', '微服务', '大型系统']
    },
    'gin': {
      id: 'gin',
      name: 'Gin',
      category: '后端框架',
      description: 'Go语言高性能Web框架',
      icon: '🍸',
      popularity: 'medium',
      learningCurve: 'easy',
      performance: 'high',
      ecosystem: 'growing',
      cost: 'free',
      recommendedFor: ['API服务', '微服务', '高并发应用']
    },
    'laravel': {
      id: 'laravel',
      name: 'Laravel',
      category: '后端框架',
      description: 'PHP优雅的Web框架',
      icon: '🔴',
      popularity: 'medium',
      learningCurve: 'medium',
      performance: 'medium',
      ecosystem: 'mature',
      cost: 'free',
      recommendedFor: ['Web应用', '快速开发', 'PHP生态']
    }
  },

  // 数据库
  databases: {
    'mysql': {
      id: 'mysql',
      name: 'MySQL',
      category: '数据库',
      description: '最流行的开源关系型数据库',
      icon: '🐬',
      popularity: 'high',
      learningCurve: 'easy',
      performance: 'high',
      ecosystem: 'mature',
      cost: 'free',
      recommendedFor: ['Web应用', '电商平台', '内容管理']
    },
    'postgresql': {
      id: 'postgresql',
      name: 'PostgreSQL',
      category: '数据库',
      description: '功能强大的开源关系型数据库',
      icon: '🐘',
      popularity: 'high',
      learningCurve: 'medium',
      performance: 'high',
      ecosystem: 'mature',
      cost: 'free',
      recommendedFor: ['复杂应用', '数据分析', '地理信息']
    },
    'mongodb': {
      id: 'mongodb',
      name: 'MongoDB',
      category: '数据库',
      description: '流行的NoSQL文档数据库',
      icon: '🍃',
      popularity: 'high',
      learningCurve: 'easy',
      performance: 'high',
      ecosystem: 'mature',
      cost: 'mixed',
      recommendedFor: ['快速开发', '内容管理', '实时应用']
    },
    'redis': {
      id: 'redis',
      name: 'Redis',
      category: '数据库',
      description: '内存数据结构存储，缓存首选',
      icon: '🔴',
      popularity: 'high',
      learningCurve: 'easy',
      performance: 'high',
      ecosystem: 'mature',
      cost: 'free',
      recommendedFor: ['缓存', '会话存储', '实时数据']
    },
    'sqlite': {
      id: 'sqlite',
      name: 'SQLite',
      category: '数据库',
      description: '轻量级嵌入式数据库',
      icon: '🗃️',
      popularity: 'medium',
      learningCurve: 'easy',
      performance: 'medium',
      ecosystem: 'mature',
      cost: 'free',
      recommendedFor: ['小型应用', '原型开发', '移动应用']
    },
    'elasticsearch': {
      id: 'elasticsearch',
      name: 'Elasticsearch',
      category: '数据库',
      description: '分布式搜索和分析引擎',
      icon: '🔍',
      popularity: 'medium',
      learningCurve: 'hard',
      performance: 'high',
      ecosystem: 'mature',
      cost: 'mixed',
      recommendedFor: ['搜索功能', '日志分析', '大数据']
    },
    // 云端数据库
    'planetscale': {
      id: 'planetscale',
      name: 'PlanetScale',
      category: '云端数据库',
      description: '基于MySQL的云端数据库，无服务器架构',
      icon: '🪐',
      popularity: 'medium',
      learningCurve: 'easy',
      performance: 'high',
      ecosystem: 'growing',
      cost: 'mixed',
      recommendedFor: ['现代Web应用', '无服务器架构', '全球部署']
    },
    'supabase': {
      id: 'supabase',
      name: 'Supabase',
      category: '云端数据库',
      description: '开源Firebase替代品，PostgreSQL + 实时功能',
      icon: '⚡',
      popularity: 'high',
      learningCurve: 'easy',
      performance: 'high',
      ecosystem: 'growing',
      cost: 'mixed',
      recommendedFor: ['快速开发', '实时应用', '全栈开发']
    },
    'firebase': {
      id: 'firebase',
      name: 'Firebase',
      category: '云端数据库',
      description: 'Google的BaaS平台，实时数据库',
      icon: '🔥',
      popularity: 'high',
      learningCurve: 'easy',
      performance: 'high',
      ecosystem: 'mature',
      cost: 'paid',
      recommendedFor: ['移动应用', '实时应用', '快速原型']
    },
    'aws-rds': {
      id: 'aws-rds',
      name: 'AWS RDS',
      category: '云端数据库',
      description: '亚马逊托管关系型数据库服务',
      icon: '☁️',
      popularity: 'high',
      learningCurve: 'medium',
      performance: 'high',
      ecosystem: 'mature',
      cost: 'paid',
      recommendedFor: ['企业应用', '高可用性', 'AWS生态']
    },
    'mongodb-atlas': {
      id: 'mongodb-atlas',
      name: 'MongoDB Atlas',
      category: '云端数据库',
      description: 'MongoDB官方云端托管服务',
      icon: '🍃',
      popularity: 'high',
      learningCurve: 'easy',
      performance: 'high',
      ecosystem: 'mature',
      cost: 'mixed',
      recommendedFor: ['NoSQL应用', '全球部署', '自动扩展']
    },
    'vercel-postgres': {
      id: 'vercel-postgres',
      name: 'Vercel Postgres',
      category: '云端数据库',
      description: 'Vercel托管的PostgreSQL数据库',
      icon: '▲',
      popularity: 'medium',
      learningCurve: 'easy',
      performance: 'high',
      ecosystem: 'growing',
      cost: 'paid',
      recommendedFor: ['Next.js应用', 'JAMstack', '边缘计算']
    },
    'railway-postgres': {
      id: 'railway-postgres',
      name: 'Railway Postgres',
      category: '云端数据库',
      description: 'Railway托管的PostgreSQL数据库',
      icon: '🚂',
      popularity: 'medium',
      learningCurve: 'easy',
      performance: 'high',
      ecosystem: 'growing',
      cost: 'mixed',
      recommendedFor: ['快速部署', '开发环境', '小型项目']
    },
    'neon': {
      id: 'neon',
      name: 'Neon',
      category: '云端数据库',
      description: '无服务器PostgreSQL，按需扩展',
      icon: '💚',
      popularity: 'medium',
      learningCurve: 'easy',
      performance: 'high',
      ecosystem: 'growing',
      cost: 'mixed',
      recommendedFor: ['无服务器架构', '按需扩展', '现代应用']
    },
    'cockroachdb': {
      id: 'cockroachdb',
      name: 'CockroachDB',
      category: '云端数据库',
      description: '分布式SQL数据库，全球一致性',
      icon: '🪳',
      popularity: 'medium',
      learningCurve: 'medium',
      performance: 'high',
      ecosystem: 'growing',
      cost: 'paid',
      recommendedFor: ['全球应用', '高一致性', '分布式系统']
    }
  },

  // 云服务
  cloud: {
    'aws': {
      id: 'aws',
      name: 'AWS',
      category: '云服务',
      description: '亚马逊云服务，功能最全面',
      icon: '☁️',
      popularity: 'high',
      learningCurve: 'hard',
      performance: 'high',
      ecosystem: 'mature',
      cost: 'paid',
      recommendedFor: ['企业应用', '大规模部署', '全球服务']
    },
    'azure': {
      id: 'azure',
      name: 'Azure',
      category: '云服务',
      description: '微软云服务，企业集成优秀',
      icon: '🔷',
      popularity: 'high',
      learningCurve: 'hard',
      performance: 'high',
      ecosystem: 'mature',
      cost: 'paid',
      recommendedFor: ['企业应用', 'Windows生态', '混合云']
    },
    'gcp': {
      id: 'gcp',
      name: 'Google Cloud',
      category: '云服务',
      description: 'Google云服务，AI/ML能力强',
      icon: '🌐',
      popularity: 'medium',
      learningCurve: 'hard',
      performance: 'high',
      ecosystem: 'mature',
      cost: 'paid',
      recommendedFor: ['AI/ML应用', '数据分析', '大数据']
    },
    'vercel': {
      id: 'vercel',
      name: 'Vercel',
      category: '云服务',
      description: '前端部署平台，Next.js优化',
      icon: '▲',
      popularity: 'high',
      learningCurve: 'easy',
      performance: 'high',
      ecosystem: 'growing',
      cost: 'mixed',
      recommendedFor: ['前端应用', '静态站点', 'JAMstack']
    },
    'netlify': {
      id: 'netlify',
      name: 'Netlify',
      category: '云服务',
      description: '前端部署平台，CI/CD集成',
      icon: '🌐',
      popularity: 'medium',
      learningCurve: 'easy',
      performance: 'high',
      ecosystem: 'mature',
      cost: 'mixed',
      recommendedFor: ['前端应用', '静态站点', 'JAMstack']
    },
    'heroku': {
      id: 'heroku',
      name: 'Heroku',
      category: '云服务',
      description: '简单易用的PaaS平台',
      icon: '🟣',
      popularity: 'medium',
      learningCurve: 'easy',
      performance: 'medium',
      ecosystem: 'mature',
      cost: 'paid',
      recommendedFor: ['快速部署', '原型开发', '小型应用']
    }
  }
} as const

// 根据项目描述智能推荐技术栈
export function recommendTechStack(projectDescription: string, projectType: string) {
  const recommendations = {
    languages: [] as string[],
    frontend: [] as string[],
    backend: [] as string[],
    databases: [] as string[],
    cloud: [] as string[]
  }

  const description = projectDescription.toLowerCase()
  const type = projectType.toLowerCase()

  // 根据项目类型推荐
  if (type.includes('web') || type.includes('网站')) {
    recommendations.languages.push('javascript', 'typescript')
    recommendations.frontend.push('react', 'vue', 'nextjs')
    recommendations.backend.push('nodejs', 'express', 'fastapi')
    recommendations.databases.push('mysql', 'postgresql', 'mongodb')
    recommendations.cloud.push('vercel', 'netlify', 'aws')
  }

  if (type.includes('移动') || type.includes('app')) {
    recommendations.languages.push('javascript', 'typescript')
    recommendations.frontend.push('react')
    recommendations.backend.push('nodejs', 'express')
    recommendations.databases.push('mongodb', 'sqlite')
    recommendations.cloud.push('aws', 'firebase')
  }

  if (type.includes('ai') || type.includes('ml') || type.includes('数据')) {
    recommendations.languages.push('python', 'javascript')
    recommendations.backend.push('fastapi', 'django')
    recommendations.databases.push('postgresql', 'elasticsearch')
    recommendations.cloud.push('gcp', 'aws')
  }

  if (type.includes('api') || type.includes('服务')) {
    recommendations.languages.push('javascript', 'python', 'go')
    recommendations.backend.push('express', 'fastapi', 'gin')
    recommendations.databases.push('postgresql', 'redis')
    recommendations.cloud.push('aws', 'azure')
  }

  // 根据描述关键词推荐
  if (description.includes('实时') || description.includes('即时')) {
    recommendations.databases.push('redis')
    recommendations.backend.push('nodejs', 'gin')
  }

  if (description.includes('搜索') || description.includes('查询')) {
    recommendations.databases.push('elasticsearch', 'postgresql')
  }

  if (description.includes('电商') || description.includes('购物')) {
    recommendations.languages.push('javascript', 'java')
    recommendations.backend.push('spring', 'express')
    recommendations.databases.push('mysql', 'postgresql', 'redis')
    recommendations.cloud.push('aws', 'azure')
  }

  if (description.includes('简单') || description.includes('快速')) {
    recommendations.languages.push('javascript', 'python')
    recommendations.frontend.push('vue', 'svelte')
    recommendations.backend.push('express', 'fastapi')
    recommendations.databases.push('sqlite', 'mongodb')
    recommendations.cloud.push('vercel', 'heroku')
  }

  if (description.includes('企业') || description.includes('大型')) {
    recommendations.languages.push('java', 'csharp', 'typescript')
    recommendations.backend.push('spring', 'django')
    recommendations.databases.push('postgresql', 'mysql')
    recommendations.cloud.push('aws', 'azure')
  }

  // 去重并限制数量
  Object.keys(recommendations).forEach(key => {
    recommendations[key as keyof typeof recommendations] = [...new Set(recommendations[key as keyof typeof recommendations])].slice(0, 3)
  })

  return recommendations
}

// 获取技术栈详细信息
export function getTechStackDetails(techStackIds: string[]) {
  const allTechStack = {
    ...TECH_STACK.languages,
    ...TECH_STACK.frontend,
    ...TECH_STACK.backend,
    ...TECH_STACK.databases,
    ...TECH_STACK.cloud
  }

  return techStackIds.map(id => allTechStack[id as keyof typeof allTechStack]).filter(Boolean)
}
