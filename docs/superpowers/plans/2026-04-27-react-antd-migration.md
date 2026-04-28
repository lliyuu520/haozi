# React + Ant Design Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将原管理脚手架升级为 React + Ant Design 管理脚手架，同时保留 Sa-Token 授权体系，并重建前后端契约、路由、权限、错误模型与页面组织方式。

**Architecture:** 前端使用 Vite + React + TypeScript + Ant Design + TanStack Router + TanStack Query + Zustand，按 feature-based 结构组织；后端继续使用 Spring Boot + Sa-Token + MyBatis-Plus，重做 OpenAPI 契约、HTTP 状态错误模型、分页模型和授权资源模型。后端只负责认证、授权与资源码下发，前端通过 route manifest 决定页面、菜单与组件加载。

**Tech Stack:** Java 17、Spring Boot 3.3.8、Sa-Token 1.42.0、MyBatis-Plus 3.5.12、springdoc-openapi、React 19、Vite、TypeScript、Ant Design 6、TanStack Router、TanStack Query、Zustand、Hey API OpenAPI TypeScript。

---

## 任务分类

本计划属于实现任务与重构任务的组合。

实施前必须先完成以下边界确认：

- 前端新目录固定为 `D:\project\haozi\haozi-ui-react`。
- 后端授权框架继续使用 Sa-Token，不引入 Spring Security。
- 允许改造后端接口协议、错误模型、分页模型、菜单权限模型。
- 旧版前端目录已移除，后续实现不再以旧目录作为行为参照或交付依赖。

## 拆解判断

本迁移必须拆解执行。

拆解依据：

- 涉及多个模块：后端认证、异常、分页、OpenAPI、菜单权限、前端工程、路由、布局、API client、页面、样式、验证。
- 同时包含分析、设计、实现、测试和完成态检查。
- 前后端存在先后依赖：后端 OpenAPI 与新认证接口会影响前端 client 生成和登录态实现。
- 单线程一次性实现容易遗漏权限、菜单、错误处理、分页、刷新 fallback 等收尾问题。

最终汇总方式：

- 每个阶段必须通过该阶段的最小验证命令。
- 前后端基础能力跑通后，再迁移页面。
- 页面迁移完成后，执行完成态检查，确认用户路径、按钮语义、错误提示、路由刷新和权限隐藏形成闭环。

## 总体执行顺序

1. 后端契约与授权资源模型改造。
2. React 工程初始化。
3. OpenAPI codegen 与请求层接入。
4. 登录态、权限、路由、布局跑通。
5. 基础组件与 CRUD Hook 实现。
6. 系统页面迁移。
7. 监控、日志、下载中心、区域等剩余页面迁移。
8. 回归验证与完成态检查。

## 关键设计决策

### Sa-Token 保留策略

继续保留：

- `sa-token-spring-boot3-starter`
- `sa-token-redis-template`
- `@SaCheckPermission`
- `@SaIgnore`
- `StpInterface`
- `StpUtil.login`
- `StpUtil.logout`
- `StpUtil.getLoginId`

建议调整：

- 登录成功后由后端写入 Sa-Token Cookie，前端不再保存可读 token。
- 前端请求统一使用 `credentials: 'include'` 或 Axios `withCredentials: true`。
- 开发环境 Vite 代理转发 `/api` 到后端，避免浏览器跨站 Cookie 限制。
- 后端异常不再包装成 `Result<T>` 业务码流，而是返回 HTTP 状态和统一错误体。

### 权限与菜单策略

历史模式：

- 后端菜单返回 `url`。
- 旧版前端按菜单 `url` 动态加载页面。
- 按钮通过旧版权限指令判断权限码。

新模式：

- 前端维护 route manifest，声明页面 code、path、title、icon、component、permissions。
- 后端返回当前用户被授权的 route code 与 permission code。
- 前端根据 route code 过滤菜单，根据 permission code 显示按钮。
- 后端接口仍使用 `@SaCheckPermission` 做最终权限校验。

## 后端数据模型建议

### 当前表保留原则

迁移期间优先复用现有系统管理表，降低数据库变更风险：

- `sys_user`
- `sys_role`
- `sys_user_role`
- `sys_menu`
- `sys_role_menu`
- `sys_dict_type`
- `sys_dict_data`
- `sys_config`
- `sys_log`
- `sys_area`
- `sys_download_center`

### 菜单表演进建议

将 `sys_menu` 从“前端组件路径菜单”演进为“授权资源与菜单节点”。

建议字段语义：

