# 🚀 CodeGuide AI 快速开始指南

## 📋 配置步骤

### 方法一：使用配置脚本（推荐）

1. **运行配置脚本**
   ```bash
   npm run setup
   # 或
   pnpm setup
   ```

2. **按提示输入配置信息**
   - OpenRouter API Key（必需）
   - Supabase 配置（可选）

3. **重启开发服务器**
   ```bash
   npm run dev
   # 或
   pnpm dev
   ```

### 方法二：手动配置

1. **创建环境变量文件**
   ```bash
   cp 环境变量配置模板.txt .env.local
   ```

2. **编辑 .env.local 文件**
   - 替换 `YOUR_ACTUAL_API_KEY` 为真实的 OpenRouter API Key
   - 可选配置 Supabase 信息

3. **重启开发服务器**

## 🗄️ Supabase 数据库配置（可选）

### 快速配置（最小化）

1. **创建 Supabase 项目**
   - 访问 [https://supabase.com/](https://supabase.com/)
   - 创建新项目

2. **执行数据库脚本**
   - 在 Supabase SQL Editor 中执行 `supabase-minimal.sql`

3. **获取配置信息**
   - Project URL
   - API Keys (anon, service_role)

4. **更新环境变量**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

### 完整配置

1. **执行完整数据库脚本**
   - 在 Supabase SQL Editor 中执行 `supabase-setup.sql`

2. **查看详细配置指南**
   - 参考 `SUPABASE_SETUP.md`

## 🧪 测试配置

### 1. 测试认证功能
访问：`http://localhost:3000/test-auth`

### 2. 测试数据流
访问：`http://localhost:3000/test-data-flow`

### 3. 测试API功能
访问：`http://localhost:3000/test-api`

## 🔑 获取 OpenRouter API Key

1. **注册账户**
   - 访问 [https://openrouter.co/](https://openrouter.co/)
   - 注册并登录

2. **创建 API Key**
   - 进入 [https://openrouter.co/token](https://openrouter.co/token)
   - 点击 "Create Key"
   - 复制完整密钥

3. **充值账户**
   - 建议充值 $5-10 用于测试
   - 确保账户有足够余额

## 🎯 开始使用

配置完成后，您可以：

1. **注册用户账户**
2. **创建新项目**
3. **选择 AI 模型和工具**
4. **回答澄清问题**
5. **生成项目文档**

## 🆘 故障排除

### 常见问题

1. **API Key 无效**
   - 检查密钥格式是否正确
   - 确认账户余额充足
   - 验证密钥权限

2. **数据库连接失败**
   - 检查 Supabase 配置
   - 确认网络连接
   - 查看控制台错误

3. **用户认证问题**
   - 访问 `/test-auth` 测试
   - 检查 localStorage 数据
   - 清除浏览器缓存

### 获取帮助

1. **查看日志**
   - 浏览器控制台
   - 开发服务器日志

2. **使用测试页面**
   - `/test-auth` - 认证测试
   - `/test-data-flow` - 数据流测试
   - `/test-api` - API 测试

3. **检查配置**
   - 环境变量是否正确
   - 数据库表是否创建
   - API 密钥是否有效

---

**配置完成后，您就可以开始使用 CodeGuide AI 进行项目开发了！** 🎉
