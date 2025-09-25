#!/usr/bin/env node

/**
 * 测试OpenRouter API权限
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

async function testOpenRouterPermissions() {
  console.log('🔍 测试OpenRouter API权限...\n');

  const env = loadEnvFile();
  if (!env) {
    return;
  }

  const apiKey = env.NEXT_PUBLIC_OPENROUTER_API_KEY;

  // 1. 测试不同的模型
  console.log('🔐 测试不同的AI模型...\n');

  const models = [
    'anthropic/claude-3.5-sonnet',
    'openai/gpt-3.5-turbo',
    'google/gemini-pro',
    'meta-llama/llama-3.1-8b-instruct'
  ];

  for (const model of models) {
    console.log(`📡 测试模型: ${model}`);
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3005',
          'X-Title': 'CodeGuide AI'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: 'Hello'
            }
          ],
          max_tokens: 10,
          temperature: 0.7
        })
      });

      console.log(`   状态码: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ 成功: ${model}`);
        console.log(`   响应: ${data.choices?.[0]?.message?.content || 'No content'}`);
        break; // 找到工作的模型就停止
      } else {
        const errorData = await response.json();
        console.log(`   ❌ 失败: ${errorData.error?.message || 'Unknown error'}`);
        
        // 分析具体错误
        if (response.status === 401) {
          console.log('   🔍 分析: 认证失败');
        } else if (response.status === 403) {
          console.log('   🔍 分析: 访问被禁止');
        } else if (response.status === 404) {
          console.log('   🔍 分析: 模型不存在');
        } else if (response.status === 429) {
          console.log('   🔍 分析: 请求频率限制');
        }
      }
    } catch (error) {
      console.log(`   ❌ 异常: ${error.message}`);
    }
    
    console.log('');
  }

  // 2. 测试账户信息
  console.log('🔍 测试账户信息...');
  try {
    const response = await fetch('https://openrouter.ai/api/v1/auth/key', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`   状态码: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ 账户信息获取成功`);
      console.log(`   账户状态: ${data.data?.status || 'Unknown'}`);
      console.log(`   余额: ${data.data?.credits || 'Unknown'}`);
    } else {
      const errorData = await response.json();
      console.log(`   ❌ 失败: ${errorData.error?.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`   ❌ 异常: ${error.message}`);
  }

  console.log('\n📝 建议:');
  console.log('1. 检查OpenRouter账户是否有聊天权限');
  console.log('2. 确认账户没有被限制特定功能');
  console.log('3. 检查是否有模型访问限制');
  console.log('4. 尝试使用不同的模型');
}

// 运行测试
testOpenRouterPermissions().catch(console.error);
