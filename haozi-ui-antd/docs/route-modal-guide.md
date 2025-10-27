# 路由驱动弹层开发指南

## 概述

路由驱动弹层是一种将弹窗状态与浏览器 URL 路由直接关联的前端架构模式。这种方式提供了更好的用户体验和开发体验。

## 核心组件

### 1. RouteModal 组件
位置：`@/components/ui/RouteModal.tsx`

这是路由驱动弹层的核心组件，负责：
- 监听路由变化
- 管理弹窗的显示/隐藏状态
- 处理浏览器前进/后退
- 锁定背景页面滚动

### 2. 路由页面
位置：`@/app/(system)/system/user/[[...modal]]/page.tsx`

动态路由页面，负责：
- 解析弹窗路由参数
- 渲染对应的弹窗内容
- 处理弹窗关闭逻辑

### 3. 弹窗内容组件
位置：`@/components/modals/`

具体的弹窗内容组件，如：
- `UserCreateModal.tsx` - 创建用户弹窗
- `UserEditModal.tsx` - 编辑用户弹窗

## 路由设计规范

### URL 结构
```
/base-path                    # 基础页面
/base-path/create-modal      # 创建弹窗
/base-path/[id]/edit-modal   # 编辑弹窗
/base-path/[id]/view-modal   # 查看弹窗
```

### 路由配置
```typescript
const MODAL_ROUTES = {
  USER: {
    BASE: '/system/user',
    CREATE: '/system/user/create-modal',
    EDIT: '/system/user/:id/edit-modal',
    VIEW: '/system/user/:id/view-modal',
  },
} as const;
```

## 使用方法

### 1. 创建路由页面
```typescript
// app/(system)/system/user/[[...modal]]/page.tsx
export default function UserModalPage() {
  const modalInfo = parseModalRoute(pathname);

  if (!modalInfo) return null;

  return (
    <RouteModal
      config={USER_MODAL_CONFIGS[modalInfo.type]}
      basePath="/system/user"
      params={modalInfo.params}
      onClose={() => router.push('/system/user')}
    >
      {renderModalContent(modalInfo)}
    </RouteModal>
  );
}
```

### 2. 创建弹窗内容组件
```typescript
// components/modals/UserCreateModal.tsx
export default function UserCreateModal({ onClose }: ModalProps) {
  const handleSubmit = async (values) => {
    await createUser(values);
    onClose(); // 关闭弹窗并回到基础页面
  };

  return (
    <Form onFinish={handleSubmit}>
      {/* 表单内容 */}
    </Form>
  );
}
```

### 3. 在页面中使用
```typescript
// 打开弹窗
const handleAdd = () => {
  router.push('/system/user/create-modal');
};

const handleEdit = (userId) => {
  router.push(`/system/user/${userId}/edit-modal`);
};
```

## 最佳实践

### 1. 命名规范
- 弹窗路由以 `-modal` 结尾
- 弹窗类型使用 `CREATE_MODAL`、`EDIT_MODAL`、`VIEW_MODAL` 常量
- 组件命名使用 `XxxCreateModal`、`XxxEditModal` 格式

### 2. 状态管理
- 弹窗状态完全由路由控制，不要使用本地状态
- 通过 URL 参数传递弹窗所需的初始数据
- 表单状态由组件内部管理

### 3. 性能优化
- 使用 `destroyOnClose` 确保组件卸载
- 弹窗内容使用 `dynamic` 导入（可选）
- 避免在弹窗组件中进行重型计算

### 4. 错误处理
- 参数校验：确保必需的路由参数存在
- 权限检查：验证用户是否有权限访问该弹窗
- 优雅降级：参数错误时回到基础页面

## 迁移指南

### 从传统弹窗迁移到路由弹窗

1. **移除弹窗状态**
   ```typescript
   // 删除
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [editingUserId, setEditingUserId] = useState(null);
   ```

2. **修改打开弹窗方法**
   ```typescript
   // 修改前
   const handleAdd = () => setIsModalVisible(true);

   // 修改后
   const handleAdd = () => router.push('/path/create-modal');
   ```

3. **提取弹窗内容**
   - 将弹窗内容提取到独立组件
   - 通过 props 传递关闭回调

4. **创建路由页面**
   - 创建 `[[...modal]]/page.tsx` 路由页面
   - 配置弹窗路由解析逻辑

## 优势对比

### 传统弹窗
- ❌ 状态管理复杂
- ❌ 无法通过分享链接直接打开
- ❌ 刷新页面时状态丢失
- ❌ 不支持浏览器前进/后退

### 路由驱动弹窗
- ✅ 状态与 URL 同步，简单可靠
- ✅ 支持链接分享和收藏
- ✅ 刷新页面状态保持
- ✅ 完整的浏览器导航支持
- ✅ SEO 友好
- ✅ 更好的可访问性

## 常见问题

### Q: 如何处理弹窗中的表单验证？
A: 在弹窗内容组件中正常使用表单验证，验证失败时不关闭弹窗。

### Q: 如何处理弹窗中的异步操作？
A: 使用 loading 状态，异步操作成功后再调用 `onClose()` 关闭弹窗。

### Q: 如何处理复杂的弹窗参数？
A: 通过路由路径参数传递关键信息（如 ID），其他数据通过 API 获取。

### Q: 如何实现弹窗之间的跳转？
A: 使用 `router.replace()` 直接替换到新的弹窗路由，避免在历史记录中留下中间状态。

## 示例代码

完整的示例代码请参考：
- `@/app/(system)/system/user/` - 用户管理页面
- `@/components/modals/UserCreateModal.tsx` - 创建用户弹窗
- `@/app/(test)/modal-demo/` - 功能演示页面