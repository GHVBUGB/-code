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
  ArrowRight, 
  CheckCircle, 
  Circle, 
  FileText, 
  Code, 
  Database, 
  Settings, 
  Users, 
  Target,
  Zap,
  Eye,
  Download,
  Package,
  Calendar,
  RefreshCw,
  Brain,
  Search,
  Shield,
  TestTube
} from "lucide-react"
import { RouteGuard } from "@/components/auth/route-guard"
import { useToast } from "@/components/ui/toast/toast-provider"

export default function DocumentPreviewPage() {
  const { projectData, updateProjectData } = useProjectStore()
  const { addToast } = useToast()
  const router = useRouter()
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])

  const steps = [
    { id: 1, name: "基本信息", status: "completed" },
    { id: 2, name: "AI工具", status: "completed" },
    { id: 3, name: "需求澄清", status: "completed" },
    { id: 4, name: "文档预览", status: "current" },
    { id: 5, name: "生成文档", status: "upcoming" }
  ]

  const documentTypes = [
    {
      id: 'prd',
      title: '产品需求文档 (PRD)',
      description: '详细的产品功能需求和业务逻辑说明',
      icon: FileText,
      color: 'bg-blue-500',
      estimatedPages: '15-25页',
      content: [
        '项目概述与目标',
        '用户画像与需求分析',
        '功能需求详细说明',
        '非功能性需求',
        '用户体验设计要求'
      ]
    },
    {
      id: 'tech-design',
      title: '技术设计文档',
      description: '系统架构、技术选型和实现方案',
      icon: Code,
      color: 'bg-green-500',
      estimatedPages: '10-20页',
      content: [
        '技术架构设计',
        '数据库设计方案',
        'API接口规范',
        '安全性设计',
        '性能优化方案'
      ]
    },
    {
      id: 'database-design',
      title: '数据库设计文档',
      description: '数据模型、表结构和关系设计',
      icon: Database,
      color: 'bg-purple-500',
      estimatedPages: '8-15页',
      content: [
        '数据模型设计',
        '表结构定义',
        '索引设计策略',
        '数据迁移方案',
        '备份恢复策略'
      ]
    },
    {
      id: 'api-spec',
      title: 'API接口文档',
      description: '详细的API接口规范和使用说明',
      icon: Settings,
      color: 'bg-orange-500',
      estimatedPages: '12-18页',
      content: [
        'RESTful API设计',
        '接口参数说明',
        '响应格式定义',
        '错误码规范',
        '接口测试用例'
      ]
    },
    {
      id: 'user-manual',
      title: '用户使用手册',
      description: '面向最终用户的操作指南',
      icon: Users,
      color: 'bg-pink-500',
      estimatedPages: '10-15页',
      content: [
        '功能操作指南',
        '常见问题解答',
        '故障排除方法',
        '最佳实践建议',
        '联系支持方式'
      ]
    },
    {
      id: 'deployment-guide',
      title: '部署运维文档',
      description: '系统部署、配置和运维指南',
      icon: Target,
      color: 'bg-cyan-500',
      estimatedPages: '8-12页',
      content: [
        '环境配置要求',
        '部署步骤说明',
        '监控配置方案',
        '日志管理策略',
        '故障处理流程'
      ]
    },
    {
      id: 'requirements-design',
      title: '需求设计说明文档',
      description: '详细的需求分析和设计说明',
      icon: FileText,
      color: 'bg-indigo-500',
      estimatedPages: '12-20页',
      content: [
        '需求分析',
        '功能设计',
        '界面设计',
        '交互流程',
        '业务规则',
        '约束条件'
      ]
    },
    {
      id: 'program-architecture',
      title: '程序架构文档',
      description: '详细的程序架构和模块设计',
      icon: Code,
      color: 'bg-teal-500',
      estimatedPages: '15-25页',
      content: [
        '架构模式',
        '模块划分',
        '组件设计',
        '接口定义',
        '依赖关系',
        '架构决策'
      ]
    },
    {
      id: 'development-plan',
      title: '分阶段开发计划',
      description: '项目开发的时间规划和里程碑',
      icon: Calendar,
      color: 'bg-amber-500',
      estimatedPages: '8-15页',
      content: [
        '开发阶段',
        '时间安排',
        '里程碑',
        '资源分配',
        '风险评估',
        '交付物'
      ]
    },
    {
      id: 'development-rules',
      title: '项目开发规则',
      description: '开发过程中的规范和标准',
      icon: Settings,
      color: 'bg-red-500',
      estimatedPages: '6-12页',
      content: [
        '编码规范',
        '命名约定',
        '版本控制',
        '代码审查',
        '测试标准',
        '文档要求'
      ]
    },
    {
      id: 'role-development-rules',
      title: '分角色开发规则',
      description: '不同角色的开发职责和规范',
      icon: Users,
      color: 'bg-violet-500',
      estimatedPages: '8-15页',
      content: [
        '角色定义',
        '职责分工',
        '协作流程',
        '沟通机制',
        '权限管理',
        '考核标准'
      ]
    },
    {
      id: 'development-review',
      title: '开发复盘文档',
      description: '每个阶段的开发总结和反思',
      icon: RefreshCw,
      color: 'bg-emerald-500',
      estimatedPages: '5-10页',
      content: [
        '阶段总结',
        '问题分析',
        '经验教训',
        '改进建议',
        '最佳实践',
        '下阶段计划'
      ]
    },
    {
      id: 'implementation-logic',
      title: '程序实现逻辑文档',
      description: '核心业务逻辑的实现说明',
      icon: Brain,
      color: 'bg-rose-500',
      estimatedPages: '10-18页',
      content: [
        '算法设计',
        '业务逻辑',
        '数据处理',
        '异常处理',
        '性能考虑',
        '代码注释'
      ]
    },
    {
      id: 'submodule-architecture',
      title: '子模块架构文档',
      description: '各个子模块的详细架构设计',
      icon: Package,
      color: 'bg-sky-500',
      estimatedPages: '12-20页',
      content: [
        '模块划分',
        '接口设计',
        '数据流',
        '控制流',
        '依赖关系',
        '测试策略'
      ]
    },
    {
      id: 'architecture-audit',
      title: '架构审计文档',
      description: '系统架构的审计和评估报告',
      icon: Search,
      color: 'bg-lime-500',
      estimatedPages: '8-15页',
      content: [
        '架构评估',
        '性能分析',
        '安全审计',
        '可维护性',
        '扩展性',
        '改进建议'
      ]
    },
    {
      id: 'code-audit',
      title: '代码审计文档',
      description: '代码质量和规范的审计报告',
      icon: Shield,
      color: 'bg-yellow-500',
      estimatedPages: '6-12页',
      content: [
        '代码质量',
        '规范检查',
        '安全漏洞',
        '性能问题',
        '重构建议',
        '最佳实践'
      ]
    },
    {
      id: 'testing-document',
      title: '程序测试文档',
      description: '测试策略、用例和报告',
      icon: TestTube,
      color: 'bg-fuchsia-500',
      estimatedPages: '10-18页',
      content: [
        '测试策略',
        '测试用例',
        '测试数据',
        '测试环境',
        '测试报告',
        '缺陷管理'
      ]
    }
  ]

  useEffect(() => {
    console.log('文档预览页面 - 项目数据:', projectData)
    
    // 检查项目数据完整性
    if (!projectData.name || !projectData.description || !projectData.type) {
      console.log('项目基本信息不完整:', {
        name: projectData.name,
        description: projectData.description,
        type: projectData.type
      })
      
      // 尝试从localStorage恢复数据
      const savedData = localStorage.getItem('codeguide-project-storage')
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData)
          console.log('从localStorage恢复的数据:', parsed)
          if (parsed.state && parsed.state.projectData) {
            const restoredData = parsed.state.projectData
            if (restoredData.name && restoredData.description && restoredData.type) {
              console.log('数据恢复成功，重新检查')
              // 数据恢复成功，继续执行
            } else {
              addToast({
                title: "项目信息不完整",
                description: "请先完成前面的步骤",
                type: "error"
              })
              router.push("/project/create")
              return
            }
          }
        } catch (error) {
          console.error('解析localStorage数据失败:', error)
          addToast({
            title: "项目信息不完整",
            description: "请先完成前面的步骤",
            type: "error"
          })
          router.push("/project/create")
          return
        }
      } else {
        addToast({
          title: "项目信息不完整",
          description: "请先完成前面的步骤",
          type: "error"
        })
        router.push("/project/create")
        return
      }
    }

    // 检查是否完成了需求澄清步骤（降低要求）
    if (!projectData.clarificationAnswers || Object.keys(projectData.clarificationAnswers).length === 0) {
      console.log('需求澄清数据不完整:', projectData.clarificationAnswers)
      console.log('数据恢复成功,重新检查')
      
      // 给用户一个选择，而不是强制跳转
      addToast({
        title: "需求澄清数据不完整",
        description: "建议先完成需求澄清，但您可以继续预览文档",
        type: "warning"
      })
      
      // 不强制跳转，让用户继续
      // router.push("/project/clarification")
      // return
    }

    console.log('所有检查通过，进入文档预览页面')

    // 如果已经有选择的文档，恢复选择状态
    if (projectData.selectedDocuments && projectData.selectedDocuments.length > 0) {
      setSelectedDocuments(projectData.selectedDocuments)
    } else {
      // 默认选择核心文档
      setSelectedDocuments(['prd', 'tech-design'])
    }
  }, []) // 移除依赖项，避免无限循环

  const handleDocumentToggle = (docId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    )
  }

  const handleSelectAll = () => {
    if (selectedDocuments.length === documentTypes.length) {
      setSelectedDocuments([])
    } else {
      setSelectedDocuments(documentTypes.map(doc => doc.id))
    }
  }

  const handleNext = () => {
    if (selectedDocuments.length === 0) {
      addToast({
        title: "请选择文档类型",
        description: "至少选择一种要生成的文档类型",
        type: "error"
      })
      return
    }

    // 保存选择的文档类型到store
    updateProjectData({
      selectedDocuments: selectedDocuments
    })

    addToast({
      title: "文档类型已选择",
      description: `已选择 ${selectedDocuments.length} 种文档类型`,
      type: "success"
    })

    router.push("/project/generate")
  }

  const handleBack = () => {
    router.push("/project/clarification")
  }

  return (
    <RouteGuard>
      <div className="min-h-screen bg-background text-foreground">
        {/* 页面头部 */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-warning-500 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">文档预览</h1>
              <p className="text-muted-foreground">选择要生成的文档类型</p>
            </div>
          </div>

          {/* 进度条 */}
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center space-x-2 ${
                  step.status === 'current' ? 'text-warning-500' : 
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
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            {/* 项目信息概览 */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>项目信息</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">项目名称</p>
                    <p className="font-medium">{projectData.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">项目类型</p>
                    <Badge variant="secondary">{projectData.type}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">AI模型</p>
                    <p className="font-medium">{projectData.selectedModel || '未选择'}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">项目描述</p>
                  <p className="text-sm mt-1">{projectData.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* 文档选择区域 */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">选择要生成的文档</h2>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-muted-foreground">
                    已选择 {selectedDocuments.length} / {documentTypes.length} 个文档
                  </span>
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    {selectedDocuments.length === documentTypes.length ? '取消全选' : '全选'}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documentTypes.map((doc) => {
                  const Icon = doc.icon
                  const isSelected = selectedDocuments.includes(doc.id)
                  
                  return (
                    <Card 
                      key={doc.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'ring-2 ring-primary-500 bg-primary-500/5' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => handleDocumentToggle(doc.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className={`w-10 h-10 ${doc.color} rounded-lg flex items-center justify-center`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected 
                              ? 'bg-primary-500 border-primary-500' 
                              : 'border-muted-foreground'
                          }`}>
                            {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                          </div>
                        </div>
                        <CardTitle className="text-lg">{doc.title}</CardTitle>
                        <CardDescription>{doc.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">预估页数</span>
                            <span className="font-medium">{doc.estimatedPages}</span>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">主要内容</p>
                            <ul className="text-xs space-y-1">
                              {doc.content.map((item, index) => (
                                <li key={index} className="flex items-center space-x-2">
                                  <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* 调试信息 */}
            <Card className="mb-6 bg-yellow-500/10 border-yellow-500/30">
              <CardHeader>
                <CardTitle className="text-yellow-600">调试信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>项目名称: {projectData.name || '未设置'}</div>
                  <div>项目描述: {projectData.description || '未设置'}</div>
                  <div>项目类型: {projectData.type || '未设置'}</div>
                  <div>澄清问题数量: {projectData.clarificationAnswers ? Object.keys(projectData.clarificationAnswers).length : 0}</div>
                  <div>选择的文档: {selectedDocuments.length} 个</div>
                </div>
                <div className="mt-4 space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      console.log('当前项目数据:', projectData)
                      console.log('选择的文档:', selectedDocuments)
                    }}
                  >
                    打印调试信息
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => {
                      // 强制设置默认数据
                      updateProjectData({
                        name: projectData.name || '测试项目',
                        description: projectData.description || '这是一个测试项目',
                        type: projectData.type || 'web应用',
                        clarificationAnswers: projectData.clarificationAnswers || {
                          targetAudience: '企业用户',
                          keyFeatures: '用户管理、数据统计',
                          technicalRequirements: '高性能、安全'
                        }
                      })
                      addToast({
                        title: "数据已修复",
                        description: "已设置默认数据，可以继续操作",
                        type: "success"
                      })
                    }}
                  >
                    修复数据
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 操作按钮 */}
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                上一步
              </Button>
              
              <Button 
                onClick={handleNext}
                disabled={selectedDocuments.length === 0}
                className="bg-warning-500 hover:bg-warning-600"
              >
                下一步：生成文档
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  )
}