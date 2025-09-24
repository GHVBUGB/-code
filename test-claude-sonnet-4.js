// 测试 Claude Sonnet 4 模型
// 使用内置的 fetch API (Node.js 18+)

const API_KEY = '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';
const MODEL = 'anthropic/claude-sonnet-4';

async function testClaudeSonnet4() {
  console.log('🧪 测试 Claude Sonnet 4 模型...');
  console.log(`📋 模型: ${MODEL}`);
  console.log(`🔑 API密钥: ${API_KEY.substring(0, 20)}...`);
  
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3002',
        'X-Title': 'CodeGuide AI Test'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: '你好！请简单介绍一下你自己，并告诉我你是哪个版本的Claude模型。'
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    });

    console.log(`📡 响应状态: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 请求失败:');
      console.error(errorText);
      return;
    }

    const data = await response.json();
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      console.log('✅ 模型响应成功!');
      console.log('🤖 Claude Sonnet 4 回复:');
      console.log('─'.repeat(50));
      console.log(data.choices[0].message.content);
      console.log('─'.repeat(50));
      
      if (data.usage) {
        console.log(`📊 Token使用情况:`);
        console.log(`   输入: ${data.usage.prompt_tokens} tokens`);
        console.log(`   输出: ${data.usage.completion_tokens} tokens`);
        console.log(`   总计: ${data.usage.total_tokens} tokens`);
      }
    } else {
      console.log('⚠️ 响应格式异常:');
      console.log(JSON.stringify(data, null, 2));
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

// 运行测试
testClaudeSonnet4();