# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个多模块项目，包含：

1. **haozi-ui-antd** - 基于 Next.js 16 + React 19 + Ant Design 5 + TypeScript 5 的前端管理系统
2. **haozi-admin** - 基于 Java Spring Boot 的后端管理系统

## 前端项目 (haozi-ui-antd)

### 核心技术栈

- **前端框架**: Next.js 16.0.0 + React 19.2.0 + TypeScript 5.x
- **UI 库**: Ant Design 5.27.6
- **样式**: Tailwind CSS 4.x
- **开发工具**: ESLint 9.x

### 常用开发命令

```bash
# 进入前端项目目录
cd haozi-ui-antd

# 开发环境启动 (端口 3000)
npm run dev

# 生产构建
npm run build

# 启动生产服务器
npm start

# 代码检查
npm run lint
```

### 前端项目架构

#### 目录结构

```
haozi-ui-antd/
├── app/                # Next.js App Router
│   ├── layout.tsx     # 根布局
│   └── page.tsx       # 首页
├── public/            # 静态资源
├── node_modules/      # 依赖包
├── .next/            # Next.js 构建输出
└── 配置文件
```

#### 架构特点

1. **Next.js App Router**: 使用最新 App Router 架构
2. **Ant Design 集成**: 通过 `@ant-design/nextjs-registry` 实现服务端渲染兼容
3. **TypeScript 严格模式**: 启用严格类型检查
4. **路径别名**: 配置 `@/*` 指向根目录
5. **Tailwind CSS**: 原子化 CSS 框架

### 后端项目 (haozi-admin)

#### 核心技术栈

- **后端框架**: Spring Boot 3.3.8 + Java 17
- **数据库**: MySQL + MyBatis Plus 3.5.12
- **权限认证**: Sa-Token 1.42.0 + Redis
- **缓存**: Redis + Redisson 3.34.1 (分布式锁)
- **服务器**: Undertow (替代 Tomcat)
- **工具库**: Hutool 5.8.38, Lombok, MapStruct
- **文档**: SpringDoc OpenAPI 1.6.15

#### 常用开发命令

```bash
# 进入后端项目目录
cd haozi-admin

# 编译项目
mvn clean compile

# 运行测试
mvn test

# 打包项目
mvn clean package

# 运行应用
java -jar target/haozi-admin.jar

# 跳过测试打包
mvn clean package -DskipTests
```

#### 后端项目架构

##### 目录结构

```
haozi-admin/
├── src/main/java/cn/lliyuu520/haozi/
│   ├── common/          # 公共组件
│   │   ├── base/       # 基础类 (BaseEntity, BaseService)
│   │   ├── cache/      # 缓存管理
│   │   └── config/     # 配置类
│   ├── sys/            # 系统管理模块
│   └── ...             # 其他业务模块
├── src/main/resources/ # 配置文件
└── target/             # 编译输出
```

##### 架构特点

1. **Maven 多模块**: 父项目统一管理依赖版本
2. **基础架构**: 统一的 BaseEntity、BaseService、IBaseMapper
3. **权限系统**: 基于 Sa-Token 的权限认证
4. **缓存策略**: 多层缓存 (本地缓存 + Redis)
5. **分布式支持**: Redisson 分布式锁
6. **云服务集成**: 阿里云 OSS、短信、RDS 服务

## 开发注意事项

### 前端开发 (haozi-ui-antd)

1. **Next.js App Router**: 使用最新的 App Router 和 Server Components
2. **Ant Design SSR**: 通过 `@ant-design/nextjs-registry` 确保服务端渲染兼容
3. **TypeScript**: 启用严格模式，充分利用类型检查
4. **Tailwind CSS**: 原子化样式开发，避免与 Ant Design 冲突
5. **路径别名**: 使用 `@/*` 别名简化导入

### 后端开发 (haozi-admin)

1. **Java 17**: 使用最新 Java 17 特性
2. **Spring Boot 3**: 利用 Spring Boot 3 的最新改进
3. **MyBatis Plus**: 简化数据库操作，统一使用 BaseMapper
4. **Sa-Token**: 权限认证使用 Sa-Token 框架
5. **代码生成**: 基于 BaseEntity、BaseService 快速开发
6. **注解处理器**: 配置 Lombok 和 MapStruct 注解处理器

### 通用开发流程

1. **全栈开发**: 前端端口 3000，后端默认端口 8080
2. **API 对接**: 前端调用后端 API 时注意跨域配置
3. **数据库**: 确保 MySQL 服务正常运行
4. **Redis**: 权限认证和缓存需要 Redis 支持
5. **打包部署**: 前端构建后可部署到 CDN 或静态服务器，后端打包为 JAR 文件