- `id`：资源 ID。
- `parent_id`：父节点 ID。
- `name`：菜单或按钮名称。
- `code`：资源编码，例如 `system.user`、`sys:user:save`。
- `type`：资源类型，建议 `CATALOG`、`MENU`、`BUTTON`。
- `path`：前端路由路径，仅菜单使用，例如 `/system/users`。
- `icon`：图标名称，仅菜单使用。
- `sort`：排序。
- `enabled`：是否启用。
- `open_style`：是否新窗口打开。
- `permission`：按钮或接口权限码，可与 `code` 合并，实施时优先保持兼容。

## 后端 API 契约建议

### 认证接口

新认证接口建议放在：

- `D:\project\haozi\haozi-admin\src\main\java\com\haozi\modules\auth\controller\AuthController.java`
- `D:\project\haozi\haozi-admin\src\main\java\com\haozi\modules\auth\service\AuthService.java`
- `D:\project\haozi\haozi-admin\src\main\java\com\haozi\modules\auth\service\impl\AuthServiceImpl.java`
- `D:\project\haozi\haozi-admin\src\main\java\com\haozi\modules\auth\dto\LoginDTO.java`
- `D:\project\haozi\haozi-admin\src\main\java\com\haozi\modules\auth\vo\CurrentUserVO.java`

接口：

```http
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
GET  /api/auth/authorizations
```

响应类型：

```java
public record CurrentUserVO(
    Long id,
    String username,
    String realName,
    String avatar,
    List<String> roles,
    List<String> routeCodes,
    List<String> permissions
) {
}
```

### 分页模型

新增：

- `D:\project\haozi\haozi-admin\src\main\java\com\haozi\common\model\PageResult.java`

建议结构：

```java
package com.haozi.common.model;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

/**
 * 统一分页响应模型。
 *
 * <p>新 React 前端直接消费 HTTP 2xx 响应中的业务数据，因此分页数据需要携带列表、
 * 总数和当前分页参数，避免前端依赖旧 Result/PageVO 包装结构。</p>
 */
@Schema(description = "分页响应")
public record PageResult<T>(
    @Schema(description = "当前页数据")
    List<T> items,
    @Schema(description = "总记录数")
    long total,
    @Schema(description = "当前页码")
    long page,
    @Schema(description = "每页数量")
    long pageSize
) {
    /**
     * 从 MyBatis-Plus 分页对象构建统一分页响应。
     */
    public static <T> PageResult<T> of(com.baomidou.mybatisplus.core.metadata.IPage<T> page) {
        return new PageResult<>(page.getRecords(), page.getTotal(), page.getCurrent(), page.getSize());
    }
}
```

### 错误模型

新增：

- `D:\project\haozi\haozi-admin\src\main\java\com\haozi\common\model\ErrorResponse.java`

建议结构：

```java
package com.haozi.common.model;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.OffsetDateTime;
import java.util.Map;

/**
 * 统一错误响应模型。
 *
 * <p>错误通过 HTTP 状态码表达大类，通过 code 表达系统内部错误编码。
 * 前端可以直接依赖状态码进入 TanStack Query 的 error 分支。</p>
 */
@Schema(description = "错误响应")
public record ErrorResponse(
    @Schema(description = "错误编码")
    String code,
    @Schema(description = "用户可读错误信息")
    String message,
    @Schema(description = "请求路径")
    String path,
    @Schema(description = "发生时间")
    OffsetDateTime timestamp,
    @Schema(description = "链路追踪 ID")
    String traceId,
    @Schema(description = "字段级错误详情")
    Map<String, String> details
) {
}
```

## 前端目录目标

目标目录：

- `D:\project\haozi\haozi-ui-react`

目标结构：

```text
haozi-ui-react
├─ public
├─ src
│  ├─ app
│  │  ├─ providers
│  │  ├─ router
│  │  └─ route-manifest
│  ├─ client
│  │  └─ generated
│  ├─ components
│  ├─ features
│  │  ├─ auth
│  │  ├─ dashboard
│  │  ├─ monitor
│  │  ├─ profile
│  │  └─ system
│  ├─ hooks
│  ├─ layout
│  ├─ store
│  ├─ styles
│  ├─ types
│  └─ utils
├─ index.html
├─ package.json
├─ tsconfig.json
└─ vite.config.ts
```

## Task 1: 后端基础契约改造

**目标：** 建立新前端需要的 OpenAPI、分页、错误响应和 Sa-Token Cookie 基础能力。

**Files:**

- Modify: `D:\project\haozi\haozi-admin\pom.xml`
- Modify: `D:\project\haozi\haozi-admin\src\main\resources\application.yml`
- Modify: `D:\project\haozi\haozi-admin\src\main\java\com\haozi\common\config\WebMvcConfig.java`
- Modify: `D:\project\haozi\haozi-admin\src\main\java\com\haozi\common\handler\ServerExceptionHandler.java`
- Create: `D:\project\haozi\haozi-admin\src\main\java\com\haozi\common\model\PageResult.java`
- Create: `D:\project\haozi\haozi-admin\src\main\java\com\haozi\common\model\ErrorResponse.java`
- Create: `D:\project\haozi\haozi-admin\src\main\java\com\haozi\common\config\OpenApiConfig.java`

