-- 菜单模块数据库更新脚本
-- 将现有菜单URL更新为React风格格式

-- 1. 更新系统管理菜单
UPDATE sys_menu
SET url = 'system/menu/page'
WHERE name = '菜单管理' AND url IS NOT NULL;

UPDATE sys_menu
SET url = 'system/user/page'
WHERE name = '用户管理' AND url IS NOT NULL;

UPDATE sys_menu
SET url = 'system/role/page'
WHERE name = '角色管理' AND url IS NOT NULL;

UPDATE sys_menu
SET url = 'system/dept/page'
WHERE name = '部门管理' AND url IS NOT NULL;

UPDATE sys_menu
SET url = 'system/post/page'
WHERE name = '岗位管理' AND url IS NOT NULL;

UPDATE sys_menu
SET url = 'system/dict/page'
WHERE name = '字典管理' AND url IS NOT NULL;

UPDATE sys_menu
SET url = 'system/config/page'
WHERE name = '参数配置' AND url IS NOT NULL;

UPDATE sys_menu
SET url = 'system/notice/page'
WHERE name = '通知公告' AND url IS NOT NULL;

UPDATE sys_menu
SET url = 'system/log/page'
WHERE name = '日志管理' AND url IS NOT NULL;

-- 2. 更新监控模块菜单
UPDATE sys_menu
SET url = 'monitor/online/page'
WHERE name = '在线用户' AND url IS NOT NULL;

UPDATE sys_menu
SET url = 'monitor/job/page'
WHERE name = '定时任务' AND url IS NOT NULL;

UPDATE sys_menu
SET url = 'monitor/server/page'
WHERE name = '服务监控' AND url IS NOT NULL;

UPDATE sys_menu
SET url = 'monitor/cache/page'
WHERE name = '缓存监控' AND url IS NOT NULL;

-- 3. 更新其他模块菜单
UPDATE sys_menu
SET url = 'tool/gen/page'
WHERE name = '代码生成' AND url IS NOT NULL;

UPDATE sys_menu
SET url = 'tool/swagger/page'
WHERE name = '系统接口' AND url IS NOT NULL;

-- 4. 验证更新结果
SELECT
    id,
    name,
    url,
    CASE
        WHEN url LIKE '%/page' THEN '✅ 已更新为React风格'
        ELSE '❌ 需要手动检查'
    END AS status
FROM sys_menu
WHERE type = 0
ORDER BY weight, id;

-- 5. 检查是否有遗漏的菜单
SELECT
    id,
    name,
    url,
    '需要手动更新' as note
FROM sys_menu
WHERE type = 0
AND (url IS NULL OR url NOT LIKE '%/page')
ORDER BY weight, id;