-- 修复 RLS 策略，允许用户注册
-- 在 Supabase SQL Editor 中执行

-- 1. 首先检查当前的 RLS 策略
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename IN ('users', 'projects');

-- 2. 删除现有的用户表策略（如果有问题的话）
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- 3. 重新创建用户表的 RLS 策略
-- 允许任何人注册（插入新用户）
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

-- 4. 确保用户表允许插入
-- 临时禁用 RLS 进行测试（可选）
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 5. 重新启用 RLS（如果上面禁用了）
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 6. 测试插入权限
-- 这个查询应该能成功执行
INSERT INTO users (username, email, password_hash, salt) 
VALUES ('test_user_' || extract(epoch from now()), 'test_' || extract(epoch from now()) || '@example.com', 'test_hash', 'test_salt')
ON CONFLICT (email) DO NOTHING;

-- 7. 检查插入结果
SELECT COUNT(*) as user_count FROM users;

-- 8. 如果需要，可以创建一个服务角色策略来绕过 RLS
-- 注意：这需要 service_role 权限
CREATE POLICY "Service role can manage users" ON users
    FOR ALL 
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 完成修复
-- 现在用户注册应该可以正常工作了
