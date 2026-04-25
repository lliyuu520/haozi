# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# 槟界系统开发指南

本文件为 Claude Code (claude.ai/code) 在此代码库中工作时提供核心开发指导。

## 项目概述

**项目名称**: 槟界 (Binjie) 业务管理系统
**技术栈**: Spring Boot 3.0.4 + Vue 3 + TypeScript + MyBatis Plus
**架构**: 前后端分离多模块项目
**部署**: 阿里云 RDS + Redis + OSS

### 项目结构

```
hncsbj-parent/                 # 父项目 (Maven 多模块)
├── pom.xml                    # 统一依赖管理
├── hncsbj-admin/             # Spring Boot 后端
├── hncsbj-ui-vue/            # Vue 3 前端
├── ddl/                      # 数据库 DDL
└── doc/                      # 项目文档
```

### 核心设计原则

- **不使用 Swagger 注解**：使用标准 JavaDoc 注释生成 API 文档
- **静态路由配置**：前端路由手动配置，支持权限控制和组件懒加载
- **分层架构**：严格遵循 Controller → Service → Mapper → Entity
- **基类继承**：统一继承 BaseEntity 和 BaseService

## 开发命令

### 多模块项目操作 (根目录)

```bash
# 编译所有模块
mvn clean compile

# 打包所有模块
mvn clean package

# 跳过测试编译
mvn clean compile -DskipTests=true

# 清理构建产物
mvn clean

# 运行单个测试
mvn test -Dtest=TestClassName

# 运行所有测试
mvn test
```

### 后端开发 (hncsbj-admin)

```bash
# 运行开发服务器
mvn spring-boot:run

# 打包后端
mvn clean package

# 运行 JAR
java -jar target/hncsbj-admin.jar
```

### 前端开发 (hncsbj-ui-vue)

```bash
# 安装依赖
yarn install

# 启动开发服务器 (端口 3000)
yarn dev

# 生产环境构建
yarn build

# TypeScript 类型检查
yarn type-check  # 项目中定义的命令
vue-tsc --noEmit --skipLibCheck  # 实际可用的命令
```

## 系统架构

### 技术栈

- **后端**: Spring Boot 3.0.4 + Java 17 (端口 8080)
- **前端**: Vue 3 + TypeScript + Element Plus (端口 3000)
- **数据库**: MySQL 8.0 (阿里云 RDS)
- **缓存**: Redis (会话存储 + 业务缓存)
- **认证**: Sa-Token (类 JWT 令牌)
- **文件存储**: 阿里云 OSS

### 核心业务模块

- **sys**: 系统管理 (用户、角色、菜单、认证、日志)
- **channel**: 渠道管理 (经销商、区域、业务员、区域经理)
- **qrcode**: 二维码追溯系统 (码关联、生成记录)
- **wx**: 微信集成 (小程序用户、认证)
- **monitor**: 系统监控 (服务器状态、缓存管理)
- **trace**: 产品追溯 (礼品、营销)

### API 模块结构（微信集成）

- **api/client**: 客户端通用API
- **api/in**: 内部微信小程序API (经销商、区域经理、业务员、门店老板、二维码)
- **api/out**: 外部微信小程序API (认证相关)
- **api/pda**: PDA设备专用API (二维码绑定)

### 关键设计模式

- **分层架构**: Controller → Service → Mapper → Entity
- **基类模式**: 所有实体继承 `BaseEntity`，所有服务继承 `BaseService`
- **DTO/VO 模式**: DTO(输入)、VO(输出)、Entity(持久化) 严格分离
- **MapStruct 转换器**: DTO/VO/Entity 之间自动映射
- **逻辑删除**: 使用 `deleted` 字段软删除 (1=删除，0=正常)

### 核心架构模式（跨文件理解）

#### 前端 CRUD 标准模式

所有列表页面使用统一的 `useCrud` hook，标准结构：