- [ ] **Step 1: 确认 springdoc 依赖版本**

检查根 POM 是否已管理 `springdoc-openapi-ui` 版本。

Run:

```powershell
Select-String -Path 'D:\project\haozi\pom.xml' -Pattern 'springdoc|openapi' -Context 2,2
```

Expected:

```text
能看到 springdoc-openapi-ui 的版本管理；如果没有，先在根 POM dependencyManagement 中补充与 Spring Boot 3.3.x 兼容的 springdoc 版本。
```

- [ ] **Step 2: 新增 PageResult**

Create `D:\project\haozi\haozi-admin\src\main\java\com\haozi\common\model\PageResult.java` using the code in “分页模型” section.

- [ ] **Step 3: 新增 ErrorResponse**

Create `D:\project\haozi\haozi-admin\src\main\java\com\haozi\common\model\ErrorResponse.java` using the code in “错误模型” section.

- [ ] **Step 4: 改造异常处理器**

在 `ServerExceptionHandler` 中将 Sa-Token 与业务异常映射为 HTTP 状态码。

Expected mapping:

```text
NotLoginException -> 401
NotPermissionException -> 403
ServerException 或业务冲突 -> 409 或 400，按异常语义决定
MethodArgumentNotValidException -> 400，details 放字段错误
Exception -> 500
```

- [ ] **Step 5: 配置 OpenAPI**

Create `D:\project\haozi\haozi-admin\src\main\java\com\haozi\common\config\OpenApiConfig.java`.

Expected behavior:

```text
/v3/api-docs 能输出接口契约。
/swagger-ui/index.html 能访问接口文档。
OpenAPI 中能表达 Cookie 或 Header 鉴权方案。
```

- [ ] **Step 6: 验证后端编译**

Run:

```powershell
mvn -pl haozi-admin -am compile
```

Expected:

```text
BUILD SUCCESS
```

## Task 2: Sa-Token 登录态与授权接口改造

**目标：** 保留 Sa-Token，但把前端认证模型调整为“前端不保存 token，只通过当前用户接口感知会话”。

**Files:**

- Modify: `D:\project\haozi\haozi-admin\src\main\java\com\haozi\modules\sys\controller\SysAuthController.java`
- Modify: `D:\project\haozi\haozi-admin\src\main\java\com\haozi\modules\sys\service\SysAuthService.java`
- Modify: `D:\project\haozi\haozi-admin\src\main\java\com\haozi\modules\sys\service\impl\SysAuthServiceImpl.java`
- Modify: `D:\project\haozi\haozi-admin\src\main\java\com\haozi\common\satoken\config\StpInterfaceImpl.java`
- Create: `D:\project\haozi\haozi-admin\src\main\java\com\haozi\modules\auth\vo\CurrentUserVO.java`
- Create: `D:\project\haozi\haozi-admin\src\main\java\com\haozi\modules\auth\vo\AuthorizationVO.java`

- [ ] **Step 1: 保留旧登录接口或新增兼容路由**

实施时二选一：

```text
方案 A：保留 /sys/auth/login，但响应不再要求前端保存 accessToken。
方案 B：新增 /auth/login，并保留 /sys/auth/login 到迁移完成。
```

推荐方案 B，原因是新旧前端可并存验证。

- [ ] **Step 2: 新增当前用户响应**

Create `CurrentUserVO`:

```java
package com.haozi.modules.auth.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

/**
 * 当前登录用户上下文。
 *
 * <p>React 前端启动时通过该对象恢复用户、菜单和按钮权限。
 * routeCodes 用于过滤前端 route manifest，permissions 用于按钮和接口权限兜底。</p>
 */
@Schema(description = "当前登录用户")
public record CurrentUserVO(
    Long id,
    String username,
    String realName,
    String avatar,
    List<String> roles,
    List<String> routeCodes,
    List<String> permissions
) {
}
```

- [ ] **Step 3: 新增授权资源响应**

Create `AuthorizationVO`:

```java
package com.haozi.modules.auth.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.List;

/**
 * 当前用户授权资源集合。
 *
 * <p>该对象不携带前端组件路径，只携带稳定的 route code 与 permission code，
 * 以便前后端职责解耦。</p>
 */
@Schema(description = "当前用户授权资源")
public record AuthorizationVO(
    List<String> routeCodes,
    List<String> permissions
) {
}
```

- [ ] **Step 4: 改造登录服务**

登录成功后继续执行：

```java
StpUtil.login(userDetail.getId());
SysUserUtil.setUser(userDetail);
```

