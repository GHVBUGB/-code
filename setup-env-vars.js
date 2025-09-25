#!/usr/bin/env node

/**
 * 设置环境变量文件
 * 创建 .env.local 文件
 */

const fs = require('fs');
const path = require('path');

function createEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  
  const envContent = `# OpenRouter API配置
NEXT_PUBLIC_OPENROUTER_API_KEY=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
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=https://hjrnlfhyxabhlqljxppn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqcm5sZmh5eGFiaGxxbGp4cHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzQ4NzQsImV4cCI6MjA1MDU1MDg3NH0.8fe80115f590f34c9db8d3969fae79649e72972f50063e7c01843a5e60684b40
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqcm5sZmh5eGFiaGxxbGp4cHBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDk3NDg3NCwiZXhwIjoyMDUwNTUwODc0fQ.8fe80115f590f34c9db8d3969fae79649e72972f50063e7c01843a5e60684b40
`;

  try {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env.local 文件创建成功！');
    console.log(`   文件路径: ${envPath}`);
    console.log('');
    console.log('📝 环境变量配置:');
    console.log('- OpenRouter API Key: 已配置');
    console.log('- Supabase URL: 已配置');
    console.log('- Supabase Anon Key: 已配置');
    console.log('- Supabase Service Role Key: 已配置');
    console.log('');
    console.log('🚀 现在可以测试用户注册功能了！');
  } catch (error) {
    console.log('❌ 创建 .env.local 文件失败:');
    console.log(`   错误: ${error.message}`);
    console.log('');
    console.log('🔧 请手动创建 .env.local 文件，内容如下:');
    console.log('');
    console.log(envContent);
  }
}

// 运行设置
createEnvFile();
