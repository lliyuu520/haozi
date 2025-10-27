# 路由驱动弹窗模式完整指南

## 📋 概述

路由驱动弹窗模式是一种现代化的前端架构模式，通过URL状态来控制模态框的显示和隐藏，提供更好的用户体验和SEO支持。

## 🎯 核心优势

### 1. **URL可分享**
- 可以直接通过URL打开特定的模态框状态
- 支持浏览器前进/后退按钮
- 可以收藏和分享模态框链接

### 2. **状态管理简化**
- 无需手动管理模态框的显示/隐藏状态
- 路由即状态，减少状态管理复杂度
- 自动处理模态框关闭逻辑

### 3. **用户体验优化**
- 支持浏览器后退按钮关闭模态框
- ESC键关闭模态框
- 更自然的导航体验

### 4. **开发效率提升**
- 统一的模态框管理方式
- 减少硬编码路由
- 更好的代码可维护性

## 🏗️ 架构设计

### URL结构设计
```
页面路由:     /system/menu/page
创建模态框:    /system/menu/modal/create
编辑模态框:    /system/menu/modal/edit/123
查看模态框:    /system/menu/modal/view/123
```

### 组件架构
```
┌─────────────────────────────────────────┐
│           AdminLayout                  │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │   SideNav   │  │     Content     │   │
│  │             │  │                 │   │
│  │  - 菜单管理  │  │  页面内容       │   │
│  │  - 用户管理  │  │                 │   │
│  │  - 角色管理  │  │                 │   │
│  └─────────────┘  └─────────────────┘   │
│                   ┌─────────────────┐   │
│                   │  GlobalModal    │   │
│                   │  (路由驱动)      │   │
│                   └─────────────────┘   │
└─────────────────────────────────────────┘
```

## 📦 核心组件和Hooks

### 1. ReactRouteModal组件
**位置**: `components/ui/ReactRouteModal.tsx`

**功能**: 核心路由模态框组件，自动解析URL并显示模态框

```tsx
// 基本用法
<ReactRouteModal
  basePath="system/menu"
  actions={['create', 'edit', 'view']}
  defaultConfig={{ width: 800 }}
>
  {(params, close) => (
    <MenuForm
      id={params.id}
      mode={params.action}
      onSuccess={close}
      onCancel={close}
    />
  )}
</ReactRouteModal>
```

### 2. useRouteModalV2 Hook
**位置**: `hooks/useRouteModalV2.ts`

**功能**: 提供模态框操作方法

```tsx
const routeModal = useRouteModalV2({
  basePath: 'system/menu',
  actions: ['create', 'edit', 'view'],
  actionTitles: {
    create: '创建',
    edit: '编辑',
    view: '查看'
  },
  resourceName: '菜单'
});

// 打开创建模态框
routeModal.openModal('create');

// 打开编辑模态框
routeModal.openModal('edit', { id: '123' });

// 检查当前状态
if (routeModal.isAction('edit')) {
  // 编辑模式
}
```

### 3. useSimpleRouteModal Hook
**功能**: 简化版模态框Hook

```tsx
const routeModal = useSimpleRouteModal('system/menu', '菜单');

// 快速打开模态框
routeModal.openModal('create');
routeModal.openModal('edit', { id: '123' });
```

### 4. useRouteModalV2 Hook (完整版)
**位置**: `hooks/useRouteModalV2.ts`

**功能**: 提供完整的模态框管理功能

```tsx
const routeModal = useRouteModalV2({
  basePath: 'system/menu',
  actions: ['create', 'edit', 'view'],
  actionTitles: {
    create: '新建菜单',
    edit: '编辑菜单',
    view: '查看菜单'
  },
  resourceName: '菜单',
  defaultProps: {
    width: 800,
    closable: true,
    maskClosable: false
  }
});

// 使用示例
return (
  <div>
    <Button onClick={() => routeModal.openModal('create')}>
      新建菜单
    </Button>

    <ReactRouteModal
      basePath="system/menu"
      actions={['create', 'edit', 'view']}
      defaultConfig={routeModal.config.defaultProps}
    >
      {(params, close) => (
        <MenuModalContent params={params} close={close} />
      )}
    </ReactRouteModal>
  </div>
);
```

## 🚀 快速开始

### 1. 创建模态框页面
```tsx
// app/(system)/system/menu/modal/[...slug]/page.tsx
'use client';

import { ReactRouteModal } from '@/components/ui/ReactRouteModal';
import MenuCreateModal from '@/components/modals/MenuCreateModal';
import MenuEditModal from '@/components/modals/MenuEditModal';

function MenuModalContent({ params, close }: { params: any; close: () => void }) {
  switch (params.action) {
    case 'create':
      return <MenuCreateModal onClose={close} />;
    case 'edit':
      return <MenuEditModal menuId={params.id} onClose={close} />;
    case 'view':
      return <MenuEditModal menuId={params.id} readOnly onClose={close} />;
    default:
      return <div>未知的操作类型</div>;
  }
}

export default function MenuModalPage() {
  return (
    <ReactRouteModal
      basePath="system/menu"
      actions={['create', 'edit', 'view']}
      defaultConfig={{ width: 680 }}
    >
      {(params, close) => <MenuModalContent params={params} close={close} />}
    </ReactRouteModal>
  );
}
```