Expected:

```text
Sa-Token 负责生成会话。
前端通过 Cookie 或后端配置的 token 写出机制获得会话，但业务代码不再读取 token。
```

- [ ] **Step 5: 新增当前用户接口**

Expected endpoints:

```http
GET /auth/me
GET /auth/authorizations
POST /auth/logout
```

Expected behavior:

```text
未登录访问 /auth/me 返回 401。
已登录访问 /auth/me 返回 CurrentUserVO。
退出登录后再次访问 /auth/me 返回 401。
```

- [ ] **Step 6: 验证接口**

Run:

```powershell
mvn -pl haozi-admin -am compile
```

Expected:

```text
BUILD SUCCESS
```

## Task 3: 后端菜单权限资源模型改造

**目标：** 从“后端返回前端组件路径”演进为“后端返回授权资源码”。

**Files:**

- Modify: `D:\project\haozi\haozi-admin\src\main\java\com\haozi\modules\sys\entity\SysMenu.java`
- Modify: `D:\project\haozi\haozi-admin\src\main\java\com\haozi\modules\sys\dto\SysMenuDTO.java`
- Modify: `D:\project\haozi\haozi-admin\src\main\java\com\haozi\modules\sys\vo\SysMenuVO.java`
- Modify: `D:\project\haozi\haozi-admin\src\main\java\com\haozi\modules\sys\service\SysMenuService.java`
- Modify: `D:\project\haozi\haozi-admin\src\main\java\com\haozi\modules\sys\service\impl\SysMenuServiceImpl.java`
- Modify: `D:\project\haozi\haozi-admin\src\main\java\com\haozi\common\satoken\config\StpInterfaceImpl.java`
- Create: `D:\project\haozi\docs\sql\2026-04-27-menu-resource-model.sql`

- [ ] **Step 1: 设计 SQL 增量**

Create `D:\project\haozi\docs\sql\2026-04-27-menu-resource-model.sql`.

Expected SQL intent:

```sql
-- 将菜单表从组件路径模型演进为授权资源模型。
-- code 作为稳定资源编码，前端 route manifest 和后端权限共同依赖该字段。
ALTER TABLE sys_menu ADD COLUMN code varchar(100) NULL COMMENT '资源编码';
ALTER TABLE sys_menu ADD COLUMN type varchar(20) NULL COMMENT '资源类型：CATALOG、MENU、BUTTON';
ALTER TABLE sys_menu ADD COLUMN enabled tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否启用';
```

如果现有表已存在同义字段，实施时只补缺失字段，不重复添加。

- [ ] **Step 2: 改造 SysMenu 实体**

Add fields:

```java
/**
 * 稳定资源编码。
 *
 * <p>菜单资源使用 route code，例如 system.user；按钮资源使用 permission code，
 * 例如 sys:user:save。前端不再依赖数据库中的组件路径。</p>
 */
private String code;

/**
 * 资源类型。
 *
 * <p>用于区分目录、菜单和按钮，前端 route manifest 只消费 MENU/CATALOG，
 * 按钮权限通过 permissions 判断。</p>
 */
private String type;

/**
 * 是否启用。
 */
private Boolean enabled;
```

- [ ] **Step 3: 改造 StpInterfaceImpl**

Expected behavior:

```text
getPermissionList 返回当前用户拥有的 BUTTON permission code。
getRoleList 返回当前用户角色编码。
管理员角色可返回 * 或全部 permission code，保持现有超级管理员能力。
```

- [ ] **Step 4: 新增授权资源查询方法**

In `SysMenuService` add methods:

```java
/**
 * 查询当前用户可访问的前端路由编码。
 */
List<String> getRouteCodes(Long userId);

/**
 * 查询当前用户拥有的按钮和接口权限编码。
 */
List<String> getPermissionCodes(Long userId);
```

- [ ] **Step 5: 验证权限数据**

Run:

```powershell
mvn -pl haozi-admin -am compile
```

Expected:

```text
BUILD SUCCESS
```

## Task 4: React 工程初始化

**目标：** 在 `haozi-ui-react` 创建可运行的 React + Ant Design 基础工程。

**Files:**

- Create/Modify: `D:\project\haozi\haozi-ui-react\package.json`
- Create/Modify: `D:\project\haozi\haozi-ui-react\vite.config.ts`
- Create/Modify: `D:\project\haozi\haozi-ui-react\tsconfig.json`
- Create/Modify: `D:\project\haozi\haozi-ui-react\tsconfig.app.json`
- Create/Modify: `D:\project\haozi\haozi-ui-react\index.html`
- Create: `D:\project\haozi\haozi-ui-react\src\main.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\app\App.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\styles\index.scss`

- [ ] **Step 1: 初始化 package.json**

Expected dependencies:

