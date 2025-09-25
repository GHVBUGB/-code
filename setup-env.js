#!/usr/bin/env node

/**
 * 环境变量配置脚本
 * 帮助快速设置 Supabase 和 OpenRouter 配置
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function setupEnvironment() {
  console.log('🚀 CodeGuide AI 环境配置向导\n');
  
  // 检查是否已存在 .env.local
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const overwrite = await question('⚠️  .env.local 文件已存在，是否覆盖？(y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('❌ 配置已取消');
      rl.close();
      return;
    }
  }

  console.log('📋 请提供以下配置信息：\n');

  // OpenRouter API 配置
  console.log('🔑 OpenRouter API 配置:');
  const openrouterKey = await question('OpenRouter API Key (必需): ');
  
  if (!openrouterKey || !openrouterKey.startsWith('sk-or-v1-')) {
    console.log('❌ 无效的 OpenRouter API Key，请确保以 sk-or-v1- 开头');
    rl.close();
    return;
  }

  // Supabase 配置
  console.log('\n🗄️  Supabase 配置 (可选，留空将使用本地存储):');
  const supabaseUrl = await question('Supabase URL: ');
  const supabaseAnonKey = await question('Supabase Anon Key: ');
  const supabaseServiceKey = await question('Supabase Service Role Key: ');

  // 生成环境变量内容
  let envContent = `# CodeGuide AI 环境配置
# 生成时间: ${new Date().toISOString()}

# OpenRouter API 配置
NEXT_PUBLIC_OPENROUTER_API_KEY=${openrouterKey}
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

`;

  if (supabaseUrl && supabaseAnonKey) {
    envContent += `# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}
`;

    if (supabaseServiceKey) {
      envContent += `SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceKey}\n`;
    }
  } else {
    envContent += `# Supabase 配置 (未配置，将使用本地存储)
# NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
`;
  }

  // 写入文件
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ 环境配置已保存到 .env.local');
    
    // 显示配置摘要
    console.log('\n📊 配置摘要:');
    console.log(`- OpenRouter API: ${openrouterKey.substring(0, 20)}...`);
    if (supabaseUrl) {
      console.log(`- Supabase URL: ${supabaseUrl}`);
      console.log(`- 数据库模式: Supabase`);
    } else {
      console.log(`- 数据库模式: 本地存储`);
    }
    
    console.log('\n🔄 请重启开发服务器使配置生效:');
    console.log('   npm run dev 或 pnpm dev');
    
  } catch (error) {
    console.error('❌ 保存配置文件失败:', error.message);
  }

  rl.close();
}

// 运行配置向导
setupEnvironment().catch(console.error);
