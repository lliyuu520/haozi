# 经销商金额明细修复技术说明

## 概述

本次修复解决了经销商金额明细数据来源不清晰的问题，通过建立报单与金额明细的关联关系，实现金额变动全链路追溯。

## 问题背景

原系统存在以下问题：
1. 金额明细记录缺少与报单的关联，无法追溯金额变动的来源
2. 报单撤回时未正确回退经销商余额
3. 报单创建时直接通过审核（状态=PASS），不符合审核流程

## 数据库变更

### 新增字段

| 字段名 | 类型 | 说明 | 索引 |
|--------|------|------|------|
| report_order_id | BIGINT(20) | 关联报单ID | idx_report_order_id |
| business_no | VARCHAR(64) | 业务单号（报单编号） | - |

### DDL 脚本

执行文件：`docs/sql/account_dealer_amount_detail_add_fields.sql`

```sql
ALTER TABLE `account_dealer_amount_detail`
ADD COLUMN `report_order_id` BIGINT(20) DEFAULT NULL COMMENT '关联报单ID' AFTER `audit_remark`;

ALTER TABLE `account_dealer_amount_detail`
ADD COLUMN `business_no` VARCHAR(64) DEFAULT NULL COMMENT '业务单号（报单编号）' AFTER `report_order_id`;

ALTER TABLE `account_dealer_amount_detail`
ADD INDEX `idx_report_order_id` (`report_order_id`) COMMENT '报单ID索引';
```

## 后端变更

### 1. Entity 实体类

**文件**: `hncsbj-admin/src/main/java/com/mgm/hncsbj/modules/account/entity/AccountDealerAmountDetail.java`

```java
/**
 * 关联报单ID
 */
private Long reportOrderId;

/**
 * 业务单号（报单编号）
 */
private String businessNo;
```

### 2. Service 层新增方法

**文件**: `hncsbj-admin/src/main/java/com/mgm/hncsbj/modules/account/service/impl/AccountDealerAmountDetailServiceImpl.java`

| 方法名 | 说明 |
|--------|------|
| `listByReportOrder(Long reportOrderId)` | 根据报单ID查询金额明细列表 |
| `createRollbackRecord(...)` | 创建回退记录（报单撤回/拒绝时调用） |
| `updateAuditStatusToPassByReportOrder(Long reportOrderId)` | 更新报单关联的金额明细审核状态为通过 |

### 3. 报单业务逻辑修改

**文件**: `hncsbj-admin/src/main/java/com/mgm/hncsbj/modules/report/service/impl/ReportOrderServiceImpl.java`

#### 3.1 报单创建（addReportOrder）
- 创建金额明细时状态从 `PASS` 改为 `UNAUDITED`
- 同时设置 `reportOrderId` 和 `businessNo` 字段

#### 3.2 报单审核（audit）
- 审核通过时：调用 `updateAuditStatusToPassByReportOrder()` 更新金额明细状态
- 审核拒绝时：调用 `createRollbackRecord()` 创建回退记录

#### 3.3 报单撤回（revoke）
- 增加金额回退逻辑
- 调用 `createRollbackRecord()` 创建类型为 `REPORT_ORDER_ROLLBACK` 的回退记录
- 金额为正数（增加经销商余额）

### 4. Controller 新增接口

**文件**: `hncsbj-admin/src/main/java/com/mgm/hncsbj/modules/account/controller/AccountDealerAmountDetailController.java`

```java
/**
 * 根据报单ID查询金额明细列表
 *
 * @param reportOrderId 报单ID
 * @return 金额明细列表
 */
@GetMapping("/by-report-order/{reportOrderId}")
@SaCheckPermission("account:dealer-amount-detail:page")
public Result<List<AccountDealerAmountDetailVO>> listByReportOrder(@PathVariable Long reportOrderId)
```

### 5. MyBatis XML 映射

**文件**: `hncsbj-admin/src/main/resources/mapper/account/AccountDealerAmountDetailMapper.xml`

新增 SQL 映射：
- `listByReportOrderId` - 根据报单ID查询
- `listByReportOrderIds` - 批量查询
- `listUnauditedByReportOrderId` - 查询未审核状态的记录

## 前端变更

### 1. API 方法

**文件**: `hncsbj-ui-vue/src/api/report/order.ts`

```typescript
/**
 * 根据报单ID查询金额明细列表
 * @param reportOrderId 报单ID
 * @returns
 */
export const useAmountDetailByReportOrderApi = (reportOrderId: number) => {
    return service.get(`/account/dealer-amount-detail/by-report-order/${reportOrderId}`)
}
```

### 2. 报单详情页

**文件**: `hncsbj-ui-vue/src/views/report/order/detail-or-audit.vue`

新增金额明细表格展示，包含以下字段：
- 业务单号
- 金额（带正负号显示）
- 操作类型（手动调整/报单扣除/报单回退/核销）
- 审核状态（已通过/已拒绝/未审核）
- 操作时间
- 备注

## 业务流程

### 押金模式流程

```
报单创建 → 扣除经销商余额（UNAUDITED状态）
    ↓
财务审核
    ↓
    ├─ 通过 → 金额明细状态更新为 PASS
    │
    └─ 拒绝 → 创建回退记录（REPORT_ORDER_ROLLBACK）
```

### 撤回流程

```
报单撤回 → 检查报单状态和生产订单状态
    ↓
创建回退记录（REPORT_ORDER_ROLLBACK，正数增加余额）
    ↓
报单状态回退为 UNAUDITED
```

## 金额操作类型枚举

| 类型 | 说明 | 金额符号 |
|------|------|----------|
| MANUAL | 手动调整 | 可正可负 |
| REPORT_ORDER | 报单扣除 | 负数 |
| REPORT_ORDER_ROLLBACK | 报单回退 | 正数 |
| WRITE_OFF | 核销 | 待定 |

## 审核状态枚举

| 状态 | 说明 |
|------|------|
| UNAUDITED | 未审核 |
| PASS | 已通过 |
| REJECT | 已拒绝 |

## 测试要点

用户可自行测试以下场景：

1. **报单创建测试**
   - 创建报单后检查金额明细是否生成
   - 验证 `reportOrderId` 和 `businessNo` 是否正确
   - 验证审核状态是否为 `UNAUDITED`

2. **报单审核测试**
   - 审核通过后检查金额明细状态是否更新为 `PASS`
   - 审核拒绝后检查是否生成回退记录

3. **报单撤回测试**
   - 撤回报单后检查是否生成回退记录
   - 验证经销商余额是否正确增加

4. **查询测试**
   - 报单详情页正确展示金额明细列表

## 部署注意事项

1. **数据库变更**：必须先在测试环境执行 DDL 脚本
2. **权限配置**：新接口权限标识为 `account:dealer-amount-detail:page`
3. **数据校验**：部署后验证历史数据的 `report_order_id` 为 NULL（符合预期）

## 版本信息

- 修复版本：1.0.0
- 修复日期：2025-01-19
- 修复人员：Claude AI Assistant
- 审核状态：待用户测试验收
