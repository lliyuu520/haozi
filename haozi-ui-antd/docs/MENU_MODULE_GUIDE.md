# 菜单模块完整实现指南

## 📋 概述

本文档详细说明了菜单模块的完整实现，包括路由驱动弹窗模式、React风格URL和完整的前后端交互。

## 🎯 功能特性

### ✅ 已实现功能
- **路由驱动弹窗**: 创建、编辑、查看菜单
- **React风格URL**: `system/menu/page` 格式
- **动态路由生成**: 无硬编码，基于菜单配置
- **树形结构显示**: 支持多级菜单展开/折叠
- **权限控制**: 菜单类型权限管理
- **类型安全**: 完整的TypeScript类型支持

### 🔧 核心组件
1. **菜单管理页面**: `app/(system)/system/menu/page.tsx`
2. **菜单模态框页面**: `app/(system)/system/menu/modal/[...slug]/page.tsx`
3. **菜单表单组件**: `app/(system)/system/menu/components/MenuForm.tsx`
4. **菜单表格组件**: `app/(system)/system/menu/components/MenuTable.tsx`
5. **菜单管理Hook**: `app/(system)/system/menu/hooks.ts`

## 🚀 快速开始

### 1. 数据库配置

运行数据库更新脚本：
```sql
-- 更新菜单URL为React风格格式
UPDATE sys_menu SET url = 'system/menu/page' WHERE name = '菜单管理';
UPDATE sys_menu SET url = 'system/user/page' WHERE name = '用户管理';
-- ... 更多菜单见 database/menu_update_sample.sql
```

### 2. 访问菜单管理

1. 启动前端应用: `npm run dev`
2. 访问: `http://localhost:3000/system/menu/page`
3. 点击"新建菜单"按钮测试创建功能
4. 点击表格中的查看/编辑按钮测试模态框

### 3. 路由结构

```
/system/menu/page              # 菜单管理页面
/system/menu/modal/create       # 创建菜单模态框
/system/menu/modal/edit/123     # 编辑菜单模态框
/system/menu/modal/view/123     # 查看菜单模态框
```

## 📦 核心代码实现

### 1. 菜单管理页面

```typescript
// app/(system)/system/menu/page.tsx
export default function MenuManagementPage() {
  const routeModal = useSimpleRouteModal('system/menu', '菜单');
  const [dataSource, setDataSource] = useState<NavigableMenuItem[]>([]);

  // 处理添加
  const handleAdd = () => {
    routeModal.openModal('create');
  };

  // 处理编辑
  const handleEdit = (record: NavigableMenuItem) => {
    routeModal.openModal('edit', { id: record.id });
  };

  // 处理查看
  const handleView = (record: NavigableMenuItem) => {
    routeModal.openModal('view', { id: record.id });
  };

  return (
    <div className="page-container">
      <Card title="菜单管理">
        <Button onClick={handleAdd}>新建菜单</Button>
        <MenuTable
          dataSource={dataSource}
          onEdit={handleEdit}
          onView={handleView}
          onDelete={handleDeleteConfirm}
        />
      </Card>
    </div>
  );
}
```

### 2. 菜单模态框页面

```typescript
// app/(system)/system/menu/modal/[...slug]/page.tsx
function MenuModalContent({ params, close }: { params: any; close: () => void }) {
  const { action, id } = params;

  return (
    <MenuForm
      mode={action === 'create' ? 'create' : action === 'edit' ? 'edit' : 'view'}
      menuId={id}
      onSuccess={close}
      onCancel={close}
    />
  );
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

### 3. 菜单表单组件

```typescript
// app/(system)/system/menu/components/MenuForm.tsx
export default function MenuForm({
  mode,           // 'create' | 'edit' | 'view'
  menuId,
  onSuccess,
  onCancel
}: MenuFormProps) {
  const [form] = Form.useForm<MenuFormValues>();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: MenuFormValues) => {
    if (mode === 'view') return; // 只读模式不提交

    setLoading(true);
    try {
      const params: MenuCreateParams | MenuUpdateParams = {
        ...values,
        hidden: values.hidden ? 1 : 0,
      };

      if (mode === 'edit' && menuId) {
        await updateMenuWithNavigation({ ...params, id: menuId });
      } else {
        await createMenuWithNavigation(params as MenuCreateParams);
      }

      onSuccess();
    } catch (error) {
      // 错误处理...
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} onFinish={mode === 'view' ? undefined : handleSubmit}>
      {/* 统一的表单字段，根据mode显示不同状态 */}
      <Form.Item name="name" label="菜单名称" rules={[{ required: mode !== 'view' }]}>
        <Input placeholder="请输入菜单名称" readOnly={mode === 'view'} />
      </Form.Item>

      {/* 更多字段... */}
    </Form>
  );
}
```

## 🛡️ 路由守卫配置

```typescript
// 在布局组件中配置路由守卫
useModalGuard({
  allowedBasePaths: ['system/menu'],
  allowedActions: ['create', 'edit', 'view'],
  checkModalPermission: (basePath, action, id) => {
    const permissions = JSON.parse(localStorage.getItem('userPermissions') || '[]');

    if (basePath === 'system/menu') {
      return permissions.includes(`sys:menu:${action}`);
    }

    return true;
  }
});
```

## 📱 用户交互流程

### 创建菜单流程
1. 用户点击"新建菜单"按钮
2. 路由跳转到 `/system/menu/modal/create`
3. 显示创建菜单模态框
4. 用户填写表单并提交
5. 成功后自动关闭模态框并返回列表页
6. 刷新菜单列表数据

### 编辑菜单流程
1. 用户点击表格中的编辑按钮
2. 路由跳转到 `/system/menu/modal/edit/123`
3. 显示编辑菜单模态框（预填充数据）
4. 用户修改表单并提交
5. 成功后自动关闭模态框并返回列表页
6. 刷新菜单列表数据

### 查看菜单流程
1. 用户点击表格中的查看按钮
2. 路由跳转到 `/system/menu/modal/view/123`
3. 显示查看菜单模态框（只读模式）
4. 用户点击"关闭"按钮返回列表页

## 🔧 高级配置

### 1. 自定义菜单类型配置

```typescript
// 在页面中自定义菜单类型配置
const MENU_TYPE_CONFIG = {
  [MenuType.MENU]: {
    label: '菜单',
    icon: <MenuOutlined />,
    color: 'blue',
    description: '可导航的页面菜单项',
  },
  [MenuType.BUTTON]: {
    label: '按钮',
    icon: <TagOutlined />,
    color: 'green',
    description: '页面功能按钮的权限控制',
  },
  [MenuType.INTERFACE]: {
    label: '接口',
    icon: <ApiOutlined />,
    color: 'orange',
    description: 'API接口的访问权限',
  },
};
```

### 2. 动态表单验证

```typescript
// 根据菜单类型动态显示不同字段
<Form.Item
  noStyle
  shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
