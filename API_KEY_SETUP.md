# API密钥配置指南

## 🚨 当前状态
您的API密钥格式正确，但OpenRouter返回"Invalid token"错误。

## 📋 配置步骤

### 1. 创建环境变量文件
在项目根目录 `qd/` 下创建 `.env.local` 文件，内容如下：

```bash
# OpenRouter API 配置
OPENROUTER_API_KEY=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

# 应用配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. 重启开发服务器
配置完成后，重启开发服务器：

```powershell
# 停止当前服务器 (Ctrl+C)
# 然后重新启动
npm run dev
```

### 3. 测试API密钥
访问以下页面进行测试：

- **API测试页面**: http://localhost:3000/api-test
- **调试页面**: http://localhost:3000/settings/api/debug
- **对话测试**: http://localhost:3000/playground

## 🔧 解决"Invalid token"错误

### 可能的原因和解决方案：

1. **API密钥已过期**
   - 访问 [OpenRouter控制台](https://openrouter.ai/keys)
   - 检查密钥状态
   - 如果过期，创建新的API密钥

2. **账户余额不足**
   - 登录 [OpenRouter账户](https://openrouter.ai/)
   - 检查账户余额
   - 如果余额不足，进行充值

3. **密钥权限问题**
   - 确认密钥有正确的权限
   - 检查是否有使用限制

4. **网络问题**
   - 检查网络连接
   - 尝试使用VPN或更换网络

## 🧪 快速测试命令

在PowerShell中运行以下命令进行快速测试：

```powershell
# 设置环境变量
$env:OPENROUTER_API_KEY="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"

# 运行验证脚本
node validate-api-key.js
```

## 📞 获取帮助

如果问题仍然存在，请：

1. 访问 [OpenRouter支持页面](https://openrouter.ai/docs)
2. 检查 [OpenRouter状态页面](https://status.openrouter.ai/)
3. 联系OpenRouter客服

## 🎯 下一步

配置完成后，您可以：

1. 使用API测试页面验证功能
2. 在对话测试页面与AI模型交互
3. 开始使用CodeGuide AI的各项功能

