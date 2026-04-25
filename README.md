# 槟界业务管理系统

<div align="center">

![槟界](https://img.shields.io/badge/槟界-Binjie-blue)
![版本](https://img.shields.io/badge/版本-v1.0.0-green)
![构建状态](https://img.shields.io/badge/构建-通过-brightgreen)
![许可证](https://img.shields.io/badge/许可证-MIT-yellow)

**一个现代化的企业级业务管理系统，专为槟界行业打造**

[功能特性](#-功能特性) • [技术栈](#-技术栈) • [快速开始](#-快速开始) • [项目结构](#-项目结构) • [贡献指南](#-贡献指南)

</div>

---

## 📖 项目简介

槟界业务管理系统是一个基于 Spring Boot + Vue 3
构建的企业级综合业务管理平台，专门为槟界行业提供全方位的数字化解决方案。系统集成了订单管理、渠道管理、门店运营、产品追溯、营销活动等核心业务功能，帮助企业实现业务流程的数字化转型。

### 🎯 核心价值

- **业务流程数字化**: 从订单到配送的全流程数字化管理
- **渠道网络优化**: 多级经销商网络的精细化管理
- **产品质量追溯**: 完整的产品追溯体系，保障产品质量
- **营销活动管理**: 多样化的营销工具，提升客户参与度
- **数据驱动决策**: 全面的数据分析，支持业务决策优化

---

## ✨ 功能特性

### 📦 订单管理

- **在线订单提交**: 经销商在线下单，实时库存检查
- **财务审批流程**: 多级审批机制，确保资金安全
- **仓库发货管理**: 智能发货规划，物流跟踪
- **订单状态追踪**: 实时订单状态更新，全程可追溯

### 🤝 渠道管理

- **经销商管理**: 经销商资质审核、等级管理、业绩考核
- **区域管理**: 按区域划分管理，支持多级区域架构
- **业务员管理**: 业务员工作管理、客户分配、业绩统计
- **区域经理**: 区域监督管理、数据分析、决策支持

### 🏪 门店管理

- **门店创建审核**: 标准化门店创建流程，资质审核
- **库存管理**: 实时库存监控、智能补货提醒
- **拜访记录**: GPS 定位拜访、工作记录、客户反馈
- **销售统计**: 门店销售数据分析、趋势预测

### 🔍 产品追溯

- **二维码生成**: 批量二维码生成、关联管理
- **三级码关联**: 袋-礼盒-箱三级关联体系
- **扫码追溯**: 消费者扫码查询产品信息
- **防伪验证**: 产品真伪验证、防窜货监控

### 🎁 营销活动

- **抽奖系统**: 二维码扫描抽奖、4位验证码兑奖
- **积分体系**: 多种积分获取方式、积分兑换商城
- **会员管理**: 会员等级管理、个性化服务
- **活动管理**: 营销活动配置、效果分析

### 📱 微信集成

- **小程序**: 经销商小程序、消费者小程序
- **微信支付**: 集成微信支付，便捷支付体验
- **消息推送**: 业务通知、营销推送
- **社交分享**: 产品分享、活动推广

---

## 🛠 技术栈

### 后端技术

![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.0.4-brightgreen)
![Java](https://img.shields.io/badge/Java-17-orange)
![MyBatis Plus](https://img.shields.io/badge/MyBatis%20Plus-3.5.12-blue)
![MySQL](https://img.shields.io/badge/MySQL-8.0-blue)
![Redis](https://img.shields.io/badge/Redis-7.0-red)

- **核心框架**: Spring Boot 3.0.4 + Java 17
- **数据访问**: MyBatis Plus 3.5.12 + MySQL 8.0
- **缓存服务**: Redis 7.0 (会话存储 + 业务缓存)
- **安全框架**: Sa-Token 1.42.0 (令牌认证)
- **文档工具**: SpringDoc OpenAPI 1.6.15
- **构建工具**: Maven 3.8+

### 前端技术

![Vue 3](https://img.shields.io/badge/Vue%203-3.3.4-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Element Plus](https://img.shields.io/badge/Element%20Plus-2.3.8-blue)
![Vite](https://img.shields.io/badge/Vite-4.4.5-yellow)

- **核心框架**: Vue 3.3.4 + TypeScript 5.0
- **UI 组件**: Element Plus 2.3.8 + VXE Table
- **状态管理**: Pinia 2.1.0
- **路由管理**: Vue Router 4.2.0
- **HTTP 客户端**: Axios 1.4.0
- **构建工具**: Vite 4.4.5

### 云服务与中间件

![阿里云](https://img.shields.io/badge/阿里云-Cloud-orange)
![Docker](https://img.shields.io/badge/Docker-24.0-blue)
![Nginx](https://img.shields.io/badge/Nginx-1.25-green)

- **数据库**: 阿里云 RDS MySQL 8.0
- **缓存服务**: 阿里云 Redis 7.0
- **文件存储**: 阿里云 OSS
- **消息服务**: 阿里云 SMS
- **容器化**: Docker + Docker Compose
- **Web 服务器**: Nginx 1.25

---

## 🚀 快速开始

### 环境要求

- **Java**: JDK 17+
- **Node.js**: 18.0+
- **MySQL**: 8.0+
- **Redis**: 7.0+
- **Maven**: 3.8+

### 克隆项目

```bash
# 克隆项目
git clone https://github.com/your-organization/hncsbj.git

# 进入项目目录
cd hncsbj
```

### 后端启动

```bash
# 1. 编译项目
mvn clean compile

# 2. 打包项目
mvn clean package

# 3. 启动后端服务
java -jar hncsbj-admin/target/hncsbj-admin.jar

# 或使用开发模式启动
cd hncsbj-admin
mvn spring-boot:run
```

### 前端启动

```bash
# 1. 进入前端目录
cd hncsbj-ui

# 2. 安装依赖
yarn install

# 3. 启动开发服务器
yarn dev

# 4. 构建生产版本
yarn build
```

### 访问系统

- **前端地址**: http://localhost:3000
- **后端 API**: http://localhost:8080
- **API 文档**: http://localhost:8080/swagger-ui.html

### 默认账号

| 角色    | 用户名      | 密码          |
|-------|----------|-------------|
| 超级管理员 | admin    | admin123    |
| 经销商   | dealer   | dealer123   |
| 业务员   | salesman | salesman123 |

---

## 📁 项目结构

```
hncsbj/                          # 项目根目录
├── README.md                     # 项目说明文档
├── CLAUDE.md                     # 开发指南
├── .gitignore                    # Git 忽略文件
├── pom.xml                       # Maven 父项目配置
├── hncsbj-admin/                 # 后端服务模块
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/mgm/hncsbj/
│   │   │   │       ├── HncsbjAdminApplication.java    # 启动类
│   │   │   │       ├── common/                         # 公共模块
│   │   │   │       │   ├── annotation/                # 注解定义
│   │   │   │       │   ├── config/                    # 配置类
│   │   │   │       │   ├── utils/                     # 工具类
│   │   │   │       │   └── vo/                        # 视图对象
│   │   │   │       ├── modules/                       # 业务模块
│   │   │   │       │   ├── sys/                       # 系统管理
│   │   │   │       │   ├── channel/                   # 渠道管理
│   │   │   │       │   ├── qrcode/                    # 二维码管理
│   │   │   │       │   ├── wx/                        # 微信集成
│   │   │   │       │   └── trace/                     # 产品追溯
│   │   │   │       └── monitor/                      # 系统监控
│   │   │   └── resources/
│   │   │       ├── application.yml                   # 主配置文件
│   │   │       ├── mapper/                          # MyBatis 映射文件
│   │   │       └── application-prod.yml              # 生产环境配置
│   │   └── test/
│   │       └── java/                                # 测试代码
│   ├── pom.xml                                       # Maven 配置
│   └── target/                                       # 构建输出
├── hncsbj-ui/                    # 前端项目
│   ├── src/
│   │   ├── api/                                        # API 接口
│   │   ├── assets/                                     # 静态资源
│   │   ├── components/                                 # 公共组件
│   │   ├── layout/                                     # 布局组件
│   │   ├── router/                                     # 路由配置
│   │   ├── store/                                      # 状态管理
│   │   ├── utils/                                      # 工具函数
│   │   ├── views/                                      # 页面组件
│   │   ├── App.vue                                     # 根组件
│   │   └── main.ts                                     # 入口文件
│   ├── public/                                         # 公共资源
│   ├── package.json                                    # 依赖配置
│   ├── vite.config.ts                                 # Vite 配置
│   └── tsconfig.json                                  # TypeScript 配置
├── ddl/                           # 数据库脚本
│   ├── channel_module_20250804.sql                   # 渠道模块表结构
│   └── wx_ma_user.sql                                # 微信用户表结构
├── doc/                           # 项目文档
│   ├── database/                                        # 数据库文档
│   ├── 功能需求20250729.md                             # 功能需求文档
│   └── 开发计划.md                                     # 开发计划
└── logs/                          # 日志文件
    ├── hncsbj-admin/                                   # 后端日志
    └── hncsbj-ui/                                      # 前端日志
```

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！如果您想要为项目做出贡献，请遵循以下步骤：

### 开发流程

1. **Fork 项目**
   ```bash
   # Fork 项目到您的 GitHub 账户
   ```

2. **克隆项目**
   ```bash
   git clone https://github.com/your-username/hncsbj.git
   cd hncsbj
   ```

3. **创建功能分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **开发并提交**
   ```bash
   # 进行开发工作
   git add .
   git commit -m "feat: 添加新功能描述"
   ```

5. **推送分支**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **创建 Pull Request**
    - 在 GitHub 上创建 Pull Request
    - 详细描述您的更改内容
    - 等待代码审查和合并

### 代码规范

- **Java 代码**: 遵循 Alibaba Java 规范
- **Vue 代码**: 使用 Vue 3 组合式 API，TypeScript 类型安全
- **数据库**: 使用下划线命名法，所有表必须包含 BaseEntity 字段
- **Git 提交**: 使用 Conventional Commits 规范

### 提交信息格式

```bash
<type>(<scope>): <description>

# 类型说明
feat: 新功能
fix: 修复问题
docs: 文档更新
style: 代码格式化
refactor: 代码重构
test: 测试相关
chore: 构建或工具变动

# 示例
feat(channel): 添加经销商管理功能
fix(user): 修复用户登录验证逻辑
docs(api): 更新 API 接口文档
```

## Git Rules

- 禁止自动提交或推送代码
- 所有 git commit / push 必须由用户手动完成

---

## 📄 开源协议

本项目采用 [MIT 协议](LICENSE) 开源。

---

## 📞 联系我们

如果您在使用过程中遇到问题，或者有功能建议，请通过以下方式联系我们：

- **项目地址**: [https://github.com/your-organization/hncsbj](https://github.com/your-organization/hncsbj)
- **问题反馈**: [GitHub Issues](https://github.com/your-organization/hncsbj/issues)
- **邮件联系**: [support@binjie.com](mailto:support@binjie.com)
- **官方网站**: [https://www.binjie.com](https://www.binjie.com)

---

## 🙏 致谢

感谢所有为项目做出贡献的开发者和使用者！

### 主要贡献者

- [@developer1](https://github.com/developer1) - 项目架构设计
- [@developer2](https://github.com/developer2) - 前端开发
- [@developer3](https://github.com/developer3) - 后端开发

### 技术支持

- [Spring Boot](https://spring.io/projects/spring-boot)
- [Vue.js](https://vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [MyBatis Plus](https://baomidou.com/)

---

<div align="center">

**⭐ 如果这个项目对您有帮助，请给我们一个 Star！**

![Star History](https://img.shields.io/github/stars/your-organization/hncsbj?style=social)

</div>