### 2. 在页面中使用
```tsx
// app/(system)/system/menu/page.tsx
import { useSimpleRouteModal } from '@/hooks/useRouteModalV2';

export default function MenuManagementPage() {
  const routeModal = useSimpleRouteModal('system/menu', '菜单');

  return (
    <div>
      <Button onClick={() => routeModal.openModal('create')}>
        新建菜单
      </Button>

      <Table
        columns={[
          {
            title: '操作',
            render: (_, record) => (
              <Space>
                <Button onClick={() => routeModal.openModal('edit', { id: record.id })}>
                  编辑
                </Button>
                <Button onClick={() => routeModal.openModal('view', { id: record.id })}>
                  查看
                </Button>
              </Space>
            )
          }
        ]}
        dataSource={data}
      />
    </div>
  );
}
```

### 3. 配置全局模态框支持
```tsx
// components/layout/AdminLayout.tsx
const GLOBAL_MODAL_CONFIGS = [
  {
    basePath: 'system/menu',
    actions: ['create', 'edit', 'view'],
    defaultConfig: { width: 680 }
  },
  {
    basePath: 'system/user',
    actions: ['create', 'edit', 'view'],
    defaultConfig: { width: 800 }
  }
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      {/* ... 布局内容 ... */}

      {GLOBAL_MODAL_CONFIGS.map((config) => (
        <ReactRouteModal
          key={config.basePath}
          basePath={config.basePath}
          actions={config.actions}
          defaultConfig={config.defaultConfig}
        >
          {(params, close) => null} {/* 内容由具体页面处理 */}
        </ReactRouteModal>
      ))}
    </Layout>
  );
}
```

## 🛡️ 路由守卫

### 1. 基本路由守卫
```tsx
import { useRouteGuard } from '@/hooks/useRouteGuard';

function App() {
  const routeGuard = useRouteGuard({
    enableAuthCheck: true,
    enablePermissionCheck: true,
    protectedPatterns: [/^\/system\/.*/],
    checkAuth: () => Boolean(localStorage.getItem('token')),
    checkPermission: (path) => {
      const permissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');
      return PermissionUtils.hasAnyPermission([
        PermissionUtils.extractRequiredPermission(path)
      ], permissions);
    }
  });

  // 如果验证失败，组件会自动重定向
  return <div>{/* 应用内容 */}</div>;
}
```

### 2. 模态框守卫
```tsx
import { useModalGuard } from '@/hooks/useRouteGuard';

function ModalGuardExample() {
  const modalGuard = useModalGuard({
    allowedBasePaths: ['system/menu', 'system/user'],
    allowedActions: ['create', 'edit', 'view'],
    checkModalPermission: (basePath, action, id) => {
      const permissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');

      if (basePath === 'system/menu') {
        return permissions.includes(`sys:menu:${action}`);
      }

      return true;
    }
  });

  return <div>{/* 内容 */}</div>;
}
```

## 📱 浏览器历史记录管理

### 1. 基本历史管理
```tsx
import { useModalHistory } from '@/hooks/useModalHistory';

function HistoryExample() {
  const {
    isModalOpen,
    goBack,
    smartBack,
    closeModal
  } = useModalHistory({
    listenToPopState: true,
    customBackHandler: (current, previous) => {
      console.log('从', current, '后退到', previous);
      return false; // 使用默认处理
    }
  });

  return (
    <div>
      <Button onClick={smartBack}>
        智能后退
      </Button>

      {isModalOpen && (
        <Button onClick={closeModal}>
          关闭模态框
        </Button>
      )}
    </div>
  );
}
```

### 2. 键盘快捷键支持
```tsx
import { useModalKeyboardShortcuts } from '@/hooks/useModalHistory';

function KeyboardShortcutsExample() {
  useModalKeyboardShortcuts({
    onClose: () => console.log('ESC键按下'),
    onBack: () => console.log('Alt+左箭头按下'),
    enabled: true
  });

  return <div>{/* 内容 */}</div>;
}
```

## 🔧 高级配置

### 1. 自定义模态框配置
```tsx
const customModalConfig = {
  basePath: 'custom/module',
  actions: ['create', 'edit', 'view', 'approve', 'reject'],
  actionTitles: {
    create: '新建项目',
    edit: '编辑项目',
    view: '查看项目',
    approve: '审批项目',
    reject: '拒绝项目'
  },
  resourceName: '项目',
  defaultProps: {
    width: 1000,
    height: 600,
    closable: true,
    maskClosable: false,
    destroyOnClose: true,
    centered: true
  }
};
```

### 2. 动态路由生成
```tsx
// 动态生成模态框路由
const generateModalRoute = (basePath: string, action: string, params?: any) => {
  return RouteHelper.generateModalRoute(`${basePath}/page`, action, params?.id);
};

// 使用示例
const editRoute = generateModalRoute('system/user', 'edit', { id: '123' });
// 结果: "/system/user/modal/edit/123"
```

