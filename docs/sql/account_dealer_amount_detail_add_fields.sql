-- ============================================================
-- 经销商金额明细表字段新增 DDL
-- 功能：支持金额明细与报单的关联追溯
-- 作者：Claude
-- 日期：2025-01-19
-- ============================================================

-- 添加关联报单ID字段
ALTER TABLE `account_dealer_amount_detail`
ADD COLUMN `report_order_id` BIGINT(20) DEFAULT NULL COMMENT '关联报单ID' AFTER `audit_remark`;

-- 添加业务单号字段（冗余报单编号，方便列表展示）
ALTER TABLE `account_dealer_amount_detail`
ADD COLUMN `business_no` VARCHAR(64) DEFAULT NULL COMMENT '业务单号（报单编号）' AFTER `report_order_id`;

-- 添加索引以支持按报单查询
ALTER TABLE `account_dealer_amount_detail`
ADD INDEX `idx_report_order_id` (`report_order_id`) COMMENT '报单ID索引';

-- ============================================================
-- 字段说明
-- ============================================================
-- report_order_id: 用于追溯金额变动对应的报单，支持对账查询
-- business_no: 冗余存储报单编号，方便列表展示时无需关联查询
-- idx_report_order_id: 提升按报单查询金额明细的性能
-- ============================================================

-- ============================================================
-- 兼容性说明
-- ============================================================
-- 1. 新增字段设置为可空（DEFAULT NULL），兼容历史数据
-- 2. 历史金额明细记录的 report_order_id 为 NULL
-- 3. 查询时需要兼容 report_order_id 为空的情况
-- ============================================================

-- ============================================================
-- 回滚脚本（如需回滚，执行以下语句）
-- ============================================================
-- ALTER TABLE `account_dealer_amount_detail` DROP INDEX `idx_report_order_id`;
-- ALTER TABLE `account_dealer_amount_detail` DROP COLUMN `business_no`;
-- ALTER TABLE `account_dealer_amount_detail` DROP COLUMN `report_order_id`;
