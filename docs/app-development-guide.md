# Haozi 移动端 APP 开发指南

## 文档目标

本文档用于指导 Haozi 后续新增移动端 APP。目标是在不影响现有管理后台的前提下，复用当前后端能力、接口契约和权限体系，独立建设 Android/iOS 客户端。

当前项目形态：

- 后端：`haozi-admin`，Java 17、Spring Boot 3.3.8、Undertow、MyBatis-Plus、MySQL、Redis、Sa-Token、springdoc-openapi。
- 管理后台：`haozi-ui-react`，React、TypeScript、Vite、Ant Design、TanStack Router、TanStack Query、Axios、Zustand。
- 接口协议：统一返回 `Result<T>`，成功码为 `0`；新版分页模型使用 `PageResult<T>`，字段为 `items`、`total`、`page`、`pageSize`。
- 接口文档：后端通过 `/v3/api-docs` 输出 OpenAPI，前端可通过 `@hey-api/openapi-ts` 生成 TypeScript 类型和客户端代码。

移动端 APP 不应改造现有后台 Web 技术栈。推荐新增独立目录，例如 `haozi-app`，与 `haozi-admin`、`haozi-ui-react` 并列。

## 选型结论

默认推荐：

```text
React Native + Expo + TypeScript + Expo Router + TanStack Query + Zustand
```

选择依据：

- 当前 Web 前端已经使用 React 和 TypeScript，团队可以复用组件思维、状态管理、接口类型和工程经验。
- React Native 适合构建 Android/iOS 原生 APP，不需要把现有后台页面套壳成 WebView。
- Expo 提供开发、调试、原生能力接入、构建和发布链路，适合先快速完成 POC，再逐步接入扫码、拍照、定位、推送等能力。
- Expo Router 的文件路由能降低移动端导航约定成本，适合新项目建立统一目录规范。

不推荐作为默认方案：

- 不建议把现有 `haozi-ui-web` 直接响应式改造成 APP。后台系统和 APP 的交互密度、导航方式、屏幕尺寸、离线场景不同。
- 不建议默认使用 Capacitor/WebView 套壳。它适合轻量 H5 包装，不适合长期维护的原生体验 APP。
- 不建议默认使用 Flutter，除非团队愿意单独投入 Dart/Flutter 技术栈，并接受和现有 React 体系割裂。
- 不建议默认使用 uni-app 或 Taro，除非明确要求同时交付小程序、H5 和 APP 多端。
- 不建议在 React Native APP 中直接使用 Ant Design。Ant Design 面向 Web，Ant Design Mobile 也主要面向移动 Web，不是 React Native 原生组件体系。

## 推荐仓库结构

建议后续形成如下结构：

```text
D:\project\haozi
├── haozi-admin
├── haozi-ui-web
├── haozi-app
│   ├── app
│   │   ├── _layout.tsx
│   │   ├── (auth)
│   │   │   └── login.tsx
│   │   ├── (tabs)
│   │   │   ├── _layout.tsx
│   │   │   ├── index.tsx
│   │   │   └── profile.tsx
│   │   └── settings
│   │       └── index.tsx
│   ├── src
│   │   ├── api
│   │   ├── client
│   │   │   └── generated
│   │   ├── components
│   │   ├── features
│   │   ├── hooks
│   │   ├── store
│   │   ├── theme
│   │   ├── types
│   │   └── utils
│   ├── assets
│   ├── app.json
│   ├── openapi-ts.config.ts
│   ├── package.json
│   └── tsconfig.json
└── docs
```

目录职责：

- `app`：Expo Router 路由入口，只放页面路由和布局壳。
- `src/api`：手写请求封装、拦截器、鉴权 token 注入、错误转换。
- `src/client/generated`：OpenAPI 生成代码，不手工维护。
- `src/components`：跨业务的移动端基础组件，例如空状态、错误页、表单项、列表项、权限按钮。
- `src/features`：业务模块，按功能域拆分页面内部组件、hooks 和局部 API 适配。
- `src/store`：Zustand 状态，例如登录用户、授权信息、设备配置、草稿状态。
- `src/theme`：颜色、字号、间距、圆角、阴影、暗色模式策略。
- `src/utils`：通用工具，不放业务逻辑。

## 初始化建议

创建项目时以 Expo 官方当前稳定模板为准。当前可参考：

```powershell
cd D:\project\haozi
npx create-expo-app@latest haozi-app --template default
cd haozi-app
```