```json
{
  "dependencies": {
    "@ant-design/icons": "^6.0.0",
    "@tanstack/react-query": "^5.0.0",
    "@tanstack/react-router": "^1.0.0",
    "antd": "^6.0.0",
    "axios": "^1.8.2",
    "dayjs": "^1.11.13",
    "file-saver": "^2.0.5",
    "nprogress": "^0.2.0",
    "qs": "^6.10.3",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "zustand": "^5.0.0"
  },
  "devDependencies": {
    "@hey-api/openapi-ts": "^0.80.0",
    "@types/file-saver": "^2.0.5",
    "@types/node": "^22.0.0",
    "@types/nprogress": "^0.2.0",
    "@types/qs": "^6.9.7",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^5.0.0",
    "sass": "^1.58.0",
    "typescript": "^5.0.0",
    "vite": "^8.0.0"
  }
}
```

Implementation note:

```text
实际版本以安装当天 npm registry 可用版本为准，但主版本保持 React 19、Ant Design 6、TanStack Query 5。
```

- [ ] **Step 2: 配置 Vite**

Expected `vite.config.ts` intent:

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'admin',
  },
});
```

- [ ] **Step 3: 创建入口文件**

Expected `src/main.tsx` intent:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from '@/app/App';
import '@/styles/index.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

- [ ] **Step 4: 验证前端安装和启动**

Run:

```powershell
cd D:\project\haozi\haozi-ui-react
pnpm install
pnpm build
```

Expected:

```text
构建成功，生成 admin 目录。
```

## Task 5: OpenAPI Client 与请求层接入

**目标：** 前端不再手写 API 类型，以后端 OpenAPI 生成 SDK 和 TanStack Query 配置。

**Files:**

- Create: `D:\project\haozi\haozi-ui-react\openapi-ts.config.ts`
- Create: `D:\project\haozi\haozi-ui-react\src\client\request.ts`
- Generate: `D:\project\haozi\haozi-ui-react\src\client\generated\**`
- Modify: `D:\project\haozi\haozi-ui-react\package.json`

- [ ] **Step 1: 添加 codegen 脚本**

Add scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "typecheck": "tsc -b --noEmit",
    "openapi": "openapi-ts"
  }
}
```

- [ ] **Step 2: 新增 OpenAPI 配置**

Expected `openapi-ts.config.ts` intent:

```ts
import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: 'http://localhost:8080/v3/api-docs',
  output: {
    path: './src/client/generated',
    format: 'prettier',
  },
  plugins: [
    '@hey-api/client-axios',
    '@tanstack/react-query',
    'typescript',
  ],
});
```

- [ ] **Step 3: 新增请求适配**

Expected behavior:

```text
baseURL 为 /api。
withCredentials 为 true。
非 2xx 响应进入 error 分支。
401 清理前端用户态并跳转登录。
403 显示无权限提示。
409 显示业务冲突提示。
```

- [ ] **Step 4: 生成 client**

Run:

```powershell
cd D:\project\haozi\haozi-ui-react
pnpm openapi
```

Expected:

```text
src/client/generated 下生成接口类型、client 和 TanStack Query helper。
```

## Task 6: 前端 Provider、状态和权限基础设施

**目标：** 建立全局 Provider、React Query、AntD 主题、Zustand store、权限 Hook 和权限组件。

**Files:**

- Create: `D:\project\haozi\haozi-ui-react\src\app\providers\AppProviders.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\app\providers\queryClient.ts`
- Create: `D:\project\haozi\haozi-ui-react\src\store\authStore.ts`
- Create: `D:\project\haozi\haozi-ui-react\src\store\uiStore.ts`
- Create: `D:\project\haozi\haozi-ui-react\src\hooks\useAuth.ts`
- Create: `D:\project\haozi\haozi-ui-react\src\components\Auth\Auth.tsx`

- [ ] **Step 1: 创建 QueryClient**

Expected behavior:

```text
默认关闭窗口聚焦自动重试。
业务错误不无限重试。
全局 mutation 成功后允许页面自行 invalidate。
```

- [ ] **Step 2: 创建 authStore**

State:

```ts
type AuthState = {
  initialized: boolean;
  user: CurrentUser | null;
  routeCodes: string[];
  permissions: string[];
  setCurrentUser: (user: CurrentUser | null) => void;
  setAuthorizations: (payload: { routeCodes: string[]; permissions: string[] }) => void;
  clear: () => void;
};
```

- [ ] **Step 3: 创建权限 Hook**

Expected behavior:

```text
useAuth(code) 返回当前用户是否拥有 permission code。
超级管理员或 * 权限返回 true。
未初始化或未登录返回 false。
```

- [ ] **Step 4: 创建权限组件**

Expected usage:

