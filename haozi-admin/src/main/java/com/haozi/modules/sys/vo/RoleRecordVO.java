package com.haozi.modules.sys.vo;

import java.io.Serializable;
import java.util.List;

/**
 * React 角色管理记录。
 *
 * <p>角色页面只展示和编辑角色名称及其菜单权限，使用独立 VO 固定新前端契约。</p>
 *
 * @param id 角色 ID
 * @param name 角色名称
 * @param menuIdList 已授权菜单 ID 列表
 */
public record RoleRecordVO(
        Long id,
        String name,
        List<Long> menuIdList
) implements Serializable {
}
