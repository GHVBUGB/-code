'use client'

import { useState, useEffect } from "react"
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
  FileText, 
  Download,
  Package,
  RefreshCw,
  AlertCircle,
  Eye,
  Edit,
  Sparkles,
  Check,
  X,
  Loader2
} from "lucide-react"
import { RouteGuard } from "@/components/auth/route-guard"
import { useToast } from "@/components/ui/toast/toast-provider"
import { aiAPI } from "@/lib/api"

interface GeneratedDocument {
  id: string
  title: string
  description: string
  status: 'generating' | 'completed' | 'error'
  content?: string
  downloadUrl?: string
  error?: string
}

export default function DocumentGenerationPage() {
  const { projectData } = useProjectStore()
  const { addToast } = useToast()
  const router = useRouter()
  const [documents, setDocuments] = useState<GeneratedDocument[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [selectedForDownload, setSelectedForDownload] = useState<string[]>([])

  const steps = [
    { id: 1, name: "基本信息", status: "completed" },
    { id: 2, name: "AI工具", status: "completed" },
    { id: 3, name: "需求澄清", status: "completed" },
    { id: 4, name: "文档预览", status: "completed" },
    { id: 5, name: "生成文档", status: "current" }
  ]

  const documentTemplates = [
    {
      id: 'prd',
      title: '产品需求文档 (PRD)',
      description: '详细的产品功能需求和业务逻辑说明'
    },
    {
      id: 'tech-design',
      title: '技术设计文档',
      description: '系统架构、技术选型和实现方案'
    },
    {
      id: 'database-design',
      title: '数据库设计文档',
      description: '数据模型、表结构和关系设计'
    },
    {
      id: 'api-spec',
      title: 'API接口文档',
      description: '详细的API接口规范和使用说明'
    },
    {
      id: 'user-manual',
      title: '用户使用手册',
      description: '面向最终用户的操作指南'
    },
    {
      id: 'deployment-guide',
      title: '部署运维文档',
      description: '系统部署、配置和运维指南'
    }
  ]

  useEffect(() => {
    // 检查项目数据完整性
    if (!projectData.name || !projectData.description) {
      addToast({
        title: "项目信息不完整",
        description: "请先完成前面的步骤",
        type: "error"
      })
      router.push("/project/create")
      return
    }

    // 获取选择的文档类型，如果没有则默认选择前两个
    const selectedDocTypes = projectData.selectedDocuments || ['prd', 'tech-design']
    
    // 初始化文档列表
    const initialDocs = selectedDocTypes.map(docType => {
      const template = documentTemplates.find(t => t.id === docType)
      return {
        id: docType,
        title: template?.title || '项目文档',
        description: template?.description || '项目相关文档',
        status: 'generating' as const
      }
    })
    
    setDocuments(initialDocs)
    setSelectedForDownload(initialDocs.map(doc => doc.id))
    
    // 开始生成文档
    startGeneration(initialDocs)
  }, [projectData, router, addToast])

  const startGeneration = async (docsToGenerate: GeneratedDocument[]) => {
    setIsGenerating(true)
    setGenerationProgress(0)

    try {
      // 获取要生成的文档类型列表
      const docTypes = docsToGenerate.map(doc => doc.id)
      
      // 调用API生成所有文档
          const result = await aiAPI.generateProjectDocuments(projectData, docTypes)
      
      if (result.success && result.data) {
        // 更新所有文档状态
        setDocuments(prev => prev.map(doc => {
          const generatedDoc = result.data.find(gd => gd.id === doc.id)
          if (generatedDoc) {
            return {
              ...doc,
              status: generatedDoc.status,
              content: generatedDoc.content,
              error: generatedDoc.error,
              downloadUrl: generatedDoc.downloadUrl
            }
          }
          return doc
        }))
        
        setGenerationProgress(100)
        
        const successCount = result.data.filter(d => d.status === 'completed').length
        const errorCount = result.data.filter(d => d.status === 'error').length
        
        if (errorCount === 0) {
          addToast({
            title: "文档生成完成",
            description: `成功生成 ${successCount} 个文档`,
            type: "success"
          })
        } else {
          addToast({
            title: "文档生成部分完成",
            description: `成功生成 ${successCount} 个文档，${errorCount} 个失败`,
            type: "warning"
          })
        }
      } else {
        throw new Error(result.error || '生成失败')
      }
    } catch (error) {
      addToast({
        title: "生成失败",
        description: error instanceof Error ? error.message : "文档生成过程中出现错误",
        type: "error"
      })
      
      // 将所有文档标记为错误状态
      setDocuments(prev => prev.map(doc => ({
        ...doc,
        status: 'error',
        error: error instanceof Error ? error.message : '生成失败'
      })))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRetryGeneration = async (docId: string) => {
    const doc = documents.find(d => d.id === docId)
    if (!doc) return

    setDocuments(prev => prev.map(d => 
      d.id === docId ? { ...d, status: 'generating', error: undefined } : d
    ))

    try {
      // 只生成指定的文档类型
      const result = await aiAPI.generateProjectDocuments(projectData, [docId])
      
      if (result.success && result.data && result.data[0]) {
        const generatedDoc = result.data[0]
        setDocuments(prev => prev.map(d => 
          d.id === docId 
            ? {
                ...d,
                status: generatedDoc.status,
                content: generatedDoc.content,
                error: generatedDoc.error,
                downloadUrl: generatedDoc.downloadUrl
              }
            : d
        ))
        
        if (generatedDoc.status === 'completed') {
          addToast({
            title: "重新生成成功",
            description: `${doc.title} 已成功生成`,
            type: "success"
          })
        } else {
          addToast({
            title: "重新生成失败",
            description: generatedDoc.error || '生成失败',
            type: "error"
          })
        }
      } else {
        throw new Error(result.error || '生成失败')
      }
    } catch (error) {
      setDocuments(prev => prev.map(d => 
        d.id === docId 
          ? {
              ...d,
              status: 'error',
              error: error instanceof Error ? error.message : '生成失败'
            }
          : d
      ))
      
      addToast({
        title: "重新生成失败",
        description: error instanceof Error ? error.message : '生成失败',
        type: "error"
      })
    }
  }

  const handleDownloadSingle = (docId: string) => {
    const doc = documents.find(d => d.id === docId)
    if (!doc || !doc.content) return

    const blob = new Blob([doc.content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${doc.title}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    addToast({
      title: "下载成功",
      description: `${doc.title} 已下载`,
      type: "success"
    })
  }

  const handleDownloadSelected = () => {
    const selectedDocs = documents.filter(d => 
      selectedForDownload.includes(d.id) && d.status === 'completed' && d.content
    )

    if (selectedDocs.length === 0) {
      addToast({
        title: "没有可下载的文档",
        description: "请选择已完成生成的文档",
        type: "error"
      })
      return
    }

    selectedDocs.forEach(doc => {
      handleDownloadSingle(doc.id)
    })
  }

  const handleDownloadAll = () => {
    const completedDocs = documents.filter(d => d.status === 'completed' && d.content)
    
    if (completedDocs.length === 0) {
      addToast({
        title: "没有可下载的文档",
        description: "请等待文档生成完成",
        type: "error"
      })
      return
    }

    // 创建ZIP包（这里简化为逐个下载）
    completedDocs.forEach(doc => {
      handleDownloadSingle(doc.id)
    })

    addToast({
      title: "批量下载完成",
      description: `已下载 ${completedDocs.length} 个文档`,
      type: "success"
    })
  }

  const handleToggleSelection = (docId: string) => {
    setSelectedForDownload(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    )
  }

  const handleBack = () => {
    router.push("/project/preview")
  }

  const completedCount = documents.filter(d => d.status === 'completed').length
  const errorCount = documents.filter(d => d.status === 'error').length

  return (
    <RouteGuard>
      <div className="min-h-screen bg-background text-foreground">
        {/* 页面头部 */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-success-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">生成文档</h1>
              <p className="text-muted-foreground">AI正在为您生成专业的项目文档</p>
            </div>
          </div>

          {/* 进度条 */}
          <div className="flex items-center space-x-4 mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-2 ${
                  step.status === 'current' ? 'text-success-500' : 
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

          {/* 生成进度 */}
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>生成进度</span>
                <span>{Math.round(generationProgress)}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>
          )}
        </div>

        {/* 主要内容 */}
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            {/* 状态概览 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">总文档数</p>
                      <p className="text-2xl font-bold">{documents.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-success-500 rounded-lg flex items-center justify-center">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">已完成</p>
                      <p className="text-2xl font-bold">{completedCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-error-500 rounded-lg flex items-center justify-center">
                      <X className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">生成失败</p>
                      <p className="text-2xl font-bold">{errorCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 文档列表 */}
            <div className="space-y-4 mb-6">
              {documents.map((doc) => (
                <Card key={doc.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          doc.status === 'completed' ? 'bg-success-500' :
                          doc.status === 'error' ? 'bg-error-500' :
                          'bg-warning-500 animate-pulse'
                        }`} />
                        <div>
                          <CardTitle className="text-lg">{doc.title}</CardTitle>
                          <CardDescription>{doc.description}</CardDescription>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {doc.status === 'generating' && (
                          <Loader2 className="w-5 h-5 animate-spin text-warning-500" />
                        )}
                        
                        {doc.status === 'completed' && (
                          <>
                            <input
                              type="checkbox"
                              checked={selectedForDownload.includes(doc.id)}
                              onChange={() => handleToggleSelection(doc.id)}
                              className="w-4 h-4"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadSingle(doc.id)}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              下载
                            </Button>
                          </>
                        )}
                        
                        {doc.status === 'error' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRetryGeneration(doc.id)}
                          >
                            <RefreshCw className="w-4 h-4 mr-1" />
                            重试
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  {doc.status === 'error' && doc.error && (
                    <CardContent className="pt-0">
                      <div className="flex items-center space-x-2 text-error-500 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <span>{doc.error}</span>
                      </div>
                    </CardContent>
                  )}
                  
                  {doc.status === 'completed' && doc.content && (
                    <CardContent className="pt-0">
                      <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-2">文档预览</p>
                        <div className="text-sm max-h-32 overflow-hidden">
                          {doc.content.substring(0, 200)}...
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            {/* 批量操作 */}
            {completedCount > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="w-5 h-5" />
                    <span>批量下载</span>
                  </CardTitle>
                  <CardDescription>
                    选择多个文档进行批量下载，或一键下载所有文档
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-muted-foreground">
                      已选择 {selectedForDownload.length} 个文档
                    </span>
                    <Button
                      variant="outline"
                      onClick={handleDownloadSelected}
                      disabled={selectedForDownload.length === 0}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      下载选中
                    </Button>
                    <Button
                      onClick={handleDownloadAll}
                      className="bg-success-500 hover:bg-success-600"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      一键打包下载
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 操作按钮 */}
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                上一步
              </Button>
              
              <Button 
                onClick={() => router.push("/dashboard")}
                className="bg-primary-500 hover:bg-primary-600"
              >
                完成项目创建
              </Button>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  )
}