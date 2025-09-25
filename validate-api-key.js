// OpenRouter API密钥验证工具
const https = require('https');

// 从命令行参数或环境变量获取API密钥
const apiKey = process.argv[2] || process.env.OPENROUTER_API_KEY;

if (!apiKey) {
  console.log('❌ 请提供API密钥');
  console.log('使用方法: node validate-api-key.js <your-api-key>');
  console.log('或者设置环境变量: set OPENROUTER_API_KEY=your-key');
  process.exit(1);
}

console.log('🔍 开始验证OpenRouter API密钥...\n');

// 验证API密钥格式
function validateFormat(key) {
  console.log('📋 格式验证:');
  
  if (!key) {
    console.log('❌ API密钥为空');
    return false;
  }
  
  if (!key.startsWith('sk-or-')) {
    console.log('❌ API密钥格式错误：必须以 "sk-or-" 开头');
    console.log('   当前密钥开头:', key.substring(0, 10) + '...');
    return false;
  }
  
  if (key.length < 20) {
    console.log('❌ API密钥长度不足：OpenRouter密钥通常较长');
    console.log('   当前长度:', key.length);
    return false;
  }
  
  if (key.length > 200) {
    console.log('❌ API密钥长度过长：请检查是否复制了多余内容');
    console.log('   当前长度:', key.length);
    return false;
  }
  
  // 检查是否包含特殊字符
  const validChars = /^[a-zA-Z0-9_-]+$/
  if (!validChars.test(key.substring(6))) {
    console.log('❌ API密钥包含无效字符：只能包含字母、数字、下划线和连字符');
    return false;
  }
  
  console.log('✅ API密钥格式正确');
  console.log('   密钥长度:', key.length);
  console.log('   密钥前缀:', key.substring(0, 12) + '...');
  return true;
}

// 测试API连接
function testConnection(key) {
  return new Promise((resolve, reject) => {
    console.log('\n🌐 连接测试:');
    
    const options = {
      hostname: 'openrouter.co',
      port: 443,
      path: '/v1/models',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'CodeGuide AI Test'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode === 200) {
            console.log('✅ 连接成功！');
            console.log('   可用模型数量:', response.data?.length || 0);
            
            if (response.data && response.data.length > 0) {
              console.log('   前5个模型:');
              response.data.slice(0, 5).forEach((model, index) => {
                console.log(`     ${index + 1}. ${model.id}`);
              });
            }
            
            resolve({ success: true, data: response });
          } else {
            console.log('❌ 连接失败');
            console.log('   HTTP状态码:', res.statusCode);
            console.log('   错误信息:', response.error?.message || data);
            resolve({ success: false, error: response.error || data });
          }
        } catch (error) {
          console.log('❌ 响应解析失败:', error.message);
          resolve({ success: false, error: error.message });
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ 网络错误:', error.message);
      resolve({ success: false, error: error.message });
    });

    req.setTimeout(10000, () => {
      console.log('❌ 请求超时');
      req.destroy();
      resolve({ success: false, error: '请求超时' });
    });

    req.end();
  });
}

// 测试聊天功能
function testChat(key) {
  return new Promise((resolve, reject) => {
    console.log('\n💬 聊天测试:');
    
    const postData = JSON.stringify({
      model: 'openai/gpt-4-turbo',
      messages: [
        {
          role: 'user',
          content: 'Hello, please respond with "API test successful"'
        }
      ],
      max_tokens: 10,
      temperature: 0.1
    });

    const options = {
      hostname: 'openrouter.co',
      port: 443,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'CodeGuide AI Test',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          
          if (res.statusCode === 200) {
            const aiResponse = response.choices?.[0]?.message?.content || '无回复';
            console.log('✅ 聊天测试成功！');
            console.log('   AI回复:', aiResponse);
            
            if (response.usage) {
              console.log('   Token使用:');
              console.log(`     输入: ${response.usage.prompt_tokens}`);
              console.log(`     输出: ${response.usage.completion_tokens}`);
              console.log(`     总计: ${response.usage.total_tokens}`);
            }
            
            resolve({ success: true, data: response });
          } else {
            console.log('❌ 聊天测试失败');
            console.log('   HTTP状态码:', res.statusCode);
            console.log('   错误信息:', response.error?.message || data);
            resolve({ success: false, error: response.error || data });
          }
        } catch (error) {
          console.log('❌ 响应解析失败:', error.message);
          resolve({ success: false, error: error.message });
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ 网络错误:', error.message);
      resolve({ success: false, error: error.message });
    });

    req.setTimeout(15000, () => {
      console.log('❌ 请求超时');
      req.destroy();
      resolve({ success: false, error: '请求超时' });
    });

    req.write(postData);
    req.end();
  });
}

// 主函数
async function main() {
  // 1. 格式验证
  const formatValid = validateFormat(apiKey);
  if (!formatValid) {
    console.log('\n❌ 格式验证失败，请检查您的API密钥');
    process.exit(1);
  }

  // 2. 连接测试
  const connectionResult = await testConnection(apiKey);
  if (!connectionResult.success) {
    console.log('\n❌ 连接测试失败，请检查网络连接和API密钥');
    process.exit(1);
  }

  // 3. 聊天测试
  const chatResult = await testChat(apiKey);
  if (!chatResult.success) {
    console.log('\n❌ 聊天测试失败，API密钥可能无效或余额不足');
    process.exit(1);
  }

  console.log('\n🎉 所有测试通过！您的OpenRouter API密钥工作正常。');
  console.log('\n💡 建议:');
  console.log('   1. 将API密钥添加到 .env.local 文件中');
  console.log('   2. 访问 http://localhost:3000/api-test 进行更多测试');
  console.log('   3. 访问 http://localhost:3000/playground 进行对话测试');
}

// 运行测试
main().catch(console.error);
