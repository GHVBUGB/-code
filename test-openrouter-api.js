#!/usr/bin/env node

/**
 * 测试OpenRouter API连接
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

async function testOpenRouterAPI() {
  console.log('🔍 测试OpenRouter API连接...\n');

  const env = loadEnvFile();
  if (!env) {
    return;
  }

  const apiKey = env.NEXT_PUBLIC_OPENROUTER_API_KEY;

  if (!apiKey) {
    console.log('❌ OpenRouter API密钥未配置');
    return;
  }

  console.log('📋 配置信息:');
  console.log(`- API Key: ${apiKey.substring(0, 20)}...`);
  console.log('');

  try {
    // 测试API连接
    console.log('🔐 测试API连接...');
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3005',
        'X-Title': 'CodeGuide AI'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: 'Hello, this is a test message. Please respond with "API connection successful".'
          }
        ],
        max_tokens: 50,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.log('❌ API连接失败:');
      console.log(`   状态码: ${response.status}`);
      console.log(`   错误: ${errorData.error?.message || 'Unknown error'}`);
      console.log(`   代码: ${errorData.error?.code || 'Unknown'}`);
      
      if (response.status === 401) {
        console.log('\n🔧 解决方案:');
        console.log('1. 检查API密钥是否正确');
        console.log('2. 确保账户有足够余额');
        console.log('3. 重新生成API密钥');
        console.log('4. 运行: node update-openrouter-key.js');
      }
    } else {
      const data = await response.json();
      console.log('✅ API连接成功！');
      console.log(`   响应: ${data.choices?.[0]?.message?.content || 'No content'}`);
    }

  } catch (error) {
    console.log('❌ API测试异常:');
    console.log(`   错误: ${error.message}`);
  }

  console.log('\n📝 如果API连接失败，请:');
  console.log('1. 运行: node update-openrouter-key.js');
  console.log('2. 输入新的有效API密钥');
  console.log('3. 重启开发服务器');
}

// 运行测试
testOpenRouterAPI().catch(console.error);
