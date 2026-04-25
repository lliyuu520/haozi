-- =============================================
-- 追溯码反馈记录表
-- =============================================
-- 创建时间: 2025-10-14
-- 创建人: Claude Code
-- 说明: 存储用户对二维码的反馈信息，包括图片、备注、位置等
-- 约束: 每个二维码只能反馈一次（qr_code字段唯一约束）

CREATE TABLE `qr_code_feedback_record` (
  `id` bigint NOT NULL COMMENT '主键ID',
  `qr_code` varchar(100) NOT NULL COMMENT '二维码',
  `image_list` json DEFAULT NULL COMMENT '上传图片列表',
  `feedback_remark` text COMMENT '反馈备注',
  `feedback_ma_openid` varchar(100) DEFAULT NULL COMMENT '反馈人小程序openid',
  `feedback_datetime` datetime DEFAULT NULL COMMENT '反馈时间',
  `feedback_location` varchar(500) DEFAULT NULL COMMENT '反馈定位（经纬度）',
  `feedback_address` varchar(500) DEFAULT NULL COMMENT '反馈地址',
  `audit_status` varchar(20) DEFAULT 'UNAUDITED' COMMENT '审核状态：UNAUDITED-未审核，PASS-通过，REJECT-拒绝',
  `audit_user_id` bigint DEFAULT NULL COMMENT '审核人ID',
  `audit_remark` varchar(500) DEFAULT NULL COMMENT '审核备注',
  `audit_datetime` datetime DEFAULT NULL COMMENT '审核时间',
  `trace_order_id` bigint DEFAULT NULL COMMENT '关联的追溯订单ID',
  `trace_gift_id` bigint DEFAULT NULL COMMENT '关联的礼品ID',
  `creator` bigint DEFAULT NULL COMMENT '创建者',
  `updater` bigint DEFAULT NULL COMMENT '更新者',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '删除标记：0-正常，1-删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_qr_code` (`qr_code`) COMMENT '二维码唯一约束',
  KEY `idx_feedback_ma_openid` (`feedback_ma_openid`) COMMENT '反馈人openid索引',
  KEY `idx_audit_status` (`audit_status`) COMMENT '审核状态索引',
  KEY `idx_audit_user_id` (`audit_user_id`) COMMENT '审核人ID索引',
  KEY `idx_create_time` (`create_time`) COMMENT '创建时间索引',
  KEY `idx_feedback_datetime` (`feedback_datetime`) COMMENT '反馈时间索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='追溯码反馈记录表';

-- =============================================
-- 索引说明
-- =============================================
-- 1. uk_qr_code: 确保每个二维码只能反馈一次，防止重复提交
-- 2. idx_feedback_ma_openid: 支持按反馈人查询历史反馈记录
-- 3. idx_audit_status: 支持按审核状态筛选（待审核、已通过、已拒绝）
-- 4. idx_audit_user_id: 支持按审核人查询处理记录
-- 5. idx_create_time: 支持按创建时间排序
-- 6. idx_feedback_datetime: 支持按反馈时间查询和统计

-- =============================================
-- 业务约束说明
-- =============================================
-- 1. qr_code 字段为必填项，且全局唯一
-- 2. 默认审核状态为 UNAUDITED（未审核）
-- 3. 使用逻辑删除，deleted = 1 表示已删除
-- 4. 审核通过后，会关联到具体的 trace_order_id 和 trace_gift_id
-- 5. image_list 使用 JSON 类型存储 FileDTO 列表，支持多图片上传
-- 6. 所有时间字段自动维护，支持事务回滚