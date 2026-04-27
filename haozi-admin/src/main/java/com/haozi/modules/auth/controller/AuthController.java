package com.haozi.modules.auth.controller;

import cn.dev33.satoken.annotation.SaIgnore;
import com.haozi.modules.auth.vo.AuthorizationVO;
import com.haozi.modules.auth.vo.CurrentUserVO;
import com.haozi.modules.sys.dto.SysAccountLoginDTO;
import com.haozi.modules.sys.service.SysAuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * 新版认证接口。
 *
 * <p>该接口面向 React 前端，不再返回 Result 包装和前端可读 token。
 * 登录态仍由 Sa-Token 维护，前端通过 /auth/me 恢复当前用户上下文。</p>
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final SysAuthService sysAuthService;

    /**
     * 账号密码登录。
     *
     * @param loginDTO 登录请求
     * @return 当前用户上下文
     */
    @PostMapping("login")
    @SaIgnore
    public CurrentUserVO login(@RequestBody final SysAccountLoginDTO loginDTO) {
        sysAuthService.loginByAccount(loginDTO);
        return sysAuthService.getCurrentUser();
    }

    /**
     * 获取当前登录用户上下文。
     *
     * @return 当前登录用户上下文
     */
    @GetMapping("me")
    public CurrentUserVO me() {
        return sysAuthService.getCurrentUser();
    }

    /**
     * 获取当前用户授权资源。
     *
     * @return 当前用户授权资源
     */
    @GetMapping("authorizations")
    public AuthorizationVO authorizations() {
        return sysAuthService.getAuthorizations();
    }

    /**
     * 退出登录。
     */
    @PostMapping("logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout() {
        sysAuthService.logout();
    }
}
