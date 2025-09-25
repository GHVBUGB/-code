#!/usr/bin/env node

/**
 * 测试新的API密钥
 */

const { createClient } = require('@supabase/supabase-js');

// 新的API密钥
const supabaseUrl = 'https://hjrnlfhyxabhlqljxppn.supabase.co';
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqcm5sZmh5eGFiaGxxbGp4cHBuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNjAyNDgsImV4cCI6MjA3MzgzNjI0OH0.tJNfaKYTEo0bOVxCMRCQhgUX-uVUr8ECs0g8VNJMkSY';
const serviceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqcm5sZmh5eGFiaGxxbGp4cHBuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI2MDI0OCwiZXhwIjoyMDczODM2MjQ4fQ.O6qKrFNxOFswuGDAMqgzmBoo7Avp_FuB2tqRj6vRb-w';

async function testNewKeys() {
  console.log('🔍 测试新的API密钥...\n');

  console.log('📋 配置信息:');
  console.log(`- URL: ${supabaseUrl}`);
  console.log(`- Anon Key: ${anonKey.substring(0, 30)}...`);
  console.log(`- Service Key: ${serviceKey.substring(0, 30)}...`);
  console.log('');

  // 1. 测试Anon Key
  console.log('🔐 测试Anon Key...');
  try {
    const supabase = createClient(supabaseUrl, anonKey);
    
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ Anon Key测试失败:');
      console.log(`   错误: ${error.message}`);
      console.log(`   代码: ${error.code}`);
    } else {
      console.log('✅ Anon Key测试成功！');
    }
  } catch (error) {
    console.log('❌ Anon Key测试异常:', error.message);
  }

  // 2. 测试Service Role Key
  console.log('\n🔐 测试Service Role Key...');
  try {
    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ Service Role Key测试失败:');
      console.log(`   错误: ${error.message}`);
      console.log(`   代码: ${error.code}`);
    } else {
      console.log('✅ Service Role Key测试成功！');
    }
  } catch (error) {
    console.log('❌ Service Role Key测试异常:', error.message);
  }

  // 3. 测试用户插入（使用Service Role）
  console.log('\n🔐 测试用户插入（Service Role）...');
  try {
    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    
    const testUser = {
      username: `test_new_key_${Date.now()}`,
      email: `test_new_key_${Date.now()}@example.com`,
      password_hash: 'test_hash',
      salt: 'test_salt'
    };

    const { data, error } = await supabaseAdmin
      .from('users')
      .insert(testUser)
      .select();

    if (error) {
      console.log('❌ 用户插入失败:');
      console.log(`   错误: ${error.message}`);
      console.log(`   代码: ${error.code}`);
    } else {
      console.log('✅ 用户插入成功！');
      console.log(`   用户ID: ${data[0].id}`);
      console.log(`   用户名: ${data[0].username}`);
    }
  } catch (error) {
    console.log('❌ 用户插入异常:', error.message);
  }

  console.log('\n📝 如果所有测试都失败，可能的原因:');
  console.log('1. 项目ID不正确');
  console.log('2. API密钥不匹配当前项目');
  console.log('3. 项目状态异常');
  console.log('4. 网络连接问题');
}

// 运行测试
testNewKeys().catch(console.error);
