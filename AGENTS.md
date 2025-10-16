# Repository Guidelines

## 项目结构与模块
- 后端：`haozi-admin`（Spring Boot 3，JDK 17）
  - 源码：`haozi-admin/src/main/java`
  - 资源与配置：`haozi-admin/src/main/resources/application.yml`
  - 测试：`haozi-admin/src/test/java`
- 前端：`haozi-ui-react`（Vite + React + TS）
  - 源码：`haozi-ui-react/src`
  - 环境：`.env*`（development/production）
- 父 POM：根目录 `pom.xml`（聚合 `haozi-admin`）。

## 构建、测试与本地开发
- 后端构建：`mvn -T 1C -DskipTests install`
- 后端运行：`mvn -pl haozi-admin spring-boot:run`
- 后端测试：`mvn -pl haozi-admin test`
- 前端安装：`cd haozi-ui-react && npm ci`
- 前端开发：`npm run dev`（Vite 开发服务器）
- 前端构建：`npm run build`；预览：`npm run preview`

## 代码风格与命名
- Java：遵循标准 Java 约定（类 `PascalCase`，方法/变量 `camelCase`，4 空格缩进）。
- TS/React：使用 Prettier 与 ESLint（见 `haozi-ui-react/.prettierrc`、`.eslintrc.cjs`）。
  - 关键规则：`tabWidth=2`、`singleQuote=true`、`printWidth=100`。
- 文件命名：React 组件 `PascalCase.tsx`，工具方法 `camelCase.ts`。

## 测试指引
- 后端：JUnit + Spring Boot Test，测试类放于 `src/test/java`，命名 `*Tests.java`。
- 覆盖率：功能变更需包含核心用例，避免回归（未强制阈值）。
- 前端：暂无内置测试脚本，按需引入 `vitest/jest` 并与 `npm test` 对齐。

## Commit 与 Pull Request
- Commit：推荐 Conventional Commits（如：`feat: 支持导出 Excel`）。
- PR 要求：
  - 变更说明、影响范围、回归风险与验证步骤
  - 关联 Issue/需求单；前端改动附关键截图/GIF
  - 通过构建与测试，确保 ESLint/Prettier 干净

## 安全与配置
- 切勿提交敏感配置与密钥；环境变量使用 `.env*` 或系统变量。
- Spring 配置支持多 Profile（如使用 `--spring.profiles.active=dev`）。

## Agent 指南（适用于自动化代理）
- 仅在工作区内修改；尊重现有风格（Java/TS、Prettier、ESLint）。
- 遵循 KISS/DRY/YAGNI 与单一职责；最小化变更面。
- 不进行 `git` 提交/分支/重写历史等高风险操作，除非明确授权。
