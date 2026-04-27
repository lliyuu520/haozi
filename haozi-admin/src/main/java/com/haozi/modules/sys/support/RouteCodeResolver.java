package com.haozi.modules.sys.support;

import cn.hutool.core.util.StrUtil;
import lombok.experimental.UtilityClass;

import java.util.Optional;

/**
 * 路由编码解析工具。
 *
 * <p>迁移期仍保留旧菜单 URL 字段，该工具将旧 URL 转换为新 React route manifest
 * 可以消费的稳定 route code。后续数据库完成 code 字段迁移后，可以逐步减少对旧 URL 的依赖。</p>
 */
@UtilityClass
public class RouteCodeResolver {

    private static final String INDEX_SUFFIX = "/index";

    /**
     * 从旧菜单 URL 解析 route code。
     *
     * @param legacyUrl 旧菜单 URL，例如 sys/user/index
     * @return route code，例如 sys.user；空 URL 和外链返回空
     */
    public Optional<String> fromLegacyUrl(final String legacyUrl) {
        if (StrUtil.isBlank(legacyUrl) || StrUtil.startWithAny(legacyUrl, "http://", "https://")) {
            return Optional.empty();
        }

        String normalized = StrUtil.removeSuffix(legacyUrl.trim(), INDEX_SUFFIX);
        normalized = StrUtil.strip(normalized, "/");
        if (StrUtil.isBlank(normalized)) {
            return Optional.empty();
        }
        return Optional.of(normalized.replace('/', '.'));
    }
}
