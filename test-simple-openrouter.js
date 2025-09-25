#!/usr/bin/env node

/**
 * 简单测试OpenRouter API
 * 使用最基本的请求方式
 */

const fs = require('fs');
const path = require('path');

// 读取环境变量
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local 文件不存在');
    return null;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const env = {};
  
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      env[key.trim()] = valueParts.join('=').trim();
    }
  });

  return env;
}

async function testSimpleOpenRouter() {
  console.log('🔍 简单测试OpenRouter API...\n');

  const env = loadEnvFile();
  if (!env) {
    return;
  }

  const apiKey = env.NEXT_PUBLIC_OPENROUTER_API_KEY;

  console.log('📋 配置信息:');
  console.log(`- API Key: ${apiKey.substring(0, 20)}...`);
  console.log(`- Key长度: ${apiKey.length} 字符`);
  console.log('');

  // 1. 测试最基本的请求
  console.log('🔐 测试最基本的请求...');
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: 'Hi'
          }
        ],
        max_tokens: 5
      })
    });

    console.log(`   状态码: ${response.status}`);
    console.log(`   状态文本: ${response.statusText}`);
    
    const responseText = await response.text();
    console.log(`   响应内容: ${responseText}`);
    
    if (response.ok) {
      console.log('   ✅ 请求成功！');
    } else {
      console.log('   ❌ 请求失败');
      
      // 尝试解析错误
      try {
        const errorData = JSON.parse(responseText);
        console.log(`   错误信息: ${errorData.error?.message || 'Unknown error'}`);
        console.log(`   错误代码: ${errorData.error?.code || 'Unknown'}`);
      } catch {
        console.log(`   原始错误: ${responseText}`);
      }
    }
  } catch (error) {
    console.log(`   ❌ 请求异常: ${error.message}`);
  }

  console.log('\n📝 如果仍然失败，可能的原因:');
  console.log('1. API密钥已过期或被撤销');
  console.log('2. 账户被暂停或限制');
  console.log('3. OpenRouter服务问题');
  console.log('4. 网络连接问题');
  
  console.log('\n🔧 建议操作:');
  console.log('1. 访问 https://openrouter.co/ 检查账户状态');
  console.log('2. 重新生成API密钥');
  console.log('3. 检查账户余额和权限');
  console.log('4. 联系OpenRouter支持');
}

// 运行测试
testSimpleOpenRouter().catch(console.error);