```typescript
const state = reactive({
    dataListUrl: '/channel/dealer/page',
    deleteUrl: '/channel/dealer',
    queryForm: {code: '', name: ''}
})
const {getDataList, deleteHandle, addOrUpdateHandle} = useCrud(state)
```

#### 后端 Controller 标准模式

所有 Controller 遵循 RESTful 规范，标准方法：

- `@GetMapping("/page")` - 分页查询
- `@GetMapping("/info")` - 获取详情
- `@PostMapping` - 新增
- `@PutMapping` - 编辑
- `@DeleteMapping` - 删除
- `@GetMapping("/list")` - 列表查询（不分页）

#### 权限控制模式

使用 Sa-Token 进行细粒度权限控制：

```java
@SaCheckPermission("模块名:业务实体:操作名")
// 例如: @SaCheckPermission("channel:dealer:page")
```

#### 事务管理规范

所有 Service 实现类方法都使用 `@Transactional(rollbackFor = Exception.class)` 进行事务管理。

#### 自动填充机制

通过 `@TableField(fill = FieldFill.INSERT)` 和 `@TableField(fill = FieldFill.INSERT_UPDATE)` 实现字段自动填充，配合
`FieldMetaObjectHandler` 自动处理创建时间、更新时间、创建者、更新者、删除标记。

## 代码开发规范

### 后端开发规范

#### Controller 层规范

**命名规范**:

- **类名**: `{模块名}{业务实体}Controller`，如 `ChannelDealerController`
- **请求映射**: `@RequestMapping("/模块名/业务实体小写")`，如 `/channel/dealer`
- **方法名**: 使用 RESTful 标准方法名（page、info、save、update、delete）

**标准结构**:

```java

@RestController
@RequestMapping("/channel/dealer")
@AllArgsConstructor
public class ChannelDealerController {

    @GetMapping("/page")
    @SaCheckPermission("channel:dealer:page")
    public Result<PageVO<ChannelDealerVO>> page(final ChannelDealerQuery query) {
        final PageVO<ChannelDealerVO> page = this.channelDealerService.page(query);
        return Result.ok(page);
    }
}
```

**关键要点**:

- 使用 `@AllArgsConstructor` 构造器注入
- 不使用 Swagger 注解，使用标准 JavaDoc 注释
- 所有方法参数使用 `final` 修饰
- 权限控制：`@SaCheckPermission("模块名:业务实体:操作名")`
- 统一返回格式：`Result<T>`

#### Service 层规范

**接口设计**:

```java
public interface ChannelDealerService extends BaseService<ChannelDealer> {
    PageVO<ChannelDealerVO> page(ChannelDealerQuery query);

    void saveOne(ChannelDealerDTO channelDealerDTO);

    void updateOne(ChannelDealerDTO channelDealerDTO);

    void deleteOne(Long id);

    void changeEnabled(Long id);

    List<ChannelDealerVO> getAllList(ChannelDealerQuery query);
}
```

**实现类规范**:

```java

@Service
@AllArgsConstructor
@Slf4j
public class ChannelDealerServiceImpl extends BaseServiceImpl<ChannelDealerMapper, ChannelDealer> implements ChannelDealerService {

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void saveOne(ChannelDealerDTO channelDealerDTO) {
        final ChannelDealer entity = ChannelDealerConvert.INSTANCE.convertFromDTO(channelDealerDTO);
        if (channelDealerMapper.selectCountByCode(entity.getCode()) > 0) {
            throw new BaseException("经销商编码已存在");
        }
        save(entity);
    }
}
```

**关键要点**:

- 继承 `BaseServiceImpl<Mapper, Entity>`
- 使用 `@Transactional(rollbackFor = Exception.class)` 管理事务
- 方法名使用 `One` 后缀避免与父类冲突
- 使用 `final` 修饰局部变量

#### Entity 和 DTO/VO 规范

**Entity 规范**:

```java

@Data
@EqualsAndHashCode(callSuper = true)
@TableName(autoResultMap = true)
public class ChannelDealer extends BaseEntity {
    private String code;
    private String name;
    private Boolean enabled;
}
```

**DTO/VO 规范**:

