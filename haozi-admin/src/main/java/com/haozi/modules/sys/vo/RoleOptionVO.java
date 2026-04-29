package com.haozi.modules.sys.vo;

import java.io.Serializable;

/**
 * 角色下拉选项。
 *
 * <p>用户表单只需要角色 ID 和名称，使用独立 VO 避免把角色详情字段泄漏到表单选项接口。</p>
 *
 * @param id 角色 ID
 * @param name 角色名称
 */
public record RoleOptionVO(
        Long id,
        String name
) implements Serializable {
}
