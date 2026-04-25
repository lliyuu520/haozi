-- =====================================================
-- 广促模块数据库表结构
-- 包含：广促报单主表、广促报单明细表、广促订单表
-- 创建时间：2025-01-29
-- =====================================================

-- -----------------------------
-- 广促报单主表
-- -----------------------------
DROP TABLE IF EXISTS `promotion_goods_report_order`;
CREATE TABLE `promotion_goods_report_order` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `creator` VARCHAR(64) DEFAULT NULL COMMENT '创建人',
    `updater` VARCHAR(64) DEFAULT NULL COMMENT '更新人',
    `create_time` DATETIME DEFAULT NULL COMMENT '创建时间',
    `update_time` DATETIME DEFAULT NULL COMMENT '更新时间',
    `deleted` TINYINT(1) DEFAULT 0 COMMENT '删除标记（0：正常；1：删除）',

    `report_no` VARCHAR(32) NOT NULL COMMENT '报单号',
    `channel_dealer_id` BIGINT NOT NULL COMMENT '经销商ID',
    `channel_dealer_address_id` BIGINT NOT NULL COMMENT '经销商地址ID',
    `report_date` DATE NOT NULL COMMENT '报单日期',
    `report_status` VARCHAR(32) DEFAULT 'UNAUDITED' COMMENT '报单状态（UNAUDITED：未审核；PASS：通过；REJECT：拒绝）',
    `report_amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '报单总金额',
    `actual_amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '实际金额（报单金额 - 积分抵扣）',
    `deduce_integral` DECIMAL(10,2) DEFAULT 0.00 COMMENT '抵扣积分',
    `report_remark` VARCHAR(500) DEFAULT NULL COMMENT '报单备注',
    `finance_id` BIGINT DEFAULT NULL COMMENT '财务审核人ID',
    `finance_audit_time` DATETIME DEFAULT NULL COMMENT '财务审核时间',
    `remark` VARCHAR(500) DEFAULT NULL COMMENT '审核备注',

    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_report_no` (`report_no`) COMMENT '报单号唯一索引',
    KEY `idx_channel_dealer_id` (`channel_dealer_id`) COMMENT '经销商ID索引',
    KEY `idx_report_date` (`report_date`) COMMENT '报单日期索引',
    KEY `idx_report_status` (`report_status`) COMMENT '报单状态索引',
    KEY `idx_create_time` (`create_time`) COMMENT '创建时间索引',
    KEY `idx_deleted` (`deleted`) COMMENT '删除标记索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='广促报单主表';

-- -----------------------------
-- 广促报单明细表
-- -----------------------------
DROP TABLE IF EXISTS `promotion_goods_report_detail`;
CREATE TABLE `promotion_goods_report_detail` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `creator` VARCHAR(64) DEFAULT NULL COMMENT '创建人',
    `updater` VARCHAR(64) DEFAULT NULL COMMENT '更新人',
    `create_time` DATETIME DEFAULT NULL COMMENT '创建时间',
    `update_time` DATETIME DEFAULT NULL COMMENT '更新时间',
    `deleted` TINYINT(1) DEFAULT 0 COMMENT '删除标记（0：正常；1：删除）',

    `promotion_goods_report_order_id` BIGINT NOT NULL COMMENT '报单ID',
    `promotion_goods_id` BIGINT NOT NULL COMMENT '广促商品ID',
    `num` INT NOT NULL DEFAULT 0 COMMENT '数量',
    `amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '金额',

    PRIMARY KEY (`id`),
    KEY `idx_report_order_id` (`promotion_goods_report_order_id`) COMMENT '报单ID索引',
    KEY `idx_promotion_goods_id` (`promotion_goods_id`) COMMENT '广促商品ID索引',
    KEY `idx_create_time` (`create_time`) COMMENT '创建时间索引',
    KEY `idx_deleted` (`deleted`) COMMENT '删除标记索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='广促报单明细表';

