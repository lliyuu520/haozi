package com.haozi.modules.auth.vo;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 登录结果
 */
@Schema(description = "登录结果")
public record LoginResultVO(
    @Schema(description = "访问令牌")
    String token,

    @Schema(description = "当前用户信息")
    CurrentUserVO user
) {
}
