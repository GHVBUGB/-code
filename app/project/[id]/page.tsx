'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/ui/header'
import { Container } from '@/components/ui/container'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { projectAPI } from '@/lib/api'
import { exportAsMarkdown, exportAsHTML, exportAsJSON } from '@/lib/export-utils'
import { 
  FileText, 
  ArrowLeft, 
  Download, 
  Edit3,
  Calendar,
  User,
  Code,
  Target,
  Layers,
  CheckCircle,
  Clock,
  Loader2,
  Share2,
  Trash2
} from 'lucide-react'

interface Project {
  id: string
  name: string
  description: string
  type: string
  status: string
  tech_stack?: string[]
  ai_model?: string
  ai_tools?: string[]
  clarification_questions?: any[]
  feature_list?: any[]
  prd_document?: any
  created_at: string
  updated_at: string
}

import { RouteGuard } from "@/components/auth/route-guard"

export default function ProjectViewPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [project, setProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (params.id) {
      loadProject(params.id as string)
    }
  }, [params.id])

  const loadProject = async (projectId: string) => {
    try {
      setIsLoading(true)
      // Mock project data for now (replace with real API call)
      const mockProject: Project = {
        id: projectId,
        name: 'CodeGuide AI 优化升级版',
        description: '一个基于AI的智能项目需求分析平台，帮助用户快速明确项目需求，生成专业的需求文档。',
        type: 'web',
        status: 'completed',
        tech_stack: ['Next.js 14', 'React 18', 'TailwindCSS', 'Supabase', 'OpenRouter API'],
        ai_model: 'claude-3.5-sonnet',
        ai_tools: ['需求分析', '技术栈推荐', 'PRD生成'],
        clarification_questions: [
          {
            id: '1',
            question: '项目的主要目标用户是谁？',
            category: '用户定位',
            answer: '产品经理、项目经理、技术负责人、创业者'
          },
          {
            id: '2',
            question: '项目需要支持多少并发用户？',
            category: '技术需求',
            answer: '初期支持1000+并发用户，后期可扩展'
          }
        ],
        feature_list: [
          {
            id: '1',
            name: '用户认证系统',
            description: '用户注册、登录、密码重置等基础认证功能',
            priority: 'high',
            complexity: 'medium',
            estimatedDays: 5
          },
          {
            id: '2',
            name: 'AI需求分析',
            description: '集成AI服务，自动生成项目需求分析报告',
            priority: 'high',
            complexity: 'complex',
            estimatedDays: 10
          }
        ],
        prd_document: {
          overview: '一个基于AI的智能项目需求分析平台，帮助用户快速明确项目需求，生成专业的需求文档。',
          objectives: [
            '提升项目需求分析效率',
            '降低需求理解偏差',
            '生成标准化需求文档',
            '支持团队协作'
          ],
          targetUsers: ['产品经理', '项目经理', '技术负责人', '创业者']
        },
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T14:20:00Z'
      }

      setProject(mockProject)
    } catch (error) {
      toast({
        title: "加载失败",
        description: "无法加载项目信息",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!project) return
    
    if (!confirm(`确定要删除项目"${project.name}"吗？此操作不可撤销。`)) {
      return
    }

    try {
      const result = await projectAPI.deleteProject(project.id)
      
      if (result.success) {
        toast({
          title: "删除成功",
          description: `项目"${project.name}"已删除`
        })
        router.push('/dashboard')
      } else {
        toast({
          title: "删除失败",
          description: result.error || "删除项目时发生错误",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "删除失败",
        description: "网络错误，请稍后重试",
        variant: "destructive"
      })
    }
  }

  const handleExport = (format: string) => {
    if (!project) return

    const exportData = {
      project: {
        name: project.name,
        description: project.description,
        type: project.type,
        status: project.status,
        created_at: project.created_at,
        updated_at: project.updated_at
      },
      features: project.feature_list,
      techStack: project.tech_stack ? [{
        category: '推荐技术栈',
        items: project.tech_stack.map(tech => ({
          name: tech,
          reason: '基于项目需求推荐'
        }))
      }] : undefined,
      clarificationQuestions: project.clarification_questions,
      prd: project.prd_document
    }

    try {
      switch (format.toLowerCase()) {
        case 'markdown':
        case 'md':
          exportAsMarkdown(exportData)
          break
        case 'html':
          exportAsHTML(exportData)
          break
        case 'json':
          exportAsJSON(exportData)
          break
        case 'pdf':
          // For PDF, we'll export as HTML for now
          exportAsHTML(exportData)
          toast({
            title: "PDF导出",
            description: "已导出为HTML格式，您可以在浏览器中打印为PDF"
          })
          break
        default:
          exportAsMarkdown(exportData)
      }
      
      toast({
        title: "导出成功",
        description: `项目文档已导出为${format.toUpperCase()}格式`
      })
    } catch (error) {
      toast({
        title: "导出失败",
        description: "导出过程中发生错误，请稍后重试",
        variant: "destructive"
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success'
      case 'planning': return 'secondary'
      case 'clarifying': return 'secondary'
      case 'draft': return 'outline'
      default: return 'secondary'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '已完成'
      case 'planning': return '规划中'
      case 'clarifying': return '澄清中'
      case 'draft': return '草稿'
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'planning': return <Clock className="w-4 h-4" />
      case 'clarifying': return <Clock className="w-4 h-4" />
      case 'draft': return <Edit3 className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      case 'low': return 'outline'
      default: return 'secondary'
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'complex': return 'destructive'
      case 'medium': return 'secondary'
      case 'simple': return 'success'
      default: return 'secondary'
    }
  }

  if (isLoading) {
    return (
      <RouteGuard>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
        <Header
          logo={{ text: "CodeGuide AI", href: "/" }}
          actions={
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              返回仪表板
            </Button>
          }
        />
        
        <Container size="lg" className="py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mr-2" />
            <span className="text-neutral-600 dark:text-neutral-400">
              加载项目信息中...
            </span>
          </div>
        </Container>
      </div>
      </RouteGuard>
    )
  }

  if (!project) {
    return (
      <RouteGuard>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
        <Header
          logo={{ text: "CodeGuide AI", href: "/" }}
          actions={
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              返回仪表板
            </Button>
          }
        />
        
        <Container size="lg" className="py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
              项目不存在
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              请检查项目ID是否正确
            </p>
            <Button onClick={() => router.push('/dashboard')}>
              返回仪表板
            </Button>
          </div>
        </Container>
      </div>
      </RouteGuard>
    )
  }

  return (
    <RouteGuard>
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900">
      <Header
        logo={{ text: "CodeGuide AI", href: "/" }}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleExport('pdf')}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              导出PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              返回
            </Button>
          </div>
        }
      />

      <Container size="lg" className="py-8">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                  {project.name}
                </h1>
                <Badge variant={getStatusColor(project.status)} className="flex items-center gap-1">
                  {getStatusIcon(project.status)}
                  {getStatusText(project.status)}
                </Badge>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 text-lg mb-4">
                {project.description}
              </p>
              <div className="flex items-center gap-6 text-sm text-neutral-500 dark:text-neutral-400">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  创建于 {new Date(project.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  更新于 {new Date(project.updated_at).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Code className="w-4 h-4" />
                  {project.type === 'web' ? 'Web应用' : project.type}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-6">
              <Button
                variant="outline"
                onClick={() => toast({ title: "分享功能", description: "分享功能开发中..." })}
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                分享
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/project/${project.id}/edit`)}
                className="flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                编辑
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="flex items-center gap-2 text-error-600 hover:text-error-700"
              >
                <Trash2 className="w-4 h-4" />
                删除
              </Button>
            </div>
          </div>
        </div>

        {/* Project Details Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="features">功能清单</TabsTrigger>
            <TabsTrigger value="techstack">技术栈</TabsTrigger>
            <TabsTrigger value="clarification">需求澄清</TabsTrigger>
            <TabsTrigger value="prd">PRD文档</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    项目信息
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      项目类型
                    </label>
                    <p className="text-neutral-900 dark:text-neutral-100">
                      {project.type === 'web' ? 'Web应用' : project.type}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      AI模型
                    </label>
                    <p className="text-neutral-900 dark:text-neutral-100">
                      {project.ai_model || '未配置'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      AI工具
                    </label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.ai_tools?.map((tool, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tool}
                        </Badge>
                      )) || <span className="text-neutral-500">未配置</span>}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    进度总结
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      功能数量
                    </label>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      {project.feature_list?.length || 0}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      澄清问题
                    </label>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      {project.clarification_questions?.length || 0}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      技术栈
                    </label>
                    <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                      {project.tech_stack?.length || 0}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tech Stack Overview */}
            {project.tech_stack && project.tech_stack.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="w-5 h-5" />
                    技术栈概览
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack.map((tech, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            {project.feature_list && project.feature_list.length > 0 ? (
              <div className="space-y-4">
                {project.feature_list.map((feature) => (
                  <Card key={feature.id} variant="bordered">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                          {feature.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Badge variant={getPriorityColor(feature.priority)}>
                            {feature.priority === 'high' ? '高优先级' : 
                             feature.priority === 'medium' ? '中优先级' : '低优先级'}
                          </Badge>
                          <Badge variant={getComplexityColor(feature.complexity)}>
                            {feature.complexity === 'complex' ? '复杂' : 
                             feature.complexity === 'medium' ? '中等' : '简单'}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-400 mb-3">
                        {feature.description}
                      </p>
                      <div className="text-sm text-neutral-500 dark:text-neutral-400">
                        预估开发时间：{feature.estimatedDays} 天
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <Target className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                    暂无功能清单
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    功能清单将在项目规划阶段生成
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="techstack" className="space-y-4">
            {project.tech_stack && project.tech_stack.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>推荐技术栈</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {project.tech_stack.map((tech, index) => (
                      <div key={index} className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-3">
                        <h5 className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                          {tech}
                        </h5>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {/* Mock descriptions */}
                          {tech.includes('Next.js') && '现代化React框架，支持SSR/SSG'}
                          {tech.includes('React') && '声明式UI库，组件化开发'}
                          {tech.includes('TailwindCSS') && '实用程序优先的CSS框架'}
                          {tech.includes('Supabase') && '开源Firebase替代品，后端即服务'}
                          {tech.includes('OpenRouter') && '统一AI模型API接口'}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <Code className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                    暂无技术栈推荐
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    技术栈推荐将在项目规划阶段生成
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="clarification" className="space-y-4">
            {project.clarification_questions && project.clarification_questions.length > 0 ? (
              <div className="space-y-4">
                {project.clarification_questions.map((qa) => (
                  <Card key={qa.id} variant="bordered">
                    <CardContent className="p-4">
                      <div className="mb-3">
                        <Badge variant="secondary" className="mb-2">
                          {qa.category}
                        </Badge>
                        <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                          {qa.question}
                        </h4>
                      </div>
                      <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-3">
                        <p className="text-neutral-600 dark:text-neutral-400">
                          {qa.answer}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <FileText className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                    暂无澄清问题
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    澄清问题将在需求澄清阶段生成
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="prd" className="space-y-4">
            {project.prd_document ? (
              <Card>
                <CardHeader>
                  <CardTitle>产品需求文档 (PRD)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">项目概述</h4>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      {project.prd_document.overview}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">项目目标</h4>
                    <ul className="space-y-1">
                      {project.prd_document.objectives?.map((objective: string, index: number) => (
                        <li key={index} className="text-neutral-600 dark:text-neutral-400">
                          • {objective}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">目标用户</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.prd_document.targetUsers?.map((user: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          <User className="w-3 h-3 mr-1" />
                          {user}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <FileText className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                    暂无PRD文档
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    PRD文档将在项目规划阶段生成
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </Container>
    </div>
    </RouteGuard>
  )
}








