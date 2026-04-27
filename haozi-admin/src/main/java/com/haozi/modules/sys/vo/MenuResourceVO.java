package com.haozi.modules.sys.vo;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

/**
 * React 菜单资源记录。
 *
 * <p>迁移期继续复用旧 sys_menu 的 url、perms、type、weight 等字段，
 * 只为新前端固定响应结构，避免 React 页面直接依赖 Hutool Tree 的动态扩展字段。</p>
 *
 * @param id 菜单 ID
 * @param parentId 父菜单 ID
 * @param parentName 父菜单名称
 * @param name 菜单名称
 * @param type 类型，0 菜单、1 按钮、2 接口
 * @param url 路由地址
 * @param perms 授权标识
 * @param openStyle 打开方式，0 内部、1 外部
 * @param weight 排序
 * @param children 子资源
 */
@Schema(description = "菜单资源记录")
public record MenuResourceVO(
        @Schema(description = "菜单 ID")
        Long id,
        @Schema(description = "父菜单 ID")
        Long parentId,
        @Schema(description = "父菜单名称")
        String parentName,
        @Schema(description = "菜单名称")
        String name,
        @Schema(description = "类型，0 菜单、1 按钮、2 接口")
        Integer type,
        @Schema(description = "路由地址")
        String url,
        @Schema(description = "授权标识")
        String perms,
        @Schema(description = "打开方式，0 内部、1 外部")
        Integer openStyle,
        @Schema(description = "排序")
        Integer weight,
        @Schema(description = "子资源")
        List<MenuResourceVO> children
) {
}
