-- 菜单数据快速修复SQL脚本
-- 基于你提供的具体数据结构

-- ========================================
-- 当前数据结构问题分析
-- ========================================
/*
当前问题：
1. ID类型不一致：父菜单是number，子菜单是string
2. URL格式需要调整：sys/menu/index -> 前端会自动映射
3. 缺少图标配置
4. meta字段为null
*/

-- ========================================
-- 核心修复SQL
-- ========================================

-- 1. 修复ID类型问题（将字符串ID转为数字）
UPDATE sys_menu
SET id = CAST(id AS UNSIGNED)
WHERE id REGEXP '^[0-9]+$';

-- 2. 添加默认图标配置
UPDATE sys_menu SET icon = 'SettingOutlined' WHERE name = '系统设置' AND (icon IS NULL OR icon = '');
UPDATE sys_menu SET icon = 'MenuOutlined' WHERE name = '菜单管理' AND (icon IS NULL OR icon = '');
UPDATE sys_menu SET icon = 'UserOutlined' WHERE name = '用户管理' AND (icon IS NULL OR icon = '');
UPDATE sys_menu SET icon = 'TeamOutlined' WHERE name = '角色管理' AND (icon IS NULL OR icon = '');
UPDATE sys_menu SET icon = 'BookOutlined' WHERE name = '字典管理' AND (icon IS NULL OR icon = '');

-- 3. 如果meta字段存在且支持JSON类型，添加默认配置
-- （如果你的数据库还不支持meta字段，请跳过此步骤）

UPDATE sys_menu
SET meta = JSON_OBJECT(
    'deeplink', true,
    'keepAlive', true,
    'modal', JSON_OBJECT('present', 'default', 'width', 680)
)
WHERE type = 0 AND (meta IS NULL OR meta = '');

-- ========================================
-- 验证修复结果
-- ========================================

-- 查看修复后的数据
SELECT
    id,
    parent_id,
    name,
    url,
    icon,
    type,
    meta,
    CASE
        WHEN id REGEXP '^[0-9]+$' THEN '✅ ID为数字'
        ELSE '❌ ID为字符串'
    END as id_status,
    CASE
        WHEN icon IS NOT NULL AND icon != '' THEN '✅ 有图标'
        ELSE '❌ 无图标'
    END as icon_status
FROM sys_menu
ORDER BY parent_id, weight;

-- ========================================
-- 针对你的具体数据更新
-- ========================================

-- 根据你提供的数据，确保以下菜单存在并配置正确
INSERT INTO sys_menu (id, parent_id, weight, name, open_style, meta, icon, perms, type, url) VALUES
(1, 0, 20, '系统设置', 0, JSON_OBJECT('deeplink', true, 'keepAlive', true), 'SettingOutlined', '', 0, NULL)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    icon = VALUES(icon),
    meta = VALUES(meta);

-- 子菜单数据（如果ID格式需要调整）
UPDATE sys_menu SET id = 1950113438223159298 WHERE name = '菜单管理' AND id = '1950113438223159298';
UPDATE sys_menu SET id = 1950113438801973249 WHERE name = '用户管理' AND id = '1950113438801973249';
UPDATE sys_menu SET id = 1950113439309484033 WHERE name = '角色管理' AND id = '1950113439309484033';
UPDATE sys_menu SET id = 1950468170582020097 WHERE name = '字典管理' AND id = '1950468170582020097';

-- 确保子菜单配置正确
UPDATE sys_menu SET
    parent_id = 1,
    weight = 0,
    open_style = 0,
    icon = 'MenuOutlined',
    perms = '',
    type = 0,
    url = 'sys/menu/index',
    meta = JSON_OBJECT('deeplink', true, 'keepAlive', true, 'modal', JSON_OBJECT('present', 'default', 'width', 680))
WHERE name = '菜单管理';

UPDATE sys_menu SET
    parent_id = 1,
    weight = 0,
    open_style = 0,
    icon = 'UserOutlined',
    perms = '',
    type = 0,
    url = 'sys/user/index',
    meta = JSON_OBJECT('deeplink', true, 'keepAlive', true, 'modal', JSON_OBJECT('present', 'default', 'width', 600))
WHERE name = '用户管理';

UPDATE sys_menu SET
    parent_id = 1,
    weight = 0,
    open_style = 0,
    icon = 'TeamOutlined',
    perms = '',
    type = 0,
    url = 'sys/role/index',
    meta = JSON_OBJECT('deeplink', true, 'keepAlive', true, 'modal', JSON_OBJECT('present', 'default', 'width', 600))
WHERE name = '角色管理';

UPDATE sys_menu SET
    parent_id = 1,
    weight = 0,
    open_style = 0,
    icon = 'BookOutlined',
    perms = '',
    type = 0,
    url = 'sys/dict/type',
    meta = JSON_OBJECT('deeplink', true, 'keepAlive', true)
WHERE name = '字典管理';

-- ========================================
-- 使用说明
-- ========================================

/*
执行步骤：
1. 备份数据库：mysqldump -u root -p haozi > backup.sql
2. 执行此SQL脚本：mysql -u root -p haozi < menu-quick-fix.sql
3. 验证结果：运行最后的SELECT查询检查数据
4. 重启应用测试菜单功能

注意事项：
- 如果数据库不支持JSON类型，跳过meta相关操作
- 根据实际表名和字段名调整SQL
- 确保有足够的权限执行ALTER TABLE操作
*/