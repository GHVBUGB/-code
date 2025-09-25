#!/usr/bin/env node

/**
 * 更新OpenRouter API密钥
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

async function updateOpenRouterKey() {
  console.log('🔧 更新OpenRouter API密钥...\n');
  
  console.log('📝 请按照以下步骤获取新的OpenRouter API密钥:');
  console.log('1. 访问: https://openrouter.co/');
  console.log('2. 登录你的账户');
  console.log('3. 进入: https://openrouter.co/token');
  console.log('4. 点击 "Create Key" 创建新密钥');
  console.log('5. 复制完整密钥（格式：sk-or-v1-xxxxxxxx...）');
  console.log('6. 确保账户有足够余额（建议充值$5-10）\n');

  const newApiKey = await question('请输入新的OpenRouter API密钥: ');

  if (!newApiKey || !newApiKey.startsWith('sk-or-v1-')) {
    console.log('❌ API密钥格式错误，应该以 sk-or-v1- 开头');
    rl.close();
    return;
  }

  // 读取当前环境变量
  const envPath = path.join(__dirname, '.env.local');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // 更新API密钥
  const updatedContent = envContent.replace(
    /NEXT_PUBLIC_OPENROUTER_API_KEY=.*/,
    `NEXT_PUBLIC_OPENROUTER_API_KEY=${newApiKey}`
  );

  try {
    fs.writeFileSync(envPath, updatedContent);
    
    console.log('\n✅ OpenRouter API密钥更新成功！');
    console.log(`   新密钥: ${newApiKey.substring(0, 20)}...`);
    console.log('');
    console.log('🚀 现在可以测试AI功能了！');
    console.log('请重启开发服务器以使新配置生效');
    
  } catch (error) {
    console.log('❌ 更新API密钥失败:');
    console.log(`   错误: ${error.message}`);
  }

  rl.close();
}

// 运行更新
updateOpenRouterKey().catch(console.error);
