'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useProjectStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Box,
  Download, 
  Calendar,
  Target,
  Clock,
  FileText
} from "lucide-react"
import { RouteGuard } from "@/components/auth/route-guard"
import Link from "next/link"

export default function PlanningPage() {
  const { projectData } = useProjectStore()
  const router = useRouter()

  const steps = [
    { id: 1, name: "项目详情", status: "completed" },
    { id: 2, name: "选择AI工具", status: "completed" },
    { id: 3, name: "需求澄清", status: "completed" },
    { id: 4, name: "项目计划", status: "current" },
    { id: 5, name: "创建文档", status: "upcoming" }
  ]

  const projectPhases = [
    {
      id: "phase-1",
      name: "需求分析",
      duration: "1-2周",
      description: "深入分析项目需求，确定功能范围",
      tasks: ["需求调研", "用户故事编写", "功能优先级排序"],
      status: "completed"
    },
    {
      id: "phase-2", 
      name: "技术选型",
      duration: "3-5天",
      description: "选择合适的技术栈和开发工具",
      tasks: ["技术栈评估", "架构设计", "开发环境搭建"],
      status: "completed"
    },
    {
      id: "phase-3",
      name: "原型设计",
      duration: "1-2周", 
      description: "创建项目原型和UI设计",
      tasks: ["线框图设计", "UI设计", "交互原型"],
      status: "current"
    },
    {
      id: "phase-4",
      name: "开发实现",
      duration: "4-8周",
      description: "核心功能开发和实现",
      tasks: ["后端开发", "前端开发", "API集成"],
      status: "upcoming"
    },
    {
      id: "phase-5",
      name: "测试部署",
      duration: "1-2周",
      description: "测试、优化和部署上线",
      tasks: ["功能测试", "性能优化", "生产部署"],
      status: "upcoming"
    }
  ]

  const handleNext = () => {
    router.push("/project/create-document")
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
            <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">项目计划</h1>
              <p className="text-muted-foreground">查看生成的项目计划和技术方案</p>
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
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.status === 'current' ? 'bg-primary-500 text-white' :
                    step.status === 'completed' ? 'bg-success-500 text-white' : 'bg-muted text-muted-foreground'
                  }`}>
                    {step.status === 'completed' ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span className="text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <span className="font-medium">{step.name}</span>
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
          <div className="max-w-6xl mx-auto space-y-8">
            {/* 项目阶段 */}
            <div>
              <h2 className="text-xl font-semibold mb-4">项目阶段</h2>
              <div className="grid gap-6">
                {projectPhases.map((phase, index) => (
                  <Card key={phase.id} className="relative">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            phase.status === 'completed' ? 'bg-success-500 text-white' :
                            phase.status === 'current' ? 'bg-primary-500 text-white' : 'bg-muted text-muted-foreground'
                          }`}>
                            {phase.status === 'completed' ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              <span className="font-medium">{index + 1}</span>
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{phase.name}</CardTitle>
                            <CardDescription className="flex items-center space-x-2">
                              <Clock className="w-4 h-4" />
                              <span>{phase.duration}</span>
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant={
                          phase.status === 'completed' ? 'default' :
                          phase.status === 'current' ? 'secondary' : 'outline'
                        }>
                          {phase.status === 'completed' ? '已完成' :
                           phase.status === 'current' ? '进行中' : '待开始'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{phase.description}</p>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">主要任务：</h4>
                        <ul className="space-y-1">
                          {phase.tasks.map((task, taskIndex) => (
                            <li key={taskIndex} className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <div className="w-2 h-2 bg-primary-500 rounded-full" />
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* 文档下载区域 */}
            <div>
              <h2 className="text-xl font-semibold mb-4">项目文档</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">产品需求文档</CardTitle>
                        <CardDescription>详细的产品功能需求说明</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="default">已准备</Badge>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        下载
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-500/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">技术规格文档</CardTitle>
                        <CardDescription>技术架构和实现细节</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="default">已准备</Badge>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        下载
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                上一步
              </Button>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  查看时间线
                </Button>
                <Button onClick={handleNext}>
                  下一步
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  )
}


