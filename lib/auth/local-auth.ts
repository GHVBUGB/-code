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

export interface User {
  id: string
  username: string
  email: string
  password_hash: string
  salt: string
  is_active: boolean
  created_at: string
  last_login?: string
}

// Local authentication service
export class LocalAuthService {
  private static readonly STORAGE_KEY = 'codeguide-users'
  private static readonly SESSION_KEY = 'codeguide-session'

  // Generate unique ID
  private static generateId(): string {
    if (typeof crypto !== 'undefined' && (crypto as any).randomUUID) {
      return (crypto as any).randomUUID()
    }
    return 'u-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
  }

  // Get all users from localStorage
  private static getUsers(): User[] {
    if (typeof window === 'undefined') return []
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  }

  // Save users to localStorage
  private static saveUsers(users: User[]): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(users))
    } catch (error) {
      console.error('Failed to save users:', error)
    }
  }

  // Get current session
  static getCurrentSession(): { user: User; token: string } | null {
    if (typeof window === 'undefined') return null
    try {
      const session = localStorage.getItem(this.SESSION_KEY)
      if (!session) return null
      
      const { user, token, expires } = JSON.parse(session)
      
      // Check if session is expired
      if (expires && Date.now() > expires) {
        this.clearSession()
        return null
      }
      
      return { user, token }
    } catch {
      return null
    }
  }

  // Save session
  private static saveSession(user: User, token: string): void {
    if (typeof window === 'undefined') return
    try {
      const expires = Date.now() + (24 * 60 * 60 * 1000) // 24 hours
      const session = { user, token, expires }
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session))
    } catch (error) {
      console.error('Failed to save session:', error)
    }
  }

  // Clear session
  static clearSession(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.SESSION_KEY)
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

  // Generate token
  private static generateToken(userId: string): string {
    const payload = {
      userId,
      exp: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
      iat: Date.now()
    }
    return btoa(JSON.stringify(payload))
  }

  // Register user
  static async register(data: RegisterData) {
    try {
      // Validate input
      const validatedData = registerSchema.parse(data)

      // Check if user already exists
      const users = this.getUsers()
      const existingUser = users.find(
        (u) => u.email === validatedData.email || u.username === validatedData.username
      )

      if (existingUser) {
        return {
          success: false,
          error: '用户名或邮箱已存在'
        }
      }

      // Hash password
      const { hash, salt } = await this.hashPassword(validatedData.password)

      // Create user
      const newUser: User = {
        id: this.generateId(),
        username: validatedData.username,
        email: validatedData.email,
        password_hash: hash,
        salt,
        is_active: true,
        created_at: new Date().toISOString()
      }

      // Save user
      users.push(newUser)
      this.saveUsers(users)

      // Generate token and save session
      const token = this.generateToken(newUser.id)
      this.saveSession(newUser, token)

      return {
        success: true,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email
        },
        token
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '注册失败'
      }
    }
  }

  // Login user
  static async login(data: LoginData) {
    try {
      // Validate input
      const validatedData = loginSchema.parse(data)

      // Find user
      const users = this.getUsers()
      const user = users.find((u) => u.email === validatedData.email && u.is_active)

      if (!user) {
        return {
          success: false,
          error: '邮箱或密码错误'
        }
      }

      // Verify password
      const isValidPassword = await this.verifyPassword(
        validatedData.password,
        user.password_hash,
        user.salt
      )

      if (!isValidPassword) {
        return {
          success: false,
          error: '邮箱或密码错误'
        }
      }

      // Update last login
      user.last_login = new Date().toISOString()
      this.saveUsers(users)

      // Generate token and save session
      const token = this.generateToken(user.id)
      this.saveSession(user, token)

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        },
        token
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '登录失败'
      }
    }
  }

  // Get user by ID
  static async getUserById(userId: string) {
    try {
      const users = this.getUsers()
      const user = users.find((u) => u.id === userId && u.is_active)

      if (!user) {
        return {
          success: false,
          error: '用户不存在'
        }
      }

      return {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          created_at: user.created_at
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取用户信息失败'
      }
    }
  }

  // Get all users (for debugging)
  static getAllUsers(): User[] {
    return this.getUsers()
  }

  // Clear all data (for debugging)
  static clearAllData(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(this.STORAGE_KEY)
    localStorage.removeItem(this.SESSION_KEY)
  }
}
