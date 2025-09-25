#!/usr/bin/env node

/**
 * 测试用户注册修复
 * 验证RLS策略修复是否成功
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

async function testUserRegistration() {
  console.log('🔍 测试用户注册功能...\n');

  const env = loadEnvFile();
  if (!env) {
    return;
  }

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Supabase 配置未找到');
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('📡 连接信息:');
    console.log(`- URL: ${supabaseUrl}`);
    console.log(`- Key: ${supabaseKey.substring(0, 20)}...`);
    console.log('');

    // 测试用户注册
    console.log('🔐 测试用户注册...');
    
    const testUser = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password_hash: 'test_hash_123',
      salt: 'test_salt_123'
    };

    const { data, error } = await supabase
      .from('users')
      .insert(testUser)
      .select();

    if (error) {
      console.log('❌ 用户注册失败:');
      console.log(`   错误: ${error.message}`);
      console.log(`   代码: ${error.code}`);
      console.log('');
      console.log('🔧 请执行以下SQL脚本修复问题:');
      console.log('1. 打开 Supabase Dashboard');
      console.log('2. 进入 SQL Editor');
      console.log('3. 执行 quick-fix-registration.sql 文件中的SQL语句');
      return;
    }

    console.log('✅ 用户注册成功！');
    console.log(`   用户ID: ${data[0].id}`);
    console.log(`   用户名: ${data[0].username}`);
    console.log(`   邮箱: ${data[0].email}`);
    console.log('');

    // 测试用户查询
    console.log('🔍 测试用户查询...');
    const { data: users, error: queryError } = await supabase
      .from('users')
      .select('id, username, email, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (queryError) {
      console.log('⚠️  用户查询失败:', queryError.message);
    } else {
      console.log('✅ 用户查询成功！');
      console.log(`   总用户数: ${users.length}`);
      console.log('   最新用户:');
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.username} (${user.email}) - ${user.created_at}`);
      });
    }

    console.log('');
    console.log('🎉 用户注册功能测试完成！');
    console.log('');
    console.log('📝 下一步:');
    console.log('1. 启动开发服务器: npm run dev');
    console.log('2. 访问注册页面: http://localhost:3000/auth/register');
    console.log('3. 测试真实的用户注册流程');

  } catch (error) {
    console.log('❌ 测试过程中发生错误:');
    console.log(`   错误: ${error.message}`);
  }
}

// 运行测试
testUserRegistration().catch(console.error);