如果官方文档指定了稳定 SDK 模板，可以按官方命令创建，例如：

```powershell
npx create-expo-app@latest haozi-app --template default@sdk-55
```

创建后建议补齐基础依赖。具体版本以后续 `package.json` 和锁文件为准：

```powershell
yarn add axios zustand @tanstack/react-query expo-secure-store
yarn add -D @hey-api/openapi-ts typescript
```

按需再接入：

- 扫码、相机：`expo-camera`
- 定位：`expo-location`
- 图片选择：`expo-image-picker`
- 文件系统：`expo-file-system`
- 推送：`expo-notifications`
- OTA 更新：`expo-updates`
- 构建发布：`eas-cli`

不要在第一版一次性安装全部原生能力。先完成登录、当前用户、首页、一个业务列表和详情，确认 Android/iOS 构建链路通畅后，再按业务需要补能力。

## 环境配置

APP 不使用 Vite 代理，真机访问后端时不能写 `localhost`。

建议新增：

```text
haozi-app\.env.example
```

示例内容：

```dotenv
EXPO_PUBLIC_API_URL=http://192.168.1.100:8080
EXPO_PUBLIC_APP_ENV=local
```

约定：

- `EXPO_PUBLIC_*` 会进入客户端包，只能放公开配置。
- API 密钥、OSS 密钥、推送私钥等不能放入 `EXPO_PUBLIC_*`。
- Android 模拟器访问宿主机可以使用 `http://10.0.2.2:8080`。
- iOS 模拟器通常可以访问宿主机 `localhost`，但真机必须使用电脑局域网 IP 或测试环境域名。
- 生产环境必须使用 HTTPS 域名，不直接暴露开发端口。

## 后端接口适配原则

移动端应复用后端业务能力，但不要直接照搬后台管理端接口形态。

推荐原则：

- 登录、当前用户、权限、文件上传、字典、配置等基础能力可以复用或提供 APP 轻量版本。
- 监控、缓存管理、系统菜单维护、角色用户维护等后台管理能力默认不开放给 APP。
- APP 列表接口应控制字段和分页大小，避免直接返回后台表格所需的全部字段。
- APP 首页接口应提供聚合 DTO，不让客户端并发拼多个后台接口。
- 移动端接口返回仍保持 `Result<T>`，成功 `code = 0`。
- 分页接口优先返回 `PageResult<T>`，字段保持 `items`、`total`、`page`、`pageSize`。
- 用户可见错误信息使用中文，后端通过 HTTP 状态码区分未登录、无权限、参数错误和系统异常。

建议新增 APP 专用接口命名空间：

```http
POST /app/auth/login
POST /app/auth/logout
GET  /app/auth/me
GET  /app/auth/authorizations
GET  /app/home/summary
GET  /app/profile
PUT  /app/profile
```

如果暂时复用 `/auth/*`，需要先确认现有登录接口是否能满足 APP token 获取和存储。当前 Web 端通过 Sa-Token 会话恢复 `/auth/me`，前端不保存可读 token；APP 端更适合显式接收 token，并在请求头中发送。

## 鉴权与会话

当前 Sa-Token 配置使用 `Authorization` 作为 token 名称。Web 端依赖浏览器 Cookie 和 `withCredentials`，移动端不应依赖浏览器 Cookie。

APP 推荐方案：

```text
登录成功后端返回 token
APP 使用 expo-secure-store 保存 token
Axios 请求拦截器写入 Authorization 请求头
401 清理本地 token 并跳转登录页
403 展示无权限提示，不清理登录态
退出登录时调用后端 logout，并清理本地 token、用户和权限状态
```

推荐登录响应模型：

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "token": "sa-token-value",
    "user": {
      "id": 1,
      "username": "admin",
      "realName": "管理员",
      "avatar": ""
    },
    "routeCodes": ["app.home", "app.profile"],
    "permissions": ["app:profile:update"]
  }
}
```

注意事项：

- 不在 AsyncStorage、明文文件、日志或错误上报里保存 token。
- 不在 APP 端保存密码。
- token 过期、被踢下线、服务端注销时统一走 401 处理。
- 如果要做长期登录，优先由后端明确 token 续期策略，不在客户端自行延长会话。
- 如果以后要接入微信、短信、OAuth 等登录方式，保持 APP 认证入口和后台账号密码登录解耦。

## OpenAPI 与类型生成

现有 Web 端已经使用 `@hey-api/openapi-ts` 读取：

```text
http://localhost:8080/v3/api-docs
```

APP 端可以沿用同类配置：

```ts
import { defineConfig } from '@hey-api/openapi-ts';

