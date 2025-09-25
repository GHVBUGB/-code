#!/usr/bin/env node

/**
 * 更新Supabase配置
 * 使用真实的API密钥
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function updateConfig() {
  console.log('🔧 更新Supabase配置...\n');
  
  console.log('📝 请从Supabase Dashboard获取以下信息:');
  console.log('1. 打开: https://supabase.com/dashboard');
  console.log('2. 选择项目: hjrnlfhyxabhlqljxppn');
  console.log('3. 进入 Settings > API');
  console.log('4. 复制以下信息:\n');

  const projectUrl = await question('Project URL (例如: https://hjrnlfhyxabhlqljxppn.supabase.co): ');
  const anonKey = await question('anon public key (以 eyJ 开头): ');
  const serviceRoleKey = await question('service_role key (以 eyJ 开头): ');

  if (!projectUrl || !anonKey || !serviceRoleKey) {
    console.log('❌ 配置信息不完整，请重新运行脚本');
    rl.close();
    return;
  }

  // 验证密钥格式
  if (!anonKey.startsWith('eyJ') || !serviceRoleKey.startsWith('eyJ')) {
    console.log('⚠️  警告: API密钥格式可能不正确，应该以 eyJ 开头');
  }

  const envContent = `# OpenRouter API配置
NEXT_PUBLIC_OPENROUTER_API_KEY=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
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=${projectUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}
SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}
`;

  try {
    const envPath = path.join(__dirname, '.env.local');
    fs.writeFileSync(envPath, envContent);
    
    console.log('\n✅ .env.local 文件更新成功！');
    console.log(`   文件路径: ${envPath}`);
    console.log('');
    console.log('📝 配置信息:');
    console.log(`- Project URL: ${projectUrl}`);
    console.log(`- Anon Key: ${anonKey.substring(0, 20)}...`);
    console.log(`- Service Role Key: ${serviceRoleKey.substring(0, 20)}...`);
    console.log('');
    console.log('🚀 现在可以测试连接了！');
    console.log('运行: node test-simple-connection.js');
    
  } catch (error) {
    console.log('❌ 更新配置文件失败:');
    console.log(`   错误: ${error.message}`);
  }

  rl.close();
}

// 运行更新
updateConfig().catch(console.error);
