-- 二维码置换记录表
-- 用于记录二维码的置换操作，当一个二维码需要更换为另一个二维码时使用
-- Create table for qr_code_replace_record

CREATE TABLE `qr_code_replace_record` (
  `id` bigint NOT NULL COMMENT '主键ID',
  `old_qr_code` varchar(100) NOT NULL COMMENT '原始码',
  `new_qr_code` varchar(100) NOT NULL COMMENT '置换码',
  `remark` varchar(500) DEFAULT NULL COMMENT '备注',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `creator` bigint DEFAULT NULL COMMENT '创建者',
  `updater` bigint DEFAULT NULL COMMENT '更新者',
  `deleted` tinyint NOT NULL DEFAULT 0 COMMENT '删除标记 (0:正常, 1:删除)',
  PRIMARY KEY (`id`),
  KEY `idx_old_qr_code` (`old_qr_code`),
  KEY `idx_new_qr_code` (`new_qr_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='二维码置换记录表';