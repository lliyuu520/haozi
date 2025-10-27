# React风格URL使用指南

## 📋 概述

本指南详细说明了如何使用React风格的URL格式（如 `system/menu/page`）来消除前端硬编码，实现动态路由系统。

## 🎯 核心优势

### 1. 消除硬编码
- ❌ **旧方式**: `router.push('/system/menu/modal/create')`
- ✅ **新方式**: `router.push(menu.getModalRoute('create'))`

### 2. 动态路由生成
- 自动根据菜单URL生成前端路由
- 支持动态面包屑和导航
- 统一的URL规范

### 3. 类型安全
- TypeScript类型支持
- 编译时错误检查
- 智能代码提示

## 🔧 URL格式规范

### 页面路由
```
格式: {module}/{submodule}/page
示例: system/menu/page
示例: system/user/page
示例: dashboard/analytics/page
```

### 模态框路由
```
格式: {module}/{submodule}/modal/{action}/{id?}
示例: system/menu/modal/create
示例: system/menu/modal/edit/123
示例: system/user/modal/view/456
```

## 📦 使用方法

### 1. 路由工具类

```typescript
import { RouteHelper } from '@/utils/routeHelper';

// 基础路由生成
const route = RouteHelper.generateRoute('system/menu/page');
// 结果: "/system/menu/page"

// 模态框路由生成
const createRoute = RouteHelper.generateModalRoute('system/menu/page', 'create');
// 结果: "/system/menu/modal/create"

const editRoute = RouteHelper.generateModalRoute('system/menu/page', 'edit', '123');
// 结果: "/system/menu/modal/edit/123"

// 面包屑生成
const breadcrumbs = RouteHelper.parseBreadcrumbs('system/menu/page');
// 结果: ["system", "menu"]
```

### 2. 菜单导航Hook

```typescript
import { useMenuNavigation } from '@/hooks/useMenuNavigation';

function MyComponent() {
  const { openCreateModal, openEditModal, navigateToMenu } = useMenuNavigation();

  // 打开创建模态框
  const handleCreate = () => {
    openCreateModal('system/menu/page');
  };

  // 打开编辑模态框
  const handleEdit = (menu: NavigableMenuItem) => {
    openEditModal(menu);
  };

  // 导航到菜单页面
  const handleNavigate = (menuUrl: string) => {
    navigateToMenu(menuUrl);
  };
}
```

### 3. 菜单服务增强

```typescript
import {
  getMenuListNavigable,
  MenuNavigationHelper,
  createMenuWithNavigation
} from '@/services/menu';

// 获取可导航菜单列表
const { data: menus } = await getMenuListNavigable();

// 使用菜单导航方法
menus.forEach(menu => {
  console.log(menu.getRoute()); // "/system/menu/page"
  console.log(menu.getModalRoute('create')); // "/system/menu/modal/create"
  console.log(menu.getBasePath()); // "/system/menu"
});

// 创建菜单（自动处理URL格式）
await createMenuWithNavigation({
  name: '用户管理',
  url: 'system/user', // 会自动转换为 "system/user/page"
  type: MenuType.MENU,
  // ...其他字段
});
```

### 4. 动态面包屑组件

```typescript
import { DynamicBreadcrumb, MenuBreadcrumb } from '@/components/ui/DynamicBreadcrumb';

// 自动面包屑
<DynamicBreadcrumb />

// 基于菜单URL的面包屑
<MenuBreadcrumb menuUrl="system/menu/page" />
```

## 🔄 迁移指南

### 1. 数据库配置更新

将现有菜单URL更新为React风格：

```sql
-- 旧格式 -> 新格式
UPDATE sys_menu SET url = 'system/menu/page' WHERE url = '/system/menu';
UPDATE sys_menu SET url = 'system/user/page' WHERE url = '/system/user';
UPDATE sys_menu SET url = 'system/role/page' WHERE url = '/system/role';
```

### 2. 前端代码迁移

