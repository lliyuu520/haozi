package com.haozi.modules.sys.vo;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

/**
 * React 菜单权限树节点。
 *
 * <p>Hutool Tree 适合旧 Vue 直接消费，但 OpenAPI 类型不够稳定；
 * 新前端使用该固定结构渲染 Ant Design Tree。</p>
 *
 * @param id 菜单 ID
 * @param name 菜单名称
 * @param children 子节点
 */
@Schema(description = "菜单权限树节点")
public record MenuTreeNodeVO(
        @Schema(description = "菜单 ID")
        Long id,
        @Schema(description = "菜单名称")
        String name,
        @Schema(description = "子节点")
        List<MenuTreeNodeVO> children
) {
}
