#!/usr/bin/env node

/**
 * 验证项目ID
 * 检查Supabase项目配置
 */

const { createClient } = require('@supabase/supabase-js');

// 从你的截图中看到的项目信息
const projectId = 'hjrnlfhyxabhlqljxppn';
const projectUrl = `https://${projectId}.supabase.co`;

console.log('🔍 验证Supabase项目配置...\n');

console.log('📋 项目信息:');
console.log(`- 项目ID: ${projectId}`);
console.log(`- 项目URL: ${projectUrl}`);
console.log('');

console.log('🔧 请按照以下步骤验证:');
console.log('');
console.log('1. 打开Supabase Dashboard:');
console.log('   https://supabase.com/dashboard');
console.log('');
console.log('2. 检查项目列表:');
console.log('   - 找到项目ID为 hjrnlfhyxabhlqljxppn 的项目');
console.log('   - 确认项目名称是 "code Guide"');
console.log('');
console.log('3. 进入项目设置:');
console.log('   - 点击项目进入详情页');
console.log('   - 左侧菜单 > Settings > General');
console.log('   - 确认 Reference ID 是: hjrnlfhyxabhlqljxppn');
console.log('');
console.log('4. 获取API密钥:');
console.log('   - 左侧菜单 > Settings > API');
console.log('   - 复制 Project URL（应该和上面显示的一致）');
console.log('   - 复制 anon public key');
console.log('   - 复制 service_role key');
console.log('');
console.log('5. 如果项目ID不匹配:');
console.log('   - 请告诉我正确的项目ID');
console.log('   - 或者选择正确的项目');
console.log('');
console.log('⚠️  重要提示:');
console.log('- 项目ID是URL中的唯一标识符');
console.log('- 每个项目都有独立的API密钥');
console.log('- 确保选择的是正确的项目');
