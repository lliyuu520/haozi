# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概览

Haozi 是前后端分离的管理脚手架。Maven 聚合工程，前端不属于 Maven 模块。

- **后端** `haozi-admin`：Java 17、Spring Boot 3.3.8、Undertow、MyBatis-Plus 3.5.12、MySQL、Redis、Sa-Token 1.42.0、MapStruct、Lombok
- **前端** `haozi-ui-react`：React 19、TypeScript、Vite 8、Ant Design 6.3、TanStack Router + Query、Axios、Zustand
- **文档/SQL**：`docs/`，建表脚本 `docs/doc/database`，增量 SQL `docs/sql`

## 常用命令

```bash
# 后端编译（根目录，默认 skipTests=true）
mvn clean compile
mvn clean package
mvn -pl haozi-admin -am compile

# 后端运行
cd haozi-admin && mvn spring-boot:run

# 后端测试
mvn test -DskipTests=false

# 前端
cd haozi-ui-react
yarn install
yarn dev          # 开发服务器 :3000 → proxy /api → :8080
yarn build        # tsc + vite build，输出到 admin/
yarn typecheck    # tsc --noEmit
yarn openapi      # 从后端 OpenAPI 生成 TypeScript 类型
```

## 后端架构

包名 `com.haozi`，模块在 `modules/<module>/` 下：

```
common/
  base/
    entity/BaseEntity    — @TableId(ASSIGN_ID), createTime/updateTime/creator/updater/deleted(@TableLogic)
    mapper/IBaseMapper   — extends MyBatis-Plus BaseMapper
    page/PageVO          — 分页返回，字段 list + total
    query/BaseQuery      — 分页字段 page/limit，排序字段 order/asc
    service/BaseService  — extends IService; impl 在 service/impl/
  config/                — Spring 配置类
  utils/Result           — 统一响应 {code, msg, data}，成功 code=0
  exception/             — 全局异常处理
  handler/               — MyBatis-Plus MetaObjectHandler（自动填充）
  interceptor/           — 拦截器
```

**模块约定**（auth / sys / monitor）：

| 层 | 位置 | 约定 |
|---|---|---|
| Controller | `modules/<m>/controller/` | `@RestController`，`@RequiredArgsConstructor`，返回 `Result<T>` |
| Service | `modules/<m>/service/` | 接口继承 `BaseService`，实现继承 `BaseServiceImpl<M, E>` |
| Mapper | `modules/<m>/mapper/` | 继承 `IBaseMapper`，复杂 SQL 放 `src/main/resources/mapper/**` XML |
| Entity | `modules/<m>/entity/` | 继承 `BaseEntity` |
| Query | `modules/<m>/query/` | 继承 `BaseQuery` |
| 转换 | `modules/<m>/convert/` | MapStruct，`INSTANCE = Mappers.getMapper(...)` 模式 |
| DTO/VO | `modules/<m>/dto/`、`vo/` | 数据传输和视图对象 |

- 权限注解：`@SaCheckPermission("模块:实体:操作")`
- 写操作加 `@Transactional(rollbackFor = Exception.class)`
- 查询优先 `Wrappers.lambdaQuery()` 或 `LambdaQueryWrapper`
- 用户可见异常信息使用中文

## 前端架构

### 目录结构

```
src/
  app/
    providers/AppProviders    — QueryClient、Antd App、Router 装配
    router/
      router.tsx              — TanStack Router 定义，含 AuthGuard + RouteAccessGuard
      AuthGuard.tsx           — 初始化认证状态
      RouteAccessGuard.tsx    — 按 route code 鉴权
    route-manifest/
      routes.tsx              — 路由清单，维护 code/path/title/icon/order/component(lazy)
      types.ts、icons.tsx
    navigation/               — 菜单生成（从 manifest 按授权过滤）
  layout/
    AdminLayout.tsx            — 整体布局（侧边栏 + 顶栏 + 标签栏 + 内容区）
    Sidebar.tsx、HeaderBar.tsx、TabsBar.tsx
  features/
    auth/LoginPage
    dashboard/DashboardPage
    monitor/{server,cache}/
    system/{users,roles,menus,dicts,configs}/  — 每个实体含 XxxPage、XxxForm、api
  store/
    authStore.ts              — 登录用户、routeCodes、permissions
    uiStore.ts                — 侧边栏折叠、标签页等纯前端状态
  utils/request.ts            — axios 实例 + 拦截器，401→跳登录，code≠0→BusinessError；导出 api 门面
  components/                 — 公共组件（Auth 按钮权限等）
  types/                      — TypeScript 类型定义
  styles/                     — 全局样式
```

### 关键模式

- **请求**：全部通过 `src/utils/request.ts` 的 `api` 门面（`api.get/post/put/delete`），不在页面内直接使用 axios
- **数据获取**：列表和写操作优先 TanStack Query
- **路由**：路由清单在 `routes.tsx` 集中维护；新增页面时同步更新 code、path、title、icon、order 和 lazy component
- **菜单**：来源 route manifest，按后端授权的 `routeCodes` 过滤；按钮权限用 `<Auth>` 组件
- **API 方法命名**：`listXxx`、`getXxx`、`createXxx`、`updateXxx`、`deleteXxx`

## 权限体系

前后端权限码通过 route `code` 和 `@SaCheckPermission` 的 `perms` 保持一致：

- 菜单/路由权限：`authStore.routeCodes`，由 `AuthGuard` 初始化
- 按钮/操作权限：`authStore.permissions`，前端 `<Auth>` 组件控制显隐
- 后端：`@SaCheckPermission("sys:user:create")` 等注解

## 数据库

- 表字段下划线命名，Java/TypeScript 驼峰
- 修改表结构需同步：SQL → Entity → DTO/VO → Mapper → Service → Controller → 前端 API/页面
- 敏感配置使用环境变量或 profile，不提交凭据

## 代码风格

- 对话、文档、异常信息、注释：中文；类名、方法名、变量名、字段名：英文
- `.editorconfig`：UTF-8、LF、4空格缩进、行长 120
- 后端分层清晰，Controller 不写业务逻辑
- 前端避免 JSX 内复杂表达式，复杂逻辑提取到函数或方法中
- 不引入未使用依赖；新增依赖需说明用途
