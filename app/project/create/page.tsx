'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useProjectStore, useSettingsStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Circle, 
  FileText, 
  Lightbulb, 
  Plus, 
  Sparkles,
  Target,
  Users,
  Zap,
  Box,
  FileText as FileTemplate,
  Bot,
  Code,
  Palette,
  Database,
  Cloud,
  Globe,
  Smartphone,
  Upload,
  ArrowUpDown,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from "lucide-react"
import { RouteGuard } from "@/components/auth/route-guard"
import Link from "next/link"
import { useToast } from "@/components/ui/toast/toast-provider"
import { APIKeyHelper } from "@/lib/utils/api-key-helper"

export default function CreateProjectPage() {
  const { projectData, updateProjectBasics } = useProjectStore()
  const { selectedModel } = useSettingsStore()
  const [projectName, setProjectName] = useState(projectData.name || "")
  const [projectDescription, setProjectDescription] = useState(projectData.description || "")
  const [currentTip, setCurrentTip] = useState(0)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [projectType, setProjectType] = useState("")
  const { addToast } = useToast()
  const router = useRouter()

  const steps = [
    { id: 1, name: "基本信息", status: "current" },
    { id: 2, name: "AI工具", status: "upcoming" },
    { id: 3, name: "完成", status: "upcoming" }
  ]

  const tips = [
    {
      icon: Target,
      title: "明确项目目标",
      description: "清晰描述项目要解决的问题和预期成果",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Users,
      title: "定义目标用户",
      description: "明确项目的主要用户群体和使用场景",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: Zap,
      title: "核心功能优先",
      description: "先确定最重要的核心功能，再考虑扩展功能",
      color: "bg-purple-100 text-purple-600"
    }
  ]

  const handleNext = () => {
    updateProjectBasics({
      name: projectName,
      description: projectDescription,
      type: projectType,
    })
    router.push("/project/ai-tools")
  }

  const handleStarterKit = (kit: any) => {
    // 处理入门套件选择
    console.log("Selected kit:", kit.title)
  }

  const projectTypes = [
    { id: "web-app", name: "Web应用", description: "基于Web的应用程序" },
    { id: "mobile-app", name: "移动应用", description: "iOS/Android移动应用" },
    { id: "desktop-app", name: "桌面应用", description: "桌面端应用程序" },
    { id: "api-service", name: "API服务", description: "后端API服务" },
    { id: "data-analysis", name: "数据分析", description: "数据处理和分析项目" },
    { id: "ai-ml", name: "AI/ML", description: "人工智能/机器学习项目" },
    { id: "blockchain", name: "区块链", description: "区块链相关项目" },
    { id: "game", name: "游戏", description: "游戏开发项目" },
    { id: "other", name: "其他", description: "其他类型项目" }
  ]

  const canProceed = projectName.trim() !== '' && projectDescription.trim() !== ''

  // 重新设计的优化功能
  const handleOptimize = async () => {
    if (!projectName.trim() || !projectDescription.trim()) {
      addToast({ 
        title: '信息不完整', 
        message: '请先填写项目名称和描述', 
        type: 'warning' 
      })
      return
    }

    // 获取API密钥
    const apiKey = APIKeyHelper.getAPIKey()
    if (!apiKey) {
      addToast({ 
        title: 'API密钥未配置', 
        message: '请先在设置页面配置OpenRouter API密钥', 
        type: 'error' 
      })
      return
    }

    setIsOptimizing(true)
    
    try {
      // 直接调用 OpenRouter API，使用正确的格式
      const response = await fetch('/api/openrouter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: '/chat/completions',
          method: 'POST',
          apiKey: apiKey, // 传递API密钥
          data: {
            model: 'anthropic/claude-sonnet-4',
            messages: [{
              role: 'user',
              content: `请优化以下项目描述，使其更加专业、清晰和具体：

项目名称：${projectName}
项目描述：${projectDescription}

请返回优化后的项目描述，要求：
1. 保持原意不变
2. 语言更加专业
3. 结构更加清晰
4. 突出核心价值
5. 字数控制在200-300字

只返回优化后的描述内容，不要其他说明。`
            }],
            max_tokens: 500,
            temperature: 0.7
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const optimizedDescription = data.choices[0].message.content.trim()
        setProjectDescription(optimizedDescription)
        addToast({ 
          title: '优化完成', 
          message: '项目描述已成功优化', 
          type: 'success' 
        })
      } else {
        throw new Error('AI响应格式异常')
      }
    } catch (error) {
      console.error('优化失败:', error)
      addToast({ 
        title: '优化失败', 
        message: error instanceof Error ? error.message : '请检查网络连接或稍后重试', 
        type: 'error' 
      })
    } finally {
      setIsOptimizing(false)
    }
  }

  const handleInsertTemplate = () => {
    const template = `# 项目目标\n- 说明核心目标\n\n# 目标用户\n- 说明主要用户\n\n# 核心功能\n- 功能A\n- 功能B\n\n# 技术栈\n- 前端/后端/数据库/部署\n\n# 非功能要求\n- 性能/安全/可维护性\n\n# 里程碑\n- M1: ...\n- M2: ...`
    if (!projectDescription.trim()) {
      setProjectDescription(template)
    } else {
      setProjectDescription(prev => `${prev.trim()}\n\n${template}`)
    }
    addToast({ title: '已插入模板', message: '可根据模板补全关键要素', type: 'info' })
  }

  const handleImportMarkdown = async () => {
    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.md,markdown,text/markdown'
      input.onchange = async () => {
        const file = input.files?.[0]
        if (!file) return
        const text = await file.text()
        setProjectDescription(prev => (prev?.trim() ? `${prev}\n\n${text}` : text))
        addToast({ title: '导入成功', message: `已导入 ${file.name}`, type: 'success' })
      }
      input.click()
    } catch (e) {
      addToast({ title: '导入失败', message: '无法读取Markdown文件', type: 'error' })
    }
  }

  return (
    <RouteGuard>
      <div className="min-h-screen bg-background text-foreground">
        {/* 主内容区域 */}
        <div className="flex flex-col">
          {/* 页面头部 */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <Box className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">创建新项目</h1>
                <p className="text-muted-foreground">使用AI Agent 辅助您完成专业的项目需求分析</p>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 左侧表单区域 */}
              <div className="lg:col-span-2 space-y-6">
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>基本信息</CardTitle>
                    <CardDescription>
                      填写项目自名称和详细描述，您越具体，我们就能更好地帮助您实现项目。
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* 项目名称 */}
                    <div>
                      <Label htmlFor="project-name">项目名称</Label>
                      <Input
                        id="project-name"
                        placeholder="开发文档"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="mt-2"
                      />
                    </div>

                    {/* 项目描述中包含以下要点 */}
                    <div>
                      <Label>项目描述中建议包含以下要点</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {["项目目标", "目标用户", "核心功能", "技术栈", "设计要求"].map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={handleInsertTemplate}>
                        <Plus className="w-4 h-4 mr-2" />
                        提示模板
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleImportMarkdown}>
                        <Upload className="w-4 h-4 mr-2" />
                        导入Markdown文档
                      </Button>
                    </div>

                    {/* 项目描述 */}
                    <div>
                      <Label htmlFor="project-description">项目描述</Label>
                      <Textarea
                        id="project-description"
                        placeholder="老板怎么说"
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        className="mt-2 min-h-[120px]"
                      />
                    </div>

                    {/* 优化按钮 - 重新设计 */}
                    <div className="flex justify-end space-x-2">
                      {isOptimizing && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500 mr-2"></div>
                          AI正在优化中...
                        </div>
                      )}
                      <Button 
                        variant="outline" 
                        onClick={handleOptimize} 
                        disabled={isOptimizing || !projectName.trim() || !projectDescription.trim()}
                        className="min-w-[100px]"
                      >
                        <Zap className="w-4 h-4 mr-2" />
                        {isOptimizing ? '优化中...' : '优化'}
                      </Button>
                    </div>

                    {/* 优化状态提示 */}
                    {!projectName.trim() || !projectDescription.trim() ? (
                      <div className="flex items-center text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        请先填写项目名称和描述后再使用优化功能
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </div>

              {/* 右侧提示区域 */}
              <div className="lg:col-span-1">
                <Card variant="elevated">
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5 text-primary-500" />
                      <CardTitle>实用技巧</CardTitle>
                    </div>
                    <CardDescription>这里有一些帮助您成功完成项目的提示。</CardDescription>
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
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回
              </Button>
              <Button onClick={handleNext} disabled={!projectName.trim()}>
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

