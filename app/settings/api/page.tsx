'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/ui/header'
import { Container } from '@/components/ui/container'
import { useToast } from '@/hooks/use-toast'
import { apiKeyAPI, AI_MODELS } from '@/lib/api'
import { APIKeyHelper } from '@/lib/utils/api-key-helper'
import { 
  Key, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  Loader2,
  AlertCircle,
  Settings,
  ExternalLink,
  Bug
} from 'lucide-react'

import { RouteGuard } from "@/components/auth/route-guard"

export default function APISettingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [savedKeys, setSavedKeys] = useState<any[]>([])
  const [showDiagnostics, setShowDiagnostics] = useState(false)

  useEffect(() => {
    loadSavedKeys()
    
    // 添加调试信息
    console.log('=== API Settings Page Debug ===');
    console.log('localStorage key:', localStorage.getItem('openrouter-api-key') ? 'Found' : 'Not found');
    console.log('process.env.NEXT_PUBLIC_OPENROUTER_API_KEY:', process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ? 'Found' : 'Not found');
    
    // Load existing API key if available
    const existingKey = localStorage.getItem('openrouter-api-key')
    if (existingKey) {
      console.log('Found existing key in localStorage');
      setApiKey(existingKey)
      setIsValid(true)
    }
    
    // 检查当前API密钥状态
    const status = APIKeyHelper.getAPIKeyStatus()
    console.log('API Key Status:', status);
    
    // 如果没有有效的API密钥，显示诊断信息
    if (!status.hasKey || !status.isValid) {
      console.log('Showing diagnostics because:', { hasKey: status.hasKey, isValid: status.isValid });
      setShowDiagnostics(true)
    } else {
      console.log('API key is valid, hiding diagnostics');
      setShowDiagnostics(false)
      // 如果有有效的API密钥但输入框为空，设置输入框的值
      if (!apiKey && status.keyPreview) {
        const retrievedKey = APIKeyHelper.getAPIKey();
        if (retrievedKey) {
          setApiKey(retrievedKey);
          setIsValid(true);
        }
      }
    }
  }, [])

  const loadSavedKeys = async () => {
    try {
      const result = await apiKeyAPI.getAPIKeys()
      if (result.success) {
        setSavedKeys(result.data || [])
      }
    } catch (error) {
      console.error('Failed to load API keys:', error)
    }
  }

  const validateApiKey = async () => {
    if (!apiKey.trim()) {
      setIsValid(null)
      return
    }

    // 先检查格式
    if (!apiKey.startsWith('sk-or-')) {
      setIsValid(false)
      toast({
        title: "API密钥格式错误",
        description: "OpenRouter API密钥应以'sk-or-'开头",
        variant: "destructive"
      })
      return
    }

    setIsValidating(true)
    try {
      // 使用新的测试方法
      const testResult = await APIKeyHelper.testAPIKey(apiKey)
      setIsValid(testResult.success)
      
      if (!testResult.success) {
        toast({
          title: "API密钥验证失败",
          description: testResult.error || "请检查您的API密钥是否正确",
          variant: "destructive"
        })
      } else {
        toast({
          title: "API密钥验证成功",
          description: "您的API密钥有效，可以正常使用AI功能",
          variant: "default"
        })
      }
    } catch (error) {
      setIsValid(false)
      toast({
        title: "验证失败",
        description: "网络错误，请稍后重试",
        variant: "destructive"
      })
    } finally {
      setIsValidating(false)
    }
  }

  const saveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "请输入API密钥",
        variant: "destructive"
      })
      return
    }

    if (isValid === false) {
      toast({
        title: "请先验证API密钥",
        variant: "destructive"
      })
      return
    }

    setIsSaving(true)
    try {
      const result = await apiKeyAPI.saveAPIKey('openrouter', apiKey, 'OpenRouter API Key')
      
      if (result.success) {
        toast({
          title: "API密钥保存成功",
          description: "您现在可以使用AI功能了"
        })
        loadSavedKeys()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "保存失败",
        description: error instanceof Error ? error.message : "未知错误",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const removeApiKey = () => {
    localStorage.removeItem('openrouter-api-key')
    localStorage.removeItem('openrouter-api-key-name')
    setApiKey('')
    setIsValid(null)
    loadSavedKeys()
    toast({
      title: "API密钥已删除",
      description: "您需要重新配置才能使用AI功能"
    })
  }

  const getValidationIcon = () => {
    if (isValidating) {
      return <Loader2 className="w-4 h-4 animate-spin text-neutral-500" />
    }
    if (isValid === true) {
      return <Check className="w-4 h-4 text-success-500" />
    }
    if (isValid === false) {
      return <X className="w-4 h-4 text-error-500" />
    }
    return null
  }

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

      <Container size="md" className="py-8">
      <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-8 h-8 text-primary-500" />
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                API设置
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                配置您的AI服务API密钥
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* 诊断信息 */}
          {showDiagnostics && (
            <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                  <AlertCircle className="w-5 h-5" />
                  API密钥配置诊断
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  <p className="font-medium mb-2">当前状态：</p>
                  <ul className="list-disc list-inside space-y-1">
                    {(() => {
                      const status = APIKeyHelper.getAPIKeyStatus()
                      if (!status.hasKey) {
                        return <li>未找到API密钥</li>
                      } else if (!status.isValid) {
                        return <li>API密钥格式无效</li>
                      } else {
                        return <li>API密钥已配置</li>
                      }
                    })()}
                  </ul>
            </div>

                <div className="text-sm text-amber-700 dark:text-amber-300">
                  <p className="font-medium mb-2">配置步骤：</p>
                  <ol className="list-decimal list-inside space-y-1">
                    {APIKeyHelper.getSetupInstructions().map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open('https://openrouter.ai/', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    访问 OpenRouter
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push('/settings/api/debug')}
                  >
                    <Bug className="w-4 h-4 mr-2" />
                    诊断工具
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowDiagnostics(false)}
                  >
                    隐藏诊断
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* OpenRouter API Key Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                OpenRouter API密钥
              </CardTitle>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                配置OpenRouter API密钥以使用多种AI模型
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-key">API密钥</Label>
                <div className="relative">
                  <Input
                    id="api-key"
                    type={showApiKey ? "text" : "password"}
                    placeholder="sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxx"
                    value={apiKey}
                    onChange={(e) => {
                      setApiKey(e.target.value)
                      setIsValid(null)
                    }}
                    onBlur={validateApiKey}
                    className="pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    {getValidationIcon()}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="h-8 w-8 p-0"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                {isValid === true && (
                  <p className="text-sm text-success-600 dark:text-success-400">
                    ✓ API密钥验证成功
                  </p>
                )}
                {isValid === false && (
                  <p className="text-sm text-error-600 dark:text-error-400">
                    ✗ API密钥验证失败
                  </p>
                )}
            </div>

                <div className="flex items-center gap-2">
                <Button 
                  onClick={saveApiKey}
                  disabled={!apiKey.trim() || isValidating || isSaving}
                  className="flex items-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  保存密钥
              </Button>
              
                {savedKeys.length > 0 && (
              <Button 
                    variant="outline"
                    onClick={removeApiKey}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    删除密钥
                  </Button>
                )}
              
              <Button 
                  variant="ghost"
                  onClick={() => window.open('https://openrouter.ai/keys', '_blank')}
                  className="flex items-center gap-2"
                >
                  获取API密钥
                  <ExternalLink className="w-4 h-4" />
              </Button>
            </div>

              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                      如何获取OpenRouter API密钥：
                    </p>
                    <ol className="text-neutral-600 dark:text-neutral-400 space-y-1 list-decimal list-inside">
                      <li>访问 <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">OpenRouter.ai</a></li>
                      <li>注册账号并登录</li>
                      <li>在控制台中创建API密钥</li>
                      <li>复制密钥并粘贴到上方输入框</li>
                    </ol>
                  </div>
                </div>
            </div>
          </CardContent>
        </Card>

          {/* Available Models */}
        <Card>
          <CardHeader>
              <CardTitle>可用AI模型</CardTitle>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                配置API密钥后可使用以下AI模型
              </p>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(AI_MODELS).map(([key, modelId]) => {
                  // 从模型ID中提取提供商和模型名称
                  const [provider, ...modelParts] = modelId.split('/')
                  const modelName = modelParts.join('/')
                  
                  return (
                    <div key={key} className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                          {modelName}
                        </h4>
                        <Badge variant="secondary">
                          {provider}
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                        {modelId}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                        <span>模型ID: {modelId}</span>
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>

          {/* Current API Keys */}
          {savedKeys.length > 0 && (
        <Card>
          <CardHeader>
                <CardTitle>当前配置</CardTitle>
          </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {savedKeys.map((key) => (
                    <div key={key.id} className="flex items-center justify-between p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                      <div>
                        <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                          {key.name}
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {key.provider} • 创建于 {new Date(key.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={key.isActive ? "success" : "secondary"}>
                        {key.isActive ? "已激活" : "未激活"}
                      </Badge>
                    </div>
                  ))}
                </div>
          </CardContent>
        </Card>
          )}
      </div>
      </Container>
    </div>
    </RouteGuard>
  )
}









