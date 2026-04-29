package com.haozi.modules.auth.vo;

import java.io.Serializable;
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
public record AuthorizationVO(
        List<String> routeCodes,
        List<String> permissions
) implements Serializable {
}
