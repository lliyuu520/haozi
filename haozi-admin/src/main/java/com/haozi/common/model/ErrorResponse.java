package com.haozi.common.model;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.OffsetDateTime;
import java.util.Map;

/**
 * 统一错误响应模型。
 *
 * <p>错误通过 HTTP 状态码表达大类，通过 code 表达系统内部错误编码。
 * 新 React 前端可以直接依赖非 2xx 状态进入 TanStack Query 的 error 分支。</p>
 *
 * @param code 错误编码
 * @param message 用户可读错误信息
 * @param path 请求路径
 * @param timestamp 发生时间
 * @param traceId 链路追踪 ID
 * @param details 字段级错误详情
 */
@Schema(description = "错误响应")
public record ErrorResponse(
        @Schema(description = "错误编码")
        String code,
        @Schema(description = "用户可读错误信息")
        String message,
        @Schema(description = "请求路径")
        String path,
        @Schema(description = "发生时间")
        OffsetDateTime timestamp,
        @Schema(description = "链路追踪 ID")
        String traceId,
        @Schema(description = "字段级错误详情")
        Map<String, String> details
) {

    /**
     * 构建不包含字段详情的错误响应。
     *
     * @param code 错误编码
     * @param message 用户可读错误信息
     * @param path 请求路径
     * @return 错误响应
     */
    public static ErrorResponse of(final String code, final String message, final String path) {
        return new ErrorResponse(code, message, path, OffsetDateTime.now(), null, Map.of());
    }

    /**
     * 构建包含字段详情的错误响应。
     *
     * @param code 错误编码
     * @param message 用户可读错误信息
     * @param path 请求路径
     * @param details 字段级错误详情
     * @return 错误响应
     */
    public static ErrorResponse of(
            final String code,
            final String message,
            final String path,
            final Map<String, String> details
    ) {
        return new ErrorResponse(code, message, path, OffsetDateTime.now(), null, details);
    }
}
