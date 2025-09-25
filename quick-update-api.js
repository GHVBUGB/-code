#!/usr/bin/env node

/**
 * 快速更新OpenRouter API密钥
 */

const fs = require('fs');
const path = require('path');

// 这里需要你提供新的API密钥
const NEW_API_KEY = '请在这里粘贴你的新API密钥';

function updateAPIKey() {
  if (NEW_API_KEY === '请在这里粘贴你的新API密钥') {
    console.log('❌ 请先在脚本中设置新的API密钥');
    console.log('');
    console.log('📝 使用方法:');
    console.log('1. 打开此文件: qd/quick-update-api.js');
    console.log('2. 将 NEW_API_KEY 的值替换为你的新密钥');
    console.log('3. 保存文件');
    console.log('4. 运行: node quick-update-api.js');
    return;
  }

  if (!NEW_API_KEY.startsWith('sk-or-v1-')) {
    console.log('❌ API密钥格式错误，应该以 sk-or-v1- 开头');
    return;
  }

  const envPath = path.join(__dirname, '.env.local');
  
  try {
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // 更新API密钥
    envContent = envContent.replace(
      /NEXT_PUBLIC_OPENROUTER_API_KEY=.*/,
      `NEXT_PUBLIC_OPENROUTER_API_KEY=${NEW_API_KEY}`
    );
    
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ OpenRouter API密钥更新成功！');
    console.log(`   新密钥: ${NEW_API_KEY.substring(0, 20)}...`);
    console.log('');
    console.log('🚀 请重启开发服务器以使新配置生效');
    console.log('   按 Ctrl+C 停止服务器，然后重新运行 npm run dev');
    
  } catch (error) {
    console.log('❌ 更新失败:', error.message);
  }
}

updateAPIKey();