```tsx
<Auth code="sys:user:save">
  <Button type="primary">新增</Button>
</Auth>
```

- [ ] **Step 5: 接入 AppProviders**

Expected providers:

```text
ConfigProvider
App
QueryClientProvider
TanStack RouterProvider
```

## Task 7: TanStack Router 与 route manifest

**目标：** 使用前端 route manifest 管理页面、菜单、面包屑和权限过滤。

**Files:**

- Create: `D:\project\haozi\haozi-ui-react\src\app\route-manifest\types.ts`
- Create: `D:\project\haozi\haozi-ui-react\src\app\route-manifest\routes.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\app\router\router.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\app\router\AuthGuard.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\features\auth\LoginPage.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\features\dashboard\DashboardPage.tsx`

- [ ] **Step 1: 定义 route manifest 类型**

Expected type:

```ts
export type AppRouteMeta = {
  code: string;
  path: string;
  title: string;
  icon?: string;
  order: number;
  parentCode?: string;
  permission?: string;
  hideInMenu?: boolean;
};
```

- [ ] **Step 2: 定义首批 route manifest**

Initial routes:

```text
dashboard.home -> /dashboard
system.user -> /system/users
system.role -> /system/roles
system.menu -> /system/menus
system.dict -> /system/dicts
system.config -> /system/configs
monitor.server -> /monitor/server
monitor.cache -> /monitor/cache
system.log -> /system/logs
system.downloadCenter -> /system/download-center
system.area -> /system/areas
profile.password -> /profile/password
```

- [ ] **Step 3: 创建 AuthGuard**

Expected behavior:

```text
未登录访问业务路由时跳转 /login。
已登录访问 /login 时跳转 /dashboard。
首次进入应用调用 /auth/me 恢复用户上下文。
401 时进入登录页。
```

- [ ] **Step 4: 创建 Router**

Expected behavior:

```text
使用 Browser History。
业务路由挂载在主布局下。
404 页面兜底。
路由 loader 可以访问 QueryClient 和 authStore。
```

- [ ] **Step 5: 验证路由**

Run:

```powershell
cd D:\project\haozi\haozi-ui-react
pnpm typecheck
pnpm build
```

Expected:

```text
类型检查通过，构建成功。
```

## Task 8: 管理后台 Layout

**目标：** 重建管理后台骨架，包括侧边菜单、顶栏、面包屑、标签页、用户菜单、主题配置和主内容区。

**Files:**

- Create: `D:\project\haozi\haozi-ui-react\src\layout\AdminLayout.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\layout\Sidebar.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\layout\HeaderBar.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\layout\Breadcrumbs.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\layout\TabsBar.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\layout\UserMenu.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\styles\layout.scss`

- [ ] **Step 1: Sidebar 根据 routeCodes 过滤菜单**

Expected behavior:

```text
只显示用户授权 routeCodes 对应的菜单。
菜单排序使用 route manifest 的 order。
菜单点击使用 TanStack Router navigate。
```

- [ ] **Step 2: HeaderBar 提供常用动作**

Required actions:

```text
折叠侧边栏
刷新当前页
下载中心入口
用户菜单
退出登录
```

- [ ] **Step 3: TabsBar 管理访问标签**

State:

```text
打开过的路由标签
当前激活标签
关闭单个标签
关闭其他标签
关闭右侧标签
```

- [ ] **Step 4: 完成态检查**

Checklist:

```text
侧边栏折叠后图标仍可识别。
刷新当前页不会丢失登录态。
退出登录后不能返回业务页。
标签页关闭不会跳到不存在路由。
面包屑和菜单标题一致。
```

## Task 9: 通用组件与 CRUD Hook

**目标：** 建立页面复用基础，减少系统管理页面重复代码。

**Files:**

- Create: `D:\project\haozi\haozi-ui-react\src\hooks\useCrud.ts`
- Create: `D:\project\haozi\haozi-ui-react\src\hooks\useSubmitGuard.ts`
- Create: `D:\project\haozi\haozi-ui-react\src\components\PageContainer\PageContainer.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\components\SearchForm\SearchForm.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\components\FastSelect\FastSelect.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\components\SubmitButton\SubmitButton.tsx`

- [ ] **Step 1: useCrud 设计**

Input:

```ts
type UseCrudOptions<TQuery, TItem> = {
  queryKey: readonly unknown[];
  query: TQuery;
  pageSize?: number;
  listFn: (params: TQuery & { page: number; pageSize: number }) => Promise<PageResult<TItem>>;
  deleteFn?: (id: string | number) => Promise<void>;
};
```

Output:

```ts
type UseCrudResult<TQuery, TItem> = {
  query: TQuery;
  setQuery: (query: TQuery) => void;
  resetQuery: () => void;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  data: TItem[];
  total: number;
  loading: boolean;
  remove: (id: string | number) => Promise<void>;
};
```

