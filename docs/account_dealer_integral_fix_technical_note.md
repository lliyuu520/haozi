# 经销商积分明细修复技术说明

## 概述

本次修复解决了经销商积分明细在报单撤回时未正确回退的问题，通过建立报单与积分明细的关联关系，实现积分变动全链路追溯。

## 问题背景

原系统存在以下问题：
1. 积分明细记录缺少与报单的关联，无法追溯积分变动的来源
2. **报单撤回时未正确回退经销商积分**（核心问题）
3. 报单创建时直接通过审核（状态=PASS），不符合审核流程

## 核心问题

在 `ReportOrderServiceImpl.revoke()` 方法中，撤回报单时只回退了金额，忘记了回退积分。

```java
// 原代码：只回退金额
accountDealerAmountDetailService.createRollbackRecord(...);

// 修复后：同时回退积分
if (deduceIntegral.compareTo(BigDecimal.ZERO) != 0) {
    accountDealerIntegralDetailService.createRollbackRecord(...);
}
```

## 数据库变更

### 新增字段

| 字段名 | 类型 | 说明 | 索引 |
|--------|------|------|------|
| report_order_id | BIGINT(20) | 关联报单ID | idx_report_order_id |
| business_no | VARCHAR(64) | 业务单号（报单编号） | - |

### DDL 脚本

执行文件：`docs/sql/account_dealer_integral_detail_add_fields.sql`

```sql
ALTER TABLE `account_dealer_integral_detail`
ADD COLUMN `report_order_id` BIGINT(20) DEFAULT NULL COMMENT '关联报单ID' AFTER `audit_remark`;

ALTER TABLE `account_dealer_integral_detail`
ADD COLUMN `business_no` VARCHAR(64) DEFAULT NULL COMMENT '业务单号（报单编号）' AFTER `report_order_id`;

ALTER TABLE `account_dealer_integral_detail`
ADD INDEX `idx_report_order_id` (`report_order_id`) COMMENT '报单ID索引';
```

## 后端变更

### 1. Entity 实体类

**文件**: `hncsbj-admin/src/main/java/com/mgm/hncsbj/modules/account/entity/AccountDealerIntegralDetail.java`

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

**文件**: `hncsbj-admin/src/main/java/com/mgm/hncsbj/modules/account/service/impl/AccountDealerIntegralDetailServiceImpl.java`

| 方法名 | 说明 |
|--------|------|
| `listByReportOrder(Long reportOrderId)` | 根据报单ID查询积分明细列表 |
| `createRollbackRecord(...)` | 创建回退记录（报单撤回/拒绝时调用） |
| `updateAuditStatusToPassByReportOrder(Long reportOrderId)` | 更新报单关联的积分明细审核状态为通过 |

### 3. 报单业务逻辑修改

**文件**: `hncsbj-admin/src/main/java/com/mgm/hncsbj/modules/report/service/impl/ReportOrderServiceImpl.java`

#### 3.1 报单创建（addReportOrder）
- 创建积分明细时状态从 `PASS` 改为 `UNAUDITED`
- 同时设置 `reportOrderId` 和 `businessNo` 字段

#### 3.2 报单审核（audit）
- 审核通过时：调用 `updateAuditStatusToPassByReportOrder()` 更新积分明细状态
- 审核拒绝时：调用 `createRollbackRecord()` 创建积分回退记录

#### 3.3 报单撤回（revoke）- 核心修复
```java
// 【新增】撤回时需要回退积分
if (deduceIntegral.compareTo(BigDecimal.ZERO) != 0) {
    accountDealerIntegralDetailService.createRollbackRecord(
            channelDealerId,
            reportOrderId,
            reportNo,
            deduceIntegral,
            "报单撤回回退积分"
    );
}
```

### 4. Controller 新增接口

**文件**: `hncsbj-admin/src/main/java/com/mgm/hncsbj/modules/account/controller/AccountDealerIntegralDetailController.java`

```java
/**
 * 根据报单ID查询积分明细列表
 *
 * @param reportOrderId 报单ID
 * @return 积分明细列表
 */
@GetMapping("/by-report-order/{reportOrderId}")
@SaCheckPermission("account:dealer-integral-detail:page")
public Result<List<AccountDealerIntegralDetailVO>> listByReportOrder(@PathVariable Long reportOrderId)
```

### 5. MyBatis XML 映射

**文件**: `hncsbj-admin/src/main/resources/mapper/account/AccountDealerIntegralDetailMapper.xml`

新增 SQL 映射：
- `listByReportOrderId` - 根据报单ID查询
- `listByReportOrderIds` - 批量查询
- `listUnauditedByReportOrderId` - 查询未审核状态的记录

## 前端变更

### 1. API 方法

**文件**: `hncsbj-ui-vue/src/api/report/order.ts`

```typescript
/**
 * 根据报单ID查询积分明细列表
 * @param reportOrderId 报单ID
 * @returns
 */
export const useIntegralDetailByReportOrderApi = (reportOrderId: number) => {
    return service.get(`/account/dealer-integral-detail/by-report-order/${reportOrderId}`)
}
```

### 2. 报单详情页

**文件**: `hncsbj-ui-vue/src/views/report/order/detail-or-audit.vue`

新增积分明细表格展示，包含以下字段：
- 业务单号
- 积分（带正负号显示）
- 操作类型（手动调整/报单扣除/报单回退/核销）
- 审核状态（已通过/已拒绝/未审核）
- 操作时间
- 备注

## 业务流程

### 押金模式流程（积分与金额逻辑相同）

```
报单创建 → 扣除经销商余额（UNAUDITED状态）
    ↓
财务审核
    ↓
    ├─ 通过 → 积分明细状态更新为 PASS
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

## 积分操作类型枚举

| 类型 | 说明 | 积分符号 |
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
   - 创建报单后检查积分明细是否生成
   - 验证 `reportOrderId` 和 `businessNo` 是否正确
   - 验证审核状态是否为 `UNAUDITED`

2. **报单审核测试**
   - 审核通过后检查积分明细状态是否更新为 `PASS`
   - 审核拒绝后检查是否生成回退记录

3. **报单撤回测试（核心验证）**
   - 撤回报单后检查是否生成积分回退记录
   - 验证经销商积分余额是否正确增加

4. **查询测试**
   - 报单详情页正确展示积分明细列表

## 部署注意事项

1. **数据库变更**：必须先在测试环境执行 DDL 脚本
2. **权限配置**：新接口权限标识为 `account:dealer-integral-detail:page`
3. **数据校验**：部署后验证历史数据的 `report_order_id` 为 NULL（符合预期）

## 版本信息

- 修复版本：1.0.0
- 修复日期：2026-01-19
- 修复人员：Claude AI Assistant
- 审核状态：待用户测试验收

## 相关文档

- 金额明细修复文档：`docs/account_dealer_amount_fix_technical_note.md`
- Spec Workflow：`.spec-workflow/specs/account-dealer-integral-fix/`