export default defineConfig({
  input: process.env.OPENAPI_URL || 'http://localhost:8080/v3/api-docs',
  output: {
    path: './src/client/generated',
    format: 'prettier',
  },
  plugins: ['@hey-api/client-axios', '@tanstack/react-query', '@hey-api/typescript'],
});
```

建议命令：

```json
{
  "scripts": {
    "openapi": "openapi-ts",
    "typecheck": "tsc --noEmit"
  }
}
```

约定：

- 生成代码只放在 `src/client/generated`。
- 业务页面不要直接散落写 URL 字符串，优先通过 API 层统一封装。
- 后端对外 DTO、VO、record 继续保留 JavaDoc 和 `@Schema`，保证 Apifox/OpenAPI 导入信息完整。
- APP 专用接口如果新增响应模型，也要补类级和字段级 `@Schema`。
- OpenAPI 安全方案后续要补充移动端 header token 说明，不要只声明 Cookie。

## 请求层规范

APP 请求层应与 Web 端语义保持一致，但实现不能依赖浏览器能力。

统一处理：

- `baseURL` 来自 `EXPO_PUBLIC_API_URL`。
- 请求超时建议先使用 30 到 60 秒，上传接口单独调整。
- 请求前从 `expo-secure-store` 读取 token，写入 `Authorization` 头。
- 响应必须识别 `Result<T>`。
- `code = 0` 时返回 `data`。
- `code != 0` 时抛业务错误，展示 `msg` 或 `message`。
- HTTP 401 清理会话并跳转登录。
- HTTP 403 展示无权限提示。
- HTTP 409 展示业务冲突提示。
- HTTP 500 以上展示系统异常提示，并保留 traceId 便于排查。

错误模型建议：

```ts
export type ApiError = {
  code: string;
  message: string;
  path: string;
  timestamp: string;
  traceId?: string | null;
  details?: Record<string, string>;
};

