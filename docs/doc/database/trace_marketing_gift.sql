-- 创建营销政策礼品表
CREATE TABLE `trace_marketing_gift` (
    `id` BIGINT NOT NULL COMMENT '主键ID',
    `marketing_id` BIGINT DEFAULT NULL COMMENT '营销政策ID',
    `gift_id` BIGINT DEFAULT NULL COMMENT '礼品ID',
    `win_rate` DECIMAL(10,4) DEFAULT NULL COMMENT '中奖率',
    `report_price` DECIMAL(10,2) DEFAULT NULL COMMENT '报表价格',
    `creator` BIGINT DEFAULT NULL COMMENT '创建者',
    `updater` BIGINT DEFAULT NULL COMMENT '更新者',
    `create_time` DATETIME DEFAULT NULL COMMENT '创建时间',
    `update_time` DATETIME DEFAULT NULL COMMENT '更新时间',
    `deleted` TINYINT DEFAULT 0 COMMENT '是否删除（0：正常，1：删除）',
    PRIMARY KEY (`id`),
    INDEX `idx_marketing_id` (`marketing_id`) COMMENT '营销政策ID索引',
    INDEX `idx_gift_id` (`gift_id`) COMMENT '礼品ID索引',
    INDEX `idx_win_rate` (`win_rate`) COMMENT '中奖率索引',
    INDEX `idx_create_time` (`create_time`) COMMENT '创建时间索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='营销政策礼品表';