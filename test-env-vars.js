// 测试Next.js应用中的环境变量
console.log('=== 测试环境变量在Next.js中的可用性 ===');

// 检查所有相关的环境变量
const envVars = [
  'OPENROUTER_API_KEY',
  'NEXT_PUBLIC_OPENROUTER_API_KEY',
  'OPENROUTER_BASE_URL',
  'NEXT_PUBLIC_APP_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET'
];

envVars.forEach(varName => {
  const value = process.env[varName];
  console.log(`${varName}: ${value ? 'Found' : 'Not found'}`);
  if (value && varName.includes('API_KEY')) {
    console.log(`  Preview: ${value.substring(0, 12)}...`);
  }
});

// 检查.env.local文件是否存在
const fs = require('fs');
const path = require('path');

const envLocalPath = path.join(process.cwd(), '.env.local');
console.log('\n=== .env.local 文件检查 ===');
console.log('Path:', envLocalPath);
console.log('Exists:', fs.existsSync(envLocalPath));

if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf8');
  console.log('Content preview:');
  content.split('\n').slice(0, 5).forEach((line, index) => {
    if (line.trim() && !line.startsWith('#')) {
      const [key] = line.split('=');
      console.log(`  Line ${index + 1}: ${key}=...`);
    }
  });
}