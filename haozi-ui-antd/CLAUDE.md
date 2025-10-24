# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Next.js 16 + React 19 + TypeScript 5 的现代化前端项目，名为"haozi-ui-antd"。项目采用 App Router 架构和 Tailwind CSS 4 样式系统。

## 核心技术栈

- **前端框架**: Next.js 16.0.0 + React 19.2.0 + TypeScript 5.7.3
- **构建工具**: Next.js 内置构建系统
- **样式系统**: Tailwind CSS 4 + PostCSS
- **字体优化**: next/font (Geist Sans + Geist Mono)
- **代码检查**: ESLint 9 + eslint-config-next

## 常用开发命令

```bash
# 进入项目目录
cd haozi-ui-antd

# 开发环境启动
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

## 项目架构

### 目录结构

```
haozi-ui-antd/
├── app/                # Next.js App Router 目录
│   ├── layout.tsx     # 根布局组件
│   ├── page.tsx       # 首页组件
│   └── globals.css    # 全局样式
├── public/            # 静态资源目录
├── next.config.ts     # Next.js 配置文件
└── package.json       # 项目依赖配置
```

### 核心架构特点

1. **App Router 架构**: 使用 Next.js 16 的 App Router 模式，支持服务端组件和客户端组件
2. **现代化样式系统**: 基于 Tailwind CSS 4，支持深色模式和响应式设计
3. **字体优化**: 使用 next/font 自动优化 Geist 字体家族的加载
4. **TypeScript 全栈**: 完整的 TypeScript 类型支持
5. **ESLint 代码质量**: 集成 ESLint 9 和 Next.js 官方配置

### 关键组件

- **RootLayout**: 定义全局布局、字体配置和元数据
- **Home Page**: 响应式首页设计，支持深色模式切换
- **字体系统**: Geist Sans 和 Geist Mono 的变量配置

### 样式系统架构

- **Tailwind CSS 4**: 使用最新版本的原子化 CSS 框架
- **PostCSS 集成**: 自动处理 CSS 优化和兼容性
- **深色模式**: 内置 `dark:` 前缀支持
- **响应式设计**: 基于 Tailwind 的断点系统

### 构建配置

- **开发服务器**: 默认端口 3000，支持热重载
- **输出优化**: Next.js 自动代码分割和 Tree Shaking
- **字体优化**: 自动字体子集化和预加载
- **图片优化**: Next.js Image 组件自动优化

## 开发注意事项

1. **App Router 约定**: 遵循 Next.js App Router 的文件命名和组件约定
2. **服务端组件**: 默认使用服务端组件，需要客户端交互时使用 `'use client'` 指令
3. **样式隔离**: 使用 Tailwind 类名，避免全局样式污染
4. **类型安全**: 所有组件和函数都应该有完整的 TypeScript 类型定义
5. **响应式优先**: 所有 UI 组件都应该考虑移动端和桌面端的适配

## 环境配置

- **Node.js 版本**: 推荐 18.x 或更高版本
- **包管理器**: 支持 npm、yarn、pnpm、bun
- **浏览器支持**: 现代浏览器，支持 ES2020+ 特性
- **开发工具**: VS Code 配合官方 ESLint 和 TypeScript 插件