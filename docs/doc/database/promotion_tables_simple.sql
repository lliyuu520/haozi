-- 广促报单主表
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
    `report_status` VARCHAR(32) DEFAULT 'UNAUDITED' COMMENT '报单状态',
    `report_amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '报单总金额',
    `actual_amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '实际金额',
    `deduce_integral` DECIMAL(10,2) DEFAULT 0.00 COMMENT '抵扣积分',
    `report_remark` VARCHAR(500) DEFAULT NULL COMMENT '报单备注',
    `finance_id` BIGINT DEFAULT NULL COMMENT '财务审核人ID',
    `finance_audit_time` DATETIME DEFAULT NULL COMMENT '财务审核时间',
    `remark` VARCHAR(500) DEFAULT NULL COMMENT '审核备注',

    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_report_no` (`report_no`),
    KEY `idx_channel_dealer_id` (`channel_dealer_id`),
    KEY `idx_report_date` (`report_date`),
    KEY `idx_report_status` (`report_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='广促报单主表';

-- 广促报单明细表
CREATE TABLE `promotion_goods_report_detail` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `creator` VARCHAR(64) DEFAULT NULL COMMENT '创建人',
    `updater` VARCHAR(64) DEFAULT NULL COMMENT '更新人',
    `create_time` DATETIME DEFAULT NULL COMMENT '创建时间',
    `update_time` DATETIME DEFAULT NULL COMMENT '更新时间',
    `deleted` TINYINT(1) DEFAULT 0 COMMENT '删除标记',

    `promotion_goods_report_order_id` BIGINT NOT NULL COMMENT '报单ID',
    `promotion_goods_id` BIGINT NOT NULL COMMENT '广促商品ID',
    `num` INT NOT NULL DEFAULT 0 COMMENT '数量',
    `amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '金额',

    PRIMARY KEY (`id`),
    KEY `idx_report_order_id` (`promotion_goods_report_order_id`),
    KEY `idx_promotion_goods_id` (`promotion_goods_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='广促报单明细表';

-- 广促订单表
CREATE TABLE `promotion_order` (
    `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `creator` VARCHAR(64) DEFAULT NULL COMMENT '创建人',
    `updater` VARCHAR(64) DEFAULT NULL COMMENT '更新人',
    `create_time` DATETIME DEFAULT NULL COMMENT '创建时间',
    `update_time` DATETIME DEFAULT NULL COMMENT '更新时间',
    `deleted` TINYINT(1) DEFAULT 0 COMMENT '删除标记',

    `order_date` DATE NOT NULL COMMENT '订单日期',
    `report_no` VARCHAR(32) NOT NULL COMMENT '报单号',
    `order_no` VARCHAR(32) NOT NULL COMMENT '订单号',
    `channel_dealer_id` BIGINT NOT NULL COMMENT '经销商ID',
    `channel_dealer_address_id` BIGINT DEFAULT NULL COMMENT '经销商地址ID',
    `promotion_goods_id` BIGINT NOT NULL COMMENT '广促商品ID',
    `num` INT NOT NULL DEFAULT 0 COMMENT '数量',
    `report_remark` VARCHAR(500) DEFAULT NULL COMMENT '报单备注',
    `logistics_image_list` JSON DEFAULT NULL COMMENT '物流图片列表',

    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_order_no` (`order_no`),
    KEY `idx_report_no` (`report_no`),
    KEY `idx_channel_dealer_id` (`channel_dealer_id`),
    KEY `idx_promotion_goods_id` (`promotion_goods_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='广促订单表';