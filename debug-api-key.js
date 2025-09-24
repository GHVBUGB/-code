// 调试API密钥检测问题
console.log('=== 环境变量检查 ===');
console.log('OPENROUTER_API_KEY:', process.env.OPENROUTER_API_KEY ? 'Found' : 'Not found');
console.log('NEXT_PUBLIC_OPENROUTER_API_KEY:', process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ? 'Found' : 'Not found');

// 模拟浏览器环境
global.window = {};
global.localStorage = {
  getItem: (key) => {
    console.log(`localStorage.getItem('${key}') called`);
    if (key === 'openrouter-api-key') {
      return null; // 模拟localStorage中没有密钥
    }
    return null;
  }
};

// 设置环境变量（如果没有的话）
if (!process.env.NEXT_PUBLIC_OPENROUTER_API_KEY) {
  process.env.NEXT_PUBLIC_OPENROUTER_API_KEY = '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';
}

console.log('\n=== 模拟浏览器环境测试 ===');

// 模拟APIKeyHelper的逻辑
function getAPIKey() {
  console.log('getAPIKey() called');
  console.log('typeof window:', typeof window);
  
  if (typeof window === 'undefined') {
    console.log('Server side - checking OPENROUTER_API_KEY');
    return process.env.OPENROUTER_API_KEY || null;
  }
  
  console.log('Client side - checking localStorage first');
  const localStorageKey = localStorage.getItem('openrouter-api-key');
  if (localStorageKey) {
    console.log('Found key in localStorage');
    return localStorageKey;
  }
  
  console.log('No key in localStorage, checking NEXT_PUBLIC_OPENROUTER_API_KEY');
  const envKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  console.log('NEXT_PUBLIC_OPENROUTER_API_KEY value:', envKey ? 'Found' : 'Not found');
  return envKey || null;
}

function getAPIKeyStatus() {
  const apiKey = getAPIKey();
  console.log('Retrieved API key:', apiKey ? 'Found' : 'Not found');
  
  if (!apiKey) {
    return {
      hasKey: false,
      isValid: false,
      error: '未找到API密钥'
    };
  }

  if (!apiKey.startsWith('sk-or-')) {
    return {
      hasKey: true,
      isValid: false,
      error: 'API密钥格式无效，应以"sk-or-"开头',
      keyPreview: apiKey.substring(0, 8) + '...'
    };
  }

  return {
    hasKey: true,
    isValid: true,
    keyPreview: apiKey.substring(0, 12) + '...'
  };
}

console.log('Final status:', JSON.stringify(getAPIKeyStatus(), null, 2));