**硬编码路由迁移：**

```typescript
// ❌ 旧代码
router.push('/system/menu/modal/create');
router.push(`/system/menu/modal/edit/${record.id}`);

// ✅ 新代码
const { openCreateModal, openEditModal } = useMenuNavigation();
openCreateModal('system/menu/page');
openEditMenu(record);
```

**组件导入迁移：**

```typescript
// ❌ 旧代码
const MenuPage = lazy(() => import('@/app/(system)/system/menu/page'));

// ✅ 新代码（动态导入）
const MenuPage = lazy(() => import(`@/app/(system)/${menu.url}`));
```

## 🛡️ 类型定义

### NavigableMenuItem

```typescript
interface NavigableMenuItem extends MenuItem {
  getNavigation: () => MenuNavigationInfo;
  getRoute: () => string;
  getModalRoute: (action: string, id?: string) => string;
  getBasePath: () => string;
}
```

### MenuNavigationInfo

```typescript
interface MenuNavigationInfo {
  href: string;           // "/system/menu/page"
  basePath: string;       // "/system/menu"
  modal: {
    create: string;       // "/system/menu/modal/create"
    edit: (id: string) => string; // "/system/menu/modal/edit/123"
  };
  breadcrumbs: string[];  // ["system", "menu"]
  modulePath: string;     // "system/menu"
}
```

## ⚡ 性能优化

### 1. 懒加载支持

```typescript
// 动态组件导入
const loadPageComponent = (menuUrl: string) => {
  const componentPath = `@/app/(system)/${menuUrl}`;
  return lazy(() => import(componentPath));
};
```

### 2. 缓存机制

```typescript
// 路由缓存
const routeCache = new Map<string, string>();

const getCachedRoute = (menuUrl: string) => {
  if (!routeCache.has(menuUrl)) {
    routeCache.set(menuUrl, RouteHelper.generateRoute(menuUrl));
  }
  return routeCache.get(menuUrl)!;
};
```

## 🧪 测试用例

### URL格式验证

```typescript
import { MenuUtils } from '@/types/menu';

// 有效URL
const validResult = MenuUtils.validateAndNormalizeUrl('system/menu/page');
// 结果: { isValid: true, normalizedUrl: "system/menu/page" }

// 无效URL
const invalidResult = MenuUtils.validateAndNormalizeUrl('invalid-url');
// 结果: { isValid: false, message: "URL格式不正确..." }
```

### 导航功能测试

```typescript
// 测试菜单导航
const menu = MenuNavigationHelper.makeNavigable({
  id: '1',
  url: 'system/menu/page',
  name: '菜单管理'
});

expect(menu.getRoute()).toBe('/system/menu/page');
expect(menu.getModalRoute('create')).toBe('/system/menu/modal/create');
expect(menu.getModalRoute('edit', '123')).toBe('/system/menu/modal/edit/123');
```

## 🔧 最佳实践

### 1. URL命名规范

- 使用小写字母和连字符
- 模块名使用单数形式
- 避免深层嵌套（建议不超过3层）

### 2. 错误处理

```typescript
const safeNavigate = (menu: NavigableMenuItem) => {
  try {
    const route = menu.getRoute();
    router.push(route);
  } catch (error) {
    console.error('导航失败:', error);
    message.error('页面跳转失败');
  }
};
```

### 3. 开发调试

```typescript
// 开发环境下的路由调试
if (process.env.NODE_ENV === 'development') {
  console.log('Menu Navigation:', {
    url: menu.url,
    route: menu.getRoute(),
    navigation: menu.getNavigation()
  });
}
```

## 📚 相关文档

- [路由工具类 API](../utils/routeHelper.ts)
- [菜单导航 Hook](../hooks/useMenuNavigation.ts)
- [动态面包屑组件](../components/ui/DynamicBreadcrumb.tsx)
- [菜单类型定义](../types/menu.ts)
- [菜单服务](../services/menu.ts)