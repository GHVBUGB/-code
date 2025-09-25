'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useProjectStore, useSettingsStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/ui/header"
import { Container } from "@/components/ui/container"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { 
  ArrowLeft, 
  ArrowRight, 
  Lightbulb,
  MessageSquare,
  Target,
  Users,
  Zap,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Bot,
  SkipForward
} from "lucide-react"
import { RouteGuard } from "@/components/auth/route-guard"
import { toast } from "sonner"
import { APIKeyHelper } from "@/lib/utils/api-key-helper"

interface ClarificationQuestion {
  id: string
  question: string
  placeholder: string
  answer: string
  required: boolean
}

export default function ClarificationPage() {
  const { projectData, updateProjectData } = useProjectStore()
  const { selectedModel } = useSettingsStore()
  const router = useRouter()
  
  const [questions, setQuestions] = useState<ClarificationQuestion[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [hasGenerated, setHasGenerated] = useState(false)
  const [aiHelpLoading, setAiHelpLoading] = useState<string | null>(null) // 记录正在获取AI帮助的问题ID

  // 从store中恢复之前的答案
  useEffect(() => {
    if (projectData.clarificationAnswers && hasGenerated) {
      const answers = projectData.clarificationAnswers
      setQuestions(prev => prev.map(q => ({
        ...q,
        answer: (answers as any)[q.id] || ''
      })))
    }
  }, [projectData.clarificationAnswers, hasGenerated])

  // 页面加载时自动生成问题
  useEffect(() => {
    if (projectData.name && projectData.description && !hasGenerated) {
      generateQuestions()
    }
  }, [projectData.name, projectData.description, hasGenerated])

  const generateQuestions = async () => {
    if (!projectData.name || !projectData.description) {
      toast.error("请先完成项目基本信息填写")
      return
    }

    const apiKey = APIKeyHelper.getAPIKey()
    if (!apiKey) {
      toast.error("请先在设置页面配置OpenRouter API密钥")
      return
    }

    setIsGenerating(true)
    
    try {
      const response = await fetch('/api/openrouter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: '/chat/completions',
          method: 'POST',
          apiKey: apiKey,
          data: {
            model: 'anthropic/claude-3.5-sonnet',
            messages: [{
              role: 'user',
              content: `基于以下项目信息，生成5-6个具体的澄清问题，帮助更好地理解项目需求：

项目名称：${projectData.name}
项目描述：${projectData.description}
项目类型：${projectData.type}

请严格按照以下JSON格式返回，不要添加任何其他文字说明：
[
  {
    "id": "question1",
    "question": "具体问题内容",
    "placeholder": "回答示例或提示",
    "required": true
  },
  {
    "id": "question2", 
    "question": "具体问题内容",
    "placeholder": "回答示例或提示",
    "required": false
  }
]

要求：
1. 问题要针对该项目的具体情况
2. 涵盖目标用户、核心功能、技术要求、时间预算等方面
3. 问题要具体、实用，避免泛泛而谈
4. 至少2个问题标记为required: true
5. 严格返回JSON数组格式，不要包含markdown代码块标记
6. required字段必须是布尔值true或false，不要使用字符串`
            }],
            max_tokens: 1000,
            temperature: 0.7
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content.trim()
        console.log('AI返回的原始内容:', content)
        
        try {
          // 尝试提取JSON部分
          let jsonContent = content
          
          // 如果内容包含代码块标记，提取其中的JSON
          if (content.includes('```json')) {
            const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/)
            if (jsonMatch) {
              jsonContent = jsonMatch[1].trim()
            }
          } else if (content.includes('```')) {
            const jsonMatch = content.match(/```\s*([\s\S]*?)\s*```/)
            if (jsonMatch) {
              jsonContent = jsonMatch[1].trim()
            }
          }
          
          // 如果内容不是以[开头，尝试找到JSON数组的开始位置
          if (!jsonContent.trim().startsWith('[')) {
            const arrayMatch = jsonContent.match(/\[[\s\S]*\]/)
            if (arrayMatch) {
              jsonContent = arrayMatch[0]
            }
          }
          
          console.log('提取的JSON内容:', jsonContent)
          
          // 尝试解析JSON
          const generatedQuestions = JSON.parse(jsonContent)
          
          if (Array.isArray(generatedQuestions)) {
            const formattedQuestions = generatedQuestions.map((q, index) => ({
              id: q.id || `question${index + 1}`,
              question: q.question || '',
              placeholder: q.placeholder || '',
              answer: '',
              required: q.required || false
            }))
            
            setQuestions(formattedQuestions)
            setHasGenerated(true)
            toast.success("智能问题生成完成")
          } else {
            throw new Error('返回格式不正确')
          }
        } catch (parseError) {
          console.error('JSON解析失败:', parseError)
          console.error('原始内容:', content)
          toast.error("AI返回格式异常，使用默认问题")
          // 如果AI返回的不是标准JSON，使用默认问题
          setDefaultQuestions()
        }
      } else {
        throw new Error('AI响应格式异常')
      }
    } catch (error) {
      console.error('生成问题失败:', error)
      toast.error("问题生成失败，使用默认问题")
      setDefaultQuestions()
    } finally {
      setIsGenerating(false)
    }
  }

  const setDefaultQuestions = () => {
    const defaultQuestions: ClarificationQuestion[] = [
      {
        id: "targetAudience",
        question: "项目的目标用户群体是谁？",
        placeholder: "例如：企业用户、个人消费者、开发者等",
        answer: "",
        required: true
      },
      {
        id: "keyFeatures",
        question: "项目的核心功能有哪些？",
        placeholder: "请列出3-5个最重要的功能特性",
        answer: "",
        required: true
      },
      {
        id: "technicalRequirements",
        question: "有什么特殊的技术要求吗？",
        placeholder: "例如：性能要求、兼容性、安全性等",
        answer: "",
        required: false
      },
      {
        id: "timeline",
        question: "项目的预期时间线是什么？",
        placeholder: "例如：3个月内完成MVP版本",
        answer: "",
        required: false
      },
      {
        id: "budget",
        question: "项目的预算范围是多少？",
        placeholder: "例如：10-50万元，或者人力成本预估",
        answer: "",
        required: false
      }
    ]
    
    setQuestions(defaultQuestions)
    setHasGenerated(true)
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId ? { ...q, answer } : q
    ))
  }

  // AI帮答功能
  const handleAIHelp = async (questionId: string) => {
    const question = questions.find(q => q.id === questionId)
    if (!question) return

    // 检查API密钥
    const apiKey = APIKeyHelper.getAPIKey()
    if (!apiKey) {
      toast.error("请先在设置页面配置OpenRouter API密钥")
      return
    }

    // 检查API密钥有效性
    const keyStatus = APIKeyHelper.getAPIKeyStatus()
    if (!keyStatus.isValid) {
      toast.error(`API密钥无效: ${keyStatus.error}`)
      return
    }

    setAiHelpLoading(questionId)
    
    try {
      const response = await fetch('/api/openrouter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          endpoint: '/chat/completions',
          method: 'POST',
          apiKey: apiKey,
          data: {
            model: 'anthropic/claude-3.5-sonnet',
            messages: [{
              role: 'user',
              content: `基于以下项目信息，为这个问题提供一个具体、实用的建议回答：

项目名称：${projectData.name}
项目描述：${projectData.description}
项目类型：${projectData.type}

问题：${question.question}

请提供一个针对该项目的具体建议回答，要求：
1. 结合项目的实际情况
2. 回答要具体、可操作
3. 长度适中，不要过于冗长
4. 直接给出建议内容，不要添加额外的解释`
            }],
            max_tokens: 500,
            temperature: 0.7
          }
        })
      })

      if (response.ok) {
        const data = await response.json()
        
        if (data.choices && data.choices[0] && data.choices[0].message) {
          const aiSuggestion = data.choices[0].message.content.trim()
          
          // 将AI建议填入对应的问题答案中
          handleAnswerChange(questionId, aiSuggestion)
          toast.success("AI建议已生成")
        } else {
          toast.error("AI响应格式错误，请重试")
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        
        // 检查是否是余额不足的错误
        if (response.status === 402 || 
            (errorData.error && errorData.error.message && 
             errorData.error.message.toLowerCase().includes('insufficient'))) {
          toast.error("账户余额不足，请充值后重试")
        } else if (response.status === 401) {
          toast.error("API密钥无效或账户余额不足")
        } else {
          toast.error(`AI服务暂时不可用 (${response.status})`)
        }
      }
    } catch (error) {
      console.error('AI帮答错误:', error)
      toast.error("网络错误，请检查网络连接")
    } finally {
      setAiHelpLoading(null)
    }
  }

  // 跳过功能
  const handleSkip = (questionId: string) => {
    const question = questions.find(q => q.id === questionId)
    if (question?.required) {
      toast.error("必填问题不能跳过")
      return
    }
    
    // 将答案设置为空并标记为已跳过
    handleAnswerChange(questionId, "")
    toast.success("已跳过该问题")
  }

  const handleBack = () => {
    router.push("/project/ai-tools")
  }

  const handleNext = () => {
    // 检查必填问题是否已回答
    const requiredQuestions = questions.filter(q => q.required)
    const unansweredRequired = requiredQuestions.filter(q => !q.answer.trim())
    
    if (unansweredRequired.length > 0) {
      toast.error(`请回答必填问题：${unansweredRequired.map(q => q.question).join('、')}`)
      return
    }

    // 保存答案到store
    const answers: any = {}
    questions.forEach(q => {
      answers[q.id] = q.answer
    })
    
    console.log('保存澄清问题答案:', answers)
    console.log('保存前的项目数据:', projectData)
    
    // 确保所有必要的数据都存在
    const updatedData = {
      ...projectData,
      clarificationAnswers: answers
    }
    
    console.log('要保存的完整数据:', updatedData)
    
    updateProjectData({
      clarificationAnswers: answers
    })
    
    // 等待数据保存完成
    setTimeout(() => {
      console.log('澄清数据保存完成，跳转到预览页面')
      toast.success("需求澄清已保存")
      router.push("/project/preview")
    }, 200)
  }

  // 计算完成度
  const getCompletionRate = () => {
    if (questions.length === 0) return 0
    const answeredQuestions = questions.filter(q => q.answer.trim().length > 0)
    return Math.round((answeredQuestions.length / questions.length) * 100)
  }

  const completionRate = getCompletionRate()
  const requiredAnswered = questions.filter(q => q.required).every(q => q.answer.trim())

  return (
    <RouteGuard>
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
        <Header />
        
        <Container className="py-8">
          {/* 页面标题 */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">需求澄清</h1>
                <p className="text-neutral-400">
                  基于您的项目信息，我们为您生成了针对性的澄清问题
                </p>
              </div>
              <Badge variant="outline" className="text-sm">
                步骤 3/5
              </Badge>
            </div>
            
            {/* 项目信息摘要 */}
            <Card className="bg-neutral-800/50 border-neutral-700">
              <CardContent className="p-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{projectData.name}</h3>
                    <p className="text-sm text-neutral-400 line-clamp-2">{projectData.description}</p>
                    {projectData.type && (
                      <Badge variant="secondary" className="mt-2 text-xs">
                        {projectData.type}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 生成状态 */}
          {isGenerating && (
            <Card className="mb-6 bg-blue-500/10 border-blue-500/30">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <RefreshCw className="w-5 h-5 text-blue-400 animate-spin" />
                  <div>
                    <p className="text-blue-400 font-medium">AI正在分析您的项目...</p>
                    <p className="text-sm text-blue-300/70">正在生成针对性的澄清问题</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 完成度指示器 */}
          {questions.length > 0 && (
            <Card className="mb-6 bg-neutral-800/50 border-neutral-700">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-neutral-400">完成进度</span>
                  <span className="text-sm font-medium text-white">{completionRate}%</span>
                </div>
                <div className="w-full bg-neutral-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* 问题列表 */}
          {questions.length > 0 && (
            <div className="space-y-6 mb-8">
              {questions.map((question, index) => (
                <Card key={question.id} className="bg-neutral-800/50 border-neutral-700">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <MessageSquare className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg text-white mb-1">
                            {question.question}
                          </CardTitle>
                          {question.required && (
                            <Badge variant="destructive" className="text-xs">
                              必填
                            </Badge>
                          )}
                        </div>
                      </div>
                      <span className="text-sm text-neutral-500">
                        {index + 1}/{questions.length}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Textarea
                      placeholder={question.placeholder}
                      value={question.answer}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      className="min-h-[100px] bg-neutral-900/50 border-neutral-600 text-white placeholder:text-neutral-500"
                      rows={3}
                    />
                    
                    {/* AI帮答和跳过按钮 */}
                    <div className="flex items-center justify-end space-x-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAIHelp(question.id)}
                        disabled={aiHelpLoading === question.id}
                        className="flex items-center space-x-1 text-xs"
                      >
                        {aiHelpLoading === question.id ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <Bot className="w-3 h-3" />
                        )}
                        <span>{aiHelpLoading === question.id ? "生成中..." : "AI帮答"}</span>
                      </Button>
                      
                      {!question.required && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSkip(question.id)}
                          className="flex items-center space-x-1 text-xs text-neutral-400 hover:text-neutral-300"
                        >
                          <SkipForward className="w-3 h-3" />
                          <span>跳过</span>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* 重新生成按钮 */}
          {hasGenerated && (
            <div className="flex justify-center mb-8">
              <Button
                variant="outline"
                onClick={() => {
                  setHasGenerated(false)
                  generateQuestions()
                }}
                disabled={isGenerating}
                className="flex items-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>重新生成问题</span>
              </Button>
            </div>
          )}

          {/* 测试按钮 */}
          <div className="flex justify-center mb-8">
            <Button
              variant="secondary"
              onClick={() => {
                console.log('当前项目数据:', projectData)
                console.log('当前问题:', questions)
                // 直接跳转到预览页面进行测试
                router.push("/project/preview")
              }}
              className="flex items-center space-x-2"
            >
              <span>测试跳转到预览页面</span>
            </Button>
          </div>

          {/* 导航按钮 */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>上一步</span>
            </Button>

            <Button
              onClick={handleNext}
              disabled={!requiredAnswered || questions.length === 0}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <span>下一步</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Container>
      </div>
    </RouteGuard>
  )
}
