'use client'

import { useState } from "react"
import { aiAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestAPIPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testAPI = async () => {
    setLoading(true)
    setResult('')
    
    try {
      const testProjectData = {
        name: '测试项目',
        description: '这是一个测试项目',
        type: 'web-app',
        selectedModel: 'anthropic/claude-3.5-sonnet',
        selectedTools: ['cursor-ai'],
        selectedTechStack: ['javascript', 'react'],
        clarificationAnswers: {
          question1: '企业用户',
          question2: '用户管理、数据统计',
          question3: '高性能、安全'
        }
      }

      console.log('测试API调用...')
      const response = await aiAPI.generateProjectDocuments(testProjectData, ['prd'])
      
      if (response.success) {
        setResult(`API调用成功！\n\n返回数据：\n${JSON.stringify(response.data, null, 2)}`)
      } else {
        setResult(`API调用失败：\n${response.error}`)
      }
    } catch (error) {
      setResult(`API调用异常：\n${error instanceof Error ? error.message : '未知错误'}`)
    } finally {
      setLoading(false)
    }
  }

  const testDocumentTypes = async () => {
    setLoading(true)
    setResult('')
    
    try {
      const testProjectData = {
        name: '测试项目',
        description: '这是一个测试项目',
        type: 'web-app'
      }

      // 测试所有文档类型的标题和描述
      const documentTypes = [
        'prd', 'tech-design', 'database-design', 'api-spec', 'user-manual', 'deployment-guide',
        'requirements-design', 'program-architecture', 'development-plan', 'development-rules',
        'role-development-rules', 'development-review', 'implementation-logic', 'submodule-architecture',
        'architecture-audit', 'code-audit', 'testing-document'
      ]

      let resultText = '文档类型测试结果：\n\n'
      
      for (const docType of documentTypes) {
        const title = aiAPI.getDocumentTitle(docType)
        const description = aiAPI.getDocumentDescription(docType)
        resultText += `${docType}: ${title}\n描述: ${description}\n\n`
      }

      setResult(resultText)
    } catch (error) {
      setResult(`测试异常：\n${error instanceof Error ? error.message : '未知错误'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">API测试页面</h1>
        
        <div className="space-y-4 mb-6">
          <Button onClick={testAPI} disabled={loading}>
            {loading ? '测试中...' : '测试文档生成API'}
          </Button>
          <Button onClick={testDocumentTypes} disabled={loading} variant="outline">
            {loading ? '测试中...' : '测试文档类型'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>测试结果</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm whitespace-pre-wrap">
              {result || '点击按钮开始测试...'}
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
