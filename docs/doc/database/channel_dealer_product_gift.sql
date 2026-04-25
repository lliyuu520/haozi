-- 经销商产品礼品配置表
-- 用于配置经销商可以选择哪些产品和礼品进行报单
-- 创建时间：2025-01-22
-- 创建人：Claude

DROP TABLE IF EXISTS `channel_dealer_product_gift`;

CREATE TABLE `channel_dealer_product_gift` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `dealer_id` BIGINT NOT NULL COMMENT '经销商ID，关联channel_dealer表',
  `product_id` BIGINT NOT NULL COMMENT '产品ID，关联trace_product表',
  `gift_id` BIGINT NOT NULL COMMENT '礼品ID，关联trace_gift表',
  `report_price` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '报单价格',
  `write_off_reward_integral` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '核销奖励积分',
  `creator` VARCHAR(64) DEFAULT NULL COMMENT '创建人',
  `updater` VARCHAR(64) DEFAULT NULL COMMENT '更新人',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '删除标记（0：正常，1：删除）',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_dealer_product_gift` (`dealer_id`, `product_id`, `gift_id`) COMMENT '经销商-产品-礼品唯一约束',
  KEY `idx_dealer_id` (`dealer_id`) COMMENT '经销商ID索引',
  KEY `idx_product_id` (`product_id`) COMMENT '产品ID索引',
  KEY `idx_gift_id` (`gift_id`) COMMENT '礼品ID索引',
  KEY `idx_create_time` (`create_time`) COMMENT '创建时间索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='经销商产品礼品配置表';

-- 添加表注释
ALTER TABLE `channel_dealer_product_gift` COMMENT = '经销商产品礼品配置表，用于配置经销商报单时可选择的产品和礼品组合';

-- 插入测试数据（可选）
INSERT INTO `channel_dealer_product_gift` (
  `dealer_id`, 
  `product_id`, 
  `gift_id`, 
  `report_price`, 
  `write_off_reward_integral`,
  `creator`
) VALUES 
(1, 1, 1, 100.00, 10.00, 'admin'),
(1, 1, 2, 150.00, 15.00, 'admin'),
(1, 2, 1, 200.00, 20.00, 'admin'),
(2, 1, 1, 120.00, 12.00, 'admin'),
(2, 3, 2, 180.00, 18.00, 'admin');

-- 创建索引优化查询性能
-- 如果数据量大，可以考虑添加以下复合索引
CREATE INDEX `idx_dealer_product` ON `channel_dealer_product_gift` (`dealer_id`, `product_id`);
CREATE INDEX `idx_dealer_gift` ON `channel_dealer_product_gift` (`dealer_id`, `gift_id`);
CREATE INDEX `idx_product_gift` ON `channel_dealer_product_gift` (`product_id`, `gift_id`);