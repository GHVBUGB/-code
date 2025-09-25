-- 快速修复用户注册问题
-- 在 Supabase SQL Editor 中执行

-- 删除所有现有的用户表策略
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Allow user registration" ON users;
DROP POLICY IF EXISTS "Allow public user registration" ON users;
DROP POLICY IF EXISTS "Service role can manage users" ON users;
DROP POLICY IF EXISTS "Service role full access" ON users;

-- 创建新的策略：允许任何人注册
CREATE POLICY "Allow user registration" ON users
    FOR INSERT 
    WITH CHECK (true);

-- 允许用户查看自己的资料
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT 
    USING (auth.uid()::text = id::text);

-- 允许用户更新自己的资料
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE 
    USING (auth.uid()::text = id::text);

-- 测试注册功能
INSERT INTO users (username, email, password_hash, salt) 
VALUES ('test_registration', 'test@example.com', 'test_hash', 'test_salt')
ON CONFLICT (email) DO NOTHING;

-- 检查结果
SELECT 'Registration test completed' as status, COUNT(*) as total_users FROM users;
