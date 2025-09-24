import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 澄清数据类型
interface ClarificationData {
  targetAudience: string
  keyFeatures: string
  technicalRequirements: string
  timeline: string
  budget: string
  additionalNotes: string
}

// 项目创建流程的数据类型
interface ProjectData {
  // 基本信息
  name: string
  description: string
  type: string
  
  // AI工具选择
  selectedModel: string
  selectedTools: string[]
  
  // 需求澄清
  clarificationAnswers: ClarificationData
  
  // 生成状态
  isGenerating: boolean
  generationProgress: number
  generatedDocuments: any[]
}

interface ProjectStore {
  // 当前项目数据
  projectData: ProjectData
  
  // 更新方法
  updateProjectBasics: (data: Partial<Pick<ProjectData, 'name' | 'description' | 'type'>>) => void
  updateProjectData: (data: Partial<ProjectData>) => void
  updateAITools: (model: string, tools: string[]) => void
  updateClarificationAnswer: (questionId: string, answer: string) => void
  setClarificationAnswers: (answers: ClarificationData) => void
  setGenerationStatus: (isGenerating: boolean, progress?: number) => void
  setGeneratedDocuments: (documents: any[]) => void
  
  // 重置项目
  resetProject: () => void
  
  // 获取完成状态
  getCompletionStatus: () => {
    basicsComplete: boolean
    toolsComplete: boolean
    clarificationComplete: boolean
    canProceed: boolean
  }
}

const initialProjectData: ProjectData = {
  name: '',
  description: '',
  type: '',
  selectedModel: '',
  selectedTools: [],
  clarificationAnswers: {
    targetAudience: '',
    keyFeatures: '',
    technicalRequirements: '',
    timeline: '',
    budget: '',
    additionalNotes: ''
  },
  isGenerating: false,
  generationProgress: 0,
  generatedDocuments: []
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projectData: initialProjectData,
      
      updateProjectBasics: (data) => 
        set((state) => ({
          projectData: { ...state.projectData, ...data }
        })),
      
      updateProjectData: (data) => 
        set((state) => ({
          projectData: { ...state.projectData, ...data }
        })),
      
      updateAITools: (model, tools) =>
        set((state) => ({
          projectData: { 
            ...state.projectData, 
            selectedModel: model, 
            selectedTools: tools 
          }
        })),
      
      updateClarificationAnswer: (questionId, answer) =>
        set((state) => ({
          projectData: {
            ...state.projectData,
            clarificationAnswers: {
              ...state.projectData.clarificationAnswers,
              [questionId]: answer
            }
          }
        })),
      
      setClarificationAnswers: (answers) =>
    set((state) => ({
      projectData: {
        ...state.projectData,
        clarificationAnswers: { ...answers }
      }
    })),
      
      setGenerationStatus: (isGenerating, progress = 0) =>
        set((state) => ({
          projectData: {
            ...state.projectData,
            isGenerating,
            generationProgress: progress
          }
        })),
      
      setGeneratedDocuments: (documents) =>
        set((state) => ({
          projectData: {
            ...state.projectData,
            generatedDocuments: documents
          }
        })),
      
      resetProject: () => set({ projectData: initialProjectData }),
      
      getCompletionStatus: () => {
        const { projectData } = get()
        const basicsComplete = !!(projectData.name && projectData.description && projectData.type)
        const toolsComplete = !!projectData.selectedModel
        const clarificationComplete = Object.keys(projectData.clarificationAnswers).length >= 3 // 假设至少需要3个答案
        
        return {
          basicsComplete,
          toolsComplete,
          clarificationComplete,
          canProceed: basicsComplete && toolsComplete && clarificationComplete
        }
      }
    }),
    {
      name: 'codeguide-project-storage',
      partialize: (state) => ({ projectData: state.projectData })
    }
  )
)

// 用户认证状态管理
interface User {
  id: string
  email: string
  username: string
  avatar?: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  
  // 认证方法
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
  
  // 设置用户信息
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthStore>()((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  
  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      // TODO: 实现真实的登录逻辑
      // 这里可以集成Supabase认证
      
      // 模拟登录
      const mockUser: User = {
        id: '1',
        email,
        username: email.split('@')[0],
        avatar: '/placeholder-user.jpg'
      }
      
      set({ 
        user: mockUser, 
        isAuthenticated: true, 
        isLoading: false 
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },
  
  register: async (username: string, email: string, password: string) => {
    set({ isLoading: true })
    try {
      // TODO: 实现真实的注册逻辑
      
      // 模拟注册
      const mockUser: User = {
        id: '1',
        email,
        username,
        avatar: '/placeholder-user.jpg'
      }
      
      set({ 
        user: mockUser, 
        isAuthenticated: true, 
        isLoading: false 
      })
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },
  
  logout: () => {
    // Clear localStorage
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user-data')
    
    set({ 
      user: null, 
      isAuthenticated: false 
    })
  },

  checkAuth: async () => {
    set({ isLoading: true })
    try {
      const token = localStorage.getItem('auth-token')
      const userData = localStorage.getItem('user-data')
      
      if (token && userData) {
        const user = JSON.parse(userData)
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        })
      } else {
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        })
      }
    } catch (error) {
      set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      })
    }
  },
  
  setUser: (user) => {
    set({ 
      user, 
      isAuthenticated: !!user 
    })
  },
  
  setLoading: (loading) => {
    set({ isLoading: loading })
  }
}))

// 全局设置：模型与开发工具选择
interface SettingsState {
  selectedModel: string
  preferredTools: string[]
  setSelectedModel: (model: string) => void
  toggleTool: (tool: string) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      selectedModel: 'anthropic/claude-sonnet-4',
      preferredTools: [],
      setSelectedModel: (model) => set({ selectedModel: model }),
      toggleTool: (tool) =>
        set((state) => ({
          preferredTools: state.preferredTools.includes(tool)
            ? state.preferredTools.filter((t) => t !== tool)
            : [...state.preferredTools, tool]
        }))
    }),
    {
      name: 'codeguide-settings'
    }
  )
)

// API密钥管理状态
interface APIKey {
  id: string
  provider: string
  name: string
  isActive: boolean
  createdAt: string
}

interface APIKeyStore {
  apiKeys: APIKey[]
  isLoading: boolean
  
  // API密钥管理方法
  addAPIKey: (provider: string, key: string, name?: string) => Promise<void>
  removeAPIKey: (id: string) => void
  toggleAPIKey: (id: string) => void
  getActiveKey: (provider: string) => APIKey | null
}

export const useAPIKeyStore = create<APIKeyStore>()((set, get) => ({
  apiKeys: [],
  isLoading: false,
  
  addAPIKey: async (provider: string, key: string, name?: string) => {
    set({ isLoading: true })
    try {
      // TODO: 实现API密钥加密存储
      
      const newKey: APIKey = {
        id: Date.now().toString(),
        provider,
        name: name || `${provider} Key`,
        isActive: true,
        createdAt: new Date().toISOString()
      }
      
      set((state) => ({
        apiKeys: [...state.apiKeys, newKey],
        isLoading: false
      }))
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },
  
  removeAPIKey: (id: string) => {
    set((state) => ({
      apiKeys: state.apiKeys.filter(key => key.id !== id)
    }))
  },
  
  toggleAPIKey: (id: string) => {
    set((state) => ({
      apiKeys: state.apiKeys.map(key => 
        key.id === id ? { ...key, isActive: !key.isActive } : key
      )
    }))
  },
  
  getActiveKey: (provider: string) => {
    const { apiKeys } = get()
    return apiKeys.find(key => key.provider === provider && key.isActive) || null
  }
}))


