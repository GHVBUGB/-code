# OpenRouter API 配置说明

## 环境变量配置

在项目根目录创建 `.env.local` 文件，添加以下配置：

```bash
# OpenRouter API 配置
OPENROUTER_API_KEY=sk-or-your-api-key-here

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 获取 OpenRouter API 密钥

1. 访问 [OpenRouter官网](https://openrouter.ai/)
2. 注册账户并登录
3. 在控制台中创建API密钥
4. 复制密钥（以 `sk-or-` 开头）
5. 将密钥添加到环境变量中

## 测试步骤

### 方法1: 使用Web界面测试

1. 启动开发服务器：
   ```bash
   npm run dev
   ```

2. 访问测试页面：
   - API测试页面: http://localhost:3000/api-test
   - 对话测试页面: http://localhost:3000/playground

3. 在页面中输入API密钥进行测试

### 方法2: 使用命令行测试

1. 设置环境变量：
   ```bash
   # Windows PowerShell
   $env:OPENROUTER_API_KEY="sk-or-your-key-here"
   
   # Windows CMD
   set OPENROUTER_API_KEY=sk-or-your-key-here
   
   # Linux/Mac
   export OPENROUTER_API_KEY="sk-or-your-key-here"
   ```

2. 运行测试脚本：
   ```bash
   node test-openrouter.js
   ```

## 支持的模型

- `openai/gpt-4-turbo` - GPT-4 Turbo
- `anthropic/claude-sonnet-4` - Claude Sonnet 4
- `anthropic/claude-3.5-sonnet` - Claude 3.5 Sonnet
- `google/gemini-pro-1.5` - Gemini Pro 1.5
- `meta-llama/llama-3.1-405b-instruct` - Llama 3.1 405B

## 常见问题

### 1. API密钥无效
- 检查密钥格式是否正确（以 `sk-or-` 开头）
- 确认密钥在OpenRouter控制台中有效
- 检查账户余额是否充足

### 2. 请求失败
- 检查网络连接
- 确认OpenRouter服务状态
- 查看控制台错误信息

### 3. 模型不可用
- 某些模型可能需要特殊权限
- 检查模型名称是否正确
- 尝试使用其他可用模型

## 费用说明

- 每次API调用都会消耗您的OpenRouter账户余额
- 不同模型的费用不同，请查看OpenRouter定价页面
- 建议先进行小规模测试，确认功能正常后再大量使用

