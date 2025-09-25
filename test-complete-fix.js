#!/usr/bin/env node

/**
 * 测试完整修复后的用户注册功能
 */

const { createClient } = require('@supabase/supabase-js');
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

async function testCompleteFix() {
  console.log('🔍 测试完整修复后的用户注册功能...\n');

  const env = loadEnvFile();
  if (!env) {
    return;
  }

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    console.log('📡 连接信息:');
    console.log(`- URL: ${supabaseUrl}`);
    console.log(`- Key: ${supabaseAnonKey.substring(0, 20)}...`);
    console.log('');

    // 1. 测试用户注册
    console.log('🔐 测试用户注册...');
    
    const testUser = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password_hash: 'test_hash_123',
      salt: 'test_salt_123'
    };

    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert(testUser)
      .select();

    if (insertError) {
      console.log('❌ 用户注册失败:');
      console.log(`   错误: ${insertError.message}`);
      console.log(`   代码: ${insertError.code}`);
      console.log('');
      console.log('🔧 请执行 complete-rls-fix.sql 脚本修复问题');
      return;
    }

    console.log('✅ 用户注册成功！');
    console.log(`   用户ID: ${insertData[0].id}`);
    console.log(`   用户名: ${insertData[0].username}`);
    console.log(`   邮箱: ${insertData[0].email}`);
    console.log('');

    // 2. 测试用户查询
    console.log('🔍 测试用户查询...');
    const { data: users, error: queryError } = await supabase
      .from('users')
      .select('id, username, email, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (queryError) {
      console.log('❌ 用户查询失败:', queryError.message);
    } else {
      console.log('✅ 用户查询成功！');
      console.log(`   总用户数: ${users.length}`);
      console.log('   用户列表:');
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.username} (${user.email}) - ${user.created_at}`);
      });
    }

    console.log('');
    console.log('🎉 用户注册功能测试完成！');
    console.log('');
    console.log('📝 现在可以:');
    console.log('1. 启动开发服务器: npm run dev');
    console.log('2. 访问注册页面: http://localhost:3000/auth/register');
    console.log('3. 测试真实的用户注册流程');

  } catch (error) {
    console.log('❌ 测试过程中发生错误:');
    console.log(`   错误: ${error.message}`);
  }
}

// 运行测试
testCompleteFix().catch(console.error);
