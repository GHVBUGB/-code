import { supabaseAdmin } from './client'
import { z } from 'zod'

// Validation schemas
export const createProjectSchema = z.object({
  name: z.string().min(1, '项目名称不能为空').max(100, '项目名称最多100字符'),
  description: z.string().min(10, '项目描述至少10字符').max(1000, '项目描述最多1000字符'),
  type: z.enum(['web', 'mobile', 'desktop', 'api', 'ai', 'other'], {
    errorMap: () => ({ message: '请选择项目类型' })
  })
})

export const updateProjectSchema = z.object({
  name: z.string().min(1, '项目名称不能为空').max(100, '项目名称最多100字符').optional(),
  description: z.string().min(10, '项目描述至少10字符').max(1000, '项目描述最多1000字符').optional(),
  type: z.enum(['web', 'mobile', 'desktop', 'api', 'ai', 'other']).optional(),
  tech_stack: z.array(z.string()).optional(),
  ai_model: z.string().optional(),
  ai_tools: z.array(z.string()).optional(),
  clarification_questions: z.any().optional(),
  feature_list: z.any().optional(),
  prd_document: z.any().optional(),
  status: z.enum(['draft', 'clarifying', 'planning', 'completed']).optional()
})

export type CreateProjectData = z.infer<typeof createProjectSchema>
export type UpdateProjectData = z.infer<typeof updateProjectSchema>

export class ProjectService {
  // Create project
  static async createProject(userId: string, data: CreateProjectData) {
    try {
      const validatedData = createProjectSchema.parse(data)

      const { data: project, error } = await supabaseAdmin
        .from('projects')
        .insert({
          user_id: userId,
          name: validatedData.name,
          description: validatedData.description,
          type: validatedData.type,
          status: 'draft'
        })
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        project
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '创建项目失败'
      }
    }
  }

  // Get user projects
  static async getUserProjects(userId: string) {
    try {
      const { data: projects, error } = await supabaseAdmin
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (error) throw error

      return {
        success: true,
        projects: projects || []
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取项目列表失败'
      }
    }
  }

  // Get project by ID
  static async getProjectById(projectId: string, userId: string) {
    try {
      const { data: project, error } = await supabaseAdmin
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .eq('user_id', userId)
        .single()

      if (error || !project) {
        throw new Error('项目不存在')
      }

      return {
        success: true,
        project
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取项目信息失败'
      }
    }
  }

  // Update project
  static async updateProject(projectId: string, userId: string, data: UpdateProjectData) {
    try {
      const validatedData = updateProjectSchema.parse(data)

      const { data: project, error } = await supabaseAdmin
        .from('projects')
        .update({
          ...validatedData,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .eq('user_id', userId)
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        project
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '更新项目失败'
      }
    }
  }

  // Delete project
  static async deleteProject(projectId: string, userId: string) {
    try {
      const { error } = await supabaseAdmin
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', userId)

      if (error) throw error

      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '删除项目失败'
      }
    }
  }
}










