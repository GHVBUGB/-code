#!/usr/bin/env node

/**
 * 使用新的API密钥更新配置
 */

const fs = require('fs');
const path = require('path');

function updateConfig() {
  console.log('🔧 使用新的API密钥更新配置...\n');

  // 新的API密钥
  const newAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqcm5sZmh5eGFiaGxxbGp4cHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNjAyNDgsImV4cCI6MjA3MzgzNjI0OH0.tJNfaKYTEo0bOVxCMRCQhgUX-uVUr8ECs0g8VNJMkSY';
  const newServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqcm5sZmh5eGFiaGxxbGp4cHBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI2MDI0OCwiZXhwIjoyMDczODM2MjQ4fQ.O6qKrFNxOFswuGDAMqgzmBoo7Avp_FuB2tqRj6vRb-w';

  const envContent = `# OpenRouter API配置
NEXT_PUBLIC_OPENROUTER_API_KEY=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
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=https://hjrnlfhyxabhlqljxppn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=${newAnonKey}
SUPABASE_SERVICE_ROLE_KEY=${newServiceKey}
`;

  try {
    const envPath = path.join(__dirname, '.env.local');
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ .env.local 文件更新成功！');
    console.log(`   文件路径: ${envPath}`);
    console.log('');
    console.log('📝 新配置信息:');
    console.log(`- Project URL: https://hjrnlfhyxabhlqljxppn.supabase.co`);
    console.log(`- Anon Key: ${newAnonKey.substring(0, 30)}...`);
    console.log(`- Service Key: ${newServiceKey.substring(0, 30)}...`);
    console.log('');
    console.log('🚀 现在测试连接...');
    
  } catch (error) {
    console.log('❌ 更新配置文件失败:');
    console.log(`   错误: ${error.message}`);
  }
}

// 运行更新
updateConfig();
