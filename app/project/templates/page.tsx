'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Header } from '@/components/ui/header'
import { Container } from '@/components/ui/container'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useProjectStore } from '@/lib/store'
import { 
  PROJECT_TEMPLATES, 
  PROJECT_CATEGORIES, 
  COMPLEXITY_LEVELS,
  getTemplatesByCategory,
  getTemplatesByComplexity,
  searchTemplates,
  type ProjectTemplate
} from '@/lib/project-templates'
import { 
  Search, 
  ArrowRight, 
  Clock, 
  Users, 
  Code,
  Sparkles,
  Filter,
  ArrowLeft
} from 'lucide-react'

import { RouteGuard } from "@/components/auth/route-guard"

export default function ProjectTemplatesPage() {
  const router = useRouter()
  const { updateProjectBasics } = useProjectStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedComplexity, setSelectedComplexity] = useState<string>('all')
  const [filteredTemplates, setFilteredTemplates] = useState<ProjectTemplate[]>(PROJECT_TEMPLATES)

  useEffect(() => {
    let templates = PROJECT_TEMPLATES

    // Apply search filter
    if (searchQuery.trim()) {
      templates = searchTemplates(searchQuery)
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      templates = getTemplatesByCategory(selectedCategory)
    }

    // Apply complexity filter
    if (selectedComplexity !== 'all') {
      templates = getTemplatesByComplexity(selectedComplexity)
    }

    // If multiple filters are applied, intersect the results
    if (searchQuery.trim() || selectedCategory !== 'all' || selectedComplexity !== 'all') {
      let result = PROJECT_TEMPLATES

      if (searchQuery.trim()) {
        result = result.filter(t => searchTemplates(searchQuery).includes(t))
      }

      if (selectedCategory !== 'all') {
        result = result.filter(t => t.category === selectedCategory)
      }

      if (selectedComplexity !== 'all') {
        result = result.filter(t => t.complexity === selectedComplexity)
      }

      templates = result
    }

    setFilteredTemplates(templates)
  }, [searchQuery, selectedCategory, selectedComplexity])

  const useTemplate = (template: ProjectTemplate) => {
    // Update project basics with template data
    updateProjectBasics({
      name: template.name,
      description: template.description,
      type: template.type
    })

    // Navigate to project creation with template pre-filled
    router.push('/project/create?template=' + template.id)
  }

  const createFromScratch = () => {
    router.push('/project/create')
  }

  const getComplexityColor = (complexity: string) => {
    const level = COMPLEXITY_LEVELS.find(l => l.value === complexity)
    return level?.color || 'text-neutral-500'
  }

  const getComplexityLabel = (complexity: string) => {
    const level = COMPLEXITY_LEVELS.find(l => l.value === complexity)
    return level?.label || complexity
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
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              返回仪表板
            </Button>
            <Button
              onClick={createFromScratch}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              从零开始
            </Button>
          </div>
        }
      />

      <Container size="6xl" className="py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center">
              <Code className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                选择项目模板
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                从预设模板快速开始，或选择从零开始创建项目
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <Input
                  placeholder="搜索模板..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
              >
                全部分类
              </Button>
              {PROJECT_CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Complexity Filter */}
            <div className="flex gap-2">
              <Button
                variant={selectedComplexity === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedComplexity('all')}
                className="flex items-center gap-1"
              >
                <Filter className="w-3 h-3" />
                全部复杂度
              </Button>
              {COMPLEXITY_LEVELS.map((level) => (
                <Button
                  key={level.value}
                  variant={selectedComplexity === level.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedComplexity(level.value)}
                  className={`flex items-center gap-1 ${level.color}`}
                >
                  {level.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-neutral-600 dark:text-neutral-400">
            找到 {filteredTemplates.length} 个模板
          </p>
        </div>

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="group hover:shadow-lg transition-all duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{template.icon}</div>
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-primary-600 transition-colors">
                          {template.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {template.category}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getComplexityColor(template.complexity)}`}
                          >
                            {getComplexityLabel(template.complexity)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 line-clamp-2">
                    {template.description}
                  </p>

                  {/* Key Features */}
                  <div className="mb-4">
                    <h5 className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      核心功能
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {template.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {template.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.features.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="mb-4">
                    <h5 className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      技术栈
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {template.techStack.slice(0, 3).map((tech, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                      {template.techStack.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.techStack.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {template.estimatedDuration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {template.complexity === 'simple' ? '1-2人' : 
                       template.complexity === 'medium' ? '2-4人' : '4-8人'}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    onClick={() => useTemplate(template)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    使用此模板
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              没有找到匹配的模板
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              尝试调整搜索条件或从零开始创建项目
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                  setSelectedComplexity('all')
                }}
              >
                清除筛选
              </Button>
              <Button onClick={createFromScratch}>
                从零开始创建
              </Button>
            </div>
          </div>
        )}

        {/* Custom Project Option */}
        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-700">
          <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-950 dark:to-secondary-950 border-primary-200 dark:border-primary-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                      从零开始创建项目
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      没有找到合适的模板？从空白项目开始，完全自定义您的需求
                    </p>
                  </div>
                </div>
                <Button onClick={createFromScratch} size="lg" className="flex items-center gap-2">
                  开始创建
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
      </div>
    </RouteGuard>
  )
}








