#!/usr/bin/env node

/**
 * 诊断API密钥问题
 * 详细检查配置和连接
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

// 验证JWT格式
function validateJWT(token) {
  if (!token) return { valid: false, reason: 'Token为空' };
  if (!token.startsWith('eyJ')) return { valid: false, reason: 'Token格式错误，应该以eyJ开头' };
  
  const parts = token.split('.');
  if (parts.length !== 3) return { valid: false, reason: 'JWT格式错误，应该有3个部分' };
  
  try {
    // 尝试解码header
    const header = JSON.parse(Buffer.from(parts[0], 'base64').toString());
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    
    return { 
      valid: true, 
      header, 
      payload,
      reason: 'Token格式正确'
    };
  } catch (error) {
    return { valid: false, reason: `Token解码失败: ${error.message}` };
  }
}

async function diagnoseAPIKey() {
  console.log('🔍 诊断API密钥问题...\n');

  const env = loadEnvFile();
  if (!env) {
    console.log('请先创建 .env.local 文件');
    return;
  }

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('📋 当前配置:');
  console.log(`- URL: ${supabaseUrl}`);
  console.log(`- Anon Key: ${supabaseAnonKey ? supabaseAnonKey.substring(0, 30) + '...' : '未配置'}`);
  console.log(`- Service Key: ${supabaseServiceKey ? supabaseServiceKey.substring(0, 30) + '...' : '未配置'}`);
  console.log('');

  // 1. 验证URL格式
  console.log('🔍 验证URL格式...');
  if (!supabaseUrl || !supabaseUrl.includes('supabase.co')) {
    console.log('❌ URL格式错误');
    console.log('   正确的格式应该是: https://hjrnlfhyxabhlqljxppn.supabase.co');
  } else {
    console.log('✅ URL格式正确');
  }

  // 2. 验证Anon Key
  console.log('\n🔍 验证Anon Key...');
  if (!supabaseAnonKey) {
    console.log('❌ Anon Key未配置');
  } else {
    const anonValidation = validateJWT(supabaseAnonKey);
    if (anonValidation.valid) {
      console.log('✅ Anon Key格式正确');
      console.log(`   Role: ${anonValidation.payload.role}`);
      console.log(`   Issuer: ${anonValidation.payload.iss}`);
      console.log(`   Expires: ${new Date(anonValidation.payload.exp * 1000).toLocaleString()}`);
    } else {
      console.log(`❌ Anon Key格式错误: ${anonValidation.reason}`);
    }
  }

  // 3. 验证Service Role Key
  console.log('\n🔍 验证Service Role Key...');
  if (!supabaseServiceKey) {
    console.log('❌ Service Role Key未配置');
  } else {
    const serviceValidation = validateJWT(supabaseServiceKey);
    if (serviceValidation.valid) {
      console.log('✅ Service Role Key格式正确');
      console.log(`   Role: ${serviceValidation.payload.role}`);
      console.log(`   Issuer: ${serviceValidation.payload.iss}`);
      console.log(`   Expires: ${new Date(serviceValidation.payload.exp * 1000).toLocaleString()}`);
    } else {
      console.log(`❌ Service Role Key格式错误: ${serviceValidation.reason}`);
    }
  }

  // 4. 测试连接
  console.log('\n🔍 测试Supabase连接...');
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ 无法测试连接，配置不完整');
    return;
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // 测试基本连接
    console.log('📡 测试基本连接...');
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ 连接失败:');
      console.log(`   错误: ${error.message}`);
      console.log(`   代码: ${error.code}`);
      console.log(`   详情: ${error.details || '无'}`);
      console.log(`   提示: ${error.hint || '无'}`);
      
      // 分析错误类型
      if (error.message.includes('Invalid API key')) {
        console.log('\n🔧 解决方案:');
        console.log('1. 检查API密钥是否正确复制');
        console.log('2. 确保没有多余的空格或换行符');
        console.log('3. 从Supabase Dashboard重新复制密钥');
      } else if (error.message.includes('JWT')) {
        console.log('\n🔧 解决方案:');
        console.log('1. API密钥格式错误');
        console.log('2. 检查密钥是否完整');
        console.log('3. 确保密钥以eyJ开头');
      }
    } else {
      console.log('✅ 连接成功！');
      console.log('   数据库响应正常');
    }

  } catch (error) {
    console.log('❌ 连接异常:');
    console.log(`   错误: ${error.message}`);
  }

  console.log('\n📝 下一步建议:');
  console.log('1. 如果API密钥格式错误，请重新从Supabase Dashboard复制');
  console.log('2. 确保复制完整的密钥，不要遗漏任何字符');
  console.log('3. 检查密钥是否过期');
  console.log('4. 确认项目ID是否正确: hjrnlfhyxabhlqljxppn');
}

// 运行诊断
diagnoseAPIKey().catch(console.error);
