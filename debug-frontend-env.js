// 前端环境变量调试脚本
// 这个脚本应该在浏览器控制台中运行

console.log('=== 前端环境变量调试 ===');

// 检查process.env中的环境变量
console.log('process.env.NEXT_PUBLIC_OPENROUTER_API_KEY:', 
  typeof process !== 'undefined' && process.env ? 
  (process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ? 'Found' : 'Not found') : 
  'process.env not available');

// 检查localStorage
console.log('localStorage openrouter-api-key:', 
  localStorage.getItem('openrouter-api-key') ? 'Found' : 'Not found');

// 模拟APIKeyHelper的getAPIKey方法
function debugGetAPIKey() {
  console.log('=== 调试 getAPIKey 方法 ===');
  
  if (typeof window === 'undefined') {
    console.log('Server side detected');
    return process.env.OPENROUTER_API_KEY || null;
  }
  
  console.log('Client side detected');
  
  // 检查localStorage
  const localStorageKey = localStorage.getItem('openrouter-api-key');
  console.log('localStorage key:', localStorageKey ? 'Found' : 'Not found');
  if (localStorageKey) {
    return localStorageKey;
  }
  
  // 检查环境变量
  const envKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  console.log('Environment key:', envKey ? 'Found' : 'Not found');
  return envKey || null;
}

// 模拟APIKeyHelper的getAPIKeyStatus方法
function debugGetAPIKeyStatus() {
  console.log('=== 调试 getAPIKeyStatus 方法 ===');
  
  const apiKey = debugGetAPIKey();
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

const status = debugGetAPIKeyStatus();
console.log('Final status:', status);

// 检查是否应该显示诊断信息
const shouldShowDiagnostics = !status.hasKey || !status.isValid;
console.log('Should show diagnostics:', shouldShowDiagnostics);

// 导出到全局作用域以便在控制台中使用
window.debugAPIKey = {
  getAPIKey: debugGetAPIKey,
  getAPIKeyStatus: debugGetAPIKeyStatus
};