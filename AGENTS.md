# AGENTS.md

本文件约定 Codex 等代码代理在本仓库内的工作方式。若本文与 `pom.xml`、`package.json` 或源码冲突，以真实源码和配置为准。

## 项目与技术栈

- Haozi 是前后端分离的管理脚手架，根目录为 Maven 聚合工程，前端不属于 Maven 模块。
- 后端位于 `haozi-admin`，包名 `com.haozi`，使用 Java 17、Spring Boot 3.3.8、Undertow、MyBatis-Plus、MySQL、Redis、Sa-Token、MapStruct、Lombok。
- 前端位于 `haozi-ui-react`，使用 React 19、TypeScript、Vite、Ant Design、TanStack Router、TanStack Query、Axios、Zustand。
- 文档位于 `docs`，建表脚本放 `docs/doc/database`，增量 SQL 放 `docs/sql`。
- 脚手架只保留系统管理、权限认证、监控、下载中心、区域和通用文件能力，不引入项目专有业务模块。
- API 统一返回 `Result<T>`，成功码为 `0`；分页返回 `PageVO<T>`，字段为 `list` 和 `total`。

## 常用命令

根目录：

```bash
mvn clean compile
mvn clean package
mvn -pl haozi-admin -am compile
mvn -pl haozi-admin -am package
```

后端：

```bash
cd haozi-admin
mvn spring-boot:run
mvn clean package
java -jar target/haozi-admin.jar
```

前端：

```bash
cd haozi-ui-react
yarn install
yarn dev
yarn build
yarn typecheck
yarn openapi
```

根 POM 默认 `skipTests=true`；需要显式跑测试时使用 `mvn test -DskipTests=false`。

## 后端约定

- Controller 放 `modules/<module>/controller`，使用 `@RestController`、`@RequestMapping`、`@RequiredArgsConstructor`，返回 `Result<T>`。
- 权限使用 `@SaCheckPermission("模块:实体:操作")`；前端菜单、按钮权限码必须与后端 `perms` 保持一致。
- Service 接口继承 `BaseService<Entity>`，实现类继承 `BaseServiceImpl<Mapper, Entity>`。
- 写操作使用 `@Transactional(rollbackFor = Exception.class)`，用户可见异常信息使用中文。
- Mapper 继承 `IBaseMapper<Entity>`；复杂 SQL 放 `src/main/resources/mapper/**` XML。
- Entity 继承 `BaseEntity`；Query 继承 `BaseQuery`，分页字段为 `page`、`limit`，排序字段为 `order`、`asc`。
- DTO、VO、Entity 转换优先使用 `modules/<module>/convert` 下的 MapStruct converter，并保持 `INSTANCE = Mappers.getMapper(...)` 模式。
- 查询条件优先使用 `Wrappers.lambdaQuery()` 或 `LambdaQueryWrapper`，避免硬编码列名。

## 前端约定

- 当前后台优先保证桌面端体验，不为移动端额外增加断点、侧栏折叠或表格重排。
- 页面放 `src/features/<module>/<entity>/`，常见结构为 `XxxPage.tsx`、`XxxForm.tsx`、`api.ts`。
- 公共组件放 `src/components/**`，布局放 `src/layout/**`，Provider 与路由装配放 `src/app/**`。
- API 文件贴近业务页面，命名沿用 `listXxx`、`getXxx`、`createXxx`、`updateXxx`、`deleteXxx`。
- HTTP 请求统一走 `src/utils/request.ts` 的 `api` 门面，不在页面内重复处理 Cookie、401 跳转或消息提示。
- 列表和写操作优先使用 TanStack Query，保持 queryKey、刷新和错误处理语义一致。
- 路由入口维护在 `src/app/route-manifest/routes.tsx`；新增菜单页面时同步维护 `code`、`path`、`title`、`icon`、`order` 和懒加载组件。
- 菜单来源于 route manifest，并按后端授权 `routeCodes` 过滤；按钮权限使用 `src/components/Auth/Auth.tsx`。
- 登录用户、`routeCodes`、`permissions` 放 `src/store/authStore.ts`；侧边栏、标签页等纯前端状态放 `src/store/uiStore.ts`。

## 数据库与配置

- 数据库字段使用下划线命名，Java/TypeScript 标识符使用英文驼峰。
- 修改表结构时，同步更新 SQL、Entity、DTO/VO、Mapper、Service、Controller 和前端 API/页面。
- 不要在回复、日志或文档中泄露真实连接串、密码、密钥；新增敏感配置优先使用环境变量或 profile。
- `haozi-admin/.env.example` 只放示例，不提交真实 `.env` 或线上凭据。

## 代码风格

- 对话、文档、用户可见提示、异常信息和代码注释使用中文；类名、方法名、变量名、字段名使用英文。
- 遵守 `.editorconfig`：UTF-8、LF、4 空格、最大行宽 120；修改已有文件时优先保持原风格。
- Java 保持分层清晰，避免在 Controller 写业务逻辑。
- React JSX 避免复杂内联表达式，复杂状态、数据转换和事件处理放到组件函数内或独立方法中。
- 必要时为对外接口、核心业务、兼容逻辑和非显然转换补充有意义注释，避免只翻译代码。
- 不引入未使用依赖；新增依赖需说明用途并检查版本兼容性。

## 代理工作流

- 修改前先看 `git status --short`，确认并保护已有用户改动。
- 先理解相关入口、现有实现、模块边界和上下游依赖，再做最小必要改动。
- 不修改无关代码，不顺手重构，不自动 commit、push 或改写 Git 历史。
- 默认不新增或修改测试代码，除非用户明确要求；可以阅读并运行已有测试、构建、类型检查和 lint。
- 后端改动优先跑 Maven compile/package，前端改动优先跑 `yarn typecheck` 或 `yarn build`。
- 无法验证时，在最终回复中说明原因、风险和可补充的验证场景。
