# 菜单字段对照与转换文档

## 📋 概述

本文档详细说明了前后端菜单字段的对照关系和转换规则，确保前后端数据的一致性和完整性。

## 🔗 字段对照表

### 基础字段（来自 BaseEntity）

| 后端字段 | 前端字段 | 类型 | 说明 |
|---------|---------|------|------|
| `id` | `id` | `Long` | 主键ID |
| `createTime` | `createTime` | `LocalDateTime` | 创建时间 |
| `updateTime` | `updateTime` | `LocalDateTime` | 更新时间 |
| `creator` | `creator` | `Long` | 创建者ID |
| `updater` | `updater` | `Long` | 更新者ID |
| `deleted` | `deleted` | `Integer` | 逻辑删除标记 |

### 菜单核心字段（来自 SysMenu）

| 后端字段 | 前端字段 | 类型 | 说明 |
|---------|---------|------|------|
| `parentId` | `parentId` | `Long` | 上级菜单ID，一级菜单为0 |
| `name` | `name` | `String` | 菜单名称 |
| `url` | `url` / `path` | `String` | 菜单URL/路由路径 |
| `perms` | `perms` | `String` | 权限标识（逗号分隔） |
| `type` | `type` | `Integer` | 菜单类型（0:菜单 1:按钮 2:接口） |
| `openStyle` | `openStyle` | `Integer` | 打开方式（0:内部 1:外部） |
| `weight` | `weight` | `Integer` | 排序权重 |

### 前端扩展字段

| 前端字段 | 来源 | 类型 | 说明 |
|---------|------|------|------|
| `component` | `extra.component` | `String` | 前端组件路径 |
| `icon` | `extra.icon` | `String` | 图标名称 |
| `visible` | `extra.visible` | `Boolean` | 是否可见 |
| `children` | 后端树形结构 | `MenuItem[]` | 子菜单列表 |
| `meta` | 多字段映射 | `Object` | 元数据信息 |

### Meta 字段映射

| Meta 子字段 | 后端来源 | 说明 |
|-------------|----------|------|
| `title` | `name` | 菜单标题 |
| `icon` | `extra.icon` | 菜单图标 |
| `hidden` | `extra.hidden` | 是否隐藏 |
| `cache` | `extra.cache` | 是否缓存 |
| `permission` | `perms` | 权限标识数组（逗号分隔转数组） |
| `target` | `openStyle` | 打开方式（0:_self 1:_blank） |
| `affix` | `extra.affix` | 是否固定标签页 |

## 🔄 转换规则

### 1. 菜单类型转换

```typescript
// 后端枚举值
enum MenuTypeEnum {
  MENU = 0,      // 菜单
  BUTTON = 1,   // 按钮
  INTERFACE = 2, // 接口
}

// 前端枚举值
enum MenuType {
  MENU = 0,      // 菜单
  BUTTON = 1,   // 按钮
  INTERFACE = 2, // 接口
}

// 转换：直接映射
type: raw.type as MenuType
```

### 2. 打开方式转换

```typescript
// 后端：0=内部，1=外部
// 前端：0=INTERNAL，1=EXTERNAL

// 打开方式映射
openStyle: raw.openStyle as OpenStyle

// Meta target 映射
target: raw.openStyle === 1 ? '_blank' : '_self'
```

### 3. 权限标识转换

```typescript
// 后端：逗号分隔的字符串
// 例如："sys:user:add,sys:user:edit"

// 前端：权限标识数组
permission: raw.perms ? raw.perms.split(',').filter(p => p.trim()) : []
```

### 4. 可见性处理

```typescript
// 后端：extra.visible 字段（可选）
// 前端：visible 字段，默认为 true

visible: raw.extra?.visible !== false // 默认可见
hidden: raw.extra?.hidden || false     // 默认不隐藏
```

## 🛠️ 转换工具类

### MenuUtils 类方法

#### 1. 数据转换
```typescript
// 后端 -> 前端
MenuUtils.transformRawMenu(raw: RawMenuNode): MenuItem
MenuUtils.transformRawMenus(rawMenus: RawMenuNode[]): MenuItem[]

// 前端 -> 后端
MenuUtils.menuItemToRaw(menu: MenuItem): Partial<RawMenuNode>
```

#### 2. 辅助方法
```typescript
// 获取类型标签
MenuUtils.getMenuTypeLabel(type: MenuType): string

// 获取打开方式标签
MenuUtils.getOpenStyleLabel(openStyle: OpenStyle): string

// 检查是否为可导航菜单
MenuUtils.isNavigableMenu(menu: MenuItem): boolean

// 检查是否有权限标识
MenuUtils.hasPermission(menu: MenuItem): boolean

// 获取所有权限标识
MenuUtils.getMenuPermissions(menu: MenuItem): string[]
```

## 📝 使用示例

### 1. API 数据转换

```typescript
// 获取菜单列表
const response = await getMenuList({ type: MenuType.MENU });
// 返回的 data 已经转换为 MenuItem[] 格式

// 获取菜单详情
const detail = await getMenuDetail(1);
// 返回的 data 已经转换为 MenuDetail 格式
```

### 2. 创建菜单

```typescript
const newMenu: MenuCreateParams = {
  parentId: 0,
  name: '用户管理',
  url: '/system/user',
  perms: 'sys:user:list',
  type: MenuType.MENU,
  openStyle: OpenStyle.INTERNAL,
  weight: 1,
};

await createMenu(newMenu);
// 内部自动转换为后端格式发送
```

### 3. 更新菜单

```typescript
const updateData: MenuUpdateParams = {
  id: 1,
  parentId: 0,
  name: '用户管理（已更新）',
  url: '/system/user',
  perms: 'sys:user:list,sys:user:add',
  type: MenuType.MENU,
  openStyle: OpenStyle.INTERNAL,
  weight: 2,
};

await updateMenu(updateData);
```

## ⚠️ 注意事项

### 1. 数据一致性
- 前后端枚举值保持一致
- 字段名称尽量对应，减少混淆
- 类型转换要保证数据完整性

### 2. 空值处理
- 可选字段要有默认值
- 数组字段要防止空指针
- 时间字段要正确格式化

### 3. 性能考虑
- 大量菜单数据要考虑分页加载
- 树形结构要避免过深的递归
- 转换工具要考虑性能优化

### 4. 扩展性
- 新增字段要同步更新转换逻辑
- 元数据字段要保持灵活性
- 考虑未来可能的字段变化

## 🔄 版本兼容性

### 当前版本兼容性
- ✅ 完全兼容后端 SysMenu 实体
- ✅ 支持 BaseEntity 所有字段
- ✅ 扩展字段通过 extra 字段支持
- ✅ 类型安全，避免运行时错误

### 升级建议
1. 定期检查后端实体变化
2. 同步更新前端类型定义
3. 保持转换工具的最新状态
4. 编写单元测试确保转换正确性

## 📚 相关文档

- [后端 SysMenu 实体](../../haozi-admin/src/main/java/cn/lliyuu520/haozi/modules/sys/entity/SysMenu.java)
- [后端 BaseEntity](../../haozi-admin/src/main/java/cn/lliyuu520/haozi/common/base/entity/BaseEntity.java)
- [后端 MenuTypeEnum](../../haozi-admin/src/main/java/cn/lliyuu520/haozi/common/enums/MenuTypeEnum.java)
- [前端菜单 API](../services/menu.ts)
- [前端菜单类型](../types/menu.ts)