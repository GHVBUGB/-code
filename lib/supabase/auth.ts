import { supabase, supabaseAdmin } from './client'
import { LocalAuthService, type LoginData, type RegisterData } from '../auth/local-auth'
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
  // Check if Supabase is available
  private static async isSupabaseAvailable(): Promise<boolean> {
    try {
      const { data, error } = await supabase.from('users').select('count').limit(1)
      return !error
    } catch {
      return false
    }
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
    // Check if Supabase is available
    const isSupabaseAvailable = await this.isSupabaseAvailable()
    
    if (isSupabaseAvailable) {
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
        // Fall back to local auth if Supabase fails
        console.warn('Supabase registration failed, falling back to local auth:', error)
      }
    }

    // Use local authentication
    return await LocalAuthService.register(data)
  }

  // Login user
  static async login(data: LoginData) {
    // Check if Supabase is available
    const isSupabaseAvailable = await this.isSupabaseAvailable()
    
    if (isSupabaseAvailable) {
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
        // Fall back to local auth if Supabase fails
        console.warn('Supabase login failed, falling back to local auth:', error)
      }
    }

    // Use local authentication
    return await LocalAuthService.login(data)
  }

  // Get user by ID
  static async getUserById(userId: string) {
    // Check if Supabase is available
    const isSupabaseAvailable = await this.isSupabaseAvailable()
    
    if (isSupabaseAvailable) {
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
        // Fall back to local auth if Supabase fails
        console.warn('Supabase getUserById failed, falling back to local auth:', error)
      }
    }

    // Use local authentication
    return await LocalAuthService.getUserById(userId)
  }

  // Get current session (local auth only)
  static getCurrentSession() {
    return LocalAuthService.getCurrentSession()
  }

  // Clear session (local auth only)
  static clearSession() {
    LocalAuthService.clearSession()
  }
}








