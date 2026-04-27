package com.haozi.modules.sys.vo;

import io.swagger.v3.oas.annotations.media.Schema;

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
@Schema(description = "角色管理记录")
public record RoleRecordVO(
        @Schema(description = "角色 ID")
        Long id,
        @Schema(description = "角色名称")
        String name,
        @Schema(description = "已授权菜单 ID 列表")
        List<Long> menuIdList
) {
}
