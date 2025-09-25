-- 修复用户注册RLS策略问题
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. 首先检查当前的RLS策略状态
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    roles, 
    cmd, 
    qual, 
    with_check
FROM pg_policies 
WHERE tablename = 'users';

-- 2. 删除现有的有问题的用户表策略
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Allow user registration" ON users;
DROP POLICY IF EXISTS "Service role can manage users" ON users;

-- 3. 重新创建正确的RLS策略

-- 允许任何人注册（插入新用户）- 这是关键！
CREATE POLICY "Allow public user registration" ON users
    FOR INSERT 
    TO public
    WITH CHECK (true);

-- 允许用户查看自己的资料
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT 
    TO public
    USING (auth.uid()::text = id::text);

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

-- 4. 为service_role创建完全访问权限（用于管理操作）
CREATE POLICY "Service role full access" ON users
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 5. 测试插入权限
-- 这个查询应该能成功执行
INSERT INTO users (username, email, password_hash, salt) 
VALUES ('test_user_' || extract(epoch from now()), 'test_' || extract(epoch from now()) || '@example.com', 'test_hash', 'test_salt')
ON CONFLICT (email) DO NOTHING;

-- 6. 检查插入结果
SELECT COUNT(*) as user_count FROM users;

-- 7. 显示最新的用户记录
SELECT id, username, email, created_at 
FROM users 
ORDER BY created_at DESC 
LIMIT 5;

-- 完成修复
-- 现在用户注册应该可以正常工作了
