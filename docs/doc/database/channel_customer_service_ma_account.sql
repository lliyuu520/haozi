-- 渠道客服小程序用户关联表
-- 用于存储渠道客服与其绑定的多个微信小程序用户openid的关联关系
-- 支持一个渠道客服绑定多个微信账号
-- 创建时间：2025-12-08
-- 创建人：Claude

CREATE TABLE `channel_customer_service_ma_account` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID，自动增长',
  `channel_customer_service_id` BIGINT NOT NULL COMMENT '渠道客服ID，关联channel_customer_service表',
  `ma_openid` VARCHAR(100) NOT NULL COMMENT '小程序用户openid',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_customer_service_openid` (`channel_customer_service_id`, `ma_openid`) COMMENT '渠道客服ID与openid联合唯一索引',
  KEY `idx_ma_openid` (`ma_openid`) COMMENT '小程序用户openid索引',
  KEY `idx_channel_customer_service_id` (`channel_customer_service_id`) COMMENT '渠道客服ID索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='渠道客服小程序用户关联表';

-- 添加外键约束（可选，根据项目需要）
-- ALTER TABLE `channel_customer_service_ma_account` ADD CONSTRAINT `fk_ccs_channel_customer_service_id`
-- FOREIGN KEY (`channel_customer_service_id`) REFERENCES `channel_customer_service` (`id`) ON DELETE CASCADE;