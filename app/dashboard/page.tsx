'use client'

import { useState, useEffect } from "react"
import { useAuthStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Cpu,
  Plus, 
  FileText, 
  Clock, 
  CheckCircle, 
  Trash2, 
  Eye, 
  Settings,
  Search,
  Zap,
  Folder,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Bot,
  Code,
  Palette,
  Box,
  ArrowRight
} from "lucide-react"
import Link from "next/link"
import { projectAPI } from "@/lib/api"
import { RouteGuard } from "@/components/auth/route-guard"

interface Project {
  id: string
  name: string
  description: string
  type: string
  status: 'draft' | 'completed' | 'archived'
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { user, logout } = useAuthStore()

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setIsLoading(true)
      const response = await projectAPI.getUserProjects()
      if (response.success && response.data && response.data.length > 0) {
        setProjects(response.data)
      } else {
        // fallback 示例数据
        setProjects([
          {
            id: 'demo-1',
            name: '示例项目 - 智能客服系统',
            description: '基于AI的客服系统，提升客服效率',
            type: 'web-app',
            status: 'draft',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          {
            id: 'demo-2',
            name: '示例项目 - 教育学习平台',
            description: '在线学习与测评平台',
            type: 'web-app',
            status: 'completed',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        ])
      }
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    if (confirm('确定要删除这个项目吗？此操作不可撤销。')) {
      try {
        await projectAPI.deleteProject(projectId)
        setProjects(prev => prev.filter(p => p.id !== projectId))
      } catch (error) {
        console.error('Failed to delete project:', error)
      }
    }
  }

  // 获取最近3个项目
  const recentProjects = projects.slice(0, 3)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success-500" />
      case 'draft':
        return <Clock className="w-4 h-4 text-warning-500" />
      case 'archived':
        return <FileText className="w-4 h-4 text-neutral-500" />
      default:
        return <Clock className="w-4 h-4 text-neutral-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return '已完成'
      case 'draft':
        return '草稿'
      case 'archived':
        return '已归档'
      default:
        return '未知'
    }
  }

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'web-app': 'Web应用',
      'mobile-app': '移动应用',
      'desktop-app': '桌面应用',
      'api-service': 'API服务',
      'data-analysis': '数据分析',
      'ai-ml': 'AI/ML',
      'blockchain': '区块链',
      'game': '游戏',
      'other': '其他'
    }
    return typeMap[type] || type
  }

  return (
    <RouteGuard>
      <div className="min-h-screen bg-background text-foreground flex">
        {/* 左侧导航栏 */}
        <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-card border-r border-border flex flex-col`}>
          {/* Logo区域 */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              {!sidebarCollapsed && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-semibold text-lg">CodeGuide</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-1"
              >
                {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* 主导航 */}
          <div className="flex-1 p-4 space-y-6">
            <div>
              <div className="space-y-1">
                <Link href="/dashboard" className="flex items-center space-x-3 p-2 rounded-lg bg-primary-500/10 text-primary-500">
                  <Cpu className="w-5 h-5" />
                  {!sidebarCollapsed && <span>仪表板</span>}
                </Link>
                <Link href="/project/create" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
                  <Plus className="w-5 h-5" />
                  {!sidebarCollapsed && <span>新建项目</span>}
                </Link>
                <Link href="/project/saved" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
                  <Folder className="w-5 h-5" />
                  {!sidebarCollapsed && <span>已保存项目</span>}
                </Link>
                <Link href="/dashboard" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
                  <Settings className="w-5 h-5" />
                  {!sidebarCollapsed && <span>技术支持</span>}
                </Link>
                <Link href="/user-center" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
                  <Settings className="w-5 h-5" />
                  {!sidebarCollapsed && <span>用户中心</span>}
                </Link>
              </div>
            </div>

            {/* 资源分组 */}
            <div>
              {!sidebarCollapsed && <div className="text-xs font-medium text-muted-foreground mb-2">资源</div>}
              <div className="space-y-1">
                <Link href="/project/templates" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
                  <BookOpen className="w-5 h-5" />
                  {!sidebarCollapsed && <span>项目框架</span>}
                </Link>
                <Link href="/project/templates" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
                  <FileText className="w-5 h-5" />
                  {!sidebarCollapsed && <span>需求模板</span>}
                </Link>
                <Link href="/dashboard" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
                  <Bot className="w-5 h-5" />
                  {!sidebarCollapsed && <span>Agents库</span>}
                </Link>
              </div>
            </div>

            {/* 工具分组 */}
            <div>
              {!sidebarCollapsed && <div className="text-xs font-medium text-muted-foreground mb-2">工具</div>}
              <div className="space-y-1">
                <Link href="/project/create" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
                  <Code className="w-5 h-5" />
                  {!sidebarCollapsed && <span>项目转文档</span>}
                  {!sidebarCollapsed && <Badge variant="secondary" className="ml-auto text-xs">新</Badge>}
                </Link>
                <Link href="/playground" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
                  <Palette className="w-5 h-5" />
                  {!sidebarCollapsed && <span>原型设计</span>}
                </Link>
              </div>
            </div>
          </div>

          {/* 底部用户信息 */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <span className="text-sm font-medium">2</span>
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1">
                  <div className="text-sm font-medium">2537652940@qq.c...</div>
                </div>
              )}
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* 主内容区域 */}
        <div className="flex-1 flex flex-col">
          {/* 顶部指标卡片 */}
          <div className="p-6 border-b border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                      <div className="text-2xl font-bold">8个</div>
                      <div className="text-sm text-muted-foreground">文档数量</div>
                      <div className="text-xs text-muted-foreground mt-1">所有项目的文档总数</div>
                  </div>
                    <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                      <div className="text-2xl font-bold">2.5万</div>
                      <div className="text-sm text-muted-foreground">节省Token</div>
                      <div className="text-xs text-muted-foreground mt-1">文档内容总量估算</div>
                  </div>
                    <Zap className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card variant="elevated">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                      <div className="text-2xl font-bold">4</div>
                      <div className="text-sm text-muted-foreground">已创建项目</div>
                      <div className="text-xs text-muted-foreground mt-1">已创建4个项目</div>
                  </div>
                    <Folder className="w-8 h-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            </div>
          </div>

          {/* 主内容 */}
          <div className="flex-1 p-6 space-y-8">
            {/* 快速操作 */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-5 h-5 text-primary-500" />
                <h2 className="text-xl font-semibold">快速操作</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6">快速访问常用功能</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/project/create">
                  <Card variant="elevated" className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Plus className="w-6 h-6 text-blue-500" />
                      </div>
                      <div className="font-medium">新建项目</div>
                      <div className="text-sm text-muted-foreground">创建新的项目</div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/project/create">
                  <Card variant="elevated" className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Code className="w-6 h-6 text-green-500" />
                    </div>
                      <div className="font-medium">项目转文档</div>
                      <div className="text-sm text-muted-foreground">从现有代码库创建</div>
                  </CardContent>
                </Card>
                </Link>
                <Link href="/playground">
                  <Card variant="elevated" className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Palette className="w-6 h-6 text-red-500" />
            </div>
                      <div className="font-medium">原型设计</div>
                      <div className="text-sm text-muted-foreground">一键生成界面原型</div>
                    </CardContent>
                  </Card>
                </Link>
                <Link href="/project/templates">
                  <Card variant="elevated" className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Box className="w-6 h-6 text-purple-500" />
                      </div>
                      <div className="font-medium">项目框架</div>
                      <div className="text-sm text-muted-foreground">项目启动模板</div>
                    </CardContent>
                  </Card>
                </Link>
                      </div>
                    </div>

            {/* 最近项目 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Folder className="w-5 h-5 text-primary-500" />
                  <h2 className="text-xl font-semibold">最近项目</h2>
                </div>
                <Button variant="outline" size="sm">
                  查看全部
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mb-6">您最近更新的3个项目</p>
                    <div className="space-y-4">
                {recentProjects.map((project) => (
                  <Card key={project.id} variant="elevated" className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <Folder className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="font-medium">{project.name}</div>
                            <div className="text-sm text-muted-foreground">{project.description}</div>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline" className="text-xs">代码项目</Badge>
                              <Badge variant="secondary" className="text-xs">
                          {getStatusLabel(project.status)}
                        </Badge>
                      </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              创建于{new Date(project.createdAt).toLocaleDateString()} • 
                              更新于{new Date(project.updatedAt).toLocaleDateString()} • 
                              活跃
                        </div>
                      </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            </div>
              </div>
            </div>
    </div>
    </RouteGuard>
  )
}
