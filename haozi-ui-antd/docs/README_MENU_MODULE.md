# 菜单模块 (Menu Module)

## 📋 模块概述

菜单模块是管理系统的核心模块，实现了完整的路由驱动弹窗模式，支持React风格URL，提供了现代化、用户友好的菜单管理体验。

## 🎯 核心特性

### ✅ 已实现
- 🔗 **路由驱动弹窗**: 完整的CRUD操作支持
- 🚀 **React风格URL**: `system/menu/page` 格式
- 🌳 **树形结构**: 支持多级菜单展示
- 🔐 **权限控制**: 基于角色的菜单权限
- 📱 **响应式设计**: 移动端适配
- ⚡ **零硬编码**: 动态路由生成
- 🎨 **类型安全**: 完整的TypeScript支持

## 📁 文件结构

```
haozi-ui-antd/
├── app/(system)/system/menu/
│   ├── page.tsx                    # 菜单管理页面
│   └── modal/[...slug]/page.tsx    # 菜单模态框页面
├── components/
│   ├── modals/
│   │   ├── MenuCreateModal.tsx     # 创建菜单组件
│   │   └── MenuEditModal.tsx       # 编辑菜单组件
│   └── ui/
│       ├── MenuTable.tsx           # 菜单表格组件
│       └── ReactRouteModal.tsx     # 路由模态框组件
├── hooks/
│   └── useRouteModalV2.ts          # 路由模态框Hook
├── services/
│   └── menu.ts                     # 菜单API服务
├── types/
│   └── menu.ts                     # 菜单类型定义
├── utils/
│   └── routeHelper.ts              # 路由工具类
└── docs/
    ├── MENU_MODULE_GUIDE.md       # 使用指南
    └── README_MENU_MODULE.md       # 模块说明
```

## 🚀 快速开始

### 1. 数据库准备

```sql
-- 更新菜单URL为React风格格式
UPDATE sys_menu SET url = 'system/menu/page' WHERE name = '菜单管理';

-- 更多更新请参考: database/menu_update_sample.sql
```

### 2. 启动应用

```bash
cd haozi-ui-antd
npm run dev
```

### 3. 访问菜单管理

```
http://localhost:3000/system/menu/page
```

## 🔧 功能说明

### 菜单管理操作

| 操作 | 路由 | 说明 |
|------|------|------|
| 列表查看 | `/system/menu/page` | 显示所有菜单，支持树形展示 |
| 创建菜单 | `/system/menu/modal/create` | 创建新的菜单项 |
| 编辑菜单 | `/system/menu/modal/edit/:id` | 编辑现有菜单项 |
| 查看菜单 | `/system/menu/modal/view/:id` | 只读查看菜单详情 |

### 菜单类型

- **菜单 (MENU)**: 可导航的页面菜单项
- **按钮 (BUTTON)**: 页面功能按钮的权限控制
- **接口 (INTERFACE)**: API接口的访问权限

### 打开方式

- **内部 (INTERNAL)**: 在当前应用内打开
- **外部 (EXTERNAL)**: 在新窗口或标签页打开

## 🛠️ 技术实现

### 路由驱动架构

```typescript
// 使用Hook打开模态框
const routeModal = useSimpleRouteModal('system/menu', '菜单');

// 创建
routeModal.openModal('create');

// 编辑
routeModal.openModal('edit', { id: '123' });

// 查看
routeModal.openModal('view', { id: '123' });
```

### 组件结构

```typescript
// 菜单模态框页面
<ReactRouteModal
  basePath="system/menu"
  actions={['create', 'edit', 'view']}
  defaultConfig={{ width: 680 }}
>
  {(params, close) => (
    <MenuModalContent params={params} close={close} />
  )}
</ReactRouteModal>
```

### 表单验证

```typescript
// 动态表单字段
<Form.Item
  noStyle
  shouldUpdate={(prev, current) => prev.type !== current.type}
>
  {({ getFieldValue }) => {
    const type = getFieldValue('type');

    if (type === MenuType.MENU) {
      return <MenuFields />;
    }

    return null;
  }}
</Form.Item>
```

## 🔒 权限控制

### 菜单权限映射

| 路由 | 权限标识 | 说明 |
|------|----------|------|
| `/system/menu/page` | `sys:menu:list` | 查看菜单列表 |
| `/system/menu/modal/create` | `sys:menu:add` | 创建菜单 |
| `/system/menu/modal/edit/:id` | `sys:menu:edit` | 编辑菜单 |
| `/system/menu/modal/view/:id` | `sys:menu:view` | 查看菜单 |

### 权限检查

```typescript
useModalGuard({
  allowedBasePaths: ['system/menu'],
  allowedActions: ['create', 'edit', 'view'],
  checkModalPermission: (basePath, action, id) => {
    const permissions = getUserPermissions();
    return permissions.includes(`sys:${basePath}:${action}`);
  }
});
```

## 🎨 用户界面

### 表格特性

- 🌳 **树形展示**: 支持多级菜单展开/折叠
- 🎨 **类型标签**: 不同菜单类型的颜色标识
- 🔍 **搜索过滤**: 按菜单类型筛选
- 📱 **响应式**: 移动端友好显示

### 表单特性

- ✅ **动态字段**: 根据菜单类型显示不同字段
- 🎯 **智能验证**: 实时表单验证和错误提示
- 🎨 **图标选择**: 丰富的菜单图标库
- ⚙️ **高级配置**: 缓存、弹窗等元数据配置

## 📱 浏览器支持

### 路由行为

- ✅ **浏览器后退**: 自动关闭模态框
- ✅ **URL分享**: 可直接分享模态框状态
- ✅ **刷新保持**: 刷新页面保持模态框状态
- ✅ **书签支持**: 支持模态框状态书签

### 快捷键

- `ESC`: 关闭当前模态框
- `Alt + ←`: 浏览器后退

## 🐛 故障排除

### 常见问题

1. **模态框不显示**
   - 检查路由格式是否正确
   - 确认组件导入是否正确
   - 查看浏览器控制台错误

2. **表单提交失败**
   - 检查网络连接
   - 验证表单数据格式
   - 查看后端API响应

3. **权限问题**
   - 确认用户权限配置
   - 检查路由守卫设置
   - 验证后端权限验证

### 调试工具

```bash
# 运行配置检查
npx tsx scripts/check-menu-module.ts

# 开发环境调试
npm run dev
```

## 📚 相关文档

- [📖 菜单模块使用指南](./MENU_MODULE_GUIDE.md)
- [🔗 路由模态框指南](./ROUTE_MODAL_GUIDE.md)
- [🚀 React风格URL指南](./REACT_STYLE_URL_GUIDE.md)
- [🔧 组件开发规范](./COMPONENT_GUIDE.md)

## 🔄 版本历史

### v1.0.0 (2024-01-XX)
- ✅ 实现基础菜单CRUD功能
- ✅ 支持路由驱动弹窗模式
- ✅ 添加React风格URL支持
- ✅ 完成权限控制系统
- ✅ 实现树形菜单展示

### 未来计划
- 🔄 批量操作支持
- 🔄 菜单拖拽排序
- 🔄 菜单复制功能
- 🔄 性能优化

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支: `git checkout -b feature/menu-enhancement`
3. 提交更改: `git commit -m 'Add menu enhancement'`
4. 推送分支: `git push origin feature/menu-enhancement`
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](../../LICENSE) 文件了解详情。

---

**维护者**: lliyuu520
**最后更新**: 2024-01-27
**版本**: v1.0.0