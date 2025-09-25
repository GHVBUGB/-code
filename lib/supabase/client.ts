import { createClient } from '@supabase/supabase-js'

// 开发环境配置 - 使用模拟数据库
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 管理员客户端（用于服务端操作）
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// 检查是否使用service role
export const isUsingServiceRole = () => {
  return !!(process.env.SUPABASE_SERVICE_ROLE_KEY && 
           process.env.SUPABASE_SERVICE_ROLE_KEY !== supabaseAnonKey)
}

// 检查Supabase连接状态
export const checkSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1)
    return { connected: !error, error: error?.message }
  } catch (error) {
    return { connected: false, error: error instanceof Error ? error.message : '连接失败' }
  }
}