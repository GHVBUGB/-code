// 模拟AI功能 - 当OpenRouter API不可用时使用
export const MOCK_AI = {
  // 模拟AI模型推荐
  getRecommendedModels: (projectDescription: string) => {
    return {
      success: true,
      data: [
        {
          id: 'claude-3.5-sonnet',
          name: 'Claude 3.5 Sonnet',
          provider: 'Anthropic',
          description: '强大的AI模型，适合复杂任务',
          category: 'ai',
          recommended: true
        },
        {
          id: 'gpt-4-turbo',
          name: 'GPT-4 Turbo',
          provider: 'OpenAI',
          description: '快速响应的AI模型',
          category: 'ai',
          recommended: true
        }
      ]
    };
  },

  // 模拟澄清问题生成
  generateClarificationQuestions: (projectData: any) => {
    return {
      success: true,
      data: [
        {
          id: 1,
          question: "项目的目标用户群体是什么？",
          category: "用户体验",
          importance: "high",
          reasoning: "明确目标用户有助于设计合适的功能"
        },
        {
          id: 2,
          question: "项目的核心功能优先级如何排序？",
          category: "功能需求",
          importance: "high",
          reasoning: "确定开发优先级和项目范围"
        },
        {
          id: 3,
          question: "项目有哪些特殊的技术要求？",
          category: "技术实现",
          importance: "medium",
          reasoning: "了解技术限制和特殊需求"
        }
      ]
    };
  },

  // 模拟技术栈推荐
  recommendTechStack: (projectData: any) => {
    return {
      success: true,
      data: {
        frontend: ['React', 'Next.js', 'TypeScript'],
        backend: ['Node.js', 'Express', 'PostgreSQL'],
        deployment: ['Docker', 'Vercel', 'AWS']
      }
    };
  }
};

// 检查是否应该使用模拟功能
export const shouldUseMockAI = () => {
  // 这里可以添加逻辑来检测API是否可用
  return true; // 暂时总是使用模拟功能
};
