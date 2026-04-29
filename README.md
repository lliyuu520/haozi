# Haozi

Haozi 是一个前后端分离的管理后台脚手架，开箱即用的系统管理、权限认证和监控能力，适合作为新项目的起步模板。

## 特性

- 用户、角色、菜单、字典、参数配置等基础管理功能
- 基于 RBAC 的菜单级和按钮级权限控制
- 服务端和缓存运行状态监控
- 前后端完全分离，接口遵循统一规范
- 提供 OpenAPI 文档，方便对接移动端或其他客户端

## 技术选型

后端基于 Spring Boot 3.3 + MyBatis-Plus，使用 Sa-Token 管理认证与授权，Redis 做缓存和会话共享，Undertow 作为 Web 容器。

前端基于 React 19 + TypeScript，使用 Ant Design 6.3 作为 UI 组件库，TanStack Router 管理路由，TanStack Query 处理服务端状态，Zustand 管理客户端状态，Vite 负责构建。

数据库使用 MySQL，所有表结构脚本和增量变更 SQL 统一存放在 `docs/` 目录。

## 快速开始

### 环境准备

需要 JDK 17+、Node.js 20+、Yarn、MySQL 8+ 和 Redis。

### 后端

1. 创建 MySQL 数据库，执行 `docs/doc/database/` 下的建表脚本
2. 设置以下环境变量：

   | 变量 | 说明 |
   |---|---|
   | `MYSQL_HOST` | 数据库地址 |
   | `MYSQL_PORT` | 数据库端口 |
   | `MYSQL_DATABASE` | 数据库名 |
   | `MYSQL_USERNAME` | 数据库用户名 |
   | `MYSQL_PASSWORD` | 数据库密码 |
   | `REDIS_HOST` | Redis 地址 |
   | `REDIS_PORT` | Redis 端口 |
   | `REDIS_PASSWORD` | Redis 密码 |

3. 启动服务：

   ```bash
   cd haozi-admin
   mvn spring-boot:run
   ```

   服务运行在 `http://localhost:8080`，接口文档在 `/swagger-ui/index.html`。

### 前端

```bash
cd haozi-ui-react
yarn install
yarn dev
```

开发服务器运行在 `http://localhost:3000`，API 请求自动代理到后端 8080 端口。

### 生产构建

```bash
# 后端
mvn clean package
java -jar haozi-admin/target/haozi-admin.jar

# 前端
cd haozi-ui-react && yarn build
```

## 项目结构

```
haozi
├── haozi-admin/      # Spring Boot 后端
├── haozi-ui-react/   # React 前端
├── docs/             # 文档与数据库脚本
└── pom.xml           # Maven 父 POM
```

后端采用经典分层架构，业务模块集中在 `modules/` 下，公共能力放在 `common/` 包。前端按功能模块组织页面，路由、布局、状态管理各自独立。

## 接口规范

所有接口统一返回 `{ code, msg, data }` 结构，`code = 0` 表示成功。分页接口在 `data` 中返回 `list` 和 `total`。认证通过在请求头 `Authorization` 中携带 token 完成。

## License

MIT
