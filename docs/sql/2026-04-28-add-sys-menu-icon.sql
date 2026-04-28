-- 为菜单资源增加图标字段，前端保存 Ant Design 图标组件名称用于界面展示。
ALTER TABLE sys_menu
    ADD COLUMN icon varchar(100) NOT NULL DEFAULT '' COMMENT '菜单图标' AFTER url;
