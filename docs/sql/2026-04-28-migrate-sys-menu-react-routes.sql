-- 将 React 已接管的框架菜单 URL 从旧 Vue 路径迁移为 React 路由路径。
UPDATE sys_menu SET url = '/dashboard' WHERE type = 0 AND url = 'dashboard';
UPDATE sys_menu SET url = '/system/users' WHERE type = 0 AND url = 'sys/user/index';
UPDATE sys_menu SET url = '/system/roles' WHERE type = 0 AND url = 'sys/role/index';
UPDATE sys_menu SET url = '/system/menus' WHERE type = 0 AND url = 'sys/menu/index';
UPDATE sys_menu SET url = '/system/dicts' WHERE type = 0 AND url = 'sys/dict/type';
UPDATE sys_menu SET url = '/system/configs' WHERE type = 0 AND url = 'sys/config/index';
UPDATE sys_menu SET url = '/system/areas' WHERE type = 0 AND url = 'sys/area/index';
UPDATE sys_menu SET url = '/monitor/server' WHERE type = 0 AND url = 'monitor/server/index';
UPDATE sys_menu SET url = '/monitor/cache' WHERE type = 0 AND url = 'monitor/cache/index';

-- 其他历史业务菜单统一改为 React path：去掉结尾 /index，并补齐前导 /。
UPDATE sys_menu
SET url = CONCAT('/', REGEXP_REPLACE(TRIM(BOTH '/' FROM url), '/index$', ''))
WHERE type = 0
  AND url IS NOT NULL
  AND url <> ''
  AND url NOT LIKE '/%'
  AND url NOT LIKE 'http://%'
  AND url NOT LIKE 'https://%';
