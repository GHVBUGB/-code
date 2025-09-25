#!/usr/bin/env node

/**
 * 测试AI功能是否正常工作
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

async function testAIFunctionality() {
  console.log('🔍 测试AI功能是否正常工作...\n');

  const env = loadEnvFile();
  if (!env) {
    return;
  }

  const apiKey = env.NEXT_PUBLIC_OPENROUTER_API_KEY;

  // 测试AI推荐功能
  console.log('🤖 测试AI推荐功能...');
  
  try {
    const response = await fetch('http://localhost:3005/api/openrouter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: '/chat/completions',
        method: 'POST',
        apiKey: apiKey,
        data: {
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            {
              role: 'user',
              content: '请为视频内容智能质检系统推荐合适的AI模型。'
            }
          ],
          max_tokens: 200,
          temperature: 0.7
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ AI推荐功能正常');
      console.log(`   响应: ${data.choices?.[0]?.message?.content || 'No content'}`);
    } else {
      console.log('❌ AI推荐功能失败');
      const errorData = await response.json();
      console.log(`   错误: ${errorData.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.log('❌ AI推荐功能异常:', error.message);
  }

  console.log('');

  // 测试需求澄清功能
  console.log('🔍 测试需求澄清功能...');
  
  try {
    const response = await fetch('http://localhost:3005/api/openrouter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        endpoint: '/chat/completions',
        method: 'POST',
        apiKey: apiKey,
        data: {
          model: 'anthropic/claude-3.5-sonnet',
          messages: [
            {
              role: 'user',
              content: '请为视频内容智能质检系统生成3个澄清问题。'
            }
          ],
          max_tokens: 300,
          temperature: 0.7
        }
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ 需求澄清功能正常');
      console.log(`   响应: ${data.choices?.[0]?.message?.content || 'No content'}`);
    } else {
      console.log('❌ 需求澄清功能失败');
      const errorData = await response.json();
      console.log(`   错误: ${errorData.error || 'Unknown error'}`);
    }
  } catch (error) {
    console.log('❌ 需求澄清功能异常:', error.message);
  }

  console.log('\n🎉 AI功能测试完成！');
  console.log('现在你可以正常使用AI推荐和需求澄清功能了！');
}

// 运行测试
testAIFunctionality().catch(console.error);
