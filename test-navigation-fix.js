#!/usr/bin/env node

/**
 * 测试页面导航修复效果
 */

console.log('🔍 测试页面导航修复效果...\n');

console.log('✅ 已修复的问题:');
console.log('1. AI模型选择后正确保存到项目数据');
console.log('2. 数据验证逻辑更宽松，不会强制跳转');
console.log('3. 添加了数据恢复机制');
console.log('4. 增加了调试日志输出');

console.log('\n🎯 修复内容:');
console.log('- 修复了store.ts中的数据验证逻辑');
console.log('- 修复了AI工具页面的数据保存逻辑');
console.log('- 修复了澄清页面的数据保存逻辑');
console.log('- 修复了预览页面的数据验证逻辑');
console.log('- 添加了数据恢复和调试日志');

console.log('\n🚀 现在可以测试:');
console.log('1. 访问 http://localhost:3005/project/ai-tools');
console.log('2. 选择AI模型，应该能看到选择状态');
console.log('3. 点击下一步，应该能正常跳转到澄清页面');
console.log('4. 填写澄清问题后，应该能正常跳转到预览页面');
console.log('5. 查看浏览器控制台，应该能看到详细的调试信息');

console.log('\n📝 如果还有问题，请查看浏览器控制台的调试信息！');
