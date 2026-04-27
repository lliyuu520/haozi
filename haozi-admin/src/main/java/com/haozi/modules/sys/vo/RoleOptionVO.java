package com.haozi.modules.sys.vo;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 角色下拉选项。
 *
 * <p>用户表单只需要角色 ID 和名称，使用独立 VO 避免把角色详情字段泄漏到表单选项接口。</p>
 *
 * @param id 角色 ID
 * @param name 角色名称
 */
@Schema(description = "角色选项")
public record RoleOptionVO(
        @Schema(description = "角色 ID")
        Long id,
        @Schema(description = "角色名称")
        String name
) {
}
