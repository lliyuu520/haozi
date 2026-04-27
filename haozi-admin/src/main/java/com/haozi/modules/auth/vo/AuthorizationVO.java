package com.haozi.modules.auth.vo;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

/**
 * 当前用户授权资源集合。
 *
 * <p>该对象不携带前端组件路径，只携带稳定的 route code 与 permission code，
 * 以便前后端职责解耦。</p>
 *
 * @param routeCodes 可访问的前端路由编码
 * @param permissions 可使用的按钮和接口权限编码
 */
@Schema(description = "当前用户授权资源")
public record AuthorizationVO(
        @Schema(description = "可访问的前端路由编码")
        List<String> routeCodes,
        @Schema(description = "可使用的按钮和接口权限编码")
        List<String> permissions
) {
}
