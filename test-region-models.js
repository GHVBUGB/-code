#!/usr/bin/env node

/**
 * 测试不同地区的AI模型
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

async function testRegionModels() {
  console.log('🔍 测试不同地区的AI模型...\n');

  const env = loadEnvFile();
  if (!env) {
    return;
  }

  const apiKey = env.NEXT_PUBLIC_OPENROUTER_API_KEY;

  // 测试不同提供商的模型
  const models = [
    {
      id: 'anthropic/claude-3.5-sonnet',
      provider: 'Anthropic',
      description: 'Claude 3.5 Sonnet'
    },
    {
      id: 'google/gemini-pro',
      provider: 'Google',
      description: 'Gemini Pro'
    },
    {
      id: 'meta-llama/llama-3.1-8b-instruct',
      provider: 'Meta',
      description: 'Llama 3.1 8B'
    },
    {
      id: 'mistralai/mistral-7b-instruct',
      provider: 'Mistral',
      description: 'Mistral 7B'
    },
    {
      id: 'deepseek/deepseek-chat',
      provider: 'DeepSeek',
      description: 'DeepSeek Chat'
    }
  ];

  for (const model of models) {
    console.log(`📡 测试模型: ${model.description} (${model.provider})`);
    
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
          model: model.id,
          messages: [
            {
              role: 'user',
              content: 'Hello, this is a test.'
            }
          ],
          max_tokens: 20,
          temperature: 0.7
        })
      });

      console.log(`   状态码: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ 成功: ${model.description}`);
        console.log(`   响应: ${data.choices?.[0]?.message?.content || 'No content'}`);
        console.log('');
        console.log('🎉 找到可用的模型！');
        break; // 找到工作的模型就停止
      } else {
        const errorData = await response.json();
        console.log(`   ❌ 失败: ${errorData.error?.message || 'Unknown error'}`);
        
        // 分析具体错误
        if (response.status === 403) {
          if (errorData.error?.message?.includes('unsupported_country')) {
            console.log('   🔍 分析: 地区不支持');
          } else if (errorData.error?.message?.includes('Provider returned error')) {
            console.log('   🔍 分析: 提供商错误');
          }
        } else if (response.status === 401) {
          console.log('   🔍 分析: 认证失败');
        } else if (response.status === 429) {
          console.log('   🔍 分析: 请求频率限制');
        }
      }
    } catch (error) {
      console.log(`   ❌ 异常: ${error.message}`);
    }
    
    console.log('');
  }

  console.log('📝 建议:');
  console.log('1. 如果所有模型都失败，可能是地区限制');
  console.log('2. 尝试使用VPN或代理');
  console.log('3. 联系OpenRouter支持了解地区限制');
  console.log('4. 考虑使用其他AI服务提供商');
}

// 运行测试
testRegionModels().catch(console.error);