- [ ] **Step 2: SubmitButton 防重复提交**

Expected behavior:

```text
按钮 loading 期间禁用。
同一次点击不会重复触发 mutation。
失败后恢复可点击。
```

- [ ] **Step 3: SearchForm**

Expected behavior:

```text
统一查询区域布局。
提供查询、重置、展开收起。
移动端布局不溢出。
```

- [ ] **Step 4: FastSelect**

Expected behavior:

```text
支持静态 options。
支持远程 query。
支持字典 code 加载。
与 AntD Form.Item 兼容。
```

## Task 10: 系统模块页面迁移

**目标：** 迁移脚手架核心系统管理页面。

**Files:**

- Create: `D:\project\haozi\haozi-ui-react\src\features\system\users\UserPage.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\features\system\users\UserForm.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\features\system\users\PasswordModal.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\features\system\roles\RolePage.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\features\system\roles\RoleForm.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\features\system\menus\MenuPage.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\features\system\menus\MenuForm.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\features\system\dicts\DictTypePage.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\features\system\dicts\DictDataPage.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\features\system\configs\ConfigPage.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\features\system\configs\ConfigForm.tsx`

- [ ] **Step 1: 用户页面**

Required behavior:

```text
分页查询用户。
新增用户。
编辑用户。
删除用户。
修改密码。
按钮权限：sys:user:save、sys:user:update、sys:user:delete。
```

- [ ] **Step 2: 角色页面**

Required behavior:

```text
分页查询角色。
新增角色。
编辑角色。
删除角色。
分配菜单和按钮权限。
按钮权限：sys:role:save、sys:role:update、sys:role:delete。
```

- [ ] **Step 3: 菜单资源页面**

Required behavior:

```text
树形展示菜单资源。
新增目录、菜单、按钮。
编辑资源 code、path、icon、type、enabled、sort。
删除资源前二次确认。
按钮权限：sys:menu:save、sys:menu:update、sys:menu:delete。
```

- [ ] **Step 4: 字典页面**

Required behavior:

```text
左侧字典类型，右侧字典数据。
类型与数据均支持新增、编辑、删除。
保存后刷新字典缓存。
按钮权限：sys:dict:save、sys:dict:update、sys:dict:delete。
```

- [ ] **Step 5: 配置页面**

Required behavior:

```text
分页查询配置。
新增配置。
编辑配置。
删除配置。
启用状态清晰展示。
按钮权限：sys:config:save、sys:config:update、sys:config:delete。
```

- [ ] **Step 6: 每个页面完成态检查**

Checklist:

```text
新增和编辑共用表单但标题准确。
删除弹窗文案明确对象名称。
保存成功后弹窗关闭并刷新列表。
表单提交失败时不关闭弹窗。
按钮无权限时不占位。
分页切换后查询条件不丢失。
```

## Task 11: 监控、日志、下载中心、区域页面迁移

**目标：** 完成脚手架剩余能力迁移。

**Files:**

- Create: `D:\project\haozi\haozi-ui-react\src\features\monitor\server\ServerPage.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\features\monitor\cache\CachePage.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\features\system\logs\LogPage.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\features\system\logs\LogDetail.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\features\system\download-center\DownloadCenterPage.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\features\system\areas\AreaPage.tsx`
- Create: `D:\project\haozi\haozi-ui-react\src\features\profile\PasswordPage.tsx`

- [ ] **Step 1: 监控页**

Required behavior:

```text
服务器监控展示 CPU、内存、JVM、磁盘、系统信息。
缓存监控展示 Redis 信息、命令统计和 key 管理。
权限：monitor:server:all、monitor:cache:all。
```

- [ ] **Step 2: 日志页**

Required behavior:

```text
分页查询日志。
按用户、操作、状态、时间筛选。
查看详情。
权限：sys:log:page、sys:log:info。
```

- [ ] **Step 3: 下载中心**

Required behavior:

```text
展示异步生成文件。
支持下载。
支持 SSE 通知新文件生成完成。
用户只能看到自己有权限的数据。
```

- [ ] **Step 4: 区域页**

Required behavior:

```text
展示区域树或表格。
保留现有区域查询能力。
地图能力单独封装，不让页面直接操作 AMap 全局对象。
```

- [ ] **Step 5: 个人密码页**

Required behavior:

```text
校验旧密码。
校验新密码强度和确认密码一致。
保存成功后提示重新登录或刷新登录态。
```

## Task 12: 前端部署与后端 history fallback

**目标：** Browser History 路由在刷新时不 404。

**Files:**

- Modify: `D:\project\haozi\haozi-admin\src\main\java\com\haozi\common\config\WebMvcConfig.java`
- Modify: `D:\project\haozi\haozi-ui-react\vite.config.ts`

