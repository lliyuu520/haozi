-- 经销商地址表
-- 用于存储经销商的地址信息，支持一个经销商拥有多个地址
-- 创建时间：2025-01-22
-- 创建人：Claude


CREATE TABLE `channel_dealer_address` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `name` VARCHAR(100) NOT NULL COMMENT '地址名称',
  `address` VARCHAR(500) NOT NULL COMMENT '详细地址',
  `channel_dealer_id` BIGINT NOT NULL COMMENT '经销商ID，关联channel_dealer表',
  `creator` VARCHAR(64) DEFAULT NULL COMMENT '创建人',
  `updater` VARCHAR(64) DEFAULT NULL COMMENT '更新人',
  `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` TINYINT NOT NULL DEFAULT 0 COMMENT '删除标记（0：正常，1：删除）',
  PRIMARY KEY (`id`),
  KEY `idx_channel_dealer_id` (`channel_dealer_id`) COMMENT '经销商ID索引',
  KEY `idx_name` (`name`) COMMENT '地址名称索引',
  KEY `idx_create_time` (`create_time`) COMMENT '创建时间索引',
  KEY `idx_deleted` (`deleted`) COMMENT '删除标记索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='经销商地址表';
