-- 为下载中心表添加状态和备注字段
ALTER TABLE sys_download_center
    ADD COLUMN status VARCHAR(20) COMMENT '导出状态：SUCCESS/FAILED' AFTER completed_date_time;
ALTER TABLE sys_download_center
    ADD COLUMN remark VARCHAR(2000) COMMENT '错误信息' AFTER status;
