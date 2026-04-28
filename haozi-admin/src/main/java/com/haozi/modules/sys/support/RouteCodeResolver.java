package com.haozi.modules.sys.support;

import cn.hutool.core.util.StrUtil;
import lombok.experimental.UtilityClass;

import java.util.Map;
import java.util.Optional;

/**
 * 路由编码解析工具。
 *
 * <p>菜单 URL 当前直接保存 React 路由路径，该工具将 React path 转换为 route manifest 使用的稳定 route code。</p>
 */
@UtilityClass
public class RouteCodeResolver {

    private static final Map<String, String> ROUTE_CODE_BY_REACT_PATH = Map.ofEntries(
            Map.entry("/dashboard", "dashboard.home"),
            Map.entry("/system/users", "sys.user"),
            Map.entry("/system/roles", "sys.role"),
            Map.entry("/system/menus", "sys.menu"),
            Map.entry("/system/dicts", "sys.dict"),
            Map.entry("/system/configs", "sys.config"),
            Map.entry("/monitor/server", "monitor.server"),
            Map.entry("/monitor/cache", "monitor.cache")
    );

    /**
     * 从菜单 URL 解析 route code。
     *
     * @param menuUrl 菜单 URL，例如 /system/users
     * @return route code，例如 sys.user；空 URL 和外链返回空
     */
    public Optional<String> fromMenuUrl(final String menuUrl) {
        if (StrUtil.isBlank(menuUrl) || StrUtil.startWithAny(menuUrl, "http://", "https://")) {
            return Optional.empty();
        }

        return Optional.ofNullable(ROUTE_CODE_BY_REACT_PATH.get(menuUrl.trim()));
    }
}
