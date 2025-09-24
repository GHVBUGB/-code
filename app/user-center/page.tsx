'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { useAuthStore, useSettingsStore } from '@/lib/store'
import { AI_MODELS } from '@/lib/ai/openrouter'
import { RouteGuard } from '@/components/auth/route-guard'
import { 
  Cpu,
  Plus, 
  FileText, 
  Settings,
  Folder,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Bot,
  Code,
  Palette,
  User,
  Mail,
  Calendar,
  Shield
} from 'lucide-react'

export default function UserCenterPage() {
  const { user, logout } = useAuthStore()
  const { selectedModel, setSelectedModel } = useSettingsStore()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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
                <Link href="/dashboard" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground">
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
                <Link href="/user-center" className="flex items-center space-x-3 p-2 rounded-lg bg-primary-500/10 text-primary-500">
                  <User className="w-5 h-5" />
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
          <div className="p-6">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">用户中心</h1>
              <p className="text-muted-foreground">管理个人信息与 API 设置</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>个人信息</span>
                  </CardTitle>
                  <CardDescription>查看当前登录信息</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">用户名</div>
                        <div className="font-medium">{user?.username || '未登录'}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">邮箱</div>
                        <div className="font-medium">{user?.email || '未登录'}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">注册时间</div>
                        <div className="font-medium">2024年1月</div>
                      </div>
                    </div>
                    <div className="pt-4 flex gap-2">
                      <Link href="/settings/api">
                        <Button variant="outline" className="flex items-center space-x-2">
                          <Shield className="w-4 h-4" />
                          <span>API 设置</span>
                        </Button>
                      </Link>
                      <Button variant="ghost" onClick={() => logout()}>退出登录</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>我的偏好</CardTitle>
                  <CardDescription>即将开放更多个性化配置</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">主题、语言、通知等偏好设置。</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">深色模式</span>
                        <Badge variant="secondary">已启用</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">语言</span>
                        <Badge variant="outline">中文</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">通知</span>
                        <Badge variant="outline">已关闭</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>AI 模型选择</CardTitle>
                  <CardDescription>选择用于文档生成与提示词优化的默认模型</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <select
                      className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm"
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                    >
                      {Object.entries(AI_MODELS).map(([key, m]) => (
                        <option key={key} value={key}>{m.provider} — {m.name}</option>
                      ))}
                    </select>
                    <div className="text-xs text-muted-foreground">
                      当前模型：{AI_MODELS[selectedModel]?.provider} · {AI_MODELS[selectedModel]?.name}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  )
}










