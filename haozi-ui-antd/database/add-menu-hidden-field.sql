-- 为菜单表添加 hidden 字段
-- 用于控制菜单的显示/隐藏

-- ========================================
-- 1. 添加 hidden 字段
-- ========================================

-- 添加 hidden 字段到 sys_menu 表
ALTER TABLE sys_menu
ADD COLUMN hidden TINYINT(1) DEFAULT 0 COMMENT '是否隐藏菜单：0-显示，1-隐藏'
AFTER icon;

-- ========================================
-- 2. 更新现有数据设置默认值
-- ========================================

-- 确保所有现有菜单默认为显示状态
UPDATE sys_menu
SET hidden = 0
WHERE hidden IS NULL;

-- 如果有字段类型兼容问题，确保字段类型正确
ALTER TABLE sys_menu
MODIFY COLUMN hidden TINYINT(1) NOT NULL DEFAULT 0 COMMENT '是否隐藏菜单：0-显示，1-隐藏';

-- ========================================
-- 3. 可选：设置一些菜单为隐藏状态（示例）
-- ========================================

-- 如果需要，可以设置某些菜单为隐藏状态
-- 例如：将字典管理菜单设置为隐藏
-- UPDATE sys_menu SET hidden = 1 WHERE name = '字典管理';

-- ========================================
-- 4. 更新现有菜单的 meta 配置以包含 hidden 信息
-- ========================================

-- 更新 meta 字段，将 hidden 信息同步到 meta 配置中
UPDATE sys_menu
SET meta = JSON_SET(
    COALESCE(meta, JSON_OBJECT()),
    '$.hidden',
    CASE
        WHEN hidden = 1 THEN JSON_TRUE
        ELSE JSON_FALSE
    END
)
WHERE meta IS NOT NULL OR hidden IS NOT NULL;

-- 对于没有 meta 字段的记录，创建包含 hidden 信息的 meta
UPDATE sys_menu
SET meta = JSON_OBJECT('hidden', CASE WHEN hidden = 1 THEN JSON_TRUE ELSE JSON_FALSE END)
WHERE meta IS NULL AND hidden IS NOT NULL;

-- ========================================
-- 5. 验证字段添加结果
-- ========================================

-- 查看表结构
DESCRIBE sys_menu;

-- 查看 hidden 字段的数据分布
SELECT
    hidden,
    COUNT(*) as count,
    CASE hidden
        WHEN 0 THEN '显示'
        WHEN 1 THEN '隐藏'
        ELSE '未知'
    END as status
FROM sys_menu
GROUP BY hidden;

-- 查看完整的菜单数据（包含新的 hidden 字段）
SELECT
    id,
    parent_id,
    name,
    url,
    icon,
    hidden,
    type,
    meta,
    CASE
        WHEN hidden = 0 THEN '✅ 显示'
        WHEN hidden = 1 THEN '❌ 隐藏'
        ELSE '❓ 未知'
    END as display_status
FROM sys_menu
ORDER BY parent_id, weight;

-- ========================================
-- 6. 索引优化（可选）
-- ========================================

-- 为 hidden 字段添加索引，提高查询性能
CREATE INDEX idx_sys_menu_hidden ON sys_menu(hidden);

-- ========================================
-- 7. 回滚脚本（如果需要）
-- ========================================

/*
-- 如果需要回滚，执行以下SQL：

-- 删除索引
DROP INDEX IF EXISTS idx_sys_menu_hidden ON sys_menu;

-- 删除 hidden 字段
ALTER TABLE sys_menu DROP COLUMN hidden;

*/

-- ========================================
-- 使用说明
-- ========================================

/*
执行步骤：
1. 备份数据库：mysqldump -u root -p haozi > backup_before_add_hidden.sql
2. 执行脚本：mysql -u root -p haozi < add-menu-hidden-field.sql
3. 验证结果：运行最后的SELECT查询检查数据
4. 更新前端代码以支持 hidden 字段

字段说明：
- hidden = 0：菜单显示（默认值）
- hidden = 1：菜单隐藏

注意事项：
- 该字段控制菜单在前端的显示/隐藏
- 隐藏的菜单仍然存在于数据库中，只是不在前端显示
- 可以通过权限控制来决定用户是否能看到隐藏的菜单
*/