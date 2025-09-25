'use client'

import { useProjectStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function TestDataFlowPage() {
  const { projectData, updateProjectData } = useProjectStore()
  const router = useRouter()

  const setTestData = () => {
    updateProjectData({
      name: '智能家庭健康监测系统',
      description: '# 智能家庭健康监测系统\n\n## 项目概述\n基于物联网与人工智能',
      type: 'web-app',
      selectedModel: 'openai/gpt-4o-mini',
      selectedModels: ['openai/gpt-4o-mini'],
      selectedTools: ['cursor-ai'],
      selectedTechStack: ['javascript', 'react'],
      clarificationAnswers: {
        question1: '建议支持以下设备类型和具体型号',
        question2: '企业用户',
        question3: '用户管理、数据统计',
        question4: '高性能、安全',
        question5: '3个月'
      },
      selectedDocuments: ['prd', 'tech-design', 'database-design', 'api-spec', 'user-manual', 'deployment-guide'],
      isGenerating: false,
      generationProgress: 0,
      generatedDocuments: []
    })
  }

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

  const testNavigation = () => {
    console.log('测试导航到文档预览页面')
    router.push("/project/preview")
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">数据流测试页面</h1>
        
        <div className="space-y-4 mb-6">
          <Button onClick={setTestData}>设置完整测试数据</Button>
          <Button onClick={clearData} variant="outline">清空数据</Button>
          <Button onClick={testNavigation} variant="secondary">
            测试导航到文档预览
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>当前项目数据状态</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">基本信息</h3>
                  <div className="space-y-1 text-sm">
                    <div>项目名称: {projectData.name || '未设置'}</div>
                    <div>项目类型: {projectData.type || '未设置'}</div>
                    <div>项目描述: {projectData.description ? '已设置' : '未设置'}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">选择状态</h3>
                  <div className="space-y-1 text-sm">
                    <div>AI模型: {projectData.selectedModels?.length || 0} 个</div>
                    <div>开发工具: {projectData.selectedTools?.length || 0} 个</div>
                    <div>技术栈: {projectData.selectedTechStack?.length || 0} 个</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">澄清问题</h3>
                <div className="text-sm">
                  已回答问题: {projectData.clarificationAnswers ? Object.keys(projectData.clarificationAnswers).length : 0} 个
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">文档选择</h3>
                <div className="text-sm">
                  已选择文档: {projectData.selectedDocuments?.length || 0} 个
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>数据完整性检查</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`flex items-center space-x-2 ${projectData.name ? 'text-green-600' : 'text-red-600'}`}>
                <span>✓</span>
                <span>项目名称: {projectData.name ? '完整' : '缺失'}</span>
              </div>
              <div className={`flex items-center space-x-2 ${projectData.description ? 'text-green-600' : 'text-red-600'}`}>
                <span>✓</span>
                <span>项目描述: {projectData.description ? '完整' : '缺失'}</span>
              </div>
              <div className={`flex items-center space-x-2 ${projectData.type ? 'text-green-600' : 'text-red-600'}`}>
                <span>✓</span>
                <span>项目类型: {projectData.type ? '完整' : '缺失'}</span>
              </div>
              <div className={`flex items-center space-x-2 ${projectData.clarificationAnswers && Object.keys(projectData.clarificationAnswers).length > 0 ? 'text-green-600' : 'text-red-600'}`}>
                <span>✓</span>
                <span>澄清问题: {projectData.clarificationAnswers && Object.keys(projectData.clarificationAnswers).length > 0 ? '完整' : '缺失'}</span>
              </div>
            </div>
            
            <div className="mt-4">
              <Button 
                onClick={() => {
                  const isComplete = projectData.name && projectData.description && projectData.type && projectData.clarificationAnswers && Object.keys(projectData.clarificationAnswers).length > 0
                  alert(isComplete ? '数据完整，可以进入文档预览' : '数据不完整，无法进入文档预览')
                }}
                variant="outline"
              >
                检查数据完整性
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