export type ResultEnvelope<T> = {
  code: number | string;
  msg?: string;
  message?: string;
  data?: T;
};
```

## 路由与权限

移动端路由不复用 Web 后台 route manifest。APP 应有独立的 route code 和 permission code。

推荐 route code：

```text
app.home
app.profile
app.settings
app.scan
app.messages
```

推荐 permission code：

```text
app:profile:update
app:file:upload
app:scan:use
app:message:read
```

路由策略：

- 未登录用户只能访问 `(auth)` 路由组。
- 已登录用户进入 `(tabs)` 或业务路由。
- 初始化时调用 `/app/auth/me` 或 `/auth/me` 恢复当前用户。
- 初始化后调用授权接口或使用登录响应内的权限集合。
- 页面入口按 `routeCodes` 控制展示。
- 操作按钮按 `permissions` 控制展示。
- 后端仍通过 `@SaCheckPermission` 做最终权限校验。

不要只依赖前端隐藏按钮来保护接口。

## 状态管理与缓存

推荐分工：

- TanStack Query：服务端状态，例如用户详情、列表、字典、消息、首页统计。
- Zustand：客户端状态，例如当前用户、权限、设备信息、主题、草稿。
- SecureStore：敏感本地数据，例如 token。
- AsyncStorage：非敏感偏好，例如主题、最近选项、草稿 ID。

缓存策略：

- 个人信息、权限、字典可以设置较长 stale time。
- 业务列表进入页面时刷新，返回页面时按需保持缓存。
- 写操作成功后精准 invalidate 相关 queryKey。
- APP 回到前台时可刷新关键接口，例如当前用户、消息数量、待办数量。
- 弱网场景下优先给出可理解提示，不让页面长期空白。

## UI 与交互规范

APP 端要以移动端使用习惯重新设计，不照搬后台表格。

基础原则：

- 列表使用卡片、分组、摘要，不使用宽表格。
- 搜索条件默认收起，常用条件前置。
- 表单按单列垂直布局，减少一次填写字段。
- 主操作固定在底部或导航栏右侧，避免长页面找不到按钮。
- 危险操作使用确认弹层或二次确认。
- 空状态、加载状态、错误状态必须完整。
- 文案使用中文，和 Web 后台保持同一业务术语。
- 图标和颜色可以继承 Web 的品牌感，但不要硬套 Ant Design 组件风格。

建议先沉淀基础组件：

- `AppScreen`：页面安全区、背景、边距。
- `AppHeader`：标题、返回、右侧操作。
- `AppButton`：主按钮、次按钮、危险按钮。
- `AppListItem`：移动端列表项。
- `AppEmpty`：空状态。
- `AppError`：错误状态和重试。
- `PermissionGate`：权限控制容器。
- `UploadField`：上传字段。

## 原生能力接入顺序

第一阶段只做基础业务闭环：

```text
登录 -> 当前用户 -> 首页 -> 一个业务列表 -> 详情 -> 退出登录
```

第二阶段按业务接入原生能力：

- 扫码：明确码制、扫码结果格式、接口幂等。
- 拍照和相册：明确压缩、裁剪、大小限制、上传失败重试。
- 定位：明确授权弹窗时机、定位失败兜底、后台是否需要经纬度。
- 推送：明确消息类型、点击跳转、已读状态、设备 token 绑定和解绑。
- 文件下载：明确下载目录、打开方式、权限提示。
- 分享：明确分享渠道和分享内容。

第三阶段处理发布能力：

- EAS Build。
- Android 签名。
- iOS 证书和描述文件。
- TestFlight 内测。
- 应用商店元数据。
- OTA 更新策略。

## 文件上传

当前后端已有通用文件能力。APP 端接入时建议：

- 上传前在客户端校验文件类型、大小和数量。
- 图片上传前按业务要求压缩，避免移动网络下上传超时。
- 上传接口单独设置更长 timeout。
- 上传结果只保存后端返回的文件 ID、URL 或业务 key，不保存本地临时路径。
- 大文件上传如果需要进度，单独设计上传 API，不复用普通 JSON 请求封装。
- 失败后支持重试，不自动无限重传。

## 推送与设备

如果 APP 需要推送，建议新增设备表或设备绑定接口。

建议接口：

```http
POST   /app/devices/register
DELETE /app/devices/current
PUT    /app/devices/current
```

设备信息建议包含：

- 用户 ID
- 设备 ID
- 平台：`ios` 或 `android`
- 推送 token
- APP 版本
- 系统版本
- 设备型号
- 最近活跃时间
- 是否启用

退出登录时必须解绑或停用当前设备推送 token，避免消息继续推到已退出账号。

## 版本与更新

建议版本策略：

- `app.json` 维护用户可见版本号。
- Android 使用 `versionCode`。
- iOS 使用 `buildNumber`。
- 后端提供最低支持版本和推荐升级版本。
- 强制升级只用于协议不兼容、安全风险或关键缺陷。
- OTA 只用于 JS 和资源更新，涉及原生权限、原生模块、app.json 原生配置变化时必须发新版安装包。

建议接口：

```http
GET /app/version/check?platform=ios&version=1.0.0&build=1
```

响应示例：

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "latestVersion": "1.0.1",
    "minVersion": "1.0.0",
    "forceUpdate": false,
    "downloadUrl": "https://example.com/app",
    "releaseNotes": ["修复已知问题", "优化登录体验"]
  }
}
```

## 日志与排障

开发期：

- 保留接口 URL、HTTP 状态、业务 code、traceId。
- 不打印 token、密码、短信验证码、身份证、手机号等敏感值。
- 真机调试时记录设备平台、系统版本、APP 版本和网络环境。

生产期：

- 建议接入崩溃和错误上报。
- 上报内容只包含排障必要信息。
- 服务端错误响应如果含 `traceId`，APP 应在错误详情或日志里保留，方便和后端日志关联。
- 关键业务操作可以由后端记录审计日志，客户端不承担可信审计职责。

## 开发流程建议

第一步：完成 POC。

```text
创建 haozi-app
配置 EXPO_PUBLIC_API_URL
实现请求层
实现登录页
保存 token
调用 me 接口
进入首页
实现退出登录
跑通 Android 真机
跑通 iOS 构建准备
```

第二步：形成基础框架。

```text
接入 Expo Router 布局
接入 TanStack Query
接入 Zustand
接入 OpenAPI 生成
实现权限控制
实现空状态、错误状态、加载状态
沉淀基础 UI 组件
```

第三步：迁移或新增业务能力。

