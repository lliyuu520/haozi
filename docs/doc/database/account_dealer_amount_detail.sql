-- 经销商金额明细表
CREATE TABLE `account_dealer_amount_detail` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `creator` varchar(64) DEFAULT NULL COMMENT '创建人',
  `updater` varchar(64) DEFAULT NULL COMMENT '更新人',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT 0 COMMENT '删除标记（0-正常，1-删除）',
  `channel_dealer_id` bigint NOT NULL COMMENT '经销商ID',
  `amount` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT '金额',
  `amount_handle_type` varchar(20) DEFAULT NULL COMMENT '操作类型（INCREASE-增加，DECREASE-减少）',
  `handle_date_time` datetime DEFAULT NULL COMMENT '操作时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `audit_status` varchar(20) DEFAULT 'PENDING' COMMENT '审核状态（PENDING-待审核，APPROVED-已通过，REJECTED-已拒绝）',
  `audit_date_time` datetime DEFAULT NULL COMMENT '审核时间',
  `audit_username` varchar(64) DEFAULT NULL COMMENT '审核人',
  `audit_remark` varchar(500) DEFAULT NULL COMMENT '审核备注',
  `create_username` varchar(64) DEFAULT NULL COMMENT '创建人',
  PRIMARY KEY (`id`),
  KEY `idx_channel_dealer_id` (`channel_dealer_id`),
  KEY `idx_amount_handle_type` (`amount_handle_type`),
  KEY `idx_handle_date_time` (`handle_date_time`),
  KEY `idx_audit_status` (`audit_status`),
  KEY `idx_create_time` (`create_time`),
  KEY `idx_deleted` (`deleted`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='经销商金额明细表';

-- 添加表注释
ALTER TABLE `account_dealer_amount_detail` COMMENT '经销商金额明细表';