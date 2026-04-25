-- 槟界系统 - 渠道角色微信小程序用户关联表
-- 本文件包含四个中间表，用于支持渠道客服、经销商、大区经理、区域经理的1对多微信账号绑定功能
-- 业务员(ChannelSalesman)保持1对1关系不变，不使用中间表
-- 创建时间：2025-12-08
-- 创建人：Claude
-- 更新说明：从原有的1对1 maOpenid 字段模式改为1对多中间表模式

-- ===============================
-- 1. 渠道客服小程序用户关联表
-- ===============================
CREATE TABLE `channel_customer_service_ma_account` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID，自动增长',
  `channel_customer_service_id` BIGINT NOT NULL COMMENT '渠道客服ID，关联channel_customer_service表',
  `ma_openid` VARCHAR(100) NOT NULL COMMENT '小程序用户openid',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_customer_service_openid` (`channel_customer_service_id`, `ma_openid`) COMMENT '渠道客服ID与openid联合唯一索引',
  KEY `idx_ma_openid` (`ma_openid`) COMMENT '小程序用户openid索引',
  KEY `idx_channel_customer_service_id` (`channel_customer_service_id`) COMMENT '渠道客服ID索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='渠道客服小程序用户关联表';

-- ===============================
-- 2. 经销商小程序用户关联表
-- ===============================
CREATE TABLE `channel_dealer_ma_account` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID，自动增长',
  `channel_dealer_id` BIGINT NOT NULL COMMENT '经销商ID，关联channel_dealer表',
  `ma_openid` VARCHAR(100) NOT NULL COMMENT '小程序用户openid',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_channel_dealer_openid` (`channel_dealer_id`, `ma_openid`) COMMENT '经销商ID与openid联合唯一索引',
  KEY `idx_ma_openid` (`ma_openid`) COMMENT '小程序用户openid索引',
  KEY `idx_channel_dealer_id` (`channel_dealer_id`) COMMENT '经销商ID索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='经销商小程序用户关联表';

-- ===============================
-- 3. 大区经理小程序用户关联表
-- ===============================
CREATE TABLE `channel_group_manager_ma_account` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID，自动增长',
  `channel_group_manager_id` BIGINT NOT NULL COMMENT '大区经理ID，关联channel_group_manager表',
  `ma_openid` VARCHAR(100) NOT NULL COMMENT '小程序用户openid',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_group_manager_openid` (`channel_group_manager_id`, `ma_openid`) COMMENT '大区经理ID与openid联合唯一索引',
  KEY `idx_ma_openid` (`ma_openid`) COMMENT '小程序用户openid索引',
  KEY `idx_channel_group_manager_id` (`channel_group_manager_id`) COMMENT '大区经理ID索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='大区经理小程序用户关联表';

-- ===============================
-- 4. 区域经理小程序用户关联表
-- ===============================
CREATE TABLE `channel_region_manager_ma_account` (
  `id` BIGINT NOT NULL AUTO_INCREMENT COMMENT '主键ID，自动增长',
  `channel_region_manager_id` BIGINT NOT NULL COMMENT '区域经理ID，关联channel_region_manager表',
  `ma_openid` VARCHAR(100) NOT NULL COMMENT '小程序用户openid',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_region_manager_openid` (`channel_region_manager_id`, `ma_openid`) COMMENT '区域经理ID与openid联合唯一索引',
  KEY `idx_ma_openid` (`ma_openid`) COMMENT '小程序用户openid索引',
  KEY `idx_channel_region_manager_id` (`channel_region_manager_id`) COMMENT '区域经理ID索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='区域经理小程序用户关联表';

-- ===============================
-- 数据迁移说明
-- ===============================
-- 1. 如果原有表中存在 maOpenid 字段，需要将数据迁移到对应的中间表：
--    例如：INSERT INTO channel_dealer_ma_account (channel_dealer_id, ma_openid)
--          SELECT id, ma_openid FROM channel_dealer WHERE ma_openid IS NOT NULL
--
-- 2. 迁移完成后，需要从原表中删除 maOpenid 字段：
--    ALTER TABLE channel_dealer DROP COLUMN ma_openid;
--
-- 3. 外键约束（可选）：根据项目需要，可以添加外键约束来保证数据完整性
--    ALTER TABLE channel_dealer_ma_account ADD CONSTRAINT fk_cma_channel_dealer_id
--    FOREIGN KEY (channel_dealer_id) REFERENCES channel_dealer (id) ON DELETE CASCADE;

-- ===============================
-- 业务规则说明
-- ===============================
-- 1. 每个渠道角色（经销商、大区经理、区域经理）可以绑定多个微信账号
-- 2. 每个微信账号只能绑定到一个渠道角色
-- 3. 通过联合唯一索引确保同一角色不会重复绑定相同的微信账号
-- 4. 使用逻辑删除（deleted字段），避免物理删除导致的数据丢失
-- 5. 业务员(ChannelSalesman)保持原有的1对1关系，不参与此次改造