- [ ] **Step 1: 前端构建输出确认**

Expected:

```text
haozi-ui-react 构建输出 admin 目录。
后端部署时可以把 admin 作为静态资源目录。
```

- [ ] **Step 2: 后端 fallback**

Expected behavior:

```text
访问 /admin 能返回 index.html。
访问 /admin/system/users 刷新时仍返回 index.html。
访问 /api/** 不进入前端 fallback。
访问 /v3/api-docs 和 /swagger-ui/** 不进入前端 fallback。
```

- [ ] **Step 3: 验证**

Run:

```powershell
cd D:\project\haozi\haozi-ui-react
pnpm build
cd D:\project\haozi
mvn -pl haozi-admin -am package
```

Expected:

```text
前端构建成功。
后端打包成功。
手动访问 Browser History 子路径不会 404。
```

## Task 13: 全量验证与完成态检查

**目标：** 确认迁移不是“能跑”，而是达到可交付状态。

**Verification commands:**

```powershell
cd D:\project\haozi
mvn -pl haozi-admin -am compile
mvn -pl haozi-admin -am test -DskipTests=false
cd D:\project\haozi\haozi-ui-react
pnpm typecheck
pnpm build
```

**Manual verification checklist:**

- [ ] 未登录访问 `/dashboard` 会跳转 `/login`。
- [ ] 登录成功后进入 `/dashboard`。
- [ ] 刷新 `/system/users` 不 404。
- [ ] 后端返回 401 时前端跳转登录页。
- [ ] 后端返回 403 时前端显示无权限提示。
- [ ] 没有按钮权限时按钮不渲染且不占位。
- [ ] 用户管理新增、编辑、删除、修改密码可用。
- [ ] 角色管理可以分配菜单和按钮权限。
- [ ] 菜单资源保存后重新登录或刷新权限后生效。
- [ ] 字典和配置保存后前端缓存刷新。
- [ ] 下载中心 SSE 能收到文件生成完成通知。
- [ ] 表格分页、排序、查询、重置行为一致。
- [ ] 弹窗保存失败不关闭，保存成功关闭并刷新列表。
- [ ] 退出登录后浏览器返回不能继续访问业务页。
- [ ] OpenAPI 生成 client 后前端类型检查通过。

**Completion quality checklist:**

- [ ] 用户路径顺畅，没有重复入口或绕路操作。
- [ ] 菜单、面包屑、标签页标题一致。
- [ ] 新增、编辑、删除、保存、取消等按钮语义一致。
- [ ] 错误提示是用户可读中文，不暴露堆栈和敏感配置。
- [ ] 关键公开接口、业务实现方法、关键私有方法均有中文注释。
- [ ] 没有只注释接口而忽略实现方法的情况。
- [ ] 旧版前端目录已移除，React 项目通过验收后不再依赖旧实现对照。

## 阶段性提交建议

项目约定不自动 commit。若用户明确要求提交，建议按以下边界提交：

```text
commit 1: docs: add react antd migration plan
commit 2: refactor: introduce backend api contract models
commit 3: refactor: add satoken auth context endpoints
commit 4: refactor: migrate menu authorization model
commit 5: feat: scaffold react antd admin app
commit 6: feat: add react auth router and layout
commit 7: feat: migrate system management pages
commit 8: feat: migrate monitor log download and area pages
commit 9: chore: complete migration verification and cleanup
```

## 风险与处理

| 风险 | 影响 | 处理 |
|---|---|---|
| Sa-Token Cookie 在开发环境跨域失效 | 登录后前端仍是未登录 | Vite 代理 `/api`，前端同源访问，Axios 开启 `withCredentials` |
| OpenAPI 生成类型与现有接口不匹配 | 前端生成失败或类型不稳定 | 先改造核心认证与分页接口，再逐步纳入其他接口 |
| Browser History 刷新 404 | 页面可跳转但刷新失败 | 后端配置 `/admin/**` fallback 到 `index.html` |
| 菜单资源模型影响历史接口 | 菜单字段变化可能影响存量数据与兼容路径 | 保留历史字段到 React 验收完成，不立即删除 `url` 等字段 |
| AntD Table 能力不足 | 部分表格交互降级 | 先迁移基础列表；复杂编辑或虚拟滚动再单独封装 |
| 地图组件替换成本高 | 区域页延期 | 地图能力单独封装为 `MapPicker`，不阻塞系统核心页面 |

## 不做事项

- 不引入 Spring Security。
- 不保留前端可读 token 作为新架构目标。
- 不让后端继续下发前端组件路径作为核心路由依据。
- 不恢复已移除的旧版前端目录。
- 不为了迁移顺手引入项目专有业务模块。
- 不在未通过核心验证前替换线上部署入口。
