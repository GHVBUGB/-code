#!/usr/bin/env node

/**
 * 手动配置Supabase
 * 提供配置模板和说明
 */

const fs = require('fs');
const path = require('path');

function createConfigTemplate() {
  console.log('🔧 Supabase配置设置指南\n');
  
  console.log('📝 请按照以下步骤获取正确的Supabase配置:\n');
  
  console.log('1. 打开Supabase Dashboard:');
  console.log('   https://supabase.com/dashboard\n');
  
  console.log('2. 确保选择正确的项目:');
  console.log('   项目ID: hjrnlfhyxabhlqljxppn');
  console.log('   项目名称: code Guide\n');
  
  console.log('3. 进入API设置:');
  console.log('   左侧菜单 > Settings > API\n');
  
  console.log('4. 复制以下信息:');
  console.log('   - Project URL');
  console.log('   - anon public key');
  console.log('   - service_role key\n');
  
  console.log('5. 创建 .env.local 文件，内容如下:\n');
  
  const configTemplate = `# OpenRouter API配置
NEXT_PUBLIC_OPENROUTER_API_KEY=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
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Supabase配置 - 请替换为你的真实配置
NEXT_PUBLIC_SUPABASE_URL=https://hjrnlfhyxabhlqljxppn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的真实anon_public_key
SUPABASE_SERVICE_ROLE_KEY=你的真实service_role_key`;

  console.log(configTemplate);
  console.log('\n6. 将上面的配置保存为 .env.local 文件');
  console.log('7. 替换占位符为你的真实配置');
  console.log('8. 运行测试: node test-simple-connection.js\n');
  
  console.log('⚠️  重要提示:');
  console.log('- anon key 和 service_role key 都应该以 eyJ 开头');
  console.log('- 这些是JWT格式的token，很长');
  console.log('- 确保复制完整的key，不要遗漏任何字符\n');
  
  console.log('🔍 如果还是有问题，请检查:');
  console.log('1. 项目ID是否正确: hjrnlfhyxabhlqljxppn');
  console.log('2. API密钥是否完整复制');
  console.log('3. 项目是否处于活跃状态');
}

// 运行配置指南
createConfigTemplate();