```java
// DTO - 继承 Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class ChannelDealerDTO extends ChannelDealer {
}

// VO - 继承 Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class ChannelDealerVO extends ChannelDealer {
}

// Query - 继承 BaseQuery
@Data
@EqualsAndHashCode(callSuper = false)
public class ChannelDealerQuery extends BaseQuery {
    private String code;
    private String name;
}
```

### 前端开发规范

#### Vue 组件规范

**文件结构**:

```
src/views/模块名/业务实体/
├── index.vue          # 列表页面
└── add-or-update.vue  # 新增/编辑弹窗
```

**列表页面结构**:

```vue

<script setup lang="ts" name="ChannelDealerIndex">
  import {useCrud} from '@/hooks'
  import {reactive} from 'vue'
  import AddOrUpdate from './add-or-update.vue'

  const state = reactive({
    dataListUrl: '/channel/dealer/page',
    deleteUrl: '/channel/dealer',
    queryForm: {code: '', name: ''}
  })

  const {getDataList, deleteHandle, addOrUpdateHandle} = useCrud(state)
</script>

<template>
  <el-card>
    <el-form :inline="true" :model="state.queryForm">
      <el-form-item>
        <el-input v-model="state.queryForm.code" placeholder="编码" clearable/>
      </el-form-item>
      <el-form-item>
        <el-button v-auth="'channel:dealer:save'" type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="state.dataList" border>
      <el-table-column prop="code" label="编码"/>
      <el-table-column prop="name" label="名称"/>
      <el-table-column label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.enabled" type="success">已生效</el-tag>
          <el-tag v-else type="danger">已失效</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button v-auth="'channel:dealer:update'" type="primary" link @click="addOrUpdateHandle(scope.row.id)">
            修改
          </el-button>
          <el-button v-auth="'channel:dealer:delete'" type="danger" link @click="deleteHandle(scope.row.id)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>
```

**API 调用规范**:

```typescript
// src/api/channel/dealer.ts
export const useChannelDealerApi = (id: number) => {
    return service.get('/channel/dealer/info', {params: {id}})
}

export const useChannelDealerSubmitApi = (dataForm: any) => {
    if (dataForm.id) {
        return service.put('/channel/dealer', dataForm)
    } else {
        return service.post('/channel/dealer', dataForm)
    }
}
```

### 数据库开发规范

#### Mapper 接口规范

```java

@Repository
public interface ChannelDealerMapper extends IBaseMapper<ChannelDealer> {
    default long selectCountByCode(String code) {
        LambdaQueryWrapper<ChannelDealer> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ChannelDealer::getCode, code);
        wrapper.eq(ChannelDealer::getEnabled, 1);
        wrapper.eq(ChannelDealer::getDeleted, 0);
        return selectCount(wrapper);
    }
}
```

#### 表结构规范

- **所有表必须包含 BaseEntity 字段**: id, creator, updater, create_time, update_time, deleted
- **使用逻辑删除**: 禁止物理删除，使用 deleted = 1 标记删除
- **命名规范**: 数据库字段使用下划线命名，Java 属性使用驼峰命名

## Git 工作流

### 分支管理

