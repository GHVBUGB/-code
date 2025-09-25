#!/usr/bin/env node

/**
 * 详细诊断OpenRouter API问题
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

async function diagnoseOpenRouter() {
  console.log('🔍 详细诊断OpenRouter API问题...\n');

  const env = loadEnvFile();
  if (!env) {
    return;
  }

  const apiKey = env.NEXT_PUBLIC_OPENROUTER_API_KEY;

  console.log('📋 当前配置:');
  console.log(`- API Key: ${apiKey ? apiKey.substring(0, 30) + '...' : '未配置'}`);
  console.log('');

  if (!apiKey) {
    console.log('❌ API密钥未配置');
    return;
  }

  // 1. 测试不同的API端点
  console.log('🔐 测试不同的API端点...\n');

  const testCases = [
    {
      name: '基础聊天测试',
      endpoint: '/chat/completions',
      data: {
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          {
            role: 'user',
            content: 'Hello, this is a test.'
          }
        ],
        max_tokens: 10,
        temperature: 0.7
      }
    },
    {
      name: '模型列表测试',
      endpoint: '/models',
      data: {}
    }
  ];

  for (const testCase of testCases) {
    console.log(`📡 测试: ${testCase.name}`);
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1' + testCase.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3005',
          'X-Title': 'CodeGuide AI'
        },
        body: JSON.stringify(testCase.data)
      });

      console.log(`   状态码: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ 成功: ${testCase.name}`);
        if (testCase.endpoint === '/models') {
          console.log(`   可用模型数量: ${data.data?.length || 0}`);
        }
      } else {
        const errorData = await response.json();
        console.log(`   ❌ 失败: ${errorData.error?.message || 'Unknown error'}`);
        console.log(`   错误代码: ${errorData.error?.code || 'Unknown'}`);
        
        // 分析具体错误
        if (response.status === 401) {
          if (errorData.error?.message === 'User not found.') {
            console.log('   🔍 分析: API密钥无效或账户不存在');
          } else if (errorData.error?.message?.includes('Invalid API key')) {
            console.log('   🔍 分析: API密钥格式错误');
          } else {
            console.log('   🔍 分析: 认证失败，可能是密钥过期或无效');
          }
        } else if (response.status === 402) {
          console.log('   🔍 分析: 账户余额不足');
        } else if (response.status === 429) {
          console.log('   🔍 分析: 请求频率限制');
        }
      }
    } catch (error) {
      console.log(`   ❌ 异常: ${error.message}`);
    }
    
    console.log('');
  }

  // 2. 检查API密钥格式
  console.log('🔍 检查API密钥格式...');
  if (apiKey.startsWith('sk-or-v1-')) {
    console.log('✅ API密钥格式正确');
  } else {
    console.log('❌ API密钥格式错误，应该以 sk-or-v1- 开头');
  }

  // 3. 提供解决方案
  console.log('\n🔧 可能的解决方案:');
  console.log('1. 检查OpenRouter账户状态');
  console.log('2. 确认账户有足够余额');
  console.log('3. 重新生成API密钥');
  console.log('4. 检查API密钥是否被正确复制');
  console.log('5. 确认账户没有被暂停或限制');
  
  console.log('\n📝 建议操作:');
  console.log('1. 访问: https://openrouter.co/');
  console.log('2. 登录并检查账户状态');
  console.log('3. 查看余额和API使用情况');
  console.log('4. 如有必要，重新生成API密钥');
}

// 运行诊断
diagnoseOpenRouter().catch(console.error);
