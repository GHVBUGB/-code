#!/usr/bin/env node

/**
 * 获取正确的Supabase配置
 * 从Supabase Dashboard获取真实的配置信息
 */

console.log('🔍 获取Supabase配置信息...\n');

console.log('📝 请按照以下步骤获取正确的Supabase配置:');
console.log('');
console.log('1. 打开Supabase Dashboard:');
console.log('   https://supabase.com/dashboard');
console.log('');
console.log('2. 选择你的项目: hjrnlfhyxabhlqljxppn');
console.log('');
console.log('3. 进入 Settings > API');
console.log('');
console.log('4. 复制以下信息:');
console.log('   - Project URL');
console.log('   - anon public key');
console.log('   - service_role secret key');
console.log('');
console.log('5. 更新 .env.local 文件中的配置');
console.log('');
console.log('📋 当前配置模板:');
console.log('');
console.log('NEXT_PUBLIC_SUPABASE_URL=https://hjrnlfhyxabhlqljxppn.supabase.co');
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=你的真实anon_key');
console.log('SUPABASE_SERVICE_ROLE_KEY=你的真实service_role_key');
console.log('');
console.log('⚠️  注意:');
console.log('- anon key 以 eyJ 开头');
console.log('- service_role key 也以 eyJ 开头');
console.log('- 两个key都是JWT格式的token');
console.log('');
console.log('🔧 或者，你可以直接执行以下SQL来修复RLS策略:');
console.log('');
console.log('-- 在Supabase SQL Editor中执行:');
console.log('ALTER TABLE users DISABLE ROW LEVEL SECURITY;');
console.log('');
console.log('-- 测试完成后，可以重新启用:');
console.log('-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;');
