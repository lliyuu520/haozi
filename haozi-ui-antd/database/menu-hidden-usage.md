# 菜单 Hidden 字段使用指南

## 🎯 概述

为菜单表新增了 `hidden` 字段，用于控制菜单在前端的显示/隐藏状态。

## 📊 字段说明

### 数据库字段
```sql
hidden TINYINT(1) DEFAULT 0 COMMENT '是否隐藏菜单：0-显示，1-隐藏'
```

### 字段值含义
- **0**: 菜单显示（默认值）
- **1**: 菜单隐藏

## 🚀 部署步骤

### 1. 执行数据库脚本
```bash
mysql -u root -p haozi < database/add-menu-hidden-field.sql
```

### 2. 验证字段添加
```sql
-- 查看表结构
DESCRIBE sys_menu;

-- 查看 hidden 字段分布
SELECT hidden, COUNT(*) as count FROM sys_menu GROUP BY hidden;
```

## 💻 前端功能

### 1. 菜单管理界面
在菜单创建和编辑弹窗中，新增了"显示状态"开关：

```typescript
<Form.Item
  name="hidden"
  label="显示状态"
  valuePropName="checked"
  tooltip="控制菜单在前端的显示状态"
>
  <Switch checkedChildren="显示" unCheckedChildren="隐藏" />
</Form.Item>
```

### 2. 数据处理
- **表单提交**: 布尔值自动转换为数字（`true` → `1`, `false` → `0`）
- **数据显示**: 数字自动转换为布尔值（`1` → `true`, `0` → `false`）
- **默认值**: 新菜单默认为显示状态（`hidden: 0`）

### 3. 类型定义
```typescript
interface MenuItem {
  // ... 其他字段
  hidden?: number;        // 数据库字段：0-显示，1-隐藏
  meta?: {
    // ... 其他配置
    hidden?: boolean;     // meta 中的配置：true-隐藏，false-显示
  };
}

interface MenuFormValues {
  // ... 其他字段
  hidden?: number;        // 表单中的字段（Switch 组件使用布尔值，提交时转换）
}
```

## 🎨 使用场景

### 1. 功能开关
当某个功能还在开发中或暂时不需要时，可以设置 `hidden: 1` 来隐藏菜单，而不需要删除菜单记录。

### 2. 权限控制
结合权限系统，可以为不同用户角色显示不同的菜单项。

### 3. 动态菜单
根据业务需求，可以动态地显示或隐藏某些菜单项。

## 📝 数据示例

### 创建隐藏菜单
```json
{
  "name": "测试菜单",
  "url": "sys/test/index",
  "type": 0,
  "hidden": 1,
  "meta": {
    "hidden": true,
    "deeplink": false,
    "keepAlive": true
  }
}
```

### 查询显示菜单
```sql
-- 只查询显示的菜单
SELECT * FROM sys_menu WHERE hidden = 0;

-- 查询隐藏的菜单
SELECT * FROM sys_menu WHERE hidden = 1;
```

## 🔧 API 更新

### 创建菜单
```typescript
const menuData = {
  name: '新菜单',
  url: 'sys/new/index',
  hidden: 0, // 或 1
  // ... 其他字段
};
await createMenu(menuData);
```

### 更新菜单
```typescript
const updateData = {
  id: 1,
  hidden: 1, // 隐藏菜单
  // ... 其他字段
};
await updateMenu(updateData);
```

## 🧪 测试验证

### 1. 前端测试
1. 访问菜单管理页面
2. 创建新菜单，设置显示状态为"隐藏"
3. 保存后检查菜单是否在列表中显示
4. 编辑菜单，切换显示状态
5. 验证状态变化是否正确保存

### 2. 后端测试
```sql
-- 插入隐藏菜单
INSERT INTO sys_menu (name, url, hidden, type)
VALUES ('隐藏菜单', 'sys/hidden/index', 1, 0);

-- 查询验证
SELECT name, hidden FROM sys_menu WHERE name = '隐藏菜单';
```

### 3. 数据一致性测试
- 验证 `hidden` 字段与 `meta.hidden` 配置保持同步
- 确保前后端数据转换正确

## ⚠️ 注意事项

### 1. 数据库兼容性
- 字段类型为 `TINYINT(1)`，占用空间小
- 默认值为 0，确保现有数据不受影响
- 添加索引提高查询性能

### 2. 前端显示逻辑
- 隐藏的菜单仍然存在于数据库中
- 前端需要根据 `hidden` 字段过滤显示
- 可以通过配置决定是否完全隐藏或显示为灰色状态

### 3. 权限集成
- `hidden` 字段是基础的显示控制
- 可以与权限系统结合，实现更细粒度的控制
- 建议在业务逻辑中综合考虑 `hidden` 和用户权限

## 🔄 回滚方案

如果需要回滚：
```sql
-- 删除索引
DROP INDEX IF EXISTS idx_sys_menu_hidden ON sys_menu;

-- 删除字段
ALTER TABLE sys_menu DROP COLUMN hidden;
```

## 🎊 总结

新增的 `hidden` 字段为菜单系统提供了更灵活的显示控制能力，支持：

- ✅ 菜单的动态显示/隐藏
- ✅ 功能开关管理
- ✅ 权限集成扩展
- ✅ 数据库级别的性能优化
- ✅ 前端友好的操作界面

这个功能让菜单管理更加灵活和强大！