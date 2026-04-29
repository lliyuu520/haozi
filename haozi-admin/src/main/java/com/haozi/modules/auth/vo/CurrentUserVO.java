package com.haozi.modules.auth.vo;

import java.io.Serializable;
import java.util.List;

/**
 * 当前登录用户上下文。
 *
 * <p>React 前端启动时通过该对象恢复用户、菜单和按钮权限。routeCodes 用于过滤
 * 前端 route manifest，permissions 用于按钮展示和接口权限兜底。</p>
 *
 * @param id 用户 ID
 * @param username 用户名
 * @param realName 真实姓名
 * @param avatar 头像地址
 * @param roles 角色编码
 * @param routeCodes 可访问的前端路由编码
 * @param permissions 可使用的按钮和接口权限编码
 */
public record CurrentUserVO(
        Long id,
        String username,
        String realName,
        String avatar,
        List<String> roles,
        List<String> routeCodes,
        List<String> permissions
) implements Serializable {
}
