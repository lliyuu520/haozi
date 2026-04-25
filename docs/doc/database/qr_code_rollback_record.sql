-- 箱码退库记录表
-- 用于记录箱码的退库操作，当需要将已发货的箱码进行退库处理时使用
-- Create table for qr_code_rollback_record

CREATE TABLE `qr_code_rollback_record` (
  `id` bigint NOT NULL COMMENT '主键ID',
  `qr_code_level3` varchar(100) NOT NULL COMMENT '箱码',
  `rollback_date_time` datetime NOT NULL COMMENT '退库时间',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `creator` bigint DEFAULT NULL COMMENT '创建者',
  `updater` bigint DEFAULT NULL COMMENT '更新者',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '删除标记 (0:正常, 1:删除)',
  PRIMARY KEY (`id`),
  KEY `idx_qr_code_level3` (`qr_code_level3`),
  KEY `idx_rollback_date_time` (`rollback_date_time`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='箱码退库记录表';