- **main**: 主分支，保持生产环境可用状态
- **develop**: 开发分支，功能开发完成后的合并目标
- **feature/***: 功能分支，从 develop 分出，完成后合并回 develop
- **hotfix/***: 紧急修复分支，从 main 分出，完成后同时合并到 main 和 develop

### 提交信息规范

```bash
<type>(<scope>): <description>

# 类型
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
```

## 部署指南

### 后端部署

```bash
# 构建项目
mvn clean package

# 运行 JAR
java -jar hncsbj-admin/target/hncsbj-admin.jar

# 生产环境运行
java -jar hncsbj-admin/target/hncsbj-admin.jar --spring.profiles.active=prod
```

### 前端部署

```bash
# 构建项目
cd hncsbj-ui-vue
yarn install
yarn build

# 构建结果在 admin/ 目录
```

## 重要开发约定

### 代码生成约定

- **DTO**: 继承 Entity 类，避免重复字段定义
- **VO**: 继承 Entity 类，输出时使用
- **Query**: 继承 BaseQuery，不继承实体类
- **Service**: 方法名使用 One 后缀避免与父类冲突

### 数据库约定

- **所有表**必须包含 BaseEntity 字段
- **命名规范**: 数据库字段用下划线，Java 属性用驼峰
- **逻辑删除**: 统一使用 `deleted` 字段，1=删除，0=正常
- **主键策略**: 使用 `ASSIGN_ID` (雪花算法)

### API 响应格式

- **统一返回**: `Result<T>` 格式
- **分页响应**: `PageVO<T>` 格式，包含 `list` 和 `total`
- **错误处理**: 统一异常处理，返回错误信息

### 前端路由约定

- **静态路由**: 手动配置，支持权限控制
- **懒加载**: 组件按需加载
- **权限指令**: `v-auth` 指令控制按钮显示
- **状态管理**: 使用 Pinia 进行状态管理

## 中文对话规范

### 对话语言约定

- **全程使用中文**: 与 Claude 的所有技术对话都使用中文进行
- **技术术语**: 技术名词可以保持英文（如 API、Vue、Java 等），但解释和讨论使用中文
- **代码注释**: 所有代码注释使用中文编写，提高代码可读性
- **文档说明**: 项目文档、README 等使用中文编写

### 代码规范约定

- **标识符命名**: 所有方法名、变量名、字段名、类名等代码标识符必须使用英文（遵循 Java/TypeScript 规范）
- **注释语言**: 代码注释、JavaDoc、方法说明等使用中文
- **错误信息**: 异常提示、用户界面文案等使用中文
- **日志输出**: 系统日志、调试信息等使用中文

### 实施原则

1. **对话语言**: 技术讨论、问题分析、方案制定等全程使用中文
2. **代码实现**: 代码本身保持英文命名规范，不将方法名、变量名等改为中文
3. **文档完善**: 所有注释、文档、说明使用中文，确保团队成员理解
4. **用户界面**: 前端显示文本、错误提示、操作说明等使用中文

### 示例对比

```java
// ✅ 正确：方法名英文，注释中文
/**
 * 分页查询系统参数
 * @param query 查询条件
 * @return 分页结果
 */
public PageVO<SysConfigVO> pageVO(SysConfigQuery query) {
    // 构建查询条件
    LambdaQueryWrapper<SysConfig> wrapper = buildWrapper(query);
    return page(getPage(query), wrapper);
}

// ❌ 错误：方法名改成中文（违反编码规范）
public PageVO<SysConfigVO> 分页查询(SysConfigQuery query) {
    // 构建查询条件
    LambdaQueryWrapper<SysConfig> wrapper = 构建查询条件(query);
    return 分页(getPage(query), wrapper);
}
```

```typescript
// ✅ 正确：变量名英文，注释中文
/**
 * 参数类型选项
 */
const configTypeOptions = [
    {label: '开关', value: 'SWITCH_TYPE'},
    {label: '文本', value: 'TEXT_TYPE'},
    {label: '数字', value: 'NUMBER_TYPE'},
    {label: '文件', value: 'FILE_TYPE'},
    {label: '图片', value: 'IMAGE_TYPE'}
]

