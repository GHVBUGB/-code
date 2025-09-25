-- 完整修复RLS策略问题
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 删除所有现有的用户表策略
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Allow user registration" ON users;
DROP POLICY IF EXISTS "Allow public user registration" ON users;
DROP POLICY IF EXISTS "Service role can manage users" ON users;
DROP POLICY IF EXISTS "Service role full access" ON users;

-- 2. 创建新的RLS策略

-- 允许任何人注册（插入新用户）
CREATE POLICY "Allow user registration" ON users
    FOR INSERT 
    TO public
    WITH CHECK (true);

-- 允许任何人查看用户列表（用于调试和验证）
CREATE POLICY "Allow public user viewing" ON users
    FOR SELECT 
    TO public
    USING (true);

-- 允许用户更新自己的资料
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE 
    TO public
    USING (auth.uid()::text = id::text)
    WITH CHECK (auth.uid()::text = id::text);

-- 允许用户删除自己的资料
CREATE POLICY "Users can delete own profile" ON users
    FOR DELETE 
    TO public
    USING (auth.uid()::text = id::text);

-- 为service_role创建完全访问权限
CREATE POLICY "Service role full access" ON users
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 3. 测试插入和查询
INSERT INTO users (username, email, password_hash, salt) 
VALUES ('test_complete_fix', 'test_complete@example.com', 'test_hash', 'test_salt')
ON CONFLICT (email) DO NOTHING;

-- 4. 验证结果
SELECT 'RLS策略修复完成' as status, COUNT(*) as total_users FROM users;

-- 5. 显示所有用户
SELECT id, username, email, created_at 
FROM users 
ORDER BY created_at DESC;
