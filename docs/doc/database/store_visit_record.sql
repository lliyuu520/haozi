-- 门店拜访记录表
CREATE TABLE `store_visit_record` (
  `id` bigint NOT NULL COMMENT '主键ID',
  `store_shop_id` varchar(50) NOT NULL COMMENT '门店ID',
  `channel_salesman_id` bigint NOT NULL COMMENT '拜访业务员ID',
  `visit_image_list` json DEFAULT NULL COMMENT '拜访照片列表(JSON格式)',
  `visit_address` varchar(255) DEFAULT NULL COMMENT '拜访地址',
  `visit_location` varchar(100) DEFAULT NULL COMMENT '拜访定位',
  `visit_date_time` datetime DEFAULT NULL COMMENT '拜访时间',
  `creator` bigint DEFAULT NULL COMMENT '创建者',
  `updater` bigint DEFAULT NULL COMMENT '更新者',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` datetime DEFAULT NULL COMMENT '更新时间',
  `deleted` tinyint DEFAULT '0' COMMENT '删除标记(0:正常,1:删除)',
  PRIMARY KEY (`id`),
  KEY `idx_store_shop_id` (`store_shop_id`),
  KEY `idx_channel_salesman_id` (`channel_salesman_id`),
  KEY `idx_visit_date_time` (`visit_date_time`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='门店拜访记录表';