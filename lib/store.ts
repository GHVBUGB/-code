import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// 澄清数据类型
interface ClarificationData {
  [key: string]: string
}

// 项目创建流程的数据类型
interface ProjectData {
  // 基本信息
  name: string
  description: string
  type: string
  
  // AI工具选择
  selectedModel: string
  selectedModels: string[] // 多选AI模型
  selectedTools: string[]
  selectedTechStack: string[]
  
  // 需求澄清
  clarificationAnswers: ClarificationData
  
  // 文档预览选择
  selectedDocuments: string[]
  
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
  selectedModels: [],
  selectedTools: [],
  selectedTechStack: [],
  clarificationAnswers: {},
  selectedDocuments: [],
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
        // 修复：检查selectedModels数组或selectedModel
        const toolsComplete = !!(projectData.selectedModel || (projectData.selectedModels && projectData.selectedModels.length > 0))
        const clarificationComplete = Object.keys(projectData.clarificationAnswers).length >= 1 // 降低要求，至少1个答案即可
        
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
      const { AuthService } = await import('./supabase/auth')
      const result = await AuthService.login({ email, password })
      
      if (result.success && result.user) {
        // 保存到localStorage
        localStorage.setItem('auth-token', result.token || 'mock-token')
        localStorage.setItem('user-data', JSON.stringify(result.user))
        
        const user: User = {
          id: result.user.id,
          email: result.user.email,
          username: result.user.username,
          avatar: '/placeholder-user.jpg'
        }
        
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        })
      } else {
        throw new Error(result.error || '登录失败')
      }
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },
  
  register: async (username: string, email: string, password: string) => {
    set({ isLoading: true })
    try {
      const { AuthService } = await import('./supabase/auth')
      const result = await AuthService.register({ 
        username, 
        email, 
        password, 
        confirmPassword: password 
      })
      
      if (result.success && result.user) {
        // 保存到localStorage
        localStorage.setItem('auth-token', result.token || 'mock-token')
        localStorage.setItem('user-data', JSON.stringify(result.user))
        
        const user: User = {
          id: result.user.id,
          email: result.user.email,
          username: result.user.username,
          avatar: '/placeholder-user.jpg'
        }
        
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        })
      } else {
        throw new Error(result.error || '注册失败')
      }
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },
  
  logout: () => {
    // Clear localStorage
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user-data')
    
    // Clear local auth session
    try {
      const { AuthService } = require('./supabase/auth')
      AuthService.clearSession()
    } catch (error) {
      console.warn('Failed to clear auth session:', error)
    }
    
    set({ 
      user: null, 
      isAuthenticated: false 
    })
  },

  checkAuth: async () => {
    set({ isLoading: true })
    try {
      // First check local auth session
      const { AuthService } = await import('./supabase/auth')
      const session = AuthService.getCurrentSession()
      
      if (session && session.user) {
        const user: User = {
          id: session.user.id,
          email: session.user.email,
          username: session.user.username,
          avatar: '/placeholder-user.jpg'
        }
        
        set({ 
          user, 
          isAuthenticated: true, 
          isLoading: false 
        })
        return
      }
      
      // Fallback to localStorage
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
      selectedModel: 'anthropic/claude-3.5-sonnet',
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


