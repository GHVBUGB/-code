'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useProjectStore, useSettingsStore } from "@/lib/store"
import { AI_MODELS } from "@/lib/ai/openrouter"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  CheckCircle2
} from "lucide-react"
import { RouteGuard } from "@/components/auth/route-guard"

export default function AIToolsPage() {
  const { projectData, updateProjectData } = useProjectStore()
  const { selectedModel, setSelectedModel } = useSettingsStore()
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const router = useRouter()

  // AI模型配置
  const aiModels = Object.entries(AI_MODELS).map(([id, model]) => ({
    id,
    ...model
  }))

  // 开发工具配置
  const developmentTools = [
    {
      id: "github-copilot",
      name: "GitHub Copilot",
      description: "AI编程助手",
      icon: Code,
      category: "代码生成"
    },
    {
      id: "cursor-ai",
      name: "Cursor AI",
      description: "AI代码编辑器",
      icon: Sparkles,
      category: "IDE"
    },
    {
      id: "trae",
      name: "TRAE",
      description: "国产AI开发工具",
      icon: Palette,
      category: "IDE"
    },
    {
      id: "windsurf",
      name: "Windsurf",
      description: "AI原生IDE",
      icon: Wrench,
      category: "IDE"
    },
    {
      id: "codeium",
      name: "Codeium",
      description: "免费AI编程助手",
      icon: Cloud,
      category: "代码生成"
    },
    {
      id: "claude-code",
      name: "Claude Code",
      description: "终端AI助手",
      icon: Bot,
      category: "终端工具"
    }
  ]

  const handleToolSelect = (toolId: string) => {
    setSelectedTools(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    )
  }

  const handleNext = async () => {
    // 保存AI工具选择到项目数据
    updateProjectData({ 
      selectedModel, 
      selectedTools 
    })
    
    // 同时更新设置存储中的选择模型
    setSelectedModel(selectedModel)
    
    router.push("/project/clarification")
  }

  const handleBack = () => {
    router.push("/project/create")
  }

  return (
    <RouteGuard>
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
        <Header />
        
        {/* 进度指示器 */}
        <div className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
          <Container>
            <div className="flex items-center justify-center py-6">
              <div className="flex items-center space-x-8">
                {/* Step 1 - 完成 */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-green-400">项目详情</div>
                    <div className="text-xs text-gray-500">已完成</div>
                  </div>
                </div>

                <div className="w-12 h-px bg-neutral-600"></div>

                {/* Step 2 - 当前 */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">2</span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-blue-400">选择工具</div>
                    <div className="text-xs text-gray-400">进行中</div>
                  </div>
                </div>

                <div className="w-12 h-px bg-neutral-700"></div>

                {/* Step 3 - 待开始 */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-500">3</span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-500">需求澄清</div>
                    <div className="text-xs text-gray-600">待开始</div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>

        <main className="py-12">
          <Container>
            <div className="max-w-4xl mx-auto">
              {/* 页面标题 */}
              <div className="text-center mb-12">
                <h1 className="text-3xl font-bold mb-4">选择AI工具</h1>
                <p className="text-gray-400 text-lg">
                  选择适合你项目的AI模型和开发工具
                </p>
              </div>

              {/* AI模型选择 */}
              <div className="mb-12">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Bot className="w-5 h-5 mr-2 text-blue-500" />
                  AI模型
                  <span className="ml-2 text-sm text-gray-500">（选择一个）</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {aiModels.map((model) => (
                    <Card
                      key={model.id}
                      className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                        selectedModel === model.id 
                          ? 'ring-2 ring-blue-500 bg-blue-500/5 border-blue-500/50' 
                          : 'bg-neutral-800/50 border-neutral-700 hover:bg-neutral-800/70 hover:border-neutral-600'
                      }`}
                      onClick={() => setSelectedModel(model.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-sm mb-1">{model.name}</h3>
                            <p className="text-xs text-gray-400 mb-2">{model.provider}</p>
                            <Badge variant="secondary" className="text-xs">
                              {model.cost} Cost
                            </Badge>
                          </div>
                          {selectedModel === model.id && (
                            <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-300 line-clamp-2">{model.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* 开发工具选择 */}
              <div className="mb-12">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <Code className="w-5 h-5 mr-2 text-green-500" />
                  开发工具
                  <span className="ml-2 text-sm text-gray-500">（可选择多个）</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {developmentTools.map((tool) => (
                    <Card
                      key={tool.id}
                      className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                        selectedTools.includes(tool.id)
                          ? 'ring-2 ring-green-500 bg-green-500/5 border-green-500/50'
                          : 'bg-neutral-800/50 border-neutral-700 hover:bg-neutral-800/70 hover:border-neutral-600'
                      }`}
                      onClick={() => handleToolSelect(tool.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3 flex-1">
                            <div className="w-8 h-8 bg-neutral-700 rounded-lg flex items-center justify-center">
                              <tool.icon className="w-4 h-4 text-gray-300" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-sm mb-1">{tool.name}</h3>
                              <Badge variant="outline" className="text-xs">
                                {tool.category}
                              </Badge>
                            </div>
                          </div>
                          {selectedTools.includes(tool.id) && (
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-300">{tool.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* 选择摘要 */}
              {(selectedModel || selectedTools.length > 0) && (
                <div className="mb-8 p-4 bg-neutral-800/30 rounded-lg border border-neutral-700">
                  <h3 className="font-medium mb-3 text-sm">你的选择：</h3>
                  <div className="space-y-2 text-sm">
                    {selectedModel && (
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-300">
                          AI模型: {aiModels.find(m => m.id === selectedModel)?.name}
                        </span>
                      </div>
                    )}
                    {selectedTools.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <Code className="w-4 h-4 text-green-500" />
                        <span className="text-gray-300">
                          开发工具: {selectedTools.map(id => 
                            developmentTools.find(t => t.id === id)?.name
                          ).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={handleBack}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  上一步
                </Button>
                
                <Button 
                  onClick={handleNext}
                  disabled={!selectedModel}
                  className="min-w-32"
                >
                  下一步
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Container>
        </main>
      </div>
    </RouteGuard>
  )
}