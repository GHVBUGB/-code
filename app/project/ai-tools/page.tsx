'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useProjectStore, useSettingsStore } from "@/lib/store"
import { AI_MODELS } from "@/lib/ai/openrouter"
import { TECH_STACK, recommendTechStack, getTechStackDetails } from "@/lib/tech-stack"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/ui/header"
import { Container } from "@/components/ui/container"
import { 
  ArrowLeft, 
  ArrowRight, 
  Check,
  Bot,
  Code,
  Palette,
  Wrench,
  Sparkles,
  Cloud,
  Zap,
  Brain,
  CheckCircle2,
  Circle,
  CheckCircle,
  Lightbulb,
  Target,
  Users,
  ChevronLeft,
  ChevronRight,
  Database,
  Globe,
  Server,
  Cpu,
  Sparkles as MagicWand,
  Search,
  Filter,
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  Layers,
  ArrowDown,
  ArrowUp
} from "lucide-react"
import { RouteGuard } from "@/components/auth/route-guard"

export default function AIToolsPage() {
  const { projectData, updateProjectData } = useProjectStore()
  const { selectedModel, setSelectedModel } = useSettingsStore()
  const [selectedModels, setSelectedModels] = useState<string[]>([]) // 改为多选
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [selectedTechStack, setSelectedTechStack] = useState<string[]>([])
  const [recommendedTechStack, setRecommendedTechStack] = useState<string[]>([])
  const [recommendedModels, setRecommendedModels] = useState<string[]>([]) // AI推荐模型
  const [recommendedTools, setRecommendedTools] = useState<string[]>([]) // AI推荐工具
  const [currentTip, setCurrentTip] = useState(0)
  const [activeTab, setActiveTab] = useState<'ai' | 'tools' | 'tech'>('ai')
  const [searchQuery, setSearchQuery] = useState('')
  const [toolsSearchQuery, setToolsSearchQuery] = useState('')
  const [techSearchQuery, setTechSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [toolsFilterCategory, setToolsFilterCategory] = useState<string>('all')
  const [techFilterCategory, setTechFilterCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'popularity' | 'cost' | 'performance'>('popularity')
  const router = useRouter()

  const steps = [
    { id: 1, name: "基本信息", status: "completed" },
    { id: 2, name: "AI工具", status: "current" },
    { id: 3, name: "需求澄清", status: "upcoming" },
    { id: 4, name: "文档预览", status: "upcoming" },
    { id: 5, name: "生成文档", status: "upcoming" }
  ]

  const tips = [
    {
      icon: Bot,
      title: "选择合适的AI模型",
      description: "根据项目复杂度选择性能匹配的AI模型",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Code,
      title: "开发工具组合",
      description: "选择多个工具可以提升开发效率",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Cpu,
      title: "技术栈选择",
      description: "根据项目需求选择合适的技术栈组合",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: Zap,
      title: "成本与性能平衡",
      description: "考虑项目预算选择合适的工具组合",
      color: "bg-orange-100 text-orange-600"
    }
  ]

  // 根据项目描述智能推荐AI模型、开发工具和技术栈
  useEffect(() => {
    if (projectData.description && projectData.type) {
      // 推荐技术栈
      const techRecommendations = recommendTechStack(projectData.description, projectData.type)
      const allRecommendedTech = [
        ...techRecommendations.languages,
        ...techRecommendations.frontend,
        ...techRecommendations.backend,
        ...techRecommendations.databases,
        ...techRecommendations.cloud
      ]
      setRecommendedTechStack(allRecommendedTech)

      // 推荐AI模型
      const modelRecommendations = recommendAIModels(projectData.description, projectData.type)
      setRecommendedModels(modelRecommendations)

      // 推荐开发工具
      const toolRecommendations = recommendDevelopmentTools(projectData.description, projectData.type)
      setRecommendedTools(toolRecommendations)
    }
  }, [projectData.description, projectData.type])

  // 从store中恢复之前的选择
  useEffect(() => {
    console.log('AI工具页面 - 恢复项目数据:', projectData)
    
    if (projectData.selectedModels && projectData.selectedModels.length > 0) {
      setSelectedModels(projectData.selectedModels)
      console.log('恢复选择的AI模型:', projectData.selectedModels)
    }
    if (projectData.selectedTools && projectData.selectedTools.length > 0) {
      setSelectedTools(projectData.selectedTools)
      console.log('恢复选择的工具:', projectData.selectedTools)
    }
    if (projectData.selectedTechStack && projectData.selectedTechStack.length > 0) {
      setSelectedTechStack(projectData.selectedTechStack)
      console.log('恢复选择的技术栈:', projectData.selectedTechStack)
    }
  }, [projectData])

  // AI模型推荐逻辑
  const recommendAIModels = (description: string, type: string) => {
    const desc = description.toLowerCase()
    const recommendations: string[] = []

    // 根据项目类型推荐
    if (type.includes('ai') || type.includes('ml') || type.includes('数据')) {
      recommendations.push('anthropic/claude-3.5-sonnet', 'openai/gpt-4-turbo', 'google/gemini-pro-1.5')
    } else if (type.includes('web') || type.includes('网站')) {
      recommendations.push('anthropic/claude-3.5-sonnet', 'openai/gpt-4o-mini', 'deepseek/deepseek-v3')
    } else if (type.includes('移动') || type.includes('app')) {
      recommendations.push('anthropic/claude-3.5-sonnet', 'openai/gpt-4o-mini', 'qwen/qwen-2.5-14b-instruct')
    } else {
      recommendations.push('anthropic/claude-3.5-sonnet', 'openai/gpt-4o-mini', 'deepseek/deepseek-v3')
    }

    // 根据描述关键词推荐
    if (desc.includes('中文') || desc.includes('中国')) {
      recommendations.push('qwen/qwen-2.5-14b-instruct', 'baichuan/baichuan2-turbo', 'zhipu/glm-4-9b-chat')
    }
    if (desc.includes('代码') || desc.includes('编程')) {
      recommendations.push('deepseek/deepseek-v3', 'deepseek/deepseek-coder', 'stabilityai/stable-code-instruct-3b')
    }
    if (desc.includes('实时') || desc.includes('快速')) {
      recommendations.push('anthropic/claude-3-haiku', 'google/gemini-2.5-flash-preview', 'openai/gpt-4o-mini')
    }
    if (desc.includes('复杂') || desc.includes('企业')) {
      recommendations.push('anthropic/claude-opus-4', 'openai/gpt-4.5-preview', 'google/gemini-2.5-pro-preview')
    }

    return [...new Set(recommendations)].slice(0, 5) // 去重并限制数量
  }

  // 开发工具推荐逻辑
  const recommendDevelopmentTools = (description: string, type: string) => {
    const desc = description.toLowerCase()
    const recommendations: string[] = []

    // 根据项目类型推荐
    if (type.includes('web') || type.includes('网站')) {
      recommendations.push('cursor-ai', 'github-copilot', 'codeium')
    } else if (type.includes('移动') || type.includes('app')) {
      recommendations.push('cursor-ai', 'github-copilot', 'windsurf')
    } else if (type.includes('ai') || type.includes('ml')) {
      recommendations.push('cursor-ai', 'github-copilot', 'trae')
    } else {
      recommendations.push('cursor-ai', 'github-copilot', 'codeium')
    }

    // 根据描述关键词推荐
    if (desc.includes('免费') || desc.includes('开源')) {
      recommendations.push('codeium', 'windsurf', 'trae')
    }
    if (desc.includes('团队') || desc.includes('协作')) {
      recommendations.push('github-copilot', 'cursor-ai', 'claude-code')
    }
    if (desc.includes('快速') || desc.includes('原型')) {
      recommendations.push('cursor-ai', 'codeium', 'windsurf')
    }

    return [...new Set(recommendations)].slice(0, 4) // 去重并限制数量
  }

  // AI模型配置
  const aiModels = Object.entries(AI_MODELS).map(([id, modelId]) => {
    // 解析模型ID获取提供商和名称
    const [provider, name] = modelId.split('/')
    return {
      id,
      name: name || modelId,
      provider: provider || 'unknown',
      description: `AI模型: ${modelId}`,
      category: 'ai'
    }
  })

  // 开发工具配置
  const developmentTools = [
    {
      id: "github-copilot",
      name: "GitHub Copilot",
      description: "AI编程助手，提供智能代码补全",
      icon: Code,
      category: "代码生成",
      cost: "付费"
    },
    {
      id: "cursor-ai",
      name: "Cursor AI",
      description: "AI原生代码编辑器，集成多种AI功能",
      icon: Sparkles,
      category: "IDE",
      cost: "付费"
    },
    {
      id: "trae",
      name: "TRAE",
      description: "国产AI开发工具，支持中文编程",
      icon: Palette,
      category: "IDE",
      cost: "免费"
    },
    {
      id: "windsurf",
      name: "Windsurf",
      description: "AI原生IDE，专为AI辅助开发设计",
      icon: Wrench,
      category: "IDE",
      cost: "免费"
    },
    {
      id: "codeium",
      name: "Codeium",
      description: "免费AI编程助手，功能强大",
      icon: Cloud,
      category: "代码生成",
      cost: "免费"
    },
    {
      id: "claude-code",
      name: "Claude Code",
      description: "终端AI助手，命令行编程助手",
      icon: Bot,
      category: "终端工具",
      cost: "付费"
    }
  ]

  const handleModelSelect = (modelId: string) => {
    setSelectedModels(prev => 
      prev.includes(modelId) 
        ? prev.filter(id => id !== modelId)
        : [...prev, modelId]
    )
  }

  const handleToolSelect = (toolId: string) => {
    setSelectedTools(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    )
  }

  const handleTechStackSelect = (techId: string) => {
    setSelectedTechStack(prev => 
      prev.includes(techId) 
        ? prev.filter(id => id !== techId)
        : [...prev, techId]
    )
  }

  const handleApplyModelRecommendations = () => {
    setSelectedModels(recommendedModels)
  }

  const handleApplyToolRecommendations = () => {
    setSelectedTools(recommendedTools)
  }

  const handleApplyTechRecommendations = () => {
    setSelectedTechStack(recommendedTechStack)
  }

  const handleNext = async () => {
    // 保存AI工具和技术栈选择到项目数据
    const updatedData = { 
      selectedModel: selectedModels.length > 0 ? selectedModels[0] : selectedModel, // 保持兼容性
      selectedModels, // 新增多选模型
      selectedTools,
      selectedTechStack
    }
    
    console.log('保存AI工具数据:', updatedData)
    updateProjectData(updatedData)
    
    // 同时更新设置存储中的选择模型
    if (selectedModels.length > 0) {
      setSelectedModel(selectedModels[0])
    }
    
    // 等待数据保存完成
    setTimeout(() => {
      console.log('AI工具数据保存完成，跳转到澄清页面')
      router.push("/project/clarification")
    }, 100)
  }

  const handleBack = () => {
    router.push("/project/create")
  }

  const getCostColor = (cost: string) => {
    switch (cost) {
      case '极低': return 'bg-green-100 text-green-700 border-green-200'
      case '低': return 'bg-green-100 text-green-700 border-green-200'
      case '中': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case '高': return 'bg-red-100 text-red-700 border-red-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  // 过滤和排序AI模型
  const filteredModels = aiModels.filter(model => {
    const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         model.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || model.category === filterCategory
    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    switch (sortBy) {
      case 'cost':
        const costOrder = { '极低': 0, '低': 1, '中': 2, '高': 3 }
        return costOrder[a.cost as keyof typeof costOrder] - costOrder[b.cost as keyof typeof costOrder]
      case 'performance':
        return b.name.localeCompare(a.name) // 简化排序
      default:
        return b.name.localeCompare(a.name)
    }
  })

  // 过滤开发工具
  const filteredTools = developmentTools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(toolsSearchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(toolsSearchQuery.toLowerCase()) ||
                         tool.category.toLowerCase().includes(toolsSearchQuery.toLowerCase())
    const matchesCategory = toolsFilterCategory === 'all' || tool.category === toolsFilterCategory
    return matchesSearch && matchesCategory
  })

  // 过滤技术栈
  const allTechStack = {
    ...TECH_STACK.languages,
    ...TECH_STACK.frontend,
    ...TECH_STACK.backend,
    ...TECH_STACK.databases,
    ...TECH_STACK.cloud
  }

  const filteredTechStack = Object.values(allTechStack).filter(tech => {
    const matchesSearch = tech.name.toLowerCase().includes(techSearchQuery.toLowerCase()) ||
                         tech.description.toLowerCase().includes(techSearchQuery.toLowerCase()) ||
                         tech.category.toLowerCase().includes(techSearchQuery.toLowerCase())
    const matchesCategory = techFilterCategory === 'all' || tech.category === techFilterCategory
    return matchesSearch && matchesCategory
  })


  const techStackCategories = [
    { id: 'languages', name: '编程语言', icon: Code, color: 'bg-blue-500' },
    { id: 'frontend', name: '前端框架', icon: Globe, color: 'bg-green-500' },
    { id: 'backend', name: '后端框架', icon: Server, color: 'bg-purple-500' },
    { id: 'databases', name: '数据库', icon: Database, color: 'bg-orange-500' },
    { id: 'cloud', name: '云服务', icon: Cloud, color: 'bg-cyan-500' }
  ]

  return (
    <RouteGuard>
      <div className="min-h-screen bg-background text-foreground">
        {/* 主内容区域 */}
        <div className="flex flex-col">
          {/* 页面头部 */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
                  </div>
              <div>
                <h1 className="text-2xl font-bold">选择AI工具与技术栈</h1>
                <p className="text-muted-foreground">为你的项目选择最适合的AI模型、开发工具和技术栈</p>
                  </div>
                </div>

            {/* 进度条 */}
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center space-x-2 ${
                    step.status === 'current' ? 'text-primary-500' : 
                    step.status === 'completed' ? 'text-success-500' : 'text-muted-foreground'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                    <span className="text-sm font-medium">{step.name}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-8 h-px bg-border mx-4" />
                  )}
                </div>
              ))}
            </div>
        </div>

          {/* 主要内容 */}
          <div className="flex-1 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* 左侧选择区域 */}
              <div className="lg:col-span-3 space-y-6">
                {/* 标签页导航 */}
                <div className="flex space-x-1 bg-muted p-1 rounded-lg">
                  <button
                    onClick={() => setActiveTab('ai')}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'ai' 
                        ? 'bg-background text-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Bot className="w-4 h-4" />
                    <span>AI模型</span>
                    {selectedModels.length > 0 && <Badge variant="secondary" className="text-xs">{selectedModels.length}</Badge>}
                  </button>
                  <button
                    onClick={() => setActiveTab('tools')}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'tools' 
                        ? 'bg-background text-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Code className="w-4 h-4" />
                    <span>开发工具</span>
                    {selectedTools.length > 0 && <Badge variant="secondary" className="text-xs">{selectedTools.length}</Badge>}
                  </button>
                  <button
                    onClick={() => setActiveTab('tech')}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'tech' 
                        ? 'bg-background text-foreground shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Cpu className="w-4 h-4" />
                    <span>技术栈</span>
                    {selectedTechStack.length > 0 && <Badge variant="secondary" className="text-xs">{selectedTechStack.length}</Badge>}
                  </button>
              </div>

              {/* AI模型选择 */}
                {activeTab === 'ai' && (
                  <Card variant="elevated">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center">
                            <Bot className="w-5 h-5 mr-2 text-primary-500" />
                            AI模型选择
                            <span className="ml-2 text-sm text-muted-foreground">（可选择多个）</span>
                          </CardTitle>
                          <CardDescription>
                            选择适合你项目需求的AI模型，不同模型在性能和成本上有所差异
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                            <input
                              type="text"
                              placeholder="搜索模型..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10 pr-4 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="all">所有类别</option>
                            <option value="通用AI">通用AI</option>
                            <option value="代码专用">代码专用</option>
                            <option value="多模态">多模态</option>
                            <option value="中文优化">中文优化</option>
                            <option value="开源模型">开源模型</option>
                          </select>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* AI智能推荐 */}
                      {recommendedModels.length > 0 && (
                        <div className="mb-6 p-4 bg-primary-500/10 rounded-lg border border-primary-500/20">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <MagicWand className="w-4 h-4 text-primary-500" />
                              <span className="text-sm font-medium">AI智能推荐</span>
                              <Badge variant="secondary" className="text-xs">
                                {recommendedModels.length} 个推荐
                              </Badge>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={handleApplyModelRecommendations}
                              className="text-primary-500 border-primary-500/50 hover:bg-primary-500/10"
                            >
                              应用推荐
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            基于你的项目描述"<span className="font-medium">{projectData.description?.substring(0, 50)}...</span>"，我们为你推荐了最适合的AI模型组合。
                          </p>
                        </div>
                      )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredModels.map((model) => {
                          const isRecommended = recommendedModels.includes(model.id)
                          const isSelected = selectedModels.includes(model.id)
                          
                          return (
                    <Card
                      key={model.id}
                              variant="elevated"
                      className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                                isSelected
                                  ? 'ring-2 ring-primary-500 bg-primary-500/5 border-primary-500/50'
                                  : isRecommended
                                  ? 'ring-1 ring-primary-500/30 bg-primary-500/5'
                                  : 'hover:bg-muted/50'
                              }`}
                              onClick={() => handleModelSelect(model.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <h3 className="font-medium text-sm">{model.name}</h3>
                                      {isRecommended && (
                                        <Badge variant="outline" className="text-xs text-primary-500 border-primary-500/50">
                                          <Star className="w-3 h-3 mr-1" />
                                          AI推荐
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-xs text-muted-foreground mb-2">{model.provider}</p>
                                    <div className="flex items-center space-x-2">
                                      <Badge 
                                        variant="outline" 
                                        className={`text-xs ${getCostColor(model.cost)}`}
                                      >
                              {model.cost} Cost
                            </Badge>
                                      <Badge variant="secondary" className="text-xs">
                                        {model.category}
                                      </Badge>
                                    </div>
                                  </div>
                                  {isSelected && (
                                    <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">{model.description}</p>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 开发工具选择 */}
                {activeTab === 'tools' && (
                  <Card variant="elevated">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center">
                            <Code className="w-5 h-5 mr-2 text-primary-500" />
                            开发工具选择
                            <span className="ml-2 text-sm text-muted-foreground">（可选择多个）</span>
                          </CardTitle>
                          <CardDescription>
                            选择你熟悉的开发工具，多选可以提升开发效率
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                            <input
                              type="text"
                              placeholder="搜索工具..."
                              value={toolsSearchQuery}
                              onChange={(e) => setToolsSearchQuery(e.target.value)}
                              className="pl-10 pr-4 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <select
                            value={toolsFilterCategory}
                            onChange={(e) => setToolsFilterCategory(e.target.value)}
                            className="px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="all">所有类别</option>
                            <option value="代码生成">代码生成</option>
                            <option value="IDE">IDE</option>
                            <option value="终端工具">终端工具</option>
                          </select>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* AI智能推荐 */}
                      {recommendedTools.length > 0 && (
                        <div className="mb-6 p-4 bg-primary-500/10 rounded-lg border border-primary-500/20">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <MagicWand className="w-4 h-4 text-primary-500" />
                              <span className="text-sm font-medium">AI智能推荐</span>
                              <Badge variant="secondary" className="text-xs">
                                {recommendedTools.length} 个推荐
                              </Badge>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={handleApplyToolRecommendations}
                              className="text-primary-500 border-primary-500/50 hover:bg-primary-500/10"
                            >
                              应用推荐
                            </Button>
                </div>
                          <p className="text-xs text-muted-foreground">
                            基于你的项目描述"<span className="font-medium">{projectData.description?.substring(0, 50)}...</span>"，我们为你推荐了最适合的开发工具组合。
                          </p>
              </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredTools.map((tool) => {
                          const isRecommended = recommendedTools.includes(tool.id)
                          const isSelected = selectedTools.includes(tool.id)
                          
                          return (
                    <Card
                      key={tool.id}
                              variant="elevated"
                      className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                                isSelected
                                  ? 'ring-2 ring-primary-500 bg-primary-500/5 border-primary-500/50'
                                  : isRecommended
                                  ? 'ring-1 ring-primary-500/30 bg-primary-500/5'
                                  : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleToolSelect(tool.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3 flex-1">
                                    <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                                      <tool.icon className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <h3 className="font-medium text-sm">{tool.name}</h3>
                                        {isRecommended && (
                                          <Badge variant="outline" className="text-xs text-primary-500 border-primary-500/50">
                                            <Star className="w-3 h-3 mr-1" />
                                            AI推荐
                                          </Badge>
                                        )}
                                      </div>
                                      <div className="flex items-center space-x-2">
                              <Badge variant="outline" className="text-xs">
                                {tool.category}
                              </Badge>
                                        <Badge 
                                          variant="outline" 
                                          className={`text-xs ${getCostColor(tool.cost)}`}
                                        >
                                          {tool.cost}
                                        </Badge>
                                      </div>
                            </div>
                          </div>
                                  {isSelected && (
                                    <CheckCircle2 className="w-5 h-5 text-primary-500 flex-shrink-0" />
                          )}
                        </div>
                                <p className="text-xs text-muted-foreground">{tool.description}</p>
                      </CardContent>
                    </Card>
                          )
                        })}
                </div>
                    </CardContent>
                  </Card>
                )}

                {/* 技术栈选择 */}
                {activeTab === 'tech' && (
                  <Card variant="elevated">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center">
                            <Cpu className="w-5 h-5 mr-2 text-primary-500" />
                            技术栈选择
                            <span className="ml-2 text-sm text-muted-foreground">（可选择多个）</span>
                          </CardTitle>
                          <CardDescription>
                            选择适合你项目的技术栈，我们已根据项目描述智能推荐
                          </CardDescription>
              </div>
                      <div className="flex items-center space-x-2">
                          <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                            <input
                              type="text"
                              placeholder="搜索技术栈..."
                              value={techSearchQuery}
                              onChange={(e) => setTechSearchQuery(e.target.value)}
                              className="pl-10 pr-4 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <select
                            value={techFilterCategory}
                            onChange={(e) => setTechFilterCategory(e.target.value)}
                            className="px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="all">所有类别</option>
                            <option value="编程语言">编程语言</option>
                            <option value="前端框架">前端框架</option>
                            <option value="后端框架">后端框架</option>
                            <option value="数据库">数据库</option>
                            <option value="云端数据库">云端数据库</option>
                            <option value="云服务">云服务</option>
                          </select>
                          {recommendedTechStack.length > 0 && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={handleApplyTechRecommendations}
                              className="text-primary-500 border-primary-500/50 hover:bg-primary-500/10"
                            >
                              <MagicWand className="w-4 h-4 mr-2" />
                              应用AI推荐
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {/* 智能推荐提示 */}
                      {recommendedTechStack.length > 0 && (
                        <div className="mb-6 p-4 bg-primary-500/10 rounded-lg border border-primary-500/20">
                          <div className="flex items-center space-x-2 mb-2">
                            <MagicWand className="w-4 h-4 text-primary-500" />
                            <span className="text-sm font-medium">AI智能推荐</span>
                            <Badge variant="secondary" className="text-xs">
                              {recommendedTechStack.length} 项推荐
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            基于你的项目描述"<span className="font-medium">{projectData.description?.substring(0, 50)}...</span>"，我们为你推荐了最适合的技术栈组合。
                          </p>
                        </div>
                      )}

                      {/* 技术栈分类 */}
                      <div className="space-y-6">
                        {techStackCategories.map((category) => {
                          const Icon = category.icon
                          const categoryTech = Object.values(TECH_STACK[category.id as keyof typeof TECH_STACK])
                          const filteredCategoryTech = categoryTech.filter(tech => {
                            const matchesSearch = tech.name.toLowerCase().includes(techSearchQuery.toLowerCase()) ||
                                                 tech.description.toLowerCase().includes(techSearchQuery.toLowerCase()) ||
                                                 tech.category.toLowerCase().includes(techSearchQuery.toLowerCase())
                            const matchesCategory = techFilterCategory === 'all' || tech.category === techFilterCategory
                            return matchesSearch && matchesCategory
                          })
                          const selectedInCategory = filteredCategoryTech.filter(tech => selectedTechStack.includes(tech.id))
                          
                          // 如果没有匹配的技术栈，不显示该分类
                          if (filteredCategoryTech.length === 0) return null
                          
                          return (
                            <div key={category.id}>
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <div className={`w-8 h-8 ${category.color} rounded-lg flex items-center justify-center`}>
                                    <Icon className="w-4 h-4 text-white" />
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium">{category.name}</h4>
                                    <p className="text-xs text-muted-foreground">
                                      {selectedInCategory.length > 0 ? `已选择 ${selectedInCategory.length} 项` : '未选择'}
                                    </p>
                                  </div>
                                </div>
                                {selectedInCategory.length > 0 && (
                                  <Badge variant="secondary" className="text-xs">
                                    {selectedInCategory.length}/{filteredCategoryTech.length}
                                  </Badge>
                                )}
              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                {filteredCategoryTech.map((tech) => {
                                  const isRecommended = recommendedTechStack.includes(tech.id)
                                  const isSelected = selectedTechStack.includes(tech.id)
                                  
                                  return (
                                    <Card
                                      key={tech.id}
                                      variant="elevated"
                                      className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                                        isSelected
                                          ? 'ring-2 ring-primary-500 bg-primary-500/5 border-primary-500/50'
                                          : isRecommended
                                          ? 'ring-1 ring-primary-500/30 bg-primary-500/5'
                                          : 'hover:bg-muted/50'
                                      }`}
                                      onClick={() => handleTechStackSelect(tech.id)}
                                    >
                                      <CardContent className="p-3">
                                        <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                                            <span className="text-lg">{tech.icon}</span>
                                            <div>
                                              <h5 className="font-medium text-sm">{tech.name}</h5>
                                              {isRecommended && (
                                                <Badge variant="outline" className="text-xs text-primary-500 border-primary-500/50">
                                                  <Star className="w-3 h-3 mr-1" />
                                                  AI推荐
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                          {isSelected && (
                                            <CheckCircle2 className="w-4 h-4 text-primary-500 flex-shrink-0" />
                                          )}
                                        </div>
                                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{tech.description}</p>
                                        <div className="flex items-center space-x-1">
                                          <Badge variant="outline" className="text-xs">
                                            {tech.popularity === 'high' ? '🔥 热门' : tech.popularity === 'medium' ? '⭐ 推荐' : '💡 新兴'}
                                          </Badge>
                                          <Badge variant="outline" className="text-xs">
                                            {tech.cost === 'free' ? '🆓 免费' : tech.cost === 'paid' ? '💰 付费' : '🔄 混合'}
                                          </Badge>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )
                                })}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* 选择摘要 */}
                {(selectedModels.length > 0 || selectedTools.length > 0 || selectedTechStack.length > 0) && (
                  <Card variant="elevated">
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center">
                        <CheckCircle2 className="w-4 h-4 mr-2 text-primary-500" />
                        你的选择摘要
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 text-sm">
                        {selectedModels.length > 0 && (
                          <div className="flex items-start space-x-3 p-3 bg-primary-500/5 rounded-lg">
                            <Bot className="w-5 h-5 text-primary-500 mt-0.5" />
                            <div className="flex-1">
                              <span className="font-medium">AI模型: </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {selectedModels.map(id => {
                                  const model = aiModels.find(m => m.id === id)
                                  return (
                                    <Badge key={id} variant="secondary" className="text-xs">
                                      {model?.name}
                                    </Badge>
                                  )
                                })}
                              </div>
                            </div>
                      </div>
                    )}
                        
                        {selectedTools.length > 0 && (
                          <div className="flex items-start space-x-3 p-3 bg-green-500/5 rounded-lg">
                            <Code className="w-5 h-5 text-green-500 mt-0.5" />
                            <div className="flex-1">
                              <span className="font-medium">开发工具: </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {selectedTools.map(id => {
                                  const tool = developmentTools.find(t => t.id === id)
                                  return (
                                    <Badge key={id} variant="secondary" className="text-xs">
                                      {tool?.name}
                                    </Badge>
                                  )
                                })}
                              </div>
                  </div>
                </div>
              )}

                        {selectedTechStack.length > 0 && (
                          <div className="flex items-start space-x-3 p-3 bg-purple-500/5 rounded-lg">
                            <Cpu className="w-5 h-5 text-purple-500 mt-0.5" />
                            <div className="flex-1">
                              <span className="font-medium">技术栈: </span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {getTechStackDetails(selectedTechStack).map(tech => (
                                  <Badge key={tech.id} variant="secondary" className="text-xs">
                                    {tech.icon} {tech.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* 右侧提示区域 */}
              <div className="lg:col-span-1">
                <Card variant="elevated" className="sticky top-6">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5 text-primary-500" />
                      <CardTitle>选择建议</CardTitle>
                    </div>
                    <CardDescription>这里有一些帮助您选择合适工具的建议。</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tips.map((tip, index) => (
                        <Card 
                          key={index} 
                          variant="elevated" 
                          className={`${index === currentTip ? 'ring-2 ring-primary-500/20' : ''}`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tip.color}`}>
                                <tip.icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium mb-1">{tip.title}</h3>
                                <p className="text-sm text-muted-foreground">{tip.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* 分页控制 */}
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex space-x-1">
                        {tips.map((_, index) => (
                          <button
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              index === currentTip ? 'bg-primary-500' : 'bg-muted'
                            }`}
                            onClick={() => setCurrentTip(index)}
                          />
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentTip(Math.max(0, currentTip - 1))}
                          disabled={currentTip === 0}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentTip(Math.min(tips.length - 1, currentTip + 1))}
                          disabled={currentTip === tips.length - 1}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* 底部操作按钮 */}
            <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  上一步
                </Button>
                
                <Button 
                  onClick={handleNext}
                disabled={selectedModels.length === 0}
                  className="min-w-32"
                >
                  下一步
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
        </div>
      </div>
    </RouteGuard>
  )
}