# CLAUDE.md

[根目录](../../CLAUDE.md) > **haozi-admin**

## 变更记录 (Changelog)

- **2025-11-26 15:00:58** - 初始化后端模块文档

## 模块职责

haozi-admin 是基于 Spring Boot 3 构建的企业级后端API服务，提供完整的业务逻辑、权限管理、数据持久化等功能。采用分层架构设计，支持高并发和分布式部署。

## 入口与启动

### 启动类
- **主启动类**: `src/main/java/cn/lliyuu520/haozi/HaoziAdminApplication.java`
- **启动方式**: Maven Spring Boot 插件 或直接运行 JAR
- **默认端口**: 8080
- **容器**: Undertow (替代默认Tomcat)

### 启动配置
```java
@SpringBootApplication
@EnableScheduling
public class HaoziAdminApplication {
    public static void main(String[] args) {
        SpringApplication.run(HaoziAdminApplication.class, args);
    }
}
```

## 对外接口

### REST API 架构
- **基础路径**: `/sys/*` - 系统管理模块API
- **响应格式**: 统一使用 `Result<T>` 包装
- **权限控制**: Sa-Token 注解式权限管理

### 主要控制器
| 控制器 | 路径 | 功能描述 |
|--------|------|----------|
| `SysAuthController` | `/sys/auth` | 认证管理 (登录、登出) |
| `SysUserController` | `/sys/user` | 用户管理 |
| `SysRoleController` | `/sys/role` | 角色管理 |
| `SysMenuController` | `/sys/menu` | 菜单管理 |
| `SysFileController` | `/sys/file` | 文件管理 |

### API 示例
```java
@RestController
@RequestMapping("/sys/auth")
public class SysAuthController {
    @PostMapping("/login")
    @SaIgnore  // 忽略权限检查
    public Result<SysTokenVO> login(@RequestBody SysAccountLoginDTO dto) {
        return Result.ok(sysAuthService.loginByAccount(dto));
    }
}
```

## 关键依赖与配置

### 核心技术栈
- **Spring Boot**: 3.3.8 (最新版本)
- **Java**: 17 (LTS版本)
- **MyBatis Plus**: 3.5.12 (数据访问层)
- **Sa-Token**: 1.42.0 (权限认证)
- **Redis**: 缓存和会话存储
- **Redisson**: 3.34.1 (分布式锁)

### 数据库配置
- **数据库**: MySQL 8.0+
- **连接池**: HikariCP (Spring Boot 默认)
- **ORM**: MyBatis Plus + 自动填充
- **迁移**: 基于MyBatis Plus的migration机制

### 云服务集成
- **阿里云OSS**: 文件存储服务
- **阿里云短信**: 短信验证码服务
- **阿里云RDS**: 云数据库服务

### 配置文件位置
- **主配置**: `src/main/resources/application.yml`
- **环境配置**: 支持多环境配置

## 数据模型

### 基础实体类
- **BaseEntity**: 统一基类，包含通用字段
  - `id` - 主键 (ASSIGN_ID策略)
  - `createTime` - 创建时间
  - `updateTime` - 更新时间
  - `creator` - 创建者
  - `updater` - 更新者
  - `deleted` - 逻辑删除标记

### 核心实体
| 实体类 | 描述 | 继承关系 |
|--------|------|----------|
| `SysUser` | 用户实体 | extends BaseEntity |
| `SysRole` | 角色实体 | extends BaseEntity |
| `SysMenu` | 菜单实体 | extends BaseEntity |
| `SysConfig` | 系统配置 | extends BaseEntity |
| `SysLog` | 操作日志 | extends BaseEntity |

### 数据库映射
- **Mapper接口**: 位于 `modules/*/mapper/` 包下
- **XML映射**: `src/main/resources/mapper/` 目录下
- **自动填充**: 通过 `FieldMetaObjectHandler` 处理

## 业务架构

### 分层架构
```
Controller Layer (控制器层)
    ↓
Service Layer (业务逻辑层)
    ↓
Mapper Layer (数据访问层)
    ↓
Database Layer (数据库层)
```

### 模块结构
```
modules/
├── sys/                    # 系统管理模块
│   ├── controller/        # 控制器
│   ├── service/           # 业务服务
│   ├── mapper/            # 数据访问
│   ├── entity/            # 实体类
│   ├── dto/               # 数据传输对象
│   ├── vo/                # 视图对象
│   └── query/             # 查询对象
└── common/                # 公共组件
    ├── base/              # 基础类
    ├── config/            # 配置类
    ├── utils/             # 工具类
    └── cache/             # 缓存管理
```

## 权限系统

### Sa-Token 权限框架
- **认证方式**: Bearer Token
- **会话管理**: Redis存储
- **权限控制**: 注解式 + 编程式
- **并发登录**: 支持多设备登录

### 权限配置
```yaml
sa-token:
  token-name: Authorization
  token-prefix: Bearer
  timeout: 2592000        # 30天过期
  is-concurrent: true     # 允许并发登录
  max-login-count: -1     # 不限制登录设备数
```

## 缓存策略

### 多层缓存架构
1. **本地缓存**: Caffeine (推测)
2. **分布式缓存**: Redis
3. **缓存注解**: Spring Cache + 自定义缓存

### Redis 配置
- **数据库**: 4号库
- **连接池**: Lettuce连接池
- **超时时间**: 6000ms
- **最大连接数**: 8

## 测试策略

### 测试框架
- **单元测试**: JUnit 5 + Spring Boot Test
- **集成测试**: @SpringBootTest 注解
- **测试位置**: `src/test/java/`

### 测试建议
- Service层进行单元测试
- Controller层进行集成测试
- 使用内存数据库进行测试

## 常见问题 (FAQ)

### Q: 如何添加新的业务模块？
A: 在 `modules/` 下创建新模块，遵循现有分层结构

### Q: 如何配置新的数据库连接？
A: 修改 `application.yml` 中的 datasource 配置

### Q: 如何添加新的权限注解？
A: 使用 Sa-Token 提供的注解，或自定义权限实现

### Q: 如何进行数据库迁移？
A: 使用 MyBatis Plus 的 migration 功能或 Flyway

## 相关文件清单

### 核心文件
- `pom.xml` - Maven依赖配置
- `src/main/java/cn/lliyuu520/haozi/HaoziAdminApplication.java` - 启动类
- `src/main/resources/application.yml` - 主配置文件
- `src/main/java/cn/lliyuu520/haozi/common/base/entity/BaseEntity.java` - 基础实体
- `src/main/java/cn/lliyuu520/haozi/common/config/MybatisPlusConfig.java` - MyBatis配置

### 配置类
- `MybatisPlusConfig.java` - MyBatis Plus配置
- `WebMvcConfig.java` - Web配置
- `RedisTemplateConfiguration.java` - Redis配置
- `CorsConfig.java` - 跨域配置

### 工具类
- `Result.java` - 统一响应格式
- `FieldMetaObjectHandler.java` - 字段自动填充处理器

## 开发建议

### 新功能开发
1. 继承 BaseEntity 创建新实体
2. 遵循 Controller-Service-Mapper 分层架构
3. 使用 Result 统一响应格式
4. 添加适当的权限注解
5. 编写对应的单元测试

### 性能优化
1. 合理使用缓存策略
2. 数据库查询优化
3. 分页查询避免大结果集
4. 异步处理耗时操作