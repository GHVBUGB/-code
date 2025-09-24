// 调试前端模型选择问题
const http = require('http');

function testModelSelection() {
  const models = [
    'anthropic/claude-sonnet-4',
    'anthropic/claude-3.5-sonnet',
    'google/gemini-pro-1.5',
    'baidu/ernie-5', // 这个无效模型
    'meta-llama/llama-3.1-405b-instruct'
  ];

  models.forEach(async (model, index) => {
    console.log(`\n🧪 测试模型 ${index + 1}: ${model}`);
    
    const data = JSON.stringify({
      endpoint: '/chat/completions',
      method: 'POST',
      apiKey: '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',
      data: {
        model: model,
        messages: [
          {
            role: 'user',
            content: 'Hello'
          }
        ],
        max_tokens: 50
      }
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/openrouter',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ ${model} - 成功`);
          try {
            const parsed = JSON.parse(responseBody);
            console.log(`   提供商: ${parsed.provider}`);
            console.log(`   实际模型: ${parsed.model}`);
          } catch (e) {
            console.log('   解析失败');
          }
        } else {
          console.log(`❌ ${model} - 失败 (${res.statusCode})`);
          try {
            const error = JSON.parse(responseBody);
            console.log(`   错误: ${error.error}`);
          } catch (e) {
            console.log('   错误解析失败');
          }
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${model} - 网络错误: ${error.message}`);
    });

    req.write(data);
    req.end();
  });
}

testModelSelection();