-- -----------------------------
-- 广促订单表
-- -----------------------------
DROP TABLE IF EXISTS `promotion_order`;
CREATE TABLE `promotion_order` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `creator` VARCHAR(64) DEFAULT NULL COMMENT '创建人',
    `updater` VARCHAR(64) DEFAULT NULL COMMENT '更新人',
    `create_time` DATETIME DEFAULT NULL COMMENT '创建时间',
    `update_time` DATETIME DEFAULT NULL COMMENT '更新时间',
    `deleted` TINYINT(1) DEFAULT 0 COMMENT '删除标记（0：正常；1：删除）',

    `order_date` DATE NOT NULL COMMENT '订单日期',
    `report_no` VARCHAR(32) NOT NULL COMMENT '报单号',
    `order_no` VARCHAR(32) NOT NULL COMMENT '订单号',
    `channel_dealer_id` BIGINT NOT NULL COMMENT '经销商ID',
    `channel_dealer_address_id` BIGINT DEFAULT NULL COMMENT '经销商地址ID',
    `promotion_goods_id` BIGINT NOT NULL COMMENT '广促商品ID',
    `num` INT NOT NULL DEFAULT 0 COMMENT '数量',
    `report_remark` VARCHAR(500) DEFAULT NULL COMMENT '报单备注',
    `logistics_image_list` JSON DEFAULT NULL COMMENT '物流图片列表（JSON格式）',

    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_order_no` (`order_no`) COMMENT '订单号唯一索引',
    KEY `idx_report_no` (`report_no`) COMMENT '报单号索引',
    KEY `idx_channel_dealer_id` (`channel_dealer_id`) COMMENT '经销商ID索引',
    KEY `idx_promotion_goods_id` (`promotion_goods_id`) COMMENT '广促商品ID索引',
    KEY `idx_order_date` (`order_date`) COMMENT '订单日期索引',
    KEY `idx_create_time` (`create_time`) COMMENT '创建时间索引',
    KEY `idx_deleted` (`deleted`) COMMENT '删除标记索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='广促订单表';

-- =====================================================
-- 索引优化建议
-- =====================================================

-- -----------------------------
-- 复合索引（根据查询需求创建）
-- -----------------------------

-- 经销商查询报单的复合索引
-- CREATE INDEX `idx_dealer_status_date` ON `promotion_goods_report_order` (`channel_dealer_id`, `report_status`, `report_date`);

-- 报单查询明细的复合索引
-- CREATE INDEX `idx_report_goods` ON `promotion_goods_report_detail` (`promotion_goods_report_order_id`, `promotion_goods_id`);

-- 订单查询的复合索引
-- CREATE INDEX `idx_dealer_order_date` ON `promotion_order` (`channel_dealer_id`, `order_date`);

-- =====================================================
-- 外键约束（可选，根据业务需求决定是否启用）
-- =====================================================

-- 广促报单明细表 - 关联广促报单主表
-- ALTER TABLE `promotion_goods_report_detail`
-- ADD CONSTRAINT `fk_report_detail_order`
-- FOREIGN KEY (`promotion_goods_report_order_id`)
-- REFERENCES `promotion_goods_report_order` (`id`)
-- ON DELETE CASCADE
-- ON UPDATE CASCADE;

-- 广促报单明细表 - 关联广促商品表
-- ALTER TABLE `promotion_goods_report_detail`
-- ADD CONSTRAINT `fk_report_detail_goods`
-- FOREIGN KEY (`promotion_goods_id`)
-- REFERENCES `promotion_goods` (`id`)
-- ON DELETE RESTRICT
-- ON UPDATE CASCADE;

-- 广促订单表 - 关联经销商表
-- ALTER TABLE `promotion_order`
-- ADD CONSTRAINT `fk_order_dealer`
-- FOREIGN KEY (`channel_dealer_id`)
-- REFERENCES `channel_dealer` (`id`)
-- ON DELETE RESTRICT
-- ON UPDATE CASCADE;

-- 广促订单表 - 关联经销商地址表
-- ALTER TABLE `promotion_order`
-- ADD CONSTRAINT `fk_order_dealer_address`
-- FOREIGN KEY (`channel_dealer_address_id`)
-- REFERENCES `channel_dealer_address` (`id`)
-- ON DELETE SET NULL
-- ON UPDATE CASCADE;

-- 广促订单表 - 关联广促商品表
-- ALTER TABLE `promotion_order`
-- ADD CONSTRAINT `fk_order_goods`
-- FOREIGN KEY (`promotion_goods_id`)
-- REFERENCES `promotion_goods` (`id`)
-- ON DELETE RESTRICT
-- ON UPDATE CASCADE;

-- =====================================================
-- 初始化数据（可选）
-- =====================================================

-- -----------------------------
-- 插入测试数据示例
-- -----------------------------
-- INSERT INTO `promotion_goods_report_order` (
--     `report_no`, `channel_dealer_id`, `channel_dealer_address_id`, `report_date`,
--     `report_status`, `report_amount`, `actual_amount`, `deduce_integral`, `report_remark`
-- ) VALUES (
--     '2025012912345678', 1, 1, '2025-01-29', 'UNAUDITED', 1000.00, 800.00, 200.00, '测试报单'
-- );

-- =====================================================
-- 表结构说明
-- =====================================================

-- 1. promotion_goods_report_order（广促报单主表）
--    - 存储广促报单的基本信息
--    - 包含报单号、经销商信息、金额信息、审核状态等
--    - 报单状态：UNAUDITED（未审核）、PASS（通过）、REJECT（拒绝）

-- 2. promotion_goods_report_detail（广促报单明细表）
--    - 存储广促报单的商品明细信息
--    - 一个报单可以包含多个商品明细
--    - 记录每个商品的数量和金额

-- 3. promotion_order（广促订单表）
--    - 存储审核通过后生成的广促订单
--    - 每个报单明细对应一个订单
--    - 订单号规则：报单号 + 序号（如：2025012912345678-1）

-- =====================================================
-- 注意事项
-- =====================================================

-- 1. 所有表都继承BaseEntity的公共字段
-- 2. 使用逻辑删除，deleted字段为1表示删除
-- 3. 金额字段使用DECIMAL(10,2)保证精度
-- 4. JSON字段用于存储物流图片等复杂数据结构
-- 5. 外键约束根据实际业务需求决定是否启用
-- 6. 索引根据查询频率和数据量进行优化