```text
选择一个高价值业务模块
后端提供 APP 专用列表和详情接口
APP 实现列表、详情、提交或审核动作
完成弱网、无权限、登录过期、空数据验证
```

第四步：接入原生能力。

```text
扫码
拍照
定位
推送
文件上传
版本检测
```

第五步：准备发布。

```text
配置应用图标和启动图
配置 bundle identifier / applicationId
配置 Android 签名
配置 iOS 证书
配置 EAS Build
配置测试环境和生产环境
完成 TestFlight 或 Android 内测
```

## 后端改造清单

真正开始 APP 开发前，后端至少需要确认：

- 是否新增 `/app/**` 命名空间。
- 登录接口是否返回 APP 可保存的 token。
- Sa-Token 是否支持从 `Authorization` header 读取移动端 token。
- OpenAPI 安全方案是否补充 header token。
- APP 权限码是否独立于 Web 菜单权限。
- APP 用户信息是否需要精简字段。
- APP 首页是否需要聚合接口。
- 文件上传是否满足移动端图片压缩、重试、进度和失败恢复。
- 是否需要设备绑定、推送 token、版本检查表。
- 错误响应是否稳定包含中文 message 和 traceId。

## 前端改造边界

现有 `haozi-ui-react` 不作为 APP 代码来源，只提供以下参考：

- API 请求封装语义。
- `Result<T>` 解包方式。
- TanStack Query 使用习惯。
- Zustand 登录态和权限状态设计。
- route code 和 permission code 的授权思路。
- OpenAPI codegen 配置。
- 中文提示和错误处理风格。

不要从 Web 后台复制以下内容到 APP：

- Ant Design 组件。
- 桌面端表格布局。
- Web 路由结构。
- 浏览器 Cookie 登录假设。
- Vite 代理配置。
- 后台菜单维护页面。
- 监控、缓存、系统管理等管理员页面。

## 验证清单

基础验证：

- `yarn typecheck` 通过。
- `yarn openapi` 能基于本地后端生成类型。
- Expo 本地启动正常。
- Android 真机能访问后端接口。
- iOS 构建链路可行。
- 登录成功后能持久化 token。
- 关闭 APP 后重新打开能恢复登录态。
- 退出登录后 token 和用户状态被清空。

接口验证：

- `code = 0` 返回 `data`。
- `code != 0` 展示后端中文业务错误。
- 401 跳转登录。
- 403 展示无权限。
- 500 展示系统异常，并保留 traceId。
- 分页字段 `items`、`total`、`page`、`pageSize` 正确。

移动端验证：

- 弱网和断网提示明确。
- 空列表有空状态。
- 加载中有 loading。
- 列表下拉刷新和上拉加载行为正常。
- 表单校验文案明确。
- 上传失败可重试。
- 权限拒绝后有兜底说明。
- Android 返回键行为正确。
- iOS 安全区显示正常。

发布前验证：

- 生产 API 域名为 HTTPS。
- 没有把真实密钥写入客户端包。
- 没有在日志中输出 token。
- app 图标、启动图、应用名称正确。
- Android `versionCode` 递增。
- iOS `buildNumber` 递增。
- 隐私权限说明完整。
- TestFlight 或 Android 内测安装正常。

## 推荐第一版范围

第一版不要追求完整后台能力，建议只做：

- 账号密码登录。
- 当前用户信息。
- 首页摘要。
- 个人资料。
- 一个核心业务列表。
- 一个核心业务详情。
- 一个提交或处理动作。
- 退出登录。
- 版本检查。

第一版暂缓：

- 完整系统管理。
- 复杂报表。
- 大文件下载。
- 离线数据编辑。
- 多账号切换。
- 多端小程序统一。
- 复杂推送编排。

## 决策记录

当前默认决策：

- APP 独立为 `haozi-app`，不嵌入 `haozi-ui-react`。
- 默认技术栈为 React Native + Expo + TypeScript。
- 路由使用 Expo Router。
- 服务端状态使用 TanStack Query。
- 客户端状态使用 Zustand。
- token 使用 SecureStore 保存。
- 接口契约继续依赖 OpenAPI。
- APP 权限码和 Web 菜单权限保持思路一致，但资源编码独立。
- 新增移动端能力时优先补后端 APP 专用 DTO 和接口，不让移动端直接消费后台管理表格接口。

如后续明确必须同时支持微信小程序，应重新评估 Taro 或 uni-app，而不是在当前 React Native 方案中硬塞小程序目标。
