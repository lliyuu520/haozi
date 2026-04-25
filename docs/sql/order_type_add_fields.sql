-- ============================================================
-- 订单类型字段新增 DDL
-- 功能：支持扫码/卡片两种订单类型，并兼容历史数据
-- ============================================================
ALTER TABLE `trace_order`
    ADD COLUMN `order_type` VARCHAR(20) NOT NULL DEFAULT 'PACKAGE' COMMENT '订单类型：PACKAGE=扫码，CARD=卡片' AFTER `shipped_flag`;
ALTER TABLE `report_order_detail`
    ADD COLUMN `order_type` VARCHAR(20) NOT NULL DEFAULT 'PACKAGE' COMMENT '订单类型：PACKAGE=扫码，CARD=卡片' AFTER `report_label`;
UPDATE `trace_order`
SET `order_type` = 'PACKAGE'
WHERE `order_type` IS NULL
   OR `order_type` = '';
UPDATE `report_order_detail`
SET `order_type` = 'PACKAGE'
WHERE `order_type` IS NULL
   OR `order_type` = '';
-- 回滚脚本
-- ALTER TABLE `report_order_detail` DROP COLUMN `order_type`;
-- ALTER TABLE `trace_order` DROP COLUMN `order_type`;
