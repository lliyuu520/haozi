

-- 插入系统预定义参数
INSERT INTO `sys_config` (`code`, `descs`, `type`, `enabled`, `num`, `text`, `creator`) VALUES
('DAY_RECEIVE_LIMIT', '每日领奖次数', 'NUMBER_TYPE', NULL, 3, NULL, 1),
('INTEGRAL_EXCHANGE_RATIO', '积分兑换金额比例', 'NUMBER_TYPE', NULL, 100, NULL, 1),
('ORDER_VALID_DAYS', '订单有效天数', 'NUMBER_TYPE', NULL, 30, NULL, 1),
('COLLECT_PHONE_NUMBER', '是否收集用户手机号码', 'SWITCH_TYPE', 1, NULL, NULL, 1);