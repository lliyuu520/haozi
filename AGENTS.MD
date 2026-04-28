# AGENTS.MD

本文件给 Codex 或其他代码代理提供本仓库的工作约定。优先遵守当前代码实际结构；旧文档中与 `pom.xml`、`package.json` 或源码不一致的信息，以源码和配置为准。

## 项目概览

- 项目名称：Haozi 管理脚手架。
- 仓库形态：前后端分离，根目录是 Maven 聚合工程，前端不是 Maven 模块。
- 后端目录：`haozi-admin`，包名 `com.haozi`。
- 前端目录：`haozi-ui-vue`，Vue 3 + TypeScript + Vite。
- 文档目录：`docs`，其中 `docs/doc/database` 保存建表脚本，`docs/sql` 保存增量 SQL。
- 脚手架范围：只保留系统管理、权限认证、监控、下载中心、区域和通用文件能力，不引入项目专有业务模块。

## 当前技术栈

- 后端：Java 17、Spring Boot 3.3.8、Undertow、MyBatis-Plus 3.5.12、MySQL、Redis、Sa-Token 1.42.0、MapStruct、Lombok。
- 前端：Vue 3.2.47、TypeScript 4.7.4、Vite 6.2.6、Element Plus 2.9.8、Pinia 2.0.30、Vue Router 4.1.5、Axios、VXE Table、高德地图组件。
- API 返回统一使用 `Result<T>`，成功码为 `0`；分页返回 `PageVO<T>`，字段为 `list` 和 `total`。

## 常用命令

在根目录执行：

```bash
mvn clean compile
mvn clean package
mvn -pl haozi-admin -am compile
mvn -pl haozi-admin -am package
```

后端开发：

```bash
cd haozi-admin
mvn spring-boot:run
mvn clean package
java -jar target/haozi-admin.jar
```

前端开发：

```bash
cd haozi-ui-vue
yarn install
yarn dev
yarn build
yarn vue-tsc --noEmit --skipLibCheck
```

注意：`package.json` 当前只定义了 `dev` 和 `build` 脚本，没有 `type-check` 脚本。根 POM 中设置了 `skipTests=true`，需要显式验证测试时使用 `mvn test -DskipTests=false`。

## 后端约定

- Controller 放在 `modules/<module>/controller`，使用 `@RestController`、`@RequestMapping`、`@RequiredArgsConstructor`，返回 `Result<T>`。
- 权限使用 Sa-Token 的 `@SaCheckPermission("模块:实体:操作")`，前端按钮权限 `v-auth` 要与后端权限码保持一致。
- Service 接口继承 `BaseService<Entity>`，实现类继承 `BaseServiceImpl<Mapper, Entity>`。
- 写操作使用 `@Transactional(rollbackFor = Exception.class)`，异常提示面向用户时使用中文。
- Mapper 继承 `IBaseMapper<Entity>`；复杂 SQL 放到 `src/main/resources/mapper/**` 下的 XML。
- Entity 继承 `BaseEntity`，基础字段包括 `id`、`createTime`、`updateTime`、`creator`、`updater`、`deleted`，逻辑删除由 MyBatis-Plus 处理。
- Query 继承 `BaseQuery`，分页字段为 `page`、`limit`，排序字段为 `order`、`asc`。
- DTO/VO/Entity 转换优先使用 `modules/<module>/convert` 下的 MapStruct converter，保持 `INSTANCE = Mappers.getMapper(...)` 模式。
- 查询条件优先使用 `Wrappers.lambdaQuery()` 或 `LambdaQueryWrapper`，避免硬编码列名。

## 前端约定

- 当前 React 迁移阶段暂不考虑移动端适配；页面迁移和布局修复优先保证桌面端后台管理使用体验，不为移动端额外增加断点、侧栏折叠、表格移动端重排等适配逻辑。
- Vue 文件优先使用 Composition API 和 `<script setup lang="ts">`，除非现有文件已经采用其他写法。
- 页面放在 `src/views/<module>/<entity>/`，常见结构是 `index.vue` 与 `add-or-update.vue`。
- API 文件放在 `src/api/**`，命名沿用 `useXxxApi`、`useXxxSubmitApi`、`useXxxDeleteApi` 等函数风格。
- HTTP 请求统一走 `src/utils/request.ts`，响应拦截器已解包后端 `Result`；业务代码通常读取 `res.data`。
- 列表页优先复用 `src/hooks/index.ts` 中的 `useCrud`，配置 `dataListUrl`、`deleteUrl`、`queryForm`、`cacheKey` 等。
- 路由以后台动态菜单为主，`src/router/index.ts` 使用 `import.meta.glob('/src/views/**/*.vue')` 动态加载页面。新增菜单 URL 时要保证对应 `src/views/<url>.vue` 存在。
- 状态管理使用 Pinia，store 实例通过 `src/store/index.ts` 的 `registerStore()` 注册到统一 `store` 对象。
- 全局组件和插件在 `src/main.ts` 注册，包括 Element Plus、VXE Table、SvgIcon、FastSelect、FastUser、SubmitButton 和 AMap。

## 数据库与配置

- 建表脚本放在 `docs/doc/database`，增量变更放在 `docs/sql`。
- 数据库字段使用下划线命名，Java/TypeScript 标识符使用英文驼峰命名。
- 新增或修改表结构时，同步更新 SQL、Entity、DTO/VO、Mapper、Service、Controller 和前端 API/页面。
- `haozi-admin/src/main/resources/application.yml` 包含数据库、Redis、云服务等环境配置。不要在回复、日志或新文档中泄露真实连接串、密码、密钥；新增敏感配置优先使用环境变量或 profile。
- 后端环境变量示例放在 `haozi-admin/.env.example`，不要提交真实 `.env` 或线上凭据。

## 代码风格

- 对话、文档、用户可见提示、异常信息和代码注释使用中文；类名、方法名、变量名、字段名使用英文。
- `.editorconfig` 规定 UTF-8、LF、4 空格、最大行宽 120；修改已有文件时优先保持该文件现有缩进和格式。
- Java 代码保持分层清晰，避免在 Controller 中写业务逻辑。
- Vue 模板避免复杂表达式，复杂状态放到脚本区的变量、computed 或方法中。
- 不引入未使用依赖；添加依赖时同步说明用途，并检查现有版本兼容性。

## 代理工作流

- 开始修改前先查看 `git status --short`，确认已有用户改动。
- 不要还原、覆盖或删除非本次任务产生的改动，除非用户明确要求。
- 不要自动 commit、push 或改写 Git 历史，除非用户明确要求。
- 修改后尽量运行最小必要验证：后端改动跑 Maven compile/test，前端改动跑 `yarn build` 或 `vue-tsc`。
- 如果无法验证，最终回复中明确说明未验证原因。
