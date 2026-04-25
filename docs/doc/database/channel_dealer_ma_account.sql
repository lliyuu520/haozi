-- 经销商小程序用户关联表
-- 用于存储经销商与其绑定的多个微信小程序用户openid的关联关系
-- 支持一个经销商绑定多个微信账号
-- 创建时间：2025-12-08
-- 创建人：Claude

CREATE TABLE `channel_dealer_ma_account` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID，自动增长',
  `channel_dealer_id` BIGINT NOT NULL COMMENT '经销商ID，关联channel_dealer表',
  `ma_openid` VARCHAR(100) NOT NULL COMMENT '小程序用户openid',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_channel_dealer_openid` (`channel_dealer_id`, `ma_openid`) COMMENT '经销商ID与openid联合唯一索引',
  KEY `idx_ma_openid` (`ma_openid`) COMMENT '小程序用户openid索引',
  KEY `idx_channel_dealer_id` (`channel_dealer_id`) COMMENT '经销商ID索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='经销商小程序用户关联表';

-- 添加外键约束（可选，根据项目需要）
-- ALTER TABLE `channel_dealer_ma_account` ADD CONSTRAINT `fk_cma_channel_dealer_id`
-- FOREIGN KEY (`channel_dealer_id`) REFERENCES `channel_dealer` (`id`) ON DELETE CASCADE;