### 3. 批量模态框管理
```tsx
import { useMultipleRouteModals } from '@/hooks/useRouteModalV2';

function MultipleModalsExample() {
  const { activeModal, openModal, closeModal } = useMultipleRouteModals([
    { key: 'menu', basePath: 'system/menu', actions: ['create', 'edit'] },
    { key: 'user', basePath: 'system/user', actions: ['create', 'edit'] },
    { key: 'role', basePath: 'system/role', actions: ['create', 'edit'] }
  ]);

  return (
    <div>
      <Button onClick={() => openModal('menu', 'create')}>
        新建菜单
      </Button>

      <Button onClick={() => openModal('user', 'edit', { id: '123' })}>
        编辑用户
      </Button>

      {activeModal && (
        <Button onClick={closeModal}>
          关闭当前模态框
        </Button>
      )}
    </div>
  );
}
```

## 🎨 最佳实践

### 1. URL命名规范
```typescript
// ✅ 推荐
const goodUrls = {
  systemMenuPage: 'system/menu/page',
  systemUserEdit: 'system/user/modal/edit/123',
  dashboardAnalytics: 'dashboard/analytics/page'
};

// ❌ 避免
const badUrls = {
  systemMenuPage: '/system/menu', // 缺少/page后缀
  systemUserEdit: '/system/user/edit?id=123', // 使用查询参数
  randomPath: '/some/random/path' // 不符合命名规范
};
```

### 2. 权限检查规范
```typescript
// ✅ 推荐的权限检查
const checkPermission = (path: string, userPermissions: string[]) => {
  const permissionMap = {
    '/system/menu': 'sys:menu:list',
    '/system/user': 'sys:user:list',
    '/system/role': 'sys:role:list'
  };

  const requiredPermission = permissionMap[path];
  return requiredPermission ? userPermissions.includes(requiredPermission) : true;
};

// ✅ 模态框权限检查
const checkModalPermission = (basePath: string, action: string) => {
  const permission = `sys:${basePath.split('/')[1]}:${action}`;
  return userPermissions.includes(permission);
};
```

### 3. 错误处理规范
```typescript
// ✅ 统一的错误处理
const handleModalError = (error: Error, action: string) => {
  console.error(`模态框操作失败: ${action}`, error);
  message.error(`操作失败，请稍后重试`);

  // 错误时自动关闭模态框并返回基础页面
  router.push(RouteHelper.generateRoute(`${basePath}/page`));
};
```

### 4. 性能优化
```typescript
// ✅ 使用懒加载
const LazyModalContent = React.lazy(() => import('./ModalContent'));

// ✅ 使用防抖处理频繁操作
const debouncedOpenModal = useMemo(
  () => debounce(routeModal.openModal, 300),
  [routeModal.openModal]
);

// ✅ 缓存路由生成结果
const routeCache = new Map<string, string>();
const getCachedRoute = (basePath: string, action: string, id?: string) => {
  const key = `${basePath}:${action}:${id || ''}`;
  if (!routeCache.has(key)) {
    routeCache.set(key, RouteHelper.generateModalRoute(`${basePath}/page`, action, id));
  }
  return routeCache.get(key)!;
};
```

## 🔧 调试和开发

### 1. 开发环境调试
```typescript
// 开发环境下的调试信息
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 Modal Debug Info:', {
    currentPath: pathname,
    isModalOpen: routeModal.isOpen,
    modalAction: routeModal.action,
    modalId: routeModal.id,
    history: modalHistory.history
  });
}
```

### 2. 测试用例
```typescript
// Jest测试示例
describe('RouteModal', () => {
  it('should parse modal route correctly', () => {
    const result = parseReactModalRoute('/system/menu/modal/edit/123', 'system/menu', ['edit']);
    expect(result).toEqual({
      isOpen: true,
      params: { action: 'edit', id: '123' }
    });
  });

  it('should generate correct modal route', () => {
    const route = RouteHelper.generateModalRoute('system/menu/page', 'edit', '123');
    expect(route).toBe('/system/menu/modal/edit/123');
  });
});
```

## 📚 相关文档

- [React风格URL指南](./REACT_STYLE_URL_GUIDE.md)
- [路由工具类API](../utils/routeHelper.ts)
- [菜单类型定义](../types/menu.ts)
- [权限管理](./PERMISSION_GUIDE.md)

## 🚨 注意事项

1. **浏览器兼容性**: 确保目标浏览器支持History API
2. **SEO影响**: 模态框内容不会被搜索引擎索引
3. **性能考虑**: 避免同时打开过多模态框
4. **移动端适配**: 确保模态框在移动设备上的体验
5. **无障碍支持**: 添加适当的ARIA标签和键盘导航支持

通过这套完整的路由驱动弹窗系统，你可以构建现代化、用户友好的管理界面，提供优秀的用户体验和开发体验。