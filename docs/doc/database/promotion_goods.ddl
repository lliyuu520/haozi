-- 广促商品表
CREATE TABLE `promotion_goods` (
  `id` bigint NOT NULL COMMENT '主键ID',
  `creator` varchar(50) DEFAULT NULL COMMENT '创建者',
  `updater` varchar(50) DEFAULT NULL COMMENT '更新者',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '删除标识（0：正常，1：删除）',
  `name` varchar(100) NOT NULL COMMENT '商品名称',
  `promotion_goods_type` varchar(50) NOT NULL COMMENT '商品类型（字典：PROMOTION_GOODS_TYPE）',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '单价',
  `file_ids` text COMMENT '图片文件ID列表（JSON数组格式）',
  PRIMARY KEY (`id`),
  KEY `idx_promotion_goods_type` (`promotion_goods_type`),
  KEY `idx_name` (`name`),
  KEY `idx_price` (`price`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='广促商品表';

-- 复合索引优化
CREATE INDEX `idx_promotion_goods_type_create_time` ON `promotion_goods` (`promotion_goods_type`, `create_time`);
CREATE INDEX `idx_promotion_goods_name_type` ON `promotion_goods` (`name`, `promotion_goods_type`);