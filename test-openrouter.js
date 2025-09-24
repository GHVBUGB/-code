// OpenRouter API 测试脚本
const https = require('https');

// 测试配置
const API_KEY = process.env.OPENROUTER_API_KEY || 'your-api-key-here';
const BASE_URL = 'https://openrouter.ai/api/v1';

// 测试函数
async function testOpenRouterAPI() {
  console.log('🚀 开始测试 OpenRouter API...\n');

  // 测试1: 获取模型列表
  console.log('📋 测试1: 获取模型列表');
  try {
    const modelsResponse = await makeRequest('/models', 'GET');
    console.log('✅ 模型列表获取成功');
    console.log(`📊 可用模型数量: ${modelsResponse.data?.length || 0}`);
    
    // 显示前5个模型
    if (modelsResponse.data && modelsResponse.data.length > 0) {
      console.log('🔍 前5个可用模型:');
      modelsResponse.data.slice(0, 5).forEach((model, index) => {
        console.log(`   ${index + 1}. ${model.id}`);
      });
    }
  } catch (error) {
    console.log('❌ 模型列表获取失败:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // 测试2: 聊天对话
  console.log('💬 测试2: 聊天对话');
  try {
    const chatResponse = await makeRequest('/chat/completions', 'POST', {
      model: 'openai/gpt-4-turbo',
      messages: [
        {
          role: 'user',
          content: '你好，请简单介绍一下你自己，用中文回答。'
        }
      ],
      max_tokens: 100,
      temperature: 0.7
    });

    console.log('✅ 聊天对话成功');
    console.log('🤖 AI回复:', chatResponse.choices?.[0]?.message?.content || '无回复');
    
    if (chatResponse.usage) {
      console.log('📊 Token使用情况:');
      console.log(`   输入: ${chatResponse.usage.prompt_tokens}`);
      console.log(`   输出: ${chatResponse.usage.completion_tokens}`);
      console.log(`   总计: ${chatResponse.usage.total_tokens}`);
    }
  } catch (error) {
    console.log('❌ 聊天对话失败:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // 测试3: 测试不同模型
  console.log('🔄 测试3: 测试不同模型');
  const testModels = [
    'openai/gpt-4-turbo',
    'anthropic/claude-3.5-sonnet',
    'google/gemini-pro-1.5'
  ];

  for (const model of testModels) {
    try {
      console.log(`\n🧪 测试模型: ${model}`);
      const response = await makeRequest('/chat/completions', 'POST', {
        model: model,
        messages: [
          {
            role: 'user',
            content: '请用一句话介绍这个模型的特点。'
          }
        ],
        max_tokens: 50,
        temperature: 0.3
      });

      const reply = response.choices?.[0]?.message?.content || '无回复';
      console.log(`✅ ${model}: ${reply.substring(0, 100)}${reply.length > 100 ? '...' : ''}`);
    } catch (error) {
      console.log(`❌ ${model}: ${error.message}`);
    }
  }

  console.log('\n🎉 测试完成！');
}

// HTTP请求辅助函数
function makeRequest(endpoint, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(BASE_URL + endpoint);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'CodeGuide AI Test'
      }
    };

    if (data && method !== 'GET') {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsedData);
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${parsedData.error?.message || responseData}`));
          }
        } catch (error) {
          reject(new Error(`解析响应失败: ${error.message}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`请求失败: ${error.message}`));
    });

    if (data && method !== 'GET') {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// 检查API密钥
if (!API_KEY || API_KEY === 'your-api-key-here') {
  console.log('⚠️  请设置 OPENROUTER_API_KEY 环境变量');
  console.log('   例如: set OPENROUTER_API_KEY=sk-or-your-key-here');
  console.log('   或者在脚本中直接修改 API_KEY 变量');
  process.exit(1);
}

// 运行测试
testOpenRouterAPI().catch(console.error);
