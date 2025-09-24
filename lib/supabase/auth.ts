import { supabase, supabaseAdmin } from './client'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { z } from 'zod'

// Validation schemas
export const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6位字符')
})

export const registerSchema = z.object({
  username: z.string().min(2, '用户名至少2位字符').max(50, '用户名最多50位字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6位字符'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "密码确认不匹配",
  path: ["confirmPassword"],
})

export type LoginData = z.infer<typeof loginSchema>
export type RegisterData = z.infer<typeof registerSchema>

// Authentication service
export class AuthService {
  // Mock store helpers for dev fallback
  private static getMockUsers(): any[] {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem('mock-users')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  private static saveMockUsers(users: any[]) {
    if (typeof window === 'undefined') return
    localStorage.setItem('mock-users', JSON.stringify(users))
  }

  private static generateId(): string {
    if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) {
      return (crypto as any).randomUUID()
    }
    return 'u-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
  }
  // Hash password with salt
  static async hashPassword(password: string): Promise<{ hash: string; salt: string }> {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = await bcrypt.hash(password + salt, 12)
    return { hash, salt }
  }

  // Verify password
  static async verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
    return await bcrypt.compare(password + salt, hash)
  }

  // Register user
  static async register(data: RegisterData) {
    try {
      // Validate input
      const validatedData = registerSchema.parse(data)

      // Check if user already exists
      const { data: existingUser } = await supabaseAdmin
        .from('users')
        .select('id')
        .or(`username.eq.${validatedData.username},email.eq.${validatedData.email}`)
        .single()

      if (existingUser) {
        throw new Error('用户名或邮箱已存在')
      }

      // Hash password
      const { hash, salt } = await this.hashPassword(validatedData.password)

      // Create user
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .insert({
          username: validatedData.username,
          email: validatedData.email,
          password_hash: hash,
          salt: salt,
          is_active: true
        })
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      }
    } catch (error) {
      // Dev fallback: use localStorage when Supabase不可用
      try {
        const validatedData = registerSchema.parse(data)
        const users = this.getMockUsers()
        const duplicate = users.find((u) => u.email === validatedData.email || u.username === validatedData.username)
        if (duplicate) {
          return { success: false, error: '用户名或邮箱已存在' }
        }
        const { hash, salt } = await this.hashPassword(validatedData.password)
        const newUser = {
          id: this.generateId(),
          username: validatedData.username,
          email: validatedData.email,
          password_hash: hash,
          salt,
          is_active: true,
          created_at: new Date().toISOString(),
        }
        users.push(newUser)
        this.saveMockUsers(users)
        return {
          success: true,
          user: { id: newUser.id, username: newUser.username, email: newUser.email }
        }
      } catch (fallbackErr) {
        return {
          success: false,
          error: fallbackErr instanceof Error ? fallbackErr.message : '注册失败'
        }
      }
    }
  }

  // Login user
  static async login(data: LoginData) {
    try {
      // Validate input
      const validatedData = loginSchema.parse(data)

      // Find user by email
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', validatedData.email)
        .eq('is_active', true)
        .single()

      if (error || !user) {
        throw new Error('邮箱或密码错误')
      }

      // Verify password
      const isValidPassword = await this.verifyPassword(
        validatedData.password,
        user.password_hash,
        user.salt
      )

      if (!isValidPassword) {
        throw new Error('邮箱或密码错误')
      }

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      }
    } catch (error) {
      // Dev fallback: localStorage users
      try {
        const validatedData = loginSchema.parse(data)
        const users = this.getMockUsers()
        const user = users.find((u) => u.email === validatedData.email && u.is_active !== false)
        if (!user) {
          return { success: false, error: '邮箱或密码错误' }
        }
        const isValidPassword = await this.verifyPassword(validatedData.password, user.password_hash, user.salt)
        if (!isValidPassword) {
          return { success: false, error: '邮箱或密码错误' }
        }
        return {
          success: true,
          user: { id: user.id, username: user.username, email: user.email }
        }
      } catch (fallbackErr) {
        return {
          success: false,
          error: fallbackErr instanceof Error ? fallbackErr.message : '登录失败'
        }
      }
    }
  }

  // Get user by ID
  static async getUserById(userId: string) {
    try {
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('id, username, email, created_at')
        .eq('id', userId)
        .eq('is_active', true)
        .single()

      if (error || !user) {
        throw new Error('用户不存在')
      }

      return {
        success: true,
        user
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取用户信息失败'
      }
    }
  }
}








