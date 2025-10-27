# 路由驱动弹层 - 路由结构

## 🎯 解决的路由冲突问题

### 问题描述
Next.js App Router 中不能同时存在：
- `/system/menu` (静态路由)
- `/system/menu[[...modal]]` (可选全捕获路由)

这会导致 "You cannot define a route with the same specificity as an optional catch-all route" 错误。

## 🚀 解决方案

### 新的路由结构
使用子目录分离弹窗路由，避免冲突：

```
/system/
├── user/
│   ├── page.tsx                    # 用户列表页面
│   └── modal/
│       └── [...slug]/page.tsx      # 用户弹窗路由
└── menu/
    ├── page.tsx                    # 菜单列表页面
    └── modal/
        └── [...slug]/page.tsx      # 菜单弹窗路由
```

### 具体路由映射

#### 用户管理模块
- `/system/user` - 用户列表页面
- `/system/user/modal/create` - 创建用户弹窗
- `/system/user/modal/edit/[id]` - 编辑用户弹窗
- `/system/user/modal/view/[id]` - 查看用户弹窗

#### 菜单管理模块
- `/system/menu` - 菜单列表页面
- `/system/menu/modal/create` - 创建菜单弹窗
- `/system/menu/modal/edit/[id]` - 编辑菜单弹窗
- `/system/menu/modal/view/[id]` - 查看菜单弹窗

#### 角色管理模块（预留）
- `/system/role` - 角色列表页面
- `/system/role/modal/create` - 创建角色弹窗
- `/system/role/modal/edit/[id]` - 编辑角色弹窗
- `/system/role/modal/view/[id]` - 查看角色弹窗

## ✅ 优势

### 1. 避免 Next.js 路由冲突
- 静态路由和动态路由完全分离
- 不再存在路由特异性冲突

### 2. 更清晰的 URL 结构
- `/modal/` 前缀明确表示这是弹窗路由
- URL 语意更清晰，易于理解

### 3. 更好的扩展性
- 未来添加新的弹窗类型很容易
- 统一的路由模式便于维护

### 4. 保持向后兼容
- 原有的页面路由 `/system/user`、`/system/menu` 保持不变
- 只影响弹窗路由的 URL

## 🧪 测试验证

访问演示页面测试功能：
```
http://localhost:3000/test/modal-demo
```

### 测试用例
1. **用户管理弹窗**
   - 创建用户：`/system/user/modal/create`
   - 编辑用户：`/system/user/modal/edit/1`

2. **菜单管理弹窗**
   - 创建菜单：`/system/menu/modal/create`
   - 编辑菜单：`/system/menu/modal/edit/1`

3. **浏览器导航测试**
   - 前进/后退按钮功能
   - 刷新页面状态保持
   - 直接 URL 访问

## 📝 开发注意事项

### 添加新模块时
1. 创建基础页面：`/system/{module}/page.tsx`
2. 创建弹窗路由：`/system/{module}/modal/[...slug]/page.tsx`
3. 更新路由配置：`types/modal.ts` 中的 `MODAL_ROUTES`
4. 更新演示页面：`app/(test)/modal-demo/page.tsx`

### 路由解析规则
```typescript
// 创建弹窗：/system/{module}/modal/create
if (pathname.endsWith('/modal/create')) {
  return { type: 'create-modal', params: {} };
}

// 编辑弹窗：/system/{module}/modal/edit/123
const editMatch = pathname.match(/\/system\/{module}\/modal\/edit\/(\d+)$/);
if (editMatch) {
  return { type: 'edit-modal', params: { id: editMatch[1] } };
}
```

这种路由结构既解决了 Next.js 的路由冲突问题，又保持了 URL 的清晰性和一致性。