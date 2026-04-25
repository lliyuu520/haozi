-- 区域经理小程序用户关联表
-- 用于存储区域经理与其绑定的多个微信小程序用户openid的关联关系
-- 支持一个区域经理绑定多个微信账号
-- 创建时间：2025-12-08
-- 创建人：Claude

CREATE TABLE `channel_region_manager_ma_account` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID，自动增长',
  `channel_region_manager_id` BIGINT NOT NULL COMMENT '区域经理ID，关联channel_region_manager表',
  `ma_openid` VARCHAR(100) NOT NULL COMMENT '小程序用户openid',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_region_manager_openid` (`channel_region_manager_id`, `ma_openid`) COMMENT '区域经理ID与openid联合唯一索引',
  KEY `idx_ma_openid` (`ma_openid`) COMMENT '小程序用户openid索引',
  KEY `idx_channel_region_manager_id` (`channel_region_manager_id`) COMMENT '区域经理ID索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='区域经理小程序用户关联表';

-- 添加外键约束（可选，根据项目需要）
-- ALTER TABLE `channel_region_manager_ma_account` ADD CONSTRAINT `fk_crm_channel_region_manager_id`
-- FOREIGN KEY (`channel_region_manager_id`) REFERENCES `channel_region_manager` (`id`) ON DELETE CASCADE;