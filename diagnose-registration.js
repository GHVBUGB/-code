#!/usr/bin/env node

/**
 * 诊断用户注册问题
 * 详细检查RLS策略和认证状态
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

async function diagnoseRegistration() {
  console.log('🔍 诊断用户注册问题...\n');

  const env = loadEnvFile();
  if (!env) {
    return;
  }

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('📡 配置信息:');
  console.log(`- URL: ${supabaseUrl}`);
  console.log(`- Anon Key: ${supabaseAnonKey ? supabaseAnonKey.substring(0, 20) + '...' : '未配置'}`);
  console.log(`- Service Key: ${supabaseServiceKey ? supabaseServiceKey.substring(0, 20) + '...' : '未配置'}`);
  console.log('');

  // 1. 检查RLS策略
  console.log('🔐 检查RLS策略...');
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // 尝试查询RLS策略
    const { data: policies, error: policyError } = await supabase
      .rpc('get_policies', { table_name: 'users' });
    
    if (policyError) {
      console.log('⚠️  无法查询RLS策略（这是正常的）');
    } else {
      console.log('✅ RLS策略查询成功');
      console.log(policies);
    }
  } catch (error) {
    console.log('⚠️  RLS策略检查失败:', error.message);
  }

  // 2. 测试匿名用户插入
  console.log('\n🔐 测试匿名用户插入...');
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const testUser = {
      username: `anon_test_${Date.now()}`,
      email: `anon_test_${Date.now()}@example.com`,
      password_hash: 'test_hash',
      salt: 'test_salt'
    };

    const { data, error } = await supabase
      .from('users')
      .insert(testUser)
      .select();

    if (error) {
      console.log('❌ 匿名用户插入失败:');
      console.log(`   错误: ${error.message}`);
      console.log(`   代码: ${error.code}`);
      console.log(`   详情: ${error.details || '无'}`);
      console.log(`   提示: ${error.hint || '无'}`);
    } else {
      console.log('✅ 匿名用户插入成功！');
      console.log(`   用户ID: ${data[0].id}`);
    }
  } catch (error) {
    console.log('❌ 匿名用户插入异常:', error.message);
  }

  // 3. 测试Service Role插入
  if (supabaseServiceKey) {
    console.log('\n🔐 测试Service Role插入...');
    try {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      });
      
      const testUser = {
        username: `admin_test_${Date.now()}`,
        email: `admin_test_${Date.now()}@example.com`,
        password_hash: 'test_hash',
        salt: 'test_salt'
      };

      const { data, error } = await supabaseAdmin
        .from('users')
        .insert(testUser)
        .select();

      if (error) {
        console.log('❌ Service Role插入失败:');
        console.log(`   错误: ${error.message}`);
        console.log(`   代码: ${error.code}`);
      } else {
        console.log('✅ Service Role插入成功！');
        console.log(`   用户ID: ${data[0].id}`);
      }
    } catch (error) {
      console.log('❌ Service Role插入异常:', error.message);
    }
  } else {
    console.log('\n⚠️  Service Role Key未配置，跳过测试');
  }

  // 4. 检查现有用户
  console.log('\n📊 检查现有用户...');
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    const { data: users, error } = await supabase
      .from('users')
      .select('id, username, email, created_at')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.log('❌ 查询用户失败:', error.message);
    } else {
      console.log(`✅ 查询成功，共找到 ${users.length} 个用户:`);
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.username} (${user.email}) - ${user.created_at}`);
      });
    }
  } catch (error) {
    console.log('❌ 查询用户异常:', error.message);
  }

  console.log('\n🔧 修复建议:');
  console.log('1. 如果匿名用户插入失败，请检查RLS策略');
  console.log('2. 如果Service Role插入成功，说明数据库本身没问题');
  console.log('3. 可能需要使用Service Role进行用户注册');
  console.log('4. 或者修改RLS策略允许匿名用户注册');
}

// 运行诊断
diagnoseRegistration().catch(console.error);
