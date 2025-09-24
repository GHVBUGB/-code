'use client'

import { Search, Star, Lightbulb, Zap, Target, FileText, ArrowRight, Brain, Cpu, Code } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Container } from "@/components/ui/container"
import { Header } from "@/components/ui/header"
import { useAuthStore } from "@/lib/store"
import Link from "next/link"

export default function HomePage() {
  const { isAuthenticated } = useAuthStore()
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary-500/10 via-transparent to-accent-500/10" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-1/4">
          <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
        </div>
        <div className="absolute top-40 right-1/3">
          <div className="w-3 h-3 bg-accent-400 rounded-full animate-pulse delay-300" />
        </div>
        <div className="absolute bottom-1/3 left-1/6">
          <div className="w-1 h-1 bg-secondary-400 rounded-full animate-pulse delay-700" />
        </div>
      </div>

      {/* Header */}
      <Header
        logo={{
          icon: <Cpu className="w-5 h-5" />,
          text: "CodeGuide",
          href: "/"
        }}
        navigation={[
          { label: "功能", href: "#features" },
          { label: "案例", href: "#examples" },
          { label: "定价", href: "#pricing" },
          { label: "帮助", href: "#help" }
        ]}
        showSearch={false}
        actions={
          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                    仪表板
                  </Button>
                </Link>
                <Link href="/project/templates">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                    项目模板
                  </Button>
                </Link>
                <Link href="/project/create">
                  <Button variant="primary" size="sm">
                    新建项目
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                    登录
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary" size="sm">
                    开始使用
            </Button>
                </Link>
              </>
            )}
          </div>
        }
        variant="transparent"
      />

      {/* Main Hero Section */}
      <main className="relative z-10 pt-20 pb-32">
        <Container size="5xl" className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/20 rounded-full px-4 py-2 mb-8">
            <Brain className="w-4 h-4 text-primary-400" />
            <span className="text-primary-300 text-sm font-medium">使用AI Agent辅助完成专业的项目需求分析</span>
          </div>

          {/* Hero Title */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8 bg-gradient-to-r from-white via-primary-200 to-accent-300 bg-clip-text text-transparent">
            创建新项目
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            AI驱动的项目需求分析平台，帮助您快速生成专业的项目文档
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/dashboard">
              <Button size="xl" variant="primary" className="min-w-48">
                <Zap className="w-5 h-5 mr-2" />
                直接开始
              </Button>
            </Link>
            <Link href="/examples">
              <Button size="xl" variant="outline" className="min-w-48">
                查看案例
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </Container>
      </main>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20">
        <Container size="6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">功能特色</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              从项目构思到技术文档，AI全流程辅助
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card variant="elevated" className="group hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-primary-400" />
                </div>
                <CardTitle className="text-xl">项目详情</CardTitle>
                <CardDescription>
                  快速定义项目基本信息和目标
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  输入项目名称、描述和基本需求，AI会帮助您完善项目定位和目标设定
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card variant="elevated" className="group hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-accent-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Cpu className="w-6 h-6 text-accent-400" />
                </div>
                <CardTitle className="text-xl">选择AI工具</CardTitle>
                <CardDescription>
                  支持多种AI模型和工具
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  Claude 4、GPT-4、Gemini等多种AI模型可选，满足不同的分析需求
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card variant="elevated" className="group hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-secondary-400" />
          </div>
                <CardTitle className="text-xl">需求澄清</CardTitle>
                <CardDescription>
                  AI智能提问，完善需求细节
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  AI会根据项目描述生成针对性问题，帮助您完善项目需求
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card variant="elevated" className="group hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-success-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-success-400" />
            </div>
                <CardTitle className="text-xl">技术栈推荐</CardTitle>
                <CardDescription>
                  智能推荐最适合的技术方案
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  基于项目需求和行业最佳实践，推荐最适合的技术栈和架构方案
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card variant="elevated" className="group hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-warning-500/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-warning-400" />
                </div>
                <CardTitle className="text-xl">项目计划</CardTitle>
                <CardDescription>
                  生成详细的项目文档
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  自动生成PRD、技术文档、API规范等专业项目文档
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card variant="elevated" className="group hover:shadow-2xl transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-error-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-error-400" />
                </div>
                <CardTitle className="text-xl">一键生成</CardTitle>
                <CardDescription>
                  快速生成完整项目文档
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm">
                  基于收集的信息，一键生成包含PRD、技术方案等在内的完整文档包
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="relative z-10 py-20 bg-neutral-800/50">
        <Container size="6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">工作流程</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              简单几步，即可完成专业项目分析
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="font-semibold mb-2">项目详情</h3>
              <p className="text-sm text-gray-400">
                输入项目基本信息
              </p>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-gray-400" />
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="font-semibold mb-2">选择AI工具</h3>
              <p className="text-sm text-gray-400">
                选择合适的AI模型
              </p>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-gray-400" />
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="font-semibold mb-2">需求澄清</h3>
              <p className="text-sm text-gray-400">
                回答AI生成的问题
              </p>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-gray-400" />
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-success-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-xl">4</span>
              </div>
              <h3 className="font-semibold mb-2">生成文档</h3>
              <p className="text-sm text-gray-400">
                获得专业项目文档
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <Container size="4xl" className="text-center">
          <h2 className="text-4xl font-bold mb-6">开始您的AI辅助项目分析</h2>
          <p className="text-xl text-gray-400 mb-12">
            立即体验智能化的项目需求分析流程
          </p>
          <Link href="/project/create">
            <Button size="2xl" variant="primary" className="min-w-64">
              <Brain className="w-6 h-6 mr-3" />
              免费开始使用
            </Button>
          </Link>
        </Container>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-neutral-800 py-12">
        <Container size="6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-accent-500 rounded-lg flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">CodeGuide</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI驱动的项目需求分析平台
              </p>
            </div>

            {/* Product */}
            <div>
              <h3 className="font-semibold mb-4">产品</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  功能介绍
                </a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  定价方案
                </a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  案例展示
                </a>
              </div>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">支持</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  使用指南
                </a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  常见问题
                </a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  联系我们
                </a>
              </div>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-semibold mb-4">公司</h3>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  关于我们
                </a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  隐私政策
                </a>
                <a href="#" className="block text-gray-400 hover:text-white text-sm transition-colors">
                  服务条款
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 CodeGuide. All rights reserved.
            </p>
          </div>
        </Container>
      </footer>
    </div>
  )
}