#!/usr/bin/env node

/**
 * Supabase 数据库连接测试脚本
 * 验证数据库配置是否正确
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 读取环境变量
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env.local 文件不存在');
    console.log('请先运行: npm run setup');
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

async function testDatabaseConnection() {
  console.log('🔍 测试 Supabase 数据库连接...\n');

  const env = loadEnvFile();
  if (!env) {
    return;
  }

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('⚠️  Supabase 配置未找到，将使用本地存储模式');
    console.log('如需使用 Supabase，请配置以下环境变量：');
    console.log('- NEXT_PUBLIC_SUPABASE_URL');
    console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
    return;
  }

  if (supabaseUrl.includes('your-project') || supabaseKey.includes('your-')) {
    console.log('❌ 请配置真实的 Supabase 信息');
    console.log('当前配置包含占位符，请更新 .env.local 文件');
    return;
  }

  try {
    // 创建 Supabase 客户端
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    console.log('📡 连接信息:');
    console.log(`- URL: ${supabaseUrl}`);
    console.log(`- Key: ${supabaseKey.substring(0, 20)}...`);
    console.log('');

    // 测试连接
    console.log('🔌 测试数据库连接...');
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ 数据库连接失败:');
      console.log(`   错误: ${error.message}`);
      console.log(`   代码: ${error.code}`);
      console.log('');
      console.log('🔧 可能的解决方案:');
      console.log('1. 检查 Supabase URL 是否正确');
      console.log('2. 检查 API Key 是否正确');
      console.log('3. 确认数据库表已创建');
      console.log('4. 检查网络连接');
      return;
    }

    console.log('✅ 数据库连接成功！');
    console.log('');

    // 测试表结构
    console.log('📋 检查数据库表结构...');
    
    const tables = ['users', 'projects'];
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);

        if (error) {
          console.log(`❌ 表 ${table} 不存在或无法访问: ${error.message}`);
        } else {
          console.log(`✅ 表 ${table} 正常`);
        }
      } catch (err) {
        console.log(`❌ 表 ${table} 测试失败: ${err.message}`);
      }
    }

    console.log('');

    // 测试插入权限
    console.log('🔐 测试数据库权限...');
    try {
      const testUser = {
        username: `test_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password_hash: 'test_hash',
        salt: 'test_salt'
      };

      const { data, error } = await supabase
        .from('users')
        .insert(testUser)
        .select();

      if (error) {
        console.log('⚠️  插入权限测试失败（可能是 RLS 策略限制）:');
        console.log(`   错误: ${error.message}`);
        console.log('   这是正常的，因为启用了行级安全策略');
      } else {
        console.log('✅ 插入权限正常');
        // 清理测试数据
        await supabase
          .from('users')
          .delete()
          .eq('id', data[0].id);
      }
    } catch (err) {
      console.log('⚠️  权限测试异常:', err.message);
    }

    console.log('');
    console.log('🎉 数据库配置验证完成！');
    console.log('');
    console.log('📝 下一步:');
    console.log('1. 启动开发服务器: npm run dev');
    console.log('2. 访问测试页面: http://localhost:3000/test-auth');
    console.log('3. 测试用户注册和登录功能');

  } catch (error) {
    console.log('❌ 测试过程中发生错误:');
    console.log(`   错误: ${error.message}`);
    console.log('');
    console.log('🔧 请检查:');
    console.log('1. 网络连接是否正常');
    console.log('2. Supabase 项目是否正常运行');
    console.log('3. 环境变量配置是否正确');
  }
}

// 运行测试
testDatabaseConnection().catch(console.error);
