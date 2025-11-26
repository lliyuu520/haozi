# CLAUDE.md

[根目录](../../CLAUDE.md) > **haozi-ui**

## 变更记录 (Changelog)

- **2025-11-26 15:00:58** - 初始化前端模块文档

## 模块职责

haozi-ui 是基于 Next.js 16 构建的现代化前端管理系统，提供完整的用户界面和交互体验。采用 App Router 架构，支持服务端渲染和客户端渲染的混合模式。

## 入口与启动

### 核心入口文件
- **根布局**: `app/layout.tsx` - 全局 Ant Design 注册和基础布局
- **首页入口**: `app/page.tsx` - 自动重定向到仪表板
- **启动脚本**: `package.json` 中的 `npm run dev`

### 应用启动流程
1. 访问根路径 `/` → `page.tsx` → 自动重定向到 `/dashboard`
2. 路由分组：
   - `(auth)` - 认证相关页面组
   - `(dashboard)` - 仪表板页面组
   - `(system)` - 系统管理页面组

## 对外接口

### API 服务层
- **用户服务**: `services/userService.ts` - 完整的用户管理API
- **API基础配置**: `lib/api.ts` (推测位置)
- **API端点定义**: `lib/apiEndpoints.ts` (推测位置)

### 主要API接口
```typescript
// 用户管理相关
getUserPage()      // 获取用户分页列表
createUser()       // 创建用户
updateUser()       // 更新用户
deleteUser()       // 删除用户
resetUserPassword() // 重置密码
getCurrentUserInfo()  // 获取当前用户信息
```

## 关键依赖与配置

### 核心技术栈
- **Next.js**: 16.0.0 (App Router架构)
- **React**: 19.2.0 (最新版本)
- **TypeScript**: 5.x (严格模式)
- **Ant Design**: 5.27.6 (UI组件库)
- **Tailwind CSS**: 4.x (原子化样式)

### 主要依赖
```json
{
  "next": "16.0.0",
  "react": "19.2.0",
  "antd": "^5.27.6",
  "@ant-design/icons": "^6.1.0",
  "@ant-design/nextjs-registry": "^1.1.0",
  "axios": "^1.12.2",
  "dayjs": "^1.11.18",
  "lodash": "^4.17.21",
  "zustand": "^5.0.8",
  "tailwindcss": "^4"
}
```

### 项目配置
- **路径别名**: `@/*` 指向项目根目录
- **开发端口**: 3000
- **构建工具**: Next.js 内置构建系统
- **样式方案**: Tailwind CSS + Ant Design 混合

## 页面结构

### App Router 目录结构
```
app/
├── layout.tsx                 # 根布局
├── page.tsx                   # 首页 (重定向)
├── (auth)/                    # 认证路由组
│   ├── layout.tsx            # 认证布局
│   └── ...                   # 登录、注册页面
├── (dashboard)/              # 仪表板路由组
│   ├── layout.tsx            # 仪表板布局
│   └── dashboard/            # 仪表板页面
└── (system)/                 # 系统管理路由组
    ├── layout.tsx            # 系统管理布局
    └── system/               # 系统管理页面
        ├── menu/
        ├── role/
        └── user/
```

## 组件架构

### 布局组件
- **AdminLayout**: `components/layout/AdminLayout.tsx` (推测)
- **认证布局**: `(auth)/layout.tsx` - 简洁的居中布局

### 页面组件特点
- 使用函数式组件和 React Hooks
- Ant Design SSR 兼容 (通过 `@ant-design/nextjs-registry`)
- TypeScript 严格类型检查
- 响应式设计支持

## 状态管理

### 状态方案
- **Zustand**: 5.0.8 - 轻量级状态管理
- **本地状态**: React useState/useEffect
- **全局状态**: 推测使用 Zustand store

## 样式系统

### 样式架构
- **Tailwind CSS**: 原子化CSS框架
- **Ant Design**: 组件库样式
- **自定义样式**: `globals.css` 全局样式
- **CSS变量**: 推测使用CSS变量进行主题定制

## 测试与质量

### 代码质量工具
- **ESLint**: 9.x - 代码检查
- **TypeScript**: 严格模式类型检查
- **Prettier**: 推测配置

### 测试策略
- 测试配置待完善
- 建议使用 Jest + React Testing Library

## 常见问题 (FAQ)

### Q: 如何添加新页面？
A: 在 `app/` 目录下创建新的路由文件，遵循 App Router 约定

### Q: 如何集成新的API接口？
A: 在 `services/` 目录下创建对应的服务文件，统一管理API调用

### Q: Ant Design SSR 问题如何解决？
A: 项目已集成 `@ant-design/nextjs-registry` 解决服务端渲染兼容性问题

### Q: 如何自定义主题？
A: 通过 Ant Design 的 ConfigProvider 结合 Tailwind CSS 变量进行主题定制

## 相关文件清单

### 核心文件
- `package.json` - 项目依赖和脚本
- `app/layout.tsx` - 根布局组件
- `app/page.tsx` - 首页组件
- `services/userService.ts` - 用户API服务
- `tailwind.config.js` - Tailwind 配置 (推测)
- `next.config.js` - Next.js 配置 (推测)

### 配置文件
- `tsconfig.json` - TypeScript 配置 (推测)
- `.eslintrc.json` - ESLint 配置 (推测)

### 部署文件
- `.next/` - Next.js 构建输出 (运行时生成)
- `public/` - 静态资源目录

## 开发建议

### 新功能开发
1. 遵循 App Router 路由约定
2. 使用 TypeScript 严格模式
3. API调用统一通过 services 层
4. 组件优先使用 Ant Design
5. 样式优先使用 Tailwind CSS

### 性能优化
1. 利用 Next.js 的代码分割和懒加载
2. 优化图片资源 (Next.js Image 组件)
3. 合理使用 React.memo 和 useMemo