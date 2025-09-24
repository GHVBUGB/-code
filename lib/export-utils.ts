// Export utilities for generating documents

export interface ProjectExportData {
  project: {
    name: string
    description: string
    type: string
    status: string
    created_at: string
    updated_at: string
  }
  features?: Array<{
    name: string
    description: string
    priority: string
    complexity: string
    estimatedDays: number
  }>
  techStack?: Array<{
    category: string
    items: Array<{
      name: string
      reason: string
      alternative?: string
    }>
  }>
  clarificationQuestions?: Array<{
    question: string
    category: string
    answer: string
  }>
  prd?: {
    overview: string
    objectives: string[]
    targetUsers: string[]
    functionalRequirements: string[]
    nonFunctionalRequirements: string[]
    constraints: string[]
  }
}

// Generate Markdown content
export function generateMarkdown(data: ProjectExportData): string {
  const { project, features, techStack, clarificationQuestions, prd } = data

  let markdown = `# ${project.name}\n\n`
  
  // Project Overview
  markdown += `## 项目概述\n\n`
  markdown += `**项目描述**: ${project.description}\n\n`
  markdown += `**项目类型**: ${getProjectTypeText(project.type)}\n\n`
  markdown += `**项目状态**: ${getStatusText(project.status)}\n\n`
  markdown += `**创建时间**: ${new Date(project.created_at).toLocaleDateString()}\n\n`
  markdown += `**更新时间**: ${new Date(project.updated_at).toLocaleDateString()}\n\n`

  // PRD Section
  if (prd) {
    markdown += `## 产品需求文档 (PRD)\n\n`
    
    markdown += `### 项目概述\n${prd.overview}\n\n`
    
    if (prd.objectives && prd.objectives.length > 0) {
      markdown += `### 项目目标\n`
      prd.objectives.forEach(objective => {
        markdown += `- ${objective}\n`
      })
      markdown += `\n`
    }

    if (prd.targetUsers && prd.targetUsers.length > 0) {
      markdown += `### 目标用户\n`
      prd.targetUsers.forEach(user => {
        markdown += `- ${user}\n`
      })
      markdown += `\n`
    }

    if (prd.functionalRequirements && prd.functionalRequirements.length > 0) {
      markdown += `### 功能性需求\n`
      prd.functionalRequirements.forEach(req => {
        markdown += `- ${req}\n`
      })
      markdown += `\n`
    }

    if (prd.nonFunctionalRequirements && prd.nonFunctionalRequirements.length > 0) {
      markdown += `### 非功能性需求\n`
      prd.nonFunctionalRequirements.forEach(req => {
        markdown += `- ${req}\n`
      })
      markdown += `\n`
    }

    if (prd.constraints && prd.constraints.length > 0) {
      markdown += `### 约束条件\n`
      prd.constraints.forEach(constraint => {
        markdown += `- ${constraint}\n`
      })
      markdown += `\n`
    }
  }

  // Features Section
  if (features && features.length > 0) {
    markdown += `## 功能需求清单\n\n`
    markdown += `| 功能名称 | 描述 | 优先级 | 复杂度 | 预估时间 |\n`
    markdown += `|---------|------|-------|-------|----------|\n`
    
    features.forEach(feature => {
      const priority = feature.priority === 'high' ? '高' : feature.priority === 'medium' ? '中' : '低'
      const complexity = feature.complexity === 'complex' ? '复杂' : feature.complexity === 'medium' ? '中等' : '简单'
      markdown += `| ${feature.name} | ${feature.description} | ${priority} | ${complexity} | ${feature.estimatedDays}天 |\n`
    })
    markdown += `\n`
  }

  // Tech Stack Section
  if (techStack && techStack.length > 0) {
    markdown += `## 技术栈推荐\n\n`
    
    techStack.forEach(category => {
      markdown += `### ${category.category}\n\n`
      
      category.items.forEach(item => {
        markdown += `#### ${item.name}\n`
        markdown += `${item.reason}\n`
        if (item.alternative) {
          markdown += `**替代方案**: ${item.alternative}\n`
        }
        markdown += `\n`
      })
    })
  }

  // Clarification Q&A Section
  if (clarificationQuestions && clarificationQuestions.length > 0) {
    markdown += `## 需求澄清\n\n`
    
    const categories = [...new Set(clarificationQuestions.map(q => q.category))]
    
    categories.forEach(category => {
      markdown += `### ${category}\n\n`
      
      const categoryQuestions = clarificationQuestions.filter(q => q.category === category)
      categoryQuestions.forEach((qa, index) => {
        markdown += `**Q${index + 1}: ${qa.question}**\n\n`
        markdown += `A: ${qa.answer}\n\n`
      })
    })
  }

  return markdown
}

// Generate HTML content
export function generateHTML(data: ProjectExportData): string {
  const markdown = generateMarkdown(data)
  
  // Simple markdown to HTML conversion (for basic formatting)
  let html = markdown
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    .replace(/^\*\*(.*)\*\*$/gm, '<strong>$1</strong>')
    .replace(/^\- (.*$)/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>')

  // Wrap in HTML structure
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.project.name} - 项目需求文档</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1, h2, h3, h4 {
            color: #2563eb;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 20px 0;
        }
        table th, table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        table th {
            background-color: #f8fafc;
            font-weight: 600;
        }
        .meta-info {
            background-color: #f1f5f9;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="meta-info">
        <p><strong>生成时间:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>生成工具:</strong> CodeGuide AI</p>
    </div>
    <div>
        ${html}
    </div>
</body>
</html>`
}

// Download file utility
export function downloadFile(content: string, filename: string, contentType: string): void {
  const blob = new Blob([content], { type: contentType })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Export as Markdown
export function exportAsMarkdown(data: ProjectExportData): void {
  const content = generateMarkdown(data)
  const filename = `${data.project.name}-PRD.md`
  downloadFile(content, filename, 'text/markdown')
}

// Export as HTML
export function exportAsHTML(data: ProjectExportData): void {
  const content = generateHTML(data)
  const filename = `${data.project.name}-PRD.html`
  downloadFile(content, filename, 'text/html')
}

// Export as JSON
export function exportAsJSON(data: ProjectExportData): void {
  const content = JSON.stringify(data, null, 2)
  const filename = `${data.project.name}-data.json`
  downloadFile(content, filename, 'application/json')
}

// Generate PDF content (requires additional PDF library)
export function generatePDFContent(data: ProjectExportData): string {
  // This would typically use a library like jsPDF or Puppeteer
  // For now, return HTML content that can be printed as PDF
  return generateHTML(data)
}

// Copy to clipboard
export function copyToClipboard(content: string): Promise<void> {
  return navigator.clipboard.writeText(content)
}

// Utility functions
function getProjectTypeText(type: string): string {
  const typeMap: Record<string, string> = {
    'web': 'Web应用',
    'mobile': '移动应用',
    'desktop': '桌面应用',
    'api': 'API服务',
    'ai': 'AI应用',
    'other': '其他'
  }
  return typeMap[type] || type
}

function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'completed': '已完成',
    'planning': '规划中',
    'clarifying': '澄清中',
    'draft': '草稿'
  }
  return statusMap[status] || status
}

// Template for empty sections
export function getEmptyTemplate(): ProjectExportData {
  return {
    project: {
      name: '新项目',
      description: '项目描述',
      type: 'web',
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    features: [],
    techStack: [],
    clarificationQuestions: [],
    prd: {
      overview: '',
      objectives: [],
      targetUsers: [],
      functionalRequirements: [],
      nonFunctionalRequirements: [],
      constraints: []
    }
  }
}










