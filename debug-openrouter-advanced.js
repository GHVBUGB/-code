#!/usr/bin/env node

/**
 * 高级调试OpenRouter API问题
 * 检查各种可能的原因
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

async function debugOpenRouterAdvanced() {
  console.log('🔍 高级调试OpenRouter API问题...\n');

  const env = loadEnvFile();
  if (!env) {
    return;
  }

  const apiKey = env.NEXT_PUBLIC_OPENROUTER_API_KEY;

  console.log('📋 当前配置:');
  console.log(`- API Key: ${apiKey ? apiKey.substring(0, 30) + '...' : '未配置'}`);
  console.log(`- Key长度: ${apiKey ? apiKey.length : 0} 字符`);
  console.log('');

  if (!apiKey) {
    console.log('❌ API密钥未配置');
    return;
  }

  // 1. 检查API密钥的详细信息
  console.log('🔍 检查API密钥详细信息...');
  
  // 检查密钥格式
  if (apiKey.startsWith('sk-or-v1-')) {
    console.log('✅ 密钥格式正确 (sk-or-v1-)');
  } else if (apiKey.startsWith('sk-or-')) {
    console.log('⚠️  密钥格式较旧 (sk-or-)，建议使用 sk-or-v1-');
  } else {
    console.log('❌ 密钥格式错误');
    return;
  }

  // 检查密钥长度
  if (apiKey.length < 50) {
    console.log('⚠️  密钥长度可能过短');
  } else {
    console.log('✅ 密钥长度正常');
  }

  // 2. 测试不同的请求方式
  console.log('\n🔐 测试不同的请求方式...\n');

  const testCases = [
    {
      name: '标准请求',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3005',
        'X-Title': 'CodeGuide AI'
      }
    },
    {
      name: '简化请求',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    },
    {
      name: '带User-Agent请求',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CodeGuide-AI/1.0',
        'HTTP-Referer': 'http://localhost:3005'
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`📡 测试: ${testCase.name}`);
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: testCase.headers,
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet',
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
        console.log(`   ✅ 成功: ${testCase.name}`);
        console.log(`   响应: ${data.choices?.[0]?.message?.content || 'No content'}`);
        break; // 找到工作的方式就停止
      } else {
        const errorData = await response.json();
        console.log(`   ❌ 失败: ${errorData.error?.message || 'Unknown error'}`);
        
        // 分析具体错误
        if (response.status === 401) {
          if (errorData.error?.message === 'User not found.') {
            console.log('   🔍 分析: 用户不存在或密钥无效');
          } else if (errorData.error?.message?.includes('Invalid API key')) {
            console.log('   🔍 分析: API密钥格式错误');
          } else if (errorData.error?.message?.includes('Unauthorized')) {
            console.log('   🔍 分析: 未授权访问');
          }
        } else if (response.status === 403) {
          console.log('   🔍 分析: 访问被禁止，可能是账户限制');
        } else if (response.status === 429) {
          console.log('   🔍 分析: 请求频率限制');
        }
      }
    } catch (error) {
      console.log(`   ❌ 异常: ${error.message}`);
    }
    
    console.log('');
  }

  // 3. 测试模型列表端点
  console.log('🔍 测试模型列表端点...');
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`   状态码: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`   ✅ 模型列表获取成功`);
      console.log(`   可用模型数量: ${data.data?.length || 0}`);
    } else {
      const errorData = await response.json();
      console.log(`   ❌ 失败: ${errorData.error?.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.log(`   ❌ 异常: ${error.message}`);
  }

  // 4. 提供详细的解决方案
  console.log('\n🔧 详细解决方案:');
  console.log('');
  console.log('1. 检查OpenRouter账户:');
  console.log('   - 访问: https://openrouter.co/');
  console.log('   - 登录并检查账户状态');
  console.log('   - 确认账户没有被暂停或限制');
  console.log('');
  console.log('2. 检查API密钥:');
  console.log('   - 进入: https://openrouter.co/token');
  console.log('   - 确认密钥状态为"Active"');
  console.log('   - 检查密钥权限和限制');
  console.log('');
  console.log('3. 检查账户余额:');
  console.log('   - 进入: https://openrouter.co/credits');
  console.log('   - 确认有足够余额');
  console.log('   - 检查是否有使用限制');
  console.log('');
  console.log('4. 重新生成密钥:');
  console.log('   - 删除旧密钥');
  console.log('   - 创建新密钥');
  console.log('   - 更新配置');
}

// 运行调试
debugOpenRouterAdvanced().catch(console.error);