>
  {({ getFieldValue }) => {
    const type = getFieldValue('type');

    if (type === MenuType.MENU) {
      return (
        <Form.Item name="url" label="路由地址" rules={[{ required: true }]}>
          <Input placeholder="请输入路由地址，如：system/menu/page" />
        </Form.Item>
      );
    }

    return null;
  }}
</Form.Item>
```

### 3. 权限控制

```typescript
// 在组件中检查权限
const { user } = useAuthStore();

const canCreateMenu = user?.permissions?.includes('sys:menu:add');
const canEditMenu = user?.permissions?.includes('sys:menu:edit');
const canDeleteMenu = user?.permissions?.includes('sys:menu:delete');

// 在渲染时控制按钮显示
{canCreateMenu && (
  <Button onClick={handleAdd}>新建菜单</Button>
)}
```

## 🎨 样式定制

### 1. 表格行样式

```css
/* 菜单表格行样式 */
.menu-table-row-level-0 {
  background-color: #f0f9ff;
  font-weight: bold;
}

.menu-table-row-level-1 {
  background-color: #f8fafc;
}

.menu-table-row-level-2 {
  background-color: #ffffff;
}
```

### 2. 模态框样式

```typescript
// 自定义模态框配置
const modalConfig = {
  width: 800,
  centered: true,
  destroyOnClose: true,
  maskClosable: false,
  className: 'menu-modal'
};
```

## 🐛 常见问题

### 1. 路由不匹配

**问题**: 点击按钮后模态框不显示

**解决方案**:
- 检查路由格式是否正确：`system/menu/modal/create`
- 确认 `ReactRouteModal` 组件的 `basePath` 和 `actions` 配置
- 检查浏览器控制台是否有路由错误

### 2. 表单提交失败

**问题**: 提交表单时出现错误

**解决方案**:
- 检查后端API是否正常
- 确认表单验证规则
- 检查网络请求和响应格式

### 3. 权限问题

**问题**: 没有权限访问菜单

**解决方案**:
- 检查用户权限配置
- 确认路由守卫配置
- 验证后端权限验证逻辑

## 🧪 测试用例

### 基本功能测试

```typescript
// 测试路由跳转
describe('Menu Navigation', () => {
  it('should navigate to create modal', () => {
    const { getByText } = render(<MenuManagementPage />);

    fireEvent.click(getByText('新建菜单'));

    expect(window.location.pathname).toBe('/system/menu/modal/create');
  });
});

// 测试表单提交
describe('Menu Form', () => {
  it('should submit form with correct data', async () => {
    const mockCreateMenu = jest.fn();

    render(<MenuCreateModal onClose={() => {}} />);

    fireEvent.change(screen.getByLabelText('菜单名称'), {
      target: { value: '测试菜单' }
    });

    fireEvent.click(screen.getByText('创建'));

    await waitFor(() => {
      expect(mockCreateMenu).toHaveBeenCalledWith({
        name: '测试菜单',
        // ... 其他字段
      });
    });
  });
});
```

## 📚 相关文档

- [路由驱动弹窗完整指南](./ROUTE_MODAL_GUIDE.md)
- [React风格URL指南](./REACT_STYLE_URL_GUIDE.md)
- [权限管理系统](./PERMISSION_GUIDE.md)
- [组件开发规范](./COMPONENT_GUIDE.md)

## 🎯 下一步计划

1. **功能扩展**
   - 批量操作菜单
   - 菜单拖拽排序
   - 菜单复制功能

2. **用户体验优化**
   - 搜索和过滤功能
   - 快捷键支持
   - 移动端适配

3. **性能优化**
   - 虚拟滚动（大量菜单时）
   - 懒加载（菜单图标）
   - 缓存优化

通过这个完整的菜单模块实现，你可以参考这个模式来实现其他模块的路由驱动弹窗功能。