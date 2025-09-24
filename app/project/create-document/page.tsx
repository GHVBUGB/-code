'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useProjectStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft, 
  CheckCircle, 
  Circle, 
  Box,
  Download,
  FileDown,
  Eye,
  Share,
  Zap,
  Sparkles
} from "lucide-react"
import { RouteGuard } from "@/components/auth/route-guard"
import Link from "next/link"

export default function CreateDocumentPage() {
  const { projectData, updateProjectData } = useProjectStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const router = useRouter()

  const steps = [
    { id: 1, name: "项目详情", status: "completed" },
    { id: 2, name: "选择AI工具", status: "completed" },
    { id: 3, name: "需求澄清", status: "completed" },
    { id: 4, name: "项目计划", status: "completed" },
    { id: 5, name: "创建文档", status: "current" }
  ]

  const documents = [
    {
      id: "prd",
      name: "产品需求文档 (PRD)",
      description: "详细的产品功能需求和技术规格说明",
      status: "completed",
      size: "2.3MB",
      format: "PDF"
    },
    {
      id: "tech-spec",
      name: "技术规格文档",
      description: "系统架构、API设计和数据库设计文档",
      status: "completed", 
      size: "1.8MB",
      format: "PDF"
    },
    {
      id: "ui-guide",
      name: "UI设计指南",
      description: "界面设计规范、组件库和交互说明",
      status: "completed",
      size: "3.1MB", 
      format: "PDF"
    },
    {
      id: "api-docs",
      name: "API接口文档",
      description: "完整的API接口说明和示例代码",
      status: "completed",
      size: "1.2MB",
      format: "Markdown"
    },
    {
      id: "deployment",
      name: "部署指南",
      description: "生产环境部署和运维配置说明",
      status: "completed",
      size: "0.9MB",
      format: "PDF"
    },
    {
      id: "user-manual",
      name: "用户手册",
      description: "最终用户的使用指南和功能介绍",
      status: "completed",
      size: "2.7MB",
      format: "PDF"
    }
  ]

  const handleGenerate = async () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    
    // 模拟生成过程
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      setGenerationProgress(i)
    }
    
    setIsGenerating(false)
  }

  const handleDownload = (docId: string) => {
    console.log(`Downloading document: ${docId}`)
  }

  const handleView = (docId: string) => {
    console.log(`Viewing document: ${docId}`)
  }

  const handleShare = (docId: string) => {
    console.log(`Sharing document: ${docId}`)
  }

  const handleBack = () => {
    router.push("/project/planning")
  }

  const handleFinish = () => {
    router.push("/dashboard")
  }

  return (
    <RouteGuard>
      <div className="min-h-screen bg-background text-foreground">

        {/* 主内容区域 */}
        <div className="flex flex-col">
          {/* 页面头部 */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                  <Box className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">创建新项目</h1>
                  <p className="text-muted-foreground">使用AI Agent 辅助您完成专业的项目需求分析</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">100%</span>
                <Button variant="outline" size="sm">-</Button>
                <Button variant="outline" size="sm">+</Button>
                <Button variant="outline" size="sm">重置</Button>
              </div>
            </div>

            {/* 进度条 */}
            <div className="flex items-center space-x-4 mt-4">
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

          {/* 主内容 */}
          <div className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">创建文档</h2>
                <p className="text-muted-foreground">基于您的项目信息，我们已为您生成了完整的项目文档</p>
              </div>

              {/* 生成进度 */}
              {isGenerating && (
                <Card variant="elevated" className="mb-6">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-primary-500/10 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-primary-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">正在生成文档...</h3>
                        <p className="text-sm text-muted-foreground">AI正在为您创建专业的项目文档</p>
                      </div>
                    </div>
                    <Progress value={generationProgress} className="w-full" />
                    <p className="text-sm text-muted-foreground mt-2">{generationProgress}% 完成</p>
                  </CardContent>
                </Card>
              )}

              {/* 文档列表 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {documents.map((doc) => (
                  <Card key={doc.id} variant="elevated" className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary-500" />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {doc.format}
                        </Badge>
                      </div>
                      <h3 className="font-semibold mb-2">{doc.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{doc.description}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <span>大小: {doc.size}</span>
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="w-3 h-3 text-success-500" />
                          <span>已完成</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleView(doc.id)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          预览
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleDownload(doc.id)}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          下载
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleShare(doc.id)}
                        >
                          <Share className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* 批量操作 */}
              <Card variant="elevated" className="mb-8">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold mb-1">批量操作</h3>
                      <p className="text-sm text-muted-foreground">一键下载所有文档或重新生成</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline">
                        <FileDown className="w-4 h-4 mr-2" />
                        下载全部
                      </Button>
                      <Button variant="outline" onClick={handleGenerate}>
                        <Zap className="w-4 h-4 mr-2" />
                        重新生成
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 底部操作按钮 */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                返回
              </Button>
              <Button onClick={handleFinish} size="lg">
                <CheckCircle className="w-4 h-4 mr-2" />
                完成项目创建
              </Button>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  )
}








