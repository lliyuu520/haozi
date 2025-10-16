# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 React 18 + TypeScript + Vite + Ant Design 5 的企业级管理系统前端项目，名为"haozi-ui-react"。项目采用现代化技术栈和组件化架构。

## 核心技术栈

- **前端框架**: React 18.3.1 + TypeScript 5.7.3
- **构建工具**: Vite 6.0.7
- **UI 库**: Ant Design 5.27.4
- **状态管理**: Zustand 5.0.8
- **路由**: React Router DOM 6.28.0
- **HTTP 客户端**: Axios 1.8.4
- **样式**: SCSS 预处理器

## 常用开发命令

```bash
# 进入项目目录
cd haozi-ui-react

# 开发环境启动
npm run dev

# 生产构建
npm run build

# 代码检查
npm run lint

# 类型检查
npm run type-check

# 预览构建结果
npm run preview
```

## 项目架构

### 目录结构

```
haozi-ui-react/
├── src/
│   ├── api/           # API 接口定义
│   ├── assets/        # 静态资源
│   ├── components/    # 公共组件
│   ├── hooks/         # 自定义 hooks
│   ├── pages/         # 页面组件
│   ├── router/        # 路由配置
│   ├── stores/        # Zustand 状态管理
│   ├── styles/        # 全局样式
│   ├── types/         # TypeScript 类型定义
│   └── utils/         # 工具函数
├── public/            # 公共资源
└── dist/              # 构建输出目录
```

### 核心架构特点

1. **动态路由系统**: 基于 React Router DOM v6，支持从后端获取菜单数据动态生成路由
2. **权限控制**: 基于 Zustand 的用户状态管理和权限验证
3. **组件懒加载**: 所有页面组件采用 React.lazy() 进行代码分割
4. **统一状态管理**: 使用 Zustand 管理用户状态、应用状态等
5. **请求封装**: 基于 Axios 的统一 HTTP 请求处理，包含拦截器和错误处理

### 关键组件

- **Layout 系统**: 包含侧边栏 (Sidebar) 和头部 (Header) 的响应式布局
- **useCrud Hook**: 提供通用的 CRUD 操作逻辑，支持分页、排序、筛选
- **useDynamicRoutes Hook**: 处理动态路由生成和更新
- **请求拦截器**: 自动添加认证 token、进度条显示、统一错误处理

### 状态管理架构

- **userStore**: 用户认证状态、用户信息、权限列表
- **appStore**: 应用全局状态配置

### API 层架构

- **模块化组织**: 按业务模块组织 API 接口（auth.ts, sys/, channel.ts 等）
- **统一请求封装**: request.ts 提供基础配置和拦截器
- **类型安全**: 完整的 TypeScript 类型定义

### 路由系统

- **静态路由**: 登录、404 等固定页面
- **动态路由**: 根据用户权限和菜单数据动态生成
- **路由守卫**: 在 Layout 组件中实现认证检查和权限验证

## 开发注意事项

1. **路径别名**: 项目配置了完整的路径别名 (@, @components, @utils 等)
2. **样式系统**: 使用 SCSS 预处理器，支持全局变量导入
3. **代码分割**: 所有页面组件必须使用 React.lazy() 懒加载
4. **权限控制**: 页面访问前需要检查用户认证状态和权限
5. **类型安全**: 所有 API 接口都有对应的 TypeScript 类型定义

## 构建配置

- **开发服务器**: 端口 3000，支持热重载
- **代理配置**: `/api` 代理到 `http://localhost:8080`
- **构建优化**: 启用 Gzip 压缩、代码分割、Tree shaking
- **输出目录**: 构建文件输出到 `admin` 目录