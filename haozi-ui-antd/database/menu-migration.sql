-- 菜单数据结构迁移SQL脚本
-- 用于将现有菜单数据调整为前端兼容格式

-- ========================================
-- 1. 统一ID字段类型（将string类型的ID转换为number）
-- ========================================

-- 更新子菜单ID为number类型（假设ID实际是数字但存储为字符串）
UPDATE sys_menu
SET id = CAST(id AS UNSIGNED)
WHERE id REGEXP '^[0-9]+$';

-- 更新parentID为number类型
UPDATE sys_menu
SET parentId = CAST(parentId AS UNSIGNED)
WHERE parentId REGEXP '^[0-9]+$';

-- ========================================
-- 2. 更新菜单URL格式映射
-- ========================================

-- 系统设置菜单（如果需要URL的话）
UPDATE sys_menu
SET url = 'sys/system/index'
WHERE name = '系统设置' AND (url IS NULL OR url = '');

-- 菜单管理URL映射
UPDATE sys_menu
SET url = 'sys/menu/index'
WHERE name = '菜单管理' AND (url != 'sys/menu/index');

-- 用户管理URL映射
UPDATE sys_menu
SET url = 'sys/user/index'
WHERE name = '用户管理' AND (url != 'sys/user/index');

-- 角色管理URL映射
UPDATE sys_menu
SET url = 'sys/role/index'
WHERE name = '角色管理' AND (url != 'sys/role/index');

-- 字典管理URL映射
UPDATE sys_menu
SET url = 'sys/dict/type'
WHERE name = '字典管理' AND (url != 'sys/dict/type');

-- ========================================
-- 3. 添加默认图标（如果需要的话）
-- ========================================

-- 为系统设置添加图标
UPDATE sys_menu
SET icon = 'SettingOutlined'
WHERE name = '系统设置' AND (icon IS NULL OR icon = '');

-- 为菜单管理添加图标
UPDATE sys_menu
SET icon = 'MenuOutlined'
WHERE name = '菜单管理' AND (icon IS NULL OR icon = '');

-- 为用户管理添加图标
UPDATE sys_menu
SET icon = 'UserOutlined'
WHERE name = '用户管理' AND (icon IS NULL OR icon = '');

-- 为角色管理添加图标
UPDATE sys_menu
SET icon = 'TeamOutlined'
WHERE name = '角色管理' AND (icon IS NULL OR icon = '');

-- 为字典管理添加图标
UPDATE sys_menu
SET icon = 'BookOutlined'
WHERE name = '字典管理' AND (icon IS NULL OR icon = '');

-- ========================================
-- 4. 初始化meta字段（如果你的表已经支持meta字段）
-- ========================================

-- 如果meta字段是JSON类型且已存在，执行以下更新

-- 为菜单类型的项目添加默认meta配置
UPDATE sys_menu
SET meta = JSON_OBJECT(
    'deeplink', true,
    'keepAlive', true,
    'modal', JSON_OBJECT(
        'present', 'default',
        'width', 680
    )
)
WHERE type = 0 AND (meta IS NULL OR meta = '');

-- 为按钮类型的项目添加默认meta配置
UPDATE sys_menu
SET meta = JSON_OBJECT(
    'deeplink', false,
    'keepAlive', false
)
WHERE type = 1 AND (meta IS NULL OR meta = '');

-- 为接口类型的项目添加默认meta配置
UPDATE sys_menu
SET meta = JSON_OBJECT(
    'deeplink', false,
    'keepAlive', false
)
WHERE type = 2 AND (meta IS NULL OR meta = '');

-- ========================================
-- 5. 数据验证查询
-- ========================================

-- 检查ID类型是否正确
SELECT
    id,
    typeof_id:
        CASE
            WHEN id REGEXP '^[0-9]+$' THEN 'NUMBER'
            ELSE 'STRING'
        END,
    parentId,
    typeof_parentId:
        CASE
            WHEN parentId REGEXP '^[0-9]+$' THEN 'NUMBER'
            ELSE 'STRING'
        END,
    name,
    url,
    icon,
    type,
    meta
FROM sys_menu
ORDER BY parentId, weight;

-- 检查URL映射是否正确
SELECT
    name,
    url,
    CASE url
        WHEN 'sys/menu/index' THEN '✅ 菜单管理URL正确'
        WHEN 'sys/user/index' THEN '✅ 用户管理URL正确'
        WHEN 'sys/role/index' THEN '✅ 角色管理URL正确'
        WHEN 'sys/dict/type' THEN '✅ 字典管理URL正确'
        WHEN IS NULL OR url = '' THEN '⚠️ URL为空'
        ELSE '❓ 其他URL'
    END as url_status
FROM sys_menu
WHERE type = 0
ORDER BY parentId, weight;

-- ========================================
-- 6. 回滚脚本（如果需要的话）
-- ========================================

/*
-- 如果需要回滚URL更改，执行以下SQL：

UPDATE sys_menu SET url = NULL WHERE name IN (
    '系统设置', '菜单管理', '用户管理', '角色管理', '字典管理'
);

-- 如果需要回滚图标更改，执行以下SQL：

UPDATE sys_menu SET icon = NULL WHERE name IN (
    '系统设置', '菜单管理', '用户管理', '角色管理', '字典管理'
);

-- 如果需要回滚meta字段，执行以下SQL：

UPDATE sys_menu SET meta = NULL;
*/

-- ========================================
-- 注意事项
-- ========================================

/*
1. 执行前请备份数据库：
   mysqldump -u username -p database_name > backup_before_menu_migration.sql

2. 根据你的实际数据库调整表名和字段名
   - 如果表名不是 sys_menu，请替换为实际的表名
   - 如果字段名有差异，请相应调整

3. 检查数据类型：
   - 确保id和parentId字段支持存储大数字
   - 如果需要，可以修改字段类型：ALTER TABLE sys_menu MODIFY id BIGINT;

4. meta字段支持：
   - 如果你的数据库版本不支持JSON类型，请使用TEXT类型
   - 或者暂时跳过meta相关的更新

5. 图标名称：
   - 确保图标名称与前端使用的Ant Design图标名称一致
   - 可以根据实际需要修改图标名称
*/