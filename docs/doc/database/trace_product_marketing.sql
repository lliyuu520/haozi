-- 创建产品-政策关联表
CREATE TABLE `trace_product_marketing` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `trace_product_id` bigint NOT NULL COMMENT '产品ID',
  `trace_marketing_id` bigint NOT NULL COMMENT '政策ID',
  `report_price` decimal(10,2) DEFAULT NULL COMMENT '报价',
  `creator` bigint DEFAULT NULL COMMENT '创建者ID',
  `creator_name` varchar(255) DEFAULT NULL COMMENT '创建者名称',
  `updater` bigint DEFAULT NULL COMMENT '更新者ID',
  `updater_name` varchar(255) DEFAULT NULL COMMENT '更新者名称',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '删除标识（0：正常，1：删除）',
  PRIMARY KEY (`id`),
  KEY `idx_trace_product_id` (`trace_product_id`),
  KEY `idx_trace_marketing_id` (`trace_marketing_id`),
  KEY `idx_report_price` (`report_price`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='产品-政策关联表';

-- 添加表注释
ALTER TABLE `trace_product_marketing` COMMENT='产品-政策关联表';

-- 添加字段注释
ALTER TABLE `trace_product_marketing` 
  MODIFY COLUMN `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  MODIFY COLUMN `trace_product_id` bigint NOT NULL COMMENT '产品ID',
  MODIFY COLUMN `trace_marketing_id` bigint NOT NULL COMMENT '政策ID',
  MODIFY COLUMN `report_price` decimal(10,2) DEFAULT NULL COMMENT '报价',
  MODIFY COLUMN `creator` bigint DEFAULT NULL COMMENT '创建者ID',
  MODIFY COLUMN `creator_name` varchar(255) DEFAULT NULL COMMENT '创建者名称',
  MODIFY COLUMN `updater` bigint DEFAULT NULL COMMENT '更新者ID',
  MODIFY COLUMN `updater_name` varchar(255) DEFAULT NULL COMMENT '更新者名称',
  MODIFY COLUMN `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  MODIFY COLUMN `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  MODIFY COLUMN `deleted` tinyint(1) DEFAULT '0' COMMENT '删除标识（0：正常，1：删除）';

-- 创建唯一索引（确保同一产品与政策不重复关联）
CREATE UNIQUE INDEX `uk_product_marketing` ON `trace_product_marketing` (`trace_product_id`, `trace_marketing_id`) ;

-- 添加外键约束（可选，根据实际需求）
-- ALTER TABLE `trace_product_marketing` ADD CONSTRAINT `fk_trace_product` FOREIGN KEY (`trace_product_id`) REFERENCES `trace_product` (`id`);
-- ALTER TABLE `trace_product_marketing` ADD CONSTRAINT `fk_trace_marketing` FOREIGN KEY (`trace_marketing_id`) REFERENCES `trace_marketing` (`id`);