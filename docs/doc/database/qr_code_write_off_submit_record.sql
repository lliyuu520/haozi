-- 二维码核销提交记录表
-- 消费者扫码领奖 -> 门店核销 -> 业务员核销 -> 财务核销 -> 结束
-- Create table for qr_code_write_off_submit_record

CREATE TABLE `qr_code_write_off_submit_record` (
  `id` bigint NOT NULL COMMENT '主键ID',
  `batch_no` varchar(50) DEFAULT NULL COMMENT '批次号',
  `store_shop_id` bigint DEFAULT NULL COMMENT '核销门店ID',
  `salesman_write_off_time` datetime DEFAULT NULL COMMENT '业务员核销时间',
  `channel_salesman_id` bigint DEFAULT NULL COMMENT '业务员ID',
  `finance_write_off_time` datetime DEFAULT NULL COMMENT '财务核销时间',
  `finance_id` bigint DEFAULT NULL COMMENT '财务ID',
  `write_off_status` varchar(50) DEFAULT NULL COMMENT '核销状态 (CONSUMER_SCAN:消费者扫码, SHOP_WRITE_OFF:门店核销, SALESMAN_WRITE_OFF:业务员核销, FINANCE_WRITE_OFF:财务核销)',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `creator` bigint DEFAULT NULL COMMENT '创建者',
  `updater` bigint DEFAULT NULL COMMENT '更新者',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '删除标记 (0:正常, 1:删除)',
  PRIMARY KEY (`id`),
  KEY `idx_batch_no` (`batch_no`),
  KEY `idx_store_shop_id` (`store_shop_id`),
  KEY `idx_channel_salesman_id` (`channel_salesman_id`),
  KEY `idx_finance_id` (`finance_id`),
  KEY `idx_write_off_status` (`write_off_status`),
  KEY `idx_create_time` (`create_time`),
  KEY `idx_salesman_write_off_time` (`salesman_write_off_time`),
  KEY `idx_finance_write_off_time` (`finance_write_off_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='二维码核销提交记录表';