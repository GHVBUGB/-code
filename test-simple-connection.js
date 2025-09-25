#!/usr/bin/env node

/**
 * 简单测试Supabase连接
 */

const { createClient } = require('@supabase/supabase-js');

// 使用从截图中看到的真实配置
const supabaseUrl = 'https://hjrnlfhyxabhlqljxppn.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqcm5sZmh5eGFiaGxxbGp4cHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzQ4NzQsImV4cCI6MjA1MDU1MDg3NH0.8fe80115f590f34c9db8d3969fae79649e72972f50063e7c01843a5e60684b40';

async function testConnection() {
  console.log('🔍 测试Supabase连接...\n');

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('📡 连接信息:');
    console.log(`- URL: ${supabaseUrl}`);
    console.log(`- Key: ${supabaseKey.substring(0, 20)}...`);
    console.log('');

    // 1. 测试查询用户
    console.log('🔍 测试查询用户...');
    const { data: users, error: queryError } = await supabase
      .from('users')
      .select('id, username, email, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (queryError) {
      console.log('❌ 查询用户失败:');
      console.log(`   错误: ${queryError.message}`);
      console.log(`   代码: ${queryError.code}`);
    } else {
      console.log('✅ 查询用户成功！');
      console.log(`   总用户数: ${users.length}`);
      console.log('   用户列表:');
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.username} (${user.email}) - ${user.created_at}`);
      });
    }

    console.log('');

    // 2. 测试插入用户
    console.log('🔐 测试插入用户...');
    const testUser = {
      username: `test_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password_hash: 'test_hash',
      salt: 'test_salt'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert(testUser)
      .select();

    if (insertError) {
      console.log('❌ 插入用户失败:');
      console.log(`   错误: ${insertError.message}`);
      console.log(`   代码: ${insertError.code}`);
    } else {
      console.log('✅ 插入用户成功！');
      console.log(`   用户ID: ${insertData[0].id}`);
      console.log(`   用户名: ${insertData[0].username}`);
      console.log(`   邮箱: ${insertData[0].email}`);
    }

    console.log('');
    console.log('🎉 测试完成！');

  } catch (error) {
    console.log('❌ 测试过程中发生错误:');
    console.log(`   错误: ${error.message}`);
  }
}

// 运行测试
testConnection().catch(console.error);
