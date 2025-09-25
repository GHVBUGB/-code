'use client'

import { useProjectStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function DebugPage() {
  const { projectData, updateProjectData } = useProjectStore()
  const router = useRouter()

  const clearData = () => {
    updateProjectData({
      name: '',
      description: '',
      type: '',
      selectedModel: '',
      selectedModels: [],
      selectedTools: [],
      selectedTechStack: [],
      clarificationAnswers: {},
      selectedDocuments: [],
      isGenerating: false,
      generationProgress: 0,
      generatedDocuments: []
    })
  }

  const setTestData = () => {
    updateProjectData({
      name: '测试项目',
      description: '这是一个测试项目',
      type: 'web应用',
      selectedModel: 'anthropic/claude-3.5-sonnet',
      selectedModels: ['anthropic/claude-3.5-sonnet'],
      selectedTools: ['cursor-ai'],
      selectedTechStack: ['javascript', 'react'],
      clarificationAnswers: {
        targetAudience: '企业用户',
        keyFeatures: '用户管理、数据统计',
        technicalRequirements: '高性能、安全',
        timeline: '3个月',
        budget: '50万'
      },
      selectedDocuments: [],
      isGenerating: false,
      generationProgress: 0,
      generatedDocuments: []
    })
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">项目数据调试页面</h1>
        
        <div className="space-y-4 mb-6">
          <Button onClick={setTestData}>设置测试数据</Button>
          <Button onClick={clearData} variant="outline">清空数据</Button>
          <Button onClick={() => router.push("/project/preview")} variant="secondary">
            测试进入文档预览
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>当前项目数据</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(projectData, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>数据完整性检查</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`flex items-center space-x-2 ${projectData.name ? 'text-green-600' : 'text-red-600'}`}>
                <span>项目名称:</span>
                <span>{projectData.name || '未设置'}</span>
              </div>
              <div className={`flex items-center space-x-2 ${projectData.description ? 'text-green-600' : 'text-red-600'}`}>
                <span>项目描述:</span>
                <span>{projectData.description || '未设置'}</span>
              </div>
              <div className={`flex items-center space-x-2 ${projectData.type ? 'text-green-600' : 'text-red-600'}`}>
                <span>项目类型:</span>
                <span>{projectData.type || '未设置'}</span>
              </div>
              <div className={`flex items-center space-x-2 ${projectData.clarificationAnswers && Object.keys(projectData.clarificationAnswers).length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                <span>澄清问题答案:</span>
                <span>{projectData.clarificationAnswers && Object.keys(projectData.clarificationAnswers).length > 0 ? `${Object.keys(projectData.clarificationAnswers).length} 个答案` : '未设置'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
