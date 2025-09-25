-- Supabase 用户认证系统数据库配置
-- 在 Supabase SQL Editor 中执行以下脚本

-- 1. 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(32) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- 2. 创建项目表
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100),
    selected_model VARCHAR(100),
    selected_models JSONB DEFAULT '[]',
    selected_tools JSONB DEFAULT '[]',
    selected_tech_stack JSONB DEFAULT '[]',
    clarification_answers JSONB DEFAULT '{}',
    selected_documents JSONB DEFAULT '[]',
    is_generating BOOLEAN DEFAULT false,
    generation_progress INTEGER DEFAULT 0,
    generated_documents JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. 创建API密钥表
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) DEFAULT 'openrouter',
    encrypted_key TEXT NOT NULL,
    model_preference VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. 创建用户设置表
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'system',
    language VARCHAR(10) DEFAULT 'zh-CN',
    notifications JSONB DEFAULT '{}',
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- 6. 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. 为所有表添加更新时间触发器
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_keys_updated_at 
    BEFORE UPDATE ON api_keys 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at 
    BEFORE UPDATE ON user_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. 启用行级安全策略 (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- 9. 创建行级安全策略
-- 用户只能访问自己的数据
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- 项目策略
CREATE POLICY "Users can view own projects" ON projects
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own projects" ON projects
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own projects" ON projects
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- API密钥策略
CREATE POLICY "Users can view own api keys" ON api_keys
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own api keys" ON api_keys
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own api keys" ON api_keys
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own api keys" ON api_keys
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- 用户设置策略
CREATE POLICY "Users can view own settings" ON user_settings
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own settings" ON user_settings
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own settings" ON user_settings
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- 10. 创建一些有用的视图
CREATE OR REPLACE VIEW user_projects_summary AS
SELECT 
    u.id as user_id,
    u.username,
    u.email,
    COUNT(p.id) as project_count,
    MAX(p.created_at) as last_project_created
FROM users u
LEFT JOIN projects p ON u.id = p.user_id
WHERE u.is_active = true
GROUP BY u.id, u.username, u.email;

-- 11. 插入一些测试数据（可选）
-- 注意：这些是测试数据，生产环境中应该删除
INSERT INTO users (username, email, password_hash, salt) VALUES
('testuser', 'test@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2O', 'testsalt123456789012345678901234')
ON CONFLICT (email) DO NOTHING;

-- 12. 创建数据库函数
-- 获取用户项目统计
CREATE OR REPLACE FUNCTION get_user_project_stats(user_uuid UUID)
RETURNS TABLE (
    total_projects BIGINT,
    completed_projects BIGINT,
    generating_projects BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_projects,
        COUNT(*) FILTER (WHERE NOT is_generating) as completed_projects,
        COUNT(*) FILTER (WHERE is_generating) as generating_projects
    FROM projects 
    WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. 创建存储过程
-- 清理过期项目
CREATE OR REPLACE FUNCTION cleanup_old_projects()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM projects 
    WHERE created_at < NOW() - INTERVAL '30 days' 
    AND is_generating = false;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 14. 创建数据库备份脚本（可选）
-- 这个脚本可以定期执行来备份重要数据
CREATE OR REPLACE FUNCTION backup_user_data()
RETURNS TABLE (
    backup_time TIMESTAMP WITH TIME ZONE,
    user_count BIGINT,
    project_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        NOW() as backup_time,
        COUNT(*) as user_count,
        (SELECT COUNT(*) FROM projects) as project_count
    FROM users 
    WHERE is_active = true;
END;
$$ LANGUAGE plpgsql;

-- 15. 创建数据库监控视图
CREATE OR REPLACE VIEW database_stats AS
SELECT 
    'users' as table_name,
    COUNT(*) as record_count,
    MAX(created_at) as last_created
FROM users
WHERE is_active = true
UNION ALL
SELECT 
    'projects' as table_name,
    COUNT(*) as record_count,
    MAX(created_at) as last_created
FROM projects
UNION ALL
SELECT 
    'api_keys' as table_name,
    COUNT(*) as record_count,
    MAX(created_at) as last_created
FROM api_keys
WHERE is_active = true;

-- 完成配置
-- 执行完成后，您的Supabase数据库将包含：
-- 1. 用户表 (users)
-- 2. 项目表 (projects) 
-- 3. API密钥表 (api_keys)
-- 4. 用户设置表 (user_settings)
-- 5. 完整的索引和触发器
-- 6. 行级安全策略
-- 7. 有用的视图和函数
