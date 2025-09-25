# Supabase 数据库配置指南

## 📋 配置步骤

### 1. 创建 Supabase 项目
1. 访问 [https://supabase.com/](https://supabase.com/)
2. 注册并登录账户
3. 点击 "New Project" 创建新项目
4. 填写项目信息：
   - **Name**: CodeGuide AI
   - **Database Password**: 设置一个强密码
   - **Region**: 选择离您最近的区域
5. 点击 "Create new project" 等待项目创建完成

### 2. 获取配置信息
项目创建完成后，在项目设置中找到：
1. **Project URL**: `https://your-project-id.supabase.co`
2. **API Keys**:
   - **anon public**: 用于客户端
   - **service_role**: 用于服务端（保密）

### 3. 执行数据库脚本
1. 在 Supabase 项目中，点击左侧菜单的 "SQL Editor"
2. 点击 "New query" 创建新查询
3. 复制 `supabase-setup.sql` 文件中的所有内容
4. 粘贴到 SQL Editor 中
5. 点击 "Run" 执行脚本

### 4. 配置环境变量
在项目根目录创建 `.env.local` 文件：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OpenRouter API 配置
NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-your-api-key
```

### 5. 验证配置
1. 重启开发服务器
2. 访问 `/test-auth` 页面测试认证功能
3. 在 Supabase 的 "Table Editor" 中查看创建的表

## 🗄️ 数据库表结构

### users 表
- `id`: 用户唯一标识 (UUID)
- `username`: 用户名 (唯一)
- `email`: 邮箱地址 (唯一)
- `password_hash`: 加密后的密码
- `salt`: 密码盐值
- `is_active`: 账户是否激活
- `created_at`: 创建时间
- `updated_at`: 更新时间
- `last_login`: 最后登录时间

### projects 表
- `id`: 项目唯一标识 (UUID)
- `user_id`: 所属用户ID (外键)
- `name`: 项目名称
- `description`: 项目描述
- `type`: 项目类型
- `selected_model`: 选择的AI模型
- `selected_models`: 选择的AI模型列表 (JSON)
- `selected_tools`: 选择的开发工具 (JSON)
- `selected_tech_stack`: 选择的技术栈 (JSON)
- `clarification_answers`: 澄清问题答案 (JSON)
- `selected_documents`: 选择的文档类型 (JSON)
- `is_generating`: 是否正在生成文档
- `generation_progress`: 生成进度
- `generated_documents`: 生成的文档 (JSON)

### api_keys 表
- `id`: 密钥唯一标识 (UUID)
- `user_id`: 所属用户ID (外键)
- `provider`: 提供商 (如 openrouter)
- `encrypted_key`: 加密后的API密钥
- `model_preference`: 模型偏好
- `is_active`: 是否激活

### user_settings 表
- `id`: 设置唯一标识 (UUID)
- `user_id`: 所属用户ID (外键)
- `theme`: 主题设置
- `language`: 语言设置
- `notifications`: 通知设置 (JSON)
- `preferences`: 其他偏好设置 (JSON)

## 🔒 安全特性

### 行级安全策略 (RLS)
- 用户只能访问自己的数据
- 自动过滤其他用户的数据
- 防止数据泄露

### 数据加密
- 密码使用 bcrypt 加密
- API密钥加密存储
- 敏感数据保护

### 索引优化
- 邮箱和用户名索引
- 用户ID索引
- 创建时间索引
- 查询性能优化

## 🛠️ 管理功能

### 数据库监控
- `database_stats` 视图：查看各表统计信息
- `user_projects_summary` 视图：用户项目摘要
- 自动更新时间戳

### 数据维护
- `cleanup_old_projects()` 函数：清理过期项目
- `backup_user_data()` 函数：备份用户数据
- `get_user_project_stats()` 函数：获取用户项目统计

## 🧪 测试数据

脚本中包含一个测试用户：
- **用户名**: testuser
- **邮箱**: test@example.com
- **密码**: password123

> ⚠️ **注意**: 生产环境中请删除测试数据

## 🔧 故障排除

### 常见问题

1. **连接失败**
   - 检查环境变量是否正确
   - 确认 Supabase 项目状态正常
   - 检查网络连接

2. **权限错误**
   - 确认 RLS 策略已正确创建
   - 检查用户认证状态
   - 验证 API 密钥权限

3. **数据不显示**
   - 检查 RLS 策略
   - 确认用户已正确登录
   - 查看浏览器控制台错误

### 调试步骤

1. 访问 `/test-auth` 页面测试认证
2. 查看 Supabase 日志
3. 检查浏览器网络请求
4. 验证数据库表结构

## 📞 支持

如果遇到问题，请：
1. 检查 Supabase 官方文档
2. 查看项目日志
3. 使用测试页面验证功能
4. 检查环境变量配置

---

**配置完成后，您的应用将使用真实的 Supabase 数据库进行用户认证和数据存储！**
