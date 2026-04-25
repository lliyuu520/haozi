-- =====================================================
-- 积分明细表新增字段
-- 目的: 支持积分明细与报单的关联追溯
-- 日期: 2025-01-19
-- =====================================================

-- 添加关联报单ID字段
ALTER TABLE `account_dealer_integral_detail`
ADD COLUMN `report_order_id` BIGINT(20) DEFAULT NULL COMMENT '关联报单ID' AFTER `audit_remark`;

-- 添加业务单号字段（冗余报单编号，方便展示）
ALTER TABLE `account_dealer_integral_detail`
ADD COLUMN `business_no` VARCHAR(64) DEFAULT NULL COMMENT '业务单号（报单编号）' AFTER `report_order_id`;

-- 添加索引以优化按报单ID查询
ALTER TABLE `account_dealer_integral_detail`
ADD INDEX `idx_report_order_id` (`report_order_id`) COMMENT '报单ID索引';