// ❌ 错误：变量名改成中文（违反编码规范）
const 参数类型选项 = [
    {label: '开关', value: 'SWITCH_TYPE'},
    {label: '文本', value: 'TEXT_TYPE'},
    {label: '数字', value: 'NUMBER_TYPE'},
    {label: '文件', value: 'FILE_TYPE'},
    {label: '图片', value: 'IMAGE_TYPE'}
]
```

## 项目配置说明

### 关键配置文件

- **根目录 pom.xml**: Maven 多模块配置，统一依赖版本管理
- **hncsbj-admin/pom.xml**: Spring Boot 模块配置
- **hncsbj-ui-vue/package.json**: Vue 3 前端依赖管理
- **application.yml**: 主配置文件，包含数据库、Redis、Sa-Token等配置

### 数据库配置

- **RDS**: 阿里云 MySQL 8.0，连接池使用 Hikari
- **本地开发**: Redis 本地，密码 `Redis@200722`
- **MyBatis Plus**: 配置了逻辑删除、字段自动填充、驼峰转换

### 微信集成配置

- **小程序**: 支持用户认证和数据交互
- **支付**: 微信支付集成，需要证书文件
- **配置存储**: 使用 Redis 存储微信配置

### 地图集成

- **高德地图**: 集成 `@vuemap/vue-amap` 组件
- **门店管理**: 支持地图选点和GPS定位
- **API Key**: 配置在 application.yml 中

## 业务领域

1. **订单管理**: 在线订单提交、财务审批、仓库发货
2. **渠道管理**: 多级经销商网络、业务员、区域经理
3. **门店管理**: 门店创建、库存管理、GPS 拜访记录
4. **二维码追溯**: 三级码关联 (袋→礼盒→箱)
5. **抽奖系统**: 二维码扫描 + 4 位验证码兑奖
6. **积分系统**: 门店扩张、拜访、订单、兑奖奖励
7. **微信集成**: 经销商和客户小程序

### 关键业务流程

- **订单流程**: 经销商提交 → 财务审批 → 仓库发货 → 配送跟踪
- **门店生命周期**: 业务员创建门店 → 库存管理 → 销售跟踪 → 拜访记录
- **二维码流程**: 生产关联 → 发货绑定 → 客户扫描 → 奖品兑换
- **积分流程**: 活动赚取积分 → 积分用于订单 → 兑换奖励

## 系统参数配置功能

### 系统参数类型

系统参数支持以下类型：

- **开关类型 (SWITCH_TYPE)**: 布尔值开关，用于控制功能是否启用
- **文本类型 (TEXT_TYPE)**: 文本内容，支持多行文本
- **数字类型 (NUMBER_TYPE)**: 数字值，支持整数和小数
- **文件类型 (FILE_TYPE)**: 文件上传，支持多个文件上传（最多5个）
- **图片类型 (IMAGE_TYPE)**: 图片上传，支持多个图片上传（最多5张）

### 系统参数实体

```java
@Data
@EqualsAndHashCode(callSuper = true)
@TableName(autoResultMap = true)
public class SysConfig extends BaseEntity {
    /**
     * 参数编码
     */
    private String code;

    /**
     * 参数名称
     */
    private String name;

    /**
     * 参数类型
     */
    private String type;

    /**
     * 开关值(仅用于开关类型)
     */
    private Boolean switchValue;

    /**
     * 数字值(仅用于数字类型)
     */
    private BigDecimal num;

    /**
     * 文本内容(仅用于文本类型)
     */
    private String text;

    /**
     * 文件列表(仅用于文件类型)
     */
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<FileDTO> files = new ArrayList<>();

    /**
     * 图片类型
     */
    @TableField(typeHandler = FastjsonTypeHandler.class)
    private List<FileDTO> images = new ArrayList<>();

    /**
     * 备注
     */
    private String remark;

    /**
     * 状态
     */
    private Boolean enabled;
}
```

### 系统参数类型枚举

```java
@AllArgsConstructor
@Getter
@ToString
public enum SysConfigType {
    /**
     * 开关类型
     */
    SWITCH_TYPE("SWITCH_TYPE", "开关"),
    /**
     * 文本类型
     */
    TEXT_TYPE("TEXT_TYPE", "文本"),
    /**
     * 数字类型
     */
    NUMBER_TYPE("NUMBER_TYPE", "数字"),
    /**
     * 文件类型
     */
    FILE_TYPE("FILE_TYPE", "文件"),
    /**
     * 图片类型
     */
    IMAGE_TYPE("IMAGE_TYPE", "图片"),
    ;
    /**
     * 编码
     */
    private final String code;
    /**
     * 描述
     */
    private final String desc;
}
```
